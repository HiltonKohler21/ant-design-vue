import { addClass, removeClass } from '../../vc-util/Dom/class';
import type { CSSProperties, Ref, TransitionProps } from 'vue';
import { onBeforeUnmount, nextTick, Transition, watch, defineComponent, computed, ref } from 'vue';
import { anyType } from '../../_util/type';
import type { SegmentedValue } from './segmented';

type ThumbRect = {
  left: number;
  right: number;
  width: number;
  top: number;
  bottom: number;
  height: number;
} | null;

export interface MotionThumbInterface {
  value: SegmentedValue;
  getValueIndex: (value: SegmentedValue) => number;
  prefixCls: string;
  motionName: string;
  onMotionStart: VoidFunction;
  onMotionEnd: VoidFunction;
  direction?: 'ltr' | 'rtl';
  vertical?: boolean;
}

const calcThumbStyle = (targetElement: HTMLElement | null | undefined): ThumbRect =>
  targetElement
    ? {
        left: targetElement.offsetLeft,
        right:
          (targetElement.parentElement!.clientWidth as number) -
          targetElement.clientWidth -
          targetElement.offsetLeft,
        width: targetElement.clientWidth,
        top: targetElement.offsetTop,
        bottom:
          (targetElement.parentElement!.clientHeight as number) -
          targetElement.clientHeight -
          targetElement.offsetTop,
        height: targetElement.clientHeight,
      }
    : null;

const toPX = (value?: number) => (value !== undefined ? `${value}px` : undefined);

const MotionThumb = defineComponent({
  props: {
    value: anyType<SegmentedValue>(),
    getValueIndex: anyType<(value: SegmentedValue) => number>(),
    prefixCls: anyType<string>(),
    motionName: anyType<string>(),
    onMotionStart: anyType<VoidFunction>(),
    onMotionEnd: anyType<VoidFunction>(),
    direction: anyType<'ltr' | 'rtl'>(),
    vertical: anyType<boolean>(),
    containerRef: anyType<Ref<HTMLDivElement>>(),
  },
  emits: ['motionStart', 'motionEnd'],
  setup(props, { emit }) {
    const thumbRef = ref<HTMLDivElement>();
    // =========================== Effect ===========================
    const findValueElement = (val: SegmentedValue) => {
      const index = props.getValueIndex(val);

      const ele = props.containerRef.value?.querySelectorAll<HTMLDivElement>(
        `.${props.prefixCls}-item`,
      )[index];
      return ele?.offsetParent && ele;
    };

    const prevStyle = ref<ThumbRect>(null);
    const nextStyle = ref<ThumbRect>(null);

    watch(
      () => props.value,
      (value, prevValue) => {
        const prev = findValueElement(prevValue);
        const next = findValueElement(value);

        const calcPrevStyle = calcThumbStyle(prev);
        const calcNextStyle = calcThumbStyle(next);

        prevStyle.value = calcPrevStyle;
        nextStyle.value = calcNextStyle;

        if (prev && next) {
          emit('motionStart');
        } else {
          emit('motionEnd');
        }
      },
      { flush: 'post' },
    );

    const thumbStart = computed(() => {
      if (props.vertical) {
        return toPX(prevStyle.value?.top as number);
      }
      return props.direction === 'rtl'
        ? toPX(-(prevStyle.value?.right as number))
        : toPX(prevStyle.value?.left as number);
    });
    const thumbActive = computed(() => {
      if (props.vertical) {
        return toPX(nextStyle.value?.top as number);
      }
      return props.direction === 'rtl'
        ? toPX(-(nextStyle.value?.right as number))
        : toPX(nextStyle.value?.left as number);
    });

    // =========================== Motion ===========================
    let timeid: any;
    const onAppearStart: TransitionProps['onBeforeEnter'] = (el: HTMLDivElement) => {
      clearTimeout(timeid);
      nextTick(() => {
        if (el) {
          if (props.vertical) {
            el.style.transform = `translateY(var(--thumb-start-top))`;
            el.style.height = `var(--thumb-start-height)`;
          } else {
            el.style.transform = `translateX(var(--thumb-start-left))`;
            el.style.width = `var(--thumb-start-width)`;
          }
        }
      });
    };

    const onAppearActive: TransitionProps['onEnter'] = (el: HTMLDivElement) => {
      timeid = setTimeout(() => {
        if (el) {
          addClass(el, `${props.motionName}-appear-active`);
          if (props.vertical) {
            el.style.transform = `translateY(var(--thumb-active-top))`;
            el.style.height = `var(--thumb-active-height)`;
          } else {
            el.style.transform = `translateX(var(--thumb-active-left))`;
            el.style.width = `var(--thumb-active-width)`;
          }
        }
      });
    };
    const onAppearEnd: TransitionProps['onAfterEnter'] = (el: HTMLDivElement) => {
      prevStyle.value = null;
      nextStyle.value = null;
      if (el) {
        el.style.transform = null;
        el.style.width = null;
        el.style.height = null;
        removeClass(el, `${props.motionName}-appear-active`);
      }
      emit('motionEnd');
    };
    const mergedStyle = computed<CSSProperties>(() => {
      if (props.vertical) {
        return {
          '--thumb-start-top': thumbStart.value,
          '--thumb-start-height': toPX(prevStyle.value?.height),
          '--thumb-active-top': thumbActive.value,
          '--thumb-active-height': toPX(nextStyle.value?.height),
        };
      }
      return {
        '--thumb-start-left': thumbStart.value,
        '--thumb-start-width': toPX(prevStyle.value?.width),
        '--thumb-active-left': thumbActive.value,
        '--thumb-active-width': toPX(nextStyle.value?.width),
      };
    });
    onBeforeUnmount(() => {
      clearTimeout(timeid);
    });
    return () => {
      // It's little ugly which should be refactor when @umi/test update to latest jsdom
      const motionProps = {
        ref: thumbRef,
        style: mergedStyle.value,
        class: [`${props.prefixCls}-thumb`],
      };

      if (process.env.NODE_ENV === 'test') {
        (motionProps as any)['data-test-style'] = JSON.stringify(mergedStyle.value);
      }

      return (
        <Transition
          appear
          onBeforeEnter={onAppearStart}
          onEnter={onAppearActive}
          onAfterEnter={onAppearEnd}
        >
          {!prevStyle.value || !nextStyle.value ? null : <div {...motionProps}></div>}
        </Transition>
      );
    };
  },
});
export default MotionThumb;
