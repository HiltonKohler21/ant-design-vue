import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { vNodeType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';

export const cardMetaProps = () => ({
  prefixCls: String,
  title: vNodeType(),
  description: vNodeType(),
  avatar: vNodeType(),
});
export type CardGridProps = Partial<ExtractPropTypes<ReturnType<typeof cardMetaProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACardMeta',
  props: cardMetaProps(),
  slots: Object as CustomSlotsType<{
    title: any;
    description: any;
    avatar: any;
    default: any;
  }>,
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('card', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('cardMeta');
    return () => {
      const classString = {
        [`${prefixCls.value}-meta`]: true,
      };
      const avatar = getPropsSlot(slots, props, 'avatar');
      const title = getPropsSlot(slots, props, 'title');
      const description = getPropsSlot(slots, props, 'description');

      const avatarDom = avatar ? (
        <div
          class={[`${prefixCls.value}-meta-avatar`, contextClassNames.value.avatar]}
          style={contextStyles.value.avatar}
        >
          {avatar}
        </div>
      ) : null;
      const titleDom = title ? (
        <div
          class={[`${prefixCls.value}-meta-title`, contextClassNames.value.title]}
          style={contextStyles.value.title}
        >
          {title}
        </div>
      ) : null;
      const descriptionDom = description ? (
        <div
          class={[`${prefixCls.value}-meta-description`, contextClassNames.value.description]}
          style={contextStyles.value.description}
        >
          {description}
        </div>
      ) : null;
      const MetaDetail =
        titleDom || descriptionDom ? (
          <div
            class={[`${prefixCls.value}-meta-detail`, contextClassNames.value.section]}
            style={contextStyles.value.section}
          >
            {titleDom}
            {descriptionDom}
          </div>
        ) : null;
      return (
        <div
          class={[classString, contextClassName.value, contextClassNames.value.root]}
          style={[contextStyle.value, contextStyles.value.root]}
        >
          {avatarDom}
          {MetaDetail}
        </div>
      );
    };
  },
});
