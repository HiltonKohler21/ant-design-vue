import type { CustomSlotsType, LiteralUnion } from '../_util/type';
import { someType } from '../_util/type';
import type { PresetColorType } from '../_util/colors';
import useStyle from './style';
import { isPresetColor } from '../_util/colors';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

export type RibbonSemanticName = 'root' | 'content' | 'indicator';
export type RibbonSemanticClassNames = SemanticNames<RibbonSemanticName>;
export type RibbonSemanticStyles = SemanticStylesMap<RibbonSemanticName>;

const ribbonBaseProps = () => ({
  prefix: String,
  rootClassName: String,
  color: { type: String as PropType<LiteralUnion<PresetColorType>> },
  text: PropTypes.any,
  placement: { type: String as PropType<'start' | 'end'>, default: 'end' },
});

type RibbonSemanticProps = Partial<ExtractPropTypes<ReturnType<typeof ribbonBaseProps>>> & {
  classNames?: any;
  styles?: any;
};

export type RibbonClassNamesType =
  | RibbonSemanticClassNames
  | ((info: { props: RibbonSemanticProps }) => RibbonSemanticClassNames);

export type RibbonStylesType =
  | RibbonSemanticStyles
  | ((info: { props: RibbonSemanticProps }) => RibbonSemanticStyles);

export const ribbonProps = () => ({
  ...ribbonBaseProps(),
  classNames: someType<RibbonClassNamesType>([Object, Function]),
  styles: someType<RibbonStylesType>([Object, Function]),
});

export type RibbonProps = Partial<ExtractPropTypes<ReturnType<typeof ribbonProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABadgeRibbon',
  inheritAttrs: false,
  props: ribbonProps(),
  slots: Object as CustomSlotsType<{
    text: any;
    default: any;
  }>,
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject('ribbon', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('ribbon');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const colorInPreset = computed(() => isPresetColor(props.color, false));
    const ribbonCls = computed(() => [
      prefixCls.value,
      `${prefixCls.value}-placement-${props.placement}`,
      {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-color-${props.color}`]: colorInPreset.value,
      },
    ]);
    return () => {
      const { class: className, style, ...restAttrs } = attrs;
      const semanticInfo = {
        props: {
          ...props,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<RibbonSemanticClassNames>(
        resolveSemanticValue(contextClassNames.value, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<RibbonSemanticStyles>(
        resolveSemanticValue(contextStyles.value, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );

      const colorStyle: CSSProperties = {};
      const cornerColorStyle: CSSProperties = {};
      if (props.color && !colorInPreset.value) {
        colorStyle.background = props.color;
        cornerColorStyle.color = props.color;
      }
      return wrapSSR(
        <div
          class={[
            `${prefixCls.value}-wrapper`,
            props.rootClassName,
            hashId.value,
            mergedClassNames.root,
          ]}
          style={mergedStyles.root}
          {...restAttrs}
        >
          {slots.default?.()}
          <div
            class={[
              ribbonCls.value,
              contextClassName.value,
              mergedClassNames.indicator,
              className,
              hashId.value,
            ]}
            style={{
              ...contextStyle.value,
              ...colorStyle,
              ...mergedStyles.indicator,
              ...(style as CSSProperties),
            }}
          >
            <span
              class={[`${prefixCls.value}-text`, mergedClassNames.content]}
              style={mergedStyles.content}
            >
              {props.text || slots.text?.()}
            </span>
            <div class={`${prefixCls.value}-corner`} style={cornerColorStyle} />
          </div>
        </div>,
      );
    };
  },
});
