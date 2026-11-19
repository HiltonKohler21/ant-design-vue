import { mount } from '@vue/test-utils';
import Rate from '../../rate';
import Divider from '../../divider';
import Segmented from '../../segmented';
import Switch from '../../switch';
import Empty from '../../empty';
import Spin from '../../spin';

const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream: rootClassName（antd 5.16+）', () => {
  it('Rate 把 rootClassName 挂到根节点', () => {
    const wrapper = mount(Rate, { props: { rootClassName: 'my-root' } });
    expect(cls(wrapper)).toContain('my-root');
  });

  it('Divider 把 rootClassName 挂到根节点', () => {
    const wrapper = mount(Divider, { props: { rootClassName: 'my-root' } });
    expect(cls(wrapper)).toContain('my-root');
  });

  it('Segmented 把 rootClassName 挂到根节点', () => {
    const wrapper = mount(Segmented, {
      props: { rootClassName: 'my-root', options: ['a', 'b'], value: 'a' },
    });
    expect(cls(wrapper)).toContain('my-root');
  });

  it('Switch 把 rootClassName 挂到根节点且不泄漏到 DOM 属性', () => {
    const wrapper = mount(Switch, { props: { rootClassName: 'my-root' } });
    expect(cls(wrapper)).toContain('my-root');
    expect(wrapper.element.getAttribute('rootclassname')).toBeNull();
  });

  it('Empty 把 rootClassName 挂到根节点', () => {
    const wrapper = mount(Empty, { props: { rootClassName: 'my-root' } });
    expect(cls(wrapper)).toContain('my-root');
  });

  it('Spin 把 rootClassName 挂到根节点且不泄漏到 DOM 属性', () => {
    const wrapper = mount(Spin, { props: { rootClassName: 'my-root', spinning: true } });
    expect(cls(wrapper)).toContain('my-root');
    expect(wrapper.element.getAttribute('rootclassname')).toBeNull();
  });
});

describe('upstream: rootClassName 第二批（Input / Mentions / Tabs / Tooltip）', () => {
  it('Input 透传到根节点', () => {
    const { default: Input } = require('../../input');
    const wrapper = mount(Input, { props: { rootClassName: 'rc-input' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc-input');
  });

  it('Mentions 透传到根节点', () => {
    const { default: Mentions } = require('../../mentions');
    const wrapper = mount(Mentions, { props: { rootClassName: 'rc-mentions' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc-mentions');
  });

  it('Tabs 透传到根节点', () => {
    const { default: Tabs } = require('../../tabs');
    const wrapper = mount(Tabs, { props: { rootClassName: 'rc-tabs' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc-tabs');
  });
});
