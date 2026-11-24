import type { CSSProperties, ExtractPropTypes } from 'vue';
import {
  watchEffect,
  watch,
  ref,
  defineComponent,
  computed,
  nextTick,
  getCurrentInstance,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue';
import classNames from '../_util/classNames';
import VcTree from '../vc-tree';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { DataNode, EventDataNode, FieldNames, Key, ScrollTo } from '../vc-tree/interface';
import type { TreeNodeProps } from '../vc-tree/props';
import { treeProps as vcTreeProps } from '../vc-tree/props';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic, {
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import type { SwitcherIconProps } from './utils/iconUtil';
import renderSwitcherIcon from './utils/iconUtil';
import dropIndicatorRender from './utils/dropIndicator';
import useTree from './useTree';
import devWarning from '../vc-util/devWarning';
import { warning } from '../vc-util/warning';
import omit from '../_util/omit';
import { booleanType, someType, arrayType, functionType, objectType } from '../_util/type';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';

export type TreeSemanticName = 'root' | 'item' | 'itemIcon' | 'itemTitle' | 'itemSwitcher';
export type TreeSemanticClassNames = SemanticClassNames<TreeSemanticName>;
export type TreeSemanticStyles = SemanticStyles<TreeSemanticName>;
export type TreeClassNamesType = SemanticClassNamesType<Record<string, any>, TreeSemanticName>;
export type TreeStylesType = SemanticStylesType<Record<string, any>, TreeSemanticName>;

export type TreeDraggableFn = (node: DataNode) => boolean;
export interface TreeDraggableConfig {
  icon?: any;
  nodeDraggable?: TreeDraggableFn;
}

const UNITLESS_CSS_PROPS = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
]);

function normalizeStyleAttr(styleAttr: unknown): CSSProperties | undefined {
  if (!styleAttr) return undefined;
  if (typeof styleAttr === 'string') {
    const parsed: Record<string, string> = {};
    styleAttr.split(';').forEach(decl => {
      const idx = decl.indexOf(':');
      if (idx > 0) {
        const prop = decl.slice(0, idx).trim();
        const val = decl.slice(idx + 1).trim();
        if (prop && val) {
          const camelProp = prop.startsWith('--')
            ? prop
            : prop.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
          parsed[camelProp] = val;
        }
      }
    });
    return Object.keys(parsed).length ? (parsed as CSSProperties) : undefined;
  }
  if (Array.isArray(styleAttr)) {
    let merged: CSSProperties = {};
    for (const item of styleAttr) {
      const normalized = normalizeStyleAttr(item);
      if (normalized) {
        merged = { ...merged, ...normalized };
      }
    }
    return Object.keys(merged).length ? merged : undefined;
  }
  if (typeof styleAttr === 'object') {
    return styleAttr as CSSProperties;
  }
  return undefined;
}

export interface AntdTreeNodeAttribute {
  eventKey: string;
  prefixCls: string;
  class: string;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  children: any;
  title: any;
  pos: string;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  isLeaf: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
}

export type AntTreeNodeProps = TreeNodeProps;

// [Legacy] Compatible for v2
export type TreeDataItem = DataNode;

export interface AntTreeNodeBaseEvent {
  node: EventDataNode;
  nativeEvent: MouseEvent;
}

export interface AntTreeNodeCheckedEvent extends AntTreeNodeBaseEvent {
  event: 'check';
  checked?: boolean;
  checkedNodes?: DataNode[];
}

export interface AntTreeNodeSelectedEvent extends AntTreeNodeBaseEvent {
  event: 'select';
  selected?: boolean;
  selectedNodes?: DataNode[];
}

export interface AntTreeNodeExpandedEvent extends AntTreeNodeBaseEvent {
  expanded?: boolean;
}

export interface AntTreeNodeMouseEvent {
  node: EventDataNode;
  event: DragEvent;
}

export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
  expandedKeys: Key[];
}

export interface AntTreeNodeDropEvent {
  node: EventDataNode;
  dragNode: EventDataNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap?: boolean;
  event: MouseEvent;
}

