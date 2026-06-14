---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 9a064116c623068efcca33c3c791e7c4_f9099906671111f18805525400d9a7a1
    ReservedCode1: NP1hC5V04Ie/C+86JdJ9EY8HuODWPbG6ctNfPecKSJmZmYeDrNQ93T8iOhsm8iQdkdtG063h6Hj1pJopVdX0yMtkoDH83ViM+3aW+cnmWt4YLZ8EVtFxbcnaQMRiVc+3e0G92/Evegq2EdIW0AMg0nBJEmUqpRl4r7qR7DLVUtGbeS0uibeAoktSZG8=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 9a064116c623068efcca33c3c791e7c4_f9099906671111f18805525400d9a7a1
    ReservedCode2: NP1hC5V04Ie/C+86JdJ9EY8HuODWPbG6ctNfPecKSJmZmYeDrNQ93T8iOhsm8iQdkdtG063h6Hj1pJopVdX0yMtkoDH83ViM+3aW+cnmWt4YLZ8EVtFxbcnaQMRiVc+3e0G92/Evegq2EdIW0AMg0nBJEmUqpRl4r7qR7DLVUtGbeS0uibeAoktSZG8=
---

# LiaScript 项目思路借鉴

> 来源：[LiaScript](https://github.com/LiaScript/LiaScript) | 2026-06-13 整理
> 核心借鉴点：**One Document, Many Representations（一个源文件，多种输出形态）**

---

## 一、LiaScript 是什么

LiaScript 是一个开源的 Markdown 解释器，在浏览器中实时解析远程 Markdown 文件并渲染成交互式课程。技术本质是**运行时解释器**而非构建时转换器。

它最核心的理念是：**一个 MD 源文件 → 三种展示形态，用户在浏览器端自由切换**。

---

## 二、三种展示形态

LiaScript 支持三种模式，用户可在界面上随时切换：

| 模式 | 别名 | 适用场景 | 特点 |
|------|------|----------|------|
| **Textbook** | 课本模式 | 学生自学、课后复习 | 逐页翻页阅读，像翻书一样；内容完整呈现 |
| **Slides** | 幻灯片模式 | 教师课堂投影 | 按 `---` 分页，每页一屏；适合大屏幕展示 |
| **Presentation** | 演示/讲义模式 | 教师备课查阅 | 幻灯片版式 + 逐动画步骤展开内容 |

**关键设计**：三种模式共享同一份 Markdown 源文件，不需要为不同场景维护多份文档。教师在备课阶段用 Presentation 模式预览，上课时切到 Slides 模式投影，学生回家用 Textbook 模式复习——三个场景，一份文件。

---

## 三、具体实现机制

### 3.1 分页控制

Markdown 中的 `---`（水平线）在 Slides/Presentation 模式下自动成为幻灯片分页符，而在 Textbook 模式下保持不可见，仅作为逻辑分隔。

### 3.2 动画步骤（Progressive Disclosure）

```markdown
## 解题步骤

{{1}}
第一步：读题，标出已知条件

{{2}}
第二步：列出化学方程式

{{3}}
第三步：代入数据计算
```

- **Slides 模式**：按 `→` 键逐步显示，像 PPT 动画
- **Textbook 模式**：所有步骤一次性显示，或折叠为手风琴面板

### 3.3 注释分离（Presenter Notes）

```markdown
## 摩尔质量计算

摩尔质量 = 质量 / 物质的量

--{{1}}--
提醒学生注意单位：g/mol
--{{2}}--
此处可提问：为什么摩尔质量数值上等于相对分子质量？
```

`--{{n}}--` 标记的内容在 Textbook 模式下隐藏，在 Slides 演示者视图和 TTS 朗读中出现。TTS 会根据步骤号朗读对应的注释。

### 3.4 TTS 集成

LiaScript 使用 ResponsiveVoice API，支持多语言多音色。每个动画步骤可绑定不同的语音注释，教师制作课件时就能预设"画外音"，适合录制 MOOC 或无障碍教学场景。

---

## 四、对我们项目的借鉴价值

### 4.1 核心理念：一源多用

我们的项目目前只有**课时详情页**一种展示形态。如果同一份 MD 教案能输出：

| 形态 | 场景 | 现状 |
|------|------|------|
| **课时详情页**（现有） | 学生课上互动做题 | 已有 |
| **幻灯片视图** | 教师课堂投影讲解 | 缺失 |
| **讲义打印版** | 学生课后复习/打印 | 缺失 |

这三者完全可以共用同一份 `## 一~五` 模块化 MD 源文件，只是渲染方式不同。

### 4.2 可落地的实现方案

不是照搬 LiaScript 的运行时解释器架构，而是在**构建阶段**生成多形态：

```
docs/curriculum/lesson-01-xxx.md
        │
        ▼ npm run convert
        │
        ├── lesson-01.json          ← 现有：数据层
        │
        └── 前端渲染时提供三种视图模式：
              ├── interactive（互动页，现有）
              ├── slides（幻灯片，新增）
              └── handout（讲义，新增）
```

#### 幻灯片视图（Slides）
- 将 MD 的二级标题（`## 一、学习目标` 等）作为幻灯片分页点
- 每页展示一个知识模块：表格/公式/例题单独成页
- 题目和解析默认折叠，点击展开
- 导航：左右箭头切页 + 底部进度条

#### 讲义视图（Handout）
- 所有内容扁平展示，适合打印或长页面阅读
- 题目答案默认隐藏（可一键显示），方便学生自主练习
- 样式优化为打印友好：去背景色、表格加边框、公式正常渲染

### 4.3 渐进式披露

LiaScript 的 `{{1}} {{2}} {{3}}` 动画步骤语法对我们也有参考价值。在**幻灯片模式**下，知识点或解题步骤可以逐条展示，避免一屏信息过载。具体实现上可以直接用 CSS 动画 + 键盘事件，不需要修改 MD 格式约定。

---

## 五、不建议借鉴的部分

| 功能 | 不借鉴的原因 |
|------|-------------|
| **TTS 语音朗读** | 需要外部 API，增加依赖；课堂场景老师自己讲，用不上 |
| **扩展 Markdown 语法**（`{{|>}}`、`[(X)]` 等） | 与现有 `## 一~五` 模块化格式冲突，徒增教师编写负担 |
| **运行时解释器架构** | 需要加载远程 MD 并实时解析，网络依赖强，与纯静态部署理念矛盾 |
| **PWA / 离线** | 教学场景一般有稳定网络，投入产出比低 |
| **SCORM / IMS 导出** | 对接学校 LMS 系统，不属于"零成本部署"定位 |

---

## 六、总结

LiaScript 最大的价值启示就一句话：**不要让教师为同一个内容写多份文档**。

落到我们的项目上，就是让现有的 `## 一~五` MD 教案一份源文件，既能渲染成互动答题页（已有），也能渲染成课堂投影幻灯片（新增），还能输出成课后复习讲义（新增）。三种形态共享数据层，仅在视图层做呈现差异。
*（内容由AI生成，仅供参考）*
