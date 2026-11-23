import { Comment, Fragment, Text, defineComponent, inject, ref, unref } from 'vue';
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

function extractDemoMetaList(children) {
  return children
    .map(vnode => {
      const meta = vnode?.type?.__demoMeta;
      if (!meta || !meta.sectionId) return null;
      const rawTitle = meta.title;
      const title =
        rawTitle && typeof rawTitle === 'object'
          ? rawTitle['zh-CN'] || rawTitle['en-US'] || ''
          : String(rawTitle || '');
      const enTitle =
        rawTitle && typeof rawTitle === 'object'
          ? rawTitle['en-US'] || rawTitle['zh-CN'] || ''
          : String(rawTitle || '');
      return {
        href: `#${meta.sectionId}`,
        title,
        enTitle,
        debug: Boolean(meta.debug),
      };
    })
    .filter(Boolean);
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
      inIframe: inject('inIframe', false),
      showDebugDemos: inject('showDebugDemos', ref(false)),
      setPageDemos: inject('setPageDemos', () => {}),
    };
  },
  render() {
    const { cols, globalConfig, inIframe, showDebugDemos, setPageDemos, $slots } = this;
    const children = flattenSlotVNodes($slots.default?.() || []);
    const orderedDemos = extractDemoMetaList(children);
    if (orderedDemos.length > 0) {
      setPageDemos(orderedDemos);
    }
    const showDebug = Boolean(inIframe) || Boolean(unref(showDebugDemos));
    const visibleChildren = showDebug
      ? children
      : children.filter(vnode => !vnode?.type?.__demoMeta?.debug);
    // 手机访问、cols 为 1 或仅有一个可见示例时强制开启单列 demo 模式
    const isSingleCol =
      Number(cols) === 1 || visibleChildren.length <= 1 || Boolean(unref(globalConfig?.isMobile));
    const leftChildren = [];
    const rightChildren = [];
    visibleChildren.forEach((demo, index) => {
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
