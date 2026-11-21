#!/usr/bin/env node
/**
 * 静态样式提取入口（cssVar + zeroRuntime 模式）
 *
 * 组件源码是 Vue JSX，需经项目内的 babel（@vue/babel-plugin-jsx）编译，
 * 因此实际提取逻辑跑在 jest 环境里（tests/bench/zero-runtime-extract.test.js），
 * 本脚本只是稳定入口，便于 npm script / CI 调用。
 *
 * 产物：dist/static-style/antdv.css
 *
 * 用法：
 *   npm run static-style-extract
 *   node scripts/static-style-extract.mjs
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'dist/static-style/antdv.css');

const run = spawnSync(
  'npx',
  ['jest', '--config', '.jest.js', 'tests/bench/zero-runtime-extract.test.js'],
  { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
);

if (run.status !== 0) {
  console.error('\n[static-style-extract] 提取失败');
  process.exit(run.status ?? 1);
}

if (!existsSync(outFile)) {
  console.error(`\n[static-style-extract] 未找到产物：${outFile}`);
  process.exit(1);
}

const size = statSync(outFile).size;
console.log(`\n[static-style-extract] 完成：${outFile}（${(size / 1024).toFixed(1)} KB）`);
console.log('[static-style-extract] 使用方式：');
console.log('  1) 在应用入口引入该 CSS（或交给打包器内联）');
console.log('  2) <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">');
