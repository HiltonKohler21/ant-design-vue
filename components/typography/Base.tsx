import LocaleReceiver from '../locale-provider/LocaleReceiver';
import TransButton from '../_util/transButton';
import raf from '../_util/raf';
import { isStyleSupport } from '../_util/styleChecker';
import Editable from './Editable';
import measure, { isEleEllipsis } from './util';
import type {
  TypographyClassNamesType,
  TypographyProps,
  TypographySemanticClassNames,
  TypographySemanticStyles,
  TypographyStylesType,
} from './Typography';
import { InternalTypography } from './Typography';
import ResizeObserver from '../vc-resize-observer';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
import copy from '../_util/copy-to-clipboard';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CopyOutlined from '@ant-design/icons-vue/CopyOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import type { VNodeTypes, CSSProperties, PropType, HTMLAttributes, VNode } from 'vue';
import {
  Comment,
  Text as VueText,
  defineComponent,
  reactive,
  ref,
  isVNode,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
  toRaw,
} from 'vue';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import type { AutoSizeType } from '../input/inputProps';
import useMergedState from '../_util/hooks/useMergedState';
import { findDOMNode, flattenChildren } from '../_util/props-util';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';

export type BaseType = 'secondary' | 'success' | 'warning' | 'danger';

const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');

export interface CopyConfig {
  text?: string | (() => string | Promise<string>);
  onCopy?: (event?: MouseEvent) => void;
  icon?: VueNode | [VueNode, VueNode];
  tooltips?: boolean | VueNode | [VueNode, VueNode];
  /** @deprecated Use `tooltips` instead */
  tooltip?: boolean;
  format?: 'text/plain' | 'text/html';
  tabIndex?: number;
}

export interface ActionsConfig {
  placement?: 'start' | 'end';
}

export interface EditConfig {
  text?: string;
  editing?: boolean;
  icon?: VueNode;
  tooltip?: boolean | VueNode;
  onStart?: () => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  maxLength?: number;
  /** @deprecated Use `maxLength` instead */
  maxlength?: number;
  autoSize?: boolean | AutoSizeType;
  triggerType?: ('icon' | 'text')[];
  enterIcon?: VueNode | null;
  tabIndex?: number;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | 'collapsible';
  suffix?: string;
  symbol?: VueNode | ((expanded: boolean) => VueNode);
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (e: MouseEvent, info: { expanded: boolean }) => void;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: boolean | VueNode | TooltipProps;
}

export interface ShimmerConfig {
  duration?: number | [motionTime: number, waitTime: number];
}

export interface BlockProps extends TypographyProps {
  title?: string;
  actions?: ActionsConfig;
  editable?: boolean | EditConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  shimmer?: boolean | ShimmerConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  italic?: boolean;
  loading?: boolean;
  maxLength?: number;
  content?: string;
}

interface Locale {
  edit?: string;
  copy?: string;
  copied?: string;
  expand?: string;
  collapse?: string;
}

interface InternalBlockProps extends BlockProps {
  component: string;
}

const ELLIPSIS_STR = '...';
const DEFAULT_SHIMMER_DURATION = 1;

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val) && !isVNode(val);
}

function toCopyConfigList<T>(val: T | T[] | undefined): T[] {
  if (val === false) {
    return [false, false] as unknown as T[];
  }
  if (val === undefined) {
    return [];
  }
  return Array.isArray(val) ? val : [val];
}

function getNode(dom: any, defaultNode: any, needDom?: boolean) {
  if (dom === true || dom === undefined) {
    return defaultNode;
  }
  return dom || (needDom && defaultNode);
}

/**
 * Extract flattened non-comment VNodes/strings from slot children.
 * Merges consecutive text nodes into a single string for accurate measurement.
 */
