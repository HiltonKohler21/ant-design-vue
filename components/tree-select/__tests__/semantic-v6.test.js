import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import TreeSelect from '..';
import ConfigProvider from '../../config-provider';

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [{ title: 'Child Node1', value: '0-0-1' }],
  },
];

describe('TreeSelect v6 functional semantic classNames / styles & suffix / prefix', () => {
  it('supports functional classNames / styles for root, prefix, suffix, popup.root with ConfigProvider merge', async () => {
    document.body.innerHTML = '';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          treeSelect: {
            classNames: ({ props }) => ({
              root: `ctx-ts-${props.variant || 'outlined'}`,
              prefix: 'ctx-ts-pre',
              suffix: 'ctx-ts-suf',
              popup: { root: 'ctx-ts-popup' },
            }),
            styles: {
              root: { minWidth: '180px' },
              prefix: { opacity: '0.9' },
              suffix: { opacity: '0.8' },
              popup: { root: { padding: '8px', color: 'black' } },
            },
          },
        },
        slots: {
          default: () => (
            <TreeSelect
              open
              variant="underlined"
              treeData={treeData}
              prefix={<span class="ts-pre-el">P</span>}
              suffix={<span class="ts-suf-el">S</span>}
              classNames={({ props }) => ({
                root: `prop-ts-${props.variant}`,
                prefix: 'prop-ts-pre',
                suffix: 'prop-ts-suf',
                popup: { root: 'prop-ts-popup' },
              })}
              styles={() => ({
                root: { borderColor: 'purple' },
                prefix: { color: 'rgb(11, 22, 33)' },
                suffix: { color: 'rgb(44, 55, 66)' },
                popup: { root: { color: 'green' } },
              })}
            />
          ),
        },
        attachTo: 'body',
      });
      await nextTick();

      const rootEl = wrapper.find('.ant-tree-select');
      expect(rootEl.classes()).toContain('ctx-ts-underlined');
      expect(rootEl.classes()).toContain('prop-ts-underlined');
      expect(rootEl.attributes('style')).toContain('min-width: 180px');
      expect(rootEl.attributes('style')).toContain('border-color: purple');
      expect(rootEl.attributes('suffix')).toBeUndefined();

      const preEl = wrapper.find('.ts-pre-el');
      expect(preEl.classes()).toContain('ctx-ts-pre');
      expect(preEl.classes()).toContain('prop-ts-pre');
      expect(preEl.attributes('style')).toContain('opacity: 0.9');
      expect(preEl.attributes('style')).toContain('color: rgb(11, 22, 33)');

      const sufEl = wrapper.find('.ts-suf-el');
      expect(sufEl.classes()).toContain('ctx-ts-suf');
      expect(sufEl.classes()).toContain('prop-ts-suf');
      expect(sufEl.attributes('style')).toContain('opacity: 0.8');
      expect(sufEl.attributes('style')).toContain('color: rgb(44, 55, 66)');

      const dropdown = document.body.querySelector('.ant-tree-select-dropdown');
      expect(dropdown?.className).toContain('ctx-ts-popup');
      expect(dropdown?.className).toContain('prop-ts-popup');
      expect(dropdown?.getAttribute('style')).toContain('padding: 8px');
      expect(dropdown?.getAttribute('style')).toContain('color: green');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('supports suffix prop, #suffix slot, #prefix slot, and suffixIcon fallback precedence', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wSlot = mount(TreeSelect, {
        props: { treeData },
        slots: {
          prefix: () => <span class="ts-slot-pre">PRE</span>,
          suffix: () => <span class="ts-slot-suf">SUF</span>,
          suffixIcon: () => <span class="ts-slot-legacy">OLD</span>,
        },
      });
      expect(wSlot.find('.ts-slot-pre').exists()).toBe(true);
      expect(wSlot.find('.ts-slot-suf').exists()).toBe(true);
      expect(wSlot.find('.ts-slot-legacy').exists()).toBe(false);

      const wPropWins = mount(TreeSelect, {
        props: {
          treeData,
          suffix: <span class="ts-prop-suf">NEW</span>,
          suffixIcon: <span class="ts-prop-legacy">OLD</span>,
        },
      });
      expect(wPropWins.find('.ts-prop-suf').exists()).toBe(true);
      expect(wPropWins.find('.ts-prop-legacy').exists()).toBe(false);

      const wHidden = mount(TreeSelect, {
        props: { treeData, suffix: null },
      });
      expect(wHidden.find('.ant-select-arrow').exists()).toBe(false);

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
