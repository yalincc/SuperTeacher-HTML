# SuperTeacher-HTML 部署方案

## 项目概况

| 项目 | 说明 |
|------|------|
| 技术栈 | Vite + React 18 + TypeScript + Tailwind CSS v4 |
| 路由 | react-router-dom v7（SPA 单页应用） |
| 构建命令 | `npm run build` |
| 构建产物 | `dist/` 目录 |
| 部署性质 | 纯前端静态站点，无需后端服务 |

## 构建流程

```bash
# 安装依赖（首次或依赖更新时）
npm install

# 构建生产版本
npm run build
```

构建完成后，`dist/` 目录结构如下：

```
dist/
├── index.html          # 入口页面
├── assets/             # JS、CSS、字体等打包资源（带 hash 文件名）
│   ├── index-[hash].js
│   └── index-[hash].css
└── gifs/               # 静态资源（从 public/ 复制）
    ├── correct.gif
    └── wrong.gif
```

> **说明**：Vite 构建时会自动将 `public/` 目录中的文件原样复制到 `dist/` 根目录。

---

## 部署平台方案

### 方案一：Vercel（已配置）

项目根目录已有 `vercel.json`，配置了 SPA 路由重定向和静态资源缓存。

**Git 自动部署（推荐）**

1. 将项目推送到 GitHub / GitLab
2. 登录 [vercel.com](https://vercel.com)，导入仓库
3. Vercel 自动识别 Vite 项目，无需额外配置
4. 后续每次 push 自动触发部署

**CLI 手动部署**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署预览
vercel

# 部署到生产环境
vercel --prod
```

**已有配置 `vercel.json`**：

```json
{
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- 免费额度：Hobby 计划足够个人/教育项目使用
- 优势：自动 CI/CD、全球 CDN、自动 HTTPS

---

### 方案二：Netlify（当前使用）

**手动部署（拖拽 dist）**

1. 本地运行 `npm run build`
2. 登录 [app.netlify.com](https://app.netlify.com)
3. 将 `dist/` 文件夹直接拖拽到 Sites 页面
4. 部署完成，自动生成 `xxx.netlify.app` 域名

**Git 自动部署（推荐）**

1. 推送项目到 GitHub
2. 在 Netlify 中 Add new site → Import from Git
3. 配置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. 后续每次 push 自动触发部署

**SPA 路由重定向**

项目根目录已配置 `public/_redirects`，Vite 构建时会自动复制到 `dist/`：

```
/*    /index.html   200
```

如果没有该文件，需要手动在 `dist/` 根目录创建，否则刷新子路由页面会 404。

- 免费额度：Free 计划 100GB/月带宽
- 优势：拖拽部署简单、支持表单处理

---

### 方案三：Cloudflare Pages

**Git 自动部署**

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)，进入 Pages
2. Create a project → Connect to Git
3. 配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 部署完成

**手动上传**

1. 本地 `npm run build`
2. 在 Cloudflare Pages 中选择 Direct Upload
3. 上传 `dist/` 文件夹

**SPA 路由重定向**

Cloudflare Pages 需要在项目设置中配置 Single Page Application redirect，或在 `dist/` 根目录放置 `_redirects` 文件（同 Netlify 格式）：

```
/*    /index.html   200
```

- 免费额度：无限带宽、500 次构建/月
- 优势：国内访问速度较好、带宽无限制

---

### 方案四：GitHub Pages

**通过 GitHub Actions 自动部署**

1. 修改 `vite.config.ts`，添加 `base` 路径：

```ts
export default defineConfig({
  base: '/仓库名/',   // 例如 '/SuperTeacher-HTML/'
  plugins: [react(), tailwindcss()],
  // ...
})
```

2. 在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. 推送到 GitHub，自动部署到 `https://用户名.github.io/仓库名/`

**注意事项**

- GitHub Pages 部署在子路径下，`base` 配置必须正确，否则资源加载 404
- 如果使用自定义域名绑定到根域名，`base` 可设为 `'/'`
- 免费额度：完全免费，1GB 存储 + 100GB/月带宽
- 缺点：国内访问不稳定

---

## SPA 路由配置对照

由于项目使用 react-router-dom（客户端路由），所有平台都需要将未知路由重定向回 `index.html`，否则用户刷新或直接访问子路由时会 404。

| 平台 | 配置方式 |
|------|---------|
| Vercel | `vercel.json` 中的 `rewrites`（已配置） |
| Netlify | `dist/_redirects` 文件：`/* /index.html 200` |
| Cloudflare Pages | `dist/_redirects` 文件或控制台 SPA redirect |
| GitHub Pages | 需自定义 404.html 配合 JS 跳转（较麻烦） |

---

## 自定义域名

| 平台 | 操作路径 |
|------|---------|
| Vercel | 项目 Settings → Domains → 添加域名，按提示配置 DNS |
| Netlify | 项目 Domain settings → Add custom domain |
| Cloudflare Pages | 项目 Custom domains → 添加，若 DNS 在 CF 则自动配置 |
| GitHub Pages | 仓库 Settings → Pages → Custom domain |

所有平台均自动提供 HTTPS 证书（Let's Encrypt）。

---

## 常见问题

### Q1：刷新页面后 404
**原因**：SPA 路由未配置重定向。
**解决**：确认对应平台的 SPA 路由配置已生效（见上方对照表）。

### Q2：CSS/JS 资源加载 404
**原因**：`vite.config.ts` 中的 `base` 路径与实际部署路径不匹配。
**解决**：
- 部署在根域名（如 `xxx.vercel.app`）：`base` 保持默认 `'/'`
- 部署在子路径（如 GitHub Pages `xxx.github.io/repo/`）：`base` 设为 `'/repo/'`

### Q3：静态资源（gif 图片）找不到
**原因**：`public/` 目录中的文件构建后才会复制到 `dist/`，开发时直接用 `/gifs/xxx.gif` 引用。
**解决**：确保构建后 `dist/gifs/` 目录存在，开发环境引用路径以 `/` 开头。

### Q4：Vercel 部署一直卡住
**原因**：通常是网络连接问题或 Vercel 服务本身的状态。
**解决**：
- 检查 [vercel-status.com](https://www.vercel-status.com) 确认服务状态
- 尝试使用 CLI 部署：`vercel --prod`
- 或切换至其他平台（Netlify / Cloudflare Pages）

### Q5：部署后页面没有更新
**原因**：浏览器缓存了旧版本。
**解决**：
- 强制刷新：`Ctrl + Shift + R`（Windows）/ `Cmd + Shift + R`（Mac）
- Vercel 已配置 `assets/` 的长期缓存（`immutable`），由于文件名含 hash，实际不会出现缓存冲突

---

## 推荐方案

| 场景 | 推荐 |
|------|------|
| 最省心（已配好） | Vercel |
| 国内访问优先 | Cloudflare Pages |
| 快速分享预览 | Netlify 拖拽部署 |
| 完全免费无限制 | Cloudflare Pages |
| GitHub 生态集成 | GitHub Pages |
