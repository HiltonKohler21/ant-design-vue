import { mount } from '@vue/test-utils';
import { nextTick, defineComponent } from 'vue';
import notification from '..';
import Notice from '../../vc-notification/Notice';
import ConfigProvider from '../../config-provider';

describe('Notification showProgress, pauseOnHover, and ConfigProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    notification.destroy();
    jest.useRealTimers();
  });

  it('renders progress bar when showProgress is true and duration > 0', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Notice, {
      props: {
        prefixCls: 'ant-notification',
        noticeKey: 'p1',
        duration: 4,
        showProgress: true,
        onClose,
      },
      slots: {
        default: () => 'Progress content',
      },
    });
    await nextTick();
    const progress = wrapper.find('progress.ant-notification-notice-progress');
    expect(progress.exists()).toBe(true);
    expect(Number(progress.attributes('value'))).toBe(100);

    jest.advanceTimersByTime(2000);
    await nextTick();
    expect(Number(progress.attributes('value'))).toBeLessThan(100);
    expect(onClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);
    await nextTick();
    expect(onClose).toHaveBeenCalledWith('p1');
    wrapper.unmount();
  });

  it('pauses and resumes timer on hover when pauseOnHover is true (default)', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Notice, {
      props: {
        prefixCls: 'ant-notification',
        noticeKey: 'p2',
        duration: 2,
        showProgress: true,
        pauseOnHover: true,
        onClose,
      },
      slots: {
        default: () => 'Pauseable content',
      },
    });
    await nextTick();

    jest.advanceTimersByTime(1000);
    await wrapper.find('.ant-notification-notice').trigger('mouseenter');

    // Advance well past duration while hovering — should NOT close
    jest.advanceTimersByTime(5000);
    await nextTick();
    expect(onClose).not.toHaveBeenCalled();

    // Leave mouse — should close after remaining ~1s
    await wrapper.find('.ant-notification-notice').trigger('mouseleave');
    jest.advanceTimersByTime(1100);
    await nextTick();
    expect(onClose).toHaveBeenCalledWith('p2');
    wrapper.unmount();
  });

  it('does NOT pause timer on hover when pauseOnHover is false', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Notice, {
      props: {
        prefixCls: 'ant-notification',
        noticeKey: 'p3',
        duration: 2,
        showProgress: true,
        pauseOnHover: false,
        onClose,
      },
      slots: {
        default: () => 'Non-pauseable content',
      },
    });
    await nextTick();

    await wrapper.find('.ant-notification-notice').trigger('mouseenter');
    jest.advanceTimersByTime(2100);
    await nextTick();
    expect(onClose).toHaveBeenCalledWith('p3');
    wrapper.unmount();
  });

  it('applies ConfigProvider.notification closeIcon, className, style via useNotification', async () => {
    let api;
    const Demo = defineComponent({
      setup() {
        const [notiApi, contextHolder] = notification.useNotification();
        api = notiApi;
        return () => <div>{contextHolder()}</div>;
      },
    });

    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            notification={{
              className: 'cp-noti-cls',
              style: { borderWidth: '3px' },
              closeIcon: <span class="cp-noti-close">X</span>,
            }}
          >
            <Demo />
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    api.open({
      message: 'Hello',
      duration: 5,
      showProgress: true,
    });
    await nextTick();
    await nextTick();

    const noticeEl = document.body.querySelector('.ant-notification-notice');
    expect(noticeEl).toBeTruthy();
    expect(noticeEl.classList.contains('cp-noti-cls')).toBe(true);
    expect(noticeEl.style.borderWidth).toBe('3px');
    expect(document.body.querySelector('.cp-noti-close')).toBeTruthy();
    expect(document.body.querySelector('.ant-notification-notice-progress')).toBeTruthy();
    wrapper.unmount();
  });
});
