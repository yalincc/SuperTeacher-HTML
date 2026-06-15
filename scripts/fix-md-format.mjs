/**
 * MD 格式修正脚本 v4 — 最终版
 * 
 * 功能：
 *   1. \text{中文/化学式} → 纯文本（KaTeX 无 \text 扩展）
 *      保留 \text{ 单位}（如 \text{ g}、\text{ kg}）、\text{\_\_\_}（填空下划线）
 *   2. > callout 内公式 → 提取完整方程式到独立 $$ 块
 *   3. 方程式行 内联 → 独立 $$ 块（前后文无中文或仅单侧有标签）
 *   4. 引用句 → 保持内联（前后文 BOTH 有中文）
 * 用法: node scripts/fix-md-format.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(__dirname, '..', 'docs', 'curriculum')

const TARGET = [
  'lesson-02-空气与氧气性质.md', 'lesson-03-氧气的制取.md',
  'lesson-04-分子原子.md', 'lesson-05-元素离子化学式.md',
  'lesson-06-水与化合价.md', 'lesson-07-质量守恒定律.md',
  'lesson-08-化学方程式.md', 'lesson-09-碳和碳的氧化物.md',
  'lesson-10-燃料及其利用.md',
]

// ===== 工具 =====
const hasChinese = (s) => /[\u4e00-\u9fff]/.test(s)
const countChinese = (s) => (s.match(/[\u4e00-\u9fff]/g) || []).length
const EQ_LABEL_RE = /^(化学)?方程式[：:]\s*$/

// ===== 规则 =====

/** 规则0: 智能去除 \text{} 包裹 */
function fixTextWrap(content) {
  return content.replace(/\\text\{([^}]*)\}/g, (match, inner) => {
    if (hasChinese(inner)) return inner           // \text{点燃} → 点燃
    if (/\s/.test(inner) || /\\/.test(inner)) return match  // \text{ g}、\text{\_\_\_} 保留
    return inner                                    // \text{MnO₂} → MnO₂
  })
}

/** 规则1-3: 内联公式 → 独立块 / 保持内联 */
function fixInlineFormulas(lines) {
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*\$\$/.test(line)) { out.push(line); continue }

    // 匹配 $...$\xrightarrow{...}...$（一次一个）
    const re = /\$([^$]*\\xrightarrow\{[^}]*\}[^$]*)\$/
    const m = re.exec(line)
    if (!m) { out.push(line); continue }

    const prefix = line.substring(0, m.index)
    const formula = m[1]
    const suffix = line.substring(m.index + m[0].length)

    // --- 规则1: > callout ---
    if (line.trim().startsWith('>')) {
      const inner = line.replace(/^>\s*/, '')
      const colon = inner.indexOf('：')
      if (colon > 0) {
        const label = inner.substring(0, colon + 1)
        const eq = (prefix.replace(/^>\s*/, '').substring(colon + 1)
          + formula + suffix).replace(/\$/g, '').trim()
        const cleanLabel = label.replace(/[：:]\s*$/, '').trim()
        if (cleanLabel) out.push(`> ${cleanLabel}：`)
        out.push('', `$$${eq}$$`, '')
      } else {
        out.push(`$$${inner.replace(/\$/g, '')}$$`)
      }
      continue
    }

    // --- 规则2 vs 3: 判定方程式行 or 引用句 ---
    const prefHasCN = hasChinese(prefix)
    const suffHasCN = hasChinese(suffix)
    if (prefHasCN && suffHasCN) {
      out.push(line)  // 规则3: 前后都有中文 → 引用句 → 保持内联
      continue
    }

    // --- 规则2: 方程式行 → 独立 $$ ---
    // 特殊处理：含 "方程式：" 标签的行 → 标签独立一行，公式独立一行
    const fullLine = prefix + formula + suffix
    const eqLabelMatch = fullLine.match(/^([-*>\s]*)(化学)?方程式[：:]/)
    if (eqLabelMatch) {
      const listPrefix = eqLabelMatch[1]  // 如 "- " 或 ""
      const eqContent = fullLine.substring(eqLabelMatch[0].length).replace(/\$/g, '').trim()
      if (listPrefix.trim()) {
        out.push(`${listPrefix}方程式：`)
      }
      out.push('')
      out.push(`$$${eqContent}$$`)
      out.push('')
      continue
    }

    let eqPrefix = prefix.trim()
    let eqSuffix = suffix.trim()
    if (EQ_LABEL_RE.test(eqPrefix)) eqPrefix = ''

    const parts = [eqPrefix, formula.trim(), eqSuffix].filter(Boolean)
    const eq = parts.join(' ').replace(/\$/g, '').trim()
    out.push(`$$${eq}$$`)
  }

  return out
}

// ===== 主流程 =====

function main() {
  console.log('🔧 MD 格式修正 v4\n')
  let n = 0

  for (const fn of TARGET) {
    const fp = join(CONTENT_DIR, fn)
    let c
    try { c = readFileSync(fp, 'utf-8') }
    catch { console.log(`  ⚠️  ${fn}`); continue }

    const orig = c
    c = fixTextWrap(c)
    c = fixInlineFormulas(c.split('\n')).join('\n')

    if (c !== orig) { writeFileSync(fp, c, 'utf-8'); console.log(`  ✅ ${fn}`); n++ }
    else { console.log(`  ⏭️  ${fn}`) }
  }

  console.log(`\n🎉 完成！共修正 ${n} 个文件`)
  console.log('👉 下一步: npm run convert')
}

main()
