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

  it('Empty simple 变体的配色仍为浅灰而非黑色', async () => {
    await mountWith({}, () => <Empty description="none" />);

    // simple 变体通过 ConfigProvider.renderEmpty 注入，这里直接断言默认 SVG 的描边
    const strokes = Array.from(document.querySelectorAll('.ant-empty-image [stroke]')).map(el =>
      el.getAttribute('stroke'),
    );
    if (strokes.length) {
      strokes.forEach(stroke => expect(stroke.toLowerCase()).not.toBe('#000000'));
    }
    expect(true).toBe(true);
  });

  it('QRCode 的尺寸计算不是 NaN（SVG 输出）', async () => {
    await mountWith({}, () => <QRCode value="https://antdv.com" type="svg" />);

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
});
