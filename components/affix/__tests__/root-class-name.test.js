import { mount } from '@vue/test-utils';
import Result from '../../result';
import Alert from '../../alert';
import Statistic from '../../statistic';
import Affix from '../../affix';
import Collapse from '../../collapse';
import Breadcrumb from '../../breadcrumb';
import Timeline from '../../timeline';
import Avatar from '../../avatar';

const cls = w => w.element.getAttribute('class') || '';

describe('upstream: rootClassName 第三批（8 组件）', () => {
  const cases = [
    ['Result', Result],
    ['Alert', Alert],
    ['Affix', Affix],
    ['Breadcrumb', Breadcrumb],
    ['Timeline', Timeline],
    ['Avatar', Avatar],
  ];
  for (const [name, Comp] of cases) {
    it(`${name} 挂到根节点`, () => {
      const wrapper = mount(Comp, { props: { rootClassName: 'rc3-' + name.toLowerCase() } });
      expect(cls(wrapper)).toContain('rc3-' + name.toLowerCase());
    });
  }

  it('Statistic 挂到根节点', () => {
    const wrapper = mount(Statistic, { props: { rootClassName: 'rc3-stat', value: 1 } });
    expect(cls(wrapper)).toContain('rc3-stat');
  });

  it('Collapse 挂到根节点', () => {
    const wrapper = mount(Collapse, {
      props: { rootClassName: 'rc3-col' },
      slots: { default: () => [] },
    });
    expect(cls(wrapper)).toContain('rc3-col');
  });
});

describe('upstream: rootClassName 第四批（7 组件）', () => {
  it('Anchor 挂到根节点', () => {
    const { default: Anchor } = require('../../anchor');
    const wrapper = mount(Anchor, { props: { rootClassName: 'rc4-anchor' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-anchor');
  });
  it('Button 挂到根节点', () => {
    const { default: Button } = require('../../button');
    const wrapper = mount(Button, { props: { rootClassName: 'rc4-button' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-button');
  });
  it('Card 挂到根节点', () => {
    const { default: Card } = require('../../card');
    const wrapper = mount(Card, { props: { rootClassName: 'rc4-card' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-card');
  });
  it('Progress 挂到根节点', () => {
    const { default: Progress } = require('../../progress');
    const wrapper = mount(Progress, { props: { rootClassName: 'rc4-progress', percent: 30 } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-progress');
  });
  it('Flex 挂到根节点', () => {
    const { default: Flex } = require('../../flex');
    const wrapper = mount(Flex, { props: { rootClassName: 'rc4-flex' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-flex');
  });
  it('Checkbox 挂到根节点', () => {
    const { default: Checkbox } = require('../../checkbox');
    const wrapper = mount(Checkbox, { props: { rootClassName: 'rc4-checkbox' } });
    expect(wrapper.element.getAttribute('class')).toContain('rc4-checkbox');
  });
});
