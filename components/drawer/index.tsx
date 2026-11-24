import type { CSSProperties, ExtractPropTypes, Plugin, PropType } from 'vue';
import {
  inject,
  nextTick,
  defineComponent,
  shallowRef,
  onMounted,
  provide,
  onUnmounted,
  watch,
  computed,
} from 'vue';
import { getPropsSlot, initDefaultProps } from '../_util/props-util';
import classnames from '../_util/classNames';
import VcDrawer from '../vc-drawer';
import PropTypes from '../_util/vue-types';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { objectType, withInstall } from '../_util/type';
import type { CustomSlotsType, VueNode } from '../_util/type';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import omit from '../_util/omit';
import devWarning from '../vc-util/devWarning';
import type { KeyboardEventHandler, MouseEventHandler } from '../_util/EventInterface';
import useStyle from './style';
import PurePanel from './PurePanel';
import Skeleton from '../skeleton';
import { NoCompactStyle } from '../space/Compact';

import isNumeric from '../_util/isNumeric';
import { getTransitionName, getTransitionProps } from '../_util/transition';
import { usePanelRef } from '../watermark/context';

export type { DrawerPurePanelProps } from './PurePanel';

type ILevelMove = number | [number, number];

const PlacementTypes = ['top', 'right', 'bottom', 'left'] as const;
export type placementType = (typeof PlacementTypes)[number];

const SizeTypes = ['default', 'large'] as const;
export type sizeType = (typeof SizeTypes)[number];

export type DrawerSemanticName =
  | 'root'
  | 'mask'
  | 'wrapper'
  | 'section'
  | 'content'
  | 'header'
  | 'title'
  | 'extra'
  | 'body'
  | 'footer'
  | 'dragger'
  | 'close';

export type DrawerSemanticClassNames = SemanticClassNames<DrawerSemanticName>;
export type DrawerSemanticStyles = SemanticStyles<DrawerSemanticName>;
export type DrawerClassNamesType =
  | DrawerSemanticClassNames
  | ((info: { props: DrawerProps }) => DrawerSemanticClassNames);
export type DrawerStylesType =
  | DrawerSemanticStyles
  | ((info: { props: DrawerProps }) => DrawerSemanticStyles);

export interface PushState {
  distance: string | number;
}

