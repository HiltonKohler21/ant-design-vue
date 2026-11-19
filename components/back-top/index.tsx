import type { ExtractPropTypes, PropType } from 'vue';
import {
  defineComponent,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch,
  Transition,
} from 'vue';
import VerticalAlignTopOutlined from '@ant-design/icons-vue/VerticalAlignTopOutlined';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { withInstall } from '../_util/type';
import getScroll from '../_util/getScroll';
import scrollTo from '../_util/scrollTo';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import { getTransitionProps } from '../_util/transition';
import useStyle from './style';

export const backTopProps = () => ({
  prefixCls: String,
  /** 滚动高度达到此值才显示 */
  visibilityHeight: { type: Number, default: 400 },
  /** 监听滚动事件的容器，默认 window */
  target: { type: Function as PropType<() => HTMLElement | Window | Document> },
  /** 滚动回顶部的动画时长(ms) */
  duration: { type: Number, default: 450 },
  /** 点击回调 */
  onClick: { type: Function as PropType<(e: MouseEvent) => void> },
  rootClassName: String,
});

export type BackTopProps = Partial<ExtractPropTypes<ReturnType<typeof backTopProps>>>;

const BackTop = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABackTop',
  inheritAttrs: false,
  props: backTopProps(),
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('back-top', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const domRef = ref<HTMLElement>();
    const visible = ref(props.visibilityHeight === 0);

    const getDefaultTarget = () => (domRef.value && domRef.value.ownerDocument) || window;

    const scrollToTop = (e: MouseEvent) => {
      const { target = getDefaultTarget, duration } = props;
      scrollTo(0, { getContainer: target, duration });
      props.onClick?.(e);
      emit('click', e);
    };

    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const { visibilityHeight } = props;
      const scrollTop = getScroll(e.target, true);
      visible.value = scrollTop >= visibilityHeight;
    });

    const bindScrollEvent = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll({ target: container });
      container?.addEventListener('scroll', handleScroll);
    };

    const scrollRemove = () => {
      const { target } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll.cancel();
      container?.removeEventListener('scroll', handleScroll);
    };

    watch(
      () => props.target,
      () => {
        scrollRemove();
        nextTick(() => {
          bindScrollEvent();
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

    return () => {
      const { rootClassName } = props;
      const { class: className, style, ...restAttrs } = attrs;

      const classString = classNames(
        hashId.value,
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        className,
        rootClassName,
      );

      const transitionProps = getTransitionProps('fade');

      return wrapSSR(
        <div
          {...restAttrs}
          ref={domRef}
          class={classString}
          style={style as any}
          onClick={scrollToTop}
        >
          <Transition {...transitionProps}>
            <div v-show={visible.value}>
              {slots.default?.() || (
                <div class={`${prefixCls.value}-content`}>
                  <div class={`${prefixCls.value}-icon`}>
                    <VerticalAlignTopOutlined />
                  </div>
                </div>
              )}
            </div>
          </Transition>
        </div>,
      );
    };
  },
});

export default withInstall(BackTop);
