import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { asyncExpect } from '../../../tests/utils';
import message, { getInstance } from '..';
import ConfigProvider from '../../config-provider';
import SmileOutlined from '@ant-design/icons-vue/SmileOutlined';

describe('message', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.outerHTML = '';
  });

  afterEach(() => {
    message.destroy();
  });

  afterEach(() => {
    message.destroy();
    jest.useRealTimers();
  });

  it('should be able to config top', async () => {
    message.config({
      top: '100px',
    });
    message.info('whatever');
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message')[0].style.top).toBe('100px');
    });
  });
  it('should be able to config getContainer', () => {
    message.config({
      getContainer: () => {
        const div = document.createElement('div');
        div.className = 'custom-container';
        document.body.appendChild(div);
        return div;
      },
    });
    message.info('whatever');
    expect(document.querySelectorAll('.custom-container').length).toBe(1);
  });

  it('should be able to config maxCount', async () => {
    message.config({
      maxCount: 5,
    });
    for (let i = 0; i < 10; i += 1) {
      message.info('test');
    }
    message.info('last');
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(5);
    expect(document.querySelectorAll('.ant-message-notice')[4].textContent).toBe('last');
  });

  it('should be able to hide manually', async () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    hide1();
    jest.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(1);
    hide2();
    jest.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(0);
  });

  it('should be able to destroy globally', async () => {
    message.info('whatever', 0);
    message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message').length).toBe(1);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    message.destroy();
    expect(document.querySelectorAll('.ant-message').length).toBe(0);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  it('should have the default duration when using the onClose arguments', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever', () => {
      // calculate the approximately duration value
      const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  it('should be called like promise', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever').then(() => {
      // calculate the approximately duration value
      const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  // https:// github.com/ant-design/ant-design/issues/8201
  it('should hide message correctly', async () => {
    const hide = message.loading('Action in progress..', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
    hide();
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });
  it('should allow custom icon', async () => {
    message.open({ content: 'Message', icon: <SmileOutlined /> });
    await Promise.resolve();
    expect(document.querySelectorAll('.anticon-smile').length).toBe(1);
  });

  it('should have no icon', async () => {
    message.open({ content: 'Message' });
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice .anticon').length).toBe(0);
  });
  // https://github.com/ant-design/ant-design/issues/8201
  it('should destroy messages correctly', async () => {
    message.loading('Action in progress1..', 0);
    message.loading('Action in progress2..', 0);
    setTimeout(() => message.destroy(), 1000);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('supports semantic classNames and styles (Object + Function) in static API', async () => {
    message.open({
      type: 'error',
      content: 'Static semantic',
      duration: 0,
      classNames: ({ props }) => ({
        root: `static-root-${props.type}`,
        wrapper: 'static-wrapper',
        icon: 'static-icon',
        title: 'static-title',
      }),
      styles: ({ props }) => ({
        root: { borderColor: props.type === 'error' ? 'rgb(255, 0, 0)' : 'blue' },
        icon: { color: 'rgb(207, 19, 34)' },
        content: { fontWeight: '600' },
      }),
    });
    await Promise.resolve();
    const notice = document.querySelector('.ant-message-notice');
    expect(notice.className).toContain('static-root-error');
    expect(notice.style.borderColor).toBe('rgb(255, 0, 0)');
    expect(document.querySelector('.ant-message-custom-content').className).toContain(
      'static-wrapper',
    );
    expect(document.querySelector('.static-icon')).toBeTruthy();
    expect(document.querySelector('.static-icon').style.color).toBe('rgb(207, 19, 34)');
    expect(document.querySelector('.static-title').style.fontWeight).toBe('600');
  });

  it('supports semantic classNames/styles in useMessage merged with ConfigProvider.message', async () => {
    let api;
    const Demo = {
      setup() {
        const [messageApi, contextHolder] = message.useMessage();
        api = messageApi;
        return () => (
          <ConfigProvider
            message={{
              classNames: { root: 'cp-msg-root', icon: 'cp-msg-icon' },
              styles: { root: { padding: '12px' } },
            }}
          >
            {contextHolder()}
          </ConfigProvider>
        );
      },
    };
    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();
    api.open({
      type: 'success',
      content: 'Hook semantic',
      duration: 0,
      classNames: ({ props }) => ({
        root: `hook-root-${props.type}`,
        title: 'hook-title',
      }),
      styles: ({ props }) => ({
        icon: { color: props.type === 'success' ? 'rgb(35, 120, 4)' : 'black' },
        title: { fontWeight: '700' },
      }),
    });
    await nextTick();
    await nextTick();
    const notice = document.querySelector('.ant-message-notice');
    expect(notice.className).toContain('cp-msg-root');
    expect(notice.className).toContain('hook-root-success');
    expect(notice.style.padding).toBe('12px');
    expect(document.querySelector('.cp-msg-icon')).toBeTruthy();
    expect(document.querySelector('.cp-msg-icon').style.color).toBe('rgb(35, 120, 4)');
    expect(document.querySelector('.hook-title').style.fontWeight).toBe('700');
    wrapper.unmount();
  });

  it('exposes _InternalPanelDoNotUseOrYouWillBeFired (PurePanel)', () => {
    const InternalPanel = message._InternalPanelDoNotUseOrYouWillBeFired;
    const wrapper = mount(InternalPanel, {
      props: {
        content: 'Hello World!',
        type: 'error',
        classNames: { root: 'pure-root', title: 'pure-title', icon: 'pure-icon' },
        styles: { root: { backgroundColor: 'rgb(255, 242, 240)' } },
      },
    });
    expect(wrapper.find('.ant-message-notice-pure-panel').exists()).toBe(true);
    expect(wrapper.find('.pure-root').exists()).toBe(true);
    expect(wrapper.find('.pure-root').attributes('style')).toContain(
      'background-color: rgb(255, 242, 240)',
    );
    expect(wrapper.find('.pure-icon').exists()).toBe(true);
    expect(wrapper.find('.pure-title').text()).toBe('Hello World!');
  });
});
