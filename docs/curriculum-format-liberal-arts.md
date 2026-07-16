# 文科课程内容规范

> 适用于历史、道德与法治、地理等文科课程。理科课程（数学、物理、化学）请参考 `curriculum-format.md`。

---

## 一、文件结构

每个课程目录包含：

```
courses/<course-id>/
├── course.json                  # 课程元数据
├── lesson-01.json               # 课时知识点
├── lesson-01-exercises.json     # 课时练习题
├── lesson-02.json
├── lesson-02-exercises.json
└── ...
```

### course.json 结构

```json
{
  "id": "history-7a",
  "course": {
    "name": "七年级上册",
    "icon": "📜",
    "subtitle": "人教版七年级上册（2024版）",
    "color": "#b45309"
  },
  "group": {
    "id": "history",
    "name": "初中历史",
    "icon": "📜",
    "color": "#b45309",
    "order": 4
  },
  "semester": {
    "name": "七年级上",
    "order": 1
  },
  "schedule": {
    "weeks": 6,
    "weekLabels": ["第一周", "第二周", "..."],
    "weekTitles": ["史前时期", "夏商周时期", "..."]
  },
  "lessons": [
    { "id": 1, "title": "远古时期的人类活动", "unit": "第一单元", "week": 1, "day": 1 }
  ],
  "features": {
    "katex": false,
    "formulaNormalize": false
  }
}
```

**字段说明**：
- `group` — 分组信息，同一学科的多个学期共享相同 group.id
- `semester` — 学期信息，order 控制学期排序
- `features.katex` — 文科课程设为 `false`（不使用公式渲染）

### lesson-XX.json 结构

```json
{
  "meta": {
    "id": 1,
    "slug": "lesson-01-远古时期的人类活动",
    "title": "远古时期的人类活动",
    "unit": "第一单元",
    "week": 1,
    "day": 1
  },
  "objectives": [...],
  "knowledge": [...],
  "examples": [...],
  "summary": [...]
}
```

### lesson-XX-exercises.json 结构

```json
{
  "lessonId": 1,
  "exercises": [...]
}
```

---

## 二、知识点模块

### 学习目标（objectives）

```json
"objectives": [
  { "text": "了解xxx", "isKeyPoint": false },
  { "text": "掌握xxx", "isKeyPoint": true },
  { "text": "理解xxx", "isKeyPoint": true }
]
```

- 3-6 个目标
- `isKeyPoint: true` 标记重点目标（会高亮显示）
- 目标动词层次：了解 < 掌握 < 理解

### 知识分区（knowledge）

每个分区包含标题和内容块数组：

```json
"knowledge": [
  {
    "title": "分区标题",
    "defaultExpanded": true,
    "blocks": [...]
  }
]
```

- 2-4 个知识分区
- 每个分区至少包含 1 个 callout 块
- `defaultExpanded: true` 默认展开

---

## 三、内容块类型

文科课程支持以下内容块：

### 3.1 paragraph — 正文段落

```json
{ "type": "paragraph", "content": "正文内容，支持 **加粗** 和 *斜体*" }
```

**使用场景**：历史事件叙述、人物介绍、背景说明

**格式规则**：
- `**文字**` → 加粗（用于关键人名、地名、事件名）
- `「**文字**」` → 加粗 + 引号（用于专有名词、政策名称）
- `*文字*` → 斜体（用于强调）

**示例**：
```json
{ "type": "paragraph", "content": "**公元前221年**，秦王嬴政完成统一，自称「**始皇帝**」，建立秦朝。" }
```

### 3.2 table — 对比表格

```json
{
  "type": "table",
  "headers": ["方面", "措施", "作用"],
  "rows": [
    ["政治", "推行郡县制", "加强中央集权"],
    ["经济", "统一度量衡", "促进经济交流"]
  ]
}
```

**使用场景**：
- 政策措施对比（政治/经济/文化/军事）
- 朝代特征对比
- 人物思想对比
- 原因/影响分析

**格式规则**：
- headers 2-5 列
- rows 每行与 headers 列数一致
- 单元格内容简洁，避免过长

### 3.3 callout — 提示框

```json
{
  "type": "callout",
  "variant": "warning",
  "title": "易错提醒",
  "content": "提示内容..."
}
```

**5 种 variant 及使用场景**：

