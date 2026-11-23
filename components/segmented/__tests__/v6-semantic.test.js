import { mount } from '@vue/test-utils';
import AppstoreOutlined from '@ant-design/icons-vue/AppstoreOutlined';
import Segmented from '..';
import ConfigProvider from '../../config-provider';

describe('Segmented v6 APIs & Semantic DOM', () => {
  it('supports orientation and prioritizes it over vertical', () => {
    const wVertical = mount(Segmented, {
      props: { options: ['A', 'B'], value: 'A', orientation: 'vertical' },
    });
    expect(wVertical.classes()).toContain('ant-segmented-vertical');

    const wOverrideHorizontal = mount(Segmented, {
      props: { options: ['A', 'B'], value: 'A', orientation: 'horizontal', vertical: true },
    });
    expect(wOverrideHorizontal.classes()).not.toContain('ant-segmented-vertical');

    const wOverrideVertical = mount(Segmented, {
      props: { options: ['A', 'B'], value: 'A', orientation: 'vertical', vertical: false },
    });
    expect(wOverrideVertical.classes()).toContain('ant-segmented-vertical');
  });

  it('supports static semantic classNames and styles for root, icon, label, and item', () => {
    const wrapper = mount({
      render() {
        return (
          <Segmented
            value="kanban"
            options={[
              { label: 'Kanban', value: 'kanban', icon: <AppstoreOutlined /> },
              { label: 'List', value: 'list' },
            ]}
            classNames={{
              root: 'custom-root',
              icon: 'custom-icon',
              label: 'custom-label',
              item: 'custom-item',
            }}
            styles={{
              root: { backgroundColor: 'rgb(255, 0, 0)' },
              icon: { color: 'rgb(0, 0, 255)' },
              label: { fontWeight: '600' },
              item: { paddingInline: '12px' },
            }}
          />
        );
      },
    });

    const root = wrapper.find('.ant-segmented');
    const icon = wrapper.find('.ant-segmented-item-icon');
    const items = wrapper.findAll('.ant-segmented-item');
    const labels = wrapper.findAll('.ant-segmented-item-label');

    expect(root.classes()).toContain('custom-root');
    expect(root.attributes('style')).toContain('background-color: rgb(255, 0, 0)');

    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('custom-icon');
    expect(icon.attributes('style')).toContain('color: rgb(0, 0, 255)');

    expect(items).toHaveLength(2);
    items.forEach(item => {
      expect(item.classes()).toContain('custom-item');
      expect(item.attributes('style')).toContain('padding-inline: 12px');
    });

    expect(labels).toHaveLength(2);
    labels.forEach(label => {
      expect(label.classes()).toContain('custom-label');
      expect(label.attributes('style')).toContain('font-weight: 600');
    });
  });

  it('supports functional classNames and styles merged with ConfigProvider.segmented', async () => {
    const wrapper = mount({
      data() {
        return { value: 'a' };
      },
      render() {
        return (
          <ConfigProvider
            segmented={{
              classNames: {
                root: 'ctx-root',
                item: 'ctx-item',
                label: 'ctx-label',
                icon: 'ctx-icon',
              },
              styles: {
                root: { borderRadius: '8px' },
                item: { margin: '2px' },
              },
            }}
          >
            <Segmented
              value={this.value}
              orientation="vertical"
              options={[
                { value: 'a', label: 'A', icon: <span class="ic-a" /> },
                { value: 'b', label: 'B', icon: <span class="ic-b" /> },
              ]}
              classNames={({ props }) => ({
                root: `fn-root-${props.orientation}-${props.value}`,
                item: 'fn-item',
                label: 'fn-label',
                icon: 'fn-icon',
              })}
              styles={({ props }) => ({
                root: {
                  color: props.value === 'a' ? 'rgb(10, 20, 30)' : 'rgb(40, 50, 60)',
                },
                label: { fontSize: '16px' },
                icon: { opacity: '0.9' },
              })}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-segmented');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('fn-root-vertical-a');
    expect(root.attributes('style')).toContain('border-radius: 8px');
    expect(root.attributes('style')).toContain('color: rgb(10, 20, 30)');

    const item = wrapper.find('.ant-segmented-item');
    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('fn-item');
    expect(item.attributes('style')).toContain('margin: 2px');

    const label = wrapper.find('.ant-segmented-item-label');
    expect(label.classes()).toContain('ctx-label');
    expect(label.classes()).toContain('fn-label');
    expect(label.attributes('style')).toContain('font-size: 16px');

    const icon = wrapper.find('.ant-segmented-item-icon');
    expect(icon.classes()).toContain('ctx-icon');
    expect(icon.classes()).toContain('fn-icon');
    expect(icon.attributes('style')).toContain('opacity: 0.9');

    await wrapper.setData({ value: 'b' });
    expect(root.classes()).toContain('fn-root-vertical-b');
    expect(root.attributes('style')).toContain('color: rgb(40, 50, 60)');
  });
});
