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

    // 5. Smooth scroll-out when target just left top edge [330..470] x [20..52]:
    // bottom popup [56..156] is still partially visible inside [100..400], so it stays bottom without teleporting
    target.getBoundingClientRect = () => createRect(330, 20, 140, 32);
    syncSourceRect(270, 56);
    const r5 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r5.points).toEqual(['tc', 'bc']);
    expect(parseFloat(source.style.top)).toBe(-44);

    // 6. Once target AND both top/bottom popups are completely outside [100..400], cleanly resets offscreen to top
    target.getBoundingClientRect = () => createRect(330, -120, 140, 32);
    syncSourceRect(270, -84);
    const r6 = applyAutoShift(source, target, baseAlign, dummyResult);
    expect(r6.points).toEqual(['bc', 'tc']);
    expect(parseFloat(source.style.top)).toBe(-324);
    expect(arrow.style.left).toBe('');
  });

  it('recovers natural un-squished dimensions at right edge and never overlaps trigger even with shiftX/shiftY', () => {
    const container = document.createElement('div');
    container.style.overflow = 'auto';
    container.style.position = 'relative';

    const target = document.createElement('button');
    const source = document.createElement('div');
    source.className = 'ant-popover ant-popover-placement-top';
    source.style.position = 'absolute';
    source.style.left = '520px';
    source.style.top = '100px';

    const content = document.createElement('div');
    content.className = 'ant-popover-content';
    const arrow = document.createElement('div');
    arrow.className = 'ant-popover-arrow';
    content.appendChild(arrow);
    source.appendChild(content);

    container.appendChild(target);
    container.appendChild(source);
    document.body.appendChild(container);

    // Container [0..580] x [0..300]
    container.getBoundingClientRect = () => createRect(0, 0, 580, 300);
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 580 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(source, 'offsetParent', { configurable: true, value: container });
    Object.defineProperty(arrow, 'offsetWidth', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetHeight', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetParent', { configurable: true, value: content });

    // Simulate CSS right-edge shrink-to-fit when source.style.left >= 500px
    source.getBoundingClientRect = () => {
      const l = parseFloat(source.style.left) || 0;
      const t = parseFloat(source.style.top) || 0;
      const squished = l >= 500;
      return createRect(l, t, squished ? 60 : 260, squished ? 190 : 58);
    };
    content.getBoundingClientRect = () => source.getBoundingClientRect();

    // Button near right edge [480..636] x [134..166]
    target.getBoundingClientRect = () => createRect(480, 134, 156, 32);

    const alignWithShift = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: 1, adjustY: 1, shiftX: true, shiftY: true },
    };
    const dummyResult = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: false, adjustY: false },
    };

    const res = applyAutoShift(source, target, alignWithShift, dummyResult);
    const finalLeft = parseFloat(source.style.left);
    const finalTop = parseFloat(source.style.top);
    const finalRect = source.getBoundingClientRect();

    expect(res.points).toEqual(['bc', 'tc']);
    // Un-squished width 260 shifted left inside [0..580] -> left = 320
    expect(finalLeft).toBe(320);
    expect(finalRect.width).toBe(260);
    // Positioned strictly above button (134 - 4 - 58 = 72), never overlapping button!
    expect(finalTop).toBe(72);
    expect(finalTop + finalRect.height).toBeLessThanOrEqual(134);
    // Arrow stays cleanly inside [0..260]
    const arrowLeft = parseFloat(arrow.style.left);
    expect(arrowLeft).toBeGreaterThanOrEqual(18);
    expect(arrowLeft).toBeLessThanOrEqual(260 - 18);

    // Also test short container where BOTH top & bottom overflow: top/bottom popup MUST NOT overlap button
    container.getBoundingClientRect = () => createRect(0, 0, 580, 120);
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 120 });
    target.getBoundingClientRect = () => createRect(210, 44, 156, 32);
    source.style.left = '158px';
    source.style.top = '0px';
    const shortRes = applyAutoShift(source, target, alignWithShift, dummyResult);
    const shortTop = parseFloat(source.style.top);
    if (shortRes.points[0].startsWith('b')) {
      expect(shortTop + 58).toBeLessThanOrEqual(44);
    } else {
      expect(shortTop).toBeGreaterThanOrEqual(76);
    }

    // Horizontal placement (left/right) with shiftX: true MUST NOT overlap trigger horizontally
    const leftAlign = {
      points: ['cr', 'cl'],
      offset: [-4, 0],
      targetOffset: [0, 0],
      overflow: { adjustX: 1, adjustY: 1, shiftX: true, shiftY: true },
    };
    target.getBoundingClientRect = () => createRect(200, 100, 140, 32);
    container.getBoundingClientRect = () => createRect(0, 0, 580, 300);
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 300 });
    source.style.left = '0px';
    source.style.top = '87px';
    const hRes = applyAutoShift(source, target, leftAlign, {
      ...dummyResult,
      points: ['cr', 'cl'],
      offset: [-4, 0],
    });
    const hLeft = parseFloat(source.style.left);
    if (hRes.points[0].endsWith('r')) {
      expect(hLeft + 260).toBeLessThanOrEqual(200);
    } else {
      expect(hLeft).toBeGreaterThanOrEqual(340);
    }
  });

  it('maintains non-overlap and arrow-in-bounds across all 9 shift positions', () => {
    const container = document.createElement('div');
    container.style.overflow = 'auto';
    container.style.position = 'relative';

    const target = document.createElement('button');
    const source = document.createElement('div');
    source.className = 'ant-popover ant-popover-placement-top';
    source.style.position = 'absolute';

    const content = document.createElement('div');
    content.className = 'ant-popover-content';
    const arrow = document.createElement('div');
    arrow.className = 'ant-popover-arrow';
    content.appendChild(arrow);
    source.appendChild(content);

    container.appendChild(target);
    container.appendChild(source);
    document.body.appendChild(container);

    // Container [0..600] x [0..300]
    container.getBoundingClientRect = () => createRect(0, 0, 600, 300);
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 600 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(arrow, 'offsetWidth', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetHeight', { configurable: true, value: 16 });
    Object.defineProperty(arrow, 'offsetParent', { configurable: true, value: content });

    const popupW = 260;
    const popupH = 58;
    const align = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: 1, adjustY: 1 },
    };
    const dummy = {
      points: ['bc', 'tc'],
      offset: [0, -4],
      targetOffset: [0, 0],
      overflow: { adjustX: false, adjustY: false },
    };

    const cases = [
      { name: 'center', tL: 222, tT: 134, expectFlipY: false },
      { name: 'left', tL: 10, tT: 134, expectFlipY: false },
      { name: 'right', tL: 490, tT: 134, expectFlipY: false },
      { name: 'top', tL: 222, tT: 20, expectFlipY: true },
      { name: 'bottom', tL: 222, tT: 250, expectFlipY: false },
      { name: 'top-left', tL: 10, tT: 20, expectFlipY: true },
      { name: 'top-right', tL: 490, tT: 20, expectFlipY: true },
      { name: 'bottom-left', tL: 10, tT: 250, expectFlipY: false },
      { name: 'bottom-right', tL: 490, tT: 250, expectFlipY: false },
    ];

    cases.forEach(({ tL, tT, expectFlipY }) => {
      target.getBoundingClientRect = () => createRect(tL, tT, 156, 32);
      source.style.left = '0px';
      source.style.top = '0px';
      source.getBoundingClientRect = () => {
        const l = parseFloat(source.style.left) || 0;
        const t = parseFloat(source.style.top) || 0;
        return createRect(l, t, popupW, popupH);
      };
      content.getBoundingClientRect = () => source.getBoundingClientRect();

      const r = applyAutoShift(source, target, align, dummy);
      const pL = parseFloat(source.style.left);
      const pT = parseFloat(source.style.top);

      if (expectFlipY) {
        expect(r.points).toEqual(['tc', 'bc']);
        expect(pT).toBeGreaterThanOrEqual(tT + 32);
      } else {
        expect(r.points).toEqual(['bc', 'tc']);
        expect(pT + popupH).toBeLessThanOrEqual(tT);
      }
      expect(pL).toBeGreaterThanOrEqual(0);
      expect(pL + popupW).toBeLessThanOrEqual(600);
      if (arrow.style.left) {
        const al = parseFloat(arrow.style.left);
        expect(al).toBeGreaterThanOrEqual(18);
        expect(al).toBeLessThanOrEqual(popupW - 18);
      }
    });
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
