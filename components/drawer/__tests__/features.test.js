import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Drawer from '..';
import VcDrawer from '../../vc-drawer';
import { asyncExpect } from '../../../tests/utils';

describe('Drawer afterOpenChange, closable object, mask object, and resizable', () => {
  it('supports afterOpenChange callback prop alongside @afterOpenChange', async () => {
    const afterOpenChange = jest.fn();
    const afterVisibleChange = jest.fn();
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        getContainer: false,
        afterOpenChange,
        afterVisibleChange,
      },
      slots: {
        default: () => 'Body',
      },
    });
    await nextTick();
    const vcDrawer = wrapper.findComponent(VcDrawer);
    vcDrawer.props('afterVisibleChange')?.(true);
    expect(afterOpenChange).toHaveBeenCalledWith(true);
    expect(afterVisibleChange).toHaveBeenCalledWith(true);
    expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([true]);

    vcDrawer.props('afterVisibleChange')?.(false);
    expect(afterOpenChange).toHaveBeenCalledWith(false);
    wrapper.unmount();
  });

  it('supports closable object config (closeIcon, disabled, placement, aria-label)', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Closable Drawer',
        getContainer: false,
        onClose,
        closable: {
          closeIcon: <span class="drawer-custom-close">X</span>,
          disabled: true,
          placement: 'end',
          'aria-label': 'Close Panel',
        },
      },
      slots: {
        default: () => 'Body',
      },
    });
    await asyncExpect(() => {
      const closeBtn = wrapper.find('.ant-drawer-close');
      expect(closeBtn.exists()).toBe(true);
      expect(closeBtn.classes()).toContain('ant-drawer-close-end');
      expect(closeBtn.attributes('aria-label')).toBe('Close Panel');
      expect(closeBtn.attributes('disabled')).toBeDefined();
      expect(wrapper.find('.drawer-custom-close').exists()).toBe(true);
      closeBtn.trigger('click');
      expect(onClose).not.toHaveBeenCalled();
    });

    await wrapper.setProps({
      closable: {
        closeIcon: <span class="drawer-custom-close">X</span>,
        disabled: false,
        placement: 'start',
        'aria-label': 'Close Start',
      },
    });
    await asyncExpect(() => {
      const closeBtn = wrapper.find('.ant-drawer-close');
      expect(closeBtn.classes()).not.toContain('ant-drawer-close-end');
      expect(closeBtn.attributes('aria-label')).toBe('Close Start');
      expect(closeBtn.attributes('disabled')).toBeUndefined();
      closeBtn.trigger('click');
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    wrapper.unmount();
  });

  it('supports mask object config (enabled, blur, closable)', async () => {
    const onClose = jest.fn();
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        getContainer: false,
        onClose,
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
    await asyncExpect(() => {
      const mask = wrapper.find('.ant-drawer-mask');
      expect(mask.exists()).toBe(true);
      expect(mask.classes()).toContain('ant-drawer-mask-blur');
      mask.trigger('click');
      expect(onClose).not.toHaveBeenCalled();
    });
    wrapper.unmount();

    const noMaskWrapper = mount(Drawer, {
      props: {
        open: true,
        getContainer: false,
        mask: { enabled: false },
      },
      slots: {
        default: () => 'No Mask Body',
      },
    });
    await asyncExpect(() => {
      expect(noMaskWrapper.find('.ant-drawer-mask').exists()).toBe(false);
      expect(noMaskWrapper.find('.ant-drawer').classes()).toContain('no-mask');
    });
    noMaskWrapper.unmount();
  });

  it('supports resizable drag handle for right/left/top/bottom placements and cleans up listeners', async () => {
    const onResizeStart = jest.fn();
    const onResize = jest.fn();
    const onResizeEnd = jest.fn();
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        placement: 'right',
        width: 300,
        getContainer: false,
        resizable: {
          onResizeStart,
          onResize,
          onResizeEnd,
        },
      },
      slots: {
        default: () => 'Resizable Body',
      },
    });
    await asyncExpect(() => {
      const dragger = wrapper.find('.ant-drawer-resizable-dragger-right');
      expect(dragger.exists()).toBe(true);
      dragger.trigger('mousedown', { button: 0, clientX: 500, clientY: 100 });
      expect(onResizeStart).toHaveBeenCalledTimes(1);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 400, clientY: 100 }));
      expect(onResize).toHaveBeenCalledWith(400);

      window.dispatchEvent(new MouseEvent('mouseup'));
      expect(onResizeEnd).toHaveBeenCalledTimes(1);
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-drawer-content-wrapper').element.style.width).toBe('400px');
    });

    // Further mousemove after mouseup should NOT trigger onResize
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 100 }));
    expect(onResize).toHaveBeenCalledTimes(1);

    // Test top placement vertical resize
    await wrapper.setProps({ placement: 'top', height: 200 });
    await asyncExpect(() => {
      const topDragger = wrapper.find('.ant-drawer-resizable-dragger-top');
      expect(topDragger.exists()).toBe(true);
      topDragger.trigger('mousedown', { button: 0, clientX: 100, clientY: 200 });
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 320 }));
      expect(onResize).toHaveBeenLastCalledWith(320);
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-drawer-content-wrapper').element.style.height).toBe('320px');
    });

    // Unmount mid-drag should clean up listeners safely
    const topDragger = wrapper.find('.ant-drawer-resizable-dragger-top');
    topDragger.trigger('mousedown', { button: 0, clientX: 100, clientY: 200 });
    const countBeforeUnmount = onResize.mock.calls.length;
    wrapper.unmount();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 450 }));
    expect(onResize.mock.calls.length).toBe(countBeforeUnmount);
  });
});
