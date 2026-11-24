import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';
import useStyle from './style';
import { useComponentConfig } from '../config-provider/context';
import type {
  IconType,
  NotificationClassNamesType,
  NotificationClosable,
  NotificationSemanticClassNames,
  NotificationSemanticStyles,
  NotificationStylesType,
} from './interface';
import Notice from '../vc-notification/Notice';
import classNames from '../_util/classNames';
import type { NoticeClosable, NoticeProps } from '../vc-notification/Notice';
import type { VueNode } from '../_util/type';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { renderHelper } from '../_util/util';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';

export function getCloseIcon(
  prefixCls: string,
  closeIcon?: VueNode | (() => VueNode),
  closeClassName?: string,
  closeStyle?: CSSProperties,
) {
  if (closeIcon === null || closeIcon === false) {
    return null;
  }
  const iconNode =
    closeIcon !== undefined ? (
      renderHelper(closeIcon)
    ) : (
      <CloseOutlined class={`${prefixCls}-close-icon`} />
    );
  return (
    <span class={classNames(`${prefixCls}-close-x`, closeClassName)} style={closeStyle}>
      {iconNode}
    </span>
  );
}

export function resolveClosableConfig(
  prefixCls: string,
  rawClosable?: NotificationClosable,
  rawCloseIcon?: VueNode | (() => VueNode),
  closeClassName?: string,
  closeStyle?: CSSProperties,
): { closable: NoticeClosable; closeIcon?: VueNode } {
  if (rawClosable === false || rawClosable === null) {
    return { closable: false, closeIcon: undefined };
  }

  if (rawClosable && typeof rawClosable === 'object') {
    const effectiveIcon =
      rawClosable.closeIcon !== undefined ? rawClosable.closeIcon : rawCloseIcon;
    if (effectiveIcon === null || effectiveIcon === false) {
      return { closable: false, closeIcon: undefined };
    }
    const wrappedIcon = getCloseIcon(prefixCls, effectiveIcon, closeClassName, closeStyle);
    return {
      closable: {
        ...rawClosable,
        closeIcon: wrappedIcon,
      },
      closeIcon: wrappedIcon,
    };
  }

  if (rawCloseIcon === null || rawCloseIcon === false) {
    return { closable: false, closeIcon: undefined };
  }

  const wrappedIcon = getCloseIcon(prefixCls, rawCloseIcon, closeClassName, closeStyle);
  return {
    closable: true,
    closeIcon: wrappedIcon,
  };
}

export interface PureContentProps {
  prefixCls: string;
  icon?: VueNode | (() => VueNode);
  title?: VueNode | (() => VueNode);
  /** @deprecated Please use `title` instead */
  message?: VueNode | (() => VueNode);
  description?: VueNode | (() => VueNode);
  actions?: VueNode | (() => VueNode);
  /** @deprecated Please use `actions` instead */
  btn?: VueNode | (() => VueNode);
  type?: IconType;
  role?: 'alert' | 'status';
  classNames?: NotificationSemanticClassNames;
  styles?: NotificationSemanticStyles;
}

export const TypeIcon = {
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  loading: <LoadingOutlined />,
};

const typeToIcon = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};

export function PureContent({
  prefixCls,
  icon,
  type,
  title,
  message,
  description,
  actions,
  btn,
  role = 'alert',
  classNames: semanticClassNames,
  styles: semanticStyles,
}: PureContentProps) {
  let iconNode = null;
  if (icon !== undefined && icon !== null && icon !== false) {
    iconNode = (
      <span
        class={classNames(`${prefixCls}-icon`, semanticClassNames?.icon)}
        style={semanticStyles?.icon}
      >
        {renderHelper(icon)}
      </span>
    );
  } else if (type) {
    const Icon = typeToIcon[type];
    iconNode = (
      <Icon
        class={classNames(
          `${prefixCls}-icon`,
          `${prefixCls}-icon-${type}`,
          semanticClassNames?.icon,
        )}
        style={semanticStyles?.icon}
      />
    );
  }

  const mergedTitle = title ?? message;
  const mergedActions = actions ?? btn;
  const renderedTitle = renderHelper(mergedTitle);
  const renderedDescription = renderHelper(description);
  const renderedActions = renderHelper(mergedActions);

  const hasTitle = renderedTitle !== undefined && renderedTitle !== null && renderedTitle !== false;
  const hasDescription =
    renderedDescription !== undefined &&
    renderedDescription !== null &&
    renderedDescription !== false;
  const hasActions =
    renderedActions !== undefined && renderedActions !== null && renderedActions !== false;

  return (
    <div
      class={classNames(
        {
          [`${prefixCls}-with-icon`]: iconNode,
        },
        semanticClassNames?.wrapper,
      )}
      style={semanticStyles?.wrapper}
      role={role}
    >
      {iconNode}
      <div
        class={classNames(`${prefixCls}-section`, semanticClassNames?.section)}
        style={semanticStyles?.section}
      >
        {hasTitle && (
          <div
            class={classNames(
              `${prefixCls}-message`,
              `${prefixCls}-title`,
              semanticClassNames?.title,
            )}
            style={semanticStyles?.title}
          >
            {!hasDescription && iconNode ? (
              <span class={`${prefixCls}-message-single-line-auto-margin`} />
            ) : null}
            {renderedTitle}
          </div>
        )}
        {hasDescription && (
          <div
            class={classNames(`${prefixCls}-description`, semanticClassNames?.description)}
            style={semanticStyles?.description}
          >
            {renderedDescription}
          </div>
        )}
      </div>
      {hasActions && (
        <div
          class={classNames(
            `${prefixCls}-btn`,
            `${prefixCls}-actions`,
            semanticClassNames?.actions,
          )}
          style={semanticStyles?.actions}
        >
          {renderedActions}
        </div>
      )}
    </div>
  );
}

