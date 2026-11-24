import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import type {
  PopoverClassNamesType,
  PopoverProps,
  PopoverSemanticClassNames,
  PopoverSemanticStyles,
  PopoverStylesType,
} from './index';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { anyType, someType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import classNames from '../_util/classNames';
import useStyle from './style';

export const Overlay = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopoverOverlay',
  props: {
    prefixCls: String,
    title: anyType(),
    content: anyType(),
    classNames: { type: Object as PropType<PopoverSemanticClassNames> },
    styles: { type: Object as PropType<PopoverSemanticStyles> },
  },
  setup(props, { slots }) {
    return () => {
      const { prefixCls } = props;
      const semanticClassNames: PopoverSemanticClassNames = (props.classNames ||
        {}) as PopoverSemanticClassNames;
      const semanticStyles: PopoverSemanticStyles = (props.styles || {}) as PopoverSemanticStyles;
      const rawTitle = props.title ?? filterEmpty(slots.title?.());
      const rawContent = props.content ?? filterEmpty(slots.content?.());
      const title = typeof rawTitle === 'function' ? rawTitle() : rawTitle;
      const content = typeof rawContent === 'function' ? rawContent() : rawContent;
      const hasTitle = !!(Array.isArray(title)
        ? title.length
        : title !== undefined && title !== null && title !== '');
      const hasContent = !!(Array.isArray(content)
        ? content.length
        : content !== undefined && content !== null && content !== '');
      if (!hasTitle && !hasContent) {
        return null;
      }
      return (
        <>
          {hasTitle && (
            <div
              class={classNames(`${prefixCls}-title`, semanticClassNames.title)}
              style={semanticStyles.title}
            >
              {title}
            </div>
          )}
          {hasContent && (
            <div
              class={classNames(`${prefixCls}-inner-content`, semanticClassNames.content)}
              style={semanticStyles.content}
            >
              {content}
            </div>
          )}
        </>
      );
    };
  },
});

export const purePanelProps = () => ({
  ...abstractTooltipProps(),
  content: anyType(),
  title: anyType(),
  classNames: someType<PopoverClassNamesType>([Object, Function]),
  styles: someType<PopoverStylesType>([Object, Function]),
  hashId: String,
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

export const RawPurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopoverRawPurePanel',
  inheritAttrs: false,
  props: initDefaultProps(purePanelProps(), {
    placement: 'top',
    arrow: true,
  }),
  setup(props, { slots, attrs }) {
    return () => {
      const { hashId, prefixCls = 'ant-popover', placement = 'top', title, content, arrow } = props;

      const [mergedClassNames, mergedStyles] = mergeSemantic<
        PopoverSemanticClassNames,
        PopoverSemanticStyles,
        PopoverProps
      >([props.classNames as any], [props.styles as any], {
        props: { ...props, placement },
      });

      const rootCls = classNames(
        hashId,
        prefixCls,
        `${prefixCls}-pure`,
        `${prefixCls}-placement-${placement}`,
        props.rootClassName,
        props.overlayClassName,
        mergedClassNames.root,
        attrs.class,
      );

      const containerCls = classNames(
        `${prefixCls}-inner`,
        mergedClassNames.body,
        mergedClassNames.container,
      );
      const containerStyle: CSSProperties | undefined =
        mergedStyles.body || mergedStyles.container || props.overlayInnerStyle
          ? { ...props.overlayInnerStyle, ...mergedStyles.body, ...mergedStyles.container }
          : undefined;

      const defaultSlot = filterEmpty(slots.default?.());
      const hasChildren = !!(defaultSlot && defaultSlot.length);

      return (
        <div
          {...attrs}
          class={rootCls}
          style={[props.overlayStyle, mergedStyles.root, attrs.style as CSSProperties]}
        >
          {arrow !== false && (
            <div
              class={classNames(`${prefixCls}-arrow`, mergedClassNames.arrow)}
              style={mergedStyles.arrow}
            />
          )}
          <div class={`${prefixCls}-content`}>
            <div class={containerCls} style={containerStyle}>
              {hasChildren ? (
                defaultSlot
              ) : (
                <Overlay
                  prefixCls={prefixCls}
                  title={title}
                  content={content}
                  classNames={mergedClassNames}
                  styles={mergedStyles}
                  v-slots={{ title: slots.title, content: slots.content }}
                />
              )}
            </div>
          </div>
        </div>
      );
    };
  },
});

const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopoverPurePanel',
  inheritAttrs: false,
  props: initDefaultProps(purePanelProps(), {
    placement: 'top',
    arrow: true,
  }),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('popover', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedPrefixCls = computed(() => prefixCls.value);

    return () =>
      wrapSSR(
        <RawPurePanel
          {...props}
          {...attrs}
          prefixCls={mergedPrefixCls.value}
          hashId={hashId.value}
          v-slots={slots}
        />,
      );
  },
});

export default PurePanel;
