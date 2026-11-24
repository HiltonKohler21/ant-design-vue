import { mount } from '@vue/test-utils';
import Checkbox from '..';
import ConfigProvider from '../../config-provider';

describe('Checkbox v6 semantic classNames & styles', () => {
  it('supports object classNames and styles on root, icon, and label', () => {
    const wrapper = mount(Checkbox, {
      props: {
        classNames: { root: 'cb-root', icon: 'cb-icon', label: 'cb-label' },
        styles: {
          root: { padding: '4px' },
          icon: { borderRadius: '6px' },
          label: { color: 'rgb(1, 2, 3)' },
        },
      },
      slots: { default: () => 'Option' },
    });

    const label = wrapper.find('label');
    expect(label.classes()).toContain('cb-root');
    expect(label.element.style.padding).toBe('4px');

    const icon = wrapper.find('.ant-checkbox');
    expect(icon.classes()).toContain('cb-icon');
    expect(icon.element.style.borderRadius).toBe('6px');

    const text = wrapper.find('.cb-label');
    expect(text.exists()).toBe(true);
    expect(text.element.style.color).toBe('rgb(1, 2, 3)');

    expect(label.element.hasAttribute('classnames')).toBe(false);
    expect(label.element.hasAttribute('styles')).toBe(false);
  });

  it('supports functional classNames and styles reacting to checked state', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        defaultChecked: true,
        classNames: info => ({
          root: info.props.checked ? 'is-checked-root' : 'is-unchecked-root',
          icon: info.props.checked ? 'is-checked-icon' : 'is-unchecked-icon',
          label: info.props.checked ? 'is-checked-label' : 'is-unchecked-label',
        }),
        styles: info => ({
          label: { fontWeight: info.props.checked ? '700' : '400' },
        }),
      },
      slots: { default: () => 'Dynamic' },
    });

    expect(wrapper.find('label').classes()).toContain('is-checked-root');
    expect(wrapper.find('.ant-checkbox').classes()).toContain('is-checked-icon');
    expect(wrapper.find('.is-checked-label').element.style.fontWeight).toBe('700');

    const input = wrapper.find('input');
    await input.setValue(false);
    expect(wrapper.find('label').classes()).toContain('is-unchecked-root');
    expect(wrapper.find('.ant-checkbox').classes()).toContain('is-unchecked-icon');
    expect(wrapper.find('.is-unchecked-label').element.style.fontWeight).toBe('400');
  });

  it('merges ConfigProvider.checkbox and Checkbox.Group semantic classNames & styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            checkbox={{
              classNames: { root: 'cp-root', icon: 'cp-icon', label: 'cp-label' },
              styles: { root: { margin: '2px' }, label: { opacity: '0.9' } },
            }}
          >
            <Checkbox.Group
              options={['Apple', 'Pear']}
              classNames={{
                root: 'grp-root',
                item: 'grp-item',
                itemIcon: 'grp-icon',
                itemLabel: 'grp-label',
              }}
              styles={{
                root: { gap: '8px' },
                item: { padding: '2px' },
                itemIcon: { borderRadius: '4px' },
                itemLabel: { color: 'rgb(9, 8, 7)' },
              }}
            />
          </ConfigProvider>
        );
      },
    });

    const group = wrapper.find('.ant-checkbox-group');
    expect(group.classes()).toContain('grp-root');
    expect(group.element.style.gap).toBe('8px');

    const firstLabel = wrapper.find('label');
    expect(firstLabel.classes()).toContain('cp-root');
    expect(firstLabel.classes()).toContain('grp-item');
    expect(firstLabel.element.style.margin).toBe('2px');
    expect(firstLabel.element.style.padding).toBe('2px');

    const firstIcon = wrapper.find('.ant-checkbox');
    expect(firstIcon.classes()).toContain('cp-icon');
    expect(firstIcon.classes()).toContain('grp-icon');
    expect(firstIcon.element.style.borderRadius).toBe('4px');

    const firstText = wrapper.find('.grp-label');
    expect(firstText.classes()).toContain('cp-label');
    expect(firstText.element.style.color).toBe('rgb(9, 8, 7)');
    expect(firstText.element.style.opacity).toBe('0.9');
  });
});
