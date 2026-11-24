import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import StatisticNumber from './Number';
import type { valueType, Formatter } from './utils';
import Skeleton from '../skeleton/Skeleton';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic, {
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

// CSSINJS
import useStyle from './style';
import { anyType, booleanType, functionType, someType, vNodeType } from '../_util/type';
import type { CustomSlotsType, VueNode } from '../_util/type';

export type StatisticSemanticName =
  | 'root'
  | 'header'
  | 'title'
  | 'content'
  | 'value'
  | 'prefix'
  | 'suffix';
export type StatisticSemanticClassNames = SemanticClassNames<StatisticSemanticName>;
export type StatisticSemanticStyles = SemanticStyles<StatisticSemanticName>;
export type StatisticClassNamesType = SemanticClassNamesType<
  Record<string, any>,
  StatisticSemanticName
>;
export type StatisticStylesType = SemanticStylesType<Record<string, any>, StatisticSemanticName>;

export const statisticProps = () => ({
  rootClassName: String,
  prefixCls: String,
  classNames: someType<StatisticClassNamesType>([Object, Function]),
  styles: someType<StatisticStylesType>([Object, Function]),
  decimalSeparator: String,
  groupSeparator: String,
  format: String,
  value: someType<valueType>([Number, String, Object]),
  valueStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  valueRender: functionType<(node: VueNode) => VueNode>(),
  formatter: anyType<Formatter>(),
  precision: Number,
  prefix: vNodeType(),
  suffix: vNodeType(),
  title: vNodeType(),
  loading: booleanType(),
});

export type StatisticProps = Partial<ExtractPropTypes<ReturnType<typeof statisticProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AStatistic',
  inheritAttrs: false,
  props: initDefaultProps(statisticProps(), {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false,
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    prefix?: any;
    suffix?: any;
    formatter?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('statistic', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('statistic');

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedProps = computed<StatisticProps>(() => ({
      ...props,
      decimalSeparator: props.decimalSeparator ?? '.',
      groupSeparator: props.groupSeparator ?? ',',
      loading: props.loading ?? false,
      value: props.value ?? 0,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      StatisticSemanticClassNames,
      StatisticSemanticStyles,
      StatisticProps
    >(
      () => [contextClassNames.value as StatisticClassNamesType, props.classNames],
      () => [
        contextStyles.value as StatisticStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.styles,
        attrs.style ? { root: attrs.style as CSSProperties } : undefined,
      ],
      () => ({ props: mergedProps.value }),
    );

    return () => {
      const { value = 0, valueStyle, valueRender } = props;
      const { class: attrClass, style: _attrStyle, ...restAttrs } = attrs;
      const pre = prefixCls.value;
      const title = props.title ?? slots.title?.();
      const prefix = props.prefix ?? slots.prefix?.();
      const suffix = props.suffix ?? slots.suffix?.();
      const formatter = props.formatter ?? (slots.formatter as unknown as Formatter);
      // data-for-update just for update component
      // https://github.com/vueComponent/ant-design-vue/pull/3170
      let valueNode: VueNode = (
        <StatisticNumber
          data-for-update={Date.now()}
          decimalSeparator={props.decimalSeparator}
          groupSeparator={props.groupSeparator}
          prefixCls={pre}
          formatter={formatter}
          precision={props.precision}
          value={value}
          className={mergedClassNames.value.value}
          semanticStyle={mergedStyles.value.value}
        />
      );
      if (valueRender) {
        valueNode = valueRender(valueNode);
      }
      return wrapSSR(
        <div
          {...restAttrs}
          class={[
            pre,
            { [`${pre}-rtl`]: direction.value === 'rtl' },
            contextClassName.value,
            mergedClassNames.value.root,
            props.rootClassName,
            attrClass,
            hashId.value,
          ]}
          style={mergedStyles.value.root}
        >
          {title !== undefined && title !== null && title !== false && title !== '' && (
            <div
              class={[`${pre}-header`, mergedClassNames.value.header]}
              style={mergedStyles.value.header}
            >
              <div
                class={[`${pre}-title`, mergedClassNames.value.title]}
                style={mergedStyles.value.title}
              >
                {title}
              </div>
            </div>
          )}
          <Skeleton paragraph={false} loading={props.loading}>
            <div
              style={[valueStyle, mergedStyles.value.content]}
              class={[`${pre}-content`, mergedClassNames.value.content]}
            >
              {prefix !== undefined && prefix !== null && prefix !== false && prefix !== '' && (
                <span
                  class={[`${pre}-content-prefix`, mergedClassNames.value.prefix]}
                  style={mergedStyles.value.prefix}
                >
                  {prefix}
                </span>
              )}
              {valueNode}
              {suffix !== undefined && suffix !== null && suffix !== false && suffix !== '' && (
                <span
                  class={[`${pre}-content-suffix`, mergedClassNames.value.suffix]}
                  style={mergedStyles.value.suffix}
                >
                  {suffix}
                </span>
              )}
            </div>
          </Skeleton>
        </div>,
      );
    };
  },
});
