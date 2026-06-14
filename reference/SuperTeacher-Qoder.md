# 初三化学暑假预习互动网页 — 实现方案

## Context

现有 10 课时的 Markdown 化学教案（`docs/curriculum/`），结构统一：学习目标 → 知识点梳理 → 典型例题 → 课后练习（含中考真题）→ 本课小结。Markdown 格式缺乏交互性，不适合学生自学。需要将其转为互动网页，让学生可以折叠知识点、做题即时判题、追踪学习进度。

## 技术架构

| 层次 | 选型 | 说明 |
|------|------|------|
| 构建工具 | Vite 5.x | 开发热更新 + 生产构建 |
| UI 框架 | React 18.x + TypeScript | 函数组件 + Hooks |
| 路由 | React Router v6 | 课时页面路由 |
| 样式 | Tailwind CSS 3.x | 原子化 CSS，响应式设计 |
| 公式渲染 | KaTeX | 渲染化学方程式中的 LaTeX |
| 状态持久化 | localStorage | 学习进度、做题记录 |
| 部署 | Vercel / GitHub Pages | 纯静态 SPA，无后端 |

**核心决策**：不使用 MDX/react-markdown 运行时渲染，而是构建时将 MD 预处理为结构化 JSON。理由：教案需要交互（选择题判题、填空验证），运行时渲染会导致交互逻辑难以嵌入。

## 数据模型

### 课时内容数据（构建时从 MD 生成 JSON）

```typescript
interface LessonData {
  meta: { id, slug, title, unit, week, day };
  objectives: { text, isKeyPoint }[];
  knowledge: KnowledgeSection[];   // 按"核心概念/重点内容/难点突破"分区
  examples: ExampleProblem[];       // 典型例题
  exercises: Exercise[];            // 课后练习（选择/填空/简答）
  summary: SummaryTree;             // 树状小结
}

// 内容块 —— 最核心的抽象
type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: "warning"|"tip"|"note"|"mnemonic"; title, content }
  | { type: "equation"; latex: string }
  | { type: "list"; ordered: boolean; items: string[] };
```

### 学习进度数据（localStorage 持久化，key: `chem-prep-progress`）

```typescript
interface UserProgress {
  lessons: {
    [lessonId]: {
      knowledgeRead: boolean;
      exerciseResults: { [exerciseId]: { answered, correct, userAnswer } };
      completedAt?: number;
    }
  };
  stats: { totalCompleted, totalCorrect, totalAttempted };
}
```

## 项目目录结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # AppLayout, TopNav, ProgressBar
│   │   ├── knowledge/       # KnowledgeSection, ChemTable, Callout, Equation, ContentRenderer
│   │   ├── exercises/       # ChoiceQuestion, FillQuestion, ShortAnswerQuestion, AnswerReveal
│   │   ├── progress/        # LessonCard, ProgressRing, StatsOverview
│   │   └── ui/              # Button, Badge, Collapse 等基础组件
│   ├── data/lessons/        # lesson-01.json ~ lesson-10.json（构建时生成）
│   ├── hooks/               # useProgress, useExercise, useLesson
│   ├── pages/               # HomePage, LessonPage, ProgressPage
│   ├── utils/               # chemistry.ts（化学式校验）, storage.ts
│   ├── App.tsx, main.tsx, index.css
├── scripts/convert-md.mjs   # MD → JSON 转换脚本
├── index.html, vite.config.ts, tailwind.config.ts, package.json
```

## 关键交互设计

### 知识点展示
- **折叠/展开**：每个知识分区可折叠，默认展开第一个，带平滑动画
- **表格**：响应式，小屏横向滚动，表头固定
- **化学方程式**：KaTeX 渲染，蓝色背景卡片居中展示
- **提示框**：易错提醒=红色左边框，解题技巧=绿色，注意=蓝色，口诀=紫色
- **★重点标注**：1-3星徽章，三星红色/二星橙色/一星黄色

### 互动练习
- **选择题**：点击即时判题，正确变绿+对勾，错误变红+高亮正确答案，自动展开解析
- **填空题**：`______` 替换为 input，逐空验证，化学式容错（CO2=CO₂）
- **简答题**：textarea + "查看参考答案"按钮，学生自评记录
- **练习报告**：5题做完后显示正确率和错题回顾

### 进度追踪
- 进入课时页 → 标记已阅读
- 5题全答完 → 标记已完成 + 记录正确率
- 正确率 < 60% → 标记"建议复习"

## 路由设计

| 路由 | 页面 |
|------|------|
| `/` | 首页：2周×5天网格布局，每课卡片显示状态和正确率 |
| `/lesson/1` ~ `/lesson/10` | 课时详情：知识点 + 例题 + 练习 + 小结 |
| `/progress` | 学习进度统计面板 |

## 数据转换策略（MD → JSON）

编写 `scripts/convert-md.mjs`，核心流程：

1. **按 H2 分割**：`## 一、学习目标` / `## 二、知识点梳理` / `## 三、典型例题` / `## 四、课后练习` / `## 五、本课小结`
2. **逐区块解析**：
   - 表格：检测 `|---|` 分隔线
   - Callout：检测 `>` blockquote + 关键词分类
   - 化学方程式：提取 `$...$` 和 `$$...$$`
   - ★标注：匹配前缀星号
   - 练习题：匹配选项（ABCD）、答案、解析、中考来源
   - 小结：解析 code block 中的缩进树
