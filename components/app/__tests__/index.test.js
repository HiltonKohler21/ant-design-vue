import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import App from '..';
import ConfigProvider from '../../config-provider';
import { useInjectAppConfigContext } from '../context';

describe('App', () => {
  it('renders div with ant-app class by default', () => {
    const wrapper = mount(App, {
      slots: {
        default: () => h('span', { class: 'inner' }, 'Hello'),
      },
    });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('ant-app');
    expect(wrapper.find('.inner').text()).toBe('Hello');
  });

  it('supports custom component tag and component=false', () => {
    const sectionWrapper = mount(App, {
      props: { component: 'section', rootClassName: 'my-root' },
      slots: { default: () => h('span', 'Section') },
    });
    expect(sectionWrapper.element.tagName).toBe('SECTION');
    expect(sectionWrapper.classes()).toContain('ant-app');
    expect(sectionWrapper.classes()).toContain('my-root');

    const fragWrapper = mount(App, {
      props: { component: false },
      slots: { default: () => h('span', { class: 'frag-child' }, 'No Wrapper') },
    });
    expect(fragWrapper.find('.ant-app').exists()).toBe(false);
    expect(fragWrapper.find('.frag-child').text()).toBe('No Wrapper');
  });

  it('provides useApp context and merges nested message/notification config', async () => {
    let capturedConfig;
    let capturedApi;
    const Child = defineComponent({
      setup() {
        capturedConfig = useInjectAppConfigContext();
        capturedApi = App.useApp();
        return () => h('div', { class: 'child' }, 'child');
      },
    });

    const wrapper = mount({
      render() {
        return (
          <App message={{ maxCount: 2, duration: 5 }} notification={{ placement: 'topLeft' }}>
            <App message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
              <Child />
            </App>
          </App>
        );
      },
    });

    await nextTick();
    expect(wrapper.find('.child').exists()).toBe(true);
    expect(capturedConfig.message).toEqual({ maxCount: 1, duration: 5 });
    expect(capturedConfig.notification).toEqual({ placement: 'bottomLeft' });
    expect(typeof capturedApi.message.success).toBe('function');
    expect(typeof capturedApi.notification.info).toBe('function');
    expect(typeof capturedApi.modal.warning).toBe('function');
  });

  it('applies rtl class under ConfigProvider direction="rtl"', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <App>
              <span>rtl</span>
            </App>
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.find('.ant-app').classes()).toContain('ant-app-rtl');
  });
});