function normalizeSlotChildren(raw: any): {
  items: VNodeTypes[];
  plainText: string | null;
  textFallback: string;
  key: string;
} {
  if (raw === undefined || raw === null) {
    return { items: [], plainText: null, textFallback: '', key: '' };
  }
  const flat = flattenChildren(raw, false);
  const items: VNodeTypes[] = [];
  let isPureText = true;
  let textAcc = '';
  let keyAcc = '';

  const collectText = (node: any): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(collectText).join('');
    if (isVNode(node)) {
      if (node.type === Comment) return '';
      if (node.type === VueText) return typeof node.children === 'string' ? node.children : '';
      if (typeof node.children === 'string' || typeof node.children === 'number') {
        return String(node.children);
      }
      if (Array.isArray(node.children)) {
        return collectText(node.children);
      }
      if (node.children && typeof (node.children as any).default === 'function') {
        return collectText((node.children as any).default());
      }
    }
    return '';
  };

  for (const child of flat) {
    if (child === null || child === undefined || typeof child === 'boolean') continue;
    if (typeof child === 'string' || typeof child === 'number') {
      const str = String(child);
      if (items.length > 0 && typeof items[items.length - 1] === 'string') {
        items[items.length - 1] = `${String(items[items.length - 1])}${str}`;
      } else {
        items.push(str);
      }
      textAcc += str;
      keyAcc += `T:${str}|`;
    } else if (isVNode(child)) {
      if (child.type === Comment) continue;
      if (child.type === VueText) {
        const str = typeof child.children === 'string' ? child.children : '';
        if (items.length > 0 && typeof items[items.length - 1] === 'string') {
          items[items.length - 1] = `${String(items[items.length - 1])}${str}`;
        } else {
          items.push(str);
        }
        textAcc += str;
        keyAcc += `T:${str}|`;
      } else {
        isPureText = false;
        items.push(child as VNode);
        const childText = collectText(child);
        textAcc += childText;
        keyAcc += `E:${String((child.type as any)?.name || child.type)}:${childText}|`;
      }
    }
  }

  return {
    items,
    plainText: isPureText && items.length > 0 ? textAcc : null,
    textFallback: textAcc,
    key: keyAcc,
  };
}

export const baseProps = () => ({
  rootClassName: String,
  title: String,
  actions: {
    type: Object as PropType<ActionsConfig>,
    default: undefined as ActionsConfig | undefined,
  },
  editable: {
    type: [Boolean, Object] as PropType<InternalBlockProps['editable']>,
    default: undefined as InternalBlockProps['editable'],
  },
  copyable: {
    type: [Boolean, Object] as PropType<InternalBlockProps['copyable']>,
    default: undefined as InternalBlockProps['copyable'],
  },
  prefixCls: String,
  component: String,
  type: String as PropType<BaseType>,
  disabled: { type: Boolean, default: undefined },
  ellipsis: {
    type: [Boolean, Object] as PropType<InternalBlockProps['ellipsis']>,
    default: undefined as InternalBlockProps['ellipsis'],
  },
  shimmer: {
    type: [Boolean, Object] as PropType<InternalBlockProps['shimmer']>,
    default: undefined as InternalBlockProps['shimmer'],
  },
  classNames: {
    type: [Object, Function] as PropType<TypographyClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<TypographyStylesType>,
    default: undefined,
  },
  code: { type: Boolean, default: undefined },
  mark: { type: Boolean, default: undefined },
  underline: { type: Boolean, default: undefined },
  delete: { type: Boolean, default: undefined },
  strong: { type: Boolean, default: undefined },
  keyboard: { type: Boolean, default: undefined },
  italic: { type: Boolean, default: undefined },
  loading: { type: Boolean, default: undefined },
  maxLength: { type: Number, default: undefined },
  content: String,
  'onUpdate:content': Function as PropType<(content: string) => void>,
});

