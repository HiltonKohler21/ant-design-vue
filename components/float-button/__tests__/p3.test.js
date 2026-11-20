import { mount } from '@vue/test-utils';
import FloatButton from '..';
import Watermark from '../../watermark';
import Tour from '../../tour';

describe('P3: float-button.disabled/htmlType / watermark.inherit / tour.actionsRender', () => {
  it('FloatButton disabled + htmlType', () => {
    const wrapper = mount(FloatButton, { props: { disabled: true, htmlType: 'submit' } });
    const btn = wrapper.find('button');
    expect(btn.attributes('disabled')).not.toBeNull();
    expect(btn.attributes('type')).toBe('submit');
  });

  it('Watermark inherit 默认 true', () => {
    const wrapper = mount(Watermark, { props: { content: 'test' } });
    expect(wrapper.vm.$props.inherit).toBe(true);
  });

  it('Tour actionsRender 自定义操作按钮', async () => {
    const wrapper = mount(Tour, {
      props: {
        open: true,
        steps: [
          {
            title: 'step1',
            actionsRender: (node, info) => <div class="custom-actions">custom {info.current}</div>,
          },
        ],
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('custom-actions');
    wrapper.unmount();
  });
});