export interface DrawerClosableType {
  closeIcon?: VueNode;
  disabled?: boolean;
  placement?: 'start' | 'end';
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type DrawerClosable = boolean | DrawerClosableType;

export interface DrawerMaskConfig {
  enabled?: boolean;
  blur?: boolean;
  closable?: boolean;
}

export type DrawerMaskType = boolean | DrawerMaskConfig;

export interface DrawerResizableConfig {
  onResizeStart?: () => void;
  onResize?: (size: number) => void;
  onResizeEnd?: () => void;
}

export type DrawerResizable = boolean | DrawerResizableConfig;

const defaultPushState: PushState = { distance: 180 };
type getContainerFunc = () => HTMLElement;
export const drawerProps = () => ({
  autofocus: { type: Boolean, default: undefined },
  closable: {
    type: [Boolean, Object] as PropType<DrawerClosable>,
    default: undefined,
  },
  closeIcon: PropTypes.any,
  /** 语义化 classNames（支持对象或函数） */
  classNames: {
    type: [Object, Function] as PropType<DrawerClassNamesType>,
    default: undefined,
  },
  loading: { type: Boolean, default: false },
  ariaId: String,
  /** 语义化 styles（支持对象或函数） */
  styles: {
    type: [Object, Function] as PropType<DrawerStylesType>,
    default: undefined,
  },
  destroyOnClose: { type: Boolean, default: undefined },
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyOnHidden: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  getContainer: {
    type: [String, Function, Boolean, Object] as PropType<
      string | HTMLElement | getContainerFunc | false
    >,
    default: undefined as string | HTMLElement | getContainerFunc | false,
  },
  maskClosable: { type: Boolean, default: undefined },
  mask: {
    type: [Boolean, Object] as PropType<DrawerMaskType>,
    default: undefined,
  },
  maskStyle: objectType<CSSProperties>(),
  rootClassName: String,
  rootStyle: objectType<CSSProperties>(),
  size: {
    type: [String, Number] as PropType<sizeType | number | string>,
  },
  maxSize: Number,
  resizable: {
    type: [Boolean, Object] as PropType<DrawerResizable>,
    default: undefined,
  },
  drawerRender: Function as PropType<(node: VueNode) => VueNode>,
  drawerStyle: objectType<CSSProperties>(),
  headerStyle: objectType<CSSProperties>(),
  bodyStyle: objectType<CSSProperties>(),
  contentWrapperStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
  title: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: Number,
  prefixCls: String,
  push: PropTypes.oneOfType([PropTypes.looseBool, { type: Object as PropType<PushState> }]),
  placement: PropTypes.oneOf(PlacementTypes),
  keyboard: { type: Boolean, default: undefined },
  extra: PropTypes.any,
  footer: PropTypes.any,
  footerStyle: objectType<CSSProperties>(),
  level: PropTypes.any,
  levelMove: {
    type: [Number, Array, Function] as PropType<
      ILevelMove | ((e: { target: HTMLElement; open: boolean }) => ILevelMove)
    >,
  },
  handle: PropTypes.any,
  /** @deprecated Use `@afterVisibleChange` instead */
  afterVisibleChange: Function as PropType<(visible: boolean) => void>,
  afterOpenChange: Function as PropType<(open: boolean) => void>,
  /** @deprecated Please use `@afterOpenChange` instead */
  onAfterVisibleChange: Function as PropType<(visible: boolean) => void>,
  onAfterOpenChange: Function as PropType<(open: boolean) => void>,
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onClose: Function as PropType<MouseEventHandler | KeyboardEventHandler>,
});

export type DrawerProps = Partial<ExtractPropTypes<ReturnType<typeof drawerProps>>>;

const Drawer = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADrawer',
  inheritAttrs: false,
  props: initDefaultProps(drawerProps(), {
    placement: 'right',
    level: null,
    keyboard: true,
    push: defaultPushState,
  }),
  slots: Object as CustomSlotsType<{
    closeIcon: any;
    title: any;
    extra: any;
    footer: any;
    handle: any;
    default: any;
  }>,
  // emits: ['update:visible', 'close', 'afterVisibleChange'],
  setup(props, { emit, slots, attrs }) {
    const sPush = shallowRef(false);
    const destroyClose = shallowRef(false);
    const vcDrawer = shallowRef(null);
    const load = shallowRef(false);
    const visible = shallowRef(false);
    const mergedOpen = computed(() => props.open ?? props.visible);
    const mergedDestroyOnHidden = computed(() => props.destroyOnHidden ?? props.destroyOnClose);

    devWarning(
      props.destroyOnClose === undefined,
      'Drawer',
      '`destroyOnClose` is deprecated. Please use `destroyOnHidden` instead.',
    );
    watch(
      mergedOpen,
      () => {
        if (mergedOpen.value) {
          load.value = true;
        } else {
          visible.value = false;
        }
      },
      { immediate: true },
    );
    watch(
      [mergedOpen, load],
      () => {
        if (mergedOpen.value && load.value) {
          visible.value = true;
        }
      },
      { immediate: true },
    );
    const parentDrawerOpts = inject('parentDrawerOpts', null);
    const { prefixCls, getPopupContainer, direction, configProvider } = useConfigInject(
      'drawer',
      props,
    );
    const drawerConfig = computed(() => (configProvider.drawer?.value as any) || {});
    const panelRef = usePanelRef();
    const wrapperBodyRef = shallowRef<HTMLElement | null>(null);
    const setWrapperBodyRef = (el: any) => {
      wrapperBodyRef.value = el as HTMLElement | null;
      if (typeof panelRef === 'function') {
        panelRef(el);
      }
    };
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getContainer = computed(() =>
      // 有可能为 false，所以不能直接判断
      props.getContainer === undefined && getPopupContainer?.value
        ? () => getPopupContainer.value(document.body)
        : props.getContainer,
    );

    devWarning(
      !props.afterVisibleChange,
      'Drawer',
      '`afterVisibleChange` prop is deprecated, please use `@afterVisibleChange` event instead',
    );
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      [
        ['visible', 'open'],
        ['onUpdate:visible', 'onUpdate:open'],
        ['onAfterVisibleChange', 'onAfterOpenChange'],
      ].forEach(([deprecatedName, newName]) => {
        devWarning(
          !props[deprecatedName],
          'Drawer',
          `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`,
        );
      });
    }

