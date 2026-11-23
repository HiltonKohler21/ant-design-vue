import Notice from '../vc-notification/Notice';
import type { NoticeProps } from '../vc-notification/Notice';
import useStyle from './style';
import type { NoticeType } from './interface';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import type { VueNode } from '../_util/type';
import classNames from '../_util/classNames';
import { useConfigContextInject, useComponentConfig } from '../config-provider/context';
import type { CSSProperties } from 'vue';
import { computed, defineComponent } from 'vue';

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
}

export const PureContent = defineComponent<PureContentProps>({
  name: 'PureContent',
  inheritAttrs: false,
  props: ['prefixCls', 'type', 'icon'] as any,

  setup(props, { slots }) {
    return () => (
      <div
        class={classNames(`${props.prefixCls}-custom-content`, `${props.prefixCls}-${props.type}`)}
      >
        {props.icon || TypeIcon[props.type!]}
        <span>{slots.default?.()}</span>
      </div>
    );
  },
});

export interface PurePanelProps
  extends Omit<NoticeProps, 'prefixCls' | 'eventKey'>,
    Omit<PureContentProps, 'prefixCls'> {
  prefixCls?: string;
}

/** @private Internal Component. Do not use in your production. */

export default defineComponent<PurePanelProps>({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'class', 'type', 'icon', 'content'] as any,
  setup(props, { slots, attrs }) {
    const { getPrefixCls } = useConfigContextInject();
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('message');
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('message'));
    const [, hashId] = useStyle(prefixCls);
    return () => (
      <Notice
        {...attrs}
        prefixCls={prefixCls.value}
        class={classNames(
          hashId.value,
          `${prefixCls.value}-notice-pure-panel`,
          contextClassName.value,
          contextClassNames.value.root,
          (props as any).class,
          attrs.class,
        )}
        style={[contextStyle.value, contextStyles.value.root, attrs.style as CSSProperties]}
        noticeKey="pure"
        duration={null}
      >
        <PureContent prefixCls={prefixCls.value} type={props.type} icon={props.icon}>
          {slots.default?.()}
        </PureContent>
      </Notice>
    );
  },
});
