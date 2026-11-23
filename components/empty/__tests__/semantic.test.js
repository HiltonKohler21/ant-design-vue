import { mount } from '@vue/test-utils';
import Empty from '..';
import ConfigProvider from '../../config-provider';

describe('Empty.semantic', () => {
  it('supports static classNames and styles for all 4 slots', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'No items',
        imageStyle: { height: '60px' },
        classNames: {
          root: 'empty-root',
          image: 'empty-image',
          description: 'empty-desc',
          footer: 'empty-footer',
        },
        styles: {
          root: { padding: '12px' },
          image: { opacity: '0.5' },
          description: { color: 'rgb(1, 2, 3)' },
          footer: { marginTop: '16px' },
        },
      },
      slots: { default: () => <button type="button">Create</button> },
    });

    expect(wrapper.find('.ant-empty').classes()).toContain('empty-root');
    expect(wrapper.find('.ant-empty-image').classes()).toContain('empty-image');
    expect(wrapper.find('.ant-empty-description').classes()).toContain('empty-desc');
    expect(wrapper.find('.ant-empty-footer').classes()).toContain('empty-footer');

    expect(wrapper.find('.ant-empty').element.style.padding).toBe('12px');
    expect(wrapper.find('.ant-empty-image').element.style.height).toBe('60px');
    expect(wrapper.find('.ant-empty-image').element.style.opacity).toBe('0.5');
    expect(wrapper.find('.ant-empty-description').element.style.color).toBe('rgb(1, 2, 3)');
    expect(wrapper.find('.ant-empty-footer').element.style.marginTop).toBe('16px');
  });

  it('supports functional classNames and styles receiving { props }', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const classNamesFn = jest.fn(({ props }) => ({
      root: props.description ? 'empty-with-desc' : 'empty-no-desc',
      image: 'fn-empty-image',
      description: 'fn-empty-desc',
      footer: 'fn-empty-footer',
    }));
    const stylesFn = jest.fn(({ props }) => ({
      root: { backgroundColor: props.description ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 255)' },
      image: { height: '48px' },
      description: { fontSize: '14px' },
      footer: { padding: '4px' },
    }));

    const wrapper = mount(Empty, {
      props: {
        description: 'Custom description',
        classNames: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => <span>Footer</span> },
    });

    expect(classNamesFn).toHaveBeenCalled();
    expect(stylesFn).toHaveBeenCalled();
    expect(wrapper.find('.ant-empty').classes()).toContain('empty-with-desc');
    expect(wrapper.find('.ant-empty-image').classes()).toContain('fn-empty-image');
    expect(wrapper.find('.ant-empty-description').classes()).toContain('fn-empty-desc');
    expect(wrapper.find('.ant-empty-footer').classes()).toContain('fn-empty-footer');
    expect(wrapper.find('.ant-empty').element.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(wrapper.find('.ant-empty-image').element.style.height).toBe('48px');
    expect(wrapper.find('.ant-empty-description').element.style.fontSize).toBe('14px');
    expect(wrapper.find('.ant-empty-footer').element.style.padding).toBe('4px');

    await wrapper.setProps({ description: undefined });
    expect(wrapper.find('.ant-empty').classes()).toContain('empty-no-desc');
    expect(wrapper.find('.ant-empty').element.style.backgroundColor).toBe('rgb(0, 0, 255)');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('merges ConfigProvider empty functional semantics with component props', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            empty={{
              classNames: ({ props }) => ({
                root: props.description ? 'ctx-has-desc' : 'ctx-default',
                image: 'ctx-img',
                description: 'ctx-desc',
                footer: 'ctx-footer',
              }),
              styles: () => ({
                root: { margin: '10px' },
                image: { width: '80px' },
              }),
            }}
          >
            <Empty
              description="Hello"
              classNames={() => ({ root: 'own-root', footer: 'own-footer' })}
              styles={() => ({ root: { padding: '6px' }, footer: { color: 'rgb(5, 6, 7)' } })}
            >
              <span>Action</span>
            </Empty>
          </ConfigProvider>
        );
      },
    });

    const rootEl = wrapper.find('.ant-empty');
    expect(rootEl.classes()).toContain('ctx-has-desc');
    expect(rootEl.classes()).toContain('own-root');
    expect(rootEl.element.style.margin).toBe('10px');
    expect(rootEl.element.style.padding).toBe('6px');

    expect(wrapper.find('.ant-empty-image').classes()).toContain('ctx-img');
    expect(wrapper.find('.ant-empty-image').element.style.width).toBe('80px');
    expect(wrapper.find('.ant-empty-description').classes()).toContain('ctx-desc');
    expect(wrapper.find('.ant-empty-footer').classes()).toContain('ctx-footer');
    expect(wrapper.find('.ant-empty-footer').classes()).toContain('own-footer');
    expect(wrapper.find('.ant-empty-footer').element.style.color).toBe('rgb(5, 6, 7)');
  });
});
