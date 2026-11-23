import { createApp, ref } from 'vue';
import { mount } from '@vue/test-utils';
import Space, { SpaceAddon } from '..';
import ConfigProvider from '../../config-provider';
import {
  resolveSemantic,
  mergeClassNames,
  mergeStyles,
  mergeSemantic,
  useMergeSemantic,
} from '../../_util/hooks/useMergeSemantic';
import mountTest from '../../../tests/shared/mountTest';

describe('Space', () => {
  mountTest(Space);
  mountTest(SpaceAddon);

  it('should render width empty children', () => {
    const wrapper = mount({
      render() {
        return <Space />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10}>
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginRight).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginRight).toBe('');
  });

  it('should render vertical space width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10} direction="vertical">
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginBottom).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginBottom).toBe('');
  });

  it('should render correct with children', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text3
          </Space>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render with invalidElement', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text1
          </Space>
        );
      },
    });

    expect(wrapper.findAll('.ant-space-item').length).toBe(3);
  });

  it('Space.Compact wires align prop to class and alignItems style', () => {
    const cases = [
      ['start', 'flex-start'],
      ['end', 'flex-end'],
      ['center', 'center'],
      ['baseline', 'baseline'],
    ];
    cases.forEach(([align, expected]) => {
      const wrapper = mount({
        render() {
          return (
            <Space.Compact align={align}>
              <span>a</span>
              <span>b</span>
            </Space.Compact>
          );
        },
      });
      const el = wrapper.find('.ant-space-compact');
      expect(el.classes()).toContain(`ant-space-compact-align-${align}`);
      expect(el.element.style.alignItems).toBe(expected);
    });
  });

  it('Space consumes ConfigProvider.space className and style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        space: {
          size: 'middle',
          className: 'ctx-space-cls',
          style: { padding: '8px' },
        },
      },
      slots: {
        default: () => (
          <Space>
            <span>1</span>
            <span>2</span>
          </Space>
        ),
      },
    });
    const el = wrapper.find('.ant-space');
    expect(el.classes()).toContain('ctx-space-cls');
    expect(el.element.getAttribute('style')).toContain('padding: 8px');
  });

  it('supports v6 orientation, vertical, and precedence over direction', () => {
    const wVertical = mount({
      render() {
        return (
          <Space vertical>
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wVertical.find('.ant-space').classes()).toContain('ant-space-vertical');

    const wOrientation = mount({
      render() {
        return (
          <Space orientation="horizontal" vertical direction="vertical">
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wOrientation.find('.ant-space').classes()).toContain('ant-space-horizontal');
    expect(wOrientation.find('.ant-space').classes()).not.toContain('ant-space-vertical');

    const wCompact = mount({
      render() {
        return (
          <Space.Compact orientation="vertical">
            <span>1</span>
            <span>2</span>
          </Space.Compact>
        );
      },
    });
    expect(wCompact.find('.ant-space-compact').classes()).toContain('ant-space-compact-vertical');
  });

  it('supports v6 separator prop and slot as alias for split', () => {
    const wProp = mount({
      render() {
        return (
          <Space separator="/">
            <span>A</span>
            <span>B</span>
          </Space>
        );
      },
    });
    expect(wProp.findAll('.ant-space-item-split').length).toBe(1);
    expect(wProp.find('.ant-space-item-split').text()).toBe('/');

    const wSlot = mount({
      render() {
        return (
          <Space v-slots={{ separator: () => <b class="sep-node">|</b> }}>
            <span>A</span>
            <span>B</span>
          </Space>
        );
      },
    });
    expect(wSlot.find('.sep-node').text()).toBe('|');
  });

  it('supports static and functional classNames/styles (root, item, separator) merged with ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        space: {
          classNames: { root: 'ctx-root', item: 'ctx-item', separator: 'ctx-sep' },
          styles: {
            root: { padding: '4px' },
            item: { color: 'rgb(1, 2, 3)' },
            separator: { opacity: '0.5' },
          },
        },
      },
      slots: {
        default: () => (
          <Space
            orientation="vertical"
            separator="-"
            classNames={({ props }) => ({
              root: `fn-root-${props.orientation}`,
              item: 'fn-item',
              separator: 'fn-sep',
            })}
            styles={({ props }) => ({
              root: { marginTop: props.orientation === 'vertical' ? '6px' : '0px' },
              item: { fontWeight: 'bold' },
              separator: { color: 'rgb(9, 8, 7)' },
            })}
          >
            <span>1</span>
            <span>2</span>
          </Space>
        ),
      },
    });

    const root = wrapper.find('.ant-space');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('fn-root-vertical');
    expect(root.element.style.padding).toBe('4px');
    expect(root.element.style.marginTop).toBe('6px');

    const item = wrapper.find('.ant-space-item');
    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('fn-item');
    expect(item.element.style.color).toBe('rgb(1, 2, 3)');
    expect(item.element.style.fontWeight).toBe('bold');

    const sep = wrapper.find('.ant-space-item-split');
    expect(sep.classes()).toContain('ctx-sep');
    expect(sep.classes()).toContain('fn-sep');
    expect(sep.element.style.opacity).toBe('0.5');
    expect(sep.element.style.color).toBe('rgb(9, 8, 7)');
  });

  it('renders Space.Addon with variant, status, disabled, size and compact context', () => {
    expect(Space.Addon).toBe(SpaceAddon);

    const app = createApp({});
    app.use(Space);
    expect(app.component('ASpaceAddon')).toBeTruthy();

    const wrapper = mount({
      render() {
        return (
          <Space.Compact size="large">
            <Space.Addon variant="filled" status="error">
              https://
            </Space.Addon>
            <Space.Addon disabled size="small" status="warning">
              .com
            </Space.Addon>
          </Space.Compact>
        );
      },
    });

    const addons = wrapper.findAll('.ant-space-addon');
    expect(addons.length).toBe(2);

    expect(addons[0].classes()).toContain('ant-space-addon-variant-filled');
    expect(addons[0].classes()).toContain('ant-space-addon-status-error');
    expect(addons[0].classes()).toContain('ant-space-addon-large');
    expect(addons[0].classes()).toContain('ant-space-addon-compact-item');
    expect(addons[0].classes()).toContain('ant-space-addon-compact-first-item');

    expect(addons[1].classes()).toContain('ant-space-addon-variant-outlined');
    expect(addons[1].classes()).toContain('ant-space-addon-status-warning');
    expect(addons[1].classes()).toContain('ant-space-addon-disabled');
    expect(addons[1].classes()).toContain('ant-space-addon-small');
    expect(addons[1].classes()).toContain('ant-space-addon-compact-last-item');
  });

  it('useMergeSemantic resolves static/functional semantics and merges nested objects reactively', () => {
    expect(resolveSemantic({ root: 'a' }, { props: {} })).toEqual({ root: 'a' });
    expect(resolveSemantic(({ props }) => ({ root: `r-${props.x}` }), { props: { x: 1 } })).toEqual(
      { root: 'r-1' },
    );

    expect(
      mergeClassNames({ root: 'a', popup: { root: 'p1' } }, { root: 'b', popup: { root: 'p2' } }),
    ).toEqual({ root: 'a b', popup: { root: 'p1 p2' } });

    expect(
      mergeStyles(
        { root: { color: 'red', margin: '1px' }, popup: { root: { zIndex: 10 } } },
        { root: { color: 'blue' }, popup: { root: { opacity: 0.8 } } },
      ),
    ).toEqual({
      root: { color: 'blue', margin: '1px' },
      popup: { root: { zIndex: 10, opacity: 0.8 } },
    });

    const [mc, ms] = mergeSemantic(
      [{ root: 'ctx' }, ({ props }) => ({ root: `p-${props.size}` })],
      [{ root: { padding: '2px' } }, ({ props }) => ({ root: { gap: `${props.size}px` } })],
      { props: { size: 8 } },
    );
    expect(mc).toEqual({ root: 'ctx p-8' });
    expect(ms).toEqual({ root: { padding: '2px', gap: '8px' } });

    const sizeRef = ref('small');
    const [rCls, rSty] = useMergeSemantic(
      () => [{ root: 'base' }, ({ props }) => ({ root: `sz-${props.size}` })],
      () => [
        { root: { display: 'flex' } },
        ({ props }) => ({ root: { order: props.size === 'large' ? 2 : 1 } }),
      ],
      () => ({ props: { size: sizeRef.value } }),
    );
    expect(rCls.value).toEqual({ root: 'base sz-small' });
    expect(rSty.value).toEqual({ root: { display: 'flex', order: 1 } });

    sizeRef.value = 'large';
    expect(rCls.value).toEqual({ root: 'base sz-large' });
    expect(rSty.value).toEqual({ root: { display: 'flex', order: 2 } });
  });
});
