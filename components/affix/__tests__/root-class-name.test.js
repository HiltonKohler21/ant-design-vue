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

describe('upstream: rootClassName 第五批（6 组件）', () => {
  const c = (name, Comp, props = {}) => {
    it(`${name} 挂到根节点`, () => {
      const wrapper = mount(Comp, { props: { rootClassName: 'rc5-' + name, ...props } });
      expect(wrapper.element.getAttribute('class')).toContain('rc5-' + name);
    });
  };
  c('tag', require('../../tag').default);
  c('pagination', require('../../pagination').default);
  c('steps', require('../../steps').default);
  c('input-number', require('../../input-number').default);
  c('skeleton', require('../../skeleton').default);
  it('dropdown 挂到 trigger', () => {
    const { default: Dropdown } = require('../../dropdown');
    const { default: Button } = require('../../button');
    const wrapper = mount(Dropdown, {
      props: { rootClassName: 'rc5-dropdown' },
      slots: { default: () => <Button>btn</Button> },
    });
    expect(wrapper.find('button').element.getAttribute('class')).toContain('rc5-dropdown');
  });
});

describe('upstream: rootClassName 第六批（8 组件）', () => {
  const c = (name, Comp, props = {}, sel) => {
    it(`${name} 挂到根节点`, () => {
      const wrapper = mount(Comp, { props: { rootClassName: 'rc6-' + name, ...props } });
      const el = sel ? wrapper.find(sel).element : wrapper.element;
      expect(el.getAttribute('class') || '').toContain('rc6-' + name);
    });
  };
  c('slider', require('../../slider').default, { defaultValue: 30 });
  c('badge', require('../../badge').default, { count: 1 });
  it('space 挂到根节点', () => {
    const { default: Space } = require('../../space');
    const wrapper = mount(Space, {
      props: { rootClassName: 'rc6-space' },
      slots: { default: () => <span>x</span> },
    });
    expect(wrapper.find('div').element.getAttribute('class')).toContain('rc6-space');
  });
  c('float-button', require('../../float-button').default, {});
  c('qrcode', require('../../qrcode').default, {
    value: 'https://hiltonkohler21.github.io/ant-design-vue',
  });
  c('carousel', require('../../carousel').default);
  c('typography', require('../../typography').default);
  it('typography-text 挂到根节点', () => {
    const { TypographyText } = require('../../typography');
    const wrapper = mount(TypographyText, {
      props: { rootClassName: 'rc6-typography-text' },
      slots: { default: () => 'txt' },
    });
    expect(wrapper.find('.ant-typography').element.getAttribute('class')).toContain(
      'rc6-typography-text',
    );
  });
});

describe('upstream: rootClassName 第七批（descriptions/list/layout/calendar/upload/table/form/transfer）', () => {
  const c = (name, Comp, props = {}, check) => {
    it(`${name} 挂到根节点`, () => {
      const wrapper = mount(Comp, { props: { rootClassName: 'rc7-' + name, ...props } });
      const html = wrapper.html();
      expect(html).toContain('rc7-' + name);
    });
  };
  c('descriptions', require('../../descriptions').default);
  c('list', require('../../list').default);
  c('layout', require('../../layout').default);
  c('calendar', require('../../calendar').default);
  c('upload', require('../../upload').default);
  c('form', require('../../form').default);
  c('transfer', require('../../transfer').default, { dataSource: [], targetKeys: [] });
});
