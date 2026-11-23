import { mount } from '@vue/test-utils';
import Space from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

describe('Space', () => {
  mountTest(Space);

  it('should render width empty children', () => {
    const wrapper = mount({
      render() {
        return <Space />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10}>
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginRight).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginRight).toBe('');
  });

  it('should render vertical space width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10} direction="vertical">
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginBottom).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginBottom).toBe('');
  });

  it('should render correct with children', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text3
          </Space>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render with invalidElement', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text1
          </Space>
        );
      },
    });

    expect(wrapper.findAll('.ant-space-item').length).toBe(3);
  });

  it('Space.Compact wires align prop to class and alignItems style', () => {
    const cases = [
      ['start', 'flex-start'],
      ['end', 'flex-end'],
      ['center', 'center'],
      ['baseline', 'baseline'],
    ];
    cases.forEach(([align, expected]) => {
      const wrapper = mount({
        render() {
          return (
            <Space.Compact align={align}>
              <span>a</span>
              <span>b</span>
            </Space.Compact>
          );
        },
      });
      const el = wrapper.find('.ant-space-compact');
      expect(el.classes()).toContain(`ant-space-compact-align-${align}`);
      expect(el.element.style.alignItems).toBe(expected);
    });
  });

  it('Space consumes ConfigProvider.space className and style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        space: {
          size: 'middle',
          className: 'ctx-space-cls',
          style: { padding: '8px' },
        },
      },
      slots: {
        default: () => (
          <Space>
            <span>1</span>
            <span>2</span>
          </Space>
        ),
      },
    });
    const el = wrapper.find('.ant-space');
    expect(el.classes()).toContain('ctx-space-cls');
    expect(el.element.getAttribute('style')).toContain('padding: 8px');
  });
});
