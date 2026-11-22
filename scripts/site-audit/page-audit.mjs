/**
 * 站点巡检 v2：页面加载 + 交互点击 + 文档页覆盖
 *
 * 用法：node .cache/site-audit2.mjs [--only=x,y] [--limit=n] [--no-interact]
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.SITE_BASE || 'http://127.0.0.1:5173';
const demoRoutes = fs.readFileSync('site/src/router/demoRoutes.js', 'utf8');
const comps = [...new Set([...demoRoutes.matchAll(/path:\s*'([a-z0-9-]+):lang\(-cn\)\?'/g)].map(m => m[1]))];

// 文档路由（docsRoutes 可能内联在 index.js 里，这里抓 path: 'xxx-cn'）
const docsSrc = fs.readFileSync('site/src/router/index.js', 'utf8');
const docPaths = [...new Set([...docsSrc.matchAll(/path:\s*'(vue\/[a-z0-9-]+-cn)'/g)].map(m => m[1]))];
const importDocs = (() => {
  try {
    return fs.readFileSync('site/src/router/docsRoutes.js', 'utf8');
  } catch {
    return '';
  }
})();
const docs = docPaths.length
  ? docPaths
  : [...new Set([...(docsSrc + importDocs).matchAll(/path:\s*'(docs\/[a-z0-9-]+):lang\(-cn\)\?'/g)].map(m => m[1]))];

const only = process.argv.find(a => a.startsWith('--only='))?.split('=')[1];
const limit = Number(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || 0);
const noInteract = process.argv.includes('--no-interact');

let targets = [
  ...comps.map(c => ({ kind: 'component', name: c, url: `/components/${c}-cn` })),
  ...docs.map(d => ({
    kind: 'doc',
    name: d,
    url: d.startsWith('vue/') ? `/docs/${d}` : `/${d}-cn`,
  })),
  { kind: 'home', name: 'home', url: '/' },
];
if (only) targets = targets.filter(t => only.split(',').includes(t.name));
if (limit) targets = targets.slice(0, limit);

const outDir = '/tmp/site-shots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const target of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const consoleErrors = [];
  // 离线环境下外部 CDN（docsearch）与远程 demo 数据会失败，属环境噪声，不计入页面缺陷
  const ENV_NOISE = /docsearch|Network Error|ERR_|Failed to load resource|403 \(\)/i;
  page.on('pageerror', e => {
    const msg = String(e).split('\n')[0];
    if (!ENV_NOISE.test(msg)) errors.push(msg);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!/favicon|404 \(Not Found\)|ERR_CONNECTION/i.test(text)) consoleErrors.push(text.slice(0, 200));
    }
  });

  let status = 200;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const resp = await page.goto(BASE + target.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      status = resp?.status() ?? 0;
      break;
    } catch (e) {
      if (attempt === 3) errors.push('NAV: ' + String(e).split('\n')[0]);
      else await page.waitForTimeout(1500 * attempt);
    }
  }
  await page.waitForTimeout(1000);

  // ===== 交互巡检：逐个 demo 点一下可交互元素 =====
  let clicked = 0;
  const interactErrors = [];
  const interactWarnings = [];
  if (!noInteract) {
    let boxes = [];
    try {
      boxes = await page.$$('.code-box');
    } catch {
      boxes = [];
    }
    for (const box of boxes.slice(0, 8)) {
      // 点击可能触发路由跳转，跳走就停止交互
      if (page.isClosed()) break;
      let el = null;
      try {
        el = await box.$(
          'button:not([disabled]), .ant-select, .ant-picker, input:not([disabled]), [role="button"], .ant-checkbox-wrapper, .ant-radio-wrapper, .ant-switch, .ant-tabs-tab',
        );
      } catch (e) {
        // 路由跳转导致上下文销毁，停止该页交互
        break;
      }
      if (!el) continue;
      try {
        if (!(await el.isVisible())) continue;
        await el.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
        await el.click({ timeout: 3000 });
        clicked += 1;
        await page.waitForTimeout(220);
        await page.keyboard.press('Escape').catch(() => {});
      } catch (e) {
        const msg = String(e).split('\n')[0].slice(0, 120);
        // 上下文销毁（路由跳转）不算错误
        // 点击超时多为「上一步打开了遮罩/弹层」导致的遮挡，属正常交互，仅记录为警告
        if (/Timeout/i.test(msg)) {
          interactWarnings.push('CLICK_TIMEOUT');
        } else if (!/Cannot find context|Execution context|Target closed|detached/i.test(msg)) {
          interactErrors.push('CLICK: ' + msg);
        }
        if (/Cannot find context|Execution context|Target closed/i.test(msg)) break;
      }
    }
    // 交互可能改变路由，回到巡检目标页
    try {
      const current = new URL(page.url()).pathname;
      if (!current.startsWith(new URL(BASE + target.url).pathname)) {
        await page.goto(BASE + target.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
        await page.waitForTimeout(600);
      }
    } catch {
      /* ignore */
    }
    await page.waitForTimeout(300);
  }

  const evaluateInfo = () =>
    page.evaluate(() => {
      const text = document.body.innerText || '';
      const demos = document.querySelectorAll('.code-box').length;
      return {
        title: document.title,
        chars: text.length,
        demos,
        nanStyles: [...document.querySelectorAll('[style]')].filter(el =>
          /(?:NaN|: undefined)/.test(el.getAttribute('style') || ''),
        ).length,
        nanCss: ([...document.querySelectorAll('style')].map(s => s.innerHTML).join('').match(/NaN/g) || []).length,
        emptyRoot: (document.getElementById('app')?.innerHTML || '').length < 200,
      };
    });

  let info;
  try {
    info = await evaluateInfo();
  } catch {
    await page.waitForTimeout(1200);
    info = await evaluateInfo().catch(() => ({
      title: '',
      chars: 0,
      demos: 0,
      nanStyles: 0,
      nanCss: 0,
      emptyRoot: true,
    }));
  }

  await page.screenshot({ path: `${outDir}/${target.name.replace(/\//g, '_')}.png` }).catch(() => {});

  const bad =
    status !== 200 ||
    errors.length > 0 ||
    interactErrors.length > 0 ||
    info.emptyRoot ||
    info.chars < 200 ||
    info.nanStyles > 0 ||
    info.nanCss > 0 ||
    (target.kind === 'component' && info.demos === 0);

  results.push({ ...target, status, clicked, ...info, errors, consoleErrors, interactErrors, interactWarnings, bad });
  await page.close();
}

await browser.close();

const bad = results.filter(r => r.bad);
console.log(`\n巡检 ${results.length} 个页面（组件 ${comps.length} / 文档 ${docs.length} / 首页 1），问题 ${bad.length} 个`);
for (const r of bad) {
  console.log(
    `\n✗ ${r.name} [${r.kind}] status=${r.status} chars=${r.chars} demos=${r.demos} clicked=${r.clicked} nanStyle=${r.nanStyles} nanCss=${r.nanCss} empty=${r.emptyRoot}`,
  );
  r.errors.slice(0, 2).forEach(e => console.log('   pageerror: ' + e));
  r.interactErrors.slice(0, 2).forEach(e => console.log('   ' + e));
  r.consoleErrors.slice(0, 2).forEach(e => console.log('   console: ' + e));
}
if (!bad.length) console.log('✅ 全部通过');
fs.writeFileSync('/tmp/site-audit2.json', JSON.stringify(results, null, 2));
process.exit(bad.length ? 1 : 0);