    const setPush = () => {
      sPush.value = true;
    };

    const setPull = () => {
      sPush.value = false;
      nextTick(() => {
        domFocus();
      });
    };
    provide('parentDrawerOpts', {
      setPush,
      setPull,
    });

    onMounted(() => {
      if (mergedOpen.value && parentDrawerOpts) {
        parentDrawerOpts.setPush();
      }
    });

    onUnmounted(() => {
      cleanupResizeListeners();
      if (parentDrawerOpts) {
        parentDrawerOpts.setPull();
      }
    });

    watch(
      visible,
      () => {
        if (!visible.value) {
          cleanupResizeListeners();
        }
        if (parentDrawerOpts) {
          if (visible.value) {
            parentDrawerOpts.setPush();
          } else {
            parentDrawerOpts.setPull();
          }
        }
      },
      { flush: 'post' },
    );

    const domFocus = () => {
      vcDrawer.value?.domFocus?.();
    };

    const close = (e: Event) => {
      emit('update:visible', false);
      emit('update:open', false);
      emit('close', e);
    };

    const afterVisibleChange = (open: boolean) => {
      if (!open) {
        if (destroyClose.value === false) {
          // set true only once
          destroyClose.value = true;
        }
        if (mergedDestroyOnHidden.value) {
          load.value = false;
        }
      }
      props.afterVisibleChange?.(open);
      props.afterOpenChange?.(open);
      emit('afterVisibleChange', open);
      emit('afterOpenChange', open);
    };

    // ============================ Mask ============================
    const mergedMaskConfig = computed(() => {
      const ctxMask = drawerConfig.value.mask;
      const rawMask = props.mask;
      let enabled = true;
      let blur = false;
      let closable: boolean | undefined;

      if (typeof ctxMask === 'boolean') {
        enabled = ctxMask;
      } else if (ctxMask && typeof ctxMask === 'object') {
        if (ctxMask.enabled !== undefined) enabled = ctxMask.enabled;
        if (ctxMask.blur !== undefined) blur = ctxMask.blur;
        if (ctxMask.closable !== undefined) closable = ctxMask.closable;
      }

      if (typeof rawMask === 'boolean') {
        enabled = rawMask;
        blur = false;
      } else if (rawMask && typeof rawMask === 'object') {
        if (rawMask.enabled !== undefined) enabled = rawMask.enabled;
        if (rawMask.blur !== undefined) blur = rawMask.blur;
        if (rawMask.closable !== undefined) closable = rawMask.closable;
      }

      return {
        enabled,
        blur,
        closable: closable ?? props.maskClosable ?? true,
      };
    });

    // ========================== Closable ==========================
    const mergedClosableInfo = computed(() => {
      const rawClosable =
        props.closable !== undefined
          ? props.closable
          : drawerConfig.value.closable !== undefined
          ? drawerConfig.value.closable
          : true;
      const obj =
        rawClosable && typeof rawClosable === 'object' ? (rawClosable as DrawerClosableType) : null;
      const enabled = rawClosable !== false;
      const disabled = Boolean(obj?.disabled);
      const placement: 'start' | 'end' = obj?.placement === 'end' ? 'end' : 'start';
      const ariaOrDataProps: Record<string, any> = {};
      if (obj) {
        Object.keys(obj).forEach(key => {
          if (key.startsWith('aria-') || key.startsWith('data-')) {
            ariaOrDataProps[key] = (obj as any)[key];
          }
        });
      }
      return {
        raw: rawClosable,
        enabled,
        disabled,
        placement,
        closeIcon: obj?.closeIcon,
        ariaOrDataProps,
      };
    });

