# 站点巡检脚本（/loop 自检）

三个脚本都用 Playwright 打开真实页面做核对，**建议对生产构建**运行（开发态首屏需要拉取数百个模块，冷启动较慢）：

```bash
npm run build                                  # 产物在 site/dist
node -e "..."                                  # 或用任意静态服务器 + SPA fallback 托管 site/dist
SITE_BASE=http://127.0.0.1:4173 node scripts/site-audit/page-audit.mjs        # 92 个页面：加载/报错/NaN 样式/点击
SITE_BASE=http://127.0.0.1:4173 node scripts/site-audit/demo-coverage.mjs     # 每个 demo 是否真的渲染出来
SITE_BASE=http://127.0.0.1:4173 node scripts/site-audit/interaction-audit.mjs # 主题切换/搜索/侧边栏/按钮全量点击
```

依赖：

```bash
npm i -D playwright          # 或 npx -y playwright@latest（脚本内为静态 import，需能解析到包）
npx playwright install chromium
```

约定：
- `page-audit` 会跳过外部 CDN（docsearch）与远程数据失败等环境噪声；
- `demo-coverage` 会跳过 helper 组件（被其它 demo 引用的子组件）与 `debug: true` 的调试样例；
- 三个脚本任意一个非 0 退出即代表站点存在需要修复的问题。

## 为什么建议对生产构建巡检

站点在 dev 下把 `ant-design-vue` 别名到仓库源码（`components/`），一个页面要按模块
逐个请求 ≈1500 个文件；在 WSL 的 `/mnt/d`（9p 文件系统）上实测首屏 ≈13s，
而生产构建（打包为 chunk）同一个页面 ≈1s。

因此：

- **浏览/验收页面** 用 `npm run site:preview`（构建 + 静态托管，默认 http://127.0.0.1:4173），
  再配合本目录脚本巡检；
- **改组件源码** 才用 `npm run dev`（有 HMR，但首屏慢，属环境/架构成本）；
- 若长期在 WSL 开发，把仓库放到 Linux 原生文件系统（如 `~/ant-design-vue`）可显著改善。
