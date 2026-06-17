# SuperTeacher 开发路线图

> 当前版本：**v1.7** | 最后更新：2026-06-15
>
> 版本更新详见：[version.md](./version.md)

---

## 阶段总览

| Phase | 内容 | 状态 | 完成时间 |
|:------:|------|:----:|---------|
| P0-P5 | 脚手架 → 一节课 → 练习引擎 → 进度系统 → MD 转换 → 部署 | ✅ 全部完成 | 06-13 ~ 06-14 |
| P6 | Skin 系统（实验橙主题） | ✅ 完成 | 06-15 |
| **P7** | **游戏化（过关 + 心数 + GIF）** | ✅ 完成 | 06-15 |
| **P8** | **架构重构（知识点 + 游戏页分离）** | ✅ 完成 | 06-16 |
| **P9** | **LessonPage 仪表盘 + GamePage 修复** | ✅ 完成 | 06-15 |

---

## 历史阶段 P0-P5（✅ 全部完成）

> 详见 `version.md` v1.0 ~ v1.2 条目

| P0 脚手架 | P1 一节课 | P2 练习引擎 | P3 进度 | P4 转换脚本 | P5 部署 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## P6：Skin 系统 ✅

> 2026-06-15 — Tailwind v4 `@theme` 变量方案，11 个组件改造

| 已完成 | 状态 |
|--------|:----:|
| 设计稿 `chemistry-skin-preview.html` | ✅ |
| CSS 变量体系（`src/index.css`） | ✅ |
| 11 组件 UI 改造 + renderInline 修复 + convert bug 修复 | ✅ |
| KaTeX 行内渲染 + 6 组件接入 renderInline（v1.4） | ✅ |
| 课程内容质量审核（P0.1）+ 渲染修复（P0.2） | ✅ |

**待后续**：
| 任务 | 状态 |
|------|:----:|
| 5 模块导航（ModuleNav） | ⬜ |
| 设置面板（字号/配色） | ⬜ |
| 判断题/填空题/简答题 UI 改造 | ⬜ |
| 代码块 ``` 渲染 | ⬜ |
| convert-md.mjs 选项合并 bug | ⬜ |
| 数学/物理 Skin 多科扩展 | ⬜ |

---

## P7：游戏化 ✅

> 2026-06-15 (v1.5) — 过关系统 + 心数系统 + GIF 动画

| 已完成 | 状态 |
|--------|:----:|
| GameContext + useGame hook | ✅ |
| 模块按顺序解锁 | ✅ |
| 心数系统（答错扣心 + Game Over） | ✅ |
| GIF 动画（AnswerAnimation + AnimationBlock） | ✅ |
| 废弃 convert-md.mjs，AI 直接生成 JSON | ✅ |

---

## P8：架构重构 ✅

> 2026-06-16 (v1.6) — 知识点页面 + 游戏页面路由分离

| 已完成 | 状态 |
|--------|:----:|
| `/lesson/:id` 知识点页面（纯展示 + 「开始挑战」按钮） | ✅ |
| `/lesson/:id/game` 游戏页面（互动答题 + 心数 + GIF） | ✅ |
| GamePage.tsx 新建 | ✅ |
| LessonPage.tsx 移除游戏元素 | ✅ |

---

## P9：LessonPage 仪表盘 + GamePage 修复 ✅

> 2026-06-15 (v1.7) — 知识点页面"学习仪表盘"风格 + 游戏页按钮可见性修复

| 已完成 | 状态 |
|--------|:----:|
| LessonPage Hero区（渐变背景 + 标签 + 游戏成绩） | ✅ |
| 阅读进度条（顶部 sticky，随滚动实时增长） | ✅ |
| 上下课导航 | ✅ |
| Sticky CTA「开始挑战」按钮 | ✅ |
| SectionObjectives 任务卡风格（⭐重点 + 普通目标） | ✅ |
| SectionExamples 翻卡式自测（默认隐藏答案，点击展开） | ✅ |
| SectionKnowledge 视觉微调 | ✅ |
| GamePage 按钮可见性修复（fixed inset-0 全屏容器） | ✅ |

---

## 📋 待办事项

| 优先级 | 事项 | 说明 |
|:------:|------|------|
| P1 | 幻灯片视图 | 课堂投影模式 |
| P1 | 讲义打印视图 | 打印友好模式 |
| P1 | AI 出题接入 | 自动生成练习题 |
| P2 | 换科目验证 | 替换 course.json + JSON 验证通用性 |
| P2 | PWA 离线支持 | Service Worker |
| P2 | 设置面板 | 字号/配色调整，localStorage 持久化 |

---

## 附录：技术架构

**Skin 方案**：Tailwind v4 `@theme` 变量（`src/index.css`），组件用 `bg-primary`/`text-success` 等语义 token。

**路由结构**：
```
/                     → HomePage（课时卡片列表）
/lesson/:id           → LessonPage（知识点阅读）
/lesson/:id/game      → GamePage（答题游戏）
```

**数据流**：
```
AI 直接生成 JSON → src/data/lessons/*.json → React 渲染
~~convert-md.mjs~~ (v1.5 起废弃)
```
