/**
 * SuperTeacher 课程 JSON 校验脚本
 * 用法: node scripts/validate-lesson.mjs [file]
 * 不传参数则校验 src/data/courses/ 下所有 lesson-*.json
 *
 * 支持两种文件格式：
 *   - 知识点文件: lesson-XX.json（含 meta/objectives/knowledge/examples/summary）
 *   - 练习题文件: lesson-XX-exercises.json（含 lessonId/exercises）
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const COURSES_DIR = join(__dirname, '..', 'src', 'data', 'courses')

const VALID_BLOCK_TYPES = ['paragraph', 'table', 'callout', 'equation', 'list', 'animation']
const VALID_EXERCISE_TYPES = ['choice', 'true_false', 'fill', 'short_answer']
const VALID_CALLOUT_VARIANTS = ['warning', 'tip', 'note', 'mnemonic']

// ===== 主流程 =====

const targetFile = process.argv[2]

let allFiles = []
try {
  const courseDirs = readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  for (const course of courseDirs) {
    const courseDir = join(COURSES_DIR, course)
    const files = readdirSync(courseDir).filter(f => f.endsWith('.json') && f.startsWith('lesson-'))
    allFiles.push(...files.map(f => join(courseDir, f)))
  }
} catch {
  // courses 目录不存在时忽略
}

const files = targetFile
  ? [join(process.cwd(), targetFile)]
  : allFiles

let totalErrors = 0

for (const file of files) {
  const name = basename(file)
  const errors = validateFile(file, name)
  if (errors.length === 0) {
    console.log(`  ✓ ${name}`)
  } else {
    console.log(`  ✗ ${name}:`)
    for (const e of errors) console.log(`      ${e}`)
    totalErrors += errors.length
  }
}

console.log(totalErrors === 0
  ? `\n✅ 全部通过！共 ${files.length} 个文件`
  : `\n❌ 共 ${totalErrors} 个错误`)
process.exit(totalErrors > 0 ? 1 : 0)

// ===== 校验逻辑 =====

function validateFile(file, name) {
  const errors = []
  let data
  try {
    data = JSON.parse(readFileSync(file, 'utf-8'))
  } catch (e) {
    return [`JSON 语法错误: ${e.message}`]
  }

  // 判断文件类型
  const isExercises = name.includes('-exercises')

  if (isExercises) {
    return validateExerciseFile(data)
  } else {
    return validateKnowledgeFile(data)
  }
}

// ===== 练习题文件校验 =====

function validateExerciseFile(data) {
  const errors = []

  if (typeof data.lessonId !== 'number' || data.lessonId < 0) {
    errors.push('lessonId 应为非负整数')
  }
  if (!Array.isArray(data.exercises)) {
    errors.push('exercises 应为数组')
    return errors
  }

  const ids = new Set()
  data.exercises.forEach((ex, i) => {
    validateExercise(ex, `exercises[${i}]`, errors)
    if (ex.id) {
      if (ids.has(ex.id)) errors.push(`exercises[${i}].id "${ex.id}" 重复`)
      ids.add(ex.id)
    }
  })

  return errors
}

// ===== 知识点文件校验 =====

function validateKnowledgeFile(data) {
  const errors = []

  // 顶层字段
  for (const key of ['meta', 'objectives', 'knowledge', 'examples', 'summary']) {
    if (!(key in data)) errors.push(`缺少顶层字段: ${key}`)
  }
  if (errors.length > 0) return errors

  // meta
  validateMeta(data.meta, errors)

  // objectives
  if (!Array.isArray(data.objectives)) {
    errors.push('objectives 应为数组')
  } else {
    data.objectives.forEach((obj, i) => {
      if (typeof obj.text !== 'string') errors.push(`objectives[${i}].text 应为字符串`)
      if (typeof obj.isKeyPoint !== 'boolean') errors.push(`objectives[${i}].isKeyPoint 应为布尔值`)
    })
  }

  // knowledge
  if (!Array.isArray(data.knowledge)) {
    errors.push('knowledge 应为数组')
  } else {
    data.knowledge.forEach((sec, i) => {
      if (typeof sec.title !== 'string') errors.push(`knowledge[${i}].title 应为字符串`)
      if (typeof sec.defaultExpanded !== 'boolean') errors.push(`knowledge[${i}].defaultExpanded 应为布尔值`)
      if (!Array.isArray(sec.blocks)) {
        errors.push(`knowledge[${i}].blocks 应为数组`)
      } else {
        sec.blocks.forEach((block, j) => validateBlock(block, `knowledge[${i}].blocks[${j}]`, errors))
      }
    })
  }

  // examples
  if (!Array.isArray(data.examples)) {
    errors.push('examples 应为数组')
  } else {
    data.examples.forEach((ex, i) => {
      if (typeof ex.title !== 'string') errors.push(`examples[${i}].title 应为字符串`)
      if (!Array.isArray(ex.problem)) errors.push(`examples[${i}].problem 应为数组`)
      if (!Array.isArray(ex.solution)) errors.push(`examples[${i}].solution 应为数组`)
      if (typeof ex.answer !== 'string') errors.push(`examples[${i}].answer 应为字符串`)
    })
  }

  // exercises（旧格式内嵌，可选）
  if (data.exercises !== undefined) {
    if (!Array.isArray(data.exercises)) {
      errors.push('exercises 应为数组')
    } else {
      const ids = new Set()
      data.exercises.forEach((ex, i) => {
        validateExercise(ex, `exercises[${i}]`, errors)
        if (ex.id) {
          if (ids.has(ex.id)) errors.push(`exercises[${i}].id "${ex.id}" 重复`)
          ids.add(ex.id)
        }
      })
    }
  }

  // summary
  if (!Array.isArray(data.summary)) {
    errors.push('summary 应为数组')
  } else {
    data.summary.forEach((node, i) => validateSummaryNode(node, `summary[${i}]`, errors))
  }

  return errors
}

// ===== 通用校验函数 =====

function validateMeta(meta, errors) {
  if (typeof meta.id !== 'number' || meta.id < 0) errors.push('meta.id 应为非负整数')
  if (typeof meta.slug !== 'string' || !meta.slug) errors.push('meta.slug 应为非空字符串')
  if (typeof meta.title !== 'string' || !meta.title) errors.push('meta.title 应为非空字符串')
  if (typeof meta.unit !== 'string' || !meta.unit) errors.push('meta.unit 应为非空字符串')
  if (typeof meta.week !== 'number' || meta.week < 1) errors.push('meta.week 应为正整数')
  if (typeof meta.day !== 'number' || meta.day < 0) errors.push('meta.day 应为非负整数')
}

function validateBlock(block, path, errors) {
  if (!VALID_BLOCK_TYPES.includes(block.type)) {
    errors.push(`${path}.type "${block.type}" 不合法，应为 ${VALID_BLOCK_TYPES.join('/')}`)
    return
  }
  switch (block.type) {
    case 'paragraph':
      if (typeof block.content !== 'string') errors.push(`${path}.content 应为字符串`)
      break
    case 'table':
      if (!Array.isArray(block.headers)) errors.push(`${path}.headers 应为数组`)
      if (!Array.isArray(block.rows)) errors.push(`${path}.rows 应为数组`)
      break
    case 'callout':
      if (!VALID_CALLOUT_VARIANTS.includes(block.variant))
        errors.push(`${path}.variant "${block.variant}" 不合法，应为 ${VALID_CALLOUT_VARIANTS.join('/')}`)
      if (typeof block.title !== 'string') errors.push(`${path}.title 应为字符串`)
      if (typeof block.content !== 'string') errors.push(`${path}.content 应为字符串`)
      break
    case 'equation':
      if (typeof block.latex !== 'string') errors.push(`${path}.latex 应为字符串`)
      if (typeof block.display !== 'boolean') errors.push(`${path}.display 应为布尔值`)
      break
    case 'list':
      if (typeof block.ordered !== 'boolean') errors.push(`${path}.ordered 应为布尔值`)
      if (!Array.isArray(block.items)) errors.push(`${path}.items 应为数组`)
      break
    case 'animation':
      if (typeof block.src !== 'string') errors.push(`${path}.src 应为字符串`)
      break
  }
}

function validateExercise(ex, path, errors) {
  if (!VALID_EXERCISE_TYPES.includes(ex.type)) {
    errors.push(`${path}.type "${ex.type}" 不合法，应为 ${VALID_EXERCISE_TYPES.join('/')}`)
    return
  }
  if (typeof ex.id !== 'string') errors.push(`${path}.id 应为字符串`)

  switch (ex.type) {
    case 'choice':
      if (typeof ex.stem !== 'string') errors.push(`${path}.stem 应为字符串`)
      if (!Array.isArray(ex.options)) errors.push(`${path}.options 应为数组`)
      else ex.options.forEach((opt, j) => {
        if (typeof opt.label !== 'string') errors.push(`${path}.options[${j}].label 应为字符串`)
        if (typeof opt.text !== 'string') errors.push(`${path}.options[${j}].text 应为字符串`)
      })
      if (typeof ex.answer !== 'string') errors.push(`${path}.answer 应为字符串`)
      if (typeof ex.analysis !== 'string') errors.push(`${path}.analysis 应为字符串`)
      break
    case 'true_false':
      if (typeof ex.stem !== 'string') errors.push(`${path}.stem 应为字符串`)
      if (typeof ex.answer !== 'boolean') errors.push(`${path}.answer 应为布尔值`)
      if (typeof ex.analysis !== 'string') errors.push(`${path}.analysis 应为字符串`)
      break
    case 'fill':
      if (!Array.isArray(ex.segments)) errors.push(`${path}.segments 应为数组`)
      if (!Array.isArray(ex.blanks)) errors.push(`${path}.blanks 应为数组`)
      else ex.blanks.forEach((b, j) => {
        if (typeof b.index !== 'number') errors.push(`${path}.blanks[${j}].index 应为数字`)
        if (typeof b.answer !== 'string') errors.push(`${path}.blanks[${j}].answer 应为字符串`)
      })
      if (typeof ex.analysis !== 'string') errors.push(`${path}.analysis 应为字符串`)
      break
    case 'short_answer':
      if (typeof ex.question !== 'string') errors.push(`${path}.question 应为字符串`)
      if (typeof ex.referenceAnswer !== 'string') errors.push(`${path}.referenceAnswer 应为字符串`)
      break
  }
}

function validateSummaryNode(node, path, errors) {
  if (typeof node.text !== 'string' || !node.text) errors.push(`${path}.text 应为非空字符串`)
  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      errors.push(`${path}.children 应为数组`)
    } else {
      node.children.forEach((child, i) => validateSummaryNode(child, `${path}.children[${i}]`, errors))
    }
  }
}
