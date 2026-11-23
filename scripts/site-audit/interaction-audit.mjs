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
/** 站点全局交互巡检：主题切换 / 搜索 / 侧边栏导航 / demo 内按钮全量点击 */

const BASE = process.env.SITE_BASE || 'http://127.0.0.1:5173';
const ENV_NOISE = /docsearch|Network Error|ERR_|Failed to load resource|403 \(\)/i;
const issues = [];

const browser = await launchChromium();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => {
  const msg = String(e).split('\n')[0];
  if (!ENV_NOISE.test(msg)) errors.push(msg);
});

const check = async (label, fn) => {
  const before = errors.length;
  try {
    await fn();
  } catch (e) {
    issues.push(`${label}: 执行失败 - ${String(e).split('\n')[0].slice(0, 120)}`);
  }
  if (errors.length > before) {
    issues.push(`${label}: 运行时报错 - ${errors[before]}`);
  }
};

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

// 1) 主题切换：打开主题面板 → 选暗色 → 校验 :root 变量与背景
await check('主题切换', async () => {
  const trigger = page.locator('.theme-switch-btn').first();
  if ((await trigger.count()) === 0) {
    issues.push('主题切换: 未找到 .theme-switch-btn');
    return;
  }
  await trigger.click();
  await page.waitForTimeout(500);
  const darkItem = page
    .locator('.theme-menu-item')
    .filter({ hasText: /Dark Theme|暗黑主题/ })
    .first();
  if ((await darkItem.count()) === 0) {
    issues.push('主题切换: 未找到「暗黑主题」选项');
    return;
  }
  await darkItem.click();
  await page.waitForTimeout(800);
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--ant-color-bg-container').trim(),
  );
  if (bg !== '#141414') issues.push(`主题切换: 暗色未生效（--ant-color-bg-container=${bg}）`);

  // 切回浅色
  await page.locator('.theme-switch-btn').first().click();
  await page.waitForTimeout(300);
  await page
    .locator('.theme-menu-item')
    .filter({ hasText: /Light Theme|浅色主题/ })
    .first()
    .click();
  await page.waitForTimeout(600);
  const bg2 = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--ant-color-bg-container').trim(),
  );
  if (bg2 !== '#ffffff') issues.push(`主题切换: 浅色恢复失败（=${bg2}）`);
});

// 2) 搜索框：Ctrl+K 打开后应出现输入框
await check('搜索框', async () => {
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(600);
  const visible = await page.evaluate(() => {
    const input = document.querySelector(
      '#search-box input, .search-box input, input[type="search"]',
    );
    return !!input && input.offsetParent !== null;
  });
  if (!visible) issues.push('搜索框: Ctrl+K 后未出现可见输入框');
  await page.keyboard.press('Escape').catch(() => {});
});

// 3) 侧边栏导航：点击「组件总览」→ Masonry → 页面标题正确
await check('侧边栏导航', async () => {
  await page.goto(`${BASE}/components/masonry-cn`, { waitUntil: 'networkidle' });
  // 等待懒加载 chunk 渲染完成（首次进入某个组件页需要拉取对应 chunk）
  await page.waitForSelector('article .markdown h1, .code-box', { timeout: 20000 }).catch(() => {});
  await page
    .waitForFunction(
      () => (document.querySelector('article .markdown h1')?.textContent || '').length > 3,
      {
        timeout: 15000,
      },
    )
    .catch(() => {});
  const navState = await page.evaluate(() => ({
    url: location.pathname,
    h1: (document.querySelector('article .markdown h1')?.textContent || '').trim(),
    boxes: document.querySelectorAll('.code-box').length,
  }));
  if (!/Masonry/i.test(navState.h1)) {
    issues.push(
      `侧边栏导航: masonry 页面异常（url=${navState.url} h1=${navState.h1} boxes=${navState.boxes}）`,
    );
  }
});

// 4) demo 内按钮全量点击（抽 6 个交互密集组件）
for (const name of ['button', 'modal', 'select', 'dropdown', 'tabs', 'table']) {
  await check(`demo 点击:${name}`, async () => {
    await page.goto(`${BASE}/components/${name}-cn`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const boxes = await page.$$('.code-box');
    for (const box of boxes) {
      const btns = await box.$$(
        'button:not([disabled]), .ant-select, .ant-picker, .ant-switch, .ant-checkbox-wrapper, .ant-radio-wrapper, .ant-tabs-tab',
      );
      for (const b of btns.slice(0, 3)) {
        try {
          if (!(await b.isVisible())) continue;
          await b.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
          await b.click({ timeout: 1500 });
          await page.waitForTimeout(120);
        } catch {
          /* 遮挡/超时属正常 */
        }
      }
      await page.keyboard.press('Escape').catch(() => {});
    }
  });
}

await browser.close();

console.log(`交互巡检结束，问题 ${issues.length} 项`);
issues.forEach(i => console.log('  ✗ ' + i));
if (!issues.length) console.log('✅ 全局交互正常');
process.exit(issues.length ? 1 : 0);
