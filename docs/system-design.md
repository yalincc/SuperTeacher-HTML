# 互动教学网页框架 — 系统设计方案

> 方案来源：Qoder 初版方案 + WorkBuddy 补充修改  
> 版本：v1.0  
> 日期：2026-06-13

---

## 一、需求概述

### 1.1 项目定位

将 **Markdown 教案** 自动转换为 **互动教学网页** 的通用框架。教师只需按固定格式编写 MD 教案，框架自动生成包含知识点展示、互动练习、进度追踪的完整教学网站。

### 1.2 核心需求（由用户明确）

| 序号 | 需求 | 说明 |
|:----:|------|------|
| R1 | **不限科目** | 语文/数学/英语/物理/化学/生物/历史/地理/政治均可使用，不绑定任何学科 |
| R2 | **模块化组合** | 引擎与内容完全分离，内容块和题型均可注册/扩展，框架本身保持最小化 |
| R3 | **简单架构** | 不引入不必要的复杂度，核心逻辑足够直观，方便后续维护和扩展 |
| R4 | **零服务器成本** | 纯静态 SPA，部署到 Vercel/GitHub Pages，无后端运维负担 |
| R5 | **换科只需改配置** | 切换科目 = 替换 `course.json` + 替换 MD 源文件 + 重新构建，无需改代码 |
| R6 | **标准 MD 即可** | 教案编写者不需要学习 DSL 或特殊语法，用标准 Markdown 编写 |
| R7 | **完整的教-练-测闭环** | 每课覆盖：学习目标 → 知识点讲解 → 例题示范 → 课后练习 → 小结 |
| R8 | **进度持久化** | 学生做题记录、完成状态保存在浏览器 localStorage，刷新不丢失 |

### 1.3 非需求（第一版不做）

| 项目 | 原因 |
|------|------|
| 用户登录/多用户 | 纯静态部署无法做服务端鉴权，后续可接 Supabase |
| AI 出题 | 内容全部预编写，不依赖 LLM |
| 实时协作 | 非教学场景需求 |
| TTS 语音朗读 | 自学场景不是刚需，后续按需加 |
| 几何图形绘制 | 仅用于理科专项练习，已有独立引擎（学霸加练系统），此处不做 |

---

## 二、设计目标

| 目标 | 衡量标准 |
|------|---------|
| 换科成本 ≤ 5 分钟 | 替换 `course.json` + `docs/curriculum/*.md` → `npm run build` → 部署 |
| 科目之间零代码耦合 | 化学的错题本不会引入化学类型到数学页面 |
| 添加新题型 ≤ 30 行代码 | 在 registry 中注册 type + component，引擎自动分发 |
| 首屏加载 < 2 秒 | 纯静态 JSON + 按需加载路由 |
| 构建时间 < 5 秒 | 10 个 MD 文件一次性转换 |

---

## 三、系统架构

### 3.1 总体分层

```
┌──────────────────────────────────────────────────────┐
│                    ① 内容层（Content Layer）            │
│                                                      │
│  course.json          ← 科目配置（唯一可变文件）         │
│  docs/curriculum/     ← MD 教案源文件                  │
│  course-example-xxx.json  ← 其他科目示例配置            │
│                                                      │
│  换科 = 替换这个文件夹 + course.json                    │
└────────────────────────┬─────────────────────────────┘
                         │  npm run convert
                         ▼
┌──────────────────────────────────────────────────────┐
│               ② 转换管道（Conversion Pipeline）        │
│                                                      │
│  scripts/convert-md.mjs                              │
│  ├── 区块分割器（Splitter）  — 按 H2 切模块            │
│  ├── 内容解析器注册表（Parser Registry）               │
│  │   ├── paragraph → 段落解析                          │
│  │   ├── table → 表格解析                             │
│  │   ├── callout → 提示框解析                          │
│  │   ├── equation → $LaTeX$ 提取                      │
│  │   └── exercise → 练习题解析（选择/填空/简答）         │
│  └── 聚合器（Aggregator）→ 输出 JSON                  │
│                                                      │
│  科目专属解析器可通过 course.json 的 features 注册       │
└────────────────────────┬─────────────────────────────┘
                         │  输出
                         ▼
┌──────────────────────────────────────────────────────┐
│              ③ 数据层（Data Layer，构建产物）           │
│                                                      │
│  src/data/lessons/lesson-01.json ... lesson-NN.json  │
│  src/data/index.ts         ← 课时索引（自动生成）       │
│  src/data/course.d.ts      ← TypeScript 类型推导      │
│                                                      │
│  全部为静态 JSON，无运行时构建负担                       │
└────────────────────────┬─────────────────────────────┘
                         │  React Router 按需加载
                         ▼
┌──────────────────────────────────────────────────────┐
│                 ④ 引擎层（Engine Layer）                │
│                                                      │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐     │
│  │ 内容块渲染器 │ │  练习引擎   │ │  进度管理器    │     │
│  │(BlockReg)  │ │(ExerciseReg)│ │(useProgress) │     │
│  └────────────┘ └────────────┘ └──────────────┘     │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐     │
│  │ 布局系统    │ │  路由系统   │ │  本地存储     │     │
│  │(Layout)   │ │(ReactRtr) │ │(localStorage)│     │
│  └────────────┘ └────────────┘ └──────────────┘     │
│                                                      │
│  引擎层不包含任何学科特定逻辑                            │
└──────────────────────────────────────────────────────┘
```

