import { ref, computed, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import QRCode from '..';
import { defaultConfigProvider, useConfigContextProvider } from '../../config-provider/context';

describe('QRCode test', () => {
  it('should correct render', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" />;
      },
    });
    expect(wrapper.find('.ant-qrcode')).toBeTruthy();
    expect(wrapper.find('canvas')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('support custom icon', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" icon="test" />;
      },
    });
    expect(wrapper.find('.ant-qrcode')).toBeTruthy();
    expect(wrapper.find('image')).toBeTruthy();
  });

  it('support custom size', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" size={100} />;
      },
    });
    expect(wrapper.vm.$el.style.width).toBe('100px');
    expect(wrapper.vm.$el.style.height).toBe('100px');
  });

  it('support refresh', async () => {
    const refresh = jest.fn();
    const wrapper = mount({
      render() {
        return <QRCode value="test" status="expired" onRefresh={refresh} />;
      },
    });
    await wrapper.find('.ant-btn-link').trigger('click');
    expect(refresh).toHaveBeenCalled();
  });

  it('support loading', async () => {
    const Demo = () => {
      const status = ref('active');
      const setStatus = val => (status.value = val);
      return (
        <>
          <QRCode value="test" status={status.value} />
          <button type="button" onClick={() => setStatus('loading')}>
            set loading
          </button>
        </>
      );
    };
    const wrapper = mount({
      render() {
        return <Demo />;
      },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.ant-spin-spinning')).toBeTruthy();
  });

  it('support bordered', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" bordered={false} />;
      },
    });
    expect(wrapper.vm.$el.__vnode.el.className).toContain('-borderless');
  });

  it('should console Error when icon exist && errorLevel is `L`', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <QRCode value="test" icon="test" errorLevel="L" />;
      },
    });
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: QRCode] ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    );
    errSpy.mockRestore();
  });

  it('statusRender prop does not leak to DOM and receives { status, locale, onRefresh }', async () => {
    const onRefresh = jest.fn();
    const statusRender = jest.fn(({ status, locale, onRefresh: refresh }) => (
      <div class="custom-status">
        <span>{`${status}-${locale.expired}`}</span>
        <button type="button" class="custom-refresh-btn" onClick={refresh}>
          {locale.refresh}
        </button>
      </div>
    ));
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        status: 'expired',
        onRefresh,
        statusRender,
      },
    });
    expect(wrapper.element.hasAttribute('statusrender')).toBe(false);
    expect(wrapper.element.hasAttribute('status-render')).toBe(false);
    expect(statusRender).toHaveBeenCalledTimes(1);
    const arg = statusRender.mock.calls[0][0];
    expect(arg.status).toBe('expired');
    expect(arg.locale).toBeTruthy();
    expect(typeof arg.onRefresh).toBe('function');
    expect(wrapper.find('.custom-status').exists()).toBe(true);
    await wrapper.find('.custom-refresh-btn').trigger('click');
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('statusRender slot receives { status, locale, onRefresh }', async () => {
    const onRefresh = jest.fn();
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        status: 'loading',
        onRefresh,
      },
      slots: {
        statusRender: ({ status, locale, onRefresh: refresh }) => (
          <div class="slot-status" onClick={refresh}>
            {`${status}:${Boolean(locale)}`}
          </div>
        ),
      },
    });
    const el = wrapper.find('.slot-status');
    expect(el.exists()).toBe(true);
    expect(el.text()).toBe('loading:true');
    await el.trigger('click');
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('ConfigProvider.qrcode wires className and style', () => {
    const CustomProvider = defineComponent({
      setup(_, { slots }) {
        useConfigContextProvider({
          ...defaultConfigProvider,
          qrcode: computed(() => ({
            className: 'cp-qrcode',
            style: { marginTop: '12px' },
          })),
        });
        return () => slots.default?.();
      },
    });
    const wrapper = mount({
      render() {
        return (
          <CustomProvider>
            <QRCode value="test" />
          </CustomProvider>
        );
      },
    });
    const root = wrapper.find('.ant-qrcode');
    expect(root.classes()).toContain('cp-qrcode');
    expect(root.element.style.marginTop).toBe('12px');
  });
});
