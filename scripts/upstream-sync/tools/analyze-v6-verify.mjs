#!/usr/bin/env node
/**
 * 二次校验：对 B/C 类差异做「全包 .d.ts 全文搜索」验证，
 * 过滤掉因 `extends RcXxxProps`（外部类型）造成的假阳性。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const P5 = path.join(ROOT, '.cache/upstream/5.29.3/package/es');
const P6 = path.join(ROOT, '.cache/upstream/6.7.1/package/es');
const diff = JSON.parse(fs.readFileSync(path.join(ROOT, '.cache/v6-diff.json'), 'utf8'));

function allDtsText(dir) {
  let buf = '';
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.d.ts')) buf += fs.readFileSync(p, 'utf8') + '\n';
    }
  })(dir);
  return buf;
}

const text6All = allDtsText(path.join(P6, '..'));
const text6Comp = {};
const text6 = c => (text6Comp[c] ??= allDtsText(path.join(P6, c)));

const wordRe = w => new RegExp(`\\b${w.replace(/[$]/g, '\\$')}\\b`);

console.log('### C. v6 「移除」props —— 全文校验（全包搜不到=真移除 / 在别的组件里出现=跨组件迁移 / 完全搜不到且 5.x 属外部类型=噪音）\n');
const realRemoved = {};
for (const [c, list] of Object.entries(diff.removed)) {
  const rows = list.map(p => {
    const inOwn = wordRe(p).test(text6(c));
    const inAll = wordRe(p).test(text6All);
    const verdict = inOwn ? '仍在该组件(解析噪音)' : inAll ? '跨组件出现(需人查)' : '全包消失(真移除)';
    return { p, verdict };
  });
  realRemoved[c] = rows;
  console.log(`${c}:`);
  for (const r of rows) console.log(`  - ${r.p}: ${r.verdict}`);
}

console.log('\n### B. v6 「新增」props —— 全文校验（已存在于 5.x 全包=升级噪音/跨组件）\n');
const text5All = allDtsText(path.join(P5, '..'));
const realAdded = {};
for (const [c, list] of Object.entries(diff.added)) {
  const rows = list.map(p => {
    const inOwn6 = wordRe(p).test(text6(c));
    const in5All = wordRe(p).test(text5All);
    const verdict = !inOwn6 ? '不在 6.x 该组件(解析噪音)' : in5All ? '5.x 已存在(跨组件/通用词)' : '真新增';
    return { p, verdict };
  });
  realAdded[c] = rows;
}
// 只打印含「真新增」的组件，且只列真新增项
let totalReal = 0;
for (const [c, rows] of Object.entries(realAdded)) {
  const real = rows.filter(r => r.verdict === '真新增').map(r => r.p);
  if (!real.length) continue;
  totalReal += real.length;
  console.log(`${c} (${real.length}): ${real.join(', ')}`);
}
console.log(`\n真新增合计: ${totalReal}`);

fs.writeFileSync(path.join(ROOT, '.cache/v6-diff-verified.json'), JSON.stringify({ realRemoved, realAdded }, null, 2));