### 3.2 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 渲染方式 | **预构建**（MD→JSON），非运行时渲染 | 交互逻辑（判题、校验）无法在运行时 Markdown 渲染中实现 |
| 内容格式 | **标准化 5 模块 MD**，非自定义 DSL | 教师只需会 Markdown，无需学习额外语法 |
| 模块注册 | **注册表模式**（ContentBlockRegistry, ExerciseRegistry） | 新增题型/内容类型无需改引擎代码 |
| 科目扩展 | **features 开关 + 路径配置** | 化学启用 chemistryHelper，数学不需要 |
| 状态管理 | **无全局状态库** | 只有 localStorage 进度需要共享，React Context 足够 |

---

## 四、数据模型

### 4.1 course.json — 科目配置文件（唯一手动维护的文件）

```typescript
interface CourseConfig {
  // 科目元信息
  course: {
    name: string;           // "初中化学"
    icon: string;           // "⚗️" 或 SVG 路径
    subtitle: string;       // "人教版九年级全一册"
    color: string;          // 主题色 "#6C63FF"
  };

  // 课时排课
  schedule: {
    weeks: number;          // 2 周
    weekLabels: string[];   // ["第一周", "第二周"]
    weekTitles: string[];   // ["走进化学世界", "物质构成的奥秘"]
  };

  // 课时列表
  lessons: LessonMeta[];

  // 功能开关（控制引擎层行为）
  features: {
    katex: boolean;             // 是否需要公式渲染
    chemistryHelper: boolean;   // 是否需要化学式容错（CO2=CO₂）
    // 后续可扩展：
    // diagramRenderer: boolean;  // 物理/几何图形渲染
    // proofBlock: boolean;       // 数学证明块
  };

  // 路径配置
  paths: {
    contentDir: string;     // "docs/curriculum"（MD 源文件目录）
    outputDir: string;      // "src/data/lessons"（JSON 输出目录）
  };
}

interface LessonMeta {
  id: number;               // 课时编号
  title: string;            // "走进化学世界"
  unit: string;             // "第一单元"
  week: number;             // 所在周
  day: number;              // 所在天的序号
  file: string;             // MD 文件名 "lesson-01-走进化学世界.md"
}
```

### 4.2 lesson-XX.json — 单课数据（构建产物，自动生成）