3. **输出** JSON + 索引文件

在 package.json 中配置 `"prebuild": "npm run convert"` 确保构建前自动转换。

## 实施任务分解

### Task 1：项目脚手架
- `npm create vite@latest frontend -- --template react-ts`
- 安装依赖：tailwindcss, react-router-dom, katex
- 配置 Tailwind + Vite 别名
- 搭建 AppLayout + TopNav + 基础路由

### Task 2：数据转换脚本
- 编写 `convert-md.mjs`：区块分割 → 表格/Callout/方程式/练习题解析器
- 对 10 个 MD 文件执行转换并验证输出
- 生成 `lessonIndex.ts` 索引

### Task 3：知识点展示组件
- ContentRenderer（内容块分发器）
- ChemTable（响应式表格）
- Callout（四种变体提示框）
- Equation（KaTeX 封装）
- KnowledgeSection（折叠/展开）

### Task 4：互动练习组件
- useProgress Hook + storage.ts
- ChoiceQuestion（选择题即时判题 + 动画）
- FillQuestion（填空输入验证 + 化学式容错）
- ShortAnswerQuestion（简答 + 参考答案）
- AnswerReveal（解析折叠面板）

### Task 5：首页与进度
- LessonCard（课时卡片）+ ProgressRing（环形进度）
- StatsOverview（统计面板）
- HomePage 页面组装
- SummaryTree（树状小结组件）

### Task 6：课时页面组装与打磨
- LessonPage 组装所有子组件
- 锚点侧边导航（桌面端 sticky）
- 上一课/下一课导航
- 响应式微调（手机/平板/桌面三种断点）

### Task 7：部署验证
- Vite 生产构建
- 端到端测试：10 课全部浏览 + 练习交互 + 进度持久化
- 部署到 Vercel

## 验证方案

1. **数据转换验证**：对比每个 JSON 与原始 MD，确保内容无遗漏
2. **组件渲染验证**：逐课时检查表格、方程式、提示框是否正确渲染
3. **交互验证**：每题测试选择/填空/判题/解析展开流程
4. **进度验证**：做题后刷新页面，确认 localStorage 数据持久化
5. **响应式验证**：Chrome DevTools 模拟手机/平板/桌面三种尺寸

## 关键文件路径

| 用途 | 路径 |
|------|------|
| 教案源文件 | `docs/curriculum/lesson-01-走进化学世界.md` ~ `lesson-10-燃料及其利用.md` |
| 前端项目（待创建） | `frontend/` |
| MD 转换脚本 | `frontend/scripts/convert-md.mjs` |
| 生成数据 | `frontend/src/data/lessons/lesson-01.json` ~ `lesson-10.json` |

## 风险与应对

| 风险 | 应对 |
|------|------|
| MD 格式不完全统一（第7/8课更长） | 转换脚本做容错，异常数据人工修正 |
| KaTeX 不支持部分 LaTeX 宏 | 提前测试所有方程式，不兼容的用替代语法 |
| 填空题化学式输入多样（CO2 vs CO₂） | chemistry.ts 标准化函数统一处理后比较 |
