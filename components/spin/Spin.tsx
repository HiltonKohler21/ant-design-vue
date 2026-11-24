import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, isVNode, onBeforeUnmount, shallowRef, watch } from 'vue';
import { debounce } from 'throttle-debounce';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getPropsSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import omit from '../_util/omit';
import type { CustomSlotsType, VueNode } from '../_util/type';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import Indicator from './Indicator';
import useStyle from './style';
import usePercent from './usePercent';

export type SpinSize = 'small' | 'medium' | 'default' | 'large';

export type SpinSemanticName =
  | 'root'
  | 'section'
  | 'indicator'
  | 'description'
  | 'container'
  /** @deprecated Please use `description` instead */
  | 'tip'
  /** @deprecated Please use `root` instead */
  | 'mask'
  /** @deprecated Please use `root` instead */
  | 'wrapper';

export type SpinSemanticClassNames = SemanticClassNames<SpinSemanticName>;
export type SpinSemanticStyles = SemanticStyles<SpinSemanticName>;
export type SpinClassNamesType =
  | SpinSemanticClassNames
  | ((info: { props: SpinProps }) => SpinSemanticClassNames);
export type SpinStylesType =
  | SpinSemanticStyles
  | ((info: { props: SpinProps }) => SpinSemanticStyles);

export interface SpinRef {
  nativeElement: HTMLDivElement | undefined;
}

export const spinProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** Whether Spin is spinning */
  spinning: { type: Boolean, default: undefined },
  /**
   * Note: `default` is deprecated, please use `medium` instead.
   */
  size: String as PropType<SpinSize>,
  /** @deprecated Please use `classNames.root` instead */
  wrapperClassName: String,
  /** Customize description content */
  description: PropTypes.any,
  /** @deprecated Please use `description` instead */
  tip: PropTypes.any,
  /** Specifies a delay in milliseconds for loading state (prevent flush) */
  delay: Number,
  /** Vue node of the spinning indicator */
  indicator: PropTypes.any,
  /** Progress percentage; when set to `'auto'`, displays an indeterminate progress */
  percent: [Number, String] as PropType<number | 'auto'>,
  /** Display a backdrop with the `Spin` component */
  fullscreen: { type: Boolean, default: false },
  /** Semantic classNames (supports object or function) */
  classNames: {
    type: [Object, Function] as PropType<SpinClassNamesType>,
    default: undefined,
  },
  /** Semantic styles (supports object or function) */
  styles: {
    type: [Object, Function] as PropType<SpinStylesType>,
    default: undefined,
  },
});

export type SpinProps = Partial<ExtractPropTypes<ReturnType<typeof spinProps>>>;

// Render indicator
let defaultIndicator: (() => VueNode) | VueNode | undefined = undefined;

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !Number.isNaN(Number(delay));
}

