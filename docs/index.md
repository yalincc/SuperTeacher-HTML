# SuperTeacher-HTML 项目结构说明

> 初中化学互动教学网页应用，基于 React + Vite + Tailwind CSS v4 构建。
> 数据流：Markdown 课程文档 → 脚本转换 → JSON → React 渲染

---

## 🤖 AI 快速上手指南

**读取顺序**（按顺序读，每个文件只回答一个问题）：

| 顺序 | 文件 | 回答的问题 | 何时读 |
|:----:|------|------------|--------|
| 1 | `docs/index.md`（本文件） | 项目是什么？文件在哪？ | 每次接手时 |
| 2 | `docs/version.md` | 最近改了什么？ | 只读最新版本条目 |
| 3 | `docs/roadmap.md` | 接下来做什么？ | 需要知道下一步时 |
| 4 | `docs/vX.X-implementation.md` | 某版本做到哪了？ | 纯状态看板，只看 ✅/⬜ |
| 5 | `docs/vX.X-plan.md` | 为什么这样设计？ | 仅在需要理解设计决策时 |

**文档分工原则**：
- `version.md` = **唯一 changelog**，所有改动只在这里记录
- `implementation.md` = 轻量状态看板（< 50 行），不堆代码
- `plan.md` = 技术方案，确认后锁定，偏离时注明
- `roadmap.md` = 全局阶段进度 + 待办

**更新时的标准动作**：
1. `version.md` 加新版本条目
2. `implementation.md` 更新 ✅/⬜
3. `roadmap.md` 更新全局进度
4. 有新设计决策 → 更新对应 `plan.md`

---

## 根目录

| 文件/目录 | 说明 |
|-----------|------|
| `course.json` | **课程总配置**：课时列表、周计划、功能开关、路径配置 |
| `vite.config.ts` | Vite 构建配置，含 Tailwind CSS v4 插件和 `@/` 路径别名 |
| `index.html` | SPA 入口 HTML |
| `package.json` | 依赖管理，核心脚本：`dev`、`convert`、`build` |
| `tsconfig.app.json` | TypeScript 应用配置 |
| `vercel.json` | Vercel 部署配置（SPA 路由回退） |

## 常用命令

```bash
npm run dev        # 启动 Vite 开发服务器
npm run convert    # 运行 MD→JSON 转换脚本
npm run build      # convert + vite build（生产构建）
npm run preview    # 预览生产构建
```

---

## `docs/` — 文档与课程原稿

| 文件/目录 | 说明 |
|-----------|------|
| `curriculum/` | **课程 Markdown 原稿**（10 个课时），是内容数据的唯一来源 |
| `curriculum/lesson-XX-xxx.md` | 单课时 MD 文件，结构：`## 一、学习目标` → `## 二、知识点梳理` → `## 三、典型例题` → `## 四、课后练习` → `## 五、本课小结` |
| `curriculum/README.md` | 课程原稿编写规范 |
| `curriculum-format.md` | MD 格式详细说明（block 类型、公式写法等） |
| `design/preview/` | **静态 HTML 设计稿**，用于在改 React 代码前验证视觉效果 |
| `design/preview/chemistry-skin-preview.html` | "实验橙"主题皮肤设计稿（含所有组件的视觉预览） |
| `system-design.md` | 系统设计文档 v1 |
| `system-design-v2.md` | 系统设计文档 v2 |
| `v1.3-plan.md` | v1.3 版本规划 |
| `v1.3-implementation.md` | v1.3 实施进度跟踪（含完成状态和日期） |
| `roadmap.md` | 项目路线图 |
| `version.md` | 版本号记录 |
| `index.md` | 本文件 — 项目结构说明 |

---

## `scripts/` — 构建脚本

| 文件 | 说明 |
|------|------|
| `convert-md.mjs` | **核心转换脚本**：读取 `course.json` + `docs/curriculum/*.md` → 生成 `src/data/lessons/*.json` + `src/data/index.ts` |
| `fix-md-format.mjs` | **MD 格式修正脚本**：修正 LaTeX 公式格式（`\text{}` 包裹、内联公式位置），在 convert 之前运行 |

### 数据流

```
docs/curriculum/*.md  ──→  scripts/convert-md.mjs  ──→  src/data/lessons/*.json
course.json           ──→                             ──→  src/data/index.ts
```

---

## `src/` — 前端源码

### `src/types/index.ts`

全局 TypeScript 类型定义，是整个项目的数据契约：

- **课程配置**：`CourseConfig`、`LessonMeta`
- **课时数据**：`LessonData`、`Objective`、`KnowledgeSection`
- **内容块**（核心抽象）：`ContentBlock` = `ParagraphBlock | TableBlock | CalloutBlock | EquationBlock | ListBlock`
- **例题/练习**：`Example`、`Exercise`（`ChoiceExercise | TrueFalseExercise | FillExercise | ShortAnswerExercise`）
- **学习进度**：`UserProgress`、`LessonProgress`、`ExerciseResult`

### `src/config/` — 应用配置

| 文件 | 说明 |
|------|------|
| `course.ts` | 导入 `course.json` 并导出带类型的课程配置 |
| `index.ts` | 配置统一导出入口 |

### `src/data/` — 课时数据（自动生成）

