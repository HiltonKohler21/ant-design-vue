import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import QRCode from '..';
import Flex from '../../flex';
import ConfigProvider from '../../config-provider';
import StyleClassDemo from '../demo/style-class.vue';

describe('QRCode.Semantic & v6 features', () => {
  it('supports static object classNames and styles for root and cover', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'https://www.antdv.com',
        status: 'loading',
        classNames: {
          root: 'custom-root',
          cover: 'custom-cover',
        },
        styles: {
          root: { borderRadius: '12px', backgroundColor: 'rgb(10, 20, 30)' },
          cover: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    });

    const root = wrapper.find('.ant-qrcode');
    const cover = wrapper.find('.ant-qrcode-mask');

    expect(root.classes()).toContain('custom-root');
    expect(root.attributes('style')).toContain('border-radius: 12px');
    expect(root.attributes('style')).toContain('background-color: rgb(10, 20, 30)');

    expect(cover.classes()).toContain('custom-cover');
    expect(cover.attributes('style')).toContain('background-color: rgba(0, 0, 0, 0.5)');

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.qrcode', async () => {
    const classNamesFn = info => ({
      root: info.props.type === 'svg' ? 'qr-svg' : 'qr-canvas',
      cover: `qr-status-${info.props.status}`,
    });
    const stylesFn = info => ({
      root: { padding: info.props.type === 'svg' ? '20px' : '16px' },
      cover: { opacity: info.props.status === 'expired' ? '0.8' : '0.9' },
    });

    const wrapper = mount({
      props: {
        type: { type: String, default: 'canvas' },
        status: { type: String, default: 'loading' },
      },
      render() {
        return (
          <ConfigProvider
            qrcode={{
              className: 'ctx-cls',
              style: { marginTop: '8px' },
              classNames: { root: 'ctx-root', cover: 'ctx-cover' },
              styles: {
                root: { borderWidth: '2px' },
                cover: { zIndex: 20 },
              },
            }}
          >
            <QRCode
              value="https://www.antdv.com"
              type={this.type}
              status={this.status}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-qrcode');
    const cover = wrapper.find('.ant-qrcode-mask');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('qr-canvas');
    expect(root.attributes('style')).toContain('margin-top: 8px');
    expect(root.attributes('style')).toContain('border-width: 2px');
    expect(root.attributes('style')).toContain('padding: 16px');

    expect(cover.classes()).toContain('ctx-cover');
    expect(cover.classes()).toContain('qr-status-loading');
    expect(cover.attributes('style')).toContain('z-index: 20');
    expect(cover.attributes('style')).toContain('opacity: 0.9');

    await wrapper.setProps({ type: 'svg', status: 'expired' });
    await nextTick();

    expect(wrapper.find('.ant-qrcode').classes()).toContain('qr-svg');
    expect(wrapper.find('.ant-qrcode').attributes('style')).toContain('padding: 20px');
    expect(wrapper.find('.ant-qrcode-mask').classes()).toContain('qr-status-expired');
    expect(wrapper.find('.ant-qrcode-mask').attributes('style')).toContain('opacity: 0.8');

    wrapper.unmount();
  });

  it('supports object iconSize, marginSize, and string[] value', () => {
    const wrapper = mount(QRCode, {
      props: {
        value: ['https://www.antdv.com', 'segment-2'],
        type: 'svg',
        icon: 'https://www.antdv.com/assets/logo.1ef800a8.svg',
        iconSize: { width: 32, height: 24 },
        marginSize: 2,
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('image').exists()).toBe(true);
    wrapper.unmount();
  });

  it('mounts new style-class demo cleanly', () => {
    const wrapper = mount(StyleClassDemo, { global: { plugins: [QRCode, Flex] } });
    expect(wrapper.findAll('.demo-qrcode-semantic-root')).toHaveLength(2);
    wrapper.unmount();
  });
});