const Base = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TypographyBase',
  inheritAttrs: false,
  props: baseProps(),
  // emits: ['update:content'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction, rootPrefixCls } = useConfigInject('typography', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('typography');

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TypographySemanticClassNames,
      TypographySemanticStyles
    >(
      () => [contextClassNames.value as TypographySemanticClassNames, props.classNames],
      () => [contextStyles.value as TypographySemanticStyles, props.styles],
      () => ({ props: { ...props, ...attrs } }),
    );

    const state = reactive({
      copied: false,
      copyLoading: false,
      ellipsisText: '',
      ellipsisContent: null as any,
      isEllipsis: false,
      isNativeEllipsis: false,
      isHoveringOperations: false,
      clientRendered: false,
      // locale
      expandStr: '',
      collapseStr: '',
      copyStr: '',
      copiedStr: '',
      editStr: '',

      copyId: undefined as any,
      rafId: undefined as any,
      hoverLeaveId: undefined as any,
      originContent: '',
    });

    const contentRef = ref();
    const editIcon = ref();
    let editClickEvent: MouseEvent | null = null;
    let lastRenderedContentKey = '';
    let lastMeasuredContentKey = '';

    const enableEllipsis = computed(() => !!props.ellipsis);

    const ellipsis = computed((): EllipsisConfig => {
      const ellipsisProp = props.ellipsis;
      if (!ellipsisProp) return {};

      return {
        rows: 1,
        expandable: false,
        ...(typeof ellipsisProp === 'object' ? ellipsisProp : null),
      };
    });

    const [expanded, setExpanded] = useMergedState<boolean>(
      ellipsis.value.defaultExpanded || false,
      {
        value: computed(() => ellipsis.value.expanded),
      },
    );

    const mergedEnableEllipsis = computed(
      () =>
        enableEllipsis.value && (!expanded.value || ellipsis.value.expandable === 'collapsible'),
    );

    const editable = computed((): EditConfig => {
      const editableProp = props.editable;
      if (!editableProp) return { editing: false };

      return {
        ...(typeof editableProp === 'object' ? editableProp : null),
      };
    });

    const copyableConfig = computed((): CopyConfig => {
      const copyableProp = props.copyable;
      if (!copyableProp) return {};

      return {
        ...(typeof copyableProp === 'object' ? copyableProp : null),
      };
    });

    const enableShimmer = computed(() => !!props.shimmer);
    const shimmerConfig = computed<ShimmerConfig>(() =>
      typeof props.shimmer === 'object' && props.shimmer
        ? props.shimmer
        : { duration: DEFAULT_SHIMMER_DURATION },
    );

    const actionsPlacement = computed<'start' | 'end'>(() => props.actions?.placement ?? 'end');

    const [editing, setEditing] = useMergedState(false, {
      value: computed(() => editable.value.editing),
    });

    let latestSlotNormalized: ReturnType<typeof normalizeSlotChildren> | null = null;

    function getMeasureSource(): {
      content: string | VNodeTypes[] | undefined;
      textFallback: string;
      key: string;
    } {
      if (props.content !== undefined) {
        return {
          content: props.content,
          textFallback: props.content,
          key: `P:${props.content}`,
        };
      }
      const normalized = latestSlotNormalized;
      if (!normalized || normalized.items.length === 0) {
        return { content: undefined, textFallback: '', key: '' };
      }
      return {
        content: normalized.plainText !== null ? normalized.plainText : normalized.items,
        textFallback: normalized.textFallback,
        key: normalized.key,
      };
    }

    function getChildrenText(): string {
      if (props.content !== undefined) {
        return props.content;
      }
      const domText = findDOMNode(contentRef.value)?.innerText;
      if (props.ellipsis || props.editable) {
        return getMeasureSource().textFallback || domText || '';
      }
      return domText ?? getMeasureSource().textFallback;
    }

    onMounted(() => {
      state.clientRendered = true;
      syncEllipsis();
    });

    onUpdated(() => {
      if (
        mergedEnableEllipsis.value &&
        !canUseCSSEllipsis.value &&
        lastRenderedContentKey !== lastMeasuredContentKey
      ) {
        resizeOnNextFrame();
      }
    });

    onBeforeUnmount(() => {
      clearTimeout(state.copyId);
      clearTimeout(state.hoverLeaveId);
      raf.cancel(state.rafId);
    });

    watch(
      [
        () => props.ellipsis,
        () => ellipsis.value.rows,
        () => ellipsis.value.suffix,
        () => ellipsis.value.expandable,
        () => expanded.value,
        () => props.content,
        () => props.copyable,
        () => props.editable,
        () => actionsPlacement.value,
      ],
      () => {
        if (!enableEllipsis.value) {
          state.isEllipsis = false;
          state.ellipsisContent = null;
          state.ellipsisText = '';
          return;
        }
        nextTick(() => {
          resizeOnNextFrame();
        });
      },
      { flush: 'post', deep: true },
    );

    // =============== Expand ===============
    function onExpandClick(e: MouseEvent, info: { expanded: boolean }) {
      const { onExpand } = ellipsis.value;
      setExpanded(info.expanded);
      onExpand?.(e, info);
    }

    // ================ Edit ================
    function getEditableInitialValue(): string {
      if (editable.value.text !== undefined) {
        return editable.value.text;
      }
      if (props.content !== undefined) {
        return props.content;
      }
      return getMeasureSource().textFallback;
    }

    function onEditClick(e: MouseEvent) {
      e.preventDefault();
      editClickEvent = e;
      state.originContent = getEditableInitialValue();
      triggerEdit(true);
    }

    function onEditChange(value: string) {
      if (props.content !== undefined) {
        onContentChange(value);
      } else {
        editable.value.onChange?.(value);
      }
      triggerEdit(false);
    }

    function onContentChange(value: string) {
      if (props.content !== undefined) {
        const { onChange } = editable.value;
        if (value !== props.content) {
          emit('update:content', value);
          onChange?.(value);
        }
      }
    }

    function onEditCancel() {
      editable.value.onCancel?.();
      triggerEdit(false);
    }

    function triggerEdit(edit: boolean) {
      const { onStart } = editable.value;
      if (edit && onStart) {
        onStart();
      }

      setEditing(edit);
    }

    watch(
      editing,
      (val, prevVal) => {
        if (!val && prevVal) {
          editIcon.value?.focus();
        }
      },
      { flush: 'post' },
    );

    // ================ Copy ================
    async function onCopyClick(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();

      const copyConfig = copyableConfig.value;
      const copyOptions: { format?: string } = {};
      if (copyConfig.format) {
        copyOptions.format = copyConfig.format;
      }

      state.copyLoading = true;
      try {
        const resolvedText =
          typeof copyConfig.text === 'function' ? await copyConfig.text() : copyConfig.text;
        const copyText = resolvedText !== undefined ? resolvedText : getChildrenText();

        copy(copyText || '', copyOptions);
        state.copyLoading = false;
        state.copied = true;

        nextTick(() => {
          copyConfig.onCopy?.(e);
          clearTimeout(state.copyId);
          state.copyId = setTimeout(() => {
            state.copied = false;
          }, 3000);
        });
      } catch (error) {
        state.copyLoading = false;
        throw error;
      }
    }

    // ============== Ellipsis ==============
    function resizeOnNextFrame(sizeInfo?: { width: number; height: number }) {
      if (sizeInfo) {
        const { width, height } = sizeInfo;
        if (!width || !height) return;
      }

      raf.cancel(state.rafId);
      state.rafId = raf(() => {
        // Do not bind `syncEllipsis`. It need for test usage on prototype
        syncEllipsis();
      });
    }

    const canUseCSSEllipsis = computed(() => {
      if (!mergedEnableEllipsis.value) return false;
      const { rows = 1, expandable, suffix, onEllipsis } = ellipsis.value;

      if (suffix !== undefined && suffix !== '') return false;

      // Can't use css ellipsis since we need to provide the place for button
      if (props.editable || props.copyable || expandable || onEllipsis) {
        return false;
      }

      if (rows === 1) {
        return isTextOverflowSupport;
      }

      return isLineClampSupport;
    });

    const syncEllipsis = () => {
      const { ellipsisText, isEllipsis } = state;
      const { rows = 1, suffix, onEllipsis } = ellipsis.value;
      const domNode = findDOMNode(contentRef.value);
      if (!mergedEnableEllipsis.value || !rows || rows < 0 || !domNode) {
        return;
      }

      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis.value) return;

      const source = getMeasureSource();
      if (source.content === undefined) return;

      lastMeasuredContentKey = source.key;

      const {
        content,
        text,
        ellipsis: ell,
      } = measure(domNode, { rows, suffix }, source.content, renderOperations(true), ELLIPSIS_STR);

      if (ellipsisText !== text || state.isEllipsis !== ell) {
        state.ellipsisText = text;
        state.ellipsisContent = content;
        state.isEllipsis = ell;
        if (isEllipsis !== ell && onEllipsis) {
          onEllipsis(ell);
        }
      }
    };

    const measureNativeEllipsis = () => {
      const domNode = findDOMNode(contentRef.value);
      if (enableEllipsis.value && canUseCSSEllipsis.value && domNode) {
        const currentEllipsis = isEleEllipsis(domNode);
        if (state.isNativeEllipsis !== currentEllipsis) {
          state.isNativeEllipsis = currentEllipsis;
        }
      }
    };

    function wrapperDecorations(
      { mark, code, underline, delete: del, strong, keyboard, italic }: BlockProps,
      content: any,
    ) {
      let currentContent = content;

      function wrap(needed: boolean | undefined, Tag: string) {
        if (!needed) return;

        currentContent = <Tag>{currentContent}</Tag>;
      }

      wrap(strong, 'strong');
      wrap(underline, 'u');
      wrap(del, 'del');
      wrap(code, 'code');
      wrap(mark, 'mark');
      wrap(keyboard, 'kbd');
      wrap(italic, 'i');

      return currentContent;
    }

    function renderExpand(forceRender?: boolean) {
      const { expandable, symbol } = ellipsis.value;

      if (!expandable) return null;

      // force render expand icon for measure usage or it will cause dead loop
      if (!forceRender) {
        if (!state.isEllipsis) return null;
        if (expanded.value && expandable !== 'collapsible') return null;
      }

      const isExpanded = forceRender ? false : expanded.value;
      const defaultSymbol = isExpanded ? state.collapseStr : state.expandStr;
      let expandContent: any;
      if (slots.ellipsisSymbol) {
        expandContent = slots.ellipsisSymbol({ expanded: isExpanded });
      } else if (typeof symbol === 'function') {
        expandContent = symbol(isExpanded);
      } else if (symbol !== undefined) {
        expandContent = symbol;
      } else {
        expandContent = defaultSymbol;
      }

      return (
        <a
          key="expand"
          class={classNames(
            `${prefixCls.value}-${isExpanded ? 'collapse' : 'expand'}`,
            mergedClassNames.value.action,
          )}
          style={mergedStyles.value.action}
          onClick={(e: MouseEvent) => onExpandClick(e, { expanded: !expanded.value })}
          aria-label={defaultSymbol}
        >
          {expandContent}
        </a>
      );
    }

    function renderEdit(isMeasure = false) {
      if (!props.editable) return null;

      const { icon: customIcon, tooltip, triggerType = ['icon'], tabIndex } = editable.value;
      const icon = slots.editableIcon
        ? slots.editableIcon()
        : customIcon || <EditOutlined role="button" />;
      const title =
        tooltip === false
          ? ''
          : slots.editableTooltip
          ? slots.editableTooltip()
          : tooltip !== undefined && tooltip !== true
          ? tooltip
          : state.editStr;
      const ariaLabel = typeof title === 'string' ? title : state.editStr;

      if (triggerType.indexOf('icon') === -1) {
        return null;
      }

      if (isMeasure) {
        return (
          <span
            class={classNames(`${prefixCls.value}-edit`, mergedClassNames.value.action)}
            style={{
              display: 'inline-block',
              border: 0,
              background: 'transparent',
              padding: 0,
              lineHeight: 'inherit',
              ...mergedStyles.value.action,
            }}
          >
            {icon}
          </span>
        );
      }

      const button = (
        <TransButton
          ref={editIcon}
          class={classNames(`${prefixCls.value}-edit`, mergedClassNames.value.action)}
          style={mergedStyles.value.action}
          onClick={onEditClick}
          aria-label={ariaLabel}
          {...((tabIndex !== undefined ? { tabindex: tabIndex } : {}) as any)}
        >
          {icon}
        </TransButton>
      );

      return (
        <Tooltip key="edit" title={title}>
          {button}
        </Tooltip>
      );
    }

    function renderCopy(iconOnly = false, isMeasure = false) {
      if (!props.copyable) return null;

      const { tooltip, tooltips, icon: customIcon, tabIndex } = copyableConfig.value;
      const defaultTitle = state.copied ? state.copiedStr : state.copyStr;

      let title: any;
      if (tooltips === false || tooltip === false) {
        title = '';
      } else if (slots.copyableTooltip) {
        title = slots.copyableTooltip({ copied: state.copied });
      } else if (tooltips !== undefined && tooltips !== true) {
        const tooltipNodes = toCopyConfigList<any>(tooltips);
        const resolved = getNode(tooltipNodes[state.copied ? 1 : 0], defaultTitle);
        title = resolved === false ? '' : resolved;
      } else {
        title = defaultTitle;
      }

      const ariaLabel = typeof title === 'string' ? title : defaultTitle;

      let icon: any;
      if (slots.copyableIcon) {
        icon = slots.copyableIcon({ copied: !!state.copied });
      } else if (customIcon !== undefined) {
        const iconNodes = toCopyConfigList<any>(customIcon);
        icon = state.copied
          ? getNode(iconNodes[1], <CheckOutlined />, true)
          : getNode(iconNodes[0], state.copyLoading ? <LoadingOutlined /> : <CopyOutlined />, true);
      } else {
        icon = state.copied ? (
          <CheckOutlined />
        ) : state.copyLoading ? (
          <LoadingOutlined />
        ) : (
          <CopyOutlined />
        );
      }

      if (isMeasure) {
        return (
          <span
            class={classNames(`${prefixCls.value}-copy`, mergedClassNames.value.action, {
              [`${prefixCls.value}-copy-success`]: state.copied,
              [`${prefixCls.value}-copy-icon-only`]: iconOnly,
            })}
            style={{
              display: 'inline-block',
              border: 0,
              background: 'transparent',
              padding: 0,
              lineHeight: 'inherit',
              ...mergedStyles.value.action,
            }}
          >
            {icon}
          </span>
        );
      }

      const button = (
        <TransButton
          class={classNames(`${prefixCls.value}-copy`, mergedClassNames.value.action, {
            [`${prefixCls.value}-copy-success`]: state.copied,
            [`${prefixCls.value}-copy-icon-only`]: iconOnly,
          })}
          style={mergedStyles.value.action}
          onClick={onCopyClick}
          aria-label={ariaLabel}
          {...((tabIndex !== undefined ? { tabindex: tabIndex } : {}) as any)}
        >
          {icon}
        </TransButton>
      );

      return (
        <Tooltip key="copy" title={title}>
          {button}
        </Tooltip>
      );
    }

    function renderEditInput() {
      const { class: className, style } = attrs;
      const { maxlength, maxLength, autoSize, onEnd, enterIcon } = editable.value;

      return (
        <Editable
          class={classNames(contextClassName.value, className)}
          style={[contextStyle.value, style as CSSProperties]}
          prefixCls={prefixCls.value}
          value={getEditableInitialValue()}
          originContent={state.originContent}
          maxlength={maxlength}
          maxLength={maxLength ?? props.maxLength}
          autoSize={autoSize}
          enterIcon={enterIcon}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          onSave={onEditChange}
          onChange={onContentChange}
          onCancel={onEditCancel}
          onEnd={onEnd}
          direction={direction.value}
          component={props.component}
          v-slots={{ enterIcon: slots.editableEnterIcon }}
        />
      );
    }

    function onOperationsMouseEnter() {
      clearTimeout(state.hoverLeaveId);
      state.isHoveringOperations = true;
    }

    function onOperationsMouseLeave() {
      clearTimeout(state.hoverLeaveId);
      state.hoverLeaveId = setTimeout(() => {
        state.isHoveringOperations = false;
      }, 150);
    }

    function renderOperations(forceRenderExpanded?: boolean, iconOnly = false): VNodeTypes[] {
      const expandNode = renderExpand(forceRenderExpanded);
      const editNode = renderEdit(!!forceRenderExpanded);
      const copyNode = renderCopy(iconOnly, !!forceRenderExpanded);
      const nodes = [expandNode, editNode, copyNode].filter(Boolean);

      if (!nodes.length) {
        return [];
      }

      if (forceRenderExpanded) {
        return [
          <span
            key="operations"
            class={classNames(`${prefixCls.value}-actions`, {
              [`${prefixCls.value}-actions-start`]: actionsPlacement.value === 'start',
            })}
          >
            {nodes}
          </span>,
        ];
      }

      return [
        <span
          key="operations"
          class={classNames(`${prefixCls.value}-actions`, mergedClassNames.value.actions, {
            [`${prefixCls.value}-actions-start`]: actionsPlacement.value === 'start',
          })}
          style={mergedStyles.value.actions}
          onMouseenter={onOperationsMouseEnter}
          onMouseleave={onOperationsMouseLeave}
        >
          {nodes}
        </span>,
      ];
    }

    function resolveTooltipProps(
      tooltip: EllipsisConfig['tooltip'],
      editText: string | undefined,
      childrenNode: any,
    ): TooltipProps {
      if (slots.ellipsisTooltip) {
        return { title: slots.ellipsisTooltip() };
      }
      if (tooltip === true) {
        return { title: editText ?? childrenNode };
      }
      if (isVNode(tooltip) || typeof tooltip === 'string' || typeof tooltip === 'number') {
        return { title: tooltip };
      }
      if (isPlainObject(tooltip)) {
        return { title: editText ?? childrenNode, ...(tooltip as TooltipProps) };
      }
      return { title: undefined };
    }

    return () => {
      const { triggerType = ['icon'] } = editable.value;

      if (editing.value) {
        return renderEditInput();
      }

      const rawSlotChildren = slots.default?.();
      const normalizedSlot =
        props.content === undefined ? normalizeSlotChildren(rawSlotChildren) : null;
      latestSlotNormalized = normalizedSlot;
      lastRenderedContentKey =
        props.content !== undefined ? `P:${props.content}` : normalizedSlot?.key || '';

      const children = props.content !== undefined ? props.content : rawSlotChildren;

      const hasTextContent =
        props.content !== undefined
          ? props.content !== ''
          : Boolean(normalizedSlot && normalizedSlot.items.length > 0);

      return (
        <LocaleReceiver
          componentName="Text"
          children={(locale: Locale) => {
            const {
              type,
              disabled,
              content: _content,
              class: className,
              style,
              onClick: attrOnClick,
              onMouseenter: attrOnMouseEnter,
              onMouseleave: attrOnMouseLeave,
              ...restProps
            } = {
              ...props,
              ...(attrs as HTMLAttributes & {
                onClick?: (e: MouseEvent) => void;
                onMouseenter?: (e: MouseEvent) => void;
                onMouseleave?: (e: MouseEvent) => void;
              }),
            };
            const { rows, suffix, tooltip } = ellipsis.value;

            const { edit, copy: copyStr, copied, expand, collapse } = locale;

            state.editStr = edit || '';
            state.copyStr = copyStr || '';
            state.copiedStr = copied || '';
            state.expandStr = expand || '';
            state.collapseStr = collapse || (expand === '展开' ? '收起' : 'Collapse');

            const textProps = omit(restProps, [
              'prefixCls',
              'rootClassName',
              'editable',
              'copyable',
              'ellipsis',
              'shimmer',
              'actions',
              'classNames',
              'styles',
              'mark',
              'code',
              'delete',
              'underline',
              'strong',
              'keyboard',
              'italic',
              'loading',
              'maxLength',
              'onUpdate:content',
            ]);

            const cssEllipsis = canUseCSSEllipsis.value;
            const cssTextOverflow = mergedEnableEllipsis.value && rows === 1 && cssEllipsis;
            const cssLineClamp = mergedEnableEllipsis.value && !!rows && rows > 1 && cssEllipsis;

            const tooltipProps = resolveTooltipProps(tooltip, editable.value.text, children);
            const hasTooltip = Boolean(tooltipProps.title) && mergedEnableEllipsis.value;
            const isMergedEllipsis =
              mergedEnableEllipsis.value &&
              (cssEllipsis
                ? hasTooltip && state.isNativeEllipsis
                : state.isEllipsis && !expanded.value);

            let textNode = children as VNodeTypes;
            let ariaLabel: string | undefined;

            // Only use js ellipsis when css ellipsis not support
            if (rows && state.isEllipsis && !expanded.value && !cssEllipsis) {
              const { title } = restProps;
              let restContent = title || '';

              if (!title && (typeof children === 'string' || typeof children === 'number')) {
                restContent = String(children);
              } else if (!title && normalizedSlot?.textFallback) {
                restContent = normalizedSlot.textFallback;
              }

              // show rest content as title on symbol
              restContent = restContent?.slice(String(state.ellipsisContent || '').length);
              // We move full content to outer element to avoid repeat read the content by accessibility
              textNode = (
                <>
                  {toRaw(state.ellipsisContent)}
                  <span title={restContent} aria-hidden="true">
                    {ELLIPSIS_STR}
                  </span>
                  {suffix}
                </>
              );
            } else {
              textNode = (
                <>
                  {children}
                  {suffix}
                </>
              );
            }

            textNode = wrapperDecorations(props, textNode);

            const operations = renderOperations(false, !hasTextContent);

            const shimmerDuration = shimmerConfig.value.duration;
            const [shimmerMotionTime = DEFAULT_SHIMMER_DURATION, shimmerWaitTime = 1] =
              Array.isArray(shimmerDuration) ? shimmerDuration : [shimmerDuration];
            const rootPrefix = rootPrefixCls.value || 'ant';
            const shimmerStyle: Record<string, any> = enableShimmer.value
              ? {
                  [`--${rootPrefix}-typography-shimmer-motion-time`]: shimmerMotionTime,
                  [`--${rootPrefix}-typography-shimmer-wait-time`]: shimmerWaitTime,
                }
              : {};

            const handleClick = (e: MouseEvent) => {
              if (triggerType.indexOf('text') !== -1 && editClickEvent !== e) {
                onEditClick(e);
              }
              if (typeof attrOnClick === 'function') {
                attrOnClick(e);
              } else if (Array.isArray(attrOnClick)) {
                (attrOnClick as ((ev: MouseEvent) => void)[]).forEach(fn => fn(e));
              }
            };

            const handleMouseEnter = (e: MouseEvent) => {
              measureNativeEllipsis();
              if (typeof attrOnMouseEnter === 'function') {
                attrOnMouseEnter(e);
              } else if (Array.isArray(attrOnMouseEnter)) {
                (attrOnMouseEnter as ((ev: MouseEvent) => void)[]).forEach(fn => fn(e));
              }
            };

            const handleMouseLeave = (e: MouseEvent) => {
              if (typeof attrOnMouseLeave === 'function') {
                attrOnMouseLeave(e);
              } else if (Array.isArray(attrOnMouseLeave)) {
                (attrOnMouseLeave as ((ev: MouseEvent) => void)[]).forEach(fn => fn(e));
              }
            };

            const typographyNode = (
              <InternalTypography
                ref={contentRef}
                prefixCls={prefixCls.value}
                rootClassName={props.rootClassName}
                classNames={mergedClassNames.value}
                styles={mergedStyles.value}
                class={classNames(
                  contextClassName.value,
                  {
                    [`${prefixCls.value}-${type}`]: type,
                    [`${prefixCls.value}-disabled`]: disabled,
                    [`${prefixCls.value}-shimmer`]: enableShimmer.value && !disabled,
                    [`${prefixCls.value}-ellipsis`]: enableEllipsis.value,
                    [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow,
                    [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp,
                    [`${prefixCls.value}-link`]: props.component === 'a',
                  },
                  className,
                )}
                style={[
                  contextStyle.value,
                  shimmerStyle,
                  style as CSSProperties,
                  cssLineClamp ? { WebkitLineClamp: rows } : undefined,
                ]}
                aria-label={ariaLabel}
                aria-busy={enableShimmer.value ? !disabled : undefined}
                aria-disabled={enableShimmer.value && disabled ? true : undefined}
                direction={direction.value}
                onClick={handleClick}
                onMouseenter={handleMouseEnter}
                onMouseleave={handleMouseLeave}
                {...textProps}
              >
                {actionsPlacement.value === 'start' ? operations : null}
                {textNode}
                {actionsPlacement.value === 'start' ? null : operations}
              </InternalTypography>
            );

            return (
              <ResizeObserver onResize={resizeOnNextFrame} disabled={!mergedEnableEllipsis.value}>
                {hasTooltip ? (
                  <Tooltip
                    {...tooltipProps}
                    open={
                      !isMergedEllipsis || state.isHoveringOperations ? false : tooltipProps.open
                    }
                  >
                    {typographyNode}
                  </Tooltip>
                ) : (
                  typographyNode
                )}
              </ResizeObserver>
            );
          }}
        />
      );
    };
  },
});

export default Base;
