# SuperTeacher-HTML 项目结构说明

> 初中多学科互动教学网页应用，基于 React + Vite + Tailwind CSS v4 构建。
> 数据流：AI 直接生成 JSON → React 渲染

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
| `vite.config.ts` | Vite 构建配置，含 Tailwind CSS v4 插件和 `@/` 路径别名 |
| `index.html` | SPA 入口 HTML |
| `package.json` | 依赖管理，核心脚本：`dev`、`build`、`validate` |
| `tsconfig.app.json` | TypeScript 应用配置 |
| `vercel.json` | Vercel 部署配置（SPA 路由回退） |
| `netlify.toml` | Netlify 部署配置（SPA 路由 + 静态资源缓存） |
| `public/gifs/` | 答题 GIF 动画文件（correct.gif / wrong.gif） |
| `.agents/` | MiMoCode AI skill 目录（project-manager） |
| `.qoder/` | Qoder AI 工作目录（generate-lesson skill + repowiki） |

## 常用命令

```bash
npm run dev        # 启动 Vite 开发服务器
npm run build      # vite build（生产构建）
npm run validate   # 校验所有课程 JSON
npm run preview    # 预览生产构建
```

---

## `docs/` — 文档与课程原稿

| 文件/目录 | 说明 |
|-----------|------|
| `curriculum/` | **课程 Markdown 原稿**（旧版 10 课时），参考用 |
| `curriculum-v2.0/` | 课程原稿 v2（新格式） |
| `curriculum-format.md` | MD 格式详细说明（block 类型、公式写法等） |
| `curriculum-format-liberal-arts.md` | **文科课程规范**（timeline、quote 等） |
| `curriculum/history-lesson-template.json` | **历史课程范本** |
| `design/preview/` | **静态 HTML 设计稿**，用于在改 React 代码前验证视觉效果 |
| `v1.3-plan.md` ~ `v1.9-plan.md` | 各版本规划文档 |
| `v1.3-implementation.md` ~ `v1.9-implementation.md` | 各版本实施进度 |
| `roadmap.md` | 项目路线图 |
| `version.md` | 版本更新日志 |
| `index.md` | 本文件 — 项目结构说明 |

---

## `scripts/` — 构建脚本

| 文件 | 说明 |
|------|------|
| `validate-lesson.mjs` | 课程 JSON 校验脚本（扫描 courses/ 目录，检查知识点和练习题格式） |

### 数据流

```
AI 直接生成 JSON  ──→  src/data/courses/{subject}/lesson-XX.json
```

---

## `src/` — 前端源码

### `src/types/index.ts`

全局 TypeScript 类型定义，是整个项目的数据契约：

- **课程配置**：`CourseConfig`（含 `id` 字段）、`LessonMeta`
- **课时数据**：`LessonData`、`Objective`、`KnowledgeSection`
- **内容块**（核心抽象）：`ContentBlock` = `ParagraphBlock | TableBlock | CalloutBlock | EquationBlock | ListBlock | AnimationBlock | TimelineBlock`
- **例题/练习**：`Example`、`Exercise`（`ChoiceExercise | TrueFalseExercise | FillExercise | ShortAnswerExercise`）
- **学习进度**：`UserProgress`、`LessonProgress`、`ExerciseResult`
- **游戏状态**：`GameState`（心数 + 解锁进度）

### `src/data/` — 课时数据（多学科架构）

```
src/data/
├── courses/
│   ├── chemistry/           ← 初中化学（19 课，2024人教版）
│   │   ├── course.json      ← 课程配置（id: "chemistry"）
│   │   ├── lesson-00.json   ← 绪论
│   │   ├── lesson-01.json ~ lesson-18.json
│   │   └── *-exercises.json
│   ├── physics/             ← 初二物理（12 课，2024人教版）
│   │   ├── course.json
│   │   └── lesson-01.json ~ lesson-12.json
│   ├── math/                ← 初一数学（占位）
│   │   └── course.json
│   ├── history-7a/          ← 七年级上册历史（20 课，2024人教版）
│   ├── history-7b/          ← 七年级下册历史（18 课，2024人教版）
│   ├── history-8a/          ← 八年级上册历史（17 课，2024人教版）
│   └── history-8b/          ← 八年级下册历史（17 课，2024人教版）
├── index.ts                 ← import.meta.glob 自动扫描，聚合导出
```

**加新学科**：在 `courses/` 下新建目录 + 放入文件，首页自动出现，无需改代码。

### `src/pages/` — 页面组件

| 文件 | 说明 |
|------|------|
| `HomePage.tsx` | 首页：学科选择卡片页 |
| `CoursePage.tsx` | 课程页：某学科的课时列表 |
| `LessonPage.tsx` | 知识点页面（`/course/:courseId/lesson/:id`）：Tab UI 四区块浏览 |
| `GamePage.tsx` | 游戏页面（`/course/:courseId/lesson/:id/game`）：一题一屏 + 反馈动画 |

