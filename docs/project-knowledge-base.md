# SuperTeacher-HTML 项目知识库

> 最后更新：2026-06-18 | 版本：v2.0

---

## 一、项目概述

**SuperTeacher** 是一个初中互动教学网页应用，支持化学、物理等多学科课程。核心理念是**数据与渲染分离**——AI 直接生成课程 JSON，React 负责渲染展示。

### 核心价值
- 纯前端静态部署，无需后端
- 多学科架构，加新学科零代码改动
- AI 辅助课程内容生成
- 游戏化学习体验（心数系统、进度追踪）

---

## 二、技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 18.3 | UI 组件 |
| 语言 | TypeScript | 5.7 | 类型安全 |
| 构建 | Vite | 6.3 | 开发/打包 |
| 样式 | Tailwind CSS | 4.1 | 原子化 CSS |
| 公式 | KaTeX | 0.16 | LaTeX 渲染 |
| 路由 | React Router | 7.6 | SPA 路由 |
| 图标 | Lucide React | 0.487 | SVG 图标 |

### 关键配置
```typescript
// vite.config.ts
- @tailwindcss/vite 插件
- @/ 路径别名指向 src/
```

---

## 三、项目结构

```
SuperTeacher-HTML/
├── src/
│   ├── pages/           # 4个页面组件
│   │   ├── HomePage.tsx      # 首页：学科选择
│   │   ├── CoursePage.tsx    # 课程页：课时列表
│   │   ├── LessonPage.tsx    # 知识点页：Tab UI
│   │   └── GamePage.tsx      # 游戏页：互动答题
│   ├── components/
│   │   ├── layout/      # 布局组件
│   │   ├── knowledge/   # 知识点渲染（6个）
│   │   ├── exercises/   # 练习引擎（7个）
│   │   └── ui/          # UI组件（KaTeX）
│   ├── hooks/           # React Hooks
│   │   ├── ProgressContext.ts  # 进度Context
│   │   ├── useProgress.ts     # 进度管理
│   │   └── useGame.ts         # 游戏状态
│   ├── utils/           # 工具函数
│   │   ├── renderInline.tsx   # Markdown+KaTeX渲染
│   │   ├── formula.ts         # 公式标准化
│   │   └── storage.ts         # localStorage
│   ├── data/            # 课程数据（多学科）
│   │   ├── courses/
│   │   │   ├── chemistry/     # 19课化学
│   │   │   ├── physics/       # 12课物理
│   │   │   └── math/          # 占位
│   │   └── index.ts           # 自动扫描导出
│   ├── types/           # TypeScript类型
│   └── config/          # 配置
├── scripts/
│   └── validate-lesson.mjs    # 课程JSON校验
├── docs/                # 文档
└── public/              # 静态资源
```

---

## 四、核心架构

### 4.1 数据流架构

```
AI生成JSON → src/data/courses/{subject}/ → import.meta.glob自动扫描 → React渲染
```

**关键设计**：`src/data/index.ts` 使用 Vite 的 `import.meta.glob` 自动扫描 `courses/*/course.json` 和 `lesson-*.json`，新学科只需在 `courses/` 下新建目录。

### 4.2 内容块抽象

```typescript
// 6种内容块类型
type ContentBlock = 
  | ParagraphBlock    # 段落（支持KaTeX、加粗）
  | TableBlock        # 表格
  | CalloutBlock      # 提示框（4种变体）
  | EquationBlock     # 公式块
  | ListBlock         # 列表
  | AnimationBlock    # GIF动画
```

**扩展方式**：新增类型只需在 union 类型中添加 + 创建对应 Block 组件。

### 4.3 练习题型

```typescript
type Exercise = 
  | ChoiceExercise      # 选择题（4选项）
  | TrueFalseExercise   # 判断题
  | FillExercise        # 填空题
  | ShortAnswerExercise # 简答题
```

### 4.4 路由结构

```
/                           → HomePage（学科选择）
/course/:courseId           → CoursePage（课时列表）
/course/:courseId/lesson/:id    → LessonPage（知识点）
/course/:courseId/lesson/:id/game → GamePage（答题）
```

### 4.5 状态管理

```typescript
// 按学科隔离的状态
ProgressContext: {
  isLessonCompleted(id: number): boolean
  stats: { totalAttempted, totalCorrect, totalCompleted }
}

GameContext: {
  hearts: number          // 心数（3颗）
  unlockedLessons: Set<number>  // 解锁的课时
}
```

