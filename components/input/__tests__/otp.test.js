import { mount } from '@vue/test-utils';
import Input from '..';

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
});
