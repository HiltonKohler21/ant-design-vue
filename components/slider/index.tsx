import type { CSSProperties, VNodeTypes, ExtractPropTypes } from 'vue';
import { computed, ref, defineComponent } from 'vue';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';

import type { VueNode, CustomSlotsType } from '../_util/type';
import {
  stringType,
  booleanType,
  someType,
  objectType,
  withInstall,
  functionType,
} from '../_util/type';
import type { TooltipPlacement } from '../tooltip/Tooltip';
import type { SemanticNames, SemanticStylesMap, SliderSemanticName } from '../_util/semantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import SliderTooltip from './SliderTooltip';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form/FormItemContext';
import type { FocusEventHandler } from '../_util/EventInterface';

// CSSINJS
import useStyle from './style';
import devWarning from '../vc-util/devWarning';

export type SliderValue = number | [number, number];

export interface SliderMarks {
  [key: number]:
    | VueNode
    | {
        style: CSSProperties;
        label: any;
      };
}

interface HandleGeneratorInfo {
  value?: number;
  dragging?: boolean;
  index: number;
}
export interface SliderRange {
  draggableTrack?: boolean;
}
export type Formatter = ((value?: number) => VueNode) | null;
export interface SliderTooltipProps {
  open?: boolean;
  formatter?: Formatter;
  placement?: TooltipPlacement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  autoAdjustOverflow?: boolean;
  prefixCls?: string;
}
export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => VNodeTypes;
type Value = [number, number] | number;

const defaultTipFormatter = (value: number) => (typeof value === 'number' ? value.toString() : '');
export const sliderProps = () => ({
  id: String,
  rootClassName: String,
  prefixCls: String,
  tooltipPrefixCls: String,
  range: someType<boolean | SliderRange>([Boolean, Object]),
  reverse: booleanType(),
  min: Number,
  max: Number,
  step: someType<null | number>([Object, Number]),
  marks: objectType<SliderMarks>(),
  dots: booleanType(),
  value: someType<Value>([Array, Number]),
  defaultValue: someType<Value>([Array, Number]),
  included: booleanType(),
  disabled: booleanType(),
  vertical: booleanType(),
  orientation: stringType<'horizontal' | 'vertical'>(),
  tooltip: objectType<SliderTooltipProps>(),
  tipFormatter: someType<((value?: number) => any) | null>(
    [Function, Object],
    () => defaultTipFormatter,
  ),
  tooltipOpen: booleanType(),
  /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
  tooltipVisible: booleanType(),
  tooltipPlacement: stringType<TooltipPlacement>(),
  getTooltipPopupContainer: functionType<(triggerNode: HTMLElement) => HTMLElement>(),
  autofocus: booleanType(),
  handleStyle: someType<CSSProperties[] | CSSProperties>([Array, Object]),
  keyboard: { type: Boolean, default: true },
  ariaLabelForHandle: String,
  ariaLabelledByForHandle: String,
  ariaRequired: { type: Boolean, default: undefined },
  ariaValueTextFormatterForHandle: functionType<(value: number) => string>(),
  autoAdjustOverflow: { type: Boolean, default: undefined },
  trackStyle: someType<CSSProperties[] | CSSProperties>([Array, Object]),
  /** 语义化 classNames（antd 5.25+）：root / tracks / track / rail / handle */
  classNames: objectType<SemanticNames<SliderSemanticName>>(),
  /** 语义化 styles（antd 5.25+）：root / tracks / track / rail / handle */
  styles: objectType<SemanticStylesMap<SliderSemanticName>>(),
  onChange: functionType<(value: Value) => void>(),
  onAfterChange: functionType<(value: Value) => void>(),
  /** 5.0+ 拖拽结束回调（onAfterChange 别名） */
  onChangeComplete: functionType<(value: Value) => void>(),
  /** 5.20+ tooltip 格式化（tipFormatter 别名） */
  formatter: someType<Formatter>([Function, Object]),
  /** 5.20+ 自定义 handle 渲染 */
  handleRender:
    functionType<(node: any, info: { index: number; value: number; dragging: boolean }) => any>(),
  onFocus: functionType<FocusEventHandler>(),
  onBlur: functionType<FocusEventHandler>(),
  'onUpdate:value': functionType<(value: Value) => void>(),
});

export type SliderProps = Partial<ExtractPropTypes<ReturnType<typeof sliderProps>>>;
export type Visibles = { [index: number]: boolean };

