/**
 * 运行时取值回归守卫
 *
 * cssVar 模式下 token 值是 `var(--ant-*)` 字符串。凡是参与 JS 计算 / Canvas / SVG 绘制的
 * 取值（颜色混合、尺寸算术、暗色判断）都必须用 `realToken`（未变量化原始值），
 * 否则会退化成 NaN 或 #000000，且不会触发任何 CSS 相关断言。
 *
 * 本用例针对这类「看不见的退化」做守卫。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../components/config-provider';
import Empty from '../../components/empty';
import QRCode from '../../components/qrcode';
import Steps from '../../components/steps';
import Watermark from '../../components/watermark';

const mountWith = async (theme, slot) => {
  document.body.innerHTML = '';
  const wrapper = mount(ConfigProvider, {
    props: { theme },
    slots: { default: slot },
    attachTo: 'body',
  });
  await nextTick();
  await new Promise(r => setTimeout(r, 60));
  return wrapper;
};

const isLightHex = hex => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r + g + b) / 3 > 150;
};

describe('运行时取值（cssVar 模式）', () => {
  jest.setTimeout(180000);

  it('Empty 默认（SVG）不因变量化误判为暗色 / 退化为黑色', async () => {
    await mountWith({}, () => <Empty description="none" />);

    const svg = document.querySelector('.ant-empty-image svg');
    expect(svg).toBeTruthy();

    // 暗色判断依赖 TinyColor(colorBgBase).toHsl().l，变量化后会恒为黑色 → 误加 opacity
    expect(svg.getAttribute('style') || '').not.toContain('0.65');

    const fills = Array.from(svg.querySelectorAll('[fill]')).map(el => el.getAttribute('fill'));
    expect(fills.length).toBeGreaterThan(0);
    fills.forEach(fill => {
      expect(fill.toLowerCase()).not.toBe('#000000');
    });
  });

  it('QRCode 的尺寸计算不是 NaN（SVG 输出）', async () => {
    await mountWith({}, () => (
      <QRCode value="https://hiltonkohler21.github.io/ant-design-vue" type="svg" />
    ));

    const svg = document.querySelector('.ant-qrcode svg');
    expect(svg).toBeTruthy();
    const viewBox = svg.getAttribute('viewBox') || '';
    expect(viewBox).not.toContain('NaN');
    const nums = viewBox.split(/\s+/).map(Number);
    expect(nums.length).toBe(4);
    nums.forEach(n => expect(Number.isFinite(n)).toBe(true));
  });

  it('Steps 渲染产物中不含 NaN', async () => {
    await mountWith({ cssVar: true }, () => (
      <Steps size="small" current={1} items={[{ title: 'a' }, { title: 'b' }]} />
    ));

    const html = document.body.innerHTML;
    expect(html).not.toContain('NaN');
    expect(html).not.toContain('undefined');
  });

  /**
   * Watermark 用 Canvas 绘制水印，字号与颜色必须来自 realToken。
   * jsdom 无真实 Canvas 时无法断言绘制结果，因此这里同时校验「语义契约」：
   * token（变量化）必须是 var() 字符串，而 realToken 必须是真实数值/色值。
   * 一旦 Watermark 错用 token，其 fontSize 会变成 NaN、颜色变成 var() → 黑。
   */
  it('Watermark 及运行时取值依赖的 realToken 语义成立', async () => {
    const { useToken } = require('../../components/theme/internal');
    let captured;
    const Probe = {
      setup() {
        const [, token, , realToken] = useToken();
        captured = { token: token.value, real: realToken.value };
        return () => <div class="probe" />;
      },
    };
    await mountWith({}, () => <Probe />);

    // 变量化 token：必须是 var() 字符串（用于 CSS）
    expect(String(captured.token.fontSizeLG)).toContain('var(');
    // realToken：必须是真实数值/色值（用于 JS / Canvas / SVG）
    expect(typeof captured.real.fontSizeLG).toBe('number');
    expect(String(captured.real.colorFill)).not.toContain('var(');
    expect(String(captured.real.colorTextLightSolid)).not.toContain('var(');

    // Watermark 渲染产物中不得出现 NaN / undefined
    document.body.innerHTML = '';
    const wrapper = mountWith({}, () => (
      <Watermark content="w">
        <div style="height: 120px">wm</div>
      </Watermark>
    ));
    await wrapper;
    await nextTick();
    expect(document.body.innerHTML).not.toContain('NaN');
    expect(document.body.innerHTML).not.toContain('undefined');
  });

  /**
   * 源码级守卫：这些位置必须使用真实数值/色值（realToken / _realToken），
   * 否则在 cssVar 默认开启时会出现 NaN 或颜色退化为黑色。
   * 用静态断言锁定，避免「声称已修复但实际只改了别处」的情况再次发生。
   */
  it('运行时取值位置必须使用 realToken（源码级守卫）', () => {
    const fsMod = require('fs');
    const pathMod = require('path');
    const root = pathMod.resolve(__dirname, '../..');
    const read = rel => fsMod.readFileSync(pathMod.join(root, rel), 'utf8');

    // 1) Watermark：Canvas 字号与颜色
    const wm = read('components/watermark/index.tsx');
    expect(wm).toContain('realToken');
    expect(wm).not.toMatch(/token\.value\.fontSizeLG/);
    expect(wm).not.toMatch(/token\.value\.colorFill/);

    // 2) QRCode / Empty / Steps：尺寸与配色
    expect(read('components/qrcode/index.tsx')).toContain('realToken');
    expect(read('components/empty/empty.tsx')).toContain('realToken');
    expect(read('components/empty/simple.tsx')).toContain('realToken');

    // 3) 样式层颜色混合：这些位置曾用变量化 token 直接喂给 TinyColor（会退化为黑色）
    const forbidden = [
      ['components/menu/style/index.ts', /new TinyColor\(colorTextLightSolid\)/],
      ['components/slider/style/index.tsx', /new TinyColor\(token\.colorTextDisabled\)/],
      ['components/tour/style/index.ts', /new TinyColor\(colorTextLightSolid\)/],
      ['components/image/style/index.ts', /new TinyColor\(modalMaskBg\)/],
      ['components/table/style/index.ts', /new TinyColor\(colorFillAlter\)/],
      ['components/date-picker/style/index.ts', /new TinyColor\(colorPrimary\)/],
    ];
    const violations = forbidden.filter(([rel, re]) => re.test(read(rel))).map(([rel]) => rel);
    expect(violations).toEqual([]);
  });
});
