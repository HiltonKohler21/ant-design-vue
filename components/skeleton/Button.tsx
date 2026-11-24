import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SkeletonElementSemanticClassNames, SkeletonElementSemanticStyles } from './Element';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';

export const skeletonButtonProps = () => {
  return {
    ...skeletonElementProps(),
    size: String as PropType<'large' | 'small' | 'default' | 'medium'>,
    block: Boolean,
  };
};

export type SkeletonButtonProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonButtonProps>>>;

const SkeletonButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonButton',
  inheritAttrs: false,
  props: initDefaultProps(skeletonButtonProps(), {
    size: 'default',
  }),
  setup(props, { attrs }) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SkeletonElementSemanticClassNames,
        SkeletonElementSemanticStyles,
        SkeletonButtonProps
      >([props.classNames], [props.styles], { props });

      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: props.active,
          [`${prefixCls.value}-block`]: props.block,
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
            prefixCls={`${prefixCls.value}-button`}
            class={mergedClassNames.content}
            style={contentStyle}
          />
        </div>,
      );
    };
  },
});

export default SkeletonButton;