### `src/components/` — UI 组件

#### `components/layout/`

| 文件 | 说明 |
|------|------|
| `AppLayout.tsx` | 全局布局：顶部导航栏 + 内容区，支持多学科导航 |

#### `components/knowledge/`

| 文件 | 说明 |
|------|------|
| `SectionObjectives.tsx` | 学习目标区（卡片式目标） |
| `SectionKnowledge.tsx` | 知识点卡片区（卡片流） |
| `ContentRenderer.tsx` | 内容块分发器 |
| `SectionExamples.tsx` | 典型例题区（翻卡式自测） |
| `SectionSummary.tsx` | 本课小结区（树状结构） |

#### `components/knowledge/blocks/`

| 文件 | 说明 |
|------|------|
| `ParagraphBlock.tsx` | 段落块：KaTeX + 加粗 + 斜体 |
| `TableBlock.tsx` | 表格块：圆角卡片 + renderInline |
| `CalloutBlock.tsx` | 提示框块：5 种变体（warning/tip/note/mnemonic/quote） |
| `EquationBlock.tsx` | 公式块：KaTeX 渲染 |
| `ListBlock.tsx` | 列表块：自定义标记 |
| `AnimationBlock.tsx` | GIF 动画块 |
| `TimelineBlock.tsx` | 时间线块（历史事件、朝代更替等） |

#### `components/exercises/`

| 文件 | 说明 |
|------|------|
| `ExerciseEngine.tsx` | 练习引擎 |
| `AnswerReveal.tsx` | 解析展开组件 |
| `AnswerAnimation.tsx` | 答题 GIF 动画 |
| `types/ChoiceExercise.tsx` | 选择题 |
| `types/TrueFalseExercise.tsx` | 判断题 |
| `types/FillExercise.tsx` | 填空题 |
| `types/ShortAnswerExercise.tsx` | 简答题 |

### `src/hooks/` — React Hooks

| 文件 | 说明 |
|------|------|
| `ProgressContext.ts` | 学习进度 Context（按 courseId 隔离） |
| `useProgress.ts` | 进度管理 Hook |
| `useGame.ts` | 游戏状态 Hook（按 courseId 隔离） |

### `src/utils/` — 工具函数

| 文件 | 说明 |
|------|------|
| `formula.ts` | 化学公式标准化 |
| `storage.ts` | localStorage 读写（key 含 courseId 前缀） |
| `renderInline.tsx` | Markdown 内联渲染 |

### `src/` 根文件

| 文件 | 说明 |
|------|------|
| `main.tsx` | React 入口 |
| `App.tsx` | 路由配置（`/` 学科选择 → `/course/:courseId` → `/course/:courseId/lesson/:id`） |
| `index.css` | 全局 CSS：Apple 风主题 + Tailwind v4 `@theme` |

---

## `reference/` — 参考资料

| 文件/目录 | 说明 |
|-----------|------|
| `old-lessons/` | 旧版 10 课化学 JSON 备份 |
| `LiaScript项目思路借鉴.md` | LiaScript 竞品分析 |
| `SuperTeacher-Qoder.md` | 项目初始规划文档 |
| `SuperTeacher框架竞品分析报告.md` | 竞品分析报告 |
| `SuperTeacher项目启动方案.md` | 项目启动方案 |

---

## 关键架构决策

1. **数据与渲染分离**：AI 直接生成课时 JSON → React 渲染
2. **内容块抽象**（`ContentBlock`）：6 种 block 类型，新增类型只需扩展 union + 添加 Block 组件
3. **纯前端静态部署**：无后端，进度 + 游戏状态存 localStorage，部署到 Vercel
4. **设计稿先行**：`docs/design/preview/` 里的静态 HTML 是视觉决策源头
5. **Tailwind CSS v4**：`@theme` 语义化颜色变量，组件用 token 而非硬编码色值
6. **多学科架构**（v1.8）：`courses/` 目录按学科分组，`import.meta.glob` 自动发现，加新学科零代码改动
7. **renderInline 渲染规范**：所有 `text` 类型字段输出时**必须**调用 `renderInline()`，支持 `$...$` KaTeX 公式和 `**bold**`
8. **AI Skill 体系**：project-manager（版本管理）+ generate-lesson（课程生成），全局安装在 `~/.agents/skills/`
9. **文科课程规范**（v2.1）：`curriculum-format-liberal-arts.md` 覆盖 timeline、quote 等文科专属内容块
10. **Netlify 部署**（v2.1）：`netlify.toml` 配置 SPA 路由和静态资源缓存