export function setDefaultIndicator(content: any) {
  if (content === null || content === undefined) {
    defaultIndicator = undefined;
    return;
  }
  // Legacy Vue API: Spin.setDefaultIndicator({ indicator: ... })
  if (typeof content === 'object' && !isVNode(content) && 'indicator' in content) {
    const IndicatorComp = content.indicator;
    if (IndicatorComp === null || IndicatorComp === undefined) {
      defaultIndicator = undefined;
    } else if (typeof IndicatorComp === 'function') {
      defaultIndicator = IndicatorComp;
    } else if (isVNode(IndicatorComp)) {
      defaultIndicator = () => IndicatorComp;
    } else {
      defaultIndicator = () => <IndicatorComp />;
    }
    return;
  }
  // Standard antd API: Spin.setDefaultIndicator(vnodeOrComponent)
  if (typeof content === 'function') {
    defaultIndicator = content;
  } else if (isVNode(content)) {
    defaultIndicator = () => content;
  } else if (typeof content === 'object') {
    const Comp = content;
    defaultIndicator = () => <Comp />;
  } else {
    defaultIndicator = () => content;
  }
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASpin',
  inheritAttrs: false,
  props: initDefaultProps(spinProps(), {
    spinning: true,
    delay: 0,
    fullscreen: false,
    wrapperClassName: '',
  }),
  slots: Object as CustomSlotsType<{
    default?: any;
    indicator?: any;
    description?: any;
    tip?: any;
  }>,
  setup(props, { attrs, slots, expose }) {
    const { prefixCls, size, direction } = useConfigInject('spin', props);
    const {
      componentConfig: spinConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('spin');
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const nativeElement = shallowRef<HTMLDivElement>();
    expose({ nativeElement });

    const sSpinning = shallowRef(props.spinning && !shouldDelay(props.spinning, props.delay));
    const mergedPercent = usePercent(
      sSpinning,
      computed(() => props.percent),
    );

    let updateSpinning: ReturnType<typeof debounce> | undefined;
    watch(
      [() => props.spinning, () => props.delay],
      () => {
        updateSpinning?.cancel();
        if (shouldDelay(props.spinning, props.delay)) {
          updateSpinning = debounce(props.delay!, () => {
            sSpinning.value = props.spinning!;
          });
          updateSpinning();
        } else {
          sSpinning.value = !!props.spinning;
        }
      },
      {
        immediate: true,
        flush: 'post',
      },
    );
    onBeforeUnmount(() => {
      updateSpinning?.cancel();
    });

    const mergedSize = computed<SpinSize>(() => {
      const s = size.value as SpinSize | 'middle' | undefined;
      if (s === 'middle' || s === undefined) {
        return 'medium';
      }
      return s;
    });

    return () => {
      const { class: cls, style: attrStyle, ...divProps } = omit(attrs, ['rootClassName']);
      const mergedDescription =
        props.description ?? slots.description?.() ?? props.tip ?? slots.tip?.();
      const children = slots.default?.();
      const hasChildren = !!(children && filterEmpty(children).length);
      const isNested = hasChildren || props.fullscreen;

      const mergedPropsForSemantic: SpinProps = {
        ...props,
        size: mergedSize.value,
        spinning: sSpinning.value,
        tip: mergedDescription,
        description: mergedDescription,
        fullscreen: props.fullscreen,
        percent: mergedPercent.value,
      };

      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SpinSemanticClassNames,
        SpinSemanticStyles,
        SpinProps
      >([contextClassNames.value, props.classNames], [contextStyles.value, props.styles], {
        props: mergedPropsForSemantic,
      });

      const propOrSlotIndicator = getPropsSlot(slots, props, 'indicator');
      const mergedIndicator =
        propOrSlotIndicator !== undefined
          ? propOrSlotIndicator
          : spinConfig.value.indicator !== undefined
          ? spinConfig.value.indicator
          : typeof defaultIndicator === 'function'
          ? defaultIndicator()
          : defaultIndicator;

      const indicatorNode = (
        <>
          <Indicator
            class={mergedClassNames.indicator}
            style={mergedStyles.indicator}
            prefixCls={prefixCls.value}
            indicator={mergedIndicator}
            percent={mergedPercent.value}
          />
          {mergedDescription ? (
            <div
              class={classNames(
                `${prefixCls.value}-description`,
                `${prefixCls.value}-text`,
                mergedClassNames.tip,
                mergedClassNames.description,
              )}
              style={
                mergedStyles.tip || mergedStyles.description
                  ? [mergedStyles.tip, mergedStyles.description]
                  : undefined
              }
            >
              {mergedDescription}
            </div>
          ) : null}
        </>
      );

      const rootStyle = [
        contextStyle.value,
        mergedStyles.root,
        hasChildren ? mergedStyles.wrapper : undefined,
        !isNested ? mergedStyles.section : undefined,
        props.fullscreen ? mergedStyles.mask : undefined,
        attrStyle as CSSProperties,
      ].filter(Boolean);

      return wrapSSR(
        <div
          ref={nativeElement}
          {...divProps}
          class={classNames(
            prefixCls.value,
            {
              [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
              [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
              [`${prefixCls.value}-spinning`]: sSpinning.value,
              [`${prefixCls.value}-show-text`]: !!mergedDescription,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              [`${prefixCls.value}-fullscreen`]: props.fullscreen,
              [`${prefixCls.value}-fullscreen-show`]: props.fullscreen && sSpinning.value,
              [`${prefixCls.value}-nested-loading`]: hasChildren,
            },
            props.rootClassName,
            mergedClassNames.root,
            hasChildren && mergedClassNames.wrapper,
            props.fullscreen && mergedClassNames.mask,
            isNested
              ? props.wrapperClassName
              : [`${prefixCls.value}-section`, mergedClassNames.section],
            contextClassName.value,
            cls,
            hashId.value,
          )}
          style={rootStyle.length ? rootStyle : undefined}
          aria-live="polite"
          aria-busy={sSpinning.value}
        >
          {/* Indicator */}
          {sSpinning.value ? (
            isNested ? (
              <div
                class={classNames(`${prefixCls.value}-section`, mergedClassNames.section)}
                style={mergedStyles.section}
              >
                {indicatorNode}
              </div>
            ) : (
              indicatorNode
            )
          ) : null}

          {/* Children */}
          {hasChildren ? (
            <div
              class={classNames(
                `${prefixCls.value}-container`,
                { [`${prefixCls.value}-blur`]: sSpinning.value },
                mergedClassNames.container,
              )}
              style={mergedStyles.container}
            >
              {children}
            </div>
          ) : null}
        </div>,
      );
    };
  },
});
