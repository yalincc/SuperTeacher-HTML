# SuperTeacher 开发路线图

> 当前版本：**v1.3** | 最后更新：2026-06-15
>
> 版本更新详见：[version.md](./version.md)

---

## 阶段总览

| Phase | 内容 | 状态 | 完成时间 |
|:------:|------|:----:|---------|
| P0 | 项目脚手架 | ✅ 完成 | 2026-06-13 |
| P1 | 一节课跑通（手写JSON + 内容块渲染） | ✅ 完成 | 2026-06-13 |
| P2 | 练习引擎（4种题型 + 公式容错 + 判题交互） | ✅ 完成 | 2026-06-13 |
| P3 | 进度系统（localStorage + useProgress + 首页统计） | ✅ 完成 | 2026-06-13 |
| P4 | MD 转换脚本（convert-md.mjs + 多课时验证） | ✅ 完成 | 2026-06-14 |
| P5 | 响应式打磨 + 部署 | ✅ 完成 | 2026-06-14 |
| **P6** | **Skin 系统设计（化学 Skin v1）** | ✅ 完成 | 2026-06-15 |

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

## P6：Skin 系统设计 ✅ 化学 Skin 完成

> 2026-06-15 — 化学 Skin v1 已完成，采用 Tailwind v4 `@theme` 变量方案（非独立 CSS 文件）

### P6.1 化学 Skin ✅

| 任务 | 状态 |
|------|:----:|
| 设计评审 + 方向确认（实验室风格/暖橙） | ✅ |
| 设计稿 `chemistry-skin-preview.html` | ✅ |
| Tailwind v4 `@theme` 变量体系（`src/index.css`） | ✅ |
| 11 个组件 UI 改造（导航栏/首页/知识点/选择题） | ✅ |
| Markdown 内联渲染修复 + 转换脚本 bug 修复 | ✅ |
| build 验证通过 | ✅ |

> **实际架构**：用 Tailwind v4 `@theme` 在 `index.css` 定义语义化变量，组件直接用 `bg-primary`/`text-success` 等工具类。未采用原计划的独立 `src/styles/skins/` 文件架构。

### P6.2 化学 Skin v1.4 增量（待启动）

| 任务 | 状态 |
|------|:----:|
| 5 模块导航（ModuleNav） | ⬜ |
| 设置面板（字号/配色，localStorage 持久化） | ⬜ |
| 判断题/填空题/简答题 UI 改造 | ⬜ |
| 用户浏览器逐页验收 | ⬜ |

### P6.3 数学/物理 Skin（待 v1.4 验收后启动）

| 任务 | 状态 |
|------|:----:|
| 数学 Skin 设计（Indigo 色系/纸上行风） | ⬜ |
| 物理 Skin 设计（Cyan 色系/实验台风格） | ⬜ |

---

## 📋 待办事项

| 优先级 | 事项 | 说明 |
|:------:|------|------|
| P0 | **课程内容质量审核** ✅ | lesson-02~10 内容错误已修复（4个严重答案错误 + 5个渲染格式 + 4个格式/引用），详见下方 P0.1 |
| P0 | **前端内联渲染修复** ✅ | renderInline 已增加 KaTeX + 7 组件接入（v1.4），详见下方 P0.2 |
| P1 | 幻灯片视图 | 课堂投影模式（LiaScript 借鉴） |
| P1 | 讲义打印视图 | 课后复习/打印友好模式 |
| P1 | AI 出题接入 | 自动生成练习题 |
| P2 | 换科目验证 | 替换 course.json + MD 验证通用性 |
| P2 | PWA 离线支持 | Service Worker 缓存 |
| **P6** | **Skin 系统多科扩展** | 数学/物理 Skin 设计+实施（依赖化学 Skin 验收） |

---

## P0.1：课程内容质量审核 ✅ (2026-06-15)

> lesson-02~10 逐课审核，修复 AI 批量生成内容时残留的草稿和格式问题

