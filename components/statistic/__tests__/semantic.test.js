import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Statistic from '..';
import Flex from '../../flex';
import Row from '../../row';
import Col from '../../col';
import ConfigProvider from '../../config-provider';
import AnimatedDemo from '../demo/animated.vue';
import StyleClassDemo from '../demo/style-class.vue';

describe('Statistic.Semantic & v6 features', () => {
  it('supports static object classNames and styles for all semantic slots', () => {
    const wrapper = mount(Statistic, {
      props: {
        title: 'Active Users',
        value: 112893,
        prefix: '+',
        suffix: 'users',
        classNames: {
          root: 'custom-root',
          header: 'custom-header',
          title: 'custom-title',
          content: 'custom-content',
          value: 'custom-value',
          prefix: 'custom-prefix',
          suffix: 'custom-suffix',
        },
        styles: {
          root: { padding: '12px' },
          header: { marginBottom: '4px' },
          title: { color: 'rgb(1, 2, 3)' },
          content: { fontSize: '24px' },
          value: { color: 'rgb(4, 5, 6)' },
          prefix: { color: 'rgb(7, 8, 9)' },
          suffix: { color: 'rgb(10, 11, 12)' },
        },
      },
    });

    expect(wrapper.find('.ant-statistic').classes()).toContain('custom-root');
    expect(wrapper.find('.ant-statistic-header').classes()).toContain('custom-header');
    expect(wrapper.find('.ant-statistic-title').classes()).toContain('custom-title');
    expect(wrapper.find('.ant-statistic-content').classes()).toContain('custom-content');
    expect(wrapper.find('.ant-statistic-content-value').classes()).toContain('custom-value');
    expect(wrapper.find('.ant-statistic-content-prefix').classes()).toContain('custom-prefix');
    expect(wrapper.find('.ant-statistic-content-suffix').classes()).toContain('custom-suffix');

    expect(wrapper.find('.ant-statistic').attributes('style')).toContain('padding: 12px');
    expect(wrapper.find('.ant-statistic-header').attributes('style')).toContain(
      'margin-bottom: 4px',
    );
    expect(wrapper.find('.ant-statistic-title').attributes('style')).toContain(
      'color: rgb(1, 2, 3)',
    );
    expect(wrapper.find('.ant-statistic-content').attributes('style')).toContain('font-size: 24px');
    expect(wrapper.find('.ant-statistic-content-value').attributes('style')).toContain(
      'color: rgb(4, 5, 6)',
    );
    expect(wrapper.find('.ant-statistic-content-prefix').attributes('style')).toContain(
      'color: rgb(7, 8, 9)',
    );
    expect(wrapper.find('.ant-statistic-content-suffix').attributes('style')).toContain(
      'color: rgb(10, 11, 12)',
    );

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.statistic', async () => {
    const classNamesFn = info => ({
      root: Number(info.props.value) < 0 ? 'stat-negative' : 'stat-positive',
      value: 'fn-value',
    });
    const stylesFn = info => ({
      title: { color: Number(info.props.value) < 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 128, 0)' },
      value: { paddingLeft: '6px' },
    });

    const wrapper = mount({
      props: {
        value: { type: Number, default: 100 },
      },
      render() {
        return (
          <ConfigProvider
            statistic={{
              className: 'ctx-cls',
              style: { opacity: '0.9' },
              classNames: { root: 'ctx-root', header: 'ctx-header', value: 'ctx-value' },
              styles: {
                root: { borderRadius: '8px' },
                header: { paddingBottom: '6px' },
                value: { fontWeight: '600' },
              },
            }}
          >
            <Statistic
              title="Revenue"
              value={this.value}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-statistic');
    const header = wrapper.find('.ant-statistic-header');
    const title = wrapper.find('.ant-statistic-title');
    const val = wrapper.find('.ant-statistic-content-value');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('stat-positive');
    expect(root.attributes('style')).toContain('opacity: 0.9');
    expect(root.attributes('style')).toContain('border-radius: 8px');
    expect(header.classes()).toContain('ctx-header');
    expect(header.attributes('style')).toContain('padding-bottom: 6px');
    expect(title.attributes('style')).toContain('color: rgb(0, 128, 0)');
    expect(val.classes()).toContain('ctx-value');
    expect(val.classes()).toContain('fn-value');
    expect(val.attributes('style')).toContain('font-weight: 600');
    expect(val.attributes('style')).toContain('padding-left: 6px');

    await wrapper.setProps({ value: -18.7 });
    await nextTick();

    expect(wrapper.find('.ant-statistic').classes()).toContain('stat-negative');
    expect(wrapper.find('.ant-statistic-title').attributes('style')).toContain(
      'color: rgb(255, 0, 0)',
    );

    wrapper.unmount();
  });

  it('forwards semantic classNames and styles through Statistic.Timer', () => {
    const wrapper = mount(Statistic.Timer, {
      props: {
        type: 'countdown',
        title: 'Countdown',
        value: Date.now() + 60000,
        classNames: {
          root: 'timer-root',
          header: 'timer-header',
          value: 'timer-value',
        },
        styles: {
          value: { color: 'rgb(22, 119, 255)' },
        },
      },
    });

    expect(wrapper.find('.ant-statistic').classes()).toContain('timer-root');
    expect(wrapper.find('.ant-statistic-header').classes()).toContain('timer-header');
    expect(wrapper.find('.ant-statistic-content-value').classes()).toContain('timer-value');
    expect(wrapper.find('.ant-statistic-content-value').attributes('style')).toContain(
      'color: rgb(22, 119, 255)',
    );

    wrapper.unmount();
  });

  it('mounts new animated and style-class demos cleanly', () => {
    const plugins = [Statistic, Flex, Row, Col];
    const animWrapper = mount(AnimatedDemo, { global: { plugins } });
    expect(animWrapper.findAll('.demo-statistic-animated-content')).toHaveLength(2);
    animWrapper.unmount();

    const styleWrapper = mount(StyleClassDemo, { global: { plugins } });
    expect(styleWrapper.findAll('.demo-statistic-semantic-root')).toHaveLength(2);
    styleWrapper.unmount();
  });
});
