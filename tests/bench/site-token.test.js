/**
 * 站点 token 派生回归守卫
 *
 * `site/src/hooks/useSiteToken.ts` 用 JS 拼装站点自身的 CSS 变量：
 *   --font-size-base: ${token.fontSize}px、--screen-md-min: ${token.screenMDMin}px、
 *   marginFarXS: (token.marginXXL / 6) * 7、new TinyColor(token.colorPrimary)...
 *
 * cssVar 模式下 token 值是 `var(--ant-*)` 字符串，上述写法会产出
 *   `var(--ant-font-size)px` / `NaNpx` / `#000000`，导致站点排版、栅格演示、断点样式全部失效。
 * 该用例锁定「站点变量必须来自 realToken」。
 */
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent } from 'vue';
import fs from 'fs';
import path from 'path';
import ConfigProvider from '../../components/config-provider';
// eslint-disable-next-line import/no-relative-packages
import useSiteToken from '../../site/src/hooks/useSiteToken';
// eslint-disable-next-line import/no-relative-packages
import makeStyle from '../../site/src/components/antdv-token-previewer/utils/makeStyle';

const Probe = defineComponent({
  setup() {
    useSiteToken();
    return () => <div class="site-token-probe" />;
  },
});

const collectSiteCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

describe('站点 token 派生（cssVar 模式）', () => {
  jest.setTimeout(180000);

  it('站点 CSS 变量不含 NaN / var() / 非法 px', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <Probe /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectSiteCss();

    // 1) 不允许出现 NaN
    expect(css).not.toContain('NaN');

    // 2) 站点变量由 JS 拼装，不应出现 var() 引用（出现即说明用了变量化 token）
    expect(css).not.toMatch(
      /--(font-size-base|screen-md-min|screen-sm-min|mobile-max-width)\s*:[^;]*var\(/,
    );
    expect(css).not.toMatch(/[a-z-]+:\s*var\(--ant-[^)]*\)px/);

    // 3) 关键变量必须是可用数值
    const pick = name => {
      const m = css.match(new RegExp(`${name}\\s*:\\s*([^;]+)`));
      return m ? m[1].trim() : undefined;
    };
    expect(pick('--font-size-base')).toMatch(/^\d+(\.\d+)?px$/);
    expect(pick('--screen-md-min')).toMatch(/^\d+(\.\d+)?px$/);
    expect(pick('--margin-far-xs') ?? pick('--font-size-max')).toBeTruthy();

    // 4) TinyColor 混色不能退化为纯黑
    const grid = pick('--demo-grid-color-65');
    expect(grid).toBeTruthy();
    expect(grid.toLowerCase()).not.toMatch(/^#000000/);
  });

  it('预览器 makeStyle 产出的 CSS 不含 var()px / NaN', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const useProbeStyle = makeStyle('SiteTokenProbe', token => ({
      '.site-token-probe': {
        borderInlineEnd: `${token.lineWidth}px solid`,
        paddingBlock: token.padding / 2,
        marginInlineStart: token.marginXXS * 2,
        color: token.colorText,
        background: token.colorBgContainer,
      },
    }));

    const StyledProbe = defineComponent({
      setup() {
        const [wrapSSR, hashId] = useProbeStyle();
        return () => wrapSSR(<div class={`site-token-probe ${hashId?.value ?? ''}`} />);
      },
    });

    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <StyledProbe /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectSiteCss();
    expect(css).not.toContain('NaN');
    // `${token.x}px` 若用变量化 token 会产出 var(--ant-x)px
    expect(css).not.toMatch(/var\(--ant-[^)]*\)px/);
    expect(css).toMatch(/\.site-token-probe\s*\{/);
  });

  it('components/version/token.json 不含 var(--ant- 与 _realToken 污染', () => {
    const raw = fs.readFileSync(
      path.resolve(__dirname, '../../components/version/token.json'),
      'utf8',
    );
    expect(raw).not.toContain('var(--ant-');
    expect(raw).not.toContain('_realToken');

    const parsed = JSON.parse(raw);
    expect(Object.keys(parsed).length).toBeGreaterThanOrEqual(60);
    expect(parsed.Avatar.component.containerSize).toBe(32);
    expect(parsed.Avatar.component.groupBorderColor).toBe('#ffffff');
    expect(parsed.BorderBeam.component.beamDefaultColor).toBe('#1677ff');
    expect(parsed.Menu.component.dropdownWidth).toBe(160);
  });
});
