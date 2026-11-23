import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { anyType, withInstall } from '../_util/type';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import { getTransitionName } from '../_util/transition';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import useStyle from './style';
import classNames from '../_util/classNames';
import warning from '../_util/warning';

export const popoverProps = () => ({
  ...abstractTooltipProps(),
  content: anyType(),
  title: anyType(),
});

export type PopoverProps = Partial<ExtractPropTypes<ReturnType<typeof popoverProps>>>;

const Popover = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopover',
  inheritAttrs: false,
  props: initDefaultProps(popoverProps(), {
    ...omit(tooltipDefaultProps(), ['trigger', 'mouseEnterDelay', 'mouseLeaveDelay']),
    placement: 'top',
  }),
  setup(props, { expose, slots, attrs }) {
    const tooltipRef = ref();
    warning(
      props.visible === undefined,
      'popover',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );
    expose({
      getPopupDomNode: () => {
        return tooltipRef.value?.getPopupDomNode?.();
      },
    });
    const { prefixCls, configProvider } = useConfigInject('popover', props);
    const {
      componentConfig: popoverConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('popover');
    const injectFromPopconfirm = computed(() => !!(attrs as any)['data-popconfirm-inject']);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootPrefixCls = computed(() => configProvider.getPrefixCls());
    const getOverlay = () => {
      const { title = filterEmpty(slots.title?.()), content = filterEmpty(slots.content?.()) } =
        props;
      const hasTitle = !!(Array.isArray(title) ? title.length : title);
      const hasContent = !!(Array.isArray(content) ? content.length : content);
      if (!hasTitle && !hasContent) return null;
      return (
        <>
          {hasTitle && <div class={`${prefixCls.value}-title`}>{title}</div>}
          <div class={`${prefixCls.value}-inner-content`}>{content}</div>
        </>
      );
    };
    return () => {
      const ctxConfig = injectFromPopconfirm.value ? {} : popoverConfig.value;
      const ctxCls = injectFromPopconfirm.value ? undefined : contextClassName.value;
      const ctxStyle = injectFromPopconfirm.value ? undefined : contextStyle.value;
      const ctxClassNames = injectFromPopconfirm.value ? undefined : contextClassNames.value;
      const ctxStyles = injectFromPopconfirm.value ? undefined : contextStyles.value;
      const mergedTrigger = props.trigger ?? (ctxConfig as any).trigger ?? 'hover';
      const mergedMouseEnterDelay =
        props.mouseEnterDelay ?? (ctxConfig as any).mouseEnterDelay ?? 0.1;
      const mergedMouseLeaveDelay =
        props.mouseLeaveDelay ?? (ctxConfig as any).mouseLeaveDelay ?? 0.1;
      const mergedArrow = props.arrow ?? (ctxConfig as any).arrow ?? true;
      const mergedClassNames = mergeSemanticClassNames(ctxClassNames, props.classNames);
      const mergedStyles = mergeSemanticStyles(ctxStyles, props.styles);
      const mergedOverlayStyle =
        ctxStyle || props.overlayStyle ? { ...ctxStyle, ...props.overlayStyle } : undefined;
      const overlayCls = classNames(props.overlayClassName, ctxCls, hashId.value);
      return wrapSSR(
        <Tooltip
          {...omit(props, ['title', 'content'])}
          {...attrs}
          trigger={mergedTrigger}
          mouseEnterDelay={mergedMouseEnterDelay}
          mouseLeaveDelay={mergedMouseLeaveDelay}
          arrow={mergedArrow}
          prefixCls={prefixCls.value}
          ref={tooltipRef}
          overlayClassName={overlayCls}
          overlayStyle={mergedOverlayStyle}
          classNames={mergedClassNames}
          styles={mergedStyles}
          v-slots={{ title: getOverlay, default: slots.default }}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          data-popover-inject
        />,
      );
    };
  },
});

export default withInstall(Popover);
