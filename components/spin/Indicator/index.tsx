import type { CSSProperties, PropType } from 'vue';
import { cloneVNode, defineComponent, isVNode } from 'vue';
import classNames from '../../_util/classNames';
import { filterEmpty } from '../../_util/props-util';
import type { VueNode } from '../../_util/type';
import Looper from './Looper';

export interface IndicatorProps {
  prefixCls: string;
  indicator?: VueNode;
  percent?: number;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SpinIndicator',
  inheritAttrs: false,
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    indicator: {
      type: null as unknown as PropType<VueNode>,
      default: undefined,
    },
    percent: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, indicator, percent } = props;
      const dotClassName = `${prefixCls}-dot`;

      // Preserve Vue legacy behavior: do not render default indicator when indicator is explicitly null
      if (indicator === null) {
        return null;
      }

      let resolvedIndicator: any = indicator;
      if (Array.isArray(resolvedIndicator)) {
        const filtered = filterEmpty(resolvedIndicator);
        resolvedIndicator = filtered.length === 1 ? filtered[0] : filtered;
      }

      if (resolvedIndicator && isVNode(resolvedIndicator)) {
        return cloneVNode(resolvedIndicator, {
          class: classNames(dotClassName, attrs.class),
          ...(attrs.style ? { style: attrs.style as CSSProperties } : {}),
          ...(percent !== undefined ? { percent } : {}),
        });
      }

      return (
        <Looper
          prefixCls={prefixCls}
          percent={percent}
          class={attrs.class}
          style={attrs.style as CSSProperties}
        />
      );
    };
  },
});
