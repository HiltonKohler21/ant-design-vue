import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import Tour from '..';
import ConfigProvider from '../../config-provider';

const steps = [
  { title: 'Step 1', description: 'First step' },
  { title: 'Step 2', description: 'Second step' },
  { title: 'Step 3', description: 'Third step' },
];

describe('Tour v6 features: indicatorsRender prop, keyboard, ComponentToken', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('supports indicatorsRender prop (current, total) => VueNode', async () => {
    const calls = [];
    const wrapper = mount(Tour, {
      props: {
        open: true,
        current: 1,
        steps,
        indicatorsRender: (current, total) => {
          calls.push([current, total]);
          return <span class="prop-indicator">{`${current + 1} / ${total}`}</span>;
        },
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 60));
    expect(document.body.querySelector('.prop-indicator')?.textContent).toBe('2 / 3');
    expect(calls[calls.length - 1]).toEqual([1, 3]);
    wrapper.unmount();
  });

  it('handles ArrowRight, ArrowLeft, and Escape when keyboard is enabled (default true)', async () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const wrapper = mount(Tour, {
      props: {
        open: true,
        steps,
        onChange,
        onClose,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 60));
    expect(document.body.querySelector('.ant-tour-title')?.textContent).toBe('Step 1');

    // ArrowLeft at step 0 should be a no-op
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    // ArrowRight -> step 1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(document.body.querySelector('.ant-tour-title')?.textContent).toBe('Step 2');

    // ArrowRight -> step 2 (last step)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(document.body.querySelector('.ant-tour-title')?.textContent).toBe('Step 3');

    // ArrowRight at last step should be a no-op
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(2);

    // ArrowLeft -> step 1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(document.body.querySelector('.ant-tour-title')?.textContent).toBe('Step 2');

    // Escape -> close with current step 1
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(onClose).toHaveBeenCalledWith(1);

    wrapper.unmount();
  });

  it('ignores keyboard navigation when keyboard={false} or tour is closed, and cleans up listener', async () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const onChange = jest.fn();
    const onClose = jest.fn();
    const open = ref(true);
    const keyboard = ref(false);

    const wrapper = mount({
      setup() {
        return () => (
          <Tour
            open={open.value}
            keyboard={keyboard.value}
            steps={steps}
            onChange={onChange}
            onClose={onClose}
          />
        );
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 40));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    // Enable keyboard -> listener registered
    keyboard.value = true;
    await nextTick();
    const addedCount = addSpy.mock.calls.filter(c => c[0] === 'keydown').length;
    expect(addedCount).toBeGreaterThanOrEqual(1);

    // Close tour -> listener removed and keydown ignored
    open.value = false;
    await nextTick();
    const removedAfterClose = removeSpy.mock.calls.filter(c => c[0] === 'keydown').length;
    expect(removedAfterClose).toBeGreaterThanOrEqual(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    wrapper.unmount();
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('emits ComponentToken CSS vars (unitless zIndexPopup, closeBtnSize, primaryPrevBtnBg, primaryNextBtnHoverBg)', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            Tour: {
              zIndexPopup: 2500,
              closeBtnSize: 28,
              primaryPrevBtnBg: 'rgba(0, 0, 0, 0.25)',
              primaryNextBtnHoverBg: 'rgb(240, 240, 240)',
            },
          },
        },
      },
      slots: {
        default: () => <Tour open type="primary" steps={steps} />,
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 60));

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-tour-z-index-popup:2500');
    expect(css).not.toContain('--ant-tour-z-index-popup:2500px');
    expect(css).toContain('--ant-tour-close-btn-size:28px');
    expect(css).toContain('--ant-tour-primary-prev-btn-bg:rgba(0, 0, 0, 0.25)');
    expect(css).toContain('--ant-tour-primary-next-btn-hover-bg:rgb(240, 240, 240)');
    expect(css).not.toContain('NaN');
    expect(css).not.toContain('undefined');

    wrapper.unmount();
  });
});
