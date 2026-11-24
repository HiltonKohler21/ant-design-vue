import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SkeletonElementSemanticClassNames, SkeletonElementSemanticStyles } from './Element';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';

export const avatarProps = () => {
  return {
    ...skeletonElementProps(),
    shape: String as PropType<'circle' | 'square'>,
  };
};

export type SkeletonAvatarProps = Partial<ExtractPropTypes<ReturnType<typeof avatarProps>>>;

const SkeletonAvatar = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonAvatar',
  inheritAttrs: false,
  props: initDefaultProps(avatarProps(), {
    size: 'default',
    shape: 'circle',
  }),
  setup(props, { attrs }) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SkeletonElementSemanticClassNames,
        SkeletonElementSemanticStyles,
        SkeletonAvatarProps
      >([props.classNames], [props.styles], { props });

      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: props.active,
        },
        mergedClassNames.root,
        props.rootClassName,
        attrs.class as any,
        hashId.value,
      );

      const contentStyle =
        mergedStyles.content || attrs.style
          ? [mergedStyles.content, attrs.style as CSSProperties]
          : undefined;

      return wrapSSR(
        <div class={cls} style={mergedStyles.root}>
          <Element
            {...props}
            prefixCls={`${prefixCls.value}-avatar`}
            class={mergedClassNames.content}
            style={contentStyle}
          />
        </div>,
      );
    };
  },
});

export default SkeletonAvatar;
