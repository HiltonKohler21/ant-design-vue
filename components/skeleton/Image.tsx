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
import useStyle from './style';

export type SkeletonImageProps = Omit<SkeletonElementProps, 'size' | 'shape'>;

const path =
  'M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z';

const SkeletonImage = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonImage',
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
  },
  setup(props, { attrs }) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        SkeletonElementSemanticClassNames,
        SkeletonElementSemanticStyles,
        SkeletonImageProps
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
            class={classNames(`${prefixCls.value}-image`, mergedClassNames.content)}
            style={contentStyle}
          >
            <svg
              viewBox="0 0 1098 1024"
              xmlns="http://www.w3.org/2000/svg"
              class={`${prefixCls.value}-image-svg`}
            >
              <path d={path} class={`${prefixCls.value}-image-path`} />
            </svg>
          </div>
        </div>,
      );
    };
  },
});

export default SkeletonImage;
