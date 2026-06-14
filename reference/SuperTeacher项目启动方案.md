---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 9a064116c623068efcca33c3c791e7c4_238bb392671411f1aa625254006c9bbf
    ReservedCode1: PZklEGmP6/DXyVZ9rd7DHzhwtiX06Ke4oMm6L2HNOGzS1OVN9DIkgfqaw6r5gl6xcrXgcv0/9hIzhbVHTIWQplKXd4iDi6y/jMo2HumyBDW03jiz68rwQAaaCdbXx4LLUWuTedl/2ZL0KQ9P3aMMm5A2ex7wTR7RNp9IOa4PEyM3O3frz8wqia36oLQ=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 9a064116c623068efcca33c3c791e7c4_238bb392671411f1aa625254006c9bbf
    ReservedCode2: PZklEGmP6/DXyVZ9rd7DHzhwtiX06Ke4oMm6L2HNOGzS1OVN9DIkgfqaw6r5gl6xcrXgcv0/9hIzhbVHTIWQplKXd4iDi6y/jMo2HumyBDW03jiz68rwQAaaCdbXx4LLUWuTedl/2ZL0KQ9P3aMMm5A2ex7wTR7RNp9IOa4PEyM3O3frz8wqia36oLQ=
---

# SuperTteacherHTML 项目启动方案

> 创建时间：2026-06-13 | 状态：方案阶段

---

## 一、项目定义

**一句话**：将 Markdown 教案自动转换为互动教学网页的通用框架，纯前端静态部署，零服务器成本。

**核心场景**：教师用 Markdown 写完教案 → 运行一条转换命令 → 部署到静态托管 → 学生课上用浏览器打开互动做题。

**不做的事**：用户系统、后端数据库、AI 出题、学习路径推荐、间隔复习——这些不是课堂互动教学的核心。

---

## 二、技术选型与理由

| 选型 | 理由 |
|------|------|
| React 18 + TypeScript | 组件化拆分知识点/练习/布局，TypeScript 保证教案 JSON 数据结构安全 |
| Vite 5 | 构建快，静态 SPA 输出天然适合 Vercel/GitHub Pages |
| Tailwind CSS 4 | 响应式设计成本最低，不需要额外 UI 库 |
| React Router v7 | 首页（课时列表）→ 课时详情页，两个路由足够 |
| KaTeX | 中学理科刚需，化学方程式、数学公式必须正确渲染 |
| 纯静态 JSON | 教案编译后就是 JSON，不需要任何运行时解析 |

---

## 三、架构设计

### 3.1 引擎层 vs 内容层分离

```
E:\WorkSpace\SuperTteacherHTML\
├── course.json              ← 【内容层】科目配置（换科目只改这个 + MD 文件夹）
├── docs\curriculum\         ← 【内容层】MD 教案源文件
│   ├── lesson-01-xxx.md
│   └── lesson-02-xxx.md
├── scripts\
│   └── convert-md.mjs       ← 【引擎层】MD → JSON 转换
├── src\
│   ├── data\lessons\        ← 转换生成的 JSON（不手写）
│   ├── components\
│   │   ├── knowledge\       ← 知识点展示：表格、提示框、公式
│   │   ├── exercises\       ← 互动练习：选择、填空、简答
│   │   └── layout\          ← 布局：Header、Sidebar、ProgressBar
│   ├── hooks\               ← useProgress（localStorage 读写）
│   ├── pages\               ← HomePage + LessonPage
│   └── utils\               ← 化学式校验、storage 封装
├── package.json
└── vite.config.ts
```

### 3.2 数据流

```
教师编写 MD（docs/curriculum/）
        │
        ▼ npm run convert
课程 JSON（src/data/lessons/）
        │
        ▼ Vite 打包
静态 SPA（dist/）
        │
        ▼ 部署到 Vercel / GitHub Pages
学生浏览器打开
        │
        ▼ React 读取 JSON + localStorage 进度
互动教学页面
```

### 3.3 路由设计

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | HomePage | 课程名、课时列表、每课完成状态 |
| `/lesson/:id` | LessonPage | 五模块展示 + 互动做题 + 进度保存 |

仅两个路由，不需要嵌套路由。

### 3.4 组件树（单课时页）

