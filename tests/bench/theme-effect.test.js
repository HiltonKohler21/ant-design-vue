/**
 * 主题生效性验证（cssVar 默认开启下的关键用户路径）
 *
 * 背景：cssVar 模式下样式只写 `var(--ant-*)`，实际颜色/尺寸由 `:root` 变量块决定。
 * 因此必须确保「主题块在层叠后真正胜出」，否则 theme.token / theme.algorithm /
 * 运行时切主题都会静默失效（样式看着正常，但永远是默认主题）。
 *
 * 断言方式：按 DOM 顺序收集同名变量的所有声明，取**最后一个**（同特异性下胜出者），
 * 与主题期望值比较。
 */
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import ConfigProvider from '../../components/config-provider';
import Button from '../../components/button';
import themeApi from '../../components/theme';
import darkAlgorithm from '../../components/theme/themes/dark';

const stylesInOrder = () => Array.from(document.querySelectorAll('style'));

/** 收集指定变量在 DOM 顺序下的所有声明值，返回最后一个（层叠胜出者） */
const effectiveVar = name => {
  let value;
  stylesInOrder().forEach(style => {
    const css = style.innerHTML || '';
    const re = new RegExp(`${name}\\s*:\\s*([^;}]+)`, 'g');
    let m = re.exec(css);
    while (m) {
      value = m[1].trim();
      m = re.exec(css);
    }
  });
  return value;
};

const mountWithTheme = async themeConfig => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  const wrapper = mount(ConfigProvider, {
    props: { theme: themeConfig },
    slots: { default: () => <Button type="primary">b</Button> },
    attachTo: 'body',
  });
  await nextTick();
  await new Promise(r => setTimeout(r, 80));
  return wrapper;
};

describe('主题在 cssVar 模式下真实生效', () => {
  jest.setTimeout(300000);

  it('theme.token 覆盖生效（colorPrimary 以自定义值为准）', async () => {
    await mountWithTheme({ cssVar: true, token: { colorPrimary: '#ff0000' } });
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#ff0000');
  });

  it('theme.algorithm 暗色生效（背景色为暗色值）', async () => {
    await mountWithTheme({ cssVar: true, algorithm: darkAlgorithm });
    const bg = String(effectiveVar('--ant-color-bg-container')).toLowerCase();
    expect(bg).not.toBe('#ffffff');
    expect(bg).toBe('#141414');
  });

  it('运行时切换主题生效（红 → 绿）', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true, token: { colorPrimary: '#ff0000' } } },
      slots: { default: () => <Button type="primary">b</Button> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#ff0000');

    await wrapper.setProps({ theme: { cssVar: true, token: { colorPrimary: '#00aa55' } } });
    await nextTick();
    await new Promise(r => setTimeout(r, 150));
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#00aa55');
  });

  it('hash 模式作为对照：token 覆盖同样生效', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    mount(ConfigProvider, {
      props: { theme: { cssVar: false, token: { colorPrimary: '#ff0000' } } },
      slots: { default: () => <Button type="primary">b</Button> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));
    const css = stylesInOrder()
      .map(s => s.innerHTML)
      .join('\n');
    expect(css.toLowerCase()).toContain('#ff0000');
  });

  it('theme 命名空间导出 darkAlgorithm', async () => {
    expect(typeof themeApi.darkAlgorithm).toBe('function');
    expect(typeof darkAlgorithm).toBe('function');
  });
});