export const treeProps = () => {
  const baseTreeProps = vcTreeProps();
  return {
    ...baseTreeProps,
    showLine: someType<boolean | { showLeafIcon: boolean }>([Boolean, Object]),
    /** 是否支持多选 */
    multiple: booleanType(),
    /** 是否自动展开父节点 */
    autoExpandParent: booleanType(),
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: booleanType(),
    /** 是否支持选中 */
    checkable: booleanType(),
    /** 是否禁用树 */
    disabled: booleanType(),
    /** 默认展开所有树节点 */
    defaultExpandAll: booleanType(),
    /** 默认展开对应树节点 */
    defaultExpandParent: booleanType(),
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: arrayType<Key[]>(),
    /** （受控）展开指定的树节点 */
    expandedKeys: arrayType<Key[]>(),
    /** （受控）选中复选框的树节点 */
    checkedKeys: someType<Key[] | { checked: Key[]; halfChecked: Key[] }>([Array, Object]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: arrayType<Key[]>(),
    /** （受控）设置选中的树节点 */
    selectedKeys: arrayType<Key[]>(),
    /** 默认选中的树节点 */
    defaultSelectedKeys: arrayType<Key[]>(),
    selectable: booleanType(),

    loadedKeys: arrayType<Key[]>(),
    draggable: someType<boolean | TreeDraggableFn | TreeDraggableConfig>([
      Boolean,
      Function,
      Object,
    ]),
    showIcon: booleanType(),
    icon: functionType<(nodeProps: AntdTreeNodeAttribute) => any>(),
    switcherIcon: PropTypes.any,
    switcherLoadingIcon: PropTypes.any,
    titleRender: functionType<(nodeData: DataNode) => any>(),
    prefixCls: String,
    classNames: someType<TreeClassNamesType>([Object, Function]),
    styles: someType<TreeStylesType>([Object, Function]),
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: objectType<FieldNames>(),
    blockNode: booleanType(),
    openAnimation: PropTypes.any,
    onDoubleclick: baseTreeProps.onDblclick,
    'onUpdate:selectedKeys': functionType<(keys: Key[]) => void>(),
    'onUpdate:checkedKeys': functionType<(keys: Key[]) => void>(),
    'onUpdate:expandedKeys': functionType<(keys: Key[]) => void>(),
  };
};

export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATree',
  inheritAttrs: false,
  props: initDefaultProps(treeProps(), {
    checkable: false,
    selectable: true,
    showIcon: false,
    blockNode: false,
  }),

  slots: Object as CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    switcherLoadingIcon?: any;
    titleRender?: any;
    default?: any;
    leafIcon?: any;
  }>,
  setup(props, { attrs, expose, emit, slots }) {
    warning(
      !(props.treeData === undefined && slots.default),
      '`children` of Tree is deprecated. Please use `treeData` instead.',
    );
    const { prefixCls, direction, virtual } = useConfigInject('tree', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('tree');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedProps = computed<TreeProps>(() => ({
      ...props,
      showIcon: props.showIcon,
      blockNode: props.blockNode,
      checkable: props.checkable,
      selectable: props.selectable,
      disabled: props.disabled,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TreeSemanticClassNames,
      TreeSemanticStyles,
      TreeProps
    >(
      () => [contextClassNames.value as TreeClassNamesType, props.classNames],
      () => [
        contextStyles.value as TreeStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.rootStyle ? { root: props.rootStyle } : undefined,
        props.styles,
      ],
      () => ({ props: mergedProps.value }),
    );

    const treeRef = ref();
    const instance = getCurrentInstance();
    const appliedMeta = new WeakMap<HTMLElement, { classes: string[]; styleKeys: string[] }>();
    let mutationObserver: MutationObserver | null = null;

    const getRootEl = (): HTMLElement | null => {
      const el = instance?.proxy?.$el as Node | null | undefined;
      if (!el) return null;
      if (el.nodeType === 1) return el as HTMLElement;
      let sibling = el.nextSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && (sibling as HTMLElement).getAttribute?.('role') === 'tree') {
          return sibling as HTMLElement;
        }
        sibling = sibling.nextSibling;
      }
      return null;
    };

    const hasInnerSemantics = computed(() => {
      const cn = mergedClassNames.value;
      const st = mergedStyles.value;
      return Boolean(
        cn.item ||
          cn.itemIcon ||
          cn.itemTitle ||
          cn.itemSwitcher ||
          st.item ||
          st.itemIcon ||
          st.itemTitle ||
          st.itemSwitcher,
      );
    });

    const syncElementSemantic = (
      el: HTMLElement,
      cls: string | undefined,
      styleObj: CSSProperties | undefined,
    ) => {
      const prev = appliedMeta.get(el) || { classes: [], styleKeys: [] };
      const nextClasses = cls ? cls.split(/\s+/).filter(Boolean) : [];
      for (const oldCls of prev.classes) {
        if (!nextClasses.includes(oldCls)) {
          el.classList.remove(oldCls);
        }
      }
      for (const newCls of nextClasses) {
        if (!el.classList.contains(newCls)) {
          el.classList.add(newCls);
        }
      }

      const nextStyleKeys = styleObj
        ? Object.keys(styleObj).filter(k => (styleObj as any)[k] !== undefined)
        : [];
      for (const oldKey of prev.styleKeys) {
        if (!nextStyleKeys.includes(oldKey)) {
          if (oldKey.startsWith('--')) {
            el.style.removeProperty(oldKey);
          } else {
            (el.style as any)[oldKey] = '';
          }
        }
      }
      if (styleObj) {
        for (const key of nextStyleKeys) {
          const val = (styleObj as any)[key];
          const cssVal =
            typeof val === 'number' && !UNITLESS_CSS_PROPS.has(key) ? `${val}px` : String(val);
          if (key.startsWith('--')) {
            el.style.setProperty(key, cssVal);
          } else {
            (el.style as any)[key] = cssVal;
          }
        }
      }

      if (nextClasses.length || nextStyleKeys.length) {
        appliedMeta.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
      } else {
        appliedMeta.delete(el);
      }
    };

    const applyInnerSemantics = () => {
      const rootEl = getRootEl();
      if (!rootEl || typeof rootEl.querySelectorAll !== 'function') return;
      const pre = prefixCls.value;
      const cn = mergedClassNames.value;
      const st = mergedStyles.value;
      const mappings: Array<[string, string | undefined, CSSProperties | undefined]> = [
        [`.${pre}-treenode:not([aria-hidden])`, cn.item, st.item],
        [`.${pre}-iconEle`, cn.itemIcon, st.itemIcon],
        [`.${pre}-title`, cn.itemTitle, st.itemTitle],
        [`.${pre}-switcher`, cn.itemSwitcher, st.itemSwitcher],
      ];
      for (const [selector, cls, styleObj] of mappings) {
        rootEl.querySelectorAll<HTMLElement>(selector).forEach(el => {
          if (cls || styleObj || appliedMeta.has(el)) {
            syncElementSemantic(el, cls, styleObj);
          }
        });
      }
    };

    const ensureObserver = () => {
      const rootEl = getRootEl();
      if (!hasInnerSemantics.value) {
        if (mutationObserver) {
          mutationObserver.disconnect();
          mutationObserver = null;
        }
        return;
      }
      if (rootEl && !mutationObserver && typeof MutationObserver !== 'undefined') {
        mutationObserver = new MutationObserver(() => {
          applyInnerSemantics();
        });
        mutationObserver.observe(rootEl, { childList: true, subtree: true });
      }
    };

    onMounted(() => {
      if (hasInnerSemantics.value) {
        applyInnerSemantics();
        ensureObserver();
      }
    });

    onUpdated(() => {
      if (hasInnerSemantics.value) {
        applyInnerSemantics();
      }
      ensureObserver();
    });

    watch(
      [mergedClassNames, mergedStyles],
      () => {
        applyInnerSemantics();
        ensureObserver();
      },
      { flush: 'post', deep: true },
    );

    onBeforeUnmount(() => {
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    });

    const scrollTo: ScrollTo = scroll => {
      if (scroll && typeof scroll === 'object' && 'key' in scroll) {
        if ((scroll as any).autoExpand && props.expandedKeys === undefined && props.treeData) {
          const { getPath } = useTree(props.treeData, {
            fieldNames: props.fieldNames || props.replaceFields,
          });
          const path = getPath(scroll.key);
          if (path.length > 1) {
            const currentExpanded = new Set(treeRef.value?.expandedKeys?.value || []);
            path.slice(0, -1).forEach(entity => {
              if (!currentExpanded.has(entity.key)) {
                treeRef.value?.onNodeExpand({} as any, {
                  ...entity.node,
                  key: entity.key,
                  expanded: false,
                });
              }
            });
          }
        }
        nextTick(() => {
          treeRef.value?.scrollTo(scroll);
        });
        return;
      }
      treeRef.value?.scrollTo(scroll);
    };
    expose({
      treeRef,
      onNodeExpand: (...args) => {
        treeRef.value?.onNodeExpand(...args);
      },
      scrollTo,
      selectedKeys: computed(() => treeRef.value?.selectedKeys),
      checkedKeys: computed(() => treeRef.value?.checkedKeys),
      halfCheckedKeys: computed(() => treeRef.value?.halfCheckedKeys),
      loadedKeys: computed(() => treeRef.value?.loadedKeys),
      loadingKeys: computed(() => treeRef.value?.loadingKeys),
      expandedKeys: computed(() => treeRef.value?.expandedKeys),
    });

    watchEffect(() => {
      devWarning(
        props.replaceFields === undefined,
        'Tree',
        '`replaceFields` is deprecated, please use fieldNames instead',
      );
    });

    const handleCheck: TreeProps['onCheck'] = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };
    const handleExpand: TreeProps['onExpand'] = (expandedKeys, eventObj) => {
      emit('update:expandedKeys', expandedKeys);
      emit('expand', expandedKeys, eventObj);
    };
    const handleSelect: TreeProps['onSelect'] = (selectedKeys, eventObj) => {
      emit('update:selectedKeys', selectedKeys);
      emit('select', selectedKeys, eventObj);
    };
    return () => {
      const {
        showIcon,
        showLine,
        switcherIcon = slots.switcherIcon,
        switcherLoadingIcon = slots.switcherLoadingIcon,
        icon = slots.icon,
        blockNode,
        checkable,
        selectable,
        fieldNames = props.replaceFields,
        motion = props.openAnimation,
        itemHeight = 28,
        onDoubleclick,
        onDblclick,
        titleRender,
        draggable,
      } = props as TreeProps;
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
      const normalizedAttrStyle = normalizeStyleAttr(attrStyle);
      const semanticRootStyle = mergedStyles.value.root;
      const combinedRootStyle =
        semanticRootStyle || normalizedAttrStyle
          ? { ...semanticRootStyle, ...normalizedAttrStyle }
          : undefined;
      const vcDraggable: boolean | TreeDraggableFn | undefined =
        typeof draggable === 'boolean' || typeof draggable === 'function'
          ? draggable
          : draggable && typeof draggable === 'object'
          ? draggable.nodeDraggable || true
          : undefined;
      const newProps = {
        ...restAttrs,
        ...omit(props, [
          'onUpdate:checkedKeys',
          'onUpdate:expandedKeys',
          'onUpdate:selectedKeys',
          'onDoubleclick',
          'classNames',
          'styles',
          'rootStyle',
          'rootClassName',
          'titleRender',
          'draggable',
        ]),
        showLine: Boolean(showLine),
        dropIndicatorRender,
        fieldNames,
        icon,
        itemHeight,
        draggable: vcDraggable,
      } as any;
      const children = slots.default ? filterEmpty(slots.default()) : undefined;
      const mergedSlots: Record<string, any> = {
        ...slots,
        checkable: () => <span class={`${prefixCls.value}-checkbox-inner`} />,
      };
      if (!slots.title && titleRender) {
        mergedSlots.title = (nodeData: DataNode) => titleRender(nodeData);
      }
      return wrapSSR(
        <VcTree
          {...newProps}
          virtual={virtual.value}
          motion={motion}
          ref={treeRef}
          prefixCls={prefixCls.value}
          class={classNames(
            {
              [`${prefixCls.value}-icon-hide`]: !showIcon,
              [`${prefixCls.value}-block-node`]: blockNode,
              [`${prefixCls.value}-unselectable`]: !selectable,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            contextClassName.value,
            attrClass,
            hashId.value,
          )}
          rootClassName={classNames(mergedClassNames.value.root, props.rootClassName)}
          rootStyle={combinedRootStyle}
          direction={direction.value}
          checkable={checkable}
          selectable={selectable}
          switcherIcon={(nodeProps: SwitcherIconProps) =>
            renderSwitcherIcon(
              prefixCls.value,
              switcherIcon,
              nodeProps,
              slots.leafIcon,
              showLine,
              switcherLoadingIcon,
            )
          }
          onCheck={handleCheck}
          onExpand={handleExpand}
          onSelect={handleSelect}
          onDblclick={onDblclick || onDoubleclick}
          v-slots={mergedSlots}
          children={children}
        ></VcTree>,
      );
    };
  },
});