const Slider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASlider',
  inheritAttrs: false,
  props: sliderProps(),
  // emits: ['update:value', 'change', 'afterChange', 'blur'],
  slots: Object as CustomSlotsType<{
    mark?: any;
    default?: any;
  }>,
  setup(props, { attrs, slots, emit, expose }) {
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      [['tooltipVisible', 'tooltipOpen']].forEach(([deprecatedName, newName]) => {
        devWarning(
          props.tooltipVisible === undefined,
          'Slider',
          `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`,
        );
      });
    }
    const { prefixCls, rootPrefixCls, direction, getPopupContainer, configProvider } =
      useConfigInject('slider', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formItemContext = useInjectFormItemContext();
    const sliderRef = ref();
    const visibles = ref<Visibles>({});
    const toggleTooltipOpen = (index: number, visible: boolean) => {
      visibles.value[index] = visible;
    };
    const mergedVertical = computed(() =>
      props.orientation !== undefined ? props.orientation === 'vertical' : !!props.vertical,
    );
    const tooltipPlacement = computed(() => {
      const customPlacement = props.tooltip?.placement ?? props.tooltipPlacement;
      if (customPlacement) {
        return customPlacement;
      }
      if (!mergedVertical.value) {
        return 'top';
      }
      return direction.value === 'rtl' ? 'left' : 'right';
    });

    const focus = () => {
      sliderRef.value?.focus();
    };
    const blur = () => {
      sliderRef.value?.blur();
    };
    const handleChange = (val: SliderValue) => {
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = (e: FocusEvent) => {
      emit('blur', e);
    };
    const handleAfterChange = (val: Value) => {
      emit('afterChange', val);
      emit('changeComplete', val);
    };
    expose({
      focus,
      blur,
    });
    const handleWithTooltip: HandleGeneratorFn = ({
      tooltipPrefixCls,
      info: { value, dragging, index, ...restProps },
    }) => {
      const {
        tooltip,
        tipFormatter,
        tooltipOpen,
        tooltipVisible,
        getTooltipPopupContainer,
        autoAdjustOverflow,
        formatter,
        handleRender,
      } = props;
      const mergedTooltipOpen = tooltip?.open ?? tooltipOpen ?? tooltipVisible;
      const mergedFormatter =
        tooltip && 'formatter' in tooltip && tooltip.formatter !== undefined
          ? tooltip.formatter
          : formatter !== undefined
          ? formatter
          : tipFormatter;
      const mergedGetPopupContainer =
        tooltip?.getPopupContainer ?? getTooltipPopupContainer ?? getPopupContainer?.value;
      const mergedAutoAdjustOverflow = tooltip?.autoAdjustOverflow ?? autoAdjustOverflow;
      const isTipFormatter = mergedFormatter ? visibles.value[index] || dragging : false;
      const open =
        mergedFormatter !== null &&
        (mergedTooltipOpen || (mergedTooltipOpen === undefined && isTipFormatter));
      const handleNode = (
        <SliderTooltip
          prefixCls={tooltipPrefixCls}
          title={mergedFormatter ? mergedFormatter(value) : ''}
          open={open}
          placement={tooltipPlacement.value}
          transitionName={`${rootPrefixCls.value}-zoom-down`}
          key={index}
          overlayClassName={classNames(`${prefixCls.value}-tooltip`, hashId.value)}
          getPopupContainer={mergedGetPopupContainer}
          {...(mergedAutoAdjustOverflow !== undefined
            ? { autoAdjustOverflow: mergedAutoAdjustOverflow }
            : {})}
        >
          <VcHandle
            {...restProps}
            value={value}
            onMouseenter={() => toggleTooltipOpen(index, true)}
            onMouseleave={() => toggleTooltipOpen(index, false)}
          />
        </SliderTooltip>
      );
      if (handleRender) {
        return handleRender(handleNode, { index, value, dragging });
      }
      return handleNode;
    };
    return () => {
      const {
        tooltipPrefixCls: customizeTooltipPrefixCls,
        tooltip,
        orientation: _orientation,
        vertical: _vertical,
        range,
        id = formItemContext.id.value,
        classNames: semanticClassNames,
        styles: semanticStyles,
        onAfterChange,
        onChangeComplete,
        formatter,
        handleRender,
        ...restProps
      } = props;
      const contextSlider = configProvider.slider?.value as any;
      const mergedSemanticClassNames: SemanticNames<SliderSemanticName> = {
        root: classNames(contextSlider?.classNames?.root, semanticClassNames?.root) || undefined,
        tracks:
          classNames(contextSlider?.classNames?.tracks, semanticClassNames?.tracks) || undefined,
        track: classNames(contextSlider?.classNames?.track, semanticClassNames?.track) || undefined,
        rail: classNames(contextSlider?.classNames?.rail, semanticClassNames?.rail) || undefined,
        handle:
          classNames(contextSlider?.classNames?.handle, semanticClassNames?.handle) || undefined,
      };
      const mergeStyle = (a?: CSSProperties, b?: CSSProperties) =>
        a || b ? { ...a, ...b } : undefined;
      const mergedSemanticStyles: SemanticStylesMap<SliderSemanticName> = {
        root: mergeStyle(contextSlider?.styles?.root, semanticStyles?.root),
        tracks: mergeStyle(contextSlider?.styles?.tracks, semanticStyles?.tracks),
        track: mergeStyle(contextSlider?.styles?.track, semanticStyles?.track),
        rail: mergeStyle(contextSlider?.styles?.rail, semanticStyles?.rail),
        handle: mergeStyle(contextSlider?.styles?.handle, semanticStyles?.handle),
      };
      const mergedTrackClassName =
        classNames(mergedSemanticClassNames.tracks, mergedSemanticClassNames.track) || undefined;

      const tooltipPrefixCls = configProvider.getPrefixCls(
        'tooltip',
        tooltip?.prefixCls ?? customizeTooltipPrefixCls,
      );
      const cls = classNames(
        contextSlider?.className,
        attrs.class,
        props.rootClassName,
        mergedSemanticClassNames.root,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
      );
      const mergedRootStyle = [
        contextSlider?.style,
        contextSlider?.styles?.root,
        attrs.style as any,
        semanticStyles?.root,
      ];

      // make reverse default on rtl direction
      if (direction.value === 'rtl' && !mergedVertical.value) {
        restProps.reverse = !restProps.reverse;
      }

      // extrack draggableTrack from range={{ ... }}
      let draggableTrack: boolean | undefined;
      if (typeof range === 'object') {
        draggableTrack = range.draggableTrack;
      }

      if (range) {
        const valueLength = Array.isArray(restProps.value)
          ? restProps.value.length
          : Array.isArray(restProps.defaultValue)
          ? restProps.defaultValue.length
          : 2;
        const rangeTrackCount = Math.max(
          1,
          valueLength - 1,
          Array.isArray(restProps.trackStyle) ? restProps.trackStyle.length : 0,
        );
        const rangeHandleCount = Math.max(
          2,
          valueLength,
          Array.isArray(restProps.handleStyle) ? restProps.handleStyle.length : 0,
        );
        const rangeTrackStyle = Array.from({ length: rangeTrackCount }, (_, idx) => ({
          ...mergedSemanticStyles.tracks,
          ...(Array.isArray(restProps.trackStyle)
            ? restProps.trackStyle[idx]
            : restProps.trackStyle),
          ...mergedSemanticStyles.track,
        }));
        const rangeHandleStyle = Array.from({ length: rangeHandleCount }, (_, idx) => ({
          ...(Array.isArray(restProps.handleStyle)
            ? restProps.handleStyle[idx]
            : restProps.handleStyle),
          ...mergedSemanticStyles.handle,
        }));
        return wrapSSR(
          <VcRange
            {...attrs}
            {...restProps}
            vertical={mergedVertical.value}
            step={restProps.step!}
            draggableTrack={draggableTrack}
            class={cls}
            style={mergedRootStyle}
            railClassName={mergedSemanticClassNames.rail}
            trackClassName={mergedTrackClassName}
            handleClassName={mergedSemanticClassNames.handle}
            railStyle={mergedSemanticStyles.rail}
            trackStyle={rangeTrackStyle}
            handleStyle={rangeHandleStyle}
            ref={sliderRef}
            handle={(info: HandleGeneratorInfo) =>
              handleWithTooltip({
                tooltipPrefixCls,
                prefixCls: prefixCls.value,
                info,
              })
            }
            prefixCls={prefixCls.value}
            onChange={handleChange}
            {...{ onAfterChange: handleAfterChange }}
            onBlur={handleBlur}
            v-slots={{ mark: slots.mark }}
          />,
        );
      }
      return wrapSSR(
        <VcSlider
          {...attrs}
          {...restProps}
          vertical={mergedVertical.value}
          id={id}
          step={restProps.step!}
          class={cls}
          style={mergedRootStyle}
          railClassName={mergedSemanticClassNames.rail}
          trackClassName={mergedTrackClassName}
          handleClassName={mergedSemanticClassNames.handle}
          railStyle={mergedSemanticStyles.rail}
          trackStyle={{
            ...mergedSemanticStyles.tracks,
            ...(Array.isArray(restProps.trackStyle)
              ? restProps.trackStyle[0]
              : restProps.trackStyle),
            ...mergedSemanticStyles.track,
          }}
          handleStyle={
            Array.isArray(restProps.handleStyle)
              ? restProps.handleStyle.map(s => ({ ...s, ...mergedSemanticStyles.handle }))
              : { ...restProps.handleStyle, ...mergedSemanticStyles.handle }
          }
          ref={sliderRef}
          handle={(info: HandleGeneratorInfo) =>
            handleWithTooltip({
              tooltipPrefixCls,
              prefixCls: prefixCls.value,
              info,
            })
          }
          prefixCls={prefixCls.value}
          onChange={handleChange}
          {...{ onAfterChange: handleAfterChange }}
          onBlur={handleBlur}
          v-slots={{ mark: slots.mark }}
        />,
      );
    };
  },
});

export default withInstall(Slider);
