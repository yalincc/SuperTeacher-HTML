# 更新日志 (Changelog)

> SuperTeacher-HTML — Markdown 教案 → 互动教学网页 转换框架

---

## v1.7 (2026-06-15)

> 知识点页面"学习仪表盘"改造 + GamePage 按钮可见性修复

### ✨ 新增
- **LessonPage 学习仪表盘** — 从线性文档 → 层次化学习页
  - **Hero 头部**：渐变背景 + 装饰圆 + 课时标签 + 大号标题 + 游戏成绩（已挑战 X/Y 正确）
  - **阅读进度条**：顶部固定细条，随滚动实时增长
  - **上下课导航**：Hero 右上角前后课快捷切换
  - **Sticky CTA**：底部固定"开始挑战"按钮，始终可见
- **SectionObjectives 任务卡风格**：重点目标 ⭐ + 普通目标区分显示
- **SectionExamples 翻卡式自测**：默认只显示题目，点击"显示答案与解析"展开，带淡入动画

### 🔧 修复
- **GamePage "下一题"按钮不可见** — 被推出视口外 57px，用户需滚动才能看到
  - 根因：`AppLayout` 外层 `<main>` 的 `py-6` padding 偏移了 `h-screen` 起始位置
  - 修复：根容器改为 `fixed inset-0 z-40` 覆盖全视口，按钮移出滚动区用 `flex-shrink-0` 固定
  - 验证：按钮 `bottom=1227px` < `innerHeight=1251px`，24px 余量，无需滚动即完全可见

### 🎨 改造文件
| 文件 | 改动 |
|------|------|
| `LessonPage.tsx` | Hero区 + 阅读进度条 + 游戏状态 + sticky CTA + 上下课导航 |
| `GamePage.tsx` | fixed inset-0 全屏容器 + "下一题"按钮独立固定 + overflow-y-auto 题目区 |
| `SectionObjectives.tsx` | 任务卡风格（重点目标 ⭐ + 普通目标） |
| `SectionExamples.tsx` | 翻卡式自测（默认隐藏答案，点击展开 + 淡入动画） |
| `SectionKnowledge.tsx` | 视觉微调（序号圆点 + 展开动画） |

---

## v1.6 (2026-06-16)

> 架构重构：知识点页面 + 游戏页面分离

### ✨ 新增
- **游戏页面** `/lesson/:id/game` — 独立练习游戏页面
  - 渐变背景 + 卡片式题目
  - 进度条（第 X 题 / 共 Y 题）
  - 完成弹窗（重新练习 / 下一课）
- **知识点页面** `/lesson/:id` — 纯展示型网页
  - 底部「开始挑战」按钮 → 跳转游戏页面
  - 移除所有游戏元素，专注阅读体验

### 🔧 重构
- **路由分离** — `/lesson/:id`（知识）+ `/lesson/:id/game`（游戏）
- **LessonPage** — 移除心数/GIF/解锁逻辑，只保留知识点展示
- **GamePage** — 新建独立游戏页面，包含所有游戏逻辑

---

## v1.5 (2026-06-15)

> 游戏化功能：过关系统 + 心数系统 + GIF 动画

### ✨ 新增
- **过关系统** — 每课 5 个模块按顺序解锁，完成当前模块才能进入下一个
  - `GameContext` — 管理心数、解锁进度
  - `LessonPage` — 模块导航栏 + 🔒 锁定状态
  - `HomePage` — 课时卡片锁定状态
  - `SectionObjectives` — 新增"已阅读，继续学习"按钮
  - `SectionExercises` — 全部答完自动解锁下一模块
  - localStorage 存档
- **心数系统** — 答错扣心，3 颗心用完弹出 Game Over 弹窗
  - `ExerciseEngine` — 答错时触发 `onWrongAnswer` 回调
  - `LessonPage` — 右上角显示 ❤️ 心数 + 动画效果
  - `LessonPage` — Game Over 全屏弹窗 + 重新开始按钮
- **GIF 动画** — 答对/答错播放 GIF 动图
  - `AnswerAnimation` — 全屏 GIF 动画组件（1.5秒自动消失）
  - `AnimationBlock` — GIF 内容块组件（用于知识点中插入 GIF）
  - `ContentRenderer` — 支持 `animation` 类型块
  - GIF 文件存放：`public/gifs/correct.gif`、`public/gifs/wrong.gif`
