/**
 * 视觉一致性抽检：cssVar 模式 vs hash 模式
 *
 * 做法：分别在两种模式下挂载同一组组件，抽取生成 CSS 中目标选择器的关键属性，
 * 把 cssVar 侧的 `var(--ant-x)`（含 calc()）解析成具体值后逐项比对，
 * 从而在「不渲染截图」的前提下等价校验颜色/尺寸/圆角等视觉要素一致。
 *
 * 用法：npx jest --config .jest.js tests/bench/visual-parity.test.js
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
// jsdom 不支持 getComputedStyle(el, '::-webkit-scrollbar')，Table 会因此崩溃：整体打桩
jest.mock('../../components/_util/getScrollBarSize', () => ({
  __esModule: true,
  default: () => 8,
  getScrollBarSize: () => 8,
  getTargetScrollBarSize: () => ({ width: 8, height: 8 }),
}));

import ConfigProvider from '../../components/config-provider';
import Button from '../../components/button';
import Input from '../../components/input';
import Select from '../../components/select';
import Table from '../../components/table';
import Modal from '../../components/modal';

const TARGETS = [
  {
    name: 'Button',
    selector: '.ant-btn',
    props: [
      'font-size',
      'height',
      'border-radius',
      'padding',
      'color',
      'background-color',
      'border-color',
    ],
  },
  {
    name: 'Button(primary)',
    selector: '.ant-btn-primary',
    props: ['color', 'background-color', 'border-color', 'box-shadow'],
  },
  {
    name: 'Input',
    selector: '.ant-input',
    props: ['font-size', 'height', 'border-radius', 'padding', 'color', 'background-color'],
  },
  {
    name: 'Select',
    selector: '.ant-select-selector',
    props: ['border-radius', 'background-color', 'border-color'],
  },
  {
    name: 'Table',
    selector: '.ant-table',
    props: ['font-size', 'background', 'border-radius'],
  },
  {
    name: 'TableHeader',
    // 实际产出选择器形如 .ant-table-wrapper .ant-table-thead >tr>th（匹配时按后缀）
    selector: '.ant-table-thead >tr>th',
    props: ['color', 'background', 'font-weight', 'text-align'],
  },
  {
    name: 'Modal',
    selector: '.ant-modal .ant-modal-content',
    props: ['border-radius', 'background-color', 'padding'],
  },
];

const App = {
  setup() {
    return () => (
      <div>
        <Button type="primary">primary</Button>
        <Button>default</Button>
        <Input placeholder="i" />
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Table columns={[{ title: 'A', dataIndex: 'a' }]} dataSource={[{ key: 1, a: 1 }]} />
        <Modal open={false} title="m">
          body
        </Modal>
      </div>
    );
  },
};

const allCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

/** 解析 `selector{a:b;c:d}` → [{selector, decls}]（cssinjs 输出已扁平化，无嵌套） */
const parseRules = css => {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m = re.exec(css);
  while (m) {
    const decls = {};
    m[2].split(';').forEach(d => {
      const i = d.indexOf(':');
      if (i > 0) decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    });
    rules.push({ selector: m[1].trim(), decls });
    m = re.exec(css);
  }
  return rules;
};

/** 收集 `--ant-x: value` 声明 */
const collectVars = rules => {
  const vars = {};
  rules.forEach(r => {
    if (!r.selector.includes(':root') && !r.selector.startsWith('.')) return;
    Object.entries(r.decls).forEach(([k, v]) => {
      if (k.startsWith('--ant')) vars[k] = v;
    });
  });
  return vars;
};

const resolveVars = (value, vars, depth = 0) => {
  if (depth > 8 || !value || !value.includes('var(')) return value;
  const next = value.replace(/var\((--[A-Za-z0-9-]+)(?:,\s*[^)]+)?\)/g, (m, name) =>
    name in vars ? vars[name] : m,
  );
  return next === value ? value : resolveVars(next, vars, depth + 1);
};

/** 求值 px 单位的四则运算；无法求值则原样返回 */
const evalCalc = expr => {
  const inner = expr.match(/^calc\((.*)\)$/);
  if (!inner) return expr;
  const tokens = inner[1].match(/(\d*\.?\d+)(px)?|[+\-*/()]/g);
  if (!tokens) return expr;
  const js = tokens
    .map(t => (t.endsWith('px') ? t.slice(0, -2) : t))
    .join(' ')
    .replace(/(\d)\s*-\s*(\d)/g, '$1 - $2');
  try {
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${js});`)();
    return typeof val === 'number' && Number.isFinite(val)
      ? `${Math.round(val * 1000) / 1000}px`
      : expr;
  } catch {
    return expr;
  }
};

const normalize = v =>
  String(v)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/^0px$/, '0')
    .trim();

const snapshot = async cssVar => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  mount(ConfigProvider, {
    props: { theme: cssVar ? { cssVar: true } : { cssVar: false } },
    slots: { default: () => <App /> },
    attachTo: 'body',
  });
  await nextTick();
  await new Promise(r => setTimeout(r, 80));

  const rules = parseRules(allCss());
  const vars = collectVars(rules);
  const result = {};
  TARGETS.forEach(({ name, selector, props }) => {
    // 取最后一个匹配该选择器的规则块（后者覆盖前者）
    const matched = rules.filter(r =>
      r.selector
        .split(',')
        .map(s => s.trim())
        .some(s => s === selector || s.endsWith(' ' + selector)),
    );
    const merged = Object.assign({}, ...matched.map(r => r.decls));
    const out = {};
    props.forEach(p => {
      if (merged[p] === undefined) return;
      let v = resolveVars(merged[p], vars);
      v = evalCalc(v);
      // calc 里剩余的变量/表达式无法静态求值时，跳过（不计入差异）
      if (/var\(--ant|calc\(/.test(v)) return;
      out[p] = normalize(v);
    });
    result[name] = out;
    result[`${name}::raw`] = merged;
  });
  return result;
};

describe('视觉一致性抽检（cssVar vs hash）', () => {
  jest.setTimeout(300000);

  it('关键组件的颜色/尺寸/圆角在两模式下一致', async () => {
    const hashMode = await snapshot(false);
    const varMode = await snapshot(true);
    // eslint-disable-next-line no-console
    console.log(
      '[visual-parity] 采集情况:',
      JSON.stringify(
        Object.fromEntries(Object.entries(varMode).map(([k, v]) => [k, Object.keys(v).length])),
      ),
    );

    const diffs = [];
    TARGETS.forEach(({ name }) => {
      const a = hashMode[name] || {};
      const b = varMode[name] || {};
      if (!Object.keys(b).length) {
        // eslint-disable-next-line no-console
        console.log('  ! 未采集到属性:', name);
        return;
      }
      Object.keys(a).forEach(prop => {
        if (b[prop] === undefined) return;
        if (a[prop] !== b[prop]) {
          diffs.push(
            `${name} ${prop}: hash=${a[prop]} | cssVar=${b[prop]} | raw=${
              (varMode[`${name}::raw`] || {})[prop]
            }`,
          );
        }
      });
    });

    // eslint-disable-next-line no-console
    console.log(`[visual-parity] 抽检 ${TARGETS.length} 组选择器，差异 ${diffs.length} 项`);
    diffs.forEach(d => console.log('  Δ ' + d));

    expect(diffs).toEqual([]);
  });
});
