import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Button from '../../button';
import Flex from '../../flex';
import Input from '../../input';
import Select from '../../select';
import Space from '../../space';
import Segmented from '../index';
import ControlledDemo from '../demo/controlled.vue';
import WithIconDemo from '../demo/with-icon.vue';
import IconOnlyDemo from '../demo/icon-only.vue';
import WithNameDemo from '../demo/with-name.vue';
import ControlledTwoDemo from '../demo/controlled-two.vue';
import SizeConsistentDemo from '../demo/size-consistent.vue';

const demoPlugins = [Button, Flex, Input, Segmented, Select, Space];

describe('Segmented', () => {
  it('supports uncontrolled mode with default first item and defaultValue', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Segmented, {
      props: {
        options: ['Daily', 'Weekly', 'Monthly'],
        onChange,
      },
    });
    const items = wrapper.findAll('.ant-segmented-item');
    expect(items).toHaveLength(3);
    expect(items[0].classes()).toContain('ant-segmented-item-selected');

    await wrapper.findAll('input[type="radio"]')[1].trigger('change');
    expect(onChange).toHaveBeenCalledWith('Weekly');
    expect(wrapper.findAll('.ant-segmented-item')[1].classes()).toContain(
      'ant-segmented-item-selected',
    );

    const wrapperWithDefault = mount(Segmented, {
      props: {
        options: ['Daily', 'Weekly', 'Monthly'],
        defaultValue: 'Monthly',
      },
    });
    expect(wrapperWithDefault.findAll('.ant-segmented-item')[2].classes()).toContain(
      'ant-segmented-item-selected',
    );
  });

  it('passes name prop to all radio inputs and falls back to unique name per instance', () => {
    const wrapper = mount(Segmented, {
      props: {
        options: ['Daily', 'Weekly', 'Monthly'],
        name: 'group',
      },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs).toHaveLength(3);
    inputs.forEach(input => {
      expect(input.attributes('name')).toBe('group');
    });

    const pairWrapper = mount({
      render() {
        return (
          <div>
            <Segmented options={['A', 'B']} />
            <Segmented options={['A', 'B']} />
          </div>
        );
      },
    });
    const groups = pairWrapper.findAll('.ant-segmented');
    const firstNames = groups[0].findAll('input[type="radio"]').map(i => i.attributes('name'));
    const secondNames = groups[1].findAll('input[type="radio"]').map(i => i.attributes('name'));
    expect(firstNames[0]).toBeTruthy();
    expect(firstNames[0]).toBe(firstNames[1]);
    expect(secondNames[0]).toBe(secondNames[1]);
    expect(firstNames[0]).not.toBe(secondNames[0]);
  });

  it('supports size large, middle, medium, small and icon options', () => {
    const lg = mount(Segmented, { props: { options: ['A', 'B'], size: 'large' } });
    expect(lg.classes()).toContain('ant-segmented-lg');

    const md = mount(Segmented, { props: { options: ['A', 'B'], size: 'medium' } });
    expect(md.classes()).not.toContain('ant-segmented-lg');
    expect(md.classes()).not.toContain('ant-segmented-sm');

    const sm = mount(Segmented, { props: { options: ['A', 'B'], size: 'small' } });
    expect(sm.classes()).toContain('ant-segmented-sm');

    const withIcon = mount(Segmented, {
      props: {
        options: [
          { value: 'iconOnly', icon: h('svg', { class: 'bare-svg' }) },
          { value: 'withLabel', label: 'Label', icon: h('span', { class: 'ic' }) },
        ],
      },
    });
    expect(withIcon.find('.ant-segmented-item-icon svg.bare-svg').exists()).toBe(true);
    expect(withIcon.findAll('.ant-segmented-item-icon')).toHaveLength(2);
  });

  it('mounts all new segmented demos cleanly and syncs controlled-two', async () => {
    const demos = [
      ControlledDemo,
      WithIconDemo,
      IconOnlyDemo,
      WithNameDemo,
      ControlledTwoDemo,
      SizeConsistentDemo,
    ];
    demos.forEach(Demo => {
      const wrapper = mount(Demo, { global: { plugins: demoPlugins } });
      expect(wrapper.find('.ant-segmented').exists()).toBe(true);
      wrapper.unmount();
    });

    const synced = mount(ControlledTwoDemo, { global: { plugins: demoPlugins } });
    const allSegs = synced.findAll('.ant-segmented');
    expect(allSegs).toHaveLength(2);
    await allSegs[0].findAll('input[type="radio"]')[1].trigger('change');
    await nextTick();
    expect(allSegs[0].findAll('.ant-segmented-item')[1].classes()).toContain(
      'ant-segmented-item-selected',
    );
    expect(allSegs[1].findAll('.ant-segmented-item')[1].classes()).toContain(
      'ant-segmented-item-selected',
    );
    synced.unmount();
  });
});
