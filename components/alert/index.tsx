import type { App, CSSProperties, ExtractPropTypes, Plugin, PropType } from 'vue';
import { computed, defineComponent, shallowRef, Transition } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getTransitionProps } from '../_util/transition';
import { isValidElement } from '../_util/props-util';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import { cloneElement } from '../_util/vnode';
import pickAttrs from '../_util/pickAttrs';
import type { NodeMouseEventHandler } from '../vc-tree/contextTypes';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import ErrorBoundary from './ErrorBoundary';
import type { AlertErrorBoundaryProps } from './ErrorBoundary';
import useStyle from './style';

const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};

const iconMapOutlined = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
};

const AlertTypes = tuple('success', 'info', 'warning', 'error');
const AlertVariants = tuple('outlined', 'filled');

export type AlertType = (typeof AlertTypes)[number];
export type AlertVariant = (typeof AlertVariants)[number];

export type AlertSemanticName =
  | 'root'
  | 'icon'
  | 'section'
  | 'title'
  | 'description'
  | 'actions'
  | 'close';

export type AlertSemanticClassNames = Partial<Record<AlertSemanticName, string>>;
export type AlertSemanticStyles = Partial<Record<AlertSemanticName, CSSProperties>>;

export type AlertClassNamesType =
  | AlertSemanticClassNames
  | ((info: { props: AlertProps }) => AlertSemanticClassNames);

export type AlertStylesType =
  | AlertSemanticStyles
  | ((info: { props: AlertProps }) => AlertSemanticStyles);

