# SuperTeacher

初中多学科互动教学网页应用 —— 让学习更有趣。

**在线预览**: https://yalincc.github.io/SuperTeacher-HTML/

---

## 功能特性

- **多学科支持** — 化学、物理、数学、历史、英语，按学期/册别组织
- **游戏化练习** — 心数系统、进度追踪、即时判题反馈
- **AI 课程生成** — 基于教材目录自动生成知识点 + 练习题 JSON
- **数学画图引擎** — 支持函数图像、几何图形、构造指令 DSL
- **KaTeX 公式渲染** — 完美支持化学方程式、物理公式、数学表达式
- **响应式设计** — 手机、平板、电脑均可使用
- **零后端部署** — 纯静态 SPA，GitHub Pages 托管

## 模块化架构

本项目采用**高度模块化**设计，扩展新课程或新功能非常简单：

### 扩展新课程

只需在 `src/data/courses/` 下新建目录，放入 JSON 文件，首页自动发现：

```bash
src/data/courses/
└── your-subject/          # 新学科目录
    ├── course.json         # 课程配置（名称、图标、学期分组）
    ├── lesson-01.json      # 知识点文件
    └── lesson-01-exercises.json  # 练习题文件
```

无需修改任何代码，`import.meta.glob` 自动扫描加载。

### 扩展新题型

练习引擎采用**注册表模式**（`ExerciseRegistry`），新增题型只需：

1. 在 `src/types/index.ts` 定义题型接口
2. 创建对应的 Exercise 组件
3. 在注册表中注册

### 扩展新内容块

知识点渲染采用**内容块抽象**（`ContentBlock`），支持 6 种内置类型：

| 类型 | 用途 |
|------|------|
| `paragraph` | 正文段落（支持 KaTeX） |
| `table` | 对比表格 |
| `callout` | 提示框（warning/tip/note/mnemonic） |
| `equation` | 化学方程式/公式 |
| `list` | 列表 |
| `figure` | 数学图形（函数/几何/构造） |

新增内容块类型只需添加 Block 组件 + 注册到 ContentRenderer。

### 扩展新学科分组

课程支持**学期分组**（`group` + `semester`），多学期学科自动在首页显示为分组卡片：

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript 5.7 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4 |
| 公式 | KaTeX |
| 路由 | React Router v7 |
| 图标 | Lucide React |

```json
{
  "id": "physics-8a",
  "group": { "id": "physics", "name": "初中物理", "icon": "⚡" },
  "semester": { "name": "八年级上", "order": 1 }
}
```

同一 `group.id` 的课程自动归类，首页显示为：

```
⚡ 初中物理
├── 人教版 · 4 个学期
└── 22 课时
```

## 课程结构

```
src/data/courses/
├── chemistry-9a/     化学九上（21课）
├── chemistry-9b/     化学九下（13课）
├── physics-8a/       物理八上（6课）
├── physics-8b/       物理八下（6课）
├── physics-9a/       物理九上（5课）
├── physics-9b/       物理九下（5课）
├── math-7a ~ 9b/     数学七~九年级（共86课）
├── history-7a ~ 9b/  历史七~九年级（共160课）
├── english-grammar/   英语语法（30课）
├── english-vocabulary/ 英语词汇（12课）
└── english-exam/      英语考试（9课）
```

## AI 课程生成

项目内置 AI Skill 系统，可自动生成符合教材规范的课程 JSON：

```bash
# 使用 generate-lesson skill 生成课程
# 输入：课号 + 课程标题
# 输出：lesson-XX.json + lesson-XX-exercises.json
```

**课程 JSON 规范**：
- 知识点：3-6 学习目标 + 2-4 知识分区 + 1-2 例题 + 小结
- 练习题：4-6 道（选择 2-3 + 判断 1 + 填空 1 + 简答 0-1）
- 内容块：paragraph / table / callout / equation / list / figure

详细规范见 `docs/curriculum-format.md`。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 校验课程 JSON
npm run validate

# 构建生产版本
npm run build
```

## 项目结构

```
SuperTeacher-HTML/
├── src/
│   ├── pages/          页面组件（首页、课程页、知识点页、游戏页）
│   ├── components/     组件（知识点渲染、练习引擎、画图引擎、UI）
│   ├── data/           课程数据（多学科 JSON）
│   ├── hooks/          React Hooks（进度管理、游戏状态）
│   ├── utils/          工具函数（KaTeX 渲染、公式标准化）
│   └── types/          TypeScript 类型定义
├── docs/               项目文档（版本记录、架构设计、课程规范）
├── scripts/            脚本（课程 JSON 校验）
├── public/             静态资源
└── .github/workflows/  GitHub Actions 自动部署
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

```bash
git push origin main
```

## 版本历史

| 版本 | 主要内容 |
|------|----------|
| v2.7 | 物理化学按学期拆分 + 九下化学生成 |
| v2.6 | 数学画图引擎 + 首页排序 + GitHub Pages |
| v2.5 | 北师大版初中数学六册 |
| v2.4 | 物理画图引擎 + 英语语法专题 |
| v2.1 | 历史课程全面上线（102课） |
| v2.0 | 物理课程完整生成（12章） |
| v1.9 | 化学课程按教材19课题重新生成 |

完整更新日志见 [docs/version.md](docs/version.md)。

## License

MIT
