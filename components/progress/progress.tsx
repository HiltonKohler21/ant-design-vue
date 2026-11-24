import { computed, defineComponent } from 'vue';
import { TinyColor } from '@ctrl/tinycolor';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import Line from './Line';
import Circle from './Circle';
import Steps from './Steps';
import { getSize, getSuccessPercent, validProgress } from './utils';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import devWarning from '../vc-util/devWarning';
import type {
  PercentPositionType,
  ProgressClassNamesType,
  ProgressProps,
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
  ProgressStylesType,
} from './props';
import { progressProps, progressStatuses } from './props';
import type { VueNode, CustomSlotsType } from '../_util/type';
import useStyle from './style';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AProgress',
  inheritAttrs: false,
  props: initDefaultProps(progressProps(), {
    type: 'line',
    percent: 0,
    showInfo: true,
    // null for different theme definition
    trailColor: null,
    size: 'default',
    strokeLinecap: 'round',
  }),
  slots: Object as CustomSlotsType<{
    default?: any;
    format?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('progress', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('progress');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        'successPercent' in props,
        'Progress',
        '`successPercent` is deprecated. Please use `success.percent` instead.',
      );

      devWarning('width' in props, 'Progress', '`width` is deprecated. Please use `size` instead.');
    }
    const mergedStrokeLinecap = computed(() =>
      props.rounding === true ? 'round' : props.strokeLinecap,
    );
    const mergedRailColor = computed(() => props.railColor ?? props.trailColor);
    const strokeColorNotArray = computed(() =>
      Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor,
    );
    const strokeColorIsBright = computed(() => {
      if (strokeColorNotArray.value) {
        const color =
          typeof strokeColorNotArray.value === 'string'
            ? strokeColorNotArray.value
            : Object.values(strokeColorNotArray.value)[0];
        return color ? new TinyColor(color).isLight() : false;
      }
      return false;
    });
    const normalizedPercentPosition = computed<Required<PercentPositionType> | null>(() => {
      const { percentPosition } = props;
      if (!percentPosition) {
        return null;
      }
      if (typeof percentPosition === 'string') {
        return {
          align: 'end',
          type: percentPosition,
        };
      }
      return {
        align: percentPosition.align ?? 'end',
        type: percentPosition.type ?? 'outer',
      };
    });
    const percentNumber = computed(() => {
      const { percent = 0 } = props;
      const successPercent = getSuccessPercent(props);
      return parseInt(
        successPercent !== undefined ? successPercent.toString() : percent.toString(),
        10,
      );
    });

    const progressStatus = computed(() => {
      const { status } = props;
      if (!progressStatuses.includes(status) && percentNumber.value >= 100) {
        return 'success';
      }
      return status || 'normal';
    });

    const mergedPropsForSemantic = computed<ProgressProps>(() => ({
      ...props,
      status: progressStatus.value,
      railColor: mergedRailColor.value,
      gapPlacement: props.gapPlacement ?? props.gapPosition,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ProgressSemanticClassNames,
      ProgressSemanticStyles,
      ProgressProps
    >(
      () => [contextClassNames.value as ProgressClassNamesType, props.classNames],
      () => [contextStyles.value as ProgressStylesType, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const classString = computed(() => {
      const { type, showInfo, size, steps } = props;
      const pre = prefixCls.value;
      const isPureLineType = type === 'line' && !steps;
      const pos = normalizedPercentPosition.value;
      const isPercentInner = pos?.type === 'inner';
      const circleWidth = type === 'circle' ? getSize(size, 'circle').width : 120;
      const sizeClassKey = typeof size === 'string' || typeof size === 'number' ? size : '';
      return {
        [pre]: true,
        [`${pre}-inline-circle`]:
          type === 'circle' && typeof circleWidth === 'number' && circleWidth <= 20,
        [`${pre}-${(type === 'dashboard' && 'circle') || type}`]: true,
        [`${pre}-steps`]: !!steps,
        [`${pre}-status-${progressStatus.value}`]: true,
        [`${pre}-show-info`]: showInfo,
        [`${pre}-show-info-inner`]: isPercentInner,
        [`${pre}-line-align-${pos?.align}`]: isPureLineType && !!pos,
        [`${pre}-line-position-${pos?.type}`]: isPureLineType && !!pos,
        [`${pre}-${sizeClassKey}`]: !!sizeClassKey,
        [`${pre}-rtl`]: direction.value === 'rtl',
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: true,
      };
    });

    const strokeColorNotGradient = computed(() =>
      typeof props.strokeColor === 'string' || Array.isArray(props.strokeColor)
        ? props.strokeColor
        : undefined,
    );

    const renderProcessInfo = () => {
      const { showInfo, format, type, percent, title, steps } = props;
      const successPercent = getSuccessPercent(props);
      if (!showInfo) return null;

      let text: VueNode;
      const textFormatter = format || slots?.format || ((val: number) => `${val}%`);
      const isLineType = type === 'line';
      const isPureLineType = isLineType && !steps;
      const pos = normalizedPercentPosition.value;
      const infoPosition = pos?.type;
      const infoAlign = pos?.align;
      const isBrightInnerColor =
        isLineType && strokeColorIsBright.value && infoPosition === 'inner';
      if (
        infoPosition === 'inner' ||
        format ||
        slots?.format ||
        (progressStatus.value !== 'exception' && progressStatus.value !== 'success')
      ) {
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus.value === 'exception') {
        text = isLineType ? <CloseCircleFilled /> : <CloseOutlined />;
      } else if (progressStatus.value === 'success') {
        text = isLineType ? <CheckCircleFilled /> : <CheckOutlined />;
      }
      return (
        <span
          class={[
            `${prefixCls.value}-text`,
            isPureLineType && pos
              ? {
                  [`${prefixCls.value}-text-bright`]: isBrightInnerColor,
                  [`${prefixCls.value}-text-${infoAlign}`]: true,
                  [`${prefixCls.value}-text-${infoPosition}`]: true,
                }
              : undefined,
            mergedClassNames.value.indicator,
          ]}
          style={mergedStyles.value.indicator}
          title={title === undefined && typeof text === 'string' ? text : undefined}
        >
          {text}
        </span>
      );
    };

    return () => {
      const { type, steps, title } = props;
      const { class: cls, style, ...restAttrs } = attrs;
      const progressInfo = renderProcessInfo();
      let progress: VueNode;
      // Render progress shape
      if (type === 'line') {
        const lineStepsCount = typeof steps === 'object' && steps ? steps.count : steps;
        progress = lineStepsCount ? (
          <Steps
            {...props}
            railColor={mergedRailColor.value}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
            strokeColor={strokeColorNotGradient.value}
            prefixCls={prefixCls.value}
            steps={lineStepsCount}
          >
            {progressInfo}
          </Steps>
        ) : (
          <Line
            {...props}
            railColor={mergedRailColor.value}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
            strokeLinecap={mergedStrokeLinecap.value}
            strokeColor={strokeColorNotArray.value}
            prefixCls={prefixCls.value}
            direction={direction.value}
            percentPosition={normalizedPercentPosition.value || undefined}
          >
            {progressInfo}
          </Line>
        );
      } else if (type === 'circle' || type === 'dashboard') {
        progress = (
          <Circle
            {...props}
            steps={steps}
            railColor={mergedRailColor.value}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
            direction={direction.value}
            strokeLinecap={mergedStrokeLinecap.value}
            prefixCls={prefixCls.value}
            strokeColor={strokeColorNotArray.value}
            progressStatus={progressStatus.value}
          >
            {progressInfo}
          </Circle>
        );
      }
      return wrapSSR(
        <div
          role="progressbar"
          {...restAttrs}
          class={[classString.value, contextClassName.value, mergedClassNames.value.root, cls]}
          style={[contextStyle.value, mergedStyles.value.root, style as any]}
          title={title}
        >
          {progress}
        </div>,
      );
    };
  },
});
