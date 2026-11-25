import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
import type { CSSProperties, FunctionalComponent, PropType } from 'vue';

interface FillerProps {
  prefixCls?: string;
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height: number;
  /** Set offset of visible items. Should be the top of start item position */
  offset?: number;
  /** Optional horizontal scroll content width */
  scrollWidth?: number;
  onInnerResize?: () => void;
}

const Filter: FunctionalComponent<FillerProps> = (
  { height, offset, scrollWidth, prefixCls, onInnerResize },
  { slots },
) => {
  const hasScrollWidth = typeof scrollWidth === 'number' && scrollWidth > 0;
  let outerStyle: CSSProperties = hasScrollWidth
    ? { minWidth: '100%', width: `${scrollWidth}px` }
    : {};

  let innerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  if (offset !== undefined) {
    outerStyle = hasScrollWidth
      ? {
          height: `${height}px`,
          position: 'relative',
          minWidth: '100%',
          width: `${scrollWidth}px`,
        }
      : { height: `${height}px`, position: 'relative', overflow: 'hidden' };

    innerStyle = {
      ...innerStyle,
      transform: `translateY(${offset}px)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
    };
  }

  return (
    <div style={outerStyle}>
      <ResizeObserver
        onResize={({ offsetHeight }) => {
          if (offsetHeight && onInnerResize) {
            onInnerResize();
          }
        }}
      >
        <div
          style={innerStyle}
          class={classNames({
            [`${prefixCls}-holder-inner`]: prefixCls,
          })}
        >
          {slots.default?.()}
        </div>
      </ResizeObserver>
    </div>
  );
};

Filter.displayName = 'Filter';
Filter.inheritAttrs = false;
Filter.props = {
  prefixCls: String,
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height: Number,
  /** Set offset of visible items. Should be the top of start item position */
  offset: Number,
  scrollWidth: Number,
  onInnerResize: Function as PropType<() => void>,
};

export default Filter;
