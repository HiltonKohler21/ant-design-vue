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
