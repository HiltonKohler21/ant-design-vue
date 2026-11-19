import { defineComponent } from 'vue';
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
  props: {
    prefixCls: String,
    size: { type: Number, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { prefixCls, size } = props;
      const { class: className, style } = attrs;
      const panelClassName = classNames(
        `${prefixCls}-panel`,
        {
          [`${prefixCls}-panel-hidden`]: size === 0,
        },
        className,
      );
      const hasSize = size !== undefined;
      return (
        <div
          class={panelClassName}
          style={{
            ...(style as any),
            flexBasis: hasSize ? size : 'auto',
            flexGrow: hasSize ? 0 : 1,
          }}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});