export interface AlertClosableConfig {
  closeIcon?: VueNode;
  disabled?: boolean;
  afterClose?: () => void;
  onClose?: (e: MouseEvent) => void;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type AlertClosableType = boolean | AlertClosableConfig;

const isPlainObj = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const resolveSemantic = <T, P>(
  semantic: T | ((info: { props: P }) => T) | undefined,
  props: P,
): T | undefined => {
  if (typeof semantic === 'function') {
    return (semantic as (info: { props: P }) => T)({ props });
  }
  return semantic;
};

export const alertProps = () => ({
  rootClassName: String,
  /**
   * Type of Alert styles, options: `success`, `info`, `warning`, `error`
   */
  type: PropTypes.oneOf(AlertTypes),
  /**
   * Variant of Alert style, options: `outlined`, `filled`
   */
  variant: { type: String as PropType<AlertVariant>, default: undefined },
  /** Whether Alert can be closed, or closable configuration object */
  closable: { type: [Boolean, Object] as PropType<AlertClosableType>, default: undefined },
  /** @deprecated please use `closable.closeIcon` instead. Close text to show */
  closeText: PropTypes.any,
  /** Content of Alert (v6 primary) */
  title: PropTypes.any,
  /** @deprecated please use `title` instead. Content of Alert */
  message: PropTypes.any,
  /** Additional content of Alert */
  description: PropTypes.any,
  /** Trigger when animation ending of Alert */
  afterClose: Function as PropType<() => void>,
  /** Whether to show icon */
  showIcon: { type: Boolean, default: undefined },
  prefixCls: String,
  banner: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  closeIcon: PropTypes.any,
  action: PropTypes.any,
  onClose: Function as PropType<NodeMouseEventHandler>,
  classNames: [Object, Function] as PropType<AlertClassNamesType>,
  styles: [Object, Function] as PropType<AlertStylesType>,
  id: String,
});

export type AlertProps = Partial<ExtractPropTypes<ReturnType<typeof alertProps>>>;

const Alert = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAlert',
  inheritAttrs: false,
  props: alertProps(),
  setup(props, { slots, emit, attrs, expose }) {
    const { prefixCls, direction, configProvider } = useConfigInject('alert', props);
    const alertConfig = computed(() => configProvider.alert?.value as any);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const closing = shallowRef(false);
    const closed = shallowRef(false);
    const alertNode = shallowRef();

    const getClosableObj = () => (isPlainObj(props.closable) ? props.closable : undefined);
    const getCtxClosableObj = () =>
      isPlainObj(alertConfig.value?.closable) ? alertConfig.value.closable : undefined;

    const handleClose = (e: MouseEvent) => {
      const closableObj = getClosableObj();
      const ctxClosableObj = getCtxClosableObj();
      if (closableObj?.disabled ?? ctxClosableObj?.disabled) {
        return;
      }
      e.preventDefault();

      const dom = alertNode.value;
      if (dom) {
        dom.style.height = `${dom.offsetHeight}px`;
        // Magic code
        // 重复一次后才能正确设置 height
        dom.style.height = `${dom.offsetHeight}px`;
      }

      closing.value = true;
      if (closableObj?.onClose) {
        closableObj.onClose(e);
      } else {
        emit('close', e);
      }
    };

    const animationEnd = () => {
      closing.value = false;
      closed.value = true;
      const closableObj = getClosableObj();
      const ctxClosableObj = getCtxClosableObj();
      (closableObj?.afterClose ?? ctxClosableObj?.afterClose ?? props.afterClose)?.();
    };

    const mergedType = computed(() => {
      const { type } = props;
      if (type !== undefined) {
        return type;
      }
      // banner 模式默认为警告
      return props.banner ? 'warning' : 'info';
    });

    expose({ animationEnd });
    const motionStyle = shallowRef<CSSProperties>({});

    return () => {
      const { banner } = props;
      const ctxAlert = alertConfig.value;
      const ctxClosable = ctxAlert?.closable;
      const closableObj = getClosableObj();
      const ctxClosableObj = getCtxClosableObj();

      const closeText = props.closeText ?? slots.closeText?.();
      const description = props.description ?? slots.description?.();
      const title = props.title ?? slots.title?.() ?? props.message ?? slots.message?.();
      const hasTitle = title !== undefined && title !== null && title !== false && title !== '';
      const hasDescription =
        description !== undefined &&
        description !== null &&
        description !== false &&
        description !== '';
      const icon = props.icon ?? slots.icon?.() ?? ctxAlert?.[`${mergedType.value}Icon`];
      const action = props.action ?? slots.action?.();

      const slotCloseIcon = slots.closeIcon?.();
      const customCloseIcon =
        closableObj?.closeIcon ??
        props.closeIcon ??
        slotCloseIcon ??
        ctxClosableObj?.closeIcon ??
        ctxAlert?.closeIcon;

      const isClosable = (() => {
        if (closableObj) {
          return true;
        }
        if (closeText) {
          return true;
        }
        if (typeof props.closable === 'boolean') {
          return props.closable;
        }
        if (
          (props.closeIcon !== false &&
            props.closeIcon !== undefined &&
            props.closeIcon !== null) ||
          slotCloseIcon !== undefined
        ) {
          return true;
        }
        return !!ctxClosable;
      })();

      const closeBtnDisabled = closableObj?.disabled ?? ctxClosableObj?.disabled;
      const mergedAriaProps = pickAttrs(closableObj ?? ctxClosableObj ?? {}, {
        aria: true,
        data: true,
      });

      // banner模式默认有 Icon
      const isShowIcon = banner && props.showIcon === undefined ? true : props.showIcon;

      const mergedVariant: AlertVariant = props.variant ?? ctxAlert?.variant ?? 'outlined';
      const prefixClsValue = prefixCls.value;

      const mergedPropsForSemantic: AlertProps = {
        ...props,
        prefixCls: prefixClsValue,
        type: mergedType.value,
        variant: mergedVariant,
        showIcon: isShowIcon,
        closable: isClosable,
      };

      const mergedClassNames = mergeSemanticClassNames<AlertSemanticClassNames>(
        resolveSemantic(ctxAlert?.classNames, mergedPropsForSemantic),
        resolveSemantic(props.classNames, mergedPropsForSemantic),
      );
      const mergedStyles = mergeSemanticStyles<AlertSemanticStyles>(
        resolveSemantic(ctxAlert?.styles, mergedPropsForSemantic),
        resolveSemantic(props.styles, mergedPropsForSemantic),
      );

      const IconType = (hasDescription ? iconMapOutlined : iconMapFilled)[mergedType.value] || null;

      const alertCls = classNames(prefixClsValue, {
        [`${prefixClsValue}-${mergedType.value}`]: true,
        [`${prefixClsValue}-${mergedVariant}`]: true,
        [`${prefixClsValue}-closing`]: closing.value,
        [`${prefixClsValue}-with-description`]: hasDescription,
        [`${prefixClsValue}-no-icon`]: !isShowIcon,
        [`${prefixClsValue}-banner`]: !!banner,
        [`${prefixClsValue}-closable`]: isClosable,
        [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true,
      });

      const closeIconNode = isClosable ? (
        <button
          type="button"
          disabled={closeBtnDisabled}
          onClick={handleClose}
          class={classNames(`${prefixClsValue}-close-icon`, mergedClassNames.close)}
          style={mergedStyles.close}
          tabindex={0}
          {...mergedAriaProps}
        >
          {closeText ? (
            <span class={`${prefixClsValue}-close-text`}>{closeText}</span>
          ) : customCloseIcon === undefined || customCloseIcon === true ? (
            <CloseOutlined />
          ) : (
            customCloseIcon
          )}
        </button>
      ) : null;

      const iconCls = classNames(`${prefixClsValue}-icon`, mergedClassNames.icon);
      const iconNode = (icon &&
        (isValidElement(icon) ? (
          cloneElement(icon, {
            class: classNames(icon.props?.class, iconCls),
            style: mergedStyles.icon ? [icon.props?.style, mergedStyles.icon] : icon.props?.style,
          })
        ) : (
          <span class={iconCls} style={mergedStyles.icon}>
            {icon}
          </span>
        ))) || <IconType class={iconCls} style={mergedStyles.icon} />;

      const transitionProps = getTransitionProps(`${prefixClsValue}-motion`, {
        appear: false,
        css: true,
        onAfterLeave: animationEnd,
        onBeforeLeave: (node: HTMLDivElement) => {
          node.style.maxHeight = `${node.offsetHeight}px`;
        },
        onLeave: (node: HTMLDivElement) => {
          node.style.maxHeight = '0px';
        },
      });

      return wrapSSR(
        closed.value ? null : (
          <Transition {...transitionProps}>
            <div
              id={props.id}
              role="alert"
              {...attrs}
              style={[
                ctxAlert?.style,
                mergedStyles.root,
                attrs.style as CSSProperties,
                motionStyle.value,
              ]}
              v-show={!closing.value}
              class={[
                ctxAlert?.className,
                attrs.class,
                props.rootClassName,
                alertCls,
                mergedClassNames.root,
              ]}
              data-show={!closing.value}
              ref={alertNode}
            >
              {isShowIcon ? iconNode : null}
              <div
                class={classNames(
                  `${prefixClsValue}-content`,
                  `${prefixClsValue}-section`,
                  mergedClassNames.section,
                )}
                style={mergedStyles.section}
              >
                {hasTitle ? (
                  <div
                    class={classNames(
                      `${prefixClsValue}-message`,
                      `${prefixClsValue}-title`,
                      mergedClassNames.title,
                    )}
                    style={mergedStyles.title}
                  >
                    {title}
                  </div>
                ) : null}
                {hasDescription ? (
                  <div
                    class={classNames(
                      `${prefixClsValue}-description`,
                      mergedClassNames.description,
                    )}
                    style={mergedStyles.description}
                  >
                    {description}
                  </div>
                ) : null}
              </div>
              {action ? (
                <div
                  class={classNames(
                    `${prefixClsValue}-action`,
                    `${prefixClsValue}-actions`,
                    mergedClassNames.actions,
                  )}
                  style={mergedStyles.actions}
                >
                  {action}
                </div>
              ) : null}
              {closeIconNode}
            </div>
          </Transition>
        ),
      );
    };
  },
});

Alert.ErrorBoundary = ErrorBoundary;

Alert.install = function (app: App) {
  app.component(Alert.name, Alert);
  app.component(ErrorBoundary.name, ErrorBoundary);
  return app;
};

export { ErrorBoundary as AlertErrorBoundary };
export type { AlertErrorBoundaryProps };

export default Alert as typeof Alert &
  Plugin & {
    readonly ErrorBoundary: typeof ErrorBoundary;
  };
