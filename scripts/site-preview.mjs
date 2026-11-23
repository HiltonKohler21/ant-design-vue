#!/usr/bin/env node
/**
 * 本地预览生产构建的站点（比 `npm run dev` 快很多）
 *
 * dev 模式下站点把 `ant-design-vue` 别名到仓库源码，每个页面要按模块逐个请求
 * 上千个文件；在 WSL 的 /mnt/d（9p 文件系统）上首屏可能需要几十秒。
 * 如果只是想浏览/验收页面，直接跑本脚本：构建 + 静态托管，页面基本秒开。
 *
 *   npm run site:preview            # 构建并托管到 http://127.0.0.1:4173
 *   npm run site:preview -- --skip-build
 */
import { spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'site/dist');
const port = Number(process.env.PORT || 4173);
const skipBuild = process.argv.includes('--skip-build');

if (!skipBuild) {
  console.log('[site:preview] 构建站点…');
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('[site:preview] 未找到 site/dist/index.html，请先构建');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.normalize(path.join(distDir, urlPath));
    if (!file.startsWith(distDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(distDir, 'index.html'); // SPA fallback
    }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    if (file.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`\n[site:preview] 已启动： http://127.0.0.1:${port}\n`);
  });
