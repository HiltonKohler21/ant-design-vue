import type { CSSProperties, ExtractPropTypes } from 'vue';
import { presetPrimaryColors } from '@ant-design/colors';
import { computed, defineComponent } from 'vue';
import type { Direction } from '../config-provider';
import type {
  StringGradients,
  ProgressGradient,
  ProgressSize,
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
} from './props';
import { progressProps } from './props';
import { getSize, getSuccessPercent, validProgress } from './utils';
import devWarning from '../vc-util/devWarning';
import { anyType, stringType } from '../_util/type';

export const lineProps = () => ({
  ...progressProps(),
  strokeColor: anyType<string | ProgressGradient>(),
  direction: stringType<Direction>(),
});

export type LineProps = Partial<ExtractPropTypes<ReturnType<typeof lineProps>>>;

/**
 * {
 *   '0%': '#afc163',
 *   '75%': '#009900',
 *   '50%': 'green',     ====>     '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *   '25%': '#66FF00',
 *   '100%': '#ffffff'
 * }
 */
export const sortGradient = (gradients: StringGradients) => {
  let tempArr = [];
  Object.keys(gradients).forEach(key => {
    const formattedKey = parseFloat(key.replace(/%/g, ''));
    if (!isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key],
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(({ key, value }) => `${value} ${key}%`).join(', ');
};

/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export const handleGradient = (
  strokeColor: ProgressGradient,
  directionConfig?: Direction,
): CSSProperties => {
  const {
    from = presetPrimaryColors.blue,
    to = presetPrimaryColors.blue,
    direction = directionConfig === 'rtl' ? 'to left' : 'to right',
    ...rest
  } = strokeColor;
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest as StringGradients);
    return { backgroundImage: `linear-gradient(${direction}, ${sortedGradients})` };
  }
  return { backgroundImage: `linear-gradient(${direction}, ${from}, ${to})` };
};

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProgressLine',
  inheritAttrs: false,
  props: lineProps(),
  setup(props, { slots, attrs }) {
    const semanticClassNames = computed<ProgressSemanticClassNames>(() =>
      props.classNames && typeof props.classNames === 'object'
        ? (props.classNames as ProgressSemanticClassNames)
        : {},
    );
    const semanticStyles = computed<ProgressSemanticStyles>(() =>
      props.styles && typeof props.styles === 'object'
        ? (props.styles as ProgressSemanticStyles)
        : {},
    );

    const backgroundProps = computed<CSSProperties>(() => {
      const { strokeColor, direction } = props;
      return strokeColor && typeof strokeColor !== 'string'
        ? handleGradient(strokeColor, direction)
        : {
            backgroundColor: strokeColor as string,
          };
    });
    const borderRadius = computed(() =>
      props.strokeLinecap === 'square' || props.strokeLinecap === 'butt' ? 0 : undefined,
    );

    const mergedRailColor = computed(() => props.railColor ?? props.trailColor);

    const trailStyle = computed<CSSProperties>(() => {
      const baseStyle = mergedRailColor.value
        ? {
            backgroundColor: mergedRailColor.value,
          }
        : undefined;
      if (baseStyle && semanticStyles.value.rail) {
        return { ...baseStyle, ...semanticStyles.value.rail };
      }
      return semanticStyles.value.rail || baseStyle;
    });

    const mergedSize = computed(
      () => props.size ?? [-1, props.strokeWidth || (props.size === 'small' ? 6 : 8)],
    );

    const sizeRef = computed(() =>
      getSize(mergedSize.value as ProgressSize, 'line', { strokeWidth: props.strokeWidth }),
    );

    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        'strokeWidth' in props,
        'Progress',
        '`strokeWidth` is deprecated. Please use `size` instead.',
      );
    }

    const percentStyle = computed<CSSProperties>(() => {
      const { percent } = props;
      return {
        width: `${validProgress(percent)}%`,
        height: `${sizeRef.value.height}px`,
        borderRadius: borderRadius.value,
        ...backgroundProps.value,
        ...semanticStyles.value.track,
      };
    });

    const successPercent = computed(() => {
      return getSuccessPercent(props);
    });
    const successPercentStyle = computed<CSSProperties>(() => {
      const { success } = props;
      return {
        width: `${validProgress(successPercent.value)}%`,
        height: `${sizeRef.value.height}px`,
        borderRadius: borderRadius.value,
        backgroundColor: success?.strokeColor,
        ...semanticStyles.value.track,
      };
    });

    const outerStyle = computed<CSSProperties>(() => ({
      width: sizeRef.value.width < 0 ? '100%' : `${sizeRef.value.width}px`,
      height: `${sizeRef.value.height}px`,
      ...semanticStyles.value.body,
    }));

    const parsedPercentPosition = computed(() => {
      const { percentPosition } = props;
      if (!percentPosition) {
        return null;
      }
      if (typeof percentPosition === 'string') {
        return {
          align: 'end' as const,
          type: percentPosition,
        };
      }
      return {
        align: percentPosition.align ?? ('end' as const),
        type: percentPosition.type ?? ('outer' as const),
      };
    });

    return () => {
      const pos = parsedPercentPosition.value;
      if (pos) {
        const { align: infoAlign, type: infoPosition } = pos;
        const lineInner = (
          <div
            class={[`${props.prefixCls}-inner`, semanticClassNames.value.rail]}
            style={trailStyle.value}
          >
            <div
              class={[
                `${props.prefixCls}-bg`,
                `${props.prefixCls}-bg-${infoPosition}`,
                semanticClassNames.value.track,
              ]}
              style={percentStyle.value}
            >
              {infoPosition === 'inner' ? slots.default?.() : null}
            </div>
            {successPercent.value !== undefined ? (
              <div
                class={[`${props.prefixCls}-success-bg`, semanticClassNames.value.track]}
                style={successPercentStyle.value}
              />
            ) : null}
          </div>
        );

        if (infoPosition === 'outer' && infoAlign === 'center') {
          return (
            <div
              {...attrs}
              class={[
                `${props.prefixCls}-layout-bottom`,
                semanticClassNames.value.body,
                attrs.class,
              ]}
              style={[
                attrs.style as CSSProperties,
                {
                  width: sizeRef.value.width < 0 ? '100%' : `${sizeRef.value.width}px`,
                  ...semanticStyles.value.body,
                },
              ]}
            >
              {lineInner}
              {slots.default?.()}
            </div>
          );
        }

        const isOuterStart = infoPosition === 'outer' && infoAlign === 'start';
        const isOuterEnd = infoPosition === 'outer' && infoAlign === 'end';
        return (
          <div
            {...attrs}
            class={[`${props.prefixCls}-outer`, semanticClassNames.value.body, attrs.class]}
            style={[
              attrs.style as CSSProperties,
              {
                width: sizeRef.value.width < 0 ? '100%' : `${sizeRef.value.width}px`,
                ...semanticStyles.value.body,
              },
            ]}
          >
            {isOuterStart ? slots.default?.() : null}
            {lineInner}
            {isOuterEnd ? slots.default?.() : null}
          </div>
        );
      }

      return (
        <>
          <div
            {...attrs}
            class={[`${props.prefixCls}-outer`, semanticClassNames.value.body, attrs.class]}
            style={[attrs.style as CSSProperties, outerStyle.value]}
          >
            <div
              class={[`${props.prefixCls}-inner`, semanticClassNames.value.rail]}
              style={trailStyle.value}
            >
              <div
                class={[`${props.prefixCls}-bg`, semanticClassNames.value.track]}
                style={percentStyle.value}
              />
              {successPercent.value !== undefined ? (
                <div
                  class={[`${props.prefixCls}-success-bg`, semanticClassNames.value.track]}
                  style={successPercentStyle.value}
                />
              ) : null}
            </div>
          </div>
          {slots.default?.()}
        </>
      );
    };
  },
});