| variant | 图标 | 颜色 | 使用场景 |
|---------|------|------|----------|
| `warning` | ⚠️ | 红色 | 易混淆的历史事件/人物、常见错误认知 |
| `tip` | 💡 | 绿色 | 理解要点、答题技巧、分析方法 |
| `note` | 📌 | 蓝色 | 补充背景信息、延伸知识 |
| `mnemonic` | 📖 | 紫色 | 记忆口诀、顺口溜 |
| `quote` | 📜 | 橙色 | 历史文献引用、名人名言、史料原文 |

**每个知识分区至少包含 1 个 callout**。

**示例**：

warning — 易错提醒：
```json
{ "type": "callout", "variant": "warning", "title": "注意区分", "content": "蔡伦是「改进」造纸术而非「发明」。西汉已有纸，但质量差、价格贵。" }
```

tip — 理解要点：
```json
{ "type": "callout", "variant": "tip", "title": "理解要点", "content": "推恩令：让诸侯将封地分给所有子弟，看似恩惠，实际使封地越分越小，力量削弱。" }
```

note — 补充说明：
```json
{ "type": "callout", "variant": "note", "title": "汉初背景", "content": "汉初经济凋敝，甚至天子都找不到四匹毛色相同的马来驾车。" }
```

mnemonic — 记忆口诀：
```json
{ "type": "callout", "variant": "mnemonic", "title": "记忆口诀", "content": "政经文交军，皇帝三公郡。度量货币文，车轨长城灵。" }
```

quote — 历史引用：
```json
{ "type": "callout", "variant": "quote", "title": "《史记·秦始皇本纪》", "content": "一法度衡石丈尺。车同轨。书同文字。" }
```

### 3.4 list — 列表

```json
{ "type": "list", "ordered": false, "items": [" item 1", " item 2", " item 3"] }
```

```json
{ "type": "list", "ordered": true, "items": ["A. 选项A", "B. 选项B", "C. 选项C", "D. 选项D"] }
```

**使用场景**：
- 措施列举、原因列举
- 选择题选项
- 分类说明

### 3.5 timeline — 时间线

```json
{
  "type": "timeline",
  "items": [
    { "time": "公元前230年", "title": "灭韩" },
    { "time": "公元前228年", "title": "灭赵" },
    { "time": "公元前221年", "title": "灭齐，统一中国", "content": "建立秦朝" }
  ]
}
```

**使用场景**：
- 历史事件时间线（战争进程、改革步骤）
- 朝代更替
- 人物生平大事记
- 重要条约/会议的签订过程

**格式规则**：
- `time` — 时间点（字符串，如"公元前221年"、"208年"、"184年"）
- `title` — 事件名称（必填）
- `content` — 补充说明（可选，简短描述）
- 按时间顺序排列
- 建议 3-6 个节点

**示例 — 战争进程**：
```json
{ "type": "timeline", "items": [
  { "time": "公元前138年", "title": "张骞第一次出使西域", "content": "目的：联络大月氏夹击匈奴" },
  { "time": "公元前119年", "title": "张骞第二次出使西域", "content": "开通丝绸之路" }
]}
```

**示例 — 改革措施**：
```json
{ "type": "timeline", "items": [
  { "time": "494年", "title": "迁都洛阳" },
  { "time": "494年后", "title": "穿汉服、说汉语" },
  { "time": "494年后", "title": "改汉姓、通婚姻" }
]}
```

### 3.6 equation — 化学方程式

**文科课程不使用此块类型。** 如需插入数学公式，使用理科规范。

### 3.7 animation — GIF 动图

```json
{ "type": "animation", "src": "/gifs/example.gif", "alt": "描述文字" }
```

文科课程较少使用，仅在需要动态演示时使用。

---

## 四、例题模块

```json
"examples": [
  {
    "title": "例1：题目名称",
    "problem": [
      { "type": "paragraph", "content": "题干内容（  ）" },
      { "type": "list", "ordered": true, "items": ["A. 选项A", "B. 选项B", "C. 选项C", "D. 选项D"] }
    ],
    "solution": [
      { "type": "paragraph", "content": "解析内容，说明为什么选X..." }
    ],
    "answer": "B",
    "source": "2024各地中考常见"
  }
]
```

**规范**：
- 每课 2-3 道例题
- problem 数组：先 paragraph（题干），再 list（选项）
- solution 数组：解析过程
- answer：正确答案（字母或文字）
- source：来源标注（可选）

