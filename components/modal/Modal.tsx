import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import { cloneVNode, computed, defineComponent, isVNode, nextTick, watch } from 'vue';
import classNames from '../_util/classNames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Button from '../button';
import Skeleton from '../skeleton';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { Direction } from '../config-provider';
import type { VueNode } from '../_util/type';
import { objectType } from '../_util/type';
import type { DialogSemanticClassNames, DialogSemanticStyles } from '../_util/semantic';
import { canUseDocElement } from '../_util/styleChecker';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
import { usePanelRef } from '../watermark/context';
import useStyle from './style';

type MousePosition = { x: number; y: number } | null;

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

export interface ModalClosableType {
  closeIcon?: VueNode;
  disabled?: boolean;
  afterClose?: () => void;
  onClose?: () => void;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type ClosableType = boolean | ModalClosableType;

export interface MaskConfig {
  enabled?: boolean;
  blur?: boolean;
  closable?: boolean;
}

export type MaskType = boolean | MaskConfig;

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
  width: [String, Number],
  footer: PropTypes.any,
  okText: PropTypes.any,
  okType: String as PropType<LegacyButtonType>,
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  maskClosable: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  okButtonProps: objectType<ButtonPropsType>(),
  cancelButtonProps: objectType<ButtonPropsType>(),
  /** 语义化 classNames（antd 5.25+）：mask / wrapper / content / header / body / footer */
  classNames: objectType<DialogSemanticClassNames>(),
  /** 语义化 styles（antd 5.25+）：mask / wrapper / content / header / body / footer */
  styles: objectType<DialogSemanticStyles>(),
  destroyOnClose: { type: Boolean, default: undefined },
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyOnHidden: { type: Boolean, default: undefined },
  rootClassName: String,
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
  modalRender: Function as PropType<(arg: { originVNode: VueNode }) => VueNode>,
  mousePosition: objectType<MousePosition>(),
});

export type ModalProps = Partial<ExtractPropTypes<ReturnType<typeof modalProps>>>;

export interface ModalFuncProps {
  prefixCls?: string;
  class?: string;
  open?: boolean;
  loading?: boolean;
  title?: string | (() => VueNode) | VueNode;
  footer?: string | (() => VueNode) | VueNode;
  closable?: ClosableType;
  content?: string | (() => VueNode) | VueNode;
  // TODO: find out exact types
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  afterClose?: () => void;
  okButtonProps?: ButtonPropsType;
  cancelButtonProps?: ButtonPropsType;
  centered?: boolean;
  width?: string | number;
  okText?: string | (() => VueNode) | VueNode;
  okType?: LegacyButtonType;
  cancelText?: string | (() => VueNode) | VueNode;
  icon?: (() => VueNode) | VueNode;
  wrapClassName?: String;
  /* Deprecated */
  iconType?: string;
  mask?: MaskType;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: CSSProperties | string;
  maskStyle?: CSSProperties;
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
  keyboard?: boolean;
  getContainer?: string | HTMLElement | getContainerFunc | false | null;
  autoFocusButton?: null | 'ok' | 'cancel';
  transitionName?: string;
  maskTransitionName?: string;
  direction?: Direction;
  bodyStyle?: CSSProperties;
  closeIcon?: string | (() => VueNode) | VueNode;
  modalRender?: (arg: { originVNode: VueNode }) => VueNode;
  focusTriggerAfterClose?: boolean;

  /** @deprecated please use `appContext` instead */
  parentContext?: any;
  appContext?: any;

  /** @deprecated please use `open` instead */
  visible?: boolean;
}

