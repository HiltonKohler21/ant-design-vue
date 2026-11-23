import { mount } from '@vue/test-utils';
import { computed, defineComponent, nextTick } from 'vue';
import Form from '..';
import useVariant from '../hooks/useVariant';
import ConfigProvider from '../../config-provider';
import Input from '../../input';
import InputNumber from '../../input-number';
import Select from '../../select';
import Cascader from '../../cascader';
import TreeSelect from '../../tree-select';
import DatePicker from '../../date-picker';
import TimePicker from '../../time-picker';
import Mentions from '../../mentions';
import AutoComplete from '../../auto-complete';
import Tag from '../../tag';
import Alert from '../../alert';
import Card from '../../card';

const { RangePicker } = DatePicker;

describe('Form variant', () => {
  it.each(['filled', 'borderless', 'underlined'])(
    'Form variant="%s" propagates to standard form control components',
    variant => {
      const wrapper = mount(Form, {
        props: { variant },
        slots: {
          default: () => (
            <div>
              <Input />
              <Input.TextArea />
              <InputNumber />
              <Select options={[{ value: 'a', label: 'A' }]} />
              <Cascader options={[{ value: 'a', label: 'A' }]} />
              <TreeSelect treeData={[{ value: 'a', title: 'A' }]} />
              <DatePicker />
              <RangePicker />
              <TimePicker />
              <Mentions options={[{ value: 'a', label: 'A' }]} />
              <AutoComplete options={[{ value: 'a' }]} />
            </div>
          ),
        },
      });

      expect(wrapper.find(`.ant-input-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`textarea.ant-input-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`.ant-input-number-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`.ant-select-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`.ant-cascader.ant-select-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`.ant-tree-select.ant-select-${variant}`).exists()).toBe(true);
      expect(wrapper.find(`.ant-select-auto-complete.ant-select-${variant}`).exists()).toBe(true);
      expect(wrapper.findAll(`.ant-picker-${variant}`).length).toBe(3);
      expect(wrapper.find(`.ant-mentions-${variant}`).exists()).toBe(true);
    },
  );

  it('Form variant="outlined" overrides global ConfigProvider variant="filled"', () => {
    const wrapper = mount(ConfigProvider, {
      props: { variant: 'filled' },
      slots: {
        default: () => (
          <Form variant="outlined">
            <Input />
            <Input.TextArea />
            <InputNumber />
            <Select options={[{ value: 'a', label: 'A' }]} />
            <Cascader options={[{ value: 'a', label: 'A' }]} />
            <TreeSelect treeData={[{ value: 'a', title: 'A' }]} />
            <DatePicker />
            <RangePicker />
            <TimePicker />
            <Mentions options={[{ value: 'a', label: 'A' }]} />
            <AutoComplete options={[{ value: 'a' }]} />
          </Form>
        ),
      },
    });

    expect(wrapper.find('.ant-input-filled').exists()).toBe(false);
    expect(wrapper.find('.ant-input-number-filled').exists()).toBe(false);
    expect(wrapper.find('.ant-select-filled').exists()).toBe(false);
    expect(wrapper.find('.ant-picker-filled').exists()).toBe(false);
    expect(wrapper.find('.ant-mentions-filled').exists()).toBe(false);
  });

  it('reactively updates child variants when Form variant changes', async () => {
    const wrapper = mount(Form, {
      props: { variant: 'filled' },
      slots: {
        default: () => (
          <div>
            <Input />
            <Select />
            <DatePicker />
          </div>
        ),
      },
    });

    expect(wrapper.find('.ant-input-filled').exists()).toBe(true);
    expect(wrapper.find('.ant-select-filled').exists()).toBe(true);
    expect(wrapper.find('.ant-picker-filled').exists()).toBe(true);

    await wrapper.setProps({ variant: 'underlined' });
    await nextTick();

    expect(wrapper.find('.ant-input-underlined').exists()).toBe(true);
    expect(wrapper.find('.ant-select-underlined').exists()).toBe(true);
    expect(wrapper.find('.ant-picker-underlined').exists()).toBe(true);
  });

  it('child explicit variant and bordered={false} override Form variant', () => {
    const wrapper = mount(Form, {
      props: { variant: 'filled' },
      slots: {
        default: () => (
          <div>
            <Input class="inherited-input" />
            <Input class="override-input" variant="underlined" />
            <Input class="bordered-false-input" bordered={false} />
            <Select class="override-select" variant="outlined" />
            <Select class="bordered-false-select" bordered={false} />
            <InputNumber class="override-number" variant="borderless" />
          </div>
        ),
      },
    });

    expect(wrapper.find('.inherited-input').classes()).toContain('ant-input-filled');
    expect(wrapper.find('.override-input').classes()).toContain('ant-input-underlined');
    expect(wrapper.find('.override-input').classes()).not.toContain('ant-input-filled');
    expect(wrapper.find('.bordered-false-input').classes()).toContain('ant-input-borderless');
    expect(wrapper.find('.override-select').classes()).not.toContain('ant-select-filled');
    expect(wrapper.find('.override-select').classes()).not.toContain('ant-select-borderless');
    expect(wrapper.find('.override-select').classes()).not.toContain('ant-select-underlined');
    expect(wrapper.find('.bordered-false-select').classes()).toContain('ant-select-borderless');
    expect(wrapper.find('.override-number').classes()).toContain('ant-input-number-borderless');
  });

  it('respects ConfigProvider form.variant fallback and Form variant priority over ConfigProvider', () => {
    const wrapperFallback = mount(ConfigProvider, {
      props: {
        variant: 'underlined',
        form: { variant: 'filled' },
        input: { variant: 'borderless' },
      },
      slots: {
        default: () => (
          <Form>
            <Input />
          </Form>
        ),
      },
    });
    // Form context (from ConfigProvider.form.variant) has higher priority than component/global ConfigProvider
    expect(wrapperFallback.find('.ant-input-filled').exists()).toBe(true);

    const wrapperExplicit = mount(ConfigProvider, {
      props: {
        form: { variant: 'filled' },
        input: { variant: 'underlined' },
      },
      slots: {
        default: () => (
          <Form variant="borderless">
            <Input />
          </Form>
        ),
      },
    });
    expect(wrapperExplicit.find('.ant-input-borderless').exists()).toBe(true);
  });

  it('does not affect non-form components (Tag, Alert, Card, Divider, Steps, Timeline)', () => {
    const Probe = defineComponent({
      props: {
        component: { type: String, required: true },
      },
      setup(props) {
        const [mergedVariant] = useVariant(
          props.component,
          computed(() => undefined),
        );
        return () => <span class={`probe-${props.component}`}>{mergedVariant.value}</span>;
      },
    });

    const wrapper = mount(Form, {
      props: { variant: 'borderless' },
      slots: {
        default: () => (
          <div>
            <Tag>tag</Tag>
            <Alert title="alert" />
            <Card title="card">body</Card>
            <Probe component="tag" />
            <Probe component="alert" />
            <Probe component="card" />
            <Probe component="divider" />
            <Probe component="steps" />
            <Probe component="timeline" />
          </div>
        ),
      },
    });

    // Card remains bordered (outlined) rather than turning borderless from Form
    expect(wrapper.find('.ant-card').classes()).toContain('ant-card-bordered');
    // Tag & Alert do not pick up borderless
    expect(wrapper.find('.ant-tag').classes()).not.toContain('ant-tag-borderless');
    expect(wrapper.find('.ant-alert').classes()).not.toContain('ant-alert-borderless');
    // Direct useVariant checks for all COMPONENT_OWN_VARIANTS components
    expect(wrapper.find('.probe-tag').text()).toBe('filled');
    expect(wrapper.find('.probe-alert').text()).toBe('outlined');
    expect(wrapper.find('.probe-card').text()).toBe('outlined');
    expect(wrapper.find('.probe-divider').text()).toBe('solid');
    expect(wrapper.find('.probe-steps').text()).toBe('filled');
    expect(wrapper.find('.probe-timeline').text()).toBe('filled');
  });
});
