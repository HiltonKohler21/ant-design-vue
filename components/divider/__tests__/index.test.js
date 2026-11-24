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

  it('supports v6 orientation=vertical/horizontal, vertical shorthand, and titlePlacement', () => {
    const orientVert = mount(Divider, { props: { orientation: 'vertical' } });
    expect(orientVert.classes()).toContain('ant-divider-vertical');

    const verticalShorthand = mount(Divider, { props: { vertical: true } });
    expect(verticalShorthand.classes()).toContain('ant-divider-vertical');

    // orientation takes precedence over vertical
    const orientPrecedence = mount(Divider, {
      props: { orientation: 'horizontal', vertical: true },
    });
    expect(orientPrecedence.classes()).toContain('ant-divider-horizontal');

    const placedStart = mount(Divider, {
      props: { titlePlacement: 'start' },
      slots: { default: () => 'Title' },
    });
    expect(placedStart.classes()).toContain('ant-divider-with-text-left');

    const placedEnd = mount(Divider, {
      props: { titlePlacement: 'end' },
      slots: { default: () => 'Title' },
    });
    expect(placedEnd.classes()).toContain('ant-divider-with-text-right');

    // titlePlacement takes precedence over legacy orientation
    const placedOverride = mount(Divider, {
      props: { orientation: 'left', titlePlacement: 'right' },
      slots: { default: () => 'Override' },
    });
    expect(placedOverride.classes()).toContain('ant-divider-with-text-right');
  });

  it('supports semantic classNames and styles (object and functional) for root, rail, and content', () => {
    const withText = mount(Divider, {
      props: {
        variant: 'dashed',
        titlePlacement: 'start',
        classNames: ({ props }) => ({
          root: `sem-root-${props.variant}`,
          rail: 'sem-rail',
          content: 'sem-content',
        }),
        styles: {
          root: { margin: '10px 0' },
          rail: { borderColor: 'rgb(22, 119, 255)' },
          content: { color: 'rgb(82, 196, 26)' },
        },
      },
      slots: { default: () => 'Semantic' },
    });
    expect(withText.classes()).toContain('sem-root-dashed');
    expect(withText.classes()).toContain('ant-divider-has-rail');
    expect(withText.find('.ant-divider-rail-start').classes()).toContain('sem-rail');
    expect(withText.find('.ant-divider-rail-end').classes()).toContain('sem-rail');
    expect(withText.find('.ant-divider-rail-start').attributes('style')).toContain(
      'border-color: rgb(22, 119, 255)',
    );
    expect(withText.find('.ant-divider-inner-text').classes()).toContain('sem-content');
    expect(withText.find('.ant-divider-inner-text').attributes('style')).toContain(
      'color: rgb(82, 196, 26)',
    );

    const plainLine = mount(Divider, {
      props: {
        classNames: { root: 'line-root', rail: 'line-rail' },
        styles: { rail: { borderColor: 'rgb(250, 140, 22)' } },
      },
    });
    expect(plainLine.classes()).toContain('line-root');
    expect(plainLine.classes()).toContain('line-rail');
    expect(plainLine.classes()).toContain('ant-divider-rail');
    expect(plainLine.attributes('style')).toContain('border-color: rgb(250, 140, 22)');
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

  it('passes logical titlePlacement ("start" | "end" | "center") to semantic classNames/styles functions and exposes nativeElement', () => {
    const startWrapper = mount(Divider, {
      props: {
        titlePlacement: 'start',
        classNames: ({ props }) => ({
          root:
            props.titlePlacement === 'start'
              ? 'demo-divider-root--start'
              : 'demo-divider-root--default',
        }),
        styles: ({ props }) => ({
          root:
            props.titlePlacement === 'start' ? { borderWidth: '2px', borderStyle: 'dashed' } : {},
          content: { fontStyle: 'italic' },
          rail: { opacity: 0.85 },
        }),
      },
      slots: { default: () => 'Start' },
    });

    expect(startWrapper.classes()).toContain('ant-divider-with-text-left');
    expect(startWrapper.classes()).toContain('demo-divider-root--start');
    expect(startWrapper.attributes('style')).toContain('border-width: 2px');
    expect(startWrapper.attributes('style')).toContain('border-style: dashed');
    expect(startWrapper.find('.ant-divider-inner-text').attributes('style')).toContain(
      'font-style: italic',
    );
    expect(startWrapper.find('.ant-divider-rail-start').attributes('style')).toContain(
      'opacity: 0.85',
    );
    expect(startWrapper.vm.nativeElement).toBe(startWrapper.element);

    const endWrapper = mount(Divider, {
      props: {
        titlePlacement: 'end',
        classNames: ({ props }) => ({ root: `placement-${props.titlePlacement}` }),
      },
      slots: { default: () => 'End' },
    });
    expect(endWrapper.classes()).toContain('ant-divider-with-text-right');
    expect(endWrapper.classes()).toContain('placement-end');

    const leftRtlWrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => (
          <Divider
            titlePlacement="left"
            classNames={({ props }) => ({ root: `rtl-placement-${props.titlePlacement}` })}
          >
            Left in RTL
          </Divider>
        ),
      },
    });
    expect(leftRtlWrapper.find('.ant-divider').classes()).toContain('ant-divider-with-text-right');
    expect(leftRtlWrapper.find('.ant-divider').classes()).toContain('rtl-placement-end');
  });
});
