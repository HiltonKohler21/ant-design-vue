import { mount } from '@vue/test-utils';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import Button from '..';
import ConfigProvider from '../../config-provider';

describe('Button v6 APIs & Semantic DOM', () => {
  it('supports iconPlacement and prioritizes it over iconPosition', () => {
    const wEnd = mount(Button, {
      props: { iconPlacement: 'end' },
      slots: { default: () => 'End', icon: () => <SearchOutlined /> },
    });
    expect(wEnd.classes()).toContain('ant-btn-icon-end');

    const wPriorityStart = mount(Button, {
      props: { iconPlacement: 'start', iconPosition: 'end' },
      slots: { default: () => 'Start', icon: () => <SearchOutlined /> },
    });
    expect(wPriorityStart.classes()).not.toContain('ant-btn-icon-end');

    const wPriorityEnd = mount(Button, {
      props: { iconPlacement: 'end', iconPosition: 'start' },
      slots: { default: () => 'End', icon: () => <SearchOutlined /> },
    });
    expect(wPriorityEnd.classes()).toContain('ant-btn-icon-end');

    // Backwards compatibility with iconPosition
    const wLegacy = mount(Button, {
      props: { iconPosition: 'end' },
      slots: { default: () => 'Legacy', icon: () => <SearchOutlined /> },
    });
    expect(wLegacy.classes()).toContain('ant-btn-icon-end');
  });

  it('supports static semantic classNames and styles for root, icon, and content', () => {
    const wrapper = mount({
      render() {
        return (
          <Button
            icon={<SearchOutlined />}
            classNames={{
              root: 'custom-root',
              icon: 'custom-icon',
              content: 'custom-content',
            }}
            styles={{
              root: { backgroundColor: 'rgb(255, 0, 0)' },
              icon: { color: 'rgb(0, 128, 0)' },
              content: { letterSpacing: '2px' },
            }}
          >
            Search
          </Button>
        );
      },
    });

    const btn = wrapper.find('.ant-btn');
    expect(btn.classes()).toContain('custom-root');
    expect(btn.attributes('style')).toContain('background-color: rgb(255, 0, 0)');

    const icon = wrapper.find('.anticon-search');
    expect(icon.classes()).toContain('custom-icon');
    expect(icon.attributes('style')).toContain('color: rgb(0, 128, 0)');

    const content = wrapper.find('.custom-content');
    expect(content.exists()).toBe(true);
    expect(content.text()).toBe('Search');
    expect(content.attributes('style')).toContain('letter-spacing: 2px');
  });

  it('applies icon semantic classNames and styles to loading icon and VNode content', () => {
    const wrapper = mount({
      render() {
        return (
          <Button
            loading
            classNames={{ icon: 'loading-icon-cls', content: 'vnode-content-cls' }}
            styles={{ icon: { fontSize: '18px' }, content: { fontWeight: '700' } }}
          >
            <span class="inner-label">Saving</span>
          </Button>
        );
      },
    });

    const loadingSpan = wrapper.find('.ant-btn-loading-icon');
    expect(loadingSpan.classes()).toContain('loading-icon-cls');
    expect(loadingSpan.attributes('style')).toContain('font-size: 18px');

    const inner = wrapper.find('.inner-label');
    expect(inner.classes()).toContain('vnode-content-cls');
    expect(inner.attributes('style')).toContain('font-weight: 700');
  });

  it('supports functional classNames and styles merged with ConfigProvider.button', async () => {
    const wrapper = mount({
      data() {
        return { type: 'primary' };
      },
      render() {
        return (
          <ConfigProvider
            button={{
              classNames: ({ props }) => ({
                root: `ctx-root-${props.type}`,
                icon: 'ctx-icon',
                content: 'ctx-content',
              }),
              styles: {
                root: { paddingInline: '12px' },
                icon: { opacity: '0.8' },
              },
            }}
          >
            <Button
              type={this.type}
              iconPlacement="end"
              icon={<SearchOutlined />}
              classNames={({ props }) => ({
                root: `prop-root-${props.iconPlacement}`,
                content: `prop-content-${props.type}`,
              })}
              styles={({ props }) => ({
                root: {
                  color: props.type === 'primary' ? 'rgb(1, 2, 3)' : 'rgb(4, 5, 6)',
                },
                content: { fontSize: '15px' },
              })}
            >
              Dynamic
            </Button>
          </ConfigProvider>
        );
      },
    });

    const btn = wrapper.find('.ant-btn');
    expect(btn.classes()).toContain('ctx-root-primary');
    expect(btn.classes()).toContain('prop-root-end');
    expect(btn.attributes('style')).toContain('padding-inline: 12px');
    expect(btn.attributes('style')).toContain('color: rgb(1, 2, 3)');

    const icon = wrapper.find('.anticon-search');
    expect(icon.classes()).toContain('ctx-icon');
    expect(icon.attributes('style')).toContain('opacity: 0.8');

    const content = wrapper.find('.ctx-content');
    expect(content.classes()).toContain('prop-content-primary');
    expect(content.attributes('style')).toContain('font-size: 15px');

    await wrapper.setData({ type: 'dashed' });
    expect(btn.classes()).toContain('ctx-root-dashed');
    expect(btn.attributes('style')).toContain('color: rgb(4, 5, 6)');
  });
});
