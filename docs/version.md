# 更新日志 (Changelog)

> SuperTeacher-HTML — 初中化学互动教学网页应用

---

## v2.0 (2026-06-18)

> 物理课程完整生成 — 12章知识点 + 练习题（人教版八年级全一册）

### ✨ 新增
- **物理课程 12 课** — 按 2024 人教版八年级物理教材目录生成（id 1-12）
  - 6 单元 12 章，完整覆盖教材内容
  - 每课知识点 JSON + 练习题 JSON（共 24 文件）
- **课程内容覆盖**：
  - 第一单元：长度和时间的测量、声现象
  - 第二单元：物态变化、光现象
  - 第三单元：透镜及其应用、质量与密度
  - 第四单元：力、运动和力
  - 第五单元：压强、浮力
  - 第六单元：功和机械能、简单机械
- **练习题题型分布** — 每课 6-8 道（选择 3 + 判断 1-2 + 填空 1-2 + 简答 1）
- **知识点结构** — 每课 3-4 个知识分区 + 2 道例题 + 4-5 个学习目标

### 🔧 改造
- **course.json** — 从 8 课扩展到 12 课，subtitle 更新为「人教版八年级全一册」
- **课程组织** — 4 周 × 3 课/周，覆盖全部 12 章

### 📝 文档
- `docs/version.md` — v2.0 版本记录
- `docs/roadmap.md` — 新增 P13 物理课程阶段

### 🎨 改造文件
| 文件 | 改动 |
|------|------|
| `src/data/courses/physics/course.json` | 12 课配置 + 4 周计划 |
| `src/data/courses/physics/lesson-01.json` ~ `lesson-12.json` | 12 课知识点 |
| `src/data/courses/physics/lesson-01-exercises.json` ~ `lesson-12-exercises.json` | 12 课练习题 |

---

## v1.9 (2026-06-18)

> 化学课程按教材 19 课题重新生成 + generate-lesson skill 增强

### ✨ 新增
- **化学课程 19 课** — 按 2024 人教版九年级化学教材目录重新生成（id 0-18）
  - 绪论 + 7 单元 18 课题，完整覆盖教材内容
  - 每课知识点 JSON + 练习题 JSON（共 38 文件）
- **generate-lesson skill 增强** — 新增课程质量审核功能
  - 触发词：审核课程、检查课程、校验规范、课程质量
  - 读取 SKILL.md 规范自动检查，不写死规则
- **练习题规范统一** — 每课 4-6 道（选择 2-3 + 判断 1 + 填空 1）
- **校验脚本适配** — 支持 id=0（绪论课）

### 🔧 改造
- **course.json** — 从 10 课扩展到 19 课，subtitle 更新为「人教版九年级上册（2024版）」
- **校验脚本** — `validate-lesson.mjs` 扫描 `courses/*/lesson-*.json`，允许 id=0
- **MEMORY.md** — 新增 Skill 必读规则（生成课程前/版本更新前强制读取 skill）

### 📝 文档
- `docs/index.md` — 全面同步多学科架构 + 19 课结构
- `docs/v1.9-plan.md` — 化学课程对齐教材规划
- `docs/v1.9-implementation.md` — 实施进度看板

### 🎨 改造文件
| 文件 | 改动 |
|------|------|
| `src/data/courses/chemistry/course.json` | 19 课配置 |
| `src/data/courses/chemistry/lesson-00.json` ~ `lesson-18.json` | 19 课知识点 |
| `src/data/courses/chemistry/lesson-00-exercises.json` ~ `lesson-18-exercises.json` | 19 课练习题 |
| `scripts/validate-lesson.mjs` | 适配 id=0 + courses 目录扫描 |
| `.agents/skills/generate-lesson/SKILL.md` | 新增审核功能 + 触发词更新 |

---

## v1.8 (2026-06-18)

> AI Skill 体系搭建 + 项目文档同步

