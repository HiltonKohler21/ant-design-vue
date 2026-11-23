import { mount } from '@vue/test-utils';
import Alert from '..';
import ConfigProvider from '../../config-provider';

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
});
