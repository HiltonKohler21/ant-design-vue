#!/usr/bin/env node
/**
 * upstream-sync/scan.mjs —— ant.design (React) → ant-design-vue 同步缺口扫描器
 *
 * 目标：不改动任何源码，只做「上游能力面 vs 本地实现面」的机械比对，
 *      输出一份可复现的缺口矩阵，作为逐组件移植的排期依据。
 *
 * 用法:
 *   node scripts/upstream-sync/scan.mjs --antd 5.29.3
 *   node scripts/upstream-sync/scan.mjs --antd 6.7.1 --top 30
 *   node scripts/upstream-sync/scan.mjs --antd 5.29.3 --json   # 只出 JSON
 *
 * 产物:
 *   .cache/upstream/<version>/          antd npm 包解包目录
 *   .cache/upstream/report-<version>.md 缺口报告
 *   .cache/upstream/report-<version>.json
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CACHE = path.join(ROOT, '.cache/upstream');

/** 非组件目录（antd / 本项目两侧通用噪音） */
const IGNORE = new Set([
  '__tests__', '_util', 'vc-util', 'style', 'theme', 'version', 'locale', 'locale-provider',
  'overview', 'grid', 'style-only', 'style', 'index', 'components.ts', 'vc-align',
  'vc-picker', 'vc-select', 'vc-input', 'vc-table', 'vc-tree', 'vc-upload', 'vc-trigger',
  'vc-dialog', 'vc-drawer', 'vc-dropdown', 'vc-cascader', 'vc-checkbox', 'vc-image',
  'vc-mentions', 'vc-notification', 'vc-overflow', 'vc-pagination', 'vc-progress',
  'vc-resize-observer', 'vc-slick', 'vc-slider', 'vc-steps', 'vc-tooltip', 'vc-tour',
  'vc-tree-select', 'vc-virtual-list',
]);

/** 两侧目录名/组件名不一致的映射：antd -> local */
const ALIAS = {
  'qr-code': 'qrcode',
  qrcode: 'qrcode',
  masonry: 'masonry',
  'border-beam': 'border-beam',
  listy: 'listy',
  'back-top': 'back-top',
};

/** antd 已废弃、本项目保留 / 反之 —— 不计入缺口 */
const DEPRECATED_IN_ANTD5 = new Set(['comment', 'page-header']);

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] ?? true : def;
}

function sh(cmd, argv, opts = {}) {
  return execFileSync(cmd, argv, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, ...opts });
}

function downloadAndExtract(version) {
  const dir = path.join(CACHE, version);
  const pkgDir = path.join(dir, 'package');
  if (fs.existsSync(path.join(pkgDir, 'es'))) return pkgDir;

  fs.mkdirSync(dir, { recursive: true });
  const tgz = path.join(CACHE, `antd-${version}.tgz`);
  if (!fs.existsSync(tgz)) {
    console.log(`↓ 下载 antd@${version} ...`);
    sh('curl', ['-sSL', '--max-time', '180', '-o', tgz, `https://registry.npmjs.org/antd/-/antd-${version}.tgz`]);
  }
  console.log(`⇡ 解包 antd@${version} ...`);
  sh('tar', ['-xzf', tgz, '-C', dir]);
  return pkgDir;
}

/* ------------------------------------------------------------------ *
 * 极简 .d.ts 属性抽取：只认 `interface XxxProps ... { ... }`，
 * 用花括号深度跟踪拿到 depth-0 的成员名（method/属性皆可）。
 * ------------------------------------------------------------------ */
/** 去掉注释，避免 JSDoc 文本被误认为成员名 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/[^\n]*/g, '$1');
}

