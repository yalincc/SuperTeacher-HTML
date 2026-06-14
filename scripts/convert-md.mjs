/**
 * SuperTeacher MD → JSON 转换脚本
 * 用法: node scripts/convert-md.mjs
 *
 * 读取 course.json + docs/curriculum/*.md → 生成 src/data/lessons/*.json + src/data/index.ts
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ===== 主流程 =====

function main() {
  const course = JSON.parse(readFileSync(join(ROOT, 'course.json'), 'utf-8'))
  const contentDir = join(ROOT, course.paths.contentDir)
  const outputDir = join(ROOT, course.paths.outputDir)

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

  const lessonFiles = readdirSync(contentDir).filter((f) => f.endsWith('.md'))
  const converted = []

  for (const file of lessonFiles) {
    const md = readFileSync(join(contentDir, file), 'utf-8')
    const meta = course.lessons.find((l) => l.file === file)
    if (!meta) {
      console.warn(`  ⚠️ 跳过 ${file}（course.json 中未配置）`)
      continue
    }

    console.log(`  📄 转换 ${file} ...`)
    const sections = splitSections(md)
    const lesson = {
      meta: {
        id: meta.id,
        slug: `lesson-${String(meta.id).padStart(2, '0')}-${meta.title}`,
        title: meta.title,
        unit: meta.unit,
        week: meta.week,
        day: meta.day,
      },
      objectives: parseObjectives(sections.objectives),
      knowledge: parseKnowledge(sections.knowledge),
      examples: parseExamples(sections.examples),
      exercises: parseExercises(sections.exercises, meta.id),
      summary: parseSummary(sections.summary),
    }

    const outFile = join(outputDir, `lesson-${String(meta.id).padStart(2, '0')}.json`)
    writeFileSync(outFile, JSON.stringify(lesson, null, 2), 'utf-8')
    converted.push({ id: meta.id, file: outFile })
  }

  // 生成 index.ts
  const imports = converted.map((c) => `import lesson${c.id} from './lessons/lesson-${String(c.id).padStart(2, '0')}.json'`).join('\n')
  const indexArr = converted.map((c) => `  lesson${c.id} as LessonData`).join(',\n')
  const indexTs = `import type { LessonData } from '../types'\n\n${imports}\n\nexport const lessonIndex: LessonData[] = [\n${indexArr},\n]\n\nexport function getLessonById(id: number): LessonData | undefined {\n  return lessonIndex.find((l) => l.meta.id === id)\n}\n`
  writeFileSync(join(ROOT, 'src', 'data', 'index.ts'), indexTs, 'utf-8')

  console.log(`\n✅ 转换完成！共 ${converted.length} 个课时`)
}

// ===== 区块分割 =====

function splitSections(md) {
  const lines = md.split('\n')
  const sections = { objectives: '', knowledge: '', examples: '', exercises: '', summary: '' }
  const markers = [
    { pattern: /^## 一、/, key: 'objectives' },
    { pattern: /^## 二、/, key: 'knowledge' },
    { pattern: /^## 三、/, key: 'examples' },
    { pattern: /^## 四、/, key: 'exercises' },
    { pattern: /^## 五、/, key: 'summary' },
  ]

  let currentKey = null
  let buffer = []

  for (const line of lines) {
    const marker = markers.find((m) => m.pattern.test(line))
    if (marker) {
      if (currentKey) sections[currentKey] = buffer.join('\n')
      currentKey = marker.key
      buffer = []
    } else if (currentKey) {
      buffer.push(line)
    }
  }
  if (currentKey) sections[currentKey] = buffer.join('\n')

  return sections
}

// ===== 一、学习目标 =====

function parseObjectives(text) {
  const lines = text.trim().split('\n').filter((l) => l.trim().startsWith('-'))
  return lines.map((line) => {
    const trimmed = line.trim().replace(/^-\s*/, '')
    const isKeyPoint = trimmed.startsWith('★')
    return {
      text: isKeyPoint ? trimmed.slice(1) : trimmed,
      isKeyPoint,
    }
  })
}

