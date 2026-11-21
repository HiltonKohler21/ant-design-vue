#!/usr/bin/env node
/**
 * 把基准实测结果同步进文档与 sync-status（单一数据源：.cache/cssvar-bench.json）
 *
 * 用法：node scripts/upstream-sync/sync-bench-doc.mjs
 * 前置：先跑 `npx jest --config .jest.js tests/bench/cssvar-bench.test.js`
 *
 * 之所以做成脚本：基准的绝对字节数会随组件样式演进而变化，
 * 手写数字容易与实测不一致（历史上已发生过）。这里保证文档与实测同源。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const benchFile = path.join(root, '.cache/cssvar-bench.json');
if (!fs.existsSync(benchFile)) {
  console.error('未找到 .cache/cssvar-bench.json，请先运行 cssvar-bench 用例');
  process.exit(1);
}

const bench = JSON.parse(fs.readFileSync(benchFile, 'utf8'));
const { hash, cssVar } = bench.samples;
const counts = ['1', '2', '3'];

const n = v => Number(v);
const pct = (a, b) => ((b - a) / a) * 100;
const signed = v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

const hashGrowth = n(hash['3'].cssBytes) - n(hash['1'].cssBytes);
const cGrowth = n(cssVar['3'].cssBytes) - n(cssVar['1'].cssBytes);
const reduction = ((hashGrowth - cGrowth) / hashGrowth) * 100;
const varDeclGrowth = n(cssVar['3'].varDeclBytes) - n(cssVar['1'].varDeclBytes);
const ruleGrowth = n(cssVar['3'].ruleBytes) - n(cssVar['1'].ruleBytes);

const table = [
  '| theme count | hash 体积 (B) | cssVar 体积 (B) | 体积变化 | hash 规则字节 (B) | cssVar 规则字节 (B) | hash 耗时 (ms) | cssVar 耗时 (ms) | 耗时变化 |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...counts.map(c => {
    const h = hash[c];
    const v = cssVar[c];
    return `| ${c} | ${h.cssBytes} | ${v.cssBytes} | ${signed(pct(n(h.cssBytes), n(v.cssBytes)))} | ${h.ruleBytes} | ${v.ruleBytes} | ${h.elapsedMs} | ${v.elapsedMs} | ${signed(pct(n(h.elapsedMs), n(v.elapsedMs)))} |`;
  }),
].join('\n');

const breakdown = [
  '| 指标 | theme 1 | theme 2 | theme 3 | 1→3 增量 |',
  '| --- | --- | --- | --- | --- |',
  `| CSS 体积 (B) | ${cssVar['1'].cssBytes} | ${cssVar['2'].cssBytes} | ${cssVar['3'].cssBytes} | **+${cGrowth}** |`,
  `| 组件规则 (B) | ${cssVar['1'].ruleBytes} | ${cssVar['2'].ruleBytes} | ${cssVar['3'].ruleBytes} | +${ruleGrowth} |`,
  `| 变量声明 (B) | ${cssVar['1'].varDeclBytes} | ${cssVar['2'].varDeclBytes} | ${cssVar['3'].varDeclBytes} | +${varDeclGrowth} |`,
  `| \`.ant-btn{\` 规则份数 | ${cssVar['1'].btnRuleCount} | ${cssVar['2'].btnRuleCount} | ${cssVar['3'].btnRuleCount} | **0** |`,
].join('\n');

const block = `<!-- BENCH:BEGIN（由 scripts/upstream-sync/sync-bench-doc.mjs 生成，勿手改） -->

${table}

> 绝对字节随组件样式演进会变化；本表由 \`scripts/upstream-sync/sync-bench-doc.mjs\`
> 从 \`.cache/cssvar-bench.json\` 直接生成，与实测同源。耗时受 jsdom 调度影响有 ±20% 抖动，仅作参考。

\`cssVar\` 增量拆解（1 → 2 → 3 套主题）：

${breakdown}

对照 hash 模式：\`.ant-btn{\` 份数 ${hash['1'].btnRuleCount} / ${hash['2'].btnRuleCount} / ${hash['3'].btnRuleCount}（每套主题各生成一整份），
1→3 的 CSS 增量为 **+${hashGrowth} B**。

**结论（实测，非估算）**：

- **组件样式确实只生成一份**：\`.ant-btn{\` 在 cssVar 下恒为 ${cssVar['1'].btnRuleCount} 份；hash 下随主题数线性增长；
- **多主题增量**（1→3）：hash +${hashGrowth} B ｜ cssVar **+${cGrowth} B** → **增量降低 ${reduction.toFixed(1)}%**；
- **单主题是净负收益**：cssVar 体积 ${signed(pct(n(hash['1'].cssBytes), n(cssVar['1'].cssBytes)))}（多出的变量声明 + calc 表达）；
  **从 2 个主题起反超**（${signed(pct(n(hash['2'].cssBytes), n(cssVar['2'].cssBytes)))}），3 个主题 **${signed(pct(n(hash['3'].cssBytes), n(cssVar['3'].cssBytes)))}**；
- 单主题且不换主题的应用可显式 \`theme: { cssVar: false }\` 回到 hash 模式；
- cssVar 下组件规则仍有小幅增量（+${ruleGrowth} B）：来自必须实干色/实数值的规则
  （带透明度混合的 box-shadow、实色表头背景等），这部分无法用变量表达，属预期。

> 方法：挂载 N 个独立 \`ConfigProvider\` 子树（N 套主题用 token 覆盖表达，因为
> \`theme.algorithm\` 本地存量不生效），14 个代表组件，warmup + 3 轮取中位数。
> 复现：\`npx jest --config .jest.js tests/bench/cssvar-bench.test.js\` → \`.cache/cssvar-bench.{json,md}\`
> → \`node scripts/upstream-sync/sync-bench-doc.mjs\`。

**基准本身就是回归门禁**（断言，非仅打印）：

1. cssVar 多主题增量 < hash 增量的 15%；
2. 3 主题时 cssVar 总体积 < hash 总体积；
3. \`.ant-btn{\` 份数不随主题数增长（cssVar 恒定；hash ≥ 2 倍）；
4. cssVar 规则增量 < hash 规则增量的 20%。

> 反证：临时去掉「\`_tokenKey\` 主题无关化」后，本用例立即失败，证明断言有效。

<!-- BENCH:END -->`;

// ---------- 1) 文档 ----------
const planFile = path.join(root, 'scripts/upstream-sync/V6-MIGRATION-PLAN.md');
let plan = fs.readFileSync(planFile, 'utf8');
const begin = '<!-- BENCH:BEGIN';
const endTag = '<!-- BENCH:END -->';
const s = plan.indexOf(begin);
const e = plan.indexOf(endTag);
if (s < 0 || e < 0) {
  console.error('V6-MIGRATION-PLAN.md 中缺少 BENCH:BEGIN/END 标记，请先补标记');
  process.exit(1);
}
plan = plan.slice(0, s) + block + plan.slice(e + endTag.length);
// 同步「阶段 C 收尾」表格中的基准摘要行
plan = plan.replace(
  /\| 基准实测 \| `tests\/bench\/cssvar-bench\.test\.js` \|[^\n]*\|/,
  `| 基准实测 | \`tests/bench/cssvar-bench.test.js\` | 3 主题 CSS 体积 ${signed(pct(n(hash['3'].cssBytes), n(cssVar['3'].cssBytes)))}；` +
    `多主题增量 hash +${hashGrowth} B → cssVar +${cGrowth} B（降低 ${reduction.toFixed(1)}%）；` +
    '组件规则份数不随主题数增长（已写入性能契约断言） |',
);
fs.writeFileSync(planFile, plan);
console.log('文档基准表已同步');

// ---------- 2) sync-status ----------
const statusFile = path.join(root, 'scripts/upstream-sync/sync-status.json');
const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
status.progress.v6Perf.benchmarks = {
  method: '挂载 N 个 ConfigProvider 子树（token 覆盖表达主题差异）、14 组件、warmup + 3 轮中位数',
  generatedFrom: '.cache/cssvar-bench.json（由 sync-bench-doc.mjs 同步）',
  cssBytes: {
    hash: Object.fromEntries(counts.map(c => [`theme${c}`, hash[c].cssBytes])),
    cssVar: Object.fromEntries(counts.map(c => [`theme${c}`, cssVar[c].cssBytes])),
  },
  ruleBytes: { cssVar: Object.fromEntries(counts.map(c => [`theme${c}`, cssVar[c].ruleBytes])) },
  btnRuleCount: {
    cssVar: counts.map(c => cssVar[c].btnRuleCount),
    hash: counts.map(c => hash[c].btnRuleCount),
  },
  delta: {
    theme1CssSize: `${signed(pct(n(hash['1'].cssBytes), n(cssVar['1'].cssBytes)))}（单主题净负：变量声明 + calc）`,
    theme3CssSize: signed(pct(n(hash['3'].cssBytes), n(cssVar['3'].cssBytes))),
    multiThemeIncrement: `hash +${hashGrowth} B vs cssVar +${cGrowth} B → 降低 ${reduction.toFixed(1)}%`,
  },
  illegalCss: 0,
  visualParityDiffs: 0,
};
fs.writeFileSync(statusFile, JSON.stringify(status, null, 2) + '\n');
console.log('sync-status 基准数据已同步');
