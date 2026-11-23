import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import FloatButton from '..';
import ConfigProvider from '../../config-provider';

describe('FloatButton.Group placement & FloatButton content', () => {
  it('applies default placement="top" and menu-mode classes when trigger is set', () => {
    const wrapper = mount({
      render() {
        return (
          <FloatButton.Group trigger="click">
            <FloatButton />
            <FloatButton />
          </FloatButton.Group>
        );
      },
    });
    const group = wrapper.find('.ant-float-btn-group');
    expect(group.classes()).toContain('ant-float-btn-group-top');
    expect(group.classes()).toContain('ant-float-btn-group-menu-mode');
  });

  it.each(['top', 'right', 'bottom', 'left'])(
    'supports placement="%s" on FloatButton.Group in menu mode',
    placement => {
      const wrapper = mount({
        render() {
          return (
            <FloatButton.Group trigger="hover" placement={placement}>
              <FloatButton />
              <FloatButton />
            </FloatButton.Group>
          );
        },
      });
      const group = wrapper.find('.ant-float-btn-group');
      expect(group.classes()).toContain(`ant-float-btn-group-${placement}`);
      expect(group.classes()).toContain('ant-float-btn-group-menu-mode');
    },
  );

  it('does not add placement class when trigger is not set (static group)', () => {
    const wrapper = mount({
      render() {
        return (
          <FloatButton.Group placement="right">
            <FloatButton />
          </FloatButton.Group>
        );
      },
    });
    const group = wrapper.find('.ant-float-btn-group');
    expect(group.classes()).not.toContain('ant-float-btn-group-right');
    expect(group.classes()).not.toContain('ant-float-btn-group-menu-mode');
  });

  it('supports content prop/slot on FloatButton and falls back to description', () => {
    const contentPropWrapper = mount({
      render() {
        return <FloatButton shape="square" content="CONTENT PROP" />;
      },
    });
    expect(contentPropWrapper.find('.ant-float-btn-description').text()).toBe('CONTENT PROP');
    expect(contentPropWrapper.find('button').attributes('content')).toBeUndefined();

    const contentSlotWrapper = mount({
      render() {
        return (
          <FloatButton
            shape="square"
            v-slots={{
              content: () => <span class="slot-content">SLOT CONTENT</span>,
            }}
          />
        );
      },
    });
    expect(contentSlotWrapper.find('.slot-content').text()).toBe('SLOT CONTENT');

    const descFallbackWrapper = mount({
      render() {
        return <FloatButton shape="square" description="LEGACY DESC" />;
      },
    });
    expect(descFallbackWrapper.find('.ant-float-btn-description').text()).toBe('LEGACY DESC');

    const precedenceWrapper = mount({
      render() {
        return <FloatButton shape="square" content="NEW" description="OLD" />;
      },
    });
    expect(precedenceWrapper.find('.ant-float-btn-description').text()).toBe('NEW');
  });

  it('forwards content prop and slot from FloatButton.Group to trigger button', () => {
    const wrapper = mount({
      render() {
        return (
          <FloatButton.Group trigger="click" shape="square" content="MENU">
            <FloatButton />
          </FloatButton.Group>
        );
      },
    });
    expect(wrapper.find('.ant-float-btn-description').text()).toBe('MENU');
  });

  it('generates directional placement CSS cleanly under cssVar: true', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <FloatButton.Group trigger="click" placement="left">
            <FloatButton />
            <FloatButton />
          </FloatButton.Group>
        ),
      },
    });
    await nextTick();
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('.ant-float-btn-group-top');
    expect(css).toContain('.ant-float-btn-group-bottom');
    expect(css).toContain('.ant-float-btn-group-left');
    expect(css).toContain('.ant-float-btn-group-right');
    expect(css).not.toContain('NaN');
    expect(css).not.toContain('undefined');
    wrapper.unmount();
  });
});
