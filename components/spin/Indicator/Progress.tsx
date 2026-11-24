import type { CSSProperties } from 'vue';
import { defineComponent, shallowRef, watch } from 'vue';
import classNames from '../../_util/classNames';

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

const viewSize = 100;
const borderWidth = viewSize / 5;
const radius = viewSize / 2 - borderWidth / 2;
const circumference = radius * 2 * Math.PI;
const position = 50;

interface CircleProps {
  dotClassName: string;
  style?: CSSProperties;
  hasCircleCls?: boolean;
}

const CustomCircle = ({ dotClassName, style, hasCircleCls }: CircleProps) => (
  <circle
    class={classNames(`${dotClassName}-circle`, {
      [`${dotClassName}-circle-bg`]: hasCircleCls,
    })}
    r={radius}
    cx={position}
    cy={position}
    stroke-width={borderWidth}
    style={style}
  />
);

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SpinProgress',
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const render = shallowRef(false);

    // ==================== Visible =====================
    watch(
      () => props.percent,
      val => {
        if (val !== 0) {
          render.value = true;
        }
      },
      { immediate: true },
    );

    return () => {
      // ===================== Render =====================
      if (!render.value) {
        return null;
      }

      const dotClassName = `${props.prefixCls}-dot`;
      const holderClassName = `${dotClassName}-holder`;
      const hideClassName = `${holderClassName}-hidden`;

      // ==================== Progress ====================
      const safePtg = Math.max(Math.min(props.percent, 100), 0);

      const circleStyle: CSSProperties = {
        strokeDashoffset: `${circumference / 4}`,
        strokeDasharray: `${(circumference * safePtg) / 100} ${
          (circumference * (100 - safePtg)) / 100
        }`,
      };

      return (
        <span
          class={classNames(holderClassName, `${dotClassName}-progress`, {
            [hideClassName]: safePtg <= 0,
          })}
        >
          <svg
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safePtg}
          >
            <CustomCircle dotClassName={dotClassName} hasCircleCls />
            <CustomCircle dotClassName={dotClassName} style={circleStyle} />
          </svg>
        </span>
      );
    };
  },
});