```typescript
interface LessonData {
  meta: {
    id: number;
    slug: string;           // "lesson-01-走进化学世界"
    title: string;
    unit: string;
    week: number;
    day: number;
  };

  // 五个固定模块（对应 MD 中的五个 H2）
  objectives: Objective[];
  knowledge: KnowledgeSection[];
  examples: Example[];
  exercises: Exercise[];
  summary: SummaryNode[];
}

// ── 学习目标 ──
interface Objective {
  text: string;             // 目标描述
  isKeyPoint: boolean;      // ★ 重点标记
}

// ── 知识点 ──
interface KnowledgeSection {
  title: string;            // 分区标题，如 "核心概念"
  defaultExpanded: boolean; // 默认是否展开
  blocks: ContentBlock[];   // 内容块数组
}

// ── 最核心的抽象：内容块 ──
type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: "warning" | "tip" | "note" | "mnemonic"; title: string; content: string }
  | { type: "equation"; latex: string; display: boolean }  // inline 或 block
  | { type: "list"; ordered: boolean; items: string[] };

// ── 典型例题 ──
interface Example {
  title: string;            // "例1：化学变化判断"
  problem: ContentBlock[];
  solution: ContentBlock[]; // 解析
  answer: string;           // "A"
  source?: string;          // "2024北京中考"（可选）
}

// ── 课后练习 ──
type Exercise =
  | ChoiceExercise
  | FillExercise
  | ShortAnswerExercise;

interface ChoiceExercise {
  type: "choice";
  id: string;               // "ex-1-1"
  stem: string;             // 题干
  options: { label: string; text: string }[];
  answer: string;           // 正确选项 label
  analysis: string;         // 解析
  source?: string;          // 中考来源
}

interface FillExercise {
  type: "fill";
  id: string;
  segments: string[];       // ["化学式 ", "___1___", " 中 C 的化合价为 ", "___2___"]
  blanks: FillBlank[];
  analysis: string;
}

interface FillBlank {
  index: number;
  answer: string;           // 标准答案
  alternatives?: string[];  // 容错答案 ["CO2", "CO₂"]
}

interface ShortAnswerExercise {
  type: "short_answer";
  id: string;
  question: string;
  referenceAnswer: string;  // 参考答案
  scoringPoints?: string[]; // 得分要点（可选）
}

// ── 本课小结 ──
interface SummaryNode {
  text: string;
  children?: SummaryNode[];  // 树状结构
}
```

### 4.3 学习进度（localStorage，key: `"lesson-progress"`）

```typescript
interface UserProgress {
  version: 1;               // 结构版本号，方便后续迁移
  lessons: Record<string, LessonProgress>;
  stats: ProgressStats;
}

interface LessonProgress {
  knowledgeRead: boolean;        // 是否阅读过知识点
  exerciseResults: Record<string, ExerciseResult>;
  completedAt?: number;          // Unix 时间戳
}

interface ExerciseResult {
  answered: boolean;
  correct: boolean;
  userAnswer: string;
  timestamp: number;
}

interface ProgressStats {
  totalCompleted: number;   // 完成课时数
  totalCorrect: number;     // 正确题数
  totalAttempted: number;   // 总尝试题数
}
```

---

## 五、模块化设计

### 5.1 内容块注册表（ContentBlockRegistry）

框架的核心扩展机制。每个 `ContentBlock.type` 对应一个渲染组件：

```typescript
// 引擎层定义接口
interface ContentBlockRenderer {
  type: string;
  component: React.FC<{ block: ContentBlock }>;
}

// 注册方式：在各科目的 course.json 中无需配置，
// 转换脚本自动识别 MD 中的块类型，渲染器按 type 分发
const blockRegistry: Record<string, ContentBlockRenderer> = {
  paragraph: ParagraphBlock,
  table:     TableBlock,
  callout:   CalloutBlock,
  equation:  EquationBlock,
  list:      ListBlock,
  // 科目扩展示例：
  // proof:     ProofBlock,        // 数学证明块
  // diagram:   DiagramBlock,      // 物理电路图
};

// 渲染时：
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, i) => {
    const Comp = blockRegistry[block.type];
    return Comp ? <Comp key={i} block={block} /> : <p key={i}>未知块类型: {block.type}</p>;
  });
}
```

### 5.2 题型注册表（ExerciseRegistry）

```typescript
interface ExerciseRenderer {
  type: string;
  component: React.FC<{
    exercise: Exercise;
    onAnswer: (result: ExerciseResult) => void;
    savedResult?: ExerciseResult;  // 从 localStorage 恢复的作答记录
  }>;
}

const exerciseRegistry: Record<string, ExerciseRenderer> = {
  choice:       ChoiceExercise,
  fill:         FillExercise,
  short_answer: ShortAnswerExercise,
  // 科目扩展：
  // balance_eq:   BalanceEquationExercise,  // 化学配平
  // drag_sort:    DragSortExercise,         // 排序题
};
```

