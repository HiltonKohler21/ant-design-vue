import type { CSSProperties, VNodeTypes, ExtractPropTypes, PropType } from 'vue';
import { computed, ref, watch, onMounted, onBeforeUnmount, defineComponent } from 'vue';
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
import type { SliderSemanticName } from '../_util/semantic';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import SliderTooltip from './SliderTooltip';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form/FormItemContext';
import type { FocusEventHandler } from '../_util/EventInterface';

// CSSINJS
import useStyle from './style';
import devWarning from '../vc-util/devWarning';

export type { SliderSemanticName };
export type SliderSemanticClassNames = SemanticClassNames<SliderSemanticName>;
export type SliderSemanticStyles = SemanticStyles<SliderSemanticName>;
export type SliderClassNamesType =
  | SliderSemanticClassNames
  | ((info: { props: SliderProps }) => SliderSemanticClassNames);
export type SliderStylesType =
  | SliderSemanticStyles
  | ((info: { props: SliderProps }) => SliderSemanticStyles);

export type SliderValue = number | number[];

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
  editable?: boolean;
  minCount?: number;
  maxCount?: number;
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
type Value = number[] | number;

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
  disabled: someType<boolean | boolean[]>([Boolean, Array]),
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
  /** 语义化 classNames（支持对象或函数）：root / tracks / track / rail / handle */
  classNames: {
    type: [Object, Function] as PropType<SliderClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（支持对象或函数）：root / tracks / track / rail / handle */
  styles: {
    type: [Object, Function] as PropType<SliderStylesType>,
    default: undefined,
  },
  onChange: functionType<(value: Value) => void>(),
  onAfterChange: functionType<(value: Value) => void>(),
  /** 拖拽结束回调（onAfterChange 别名） */
  onChangeComplete: functionType<(value: Value) => void>(),
  /** tooltip 格式化（tipFormatter 别名） */
  formatter: someType<Formatter>([Function, Object]),
  /** 自定义 handle 渲染 */
  handleRender:
    functionType<(node: any, info: { index: number; value: number; dragging: boolean }) => any>(),
  onFocus: functionType<FocusEventHandler>(),
  onBlur: functionType<FocusEventHandler>(),
  'onUpdate:value': functionType<(value: Value) => void>(),
});

export type SliderProps = Partial<ExtractPropTypes<ReturnType<typeof sliderProps>>>;
export type SliderSingleProps = SliderProps & {
  range?: false;
  value?: number;
  defaultValue?: number;
};
export type SliderRangeProps = SliderProps & {
  range: true | SliderRange;
  value?: number[];
  defaultValue?: number[];
};
export type Visibles = { [index: number]: boolean };

