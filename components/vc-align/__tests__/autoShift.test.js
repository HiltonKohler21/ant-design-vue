import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import Align from '../Align';
import { applyAutoShift } from '../autoShift';
import { getScrollableAncestors } from '../util';
import Popconfirm from '../../popconfirm';
import Popover from '../../popover';

function createRect(left, top, width, height) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe('vc-align scroll realignment & auto-shift', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('collects scrollable ancestors and window via getScrollableAncestors', () => {
    const outer = document.createElement('div');
    outer.style.overflow = 'auto';
    const middle = document.createElement('div');
    middle.style.overflow = 'visible';
    const inner = document.createElement('div');
    inner.style.overflowY = 'scroll';
    const btn = document.createElement('button');

    outer.appendChild(middle);
    middle.appendChild(inner);
    inner.appendChild(btn);
    document.body.appendChild(outer);

    const targets = getScrollableAncestors(btn);
    expect(targets).toContain(inner);
    expect(targets).toContain(outer);
    expect(targets).toContain(window);
    expect(targets).not.toContain(middle);
  });

  it('triggers forceAlign on scrollable ancestor scroll and cleans up on disabled/unmount', async () => {
    const container = document.createElement('div');
    container.style.overflow = 'auto';
    const target = document.createElement('button');
    container.appendChild(target);
    document.body.appendChild(container);

    // Ensure isVisible(target) returns true in jsdom
    Object.defineProperty(target, 'offsetWidth', { configurable: true, value: 120 });
    Object.defineProperty(target, 'offsetHeight', { configurable: true, value: 32 });
    target.getBoundingClientRect = () => createRect(200, 150, 120, 32);

    const onAlign = jest.fn();
    const wrapper = mount(Align, {
      props: {
        target: () => target,
        align: {
          points: ['bc', 'tc'],
          offset: [0, -4],
          overflow: { adjustX: 1, adjustY: 1 },
        },
        disabled: false,
        onAlign,
      },
      slots: {
        default: () => <div class="popup-box">Popup</div>,
      },
      attachTo: container,
    });

    await nextTick();
    const callsAfterMount = onAlign.mock.calls.length;
    expect(callsAfterMount).toBeGreaterThanOrEqual(1);

    // Dispatch scroll on scrollable ancestor
    container.dispatchEvent(new Event('scroll'));
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(onAlign.mock.calls.length).toBeGreaterThan(callsAfterMount);

    // Disable align -> scroll events should no longer trigger align
    const callsBeforeDisable = onAlign.mock.calls.length;
    await wrapper.setProps({ disabled: true });
    await nextTick();
    container.dispatchEvent(new Event('scroll'));
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(onAlign.mock.calls.length).toBe(callsBeforeDisable);

    wrapper.unmount();
  });

  it('auto-flips top <-> bottom, shifts horizontally with arrow tracking, and releases out of view', () => {
    const container = document.createElement('div');
    container.style.overflow = 'auto';
    container.style.position = 'relative';

    const target = document.createElement('button');
    const source = document.createElement('div');
    source.className = 'ant-popover ant-popover-placement-top';
    source.style.position = 'absolute';
    source.style.left = '0px';
    source.style.top = '0px';

    const content = document.createElement('div');
    content.className = 'ant-popover-content';
    const arrow = document.createElement('div');
    arrow.className = 'ant-popover-arrow';
    content.appendChild(arrow);
    source.appendChild(content);

    container.appendChild(target);
    container.appendChild(source);
    document.body.appendChild(container);

    // Container visible rect: [100..700] x [100..400] (600x300)
    container.getBoundingClientRect = () => createRect(100, 100, 600, 300);
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 600 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(arrow, 'offsetWidth', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetHeight', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetParent', { configurable: true, value: content });

    const popupW = 260;
    const popupH = 100;
    const syncSourceRect = (left, top) => {
      source.style.left = `${left - 100}px`;
      source.style.top = `${top - 100}px`;
      source.getBoundingClientRect = () => createRect(left, top, popupW, popupH);
      content.getBoundingClientRect = () => createRect(left, top, popupW, popupH);
    };

    const baseAlign = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: 1, adjustY: 1 },
    };
    const dummyResult = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: false, adjustY: false },
    };

    // 1. Centered button [330..470] x [240..272] -> stays top, no shift, arrow unstyled
    target.getBoundingClientRect = () => createRect(330, 240, 140, 32);
    syncSourceRect(270, 136);
    const r1 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r1.points).toEqual(['bc', 'tc']);
    expect(r1.offset).toEqual([0, -4]);
    expect(arrow.style.left).toBe('');

    // 2. Scrolled down so button is near top edge [330..470] x [115..147] -> flips to bottom
    target.getBoundingClientRect = () => createRect(330, 115, 140, 32);
    syncSourceRect(270, 11);
    const r2 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r2.points).toEqual(['tc', 'bc']);
    expect(r2.offset).toEqual([0, 4]);
    expect(parseFloat(source.style.top)).toBe(51);

    // 3. Scrolled up so button is near bottom edge [330..470] x [340..372] -> flips back to top
    target.getBoundingClientRect = () => createRect(330, 340, 140, 32);
    syncSourceRect(270, 376);
    const r3 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r3.points).toEqual(['bc', 'tc']);
    expect(r3.offset).toEqual([0, -4]);
    expect(parseFloat(source.style.top)).toBe(136);

    // 4. Horizontal scroll: button near right edge [550..690] x [240..272] (centerX = 620)
    target.getBoundingClientRect = () => createRect(550, 240, 140, 32);
    syncSourceRect(490, 136);
    const r4 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r4.points).toEqual(['bc', 'tc']);
    expect(parseFloat(source.style.left)).toBe(340);
    expect(arrow.style.left).toBe('180px');

    // 5. Button completely scrolled out above top edge [330..470] x [20..52]
    target.getBoundingClientRect = () => createRect(330, 20, 140, 32);
    syncSourceRect(270, 100);
    const r5 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r5.points).toEqual(['bc', 'tc']);
    expect(parseFloat(source.style.top)).toBe(-184);
    expect(arrow.style.left).toBe('');
  });

  it('mounts popup into delayed containerRef and exposes forceAlign/forcePopupAlign on Popconfirm & Popover', async () => {
    const getPopupContainerSpy = jest.fn(triggerNode => triggerNode.parentElement);
    const Demo = defineComponent({
      setup() {
        const containerRef = ref(null);
        const popconfirmRef = ref(null);
        const popoverRef = ref(null);
        return { containerRef, popconfirmRef, popoverRef };
      },
      render() {
        return (
          <div>
            <div ref="containerRef" class="custom-scroll-box">
              <Popconfirm
                ref="popconfirmRef"
                title="Confirm?"
                open
                getPopupContainer={() => this.containerRef}
              >
                <button>Popconfirm Trigger</button>
              </Popconfirm>
            </div>
            <div class="parent-box">
              <Popover
                ref="popoverRef"
                content="Hello"
                open
                getPopupContainer={getPopupContainerSpy}
              >
                <button>Popover Trigger</button>
              </Popover>
            </div>
          </div>
        );
      },
    });

    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 60));

    const scrollBox = wrapper.element.querySelector('.custom-scroll-box');
    const parentBox = wrapper.element.querySelector('.parent-box');

    expect(scrollBox.querySelector('.ant-popconfirm')).toBeTruthy();
    expect(getPopupContainerSpy).toHaveBeenCalled();
    getPopupContainerSpy.mock.calls.forEach(([arg]) => {
      expect(arg).toBeInstanceOf(HTMLElement);
    });
    expect(parentBox.querySelector('.ant-popover')).toBeTruthy();

    expect(typeof wrapper.vm.popconfirmRef.forceAlign).toBe('function');
    expect(typeof wrapper.vm.popconfirmRef.forcePopupAlign).toBe('function');
    expect(typeof wrapper.vm.popoverRef.forceAlign).toBe('function');
    expect(typeof wrapper.vm.popoverRef.forcePopupAlign).toBe('function');
    expect(() => wrapper.vm.popconfirmRef.forceAlign()).not.toThrow();
    expect(() => wrapper.vm.popoverRef.forcePopupAlign()).not.toThrow();

    wrapper.unmount();
  });
});
