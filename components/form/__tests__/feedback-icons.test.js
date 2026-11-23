import { mount } from '@vue/test-utils';
import Form from '..';
import Input from '../../input';

describe('Form feedbackIcons', () => {
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
});