- **架构变更** — 废弃 convert-md.mjs，新课时由 AI 直接生成 JSON

### 🔧 修复
- **heart 重置按钮** — 心数用完后可重置重新答题

### 📝 文档
- `docs/v1.5-plan.md` — 游戏化功能规划
- `docs/curriculum-format.md` — 新增 AnimationBlock 说明

---

## v1.4 (2026-06-15)

> 前端内联渲染修复 — KaTeX 行内公式 + 全组件 renderInline 接入 ✅ 已验收通过

### ✨ 新增
- **`src/utils/renderInline.tsx` 增加 KaTeX 行内渲染** — `$...$` 化学式/符号现在能正确渲染为下标、上标等
  - 正则顺序：`$$...$$`（display）→ `$...$`（inline）→ `**bold**` → `*italic*`
  - KaTeX `throwOnError: false` 容错，语法错误时显示原始文本

### 🔧 修复
- **6 个组件接入 renderInline** — 题干、选项、解析等文本字段现在支持加粗和 LaTeX 渲染
  - `AnswerReveal.tsx` — analysis 文本
  - `ChoiceExercise.tsx` — stem + option.text
  - `TrueFalseExercise.tsx` — stem
  - `FillExercise.tsx` — segments
  - `ShortAnswerExercise.tsx` — question + referenceAnswer
  - `ListBlock.tsx` — 列表项
- **lesson-02 第 5 题参考答案** — 删除 HTML 注释标记（答案已存在于参考答案章节）

### 📝 文档
- **`docs/curriculum-format.md` 重写** — 精简冗余 + 新增「前端渲染规范」章节
  - 明确 renderInline 支持的标记（`$...$`、`**bold**`、`*italic*`）
  - 列出所有支持渲染的字段及状态
  - 标注不支持的标记（代码块、链接、图片）
  - 记录转换脚本已知问题

