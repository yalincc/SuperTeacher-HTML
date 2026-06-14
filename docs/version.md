# 更新日志 (Changelog)

> SuperTeacher-HTML — Markdown 教案 → 互动教学网页 转换框架

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
