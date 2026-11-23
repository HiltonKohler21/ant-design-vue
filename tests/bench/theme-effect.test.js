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
import Menu from '../../components/menu';
import themeApi from '../../components/theme';
import darkAlgorithm from '../../components/theme/themes/dark';
import compactAlgorithm from '../../components/theme/themes/compact';

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

  /**
   * 嵌套 ConfigProvider 自定义主题时，不能把变量块泄漏到整页。
   * 由于变量块是全局 :root，库层策略是「嵌套 + 本地自定义主题 → 该子树回退 hash 模式」。
   */
  it('嵌套自定义主题不泄漏到整页（子树回退 hash 模式）', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <div>
            <Button class="outer-btn" type="primary">
              outer
            </Button>
            <ConfigProvider theme={{ token: { colorPrimary: '#ff0000' } }}>
              <Button class="inner-btn" type="primary">
                inner
              </Button>
            </ConfigProvider>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    // 整页默认主题不被内层红色覆盖
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#1677ff');

    // 内层走 hash 模式：其红色以字面值出现在样式里
    const css = stylesInOrder()
      .map(s => s.innerHTML)
      .join('\n');
    expect(css.toLowerCase()).toContain('#ff0000');
  });

  /**
   * 回归守卫（P0）：hashed=true + cssVar=true 下，运行时切换 Light ↔ Dark / Compact / 自定义主色时，
   * DOM 根节点的 css-* hashId 必须保持稳定且持续命中 <style> 中的 :where(.css-*) 选择器。
   * 否则会出现「DOM 换了新 hashId，但缓存的 <style> 仍绑定旧 hashId」导致整页样式丢失。
   */
  it('运行时切换 Light ↔ Dark / Compact / 主色时 DOM hashId 与 <style> 选择器保持一致', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const findHashClass = el => Array.from(el.classList).find(cls => cls.startsWith('css-')) || '';

    const hasScopedSelector = (hashCls, componentSelector) => {
      const css = stylesInOrder()
        .map(s => s.innerHTML)
        .join('\n');
      return (
        css.includes(`:where(.${hashCls})${componentSelector}`) ||
        css.includes(`.${hashCls}${componentSelector}`)
      );
    };

    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true, hashed: true } },
      slots: {
        default: () => (
          <div>
            <Button class="runtime-switch-btn" type="primary">
              btn
            </Button>
            <Menu
              class="runtime-switch-menu"
              mode="horizontal"
              items={[{ key: '1', label: 'item' }]}
            />
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));

    const btn = document.querySelector('.runtime-switch-btn');
    const menu = document.querySelector('.runtime-switch-menu');
    expect(btn).toBeTruthy();
    expect(menu).toBeTruthy();

    const lightHash = findHashClass(btn);
    expect(lightHash).toMatch(/^css-/);
    expect(hasScopedSelector(lightHash, '.ant-btn')).toBe(true);
    expect(hasScopedSelector(lightHash, '.ant-menu')).toBe(true);
    expect(String(effectiveVar('--ant-color-bg-container')).toLowerCase()).toBe('#ffffff');
    const lightMenuItemBg = effectiveVar('--ant-menu-color-item-bg');

    // 1) Light → Dark
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true, algorithm: darkAlgorithm },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    expect(findHashClass(btn)).toBe(lightHash);
    expect(findHashClass(menu)).toBe(lightHash);
    expect(hasScopedSelector(lightHash, '.ant-btn')).toBe(true);
    expect(hasScopedSelector(lightHash, '.ant-menu')).toBe(true);
    expect(String(effectiveVar('--ant-color-bg-container')).toLowerCase()).toBe('#141414');
    expect(effectiveVar('--ant-menu-color-item-bg')).not.toBe(lightMenuItemBg);

    // 2) Dark → Dark + Compact
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true, algorithm: [darkAlgorithm, compactAlgorithm] },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    expect(findHashClass(btn)).toBe(lightHash);
    expect(hasScopedSelector(lightHash, '.ant-btn')).toBe(true);
    expect(String(effectiveVar('--ant-control-height')).toLowerCase()).toBe('28px');

    // 3) Compact → Custom colorPrimary
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true, token: { colorPrimary: '#722ed1' } },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    expect(findHashClass(btn)).toBe(lightHash);
    expect(hasScopedSelector(lightHash, '.ant-btn')).toBe(true);
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#722ed1');

    // 4) 切回默认 Light：全局与组件级 CSS 变量均恢复 Light 胜出
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    expect(findHashClass(btn)).toBe(lightHash);
    expect(hasScopedSelector(lightHash, '.ant-btn')).toBe(true);
    expect(String(effectiveVar('--ant-color-bg-container')).toLowerCase()).toBe('#ffffff');
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#1677ff');
    expect(effectiveVar('--ant-menu-color-item-bg')).toBe(lightMenuItemBg);
  });

  it('hashed=true 下嵌套自定义主题（回退 hash 模式）可独立切换且不污染外层', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const innerColor = ref('#ff0000');
    const findHashClass = el => Array.from(el.classList).find(cls => cls.startsWith('css-')) || '';
    const hasScopedSelector = (hashCls, componentSelector) => {
      const css = stylesInOrder()
        .map(s => s.innerHTML)
        .join('\n');
      return (
        css.includes(`:where(.${hashCls})${componentSelector}`) ||
        css.includes(`.${hashCls}${componentSelector}`)
      );
    };

    mount(ConfigProvider, {
      props: { theme: { cssVar: true, hashed: true } },
      slots: {
        default: () => (
          <div>
            <Button class="outer-hashed-btn" type="primary">
              outer
            </Button>
            <ConfigProvider theme={{ hashed: true, token: { colorPrimary: innerColor.value } }}>
              <Button class="inner-hashed-btn" type="primary">
                inner
              </Button>
            </ConfigProvider>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    const outerBtn = document.querySelector('.outer-hashed-btn');
    const innerBtn = document.querySelector('.inner-hashed-btn');
    const outerHash = findHashClass(outerBtn);
    const innerHash1 = findHashClass(innerBtn);

    expect(outerHash).toMatch(/^css-/);
    expect(innerHash1).toMatch(/^css-/);
    expect(innerHash1).not.toBe(outerHash);
    expect(hasScopedSelector(outerHash, '.ant-btn')).toBe(true);
    expect(hasScopedSelector(innerHash1, '.ant-btn')).toBe(true);
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#1677ff');

    // 内层本地切换主题色（如首页 ThemePreview）
    innerColor.value = '#642ab5';
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    const innerHash2 = findHashClass(innerBtn);
    expect(innerHash2).toMatch(/^css-/);
    expect(innerHash2).not.toBe(innerHash1);
    expect(innerHash2).not.toBe(outerHash);
    expect(hasScopedSelector(innerHash2, '.ant-btn')).toBe(true);
    expect(findHashClass(outerBtn)).toBe(outerHash);
    expect(String(effectiveVar('--ant-color-primary')).toLowerCase()).toBe('#1677ff');
  });
});
