import { mount } from '@vue/test-utils';
import Input from '..';
import ConfigProvider from '../../config-provider';

const { TextArea } = Input;

/** 取根元素的 class 字符串（不同 DOM 位置：纯 input / affix wrapper / textarea） */
const rootClasses = wrapper => wrapper.element.getAttribute('class') || '';

describe('Input.Variant', () => {
  it('defaults to outlined (no variant class emitted)', () => {
    const wrapper = mount(Input);
    expect(rootClasses(wrapper)).not.toMatch(/ant-input-(filled|underlined|borderless)/);
  });

  it('supports filled', () => {
    const wrapper = mount(Input, { props: { variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
  });

  it('supports underlined', () => {
    const wrapper = mount(Input, { props: { variant: 'underlined' } });
    expect(rootClasses(wrapper)).toContain('ant-input-underlined');
  });

  it('supports borderless via variant', () => {
    const wrapper = mount(Input, { props: { variant: 'borderless' } });
    expect(rootClasses(wrapper)).toContain('ant-input-borderless');
  });

  it('keeps legacy bordered={false} working', () => {
    const wrapper = mount(Input, { props: { bordered: false } });
    expect(rootClasses(wrapper)).toContain('ant-input-borderless');
  });

  it('variant wins over legacy bordered', () => {
    const wrapper = mount(Input, { props: { bordered: false, variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
    expect(rootClasses(wrapper)).not.toContain('ant-input-borderless');
  });

  it('applies variant on affix wrapper when prefix/suffix present', () => {
    const wrapper = mount(Input, { props: { variant: 'filled', prefix: '￥' } });
    expect(rootClasses(wrapper)).toContain('ant-input-affix-wrapper-filled');
  });

  it('does not leak variant onto the native input attribute', () => {
    const wrapper = mount(Input, { props: { variant: 'filled' } });
    expect(wrapper.find('input').attributes('variant')).toBeUndefined();
  });

  it('reads global variant from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { variant: 'underlined' },
      slots: { default: () => <Input /> },
    });
    expect(rootClasses(wrapper.find('input'))).toContain('ant-input-underlined');
  });

  it('reads component-level variant from ConfigProvider.input', () => {
    const wrapper = mount(ConfigProvider, {
      props: { input: { variant: 'filled' } },
      slots: { default: () => <Input /> },
    });
    expect(rootClasses(wrapper.find('input'))).toContain('ant-input-filled');
  });

  it('TextArea supports variant', () => {
    const wrapper = mount(TextArea, { props: { variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
  });
});

describe('Input semantic API（antd 5.25）', () => {
  it('classNames.prefix / suffix / count / input', () => {
    const wrapper = mount(Input, {
      props: {
        prefix: 'P',
        suffix: 'S',
        showCount: true,
        value: 'v',
        classNames: { prefix: 'i-prefix', suffix: 'i-suffix', count: 'i-count', input: 'i-input' },
        styles: { prefix: { color: 'rgb(1, 2, 3)' }, suffix: { color: 'rgb(4, 5, 6)' } },
      },
    });
    const html = wrapper.html();
    for (const c of ['i-prefix', 'i-suffix', 'i-count', 'i-input']) expect(html).toContain(c);
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('color: rgb(4, 5, 6)');
  });

  it('TextArea wires classNames/styles, ConfigProvider.textArea variant/className/style, and input variant fallback', () => {
    const taWrapper = mount(TextArea, {
      props: {
        showCount: true,
        value: 'hello',
        classNames: { input: 'ta-input', count: 'ta-count' },
        styles: { input: { fontSize: '15px' }, count: { color: 'rgb(7, 8, 9)' } },
      },
    });
    expect(taWrapper.find('textarea').classes()).toContain('ta-input');
    expect(taWrapper.find('textarea').attributes('style')).toContain('font-size: 15px');
    expect(taWrapper.find('textarea').attributes('classnames')).toBeUndefined();
    expect(taWrapper.find('.ta-count').exists()).toBe(true);
    expect(taWrapper.find('.ta-count').attributes('style')).toContain('color: rgb(7, 8, 9)');

    const cpTextArea = mount(ConfigProvider, {
      props: {
        textArea: {
          variant: 'filled',
          className: 'cp-textarea',
          style: { minHeight: '80px' },
        },
        input: { variant: 'underlined' },
      },
      slots: { default: () => <TextArea /> },
    });
    expect(cpTextArea.find('textarea').classes()).toContain('ant-input-filled');
    expect(cpTextArea.find('textarea').classes()).toContain('cp-textarea');
    expect(cpTextArea.find('textarea').attributes('style')).toContain('min-height: 80px');

    const cpFallback = mount(ConfigProvider, {
      props: { input: { variant: 'underlined' } },
      slots: { default: () => <TextArea /> },
    });
    expect(cpFallback.find('textarea').classes()).toContain('ant-input-underlined');
  });

  it('Password and Search wire classNames/styles and ConfigProvider configs', () => {
    const { Password, Search } = Input;
    const pwWrapper = mount(ConfigProvider, {
      props: {
        inputPassword: {
          className: 'cp-password',
          style: { width: '180px' },
        },
      },
      slots: {
        default: () => (
          <Password
            classNames={{ input: 'pw-input', suffix: 'pw-suffix' }}
            styles={{ suffix: { color: 'rgb(11, 22, 33)' } }}
          />
        ),
      },
    });
    expect(pwWrapper.find('.ant-input-password').classes()).toContain('cp-password');
    expect(pwWrapper.find('.ant-input-password').attributes('style')).toContain('width: 180px');
    expect(pwWrapper.find('input').classes()).toContain('pw-input');
    expect(pwWrapper.find('.ant-input-suffix').classes()).toContain('pw-suffix');
    expect(pwWrapper.find('.ant-input-suffix').attributes('style')).toContain(
      'color: rgb(11, 22, 33)',
    );

    const searchWrapper = mount(ConfigProvider, {
      props: {
        inputSearch: {
          className: 'cp-search',
          style: { width: '220px' },
        },
      },
      slots: {
        default: () => (
          <Search
            prefix="P"
            classNames={{ input: 's-input', prefix: 's-prefix' }}
            styles={{ prefix: { color: 'rgb(44, 55, 66)' } }}
          />
        ),
      },
    });
    expect(searchWrapper.find('.ant-input-search').classes()).toContain('cp-search');
    expect(searchWrapper.find('.ant-input-search').attributes('style')).toContain('width: 220px');
    expect(searchWrapper.find('input').classes()).toContain('s-input');
    expect(searchWrapper.find('.ant-input-prefix').classes()).toContain('s-prefix');
    expect(searchWrapper.find('.ant-input-prefix').attributes('style')).toContain(
      'color: rgb(44, 55, 66)',
    );
  });

  it('Input wires ConfigProvider.input className and style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        input: {
          className: 'cp-input',
          style: { width: '160px' },
        },
      },
      slots: { default: () => <Input /> },
    });
    expect(wrapper.find('input').classes()).toContain('cp-input');
    expect(wrapper.find('input').attributes('style')).toContain('width: 160px');
  });
});