export interface PurePanelProps
  extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'duration' | 'closeIcon' | 'closable'>,
    Omit<PureContentProps, 'prefixCls' | 'classNames' | 'styles'> {
  prefixCls?: string;
  closable?: NotificationClosable;
  closeIcon?: VueNode | (() => VueNode);
  class?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: NotificationClassNamesType<PurePanelProps>;
  styles?: NotificationStylesType<PurePanelProps>;
}

/** @private Internal Component. Do not use in your production. */
export default defineComponent<PurePanelProps>({
  name: 'PurePanel',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'icon',
    'type',
    'title',
    'message',
    'description',
    'actions',
    'btn',
    'closable',
    'closeIcon',
    'role',
    'class',
    'className',
    'style',
    'classNames',
    'styles',
    'props',
    'onClick',
    'onClose',
  ] as any,
  setup(props, { attrs, slots }) {
    const {
      getPrefixCls,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
      componentConfig: contextNotification,
    } = useComponentConfig('notification');

    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    const noticePrefixCls = computed(() => `${prefixCls.value}-notice`);

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      NotificationSemanticClassNames,
      NotificationSemanticStyles,
      PurePanelProps
    >(
      () => [contextClassNames.value as any, props.classNames],
      () => [contextStyles.value as any, props.styles],
      () => ({ props }),
    );

    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const mergedCloseIconProp =
        props.closeIcon !== undefined
          ? props.closeIcon
          : slots.closeIcon
          ? () => slots.closeIcon?.()
          : contextNotification.value?.closeIcon;

      const { closable, closeIcon } = resolveClosableConfig(
        prefixCls.value,
        props.closable !== undefined ? props.closable : true,
        mergedCloseIconProp,
        mergedClassNames.value.close,
        mergedStyles.value.close,
      );

      const mergedTitle =
        props.title !== undefined
          ? props.title
          : props.message !== undefined
          ? props.message
          : slots.title?.();
      const mergedDescription =
        props.description !== undefined ? props.description : slots.description?.();
      const mergedActions =
        props.actions !== undefined
          ? props.actions
          : props.btn !== undefined
          ? props.btn
          : slots.actions?.();
      const mergedIcon = props.icon !== undefined ? props.icon : slots.icon?.();

      return wrapSSR(
        <Notice
          {...attrs}
          {...(props.props || {})}
          prefixCls={prefixCls.value}
          onClick={props.onClick}
          onClose={props.onClose}
          class={classNames(
            hashId.value,
            props.type && `${noticePrefixCls.value}-${props.type}`,
            `${noticePrefixCls.value}-pure-panel`,
            contextClassName.value,
            mergedClassNames.value.root,
            props.class,
            props.className,
            attrs.class,
          )}
          style={[
            contextStyle.value,
            mergedStyles.value.root,
            props.style,
            attrs.style as CSSProperties,
          ]}
          noticeKey="pure"
          duration={null}
          closable={closable}
          closeIcon={closeIcon}
        >
          <PureContent
            prefixCls={noticePrefixCls.value}
            icon={mergedIcon}
            type={props.type}
            title={mergedTitle}
            description={mergedDescription}
            actions={mergedActions}
            role={props.role}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
          />
        </Notice>,
      );
    };
  },
});
