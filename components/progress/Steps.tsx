import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import type { VueNode } from '../_util/type';
import { someType } from '../_util/type';
import type {
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
  ProgressSize,
  ProgressSteps,
} from './props';
import { progressProps } from './props';
import { getSize } from './utils';

export const stepsProps = () => ({
  ...progressProps(),
  steps: someType<ProgressSteps>([Number, Object]),
  strokeColor: someType<string | string[]>(),
  trailColor: String,
  railColor: String,
});

export type StepsProps = Partial<ExtractPropTypes<ReturnType<typeof stepsProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Steps',
  props: stepsProps(),
  setup(props, { slots }) {
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

    const stepCount = computed<number>(() => {
      const { steps } = props;
      if (typeof steps === 'number') {
        return steps;
      }
      if (steps && typeof steps === 'object') {
        return steps.count || 0;
      }
      return 0;
    });
    const customRounding = computed(() =>
      typeof props.rounding === 'function' ? props.rounding : Math.round,
    );
    const current = computed(() =>
      customRounding.value(stepCount.value * ((props.percent || 0) / 100)),
    );
    const mergedSize = computed(
      () => props.size ?? [props.size === 'small' ? 2 : 14, props.strokeWidth || 8],
    );
    const sizeRef = computed(() =>
      getSize(mergedSize.value as ProgressSize, 'step', {
        steps: stepCount.value,
        strokeWidth: props.strokeWidth || 8,
      }),
    );

    const styledSteps = computed(() => {
      const { strokeColor, railColor, trailColor, prefixCls } = props;
      const steps = stepCount.value;
      const mergedRailColor = railColor ?? trailColor;
      const semCls = semanticClassNames.value;
      const semStyle = semanticStyles.value;

      const temp: VueNode[] = [];
      for (let i = 0; i < steps; i += 1) {
        const isActive = i <= current.value - 1;
        const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
        const cls = {
          [`${prefixCls}-steps-item`]: true,
          [`${prefixCls}-steps-item-active`]: isActive,
        };
        const itemSemanticCls = isActive ? semCls.track : semCls.rail ?? semCls.track;
        const itemSemanticStyle = isActive ? semStyle.track : semStyle.rail ?? semStyle.track;
        temp.push(
          <div
            key={i}
            class={itemSemanticCls ? [cls, itemSemanticCls] : cls}
            style={{
              backgroundColor: isActive ? color : mergedRailColor,
              width: `${Number(sizeRef.value.width) / steps}px`,
              height: `${sizeRef.value.height}px`,
              ...itemSemanticStyle,
            }}
          />,
        );
      }
      return temp;
    });

    return () => (
      <div
        class={
          semanticClassNames.value.body
            ? [`${props.prefixCls}-steps-outer`, semanticClassNames.value.body]
            : `${props.prefixCls}-steps-outer`
        }
        style={semanticStyles.value.body}
      >
        {styledSteps.value}
        {slots.default?.()}
      </div>
    );
  },
});
