import { mount } from '@vue/test-utils';
import Form from '..';
import Input from '../../input';

describe('Form feedbackIcons', () => {
  it('声明 feedbackIcons 并用于校验状态图标', async () => {
    const feedbackIcons = ({ status }) => ({
      error: <span class="custom-error-icon">err</span>,
    });
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
  });
});