const DELETE_THRESHOLD_PX = 20;

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
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('slider');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formItemContext = useInjectFormItemContext();
    const sliderRef = ref();
    const visibles = ref<Visibles>({});
    const draggingDeleteIndex = ref<number | null>(null);
    const toggleTooltipOpen = (index: number, visible: boolean) => {
      visibles.value[index] = visible;
    };
    const mergedVertical = computed(() =>
      props.orientation !== undefined ? props.orientation === 'vertical' : !!props.vertical,
    );
    const isDisabledArray = computed(() => Array.isArray(props.disabled));
    const isHandleDisabled = (index: number) =>
      Array.isArray(props.disabled) ? Boolean(props.disabled[index]) : Boolean(props.disabled);
    const allDisabled = computed(() =>
      Array.isArray(props.disabled)
        ? props.disabled.length > 0 && props.disabled.every(Boolean)
        : Boolean(props.disabled),
    );
    const hasAnyDisabled = computed(() =>
      Array.isArray(props.disabled) ? props.disabled.some(Boolean) : Boolean(props.disabled),
    );

    const rangeConfig = computed<SliderRange>(() =>
      typeof props.range === 'object' && props.range ? props.range : {},
    );
    const isEditable = computed(
      () =>
        Boolean(props.range) &&
        Boolean(rangeConfig.value.editable) &&
        !rangeConfig.value.draggableTrack &&
        !hasAnyDisabled.value,
    );
    const minCount = computed(() => rangeConfig.value.minCount ?? 0);
    const maxCount = computed(() => rangeConfig.value.maxCount);

    const normalizeRangeValue = (val: Value | undefined): number[] => {
      if (Array.isArray(val)) return [...val];
      if (typeof val === 'number') return [val];
      return [props.min ?? 0, props.min ?? 0];
    };

    const currentRangeValues = ref<number[]>(
      normalizeRangeValue(props.value !== undefined ? props.value : props.defaultValue),
    );
    watch(
      () => props.value,
      val => {
        if (val !== undefined) {
          currentRangeValues.value = normalizeRangeValue(val);
        }
      },
      { deep: true },
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
      if (props.range && Array.isArray(val)) {
        let nextVal = val;
        if (isDisabledArray.value) {
          const prev = currentRangeValues.value;
          nextVal = val.map((v, idx) =>
            isHandleDisabled(idx) && prev[idx] !== undefined ? prev[idx] : v,
          );
          const changed =
            nextVal.length !== prev.length || nextVal.some((v, idx) => v !== prev[idx]);
          if (!changed) {
            sliderRef.value?.setState?.({ bounds: [...prev] });
            return;
          }
          if (nextVal.some((v, idx) => v !== val[idx])) {
            sliderRef.value?.setState?.({ bounds: [...nextVal] });
          }
        }
        currentRangeValues.value = [...nextVal];
        emit('update:value', nextVal);
        emit('change', nextVal);
        formItemContext.onFieldChange();
        return;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = (e: FocusEvent) => {
      emit('blur', e);
    };
    const handleAfterChange = (val: Value) => {
      if (props.range && Array.isArray(val) && isDisabledArray.value) {
        emit('afterChange', [...currentRangeValues.value]);
        emit('changeComplete', [...currentRangeValues.value]);
        return;
      }
      emit('afterChange', val);
      emit('changeComplete', val);
    };

    const alignValue = (rawVal: number): number => {
      const minVal = props.min ?? 0;
      const maxVal = props.max ?? 100;
      const clamped = Math.min(Math.max(rawVal, minVal), maxVal);
      if (props.step === null && props.marks) {
        const markKeys = Object.keys(props.marks)
          .map(Number)
          .filter(n => !Number.isNaN(n));
        if (markKeys.length) {
          return markKeys.reduce((prev, curr) =>
            Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev,
          );
        }
      }
      const stepVal = props.step && props.step > 0 ? props.step : 1;
      const stepped = Math.round((clamped - minVal) / stepVal) * stepVal + minVal;
      const decimals = (stepVal.toString().split('.')[1] || '').length;
      return Number(Math.min(Math.max(stepped, minVal), maxVal).toFixed(decimals));
    };

    const calcValueFromPointer = (clientX: number, clientY: number, el: HTMLElement): number => {
      const rect = el.getBoundingClientRect();
      const minVal = props.min ?? 0;
      const maxVal = props.max ?? 100;
      const effectiveReverse =
        direction.value === 'rtl' && !mergedVertical.value ? !props.reverse : !!props.reverse;
      let ratio: number;
      if (mergedVertical.value) {
        const len = rect.height || 1;
        ratio = effectiveReverse ? (clientY - rect.top) / len : (rect.bottom - clientY) / len;
      } else {
        const len = rect.width || 1;
        ratio = effectiveReverse ? (rect.right - clientX) / len : (clientX - rect.left) / len;
      }
      ratio = Math.min(Math.max(ratio, 0), 1);
      return alignValue(minVal + ratio * (maxVal - minVal));
    };

    const removeHandleAt = (index: number) => {
      if (!isEditable.value) return;
      if (currentRangeValues.value.length <= minCount.value) return;
      const next = currentRangeValues.value.filter((_, i) => i !== index);
      currentRangeValues.value = next;
      if (props.value === undefined) {
        sliderRef.value?.setState?.({ bounds: next });
      }
      emit('update:value', next);
      emit('change', next);
      handleAfterChange(next);
      formItemContext.onFieldChange();
    };

    let boundEl: HTMLElement | null = null;
    let activeCleanupDrag: (() => void) | null = null;

    const onCaptureMouseDown = (e: MouseEvent) => {
      if (!isEditable.value || e.button !== 0 || !boundEl) return;
      const target = e.target as HTMLElement | null;
      const handleEl = target?.closest?.(`.${prefixCls.value}-handle`) as HTMLElement | null;
      if (handleEl) {
        const allHandles = Array.from(boundEl.querySelectorAll(`.${prefixCls.value}-handle`));
        const handleIndex = allHandles.indexOf(handleEl);
        if (handleIndex === -1 || currentRangeValues.value.length <= minCount.value) return;
        const startPerp = mergedVertical.value ? e.clientX : e.clientY;
        const onWindowMove = (moveEv: MouseEvent) => {
          const curPerp = mergedVertical.value ? moveEv.clientX : moveEv.clientY;
          if (Math.abs(curPerp - startPerp) > DELETE_THRESHOLD_PX) {
            draggingDeleteIndex.value = handleIndex;
          } else {
            draggingDeleteIndex.value = null;
          }
        };
        const onWindowUp = () => {
          const deleteIdx = draggingDeleteIndex.value;
          draggingDeleteIndex.value = null;
          cleanup();
          if (deleteIdx !== null) {
            removeHandleAt(deleteIdx);
          }
        };
        const cleanup = () => {
          window.removeEventListener('mousemove', onWindowMove);
          window.removeEventListener('mouseup', onWindowUp);
          activeCleanupDrag = null;
        };
        activeCleanupDrag?.();
        activeCleanupDrag = cleanup;
        window.addEventListener('mousemove', onWindowMove);
        window.addEventListener('mouseup', onWindowUp);
        return;
      }

      // Clicking on rail/track/mark adds a new handle when below maxCount
      if (maxCount.value !== undefined && currentRangeValues.value.length >= maxCount.value) {
        return;
      }
      if (target?.closest?.(`.${prefixCls.value}-mark-text`)) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      const newVal = calcValueFromPointer(e.clientX, e.clientY, boundEl);
      const next = [...currentRangeValues.value, newVal].sort((a, b) => a - b);
      currentRangeValues.value = next;
      if (props.value === undefined) {
        sliderRef.value?.setState?.({ bounds: next });
      }
      emit('update:value', next);
      emit('change', next);
      handleAfterChange(next);
      formItemContext.onFieldChange();
    };

    const onCaptureKeyDown = (e: KeyboardEvent) => {
      if (!isEditable.value || !boundEl) return;
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const target = e.target as HTMLElement | null;
      const handleEl = target?.closest?.(`.${prefixCls.value}-handle`) as HTMLElement | null;
      if (!handleEl) return;
      const allHandles = Array.from(boundEl.querySelectorAll(`.${prefixCls.value}-handle`));
      const handleIndex = allHandles.indexOf(handleEl);
      if (handleIndex !== -1 && currentRangeValues.value.length > minCount.value) {
        e.preventDefault();
        e.stopPropagation();
        removeHandleAt(handleIndex);
      }
    };

    const bindEditableListeners = () => {
      const nextEl = sliderRef.value?.$el as HTMLElement | undefined;
      if (boundEl && boundEl !== nextEl) {
        boundEl.removeEventListener('mousedown', onCaptureMouseDown, true);
        boundEl.removeEventListener('keydown', onCaptureKeyDown, true);
        boundEl = null;
      }
      if (nextEl && boundEl !== nextEl) {
        boundEl = nextEl;
        boundEl.addEventListener('mousedown', onCaptureMouseDown, true);
        boundEl.addEventListener('keydown', onCaptureKeyDown, true);
      }
    };

    onMounted(() => {
      bindEditableListeners();
    });
    watch(
      () => [props.range, isEditable.value],
      () => {
        bindEditableListeners();
      },
      { flush: 'post' },
    );
    onBeforeUnmount(() => {
      activeCleanupDrag?.();
      if (boundEl) {
        boundEl.removeEventListener('mousedown', onCaptureMouseDown, true);
        boundEl.removeEventListener('keydown', onCaptureKeyDown, true);
        boundEl = null;
      }
    });

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
      const handleDisabled = isHandleDisabled(index);
      const isDeleting = draggingDeleteIndex.value === index;
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

      const rawRest = restProps as Record<string, any>;
      const handleCls = classNames(rawRest.class, {
        [`${prefixCls.value}-handle-disabled`]: handleDisabled,
      });
      const handleInlineStyle = isDeleting ? [rawRest.style, { opacity: 0.4 }] : rawRest.style;

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
            {...rawRest}
            class={handleCls}
            style={handleInlineStyle}
            disabled={handleDisabled}
            value={value}
            onMousedown={
              handleDisabled
                ? (e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }
                : undefined
            }
            {...(handleDisabled
              ? ({
                  onTouchstart: (e: TouchEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                  },
                } as any)
              : {})}
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
        disabled: _disabled,
        id = formItemContext.id.value,
        classNames: semanticClassNames,
        styles: semanticStyles,
        onAfterChange,
        onChangeComplete,
        formatter,
        handleRender,
        ...restProps
      } = props;

      const mergedPropsForSemantic: SliderProps = {
        ...props,
        disabled: props.disabled ?? allDisabled.value,
        vertical: mergedVertical.value,
        orientation: props.orientation ?? (mergedVertical.value ? 'vertical' : 'horizontal'),
      };

      const [mergedSemanticClassNames, mergedSemanticStyles] = mergeSemantic<
        SliderSemanticClassNames,
        SliderSemanticStyles,
        SliderProps
      >([contextClassNames.value, semanticClassNames], [contextStyles.value, semanticStyles], {
        props: mergedPropsForSemantic,
      });

      const mergedTrackClassName =
        classNames(mergedSemanticClassNames.tracks, mergedSemanticClassNames.track) || undefined;

      const tooltipPrefixCls = configProvider.getPrefixCls(
        'tooltip',
        tooltip?.prefixCls ?? customizeTooltipPrefixCls,
      );
      const cls = classNames(
        contextClassName.value,
        attrs.class,
        props.rootClassName,
        mergedSemanticClassNames.root,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
      );
      const mergedRootStyle = [contextStyle.value, mergedSemanticStyles.root, attrs.style as any];

      // make reverse default on rtl direction
      if (direction.value === 'rtl' && !mergedVertical.value) {
        restProps.reverse = !restProps.reverse;
      }

      // extract draggableTrack from range={{ ... }}
      let draggableTrack: boolean | undefined;
      if (typeof range === 'object') {
        draggableTrack = range.draggableTrack && !range.editable && !hasAnyDisabled.value;
      }

      if (range) {
        const rangeVals = currentRangeValues.value;
        const valueLength = Array.isArray(restProps.value)
          ? restProps.value.length
          : Array.isArray(restProps.defaultValue)
          ? restProps.defaultValue.length
          : Math.max(2, rangeVals.length);
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

        const hasTracksOverlay =
          rangeVals.length >= 2 &&
          Boolean(mergedSemanticStyles.tracks || mergedSemanticClassNames.tracks);
        const renderTracksOverlay = () => {
          if (!hasTracksOverlay) return null;
          const minBound = props.min ?? 0;
          const maxBound = props.max ?? 100;
          const span = maxBound - minBound || 1;
          const minVal = Math.min(...rangeVals);
          const maxVal = Math.max(...rangeVals);
          const startPct = Math.max(0, ((minVal - minBound) / span) * 100);
          const lengthPct = Math.max(0, ((maxVal - minVal) / span) * 100);
          const posStyle: CSSProperties = mergedVertical.value
            ? {
                [restProps.reverse ? 'top' : 'bottom']: `${startPct}%`,
                [restProps.reverse ? 'bottom' : 'top']: 'auto',
                height: `${lengthPct}%`,
              }
            : {
                [restProps.reverse ? 'right' : 'left']: `${startPct}%`,
                [restProps.reverse ? 'left' : 'right']: 'auto',
                width: `${lengthPct}%`,
              };
          return (
            <div
              class={classNames(`${prefixCls.value}-tracks`, mergedSemanticClassNames.tracks)}
              style={[posStyle, mergedSemanticStyles.tracks]}
            />
          );
        };

        return wrapSSR(
          <VcRange
            {...attrs}
            {...restProps}
            {...({ allowCross: !isDisabledArray.value } as any)}
            disabled={allDisabled.value}
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
            v-slots={{
              mark: slots.mark,
              default: hasTracksOverlay ? renderTracksOverlay : undefined,
            }}
          />,
        );
      }
      return wrapSSR(
        <VcSlider
          {...attrs}
          {...restProps}
          disabled={allDisabled.value}
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
