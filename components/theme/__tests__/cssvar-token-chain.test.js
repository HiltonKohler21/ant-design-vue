import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../config-provider';
import Tag from '../../tag';
import Select from '../../select';
import Button from '../../button';
import Input from '../../input';
import Card from '../../card';
import Switch from '../../switch';
import Rate from '../../rate';
import Descriptions from '../../descriptions';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const App = {
  setup() {
    return () => (
      <div>
        <Tag color="blue">tag</Tag>
        <Tag.CheckableTag checked>checkable</Tag.CheckableTag>
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Select mode="multiple" options={[{ value: 'a', label: 'A' }]} />
        <Button type="primary">btn</Button>
        <Input placeholder="input" />
        <Card title="card">body</Card>
        <Switch />
        <Rate />
        <Descriptions items={[{ key: '1', label: 'L', children: 'C' }]} />
      </div>
    );
  },
};

describe('cssVar 组件 token 变量链路', () => {
  jest.setTimeout(120000);

  // TODO(cssvar): 已知问题——全局 :root 变量声明未稳定落到 DOM，导致 var 引用多于声明。
  // 根因：useCSSVarRegister 的注入与 useGlobalCache 生命周期/DOM 清理存在冲突，
  // 需改为复用 useStyleRegister 的注入通道。修复后改回 it()。
  it('所有 var(--ant-*) 引用都有对应的变量声明（无未解析变量）', async () => {
    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <App /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 60));

    const css = collectCss();
    const refs = new Set([...css.matchAll(/var\((--ant-[a-z0-9-]+)/g)].map(m => m[1]));
    const decls = new Set([...css.matchAll(/(--ant-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
    const unresolved = [...refs].filter(r => !decls.has(r)).sort();

    // eslint-disable-next-line no-console
    console.log(
      `[token-chain] var 引用 ${refs.size} 个 / 变量声明 ${decls.size} 个 / 未解析 ${unresolved.length} 个`,
    );
    if (unresolved.length) {
      // eslint-disable-next-line no-console
      console.log('[token-chain] 未解析样例:', unresolved.slice(0, 15).join(', '));
    }
    // 组件级变量（带组件前缀）应存在
    const compVars = [...decls].filter(d => /^--ant-(tag|select|button|table|card)-/.test(d));
    // eslint-disable-next-line no-console
    console.log(
      `[token-chain] 组件级变量 ${compVars.length} 个，样例: ${compVars.slice(0, 8).join(', ')}`,
    );

    expect(unresolved).toEqual([]);
  });

  it('hash 模式下不产生变量引用（向后兼容）', async () => {
    document.querySelectorAll('style').forEach(s => s.remove());
    document.body.innerHTML = '';
    mount(ConfigProvider, {
      props: { theme: { cssVar: false } },
      slots: { default: () => <Tag>tag</Tag> },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 40));
    const css = collectCss();
    expect(css).not.toContain('var(--ant-');
  });
});
