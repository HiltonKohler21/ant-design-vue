import classNames from '../_util/classNames';
import type { CSSProperties } from 'vue';
import { defineComponent, computed, ref, isVNode } from 'vue';
import Tooltip from '../tooltip';
import Badge from '../badge';
import Content from './FloatButtonContent';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import { useInjectFloatButtonGroupContext } from './context';
import warning from '../_util/warning';
import scrollTo from '../_util/scrollTo';
import { initDefaultProps } from '../_util/props-util';
import {
  floatButtonProps,
  type FloatButtonClassNamesType,
  type FloatButtonProps,
  type FloatButtonSemanticClassNames,
  type FloatButtonSemanticStyles,
  type FloatButtonStylesType,
} from './interface';

// CSSINJS
import useStyle from './style';

export const floatButtonPrefixCls = 'float-btn';

const FloatButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButton',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonProps(), { type: 'default', shape: 'circle' }),
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('floatButton');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const groupContext = useInjectFloatButtonGroupContext();

    const floatButtonRef = ref<HTMLAnchorElement | HTMLButtonElement>(null);

    const mergeShape = computed(() => {
      return groupContext.shape?.value || props.shape || 'circle';
    });

    const mergedPropsForSemantic = computed<FloatButtonProps>(() => ({
      ...props,
      type: props.type || 'default',
      shape: mergeShape.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FloatButtonSemanticClassNames,
      FloatButtonSemanticStyles,
      FloatButtonProps
    >(
      () => [
        contextClassNames.value as FloatButtonClassNamesType,
        groupContext.classNames?.value,
        props.classNames,
      ],
      () => [
        contextStyles.value as FloatButtonStylesType,
        groupContext.styles?.value,
        props.styles,
      ],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    return () => {
      const {
        prefixCls: customPrefixCls,
        rootClassName,
        classNames: _classNames,
        styles: _styles,
        type = 'default',
        shape,
        icon,
        content,
        description,
        tooltip,
        badge = {},
        backTop,
        htmlType,
        onClick,
        ...restProps
      } = props;

      const mergedContent = content ?? slots.content?.() ?? description ?? slots.description?.();
      const iconSlot = slots.icon || (icon !== undefined ? () => icon : undefined);

      const handleClick = (e: MouseEvent) => {
        if (props.backTop) {
          scrollTo(0);
        }
        onClick?.(e);
      };

      const mergedIndividual = groupContext.individual?.value ?? true;
      const classString = classNames(
        prefixCls.value,
        `${prefixCls.value}-${type}`,
        `${prefixCls.value}-${mergeShape.value}`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-individual`]: mergedIndividual,
        },
        contextClassName.value,
        mergedClassNames.value.root,
        attrs.class,
        rootClassName,
        hashId.value,
      );

      const styleList = [contextStyle.value, mergedStyles.value.root, attrs.style].filter(Boolean);
      const mergedStyle: CSSProperties | CSSProperties[] | undefined =
        styleList.length === 0
          ? undefined
          : styleList.length === 1
          ? (styleList[0] as CSSProperties)
          : (styleList as CSSProperties[]);

      const isTooltipPropsObject =
        tooltip && typeof tooltip === 'object' && !isVNode(tooltip) && !Array.isArray(tooltip);
      const tooltipProps = isTooltipPropsObject ? tooltip : {};
      const tooltipTitleSlot = slots.tooltip
        ? () => slots.tooltip?.()
        : isTooltipPropsObject
        ? tooltip.title !== undefined
          ? () => tooltip.title
          : undefined
        : tooltip
        ? () => tooltip
        : undefined;

      const buttonNode = (
        <Tooltip
          placement="left"
          {...tooltipProps}
          v-slots={{
            title: tooltipTitleSlot,
            default: () => (
              <Badge {...badge}>
                <div class={`${prefixCls.value}-body`}>
                  <Content
                    prefixCls={prefixCls.value}
                    classNames={mergedClassNames.value}
                    styles={mergedStyles.value}
                    v-slots={{
                      icon: iconSlot,
                      description: () => mergedContent,
                    }}
                  ></Content>
                </div>
              </Badge>
            ),
          }}
        ></Tooltip>
      );

      if (process.env.NODE_ENV !== 'production') {
        warning(
          !(mergeShape.value === 'circle' && mergedContent),
          'FloatButton',
          'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.',
        );
      }

      return wrapSSR(
        props.href ? (
          <a
            ref={floatButtonRef}
            {...attrs}
            {...(restProps as any)}
            style={mergedStyle as any}
            class={classString}
            onClick={handleClick}
          >
            {buttonNode}
          </a>
        ) : (
          <button
            ref={floatButtonRef}
            {...attrs}
            {...restProps}
            style={mergedStyle as any}
            class={classString}
            type={props.htmlType || 'button'}
            disabled={props.disabled}
            onClick={handleClick}
          >
            {buttonNode}
          </button>
        ),
      );
    };
  },
});

export default FloatButton;
