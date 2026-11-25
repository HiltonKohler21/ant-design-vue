import VerticalAlignTopOutlined from '@ant-design/icons-vue/VerticalAlignTopOutlined';
import { getTransitionProps } from '../_util/transition';
import type { CSSProperties } from 'vue';
import {
  defineComponent,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  onDeactivated,
  Transition,
} from 'vue';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import classNames from '../_util/classNames';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import getScroll from '../_util/getScroll';
import scrollTo from '../_util/scrollTo';
import useReducedMotion from '../_util/hooks/useReducedMotion';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { initDefaultProps } from '../_util/props-util';
import { backTopProps } from './interface';

import useStyle from './style';
import { useInjectFloatButtonGroupContext } from './context';

type ScrollTarget = HTMLElement | Window | Document;

const getScrollProgress = (target: ScrollTarget | null | undefined): number => {
  if (!target) {
    return 0;
  }
  const scrollTop = getScroll(target, true);
  let scrollElement: HTMLElement | null = null;
  if (typeof window !== 'undefined' && target === window) {
    scrollElement = window.document.documentElement;
  } else if ((target as Document).nodeType === 9) {
    scrollElement = (target as Document).documentElement;
  } else if ((target as HTMLElement).nodeType === 1) {
    scrollElement = target as HTMLElement;
  }
  if (!scrollElement) {
    return 0;
  }
  const maxScroll = Math.max(scrollElement.scrollHeight - scrollElement.clientHeight, 0);
  return maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
};

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonBackTop',
  inheritAttrs: false,
  props: initDefaultProps(backTopProps(), {
    visibilityHeight: 400,
    target: () => window,
    duration: 450,
    showProgress: false,
    type: 'default',
    shape: 'circle',
  }),
  // emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, rootPrefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);
    const { componentConfig: floatButtonConfig } = useComponentConfig('floatButton');

    const [wrapSSR] = useStyle(prefixCls);

    const domRef = ref();
    const shouldReduceMotion = useReducedMotion();
    const state = reactive({
      visible: props.visibilityHeight === 0,
      scrollProgress: 0,
      scrollEvent: null,
    });

    const getDefaultTarget = () =>
      domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window;

    const scrollToTop = (e: Event) => {
      const { target = getDefaultTarget, duration } = props;
      scrollTo(0, {
        getContainer: target,
        duration: shouldReduceMotion.value ? 0 : duration,
      });
      emit('click', e);
    };

    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const { visibilityHeight, showProgress } = props;
      const scrollTop = getScroll(e.target, true);
      state.visible = scrollTop >= visibilityHeight;
      if (showProgress) {
        state.scrollProgress = getScrollProgress(e.target);
      }
    });

    const handleResize = throttleByAnimationFrame(() => {
      if (!props.showProgress) {
        return;
      }
      const getTarget = props.target || getDefaultTarget;
      state.scrollProgress = getScrollProgress(getTarget());
    });

    let scrollContainer: ScrollTarget | null = null;
    let resizeBound = false;

    const scrollRemove = () => {
      handleScroll.cancel();
      handleResize.cancel();
      scrollContainer?.removeEventListener('scroll', handleScroll);
      scrollContainer = null;
      if (resizeBound && typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        resizeBound = false;
      }
    };

    const bindScrollEvent = () => {
      scrollRemove();
      const { target, showProgress } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      if (container) {
        scrollContainer = container;
        handleScroll({ target: container });
        container.addEventListener('scroll', handleScroll);
      }
      if (showProgress && typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        resizeBound = true;
      }
    };

    watch(
      [() => props.target, () => props.showProgress, () => props.visibilityHeight],
      (_val, _oldVal, onCleanup) => {
        scrollRemove();
        let cancelled = false;
        nextTick(() => {
          if (!cancelled) {
            bindScrollEvent();
          }
        });
        onCleanup(() => {
          cancelled = true;
          scrollRemove();
        });
      },
    );

    onMounted(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onActivated(() => {
      nextTick(() => {
        bindScrollEvent();
      });
    });

    onDeactivated(() => {
      scrollRemove();
    });

    onBeforeUnmount(() => {
      scrollRemove();
    });
    const floatButtonGroupContext = useInjectFloatButtonGroupContext();
    return () => {
      const {
        content,
        description,
        type,
        shape,
        tooltip,
        badge,
        icon,
        showProgress,
        classNames: semanticClassNames,
        styles: semanticStyles,
        rootClassName,
        disabled,
        htmlType,
        href,
      } = props;

      const contextBackTopIcon = (floatButtonConfig.value as any)?.backTopIcon;
      const progressStyle: CSSProperties | undefined = showProgress
        ? ({
            [`--${rootPrefixCls.value}-float-btn-progress`]: `${state.scrollProgress}turn`,
          } as CSSProperties)
        : undefined;

      const mergedStyle =
        progressStyle && attrs.style ? [progressStyle, attrs.style] : progressStyle || attrs.style;

      const floatButtonProps = {
        ...attrs,
        style: mergedStyle as any,
        shape: floatButtonGroupContext?.shape.value || shape,
        onClick: scrollToTop,
        class: classNames(prefixCls.value, attrs.class, {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-progress`]: !!showProgress,
        }),
        content,
        description,
        type,
        tooltip,
        badge,
        classNames: semanticClassNames,
        styles: semanticStyles,
        rootClassName,
        disabled,
        htmlType,
        href,
      };

      const transitionProps = getTransitionProps('fade');
      return wrapSSR(
        <Transition {...transitionProps}>
          <FloatButton v-show={state.visible} {...floatButtonProps} ref={domRef}>
            {{
              icon: () =>
                slots.icon?.() ?? icon ?? contextBackTopIcon ?? <VerticalAlignTopOutlined />,
              tooltip: slots.tooltip,
              content: slots.content,
              description: slots.description,
            }}
          </FloatButton>
        </Transition>,
      );
    };
  },
});

export default BackTop;
