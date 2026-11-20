import { mount } from '@vue/test-utils';
import ConfigProvider from '../../config-provider';
import Button from '..';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

describe('cssVar PoC: Button', () => {
  it('cssVar 模式下样式使用 var(--ant-*) 且注入变量声明', async () => {
    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <Button type="primary">btn</Button> },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const css = collectCss();

    // 1. 样式值被替换为变量引用
    expect(css).toContain('var(--ant-');
    // 2. 变量声明被注入
    expect(css).toMatch(/--ant-[a-z-]+:/);
    // 3. 打印抽样，便于人工核对
    const varRefs = css.match(/var\(--ant-[a-z-]+\)/g) || [];
    const varDecls = css.match(/--ant-[a-z-]+:/g) || [];
    console.log(
      '[PoC] var 引用数:',
      new Set(varRefs).size,
      '| 变量声明数:',
      new Set(varDecls).size,
    );
    console.log('[PoC] 抽样引用:', [...new Set(varRefs)].slice(0, 8).join(', '));
    console.log('[PoC] 抽样声明:', [...new Set(varDecls)].slice(0, 8).join(', '));
  });

  it('未开启 cssVar 时保持原有 hash 模式（无变量）', async () => {
    document.querySelectorAll('style').forEach(s => s.remove());
    mount(ConfigProvider, {
      props: { theme: { cssVar: false } },
      slots: { default: () => <Button type="primary">btn2</Button> },
    });
    await new Promise(r => setTimeout(r, 50));
    const css = collectCss();
    expect(css).not.toContain('var(--ant-');
    expect(css).toContain('#1677ff');
  });
});
