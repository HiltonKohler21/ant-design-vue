import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '..';
import ConfigProvider from '../../config-provider';

jest.mock('../../_util/Portal');

describe('Modal loading, closable object, mask object, and ComponentTokens', () => {
  it('renders Skeleton inside body and hides footer when loading is true', async () => {
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        title: 'Loading Modal',
        loading: true,
      },
      slots: {
        default: () => <div class="real-body">Real Body</div>,
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-modal-body-skeleton').exists()).toBe(true);
    expect(wrapper.find('.real-body').exists()).toBe(false);
    expect(wrapper.find('.ant-modal-footer').exists()).toBe(false);

    await wrapper.setProps({ loading: false });
    await nextTick();
    expect(wrapper.find('.ant-modal-body-skeleton').exists()).toBe(false);
    expect(wrapper.find('.real-body').exists()).toBe(true);
    expect(wrapper.find('.ant-modal-footer').exists()).toBe(true);
    wrapper.unmount();
  });

  it('supports closable object config (closeIcon, disabled, aria-label, onClose, afterClose)', async () => {
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const closableAfterClose = jest.fn();
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        onCancel,
        closable: {
          closeIcon: <span class="custom-close-icon">X</span>,
          disabled: true,
          'aria-label': 'Custom Close',
          onClose,
          afterClose: closableAfterClose,
        },
      },
      slots: {
        default: () => 'Body',
      },
    });
    await nextTick();
    const closeBtn = wrapper.find('.ant-modal-close');
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.attributes('aria-label')).toBe('Custom Close');
    expect(closeBtn.attributes('disabled')).toBeDefined();
    expect(wrapper.find('.custom-close-icon').exists()).toBe(true);

    await closeBtn.trigger('click');
    expect(onCancel).not.toHaveBeenCalled();

    await wrapper.setProps({
      closable: {
        closeIcon: <span class="custom-close-icon">X</span>,
        disabled: false,
        'aria-label': 'Active Close',
        onClose,
        afterClose: closableAfterClose,
      },
    });
    await nextTick();
    const activeBtn = wrapper.find('.ant-modal-close');
    expect(activeBtn.attributes('aria-label')).toBe('Active Close');
    expect(activeBtn.attributes('disabled')).toBeUndefined();
    await activeBtn.trigger('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Invoke Dialog afterClose callback to verify closable.afterClose fires
    const vcDialog = wrapper.findComponent({ name: 'VcDialog' });
    vcDialog.props('afterClose')?.();
    expect(closableAfterClose).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('supports mask object config (enabled, blur, closable)', async () => {
    const onCancel = jest.fn();
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        onCancel,
        mask: {
          enabled: true,
          blur: true,
          closable: false,
        },
      },
      slots: {
        default: () => 'Body',
      },
    });
    await nextTick();
    const maskEl = wrapper.find('.ant-modal-mask');
    expect(maskEl.exists()).toBe(true);
    expect(maskEl.classes()).toContain('ant-modal-mask-blur');

    await wrapper.find('.ant-modal-wrap').trigger('click');
    expect(onCancel).not.toHaveBeenCalled();
    wrapper.unmount();

    const hiddenMaskWrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        mask: { enabled: false },
      },
      slots: {
        default: () => 'Body',
      },
    });
    await nextTick();
    expect(hiddenMaskWrapper.find('.ant-modal-mask').element.style.display).toBe('none');
    hiddenMaskWrapper.unmount();
  });

  it('emits Modal ComponentTokens in cssVar mode without illegal CSS', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            Modal: {
              headerBg: '#fafafa',
              titleLineHeight: 1.6,
              titleFontSize: 18,
              titleColor: '#111111',
              contentBg: '#ffffff',
              footerBg: '#f5f5f5',
              closeBtnHoverBg: '#eeeeee',
            },
          },
        },
      },
      slots: {
        default: () => (
          <Modal getContainer={false} open title="Token Modal">
            Body
          </Modal>
        ),
      },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 50));
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-modal-header-bg');
    expect(css).toContain('--ant-modal-title-line-height:1.6');
    expect(css).not.toContain('--ant-modal-title-line-height:1.6px');
    expect(css).toContain('--ant-modal-title-font-size');
    expect(css).toContain('--ant-modal-title-color');
    expect(css).toContain('--ant-modal-content-bg');
    expect(css).toContain('--ant-modal-footer-bg');
    expect(css).toContain('--ant-modal-close-btn-hover-bg');
    expect(css).not.toContain('NaN');
    wrapper.unmount();
  });
});
