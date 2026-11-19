import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '..';
import TreeSelect from '../../tree-select';
import Cascader from '../../cascader';
import AutoComplete from '../../auto-complete';

const { Option } = Select;
const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream semantic API: Select 族 classNames / styles', () => {
  it('Select classNames.root + rootClassName', () => {
    const wrapper = mount(Select, {
      props: { classNames: { root: 'sem-root' }, rootClassName: 'root-cls' },
      slots: { default: () => [<Option value="a">A</Option>] },
    });
    expect(cls(wrapper)).toContain('sem-root');
    expect(cls(wrapper)).toContain('root-cls');
  });

  it('Select styles.root 作用到根节点', () => {
    const wrapper = mount(Select, {
      props: { styles: { root: { color: 'red' } } },
      slots: { default: () => [<Option value="a">A</Option>] },
    });
    expect(wrapper.element.getAttribute('style')).toContain('color: red');
  });

  it('Select classNames.popup.root 作用到弹层', async () => {
    const wrapper = mount(Select, {
      props: { open: true, classNames: { popup: { root: 'sem-popup' } } },
      slots: { default: () => [<Option value="a">A</Option>] },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('sem-popup');
    wrapper.unmount();
  });

  it('Select styles.popup.root 作用到弹层样式', async () => {
    const wrapper = mount(Select, {
      props: { open: true, styles: { popup: { root: { color: 'blue' } } } },
      slots: { default: () => [<Option value="a">A</Option>] },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('color: blue');
    wrapper.unmount();
  });

  it('TreeSelect classNames.root / classNames.popup.root', async () => {
    const wrapper = mount(TreeSelect, {
      props: { open: true, classNames: { root: 'ts-root', popup: { root: 'ts-popup' } } },
      attachTo: 'body',
    });
    await nextTick();
    expect(cls(wrapper)).toContain('ts-root');
    expect(document.body.innerHTML).toContain('ts-popup');
    wrapper.unmount();
  });

  it('Cascader classNames.root / styles.popup.root', async () => {
    const wrapper = mount(Cascader, {
      props: {
        open: true,
        options: [{ value: 'a', label: 'A' }],
        classNames: { root: 'cs-root' },
        styles: { popup: { root: { color: 'green' } } },
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(cls(wrapper)).toContain('cs-root');
    expect(document.body.innerHTML).toContain('color: green');
    wrapper.unmount();
  });

  it('AutoComplete 透传 classNames.root', () => {
    const wrapper = mount(AutoComplete, {
      props: { options: [], classNames: { root: 'ac-root' } },
    });
    expect(cls(wrapper)).toContain('ac-root');
  });

  it('语义化属性不泄漏成 DOM attribute', () => {
    const wrapper = mount(Select, {
      props: { classNames: { root: 'x' }, styles: { root: { color: 'red' } } },
    });
    expect(wrapper.element.hasAttribute('classnames')).toBe(false);
    expect(wrapper.element.hasAttribute('styles')).toBe(false);
  });
});
