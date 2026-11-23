import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  shallowRef,
  Text,
  watch,
  watchEffect,
} from 'vue';
import Wave from '../_util/wave';
import buttonProps from './buttonTypes';
import { filterEmpty, flattenChildren, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import devWarning from '../vc-util/devWarning';
import LoadingIcon from './LoadingIcon';
import useStyle from './style';
import type {
  ButtonColorType,
  ButtonProps,
  ButtonSemanticClassNames,
  ButtonSemanticStyles,
  ButtonShape,
  ButtonType,
  ButtonVariantType,
} from './buttonTypes';
import type { VNode } from 'vue';
import { GroupSizeContext } from './button-group';
import { useCompactItemContext } from '../space/Compact';
import type { CustomSlotsType } from '../_util/type';

type Loading = boolean | number;

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

const variantToType = (
  variant?: ButtonVariantType,
  color?: ButtonColorType,
): ButtonType | undefined => {
  switch (variant) {
    case 'solid':
      return color === 'primary' || color === undefined ? 'primary' : 'default';
    case 'dashed':
      return 'dashed';
    case 'text':
      return 'text';
    case 'link':
      return 'link';
    case 'outlined':
      return 'default';
    case 'filled':
      return 'default';
    default:
      return undefined;
  }
};

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}
export { buttonProps };
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: buttonProps(),
  slots: Object as CustomSlotsType<{
    icon: any;
    default: any;
  }>,
  // emits: ['click', 'mousedown'],
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, autoInsertSpaceInButton, direction, size, configProvider } = useConfigInject(
      'btn',
      props,
    );
    const contextButton = computed(() => configProvider.button?.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const groupSizeContext = GroupSizeContext.useInject();
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);
    const buttonNodeRef = shallowRef<HTMLElement>(null);
    const delayTimeoutRef = shallowRef(undefined);
    let isNeedInserted = false;

    const innerLoading = shallowRef<Loading>(false);
    const hasTwoCNChar = shallowRef(false);

    const autoInsertSpace = computed(
      () =>
        (props.autoInsertSpace ??
          contextButton.value?.autoInsertSpace ??
          autoInsertSpaceInButton.value) !== false,
    );
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

    // =============== Update Loading ===============
    const loadingOrDelay = computed(() =>
      typeof props.loading === 'object' && props.loading.delay
        ? props.loading.delay || true
        : !!props.loading,
    );

    watch(
      loadingOrDelay,
      val => {
        clearTimeout(delayTimeoutRef.value);
        if (typeof loadingOrDelay.value === 'number') {
          delayTimeoutRef.value = setTimeout(() => {
            innerLoading.value = val;
          }, loadingOrDelay.value);
        } else {
          innerLoading.value = val;
        }
      },
      {
        immediate: true,
      },
    );

    const colorVariantPair = computed<[ButtonColorType | undefined, ButtonVariantType | undefined]>(
      () => {
        const { color, variant, type, danger } = props;
        const ctxColor = contextButton.value?.color as ButtonColorType | undefined;
        const ctxVariant = contextButton.value?.variant as ButtonVariantType | undefined;

        if (color && variant) {
          return [color, variant];
        }
        if (color) {
          const fallbackVariant: ButtonVariantType =
            type === 'primary'
              ? 'solid'
              : type === 'dashed'
              ? 'dashed'
              : type === 'text'
              ? 'text'
              : type === 'link'
              ? 'link'
              : ctxVariant || 'outlined';
          return [color, fallbackVariant];
        }
        if (variant) {
          if (danger) {
            return ['danger', variant];
          }
          if (variant === 'solid') {
            return ['primary', 'solid'];
          }
          return [ctxColor, variant];
        }
        if (type !== undefined || danger) {
          return [undefined, undefined];
        }
        if (ctxColor && ctxVariant) {
          return [ctxColor, ctxVariant];
        }
        if (ctxVariant) {
          if (ctxVariant === 'solid') {
            return ['primary', 'solid'];
          }
          return [undefined, ctxVariant];
        }
        if (ctxColor) {
          return [ctxColor, 'outlined'];
        }
        return [undefined, undefined];
      },
    );

    const mergedType = computed<ButtonType>(() => {
      const [resolvedColor, resolvedVariant] = colorVariantPair.value;
      if (resolvedVariant !== undefined) {
        return variantToType(resolvedVariant, resolvedColor) || 'default';
      }
      return props.type || 'default';
    });

    const mergedIconPlacement = computed<'start' | 'end'>(
      () => props.iconPlacement ?? props.iconPosition ?? 'start',
    );

    const mergedShape = computed<ButtonShape>(
      () => props.shape || (contextButton.value?.shape as ButtonShape) || 'default',
    );

    const mergedSize = computed(() => compactSize.value || groupSizeContext?.size || size.value);

    const mergedPropsForSemantic = computed<ButtonProps>(() => ({
      ...props,
      type: mergedType.value,
      color: colorVariantPair.value[0],
      variant: colorVariantPair.value[1],
      danger: props.danger || colorVariantPair.value[0] === 'danger',
      shape: mergedShape.value,
      size: mergedSize.value,
      disabled: mergedDisabled.value,
      loading: !!innerLoading.value,
      iconPlacement: mergedIconPlacement.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ButtonSemanticClassNames,
      ButtonSemanticStyles,
      ButtonProps
    >(
      () => [contextButton.value?.classNames, props.classNames],
      () => [contextButton.value?.styles, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const classes = computed(() => {
      const { ghost, block, danger } = props;
      const shape = mergedShape.value;
      const [resolvedColor, resolvedVariant] = colorVariantPair.value;
      const currentType = mergedType.value;
      const mergedDanger = danger || resolvedColor === 'danger';
      const colorCls = resolvedColor === 'danger' ? 'dangerous' : resolvedColor;
      const pre = prefixCls.value;

      const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };
      const sizeFullname = mergedSize.value;
      const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : '';

      return [
        compactItemClassnames.value,
        {
          [hashId.value]: true,
          [`${pre}`]: true,
          [`${pre}-${shape}`]: shape !== 'default' && shape,
          [`${pre}-${currentType}`]: currentType,
          [`${pre}-filled`]: resolvedVariant === 'filled',
          [`${pre}-color-${colorCls}`]: !!colorCls,
          [`${pre}-variant-${resolvedVariant}`]: !!resolvedVariant,
          [`${pre}-${sizeCls}`]: sizeCls,
          [`${pre}-loading`]: innerLoading.value,
          [`${pre}-background-ghost`]: ghost && !isUnBorderedButtonType(currentType),
          [`${pre}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
          [`${pre}-block`]: block,
          [`${pre}-dangerous`]: !!mergedDanger,
          [`${pre}-icon-end`]: mergedIconPlacement.value === 'end',
          [`${pre}-rtl`]: direction.value === 'rtl',
        },
      ];
    });

    const fixTwoCNChar = () => {
      // Fix for HOC usage like <FormatMessage />
      const node = buttonNodeRef.value!;
      if (!node || !autoInsertSpace.value) {
        return;
      }
      const buttonText = node.textContent;

      if (isNeedInserted && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar.value) {
          hasTwoCNChar.value = true;
        }
      } else if (hasTwoCNChar.value) {
        hasTwoCNChar.value = false;
      }
    };
    const handleClick = (event: Event) => {
      // https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || mergedDisabled.value) {
        event.preventDefault();
        return;
      }
      emit('click', event);
    };
    const handleMousedown = (event: Event) => {
      emit('mousedown', event);
    };

    const insertSpace = (child: VNode, needInserted: boolean) => {
      const SPACE = needInserted ? ' ' : '';
      const contentCls = mergedClassNames.value.content;
      const contentStyle = mergedStyles.value.content;
      if (child.type === Text) {
        let text = (child.children as string).trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return (
          <span class={contentCls} style={contentStyle}>
            {text}
          </span>
        );
      }
      if (contentCls || contentStyle) {
        const extraProps: Record<string, any> = {};
        if (contentCls) extraProps.class = contentCls;
        if (contentStyle) extraProps.style = contentStyle;
        if (isValidElement(child)) {
          return cloneElement(child, extraProps, false);
        }
        return (
          <span class={contentCls} style={contentStyle}>
            {child}
          </span>
        );
      }
      return child;
    };

    watchEffect(() => {
      devWarning(
        !(props.ghost && isUnBorderedButtonType(mergedType.value)),
        'Button',
        "`link` or `text` button can't be a `ghost` button.",
      );
    });

    onMounted(fixTwoCNChar);
    onUpdated(fixTwoCNChar);

    onBeforeUnmount(() => {
      delayTimeoutRef.value && clearTimeout(delayTimeoutRef.value);
    });

    const focus = () => {
      buttonNodeRef.value?.focus();
    };
    const blur = () => {
      buttonNodeRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });

    return () => {
      const { icon = slots.icon?.() } = props;
      const children = flattenChildren(slots.default?.());

      isNeedInserted = children.length === 1 && !icon && !isUnBorderedButtonType(mergedType.value);

      const { htmlType, href, title, target } = props;

      const iconType = innerLoading.value ? 'loading' : icon;
      const contextStyle = contextButton.value?.style;
      const rootStyle = mergedStyles.value.root;
      const buttonProps = {
        ...attrs,
        title,
        disabled: mergedDisabled.value,
        ...(contextStyle || rootStyle
          ? { style: [contextStyle, rootStyle, attrs.style as any] }
          : {}),
        class: [
          classes.value,
          contextButton.value?.className,
          mergedClassNames.value.root,
          props.rootClassName,
          attrs.class,
          { [`${prefixCls.value}-icon-only`]: children.length === 0 && !!iconType },
        ],
        onClick: handleClick,
        onMousedown: handleMousedown,
      };
      // https://github.com/vueComponent/ant-design-vue/issues/4930
      if (!mergedDisabled.value) {
        delete buttonProps.disabled;
      }

      const iconCls = mergedClassNames.value.icon;
      const iconStyle = mergedStyles.value.icon;
      const renderIconElement = (node: any) => {
        const extraProps: Record<string, any> = {};
        if (iconCls) extraProps.class = iconCls;
        if (iconStyle) extraProps.style = iconStyle;
        const targetNode = Array.isArray(node) ? filterEmpty(node)[0] : node;
        if (isValidElement(targetNode)) {
          return cloneElement(targetNode, extraProps, false);
        }
        if (iconCls || iconStyle) {
          return (
            <span class={iconCls} style={iconStyle}>
              {node}
            </span>
          );
        }
        return node;
      };

      const customLoadingIcon =
        (typeof props.loading === 'object' && props.loading?.icon) ||
        contextButton.value?.loadingIcon;

      let iconNode: any;
      if (icon && !innerLoading.value) {
        iconNode = renderIconElement(icon);
      } else if (innerLoading.value && customLoadingIcon) {
        iconNode = renderIconElement(customLoadingIcon);
      } else {
        iconNode = (
          <LoadingIcon
            existIcon={!!icon}
            prefixCls={prefixCls.value}
            loading={!!innerLoading.value}
            iconClassName={iconCls}
            iconStyle={iconStyle}
          />
        );
      }

      const kids = children.map(child =>
        insertSpace(child, isNeedInserted && autoInsertSpace.value),
      );

      if (href !== undefined) {
        return wrapSSR(
          <a {...buttonProps} href={href} target={target} ref={buttonNodeRef}>
            {iconNode}
            {kids}
          </a>,
        );
      }

      let buttonNode = (
        <button {...buttonProps} ref={buttonNodeRef} type={htmlType}>
          {iconNode}
          {kids}
        </button>
      );

      if (!isUnBorderedButtonType(mergedType.value)) {
        buttonNode = (
          <Wave ref="wave" disabled={!!innerLoading.value}>
            {buttonNode}
          </Wave>
        );
      }

      return wrapSSR(buttonNode);
    };
  },
});
