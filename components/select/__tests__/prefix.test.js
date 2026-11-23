import { mount } from '@vue/test-utils';
import Select from '..';
import Cascader from '../../cascader';
import InputNumber from '../../input-number';
import { resetWarned } from '../../_util/warning';

describe('Select prefix & bordered warnings', () => {
  it('prefix 渲染在选择器内且不泄漏到 DOM 属性上', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(Select, {
      props: { prefix: <span class="sel-prefix">P</span> },
      slots: { default: () => [<Select.Option value="a">A</Select.Option>] },
    });
    expect(wrapper.html()).toContain('sel-prefix');
    expect(wrapper.element.getAttribute('prefix')).toBeNull();
    const prefixWarnings = warnSpy.mock.calls.filter(args =>
      String(args[0]).includes('Failed setting prop "prefix"'),
    );
    expect(prefixWarnings.length).toBe(0);
    warnSpy.mockRestore();
  });

  it('Select / Cascader / InputNumber 默认不触发 bordered 废弃警告', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Select, { props: { options: [{ value: 'a', label: 'A' }] } });
    mount(Cascader, { props: { options: [{ value: 'a', label: 'A' }] } });
    mount(InputNumber);
    const borderedWarnings = [...errorSpy.mock.calls, ...warnSpy.mock.calls].filter(args =>
      String(args[0]).includes('bordered'),
    );
    expect(borderedWarnings.length).toBe(0);
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
