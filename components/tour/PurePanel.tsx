import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import { tourStepProps } from './interface';
import type { TourSemanticClassNames, TourSemanticStyles, TourStepProps } from './interface';
import TourPanel from './panelRender';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useStyle from './style';

export const purePanelProps = () => ({
  ...tourStepProps(),
  prefixCls: String,
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATourPurePanel',
  inheritAttrs: false,
  props: initDefaultProps(purePanelProps(), {
    current: 0,
    total: 6,
    placement: 'top',
    arrow: true,
  }),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('tour', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const {
        current = 0,
        total = 6,
        type,
        placement = 'top',
        className,
        style,
        ...restProps
      } = props;

      const [mergedClassNames, mergedStyles] = mergeSemantic<
        TourSemanticClassNames,
        TourSemanticStyles,
        TourStepProps
      >([props.classNames as any], [props.styles as any], {
        props,
      });

      return wrapSSR(
        <div
          {...attrs}
          class={classNames(
            hashId.value,
            prefixCls.value,
            `${prefixCls.value}-pure`,
            `${prefixCls.value}-placement-${placement}`,
            type && `${prefixCls.value}-${type}`,
            className,
            mergedClassNames.root,
            attrs.class,
          )}
          style={[style, mergedStyles.root, attrs.style as CSSProperties]}
        >
          <TourPanel
            {...restProps}
            prefixCls={prefixCls.value}
            current={current}
            total={total}
            type={type}
            classNames={mergedClassNames}
            styles={mergedStyles}
            v-slots={slots}
          />
        </div>,
      );
    };
  },
});

export default PurePanel;
