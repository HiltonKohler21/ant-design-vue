import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import {
  cloneVNode,
  computed,
  defineComponent,
  isVNode,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  watch,
} from 'vue';
import classNames from '../_util/classNames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import Skeleton from '../skeleton';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { VueNode } from '../_util/type';
import { objectType } from '../_util/type';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import { canUseDocElement } from '../_util/styleChecker';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
import { usePanelRef } from '../watermark/context';
import type {
  ClosableType,
  getContainerFunc,
  MaskConfig,
  MaskType,
  ModalClassNamesType,
  ModalClosableType,
  ModalFocusableConfig,
  ModalFooterRender,
  ModalFooterRenderExtra,
  ModalFunc,
  ModalFuncProps,
  ModalLocale,
  ModalSemanticClassNames,
  ModalSemanticName,
  ModalSemanticStyles,
  ModalStylesType,
  ModalWidthType,
  MousePosition,
} from './interface';
import { createNormalFooter, renderCloseIcon } from './shared';
import useStyle from './style';

export type {
  ClosableType,
  MaskConfig,
  MaskType,
  ModalClassNamesType,
  ModalClosableType,
  ModalFocusableConfig,
  ModalFooterRender,
  ModalFooterRenderExtra,
  ModalFunc,
  ModalFuncProps,
  ModalLocale,
  ModalSemanticClassNames,
  ModalSemanticName,
  ModalSemanticStyles,
  ModalStylesType,
  ModalWidthType,
  MousePosition,
};

let mousePosition: MousePosition;
// ref: https://github.com/ant-design/ant-design/issues/15795
const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => (mousePosition = null), 100);
};

// 只有点击事件支持从鼠标位置动画展开
if (canUseDocElement()) {
  addEventListener(document.documentElement, 'click', getClickPosition, true);
}

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export const modalProps = () => ({
  prefixCls: String,
  /** @deprecated Please use `open` instead. */
  visible: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
  confirmLoading: { type: Boolean, default: undefined },
  loading: { type: Boolean, default: undefined },
  title: PropTypes.any,
  closable: {
    type: [Boolean, Object] as PropType<ClosableType>,
    default: undefined,
  },
  closeIcon: PropTypes.any,
  onOk: Function as PropType<(e: MouseEvent) => void>,
  /** onOk 别名 */
  onConfirm: Function as PropType<(e: MouseEvent) => void>,
  /** open 变化后的回调（替代 afterClose） */
  afterOpenChange: Function as PropType<(open: boolean) => void>,
  onCancel: Function as PropType<(e: MouseEvent) => void>,
  'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onChange: Function as PropType<(open: boolean) => void>,
  afterClose: Function as PropType<() => void>,
  centered: { type: Boolean, default: undefined },
  width: [String, Number, Object] as PropType<ModalWidthType>,
  footer: PropTypes.any,
  okText: PropTypes.any,
  okType: String as PropType<LegacyButtonType>,
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  maskClosable: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  okButtonProps: objectType<ButtonPropsType>(),
  cancelButtonProps: objectType<ButtonPropsType>(),
  /** 语义化 classNames（支持对象或函数）：root / mask / wrapper / container / content / header / title / body / footer / close */
  classNames: [Object, Function] as PropType<ModalClassNamesType>,
  /** 语义化 styles（支持对象或函数）：root / mask / wrapper / container / content / header / title / body / footer / close */
  styles: [Object, Function] as PropType<ModalStylesType>,
  destroyOnClose: { type: Boolean, default: undefined },
  destroyOnHidden: { type: Boolean, default: undefined },
  rootClassName: String,
  rootStyle: objectType<CSSProperties>(),
  wrapClassName: String,
  maskTransitionName: String,
  transitionName: String,
  getContainer: {
    type: [String, Function, Boolean, Object] as PropType<
      string | HTMLElement | getContainerFunc | false
    >,
    default: undefined,
  },
  zIndex: Number,
  bodyStyle: objectType<CSSProperties>(),
  maskStyle: objectType<CSSProperties>(),
  mask: {
    type: [Boolean, Object] as PropType<MaskType>,
    default: undefined,
  },
  keyboard: { type: Boolean, default: undefined },
  wrapProps: Object,
  focusTriggerAfterClose: { type: Boolean, default: undefined },
  focusable: objectType<ModalFocusableConfig>(),
  modalRender: Function as PropType<(arg: { originVNode: VueNode }) => VueNode>,
  mousePosition: objectType<MousePosition>(),
});

