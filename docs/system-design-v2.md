# SuperTeacher 互动教学系统设计方案 v2

> 版本：v2.0 | 日期：2026-06-13
> 核心铁三角：**互动教学框架 + 课程内容 + 练习题**

---

## 零、核心铁三角（不可动摇）

```
                    ┌─────────────────┐
                    │   互动教学框架    │
                    │  （引擎层）       │
                    │  渲染 + 交互     │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────┴─────┐    ┌──────┴──────┐
              │  课程内容   │    │   练习题     │
              │（内容层）   │    │ （练习层）   │
              │ 知识点展示  │    │ 判题+反馈   │
              └───────────┘    └─────────────┘
```

**铁三角的含义**：

- 框架是骨架——提供渲染和交互能力，本身不含任何学科逻辑
- 内容是血肉——课程知识点、例题、小结，决定"教什么"
- 练习是灵魂——四种题型、即时判题、错题收集，决定"怎么练"

三者缺一不可，互相独立又紧密配合。**任何设计决策必须同时服务这三个核心**。

---

## 一、需求与边界

### 1.1 要做什么

| # | 需求 | 说明 |
|:-:|------|------|
| 1 | **不限科目** | 语文/数学/英语/物理/化学/生物/历史/地理/政治均可 |
| 2 | **简单直接** | 教师写 MD → 一条命令 → 自动生成互动教学网页 |
| 3 | **零服务器** | 纯静态部署，无后端，Vercel/GitHub Pages 直接托管 |
| 4 | **全设备可用** | 手机、平板、电脑浏览器打开即用 |
| 5 | **四种题型** | 选择题、判断题、填空题、简答题，覆盖所有学科 |
| 6 | **公式支持** | 数学和化学公式正确渲染，填空题公式容错校验 |
| 7 | **教-练-测闭环** | 学习目标 → 知识点讲解 → 例题示范 → 课后练习 → 小结 |
| 8 | **进度与错题** | 做题记录、完成状态、正确率、错题收集，刷新不丢 |

### 1.2 不做什么（第一版）

| 不做 | 原因 |
|------|------|
| 用户登录/多用户 | 纯静态无法做服务端鉴权，后续可接 Supabase |
| AI 出题 | 内容全部预编写，不依赖 LLM |
| 幻灯片/讲义视图 | 架构预留，v1 不实现（详见附录 B） |
| 实时协作 | 非教学场景核心需求 |

---

## 二、系统总览

### 2.1 一句话架构

**教师用 Markdown 写教案 → 转换脚本自动生成 JSON → React 网页读取 JSON 渲染互动页面**

### 2.2 全局流程

