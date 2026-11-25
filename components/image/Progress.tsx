import type { CSSProperties, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import { functionType, objectType } from '../_util/type';

// Visually hidden styles for screen readers
const VISUALLY_HIDDEN_STYLE: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export type ProgressClassNames = {
  root?: string;
  content?: string;
  rail?: string;
  indicator?: string;
};

export type ProgressStyles = {
  root?: CSSProperties;
  content?: CSSProperties;
  rail?: CSSProperties;
  indicator?: CSSProperties;
};

export interface ImageProgressProps {
  prefixCls: string;
  percent?: number;
  render?: (progress: VueNode, percent: number) => VueNode;
  classNames?: ProgressClassNames;
  styles?: ProgressStyles;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}

const ImageProgress = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AImageProgress',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, required: true },
    percent: { type: Number },
    render: functionType<(progress: VueNode, percent: number) => VueNode>(),
    classNames: objectType<ProgressClassNames>(),
    styles: objectType<ProgressStyles>(),
    rootClassName: { type: String },
    rootStyle: objectType<CSSProperties>(),
    width: { type: [Number, String] as PropType<number | string> },
    height: { type: [Number, String] as PropType<number | string> },
  },
  setup(props, { attrs }) {
    return () => {
      const {
        prefixCls,
        percent,
        render: progressRender,
        classNames: progressClassNames,
        styles: progressStyles,
        rootClassName,
        rootStyle,
        width,
        height,
      } = props;

      const hasPercent = typeof percent === 'number' && Number.isFinite(percent);
      const percentValue = hasPercent ? Math.max(0, Math.min(100, Math.round(percent))) : 0;

      const ariaProps = hasPercent
        ? {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': percentValue,
            'aria-label': `${percentValue}%`,
          }
        : {
            'aria-busy': true,
          };

      const progressBar = hasPercent ? (
        <div
          class={classNames(`${prefixCls}-progress-rail`, progressClassNames?.rail)}
          style={{
            ...progressStyles?.rail,
            '--progress-percent': `${percentValue}%`,
          }}
        />
      ) : null;

      const progressContent = progressRender ? (
        progressRender(progressBar, percentValue)
      ) : (
        <>
          {progressBar}
          {hasPercent && (
            <div
              class={classNames(`${prefixCls}-progress-indicator`, progressClassNames?.indicator)}
              style={progressStyles?.indicator}
            >
              {`${percentValue}%`}
            </div>
          )}
        </>
      );

      const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
      const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

      return (
        <div
          {...attrs}
          class={classNames(
            prefixCls,
            `${prefixCls}-progress-wrapper`,
            progressClassNames?.root,
            rootClassName,
            attrs.class,
          )}
          style={[
            {
              width: resolvedWidth,
              height: resolvedHeight,
            },
            rootStyle,
            progressStyles?.root,
            attrs.style as CSSProperties,
          ]}
          {...ariaProps}
        >
          {!hasPercent && (
            <span role="status" aria-live="polite" style={VISUALLY_HIDDEN_STYLE}>
              Loading
            </span>
          )}
          <div class={`${prefixCls}-progress-ink-1`} />
          <div class={`${prefixCls}-progress-ink-2`} />
          <div
            class={classNames(`${prefixCls}-progress-content`, progressClassNames?.content)}
            style={progressStyles?.content}
          >
            {progressContent}
          </div>
        </div>
      );
    };
  },
});

export default ImageProgress;
