import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Popconfirm from '..';
function $$(className) {
  return document.body.querySelectorAll(className);
}
describe('Popconfirm', () => {
  // const eventObject = expect.objectContaining({
  //   target: expect.anything(),
  //   preventDefault: expect.any(Function),
  // })
  it('should popup Popconfirm dialog', async () => {
    const onVisibleChange = jest.fn();

    mount(
      {
        render() {
          return (
            <Popconfirm
              title={<span class="popconfirm-test">Are you sure delete this task?</span>}
              okText="Yes"
              cancelText="No"
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onVisibleChange={onVisibleChange}
            >
              <span>Delete</span>
            </Popconfirm>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    let triggerNode = null;
    await asyncExpect(() => {
      triggerNode = document.getElementsByTagName('span')[0];
      triggerNode.dispatchEvent(new MouseEvent('click'));
    });
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(true, undefined);
      expect($$('.popconfirm-test').length).toBe(1);
      triggerNode.dispatchEvent(new MouseEvent('click'));
    }, 1000);
    await asyncExpect(() => {
      expect(onVisibleChange).toHaveBeenLastCalledWith(false, undefined);
    });
  });

  it('should show overlay when trigger is clicked', async () => {
    const popconfirm = mount(
      {
        render() {
          return (
            <Popconfirm ref="popconfirm" title="code">
              <span>show me your code</span>
            </Popconfirm>
          );
        },
      },
      { sync: false },
    );

    await asyncExpect(() => {
      expect(popconfirm.vm.$refs.popconfirm.getPopupDomNode()).toBe(null);

      popconfirm.find('span').trigger('click');
    }, 1000);
    await asyncExpect(() => {
      const popup = popconfirm.vm.$refs.popconfirm.getPopupDomNode();
      expect(popup).not.toBe(null);
      expect(popup.innerHTML).toMatchSnapshot();
    }, 1000);
  });

  it('should not open in disabled', async () => {
    const popconfirm = mount(
      {
        render() {
          return (
            <Popconfirm ref="popconfirm" title="code" disabled={true}>
              <span>click me</span>
            </Popconfirm>
          );
        },
      },
      { sync: false },
    );
    popconfirm.find('span').trigger('click');
    const popup = popconfirm.vm.$refs.popconfirm.getPopupDomNode();
    expect(popup).toBeFalsy();
  });

  it('should hide icon when icon is null', async () => {
    const popconfirm = mount(
      {
        render() {
          return (
            <Popconfirm ref="popconfirm" open icon={null} title="Are you OK?" description="Details">
              <span>Delete</span>
            </Popconfirm>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      const popup = popconfirm.vm.$refs.popconfirm.getPopupDomNode();
      expect(popup).not.toBe(null);
      expect(popup.querySelector('.ant-popconfirm-message-icon')).toBe(null);
      expect(popup.querySelector('.ant-popconfirm-message-no-icon')).not.toBe(null);
      expect(popup.querySelector('.ant-popconfirm-message-title').textContent).toBe('Are you OK?');
      expect(popup.querySelector('.ant-popconfirm-description').textContent).toBe('Details');
    }, 1000);

    popconfirm.unmount();
  });

  it('should render _InternalPanelDoNotUseOrYouWillBeFired PurePanel correctly', () => {
    const InternalPopconfirm = Popconfirm._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalPopconfirm).toBeDefined();

    const wrapper = mount({
      render() {
        return (
          <InternalPopconfirm
            title="Are you OK?"
            description="Does this look good?"
            placement="bottomRight"
            style={{ width: '250px' }}
          />
        );
      },
    });

    expect(wrapper.find('.ant-popover.ant-popover-pure.ant-popconfirm').exists()).toBe(true);
    expect(wrapper.find('.ant-popover-placement-bottomRight').exists()).toBe(true);
    expect(wrapper.find('.ant-popover-arrow').exists()).toBe(true);
    expect(wrapper.find('.ant-popconfirm-message-icon').exists()).toBe(true);
    expect(wrapper.find('.ant-popconfirm-message-title').text()).toBe('Are you OK?');
    expect(wrapper.find('.ant-popconfirm-description').text()).toBe('Does this look good?');
    expect(wrapper.findAll('.ant-popconfirm-buttons button').length).toBe(2);

    const noIconWrapper = mount({
      render() {
        return (
          <InternalPopconfirm
            icon={null}
            title="No Icon"
            description="No Icon Desc"
            showCancel={false}
            classNames={{
              root: 'pure-root',
              container: 'pure-container',
              title: 'pure-title',
              content: 'pure-content',
              arrow: 'pure-arrow',
            }}
            styles={{
              title: { color: 'rgb(1, 2, 3)' },
            }}
          />
        );
      },
    });

    expect(noIconWrapper.find('.ant-popconfirm-message-icon').exists()).toBe(false);
    expect(noIconWrapper.find('.ant-popconfirm-message-no-icon').exists()).toBe(true);
    expect(noIconWrapper.findAll('.ant-popconfirm-buttons button').length).toBe(1);
    expect(noIconWrapper.find('.pure-root').exists()).toBe(true);
    expect(noIconWrapper.find('.pure-container').exists()).toBe(true);
    expect(noIconWrapper.find('.pure-title').exists()).toBe(true);
    expect(noIconWrapper.find('.pure-content').exists()).toBe(true);
    expect(noIconWrapper.find('.pure-arrow').exists()).toBe(true);
    expect(noIconWrapper.find('.pure-title').element.style.color).toBe('rgb(1, 2, 3)');
  });
});
