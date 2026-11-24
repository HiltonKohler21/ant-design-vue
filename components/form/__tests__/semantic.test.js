import { mount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import Form from '..';
import ConfigProvider from '../../config-provider';
import Input from '../../input';

const wait = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

const wrappers = [];
const mountAttached = (comp, options = {}) => {
  const w = mount(comp, { attachTo: document.body, ...options });
  wrappers.push(w);
  return w;
};

describe('Form v6 semantic classNames / styles & feature parity', () => {
  let originGetComputedStyle;

  beforeAll(() => {
    originGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (...args) => {
      try {
        return originGetComputedStyle(...args);
      } catch {
        return { getPropertyValue: () => '', marginBottom: '0px' };
      }
    };
  });

  afterAll(() => {
    window.getComputedStyle = originGetComputedStyle;
  });

  afterEach(() => {
    while (wrappers.length) {
      wrappers.pop().unmount();
    }
    document.body.innerHTML = '';
  });

  it('applies object classNames and styles across all 6 semantic slots', async () => {
    const wrapper = mountAttached(Form, {
      props: {
        classNames: {
          root: 'f-root',
          label: 'f-label',
          content: 'f-content',
          help: 'f-help',
          helpItem: 'f-help-item',
          extra: 'f-extra',
        },
        styles: {
          root: { padding: '12px' },
          label: { color: 'rgb(1, 2, 3)' },
          content: { paddingLeft: '8px' },
          help: { marginTop: '4px' },
          helpItem: { fontWeight: '600' },
          extra: { fontStyle: 'italic' },
        },
      },
      slots: {
        default: () => (
          <Form.Item
            label="Username"
            help="Use 4-16 chars"
            extra="Extra hint"
            validateStatus="error"
          >
            <Input />
          </Form.Item>
        ),
      },
    });

    await wait();

    const rootEl = wrapper.find('form');
    expect(rootEl.classes()).toContain('f-root');
    expect(rootEl.element.style.padding).toBe('12px');

    const labelEl = wrapper.find('.ant-form-item-label > label');
    expect(labelEl.classes()).toContain('f-label');
    expect(labelEl.element.style.color).toBe('rgb(1, 2, 3)');

    const contentEl = wrapper.find('.ant-form-item-control-input-content');
    expect(contentEl.classes()).toContain('f-content');
    expect(contentEl.element.style.paddingLeft).toBe('8px');

    const helpEl = wrapper.find('.ant-form-item-explain');
    expect(helpEl.classes()).toContain('f-help');
    expect(helpEl.element.style.marginTop).toBe('4px');

    const helpItemEl = wrapper.find('.f-help-item');
    expect(helpItemEl.exists()).toBe(true);
    expect(helpItemEl.element.style.fontWeight).toBe('600');

    const extraEl = wrapper.find('.ant-form-item-extra');
    expect(extraEl.classes()).toContain('f-extra');
    expect(extraEl.element.style.fontStyle).toBe('italic');
  });

  it('supports functional classNames & styles and merges with ConfigProvider.form', async () => {
    const wrapper = mountAttached({
      render() {
        return (
          <ConfigProvider
            form={{
              className: 'ctx-form-cls',
              style: { margin: '6px' },
              classNames: ({ props }) => ({
                root: `ctx-root-${props.variant}`,
                label: 'ctx-label',
                content: 'ctx-content',
                extra: 'ctx-extra',
              }),
              styles: () => ({
                root: { backgroundColor: 'rgb(10, 20, 30)' },
                label: { fontSize: '15px' },
              }),
            }}
          >
            <Form
              variant="filled"
              layout="vertical"
              classNames={({ props }) => ({
                root: `own-root-${props.layout}`,
                label: `own-label-${props.variant}`,
                content: 'own-content',
                help: 'own-help',
                helpItem: 'own-help-item',
                extra: 'own-extra',
              })}
              styles={({ props }) => ({
                root: { borderWidth: props.variant === 'filled' ? '2px' : '1px' },
                label: { color: 'rgb(22, 119, 255)' },
                content: { paddingLeft: '10px' },
                help: { letterSpacing: '1px' },
                helpItem: { fontStyle: 'italic' },
                extra: { opacity: '0.8' },
              })}
            >
              <Form.Item label="Field" help="Help text" extra="Extra text">
                <Input />
              </Form.Item>
            </Form>
          </ConfigProvider>
        );
      },
    });

    await wait();

    const formEl = wrapper.find('form');
    expect(formEl.classes()).toContain('ctx-form-cls');
    expect(formEl.classes()).toContain('ctx-root-filled');
    expect(formEl.classes()).toContain('own-root-vertical');
    expect(formEl.element.style.margin).toBe('6px');
    expect(formEl.element.style.backgroundColor).toBe('rgb(10, 20, 30)');
    expect(formEl.element.style.borderWidth).toBe('2px');

    const labelEl = wrapper.find('.ant-form-item-label > label');
    expect(labelEl.classes()).toContain('ctx-label');
    expect(labelEl.classes()).toContain('own-label-filled');
    expect(labelEl.element.style.fontSize).toBe('15px');
    expect(labelEl.element.style.color).toBe('rgb(22, 119, 255)');

    const contentEl = wrapper.find('.ant-form-item-control-input-content');
    expect(contentEl.classes()).toContain('ctx-content');
    expect(contentEl.classes()).toContain('own-content');
    expect(contentEl.element.style.paddingLeft).toBe('10px');

    const helpEl = wrapper.find('.ant-form-item-explain');
    expect(helpEl.classes()).toContain('own-help');
    expect(helpEl.element.style.letterSpacing).toBe('1px');

    const helpItemEl = wrapper.find('.own-help-item');
    expect(helpItemEl.exists()).toBe(true);
    expect(helpItemEl.element.style.fontStyle).toBe('italic');

    const extraEl = wrapper.find('.ant-form-item-extra');
    expect(extraEl.classes()).toContain('ctx-extra');
    expect(extraEl.classes()).toContain('own-extra');
    expect(extraEl.element.style.opacity).toBe('0.8');
  });

  it('supports Form.Item independent layout, labelAlign="start", label=null offset, and customize requiredMark', async () => {
    const wrapper = mountAttached(Form, {
      props: {
        layout: 'horizontal',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        labelAlign: 'start',
        requiredMark: (label, { required }) => (
          <span class={required ? 'mark-req' : 'mark-opt'}>{label}</span>
        ),
      },
      slots: {
        default: () => (
          <>
            <Form.Item label="Horizontal" required>
              <Input />
            </Form.Item>
            <Form.Item label="VerticalOverride" layout="vertical">
              <Input />
            </Form.Item>
            <Form.Item label={null}>
              <button type="submit">Submit</button>
            </Form.Item>
          </>
        ),
      },
    });

    await nextTick();
    const items = wrapper.findAll('.ant-form-item');
    expect(items[0].classes()).toContain('ant-form-item-horizontal');
    expect(items[1].classes()).toContain('ant-form-item-vertical');
    expect(wrapper.find('.ant-form-item-label-start').exists()).toBe(true);
    expect(wrapper.find('.mark-req').exists()).toBe(true);
    expect(wrapper.find('.mark-opt').exists()).toBe(true);
    // label={null} auto-applies offset matching form labelCol.span=6
    expect(items[2].find('.ant-col-offset-6').exists()).toBe(true);
  });

  it('supports validateFields({ validateOnly: true }) silently without showing UI errors', async () => {
    const model = reactive({ name: '' });
    const wrapper = mountAttached(Form, {
      props: { model },
      slots: {
        default: () => (
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name required' }]}
          >
            <Input value={model.name} />
          </Form.Item>
        ),
      },
    });

    await expect(wrapper.vm.validateFields({ validateOnly: true })).rejects.toMatchObject({
      errorFields: [{ name: ['name'], errors: ['Name required'] }],
    });
    await wait(120);
    // No UI error rendered in validateOnly mode
    expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    expect(wrapper.html()).not.toContain('Name required');

    model.name = 'Alice';
    await nextTick();
    await expect(wrapper.vm.validateFields({ validateOnly: true })).resolves.toEqual({
      name: 'Alice',
    });
  });

  it('renders warning message for warningOnly rule without blocking submit', async () => {
    const model = reactive({ url: 'not-a-url' });
    const wrapper = mountAttached(Form, {
      props: { model },
      slots: {
        default: () => (
          <Form.Item
            name="url"
            label="URL"
            rules={[
              { required: true },
              { type: 'url', warningOnly: true, message: 'Should be valid url' },
            ]}
          >
            <Input value={model.url} />
          </Form.Item>
        ),
      },
    });

    const values = await wrapper.vm.validateFields();
    expect(values).toEqual({ url: 'not-a-url' });
    await wait(150);
    expect(wrapper.find('.ant-form-item-has-warning').exists()).toBe(true);
    expect(wrapper.find('.ant-form-item-explain-warning').exists()).toBe(true);
    expect(wrapper.html()).toContain('Should be valid url');
  });

  it('supports Form.Item hasFeedback={{ icons }} including false to hide icon', async () => {
    const wrapper = mountAttached(Form, {
      slots: {
        default: () => (
          <>
            <Form.Item
              label="CustomErr"
              validateStatus="error"
              hasFeedback={{
                icons: () => ({
                  error: <span class="item-custom-err">!</span>,
                }),
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="HideSuccess"
              validateStatus="success"
              hasFeedback={{
                icons: () => ({
                  success: false,
                }),
              }}
            >
              <Input />
            </Form.Item>
          </>
        ),
      },
    });

    await wait();
    expect(wrapper.find('.item-custom-err').exists()).toBe(true);
    expect(wrapper.find('.ant-form-item-feedback-icon-success').exists()).toBe(false);
  });

  it('supports object tooltip prop with custom icon', async () => {
    const wrapper = mountAttached(Form, {
      slots: {
        default: () => (
          <Form.Item
            label="WithTip"
            tooltip={{
              title: 'Helpful hint',
              icon: <span class="custom-tip-icon">?</span>,
            }}
          >
            <Input />
          </Form.Item>
        ),
      },
    });

    await nextTick();
    expect(wrapper.find('.custom-tip-icon').exists()).toBe(true);
  });
});
