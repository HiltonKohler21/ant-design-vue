import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import classnames from '../_util/classNames';
import { getPropsSlot } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { objectType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Skeleton from '../skeleton';
import useStyle from './style';
import type {
  DrawerClassNamesType,
  DrawerClosable,
  DrawerClosableType,
  DrawerProps,
  DrawerSemanticClassNames,
  DrawerSemanticStyles,
  DrawerStylesType,
  placementType,
} from './index';

export const purePanelProps = () => ({
  prefixCls: String,
  placement: {
    type: String as PropType<placementType>,
    default: 'right' as placementType,
  },
  title: PropTypes.any,
  extra: PropTypes.any,
  footer: PropTypes.any,
  closable: {
    type: [Boolean, Object] as PropType<DrawerClosable>,
    default: undefined,
  },
  closeIcon: PropTypes.any,
  loading: { type: Boolean, default: false },
  ariaId: String,
  rootClassName: String,
  rootStyle: objectType<CSSProperties>(),
  drawerStyle: objectType<CSSProperties>(),
  headerStyle: objectType<CSSProperties>(),
  bodyStyle: objectType<CSSProperties>(),
  footerStyle: objectType<CSSProperties>(),
  classNames: {
    type: [Object, Function] as PropType<DrawerClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<DrawerStylesType>,
    default: undefined,
  },
  onClose: Function as PropType<(e: MouseEvent) => void>,
});

export type DrawerPurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADrawerPurePanel',
  inheritAttrs: false,
  props: purePanelProps(),
  slots: Object as CustomSlotsType<{
    closeIcon?: any;
    title?: any;
    extra?: any;
    footer?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction, configProvider } = useConfigInject('drawer', props);
    const drawerConfig = computed(() => (configProvider.drawer?.value as any) || {});
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const handleClose = (e: MouseEvent) => {
      emit('close', e);
    };

    return () => {
      const pre = prefixCls.value;
      const title = getPropsSlot(slots, props, 'title');
      const extra = getPropsSlot(slots, props, 'extra');
      const footer = getPropsSlot(slots, props, 'footer');

      const rawClosable =
        props.closable !== undefined
          ? props.closable
          : drawerConfig.value.closable !== undefined
          ? drawerConfig.value.closable
          : true;
      const closableObj =
        rawClosable && typeof rawClosable === 'object' ? (rawClosable as DrawerClosableType) : null;
      const closable = rawClosable !== false;
      const closeDisabled = Boolean(closableObj?.disabled);
      const closablePlacement: 'start' | 'end' = closableObj?.placement === 'end' ? 'end' : 'start';
      const ariaOrDataProps: Record<string, any> = {};
      if (closableObj) {
        Object.keys(closableObj).forEach(key => {
          if (key.startsWith('aria-') || key.startsWith('data-')) {
            ariaOrDataProps[key] = (closableObj as any)[key];
          }
        });
      }

      const mergedPropsForSemantic: DrawerProps = {
        ...props,
        closable: rawClosable,
        title,
        extra,
        footer,
      };
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        DrawerSemanticClassNames,
        DrawerSemanticStyles,
        DrawerProps
      >(
        [drawerConfig.value.classNames, props.classNames],
        [drawerConfig.value.styles, props.styles],
        {
          props: mergedPropsForSemantic,
        },
      );

      const $closeIcon = slots.closeIcon
        ? slots.closeIcon?.()
        : closableObj?.closeIcon !== undefined
        ? closableObj.closeIcon
        : props.closeIcon ?? drawerConfig.value.closeIcon;

      const closeIconNode = closable ? (
        <button
          key="closer"
          type="button"
          onClick={closeDisabled ? undefined : handleClose}
          aria-label="Close"
          {...ariaOrDataProps}
          disabled={closeDisabled || undefined}
          class={classnames(
            `${pre}-close`,
            {
              [`${pre}-close-end`]: closablePlacement === 'end',
            },
            mergedClassNames.close,
          )}
          style={mergedStyles.close}
        >
          {$closeIcon === undefined ? <CloseOutlined /> : $closeIcon}
        </button>
      ) : null;

      const headerNode =
        title || closable || extra ? (
          <div
            class={classnames(
              `${pre}-header`,
              {
                [`${pre}-header-close-only`]: closable && !title && !extra,
              },
              mergedClassNames.header,
            )}
            style={[props.headerStyle, mergedStyles.header]}
          >
            <div class={`${pre}-header-title`}>
              {closablePlacement === 'start' && closeIconNode}
              {title && (
                <div
                  class={classnames(`${pre}-title`, mergedClassNames.title)}
                  style={mergedStyles.title}
                  id={props.ariaId}
                >
                  {title}
                </div>
              )}
            </div>
            {extra && (
              <div
                class={classnames(`${pre}-extra`, mergedClassNames.extra)}
                style={mergedStyles.extra}
              >
                {extra}
              </div>
            )}
            {closablePlacement === 'end' && closeIconNode}
          </div>
        ) : null;

      const footerNode = footer ? (
        <div
          class={classnames(`${pre}-footer`, mergedClassNames.footer)}
          style={[props.footerStyle, mergedStyles.footer]}
        >
          {footer}
        </div>
      ) : null;

      const cls = classnames(
        pre,
        `${pre}-pure`,
        `${pre}-${props.placement}`,
        {
          [`${pre}-rtl`]: direction.value === 'rtl',
        },
        props.rootClassName,
        mergedClassNames.root,
        drawerConfig.value.className,
        hashId.value,
        attrs.class as any,
      );

      return wrapSSR(
        <div
          {...attrs}
          class={cls}
          style={[
            drawerConfig.value.style,
            mergedStyles.root,
            props.rootStyle,
            attrs.style as CSSProperties,
          ]}
        >
          <div
            class={classnames(
              `${pre}-wrapper-body`,
              mergedClassNames.content,
              mergedClassNames.section,
            )}
            style={[props.drawerStyle, mergedStyles.content, mergedStyles.section]}
            aria-labelledby={props.ariaId}
          >
            {headerNode}
            <div
              class={classnames(`${pre}-body`, mergedClassNames.body)}
              style={[props.bodyStyle, mergedStyles.body]}
            >
              {props.loading ? (
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 5 }}
                  class={`${pre}-body-skeleton`}
                />
              ) : (
                slots.default?.()
              )}
            </div>
            {footerNode}
          </div>
        </div>,
      );
    };
  },
});

export default PurePanel;
