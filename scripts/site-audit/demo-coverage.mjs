/**
 * 解析 playwright：优先项目依赖，其次 npx 缓存（`npx playwright install` 后可用）
 */
const loadChromiumCandidates = async () => {
  const fsMod = await import('node:fs');
  const osMod = await import('node:os');
  const pathMod = await import('node:path');
  const { pathToFileURL } = await import('node:url');

  const hasBundledBrowser = mod => {
    try {
      const exe = mod?.chromium?.executablePath?.();
      if (!exe) return false;
      if (fsMod.existsSync(exe)) return true;
      const revMatch = exe.match(/chromium(?:_headless_shell)?-(\d+)/);
      if (revMatch) {
        const rev = revMatch[1];
        const cacheRoot = exe.slice(0, exe.indexOf(revMatch[0]));
        return (
          fsMod.existsSync(pathMod.join(cacheRoot, `chromium_headless_shell-${rev}`)) ||
          fsMod.existsSync(pathMod.join(cacheRoot, `chromium-${rev}`))
        );
      }
      return false;
    } catch {
      return false;
    }
  };

  const preferred = [];
  const fallbacks = [];
  const addMod = mod => {
    if (!mod?.chromium) return;
    if (hasBundledBrowser(mod)) preferred.push(mod.chromium);
    else fallbacks.push(mod.chromium);
  };

  try {
    addMod(await import('playwright'));
  } catch {
    /* try npx cache */
  }

  const npxBases = [
    pathMod.join(osMod.homedir(), '.npm', '_npx'),
    process.env.LOCALAPPDATA
      ? pathMod.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx')
      : pathMod.join(osMod.homedir(), 'AppData', 'Local', 'npm-cache', '_npx'),
  ];
  const seen = new Set();
  for (const base of npxBases) {
    if (!fsMod.existsSync(base)) continue;
    try {
      for (const entry of fsMod.readdirSync(base, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const pwEntry = pathMod.join(base, entry.name, 'node_modules', 'playwright', 'index.mjs');
        if (fsMod.existsSync(pwEntry) && !seen.has(pwEntry)) {
          seen.add(pwEntry);
          try {
            // eslint-disable-next-line no-await-in-loop
            addMod(await import(pathToFileURL(pwEntry).href));
          } catch {
            /* try next */
          }
        }
      }
    } catch {
      /* ignore */
    }
  }

  const all = [...preferred, ...fallbacks];
  if (!all.length) {
    console.error(
      '未找到 playwright，请先执行：npm i -D playwright && npx playwright install chromium',
    );
    process.exit(2);
  }
  return all;
};

const launchChromium = async () => {
  const candidates = await loadChromiumCandidates();
  let lastErr;
  for (const chromium of candidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await chromium.launch();
    } catch (err) {
      lastErr = err;
    }
  }
  for (const channel of ['chrome', 'msedge']) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await candidates[0].launch({ channel });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
};
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

const stripYamlQuotes = val =>
  val
    .trim()
    .replace(/^(['"])(.*)\1$/, '$2')
    .trim();

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
    expected.push({ file: f, title: stripYamlQuotes(m[1]) });
  }
  if (expected.length) targets.push({ comp: c, expected });
}

const browser = await launchChromium();
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
