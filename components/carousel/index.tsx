import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { ref, computed, watchEffect, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import SlickCarousel from '../vc-slick';
import { withInstall, booleanType, functionType, stringType } from '../_util/type';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';

// CSSINJS
import useStyle, { DotDuration } from './style';

export type SwipeDirection = 'left' | 'down' | 'right' | 'up' | string;

export type LazyLoadTypes = 'ondemand' | 'progressive';

export type CarouselEffect = 'scrollx' | 'fade';
export type DotPlacement = 'top' | 'bottom' | 'start' | 'end';
export type DotPosition = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';
export type CarouselAutoplay = boolean | { dotDuration?: boolean };

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
  autoplay: (palyType?: 'update' | 'leave' | 'blur') => void;
  innerSlider: any;
}

// Carousel
export const carouselProps = () => ({
  rootClassName: String,
  effect: stringType<CarouselEffect>(),
  dots: {
    type: [Boolean, Object] as PropType<boolean | { className?: string }>,
    default: true,
  },
  vertical: booleanType(),
  autoplay: {
    type: [Boolean, Object] as PropType<CarouselAutoplay>,
    default: undefined,
  },
  easing: String,
  beforeChange: functionType<(currentSlide: number, nextSlide: number) => void>(),
  afterChange: functionType<(currentSlide: number) => void>(),
  // style: PropTypes.React.CSSProperties,
  prefixCls: String,
  accessibility: booleanType(),
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: booleanType(),
  // className: String,
  adaptiveHeight: booleanType(),
  arrows: booleanType(false),
  autoplaySpeed: Number,
  centerMode: booleanType(),
  centerPadding: String,
  cssEase: String,
  dotsClass: String,
  draggable: booleanType(false),
  /** 动画等待（是否等待过渡动画完成再切换） */
  waitForAnimate: booleanType(),
  fade: booleanType(),
  focusOnSelect: booleanType(),
  infinite: booleanType(),
  initialSlide: Number,
  lazyLoad: stringType<LazyLoadTypes>(),
  rtl: booleanType(),
  slide: String,
  slidesToShow: Number,
  slidesToScroll: Number,
  speed: Number,
  swipe: booleanType(),
  swipeToSlide: booleanType(),
  swipeEvent: functionType<(swipeDirection: SwipeDirection) => void>(),
  touchMove: booleanType(),
  touchThreshold: Number,
  variableWidth: booleanType(),
  useCSS: booleanType(),
  slickGoTo: Number,
  responsive: Array,
  /** @deprecated Please use `dotPlacement` instead */
  dotPosition: stringType<DotPosition>(),
  dotPlacement: stringType<DotPlacement>(),
  verticalSwiping: booleanType(false),
});
export type CarouselProps = Partial<ExtractPropTypes<ReturnType<typeof carouselProps>>>;
const Carousel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACarousel',
  inheritAttrs: false,
  props: carouselProps(),
  setup(props, { slots, attrs, expose }) {
    const slickRef = ref();

    const goTo = (slide: number, dontAnimate = false) => {
      slickRef.value?.slickGoTo(slide, dontAnimate);
    };

    expose({
      goTo,
      autoplay: palyType => {
        slickRef.value?.innerSlider?.handleAutoPlay(palyType);
      },
      prev: () => {
        slickRef.value?.slickPrev();
      },
      next: () => {
        slickRef.value?.slickNext();
      },
      innerSlider: computed(() => {
        return slickRef.value?.innerSlider;
      }),
    } as CarouselRef);
    watchEffect(() => {
      warning(
        props.vertical === undefined,
        'Carousel',
        '`vertical` is deprecated, please use `dotPosition` instead.',
      );
    });
    const { prefixCls, direction } = useConfigInject('carousel', props);
    const { className: contextClassName, style: contextStyle } = useComponentConfig('carousel');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isRTL = computed(() => props.rtl ?? direction.value === 'rtl');

    const dotPosition = computed<'top' | 'bottom' | 'left' | 'right'>(() => {
      const placement =
        props.dotPlacement ??
        props.dotPosition ??
        (props.vertical !== undefined ? (props.vertical ? 'right' : 'bottom') : 'bottom');
      switch (placement) {
        case 'start':
          return isRTL.value ? 'right' : 'left';
        case 'end':
          return isRTL.value ? 'left' : 'right';
        default:
          return placement;
      }
    });
    const vertical = computed(() => dotPosition.value === 'left' || dotPosition.value === 'right');
    const mergedAutoplay = computed(() => !!props.autoplay);
    const mergedShowDuration = computed(
      () => !!props.autoplay && typeof props.autoplay === 'object' && !!props.autoplay.dotDuration,
    );
    const mergedAutoplaySpeed = computed(() => props.autoplaySpeed ?? 3000);

    const dsClass = computed(() => {
      const dotsClass = 'slick-dots';
      const dotsVal = props.dots as boolean | { className?: string } | undefined;
      const dotsObjClass = typeof dotsVal === 'object' && dotsVal ? dotsVal.className : undefined;
      return classNames({
        [dotsClass]: true,
        [`${dotsClass}-${dotPosition.value}`]: true,
        [`${props.dotsClass}`]: !!props.dotsClass,
        [`${dotsObjClass}`]: !!dotsObjClass,
      });
    });
    return () => {
      const { dots, arrows, draggable, effect } = props;
      const { class: cls, style, ...restAttrs } = attrs;
      const fade = effect === 'fade' ? true : props.fade;
      const className = classNames(
        prefixCls.value,
        props.rootClassName,
        contextClassName.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-vertical`]: vertical.value,
          [`${cls}`]: !!cls,
        },
        hashId.value,
      );
      const dotDurationStyle = mergedShowDuration.value
        ? ({ [DotDuration]: `${mergedAutoplaySpeed.value}ms` } as CSSProperties)
        : undefined;
      return wrapSSR(
        <div
          class={className}
          style={[contextStyle.value, dotDurationStyle, style as CSSProperties]}
        >
          <SlickCarousel
            ref={slickRef}
            {...omit(props, ['dotPlacement'])}
            {...restAttrs}
            autoplay={mergedAutoplay.value}
            dots={!!dots}
            dotsClass={dsClass.value}
            arrows={arrows}
            draggable={draggable}
            fade={fade}
            vertical={vertical.value}
            v-slots={slots}
          />
        </div>,
      );
    };
  },
});

export default withInstall(Carousel);
