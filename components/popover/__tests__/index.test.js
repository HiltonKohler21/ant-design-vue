import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Popover from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Popover', () => {
  mountTest({
    render() {
      return (
        <div>
          <Popover />
        </div>
      );
    },
  });
  it('should show overlay when trigger is clicked', async () => {
    const popover = mount(
      {
        render() {
          return (
            <Popover
              ref="popover"
              content="console.log('hello world')"
              title="code"
              trigger="click"
            >
              <span>show me your code</span>
            </Popover>
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(popover.vm.$refs.popover.getPopupDomNode()).toBe(null);

      popover.find('span').trigger('click');
    }, 0);
    let popup = null;
    await asyncExpect(() => {
      popup = popover.vm.$refs.popover.getPopupDomNode();
      expect(popup).not.toBe(null);
    }, 1000);
    await asyncExpect(() => {
      expect(popup.innerHTML).toMatchSnapshot();
      expect(popup.innerHTML).toMatchSnapshot();
    });
  });

  it('should render overlay when only content (without title) is provided', async () => {
    const popover = mount(
      {
        render() {
          return (
            <Popover ref="popover" content="only content text" open>
              <span>trigger</span>
            </Popover>
          );
        },
      },
      { attachTo: 'body' },
    );
    await new Promise(r => setTimeout(r, 80));
    const popup = popover.vm.$refs.popover.getPopupDomNode();
    expect(popup).not.toBe(null);
    expect(popup.innerHTML).toContain('only content text');
    popover.unmount();
  });

  it('supports _InternalPanelDoNotUseOrYouWillBeFired pure panel rendering', () => {
    const InternalPopover = Popover._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalPopover).toBeDefined();
    const wrapper = mount(InternalPopover, {
      props: {
        title: 'Pure Title',
        content: 'Pure Content',
        placement: 'bottomLeft',
        classNames: { root: 'pure-root', title: 'pure-title', content: 'pure-content' },
        styles: { title: { color: 'rgb(1, 2, 3)' } },
      },
    });
    expect(wrapper.find('.ant-popover-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-popover-placement-bottomLeft').exists()).toBe(true);
    expect(wrapper.find('.ant-popover-pure').classes()).toContain('pure-root');
    // Arrow must live inside .ant-popover-content so placement padding does not detach it
    expect(wrapper.find('.ant-popover-content > .ant-popover-arrow').exists()).toBe(true);
    expect(wrapper.find('.ant-popover-title').text()).toBe('Pure Title');
    expect(wrapper.find('.ant-popover-title').classes()).toContain('pure-title');
    expect(wrapper.find('.ant-popover-title').attributes('style')).toContain('rgb(1, 2, 3)');
    expect(wrapper.find('.ant-popover-inner-content').text()).toBe('Pure Content');
    expect(wrapper.find('.ant-popover-inner-content').classes()).toContain('pure-content');
    wrapper.unmount();

    const noArrowWrapper = mount(InternalPopover, {
      props: {
        title: 'No Arrow',
        content: 'Body',
        arrow: false,
      },
    });
    expect(noArrowWrapper.find('.ant-popover-arrow').exists()).toBe(false);
    expect(noArrowWrapper.find('.ant-popover-pure').classes()).toContain(
      'ant-popover-arrow-hidden',
    );
    noArrowWrapper.unmount();
  });
});
