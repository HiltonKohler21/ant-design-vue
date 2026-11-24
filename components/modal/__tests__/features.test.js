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

  it('supports footer render function prop and scoped slot on Modal', async () => {
    const onOk = jest.fn();
    const onCancel = jest.fn();
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        title: 'Footer Render',
        onOk,
        onCancel,
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <button type="button" class="extra-custom-btn">
              Custom
            </button>
            <CancelBtn />
            <OkBtn />
          </>
        ),
      },
      slots: { default: () => 'Body' },
    });
    await nextTick();
    expect(wrapper.find('.extra-custom-btn').exists()).toBe(true);
    const buttons = wrapper.findAll('.ant-modal-footer .ant-btn');
    expect(buttons).toHaveLength(2);
    await buttons[0].trigger('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
    await buttons[1].trigger('click');
    expect(onOk).toHaveBeenCalledTimes(1);
    wrapper.unmount();

    const onSlotOk = jest.fn();
    const slotWrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        title: 'Footer Scoped Slot',
        onOk: onSlotOk,
      },
      slots: {
        default: () => 'Body',
        footer: ({ originNode, OkBtn }) => (
          <div class="scoped-footer">
            {originNode}
            <OkBtn />
          </div>
        ),
      },
    });
    await nextTick();
    expect(slotWrapper.find('.scoped-footer').exists()).toBe(true);
    const slotBtns = slotWrapper.findAll('.scoped-footer .ant-btn');
    expect(slotBtns).toHaveLength(3);
    await slotBtns[2].trigger('click');
    expect(onSlotOk).toHaveBeenCalledTimes(1);
    slotWrapper.unmount();
  });

  it('supports responsive Breakpoint width object', async () => {
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        title: 'Responsive Width',
        width: {
          xs: '90%',
          sm: '80%',
          md: 600,
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        },
      },
      slots: { default: () => 'Body' },
    });
    await nextTick();
    const modalEl = wrapper.find('.ant-modal').element;
    expect(modalEl.style.getPropertyValue('--ant-modal-xs-width')).toBe('90%');
    expect(modalEl.style.getPropertyValue('--ant-modal-sm-width')).toBe('80%');
    expect(modalEl.style.getPropertyValue('--ant-modal-md-width')).toBe('600px');
    expect(modalEl.style.getPropertyValue('--ant-modal-xxl-width')).toBe('40%');
    expect(modalEl.style.width).toBe('');
    wrapper.unmount();
  });

  it('renders PurePanel (_InternalPanelDoNotUseOrYouWillBeFired) for normal, confirm, and custom footer', async () => {
    const InternalPanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;
    const normalWrapper = mount(InternalPanel, {
      props: { title: 'Hello World!' },
      slots: { default: () => 'Hello World?!' },
    });
    await nextTick();
    expect(normalWrapper.find('.ant-modal-pure-panel').exists()).toBe(true);
    expect(normalWrapper.find('.ant-modal-title').text()).toBe('Hello World!');
    expect(normalWrapper.find('.ant-modal-close').exists()).toBe(true);
    expect(normalWrapper.findAll('.ant-modal-footer .ant-btn')).toHaveLength(2);
    normalWrapper.unmount();

    const confirmWrapper = mount(InternalPanel, {
      props: { title: 'Confirm This?', type: 'confirm' },
      slots: { default: () => 'Some descriptions.' },
    });
    await nextTick();
    expect(confirmWrapper.find('.ant-modal-confirm-confirm').exists()).toBe(true);
    expect(confirmWrapper.find('.ant-modal-confirm-title').text()).toBe('Confirm This?');
    expect(confirmWrapper.find('.ant-modal-close').exists()).toBe(false);
    expect(confirmWrapper.findAll('.ant-modal-confirm-btns .ant-btn')).toHaveLength(2);
    confirmWrapper.unmount();

    const customFooterWrapper = mount(InternalPanel, {
      props: {
        title: 'Custom Footer Render',
        footer: (originNode, { OkBtn, CancelBtn }) => (
          <div class="pure-custom-footer">
            {originNode}
            <CancelBtn />
            <OkBtn />
          </div>
        ),
      },
      slots: { default: () => 'Content' },
    });
    await nextTick();
    expect(customFooterWrapper.find('.pure-custom-footer').exists()).toBe(true);
    expect(customFooterWrapper.findAll('.pure-custom-footer .ant-btn')).toHaveLength(4);
    customFooterWrapper.unmount();
  });

  it('supports footer render function on Modal.confirm and await on Modal.useModal', async () => {
    let confirmedResult;
    const Demo = {
      setup() {
        const [modal, contextHolder] = Modal.useModal();
        const trigger = async () => {
          confirmedResult = await modal.confirm({
            title: 'Hook Confirm',
            content: 'Body',
            footer: (_, { OkBtn, CancelBtn }) => (
              <div class="confirm-custom-footer">
                <CancelBtn />
                <OkBtn />
              </div>
            ),
          });
        };
        return () => (
          <div>
            <button type="button" class="open-hook-btn" onClick={trigger}>
              Open
            </button>
            {contextHolder()}
          </div>
        );
      },
    };
    const wrapper = mount(Demo, { attachTo: 'body' });
    await wrapper.find('.open-hook-btn').trigger('click');
    await nextTick();
    const customFooter = document.body.querySelector('.confirm-custom-footer');
    expect(customFooter).not.toBeNull();
    const okBtn = customFooter.querySelector('.ant-btn-primary');
    okBtn.click();
    await nextTick();
    await Promise.resolve();
    expect(confirmedResult).toBe(true);
    wrapper.unmount();
    document.body.innerHTML = '';
  });
});
