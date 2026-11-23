import { mount } from '@vue/test-utils';
import Button from '..';
import Popconfirm from '../../popconfirm';

describe('Button variant（antd 5.21）', () => {
  it('variant=solid 映射 primary', () => {
    const wrapper = mount(Button, { props: { variant: 'solid' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-primary');
  });

  it('variant=dashed 映射 dashed', () => {
    const wrapper = mount(Button, { props: { variant: 'dashed' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-dashed');
  });

  it('variant=link 映射 link', () => {
    const wrapper = mount(Button, { props: { variant: 'link' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-link');
  });

  it('variant=filled 输出 filled class', () => {
    const wrapper = mount(Button, { props: { variant: 'filled' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-filled');
  });

  it('color=danger 输出 dangerous', () => {
    const wrapper = mount(Button, { props: { variant: 'solid', color: 'danger' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-dangerous');
  });

  it('color=primary 输出 color-primary 且 variant=link ghost 不输出 background-ghost', () => {
    const wrapper = mount(Button, { props: { variant: 'filled', color: 'primary' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-color-primary');
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-filled');

    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const linkGhost = mount(Button, { props: { variant: 'link', ghost: true } });
    expect(linkGhost.element.getAttribute('class')).not.toContain('ant-btn-background-ghost');
    warnSpy.mockRestore();
  });
});

describe('Popconfirm onPopupClick', () => {
  it('触发回调', () => {
    const onPopupClick = jest.fn();
    const wrapper = mount(Popconfirm, {
      props: { title: 't', onPopupClick, open: true },
      attachTo: 'body',
    });
    expect(typeof onPopupClick).toBe('function');
    wrapper.unmount();
  });
});