```
LessonPage
├── ProgressBar              ← 顶部进度条（5 个模块打勾）
├── SectionObjectives        ← 一、学习目标
├── SectionKnowledge         ← 二、知识点梳理
│   ├── KnowledgeTable       ← 知识点表格
│   ├── KnowledgeTip         ← 提示框（易错/技巧/注意）
│   └── KnowledgeFormula     ← KaTeX 公式渲染
├── SectionExamples          ← 三、典型例题
│   └── MultipleChoice       ← 选择题（即时判题）
├── SectionExercises         ← 四、课后练习
│   ├── MultipleChoice
│   ├── FillInBlank          ← 填空题（逐空校验）
│   └── ShortAnswer          ← 简答题（自评）
└── SectionSummary           ← 五、本课小结
```

### 3.5 course.json 数据结构

```json
{
  "course": {
    "name": "高中化学",
    "icon": "⚗️",
    "subtitle": "人教版必修第一册"
  },
  "schedule": {
    "weeks": 2,
    "weekLabels": ["第一周", "第二周"],
    "weekTitles": ["物质的量", "离子反应"]
  },
  "lessons": [
    {
      "id": 1,
      "title": "物质的量（第一课时）",
      "unit": "第一章",
      "week": 1,
      "day": 1,
      "file": "lesson-01-物质的量.md"
    }
  ],
  "features": {
    "katex": true,
    "chemistryHelper": true
  },
  "paths": {
    "contentDir": "../docs/curriculum",
    "outputDir": "./src/data/lessons"
  }
}
```

### 3.6 单课 JSON 数据结构（convert-md.mjs 输出格式）

```json
{
  "id": 1,
  "title": "物质的量（第一课时）",
  "sections": [
    {
      "type": "objectives",
      "title": "一、学习目标",
      "items": [
        { "text": "理解物质的量及其单位摩尔", "key": true },
        { "text": "掌握 n = m / M 的计算", "key": false }
      ]
    },
    {
      "type": "knowledge",
      "title": "二、知识点梳理",
      "blocks": [
        {
          "kind": "table",
          "caption": "基本物理量对照表",
          "headers": ["物理量", "符号", "单位"],
          "rows": [["物质的量", "n", "mol"], ["质量", "m", "g"]]
        },
        {
          "kind": "tip",
          "variant": "warning",
          "title": "易错提醒",
          "content": "摩尔只用于微观粒子，不能说「1 摩尔大米」"
        },
        {
          "kind": "formula",
          "latex": "n = \\frac{m}{M}"
        }
      ]
    },
    {
      "type": "examples",
      "title": "三、典型例题",
      "items": [
        {
          "type": "choice",
          "stem": "1 mol H₂O 含有的分子数约为？",
          "options": ["3.01×10²³", "6.02×10²³", "1.204×10²⁴"],
          "answer": 1,
          "explanation": "1 mol 任何物质含阿伏加德罗常数个粒子"
        }
      ]
    },
    {
      "type": "exercises",
      "title": "四、课后练习",
      "items": [
        {
          "type": "choice",
          "source": "2024 北京中考",
          "stem": "...",
          "options": ["A", "B", "C", "D"],
          "answer": 2,
          "explanation": "..."
        },
        {
          "type": "fill",
          "blanks": [
            { "id": "b1", "answer": ["CO₂", "CO2"], "label": "产物" }
          ],
          "stem": "碳燃烧的产物是 ___b1___。"
        },
        {
          "type": "short",
          "stem": "简述摩尔质量与相对分子质量的关系。",
          "reference": "数值上相等，单位不同。摩尔质量单位 g/mol。"
        }
      ]
    },
    {
      "type": "summary",
      "title": "五、本课小结",
      "tree": {
        "label": "物质的量",
        "children": [
          { "label": "定义：表示粒子集合的物理量" },
          { "label": "单位：摩尔（mol）" },
          { "label": "公式：n = m / M" }
        ]
      }
    }
  ]
}
```

---

## 四、MD 教案约定格式

每课固定五个模块，`convert-md.mjs` 按二级标题自动切分：

```markdown
# 第 1 课：物质的量（第一课时）

## 一、学习目标
- 理解物质的量及其单位摩尔 ★
- 掌握 n = m / M 的计算

## 二、知识点梳理
| 物理量 | 符号 | 单位 |
|--------|------|------|
| 物质的量 | n | mol |

> **易错提醒**：摩尔只用于微观粒子。

$$ n = \frac{m}{M} $$

## 三、典型例题
**例 1** 1 mol H₂O 含有的分子数约为？
A. 3.01×10²³
B. 6.02×10²³
C. 1.204×10²⁴

答案：B
解析：1 mol 任何物质含阿伏加德罗常数（约 6.02×10²³）个粒子。

## 四、课后练习
1.（2024 北京中考）...
A. ...
B. ...

答案：C
解析：...

## 五、本课小结
- 物质的量
  - 定义：表示粒子集合的物理量
  - 单位：摩尔（mol）
  - 公式：n = m / M
```

