import type { ExtractPropTypes, HTMLAttributes, Plugin, PropType } from 'vue';
import { computed, ref, toRef, defineComponent } from 'vue';
import Popover from '../popover';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { initDefaultProps } from '../_util/props-util';
import type { ButtonProps, LegacyButtonType } from '../button/buttonTypes';
import { anyType, objectType, someType, stringType, withInstall } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';

import useMergedState from '../_util/hooks/useMergedState';

import KeyCode from '../_util/KeyCode';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { getTransitionName } from '../_util/transition';
import { cloneVNodes } from '../_util/vnode';
import omit from '../_util/omit';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import PurePanel, { Overlay } from './PurePanel';
import usePopconfirmStyle from './style';
import warning from '../_util/warning';

export type { OverlayProps, PurePanelProps } from './PurePanel';
export { Overlay, PurePanel };

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

export type PopconfirmSemanticName =
  | 'root'
  | 'container'
  | 'body'
  | 'title'
  | 'content'
  | 'arrow'
  | 'icon';

export type PopconfirmSemanticClassNames = SemanticNames<PopconfirmSemanticName>;
export type PopconfirmSemanticStyles = SemanticStylesMap<PopconfirmSemanticName>;

const popconfirmBaseProps = () => ({
  ...abstractTooltipProps(),
  prefixCls: String,
  content: anyType(),
  title: anyType(),
  description: anyType(),
  okType: stringType<LegacyButtonType>('primary'),
  disabled: { type: Boolean, default: false },
  okText: anyType(),
  cancelText: anyType(),
  icon: anyType(),
  okButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  cancelButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  showCancel: { type: Boolean, default: true },
  onConfirm: Function as PropType<(e: MouseEvent) => void>,
  onCancel: Function as PropType<(e: MouseEvent) => void>,
  onPopupClick: Function as PropType<(e: MouseEvent) => void>,
});

type PopconfirmSemanticProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmBaseProps>>> & {
  classNames?: any;
  styles?: any;
};

export type PopconfirmClassNamesType =
  | PopconfirmSemanticClassNames
  | ((info: { props: PopconfirmSemanticProps }) => PopconfirmSemanticClassNames);

export type PopconfirmStylesType =
  | PopconfirmSemanticStyles
  | ((info: { props: PopconfirmSemanticProps }) => PopconfirmSemanticStyles);

export const popconfirmProps = () => ({
  ...popconfirmBaseProps(),
  /** 语义化 classNames（antd 5.25+/6.x）：root / container / body / title / content / arrow / icon */
  classNames: someType<PopconfirmClassNamesType>([Object, Function]),
  /** 语义化 styles（antd 5.25+/6.x）：root / container / body / title / content / arrow / icon */
  styles: someType<PopconfirmStylesType>([Object, Function]),
});

export type PopconfirmProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmProps>>>;

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

