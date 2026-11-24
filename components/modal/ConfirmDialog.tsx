import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import type { FunctionalComponent } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import ActionButton from '../_util/ActionButton';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import { useConfigContextInject } from '../config-provider/context';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
import type {
  ModalClosableType,
  ModalFooterRender,
  ModalFuncProps,
  ModalLocale,
} from './interface';
import Dialog from './Modal';

export interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  onConfirm?: (confirmed: boolean) => void;
  autoFocusButton?: null | 'ok' | 'cancel';
  rootPrefixCls: string;
  iconPrefixCls?: string;
  confirmPrefixCls?: string;

  /** @private Internal Usage. Do not override this */
  locale?: ModalLocale;
}

function renderSomeContent(someContent: any) {
  if (typeof someContent === 'function') {
    return someContent();
  }
  return someContent;
}

export const ConfirmContent = defineComponent<ConfirmDialogProps>({
  name: 'ConfirmContent',
  inheritAttrs: false,
  props: [
    'icon',
    'onCancel',
    'onOk',
    'onConfirm',
    'close',
    'closable',
    'okButtonProps',
    'cancelButtonProps',
    'okType',
    'prefixCls',
    'confirmPrefixCls',
    'okCancel',
    'okText',
    'cancelText',
    'autoFocusButton',
    'focusable',
    'type',
    'title',
    'content',
    'rootPrefixCls',
    'footer',
    'locale',
  ] as any,
  setup(props, { slots }) {
    const [contextLocale] = useLocaleReceiver('Modal');
    const configProvider = useConfigContextInject();
    const modalConfig = computed(() => (configProvider.modal?.value as any) || {});

    return () => {
      const {
        icon,
        onCancel,
        onOk,
        onConfirm,
        close,
        closable,
        okText,
        cancelText,
        okButtonProps,
        cancelButtonProps,
        okCancel,
        type,
        title,
        content,
        rootPrefixCls = 'ant',
        footer,
        locale: staticLocale,
        focusable,
      } = props;

      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = props.confirmPrefixCls || `${prefixCls}-confirm`;
      const okType = props.okType || 'primary';

      // Icon: support { icon: null } or { icon: false } to hide default icon
      let mergedIcon = icon;
      if (icon === undefined) {
        switch (type) {
          case 'info':
            mergedIcon = modalConfig.value.infoIcon ?? <InfoCircleFilled />;
            break;
          case 'success':
            mergedIcon = modalConfig.value.successIcon ?? <CheckCircleFilled />;
            break;
          case 'error':
            mergedIcon = modalConfig.value.errorIcon ?? <CloseCircleFilled />;
            break;
          default:
            mergedIcon = modalConfig.value.warningIcon ?? <ExclamationCircleFilled />;
        }
      }

      const mergedOkCancel = okCancel ?? type === 'confirm';
      const baseAutoFocus =
        focusable?.autoFocusButton !== undefined
          ? focusable.autoFocusButton
          : props.autoFocusButton;
      const autoFocusButton = baseAutoFocus === null ? false : baseAutoFocus || 'ok';

      const mergedLocale = staticLocale || contextLocale.value;
      const closableOnClose =
        closable && typeof closable === 'object'
          ? (closable as ModalClosableType).onClose
          : undefined;

      const mergedOkButtonProps =
        modalConfig.value.okButtonProps || okButtonProps
          ? { ...modalConfig.value.okButtonProps, ...okButtonProps }
          : undefined;
      const mergedCancelButtonProps =
        modalConfig.value.cancelButtonProps || cancelButtonProps
          ? { ...modalConfig.value.cancelButtonProps, ...cancelButtonProps }
          : undefined;

      const CancelBtn: FunctionalComponent = () =>
        mergedOkCancel ? (
          <ActionButton
            actionFn={onCancel}
            close={(...args: any[]) => {
              close?.(...args);
              onConfirm?.(false);
              closableOnClose?.();
            }}
            autofocus={autoFocusButton === 'cancel'}
            buttonProps={mergedCancelButtonProps}
            prefixCls={`${rootPrefixCls}-btn`}
          >
            {renderSomeContent(cancelText) || mergedLocale?.cancelText}
          </ActionButton>
        ) : null;
      CancelBtn.displayName = 'CancelBtn';

      const OkBtn: FunctionalComponent = () => (
        <ActionButton
          type={okType}
          actionFn={onOk}
          close={(...args: any[]) => {
            close?.(...args);
            onConfirm?.(true);
            closableOnClose?.();
          }}
          autofocus={autoFocusButton === 'ok'}
          buttonProps={mergedOkButtonProps}
          prefixCls={`${rootPrefixCls}-btn`}
        >
          {renderSomeContent(okText) ||
            (mergedOkCancel ? mergedLocale?.okText : mergedLocale?.justOkText)}
        </ActionButton>
      );
      OkBtn.displayName = 'OkBtn';

      const footerOriginNode = (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      );

      const resolvedContent =
        content !== undefined ? renderSomeContent(content) : slots.default?.();

      let footerNode: any;
      if (footer === undefined) {
        footerNode = <div class={`${contentPrefixCls}-btns`}>{footerOriginNode}</div>;
      } else if (typeof footer === 'function') {
        const rendered = (footer as ModalFooterRender)(footerOriginNode, { OkBtn, CancelBtn });
        footerNode =
          rendered === null || rendered === false ? null : (
            <div class={`${contentPrefixCls}-btns`}>{rendered}</div>
          );
      } else {
        footerNode = footer;
      }

      return (
        <div class={`${contentPrefixCls}-body-wrapper`}>
          <div class={`${contentPrefixCls}-body`}>
            {mergedIcon !== null && mergedIcon !== false ? renderSomeContent(mergedIcon) : null}
            {title === undefined ? null : (
              <span class={`${contentPrefixCls}-title`}>{renderSomeContent(title)}</span>
            )}
            <div class={`${contentPrefixCls}-content`}>{resolvedContent}</div>
          </div>
          {footerNode}
        </div>
      );
    };
  },
});