---

## 五、开发阶段规划

### Phase 0：项目脚手架（1 次操作）

- Vite + React + TypeScript 初始化
- 安装依赖：tailwindcss、react-router-dom、katex
- 创建目录结构
- 配置 Tailwind + Vite
- 跑通 `npm run dev`

**验证标准**：浏览器打开 `localhost:5173` 显示默认页面。

### Phase 1：数据层 + 一节课跑通（核心闭环）

- 手写一节课的 JSON（不用 MD 转换，先验证数据结构）
- 实现 SectionObjectives（学习目标列表，★ 标注重点）
- 实现 KnowledgeTable + KnowledgeTip + KnowledgeFormula（表格/提示框/KaTeX 公式）
- 实现 MultipleChoice（点选项判对错/绿色红色反馈/展开解析）
- 实现 SectionSummary（树状结构渲染）
- 组装 LessonPage，硬编码导入一节课 JSON 渲染

**验证标准**：一节课的五个模块完整显示，选择题能判题。

### Phase 2：互动练习补全

- 实现 FillInBlank（逐空输入校验，化学式容错 CO₂=CO2）
- 实现 ShortAnswer（参考答案折叠，学生自评按钮）
- 实现 ProgressBar（五模块完成状态追踪）

**验证标准**：填空题能校验，简答题能自评，进度条能反映完成情况。

### Phase 3：多课支持 + 路由 + 进度持久化

- 实现 HomePage（课程信息 + 课时列表 + 完成状态）
- 实现 React Router（`/` → HomePage，`/lesson/:id` → LessonPage）
- 实现 useProgress Hook（localStorage 读写各课完成状态和正确率）
- 从 course.json 读取课时列表动态渲染

**验证标准**：首页显示课时列表，点击进详情页，刷新后进度不丢失。

### Phase 4：MD 转换脚本 + 真实教案

- 实现 `scripts/convert-md.mjs`（解析 MD → 输出 JSON）
- 编写至少 2 课真实教案验证转换质量
- 支持 表格/公式/提示框/选择题/填空题/简答题 的自动识别

**验证标准**：`npm run convert` 一键生成全部 JSON，前端正常渲染。

### Phase 5：多形态输出 + 打包部署

- 实现幻灯片视图（按模块分页，键盘翻页）
- 实现讲义视图（打印友好，答案默认隐藏）
- 打包配置（base 路径、静态资源路径）
- 部署到 Vercel / GitHub Pages

**验证标准**：三种视图可切换，部署后公网可访问。

### Phase 6：多科目验证 + 文档

- 换科目测试（用 course-example-math.json 替换化学）
- 编写 README、使用文档、贡献指南
- MD 教案编写规范文档

---

## 六、关键设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 手写 JSON 还是先写转换脚本 | 先手写 JSON | Phase 1-2 验证数据结构和组件是否正确，转换脚本 Phase 4 再写，避免"转换错 + 渲染错"双层 bug |
| 状态管理方案 | 不用 Redux/Zustand | 全局状态只有进度数据，一个 useProgress Hook + Context 足够 |
| UI 组件库 | 不用 | Tailwind 手写，组件数量少，UI 库反而增加体积和学习成本 |
| 题型数据放 JSON 还是 MD | 放 JSON | MD 是编写格式，JSON 是运行格式，职责分离 |
| 选择题判题逻辑 | 前端即时判 | 无后端，答案就在 JSON 里，不需要请求服务器 |

---

## 七、文件清单（Phase 0 产物）

```
E:\WorkSpace\SuperTteacherHTML\
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts          ← 或 vite.config.ts 内联 Tailwind 4 配置
├── index.html
├── src\
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css               ← Tailwind 入口
│   └── vite-env.d.ts
```

Phase 0 结束后共约 10 个文件，体积控制在 50KB 以内。

---

## 八、下一步

确认本方案后，执行 Phase 0 脚手架搭建。是否开始？
*（内容由AI生成，仅供参考）*