存储：localStorage，key 含 courseId 前缀实现隔离。

---

## 五、关键模块详解

### 5.1 renderInline — Markdown+KaTeX渲染

**位置**：`src/utils/renderInline.tsx`

**功能**：解析文本中的内联标记，返回 JSX。

**处理顺序**：
1. `$$...$$` → KaTeX display 公式
2. `$...$` → KaTeX inline 公式
3. `**bold**` → `<strong>`
4. `*italic*` → `<em>`

**使用场景**：所有 `text` 类型字段输出时必须调用。

```tsx
// 正确用法
<div>{renderInline(paragraph.content)}</div>

// 支持的标记
"$H_2O$" → 水分子式
"**重点**" → 加粗
"*强调*" → 斜体
```

### 5.2 知识点页面 Tab UI

**位置**：`src/pages/LessonPage.tsx`

**四个Tab**：
1. 学习目标（Objectives）
2. 知识内容（Knowledge）
3. 典型例题（Examples）
4. 本课小结（Summary）

**实现**：
- `sticky top-14` Tab 栏固定
- `tab-fade-in` 动画切换
- `key={activeTab}` 触发 re-render

### 5.3 练习引擎

**位置**：`src/components/exercises/ExerciseEngine.tsx`

**功能**：
- 按题型渲染对应组件
- 即时判题（选择/判断）
- 心数扣减
- GIF 动画反馈

**组件分工**：
- `ExerciseEngine` — 引擎，管理题目切换
- `ChoiceExercise` — 选择题UI
- `TrueFalseExercise` — 判断题UI
- `FillExercise` — 填空题UI
- `ShortAnswerExercise` — 简答题UI
- `AnswerReveal` — 解析展开
- `AnswerAnimation` — 答题GIF动画

---

## 六、AI Skills

### 6.1 project-manager

**位置**：`~/.agents/skills/project-manager/`

**功能**：
- 版本更新（同步 version.md / roadmap.md / implementation.md）
- 索引同步（扫描项目结构，更新 docs/index.md）

**触发词**：发版、版本更新、更新版本、changelog、更新索引

### 6.2 generate-lesson

**位置**：`.agents/skills/generate-lesson/`（项目级）

**功能**：
- 生成课程 JSON（知识点 + 练习题）
- 课程质量审核

**触发词**：/generate-lesson、生成课、生成知识点、生成练习题、审核课程

**输出文件**：
- `lesson-XX.json` — 知识点
- `lesson-XX-exercises.json` — 练习题

**校验命令**：
```bash
npm run validate  # 校验所有课程JSON
```

---

## 七、关键问题解决方案

### 7.1 KaTeX行内公式不渲染

**问题**：段落中的 `$...$` 公式显示为原始文本。

**解决**：新建 `renderInline.tsx`，在渲染层解析。

**关键实现**：
```typescript
// 正则顺序很重要：先处理display，再inline
const latexDisplayRegex = /\$\$(.+?)\$\$/g
const latexInlineRegex = /\$(.+?)\$/g
const boldRegex = /\*\*(.+?)\*\*/g
const italicRegex = /\*(.+?)\*/g
```

### 7.2 多学科数据自动发现

**问题**：新增学科需要手动修改代码。

**解决**：`import.meta.glob` 自动扫描。

```typescript
// src/data/index.ts
const courseModules = import.meta.glob<{ default: CourseConfig }>(
  './courses/*/course.json', { eager: true }
)
```

**效果**：在 `courses/` 下新建目录 + 放入文件，首页自动出现。

### 7.3 课程JSON校验

**问题**：手写JSON容易格式错误。

**解决**：`scripts/validate-lesson.mjs` 校验脚本。

**检查项**：
- JSON语法
- 必需字段（meta/objectives/knowledge/examples/summary）
- 内容块类型合法性
- 练习题格式
- ID唯一性

```bash
node scripts/validate-lesson.mjs                    # 校验所有
node scripts/validate-lesson.mjs path/to/file.json  # 校验单个
```

### 7.4 进度隔离

**问题**：多学科进度互相干扰。

**解决**：localStorage key 含 courseId 前缀。

```typescript
// storage.ts
const getKey = (courseId: string, key: string) => 
  `superteacher_${courseId}_${key}`
```

---

## 八、设计系统

### 8.1 主题Token（Tailwind v4）

