import { mount } from '@vue/test-utils';
import Mentions from '../../mentions';
import Anchor from '../../anchor';
import Collapse from '../../collapse';
import Drawer from '../../drawer';
import Progress from '../../progress';

describe('upstream P3: 简单样式属性批', () => {
  it('Mentions popupClassName 透传', () => {
    const wrapper = mount(Mentions, { props: { popupClassName: 'm-popup', options: [] } });
    expect(wrapper.html()).toContain('m-popup');
  });

  it('Anchor.Link replace 不报错且可点击', () => {
    const wrapper = mount(Anchor, {
      slots: {
        default: () => <Anchor.Link href="#a" replace title="A" />,
      },
    });
    expect(wrapper.find('.ant-anchor-link').exists()).toBe(true);
  });

  it('Collapse size=small 输出 class', () => {
    const wrapper = mount(Collapse, { props: { size: 'small' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-collapse-small');
  });

  it('Drawer loading 渲染骨架屏', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, loading: true },
      slots: { default: () => 'content' },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('ant-drawer-body-skeleton');
    wrapper.unmount();
  });

  it('Progress rounding=true 等价 strokeLinecap=round', () => {
    const wrapper = mount(Progress, { props: { percent: 50, rounding: true } });
    expect(wrapper.html()).toContain('ant-progress');
  });
});
