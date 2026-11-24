import type { CSSProperties, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type {
  SkeletonElementProps,
  SkeletonElementClassNamesType,
  SkeletonElementSemanticClassNames,
  SkeletonElementSemanticStyles,
  SkeletonElementStylesType,
} from './Element';
import Element from './Element';
import useStyle from './style';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default' | 'medium';
  block?: boolean;
}

const SkeletonInput = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonInput',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    rootClassName: String,
    active: { type: Boolean, default: undefined },
    classNames: {
      type: [Object, Function] as PropType<SkeletonElementClassNamesType>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<SkeletonElementStylesType>,
      default: undefined,
    },
    size: String as PropType<'large' | 'small' | 'default' | 'medium'>,
    block: Boolean,
  },
  setup(props, { attrs }) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SkeletonElementSemanticClassNames,
        SkeletonElementSemanticStyles,
        SkeletonInputProps
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
            prefixCls={`${prefixCls.value}-input`}
            class={mergedClassNames.content}
            style={contentStyle}
          />
        </div>,
      );
    };
  },
});

export default SkeletonInput;
