import { mount } from '@vue/test-utils';
import Radio from '..';
import ConfigProvider from '../../config-provider';

describe('Radio v6 semantic classNames & styles', () => {
  it('supports object classNames and styles on root, icon, and label', () => {
    const wrapper = mount(Radio, {
      props: {
        classNames: { root: 'rd-root', icon: 'rd-icon', label: 'rd-label' },
        styles: {
          root: { padding: '4px' },
          icon: { borderRadius: '6px' },
          label: { color: 'rgb(10, 20, 30)' },
        },
      },
      slots: { default: () => 'Choice' },
    });

    const label = wrapper.find('label');
    expect(label.classes()).toContain('rd-root');
    expect(label.element.style.padding).toBe('4px');

    const icon = wrapper.find('.ant-radio');
    expect(icon.classes()).toContain('rd-icon');
    expect(icon.element.style.borderRadius).toBe('6px');

    const text = wrapper.find('.rd-label');
    expect(text.exists()).toBe(true);
    expect(text.element.style.color).toBe('rgb(10, 20, 30)');

    expect(label.element.hasAttribute('classnames')).toBe(false);
    expect(label.element.hasAttribute('styles')).toBe(false);
  });

  it('supports functional classNames and styles reacting to checked state', async () => {
    const wrapper = mount(Radio, {
      props: {
        checked: false,
        classNames: info => ({
          root: info.props.checked ? 'rd-checked-root' : 'rd-unchecked-root',
          icon: info.props.checked ? 'rd-checked-icon' : 'rd-unchecked-icon',
          label: info.props.checked ? 'rd-checked-label' : 'rd-unchecked-label',
        }),
        styles: info => ({
          label: { fontWeight: info.props.checked ? '700' : '400' },
        }),
      },
      slots: { default: () => 'Dynamic' },
    });

    expect(wrapper.find('label').classes()).toContain('rd-unchecked-root');
    expect(wrapper.find('.ant-radio').classes()).toContain('rd-unchecked-icon');

    await wrapper.setProps({ checked: true });
    expect(wrapper.find('label').classes()).toContain('rd-checked-root');
    expect(wrapper.find('.ant-radio').classes()).toContain('rd-checked-icon');
    expect(wrapper.find('.rd-checked-label').element.style.fontWeight).toBe('700');
  });

  it('merges ConfigProvider.radio and Radio.Group semantic classNames & styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            radio={{
              classNames: { root: 'cp-rd-root', icon: 'cp-rd-icon', label: 'cp-rd-label' },
              styles: { root: { margin: '2px' } },
            }}
          >
            <Radio.Group
              defaultValue="a"
              options={[
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b' },
              ]}
              classNames={{
                root: 'rg-root',
                item: 'rg-item',
                itemIcon: 'rg-icon',
                itemLabel: 'rg-label',
              }}
              styles={{
                root: { padding: '6px' },
                item: { padding: '2px' },
                itemIcon: { borderRadius: '4px' },
                itemLabel: { color: 'rgb(5, 6, 7)' },
              }}
            />
          </ConfigProvider>
        );
      },
    });

    const group = wrapper.find('.ant-radio-group');
    expect(group.classes()).toContain('rg-root');
    expect(group.element.style.padding).toBe('6px');

    const firstLabel = wrapper.find('label');
    expect(firstLabel.classes()).toContain('cp-rd-root');
    expect(firstLabel.classes()).toContain('rg-item');
    expect(firstLabel.element.style.margin).toBe('2px');
    expect(firstLabel.element.style.padding).toBe('2px');

    const firstIcon = wrapper.find('.ant-radio');
    expect(firstIcon.classes()).toContain('cp-rd-icon');
    expect(firstIcon.classes()).toContain('rg-icon');
    expect(firstIcon.element.style.borderRadius).toBe('4px');

    const firstText = wrapper.find('.rg-label');
    expect(firstText.classes()).toContain('cp-rd-label');
    expect(firstText.element.style.color).toBe('rgb(5, 6, 7)');
  });
});
