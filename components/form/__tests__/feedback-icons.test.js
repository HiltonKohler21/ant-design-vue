import { mount } from '@vue/test-utils';
import Form from '..';
import Input from '../../input';

describe('Form feedbackIcons', () => {
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

  it('声明 feedbackIcons 并用于校验状态图标，且支持响应式更新与区分 warnings', async () => {
    let lastArgs = null;
    const feedbackIcons = args => {
      lastArgs = args;
      return {
        error: <span class="custom-error-icon">err</span>,
      };
    };
    const wrapper = mount(Form, {
      props: { feedbackIcons },
      slots: {
        default: () => (
          <Form.Item name="x" hasFeedback validateStatus="error">
            <Input />
          </Form.Item>
        ),
      },
    });
    await new Promise(r => setTimeout(r, 50));
    expect(wrapper.html()).toContain('custom-error-icon');
    expect(Array.isArray(lastArgs.warnings)).toBe(true);

    await wrapper.setProps({
      feedbackIcons: () => ({
        error: <span class="updated-error-icon">err2</span>,
      }),
    });
    await new Promise(r => setTimeout(r, 50));
    expect(wrapper.html()).toContain('updated-error-icon');
  });

  it('warningOnly 校验规则下 warnings 与 errors 严格区分并渲染自定义 warning 图标', async () => {
    let lastArgs = null;
    const model = { field: '' };
    const feedbackIcons = args => {
      lastArgs = args;
      return {
        warning: <span class="custom-warning-icon">warn</span>,
        error: <span class="custom-error-icon">err</span>,
      };
    };
    const wrapper = mount(Form, {
      props: {
        model,
        feedbackIcons,
        rules: {
          field: [{ required: true, message: 'just a warning', warningOnly: true }],
        },
      },
      slots: {
        default: () => (
          <Form.Item name="field" hasFeedback>
            <Input value={model.field} />
          </Form.Item>
        ),
      },
      attachTo: document.body,
    });
    await wrapper.vm.validateFields();
    await new Promise(r => setTimeout(r, 120));
    expect(lastArgs.status).toBe('warning');
    expect(lastArgs.errors).toEqual([]);
    expect(lastArgs.warnings.length).toBeGreaterThan(0);
    expect(wrapper.html()).toContain('custom-warning-icon');
    expect(wrapper.html()).not.toContain('custom-error-icon');
    wrapper.unmount();
  });

  it('FormItem 脱离 Form 单独使用时安全回退默认 feedbackIcon', async () => {
    const wrapper = mount(Form.Item, {
      props: { hasFeedback: true, validateStatus: 'success' },
      slots: { default: () => <Input /> },
    });
    await new Promise(r => setTimeout(r, 50));
    expect(wrapper.find('.ant-form-item-feedback-icon-success').exists()).toBe(true);
  });
});
