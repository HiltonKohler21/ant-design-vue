import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Radio from '..';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

describe('Radio.Group block & vertical / orientation', () => {
  it('does not add block or vertical classes by default', () => {
    const wrapper = mount(Radio.Group, {
      props: { options },
    });
    expect(wrapper.classes()).not.toContain('ant-radio-group-block');
    expect(wrapper.classes()).not.toContain('ant-radio-group-vertical');
    wrapper.findAll('.ant-radio-wrapper').forEach(node => {
      expect(node.classes()).not.toContain('ant-radio-wrapper-block');
    });
  });

  it('applies block classes to Radio.Group and Radio wrappers (options & slot)', async () => {
    const wrapper = mount(Radio.Group, {
      props: { block: true, options },
    });
    expect(wrapper.classes()).toContain('ant-radio-group-block');
    const wrappers = wrapper.findAll('.ant-radio-wrapper');
    expect(wrappers.length).toBe(3);
    wrappers.forEach(node => {
      expect(node.classes()).toContain('ant-radio-wrapper-block');
    });

    await wrapper.setProps({ block: false });
    await nextTick();
    expect(wrapper.classes()).not.toContain('ant-radio-group-block');
    wrapper.findAll('.ant-radio-wrapper').forEach(node => {
      expect(node.classes()).not.toContain('ant-radio-wrapper-block');
    });
  });

  it('applies block classes to Radio.Button wrappers (optionType="button" & slot Radio.Button)', () => {
    const wrapperOptions = mount(Radio.Group, {
      props: { block: true, optionType: 'button', options },
    });
    expect(wrapperOptions.classes()).toContain('ant-radio-group-block');
    const optionButtons = wrapperOptions.findAll('.ant-radio-button-wrapper');
    expect(optionButtons.length).toBe(3);
    optionButtons.forEach(node => {
      expect(node.classes()).toContain('ant-radio-button-wrapper-block');
    });

    const wrapperSlot = mount(Radio.Group, {
      props: { block: true },
      slots: {
        default: () => [
          <Radio.Button value="a">A</Radio.Button>,
          <Radio.Button value="b">B</Radio.Button>,
        ],
      },
    });
    expect(wrapperSlot.classes()).toContain('ant-radio-group-block');
    const slotButtons = wrapperSlot.findAll('.ant-radio-button-wrapper');
    expect(slotButtons.length).toBe(2);
    slotButtons.forEach(node => {
      expect(node.classes()).toContain('ant-radio-button-wrapper-block');
    });
  });

  it('supports vertical prop', async () => {
    const wrapper = mount(Radio.Group, {
      props: { vertical: true, options },
    });
    expect(wrapper.classes()).toContain('ant-radio-group-vertical');

    await wrapper.setProps({ vertical: false });
    await nextTick();
    expect(wrapper.classes()).not.toContain('ant-radio-group-vertical');
  });

  it('supports orientation="vertical" and orientation="horizontal" overriding vertical', async () => {
    const wrapper = mount(Radio.Group, {
      props: { orientation: 'vertical', options },
    });
    expect(wrapper.classes()).toContain('ant-radio-group-vertical');

    await wrapper.setProps({ orientation: 'horizontal', vertical: true });
    await nextTick();
    expect(wrapper.classes()).not.toContain('ant-radio-group-vertical');

    await wrapper.setProps({ orientation: undefined, vertical: true });
    await nextTick();
    expect(wrapper.classes()).toContain('ant-radio-group-vertical');
  });
});
