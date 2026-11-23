import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Alert from '..';
import ConfigProvider from '../../config-provider';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('could be closed', () => {
    const onClose = jest.fn();
    const afterClose = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Alert
            message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
            type="warning"
            closable
            onClose={onClose}
            afterClose={afterClose}
            ref="alert"
          />
        );
      },
    });
    wrapper.find('.ant-alert-close-icon').trigger('click');
    expect(onClose).toHaveBeenCalled();
    jest.runAllTimers();
    wrapper.vm.$refs.alert.animationEnd();
    expect(afterClose).toHaveBeenCalled();
  });

  describe('data and aria props', () => {
    it('sets data attributes on input', () => {
      const wrapper = mount({
        render() {
          return <Alert data-test="test-id" data-id="12345" />;
        },
      });
      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('data-test')).toBe('test-id');
      expect(input.getAttribute('data-id')).toBe('12345');
    });

    it('sets aria attributes on input', () => {
      const wrapper = mount({
        render() {
          return <Alert aria-describedby="some-label" />;
        },
      });

      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('aria-describedby')).toBe('some-label');
    });

    it('sets role attribute on input', () => {
      const wrapper = mount({
        render() {
          return <Alert role="status" />;
        },
      });

      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('role')).toBe('status');
    });
  });

  it('supports action prop without leaking action attribute to DOM, and preserves action slot', () => {
    const wrapperProp = mount(Alert, {
      props: {
        message: 'Info',
        action: <button class="prop-action">Undo</button>,
      },
    });
    expect(wrapperProp.find('.ant-alert-action .prop-action').exists()).toBe(true);
    expect(wrapperProp.find('.ant-alert-actions .prop-action').exists()).toBe(true);
    expect(wrapperProp.find('.ant-alert').element.hasAttribute('action')).toBe(false);

    const wrapperSlot = mount(Alert, {
      props: { message: 'Info' },
      slots: { action: () => <button class="slot-action">Detail</button> },
    });
    expect(wrapperSlot.find('.ant-alert-action .slot-action').exists()).toBe(true);
  });

  it('supports ConfigProvider.alert className, style, closable, closeIcon, and type icons', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        alert: {
          className: 'ctx-alert-cls',
          style: { marginTop: '12px' },
          closable: true,
          closeIcon: <span class="ctx-close-icon">X</span>,
          successIcon: <span class="ctx-success-icon">OK</span>,
        },
      },
      slots: {
        default: () => <Alert type="success" showIcon message="Success" />,
      },
    });
    const alertEl = wrapper.find('.ant-alert');
    expect(alertEl.classes()).toContain('ctx-alert-cls');
    expect(alertEl.element.getAttribute('style')).toContain('margin-top: 12px');
    expect(wrapper.find('.ant-alert-close-icon .ctx-close-icon').exists()).toBe(true);
    expect(wrapper.find('.ctx-success-icon').exists()).toBe(true);
  });

  it('supports v6 title prop and slot with message fallback', () => {
    const wrapperProp = mount(Alert, {
      props: { title: 'V6 Title', message: 'Legacy Message' },
    });
    expect(wrapperProp.find('.ant-alert-title').text()).toBe('V6 Title');
    expect(wrapperProp.find('.ant-alert-message').text()).toBe('V6 Title');

    const wrapperSlot = mount(Alert, {
      slots: { title: () => <span class="slot-title">Slot Title</span> },
    });
    expect(wrapperSlot.find('.slot-title').text()).toBe('Slot Title');

    const wrapperFallback = mount(Alert, {
      props: { message: 'Legacy Only' },
    });
    expect(wrapperFallback.find('.ant-alert-title').text()).toBe('Legacy Only');
  });

  it('supports variant outlined and filled with real CSS and ConfigProvider.alert.variant', async () => {
    document.head.innerHTML = '';
    const wrapperDefault = mount(Alert, { props: { title: 'Default' } });
    expect(wrapperDefault.find('.ant-alert').classes()).toContain('ant-alert-outlined');

    const wrapperFilled = mount(Alert, { props: { title: 'Filled', variant: 'filled' } });
    expect(wrapperFilled.find('.ant-alert').classes()).toContain('ant-alert-filled');

    const wrapperCtx = mount(ConfigProvider, {
      props: { alert: { variant: 'filled' } },
      slots: { default: () => <Alert title="Ctx Filled" /> },
    });
    expect(wrapperCtx.find('.ant-alert').classes()).toContain('ant-alert-filled');

    await nextTick();
    const css = collectCss();
    expect(css).toContain('ant-alert-filled');
    expect(css).toContain('border-color:transparent');
  });

  it('supports closable object config (closeIcon, disabled, onClose, afterClose, aria-label)', () => {
    const onClose = jest.fn();
    const afterClose = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Alert
            ref="alert"
            title="Closable Object"
            closable={{
              closeIcon: <span class="obj-close">Close</span>,
              'aria-label': 'Dismiss alert',
              onClose,
              afterClose,
            }}
          />
        );
      },
    });
    const btn = wrapper.find('.ant-alert-close-icon');
    expect(btn.exists()).toBe(true);
    expect(btn.attributes('aria-label')).toBe('Dismiss alert');
    expect(btn.find('.obj-close').exists()).toBe(true);
    btn.trigger('click');
    expect(onClose).toHaveBeenCalledTimes(1);
    wrapper.vm.$refs.alert.animationEnd();
    expect(afterClose).toHaveBeenCalledTimes(1);

    const onDisabledClose = jest.fn();
    const wrapperDisabled = mount(Alert, {
      props: {
        title: 'Disabled Close',
        closable: { disabled: true, onClose: onDisabledClose },
      },
    });
    const disabledBtn = wrapperDisabled.find('.ant-alert-close-icon');
    expect(disabledBtn.attributes('disabled')).toBeDefined();
    disabledBtn.trigger('click');
    expect(onDisabledClose).not.toHaveBeenCalled();
  });

  it('supports semantic classNames and styles (object and functional)', () => {
    const wrapperObj = mount(Alert, {
      props: {
        title: 'Title',
        description: 'Desc',
        showIcon: true,
        closable: true,
        action: <button>Act</button>,
        classNames: {
          root: 'sem-root',
          icon: 'sem-icon',
          section: 'sem-section',
          title: 'sem-title',
          description: 'sem-desc',
          actions: 'sem-actions',
          close: 'sem-close',
        },
        styles: {
          root: { padding: '10px' },
          title: { fontWeight: '700' },
          description: { opacity: '0.8' },
          actions: { marginLeft: '12px' },
          close: { color: 'red' },
        },
      },
    });
    expect(wrapperObj.find('.ant-alert').classes()).toContain('sem-root');
    expect(wrapperObj.find('.ant-alert').attributes('style')).toContain('padding: 10px');
    expect(wrapperObj.find('.ant-alert-icon').classes()).toContain('sem-icon');
    expect(wrapperObj.find('.ant-alert-section').classes()).toContain('sem-section');
    expect(wrapperObj.find('.ant-alert-title').classes()).toContain('sem-title');
    expect(wrapperObj.find('.ant-alert-title').attributes('style')).toContain('font-weight: 700');
    expect(wrapperObj.find('.ant-alert-description').classes()).toContain('sem-desc');
    expect(wrapperObj.find('.ant-alert-actions').classes()).toContain('sem-actions');
    expect(wrapperObj.find('.ant-alert-close-icon').classes()).toContain('sem-close');

    const wrapperFn = mount(Alert, {
      props: {
        type: 'warning',
        variant: 'filled',
        title: 'Fn Title',
        classNames: ({ props }) => ({
          root: `fn-${props.type}-${props.variant}`,
          title: 'fn-title',
        }),
        styles: ({ props }) => ({
          root: { borderRadius: props.variant === 'filled' ? '12px' : '4px' },
        }),
      },
    });
    expect(wrapperFn.find('.ant-alert').classes()).toContain('fn-warning-filled');
    expect(wrapperFn.find('.ant-alert').attributes('style')).toContain('border-radius: 12px');
    expect(wrapperFn.find('.ant-alert-title').classes()).toContain('fn-title');
  });

  it('supports Alert.ErrorBoundary catching descendant errors', async () => {
    const Thrower = defineComponent({
      setup() {
        return () => {
          throw new Error('Boom Error');
        };
      },
    });

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount({
      render() {
        return (
          <Alert.ErrorBoundary title="Caught Title" description="Custom Stack">
            <Thrower />
          </Alert.ErrorBoundary>
        );
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-alert-error').exists()).toBe(true);
    expect(wrapper.find('.ant-alert-title').text()).toBe('Caught Title');
    expect(wrapper.find('.ant-alert-description pre').text()).toBe('Custom Stack');

    const wrapperDefault = mount({
      render() {
        return (
          <Alert.ErrorBoundary>
            <Thrower />
          </Alert.ErrorBoundary>
        );
      },
    });
    await nextTick();
    expect(wrapperDefault.find('.ant-alert-error').exists()).toBe(true);
    expect(wrapperDefault.find('.ant-alert-title').text()).toContain('Boom Error');
    warnSpy.mockRestore();
  });

  it('wires Alert ComponentToken CSS variables', async () => {
    document.head.innerHTML = '';
    mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            Alert: {
              containerBorderRadius: 16,
              defaultPadding: '10px 14px',
              withDescriptionPadding: '22px 26px',
              withDescriptionIconSize: 28,
            },
          },
        },
      },
      slots: { default: () => <Alert title="Token Test" /> },
    });
    await nextTick();
    const css = collectCss();
    expect(css).toContain('--ant-alert-container-border-radius:16px');
    expect(css).toContain('--ant-alert-default-padding:10px 14px');
    expect(css).toContain('--ant-alert-with-description-padding:22px 26px');
    expect(css).toContain('--ant-alert-with-description-icon-size:28px');
  });
});
