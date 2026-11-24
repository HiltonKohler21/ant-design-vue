import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { objectType } from '../_util/type';
import type { VueNode } from '../_util/type';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import { ConfirmContent } from './ConfirmDialog';
import type {
  ClosableType,
  ModalClassNamesType,
  ModalClosableType,
  ModalFooterRender,
  ModalFuncProps,
  ModalSemanticClassNames,
  ModalSemanticStyles,
  ModalStylesType,
} from './interface';
import { createNormalFooter, renderCloseIcon } from './shared';
import useStyle from './style';

export const purePanelProps = () => ({
  prefixCls: String,
  rootClassName: String,
  type: String as PropType<ModalFuncProps['type']>,
  title: PropTypes.any,
  footer: PropTypes.any,
  closable: {
    type: [Boolean, Object] as PropType<ClosableType>,
    default: undefined,
  },
  closeIcon: PropTypes.any,
  icon: PropTypes.any,
  okText: PropTypes.any,
  okType: String as PropType<LegacyButtonType>,
  cancelText: PropTypes.any,
  confirmLoading: { type: Boolean, default: undefined },
  okCancel: { type: Boolean, default: undefined },
  okButtonProps: objectType<ButtonPropsType>(),
  cancelButtonProps: objectType<ButtonPropsType>(),
  onOk: Function as PropType<(...args: any[]) => any>,
  onCancel: Function as PropType<(...args: any[]) => any>,
  bodyStyle: objectType<CSSProperties>(),
  width: [String, Number] as PropType<string | number>,
  height: [String, Number] as PropType<string | number>,
  classNames: [Object, Function] as PropType<ModalClassNamesType>,
  styles: [Object, Function] as PropType<ModalStylesType>,
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

/** @private Internal Component. Do not use in your production. */
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AModalPurePanel',
  inheritAttrs: false,
  props: purePanelProps(),
  setup(props, { slots, attrs }) {
    const [locale] = useLocaleReceiver('Modal');
    const { prefixCls, rootPrefixCls, configProvider } = useConfigInject('modal', props);
    const modalConfig = computed(() => (configProvider.modal?.value as any) || {});
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedProps = computed<PurePanelProps>(() => ({
      ...props,
      footer: props.footer !== undefined ? props.footer : slots.footer,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ModalSemanticClassNames,
      ModalSemanticStyles,
      PurePanelProps
    >(
      computed(() => [modalConfig.value.classNames, props.classNames]),
      computed(() => [modalConfig.value.styles, props.styles]),
      computed(() => ({ props: mergedProps.value })),
    );

    return () => {
      const {
        type,
        title,
        footer,
        closable,
        closeIcon,
        okText,
        okType,
        cancelText,
        confirmLoading,
        okButtonProps,
        cancelButtonProps,
        onOk,
        onCancel,
        bodyStyle,
        rootClassName,
        width,
        height,
      } = props;

      const semCls = mergedClassNames.value;
      const semStyles = mergedStyles.value;
      const confirmPrefixCls = `${prefixCls.value}-confirm`;

      const defaultClosable = type ? false : true;
      const rawClosable = closable !== undefined ? closable : defaultClosable;
      const closableObj =
        rawClosable && typeof rawClosable === 'object' ? (rawClosable as ModalClosableType) : null;
      const mergedClosableBool = rawClosable !== false;
      const mergedCloseIcon =
        closableObj?.closeIcon !== undefined
          ? closableObj.closeIcon
          : closeIcon ?? slots.closeIcon?.() ?? modalConfig.value.closeIcon;

      const resolvedTitle = title !== undefined ? title : slots.title?.();

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
          onOk,
          onCancel,
        });

      let footerContent: VueNode = null;
      if (!type && footer !== null && footer !== false && footer !== '') {
        if (typeof footer === 'function') {
          const { originNode, extra } = buildNormalFooter();
          const rendered = (footer as ModalFooterRender)(originNode, extra);
          footerContent = rendered === null || rendered === false ? null : rendered;
        } else if (footer !== undefined) {
          footerContent = footer;
        } else if (slots.footer) {
          const { originNode, extra } = buildNormalFooter();
          footerContent = slots.footer({ originNode, ...extra });
        } else {
          footerContent = buildNormalFooter().originNode;
        }
      }

      const sizeStyle: CSSProperties = {};
      if (width !== undefined) {
        sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
      }
      if (height !== undefined) {
        sizeStyle.height = typeof height === 'number' ? `${height}px` : height;
      }

      const mergedContainerClass = classNames(semCls.content, semCls.container) || undefined;
      const mergedContainerStyle =
        semStyles.content || semStyles.container
          ? { ...semStyles.content, ...semStyles.container }
          : undefined;

      const mergedBodyStyle =
        bodyStyle || semStyles.body ? { ...bodyStyle, ...semStyles.body } : undefined;

      return wrapSSR(
        <div
          {...attrs}
          class={classNames(
            prefixCls.value,
            hashId.value,
            `${prefixCls.value}-pure-panel`,
            type && confirmPrefixCls,
            type && `${confirmPrefixCls}-${type}`,
            modalConfig.value.className,
            rootClassName,
            semCls.root,
            attrs.class,
          )}
          style={[
            sizeStyle,
            modalConfig.value.style as CSSProperties,
            semStyles.root,
            attrs.style as CSSProperties,
          ]}
        >
          <div
            class={[`${prefixCls.value}-content`, mergedContainerClass]}
            style={mergedContainerStyle}
          >
            {mergedClosableBool && (
              <button
                type="button"
                aria-label={closableObj?.['aria-label'] || 'Close'}
                disabled={closableObj?.disabled || undefined}
                onClick={closableObj?.disabled ? undefined : onCancel}
                class={classNames(`${prefixCls.value}-close`, semCls.close)}
                style={semStyles.close}
              >
                {renderCloseIcon(prefixCls.value, mergedCloseIcon)}
              </button>
            )}
            {!type &&
              resolvedTitle !== undefined &&
              resolvedTitle !== null &&
              resolvedTitle !== '' && (
                <div class={[`${prefixCls.value}-header`, semCls.header]} style={semStyles.header}>
                  <div class={[`${prefixCls.value}-title`, semCls.title]} style={semStyles.title}>
                    {resolvedTitle}
                  </div>
                </div>
              )}
            <div class={[`${prefixCls.value}-body`, semCls.body]} style={mergedBodyStyle}>
              {type ? (
                <ConfirmContent
                  {...(props as any)}
                  prefixCls={prefixCls.value}
                  confirmPrefixCls={confirmPrefixCls}
                  rootPrefixCls={rootPrefixCls.value}
                  title={resolvedTitle}
                  content={slots.default?.()}
                />
              ) : (
                slots.default?.()
              )}
            </div>
            {footerContent !== null && footerContent !== undefined && footerContent !== false && (
              <div class={[`${prefixCls.value}-footer`, semCls.footer]} style={semStyles.footer}>
                {footerContent}
              </div>
            )}
          </div>
        </div>,
      );
    };
  },
});