### 5.3 模块化设计原则

```
引擎层提供：              内容层提供：
┌─────────────┐         ┌────────────────┐
│ 模板 (Layout)│         │ course.json     │
│ 渲染器注册表  │  ◄───  │ (定义科目 + 路径) │
│ 路由          │         └────────────────┘
│ 进度管理       │         ┌────────────────┐
│ 存储          │         │ MD 教案          │
└─────────────┘         │ (定义内容)        │
                         └────────────────┘
                          ┌─────────────────┐
                          │ 科目扩展（可选）   │
                          │ proof/diagram/   │
                          │ balance_eq etc.  │
                          └─────────────────┘
```

---

## 六、MD 教案规范

### 6.1 文件命名

```
docs/curriculum/lesson-{NN}-{标题}.md
例：docs/curriculum/lesson-01-走进化学世界.md
```

### 6.2 文件结构（强约束）

```markdown
# 第1课：走进化学世界                          ← 固定 H1

## 一、学习目标                                  ← 固定 H2（序号可变 "一/二/三" 或 "1/2/3"）
- 理解物理变化和化学变化的概念                      ← 列表项
- ★掌握化学变化的判断方法                          ← ★ 标记重点

## 二、知识点梳理                                ← 固定 H2
### 核心概念                                    ← 任意的 H3 分区（可选）
| 概念 | 定义 | 示例 |                           ← 表格
|------|------|------|
| 物理变化 | 没有新物质生成 | 水的三态变化 |

> ⚠️ 易错提醒：爆炸不一定是化学变化...               ← Callout（以 >  开头的 blockquote）

$2H_2 + O_2 \rightarrow 2H_2O$                  ← LaTeX 公式（$...$ 或 $$...$$）

## 三、典型例题                                  ← 固定 H2
### 例1
...（题干 + 选项 + 解析 + 答案）

## 四、课后练习                                  ← 固定 H2
### 选择题
1. 下列变化中属于化学变化的是（  ）
   A. 酒精挥发
   B. 铁钉生锈
   C. 冰雪融化
   D. 灯泡发光
   
   **答案**：B
   **解析**：铁钉生锈有新物质铁锈生成...
   **来源**：2024北京中考

### 填空题
2. 化学式 $CO_2$ 中 C 的化合价为 `___`，O 的化合价为 `___`。
   **答案**：+4, -2

### 简答题
3. ...（题干）
   **参考答案**：...

## 五、本课小结                                  ← 固定 H2
- 化学变化：有新物质生成
  - 判断依据：颜色变化、气体生成、沉淀...             ← 缩进表示树状层次
```

### 6.3 解析规则

| MD 语法 | 识别为 | ContentBlock.type |
|---------|-------|-------------------|
| 普通段落 | → | `paragraph` |
| `\| --- \|` 分隔线 | → | `table` |
| `> 关键词：` 开头的 blockquote | → | `callout` (按关键词分 variant) |
| `$...$` 或 `$$...$$` | → | `equation` |
| `- item` 或 `1. item` | → | `list` |
| `A. xxx` (选项) | → | `choice_exercise` |
| `______` 或 `\`___\`` | → | `fill_exercise` |
| `**参考答案**：` 段落 | → | `short_answer_exercise` |

---

## 七、项目目录结构

