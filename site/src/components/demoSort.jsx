import { Comment, Fragment, Text, defineComponent, inject } from 'vue';
import { GLOBAL_CONFIG } from '../SymbolKey';

function flattenSlotVNodes(nodes, result = []) {
  if (!Array.isArray(nodes)) return result;
  nodes.forEach(vnode => {
    if (!vnode || vnode.type === Comment) return;
    if (vnode.type === Text && typeof vnode.children === 'string' && !vnode.children.trim()) return;
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      flattenSlotVNodes(vnode.children, result);
    } else {
      result.push(vnode);
    }
  });
  return result;
}

export default defineComponent({
  props: {
    cols: {
      type: [Number, String],
      default: 2,
    },
  },
  setup() {
    return {
      globalConfig: inject(GLOBAL_CONFIG),
    };
  },
  render() {
    const { cols, globalConfig, $slots } = this;
    const children = flattenSlotVNodes($slots.default?.() || []);
    // 手机访问、cols 为 1 或仅有一个示例时强制开启单列 demo 模式
    const isSingleCol = Number(cols) === 1 || children.length <= 1 || globalConfig.isMobile.value;
    const leftChildren = [];
    const rightChildren = [];
    children.forEach((demo, index) => {
      if (index % 2 === 0 || isSingleCol) {
        leftChildren.push(demo);
      } else {
        rightChildren.push(demo);
      }
    });
    return (
      <a-row gutter={16}>
        <a-col
          span={isSingleCol ? 24 : 12}
          class={isSingleCol ? 'code-boxes-col-1-1' : 'code-boxes-col-2-1'}
        >
          {leftChildren}
        </a-col>
        {isSingleCol ? null : (
          <a-col class="code-boxes-col-2-1" span={12}>
            {rightChildren}
          </a-col>
        )}
      </a-row>
    );
  },
});