```
┌──────────────────────────────────────────────────────────────┐
│  教师工作（写内容）                                            │
│                                                              │
│  course.json + docs/curriculum/*.md                          │
│  换科目 = 替换这些文件                                         │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │  npm run convert（自动转换）
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  构建产物（机器生成，不手写）                                    │
│                                                              │
│  src/data/lessons/lesson-01.json ... lesson-NN.json          │
│  src/data/index.ts（课时索引，自动生成）                        │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │  Vite 打包
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  学生使用（浏览器打开）                                         │
│                                                              │
│  纯静态 SPA → React 读取 JSON → 渲染互动页面                   │
│  localStorage 保存进度和错题                                    │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 分层架构

```
┌────────────────────────────────────────────────────┐
│              ① 内容层（Content Layer）               │
│                                                    │
│  course.json        ← 科目配置                     │
│  docs/curriculum/   ← MD 教案源文件                 │
│                                                    │
│  换科目只改这一层                                    │
├────────────────────────────────────────────────────┤
│              ② 转换层（Conversion Layer）            │
│                                                    │
│  scripts/convert-md.mjs  ← MD → JSON 转换脚本      │
│  按 H2 切模块 → 内容块解析 → 题型识别 → 输出 JSON    │
├────────────────────────────────────────────────────┤
│              ③ 数据层（Data Layer，构建产物）          │
│                                                    │
│  src/data/lessons/*.json    ← 课时数据              │
│  src/data/index.ts          ← 课时索引              │
│  纯静态 JSON，无运行时构建负担                        │
├────────────────────────────────────────────────────┤
│              ④ 引擎层（Engine Layer）                │
│                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │内容块渲染器│ │ 练习引擎  │ │ 进度管理器 │           │
│  │BlockReg  │ │ExerReg   │ │Progress  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 布局系统  │ │ 路由系统  │ │ 公式渲染  │           │
│  │ Layout   │ │ Router   │ │ KaTeX    │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│                                                    │
│  引擎层不含任何学科特定逻辑                            │
└────────────────────────────────────────────────────┘
```

---

## 三、核心铁三角之一：课程内容

### 3.1 course.json — 科目配置（唯一手动维护的配置文件）

```json
{
  "course": {
    "name": "初中化学",
    "icon": "⚗️",
    "subtitle": "人教版九年级全一册",
    "color": "#6C63FF"
  },
  "schedule": {
    "weeks": 2,
    "weekLabels": ["第一周", "第二周"],
    "weekTitles": ["走进化学世界", "物质构成的奥秘"]
  },
  "lessons": [
    {
      "id": 1,
      "title": "走进化学世界",
      "unit": "第一单元",
      "week": 1,
      "day": 1,
      "file": "lesson-01-走进化学世界.md"
    }
  ],
  "features": {
    "katex": true,
    "formulaNormalize": true
  },
  "paths": {
    "contentDir": "docs/curriculum",
    "outputDir": "src/data/lessons"
  }
}
```

**说明**：
- `features.katex`：是否需要公式渲染（数学/物理/化学为 true，语文/历史为 false）
- `features.formulaNormalize`：填空题是否需要公式容错校验
- 换科目 = 替换 course.json + 替换 MD 文件夹 + 重新构建

### 3.2 课时 JSON 结构（转换脚本输出，第一版先手写验证）

每课固定 **五个模块**，对应 MD 中的五个二级标题：

```json
{
  "meta": {
    "id": 1,
    "slug": "lesson-01-走进化学世界",
    "title": "走进化学世界",
    "unit": "第一单元",
    "week": 1,
    "day": 1
  },
  "objectives": [
    { "text": "理解物理变化和化学变化的概念", "isKeyPoint": false },
    { "text": "掌握化学变化的判断方法", "isKeyPoint": true }
  ],
  "knowledge": [
    {
      "title": "核心概念",
      "defaultExpanded": true,
      "blocks": []
    }
  ],
  "examples": [],
  "exercises": [],
  "summary": []
}
```

### 3.3 内容块（ContentBlock）— 知识点展示的最小单元

这是框架最核心的抽象。知识点区域的每一段内容都是一个"内容块"：

```typescript
type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: "warning" | "tip" | "note" | "mnemonic"; title: string; content: string }
  | { type: "equation"; latex: string; display: boolean }
  | { type: "list"; ordered: boolean; items: string[] };
```

**五种内容块对应的 MD 语法和视觉效果**：

| MD 语法 | 内容块类型 | 视觉效果 |
|---------|----------|---------|
| 普通段落 | `paragraph` | 正文排版 |
| `\| --- \|` 表格 | `table` | 响应式表格，小屏可横滚 |
| `> 关键词：` blockquote | `callout` | 彩色提示框（红/绿/蓝/紫） |
| `$...$` 或 `$$...$$` | `equation` | KaTeX 渲染的公式卡片 |
| `- item` 或 `1. item` | `list` | 有序/无序列表 |

### 3.4 典型例题（Example）

```typescript
interface Example {
  title: string;            // "例1：化学变化判断"
  problem: ContentBlock[];  // 题干（支持公式、表格等）
  solution: ContentBlock[]; // 解析
  answer: string;           // "B"
  source?: string;          // "2024北京中考"
}
```

### 3.5 本课小结（Summary）

```typescript
interface SummaryNode {
  text: string;
  children?: SummaryNode[];  // 支持树状嵌套
}
```

---

## 四、核心铁三角之二：练习题

### 4.1 四种题型数据结构

```typescript
type Exercise =
  | ChoiceExercise      // 选择题
  | TrueFalseExercise   // 判断题
  | FillExercise        // 填空题
  | ShortAnswerExercise; // 简答题
```

#### 选择题

```typescript
interface ChoiceExercise {
  type: "choice";
  id: string;               // "ex-1-1"
  stem: string;             // 题干
  options: {
    label: string;          // "A" "B" "C" "D"
    text: string;           // 选项内容
  }[];
  answer: string;           // 正确选项 label，如 "B"
  analysis: string;         // 解析
  source?: string;          // "2024北京中考"
}
```

**JSON 示例**：
```json
{
  "type": "choice",
  "id": "ex-1-1",
  "stem": "下列变化中属于化学变化的是（  ）",
  "options": [
    { "label": "A", "text": "酒精挥发" },
    { "label": "B", "text": "铁钉生锈" },
    { "label": "C", "text": "冰雪融化" },
    { "label": "D", "text": "灯泡发光" }
  ],
  "answer": "B",
  "analysis": "铁钉生锈有新物质铁锈生成，属于化学变化。",
  "source": "2024北京中考"
}
```

#### 判断题

```typescript
interface TrueFalseExercise {
  type: "true_false";
  id: string;
  stem: string;             // 题干（陈述句）
  answer: boolean;          // true = 对，false = 错
  analysis: string;
  source?: string;
}
```

**JSON 示例**：
```json
{
  "type": "true_false",
  "id": "ex-1-2",
  "stem": "爆炸一定是化学变化。",
  "answer": false,
  "analysis": "锅炉爆炸是物理变化，火药爆炸是化学变化，关键看是否有新物质生成。",
  "source": "易错辨析"
}
```

#### 填空题

```typescript
interface FillExercise {
  type: "fill";
  id: string;
  segments: string[];       // ["化学式 ", "___1___", " 中 C 的化合价为 ", "___2___"]
  blanks: FillBlank[];
  analysis: string;
  source?: string;
}

interface FillBlank {
  index: number;            // 第几个空（从1开始）
  answer: string;           // 标准答案 "+4"
  alternatives?: string[];  // 容错答案 ["+4", "正四", "四"]
}
```

**JSON 示例**：
```json
{
  "type": "fill",
  "id": "ex-1-3",
  "segments": ["化学式 CO₂ 中 C 的化合价为 ", "___1___", "，O 的化合价为 ", "___2___", "。"],
  "blanks": [
    { "index": 1, "answer": "+4", "alternatives": ["+4", "4", "正四价"] },
    { "index": 2, "answer": "-2", "alternatives": ["-2", "2", "负二价"] }
  ],
  "analysis": "在化合物中，各元素化合价代数和为零。CO₂ 中 O 为 -2，则 C 为 +4。"
}
```

#### 简答题

```typescript
interface ShortAnswerExercise {
  type: "short_answer";
  id: string;
  question: string;
  referenceAnswer: string;   // 参考答案
  scoringPoints?: string[];  // 得分要点（可选）
}
```

**JSON 示例**：
```json
{
  "type": "short_answer",
  "id": "ex-1-4",
  "question": "请简述化学变化与物理变化的本质区别，并各举一例。",
  "referenceAnswer": "本质区别：是否有新物质生成。化学变化有新物质生成，如铁钉生锈；物理变化没有新物质生成，如水的三态变化。",
  "scoringPoints": ["指出本质区别为新物质生成", "举出化学变化实例", "举出物理变化实例"]
}
```

### 4.2 交互行为设计

| 题型 | 学生操作 | 系统反馈 |
|------|---------|---------|
| **选择题** | 点击选项 → 即时判题 | ✅ 选对：选项变绿 + 对勾；❌ 选错：选项变红 + 高亮正确答案；自动展开解析 |
| **判断题** | 点击"对"或"错" → 即时判题 | 同选择题的反馈机制 |
| **填空题** | 输入框填写 → 点击提交 | 逐空校验，对的变绿、错的变红并显示正确答案；公式自动容错（CO₂=CO2=co2） |
| **简答题** | 文本框输入 → 点击"查看参考答案" | 展示参考答案 + 得分要点；学生自评（已掌握/部分掌握/未掌握） |

### 4.3 公式容错校验（normalizeFormula）

填空题的核心难点：同一个化学式/数学式，学生可能用不同格式输入。

**校验流程**：

```
学生输入 "CO₂"          标准答案 "+4"
     ↓                       ↓
 normalizeFormula()      normalizeFormula()
     ↓                       ↓
  "CO2"                   "+4"
     └─────── 字符串比较 ──────┘
              ↓
           匹配 ✓
```

**标准化规则**：

| 输入 | 标准化结果 | 规则 |
|------|----------|------|
| `CO₂` | `CO2` | 上下标数字转普通数字 |
| `co2` | `CO2` | 统一大写 |
| `+4` | `+4` | 保持不变 |
| `正四价` | `正四价` | 中文答案原样保留（通过 alternatives 字段匹配） |
| `3.01×10²³` | `3.01e23` | 科学记数法统一 |
| `H₂O` | `H2O` | 上下标转普通 |

> **注意**：alternatives 字段才是容错的主力。normalizeFormula 处理常见格式差异，alternatives 处理语义等价（如 "+4" 和 "正四价"）。两者配合使用。

---

## 五、核心铁三角之三：互动教学框架

### 5.1 内容块注册表（ContentBlockRegistry）

框架的扩展机制。每种 ContentBlock.type 对应一个渲染组件：

```typescript
// 注册表
const blockRegistry: Record<string, React.FC<BlockProps>> = {
  paragraph: ParagraphBlock,     // 段落
  table:     TableBlock,         // 表格
  callout:   CalloutBlock,       // 提示框
  equation:  EquationBlock,      // 公式
  list:      ListBlock,          // 列表
  // 未来扩展：
  // proof:    ProofBlock,       // 数学证明块
  // diagram:  DiagramBlock,     // 物理电路图
};

// 渲染分发器
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, i) => {
    const Comp = blockRegistry[block.type];
    return Comp
      ? <Comp key={i} block={block} />
      : <FallbackBlock key={i} type={block.type} />;
  });
}
```

**好处**：新增一种内容块 = 注册一个组件，引擎代码零修改。

### 5.2 题型注册表（ExerciseRegistry）

同样的注册机制，练习引擎按题型分发：

```typescript
const exerciseRegistry: Record<string, React.FC<ExerciseProps>> = {
  choice:       ChoiceExercise,       // 选择题
  true_false:   TrueFalseExercise,    // 判断题
  fill:         FillExercise,         // 填空题
  short_answer: ShortAnswerExercise,  // 简答题
  // 未来扩展：
  // multi_choice:  MultiChoiceExercise,  // 多选题
  // drag_sort:     DragSortExercise,     // 排序题
  // match:         MatchExercise,        // 匹配题
};

// 练习引擎分发器
function ExerciseEngine({ exercises, onAnswer }: ExerciseEngineProps) {
  return exercises.map((ex, i) => {
    const Comp = exerciseRegistry[ex.type];
    return Comp
      ? <Comp key={ex.id} exercise={ex} onAnswer={onAnswer} />
      : <p key={i}>未知题型: {ex.type}</p>;
  });
}
```

### 5.3 进度与错题管理

#### 数据结构（localStorage，key: `"superteacher-progress"`）

```typescript
interface UserProgress {
  version: 1;
  lessons: Record<string, LessonProgress>;  // key: 课时 slug
  stats: ProgressStats;
}

interface LessonProgress {
  knowledgeRead: boolean;                   // 是否阅读知识点
  exerciseResults: Record<string, ExerciseResult>;  // key: 题目 id
  completedAt?: number;                     // 完成时间戳
}

interface ExerciseResult {
  answered: boolean;
  correct: boolean;
  userAnswer: string;      // 学生答案
  timestamp: number;       // 答题时间
}

interface ProgressStats {
  totalCompleted: number;  // 完成课时数
  totalCorrect: number;    // 正确题数
  totalAttempted: number;  // 总尝试题数
  wrongExercises: WrongExercise[];  // 错题列表
}

interface WrongExercise {
  lessonId: number;
  exerciseId: string;
  userAnswer: string;
  timestamp: number;
}
```

#### 功能清单

| 功能 | 实现方式 | 说明 |
|------|---------|------|
| 单课完成状态 | 所有题都答了 → 标记已完成 | 首页课时卡片显示✅ |
| 正确率 | 对的题数 / 总题数 | 首页卡片、进度页都可看 |
| 错题收集 | `correct === false` 的记录自动进错题列表 | 错题页按课时分组展示 |
| 建议复习 | 正确率 < 60% → 标黄色⚠️ | 首页卡片提示 |
| 刷新不丢失 | localStorage 持久化 | 关闭浏览器再打开数据还在 |
| 数据版本号 | `version: 1` | 未来数据结构变更时可做迁移 |

---

## 六、MD 教案规范

### 6.1 文件命名

```
docs/curriculum/lesson-{NN}-{标题}.md
例：docs/curriculum/lesson-01-走进化学世界.md
```

### 6.2 文件结构（五模块固定格式）

```markdown
# 第1课：走进化学世界

## 一、学习目标
- 理解物理变化和化学变化的概念
- ★掌握化学变化的判断方法

## 二、知识点梳理
### 核心概念
| 概念 | 定义 | 示例 |
|------|------|------|
| 物理变化 | 没有新物质生成 | 水的三态变化 |

> ⚠️ 易错提醒：爆炸不一定是化学变化...

$2H_2 + O_2 \rightarrow 2H_2O$

## 三、典型例题
### 例1
下列变化中属于化学变化的是（  ）
A. 酒精挥发
B. 铁钉生锈
C. 冰雪融化
D. 灯泡发光

**答案**：B
**解析**：铁钉生锈有新物质铁锈生成...

## 四、课后练习
### 选择题
1. 下列变化中属于化学变化的是（  ）
   A. 酒精挥发
   B. 铁钉生锈
   C. 冰雪融化
   D. 灯泡发光

   **答案**：B
   **解析**：铁钉生锈有新物质铁锈生成...
   **来源**：2024北京中考

### 判断题
2. 爆炸一定是化学变化。

   **答案**：错
   **解析**：锅炉爆炸是物理变化...

### 填空题
3. 化学式 $CO_2$ 中 C 的化合价为 `___`，O 的化合价为 `___`。
   **答案**：+4, -2

### 简答题
4. 请简述化学变化与物理变化的本质区别。
   **参考答案**：是否有新物质生成...

## 五、本课小结
- 化学变化：有新物质生成
  - 判断依据：颜色变化、气体生成、沉淀...
```

### 6.3 解析规则

| MD 语法 | 识别为 | 对应数据类型 |
|---------|-------|-------------|
| 普通段落 | → | `paragraph` |
| `\| --- \|` 表格 | → | `table` |
| `> 关键词：` blockquote | → | `callout`（按关键词分 variant） |
| `$...$` 或 `$$...$$` | → | `equation` |
| `- item` 或 `1. item` | → | `list` |
| `A. xxx`（选项）+ `**答案**：` | → | `choice` |
| 陈述句 + `**答案**：对/错` | → | `true_false` |
| `___` 或 `` `___` `` + `**答案**：a, b` | → | `fill` |
| `**参考答案**：` 段落 | → | `short_answer` |

---

## 七、页面与路由

### 7.1 路由表

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | HomePage | 课程名 + 课时网格 + 完成状态 |
| `/lesson/:id` | LessonPage | 五模块完整展示 + 互动做题 |

### 7.2 首页布局（HomePage）

```
┌──────────────────────────────────────┐
│  ⚗️ 初中化学 — 人教版九年级全一册      │
│  总进度：3/10 课  正确率：78%         │
├──────────────────────────────────────┤
│  第一周：走进化学世界                  │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ ✅    │ │ ⚠️   │ │ 📖   │         │
│  │ 第1课 │ │ 第2课 │ │ 第3课 │         │
│  │ 100%  │ │ 40%  │ │ 未开始 │         │
│  └──────┘ └──────┘ └──────┘         │
│  第二周：物质构成的奥秘                │
│  ┌──────┐ ┌──────┐                   │
│  │ 📖   │ │ 📖   │                   │
│  │ 第4课 │ │ 第5课 │                   │
│  └──────┘ └──────┘                   │
└──────────────────────────────────────┘
```

### 7.3 课时页布局（LessonPage）

```
┌──────────────────────────────────────┐
│  ← 返回   第1课：走进化学世界   下一课 →│
├──────────────────────────────────────┤
│  一、学习目标                          │
│  · 理解物理变化和化学变化的概念          │
│  · ★ 掌握化学变化的判断方法             │
├──────────────────────────────────────┤
│  二、知识点梳理            [▼ 展开]     │
│  ┌─ 核心概念 ─────────────────────┐   │
│  │  [表格] [提示框] [公式] [段落]  │   │
│  └────────────────────────────────┘   │
├──────────────────────────────────────┤
│  三、典型例题                          │
│  例1：化学变化判断                      │
│  [选择] [判题] [解析展开]              │
├──────────────────────────────────────┤
│  四、课后练习                          │
│  第1题 选择题 ⬤ ⬤ ⬤ ⬤              │
│  第2题 判断题 [对] [错]               │
│  第3题 填空题 [____] [____]           │
│  第4题 简答题 [文本框] [查看参考答案]   │
├──────────────────────────────────────┤
│  五、本课小结                          │
│  · 化学变化：有新物质生成               │
│    · 判断依据：颜色变化...              │
└──────────────────────────────────────┘
```

---

## 八、项目目录结构

```
SuperTeacher-HTML/
├── docs/
│   ├── curriculum/              ← 【内容层】MD 教案源文件
│   │   ├── lesson-01-xxx.md
│   │   └── lesson-02-xxx.md
│   └── system-design-v2.md     ← 本文档
│
├── scripts/
│   └── convert-md.mjs          ← 【转换层】MD → JSON
│
├── src/
│   ├── data/                   ← 【数据层】构建产物（不手写）
│   │   ├── lessons/
│   │   │   └── lesson-01.json
│   │   └── index.ts            ← 课时索引（自动生成）
│   │
│   ├── components/             ← 【引擎层】组件
│   │   ├── layout/             ← 布局
│   │   │   ├── AppLayout.tsx
│   │   │   └── TopNav.tsx
│   │   ├── knowledge/          ← 知识点渲染
│   │   │   ├── ContentRenderer.tsx   ← 内容块分发器
│   │   │   └── blocks/
│   │   │       ├── ParagraphBlock.tsx
│   │   │       ├── TableBlock.tsx
│   │   │       ├── CalloutBlock.tsx
│   │   │       ├── EquationBlock.tsx
│   │   │       └── ListBlock.tsx
│   │   ├── exercises/          ← 互动练习
│   │   │   ├── ExerciseEngine.tsx    ← 题型分发器
│   │   │   ├── AnswerReveal.tsx      ← 解析展开
│   │   │   └── types/
│   │   │       ├── ChoiceExercise.tsx
│   │   │       ├── TrueFalseExercise.tsx
│   │   │       ├── FillExercise.tsx
│   │   │       └── ShortAnswerExercise.tsx
│   │   ├── progress/           ← 进度展示
│   │   │   ├── LessonCard.tsx
│   │   │   └── ProgressRing.tsx
│   │   └── ui/                 ← 基础 UI
│   │       ├── Button.tsx
│   │       ├── Collapse.tsx
│   │       └── KaTeX.tsx
│   │
│   ├── hooks/
│   │   ├── useProgress.ts      ← 进度读写
│   │   ├── useLesson.ts        ← 课时数据加载
│   │   └── useExercise.ts      ← 单题作答状态
│   │
│   ├── pages/
│   │   ├── HomePage.tsx        ← 首页
│   │   └── LessonPage.tsx      ← 课时页
│   │
│   ├── utils/
│   │   ├── storage.ts          ← localStorage 封装
│   │   └── formula.ts          ← 公式标准化（normalizeFormula）
│   │
│   ├── config/
│   │   └── course.ts           ← 从 course.json 导入配置
│   │
│   ├── types/
│   │   └── index.ts            ← 全局类型定义
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               ← Tailwind 入口
│
├── course.json                 ← 【内容层】科目配置
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 九、技术栈

| 选型 | 版本 | 理由 |
|------|------|------|
| React | ^18.x | 最主流前端框架，组件化开发 |
| TypeScript | ^5.x | 类型安全，减少 bug |
| Vite | ^5.x | 构建快，静态 SPA 输出 |
| Tailwind CSS | ^4.x | 响应式设计成本最低，零配置 |
| React Router | ^7.x | SPA 路由 |
| KaTeX | ^0.16.x | 数理化公式渲染 |
| Lucide React | latest | 轻量图标库 |
| localStorage | 内置 | 进度持久化，零依赖 |

---

## 十、实施计划（6 Phase）

| Phase | 内容 | 验证标准 |
|:-----:|------|---------|
| **P0** | **项目脚手架**：Vite + React + TS + Tailwind 4 + Router + KaTeX | `npm run dev` 跑通，显示默认页面 |
| **P1** | **一节课跑通**：手写 1 课 JSON + 类型定义 + 5 种内容块渲染器 | 知识点部分完整渲染（表格、提示框、公式、列表、段落） |
| **P2** | **练习引擎**：4 种题型组件 + 公式容错 + 判题交互 + 解析展开 | 选择题能判对错，填空题能容错，简答题能自评 |
| **P3** | **进度+首页**：useProgress Hook + localStorage + 首页课时网格 | 刷新后进度不丢失，首页可点击进课时 |
| **P4** | **转换脚本**：convert-md.mjs + 全部教案 MD → JSON | `npm run convert` 一键生成全部 JSON，前端正常渲染 |
| **P5** | **打磨+部署**：响应式适配 + 多课时验证 + Vercel 部署 | 手机/桌面正常，部署后公网可访问 |

---

## 附录 A：与 v1 方案（system-design.md）的差异

| 项目 | v1 方案 | v2 调整 | 原因 |
|------|--------|--------|------|
| 题型 | 3 种（选择/填空/简答） | **4 种**（+判断题） | 判断题实现成本极低，覆盖语文/政治等科目刚需 |
| 开发节奏 | 先写转换脚本 或 10 Phase | **先手写 JSON + 6 Phase** | 先验证再自动化，节奏更紧凑 |
| 路由 | 3 个（含 ProgressPage） | **2 个** | 进度信息内嵌首页，精简第一版 |
| 多形态 | 未涉及 | **架构预留，v1 不实现** | 详见附录 B |
| 进度数据 | 分散在多处 | **统一到 UserProgress** | 错题列表直接内嵌，不需要额外存储 |

---

## 附录 B：多形态输出预留（v1 不实现）

架构上天然支持未来扩展：

- 数据层（JSON）已经是一源数据，不需要改
- 只需新增视图层组件：

| 未来形态 | 需要新增的组件 | 改动范围 |
|---------|--------------|---------|
| 幻灯片视图 | `SlidesView.tsx` + 分页逻辑 | 仅视图层 |
| 讲义打印版 | `HandoutView.tsx` + 打印样式 | 仅视图层 |

引擎层和数据层**零修改**。