export type ModalProps = Partial<ExtractPropTypes<ReturnType<typeof modalProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AModal',
  inheritAttrs: false,
  props: initDefaultProps(modalProps(), {
    width: 520,
    confirmLoading: false,
    okType: 'primary',
  }),
  setup(props, { emit, slots, attrs }) {
    const [locale] = useLocaleReceiver('Modal');
    const { prefixCls, rootPrefixCls, direction, getPopupContainer, configProvider } =
      useConfigInject('modal', props);
    const modalConfig = computed(() => (configProvider.modal?.value as any) || {});
    const panelRef = usePanelRef();
    const [wrapSSR, hashId] = useStyle(prefixCls);

    warning(
      props.visible === undefined,
      'Modal',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );

    const mergedOpen = computed(() => props.open ?? props.visible);
    watch(
      mergedOpen,
      (val, oldVal) => {
        if (val && !oldVal) {
          nextTick(() => {
            if (mergedOpen.value) {
              props.afterOpenChange?.(true);
            }
          });
        }
      },
      { flush: 'post', immediate: true },
    );

    const maskInfo = computed(() => {
      const ctxMask = modalConfig.value.mask;
      const mask = props.mask;
      let mergedMask: boolean | undefined = undefined;
      let maskBlur = false;
      let maskClosableFromMask: boolean | undefined = undefined;

      if (typeof ctxMask === 'boolean') {
        mergedMask = ctxMask;
      } else if (ctxMask && typeof ctxMask === 'object') {
        if (ctxMask.enabled !== undefined) mergedMask = ctxMask.enabled;
        if (ctxMask.blur !== undefined) maskBlur = ctxMask.blur;
        if (ctxMask.closable !== undefined) maskClosableFromMask = ctxMask.closable;
      }

      if (typeof mask === 'boolean') {
        mergedMask = mask;
        maskBlur = false;
      } else if (mask && typeof mask === 'object') {
        if (mask.enabled !== undefined) mergedMask = mask.enabled;
        if (mask.blur !== undefined) maskBlur = mask.blur;
        if (mask.closable !== undefined) maskClosableFromMask = mask.closable;
      }

      const mergedMaskClosable =
        maskClosableFromMask !== undefined ? maskClosableFromMask : props.maskClosable;

      return {
        mergedMask,
        maskBlur,
        mergedMaskClosable,
      };
    });

    const mergedFocusable = computed<ModalFocusableConfig>(() => ({
      ...modalConfig.value.focusable,
      ...props.focusable,
    }));

    const mergedFocusTriggerAfterClose = computed(
      () => mergedFocusable.value.focusTriggerAfterClose ?? props.focusTriggerAfterClose ?? true,
    );

    const mergedCentered = computed(() => props.centered ?? modalConfig.value.centered);

    const mergedProps = computed<ModalProps>(() => ({
      ...props,
      footer: props.footer !== undefined ? props.footer : slots.footer,
      centered: mergedCentered.value,
      mask: maskInfo.value.mergedMask,
      maskClosable: maskInfo.value.mergedMaskClosable,
      focusTriggerAfterClose: mergedFocusTriggerAfterClose.value,
      focusable: mergedFocusable.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ModalSemanticClassNames,
      ModalSemanticStyles,
      ModalProps
    >(
      computed(() => [modalConfig.value.classNames, props.classNames]),
      computed(() => [modalConfig.value.styles, props.styles]),
      computed(() => ({ props: mergedProps.value })),
    );

    // Sync root inline style onto `.ant-modal-root` element (since vc-dialog does not accept rootStyle)
    const contentElRef = shallowRef<HTMLElement | null>(null);
    const appliedRootEl = shallowRef<HTMLElement | null>(null);
    const appliedRootStyleKeys = new Set<string>();

    const mergedRootStyle = computed<CSSProperties | undefined>(() => {
      const semRoot = mergedStyles.value.root;
      const propRoot = props.rootStyle;
      if (!semRoot && !propRoot) return undefined;
      return { ...semRoot, ...propRoot };
    });

    const clearAppliedRootStyles = () => {
      if (appliedRootEl.value && appliedRootStyleKeys.size > 0) {
        appliedRootStyleKeys.forEach(key => {
          appliedRootEl.value?.style.removeProperty(key);
        });
        appliedRootStyleKeys.clear();
      }
    };

    const syncRootStyle = () => {
      const el = contentElRef.value;
      const rootEl =
        el && typeof el.closest === 'function'
          ? (el.closest(`.${prefixCls.value}-root`) as HTMLElement | null)
          : null;

      if (appliedRootEl.value && appliedRootEl.value !== rootEl) {
        clearAppliedRootStyles();
      }

      if (!rootEl) {
        appliedRootEl.value = null;
        return;
      }

      const nextStyle = mergedRootStyle.value;
      if (!nextStyle && appliedRootStyleKeys.size === 0) {
        appliedRootEl.value = rootEl;
        return;
      }

      appliedRootStyleKeys.forEach(key => {
        rootEl.style.removeProperty(key);
      });
      appliedRootStyleKeys.clear();

      if (nextStyle && typeof nextStyle === 'object') {
        Object.entries(nextStyle).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '') return;
          const cssKey = k.startsWith('--') ? k : k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
          rootEl.style.setProperty(cssKey, String(v));
          appliedRootStyleKeys.add(cssKey);
        });
      }
      appliedRootEl.value = rootEl;
    };

    watch([contentElRef, mergedRootStyle, prefixCls], syncRootStyle, { flush: 'post' });
    onBeforeUnmount(() => {
      clearAppliedRootStyles();
    });

    const setContentRef = (el: any) => {
      contentElRef.value = el instanceof HTMLElement ? el : el?.$el ?? null;
      if (typeof panelRef === 'function') {
        panelRef(el);
      }
    };

    const handleCancel = (e: MouseEvent) => {
      if (props.confirmLoading) {
        return;
      }
      emit('update:visible', false);
      emit('update:open', false);
      emit('cancel', e);
      emit('change', false);
      const rawClosable =
        props.closable !== undefined ? props.closable : modalConfig.value.closable;
      if (rawClosable && typeof rawClosable === 'object') {
        (rawClosable as ModalClosableType).onClose?.();
      }
    };

    const handleOk = (e: MouseEvent) => {
      emit('ok', e);
      props.onConfirm?.(e);
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        visible,
        open,
        loading,
        closable,
        mask,
        maskClosable,
        rootClassName,
        rootStyle,
        wrapClassName,
        centered,
        getContainer,
        closeIcon,
        focusTriggerAfterClose,
        focusable,
        destroyOnHidden,
        classNames: semanticClassNames,
        styles: semanticStyles,
        modalRender,
        width,
        footer,
        okText,
        okType,
        cancelText,
        confirmLoading,
        okButtonProps,
        cancelButtonProps,
        ...restProps
      } = props;

      const rawClosable = closable !== undefined ? closable : modalConfig.value.closable;
      const closableObj =
        rawClosable && typeof rawClosable === 'object' ? (rawClosable as ModalClosableType) : null;
      const rawCloseIcon =
        closableObj?.closeIcon !== undefined
          ? closableObj.closeIcon
          : closeIcon !== undefined
          ? closeIcon
          : slots.closeIcon
          ? slots.closeIcon()
          : modalConfig.value.closeIcon;
      const mergedClosableBool =
        rawClosable !== undefined
          ? rawClosable !== false
          : rawCloseIcon === null || rawCloseIcon === false
          ? false
          : undefined;
      const closeDisabled = Boolean(closableObj?.disabled);
      const closableAriaOrDataProps: Record<string, any> = {};
      if (closableObj) {
        Object.keys(closableObj).forEach(key => {
          if (key.startsWith('aria-') || key.startsWith('data-')) {
            closableAriaOrDataProps[key] = (closableObj as any)[key];
          }
        });
      }

      const { mergedMask, maskBlur, mergedMaskClosable } = maskInfo.value;

      const semCls = mergedClassNames.value;
      const semStyles = mergedStyles.value;

      const mergedMaskClassName =
        classNames(semCls.mask, {
          [`${prefixCls.value}-mask-blur`]: maskBlur,
        }) || undefined;
      const mergedContainerClass = classNames(semCls.content, semCls.container) || undefined;
      const mergedContainerStyle =
        semStyles.content || semStyles.container
          ? { ...semStyles.content, ...semStyles.container }
          : undefined;

      const mergedMaskStyle =
        props.maskStyle || semStyles.mask ? { ...props.maskStyle, ...semStyles.mask } : undefined;
      const mergedBodyStyle =
        props.bodyStyle || semStyles.body ? { ...props.bodyStyle, ...semStyles.body } : undefined;

      // Responsive width support
      let numWidth: string | number | undefined;
      let responsiveWidthVars: Record<string, string> | undefined;
      if (isPlainObject(width)) {
        numWidth = undefined;
        responsiveWidthVars = {};
        Object.keys(width).forEach(breakpoint => {
          const bpWidth = (width as Record<string, string | number | undefined>)[breakpoint];
          if (bpWidth !== undefined && bpWidth !== null) {
            responsiveWidthVars![`--${prefixCls.value}-${breakpoint}-width`] =
              typeof bpWidth === 'number' ? `${bpWidth}px` : bpWidth;
          }
        });
      } else {
        numWidth = width;
      }

      const wrapClassNameExtended = classNames(wrapClassName, {
        [`${prefixCls.value}-centered`]: !!mergedCentered.value,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl',
      });

      const styleParts = [
        modalConfig.value.style as CSSProperties,
        attrs.style as CSSProperties,
        responsiveWidthVars as CSSProperties,
      ].filter(Boolean);
      const mergedStyle =
        styleParts.length > 1 ? styleParts : styleParts.length === 1 ? styleParts[0] : undefined;

      // Footer resolution (supports null/false, static VNode, render fn `(originNode, { OkBtn, CancelBtn }) => ...`, and `#footer` slot)
      const mergedOkButtonProps =
        modalConfig.value.okButtonProps || okButtonProps
          ? { ...modalConfig.value.okButtonProps, ...okButtonProps }
          : undefined;
      const mergedCancelButtonProps =
        modalConfig.value.cancelButtonProps || cancelButtonProps
          ? { ...modalConfig.value.cancelButtonProps, ...cancelButtonProps }
          : undefined;

      const buildNormalFooter = () =>
        createNormalFooter({
          okText: okText ?? slots.okText?.() ?? locale.value.okText,
          okType,
          cancelText: cancelText ?? slots.cancelText?.() ?? locale.value.cancelText,
          confirmLoading,
          okButtonProps: mergedOkButtonProps,
          cancelButtonProps: mergedCancelButtonProps,
          onOk: handleOk,
          onCancel: handleCancel,
        });

      let dialogFooterProp: any = undefined;
      let dialogFooterSlot: (() => VueNode) | undefined = undefined;

      if (loading || footer === null || footer === false || footer === '') {
        dialogFooterProp = null;
        dialogFooterSlot = undefined;
      } else if (typeof footer === 'function') {
        const { originNode, extra } = buildNormalFooter();
        const customNode = (footer as ModalFooterRender)(originNode, extra);
        if (customNode === null || customNode === false) {
          dialogFooterProp = null;
        } else {
          dialogFooterSlot = () => customNode;
        }
      } else if (footer !== undefined) {
        dialogFooterProp = footer;
      } else if (slots.footer) {
        dialogFooterSlot = () => {
          const { originNode, extra } = buildNormalFooter();
          return slots.footer!({ originNode, ...extra });
        };
      } else {
        dialogFooterSlot = () => buildNormalFooter().originNode;
      }

      const hasVNodeClass = (cls: any, target: string): boolean => {
        if (typeof cls === 'string') {
          return cls.split(/\s+/).includes(target);
        }
        if (Array.isArray(cls)) {
          return cls.some(item => hasVNodeClass(item, target));
        }
        return false;
      };

      const patchTitleNode = (node: any): any => {
        if (
          isVNode(node) &&
          node.type === 'div' &&
          hasVNodeClass(node.props?.class, `${prefixCls.value}-title`)
        ) {
          const extraTitleProps: Record<string, any> = {};
          if (semCls.title) {
            extraTitleProps.class = semCls.title;
          }
          if (semStyles.title) {
            extraTitleProps.style = semStyles.title;
          }
          return cloneVNode(node, extraTitleProps);
        }
        return node;
      };

      const patchContentInOrigin = (originVNode: VueNode): VueNode => {
        const needsCloserPatch =
          Boolean(
            closableObj && (closeDisabled || Object.keys(closableAriaOrDataProps).length > 0),
          ) || Boolean(semCls.close || semStyles.close);
        const needsTitlePatch = Boolean(semCls.title || semStyles.title);

        if (
          (!needsCloserPatch && !needsTitlePatch) ||
          !isVNode(originVNode) ||
          !Array.isArray(originVNode.children)
        ) {
          return originVNode;
        }

        const nextChildren = originVNode.children.map(child => {
          if (!isVNode(child)) return child;
          if (
            needsCloserPatch &&
            child.type === 'button' &&
            hasVNodeClass(child.props?.class, `${prefixCls.value}-close`)
          ) {
            const extraCloserProps: Record<string, any> = {
              ...closableAriaOrDataProps,
              ...(closeDisabled ? { disabled: true } : {}),
            };
            if (semCls.close) {
              extraCloserProps.class = semCls.close;
            }
            if (semStyles.close) {
              extraCloserProps.style = semStyles.close;
            }
            const clonedCloser = cloneVNode(child, extraCloserProps);
            if (closeDisabled && clonedCloser.props) {
              clonedCloser.props = { ...clonedCloser.props, onClick: undefined };
            }
            return clonedCloser;
          }
          if (
            needsTitlePatch &&
            child.type === 'div' &&
            hasVNodeClass(child.props?.class, `${prefixCls.value}-header`)
          ) {
            const clonedHeader = cloneVNode(child);
            if (Array.isArray(child.children)) {
              clonedHeader.children = child.children.map(patchTitleNode);
            } else if (isVNode(child.children)) {
              clonedHeader.children = patchTitleNode(child.children);
            }
            return clonedHeader;
          }
          return child;
        });
        const clonedOrigin = cloneVNode(originVNode);
        clonedOrigin.children = nextChildren;
        return clonedOrigin;
      };

      const mergedModalRender = ({ originVNode }: { originVNode: VueNode }) => {
        const patchedOrigin = patchContentInOrigin(originVNode);
        const node = modalRender
          ? modalRender({ originVNode: patchedOrigin })
          : slots.modalRender
          ? slots.modalRender({ originVNode: patchedOrigin })
          : patchedOrigin;
        if (isVNode(node)) {
          return cloneVNode(node, { ref: setContentRef });
        }
        return node;
      };

      return wrapSSR(
        <Dialog
          {...restProps}
          {...attrs}
          width={numWidth}
          footer={dialogFooterProp}
          closable={mergedClosableBool}
          mask={mergedMask}
          maskClosable={mergedMaskClosable}
          style={mergedStyle}
          rootClassName={classNames(rootClassName, hashId.value, semCls.root)}
          class={classNames(hashId.value, modalConfig.value.className, attrs.class)}
          getContainer={getContainer === undefined ? getPopupContainer?.value : getContainer}
          prefixCls={prefixCls.value}
          wrapClassName={classNames(wrapClassNameExtended, semCls.wrapper)}
          wrapStyle={semStyles.wrapper}
          maskClassName={mergedMaskClassName}
          maskStyle={mergedMaskStyle}
          headerClassName={semCls.header}
          headerStyle={semStyles.header}
          bodyClassName={semCls.body}
          bodyStyle={mergedBodyStyle}
          footerClassName={semCls.footer}
          footerStyle={semStyles.footer}
          dialogClass={mergedContainerClass}
          dialogStyle={mergedContainerStyle}
          modalRender={mergedModalRender}
          visible={open ?? visible}
          onClose={handleCancel}
          afterClose={() => {
            props.afterClose?.();
            closableObj?.afterClose?.();
            props.afterOpenChange?.(false);
          }}
          focusTriggerAfterClose={mergedFocusTriggerAfterClose.value}
          destroyOnClose={destroyOnHidden ?? props.destroyOnClose}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom', props.transitionName)}
          maskTransitionName={getTransitionName(
            rootPrefixCls.value,
            'fade',
            props.maskTransitionName,
          )}
          mousePosition={restProps.mousePosition ?? mousePosition}
          v-slots={{
            ...slots,
            default: loading
              ? () => (
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 4 }}
                    class={`${prefixCls.value}-body-skeleton`}
                  />
                )
              : slots.default,
            footer: dialogFooterSlot,
            closeIcon: () => renderCloseIcon(prefixCls.value, rawCloseIcon),
          }}
        ></Dialog>,
      );
    };
  },
});