| 文件 | 说明 |
|------|------|
| `lessons/lesson-XX.json` | **自动生成的课时 JSON**（由 `convert-md.mjs` 生成，勿手动编辑） |
| `index.ts` | **自动生成的索引**：导入所有课时 JSON，提供 `getLessonById(id)` 查询函数 |

### `src/utils/` — 工具函数

| 文件 | 说明 |
|------|------|
| `formula.ts` | 化学公式标准化（上下标统一、科学记数法），用于填空题答案比对 |
| `storage.ts` | localStorage 读写封装：`loadProgress`、`saveProgress`、`updateExerciseResult`、`markKnowledgeRead` |
| `renderInline.tsx` | Markdown 内联渲染（`$...$` KaTeX 公式 + `**bold**` + `*italic*`），供所有文本组件使用 |

### `src/hooks/` — React Hooks

| 文件 | 说明 |
|------|------|
| `ProgressContext.ts` | 学习进度的 React Context（`answerExercise`、`markRead`、`getExerciseResults`、`isLessonCompleted`、`stats`） |
| `useProgress.ts` | 进度管理 Hook，封装 localStorage 读写，自动持久化 |

### `src/pages/` — 页面组件

| 文件 | 说明 |
|------|------|
| `HomePage.tsx` | 首页：课时卡片列表，显示完成状态和进度条 |
| `LessonPage.tsx` | 课时页：按 `一~五` 顺序渲染 `SectionObjectives → SectionKnowledge → SectionExamples → SectionExercises → SectionSummary` |

### `src/components/` — UI 组件

#### `components/layout/` — 布局

| 文件 | 说明 |
|------|------|
| `AppLayout.tsx` | 全局布局：顶部导航栏 + 内容区，`max-w-[900px]` 居中，橙色主题 |

#### `components/knowledge/` — 知识点展示

| 文件 | 说明 |
|------|------|
| `SectionObjectives.tsx` | 一、学习目标区（星标重点 + 普通目标列表） |
| `SectionKnowledge.tsx` | 二、知识点卡片区（可折叠，暖黄背景 + 左侧橙条） |
| `ContentRenderer.tsx` | **内容块分发器**：根据 `block.type` 分发到对应的 Block 组件 |
| `SectionExamples.tsx` | 三、典型例题区（题目 + 答案 + 解析） |
| `SectionSummary.tsx` | 五、本课小结区（树状结构） |

#### `components/knowledge/blocks/` — 内容块组件

| 文件 | 说明 |
|------|------|
| `ParagraphBlock.tsx` | 段落块：支持 KaTeX 公式 + 加粗 + 斜体内联渲染 |
| `TableBlock.tsx` | 表格块：橙色表头 + 斑马纹 |
| `CalloutBlock.tsx` | 提示框块：4 种变体（warning/tip/note/mnemonic），渐变背景 |
| `EquationBlock.tsx` | 公式块：KaTeX 渲染，暖黄背景 + 左侧橙条 |
| `ListBlock.tsx` | 列表块：有序/无序，橙色标记 |

#### `components/exercises/` — 练习题

| 文件 | 说明 |
|------|------|
| `SectionExercises.tsx` | 四、课后练习区（按题型分组） |
| `ExerciseEngine.tsx` | 练习引擎：管理答题状态、提交验证 |
| `AnswerReveal.tsx` | 解析展开组件（橙色配色 + 淡入动画） |
| `types/ChoiceExercise.tsx` | 选择题：卡片式选项、状态驱动样式（选中橙/正确绿/错误红） |
| `types/TrueFalseExercise.tsx` | 判断题 |
| `types/FillExercise.tsx` | 填空题（含公式标准化比对） |
| `types/ShortAnswerExercise.tsx` | 简答题 |

#### `components/ui/` — 通用 UI

| 文件 | 说明 |
|------|------|
| `KaTeX.tsx` | KaTeX 公式渲染封装（inline 和 display 模式） |

### `src/` 根文件

| 文件 | 说明 |
|------|------|
| `main.tsx` | React 入口，挂载 `<App />` |
| `App.tsx` | 路由配置（`/` → HomePage，`/lesson/:id` → LessonPage），ProgressProvider 包裹 |
| `index.css` | 全局 CSS：Tailwind v4 `@theme` 变量（橙色主题色系）+ 自定义动画（slide-up、fade-in） |

---

## `reference/` — 参考资料

| 文件 | 说明 |
|------|------|
| `LiaScript项目思路借鉴.md` | LiaScript 竞品分析 |
| `SuperTeacher-Qoder.md` | 项目初始规划文档 |
| `SuperTeacher框架竞品分析报告.md` | 竞品分析报告 |
| `SuperTeacher项目启动方案.md` | 项目启动方案 |

---

## 关键架构决策

1. **数据与渲染分离**：课程内容用 Markdown 编写 → 脚本转 JSON → React 渲染，内容作者只需写 MD
2. **内容块抽象**（`ContentBlock`）：5 种 block 类型覆盖所有教学场景，新增类型只需扩展 union + 添加 Block 组件
3. **纯前端静态部署**：无后端，进度存 localStorage，部署到 Vercel/GitHub Pages
4. **设计稿先行**：`docs/design/preview/` 里的静态 HTML 是视觉决策源头，React 组件照搬实现
5. **Tailwind CSS v4**：使用 `@theme` 定义语义化颜色变量（primary/success/warning/error），组件用语义 token 而非硬编码色值
