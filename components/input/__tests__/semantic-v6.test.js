import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Input from '..';
import ConfigProvider from '../../config-provider';

const { TextArea, Password, Search, OTP } = Input;

describe('Input family v6 semantic classNames / styles & Search.searchIcon', () => {
  it('Input supports functional classNames/styles across root, prefix, suffix, input, count with zero Vue warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(Input, {
        props: {
          prefix: 'P',
          suffix: 'S',
          showCount: true,
          value: 'abc',
          disabled: false,
          classNames: ({ props }) => ({
            root: props.disabled ? 'in-root-dis' : 'in-root-en',
            prefix: 'in-prefix',
            suffix: 'in-suffix',
            input: props.disabled ? 'in-input-dis' : 'in-input-en',
            count: 'in-count',
          }),
          styles: ({ props }) => ({
            root: { borderColor: props.disabled ? 'gray' : 'red' },
            prefix: { color: 'rgb(1, 2, 3)' },
            suffix: { color: 'rgb(4, 5, 6)' },
            input: { fontSize: props.disabled ? '12px' : '16px' },
            count: { color: 'rgb(7, 8, 9)' },
          }),
        },
      });

      expect(wrapper.find('.ant-input-affix-wrapper').classes()).toContain('in-root-en');
      expect(wrapper.find('.ant-input-affix-wrapper').attributes('style')).toContain(
        'border-color: red',
      );
      expect(wrapper.find('.ant-input-prefix').classes()).toContain('in-prefix');
      expect(wrapper.find('.ant-input-prefix').attributes('style')).toContain(
        'color: rgb(1, 2, 3)',
      );
      expect(wrapper.find('.ant-input-suffix').classes()).toContain('in-suffix');
      expect(wrapper.find('.ant-input-suffix').attributes('style')).toContain(
        'color: rgb(4, 5, 6)',
      );
      expect(wrapper.find('input').classes()).toContain('in-input-en');
      expect(wrapper.find('input').attributes('style')).toContain('font-size: 16px');
      expect(wrapper.find('.ant-input-show-count-suffix').classes()).toContain('in-count');
      expect(wrapper.find('.ant-input-show-count-suffix').attributes('style')).toContain(
        'color: rgb(7, 8, 9)',
      );

      await wrapper.setProps({ disabled: true });
      await nextTick();
      expect(wrapper.find('.ant-input-affix-wrapper').classes()).toContain('in-root-dis');
      expect(wrapper.find('.ant-input-affix-wrapper').attributes('style')).toContain(
        'border-color: gray',
      );
      expect(wrapper.find('input').classes()).toContain('in-input-dis');
      expect(wrapper.find('input').attributes('style')).toContain('font-size: 12px');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('Input merges functional ConfigProvider.input classNames/styles with props', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        input: {
          classNames: ({ props }) => ({
            root: `ctx-root-${props.size || 'default'}`,
            input: 'ctx-input',
          }),
          styles: {
            root: { padding: '2px', borderColor: 'green' },
            input: { letterSpacing: '1px', color: 'black' },
          },
        },
      },
      slots: {
        default: () => (
          <Input
            size="large"
            classNames={{ root: 'prop-root', input: 'prop-input' }}
            styles={{ root: { borderColor: 'blue' }, input: { color: 'purple' } }}
          />
        ),
      },
    });
    const input = wrapper.find('input');
    expect(input.classes()).toContain('ctx-root-large');
    expect(input.classes()).toContain('prop-root');
    expect(input.classes()).toContain('ctx-input');
    expect(input.classes()).toContain('prop-input');
    const styleAttr = input.attributes('style') || '';
    expect(styleAttr).toContain('padding: 2px');
    expect(styleAttr).toContain('border-color: blue');
    expect(styleAttr).toContain('letter-spacing: 1px');
    expect(styleAttr).toContain('color: purple');
  });

  it('TextArea supports functional classNames/styles across bare, allowClear, and showCount modes', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wShowCount = mount(ConfigProvider, {
        props: {
          textArea: {
            classNames: ({ props }) => ({
              root: `ctx-ta-${props.variant || 'outlined'}`,
              textarea: 'ctx-ta-inner',
            }),
            styles: {
              root: { margin: '4px' },
              textarea: { lineHeight: '20px' },
            },
          },
        },
        slots: {
          default: () => (
            <TextArea
              showCount
              variant="filled"
              value="hi"
              classNames={({ props }) => ({
                root: `prop-ta-${props.variant}`,
                textarea: 'prop-ta-inner',
                count: 'prop-ta-count',
              })}
              styles={{
                root: { borderColor: 'orange' },
                textarea: { color: 'navy' },
                count: { color: 'teal' },
              }}
            />
          ),
        },
      });
      const rootEl = wShowCount.find('.ant-input-textarea');
      expect(rootEl.classes()).toContain('ctx-ta-filled');
      expect(rootEl.classes()).toContain('prop-ta-filled');
      expect(rootEl.attributes('style')).toContain('margin: 4px');
      expect(rootEl.attributes('style')).toContain('border-color: orange');

      const taEl = wShowCount.find('textarea');
      expect(taEl.classes()).toContain('ctx-ta-inner');
      expect(taEl.classes()).toContain('prop-ta-inner');
      expect(taEl.attributes('style')).toContain('line-height: 20px');
      expect(taEl.attributes('style')).toContain('color: navy');

      const countEl = wShowCount.find('.ant-input-data-count');
      expect(countEl.classes()).toContain('prop-ta-count');
      expect(countEl.attributes('style')).toContain('color: teal');

      const wClear = mount(TextArea, {
        props: {
          allowClear: true,
          classNames: () => ({ root: 'ta-clear-root', textarea: 'ta-clear-inner' }),
          styles: () => ({ root: { background: 'yellow' }, textarea: { fontSize: '15px' } }),
        },
      });
      expect(wClear.find('.ant-input-affix-wrapper').classes()).toContain('ta-clear-root');
      expect(wClear.find('.ant-input-affix-wrapper').attributes('style')).toContain(
        'background: yellow',
      );
      expect(wClear.find('textarea').classes()).toContain('ta-clear-inner');
      expect(wClear.find('textarea').attributes('style')).toContain('font-size: 15px');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('Input.Password supports functional classNames/styles and ConfigProvider.inputPassword merge', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        inputPassword: {
          classNames: ({ props }) => ({
            root: props.disabled ? 'ctx-pw-dis' : 'ctx-pw-en',
            input: 'ctx-pw-input',
          }),
          styles: {
            root: { padding: '3px' },
            suffix: { opacity: '0.8' },
          },
        },
      },
      slots: {
        default: () => (
          <Password
            prefix="L"
            classNames={({ props }) => ({
              root: `pw-root-${props.size || 'md'}`,
              prefix: 'pw-prefix',
              suffix: 'pw-suffix',
              input: 'pw-input',
            })}
            styles={() => ({
              root: { borderColor: 'cyan' },
              prefix: { color: 'rgb(10, 20, 30)' },
              suffix: { color: 'rgb(40, 50, 60)' },
              input: { color: 'rgb(70, 80, 90)' },
            })}
          />
        ),
      },
    });
    const root = wrapper.find('.ant-input-password');
    expect(root.classes()).toContain('ctx-pw-en');
    expect(root.classes()).toContain('pw-root-md');
    expect(root.attributes('style')).toContain('padding: 3px');
    expect(root.attributes('style')).toContain('border-color: cyan');
    expect(wrapper.find('.ant-input-prefix').classes()).toContain('pw-prefix');
    expect(wrapper.find('.ant-input-prefix').attributes('style')).toContain(
      'color: rgb(10, 20, 30)',
    );
    expect(wrapper.find('.ant-input-suffix').classes()).toContain('pw-suffix');
    expect(wrapper.find('.ant-input-suffix').attributes('style')).toContain('opacity: 0.8');
    expect(wrapper.find('.ant-input-suffix').attributes('style')).toContain(
      'color: rgb(40, 50, 60)',
    );
    expect(wrapper.find('input').classes()).toContain('ctx-pw-input');
    expect(wrapper.find('input').classes()).toContain('pw-input');
    expect(wrapper.find('input').attributes('style')).toContain('color: rgb(70, 80, 90)');
  });

  it('Input.Search supports functional classNames/styles and searchIcon prop, #searchIcon slot, and ConfigProvider.inputSearch.searchIcon', () => {
    const wrapper = mount(Search, {
      props: {
        prefix: 'P',
        suffix: 'S',
        showCount: true,
        value: 'ab',
        searchIcon: <span class="prop-search-icon">FIND</span>,
        classNames: ({ props }) => ({
          root: props.enterButton ? 'sr-root-btn' : 'sr-root-default',
          prefix: 'sr-prefix',
          suffix: 'sr-suffix',
          input: 'sr-input',
          count: 'sr-count',
        }),
        styles: () => ({
          root: { width: '260px' },
          prefix: { color: 'rgb(1, 1, 1)' },
          suffix: { color: 'rgb(2, 2, 2)' },
          input: { color: 'rgb(3, 3, 3)' },
          count: { color: 'rgb(4, 4, 4)' },
        }),
      },
    });

    expect(wrapper.find('.ant-input-search').classes()).toContain('sr-root-default');
    expect(wrapper.find('.ant-input-search').attributes('style')).toContain('width: 260px');
    expect(wrapper.find('.ant-input-prefix').classes()).toContain('sr-prefix');
    expect(wrapper.find('.ant-input-suffix').classes()).toContain('sr-suffix');
    expect(wrapper.find('input').classes()).toContain('sr-input');
    expect(wrapper.find('input').attributes('style')).toContain('color: rgb(3, 3, 3)');
    expect(wrapper.find('.ant-input-show-count-suffix').classes()).toContain('sr-count');
    expect(wrapper.find('.prop-search-icon').exists()).toBe(true);
    expect(wrapper.find('.anticon-search').exists()).toBe(false);

    // enterButton=true also uses searchIcon
    const wEnterTrue = mount(Search, {
      props: {
        enterButton: true,
        searchIcon: <span class="enter-true-icon">GO</span>,
      },
    });
    expect(wEnterTrue.find('.ant-btn-primary .enter-true-icon').exists()).toBe(true);
    expect(wEnterTrue.find('.anticon-search').exists()).toBe(false);

    // enterButton="Custom" renders text instead of searchIcon
    const wEnterText = mount(Search, {
      props: {
        enterButton: 'Submit',
        searchIcon: <span class="ignored-icon">GO</span>,
      },
    });
    expect(wEnterText.find('.ant-btn-primary').text()).toContain('Submit');
    expect(wEnterText.find('.ignored-icon').exists()).toBe(false);

    // #searchIcon slot
    const wSlot = mount(Search, {
      slots: {
        searchIcon: () => <span class="slot-search-icon">SLOT</span>,
      },
    });
    expect(wSlot.find('.slot-search-icon').exists()).toBe(true);
    expect(wSlot.find('.anticon-search').exists()).toBe(false);

    // ConfigProvider.inputSearch.searchIcon + functional classNames
    const wCtx = mount(ConfigProvider, {
      props: {
        inputSearch: {
          searchIcon: <span class="ctx-search-icon">CTX</span>,
          classNames: () => ({ root: 'ctx-sr-root' }),
        },
      },
      slots: { default: () => <Search /> },
    });
    expect(wCtx.find('.ctx-search-icon').exists()).toBe(true);
    expect(wCtx.find('.ant-input-search').classes()).toContain('ctx-sr-root');
  });

  it('Input.OTP supports functional classNames/styles for root, input, separator and ConfigProvider.otp merge', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          otp: {
            classNames: ({ props }) => ({
              root: `ctx-otp-${props.length}`,
              input: 'ctx-otp-cell',
              separator: 'ctx-otp-sep',
            }),
            styles: {
              root: { gap: '8px' },
              input: { textAlign: 'center' },
              separator: { opacity: '0.5' },
            },
          },
        },
        slots: {
          default: () => (
            <OTP
              length={4}
              separator="-"
              classNames={({ props }) => ({
                root: `prop-otp-${props.length}`,
                input: 'prop-otp-cell',
                separator: 'prop-otp-sep',
              })}
              styles={() => ({
                root: { padding: '4px' },
                input: { color: 'rgb(9, 8, 7)' },
                separator: { color: 'rgb(6, 5, 4)' },
              })}
            />
          ),
        },
      });

      const root = wrapper.find('.ant-otp');
      expect(root.classes()).toContain('ctx-otp-4');
      expect(root.classes()).toContain('prop-otp-4');
      expect(root.attributes('style')).toContain('gap: 8px');
      expect(root.attributes('style')).toContain('padding: 4px');

      const cells = wrapper.findAll('input.ant-otp-input');
      expect(cells).toHaveLength(4);
      expect(cells[0].classes()).toContain('ctx-otp-cell');
      expect(cells[0].classes()).toContain('prop-otp-cell');
      expect(cells[0].attributes('style')).toContain('text-align: center');
      expect(cells[0].attributes('style')).toContain('color: rgb(9, 8, 7)');

      const seps = wrapper.findAll('.ant-otp-separator');
      expect(seps).toHaveLength(3);
      expect(seps[0].classes()).toContain('ctx-otp-sep');
      expect(seps[0].classes()).toContain('prop-otp-sep');
      expect(seps[0].attributes('style')).toContain('opacity: 0.5');
      expect(seps[0].attributes('style')).toContain('color: rgb(6, 5, 4)');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
