# SuperTeacher 开发路线图

> 当前版本：**v1.2** | 最后更新：2026-06-14 21:41
>
> 版本更新详见：[version.md](./version.md)

---

## 阶段总览

| Phase | 内容 | 状态 | 完成时间 |
|:-----:|------|:----:|---------|
| P0 | 项目脚手架 | ✅ 完成 | 2026-06-13 |
| P1 | 一节课跑通（手写JSON + 内容块渲染） | ✅ 完成 | 2026-06-13 |
| P2 | 练习引擎（4种题型 + 公式容错 + 判题交互） | ✅ 完成 | 2026-06-13 |
| P3 | 进度系统（localStorage + useProgress + 首页统计） | ✅ 完成 | 2026-06-13 |
| P4 | MD 转换脚本（convert-md.mjs + 多课时验证） | ✅ 完成 | 2026-06-14 |
| P5 | 响应式打磨 + 部署 | ✅ 完成 | 2026-06-14 |

---

## P0：项目脚手架 ✅

| 任务 | 状态 |
|------|:----:|
| Vite 6 + React 18 + TypeScript 5.7 初始化 | ✅ |
| Tailwind 4 + React Router 7 + KaTeX + Lucide 安装 | ✅ |
| 项目目录结构创建 | ✅ |
| 全局类型定义 types/index.ts（20+ 接口） | ✅ |
| course.json 科目配置（初中化学示例） | ✅ |
| AppLayout + TopNav + 基础路由（2路由） | ✅ |
| npm run dev 验证跑通 | ✅ |

---

## P1：一节课跑通 ✅

| 任务 | 状态 |
|------|:----:|
| 手写第1课 lesson-01.json（5模块+4题型+5内容块） | ✅ |
| ParagraphBlock 段落组件 | ✅ |
| TableBlock 表格组件 | ✅ |
| CalloutBlock 提示框组件（4种变体） | ✅ |
| EquationBlock 公式组件 | ✅ |
| ListBlock 列表组件 | ✅ |
| ContentRenderer 内容分发器 | ✅ |
| SectionObjectives 学习目标组件 | ✅ |
| SectionKnowledge 知识点组件（折叠面板） | ✅ |
| SectionExamples 典型例题组件 | ✅ |
| SectionSummary 本课小结组件（树状） | ✅ |
| KaTeX 封装 + CSS 导入 | ✅ |
| LessonPage 组装所有组件 | ✅ |
| 浏览器验证：首页+课时页完整渲染 | ✅ |

---

## P2：练习引擎 ✅

| 任务 | 状态 |
|------|:----:|
| formula.ts 公式标准化函数（normalizeFormula + checkAnswer） | ✅ |
| ChoiceExercise 选择题组件 + 即时判题 | ✅ |
| TrueFalseExercise 判断题组件 | ✅ |
| FillExercise 填空题组件 + 公式容错 | ✅ |
| ShortAnswerExercise 简答题组件 + 自评 | ✅ |
| ExerciseEngine 分发器 + AnswerReveal 解析展开 | ✅ |
| SectionExercises 组装练习区 | ✅ |
| 浏览器验证四种题型交互（选择/判断/填空/简答全部正常） | ✅ |

---

## P3：进度系统 + 首页 ✅

| 任务 | 状态 |
|------|:----:|
| storage.ts localStorage 封装（load/save/update/recalculate） | ✅ |
| useProgress Hook + ProgressContext 全局共享 | ✅ |
| LessonPage 接入进度系统（答题自动保存） | ✅ |
| HomePage 课时网格 + 统计栏 + 完成指示器 | ✅ |
| 浏览器验证：答题→首页统计→刷新持久化→导航回看 | ✅ |

---

## P4：MD 转换脚本 ✅

| 任务 | 状态 |
|------|:----:|
| convert-md.mjs 完整实现（640行，区块分割+内容块解析+题型解析） | ✅ |
| 内容块解析器（表格/提示框/公式/列表/A-D选项） | ✅ |
| 练习题解析器（选择/判断/填空/简答 + 备选答案） | ✅ |
| 聚合器 + index.ts 自动生成 | ✅ |
| lesson-01 MD 样本编写 + 转换验证 | ✅ |
| lesson-02 MD 样本编写 + 多课时转换验证 | ✅ |
| 浏览器验证：首页2课时 + 课时页渲染 + 导航 | ✅ |

---

## P5：打磨 + 部署 ✅

| 任务 | 状态 |
|------|:----:|
| 响应式适配（手机/平板/桌面） | ✅ |
| 多课时验证（6课时转换+渲染） | ✅ |
| Vercel 部署配置（vercel.json） | ✅ |

---
## P5.1：公式格式修正 ✅

> 2026-06-14 — 再生版 MD 公式格式与标准不一致，写脚本批量修正

| 任务 | 状态 |
|------|:----:|
| 诊断：lesson-01 vs lesson-02~10 公式格式差异 | ✅ |
| 编写 fix-md-format.mjs（4条规则，零token） | ✅ |
| 批量修正6个MD文件 | ✅ |
| 更新 curriculum-format.md 公式规范章节 | ✅ |
| 重新 convert + build 验证 | ✅ |

---
## 📋 待办事项

| 优先级 | 事项 | 说明 |
|:------:|------|------|
| P0 | **课程内容质量审核** | lesson-02~10 存在内容错误，需逐课审核修正（化学知识点、题目答案、解析逻辑） |
| P1 | 幻灯片视图 | 课堂投影模式（LiaScript 借鉴） |
| P1 | 讲义打印视图 | 课后复习/打印友好模式 |
| P1 | AI 出题接入 | 自动生成练习题 |
| P2 | 换科目验证 | 替换 course.json + MD 验证通用性 |
| P2 | PWA 离线支持 | Service Worker 缓存 |