| 任务 | 状态 |
|------|:----:|
| lesson-04 练习1 答案自相矛盾 — 重写解析 | ✅ |
| lesson-07 第4题 计算结果负数 — 修正数据+清草稿 | ✅ |
| lesson-08 第1题 解析混乱 — 重写解析 | ✅ |
| lesson-08 第3题 中途改答案 — 重写解析 | ✅ |
| lesson-02 方程式 Unicode下标→LaTeX (7处) | ✅ |
| lesson-06 ════符号→$$块 (5处) | ✅ |
| lesson-07 $$块内含 Markdown — 分离 | ✅ |
| lesson-09 答案全在$$块内 — 拆分 | ✅ |
| lesson-10 答案全在$$块内 — 拆分 | ✅ |
| lesson-04/05/06 例题标题格式统一 | ✅ |
| lesson-04 练习3 引用空白图→文字描述 | ✅ |
| lesson-09 练习5 引用不存在的图→文字 | ✅ |
| lesson-10 例题2 "如图装置"→文字 | ✅ |
| fix-md-format.mjs TARGET 列表补全 (04/05/06) | ✅ |
| convert + build 验证通过 | ✅ |

---

## P0.2：前端内联渲染修复 ✅ (2026-06-15)

> 浏览器逐课验收发现：段落文本中的 `$...$` 行内 LaTeX 和 `**加粗**` 未被渲染，直接显示原始标记。
> 根因：`renderInline.tsx` 只处理 bold/italic，未集成 KaTeX 行内渲染；多个组件未调用 renderInline。

| 任务 | 影响文件 | 状态 |
|------|---------|:----:|
| renderInline.tsx 增加 `$...$` 行内 LaTeX 渲染 | `src/utils/renderInline.tsx` | ✅ |
| AnswerReveal.tsx 接入 renderInline（解析文本不渲染） | `src/components/exercises/AnswerReveal.tsx` | ✅ |
| ChoiceExercise.tsx stem/opt.text 接入 renderInline | `src/components/exercises/types/ChoiceExercise.tsx` | ✅ |
| TrueFalseExercise.tsx stem 接入 renderInline | `src/components/exercises/types/TrueFalseExercise.tsx` | ✅ |
| FillExercise.tsx segments 接入 renderInline | `src/components/exercises/types/FillExercise.tsx` | ✅ |
| ShortAnswerExercise.tsx question/referenceAnswer 接入 renderInline | `src/components/exercises/types/ShortAnswerExercise.tsx` | ✅ |
| ListBlock.tsx items 接入 renderInline | `src/components/knowledge/blocks/ListBlock.tsx` | ✅ |
| lesson-02 简答题第5题参考答案为空（MD 中缺失） | `docs/curriculum/lesson-02-空气与氧气性质.md` | ✅ |
| 代码块 ``` 渲染支持（convert-md.mjs 或渲染层） | `scripts/convert-md.mjs` + `ContentRenderer` | ⬜ |
| convert-md.mjs 同行多选项拆分（A. xxx B. xxx 合并问题） | `scripts/convert-md.mjs` parseChoiceExercise | ⬜ |
| lesson-02/04/08 部分选择题题干为空（转换脚本未捕获） | `scripts/convert-md.mjs` + MD 原稿 | ⬜ |

**受影响课程及严重程度**：
- `$...$` 行内 LaTeX：lesson-03(2处)、lesson-06(2处)、lesson-07(45处)、lesson-08(51处)
- `**加粗**` 未渲染：lesson-02~08 共 7 课
- 选择题选项合并：lesson-02、06、07、08
- 题干缺失：lesson-02(2题)、lesson-04(1题)、lesson-08(1题)

---

## 附录：Skin 系统架构说明

**实际采用方案**：Tailwind v4 `@theme` 变量（定义在 `src/index.css`）

```css
@theme {
  --color-primary: #e8600c;      /* 实验橙 */
  --color-success: #0d9488;      /* 青绿 */
  --color-bg: #fefcfa;           /* 暖白 */
  --color-surface-warm: #fffbeb;  /* 暖黄 */
  /* ... */
}
```

组件直接使用语义化 token：`bg-primary`、`text-success`、`bg-surface-warm`。

> ~~原计划：独立 `src/styles/skins/` CSS 文件架构~~ — 未采用，`@theme` 方案更简洁
