import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import QuestionCircleOutlined from '@ant-design/icons-vue/QuestionCircleOutlined';
import FloatButton from '../index';
import ConfigProvider from '../../config-provider';

describe('FloatButton v6 parity: semantic classNames/styles, PurePanel, BackTop showProgress', () => {
  it('supports static and functional classNames/styles on FloatButton merged with ConfigProvider.floatButton', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        floatButton: {
          classNames: ({ props }) => ({
            root: `ctx-root-${props.type}`,
            icon: 'ctx-icon',
            content: 'ctx-content',
          }),
          styles: {
            root: { padding: '2px' },
            icon: { opacity: '0.9' },
            content: { letterSpacing: '1px' },
          },
        },
      },
      slots: {
        default: () => (
          <FloatButton
            type="primary"
            shape="square"
            content="HELP"
            icon={h(QuestionCircleOutlined)}
            classNames={({ props }) => ({
              root: `prop-root-${props.shape}`,
              icon: 'prop-icon',
              content: 'prop-content',
            })}
            styles={({ props }) => ({
              root: { backgroundColor: props.type === 'primary' ? 'rgb(23, 23, 23)' : 'white' },
              icon: { color: 'rgb(255, 255, 255)' },
              content: { color: 'rgb(250, 250, 250)' },
            })}
          />
        ),
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-float-btn');
    expect(root.classes()).toContain('ctx-root-primary');
    expect(root.classes()).toContain('prop-root-square');
    expect(root.attributes('style')).toContain('padding: 2px');
    expect(root.attributes('style')).toContain('background-color: rgb(23, 23, 23)');

    const icon = wrapper.find('.ant-float-btn-icon');
    expect(icon.classes()).toContain('ctx-icon');
    expect(icon.classes()).toContain('prop-icon');
    expect(icon.attributes('style')).toContain('opacity: 0.9');
    expect(icon.attributes('style')).toContain('color: rgb(255, 255, 255)');

    const content = wrapper.find('.ant-float-btn-content');
    expect(content.classes()).toContain('ctx-content');
    expect(content.classes()).toContain('prop-content');
    expect(content.attributes('style')).toContain('letter-spacing: 1px');
    expect(content.attributes('style')).toContain('color: rgb(250, 250, 250)');
  });

  it('supports semantic classNames/styles on FloatButton.Group without leaking item into trigger', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        floatButtonGroup: {
          closeIcon: <span class="ctx-close-icon">X</span>,
          classNames: {
            root: 'ctx-group-root',
            list: 'ctx-group-list',
            item: 'ctx-group-item',
            trigger: 'ctx-group-trigger',
          },
          styles: {
            root: { zIndex: 100 },
            list: { gap: '8px' },
          },
        },
      },
      slots: {
        default: () => (
          <FloatButton.Group
            trigger="click"
            open
            shape="square"
            content="MENU"
            classNames={({ props }) => ({
              root: `prop-group-${props.placement}`,
              list: 'prop-list',
              item: 'prop-item',
              itemIcon: 'prop-item-icon',
              itemContent: 'prop-item-content',
              trigger: 'prop-trigger',
              triggerIcon: 'prop-trigger-icon',
              triggerContent: 'prop-trigger-content',
            })}
            styles={{
              item: { borderRadius: '6px' },
              itemIcon: { fontSize: '18px' },
              itemContent: { fontWeight: '600' },
              trigger: { backgroundColor: 'rgb(10, 20, 30)' },
              triggerIcon: { fontSize: '20px' },
              triggerContent: { textTransform: 'uppercase' },
            }}
          >
            <FloatButton icon={h(QuestionCircleOutlined)} content="A" />
            <FloatButton content="B" />
          </FloatButton.Group>
        ),
      },
    });
    await nextTick();

    const group = wrapper.find('.ant-float-btn-group');
    expect(group.classes()).toContain('ctx-group-root');
    expect(group.classes()).toContain('prop-group-top');
    expect(group.attributes('style')).toContain('z-index: 100');

    const list = wrapper.find('.ant-float-btn-group-wrap');
    expect(list.classes()).toContain('ctx-group-list');
    expect(list.classes()).toContain('prop-list');
    expect(list.attributes('style')).toContain('gap: 8px');

    const listItems = list.findAll('.ant-float-btn');
    expect(listItems).toHaveLength(2);
    expect(listItems[0].classes()).toContain('ctx-group-item');
    expect(listItems[0].classes()).toContain('prop-item');
    expect(listItems[0].classes()).not.toContain('prop-trigger');
    expect(listItems[0].attributes('style')).toContain('border-radius: 6px');
    expect(listItems[0].find('.ant-float-btn-icon').classes()).toContain('prop-item-icon');
    expect(listItems[0].find('.ant-float-btn-content').classes()).toContain('prop-item-content');

    const trigger = wrapper.find('.ant-float-btn-group-trigger');
    expect(trigger.exists()).toBe(true);
    expect(trigger.classes()).toContain('ctx-group-trigger');
    expect(trigger.classes()).toContain('prop-trigger');
    expect(trigger.classes()).not.toContain('prop-item');
    expect(trigger.attributes('style')).toContain('background-color: rgb(10, 20, 30)');
    expect(trigger.find('.ant-float-btn-icon').classes()).toContain('prop-trigger-icon');
    expect(trigger.find('.ant-float-btn-content').classes()).toContain('prop-trigger-content');
    expect(trigger.find('.ctx-close-icon').exists()).toBe(true);
  });

  it('renders FloatButton._InternalPanelDoNotUseOrYouWillBeFired (PurePanel) for single, backTop, and group items', () => {
    const InternalFloatButton = FloatButton._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalFloatButton).toBeDefined();

    const single = mount(InternalFloatButton, {
      props: { content: 'HELP', shape: 'square', type: 'primary' },
    });
    expect(single.find('.ant-float-btn-pure').exists()).toBe(true);
    expect(single.find('.ant-float-btn-primary').exists()).toBe(true);

    const backTop = mount(InternalFloatButton, { props: { backTop: true } });
    expect(backTop.find('.ant-float-btn-pure').exists()).toBe(true);

    const group = mount(InternalFloatButton, {
      props: {
        open: true,
        trigger: 'click',
        items: [{ content: '1' }, { content: '2' }],
      },
    });
    expect(group.find('.ant-float-btn-group.ant-float-btn-pure').exists()).toBe(true);
    expect(group.findAll('.ant-float-btn-group-wrap .ant-float-btn')).toHaveLength(2);
  });

  it('supports BackTop showProgress with CSS progress variable and conic-gradient styles', async () => {
    document.head.innerHTML = '';
    const scrollEl = document.createElement('div');
    Object.defineProperty(scrollEl, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollEl, 'clientHeight', { value: 200, configurable: true });
    Object.defineProperty(scrollEl, 'scrollTop', {
      value: 400,
      writable: true,
      configurable: true,
    });

    const wrapper = mount(ConfigProvider, {
      props: {
        theme: { cssVar: true },
        floatButton: {
          backTopIcon: <span class="ctx-back-top-icon">TOP</span>,
        },
      },
      slots: {
        default: () => (
          <FloatButton.BackTop showProgress visibilityHeight={0} target={() => scrollEl} />
        ),
      },
    });
    await nextTick();
    await nextTick();

    const btn = wrapper.find('.ant-float-btn');
    expect(btn.classes()).toContain('ant-float-btn-progress');
    expect(btn.attributes('style')).toContain('--ant-float-btn-progress:');
    expect(btn.find('.ctx-back-top-icon').exists()).toBe(true);

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-float-btn-progress');
    expect(css).toContain('conic-gradient');
    expect(css).not.toContain('NaN');
  });
});
