import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { anyType, someType, withInstall } from '../_util/type';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
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

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

export type PopoverSemanticName = 'root' | 'container' | 'body' | 'title' | 'content' | 'arrow';
export type PopoverSemanticClassNames = SemanticNames<PopoverSemanticName>;
export type PopoverSemanticStyles = SemanticStylesMap<PopoverSemanticName>;

const popoverBaseProps = () => ({
  ...abstractTooltipProps(),
  content: anyType(),
  title: anyType(),
});

type PopoverSemanticProps = Partial<ExtractPropTypes<ReturnType<typeof popoverBaseProps>>> & {
  classNames?: any;
  styles?: any;
};

export type PopoverClassNamesType =
  | PopoverSemanticClassNames
  | ((info: { props: PopoverSemanticProps }) => PopoverSemanticClassNames);

export type PopoverStylesType =
  | PopoverSemanticStyles
  | ((info: { props: PopoverSemanticProps }) => PopoverSemanticStyles);

export const popoverProps = () => ({
  ...popoverBaseProps(),
  /** 语义化 classNames（antd 5.25+/6.x）：root / container / body / title / content / arrow */
  classNames: someType<PopoverClassNamesType>([Object, Function]),
  /** 语义化 styles（antd 5.25+/6.x）：root / container / body / title / content / arrow */
  styles: someType<PopoverStylesType>([Object, Function]),
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

    const resolvedSemantics = computed(() => {
      const ctxConfig = injectFromPopconfirm.value ? {} : popoverConfig.value;
      const ctxClassNames = injectFromPopconfirm.value ? undefined : contextClassNames.value;
      const ctxStyles = injectFromPopconfirm.value ? undefined : contextStyles.value;
      const mergedTrigger = props.trigger ?? (ctxConfig as any).trigger ?? 'hover';
      const mergedMouseEnterDelay =
        props.mouseEnterDelay ?? (ctxConfig as any).mouseEnterDelay ?? 0.1;
      const mergedMouseLeaveDelay =
        props.mouseLeaveDelay ?? (ctxConfig as any).mouseLeaveDelay ?? 0.1;
      const mergedArrow = props.arrow ?? (ctxConfig as any).arrow ?? true;
      const semanticInfo = {
        props: {
          ...props,
          trigger: mergedTrigger,
          mouseEnterDelay: mergedMouseEnterDelay,
          mouseLeaveDelay: mergedMouseLeaveDelay,
          arrow: mergedArrow,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<PopoverSemanticClassNames>(
        resolveSemanticValue(ctxClassNames, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<PopoverSemanticStyles>(
        resolveSemanticValue(ctxStyles, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );
      return {
        mergedTrigger,
        mergedMouseEnterDelay,
        mergedMouseLeaveDelay,
        mergedArrow,
        mergedClassNames,
        mergedStyles,
      };
    });

    let prevArrowClasses: string[] = [];
    let prevArrowStyleKeys: string[] = [];
    let arrowElRef: HTMLElement | null = null;

    const applyArrowSemantic = (arrowEl: HTMLElement | null) => {
      if (!arrowEl) return;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      const nextArrowClasses = (mergedClassNames.arrow || '').split(/\s+/).filter(Boolean);
      const nextArrowStyle = mergedStyles.arrow;
      const nextStyleKeys = nextArrowStyle ? Object.keys(nextArrowStyle) : [];

      if (
        !prevArrowClasses.length &&
        !prevArrowStyleKeys.length &&
        !nextArrowClasses.length &&
        !nextStyleKeys.length
      ) {
        return;
      }

      prevArrowClasses.forEach(cls => {
        if (!nextArrowClasses.includes(cls)) {
          arrowEl.classList.remove(cls);
        }
      });
      nextArrowClasses.forEach(cls => {
        arrowEl.classList.add(cls);
      });
      prevArrowClasses = nextArrowClasses;

      prevArrowStyleKeys.forEach(key => {
        if (!nextStyleKeys.includes(key)) {
          if (key.startsWith('--')) {
            arrowEl.style.removeProperty(key);
          } else {
            (arrowEl.style as any)[key] = '';
          }
        }
      });
      if (nextArrowStyle) {
        nextStyleKeys.forEach(key => {
          const val = (nextArrowStyle as any)[key];
          if (val === undefined || val === null) {
            if (key.startsWith('--')) {
              arrowEl.style.removeProperty(key);
            } else {
              (arrowEl.style as any)[key] = '';
            }
          } else if (key.startsWith('--')) {
            arrowEl.style.setProperty(key, String(val));
          } else {
            (arrowEl.style as any)[key] = val;
          }
        });
      }
      prevArrowStyleKeys = nextStyleKeys;
    };

    const findArrowElement = (innerEl?: Element | null): HTMLElement | null => {
      const contentEl = innerEl?.closest?.(`.${prefixCls.value}-content`);
      if (contentEl) {
        return contentEl.querySelector(`.${prefixCls.value}-arrow`) as HTMLElement | null;
      }
      const popupEl = tooltipRef.value?.getPopupDomNode?.() as HTMLElement | null;
      return (popupEl?.querySelector?.(`.${prefixCls.value}-arrow`) as HTMLElement | null) || null;
    };

    const syncArrowFromInner = (el: any) => {
      if (el && typeof el.closest === 'function') {
        arrowElRef = findArrowElement(el);
        applyArrowSemantic(arrowElRef);
      } else if (el === null) {
        arrowElRef = null;
        prevArrowClasses = [];
        prevArrowStyleKeys = [];
      }
    };

    watch(
      () => [
        resolvedSemantics.value.mergedClassNames.arrow,
        resolvedSemantics.value.mergedStyles.arrow,
      ],
      () => {
        applyArrowSemantic(arrowElRef || findArrowElement());
      },
      { flush: 'post', deep: true },
    );

    const getOverlay = () => {
      const { title = filterEmpty(slots.title?.()), content = filterEmpty(slots.content?.()) } =
        props;
      const hasTitle = !!(Array.isArray(title) ? title.length : title);
      const hasContent = !!(Array.isArray(content) ? content.length : content);
      if (!hasTitle && !hasContent) return null;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      return (
        <>
          {hasTitle && (
            <div
              class={[`${prefixCls.value}-title`, mergedClassNames.title]}
              style={mergedStyles.title}
            >
              {title}
            </div>
          )}
          <div
            ref={syncArrowFromInner}
            class={[`${prefixCls.value}-inner-content`, mergedClassNames.content]}
            style={mergedStyles.content}
          >
            {content}
          </div>
        </>
      );
    };
    return () => {
      const ctxCls = injectFromPopconfirm.value ? undefined : contextClassName.value;
      const ctxStyle = injectFromPopconfirm.value ? undefined : contextStyle.value;
      const {
        mergedTrigger,
        mergedMouseEnterDelay,
        mergedMouseLeaveDelay,
        mergedArrow,
        mergedClassNames,
        mergedStyles,
      } = resolvedSemantics.value;
      const containerClassName = classNames(mergedClassNames.body, mergedClassNames.container);
      const containerStyle: CSSProperties | undefined =
        mergedStyles.body || mergedStyles.container
          ? { ...mergedStyles.body, ...mergedStyles.container }
          : undefined;
      const tooltipClassNames = {
        root: mergedClassNames.root,
        body: containerClassName || undefined,
        arrow: mergedClassNames.arrow,
      };
      const tooltipStyles = {
        root: mergedStyles.root,
        body: containerStyle,
        arrow: mergedStyles.arrow,
      };
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
          classNames={tooltipClassNames as any}
          styles={tooltipStyles as any}
          v-slots={{ title: getOverlay, default: slots.default }}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          data-popover-inject
        />,
      );
    };
  },
});

export default withInstall(Popover);
