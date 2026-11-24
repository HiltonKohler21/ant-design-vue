import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import notification from '..';
import ConfigProvider, { globalConfigForApi } from '../../config-provider';

describe('Notification v6 parity: semantic classNames/styles, title/actions, PurePanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    globalConfigForApi.notification = undefined;
  });

  afterEach(() => {
    notification.destroy();
    globalConfigForApi.notification = undefined;
  });

  it('supports title/actions aliases and semantic classNames/styles (Object + Function) via useNotification', async () => {
    let api;
    const Demo = defineComponent({
      setup() {
        const [notiApi, contextHolder] = notification.useNotification({
          classNames: {
            list: 'hook-list-cls',
            title: 'hook-title-cls',
          },
          styles: {
            list: { zIndex: 1234 },
            title: { letterSpacing: '1px' },
          },
        });
        api = notiApi;
        return () => <div>{contextHolder()}</div>;
      },
    });

    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            notification={{
              className: 'cp-root-legacy',
              style: { opacity: '0.95' },
              classNames: {
                root: 'cp-semantic-root',
                title: 'cp-semantic-title',
                description: 'cp-semantic-desc',
                close: 'cp-semantic-close',
              },
              styles: {
                root: { paddingTop: '12px' },
                description: { lineHeight: '22px' },
              },
            }}
          >
            <Demo />
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    // 1. Object classNames & styles
    api.info({
      key: 'obj-notice',
      title: 'Object Title',
      description: 'Object Description',
      actions: () => h('button', { class: 'custom-action-btn' }, 'Action'),
      duration: false,
      role: 'status',
      props: { 'data-testid': 'notice-obj' },
      classNames: {
        root: 'obj-root',
        wrapper: 'obj-wrapper',
        section: 'obj-section',
        icon: 'obj-icon',
        title: 'obj-title',
        description: 'obj-desc',
        actions: 'obj-actions',
        close: 'obj-close',
      },
      styles: {
        root: { backgroundColor: 'rgb(246, 255, 237)', borderRadius: '16px' },
        icon: { color: 'rgb(35, 120, 4)' },
        title: { color: 'rgb(35, 120, 4)', fontWeight: 600 },
        description: { color: 'rgb(63, 102, 0)' },
        actions: { marginTop: '10px' },
        close: { color: 'rgb(255, 0, 0)' },
      },
    });
    await nextTick();
    await nextTick();

    const listEl = document.body.querySelector('.ant-notification-topRight');
    expect(listEl.classList.contains('hook-list-cls')).toBe(true);
    expect(listEl.style.zIndex).toBe('1234');

    const noticeEl = document.body.querySelector('[data-testid="notice-obj"]');
    expect(noticeEl).toBeTruthy();
    expect(noticeEl.classList.contains('cp-root-legacy')).toBe(true);
    expect(noticeEl.classList.contains('cp-semantic-root')).toBe(true);
    expect(noticeEl.classList.contains('obj-root')).toBe(true);
    expect(noticeEl.style.backgroundColor).toBe('rgb(246, 255, 237)');
    expect(noticeEl.style.borderRadius).toBe('16px');
    expect(noticeEl.style.paddingTop).toBe('12px');

    const wrapperEl = noticeEl.querySelector('.obj-wrapper');
    expect(wrapperEl).toBeTruthy();
    expect(wrapperEl.getAttribute('role')).toBe('status');

    const sectionEl = noticeEl.querySelector('.obj-section');
    expect(sectionEl).toBeTruthy();

    const iconEl = noticeEl.querySelector('.obj-icon');
    expect(iconEl).toBeTruthy();
    expect(iconEl.style.color).toBe('rgb(35, 120, 4)');

    const titleEl = noticeEl.querySelector('.ant-notification-notice-title');
    expect(titleEl.textContent).toBe('Object Title');
    expect(titleEl.classList.contains('cp-semantic-title')).toBe(true);
    expect(titleEl.classList.contains('hook-title-cls')).toBe(true);
    expect(titleEl.classList.contains('obj-title')).toBe(true);
    expect(titleEl.style.letterSpacing).toBe('1px');
    expect(titleEl.style.color).toBe('rgb(35, 120, 4)');

    const descEl = noticeEl.querySelector('.ant-notification-notice-description');
    expect(descEl.textContent).toBe('Object Description');
    expect(descEl.classList.contains('cp-semantic-desc')).toBe(true);
    expect(descEl.classList.contains('obj-desc')).toBe(true);
    expect(descEl.style.lineHeight).toBe('22px');
    expect(descEl.style.color).toBe('rgb(63, 102, 0)');

    const actionsEl = noticeEl.querySelector('.ant-notification-notice-actions');
    expect(actionsEl).toBeTruthy();
    expect(actionsEl.classList.contains('obj-actions')).toBe(true);
    expect(actionsEl.style.marginTop).toBe('10px');
    expect(actionsEl.querySelector('.custom-action-btn').textContent).toBe('Action');

    const closeInner = noticeEl.querySelector('.ant-notification-close-x');
    expect(closeInner.classList.contains('cp-semantic-close')).toBe(true);
    expect(closeInner.classList.contains('obj-close')).toBe(true);
    expect(closeInner.style.color).toBe('rgb(255, 0, 0)');

    // 2. Function classNames & styles based on props.type
    api.error({
      key: 'fn-notice',
      title: 'Error Title',
      description: 'Error Description',
      duration: false,
      props: { 'data-testid': 'notice-fn' },
      classNames: ({ props }) => ({
        root: `fn-root-${props.type}`,
        title: `fn-title-${props.type}`,
      }),
      styles: ({ props }) =>
        props.type === 'error'
          ? {
              root: { backgroundColor: 'rgb(255, 242, 240)' },
              icon: { color: 'rgb(207, 19, 34)' },
            }
          : {},
    });
    await nextTick();
    await nextTick();

    const fnNotice = document.body.querySelector('[data-testid="notice-fn"]');
    expect(fnNotice).toBeTruthy();
    expect(fnNotice.classList.contains('fn-root-error')).toBe(true);
    expect(fnNotice.style.backgroundColor).toBe('rgb(255, 242, 240)');
    expect(fnNotice.querySelector('.fn-title-error').textContent).toBe('Error Title');
    expect(fnNotice.querySelector('.ant-notification-notice-icon').style.color).toBe(
      'rgb(207, 19, 34)',
    );

    wrapper.unmount();
  });

  it('supports semantic classNames/styles (Object + Function), title/actions, and globalConfigForApi in static notification.open', async () => {
    globalConfigForApi.notification = {
      classNames: {
        root: 'global-root',
        title: 'global-title',
      },
      styles: {
        description: { fontStyle: 'italic' },
      },
    };

    notification.warning({
      key: 'static-v6',
      title: 'Static v6 Title',
      description: 'Static v6 Desc',
      actions: () => h('span', { class: 'static-action' }, 'OK'),
      duration: false,
      classNames: ({ props }) => ({
        root: `static-${props.type}`,
        actions: 'static-actions-cls',
        close: 'static-close-cls',
      }),
      styles: ({ props }) => ({
        root: { borderWidth: props.type === 'warning' ? '3px' : '1px' },
        title: { fontWeight: 700 },
        close: { opacity: '0.8' },
      }),
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 20));

    const noticeEl = document.body.querySelector('.ant-notification-notice');
    expect(noticeEl).toBeTruthy();
    expect(noticeEl.classList.contains('ant-notification-notice-warning')).toBe(true);
    expect(noticeEl.classList.contains('global-root')).toBe(true);
    expect(noticeEl.classList.contains('static-warning')).toBe(true);
    expect(noticeEl.style.borderWidth).toBe('3px');

    const titleEl = noticeEl.querySelector('.ant-notification-notice-title');
    expect(titleEl.textContent).toBe('Static v6 Title');
    expect(titleEl.classList.contains('global-title')).toBe(true);
    expect(titleEl.style.fontWeight).toBe('700');

    const descEl = noticeEl.querySelector('.ant-notification-notice-description');
    expect(descEl.style.fontStyle).toBe('italic');

    const actionsEl = noticeEl.querySelector('.static-actions-cls');
    expect(actionsEl).toBeTruthy();
    expect(actionsEl.querySelector('.static-action').textContent).toBe('OK');

    const closeInner = noticeEl.querySelector('.static-close-cls');
    expect(closeInner).toBeTruthy();
    expect(closeInner.style.opacity).toBe('0.8');
  });

  it('hides close button when closeIcon is null or false', async () => {
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
      key: 'no-close-null',
      title: 'No Close Null',
      closeIcon: null,
      duration: false,
    });
    api.open({
      key: 'no-close-false',
      title: 'No Close False',
      closeIcon: false,
      duration: false,
    });
    await nextTick();
    await nextTick();

    const notices = document.body.querySelectorAll('.ant-notification-notice');
    expect(notices.length).toBe(2);
    expect(notices[0].querySelector('.ant-notification-notice-close')).toBeNull();
    expect(notices[1].querySelector('.ant-notification-notice-close')).toBeNull();
    wrapper.unmount();
  });

  it('renders _InternalPanelDoNotUseOrYouWillBeFired (PurePanel) with title, actions, type, closable, and semantic styles', async () => {
    const InternalPanel = notification._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalPanel).toBeTruthy();

    const wrapper = mount({
      render() {
        return (
          <InternalPanel
            title="Hello World!"
            description="Hello World?"
            type="success"
            actions={() => h('button', { class: 'pure-btn' }, 'My Button')}
            classNames={({ props }) => ({
              root: `pure-root-${props.type}`,
              title: 'pure-title',
              description: 'pure-desc',
              actions: 'pure-actions',
              icon: 'pure-icon',
              close: 'pure-close',
            })}
            styles={{
              root: { borderRadius: '12px' },
              title: { color: 'rgb(0, 128, 0)' },
            }}
          />
        );
      },
    });
    await nextTick();

    const rootEl = wrapper.find('.ant-notification-notice');
    expect(rootEl.exists()).toBe(true);
    expect(rootEl.classes()).toContain('ant-notification-notice-pure-panel');
    expect(rootEl.classes()).toContain('ant-notification-notice-success');
    expect(rootEl.classes()).toContain('pure-root-success');
    expect(rootEl.element.style.borderRadius).toBe('12px');

    expect(wrapper.find('.pure-icon').exists()).toBe(true);
    expect(wrapper.find('.pure-title').text()).toBe('Hello World!');
    expect(wrapper.find('.pure-title').element.style.color).toBe('rgb(0, 128, 0)');
    expect(wrapper.find('.pure-desc').text()).toBe('Hello World?');
    expect(wrapper.find('.pure-actions .pure-btn').text()).toBe('My Button');
    expect(wrapper.find('.ant-notification-notice-close .pure-close').exists()).toBe(true);

    wrapper.unmount();
  });
});