```
frontend/
├── public/
│   └── favicon.svg
│
├── docs/curriculum/              ← 【内容层】MD 教案源文件
│   ├── lesson-01-xxx.md
│   ├── lesson-02-xxx.md
│   └── ...
│
├── scripts/                      ← 转换工具
│   └── convert-md.mjs            ← MD → JSON 转换脚本
│
├── src/
│   ├── data/                     ← 【构建产物】生成的 JSON
│   │   ├── lessons/              ← lesson-01.json ~ lesson-NN.json
│   │   └── index.ts              ← 课时索引（自动生成）
│   │
│   ├── components/               ← 【引擎层】通用组件
│   │   ├── layout/               ← 布局（AppLayout, TopNav, SideNav）
│   │   ├── knowledge/            ← 知识点展示
│   │   │   ├── ContentRenderer.tsx    ← 内容块分发器
│   │   │   ├── registry.ts            ← 内容块注册表
│   │   │   └── blocks/               ← 各类内容块组件
│   │   │       ├── ParagraphBlock.tsx
│   │   │       ├── TableBlock.tsx
│   │   │       ├── CalloutBlock.tsx
│   │   │       ├── EquationBlock.tsx
│   │   │       └── ListBlock.tsx
│   │   ├── exercises/            ← 互动练习
│   │   │   ├── ExerciseEngine.tsx     ← 题型分发器
│   │   │   ├── registry.ts            ← 题型注册表
│   │   │   ├── AnswerReveal.tsx       ← 答案解析展开面板
│   │   │   └── types/                 ← 各题型组件
│   │   │       ├── ChoiceExercise.tsx
│   │   │       ├── FillExercise.tsx
│   │   │       └── ShortAnswerExercise.tsx
│   │   ├── progress/             ← 进度组件
│   │   │   ├── LessonCard.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   └── StatsOverview.tsx
│   │   └── ui/                   ← 基础 UI 组件
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Collapse.tsx
│   │       └── KaTeX.tsx         ← KaTeX 渲染封装
│   │
│   ├── hooks/                    ← 状态管理
│   │   ├── useProgress.ts        ← 进度读写（localStorage）
│   │   ├── useLesson.ts          ← 课时数据加载
│   │   └── useExercise.ts        ← 单题作答状态
│   │
│   ├── pages/                    ← 页面
│   │   ├── HomePage.tsx          ← 首页（课时网格）
│   │   ├── LessonPage.tsx        ← 课时详情页
│   │   └── ProgressPage.tsx      ← 进度统计页
│   │
│   ├── utils/                    ← 工具函数
│   │   ├── storage.ts            ← localStorage 封装（版本迁移）
│   │   └── chemistry.ts          ← 化学式标准化函数（受 features.chemistryHelper 控制）
│   │
│   ├── config/                   ← 应用配置
│   │   └── course.ts             ← 从 course.json 导入，提供类型化配置对象
│   │
│   ├── types/                    ← 全局类型定义
│   │   └── index.ts              ← LessonData, ContentBlock, Exercise 等
│   │
│   ├── App.tsx                   ← 根组件（路由 + Context Provider）
│   ├── main.tsx                  ← 入口
│   └── index.css                 ← Tailwind 入口
│
├── course.json                   ← 【内容层】科目配置（唯一可变文件）
├── course-example-math.json      ← 数学科目示例配置
├── course-example-physics.json   ← 物理科目示例配置
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 八、路由设计

| 路由 | 页面 | 数据来源 | 说明 |
|------|------|---------|------|
| `/` | `HomePage` | `src/data/index.ts` | 课时网格，卡片显示完成状态和正确率 |
| `/lesson/:id` | `LessonPage` | `src/data/lessons/lesson-{id}.json` | 5 模块完整展示 |
| `/progress` | `ProgressPage` | `localStorage` → `UserProgress.stats` | 学习统计面板 |

React Router 配置：

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
```

---

## 九、技术栈

| 层次 | 选型 | 版本 | 说明 |
|------|------|------|------|
| 构建工具 | Vite | ^5.x | 开发热更新 + 生产构建 |
| UI 框架 | React | ^18.x | 函数组件 + Hooks |
| 类型系统 | TypeScript | ^5.x | 严格模式 |
| 路由 | React Router | ^6.x | SPA 路由 |
| 样式 | Tailwind CSS | ^4.x | 无需 tailwind.config.js，零运行时 |
| 公式渲染 | KaTeX | latest | 渲染 $LaTeX$ 公式 |
| 状态管理 | React Context | 内置 | 仅用于跨页面共享进度 |
| 数据持久化 | localStorage | 内置 | 纯前端存储 |
| 图标 | Lucide React | latest | 轻量 SVG 图标库 |

### 依赖清单

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.28.0",
    "katex": "^0.16.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

---

## 十、转换管道设计（convert-md.mjs）

### 10.1 处理流程

