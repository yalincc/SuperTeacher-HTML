/**
 * SuperTeacher 格式检查工具
 * 用法: node scripts/check-format.mjs [--fix]
 *
 * 检查三类问题：
 * 1. LaTeX 转义问题（JSON 中反斜杠数量错误）
 * 2. renderInline 遗漏（前端组件未正确渲染 LaTeX）
 * 3. JSON 内容问题（常见数据格式错误）
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC_DIR = join(__dirname, '..', 'src')
const COURSES_DIR = join(SRC_DIR, 'data', 'courses')

const args = process.argv.slice(2)
const autoFix = args.includes('--fix')

let totalIssues = 0
let totalFixed = 0

console.log('🔍 SuperTeacher 格式检查工具\n')

// ===== 1. 检查 LaTeX 转义问题 =====

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1️⃣  LaTeX 转义检查')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const LATEX_COMMANDS = [
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
  'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho',
  'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
  'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho',
  'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
  'text', 'frac', 'sqrt', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'log', 'ln', 'lim', 'max', 'min', 'sum', 'prod', 'int', 'partial', 'nabla', 'infty',
  'circ', 'cdot', 'cdots', 'times', 'sim', 'approx', 'leq', 'geq', 'neq',
  'pm', 'mp', 'div', 'quad', 'qquad',
  'rightarrow', 'leftarrow', 'Rightarrow', 'Leftarrow', 'leftrightarrow',
  'xrightarrow', 'xleftarrow', 'uparrow', 'downarrow',
  'mathrm', 'mathbf', 'mathit', 'mathbb', 'operatorname',
  'Omega', 'overrightarrow', 'boldsymbol'
]

function checkLatexEscaping(content, filePath) {
  const issues = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const cmd of LATEX_COMMANDS) {
      const regex = new RegExp(`(?<!\\\\)\\\\${cmd}(?![a-zA-Z])`, 'g')
      if (regex.test(line)) {
        issues.push({
          file: filePath,
          line: i + 1,
          message: `\\${cmd} 应为 \\\\${cmd}`,
          fix: { from: `\\${cmd}`, to: `\\\\${cmd}` }
        })
      }
    }
    // 检查 \%
    const percentRegex = /(?<!\\)\\%(?!["\s])/
    if (percentRegex.test(line)) {
      issues.push({
        file: filePath,
        line: i + 1,
        message: `\\% 应为 \\\\%`,
        fix: { from: `\\%`, to: `\\\\%` }
      })
    }
  }
  return issues
}

function fixLatexEscaping(content) {
  for (const cmd of LATEX_COMMANDS) {
    const regex = new RegExp(`(?<!\\\\)\\\\${cmd}(?![a-zA-Z])`, 'g')
    content = content.replace(regex, `\\\\${cmd}`)
  }
  content = content.replace(/(?<!\\)\\%/g, '\\\\%')
  return content
}

// 检查所有 JSON 文件
const courseDirs = readdirSync(COURSES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

for (const course of courseDirs) {
  const courseDir = join(COURSES_DIR, course)
  const files = readdirSync(courseDir).filter(f => f.endsWith('.json') && f.startsWith('lesson-'))

  for (const file of files) {
    const filePath = join(courseDir, file)
    let content = readFileSync(filePath, 'utf-8')

    const issues = checkLatexEscaping(content, `${course}/${file}`)
    if (issues.length > 0) {
      if (autoFix) {
        content = fixLatexEscaping(content)
        writeFileSync(filePath, content, 'utf-8')
        console.log(`  🔧 ${course}/${file} — 已修复 ${issues.length} 处`)
        totalFixed += issues.length
      } else {
        for (const issue of issues) {
          console.log(`  ❌ ${issue.file}:${issue.line} — ${issue.message}`)
        }
        totalIssues += issues.length
      }
    }
  }
}

if (totalIssues === 0 && totalFixed === 0) {
  console.log('  ✅ 所有 JSON 文件 LaTeX 转义正确')
}

// ===== 2. 检查 renderInline 遗漏 =====

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('2️⃣  renderInline 使用检查')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// 已知需要使用 renderInline 的组件
const RENDER_INLINE_COMPONENTS = [
  { file: 'SectionKnowledge.tsx', pattern: /section\.title(?!\s*\})/, desc: '知识分区标题' },
  { file: 'CalloutBlock.tsx', pattern: /block\.content(?!\s*\})/, desc: '提示框内容' },
  { file: 'ParagraphBlock.tsx', pattern: /block\.content(?!\s*\})/, desc: '段落内容' },
  { file: 'ListBlock.tsx', pattern: /item(?!\s*\})/, desc: '列表项' },
  { file: 'TableBlock.tsx', pattern: /cell(?!\s*\})/, desc: '表格单元格' },
]

// 扫描组件文件
const componentsDir = join(SRC_DIR, 'components')
function scanDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      scanDir(fullPath)
    } else if (entry.name.endsWith('.tsx')) {
      checkComponentFile(fullPath)
    }
  }
}

function checkComponentFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const fileName = basename(filePath)
  const relPath = filePath.replace(SRC_DIR + '\\', '').replace(/\\/g, '/')

  // 检查是否有未使用 renderInline 的文本渲染
  const hasRenderInline = content.includes('renderInline')

  if (!hasRenderInline) {
    // 检查是否有可能包含 LaTeX 的文本字段
    const textFields = ['content', 'title', 'stem', 'text', 'answer', 'analysis', 'question', 'referenceAnswer']
    for (const field of textFields) {
      // 检查 JSX 中直接渲染文本字段（没有 renderInline）
      const jsxPattern = new RegExp(`\\{[^}]*\\b${field}\\b[^}]*\\}`, 'g')
      const matches = content.match(jsxPattern)
      if (matches) {
        for (const match of matches) {
          if (!match.includes('renderInline') && !match.includes('className') && !match.includes('onClick')) {
            console.log(`  ⚠️  ${relPath} — 可能需要 renderInline 渲染 ${field}`)
            totalIssues++
          }
        }
      }
    }
  }
}

try {
  scanDir(componentsDir)
} catch (e) {
  console.log(`  ⚠️  组件扫描失败: ${e.message}`)
}

// ===== 3. 检查 JSON 内容问题 =====

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('3️⃣  JSON 内容检查')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

for (const course of courseDirs) {
  const courseDir = join(COURSES_DIR, course)
  const files = readdirSync(courseDir).filter(f => f.endsWith('.json') && f.startsWith('lesson-'))

  for (const file of files) {
    const filePath = join(courseDir, file)
    let data
    try {
      data = JSON.parse(readFileSync(filePath, 'utf-8'))
    } catch (e) {
      console.log(`  ❌ ${course}/${file} — JSON 解析失败: ${e.message}`)
      totalIssues++
      continue
    }

    const isExercises = file.includes('-exercises')
    const issues = []

    if (isExercises) {
      // 检查练习题
      if (data.exercises) {
        data.exercises.forEach((ex, i) => {
          // 检查空的文本字段
          const textFields = ['stem', 'analysis', 'question', 'referenceAnswer']
          for (const field of textFields) {
            if (ex[field] !== undefined && typeof ex[field] === 'string' && ex[field].trim() === '') {
              issues.push(`exercises[${i}].${field} 为空`)
            }
          }
          // 检查选项
          if (ex.options) {
            ex.options.forEach((opt, j) => {
              if (opt.text && opt.text.trim() === '') {
                issues.push(`exercises[${i}].options[${j}].text 为空`)
              }
            })
          }
        })
      }
    } else {
      // 检查知识点
      if (data.knowledge) {
        data.knowledge.forEach((sec, i) => {
          // 检查空的分区标题
          if (sec.title && sec.title.trim() === '') {
            issues.push(`knowledge[${i}].title 为空`)
          }
          // 检查空的内容块
          if (sec.blocks) {
            sec.blocks.forEach((block, j) => {
              if (block.content !== undefined && typeof block.content === 'string' && block.content.trim() === '') {
                issues.push(`knowledge[${i}].blocks[${j}].content 为空`)
              }
              if (block.latex !== undefined && typeof block.latex === 'string' && block.latex.trim() === '') {
                issues.push(`knowledge[${i}].blocks[${j}].latex 为空`)
              }
            })
          }
        })
      }

      // 检查例题
      if (data.examples) {
        data.examples.forEach((ex, i) => {
          if (ex.answer !== undefined && typeof ex.answer === 'string' && ex.answer.trim() === '') {
            issues.push(`examples[${i}].answer 为空`)
          }
        })
      }
    }

    if (issues.length > 0) {
      for (const issue of issues) {
        console.log(`  ⚠️  ${course}/${file} — ${issue}`)
      }
      totalIssues += issues.length
    }
  }
}

// ===== 总结 =====

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 检查结果')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

if (totalIssues === 0 && totalFixed === 0) {
  console.log('✅ 全部通过！没有发现问题')
} else {
  if (totalFixed > 0) {
    console.log(`🔧 已自动修复 ${totalFixed} 处问题`)
  }
  if (totalIssues > 0) {
    console.log(`❌ 发现 ${totalIssues} 个问题需要手动处理`)
    console.log('\n💡 提示: 运行 node scripts/check-format.mjs --fix 可自动修复 LaTeX 转义问题')
  }
}

process.exit(totalIssues > 0 ? 1 : 0)
