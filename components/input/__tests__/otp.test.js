import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Input from '..';
import ConfigProvider from '../../config-provider';

const { OTP } = Input;

describe('Input.OTP', () => {
  it('渲染 length 个输入框', () => {
    const wrapper = mount(OTP, { props: { length: 4 } });
    expect(wrapper.findAll('.ant-otp-input').length).toBe(4);
  });

  it('mask=true 用 password 类型', () => {
    const wrapper = mount(OTP, { props: { length: 3, mask: true } });
    expect(wrapper.find('input').attributes('type')).toBe('password');
  });

  it('separator 渲染分隔符', () => {
    const wrapper = mount(OTP, { props: { length: 3, separator: '-' } });
    expect(wrapper.html()).toContain('ant-otp-separator');
  });

  it('输入触发 onChange（填满时）', async () => {
    const onChange = jest.fn();
    const wrapper = mount(OTP, { props: { length: 2, onChange } });
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('1');
    await inputs[1].setValue('2');
    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('value 受控回显', () => {
    const wrapper = mount(OTP, { props: { length: 3, value: 'abc' } });
    const inputs = wrapper.findAll('input');
    expect(inputs[0].element.value).toBe('a');
    expect(inputs[2].element.value).toBe('c');
  });

  it('v-model:value 无 onChange 时依然触发 update:value，省略 separator 不渲染空节点，支持 rootClassName 与 type', async () => {
    const onUpdateValue = jest.fn();
    const wrapper = mount(OTP, {
      props: {
        length: 2,
        rootClassName: 'my-otp',
        type: 'tel',
        'onUpdate:value': onUpdateValue,
      },
    });
    expect(wrapper.classes()).toContain('my-otp');
    expect(wrapper.findAll('.ant-otp-separator').length).toBe(0);
    expect(wrapper.find('input').attributes('type')).toBe('tel');
    expect(wrapper.vm.nativeElement).toBe(wrapper.element);
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('9');
    expect(onUpdateValue).toHaveBeenCalledWith('9');
  });

  it('mask 响应式更新', async () => {
    const wrapper = mount(OTP, { props: { length: 2, value: '12', mask: '*' } });
    expect(wrapper.find('.ant-otp-mask-icon').text()).toBe('*');
    await wrapper.setProps({ mask: '#' });
    expect(wrapper.find('.ant-otp-mask-icon').text()).toBe('#');
  });

  it('wires ConfigProvider.otp and generates separator CSS', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        otp: {
          className: 'cp-otp',
          style: { gap: '12px' },
        },
      },
      slots: { default: () => <OTP length={3} separator="-" /> },
    });
    await nextTick();
    expect(wrapper.find('.ant-otp').classes()).toContain('cp-otp');
    expect(wrapper.find('.ant-otp').attributes('style')).toContain('gap: 12px');
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-otp-separator');
  });
});