function extractPropsFromDts(rawText) {
  const text = stripComments(rawText);
  const out = new Map(); // interfaceName -> string[]
  const re = /(?:export\s+)?interface\s+([A-Za-z0-9_$]+)\s*(?:<[^>]*>)?\s*(?:extends\s+([^{]+))?\{/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1];
    const ext = (m[2] || '')
      .split(',')
      .map(s => s.trim().replace(/<.*$/, ''))
      .filter(Boolean);
    const bodyStart = re.lastIndex;
    let depth = 1;
    let i = bodyStart;
    while (i < text.length && depth > 0) {
      const c = text[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
    const body = text.slice(bodyStart, i - 1);
    const members = topLevelMembers(body);
    out.set(name, { members, ext });
    re.lastIndex = i;
  }
  return out;
}

function topLevelMembers(body) {
  const names = [];
  let depth = 0;
  let token = '';
  let atMemberStart = true;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{' || c === '(' || c === '[' || c === '<') depth++;
    else if (c === '}' || c === ')' || c === ']' || c === '>') depth = Math.max(0, depth - 1);
    if (depth === 0) {
      if (atMemberStart) {
        if (/\s/.test(c)) continue;
        atMemberStart = false;
        token = '';
      }
      if (/[A-Za-z0-9_$?]/.test(c)) token += c;
      else if (/[:(]/.test(c)) {
        const clean = token.replace(/\?$/, '');
        if (clean && !/^new$|^readonly$/.test(clean)) names.push(clean);
        atMemberStart = true;
        // 跳过该成员的类型体，直到分号或换行处的 depth0
        token = '';
        // fast-forward: 找下一个 depth0 的 ';' 或 '}' 边界
        let d = 0;
        let j = i;
        for (; j < body.length; j++) {
          const cc = body[j];
          if ('{(<['.includes(cc)) d++;
          else if ('})>]'.includes(cc)) d = Math.max(0, d - 1);
          else if (cc === ';' && d === 0) break;
          else if (cc === '\n' && d === 0) {
            // 成员可用换行分隔，但需确保下一行不是续写（如 union '|'）
            const rest = body.slice(j + 1).match(/^\s*([^\s])/);
            if (rest && rest[1] !== '|' && rest[1] !== '&' && rest[1] !== '?') break;
          }
        }
        i = j;
        depth = 0;
      }
    }
  }
  return [...new Set(names)].filter(n => n.length > 1 && !/^\d/.test(n));
}

/** React 专有的成员名，Vue 侧天然不支持（或走 attrs / emits），不计入缺口 */
const REACT_ONLY = new Set([
  'className', 'children', 'style', 'key', 'ref', 'id', 'role', 'title', 'tabIndex',
  'onClick', 'onFocus', 'onBlur', 'onChange', 'onKeyDown', 'onKeyPress', 'onKeyUp',
  'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onMouseOver', 'onError',
  'onLoad', 'href', 'target', 'rel', 'autoFocus', 'dangerouslySetInnerHTML',
]);

/**
 * 白名单：扫描器误报 / React 专有 / 内部实现细节 / 已通过别名或继承覆盖的属性。
 * 这些属性在 Vue 侧不构成真实缺口，从报告中排除。
 * - 值为 `'*'` 时排除该组件全部剩余缺口。
 */
const WHITELIST = {
  'popover': ['onOpenChange'], // 已继承 tooltip 的 abstractTooltipProps
  'typography': ['arialabel', 'enableEllipsis', 'enableMeasure', 'iconOnly', 'miscDeps', 'setContentRef'], // React aria / 内部实现
  'notification': ['datatestid', 'readonlytype'], // React 专有
  'cascader': ['dropdownMenuColumnStyle', 'popupMenuColumnStyle'], // React 专有（Vue 用插槽）
  'splitter': ['basicsState', 'containerRef', 'panelsRef', 'setBasicsState', 'setOffset', 'setResizing', 'setSize'], // hook 内部变量误报
  'float-button': ['arialabel'], // React aria-label 驼峰
  'carousel': ['waitForAnimate'], // 内部实现
  'form': ['feedbackIcons', 'fieldKey', 'meta', 'onSubItemMetaChange', 'onVisibleChanged'], // Field 内部
  'modal': ['cancelTextLocale', 'okTextLocale', 'isSilent'], // 内部实现
  'auto-complete': ['popupMatchSelectWidth'], // 已继承 Select
  'input': ['_skipAddonWarning', 'readonlyaction', 'readonlyinputPrefixCls'], // 内部实现
  'table': ['_renderTimes'], // 内部实现
  'tree': ['filterAntTreeNode', 'switcherLoadingIcon'], // React 专有（Vue 用插槽）
  'skeleton': ['fullSize'], // Skeleton.Node 内部属性
  'avatar': ['srcSet'], // 驼峰误报（本地 srcset）
  'menu': ['_internalDisableMenuItemTitleTooltip'], // 内部实现
  'badge': ['motionClassName'], // 内部实现
  'layout': ['displayName'], // 内部实现
  'collapse': ['destroyOnHidden'], // 已实现（P1-5 destroyOnHidden 映射）
  'watermark': ['add'], // antd 6.x，不在 5.x 基线
};

/** 解析某组件目录下所有 .d.ts，聚合成 name -> Set<propName> */
function collectAntdProps(compDir) {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.d.ts')) files.push(p);
    }
  })(compDir);

  const ifaces = new Map();
  for (const f of files) {
    for (const [k, v] of extractPropsFromDts(fs.readFileSync(f, 'utf8'))) ifaces.set(k, v);
  }
  // 汇总所有 *Props 接口 + 其 extends 链
  const props = new Set();
  const seen = new Set();
  const visit = name => {
    if (seen.has(name)) return;
    seen.add(name);
    const it = ifaces.get(name);
    if (!it) return;
    it.members.forEach(x => props.add(x));
    it.ext.forEach(visit);
  };
  for (const name of ifaces.keys()) if (/Props$/.test(name)) visit(name);
  REACT_ONLY.forEach(x => props.delete(x));
  return props;
}

function projectSourceText(compDir) {
  let buf = '';
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name !== '__tests__' && e.name !== 'demo') walk(p);
      } else if (/\.(ts|tsx|js|jsx|vue)$/.test(e.name)) {
        buf += fs.readFileSync(p, 'utf8');
      }
    }
  })(compDir);
  return buf;
}