```css
/* src/index.css */
@theme {
  --color-primary: #e8600c;      /* 实验橙 */
  --color-primary-bg: #fefcfa;   /* 暖色背景 */
  --color-success: #22c55e;      /* 正确绿 */
  --color-warning: #f97316;      /* 警告橙 */
  --color-error: #ef4444;        /* 错误红 */
  --color-text: #1d1d1f;         /* 主文字 */
  --color-text-secondary: #6b7280;
}
```

### 8.2 Apple风字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, 
  'SF Pro Text', 'Helvetica Neue', 'PingFang SC', sans-serif;
```

### 8.3 组件样式规范

- 圆角：`rounded-xl`（12px）或 `rounded-2xl`（16px）
- 阴影：`shadow-sm`（轻）或 `shadow-md`（中）
- 间距：`p-4`（16px）或 `p-5`（20px）
- 过渡：`transition-all duration-200`

---

## 九、部署

### 9.1 构建

```bash
npm run build  # 输出到 dist/
```

### 9.2 Vercel部署

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 9.3 GitHub Pages

需要配置 `base` 路径：
```typescript
// vite.config.ts
export default defineConfig({
  base: '/SuperTeacher-HTML/',
})
```

---

## 十、课程数据格式

### 10.1 知识点文件 (lesson-XX.json)

```json
{
  "meta": {
    "id": 1,
    "slug": "lesson-01-声现象",
    "title": "声现象",
    "unit": "第一单元",
    "week": 1,
    "day": 1
  },
  "objectives": [
    { "text": "学习目标描述", "isKeyPoint": true }
  ],
  "knowledge": [
    {
      "title": "知识分区标题",
      "defaultExpanded": true,
      "blocks": [
        { "type": "paragraph", "content": "段落内容 $公式$" },
        { "type": "table", "headers": [...], "rows": [...] },
        { "type": "callout", "variant": "warning", "title": "...", "content": "..." },
        { "type": "equation", "latex": "...", "display": true },
        { "type": "list", "ordered": false, "items": [...] }
      ]
    }
  ],
  "examples": [...],
  "summary": [...]
}
```

### 10.2 练习题文件 (lesson-XX-exercises.json)

```json
{
  "lessonId": 1,
  "exercises": [
    {
      "type": "choice",
      "id": "ex-1-1",
      "stem": "题目描述",
      "options": [
        { "label": "A", "text": "选项A" },
        { "label": "B", "text": "选项B" },
        { "label": "C", "text": "选项C" },
        { "label": "D", "text": "选项D" }
      ],
      "answer": "B",
      "analysis": "解析说明",
      "source": "2024北京中考"
    }
  ]
}
```

---

## 十一、版本历史

| 版本 | 日期 | 主要内容 |
|------|------|----------|
| v1.0 | 06-13 | 首次发布，脚手架+1课验证 |
| v1.1 | 06-14 | 10课化学+转换脚本 |
| v1.2 | 06-14 | 公式格式修正脚本 |
| v1.3 | 06-15 | "实验橙"主题皮肤 |
| v1.4 | 06-15 | KaTeX行内渲染+renderInline |
| v1.5 | 06-15 | 游戏化（过关+心数+GIF） |
| v1.6 | 06-16 | 知识点页+游戏页分离 |
| v1.7 | 06-17 | Tab UI+Apple风 |
| v1.8 | 06-18 | AI Skill体系 |
| v1.9 | 06-18 | 化学课程19课 |
| v2.0 | 06-18 | 物理课程12课 |

---

## 十二、常见问题

### Q: 如何添加新学科？
A: 在 `src/data/courses/` 下新建目录，放入 `course.json` + `lesson-*.json`，首页自动出现。

### Q: 如何生成课程内容？
A: 使用 `/generate-lesson <课号> <标题>` 命令，或手动按格式编写JSON。

### Q: KaTeX公式不渲染？
A: 检查是否用了 `renderInline()` 包裹文本字段。

### Q: 进度丢失？
A: 进度存在 localStorage，检查是否清除了浏览器数据，或 key 前缀是否匹配。

### Q: 构建报错？
A: 运行 `npm run validate` 检查JSON格式，确保所有必需字段存在。

---

## 十三、开发规范

### 13.1 代码风格
- 组件：PascalCase（`LessonPage.tsx`）
- 工具：camelCase（`renderInline.tsx`）
- 类型：PascalCase（`LessonData`）

### 13.2 Git规范
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构

### 13.3 提交前检查
```bash
npm run validate   # 校验JSON
npm run build      # 构建验证
```

---

*本文档由 MiMoCode 自动生成，供项目知识积累使用。*
