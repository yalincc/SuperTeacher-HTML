# 部署指南

## 部署平台

| 平台 | 地址 | 状态 |
|------|------|------|
| GitHub Pages | https://yalincc.github.io/SuperTeacher-HTML/ | ✅ 主要使用 |
| 腾讯云 EdgeOne | https://superteach-html-b8h8nbrs.edgeone.cool/ | ✅ 备用（需自定义域名） |
| Gitee | https://yalincc.gitee.io/SuperTeacher-HTML/ | ✅ 代码同步 |

## 关键配置

### base path

`vite.config.ts` 使用环境变量 `VITE_BASE` 控制 base path：
- 默认值 `/`（EdgeOne、Vercel 等根目录部署）
- GitHub Actions 构建时设置 `VITE_BASE=/SuperTeacher-HTML/`

### 路由

使用 `HashRouter`（非 BrowserRouter），URL 格式为 `xxx.com/#/course/math`。
原因：静态托管不支持 SPA 路由回退，HashRouter 不需要服务器配置。

### 构建

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 验证
npm run validate
```

## Git 仓库

| 仓库 | 分支 | 用途 |
|------|------|------|
| GitHub (origin) | main | 生产环境，GitHub Actions 自动部署 |
| Gitee (gitee) | main + master | 代码同步，腾讯云 EdgeOne 监听 master 自动部署 |

推送命令：
```bash
git push origin main    # 推送到 GitHub
git push gitee main     # 推送到 Gitee main
git push gitee main:master  # 同步 Gitee master
```

## 已知问题

1. GitHub Pages 在中国大陆偶尔不稳定，需要 VPN 或等待恢复
2. 腾讯云 EdgeOne 默认域名只有 3 小时预览，需要绑定自定义域名才能长期使用
3. Gitee Pages 需要实名认证，个人用户可能无法使用