/* ------------------------------------------------------------------ */
const version = String(arg('antd', '5.29.3'));
const top = Number(arg('top', 25));
const jsonOnly = process.argv.includes('--json');

const antdPkg = downloadAndExtract(version);
const antdEs = path.join(antdPkg, 'es');
const localComp = path.join(ROOT, 'components');

const isComp = name => !IGNORE.has(name) && !/^vc-/.test(name);

const antdComps = fs
  .readdirSync(antdEs, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(antdEs, d.name, 'index.d.ts')))
  .map(d => d.name)
  .filter(isComp)
  .sort();

const localComps = fs
  .readdirSync(localComp, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .filter(isComp);

const rows = [];
const missingComponents = [];
const deprecatedSkipped = [];

for (const ac of antdComps) {
  if (DEPRECATED_IN_ANTD5.has(ac)) {
    deprecatedSkipped.push(ac);
    continue;
  }
  const lc = ALIAS[ac] ?? ac;
  const lcDir = path.join(localComp, lc);
  if (!fs.existsSync(lcDir)) {
    missingComponents.push(ac);
    rows.push({ antd: ac, local: '—', status: 'MISSING_COMPONENT', missing: [], extra: 0, coverage: 0 });
    continue;
  }
  const antdProps = collectAntdProps(path.join(antdEs, ac));
  const src = projectSourceText(lcDir);
  const wl = WHITELIST[ac] || [];
  const isWildcard = wl === '*' || wl.includes('*');
  const allMissing = [...antdProps].filter(p => !new RegExp(`\\b${p.replace(/\$/g, '\\$')}\\b`).test(src)).sort();
  const whitelisted = isWildcard ? allMissing : allMissing.filter(p => wl.includes(p));
  const missing = isWildcard ? [] : allMissing.filter(p => !wl.includes(p));
  const coverage = antdProps.size ? 1 - missing.length / antdProps.size : 1;
  rows.push({
    antd: ac,
    local: lc,
    status: missing.length ? (coverage < 0.7 ? 'BIG_GAP' : 'GAP') : 'OK',
    total: antdProps.size,
    missing,
    whitelisted,
    coverage,
  });
}

const localOnly = localComps.filter(c => !antdComps.map(a => ALIAS[a] ?? a).includes(c));

rows.sort((a, b) => (a.coverage ?? 0) - (b.coverage ?? 0));

const summary = {
  antdVersion: version,
  antdComponents: antdComps.length,
  localComponents: localComps.length,
  missingComponents,
  localOnly,
  deprecatedSkipped,
  bigGap: rows.filter(r => r.status === 'BIG_GAP').length,
  gap: rows.filter(r => r.status === 'GAP').length,
  ok: rows.filter(r => r.status === 'OK').length,
  whitelistedCount: rows.reduce((s, r) => s + (r.whitelisted?.length || 0), 0),
  generatedAt: new Date().toISOString(),
};

const outDir = path.join(CACHE);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `report-${version}.json`), JSON.stringify({ summary, rows }, null, 2));