// ===== 二、知识点梳理 =====

function parseKnowledge(text) {
  const sections = []
  let currentTitle = ''
  let currentExpanded = true
  let buffer = []

  const lines = text.split('\n')
  for (const line of lines) {
    const h3Match = line.match(/^###\s+(.+)/)
    if (h3Match) {
      if (currentTitle && buffer.length > 0) {
        sections.push({
          title: currentTitle,
          defaultExpanded: currentExpanded,
          blocks: parseContentBlocks(buffer.join('\n')),
        })
      }
      currentTitle = h3Match[1].trim()
      currentExpanded = true // default
      buffer = []
    } else if (currentTitle) {
      buffer.push(line)
    }
  }

  if (currentTitle && buffer.length > 0) {
    sections.push({
      title: currentTitle,
      defaultExpanded: currentExpanded,
      blocks: parseContentBlocks(buffer.join('\n')),
    })
  }

  return sections
}

// ===== 内容块解析（通用） =====

function parseContentBlocks(text) {
  const blocks = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 空行跳过
    if (line.trim() === '') { i++; continue }

    // $$ 公式（独立行）
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
      const latex = line.trim().slice(2, -2).trim()
      blocks.push({ type: 'equation', latex, display: true })
      i++
      continue
    }

    // 多行 $$ ... $$
    if (line.trim().startsWith('$$') && !line.trim().endsWith('$$')) {
      let latex = line.trim().slice(2)
      i++
      while (i < lines.length && !lines[i].trim().endsWith('$$')) {
        latex += '\n' + lines[i]
        i++
      }
      if (i < lines.length) {
        latex += '\n' + lines[i].trim().slice(0, -2)
      }
      blocks.push({ type: 'equation', latex: latex.trim(), display: true })
      i++
      continue
    }

    // 表格
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s-:|]+\|$/)) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      blocks.push(parseTable(tableLines))
      continue
    }

    // 提示框（blockquote）
    if (line.trim().startsWith('>')) {
      const callout = parseCallout(line.trim())
      blocks.push(callout)
      i++
      continue
    }

    // 无序列表
    if (line.trim().match(/^[-*]\s/)) {
      const items = []
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    // 有序列表
    if (line.trim().match(/^\d+\.\s/)) {
      const items = []
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    // A/B/C/D 选项（例题中的选项列表）
    if (line.trim().match(/^[A-D]\.\s/)) {
      const items = []
      while (i < lines.length && lines[i].trim().match(/^[A-D]\.\s/)) {
        items.push(lines[i].trim())
        i++
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    // 段落（收集连续非空行）
    let para = ''
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('|') &&
           !lines[i].trim().startsWith('>') && !lines[i].trim().startsWith('$$') &&
           !lines[i].trim().match(/^[-*]\s/) && !lines[i].trim().match(/^\d+\.\s/) &&
           !lines[i].trim().match(/^[A-D]\.\s/) &&
           !lines[i].trim().startsWith('###')) {
      para += (para ? '' : '') + lines[i].trim()
      i++
    }
    if (para) {
      blocks.push({ type: 'paragraph', content: para })
    }
  }

  return blocks
}

// ===== 表格解析 =====

function parseTable(lines) {
  const parseCells = (line) => line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map((c) => c.trim())

  const headers = parseCells(lines[0])
  // lines[1] is the separator row
  const rows = lines.slice(2).map(parseCells)

  return { type: 'table', headers, rows }
}

// ===== 提示框解析 =====

function parseCallout(line) {
  const text = line.replace(/^>\s*/, '')
  // Detect variant by emoji/keyword prefix
  if (text.startsWith('⚠️') || text.includes('易错提醒')) {
    return { type: 'callout', variant: 'warning', title: extractTitle(text, '易错提醒'), content: extractContent(text, '易错提醒') }
  }
  if (text.startsWith('💡') || text.includes('解题技巧')) {
    return { type: 'callout', variant: 'tip', title: extractTitle(text, '解题技巧'), content: extractContent(text, '解题技巧') }
  }
  if (text.includes('记忆口诀')) {
    return { type: 'callout', variant: 'mnemonic', title: extractTitle(text, '记忆口诀'), content: extractContent(text, '记忆口诀') }
  }
  // Default note
  const colonIdx = text.indexOf('：')
  if (colonIdx > 0 && colonIdx < 10) {
    return { type: 'callout', variant: 'note', title: text.slice(0, colonIdx).trim(), content: text.slice(colonIdx + 1).trim() }
  }
  return { type: 'callout', variant: 'note', title: '提示', content: text }
}

function extractTitle(text, keyword) {
  // Remove emoji prefixes
  const clean = text.replace(/^[⚠️💡📖📌]+\s*/, '')
  const idx = clean.indexOf('：')
  if (idx > 0 && idx < 15) return clean.slice(0, idx).trim()
  return keyword
}

function extractContent(text, keyword) {
  const clean = text.replace(/^[⚠️💡📖📌]+\s*/, '')
  const idx = clean.indexOf('：')
  if (idx > 0 && idx < 15) return clean.slice(idx + 1).trim()
  return clean
}

// ===== 三、典型例题 =====

function parseExamples(text) {
  const examples = []
  const blocks = splitByH3(text)

  for (const block of blocks) {
    const title = block.title
    const lines = block.lines
    const result = { title, problem: [], solution: [], answer: '' }

    // Find answer line
    let answerIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^\*\*答案\*\*/)) {
        answerIdx = i
        break
      }
    }

    // Problem = everything before **答案**
    if (answerIdx > 0) {
      result.problem = parseContentBlocks(lines.slice(0, answerIdx).join('\n'))
    } else {
      result.problem = parseContentBlocks(lines.join('\n'))
    }

    // Parse answer
    if (answerIdx >= 0) {
      const answerLine = lines[answerIdx]
      const answerMatch = answerLine.match(/\*\*答案\*\*[：:]\s*(.+)/)
      if (answerMatch) result.answer = answerMatch[1].trim()

      // Parse 解析 (everything after **解析**)
      const solutionLines = []
      for (let i = answerIdx + 1; i < lines.length; i++) {
        if (lines[i].match(/^\*\*解析\*\*/)) {
          const firstLine = lines[i].replace(/^\*\*解析\*\*[：:]\s*/, '')
          if (firstLine) solutionLines.push(firstLine)
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].match(/^\*\*来源\*\*/)) break
            solutionLines.push(lines[j])
          }
          break
        }
      }
      if (solutionLines.length > 0) {
        result.solution = parseContentBlocks(solutionLines.join('\n'))
      }

      // Parse 来源 (only add if exists)
      for (let i = answerIdx + 1; i < lines.length; i++) {
        const sourceMatch = lines[i].match(/^\*\*来源\*\*[：:]\s*(.+)/)
        if (sourceMatch) {
          result.source = sourceMatch[1].trim()
          break
        }
      }
    }

    examples.push(result)
  }

  return examples
}

