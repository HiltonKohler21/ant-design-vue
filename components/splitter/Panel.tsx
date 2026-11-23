import { defineComponent, type PropType } from 'vue';
import classNames from '../_util/classNames';
import { splitterPanelProps } from './interface';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASplitterPanel',
  props: splitterPanelProps(),
  setup() {
    // Panel 只是占位，实际渲染由 Splitter 通过 children 解析
    return () => null;
  },
});

export const InternalPanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'InternalPanel',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    size: {
      type: [Number, String] as PropType<number | string>,
      default: undefined,
    },
    destroyOnHidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { prefixCls, size, destroyOnHidden } = props;
      const { class: className, style } = attrs;
      const isCollapsed = size === 0 || (typeof size === 'string' && Number.parseFloat(size) === 0);
      const panelClassName = classNames(
        `${prefixCls}-panel`,
        {
          [`${prefixCls}-panel-hidden`]: isCollapsed,
        },
        className,
      );
      const hasSize = size !== undefined;
      const flexBasis = hasSize ? (typeof size === 'number' ? `${size}px` : size) : 'auto';
      return (
        <div
          class={panelClassName}
          style={{
            ...(typeof style === 'object' && style ? (style as Record<string, any>) : undefined),
            flexBasis,
            flexGrow: hasSize ? 0 : 1,
          }}
        >
          {!(destroyOnHidden && isCollapsed) && slots.default?.()}
        </div>
      );
    };
  },
});
