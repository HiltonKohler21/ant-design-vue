import type { HTMLAttributes, App, PropType, ExtractPropTypes, Plugin, CSSProperties } from 'vue';
import { shallowRef, defineComponent, watchEffect, computed } from 'vue';
import { TinyColor } from '@ctrl/tinycolor';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Wave from '../_util/wave';
import type { PresetColorType, PresetStatusColorType } from '../_util/colors';
import { isPresetColor, isPresetStatusColor } from '../_util/colors';
import { eventType } from '../_util/type';
import type { CustomSlotsType, LiteralUnion, VueNode } from '../_util/type';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import pickAttrs from '../_util/pickAttrs';
import CheckableTag from './CheckableTag';
import type { CheckableTagProps } from './CheckableTag';
import CheckableTagGroup from './CheckableTagGroup';
import type { CheckableTagGroupProps, CheckableTagOption } from './CheckableTagGroup';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import warning from '../_util/warning';

import useStyle from './style';

export type TagVariant = 'filled' | 'solid' | 'outlined';

export type TagSemanticName = 'root' | 'icon' | 'content' | 'close';
export type TagSemanticClassNames = Partial<Record<TagSemanticName, string>>;
export type TagSemanticStyles = Partial<Record<TagSemanticName, CSSProperties>>;

export type TagClassNamesType =
  | TagSemanticClassNames
  | ((info: { props: TagProps }) => TagSemanticClassNames);

export type TagStylesType = TagSemanticStyles | ((info: { props: TagProps }) => TagSemanticStyles);

export interface TagClosableConfig {
  closeIcon?: VueNode;
  disabled?: boolean;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type TagClosableType = boolean | TagClosableConfig;

const isPlainObj = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const resolveSemantic = <T, P>(
  semantic: T | ((info: { props: P }) => T) | undefined,
  props: P,
): T | undefined => {
  if (typeof semantic === 'function') {
    return (semantic as (info: { props: P }) => T)({ props });
  }
  return semantic;
};

export const tagProps = () => ({
  prefixCls: String,
  rootClassName: String,
  color: {
    type: String as PropType<LiteralUnion<PresetColorType | PresetStatusColorType>>,
  },
  variant: {
    type: String as PropType<TagVariant>,
    default: undefined,
  },
  closable: {
    type: [Boolean, Object] as PropType<TagClosableType>,
    default: undefined,
  },
  closeIcon: PropTypes.any,
  /** @deprecated `visible` will be removed in next major version. */
  visible: { type: Boolean, default: undefined },
  onClose: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  onClick: eventType<(e: MouseEvent) => void>(),
  'onUpdate:visible': Function as PropType<(vis: boolean) => void>,
  icon: PropTypes.any,
  /** @deprecated Please use `variant="filled"` instead */
  bordered: { type: Boolean, default: true },
  disabled: { type: Boolean, default: undefined },
  href: String,
  target: String,
  classNames: [Object, Function] as PropType<TagClassNamesType>,
  styles: [Object, Function] as PropType<TagStylesType>,
});

export type TagProps = HTMLAttributes & Partial<ExtractPropTypes<ReturnType<typeof tagProps>>>;

const Tag = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATag',
  inheritAttrs: false,
  props: tagProps(),
  slots: Object as CustomSlotsType<{
    closeIcon: any;
    icon: any;
    default: any;
  }>,
  setup(props, { slots, emit, attrs }) {
    const { prefixCls, direction, configProvider } = useConfigInject('tag', props);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);
    const tagConfig = computed(() => configProvider.tag?.value as any);

    const [wrapSSR, hashId] = useStyle(prefixCls);