const Popconfirm = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopconfirm',
  inheritAttrs: false,
  props: initDefaultProps(popconfirmProps(), {
    ...omit(tooltipDefaultProps(), ['trigger', 'mouseEnterDelay', 'mouseLeaveDelay']),
    placement: 'top',
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
    okType: 'primary',
    disabled: false,
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    content?: any;
    description?: any;
    okText?: any;
    icon?: any;
    cancel?: any;
    cancelText?: any;
    cancelButton?: any;
    okButton?: any;
    default?: any;
  }>,
  // emits: ['update:open', 'visibleChange'],
  setup(props: PopconfirmProps, { slots, emit, expose, attrs }) {
    const rootRef = ref();
    warning(
      props.visible === undefined,
      'Popconfirm',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );
    expose({
      getPopupDomNode: () => {
        return rootRef.value?.getPopupDomNode?.();
      },
    });
    const [open, setOpen] = useMergedState(false, {
      defaultValue: props.defaultOpen ?? props.defaultVisible,
      value: toRef(props, 'open'),
    });

    const settingOpen = (value: boolean, e?: MouseEvent | KeyboardEvent) => {
      if (props.open === undefined) {
        setOpen(value);
      }

      emit('update:open', value);
      emit('openChange', value, e);
      emit('visibleChange', value, e);
    };

    const close = (e: MouseEvent) => {
      settingOpen(false, e);
    };

    const onConfirm = (e: MouseEvent) => {
      return props.onConfirm?.(e);
    };

    const onCancel = (e: MouseEvent) => {
      settingOpen(false, e);
      props.onCancel?.(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC && open.value) {
        settingOpen(false, e);
      }
    };

    const onOpenChange = (value: boolean) => {
      const { disabled } = props;
      if (disabled) {
        return;
      }
      settingOpen(value);
    };
    const { prefixCls: prefixClsConfirm, getPrefixCls } = useConfigInject('popconfirm', props);
    const {
      componentConfig: popconfirmConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('popconfirm');
    const rootPrefixCls = computed(() => getPrefixCls());
    const [wrapSSR] = usePopconfirmStyle(prefixClsConfirm);

    const resolvedSemantics = computed(() => {
      const mergedTrigger = props.trigger ?? popconfirmConfig.value.trigger ?? 'click';
      const mergedMouseEnterDelay =
        props.mouseEnterDelay ?? popconfirmConfig.value.mouseEnterDelay ?? 0.1;
      const mergedMouseLeaveDelay =
        props.mouseLeaveDelay ?? popconfirmConfig.value.mouseLeaveDelay ?? 0.1;
      const mergedArrow = props.arrow ?? popconfirmConfig.value.arrow ?? true;
      const semanticInfo = {
        props: {
          ...props,
          trigger: mergedTrigger,
          mouseEnterDelay: mergedMouseEnterDelay,
          mouseLeaveDelay: mergedMouseLeaveDelay,
          arrow: mergedArrow,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<PopconfirmSemanticClassNames>(
        resolveSemanticValue(contextClassNames.value, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<PopconfirmSemanticStyles>(
        resolveSemanticValue(contextStyles.value, semanticInfo),
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

    const renderOverlay = () => {
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      const overlaySlots: Record<string, any> = {};
      if (slots.title) overlaySlots.title = slots.title;
      if (slots.description) overlaySlots.description = slots.description;
      if (slots.icon) overlaySlots.icon = slots.icon;
      if (slots.okText) overlaySlots.okText = slots.okText;
      if (slots.cancelText) overlaySlots.cancelText = slots.cancelText;
      if (slots.cancel) overlaySlots.cancel = slots.cancel;
      if (slots.okButton) overlaySlots.okButton = slots.okButton;
      if (slots.cancelButton) overlaySlots.cancelButton = slots.cancelButton;

      return (
        <Overlay
          prefixCls={prefixClsConfirm.value}
          title={props.title}
          description={props.description}
          icon={props.icon}
          okType={props.okType}
          okText={props.okText}
          cancelText={props.cancelText}
          okButtonProps={props.okButtonProps}
          cancelButtonProps={props.cancelButtonProps}
          showCancel={props.showCancel}
          close={close}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onPopupClick={props.onPopupClick}
          classNames={mergedClassNames}
          styles={mergedStyles}
          v-slots={overlaySlots}
        />
      );
    };

    return () => {
      const { placement, overlayClassName, ...restProps } = props;
      const {
        mergedTrigger,
        mergedMouseEnterDelay,
        mergedMouseLeaveDelay,
        mergedArrow,
        mergedClassNames,
        mergedStyles,
      } = resolvedSemantics.value;
      const popoverClassNames = {
        root: mergedClassNames.root,
        container: mergedClassNames.container,
        body: mergedClassNames.body,
        arrow: mergedClassNames.arrow,
      };
      const popoverStyles = {
        root: mergedStyles.root,
        container: mergedStyles.container,
        body: mergedStyles.body,
        arrow: mergedStyles.arrow,
      };
      const mergedOverlayStyle =
        contextStyle.value || props.overlayStyle
          ? { ...contextStyle.value, ...props.overlayStyle }
          : undefined;
      const otherProps = omit(restProps, [
        'title',
        'content',
        'description',
        'icon',
        'cancelText',
        'okText',
        'okType',
        'okButtonProps',
        'cancelButtonProps',
        'showCancel',
        'onUpdate:open',
        'onVisibleChange',
        'onConfirm',
        'onCancel',
        'onPopupClick',
        'prefixCls',
        'classNames',
        'styles',
      ]);
      const overlayClassNames = classNames(
        prefixClsConfirm.value,
        contextClassName.value,
        overlayClassName,
      );
      return wrapSSR(
        <Popover
          {...otherProps}
          {...attrs}
          trigger={mergedTrigger}
          mouseEnterDelay={mergedMouseEnterDelay}
          mouseLeaveDelay={mergedMouseLeaveDelay}
          arrow={mergedArrow}
          placement={placement}
          onOpenChange={onOpenChange}
          open={open.value}
          overlayClassName={overlayClassNames}
          overlayStyle={mergedOverlayStyle}
          classNames={popoverClassNames}
          styles={popoverStyles}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          v-slots={{ content: renderOverlay }}
          ref={rootRef}
          data-popover-inject
          data-popconfirm-inject
        >
          {cloneVNodes(
            slots.default?.() || [],
            {
              onKeydown: (e: KeyboardEvent) => {
                onKeyDown(e);
              },
            },
            false,
          )}
        </Popover>,
      );
    };
  },
});

(Popconfirm as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export default withInstall(Popconfirm) as typeof Popconfirm &
  Plugin & {
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
