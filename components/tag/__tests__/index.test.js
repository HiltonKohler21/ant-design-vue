import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Tag from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

describe('Tag', () => {
  mountTest(Tag);
  mountTest(Tag.CheckableTag);
  mountTest(Tag.CheckableTagGroup);

  it('should be closable', async () => {
    const onClose = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <Tag closable onClose={onClose} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-close').length).toBe(1);
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(0);
      wrapper.find('.anticon-close').trigger('click');
      expect(onClose).toBeCalled();
    });
    await asyncExpect(() => {
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(1);
    });
  });

  it('should not be closed when prevent default', async () => {
    const onClose = e => {
      e.preventDefault();
    };
    const wrapper = mount(
      {
        render() {
          return <Tag closable onClose={onClose} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-close').length).toBe(1);
      expect(
        wrapper.findAll('.ant-tag').filter(w => w.element.classList.contains('ant-tag-hidden'))
          .length,
      ).toBe(0);
      wrapper.find('.anticon-close').trigger('click');
    });
  });

  describe('visibility', () => {
    it('can be controlled by visible with visible as initial value', async () => {
      const wrapper = mount(Tag, { props: { visible: true }, sync: false });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: false });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: true });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    it('can be controlled by visible with hidden as initial value', async () => {
      const wrapper = mount(Tag, { props: { visible: false }, sync: false });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: true });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.setProps({ visible: false });
      });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  it('supports default variant filled, solid / outlined, and bordered compatibility', async () => {
    document.head.innerHTML = '';
    const defaultTag = mount(Tag, { slots: { default: () => 'Default' } });
    expect(defaultTag.classes()).toContain('ant-tag-filled');
    expect(defaultTag.classes()).not.toContain('ant-tag-borderless');
    expect(defaultTag.classes()).not.toContain('ant-tag-outlined');

    const filled = mount(Tag, { props: { variant: 'filled', color: 'blue' } });
    expect(filled.classes()).toContain('ant-tag-filled');
    expect(filled.classes()).toContain('ant-tag-blue');

    const solid = mount(Tag, { props: { variant: 'solid' } });
    expect(solid.classes()).toContain('ant-tag-solid');
    expect(solid.classes()).toContain('ant-tag-default');

    const outlined = mount(Tag, { props: { variant: 'outlined', color: 'success' } });
    expect(outlined.classes()).toContain('ant-tag-outlined');
    expect(outlined.classes()).toContain('ant-tag-success');

    const explicitBordered = mount(Tag, { props: { bordered: true } });
    expect(explicitBordered.classes()).toContain('ant-tag-outlined');

    const borderless = mount(Tag, { props: { bordered: false } });
    expect(borderless.classes()).toContain('ant-tag-filled');
    expect(borderless.classes()).toContain('ant-tag-borderless');

    const ctxOutlined = mount(ConfigProvider, {
      props: { tag: { variant: 'outlined' } },
      slots: { default: () => <Tag>Context Outlined</Tag> },
    });
    expect(ctxOutlined.find('.ant-tag').classes()).toContain('ant-tag-outlined');

    await nextTick();
    const css = collectCss();
    expect(css).toContain('ant-tag-filled');
    expect(css).toContain('ant-tag-solid');
    expect(css).toContain('ant-tag-outlined');
  });

  it('supports href, target, and disabled (including ConfigProvider componentDisabled)', () => {
    const linkWrapper = mount(Tag, {
      props: { href: 'https://hiltonkohler21.github.io/ant-design-vue', target: '_blank' },
      slots: { default: () => 'Link Tag' },
    });
    expect(linkWrapper.element.tagName).toBe('A');
    expect(linkWrapper.attributes('href')).toBe('https://hiltonkohler21.github.io/ant-design-vue');
    expect(linkWrapper.attributes('target')).toBe('_blank');

    const onClose = jest.fn();
    const disabledLink = mount(Tag, {
      props: {
        href: 'https://hiltonkohler21.github.io/ant-design-vue',
        disabled: true,
        closable: true,
        onClose,
      },
      slots: { default: () => 'Disabled Link' },
    });
    expect(disabledLink.element.tagName).toBe('A');
    expect(disabledLink.classes()).toContain('ant-tag-disabled');
    expect(disabledLink.attributes('href')).toBeUndefined();
    expect(disabledLink.attributes('aria-disabled')).toBe('true');
    disabledLink.find('.ant-tag-close-icon').trigger('click');
    expect(onClose).not.toHaveBeenCalled();

    const ctxDisabled = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => <Tag>Inherited Disabled</Tag> },
    });
    expect(ctxDisabled.find('.ant-tag').classes()).toContain('ant-tag-disabled');
  });

  it('supports closable object config and keyboard accessibility (Enter / Space)', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Tag, {
      props: {
        closable: {
          closeIcon: <span class="custom-x">X</span>,
          'aria-label': 'Remove tag',
        },
        onClose,
      },
      slots: { default: () => 'A11y Tag' },
    });
    const closeBtn = wrapper.find('.ant-tag-close-icon');
    expect(closeBtn.attributes('role')).toBe('button');
    expect(closeBtn.attributes('tabindex')).toBe('0');
    expect(closeBtn.attributes('aria-label')).toBe('Remove tag');
    expect(closeBtn.find('.custom-x').exists()).toBe(true);

    await closeBtn.trigger('keydown', { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(1);

    const onCloseSpace = jest.fn();
    const wrapperSpace = mount(Tag, {
      props: { closable: true, onClose: onCloseSpace },
      slots: { default: () => 'Space Tag' },
    });
    await wrapperSpace.find('.ant-tag-close-icon').trigger('keydown', { key: ' ' });
    expect(onCloseSpace).toHaveBeenCalledTimes(1);
  });

  it('supports semantic classNames and styles (object and functional)', () => {
    const wrapper = mount(Tag, {
      props: {
        variant: 'solid',
        closable: true,
        icon: <span class="tag-ic">I</span>,
        classNames: ({ props }) => ({
          root: `root-${props.variant}`,
          icon: 'sem-icon',
          content: 'sem-content',
          close: 'sem-close',
        }),
        styles: {
          root: { letterSpacing: '1px' },
          content: { fontWeight: '600' },
          close: { opacity: '0.7' },
        },
      },
      slots: { default: () => 'Semantic' },
    });
    expect(wrapper.classes()).toContain('root-solid');
    expect(wrapper.attributes('style')).toContain('letter-spacing: 1px');
    expect(wrapper.find('.tag-ic').classes()).toContain('sem-icon');
    expect(wrapper.find('.sem-content').text()).toBe('Semantic');
    expect(wrapper.find('.sem-content').attributes('style')).toContain('font-weight: 600');
    expect(wrapper.find('.ant-tag-close-icon').classes()).toContain('sem-close');

    // Icon passed via slot should also be cloned directly with semantic icon class/style
    const slotIconWrapper = mount(Tag, {
      props: {
        classNames: { icon: 'slot-sem-icon' },
        styles: { icon: { color: 'rgb(82, 196, 26)' } },
      },
      slots: {
        icon: () => <span class="slot-ic">S</span>,
        default: () => 'Slot Icon',
      },
    });
    expect(slotIconWrapper.find('.slot-ic').classes()).toContain('slot-sem-icon');
    expect(slotIconWrapper.find('.slot-ic').attributes('style')).toContain(
      'color: rgb(82, 196, 26)',
    );
  });

  it('supports CheckableTag icon, disabled, and Space key toggle', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Tag.CheckableTag, {
      props: {
        checked: false,
        icon: <span class="chk-icon">*</span>,
        onChange,
      },
      slots: { default: () => 'Check me' },
    });
    expect(wrapper.find('.chk-icon').exists()).toBe(true);
    expect(wrapper.attributes('role')).toBe('checkbox');
    expect(wrapper.attributes('aria-checked')).toBe('false');
    await wrapper.trigger('keydown', { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(true);

    const onDisabledChange = jest.fn();
    const disabledWrapper = mount(Tag.CheckableTag, {
      props: { checked: false, disabled: true, onChange: onDisabledChange },
      slots: { default: () => 'Disabled' },
    });
    expect(disabledWrapper.classes()).toContain('ant-tag-checkable-disabled');
    await disabledWrapper.trigger('click');
    await disabledWrapper.trigger('keydown', { key: ' ' });
    expect(onDisabledChange).not.toHaveBeenCalled();
  });

  it('supports Tag.CheckableTagGroup single, multiple, disabled, and semantic classNames/styles', async () => {
    const onSingleChange = jest.fn();
    const single = mount(Tag.CheckableTagGroup, {
      props: {
        options: ['A', { value: 'B', label: 'Label B', className: 'opt-b' }],
        defaultValue: 'A',
        onChange: onSingleChange,
        classNames: { root: 'grp-root', item: 'grp-item' },
        styles: { root: { gap: '12px' }, item: { padding: '4px' } },
      },
    });
    expect(single.classes()).toContain('ant-tag-checkable-group');
    expect(single.classes()).toContain('grp-root');
    expect(single.attributes('style')).toContain('gap: 12px');
    const items = single.findAll('.ant-tag-checkable');
    expect(items.length).toBe(2);
    expect(items[0].classes()).toContain('ant-tag-checkable-checked');
    expect(items[1].classes()).toContain('opt-b');
    expect(items[1].classes()).toContain('grp-item');

    await items[1].trigger('click');
    expect(onSingleChange).toHaveBeenCalledWith('B');
    expect(items[1].classes()).toContain('ant-tag-checkable-checked');

    // Toggle off in single mode -> null
    await items[1].trigger('click');
    expect(onSingleChange).toHaveBeenCalledWith(null);

    const onMultiChange = jest.fn();
    const multi = mount(Tag.CheckableTagGroup, {
      props: {
        options: ['X', 'Y', 'Z'],
        multiple: true,
        defaultValue: ['X'],
        onChange: onMultiChange,
      },
    });
    const mItems = multi.findAll('.ant-tag-checkable');
    await mItems[1].trigger('click');
    expect(onMultiChange).toHaveBeenCalledWith(['X', 'Y']);
    await mItems[0].trigger('click');
    expect(onMultiChange).toHaveBeenCalledWith(['Y']);
  });

  it('wires Tag ComponentToken CSS variables', async () => {
    document.head.innerHTML = '';
    mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            Tag: {
              defaultBg: '#eeeeee',
              defaultColor: '#222222',
              solidTextColor: '#fefefe',
            },
          },
        },
      },
      slots: { default: () => <Tag variant="solid">Token</Tag> },
    });
    await nextTick();
    const css = collectCss();
    expect(css).toContain('--ant-tag-default-bg:#eeeeee');
    expect(css).toContain('--ant-tag-default-color:#222222');
    expect(css).toContain('--ant-tag-solid-text-color:#fefefe');
  });

  it('generates valid CSS selectors for preset solid and inverse tags without invalid :not(...)-inverse', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
        },
      },
      slots: {
        default: () => (
          <>
            <Tag color="blue" variant="solid">
              Solid Blue
            </Tag>
            <Tag color="blue-inverse">Inverse Blue</Tag>
          </>
        ),
      },
    });
    await nextTick();
    const css = collectCss();
    expect(css).toContain('.ant-tag.ant-tag-blue:not(.ant-tag-disabled).ant-tag-solid');
    expect(css).toContain('.ant-tag.ant-tag-blue-inverse:not(.ant-tag-disabled)');
    expect(css).not.toContain(':not(.ant-tag-disabled)-inverse');
    wrapper.unmount();
  });

  it('uses alpha-tinted background for custom hex colors with default (filled) and outlined variants', () => {
    const defaultCustom = mount(Tag, {
      props: { color: '#f50' },
      slots: { default: () => 'Default Custom' },
    });
    expect(defaultCustom.classes()).toContain('ant-tag-filled');
    expect(defaultCustom.element.style.backgroundColor).toBe('rgba(255, 85, 0, 0.1)');
    expect(defaultCustom.element.style.color).toBe('rgb(255, 85, 0)');

    const filled = mount(Tag, {
      props: { variant: 'filled', color: '#f50' },
      slots: { default: () => 'Filled Custom' },
    });
    expect(filled.element.style.backgroundColor).toBe('rgba(255, 85, 0, 0.1)');
    expect(filled.element.style.color).toBe('rgb(255, 85, 0)');
    expect(filled.element.style.backgroundColor).not.toBe('rgb(255, 242, 235)');

    const outlined = mount(Tag, {
      props: { variant: 'outlined', color: '#f50' },
      slots: { default: () => 'Outlined Custom' },
    });
    expect(outlined.element.style.backgroundColor).toBe('rgba(255, 85, 0, 0.1)');
    expect(outlined.element.style.color).toBe('rgb(255, 85, 0)');
    expect(outlined.element.style.borderColor).toBe('#f50');
    expect(outlined.element.style.backgroundColor).not.toBe('rgb(255, 242, 235)');

    const solid = mount(Tag, {
      props: { variant: 'solid', color: '#f50' },
      slots: { default: () => 'Solid Custom' },
    });
    expect(solid.element.style.backgroundColor).toBe('rgb(255, 85, 0)');
  });
});