```
MD 文件
  │
  ├─ 1. 读取文件，按 H2 切分为 [模块名, 内容] 对
  │     "## 一、学习目标" / "## 二、知识点梳理" / ...
  │
  ├─ 2. 按模块类型分发到对应解析器
  │     ├─ 学习目标 → parseObjectives()
  │     ├─ 知识点梳理 → parseKnowledge() → [KnowledgeSection]
  │     ├─ 典型例题 → parseExamples()
  │     ├─ 课后练习 → parseExercises() → [Choice|Fill|ShortAnswer]
  │     └─ 本课小结 → parseSummary() → SummaryNode[]
  │
  ├─ 3. 内容块解析（parseKnowledge 内部）
  │     按行逐行扫描 → 识别段落/表格/Callout/方程式/列表
  │     输出 ContentBlock[]
  │
  ├─ 4. 写入 JSON
  │     src/data/lessons/lesson-{id}.json
  │
  └─ 5. 聚合：生成 src/data/index.ts
        import lesson01 from './lessons/lesson-01.json';
        export const lessonIndex = [lesson01, lesson02, ...];
```

### 10.2 配置集成

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "convert": "node scripts/convert-md.mjs",
    "build": "npm run convert && vite build",
    "preview": "vite preview"
  }
}
```

构建前自动执行转换，确保数据始终是最新的。

---

## 十一、部署方案

| 平台 | 方式 | 成本 |
|------|------|------|
| **Vercel**（推荐） | 连接 GitHub 仓库，自动检测 Vite 项目 | 免费额度足够 |
| **GitHub Pages** | `npm run build` → 推送 `dist/` → GitHub Actions | 免费 |
| **Cloudflare Pages** | 连接 GitHub 仓库 | 免费 |

部署产物：纯静态 HTML + JS + CSS + JSON，**零运行时依赖，零服务器成本**。

---

## 十二、实施计划

| 阶段 | 内容 | 产出 |
|:----:|------|------|
| P1 | **项目脚手架** | Vite + React + TS + Tailwind + Router + KaTeX 环境搭建，AppLayout + 基础路由 |
| P2 | **数据模型 + 类型** | `types/index.ts` TypeScript 定义，`course.json` 编写 + 类型校验 |
| P3 | **转换脚本** | `convert-md.mjs`：5 模块分割器 + 内容块解析器 + 练习题解析器 |
| P4 | **内容块渲染器** | ContentRenderer + registry + 5 个基础 block 组件 |
| P5 | **练习引擎** | ExerciseEngine + registry + 3 个题型组件 + chemistry.ts 容错 |
| P6 | **进度系统** | useProgress Hook + storage.ts + 完成度计算 + 正确率统计 |
| P7 | **首页** | LessonCard 网格 + ProgressRing + 状态指示 |
| P8 | **课时页面组装** | LessonPage 完整拼装 + 侧边锚点导航 + 上/下课时导航 |
| P9 | **响应式 + 打磨** | 手机/平板/桌面三种断点适配 + 动画微调 |
| P10 | **多科目验证** | 用化学 15 课 + 数学示例配置验证换科流程 + 部署 |

---

## 附录 A：与 Qoder 方案的差异汇总

| 项目 | Qoder 方案 | WorkBuddy 修改 | 原因 |
|------|-----------|---------------|------|
| 科目抽象 | 写死化学 10 课 | 引入 `course.json` + `CourseConfig` | 换科需求 |
| 模块化 | 无注册机制 | ContentBlockRegistry + ExerciseRegistry | 可扩展性 |
| MD 规范 | 仅描述结构 | 正式化为含解析规则的规范文档 | 其他教师可参考编写 |
| ContentBlock | 定义在注释中 | 正式定义在 types/index.ts | 类型安全 |
| 题型扩展 | 仅内置 3 种 | ExerciseRegistry 注册模式 | 科目专属题型 |
| Tailwind | v3 | v4 | 更轻量，无需配置文件 |
| 依赖 | 未明确 | 精确的 package.json | 可直接安装 |
| 部署 | 提及 Vercel | 详细的 3 种部署方案对比 | 给用户选择 |
| 实施 | 7 个 Task | 10 个 Phase（拆分更细） | 更可行的开发节奏 |
