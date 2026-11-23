import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import type { PropType } from 'vue';
import classNames from '../../_util/classNames';
import { AggregationColor, getGradientPercentColor } from '../color';
import type { GradientColorPoint } from '../color';

function sortColors(colors: GradientColorPoint[]): GradientColorPoint[] {
  return [...colors].sort((a, b) => a.percent - b.percent);
}

const gradientColorBarProps = () => ({
  prefixCls: String,
  /** 当前渐变色 */
  value: { type: Object as PropType<AggregationColor>, required: true },
  /** 当前激活的渐变点 index */
  activeIndex: { type: Number, default: 0 },
  onChange: Function as PropType<(color: AggregationColor) => void>,
  onChangeComplete: Function as PropType<(color: AggregationColor) => void>,
  onActive: Function as PropType<(index: number) => void>,
});

/**
 * 渐变条：展示渐变背景 + 可拖拽的渐变点（移动/增删）。
 */
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'GradientColorBar',
  props: gradientColorBarProps(),
  setup(props) {
    const barRef = ref<HTMLElement>();
    const draggingIndex = ref<number | null>(null);
    let lastDraggedColor: AggregationColor | null = null;

    const colors = computed(() => props.value.getColors());
    const colorList = computed(() =>
      colors.value.map(info => ({
        percent: info.percent,
        color: info.color.toRgbString(),
      })),
    );

    const linearCss = computed(() => {
      const str = colorList.value.map(c => `${c.color} ${c.percent}%`).join(', ');
      return `linear-gradient(90deg, ${str})`;
    });

    const getPercentFromEvent = (e: MouseEvent): number => {
      const el = barRef.value;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      if (!rect.width) return e.clientX > rect.left ? 100 : 0;
      return Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    };

    const handleMouseDown = (e: MouseEvent, index: number) => {
      e.stopPropagation();
      draggingIndex.value = index;
      lastDraggedColor = null;
      props.onActive?.(index);
      window.addEventListener('mousemove', onWindowMove);
      window.addEventListener('mouseup', onWindowUp);
    };

    const onWindowMove = (e: MouseEvent) => {
      if (draggingIndex.value === null) return;
      const curIndex = draggingIndex.value;
      const currentStop = colors.value[curIndex];
      if (!currentStop) return;
      const percent = Math.round(getPercentFromEvent(e));
      const draggedStop: GradientColorPoint = { ...currentStop, percent };
      const mapped = colors.value.map((c, i) => (i === curIndex ? draggedStop : c));
      const nextColors = sortColors(mapped);
      const nextIndex = nextColors.indexOf(draggedStop);
      if (nextIndex !== -1 && nextIndex !== curIndex) {
        draggingIndex.value = nextIndex;
        props.onActive?.(nextIndex);
      }
      const nextAgg = new AggregationColor(nextColors);
      lastDraggedColor = nextAgg;
      props.onChange?.(nextAgg);
    };

    const onWindowUp = () => {
      const wasDragging = draggingIndex.value !== null;
      draggingIndex.value = null;
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
      if (wasDragging) {
        props.onChangeComplete?.(lastDraggedColor ?? props.value);
        lastDraggedColor = null;
      }
    };

    onBeforeUnmount(() => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
    });

    // 点击空白处添加渐变点
    const handleBarClick = (e: MouseEvent) => {
      if (
        e.target !== barRef.value &&
        !(e.target as HTMLElement).classList.contains(`${props.prefixCls}-gradient-slider-bg`)
      )
        return;
      const percent = Math.round(getPercentFromEvent(e));
      const newPoint: GradientColorPoint = {
        color: new AggregationColor(getGradientPercentColor(colors.value, percent)),
        percent,
      };
      const nextColors = sortColors([...colors.value, newPoint]);
      const nextIndex = nextColors.indexOf(newPoint);
      const nextAgg = new AggregationColor(nextColors);
      props.onChange?.(nextAgg);
      props.onChangeComplete?.(nextAgg);
      props.onActive?.(nextIndex >= 0 ? nextIndex : nextColors.length - 1);
    };

    // 键盘删除渐变点
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && colors.value.length > 2) {
        const index = props.activeIndex;
        const nextColors = colors.value.filter((_, i) => i !== index);
        const nextAgg = new AggregationColor(nextColors);
        props.onChange?.(nextAgg);
        props.onChangeComplete?.(nextAgg);
        props.onActive?.(Math.min(index, nextColors.length - 1));
      }
    };

    return () => (
      <div class={`${props.prefixCls}-gradient-slider`} tabindex={0} onKeydown={handleKeyDown}>
        <div
          ref={barRef}
          class={`${props.prefixCls}-gradient-slider-bg`}
          style={{ background: linearCss.value }}
          onClick={handleBarClick}
        >
          {colors.value.map((c, index) => (
            <div
              key={index}
              class={classNames(`${props.prefixCls}-gradient-slider-handle`, {
                [`${props.prefixCls}-gradient-slider-handle-active`]: props.activeIndex === index,
              })}
              style={{
                left: `${c.percent}%`,
                background: c.color.toRgbString(),
              }}
              onMousedown={e => handleMouseDown(e, index)}
            />
          ))}
        </div>
      </div>
    );
  },
});
