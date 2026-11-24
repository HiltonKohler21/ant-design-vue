import type { CSSProperties, VNode, ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  onBeforeUnmount,
  cloneVNode,
  isVNode,
  defineComponent,
  shallowRef,
  watch,
} from 'vue';
import { debounce } from 'throttle-debounce';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getPropsSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from './style';
import usePercent from './usePercent';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import Progress from '../progress';
import omit from '../_util/omit';
import type { CustomSlotsType } from '../_util/type';

export type SpinSize = 'small' | 'default' | 'medium' | 'large';

export type SpinSemanticName =
  | 'root'
  | 'wrapper'
  | 'mask'
  | 'section'
  | 'indicator'
  | 'description'
  | 'tip'
  | 'container';
export type SpinSemanticClassNames = SemanticClassNames<SpinSemanticName>;
export type SpinSemanticStyles = SemanticStyles<SpinSemanticName>;
export type SpinClassNamesType =
  | SpinSemanticClassNames
  | ((info: { props: SpinProps }) => SpinSemanticClassNames);
export type SpinStylesType =
  | SpinSemanticStyles
  | ((info: { props: SpinProps }) => SpinSemanticStyles);

export const spinProps = () => ({
  prefixCls: String,
  rootClassName: String,
  spinning: { type: Boolean, default: undefined },
  size: String as PropType<SpinSize>,
  wrapperClassName: String,
  /** 自定义描述文案（antd 6.x 推荐，优先级高于 tip） */
  description: PropTypes.any,
  /** @deprecated 请使用 `description` 替代 */
  tip: PropTypes.any,
  delay: Number,
  indicator: PropTypes.any,
  /** 环形进度百分比（antd 5.11+ / v6 支持 'auto'），与 indicator 互斥 */
  percent: [Number, String] as PropType<number | 'auto'>,
  /** 全屏遮罩模式（antd 5.11+） */
  fullscreen: { type: Boolean, default: false },
  /** 语义化 classNames（antd 6.x 支持对象或函数） */
  classNames: {
    type: [Object, Function] as PropType<SpinClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（antd 6.x 支持对象或函数） */
  styles: {
    type: [Object, Function] as PropType<SpinStylesType>,
    default: undefined,
  },
});

export type SpinProps = Partial<ExtractPropTypes<ReturnType<typeof spinProps>>>;

// Render indicator
let defaultIndicator: () => VNode = null;

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

export function setDefaultIndicator(Content: any) {
  const Indicator = Content.indicator;
  defaultIndicator = typeof Indicator === 'function' ? Indicator : () => <Indicator />;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASpin',
  inheritAttrs: false,
  props: initDefaultProps(spinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: '',
  }),
  slots: Object as CustomSlotsType<{
    default?: any;
    indicator?: any;
    description?: any;
    tip?: any;
  }>,
  setup(props, { attrs, slots }) {
    const { prefixCls, size, direction } = useConfigInject('spin', props);
    const {
      componentConfig: spinConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('spin');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const sSpinning = shallowRef(props.spinning && !shouldDelay(props.spinning, props.delay));
    const mergedPercent = usePercent(
      sSpinning,
      computed(() => props.percent),
    );
    let updateSpinning: any;
    watch(
      [() => props.spinning, () => props.delay],
      () => {
        updateSpinning?.cancel();
        if (shouldDelay(props.spinning, props.delay)) {
          updateSpinning = debounce(props.delay, () => {
            sSpinning.value = props.spinning;
          });
          updateSpinning?.();
        } else {
          sSpinning.value = props.spinning;
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
    return () => {
      const { class: cls, style: attrStyle, ...divProps } = omit(attrs, ['rootClassName']);
      const description = props.description ?? slots.description?.() ?? props.tip ?? slots.tip?.();
      const children = slots.default?.();
      const hasChildren = !!(children && filterEmpty(children).length);
      const isNested = hasChildren || props.fullscreen;

      const mergedPropsForSemantic: SpinProps = {
        ...props,
        size: size.value as SpinSize,
        spinning: sSpinning.value,
        tip: description,
        description,
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

      const spinClassName = {
        [hashId.value]: true,
        [prefixCls.value]: true,
        [props.rootClassName as string]: !isNested && !!props.rootClassName,
        [contextClassName.value as string]: !!contextClassName.value,
        [mergedClassNames.root as string]: !isNested && !!mergedClassNames.root,
        [mergedClassNames.section as string]: !!mergedClassNames.section,
        [`${prefixCls.value}-sm`]: size.value === 'small',
        [`${prefixCls.value}-lg`]: size.value === 'large',
        [`${prefixCls.value}-spinning`]: sSpinning.value,
        [`${prefixCls.value}-show-text`]: !!description,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [cls as string]: !!cls,
      };

      function renderIndicator(prefixClsVal: string) {
        const dotClassName = `${prefixClsVal}-dot`;
        const indicatorCls = mergedClassNames.indicator;
        const indicatorStyle = mergedStyles.indicator;
        if (mergedPercent.value !== undefined) {
          return (
            <Progress
              type="circle"
              percent={mergedPercent.value}
              size={(size.value === 'small' && 14) || (size.value === 'large' ? 32 : 20)}
              showInfo={false}
              class={indicatorCls}
              style={indicatorStyle}
            />
          );
        }
        let indicator = getPropsSlot(slots, props, 'indicator') ?? spinConfig.value.indicator;
        // should not be render default indicator when indicator value is null
        if (indicator === null) {
          return null;
        }
        if (Array.isArray(indicator)) {
          indicator = indicator.length === 1 ? indicator[0] : indicator;
        }
        if (isVNode(indicator)) {
          return cloneVNode(indicator, {
            class: classNames(dotClassName, indicatorCls),
            ...(indicatorStyle ? { style: indicatorStyle } : {}),
          });
        }

        if (defaultIndicator && isVNode(defaultIndicator())) {
          return cloneVNode(defaultIndicator(), {
            class: classNames(dotClassName, indicatorCls),
            ...(indicatorStyle ? { style: indicatorStyle } : {}),
          });
        }

        return (
          <span
            class={classNames(dotClassName, `${prefixClsVal}-dot-spin`, indicatorCls)}
            style={indicatorStyle}
          >
            <i class={`${prefixClsVal}-dot-item`} />
            <i class={`${prefixClsVal}-dot-item`} />
            <i class={`${prefixClsVal}-dot-item`} />
            <i class={`${prefixClsVal}-dot-item`} />
          </span>
        );
      }

      const descriptionCls = classNames(
        `${prefixCls.value}-text`,
        mergedClassNames.tip,
        mergedClassNames.description,
      );
      const descriptionStyle =
        mergedStyles.tip || mergedStyles.description
          ? [mergedStyles.tip, mergedStyles.description]
          : undefined;

      const spinStyle = isNested
        ? [
            !props.fullscreen ? contextStyle.value : undefined,
            mergedStyles.section,
            attrStyle as CSSProperties,
          ]
        : [contextStyle.value, mergedStyles.root, mergedStyles.section, attrStyle as CSSProperties];

      const spinElement = (
        <div
          {...divProps}
          class={spinClassName}
          style={spinStyle}
          aria-live="polite"
          aria-busy={sSpinning.value}
        >
          {renderIndicator(prefixCls.value)}
          {description ? (
            <div class={descriptionCls} style={descriptionStyle}>
              {description}
            </div>
          ) : null}
        </div>
      );
      if (props.fullscreen) {
        const maskStyle =
          contextStyle.value || mergedStyles.root || mergedStyles.mask
            ? [contextStyle.value, mergedStyles.root, mergedStyles.mask]
            : undefined;
        return wrapSSR(
          <div
            class={[
              `${prefixCls.value}-fullscreen`,
              {
                [`${prefixCls.value}-fullscreen-show`]: sSpinning.value,
              },
              props.rootClassName,
              mergedClassNames.root,
              mergedClassNames.mask,
              hashId.value,
            ]}
            style={maskStyle}
          >
            {spinElement}
          </div>,
        );
      }
      if (hasChildren) {
        const containerClassName = {
          [`${prefixCls.value}-container`]: true,
          [`${prefixCls.value}-blur`]: sSpinning.value,
          [mergedClassNames.container as string]: !!mergedClassNames.container,
        };
        const wrapperStyle =
          mergedStyles.root || mergedStyles.wrapper
            ? [mergedStyles.root, mergedStyles.wrapper]
            : undefined;
        return wrapSSR(
          <div
            class={[
              `${prefixCls.value}-nested-loading`,
              props.wrapperClassName,
              props.rootClassName,
              mergedClassNames.root,
              mergedClassNames.wrapper,
              hashId.value,
            ]}
            style={wrapperStyle}
          >
            {sSpinning.value && <div key="loading">{spinElement}</div>}
            <div class={containerClassName} style={mergedStyles.container} key="container">
              {children}
            </div>
          </div>,
        );
      }
      return wrapSSR(spinElement);
    };
  },
});