    const pushTransform = computed(() => {
      const { push, placement } = props;
      let distance: number | string;
      if (typeof push === 'boolean') {
        distance = push ? defaultPushState.distance : 0;
      } else {
        distance = push!.distance;
      }

      distance = parseFloat(String(distance || 0));

      if (placement === 'left' || placement === 'right') {
        return `translateX(${placement === 'left' ? distance : -distance}px)`;
      }
      if (placement === 'top' || placement === 'bottom') {
        return `translateY(${placement === 'top' ? distance : -distance}px)`;
      }
      return null;
    });
    // ============================ Size & Resize ============================
    const isDragging = shallowRef(false);
    const dragSize = shallowRef<number | null>(null);
    let resizeMoveListener: ((e: MouseEvent) => void) | null = null;
    let resizeUpListener: (() => void) | null = null;
    let resizeTouchMoveListener: ((e: TouchEvent) => void) | null = null;
    let resizeTouchEndListener: (() => void) | null = null;

    const cleanupResizeListeners = () => {
      if (typeof window !== 'undefined') {
        if (resizeMoveListener) {
          window.removeEventListener('mousemove', resizeMoveListener);
          resizeMoveListener = null;
        }
        if (resizeUpListener) {
          window.removeEventListener('mouseup', resizeUpListener);
          resizeUpListener = null;
        }
        if (resizeTouchMoveListener) {
          window.removeEventListener('touchmove', resizeTouchMoveListener);
          resizeTouchMoveListener = null;
        }
        if (resizeTouchEndListener) {
          window.removeEventListener('touchend', resizeTouchEndListener);
          resizeTouchEndListener = null;
        }
      }
      isDragging.value = false;
    };

    watch([() => props.width, () => props.height, () => props.size, () => props.placement], () => {
      dragSize.value = null;
    });

    const resolvedSizeFromProp = computed(() => {
      const { size } = props;
      if (typeof size === 'number') {
        return size;
      }
      if (size === 'large') {
        return 736;
      }
      if (size === 'default' || size === undefined) {
        return 378;
      }
      if (/^\d+(\.\d+)?$/.test(size)) {
        return Number(size);
      }
      return size;
    });

    const isHorizontalPlacement = computed(
      () => props.placement === 'left' || props.placement === 'right',
    );

    const baseWidth = computed(() => props.width ?? resolvedSizeFromProp.value);
    const baseHeight = computed(() => props.height ?? resolvedSizeFromProp.value);

    const mergedWidth = computed(() =>
      isHorizontalPlacement.value && dragSize.value !== null ? dragSize.value : baseWidth.value,
    );
    const mergedHeight = computed(() =>
      !isHorizontalPlacement.value && dragSize.value !== null ? dragSize.value : baseHeight.value,
    );

    const startResize = (startClientPos: number, isTouch: boolean) => {
      if (!props.resizable || isDragging.value) {
        return;
      }
      const resizableConfig =
        typeof props.resizable === 'object' ? (props.resizable as DrawerResizableConfig) : null;
      const placement = props.placement || 'right';
      const horizontal = placement === 'left' || placement === 'right';
      const rect = wrapperBodyRef.value?.getBoundingClientRect();
      const measuredSize = horizontal ? rect?.width : rect?.height;
      const fallbackSize = parseFloat(String(horizontal ? mergedWidth.value : mergedHeight.value));
      const startSize =
        measuredSize && measuredSize > 0
          ? measuredSize
          : Number.isFinite(fallbackSize)
          ? fallbackSize
          : 378;

      isDragging.value = true;
      resizableConfig?.onResizeStart?.();

      const updateSize = (clientPos: number) => {
        const delta = clientPos - startClientPos;
        let nextSize = startSize;
        if (placement === 'left' || placement === 'top') {
          nextSize = startSize + delta;
        } else {
          nextSize = startSize - delta;
        }
        const rawSize = Math.max(0, Math.round(nextSize));
        const clampedSize =
          props.maxSize !== undefined ? Math.min(rawSize, props.maxSize) : rawSize;
        dragSize.value = clampedSize;
        resizableConfig?.onResize?.(clampedSize);
      };

      const finishResize = () => {
        cleanupResizeListeners();
        resizableConfig?.onResizeEnd?.();
      };

      if (typeof window !== 'undefined') {
        if (isTouch) {
          resizeTouchMoveListener = (e: TouchEvent) => {
            if (e.touches.length > 0) {
              updateSize(horizontal ? e.touches[0].clientX : e.touches[0].clientY);
            }
          };
          resizeTouchEndListener = finishResize;
          window.addEventListener('touchmove', resizeTouchMoveListener);
          window.addEventListener('touchend', resizeTouchEndListener);
        } else {
          resizeMoveListener = (e: MouseEvent) => {
            updateSize(horizontal ? e.clientX : e.clientY);
          };
          resizeUpListener = finishResize;
          window.addEventListener('mousemove', resizeMoveListener);
          window.addEventListener('mouseup', resizeUpListener);
        }
      }
    };

