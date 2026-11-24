import type { CSSProperties } from 'vue';
import { computed, defineComponent, onMounted, onUpdated, ref } from 'vue';
import { Circle as VCCircle } from '../vc-progress';
import { getPercentage, getSize, getStrokeColor } from './utils';
import type {
  GapPosition,
  ProgressProps,
  ProgressGradient,
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
} from './props';
import { progressProps } from './props';
import { initDefaultProps } from '../_util/props-util';
import Tooltip from '../tooltip';
import { anyType, stringType } from '../_util/type';
import type { Direction } from '../config-provider';
import { useComponentConfig } from '../config-provider/hooks/useConfigInject';

export interface CircleProps extends ProgressProps {
  strokeColor?: string | ProgressGradient;
  direction?: Direction;
}

export const circleProps = () => ({
  ...progressProps(),
  strokeColor: anyType<string | ProgressGradient>(),
  direction: stringType<Direction>(),
});

const CIRCLE_MIN_STROKE_WIDTH = 3;

const getMinPercent = (width: number): number => (CIRCLE_MIN_STROKE_WIDTH / width) * 100;

function splitClassTokens(cls?: string): string[] {
  return cls ? cls.split(/\s+/).filter(Boolean) : [];
}

function applyStylePatch(el: SVGElement, prevKeys: string[], nextStyle?: CSSProperties): string[] {
  const nextEntries = nextStyle ? Object.entries(nextStyle) : [];
  const nextKeySet = new Set(nextEntries.map(([k]) => k));
  for (const key of prevKeys) {
    if (!nextKeySet.has(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  }
  const appliedKeys: string[] = [];
  for (const [key, value] of nextEntries) {
    if (value === undefined || value === null) continue;
    if (key.startsWith('--')) {
      el.style.setProperty(key, String(value));
    } else {
      (el.style as any)[key] = String(value);
    }
    appliedKeys.push(key);
  }
  return appliedKeys;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProgressCircle',
  inheritAttrs: false,
  props: initDefaultProps(circleProps(), {
    trailColor: null as unknown as string,
  }),
  setup(props, { slots, attrs }) {
    const { direction: contextDirection } = useComponentConfig('progress');
    const wrapperRef = ref<HTMLElement | null>(null);

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

    let prevRailClasses: string[] = [];
    let prevTrackClasses: string[] = [];
    let prevRailStyleKeys: string[] = [];
    let prevTrackStyleKeys: string[] = [];

    const syncSvgSemantics = () => {
      const root = wrapperRef.value;
      if (!root) return;
      const nextRailClasses = splitClassTokens(semanticClassNames.value.rail);
      const nextTrackClasses = splitClassTokens(semanticClassNames.value.track);
      const nextRailStyle = semanticStyles.value.rail;
      const nextTrackStyle = semanticStyles.value.track;

      const hasWork =
        prevRailClasses.length > 0 ||
        prevTrackClasses.length > 0 ||
        prevRailStyleKeys.length > 0 ||
        prevTrackStyleKeys.length > 0 ||
        nextRailClasses.length > 0 ||
        nextTrackClasses.length > 0 ||
        Boolean(nextRailStyle) ||
        Boolean(nextTrackStyle);
      if (!hasWork) return;

      const allPrevStyleKeys = Array.from(new Set([...prevRailStyleKeys, ...prevTrackStyleKeys]));

      const trailEls = root.querySelectorAll<SVGElement>(`.${props.prefixCls}-circle-trail`);
      let nextRailKeys: string[] = [];
      trailEls.forEach(trailEl => {
        for (const cls of prevTrackClasses) {
          trailEl.classList.remove(cls);
        }
        for (const cls of prevRailClasses) {
          trailEl.classList.remove(cls);
        }
        for (const cls of nextRailClasses) {
          trailEl.classList.add(cls);
        }
        nextRailKeys = applyStylePatch(trailEl, allPrevStyleKeys, nextRailStyle);
      });
      prevRailClasses = nextRailClasses;
      prevRailStyleKeys = nextRailKeys;

      const pathEls = root.querySelectorAll<SVGElement>(`.${props.prefixCls}-circle-path`);
      let nextTrackKeys: string[] = [];
      pathEls.forEach(pathEl => {
        for (const cls of prevRailClasses) {
          pathEl.classList.remove(cls);
        }
        for (const cls of prevTrackClasses) {
          pathEl.classList.remove(cls);
        }
        for (const cls of nextTrackClasses) {
          pathEl.classList.add(cls);
        }
        nextTrackKeys = applyStylePatch(pathEl, allPrevStyleKeys, nextTrackStyle);
      });
      prevTrackClasses = nextTrackClasses;
      prevTrackStyleKeys = nextTrackKeys;
    };

    onMounted(syncSvgSemantics);
    onUpdated(syncSvgSemantics);

    const originWidth = computed(() => props.width ?? 120);
    const mergedSize = computed(() => props.size ?? [originWidth.value, originWidth.value]);

    const sizeRef = computed(() => {
      const { width, height } = getSize(mergedSize.value as ProgressProps['size'], 'circle');
      return {
        width: Number(width),
        height,
      };
    });
    const gapDeg = computed(() => {
      // Support gapDeg = 0 when type = 'dashboard'
      if (props.gapDegree || props.gapDegree === 0) {
        return props.gapDegree;
      }
      if (props.type === 'dashboard') {
        return 75;
      }
      return undefined;
    });

    const circleStyle = computed<CSSProperties>(() => {
      return {
        width: `${sizeRef.value.width}px`,
        height: `${sizeRef.value.height}px`,
        fontSize: `${sizeRef.value.width * 0.15 + 6}px`,
        ...semanticStyles.value.body,
      };
    });

    const circleWidth = computed(
      () => props.strokeWidth ?? Math.max(getMinPercent(sizeRef.value.width), 6),
    );
    const gapPos = computed<GapPosition | undefined>(() => {
      const mergedPlacement =
        (props.gapPlacement ?? props.gapPosition) ||
        (props.type === 'dashboard' && 'bottom') ||
        undefined;
      const isRTL = (props.direction ?? contextDirection.value) === 'rtl';
      switch (mergedPlacement) {
        case 'start':
          return isRTL ? 'right' : 'left';
        case 'end':
          return isRTL ? 'left' : 'right';
        default:
          return mergedPlacement;
      }
    });

    const mergedRailColor = computed(() => props.railColor ?? props.trailColor);

    // using className to style stroke color
    const percent = computed(() => getPercentage(props));
    const isGradient = computed(
      () => Object.prototype.toString.call(props.strokeColor) === '[object Object]',
    );
    const strokeColor = computed(() =>
      getStrokeColor({ success: props.success, strokeColor: props.strokeColor }),
    );
    const wrapperClassName = computed(() => ({
      [`${props.prefixCls}-inner`]: true,
      [`${props.prefixCls}-circle-gradient`]: isGradient.value,
    }));

    const hasSteps = computed(() =>
      Boolean(typeof props.steps === 'object' && props.steps ? props.steps.count : props.steps),
    );

    return () => {
      const circleContent = (
        <VCCircle
          steps={props.steps}
          percent={hasSteps.value ? percent.value[1] : percent.value}
          strokeWidth={circleWidth.value}
          trailWidth={circleWidth.value}
          strokeColor={hasSteps.value ? strokeColor.value[1] : strokeColor.value}
          strokeLinecap={props.strokeLinecap}
          trailColor={mergedRailColor.value}
          prefixCls={props.prefixCls}
          gapDegree={gapDeg.value}
          gapPosition={gapPos.value}
        />
      );
      return (
        <div
          ref={wrapperRef}
          {...attrs}
          class={[wrapperClassName.value, semanticClassNames.value.body, attrs.class]}
          style={[attrs.style as CSSProperties, circleStyle.value]}
        >
          {sizeRef.value.width <= 20 ? (
            <Tooltip v-slots={{ title: slots.default }}>
              <span>{circleContent}</span>
            </Tooltip>
          ) : (
            <>
              {circleContent}
              {slots.default?.()}
            </>
          )}
        </div>
      );
    };
  },
});
