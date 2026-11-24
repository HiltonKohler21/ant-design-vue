import type { CSSProperties, ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import ActionButton from '../_util/ActionButton';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { anyType, objectType, someType, stringType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';
import Button from '../button';
import type { ButtonProps, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import defaultLocale from '../locale/en_US';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import usePopoverStyle from '../popover/style';
import type { TooltipPlacement } from '../tooltip/abstractTooltipProps';
import usePopconfirmStyle from './style';
import type {
  PopconfirmClassNamesType,
  PopconfirmSemanticClassNames,
  PopconfirmSemanticStyles,
  PopconfirmStylesType,
} from './index';

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

const resolveRenderProp = (val: any) => (typeof val === 'function' ? val() : val);

export const overlayProps = () => ({
  prefixCls: String,
  title: anyType(),
  description: anyType(),
  okType: stringType<LegacyButtonType>('primary'),
  okText: anyType(),
  cancelText: anyType(),
  icon: anyType(),
  okButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  cancelButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  showCancel: { type: Boolean, default: true },
  close: Function as PropType<(...args: any[]) => void>,
  onConfirm: Function as PropType<(e: MouseEvent) => any>,
  onCancel: Function as PropType<(e: MouseEvent) => void>,
  onPopupClick: Function as PropType<(e: MouseEvent) => void>,
  classNames: objectType<PopconfirmSemanticClassNames>(),
  styles: objectType<PopconfirmSemanticStyles>(),
});

export type OverlayProps = Partial<ExtractPropTypes<ReturnType<typeof overlayProps>>>;

export const Overlay = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopconfirmOverlay',
  inheritAttrs: false,
  props: overlayProps(),
  slots: Object as CustomSlotsType<{
    title?: any;
    description?: any;
    okText?: any;
    icon?: any;
    cancel?: any;
    cancelText?: any;
    cancelButton?: any;
    okButton?: any;
  }>,
  setup(props, { slots }) {
    const { getPrefixCls } = useConfigInject('popconfirm', props);
    const prefixClsConfirm = computed(() => props.prefixCls || getPrefixCls('popconfirm'));
    const btnPrefixCls = computed(() => getPrefixCls('btn'));
    const [popconfirmLocale] = useLocaleReceiver('Popconfirm', defaultLocale.Popconfirm);

    return () => {
      const {
        okButtonProps,
        cancelButtonProps,
        okType = 'primary',
        showCancel = true,
        close,
        onConfirm,
        onCancel,
        onPopupClick,
        classNames: overlayClassNames = {},
        styles: overlayStyles = {},
      } = props;

      const titleNode =
        props.title !== undefined ? resolveRenderProp(props.title) : slots.title?.();
      const descriptionNode =
        props.description !== undefined
          ? resolveRenderProp(props.description)
          : slots.description?.();
      const cancelTextNode =
        props.cancelText !== undefined
          ? props.cancelText
          : slots.cancelText?.() ?? slots.cancel?.();
      const okTextNode = props.okText !== undefined ? props.okText : slots.okText?.();
      const hasIconSlot = typeof slots.icon === 'function';
      const iconNode =
        props.icon !== undefined ? (
          props.icon
        ) : hasIconSlot ? (
          slots.icon!()
        ) : (
          <ExclamationCircleFilled />
        );

      const onInternalCancel = (e: MouseEvent) => {
        onCancel?.(e);
        if (typeof cancelButtonProps?.onClick === 'function') {
          cancelButtonProps.onClick(e);
        }
      };

      const { cancelButton, okButton } = slots;
      const cancelProps: ButtonProps = {
        size: 'small',
        ...cancelButtonProps,
        onClick: onInternalCancel,
      };
      const okProps: ButtonProps = {
        onClick: onConfirm,
        ...convertLegacyProps(okType),
        size: 'small',
        ...okButtonProps,
      };

      return (
        <div class={`${prefixClsConfirm.value}-inner-content`} onClick={onPopupClick}>
          <div
            class={[
              `${prefixClsConfirm.value}-message`,
              { [`${prefixClsConfirm.value}-message-no-icon`]: !iconNode },
            ]}
          >
            {iconNode && (
              <span
                class={[`${prefixClsConfirm.value}-message-icon`, overlayClassNames.icon]}
                style={overlayStyles.icon}
              >
                {iconNode}
              </span>
            )}
            <div
              class={[
                `${prefixClsConfirm.value}-message-title`,
                { [`${prefixClsConfirm.value}-message-title-only`]: !!descriptionNode },
                overlayClassNames.title,
              ]}
              style={overlayStyles.title}
            >
              {titleNode}
            </div>
          </div>
          {descriptionNode && (
            <div
              class={[`${prefixClsConfirm.value}-description`, overlayClassNames.content]}
              style={overlayStyles.content}
            >
              {descriptionNode}
            </div>
          )}
          <div class={`${prefixClsConfirm.value}-buttons`}>
            {showCancel ? (
              cancelButton ? (
                cancelButton(cancelProps)
              ) : (
                <Button {...cancelProps}>
                  {cancelTextNode || popconfirmLocale.value.cancelText}
                </Button>
              )
            ) : null}
            {okButton ? (
              okButton(okProps)
            ) : (
              <ActionButton
                buttonProps={{ size: 'small', ...convertLegacyProps(okType), ...okButtonProps }}
                actionFn={onConfirm}
                close={close}
                prefixCls={btnPrefixCls.value}
                quitOnNullishReturnValue
                emitEvent
              >
                {okTextNode || popconfirmLocale.value.okText}
              </ActionButton>
            )}
          </div>
        </div>
      );
    };
  },
});

export const purePanelProps = () => ({
  ...omit(overlayProps(), ['classNames', 'styles']),
  placement: stringType<TooltipPlacement>('top'),
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter?: boolean }>,
    default: true as boolean | { pointAtCenter?: boolean },
  },
  className: String,
  rootClassName: String,
  overlayClassName: String,
  overlayStyle: objectType<CSSProperties>(),
  overlayInnerStyle: objectType<CSSProperties>(),
  classNames: someType<PopconfirmClassNamesType>([Object, Function]),
  styles: someType<PopconfirmStylesType>([Object, Function]),
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopconfirmPurePanel',
  inheritAttrs: false,
  props: purePanelProps(),
  slots: Object as CustomSlotsType<{
    title?: any;
    description?: any;
    okText?: any;
    icon?: any;
    cancel?: any;
    cancelText?: any;
    cancelButton?: any;
    okButton?: any;
  }>,
  setup(props, { slots, attrs }) {
    const {
      prefixCls: popconfirmPrefixCls,
      getPrefixCls,
      direction,
    } = useConfigInject('popconfirm', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('popconfirm');
    const popoverPrefixCls = computed(() => getPrefixCls('popover'));
    const [wrapPopoverSSR, popoverHashId] = usePopoverStyle(popoverPrefixCls);
    const [wrapPopconfirmSSR, popconfirmHashId] = usePopconfirmStyle(popconfirmPrefixCls);

    const resolvedSemantics = computed(() => {
      const semanticInfo = {
        props: {
          ...props,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<PopconfirmSemanticClassNames>(
        resolveSemanticValue(contextClassNames.value, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<PopconfirmSemanticStyles>(
        resolveSemanticValue(contextStyles.value, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );
      return {
        mergedClassNames,
        mergedStyles,
      };
    });

    return () => {
      const mergedPlacement = props.placement || 'top';
      const showArrow = props.arrow !== false;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;

      const rootClassName = classNames(
        popoverHashId.value,
        popconfirmHashId.value !== popoverHashId.value ? popconfirmHashId.value : undefined,
        popoverPrefixCls.value,
        `${popoverPrefixCls.value}-pure`,
        `${popoverPrefixCls.value}-placement-${mergedPlacement}`,
        {
          [`${popoverPrefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${popoverPrefixCls.value}-arrow-hidden`]: !showArrow,
        },
        popconfirmPrefixCls.value,
        contextClassName.value,
        props.overlayClassName,
        props.rootClassName,
        props.className,
        mergedClassNames.root,
        attrs.class,
      );

      const rootStyle = [
        contextStyle.value,
        props.overlayStyle,
        mergedStyles.root,
        attrs.style as CSSProperties,
      ];

      const containerClassName = classNames(
        `${popoverPrefixCls.value}-inner`,
        mergedClassNames.body,
        mergedClassNames.container,
      );

      const containerStyle: CSSProperties | undefined =
        props.overlayInnerStyle || mergedStyles.body || mergedStyles.container
          ? {
              ...props.overlayInnerStyle,
              ...mergedStyles.body,
              ...mergedStyles.container,
            }
          : undefined;

      const overlaySlots: Record<string, any> = {};
      if (slots.title) overlaySlots.title = slots.title;
      if (slots.description) overlaySlots.description = slots.description;
      if (slots.icon) overlaySlots.icon = slots.icon;
      if (slots.okText) overlaySlots.okText = slots.okText;
      if (slots.cancelText) overlaySlots.cancelText = slots.cancelText;
      if (slots.cancel) overlaySlots.cancel = slots.cancel;
      if (slots.okButton) overlaySlots.okButton = slots.okButton;
      if (slots.cancelButton) overlaySlots.cancelButton = slots.cancelButton;

      return wrapPopoverSSR(
        wrapPopconfirmSSR(
          <div {...omit(attrs, ['class', 'style'])} class={rootClassName} style={rootStyle}>
            <div class={`${popoverPrefixCls.value}-content`}>
              {showArrow && (
                <div
                  class={classNames(`${popoverPrefixCls.value}-arrow`, mergedClassNames.arrow)}
                  style={mergedStyles.arrow}
                >
                  <span class={`${popoverPrefixCls.value}-arrow-content`} />
                </div>
              )}
              <div class={containerClassName} style={containerStyle} role="tooltip">
                <div class={`${popoverPrefixCls.value}-inner-content`}>
                  <Overlay
                    prefixCls={popconfirmPrefixCls.value}
                    title={props.title}
                    description={props.description}
                    icon={props.icon}
                    okType={props.okType}
                    okText={props.okText}
                    cancelText={props.cancelText}
                    okButtonProps={props.okButtonProps}
                    cancelButtonProps={props.cancelButtonProps}
                    showCancel={props.showCancel}
                    close={props.close}
                    onConfirm={props.onConfirm}
                    onCancel={props.onCancel}
                    onPopupClick={props.onPopupClick}
                    classNames={mergedClassNames}
                    styles={mergedStyles}
                    v-slots={overlaySlots}
                  />
                </div>
              </div>
            </div>
          </div>,
        ),
      );
    };
  },
});

export default PurePanel;
