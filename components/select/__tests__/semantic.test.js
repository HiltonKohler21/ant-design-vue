import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '..';
import TreeSelect from '../../tree-select';
import Cascader from '../../cascader';
import AutoComplete from '../../auto-complete';
import ConfigProvider from '../../config-provider';

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

  it('Select supports functional classNames/styles (root, prefix, suffix, popup.root) with ConfigProvider merge and zero Vue warnings', async () => {
    document.body.innerHTML = '';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          select: {
            classNames: ({ props }) => ({
              root: `ctx-sel-${props.size || 'default'}`,
              prefix: 'ctx-sel-pre',
              suffix: 'ctx-sel-suf',
              popup: { root: 'ctx-sel-popup' },
            }),
            styles: {
              root: { width: '240px' },
              prefix: { opacity: '0.9' },
              suffix: { opacity: '0.8' },
              popup: { root: { padding: '5px', color: 'black' } },
            },
          },
        },
        slots: {
          default: () => (
            <Select
              open
              size="large"
              prefix="PRE"
              options={[{ value: 'a', label: 'A' }]}
              classNames={({ props }) => ({
                root: `prop-sel-${props.size}`,
                prefix: 'prop-sel-pre',
                suffix: 'prop-sel-suf',
                popup: { root: 'prop-sel-popup' },
              })}
              styles={() => ({
                root: { borderColor: 'red' },
                prefix: { color: 'rgb(1, 2, 3)' },
                suffix: { color: 'rgb(4, 5, 6)' },
                popup: { root: { color: 'blue' } },
              })}
            />
          ),
        },
        attachTo: 'body',
      });
      await nextTick();

      const rootEl = wrapper.find('.ant-select');
      expect(rootEl.classes()).toContain('ctx-sel-large');
      expect(rootEl.classes()).toContain('prop-sel-large');
      expect(rootEl.attributes('style')).toContain('width: 240px');
      expect(rootEl.attributes('style')).toContain('border-color: red');

      const preEl = wrapper.find('.ant-select-prefix .ctx-sel-pre');
      expect(preEl.exists()).toBe(true);
      expect(preEl.classes()).toContain('prop-sel-pre');
      expect(preEl.attributes('style')).toContain('opacity: 0.9');
      expect(preEl.attributes('style')).toContain('color: rgb(1, 2, 3)');

      const sufEl = wrapper.find('.ant-select-suffix');
      expect(sufEl.classes()).toContain('ctx-sel-suf');
      expect(sufEl.classes()).toContain('prop-sel-suf');
      expect(sufEl.attributes('style')).toContain('opacity: 0.8');
      expect(sufEl.attributes('style')).toContain('color: rgb(4, 5, 6)');

      const dropdown = document.body.querySelector('.ant-select-dropdown');
      expect(dropdown?.className).toContain('ctx-sel-popup');
      expect(dropdown?.className).toContain('prop-sel-popup');
      expect(dropdown?.getAttribute('style')).toContain('padding: 5px');
      expect(dropdown?.getAttribute('style')).toContain('color: blue');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('Select supports suffix prop, #suffix slot, suffixIcon fallback, suffix=null, and ConfigProvider.select.suffix', () => {
    const wPropWins = mount(Select, {
      props: {
        suffix: <span class="sel-prop-suf">NEW</span>,
        suffixIcon: <span class="sel-legacy-suf">OLD</span>,
      },
    });
    expect(wPropWins.find('.sel-prop-suf').exists()).toBe(true);
    expect(wPropWins.find('.sel-legacy-suf').exists()).toBe(false);
    expect(wPropWins.element.hasAttribute('suffix')).toBe(false);

    const wSlot = mount(Select, {
      slots: {
        suffix: () => <span class="sel-slot-suf">SLOT</span>,
        suffixIcon: () => <span class="sel-slot-old">OLD</span>,
      },
    });
    expect(wSlot.find('.sel-slot-suf').exists()).toBe(true);
    expect(wSlot.find('.sel-slot-old').exists()).toBe(false);

    const wHidden = mount(Select, {
      props: { suffix: null },
    });
    expect(wHidden.find('.ant-select-arrow').exists()).toBe(false);

    const wCtx = mount(ConfigProvider, {
      props: { select: { suffix: <span class="ctx-sel-suffix">CTX</span> } },
      slots: { default: () => <Select /> },
    });
    expect(wCtx.find('.ctx-sel-suffix').exists()).toBe(true);
  });

  it('Select supports loadingIcon prop, #loadingIcon slot, ConfigProvider.select.loadingIcon, and default fallback', () => {
    const wDefault = mount(Select, { props: { loading: true } });
    expect(wDefault.find('.anticon-loading').exists()).toBe(true);

    const wProp = mount(Select, {
      props: {
        loading: true,
        loadingIcon: <span class="custom-loading-prop">LOADING</span>,
      },
    });
    expect(wProp.find('.custom-loading-prop').exists()).toBe(true);
    expect(wProp.find('.anticon-loading').exists()).toBe(false);
    expect(wProp.element.hasAttribute('loadingicon')).toBe(false);

    const wSlot = mount(Select, {
      props: { loading: true },
      slots: {
        loadingIcon: () => <span class="custom-loading-slot">SLOT-LOAD</span>,
      },
    });
    expect(wSlot.find('.custom-loading-slot').exists()).toBe(true);
    expect(wSlot.find('.anticon-loading').exists()).toBe(false);

    const wCtx = mount(ConfigProvider, {
      props: {
        select: {
          loadingIcon: <span class="custom-loading-ctx">CTX-LOAD</span>,
        },
      },
      slots: { default: () => <Select loading /> },
    });
    expect(wCtx.find('.custom-loading-ctx').exists()).toBe(true);
    expect(wCtx.find('.anticon-loading').exists()).toBe(false);
  });
});