export default defineComponent<ConfirmDialogProps>({
  name: 'ConfirmDialog',
  inheritAttrs: false,
  props: [
    'icon',
    'onCancel',
    'onOk',
    'onConfirm',
    'close',
    'closable',
    'zIndex',
    'afterClose',
    'visible',
    'open',
    'keyboard',
    'centered',
    'getContainer',
    'maskStyle',
    'okButtonProps',
    'cancelButtonProps',
    'okType',
    'prefixCls',
    'okCancel',
    'width',
    'mask',
    'maskClosable',
    'okText',
    'cancelText',
    'autoFocusButton',
    'focusable',
    'transitionName',
    'maskTransitionName',
    'type',
    'title',
    'content',
    'direction',
    'rootPrefixCls',
    'bodyStyle',
    'closeIcon',
    'modalRender',
    'focusTriggerAfterClose',
    'wrapClassName',
    'rootClassName',
    'rootStyle',
    'confirmPrefixCls',
    'footer',
    'loading',
    'classNames',
    'styles',
    'locale',
  ] as any,
  setup(props, { attrs }) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        props.visible === undefined,
        'Modal',
        `\`visible\` is deprecated, please use \`open\` instead.`,
      );
    }
    return () => {
      const {
        close,
        onConfirm,
        closable = false,
        zIndex,
        afterClose,
        keyboard,
        centered,
        getContainer,
        maskStyle,
        width = 416,
        mask,
        maskClosable = false,
        open,
        direction,
        closeIcon,
        modalRender,
        focusTriggerAfterClose,
        focusable,
        rootPrefixCls,
        bodyStyle,
        wrapClassName,
        rootClassName,
        rootStyle,
        classNames: semanticClassNames,
        styles: semanticStyles,
      } = props;

      const prefixCls = props.prefixCls || 'ant-modal';
      const style = attrs.style || {};
      const confirmPrefixCls = `${prefixCls}-confirm`;

      const classString = classNames(
        confirmPrefixCls,
        `${confirmPrefixCls}-${props.type}`,
        { [`${confirmPrefixCls}-rtl`]: direction === 'rtl' },
        attrs.class,
      );

      return (
        <Dialog
          prefixCls={prefixCls}
          class={classString}
          rootClassName={rootClassName}
          rootStyle={rootStyle}
          wrapClassName={classNames(
            { [`${confirmPrefixCls}-centered`]: !!centered },
            wrapClassName,
          )}
          onCancel={e => {
            close?.({ triggerCancel: true }, e);
            onConfirm?.(false);
          }}
          open={open}
          title=""
          footer=""
          transitionName={getTransitionName(rootPrefixCls, 'zoom', props.transitionName)}
          maskTransitionName={getTransitionName(rootPrefixCls, 'fade', props.maskTransitionName)}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          style={style}
          bodyStyle={bodyStyle}
          width={width}
          zIndex={zIndex}
          afterClose={afterClose}
          keyboard={keyboard}
          centered={centered}
          getContainer={getContainer}
          closable={closable}
          closeIcon={closeIcon}
          loading={props.loading}
          modalRender={modalRender}
          focusTriggerAfterClose={focusTriggerAfterClose}
          focusable={focusable}
          classNames={semanticClassNames as any}
          styles={semanticStyles as any}
        >
          <ConfirmContent
            {...props}
            prefixCls={prefixCls}
            confirmPrefixCls={confirmPrefixCls}
            rootPrefixCls={rootPrefixCls}
          />
        </Dialog>
      );
    };
  },
});
