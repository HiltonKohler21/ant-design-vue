import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Descriptions from '..';
import Flex from '../../flex';
import Switch from '../../switch';
import Divider from '../../divider';
import Radio from '../../radio';
import ConfigProvider from '../../config-provider';
import PaddingDemo from '../demo/padding.vue';
import StyleDemo from '../demo/style.vue';
import StyleClassDemo from '../demo/style-class.vue';
import JsxDemo from '../demo/jsx.vue';
import BlockDemo from '../demo/block.vue';

const items = [
  { key: '1', label: 'Product', children: 'Cloud Database' },
  { key: '2', label: 'Billing', children: 'Prepaid' },
];

describe('Descriptions.Semantic & v6 features', () => {
  it('supports functional classNames/styles and merges ConfigProvider.descriptions', async () => {
    const classNamesFn = info => ({
      root: `desc-size-${info.props.size}`,
      header: 'fn-header',
      title: 'fn-title',
      extra: 'fn-extra',
      label: 'fn-label',
      content: 'fn-content',
    });
    const stylesFn = info => ({
      root: { borderRadius: info.props.size === 'large' ? '8px' : '4px' },
      header: { paddingTop: '4px' },
      title: { color: 'rgb(1, 2, 3)' },
      extra: { color: 'rgb(4, 5, 6)' },
      label: { color: info.props.size === 'large' ? 'rgb(162, 148, 249)' : 'rgb(0, 0, 0)' },
      content: { color: 'rgb(7, 8, 9)' },
    });

    const wrapper = mount({
      props: {
        size: { type: String, default: 'small' },
      },
      render() {
        return (
          <ConfigProvider
            descriptions={{
              className: 'ctx-cls',
              style: { opacity: '0.95' },
              classNames: info => ({
                root: 'ctx-root',
                label: info.props.bordered ? 'ctx-bordered-label' : 'ctx-label',
              }),
              styles: {
                root: { padding: '10px' },
                label: { fontWeight: '600' },
              },
            }}
          >
            <Descriptions
              title="User Info"
              extra="Edit"
              bordered
              size={this.size}
              items={items}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-descriptions');
    const header = wrapper.find('.ant-descriptions-header');
    const title = wrapper.find('.ant-descriptions-title');
    const extra = wrapper.find('.ant-descriptions-extra');
    const label = wrapper.find('.ant-descriptions-item-label');
    const content = wrapper.find('.ant-descriptions-item-content');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('desc-size-small');
    expect(root.attributes('style')).toContain('opacity: 0.95');
    expect(root.attributes('style')).toContain('padding: 10px');
    expect(root.attributes('style')).toContain('border-radius: 4px');

    expect(header.classes()).toContain('fn-header');
    expect(header.attributes('style')).toContain('padding-top: 4px');
    expect(title.classes()).toContain('fn-title');
    expect(title.attributes('style')).toContain('color: rgb(1, 2, 3)');
    expect(extra.classes()).toContain('fn-extra');
    expect(extra.attributes('style')).toContain('color: rgb(4, 5, 6)');

    expect(label.classes()).toContain('ctx-bordered-label');
    expect(label.classes()).toContain('fn-label');
    expect(label.attributes('style')).toContain('font-weight: 600');
    expect(label.attributes('style')).toContain('color: rgb(0, 0, 0)');

    expect(content.classes()).toContain('fn-content');
    expect(content.attributes('style')).toContain('color: rgb(7, 8, 9)');

    await wrapper.setProps({ size: 'large' });
    await nextTick();
    expect(wrapper.find('.ant-descriptions').classes()).toContain('desc-size-large');
    expect(wrapper.find('.ant-descriptions').attributes('style')).toContain('border-radius: 8px');
    expect(wrapper.find('.ant-descriptions-item-label').attributes('style')).toContain(
      'color: rgb(162, 148, 249)',
    );

    await wrapper.setProps({ size: 'medium' });
    await nextTick();
    expect(wrapper.find('.ant-descriptions').classes()).toContain('ant-descriptions-middle');

    wrapper.unmount();
  });

  it('mounts new padding, style, style-class, jsx, and block demos cleanly', () => {
    const plugins = [Descriptions, Flex, Switch, Divider, Radio];

    const paddingWrapper = mount(PaddingDemo, { global: { plugins } });
    expect(paddingWrapper.findAll('.ant-descriptions')).toHaveLength(2);
    paddingWrapper.unmount();

    const styleWrapper = mount(StyleDemo, { global: { plugins } });
    expect(styleWrapper.findAll('.ant-descriptions')).toHaveLength(2);
    styleWrapper.unmount();

    const styleClassWrapper = mount(StyleClassDemo, { global: { plugins } });
    expect(styleClassWrapper.findAll('.demo-descriptions-semantic-root')).toHaveLength(2);
    styleClassWrapper.unmount();

    const jsxWrapper = mount(JsxDemo, { global: { plugins } });
    expect(jsxWrapper.findAll('.ant-descriptions-item-label')).toHaveLength(5);
    jsxWrapper.unmount();

    const blockWrapper = mount(BlockDemo, { global: { plugins } });
    expect(blockWrapper.findAll('.ant-descriptions-item-label')).toHaveLength(4);
    blockWrapper.unmount();
  });
});