---

## 五、本课小结

```json
"summary": [
  {
    "text": "一级知识点",
    "children": [
      { "text": "子知识点1" },
      { "text": "子知识点2" }
    ]
  }
]
```

- 树状结构，最多 3 层
- 一级节点 2-4 个
- 每个一级节点下 2-5 个子节点
- 内容精炼，突出核心要点

---

## 六、练习题模块

### 题型一览

| 题型 | type | 用途 |
|------|------|------|
| 选择题 | `choice` | 4 选 1，考察知识点记忆 |
| 判断题 | `true_false` | 判断正误，考察概念理解 |
| 填空题 | `fill` | 填写关键词，考察核心概念 |
| 简答题 | `short_answer` | 开放性问题，考察综合分析 |

### 练习题数量

每课 4-6 道：
- 选择题 2-3 道
- 判断题 1 道
- 填空题 1 道
- 简答题 0-1 道

### 选择题

```json
{
  "type": "choice",
  "id": "ex-1-1",
  "stem": "题干内容（  ）",
  "options": [
    { "label": "A", "text": "选项A" },
    { "label": "B", "text": "选项B" },
    { "label": "C", "text": "选项C" },
    { "label": "D", "text": "选项D" }
  ],
  "answer": "B",
  "analysis": "解析内容..."
}
```

**规范**：
- id 格式：`ex-{课号}-{序号}`，如 `ex-9-1`
- 4 个选项，每个是独立对象
- answer 为单个字母

### 判断题

```json
{
  "type": "true_false",
  "id": "ex-9-3",
  "stem": "判断题题干。",
  "answer": true,
  "analysis": "解析内容..."
}
```

**注意**：answer 为布尔值 `true`/`false`，不是字符串。

### 填空题

```json
{
  "type": "fill",
  "id": "ex-9-4",
  "segments": ["秦始皇在政治上建立了", "___1___", "制，在地方推行", "___2___", "制。"],
  "blanks": [
    { "index": 1, "answer": "皇帝" },
    { "index": 2, "answer": "郡县" }
  ],
  "analysis": "解析内容..."
}
```

**规范**：
- segments 中用 `___N___` 标记空位
- blanks 中 index 与空位编号对应
- 可提供 alternatives 容错：`{ "index": 1, "answer": "周口店", "alternatives": ["北京周口店"] }`

### 简答题

```json
{
  "type": "short_answer",
  "id": "ex-1-5",
  "question": "简答题题目",
  "referenceAnswer": "参考答案...",
  "scoringPoints": ["要点1", "要点2"]
}
```

---

## 七、质量检查清单

| 检查项 | 规范 |
|--------|------|
| 学习目标数 | 3-6 个 |
| 知识分区数 | 2-4 个 |
| 每分区至少 1 个 callout | 必须 |
| 例题数 | 2-3 道 |
| 练习题数 | 4-6 道 |
| 选择题数 | 2-3 道 |
| 判断题数 | 1 道 |
| 填空题数 | 1 道 |
| 练习题 ID 唯一 | 同课内不重复 |
| 选择题 4 个选项 | 每个独立对象 |
| timeline 时间顺序 | 按时间排列 |
| quote 内容准确 | 引用原文 |

---

## 八、文科 vs 理科差异对比

| 特性 | 文科（历史等） | 理科（化学等） |
|------|---------------|---------------|
| KaTeX 公式 | ❌ 不使用 | ✅ 大量使用 |
| equation 块 | ❌ 不使用 | ✅ 化学方程式 |
| timeline 块 | ✅ 常用 | ❌ 不使用 |
| quote callout | ✅ 常用 | ❌ 不使用 |
| mnemonic callout | ✅ 记忆口诀 | ✅ 记忆口诀 |
| features.katex | `false` | `true` |
| 内容侧重 | 事件叙述、对比分析 | 公式推导、实验过程 |

## 九、JSON 转义注意事项

即使文科课程不使用 KaTeX，也需注意 JSON 转义规则，避免生成内容时引入错误：

- **加粗 `**`**：JSON 中直接写 `**文字**`，无需额外转义
- **引号 `「」`**：JSON 中直接写 `「文字」`
- **反斜杠**：如内容中需要 `\`（如路径），JSON 中写 `\\`

详见理科规范 `curriculum-format.md` 第四节「JSON 中的 LaTeX 转义规则」。