    const visible = shallowRef(true);

    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      warning(
        props.visible === undefined,
        'Tag',
        '`visible` is deprecated, please use `<Tag v-show="visible" />` instead.',
      );
    }

    watchEffect(() => {
      if (props.visible !== undefined) {
        visible.value = props.visible!;
      }
    });

    const colorState = computed(() => {
      const { color, variant, bordered } = props;
      const ctxVariant = tagConfig.value?.variant as TagVariant | undefined;
      const isInverseColor = typeof color === 'string' && color.endsWith('-inverse');

      let explicitVariant: TagVariant | undefined;
      if (variant) {
        explicitVariant = variant;
      } else if (isInverseColor) {
        explicitVariant = 'solid';
      } else if (bordered === false) {
        explicitVariant = 'filled';
      } else if (ctxVariant) {
        explicitVariant = ctxVariant;
      }

      const mergedVariant: TagVariant = explicitVariant ?? 'outlined';

      let nextColor = isInverseColor ? color.replace(/-inverse$/, '') : color;
      if (nextColor === undefined && mergedVariant === 'solid') {
        nextColor = 'default';
      }

      const nextIsPreset = isPresetColor(nextColor, false);
      const nextIsStatus = isPresetStatusColor(nextColor);
      const isInternal = nextIsPreset || nextIsStatus;

      const customStyle: CSSProperties = {};
      if (!isInternal && nextColor) {
        if (!explicitVariant || mergedVariant === 'solid') {
          customStyle.backgroundColor = nextColor;
        } else {
          const tc = new TinyColor(nextColor);
          if (tc.isValid) {
            customStyle.backgroundColor = tc.clone().setAlpha(0.1).toRgbString();
          }
          customStyle.color = nextColor;
          if (mergedVariant === 'outlined') {
            customStyle.borderColor = nextColor;
          }
        }
      }

      return {
        explicitVariant,
        mergedVariant,
        mergedColor: nextColor,
        isInverseColor,
        isInternalColor: isInternal,
        customStyle,
      };
    });

    const handleCloseClick = (e: MouseEvent) => {
      const closableObj = isPlainObj(props.closable) ? props.closable : undefined;
      const ctxClosableObj = isPlainObj(tagConfig.value?.closable)
        ? tagConfig.value.closable
        : undefined;
      if (mergedDisabled.value || closableObj?.disabled || ctxClosableObj?.disabled) {
        return;
      }
      e.stopPropagation();
      emit('update:visible', false);
      emit('close', e);

      if (e.defaultPrevented) {
        return;
      }
      if (props.href) {
        e.preventDefault();
      }
      if (props.visible === undefined) {
        visible.value = false;
      }
    };

    const handleCloseKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!e.repeat) {
          (e.currentTarget as HTMLElement)?.click();
        }
      }
    };

    const tagClassName = computed(() => {
      const { explicitVariant, mergedColor, isInverseColor, isInternalColor } = colorState.value;
      return classNames(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-${explicitVariant}`]: !!explicitVariant,
        [`${prefixCls.value}-${mergedColor}`]: isInternalColor,
        ...(isInverseColor ? { [`${prefixCls.value}-${props.color}`]: true } : {}),
        [`${prefixCls.value}-has-color`]:
          props.color && !isInternalColor && (!explicitVariant || explicitVariant === 'solid'),
        [`${prefixCls.value}-hidden`]: !visible.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-borderless`]: !props.bordered,
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      });
    });

    const handleClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        e.preventDefault();
        return;
      }
      emit('click', e);
    };

    return () => {
      const ctxTag = tagConfig.value;
      const { icon = slots.icon?.(), href, target } = props;
      const closableObj = isPlainObj(props.closable) ? props.closable : undefined;
      const ctxClosableObj = isPlainObj(ctxTag?.closable) ? ctxTag.closable : undefined;
      const slotCloseIcon = slots.closeIcon?.();

      const customCloseIcon =
        closableObj?.closeIcon ??
        props.closeIcon ??
        slotCloseIcon ??
        ctxClosableObj?.closeIcon ??
        ctxTag?.closeIcon;

      const isClosable = (() => {
        if (closableObj) {
          return true;
        }
        if (typeof props.closable === 'boolean') {
          return props.closable;
        }
        if (
          (props.closeIcon !== false &&
            props.closeIcon !== undefined &&
            props.closeIcon !== null) ||
          slotCloseIcon !== undefined
        ) {
          return true;
        }
        return !!ctxTag?.closable;
      })();

      const closeDisabled = !!(
        mergedDisabled.value ||
        closableObj?.disabled ||
        ctxClosableObj?.disabled
      );

      const closeAriaProps = pickAttrs(closableObj ?? ctxClosableObj ?? {}, {
        aria: true,
        data: true,
      });

      const mergedPropsForSemantic = {
        ...props,
        color: colorState.value.mergedColor,
        variant: colorState.value.mergedVariant,
        disabled: mergedDisabled.value,
      } as TagProps;

      const mergedClassNames = mergeSemanticClassNames<TagSemanticClassNames>(
        resolveSemantic(ctxTag?.classNames, mergedPropsForSemantic),
        resolveSemantic(props.classNames, mergedPropsForSemantic),
      );
      const mergedStyles = mergeSemanticStyles<TagSemanticStyles>(
        resolveSemantic(ctxTag?.styles, mergedPropsForSemantic),
        resolveSemantic(props.styles, mergedPropsForSemantic),
      );

      const renderCloseIcon = () => {
        if (!isClosable || customCloseIcon === false || customCloseIcon === null) {
          return null;
        }
        const iconContent =
          customCloseIcon === undefined || customCloseIcon === true ? (
            <CloseOutlined />
          ) : (
            customCloseIcon
          );
        return (
          <span
            role="button"
            tabindex={closeDisabled ? -1 : 0}
            aria-disabled={closeDisabled || undefined}
            class={classNames(`${prefixCls.value}-close-icon`, mergedClassNames.close)}
            style={mergedStyles.close}
            onClick={handleCloseClick}
            onKeydown={handleCloseKeyDown}
            {...closeAriaProps}
          >
            {iconContent}
          </span>
        );
      };

      const tagStyle: CSSProperties = mergedDisabled.value
        ? { ...mergedStyles.root }
        : { ...colorState.value.customStyle, ...mergedStyles.root };

      const iconNode = icon ? (
        isValidElement(icon) ? (
          cloneElement(icon, {
            class: classNames(icon.props?.class, mergedClassNames.icon),
            style: mergedStyles.icon ? [icon.props?.style, mergedStyles.icon] : icon.props?.style,
          })
        ) : mergedClassNames.icon || mergedStyles.icon ? (
          <span class={mergedClassNames.icon} style={mergedStyles.icon}>
            {icon}
          </span>
        ) : (
          icon
        )
      ) : null;

      const children = slots.default?.();
      const needsContentWrap = !!(iconNode || mergedClassNames.content || mergedStyles.content);
      const kids = iconNode ? (
        <>
          {iconNode}
          <span class={mergedClassNames.content} style={mergedStyles.content}>
            {children}
          </span>
        </>
      ) : needsContentWrap ? (
        <span class={mergedClassNames.content} style={mergedStyles.content}>
          {children}
        </span>
      ) : (
        children
      );

      const isNeedWave = props.onClick !== undefined && !mergedDisabled.value;
      const commonProps = {
        ...attrs,
        onClick: mergedDisabled.value ? undefined : handleClick,
        class: [
          tagClassName.value,
          ctxTag?.className,
          props.rootClassName,
          mergedClassNames.root,
          attrs.class,
        ],
        style: [ctxTag?.style, tagStyle, attrs.style as CSSProperties],
      };

      const tagNode = href ? (
        <a
          {...commonProps}
          href={mergedDisabled.value ? undefined : href}
          target={target}
          aria-disabled={mergedDisabled.value || undefined}
        >
          {kids}
          {renderCloseIcon()}
        </a>
      ) : (
        <span {...commonProps}>
          {kids}
          {renderCloseIcon()}
        </span>
      );

      return wrapSSR(isNeedWave ? <Wave>{tagNode}</Wave> : tagNode);
    };
  },
});

Tag.CheckableTag = CheckableTag;
Tag.CheckableTagGroup = CheckableTagGroup;

Tag.install = function (app: App) {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
  app.component(CheckableTagGroup.name, CheckableTagGroup);
  return app;
};

export { CheckableTag, CheckableTagGroup };
export type { CheckableTagProps, CheckableTagGroupProps, CheckableTagOption };

export default Tag as typeof Tag &
  Plugin & {
    readonly CheckableTag: typeof CheckableTag;
    readonly CheckableTagGroup: typeof CheckableTagGroup;
  };
