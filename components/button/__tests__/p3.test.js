import { mount } from '@vue/test-utils';
import Button from '../../button';
import Spin from '../../spin';
import QRCode from '../../qrcode';

describe('upstream P3: 零散属性第二批', () => {
  it('Button iconPosition=end', () => {
    const wrapper = mount(Button, {
      props: { iconPosition: 'end' },
      slots: { default: () => 'ok', icon: () => <span>i</span> },
    });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-icon-end');
  });

  it('Button iconPosition 默认 start 不输出 class', () => {
    const wrapper = mount(Button);
    expect(wrapper.element.getAttribute('class')).not.toContain('ant-btn-icon-end');
  });

  it('Spin percent 渲染环形进度', () => {
    const wrapper = mount(Spin, { props: { percent: 60, spinning: true } });
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true);
  });

  it('Spin fullscreen 渲染全屏遮罩', () => {
    const wrapper = mount(Spin, { props: { fullscreen: true, spinning: true } });
    expect(wrapper.find('.ant-spin-fullscreen').exists()).toBe(true);
    expect(wrapper.element.getAttribute('class')).toContain('ant-spin-fullscreen-show');
  });

  it('QRCode onRefresh 触发回调', () => {
    const onRefresh = jest.fn();
    const wrapper = mount(QRCode, {
      props: { value: 'https://x', status: 'expired', onRefresh },
    });
    wrapper.find('.ant-qrcode-expired + button, button').trigger('click');
    expect(onRefresh).toHaveBeenCalled();
  });

  it('QRCode statusRender 插槽优先', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'https://x', status: 'loading' },
      slots: { statusRender: () => <div class="custom-status">custom</div> },
    });
    expect(wrapper.find('.custom-status').exists()).toBe(true);
  });
});
