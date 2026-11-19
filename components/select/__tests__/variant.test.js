import { mount } from '@vue/test-utils';
import Select from '..';
import Cascader from '../../cascader';
import TreeSelect from '../../tree-select';
import Mentions from '../../mentions';
import InputNumber from '../../input-number';
import ConfigProvider from '../../config-provider';

const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream variant: select family', () => {
  it('Select supports variant classes (outlined is the default, no class emitted)', () => {
    for (const variant of ['borderless', 'filled', 'underlined']) {
      const wrapper = mount(Select, { props: { variant } });
      expect(cls(wrapper)).toContain(`ant-select-${variant}`);
    }
    expect(cls(mount(Select))).not.toMatch(/ant-select-(outlined|filled|underlined)/);
  });

  it('Select keeps legacy bordered={false}', () => {
    const wrapper = mount(Select, { props: { bordered: false } });
    expect(cls(wrapper)).toContain('ant-select-borderless');
  });

  it('Select prefers variant over bordered', () => {
    const wrapper = mount(Select, { props: { bordered: false, variant: 'filled' } });
    expect(cls(wrapper)).toContain('ant-select-filled');
    expect(cls(wrapper)).not.toContain('ant-select-borderless');
  });

  it('Cascader inherits Select variant classes', () => {
    const wrapper = mount(Cascader, { props: { variant: 'filled' } });
    expect(cls(wrapper)).toContain('ant-select-filled');
  });

  it('TreeSelect inherits Select variant classes', () => {
    const wrapper = mount(TreeSelect, { props: { variant: 'filled' } });
    expect(cls(wrapper)).toContain('ant-select-filled');
  });

  it('Mentions supports variant', () => {
    const wrapper = mount(Mentions, { props: { variant: 'filled' } });
    expect(cls(wrapper)).toContain('ant-mentions-filled');
  });

  it('InputNumber supports variant', () => {
    const wrapper = mount(InputNumber, { props: { variant: 'filled' } });
    expect(cls(wrapper)).toContain('ant-input-number-filled');
  });

  it('reads global variant from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { variant: 'underlined' },
      slots: { default: () => <Select /> },
    });
    expect(cls(wrapper.find('.ant-select'))).toContain('ant-select-underlined');
  });
});
