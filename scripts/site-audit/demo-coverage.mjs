/**
 * 解析 playwright：优先项目依赖，其次 npx 缓存（`npx playwright install` 后可用）
 */
const loadChromium = async () => {
  try {
    return (await import('playwright')).chromium;
  } catch {
    const { execSync } = await import('node:child_process');
    const os = await import('node:os');
    const path = await import('node:path');
    const base = path.join(os.homedir(), '.npm', '_npx');
    const candidates = [];
    try {
      const dirs = execSync(`ls -d ${base}/*/node_modules/playwright 2>/dev/null || true`, {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean);
      dirs.forEach(d => candidates.push(path.join(d, 'index.mjs')));
    } catch {
      /* ignore */
    }
    for (const c of candidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return (await import(c)).chromium;
      } catch {
        /* try next */
      }
    }
    console.error(
      '未找到 playwright，请先执行：npm i -D playwright && npx playwright install chromium',
    );
    process.exit(2);
  }
};

const chromium = await loadChromium();
const BASE = process.env.SITE_BASE || 'http://127.0.0.1:5173';
/** demo 覆盖率巡检：每个 demo 的中文标题必须在页面上出现（跳过 helper / debug 样例） */

import fs from 'node:fs';
import path from 'node:path';

const COMPONENTS_DIR = 'components';
const comps = fs
  .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const allDemoSources = comps.flatMap(c => {
  const dir = path.join(COMPONENTS_DIR, c, 'demo');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.vue') && f !== 'index.vue')
    .map(f => ({ comp: c, file: f, src: fs.readFileSync(path.join(dir, f), 'utf8') }));
});

const isHelper = (src, comp, file) =>
  allDemoSources.some(
    o =>
      o.comp === comp &&
      o.file !== file &&
      new RegExp(`from '\\./${file.replace(/\.vue$/, '')}`).test(o.src),
  );

const targets = [];
for (const c of comps) {
  const dir = path.join(COMPONENTS_DIR, c, 'demo');
  if (!fs.existsSync(dir)) continue;
  const expected = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.vue') && f !== 'index.vue')) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (!src.includes('<docs>')) continue; // helper
    if (/debug:\s*true/.test(src)) continue; // 仅调试
    if (isHelper(src, c, f)) continue;
    const m = src.match(/title:\s*\n\s*zh-CN:\s*(.+)/);
    if (!m) continue;
    expected.push({ file: f, title: m[1].trim() });
  }
  if (expected.length) targets.push({ comp: c, expected });
}

const browser = await chromium.launch();
const problems = [];
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(`${BASE}/components/${t.comp}-cn`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      break;
    } catch {
      await page.waitForTimeout(1500 * attempt);
    }
  }
  await page.waitForTimeout(1200);
  let titles = [];
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      titles = await page.evaluate(() =>
        [...document.querySelectorAll('.code-box-title')].map(e => (e.textContent || '').trim()),
      );
      break;
    } catch {
      await page.waitForTimeout(1500);
    }
  }
  const missing = t.expected.filter(e => !titles.some(x => x.includes(e.title)));
  if (missing.length)
    problems.push({ comp: t.comp, missing, rendered: titles.length, expected: t.expected.length });
  await page.close();
}
await browser.close();

console.log(`巡检 ${targets.length} 个组件，缺失样例的组件 ${problems.length} 个`);
for (const p of problems) {
  console.log(`\n✗ ${p.comp}（页面渲染 ${p.rendered} / 期望 ${p.expected}）`);
  p.missing.forEach(m => console.log(`   - ${m.file}  「${m.title}」`));
}
if (!problems.length) console.log('✅ 所有样例均已渲染');