### ⏸️ 待后续处理
- 代码块 ``` 渲染（lesson-04/06 树形图）
- convert-md.mjs 同行多选项拆分 bug
- lesson-02/04/08 题干为空 bug

---

## v1.3 (2026-06-15)

> "实验橙"主题皮肤实施 + Markdown 内联渲染修复

### ✨ 新增
- **"实验橙"主题皮肤**：基于 Tailwind v4 `@theme` 变量体系，全组件从"功能原型"改造为精致教学产品
  - 配色：橙色主色（#e8600c）+ 暖色背景（#fefcfa）+ 语义化 token（primary/success/warning/error）
  - 设计稿：`docs/design/preview/chemistry-skin-preview.html`（设计先行，代码照搬）
- **`src/utils/renderInline.tsx`** — 轻量 Markdown 内联渲染（`**bold**` → `<strong>`，`*italic*` → `<em>`）
- **`docs/index.md`** — 项目结构说明文档，供 AI 快速了解项目全貌

### 🎨 UI 改造（11 个组件）
- `AppLayout.tsx` — 导航栏：`shadow-sm` → `border-b`，`max-w-6xl` → `max-w-[900px]`，橙色主题
- `HomePage.tsx` — 首页卡片：左侧橙条 + 绿色 ✓ badge + 底部进度条
- `SectionKnowledge.tsx` — 知识点卡片：暖黄背景 + 左侧橙条 + 入场动画
- `CalloutBlock.tsx` — 提示框：4 种变体渐变背景（红/绿/蓝/紫）
- `TableBlock.tsx` — 表格：橙色表头 + 斑马纹
- `ListBlock.tsx` — 列表：橙色标记
- `EquationBlock.tsx` — 公式块：暖黄背景 + 左侧橙条
- `ParagraphBlock.tsx` — 段落：`text-text` + renderInline 支持
- `ChoiceExercise.tsx` — 选择题：卡片式选项 + 状态驱动样式（橙选中/绿正确/红错误）
- `AnswerReveal.tsx` — 解析展开：橙色配色 + 淡入动画
- `index.css` — CSS 变量体系 + 动画关键帧（slide-up/fade-in）

### 🔧 修复
- **Markdown 内联语法不渲染** — ParagraphBlock/CalloutBlock 直接显示 `**bold**` 原文
  - 根因：组件未解析 Markdown 内联语法
  - 修复：新建 `renderInline.tsx` 工具函数，在渲染层解析 `**bold**` 和 `*italic*`
- **convert-md.mjs 目标项解析 bug** — `---` 分隔符被误识别为目标项，生成 `"text": "--"` 脏数据
  - 修复：`parseObjectives()` 过滤 `---` 和 `--` 行
- **convert-md.mjs 多行 blockquote bug** — 连续 `>` 行被逐行拆成多个空 callout
  - 修复：`parseContentBlocks()` 合并连续 `>` 行为单个 callout
- 重新运行 convert 脚本，10 个课时 JSON 全部重新生成

### 📝 文档
- 新建 `docs/index.md` — 项目结构说明（目录职责 + 数据流 + 架构决策）
- `v1.3-implementation.md` — 精简为轻量状态看板
- `roadmap.md` — 更新 P6 状态，标记已过时的架构方案

### ⏸️ 推迟到 v1.4
- 5 模块导航（ModuleNav）
- 设置面板（SettingsPanel）
- 判断题/填空题/简答题 UI 改造

---

## v1.2 (2026-06-14)

### 🔧 修复
- **公式渲染乱码** — 再生版 MD（lesson-02~10）中 `\xrightarrow{\text{中文}}` 格式在 KaTeX 中无法渲染
- 根因：KaTeX 组件未加载 `\text` 扩展，且 convert-md.mjs 仅识别独立 `$$` 块

### ✨ 新增
- `scripts/fix-md-format.mjs` — MD 公式格式自动修正脚本（零 token 消耗）
  - 规则1：`\text{中文}` → `中文`
  - 规则2：callout 内公式提取为独立 `$$` 块
  - 规则3：方程式行内联转独立块
  - 规则4：引用句保持内联不变
  - 保留 `\text{ g}`、`\text{ kg}` 等单位文本
- `docs/curriculum-format.md` 新增完整公式格式规范章节
  - 独立公式块 vs 内联公式 使用场景区分
  - ✅❌ 正确/错误对比示例
  - 常见写法速查表（点燃/高温/Δ/催化剂/单位）

### 🗑️ 清理
- 删除冗余文件 `docs/curriculum/lesson-02-化学是一门以实验为基础的科学.md`

### 📝 文档
- `docs/roadmap.md` 新增 P5.1（公式格式修正）完成状态
- `docs/roadmap.md` 新增待办：P0 课程内容质量审核
- `docs/curriculum-format.md` 转换命令改为三步：fix → convert → build

---

## v1.1 (2026-06-14)

### ✨ 新增
- 10 课化学教案（lesson-01~10），覆盖人教版九年级上册全部核心内容
- `docs/curriculum/lesson-01-走进化学世界.md` — MD 教案标准模板

### 🔧 优化
- `convert-md.mjs` 增至 889 行，支持多课时批量转换
- `splitByH3()` 新增 `**【例N】**` 和 `**例题N**：` 格式兼容
- `parseExercises()` 新增 `### 参考答案与解析` 分离格式支持
- `parseSummary()` 新增树状代码块格式支持

### 🏗️ 架构
- 四层架构定型：内容层 → 转换层 → 数据层 → 引擎层
- 内容块注册表（5种）+ 题型注册表（4种）
- 引擎层与学科内容彻底解耦，换科仅需替换 `course.json` + MD 文件夹

---

## v1.0 (2026-06-13)

### 🎉 首次发布
- Vite 6 + React 18 + TypeScript 5.7 + Tailwind CSS 4 项目脚手架
- 5 种内容块渲染器：段落/表格/提示框(4变体)/公式(KaTeX)/列表
- 4 种互动题型：选择(即时判题)/判断/填空(公式容错)/简答(自评)
- 进度系统：React Context + localStorage 持久化
- 2 个路由：首页（课时网格+统计）+ 课时页（五模块展示）
- `convert-md.mjs` MD → JSON 转换流水线
- Vercel 纯静态部署配置
- 1 课手写 JSON 验证模板（lesson-01）