### ✨ 新增
- **project-manager skill** — 版本更新管理（version/update 同步 + index/ 同步）
  - 全局安装于 `~/.agents/skills/project-manager/`
- **generate-lesson skill** — 课程 JSON 生成（知识点 + 练习题）
  - 全局安装于 `~/.agents/skills/generate-lesson/`
  - 支持 `/generate-lesson <课号> <标题>` 触发

### 📝 文档
- `docs/index.md` — 全面更新目录结构（新增 v1.4~v1.7 文档、scripts 精简、架构决策第 7 条）
- `docs/v1.7-implementation.md` — 补建 v1.7 实施进度看板
- `docs/roadmap.md` — 新增 AI Skill 阶段，更新待办事项

---

## v1.7 (2026-06-17)

> 知识点页面「互动教科书」改造 — Tab UI 标签页架构 + Apple 简约科技风

### ✨ 新增
- **Tab UI 标签页架构** — 从纵向长滚动 → 四区块切页浏览（目标 / 知识 / 例题 / 小结）
  - `sticky top-14` Tab 栏固定导航栏下方，pill 样式激活态
  - `tab-fade-in` 动画切换，`key={activeTab}` 触发 re-render
- **SectionSummary 接入** — 原未展示的知识点小结作为第 4 个 Tab 上线
  - 树状结构：一级节点橙色圆点 + 粗体，二级节点缩进线
- **Apple 系统字体栈** — `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC'`
- **Apple 风主题 token** — `#f5f5f7` 背景色、`#1d1d1f` 文字色、轻柔阴影、tab-fade-in 动画

### 🎨 改造（11 个文件）
- **LessonPage Hero** — 纯留白 + 大标题 + 副标题 + 课时标签，移除渐变装饰
- **Sticky CTA** — `rounded-full` 胶囊按钮，始终可见
- **SectionObjectives** — 重点目标大卡片 `rounded-2xl bg-surface-warm`，普通目标简洁行
- **SectionKnowledge** — 去掉手风琴折叠 → 卡片流，序号徽章 `bg-primary text-white`
- **SectionExamples** — Apple 风卡片，答案按钮 `rounded-full` pill 样式，tab-fade-in 动画
- **ParagraphBlock** — `text-base leading-loose tracking-wide my-4`
- **TableBlock** — `rounded-2xl` 外层，表头 `bg-bg/80`，行 hover 高亮，单元格 renderInline
- **CalloutBlock** — `border-l-4` 细线 → 全包裹卡片 `rounded-2xl`，图标圆形背景 `w-10 h-10`
- **ListBlock** — 自定义橙色圆点 / 数字徽章，`leading-loose space-y-2`
- **KaTeX** — display 公式 `rounded-2xl py-6 px-8 bg-surface-warm border shadow-sm`

### 🔧 移除
- **阅读进度条** — Tab UI 不需要长滚动进度跟踪

### 🎨 改造文件
| 文件 | 改动 |
|------|------|
| `src/index.css` | Apple 主题变量 + 系统字体栈 + tab-fade-in 动画 |
| `src/pages/LessonPage.tsx` | 重写 — Tab UI 架构 + Apple Hero |
| `src/components/knowledge/SectionObjectives.tsx` | 重写 — 卡片式目标 |
| `src/components/knowledge/SectionKnowledge.tsx` | 重写 — 卡片流 |
| `src/components/knowledge/SectionExamples.tsx` | 重写 — Apple 风卡片 |
| `src/components/knowledge/SectionSummary.tsx` | 重写 — 树状小结（新接入） |
| `src/components/knowledge/blocks/ParagraphBlock.tsx` | 样式增强 |
| `src/components/knowledge/blocks/TableBlock.tsx` | 样式增强 + renderInline |
| `src/components/knowledge/blocks/CalloutBlock.tsx` | 重写 — 全包裹卡片 |
| `src/components/knowledge/blocks/ListBlock.tsx` | 样式增强 |
| `src/components/ui/KaTeX.tsx` | 样式增强 |

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