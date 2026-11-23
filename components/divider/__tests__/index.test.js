import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Divider from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

describe('Divider', () => {
  mountTest(Divider);

  it('supports size small / middle / medium / large with real CSS rules and RTL CSS', async () => {
    document.head.innerHTML = '';
    const wrapperSm = mount(Divider, { props: { size: 'small' } });
    expect(wrapperSm.classes()).toContain('ant-divider-sm');

    const wrapperMd = mount(Divider, { props: { size: 'middle' } });
    expect(wrapperMd.classes()).toContain('ant-divider-md');

    const wrapperMedium = mount(Divider, { props: { size: 'medium' } });
    expect(wrapperMedium.classes()).toContain('ant-divider-md');

    const wrapperLg = mount(Divider, { props: { size: 'large' } });
    expect(wrapperLg.classes()).not.toContain('ant-divider-sm');
    expect(wrapperLg.classes()).not.toContain('ant-divider-md');

    await nextTick();
    const css = collectCss();
    expect(css).toContain('ant-divider-sm');
    expect(css).toContain('ant-divider-md');
    expect(css).toContain('ant-divider-rtl');
  });

  it('generates dotted CSS for with-text and vertical variants', async () => {
    document.head.innerHTML = '';
    const wrapperText = mount(Divider, {
      props: { variant: 'dotted' },
      slots: { default: () => 'Text' },
    });
    expect(wrapperText.classes()).toContain('ant-divider-dotted');
    expect(wrapperText.classes()).toContain('ant-divider-with-text');

    const wrapperVert = mount(Divider, {
      props: { type: 'vertical', variant: 'dotted' },
    });
    expect(wrapperVert.classes()).toContain('ant-divider-vertical');
    expect(wrapperVert.classes()).toContain('ant-divider-dotted');

    await nextTick();
    const css = collectCss();
    expect(css).toContain('ant-divider-with-text.ant-divider-dotted');
    expect(css).toContain('dotted none none');
    expect(css).toContain('ant-divider-vertical.ant-divider-dotted');
    expect(css).toContain('border-inline-start-style:dotted');
  });

  it('supports orientation start / end respecting RTL', () => {
    const startLtr = mount(Divider, {
      props: { orientation: 'start' },
      slots: { default: () => 'Start' },
    });
    expect(startLtr.classes()).toContain('ant-divider-with-text-left');

    const endLtr = mount(Divider, {
      props: { orientation: 'end' },
      slots: { default: () => 'End' },
    });
    expect(endLtr.classes()).toContain('ant-divider-with-text-right');

    const leftRtl = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => <Divider orientation="left">Left</Divider> },
    });
    expect(leftRtl.find('.ant-divider').classes()).toContain('ant-divider-with-text-right');
    expect(leftRtl.find('.ant-divider').classes()).toContain('ant-divider-rtl');

    const startRtl = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => <Divider orientation="start">Start</Divider> },
    });
    expect(startRtl.find('.ant-divider').classes()).toContain('ant-divider-with-text-left');
  });

  it('wires ConfigProvider.divider (className, style, variant) and ComponentToken overrides', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        divider: {
          className: 'cp-divider',
          style: { borderColor: 'rgb(10, 20, 30)' },
          variant: 'dotted',
        },
        theme: {
          cssVar: true,
          components: {
            Divider: {
              textPaddingInline: '2em',
              orientationMargin: 0.1,
              verticalMarginInline: 12,
            },
          },
        },
      },
      slots: { default: () => <Divider>Hi</Divider> },
    });
    await nextTick();
    const div = wrapper.find('.ant-divider');
    expect(div.classes()).toContain('cp-divider');
    expect(div.classes()).toContain('ant-divider-dotted');
    expect(div.attributes('style')).toContain('border-color: rgb(10, 20, 30)');

    const css = collectCss();
    expect(css).toContain('--ant-divider-text-padding-inline:2em');
    expect(css).toContain('--ant-divider-orientation-margin:0.1');
    expect(css).not.toContain('--ant-divider-orientation-margin:0.1px');
    expect(css).toContain('--ant-divider-vertical-margin-inline:12px');
  });
});
