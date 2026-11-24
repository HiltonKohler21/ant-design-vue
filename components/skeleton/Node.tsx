import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type {
  SkeletonElementClassNamesType,
  SkeletonElementSemanticClassNames,
  SkeletonElementSemanticStyles,
  SkeletonElementStylesType,
} from './Element';
import useStyle from './style';

export const skeletonNodeProps = () => ({
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
  internalClassName: String,
});

export type SkeletonNodeProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonNodeProps>>>;

const SkeletonNode = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonNode',
  inheritAttrs: false,
  props: skeletonNodeProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SkeletonElementSemanticClassNames,
        SkeletonElementSemanticStyles,
        SkeletonNodeProps
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
          <div
            class={classNames(
              mergedClassNames.content,
              props.internalClassName || `${prefixCls.value}-node`,
            )}
            style={contentStyle}
          >
            {slots.default?.()}
          </div>
        </div>,
      );
    };
  },
});

export default SkeletonNode;
