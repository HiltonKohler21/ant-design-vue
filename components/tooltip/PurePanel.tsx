import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import abstractTooltipProps from './abstractTooltipProps';
import type { TooltipSemanticClassNames, TooltipSemanticStyles } from './abstractTooltipProps';
import type { TooltipProps } from './Tooltip';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import classNames from '../_util/classNames';
import useStyle from './style';
import { parseColor } from './util';

export const purePanelProps = () => ({
  ...abstractTooltipProps(),
  title: PropTypes.any,
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATooltipPurePanel',
  inheritAttrs: false,
  props: initDefaultProps(purePanelProps(), {
    placement: 'top',
    arrow: true,
  }),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('tooltip', props);
    const [wrapSSR, hashId] = useStyle(prefixCls, ref(true));
    const colorInfo = computed(() => parseColor(prefixCls.value, props.color));

    return () => {
      const { placement = 'top', title, overlayInnerStyle, arrow } = props;

      const [semanticClassNames, semanticStyles] = mergeSemantic<
        TooltipSemanticClassNames,
        TooltipSemanticStyles,
        TooltipProps
      >([props.classNames as any], [props.styles as any], {
        props: { ...props, placement },
      });

      const rootCls = classNames(
        hashId.value,
        prefixCls.value,
        `${prefixCls.value}-pure`,
        `${prefixCls.value}-placement-${placement}`,
        {
          [`${prefixCls.value}-arrow-hidden`]: arrow === false,
        },
        colorInfo.value.className,
        props.rootClassName,
        props.overlayClassName,
        semanticClassNames.root,
        attrs.class,
      );

      const containerCls = classNames(
        `${prefixCls.value}-inner`,
        semanticClassNames.body,
        semanticClassNames.container,
      );

      const containerStyle: CSSProperties = {
        ...colorInfo.value.overlayStyle,
        ...overlayInnerStyle,
        ...semanticStyles.body,
        ...semanticStyles.container,
      };

      const titleNode = title ?? slots.title?.();

      return wrapSSR(
        <div
          {...attrs}
          class={rootCls}
          style={[
            colorInfo.value.arrowStyle,
            props.overlayStyle,
            semanticStyles.root,
            attrs.style as CSSProperties,
          ]}
        >
          <div class={`${prefixCls.value}-content`}>
            {arrow !== false && (
              <div
                class={classNames(`${prefixCls.value}-arrow`, semanticClassNames.arrow)}
                style={semanticStyles.arrow}
              >
                <span class={`${prefixCls.value}-arrow-content`} />
              </div>
            )}
            <div class={containerCls} role="tooltip" style={containerStyle}>
              {typeof titleNode === 'function' ? titleNode() : titleNode}
            </div>
          </div>
        </div>,
      );
    };
  },
});

export default PurePanel;
