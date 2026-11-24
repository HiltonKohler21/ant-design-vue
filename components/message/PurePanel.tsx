import Notice from '../vc-notification/Notice';
import type { NoticeProps } from '../vc-notification/Notice';
import useStyle from './style';
import type {
  ArgsProps,
  MessageClassNamesType,
  MessageSemanticClassNames,
  MessageSemanticStyles,
  MessageStylesType,
  NoticeType,
} from './interface';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import type { VueNode } from '../_util/type';
import classNames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import { useConfigContextInject, useComponentConfig } from '../config-provider/context';
import type { CSSProperties } from 'vue';
import { computed, defineComponent, isVNode } from 'vue';

export const TypeIcon = {
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  loading: <LoadingOutlined />,
};

export interface PureContentProps {
  prefixCls: string;
  type?: NoticeType;
  icon?: VueNode;
  classNames?: MessageSemanticClassNames;
  styles?: MessageSemanticStyles;
}

export const renderMessageIcon = (icon: any, iconClassName?: string, iconStyle?: CSSProperties) => {
  if (!icon) {
    return icon;
  }
  if (!iconClassName && !iconStyle) {
    return icon;
  }
  if (isVNode(icon)) {
    return cloneElement(icon, {
      class: classNames(icon.props?.class, iconClassName),
      style: iconStyle ? [icon.props?.style, iconStyle] : icon.props?.style,
    });
  }
  return (
    <span class={iconClassName} style={iconStyle}>
      {icon}
    </span>
  );
};

export const PureContent = defineComponent<PureContentProps>({
  name: 'PureContent',
  inheritAttrs: false,
  props: ['prefixCls', 'type', 'icon', 'classNames', 'styles'] as any,

  setup(props, { slots }) {
    return () => {
      const rawIcon =
        props.icon !== undefined ? props.icon : props.type ? TypeIcon[props.type] : '';
      const iconNode = renderMessageIcon(rawIcon, props.classNames?.icon, props.styles?.icon);
      const textClass = classNames(props.classNames?.content, props.classNames?.title) || undefined;
      const textStyle =
        props.styles?.content || props.styles?.title
          ? [props.styles?.content, props.styles?.title]
          : undefined;

      return (
        <div
          class={classNames(
            `${props.prefixCls}-custom-content`,
            props.type && `${props.prefixCls}-${props.type}`,
            props.classNames?.wrapper,
          )}
          style={props.styles?.wrapper}
        >
          {iconNode}
          <span class={textClass} style={textStyle}>
            {slots.default?.()}
          </span>
        </div>
      );
    };
  },
});

export interface PurePanelProps
  extends Omit<NoticeProps, 'prefixCls' | 'eventKey'>,
    Omit<PureContentProps, 'prefixCls' | 'classNames' | 'styles'> {
  prefixCls?: string;
  content?: VueNode | (() => VueNode);
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: MessageClassNamesType;
  styles?: MessageStylesType;
}

/** @private Internal Component. Do not use in your production. */

export default defineComponent<PurePanelProps>({
  name: 'PurePanel',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'class',
    'className',
    'style',
    'type',
    'icon',
    'content',
    'classNames',
    'styles',
  ] as any,
  setup(props, { slots, attrs }) {
    const { getPrefixCls } = useConfigContextInject();
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('message');
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('message'));
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        MessageSemanticClassNames,
        MessageSemanticStyles,
        ArgsProps
      >([contextClassNames.value, props.classNames], [contextStyles.value, props.styles], {
        props: props as unknown as ArgsProps,
      });

      const contentNode =
        props.content !== undefined
          ? typeof props.content === 'function'
            ? (props.content as () => VueNode)()
            : props.content
          : slots.default?.();

      const iconNode =
        typeof props.icon === 'function' ? (props.icon as () => VueNode)() : props.icon;

      return wrapSSR(
        <Notice
          {...attrs}
          prefixCls={prefixCls.value}
          class={classNames(
            hashId.value,
            `${prefixCls.value}-notice-pure-panel`,
            props.type && `${prefixCls.value}-notice-${props.type}`,
            contextClassName.value,
            mergedClassNames.root,
            (props as any).class,
            props.className,
            attrs.class as any,
          )}
          style={[contextStyle.value, mergedStyles.root, props.style, attrs.style as CSSProperties]}
          noticeKey="pure"
          duration={null}
        >
          <PureContent
            prefixCls={prefixCls.value}
            type={props.type}
            icon={iconNode}
            classNames={mergedClassNames}
            styles={mergedStyles}
          >
            {contentNode}
          </PureContent>
        </Notice>,
      );
    };
  },
});