// ===== 四、课后练习 =====

function parseExercises(text, lessonId) {
  const exercises = []

  // Split by ### subsection headers: ### 选择题, ### 判断题, ### 填空题, ### 简答题
  const typeMap = {
    '选择题': 'choice',
    '判断题': 'true_false',
    '填空题': 'fill',
    '简答题': 'short_answer',
  }

  let currentType = 'choice' // default
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const h3Match = lines[i].match(/^###\s+(.+)/)
    if (h3Match) {
      const typeName = h3Match[1].trim()
      if (typeMap[typeName]) currentType = typeMap[typeName]
      i++
      continue
    }

    // Detect numbered exercise
    const numMatch = lines[i].match(/^(\d+)\.\s+(.*)/)
    if (numMatch) {
      const ex = parseOneExercise(currentType, lines, i, numMatch[1])
      if (ex) {
        exercises.push(ex.exercise)
        i = ex.nextLine
        continue
      }
    }

    i++
  }

  // Assign ids with lesson prefix
  let globalIdx = 1
  for (const ex of exercises) {
    ex.id = `ex-${lessonId}-${globalIdx}`
    globalIdx++
  }

  return exercises
}

function parseOneExercise(type, lines, startLine, num) {
  const exerciseLines = []
  let i = startLine

  // Collect all lines belonging to this exercise (until next numbered item or ### or EOF)
  exerciseLines.push(lines[i].replace(/^\d+\.\s+/, '').trim())
  i++
  while (i < lines.length) {
    const line = lines[i]
    if (line.match(/^\d+\.\s/) || line.match(/^###\s/)) break
    exerciseLines.push(line.trim())
    i++
  }

  // Remove empty trailing lines
  while (exerciseLines.length > 0 && exerciseLines[exerciseLines.length - 1] === '') {
    exerciseLines.pop()
  }

  if (type === 'choice') return { exercise: parseChoiceExercise(exerciseLines), nextLine: i }
  if (type === 'true_false') return { exercise: parseTrueFalseExercise(exerciseLines), nextLine: i }
  if (type === 'fill') return { exercise: parseFillExercise(exerciseLines), nextLine: i }
  if (type === 'short_answer') return { exercise: parseShortAnswerExercise(exerciseLines), nextLine: i }

  return null
}

function parseChoiceExercise(lines) {
  // Stem = first line(s) before options
  const options = []
  let stemEnd = 0

  for (let i = 0; i < lines.length; i++) {
    const optMatch = lines[i].match(/^([A-D])\.\s+(.+)/)
    if (optMatch) {
      if (stemEnd === 0) stemEnd = i
      options.push({ label: optMatch[1], text: optMatch[2].trim() })
    }
  }

  const stem = lines.slice(0, stemEnd).join('').trim()
  let answer = ''
  let analysis = ''
  let source = ''

  for (const line of lines) {
    const ansMatch = line.match(/^\*\*答案\*\*[：:]\s*(.+)/)
    if (ansMatch) answer = ansMatch[1].trim()
    const anaMatch = line.match(/^\*\*解析\*\*[：:]\s*(.+)/)
    if (anaMatch) analysis = anaMatch[1].trim()
    const srcMatch = line.match(/^\*\*来源\*\*[：:]\s*(.+)/)
    if (srcMatch) source = srcMatch[1].trim()
  }

  const ex = { type: 'choice', id: '', stem, options, answer, analysis }
  if (source) ex.source = source
  return ex
}

function parseTrueFalseExercise(lines) {
  const stem = lines[0].trim()
  let answer = false
  let analysis = ''

  for (const line of lines) {
    const ansMatch = line.match(/^\*\*答案\*\*[：:]\s*(.+)/)
    if (ansMatch) {
      const val = ansMatch[1].trim()
      answer = val === '对' || val === '正确' || val === 'true'
    }
    const anaMatch = line.match(/^\*\*解析\*\*[：:]\s*(.+)/)
    if (anaMatch) analysis = anaMatch[1].trim()
  }

  return { type: 'true_false', id: '', stem, answer, analysis }
}

function parseFillExercise(lines) {
  // First line(s) = segments with ___ blanks
  let stemLine = ''
  let answerLine = ''
  let altLine = ''
  let analysis = ''

  for (const line of lines) {
    if (line.match(/^\*\*答案\*\*/)) { answerLine = line; continue }
    if (line.match(/^\*\*备选\*\*/)) { altLine = line; continue }
    if (line.match(/^\*\*解析\*\*/)) {
      const anaMatch = line.match(/^\*\*解析\*\*[：:]\s*(.+)/)
      if (anaMatch) analysis = anaMatch[1].trim()
      continue
    }
    if (!line.startsWith('**')) {
      stemLine += line
    }
  }

  // Parse segments: split by ___ pattern
  const segments = []
  const parts = stemLine.split(/(___+|`___`)/)
  let blankIdx = 0
  for (const part of parts) {
    if (part === '' || part === undefined) continue
    if (part.match(/^_+$/) || part === '`___`') {
      blankIdx++
      segments.push(`___${blankIdx}___`)
    } else {
      segments.push(part.trim())
    }
  }

  // Parse answers
  const answers = parseCSV(answerLine.replace(/^\*\*答案\*\*[：:]\s*/, ''))

  // Parse alternatives
  const alternatives = []
  if (altLine) {
    const altText = altLine.replace(/^\*\*备选\*\*[：:]\s*/, '')
    const altParts = parseCSV(altText)
    for (const alt of altParts) {
      alternatives.push(alt.split('|').map((s) => s.trim()))
    }
  }

  const blanks = answers.map((ans, idx) => {
    const blank = { index: idx + 1, answer: ans.trim() }
    if (alternatives[idx] && alternatives[idx].length > 1) {
      blank.alternatives = alternatives[idx]
    }
    return blank
  })

  return { type: 'fill', id: '', segments, blanks, analysis }
}

function parseShortAnswerExercise(lines) {
  const question = lines[0].trim()
  let referenceAnswer = ''
  let scoringPoints = []

  for (const line of lines) {
    const refMatch = line.match(/^\*\*参考答案\*\*[：:]\s*(.+)/)
    if (refMatch) referenceAnswer = refMatch[1].trim()
    const spMatch = line.match(/^\*\*得分要点\*\*[：:]\s*(.+)/)
    if (spMatch) {
      scoringPoints = spMatch[1].split(/[；;]/).map((s) => s.trim()).filter(Boolean)
    }
  }

  const ex = { type: 'short_answer', id: '', question, referenceAnswer }
  if (scoringPoints.length > 0) ex.scoringPoints = scoringPoints
  return ex
}

// ===== 五、本课小结 =====

function parseSummary(text) {
  const raw = text.trim().split('\n').filter((l) => l.trim().startsWith('-'))
  // Normalize: strip \r, get indent level and text
  const lines = raw.map((l) => {
    const stripped = l.replace(/\r$/, '')
    const indent = stripped.match(/^(\s*)/)[1].length
    const content = stripped.replace(/^\s*-\s+/, '').replace(/\r$/, '')
    return { indent, text: content }
  })
  return buildSummaryTree(lines, 0, lines[0]?.indent || 0).nodes
}

function buildSummaryTree(lines, startIdx, baseIndent) {
  const nodes = []
  let i = startIdx

  while (i < lines.length) {
    const line = lines[i]
    // If indent is less than base, this belongs to parent
    if (line.indent < baseIndent) break
    // If indent equals base, create a node
    if (line.indent === baseIndent) {
      const node = { text: line.text }
      // Check if next line is deeper (child)
      if (i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
        const childResult = buildSummaryTree(lines, i + 1, lines[i + 1].indent)
        if (childResult.nodes.length > 0) {
          node.children = childResult.nodes
        }
        i = childResult.nextIdx
      } else {
        i++
      }
      nodes.push(node)
    } else {
      // indent > baseIndent but shouldn't happen here
      i++
    }
  }

  return { nodes, nextIdx: i }
}

// ===== 工具函数 =====

function splitByH3(text) {
  const blocks = []
  const lines = text.split('\n')
  let currentTitle = ''
  let buffer = []

  for (const line of lines) {
    const match = line.match(/^###\s+(.+)/)
    if (match) {
      if (currentTitle) blocks.push({ title: currentTitle, lines: buffer })
      currentTitle = match[1].trim()
      buffer = []
    } else if (currentTitle) {
      buffer.push(line)
    }
  }
  if (currentTitle) blocks.push({ title: currentTitle, lines: buffer })

  return blocks
}

function parseCSV(text) {
  // Split by comma, but respect quoted strings
  return text.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

// ===== 执行 =====

console.log('🔄 SuperTeacher MD → JSON 转换开始...\n')
main()
