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
