#!/usr/bin/env node
/**
 * antd 5.29.3 → 6.7.1 迁移差异分析（一次性分析脚本，存放在 .cache 不提交）
 *
 * 输出三类信息：
 *  A. v6 新增组件（5.29.3 没有 / 本地没有）
 *  B. v6 新增 props（5.x → 6.x 新增，需补齐）
 *  C. v6 移除 props（5.x 有、6.x 没有 → 潜在的 breaking 改名/移除，需确认）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const P5 = path.join(ROOT, '.cache/upstream/5.29.3/package/es');
const P6 = path.join(ROOT, '.cache/upstream/6.7.1/package/es');
const LOCAL = path.join(ROOT, 'components');

const IGNORE = new Set([
  '__tests__', '_util', 'style', 'theme', 'version', 'locale', 'locale-provider',
  'overview', 'grid', 'index', 'col', 'row',
]);

const ALIAS = { 'qr-code': 'qrcode', qrcode: 'qrcode', 'color-picker': 'color-picker' };

/* ---------- d.ts props 解析 ---------- */
const stripComments = t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');

function topLevelMembers(body) {
  const names = [];
  let depth = 0, token = '', atStart = true;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if ('{(<['.includes(c)) depth++;
    else if ('})>]'.includes(c)) depth = Math.max(0, depth - 1);
    if (depth === 0) {
      if (atStart) {
        if (/\s/.test(c)) continue;
        atStart = false; token = '';
      }
      if (/[A-Za-z0-9_$?]/.test(c)) token += c;
      else if (/[:(]/.test(c)) {
        const clean = token.replace(/\?$/, '');
        if (clean && !/^new$|^readonly$/.test(clean)) names.push(clean);
        atStart = true; token = '';
        let d = 0;
        for (; i < body.length; i++) {
          const cc = body[i];
          if ('{(<['.includes(cc)) d++;
          else if ('})>]'.includes(cc)) d = Math.max(0, d - 1);
          else if (cc === ';' && d === 0) break;
          else if (cc === '\n' && d === 0) {
            const rest = body.slice(i + 1).match(/^\s*([^\s])/);
            if (rest && !['|', '&', '?'].includes(rest[1])) break;
          }
        }
      }
    }
  }
  return [...new Set(names)].filter(n => n.length > 1 && !/^\d/.test(n));
}

function extractPropsFromDts(raw) {
  const text = stripComments(raw);
  const out = new Map();
  const re = /(?:export\s+)?interface\s+([A-Za-z0-9_$]+)\s*(?:<[^>]*>)?\s*(?:extends\s+([^{]+))?\{/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1];
    const ext = (m[2] || '').split(',').map(s => s.trim().replace(/<.*$/, '')).filter(Boolean);
    const start = re.lastIndex;
    let depth = 1, i = start;
    while (i < text.length && depth > 0) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') depth--;
      i++;
    }
    out.set(name, { members: topLevelMembers(text.slice(start, i - 1)), ext });
    re.lastIndex = i;
  }
  return out;
}

const REACT_ONLY = new Set([
  'className', 'children', 'style', 'key', 'ref', 'id', 'role', 'title', 'tabIndex',
  'onClick', 'onFocus', 'onBlur', 'onChange', 'onKeyDown', 'onKeyPress', 'onKeyUp',
  'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onMouseOver', 'onError',
  'onLoad', 'href', 'target', 'rel', 'autoFocus', 'dangerouslySetInnerHTML',
]);

function collectProps(compDir) {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.d.ts')) files.push(p);
    }
  })(compDir);
  const ifaces = new Map();
  for (const f of files) for (const [k, v] of extractPropsFromDts(fs.readFileSync(f, 'utf8'))) ifaces.set(k, v);
  const props = new Set();
  const seen = new Set();
  const visit = n => {
    if (seen.has(n)) return;
    seen.add(n);
    const it = ifaces.get(n);
    if (!it) return;
    it.members.forEach(x => props.add(x));
    it.ext.forEach(visit);
  };
  for (const n of ifaces.keys()) if (/Props$/.test(n)) visit(n);
  REACT_ONLY.forEach(x => props.delete(x));
  return props;
}

const comps = pkg =>
  fs.readdirSync(pkg, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(pkg, d.name, 'index.d.ts')))
    .map(d => d.name)
    .filter(n => !IGNORE.has(n))
    .sort();

const c5 = comps(P5);
const c6 = comps(P6);
const localDirs = fs.readdirSync(LOCAL, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const only6 = c6.filter(c => !c5.includes(c));
const only5 = c5.filter(c => !c6.includes(c));

const added = {};   // v6 新增 props
const removed = {}; // v6 移除 props（潜在 breaking）

for (const c of c6) {
  if (!c5.includes(c)) continue;
  const p5 = collectProps(path.join(P5, c));
  const p6 = collectProps(path.join(P6, c));
  const add = [...p6].filter(x => !p5.has(x)).sort();
  const rem = [...p5].filter(x => !p6.has(x)).sort();
  if (add.length) added[c] = add;
  if (rem.length) removed[c] = rem;
}

const out = { only6, only5, added, removed, localMissingV6Components: only6.filter(c => !localDirs.includes(ALIAS[c] ?? c)) };
fs.writeFileSync(path.join(ROOT, '.cache/v6-diff.json'), JSON.stringify(out, null, 2));

console.log('### A. v6 新增组件（5.29.3 没有）');
console.log(only6.join(', ') || '(无)');
console.log('\n   本地仍缺失：', out.localMissingV6Components.join(', ') || '(无)');
console.log('\n### B. v6 新增 props（按组件）');
for (const [c, list] of Object.entries(added).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`- ${c} (${list.length}): ${list.join(', ')}`);
}
console.log('\n### C. v6 移除的 props（5.x → 6.x 消失，需确认是否为 breaking 改名）');
for (const [c, list] of Object.entries(removed).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`- ${c} (${list.length}): ${list.join(', ')}`);
}
