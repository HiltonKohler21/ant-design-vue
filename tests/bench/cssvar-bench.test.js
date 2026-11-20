/**
 * CSS 变量（antd v6 性能层）基准实测
 *
 * 口径对齐 antd 官方 v6 benchmark：自变量为 **theme count（主题数量）**。
 * 同一页面同时挂载 N 个不同主题的子树：
 *   - hash 模式（v5 现状）：每个主题生成一份完整样式 → 体积/耗时随主题数线性增长
 *   - cssVar 模式（v6 架构）：样式只生成一份，主题只差异在 CSS 变量 → 增长很小
 *
 * 运行：npx jest --config .jest.js tests/bench/cssvar-bench.test.js
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../components/config-provider';

import Button from '../../components/button';
import Input from '../../components/input';
import Select from '../../components/select';
import Tag from '../../components/tag';
import Card from '../../components/card';
import Tooltip from '../../components/tooltip';
import Switch from '../../components/switch';
import Rate from '../../components/rate';
import Pagination from '../../components/pagination';
import Checkbox from '../../components/checkbox';
import Descriptions from '../../components/descriptions';

/**
 * 用 token 覆盖构造 3 个不同主题。
 * 注：本地 ConfigProvider 的 `theme.algorithm`（darkAlgorithm/compactAlgorithm）实测不生效，
 * 属既有缺陷（与本次 cssVar 改造无关），因此基准用 token 覆盖来表达「不同主题」。
 */
const THEME_CONFIGS = [
  {},
  { token: { colorPrimary: '#ff0000', borderRadius: 2, colorBgContainer: '#fffbfb' } },
  { token: { colorPrimary: '#00aa55', borderRadius: 8, colorBgContainer: '#fbfffb' } },
];

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const flush = async () => {
  await nextTick();
  await new Promise(r => setTimeout(r, 0));
};

/** 一组有代表性的组件（覆盖不同样式生成路径；不含 jsdom 不友好的 Table） */
const App = {
  setup() {
    return () => (
      <div>
        <Button type="primary">btn</Button>
        <Button>plain</Button>
        <Button danger>danger</Button>
        <Input placeholder="input" />
        <Input.Search placeholder="search" />
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Checkbox>check</Checkbox>
        <Switch />
        <Rate />
        <Tag>tag</Tag>
        <Card title="card">body</Card>
        <Tooltip title="tip">
          <span>hover</span>
        </Tooltip>
        <Pagination total={50} />
        <Descriptions items={[{ key: '1', label: 'L', children: 'C' }]} />
      </div>
    );
  },
};

/** 挂载 themeCount 个不同主题的子树（独立实例，模拟多主题共存） */
async function runScenario(mode, themeCount) {
  const cssVar = mode === 'cssVar';
  const hosts = [];
  const t0 = now();
  for (let i = 0; i < themeCount; i += 1) {
    const theme = cssVar ? { cssVar: true, ...THEME_CONFIGS[i] } : { ...THEME_CONFIGS[i] };
    hosts.push(
      mount(ConfigProvider, {
        props: { theme },
        slots: { default: () => <App /> },
        attachTo: 'body',
      }),
    );
  }
  await flush();
  const elapsed = now() - t0;
  const css = collectCss();
  const result = {
    mode,
    themeCount,
    elapsedMs: +elapsed.toFixed(1),
    cssBytes: css.length,
    styleTags: document.querySelectorAll('style').length,
  };
  hosts.forEach(h => h.unmount());
  document.querySelectorAll('style').forEach(s => s.remove());
  document.body.innerHTML = '';
  await flush();
  return result;
}

describe('cssVar 基准实测（theme count 口径）', () => {
  jest.setTimeout(180000);

  it('产出 hash vs cssVar 在多主题下的体积/耗时对比', async () => {
    // warmup
    await runScenario('hash', 1);
    await runScenario('cssVar', 1);

    const runs = { hash: {}, cssVar: {} };
    for (const mode of ['hash', 'cssVar']) {
      for (const count of [1, 2, 3]) {
        const samples = [];
        for (let i = 0; i < 3; i += 1) samples.push(await runScenario(mode, count));
        const median = samples.slice().sort((a, b) => a.elapsedMs - b.elapsedMs)[
          Math.floor(samples.length / 2)
        ];
        runs[mode][count] = median;
      }
    }

    const pct = (a, b) => (a === 0 ? 'n/a' : `${(((b - a) / a) * 100).toFixed(1)}%`);
    const lines = [];
    lines.push('');
    lines.push(
      '| theme count | hash 体积 (B) | cssVar 体积 (B) | 体积变化 | hash 耗时 (ms) | cssVar 耗时 (ms) | 耗时变化 |',
    );
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const count of [1, 2, 3]) {
      const h = runs.hash[count];
      const c = runs.cssVar[count];
      lines.push(
        `| ${count} | ${h.cssBytes} | ${c.cssBytes} | ${pct(h.cssBytes, c.cssBytes)} | ${
          h.elapsedMs
        } | ${c.elapsedMs} | ${pct(h.elapsedMs, c.elapsedMs)} |`,
      );
    }
    // 增长斜率：theme=3 相对 theme=1 的增量
    const hGrowth = runs.hash[3].cssBytes - runs.hash[1].cssBytes;
    const cGrowth = runs.cssVar[3].cssBytes - runs.cssVar[1].cssBytes;
    lines.push('');
    lines.push(
      `**多主题增量（theme 1 → 3）**：hash +${hGrowth} B ｜ cssVar +${cGrowth} B ｜ 增量降低 ${pct(
        hGrowth,
        cGrowth,
      )}`,
    );

    const table = lines.join('\n');
    // eslint-disable-next-line no-console
    console.log('\n===== cssVar 基准实测（theme count 口径）=====\n' + table + '\n');

    try {
      const fs = require('fs');
      const path = require('path');
      const dir = path.resolve(__dirname, '../../.cache');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'cssvar-bench.json'),
        JSON.stringify({ generatedAt: new Date().toISOString(), samples: runs, table }, null, 2),
      );
      fs.writeFileSync(path.join(dir, 'cssvar-bench.md'), table + '\n');
    } catch (e) {
      /* 只读环境忽略 */
    }

    expect(runs.hash[1].cssBytes).toBeGreaterThan(0);
    expect(runs.cssVar[1].cssBytes).toBeGreaterThan(0);
  });
});