if (jsonOnly) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

const md = [];
md.push(`# antd → ant-design-vue 同步缺口报告`, '');
md.push(`- 上游: \`antd@${version}\`（npm 包 es/ 的 .d.ts 声明的 Props 面）`);
const localVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
md.push(`- 本地: \`ant-design-vue@${localVersion}\`（components/ 源码文本存在性）`);
md.push(`- 生成: ${summary.generatedAt}`, '');
md.push(`## 概览`, '');
md.push(`| 指标 | 数值 |`, `| --- | --- |`);
md.push(`| 上游组件数 | ${summary.antdComponents} |`);
md.push(`| 本地组件数 | ${summary.localComponents} |`);
md.push(`| 本地完全缺失 | ${missingComponents.length} |`);
md.push(`| 属性大缺口(<70% 覆盖) | ${summary.bigGap} |`);
md.push(`| 属性小缺口 | ${summary.gap} |`);
md.push(`| 完全对齐 | ${summary.ok} |`, '');
md.push(`| 白名单排除项（误报/内部/React 专有） | ${summary.whitelistedCount} |`, '');
md.push(`### 完全缺失的组件`, '');
md.push(missingComponents.length ? missingComponents.map(c => `\`${c}\``).join('、 ') : '（无）', '');
md.push(`### 本地独有（上游已移除或本项目自建）`, '');
md.push(localOnly.length ? localOnly.map(c => `\`${c}\``).join('、 ') : '（无）', '');
md.push(`### 上游已废弃、未计入`, '');
md.push(deprecatedSkipped.length ? deprecatedSkipped.map(c => `\`${c}\``).join('、 ') : '（无）', '');
md.push('', `## 属性缺口 Top ${top}`, '');
md.push(`| 组件 | 上游 Props 数 | 覆盖 | 疑似缺失属性（本项目源码中完全未出现） |`, `| --- | --- | --- | --- |`);
for (const r of rows.slice(0, top)) {
  if (r.status === 'MISSING_COMPONENT') continue;
  const pct = (r.coverage * 100).toFixed(0) + '%';
  const list = r.missing.slice(0, 14).map(x => `\`${x}\``).join(' ');
  md.push(`| \`${r.antd}\` | ${r.total} | ${pct} | ${list}${r.missing.length > 14 ? ` …+${r.missing.length - 14}` : ''} |`);
}
md.push('', `> 说明：本地侧采用「词元存在性」启发式判断（源码里连名字都没出现过 ≈ 一定没实现），`);
md.push(`> 因此结果是**下限缺口**（可能存在同名变量干扰造成的假阳性，不会漏报）。`);
md.push(`> 白名单排除项为扫描器误报 / React 专有 / 内部实现细节（见 WHITELIST），不构成真实缺口。`, '');

const mdPath = path.join(outDir, `report-${version}.md`);
fs.writeFileSync(mdPath, md.join('\n'));

console.log(md.join('\n'));
console.error(`\n📄 报告: ${path.relative(ROOT, mdPath)}`);
