import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../../_util/classNames';
import Progress from './Progress';

export interface LooperProps {
  prefixCls: string;
  percent?: number;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SpinLooper',
  inheritAttrs: false,
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
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, percent = 0 } = props;
      const dotClassName = `${prefixCls}-dot`;
      const holderClassName = `${dotClassName}-holder`;
      const hideClassName = `${holderClassName}-hidden`;

      // ===================== Render =====================
      return (
        <>
          <span
            class={classNames(holderClassName, attrs.class, percent > 0 && hideClassName)}
            style={attrs.style as CSSProperties}
          >
            <span class={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
              {[1, 2, 3, 4].map(i => (
                <i class={`${prefixCls}-dot-item`} key={i} />
              ))}
            </span>
          </span>
          <Progress prefixCls={prefixCls} percent={percent} />
        </>
      );
    };
  },
});
