import { useTransitionDuration, defaultProps } from './common';
import type { GapPositionType } from './types';
import { propTypes } from './types';
import { computed, defineComponent, ref } from 'vue';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
import useRefs from '../../_util/hooks/useRefs';

let gradientSeed = 0;

function stripPercentToNumber(percent: string) {
  return +percent.replace('%', '');
}

function toArray(value: any) {
  return Array.isArray(value) ? value : [value];
}

function getBaseRotateDeg(gapDegree: number, gapPosition?: GapPositionType) {
  if (!gapDegree) {
    return -90;
  }
  const halfGap = gapDegree / 2;
  switch (gapPosition) {
    case 'bottom':
      return 90 + halfGap;
    case 'left':
      return 180 + halfGap;
    case 'right':
      return halfGap;
    case 'top':
    default:
      return -90 + halfGap;
  }
}

const TRANSITION =
  'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s';

function getPathStyles(
  offset: number,
  percent: number,
  strokeColor: string,
  strokeWidth: number,
  gapDegree = 0,
  gapPosition: GapPositionType,
) {
  const radius = 50 - strokeWidth / 2;
  let beginPositionX = 0;
  let beginPositionY = -radius;
  let endPositionX = 0;
  let endPositionY = -2 * radius;
  switch (gapPosition) {
    case 'left':
      beginPositionX = -radius;
      beginPositionY = 0;
      endPositionX = 2 * radius;
      endPositionY = 0;
      break;
    case 'right':
      beginPositionX = radius;
      beginPositionY = 0;
      endPositionX = -2 * radius;
      endPositionY = 0;
      break;
    case 'bottom':
      beginPositionY = radius;
      endPositionY = 2 * radius;
      break;
    default:
  }
  const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
   a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
   a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
  const len = Math.PI * 2 * radius;

  const pathStyle = {
    stroke: strokeColor,
    strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
    strokeDashoffset: `-${gapDegree / 2 + (offset / 100) * (len - gapDegree)}px`,
    transition:
      'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s', // eslint-disable-line
  };

  return {
    pathString,
    pathStyle,
  };
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'VCCircle',
  props: initDefaultProps(propTypes, defaultProps),
  setup(props) {
    gradientSeed += 1;
    const gradientId = ref(gradientSeed);
    const percentList = computed(() => toArray(props.percent));
    const strokeColorList = computed(() => toArray(props.strokeColor));

    const [setRef, paths] = useRefs();
    useTransitionDuration(paths);

    const stepConfig = computed(() => {
      const { steps } = props;
      if (!steps) {
        return null;
      }
      const config = typeof steps === 'object' ? steps : { count: steps, gap: 2 };
      const count = Number(config.count);
      if (!Number.isFinite(count) || count <= 0) {
        return null;
      }
      return {
        count: Math.floor(count),
        gap: config.gap ?? 2,
      };
    });

    const getStokeList = () => {
      const { prefixCls, strokeWidth, strokeLinecap, gapDegree, gapPosition } = props;

      let stackPtg = 0;
      return percentList.value.map((ptg, index) => {
        const color =
          strokeColorList.value[index] || strokeColorList.value[strokeColorList.value.length - 1];
        const stroke =
          Object.prototype.toString.call(color) === '[object Object]'
            ? `url(#${prefixCls}-gradient-${gradientId.value})`
            : '';
        const { pathString, pathStyle } = getPathStyles(
          stackPtg,
          ptg,
          color,
          strokeWidth,
          gapDegree,
          gapPosition,
        );

        stackPtg += ptg;

        const pathProps = {
          key: index,
          d: pathString,
          stroke,
          'stroke-linecap': strokeLinecap,
          'stroke-width': strokeWidth,
          opacity: ptg === 0 ? 0 : 1,
          'fill-opacity': '0',
          class: `${prefixCls}-circle-path`,
          style: pathStyle,
        };
        return <path ref={setRef(index)} {...pathProps} />;
      });
    };

    const getStepStokeList = (stepCount: number, stepGap: number) => {
      const { prefixCls, strokeWidth, trailWidth, trailColor, gapDegree, gapPosition } = props;
      const radius = 50 - strokeWidth / 2;
      const perimeter = Math.PI * 2 * radius;
      const realGapDegree = gapDegree && gapDegree > 0 ? gapDegree : 0;
      const perimeterWithoutGap = perimeter * ((360 - realGapDegree) / 360);
      const rotateDeg = getBaseRotateDeg(realGapDegree, gapPosition);
      const rawPercent = Array.isArray(props.percent) ? props.percent[0] ?? 0 : props.percent ?? 0;
      const current = Math.round(stepCount * (rawPercent / 100));
      const stepPtg = 100 / stepCount;
      const strokeDashoffset = Math.min(
        perimeterWithoutGap * ((100 - stepPtg) / 100) + stepGap,
        perimeterWithoutGap,
      );

      return new Array(stepCount).fill(null).map((_, index) => {
        const isActive = index <= current - 1;
        const activeColor =
          strokeColorList.value[index] || strokeColorList.value[strokeColorList.value.length - 1];
        const color = isActive ? activeColor : trailColor;
        const isGradientColor =
          color && Object.prototype.toString.call(color) === '[object Object]';
        const stroke = isGradientColor
          ? `url(#${prefixCls}-gradient-${gradientId.value})`
          : undefined;
        const angle = rotateDeg + (index * (360 - realGapDegree)) / stepCount;
        const circleStyle: Record<string, string | number> = {
          strokeDasharray: `${perimeterWithoutGap}px ${perimeter}`,
          strokeDashoffset,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50px 50px',
          transition: TRANSITION,
          fillOpacity: 0,
        };
        if (typeof color === 'string' && color) {
          circleStyle.stroke = color;
        }
        return (
          <circle
            key={index}
            ref={setRef(index)}
            class={isActive ? `${prefixCls}-circle-path` : `${prefixCls}-circle-trail`}
            cx={50}
            cy={50}
            r={radius}
            stroke={stroke}
            stroke-linecap="butt"
            stroke-width={isActive ? strokeWidth : trailWidth || strokeWidth}
            opacity={1}
            fill-opacity="0"
            style={circleStyle}
          />
        );
      });
    };

    return () => {
      const {
        prefixCls,
        strokeWidth,
        trailWidth,
        gapDegree,
        gapPosition,
        trailColor,
        strokeLinecap,
        strokeColor,
        steps,
        ...restProps
      } = props;
      const { pathString, pathStyle } = getPathStyles(
        0,
        100,
        trailColor,
        strokeWidth,
        gapDegree,
        gapPosition,
      );
      delete restProps.percent;
      const gradient = strokeColorList.value.find(
        color => Object.prototype.toString.call(color) === '[object Object]',
      );
      const pathFirst = {
        d: pathString,
        stroke: trailColor,
        'stroke-linecap': strokeLinecap,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0',
        class: `${prefixCls}-circle-trail`,
        style: pathStyle,
      };
      return (
        <svg class={`${prefixCls}-circle`} viewBox="0 0 100 100" {...restProps}>
          {gradient && (
            <defs>
              <linearGradient
                id={`${prefixCls}-gradient-${gradientId.value}`}
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                {Object.keys(gradient)
                  .sort((a, b) => stripPercentToNumber(a) - stripPercentToNumber(b))
                  .map((key, index) => (
                    <stop key={index} offset={key} stop-color={gradient[key]} />
                  ))}
              </linearGradient>
            </defs>
          )}
          {stepConfig.value ? (
            getStepStokeList(stepConfig.value.count, stepConfig.value.gap)
          ) : (
            <>
              <path {...pathFirst} />
              {getStokeList().reverse()}
            </>
          )}
        </svg>
      );
    };
  },
});
