import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref, computed } from 'vue';
import notification from '..';
import Notice from '../../vc-notification/Notice';

describe('Notification stack and closable object config', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    notification.destroy();
    notification.config({ stack: { threshold: 3 }, closable: true });
  });

  it('stacks notifications when count reaches threshold and expands on hover via useNotification', async () => {
    let api;
    const enabled = ref(true);
    const threshold = ref(2);
    const Demo = defineComponent({
      setup() {
        const [notiApi, contextHolder] = notification.useNotification({
          stack: computed(() => (enabled.value ? { threshold: threshold.value } : false)),
        });
        api = notiApi;
        return () => <div>{contextHolder()}</div>;
      },
    });

    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();

    api.open({ key: 'n1', message: 'First', duration: 0 });
    await nextTick();
    await nextTick();

    let holder = document.body.querySelector('.ant-notification-topRight');
    expect(holder).toBeTruthy();
    expect(holder.classList.contains('ant-notification-stack')).toBe(false);

    api.open({ key: 'n2', message: 'Second', duration: 0 });
    await nextTick();
    await nextTick();

    holder = document.body.querySelector('.ant-notification-topRight');
    expect(holder.classList.contains('ant-notification-stack')).toBe(true);
    expect(holder.classList.contains('ant-notification-stack-expanded')).toBe(false);

    // Hover expands stack
    holder.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    expect(holder.classList.contains('ant-notification-stack-expanded')).toBe(true);

    // Mouse leave collapses stack
    holder.dispatchEvent(new MouseEvent('mouseleave'));
    await nextTick();
    expect(holder.classList.contains('ant-notification-stack-expanded')).toBe(false);

    // 4th card hides cards with stackIndex >= 3
    api.open({ key: 'n3', message: 'Third', duration: 0 });
    api.open({ key: 'n4', message: 'Fourth', duration: 0 });
    await nextTick();
    await nextTick();
    const notices = document.body.querySelectorAll('.ant-notification-notice');
    expect(notices.length).toBe(4);
    expect(notices[0].classList.contains('ant-notification-notice-stack-hidden')).toBe(true);
    expect(notices[3].classList.contains('ant-notification-notice-stack-hidden')).toBe(false);

    // Disabling stack dynamically removes stack class
    enabled.value = false;
    await nextTick();
    await nextTick();
    expect(holder.classList.contains('ant-notification-stack')).toBe(false);

    wrapper.unmount();
  });

  it('supports stack via static notification.config', async () => {
    notification.config({ stack: { threshold: 2 } });
    notification.open({ key: 's1', message: 'Static 1', duration: 0 });
    notification.open({ key: 's2', message: 'Static 2', duration: 0 });
    await nextTick();
    await new Promise(r => setTimeout(r, 20));

    const holder = document.body.querySelector('.ant-notification-topRight');
    expect(holder).toBeTruthy();
    expect(holder.classList.contains('ant-notification-stack')).toBe(true);

    holder.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    expect(holder.classList.contains('ant-notification-stack-expanded')).toBe(true);
  });

  it('supports closable object config (closeIcon, disabled, aria-label, onClose) on Notice and useNotification', async () => {
    const onNoticeClose = jest.fn();
    const onClosableClose = jest.fn();
    const wrapper = mount(Notice, {
      props: {
        prefixCls: 'ant-notification',
        noticeKey: 'c1',
        duration: 0,
        onClose: onNoticeClose,
        closable: {
          closeIcon: <span class="custom-closable-icon">×</span>,
          disabled: true,
          'aria-label': 'Dismiss notification',
          onClose: onClosableClose,
        },
      },
      slots: {
        default: () => 'Closable body',
      },
    });
    await nextTick();

    const closeBtn = wrapper.find('.ant-notification-notice-close');
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.attributes('aria-label')).toBe('Dismiss notification');
    expect(closeBtn.attributes('aria-disabled')).toBe('true');
    expect(closeBtn.classes()).toContain('ant-notification-notice-close-disabled');
    expect(wrapper.find('.custom-closable-icon').exists()).toBe(true);

    await closeBtn.trigger('click');
    expect(onNoticeClose).not.toHaveBeenCalled();
    expect(onClosableClose).not.toHaveBeenCalled();

    // Re-enable close button
    await wrapper.setProps({
      closable: {
        closeIcon: <span class="custom-closable-icon">×</span>,
        disabled: false,
        'aria-label': 'Close now',
        onClose: onClosableClose,
      },
    });
    await nextTick();
    const activeCloseBtn = wrapper.find('.ant-notification-notice-close');
    expect(activeCloseBtn.attributes('aria-label')).toBe('Close now');
    await activeCloseBtn.trigger('click');
    expect(onClosableClose).toHaveBeenCalledTimes(1);
    expect(onNoticeClose).toHaveBeenCalledWith('c1');

    // closable: false hides close button
    await wrapper.setProps({ closable: false });
    await nextTick();
    expect(wrapper.find('.ant-notification-notice-close').exists()).toBe(false);
    wrapper.unmount();
  });

  it('passes closable object through useNotification.open', async () => {
    let api;
    const Demo = defineComponent({
      setup() {
        const [notiApi, contextHolder] = notification.useNotification();
        api = notiApi;
        return () => <div>{contextHolder()}</div>;
      },
    });

    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();

    api.open({
      key: 'hook-closable',
      message: 'Hook Closable',
      duration: 0,
      closable: {
        closeIcon: () => <span class="hook-custom-close">CloseMe</span>,
        'aria-label': 'Hook Close Label',
      },
    });
    await nextTick();
    await nextTick();

    const closeBtn = document.body.querySelector('.ant-notification-notice-close');
    expect(closeBtn).toBeTruthy();
    expect(closeBtn.getAttribute('aria-label')).toBe('Hook Close Label');
    expect(document.body.querySelector('.hook-custom-close')).toBeTruthy();

    api.open({
      key: 'hook-non-closable',
      message: 'Non Closable',
      duration: 0,
      closable: false,
    });
    await nextTick();
    await nextTick();
    const notices = document.body.querySelectorAll('.ant-notification-notice');
    expect(notices[1].querySelector('.ant-notification-notice-close')).toBeNull();
    wrapper.unmount();
  });
});
