import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { withInstall } from '../_util/type';
import useStyle from './style';

export type BorderBeamGradient = { color: string; percent: number }[];
export type BorderBeamColor = string | BorderBeamGradient;

export interface BorderBeamItem {
  color?: BorderBeamColor;
  lineWidth?: number | string;
  outset?: number | string;
  size?: number | string;
}

export const DEFAULT_BORDER_BEAM_DURATION = 6;
export const MAX_BEAM_COLOR_STOP_PERCENT = 70;

const toCssSize = (value?: number | string) =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined);

export const getBorderBeamGradient = (value?: BorderBeamColor): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') {
    return `conic-gradient(from 0deg, transparent 0%, ${value} ${MAX_BEAM_COLOR_STOP_PERCENT}%, transparent ${MAX_BEAM_COLOR_STOP_PERCENT + 20}%)`;
  }
  if (Array.isArray(value) && value.length) {
    const stops = value.map(i => `${i.color} ${i.percent}%`).join(', ');
    return `conic-gradient(from 0deg, transparent 0%, ${stops}, transparent ${MAX_BEAM_COLOR_STOP_PERCENT + 20}%)`;
  }
  return undefined;
};

export const borderBeamProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 光束颜色：色值或渐变色标数组 */
  color: { type: [String, Array] as PropType<BorderBeamColor> },
  /** 光束数量 */
  count: { type: Number, default: 1 },
  /** 单圈动画时长（秒） */
  duration: { type: Number, default: DEFAULT_BORDER_BEAM_DURATION },
  /** 逐条配置（优先于 count/color/lineWidth/outset/size） */
  items: { type: Array as PropType<BorderBeamItem[]> },
  /** 边框厚度 */
  lineWidth: { type: [Number, String] as PropType<number | string>, default: 1 },
  /** 光束向外偏移 */
  outset: { type: [Number, String] as PropType<number | string> },
  /** 光束长度（对应锥形渐变角度占比，1~100） */
  size: { type: [Number, String] as PropType<number | string> },
});

export type BorderBeamProps = Partial<ExtractPropTypes<ReturnType<typeof borderBeamProps>>>;

const BorderBeam = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABorderBeam',
  inheritAttrs: false,
  props: borderBeamProps(),
  setup(props, { attrs, slots }) {
    const { getPrefixCls } = useConfigInject('border-beam', props);
    const prefixCls = computed(() => getPrefixCls('border-beam', props.prefixCls));
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const beams = computed(() => {
      const items = props.items;
      const count = items?.length
        ? items.length
        : Math.max(1, Math.floor(Number(props.count) || 1));
      return Array.from({ length: count }, (_, index) => {
        const item = items?.[index] ?? {};
        const gradient = getBorderBeamGradient(item.color ?? props.color);
        const duration = Number(props.duration) > 0 ? Number(props.duration) : DEFAULT_BORDER_BEAM_DURATION;
        return {
          key: `${count}-${index}`,
          gradient,
          lineWidth: item.lineWidth ?? props.lineWidth,
          outset: item.outset ?? props.outset,
          size: item.size ?? props.size,
          duration,
          delay: (index / count) * duration,
        };
      });
    });

    return () =>
      wrapSSR(
        <div
          {...attrs}
        class={classNames(prefixCls.value, props.rootClassName, attrs.class as any, hashId.value)}
        style={attrs.style as CSSProperties}
      >
        {slots.default?.()}
        {beams.value.map(beam => {
          const inset =
            beam.outset != null
              ? `calc(-1 * ${toCssSize(beam.outset)})`
              : `calc(-1 * ${toCssSize(beam.lineWidth) ?? '1px'})`;
          const style: CSSProperties = {
            inset,
            padding: toCssSize(beam.lineWidth) ?? '1px',
            animationDuration: `${beam.duration}s`,
            animationDelay: `${beam.delay}s`,
            ['--beam-gradient' as any]: beam.gradient,
            ['--beam-size' as any]: beam.size != null ? `${beam.size}%` : undefined,
          };
            return <div key={beam.key} class={`${prefixCls.value}-beam`} style={style} />;
          })}
        </div>,
      );
  },
});

export default withInstall(BorderBeam);