type getContainerFunc = () => HTMLElement;

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
};

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}

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

    const handleCancel = (e: MouseEvent) => {
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

    const renderFooter = () => {
      const {
        okText = slots.okText?.(),
        okType,
        cancelText = slots.cancelText?.(),
        confirmLoading,
      } = props;
      return (
        <>
          <Button onClick={handleCancel} {...props.cancelButtonProps}>
            {cancelText || locale.value.cancelText}
          </Button>
          <Button
            {...convertLegacyProps(okType)}
            loading={confirmLoading}
            onClick={handleOk}
            {...props.okButtonProps}
          >
            {okText || locale.value.okText}
          </Button>
        </>
      );
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
        wrapClassName,
        centered,
        getContainer,
        closeIcon,
        focusTriggerAfterClose = true,
        destroyOnHidden,
        classNames: semanticClassNames,
        styles: semanticStyles,
        modalRender,
        ...restProps
      } = props;

      const rawClosable = closable !== undefined ? closable : modalConfig.value.closable;
      const closableObj =
        rawClosable && typeof rawClosable === 'object' ? (rawClosable as ModalClosableType) : null;
      const mergedClosableBool = rawClosable === undefined ? undefined : rawClosable !== false;
      const closeDisabled = Boolean(closableObj?.disabled);
      const closableAriaOrDataProps: Record<string, any> = {};
      if (closableObj) {
        Object.keys(closableObj).forEach(key => {
          if (key.startsWith('aria-') || key.startsWith('data-')) {
            closableAriaOrDataProps[key] = (closableObj as any)[key];
          }
        });
      }
      const mergedCloseIcon =
        closableObj?.closeIcon !== undefined
          ? closableObj.closeIcon
          : closeIcon ?? slots.closeIcon?.() ?? modalConfig.value.closeIcon;

      const ctxMask = modalConfig.value.mask;
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
        maskClosableFromMask !== undefined ? maskClosableFromMask : maskClosable;

      const ctxClassNames = modalConfig.value.classNames || {};
      const ctxStyles = modalConfig.value.styles || {};
      const mergedSemanticClassNames: DialogSemanticClassNames = {
        mask: classNames(ctxClassNames.mask, semanticClassNames?.mask, {
          [`${prefixCls.value}-mask-blur`]: maskBlur,
        }),
        wrapper: classNames(ctxClassNames.wrapper, semanticClassNames?.wrapper),
        content: classNames(ctxClassNames.content, semanticClassNames?.content),
        header: classNames(ctxClassNames.header, semanticClassNames?.header),
        body: classNames(ctxClassNames.body, semanticClassNames?.body),
        footer: classNames(ctxClassNames.footer, semanticClassNames?.footer),
      };
      const mergedSemanticStyles: DialogSemanticStyles = {
        mask: { ...ctxStyles.mask, ...semanticStyles?.mask },
        wrapper: { ...ctxStyles.wrapper, ...semanticStyles?.wrapper },
        content: { ...ctxStyles.content, ...semanticStyles?.content },
        header: { ...ctxStyles.header, ...semanticStyles?.header },
        body: { ...ctxStyles.body, ...semanticStyles?.body },
        footer: { ...ctxStyles.footer, ...semanticStyles?.footer },
      };

      const wrapClassNameExtended = classNames(wrapClassName, {
        [`${prefixCls.value}-centered`]: !!centered,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl',
      });
      const mergedStyle = modalConfig.value.style
        ? [modalConfig.value.style as CSSProperties, attrs.style as CSSProperties]
        : attrs.style;

      const patchCloserInOrigin = (originVNode: VueNode): VueNode => {
        if (
          !closableObj ||
          (!closeDisabled && Object.keys(closableAriaOrDataProps).length === 0) ||
          !isVNode(originVNode) ||
          !Array.isArray(originVNode.children)
        ) {
          return originVNode;
        }
        const nextChildren = originVNode.children.map(child => {
          if (
            isVNode(child) &&
            child.type === 'button' &&
            child.props?.class === `${prefixCls.value}-close`
          ) {
            const clonedCloser = cloneVNode(child, {
              ...closableAriaOrDataProps,
              ...(closeDisabled ? { disabled: true } : {}),
            });
            if (closeDisabled && clonedCloser.props) {
              clonedCloser.props = { ...clonedCloser.props, onClick: undefined };
            }
            return clonedCloser;
          }
          return child;
        });
        const clonedOrigin = cloneVNode(originVNode);
        clonedOrigin.children = nextChildren;
        return clonedOrigin;
      };

      const mergedModalRender = ({ originVNode }: { originVNode: VueNode }) => {
        const patchedOrigin = patchCloserInOrigin(originVNode);
        const node = modalRender
          ? modalRender({ originVNode: patchedOrigin })
          : slots.modalRender
          ? slots.modalRender({ originVNode: patchedOrigin })
          : patchedOrigin;
        if (isVNode(node)) {
          return cloneVNode(node, { ref: panelRef });
        }
        return node;
      };

      return wrapSSR(
        <Dialog
          {...restProps}
          {...attrs}
          footer={loading ? null : restProps.footer}
          closable={mergedClosableBool}
          mask={mergedMask}
          maskClosable={mergedMaskClosable}
          style={mergedStyle}
          rootClassName={classNames(rootClassName, hashId.value)}
          class={classNames(hashId.value, modalConfig.value.className, attrs.class)}
          getContainer={getContainer || getPopupContainer?.value}
          prefixCls={prefixCls.value}
          wrapClassName={classNames(wrapClassNameExtended, mergedSemanticClassNames.wrapper)}
          wrapStyle={mergedSemanticStyles.wrapper}
          maskClassName={mergedSemanticClassNames.mask}
          maskStyle={{ ...mergedSemanticStyles.mask, ...props.maskStyle }}
          headerClassName={mergedSemanticClassNames.header}
          headerStyle={mergedSemanticStyles.header}
          bodyClassName={mergedSemanticClassNames.body}
          bodyStyle={{ ...mergedSemanticStyles.body, ...props.bodyStyle }}
          footerClassName={mergedSemanticClassNames.footer}
          footerStyle={mergedSemanticStyles.footer}
          dialogClass={mergedSemanticClassNames.content}
          dialogStyle={mergedSemanticStyles.content}
          modalRender={mergedModalRender}
          visible={open ?? visible}
          onClose={handleCancel}
          afterClose={() => {
            props.afterClose?.();
            closableObj?.afterClose?.();
            props.afterOpenChange?.(false);
          }}
          focusTriggerAfterClose={focusTriggerAfterClose}
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
            footer: loading ? undefined : slots.footer || renderFooter,
            closeIcon: () => {
              return (
                <span class={`${prefixCls.value}-close-x`}>
                  {mergedCloseIcon || <CloseOutlined class={`${prefixCls.value}-close-icon`} />}
                </span>
              );
            },
          }}
        ></Dialog>,
      );
    };
  },
});