    const handleResizeMouseDown = (e: MouseEvent) => {
      if (e.button !== undefined && e.button !== 0) {
        return;
      }
      e.preventDefault();
      const horizontal = isHorizontalPlacement.value;
      startResize(horizontal ? e.clientX : e.clientY, false);
    };

    const handleResizeTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        return;
      }
      const horizontal = isHorizontalPlacement.value;
      startResize(horizontal ? e.touches[0].clientX : e.touches[0].clientY, true);
    };

    const offsetStyle = computed(() => {
      // https://github.com/ant-design/ant-design/issues/24287
      const { placement } = props;
      if (!visible.value && !mergedMaskConfig.value.enabled) {
        return {};
      }
      const val: CSSProperties = {};
      if (placement === 'left' || placement === 'right') {
        val.width = isNumeric(mergedWidth.value) ? `${mergedWidth.value}px` : mergedWidth.value;
      } else {
        val.height = isNumeric(mergedHeight.value) ? `${mergedHeight.value}px` : mergedHeight.value;
      }
      return val;
    });

    const wrapperStyle = computed(() => {
      const { zIndex, contentWrapperStyle } = props;
      const val = offsetStyle.value;
      const draggingStyle: CSSProperties | undefined = isDragging.value
        ? { transition: 'none', userSelect: 'none' }
        : undefined;
      return [
        { zIndex, transform: sPush.value ? pushTransform.value : undefined, ...draggingStyle },
        { ...contentWrapperStyle },
        val,
      ];
    });

    const renderCloseIcon = (
      prefixCls: string,
      semClassNames: DrawerSemanticClassNames,
      semStyles: DrawerSemanticStyles,
    ) => {
      const {
        enabled: closable,
        disabled: closeDisabled,
        placement: closablePlacement,
        closeIcon: closableCloseIcon,
        ariaOrDataProps,
      } = mergedClosableInfo.value;
      const $closeIcon = slots.closeIcon
        ? slots.closeIcon?.()
        : closableCloseIcon !== undefined
        ? closableCloseIcon
        : props.closeIcon ?? drawerConfig.value.closeIcon;
      return (
        closable && (
          <button
            key="closer"
            onClick={closeDisabled ? undefined : close}
            aria-label="Close"
            {...ariaOrDataProps}
            disabled={closeDisabled || undefined}
            class={classnames(
              `${prefixCls}-close`,
              {
                [`${prefixCls}-close-end`]: closablePlacement === 'end',
              },
              semClassNames.close,
            )}
            style={semStyles.close}
          >
            {$closeIcon === undefined ? <CloseOutlined></CloseOutlined> : $closeIcon}
          </button>
        )
      );
    };

    const renderHeader = (
      prefixCls: string,
      title: any,
      extra: any,
      semClassNames: DrawerSemanticClassNames,
      semStyles: DrawerSemanticStyles,
    ) => {
      const { headerStyle } = props;
      const { enabled: closable, placement: closablePlacement } = mergedClosableInfo.value;
      if (!title && !closable && !extra) {
        return null;
      }

      if (closablePlacement === 'end') {
        return (
          <div
            class={classnames(
              `${prefixCls}-header`,
              {
                [`${prefixCls}-header-close-only`]: closable && !title && !extra,
              },
              semClassNames.header,
            )}
            style={[headerStyle, semStyles.header]}
          >
            <div class={`${prefixCls}-header-title`}>
              {title && (
                <div
                  class={classnames(`${prefixCls}-title`, semClassNames.title)}
                  style={semStyles.title}
                  id={props.ariaId}
                >
                  {title}
                </div>
              )}
            </div>
            {extra && (
              <div
                class={classnames(`${prefixCls}-extra`, semClassNames.extra)}
                style={semStyles.extra}
              >
                {extra}
              </div>
            )}
            {renderCloseIcon(prefixCls, semClassNames, semStyles)}
          </div>
        );
      }

      return (
        <div
          class={classnames(
            `${prefixCls}-header`,
            {
              [`${prefixCls}-header-close-only`]: closable && !title && !extra,
            },
            semClassNames.header,
          )}
          style={[headerStyle, semStyles.header]}
        >
          <div class={`${prefixCls}-header-title`}>
            {renderCloseIcon(prefixCls, semClassNames, semStyles)}
            {title && (
              <div
                class={classnames(`${prefixCls}-title`, semClassNames.title)}
                style={semStyles.title}
                id={props.ariaId}
              >
                {title}
              </div>
            )}
          </div>
          {extra && (
            <div
              class={classnames(`${prefixCls}-extra`, semClassNames.extra)}
              style={semStyles.extra}
            >
              {extra}
            </div>
          )}
        </div>
      );
    };

    const renderResizeDragger = (
      prefixCls: string,
      semClassNames: DrawerSemanticClassNames,
      semStyles: DrawerSemanticStyles,
    ) => (
      <div
        class={classnames(
          `${prefixCls}-resizable-dragger`,
          `${prefixCls}-resizable-dragger-${props.placement}`,
          {
            [`${prefixCls}-resizable-dragger-dragging`]: isDragging.value,
          },
          semClassNames.dragger,
        )}
        style={semStyles.dragger}
        onMousedown={handleResizeMouseDown}
        onTouchstart={handleResizeTouchStart}
      />
    );

    const renderFooter = (
      prefixCls: string,
      footer: any,
      semClassNames: DrawerSemanticClassNames,
      semStyles: DrawerSemanticStyles,
    ) => {
      if (!footer) {
        return null;
      }

      const footerClassName = `${prefixCls}-footer`;
      return (
        <div
          class={[footerClassName, semClassNames.footer]}
          style={[props.footerStyle, semStyles.footer]}
        >
          {footer}
        </div>
      );
    };

    const renderBody = (
      prefixCls: string,
      title: any,
      extra: any,
      footer: any,
      semClassNames: DrawerSemanticClassNames,
      semStyles: DrawerSemanticStyles,
    ) => {
      if (destroyClose.value && !props.forceRender && !load.value) {
        return null;
      }

      const { bodyStyle, drawerStyle } = props;
      const bodyContent = (
        <div
          key="body"
          class={[`${prefixCls}-body`, semClassNames.body]}
          style={[bodyStyle, semStyles.body]}
        >
          {props.loading ? (
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 5 }}
              class={`${prefixCls}-body-skeleton`}
            />
          ) : (
            slots.default?.()
          )}
        </div>
      );

      const panelNode = props.resizable ? (
        <div
          ref={setWrapperBodyRef}
          class={[`${prefixCls}-wrapper-body`, semClassNames.content, semClassNames.section]}
          style={[drawerStyle, semStyles.content, semStyles.section]}
          aria-labelledby={props.ariaId}
        >
          {renderHeader(prefixCls, title, extra, semClassNames, semStyles)}
          {bodyContent}
          {renderFooter(prefixCls, footer, semClassNames, semStyles)}
          {renderResizeDragger(prefixCls, semClassNames, semStyles)}
        </div>
      ) : (
        <div
          ref={setWrapperBodyRef}
          class={[`${prefixCls}-wrapper-body`, semClassNames.content, semClassNames.section]}
          style={[drawerStyle, semStyles.content, semStyles.section]}
          aria-labelledby={props.ariaId}
        >
          {renderHeader(prefixCls, title, extra, semClassNames, semStyles)}
          {bodyContent}
          {renderFooter(prefixCls, footer, semClassNames, semStyles)}
        </div>
      );

      return props.drawerRender ? props.drawerRender(panelNode) : panelNode;
    };

    // =========================== Motion ===========================
    const maskMotion = computed(() => {
      return getTransitionProps(getTransitionName(prefixCls.value, 'mask-motion'));
    });
    const panelMotion = (motionPlacement: string) => {
      return getTransitionProps(
        getTransitionName(prefixCls.value, `panel-motion-${motionPlacement}`),
      );
    };

    return () => {
      const { width, height, placement, mask, forceRender, ...rest } = props;
      const title = getPropsSlot(slots, props, 'title');
      const extra = getPropsSlot(slots, props, 'extra');
      const footer = getPropsSlot(slots, props, 'footer');

      const mergedPropsForSemantic: DrawerProps = {
        ...props,
        open: mergedOpen.value,
        mask: mergedMaskConfig.value.enabled,
        maskClosable: mergedMaskConfig.value.closable,
        closable: mergedClosableInfo.value.raw,
        title,
        extra,
        footer,
      };
      const [semClassNames, semStyles] = mergeSemantic<
        DrawerSemanticClassNames,
        DrawerSemanticStyles,
        DrawerProps
      >(
        [drawerConfig.value.classNames, props.classNames],
        [drawerConfig.value.styles, props.styles],
        { props: mergedPropsForSemantic },
      );

      const drawerClassName = classnames(
        {
          'no-mask': !mergedMaskConfig.value.enabled,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        props.rootClassName,
        semClassNames.root,
        hashId.value,
      );

      const mergedRootStyle =
        semStyles.root || props.rootStyle ? { ...semStyles.root, ...props.rootStyle } : undefined;

      const mergedWrapperStyle = semStyles.wrapper
        ? [...wrapperStyle.value, semStyles.wrapper]
        : wrapperStyle.value;

      const mergedContentClass =
        classnames(drawerConfig.value.className, attrs.class as any) || undefined;
      const mergedContentStyle =
        drawerConfig.value.style || attrs.style
          ? {
              ...(drawerConfig.value.style as CSSProperties),
              ...(typeof attrs.style === 'object' ? (attrs.style as CSSProperties) : {}),
            }
          : undefined;

      const vcDrawerProps: any = {
        ...attrs,
        ...omit(rest, [
          'size',
          'maxSize',
          'resizable',
          'drawerRender',
          'closeIcon',
          'closable',
          'destroyOnClose',
          'destroyOnHidden',
          'drawerStyle',
          'headerStyle',
          'bodyStyle',
          'title',
          'push',
          'afterOpenChange',
          'onAfterVisibleChange',
          'onClose',
          'onUpdate:visible',
          'onUpdate:open',
          'visible',
          'classNames',
          'styles',
          'ariaId',
        ]),
        class: mergedContentClass,
        style: mergedContentStyle,
        forceRender,
        onClose: close,
        afterVisibleChange,
        handler: false,
        prefixCls: prefixCls.value,
        open: visible.value,
        showMask: mergedMaskConfig.value.enabled,
        maskClosable: mergedMaskConfig.value.closable,
        maskClassName: classnames(semClassNames.mask, {
          [`${prefixCls.value}-mask-blur`]: mergedMaskConfig.value.blur,
        }),
        wrapperClassName: semClassNames.wrapper,
        maskStyle: { ...semStyles.mask, ...props.maskStyle },
        placement,
        ref: vcDrawer,
      };
      return wrapSSR(
        <NoCompactStyle>
          <VcDrawer
            {...vcDrawerProps}
            maskMotion={maskMotion.value}
            motion={panelMotion}
            width={mergedWidth.value}
            height={mergedHeight.value}
            getContainer={getContainer.value}
            rootClassName={drawerClassName}
            rootStyle={mergedRootStyle}
            contentWrapperStyle={mergedWrapperStyle}
            v-slots={{
              handler: props.handle ? () => props.handle : slots.handle,
              default: () =>
                renderBody(prefixCls.value, title, extra, footer, semClassNames, semStyles),
            }}
          ></VcDrawer>
        </NoCompactStyle>,
      );
    };
  },
});

(Drawer as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export { PurePanel as DrawerPurePanel };

export default withInstall(Drawer) as typeof Drawer &
  Plugin & {
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
