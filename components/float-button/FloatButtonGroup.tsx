import type { CSSProperties, PropType } from 'vue';
import { defineComponent, ref, computed, watch, onBeforeUnmount, Transition } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined';
import classNames from '../_util/classNames';
import { getTransitionProps } from '../_util/transition';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import { useProvideFloatButtonGroupContext } from './context';
import { findDOMNode, initDefaultProps } from '../_util/props-util';
import {
  floatButtonGroupProps,
  type FloatButtonGroupClassNamesType,
  type FloatButtonGroupProps,
  type FloatButtonGroupSemanticClassNames,
  type FloatButtonGroupSemanticStyles,
  type FloatButtonGroupStylesType,
  type FloatButtonSemanticClassNames,
  type FloatButtonSemanticStyles,
  type FloatButtonShape,
} from './interface';
import canUseDom from '../_util/canUseDom';

// CSSINJS
import useStyle from './style';
import useMergedState from '../_util/hooks/useMergedState';

const TriggerContextProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonGroupTriggerContext',
  props: {
    shape: { type: String as PropType<FloatButtonShape> },
    classNames: { type: Object as PropType<FloatButtonSemanticClassNames> },
    styles: { type: Object as PropType<FloatButtonSemanticStyles> },
  },
  setup(props, { slots }) {
    useProvideFloatButtonGroupContext({
      shape: computed(() => props.shape),
      classNames: computed(() => props.classNames),
      styles: computed(() => props.styles),
    });
    return () => slots.default?.();
  },
});

const FloatButtonGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonGroup',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonGroupProps(), {
    type: 'default',
    shape: 'circle',
    placement: 'top',
  } as FloatButtonGroupProps),
  setup(props, { attrs, slots, emit }) {
    const {
      prefixCls,
      direction,
      disabled: mergedDisabled,
    } = useConfigInject(floatButtonPrefixCls, props);
    const {
      componentConfig: groupComponentConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('floatButtonGroup');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const [open, setOpen] = useMergedState(false, { value: computed(() => props.open) });

    const floatButtonGroupRef = ref<HTMLDivElement>(null);
    const floatButtonRef = ref<HTMLButtonElement | HTMLAnchorElement>(null);

    const mergedPlacement = computed(() =>
      ['top', 'left', 'right', 'bottom'].includes(props.placement!) ? props.placement : 'top',
    );

    const mergedPropsForSemantic = computed<FloatButtonGroupProps>(() => ({
      ...props,
      shape: props.shape || 'circle',
      type: props.type || 'default',
      placement: mergedPlacement.value,
      disabled: mergedDisabled.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FloatButtonGroupSemanticClassNames,
      FloatButtonGroupSemanticStyles,
      FloatButtonGroupProps
    >(
      () => [contextClassNames.value as FloatButtonGroupClassNamesType, props.classNames],
      () => [contextStyles.value as FloatButtonGroupStylesType, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const itemSemanticClassNames = computed<FloatButtonSemanticClassNames>(() => ({
      root: mergedClassNames.value.item,
      icon: mergedClassNames.value.itemIcon,
      content: mergedClassNames.value.itemContent,
    }));

    const itemSemanticStyles = computed<FloatButtonSemanticStyles>(() => ({
      root: mergedStyles.value.item,
      icon: mergedStyles.value.itemIcon,
      content: mergedStyles.value.itemContent,
    }));

    const triggerSemanticClassNames = computed<FloatButtonSemanticClassNames>(() => ({
      root: mergedClassNames.value.trigger,
      icon: mergedClassNames.value.triggerIcon,
      content: mergedClassNames.value.triggerContent,
    }));

    const triggerSemanticStyles = computed<FloatButtonSemanticStyles>(() => ({
      root: mergedStyles.value.trigger,
      icon: mergedStyles.value.triggerIcon,
      content: mergedStyles.value.triggerContent,
    }));

    useProvideFloatButtonGroupContext({
      shape: computed(() => props.shape),
      classNames: itemSemanticClassNames,
      styles: itemSemanticStyles,
    });

    const triggerOpen = (nextOpen: boolean) => {
      if (mergedDisabled.value) {
        return;
      }
      if (open.value !== nextOpen) {
        setOpen(nextOpen);
        emit('update:open', nextOpen);
        props.onOpenChange?.(nextOpen);
      }
    };

    const hoverTypeAction = {
      onMouseenter() {
        triggerOpen(true);
      },
      onMouseleave() {
        triggerOpen(false);
      },
    };
    const hoverAction = computed(() => {
      return props.trigger === 'hover' ? hoverTypeAction : {};
    });

    const handleOpenChange = () => {
      triggerOpen(!open.value);
    };

    const onClick = (e: MouseEvent) => {
      if (floatButtonGroupRef.value?.contains(e.target as Node)) {
        if (findDOMNode(floatButtonRef.value)?.contains(e.target as Node)) {
          handleOpenChange();
        }
        return;
      }
      triggerOpen(false);
    };

    watch(
      computed(() => props.trigger),
      value => {
        if (!canUseDom()) {
          return;
        }
        document.removeEventListener('click', onClick);
        if (value === 'click') {
          document.addEventListener('click', onClick);
        }
      },
      { immediate: true },
    );
    onBeforeUnmount(() => {
      document.removeEventListener('click', onClick);
    });

    return () => {
      const {
        shape = 'circle',
        type = 'default',
        tooltip,
        content,
        description,
        icon,
        closeIcon,
        trigger,
        items,
        rootClassName,
        badge,
        href,
        target,
        htmlType,
        onClick: onTriggerButtonClick,
      } = props;

      const isMenuMode = Boolean(trigger && ['click', 'hover'].includes(trigger));
      const contextCloseIcon = (groupComponentConfig.value as any)?.closeIcon;

      const childrenNode = items
        ? items.map((item, index) => <FloatButton key={index} {...item} />)
        : slots.default?.();

      const groupPrefixCls = `${prefixCls.value}-group`;

      const groupCls = classNames(
        groupPrefixCls,
        hashId.value,
        contextClassName.value,
        mergedClassNames.value.root,
        rootClassName,
        attrs.class,
        {
          [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
          [`${groupPrefixCls}-${shape}`]: shape,
          [`${groupPrefixCls}-${shape}-shadow`]: !trigger,
          [`${groupPrefixCls}-${mergedPlacement.value}`]: isMenuMode,
          [`${groupPrefixCls}-menu-mode`]: isMenuMode,
        },
      );

      const styleList = [contextStyle.value, mergedStyles.value.root, attrs.style].filter(Boolean);
      const mergedStyle: CSSProperties | CSSProperties[] | undefined =
        styleList.length === 0
          ? undefined
          : styleList.length === 1
          ? (styleList[0] as CSSProperties)
          : (styleList as CSSProperties[]);

      const wrapperCls = classNames(
        hashId.value,
        `${groupPrefixCls}-wrap`,
        `${groupPrefixCls}-list`,
        mergedClassNames.value.list,
      );

      const transitionProps = getTransitionProps(`${groupPrefixCls}-wrap`);
      const hasStaticListSemantic = Boolean(mergedClassNames.value.list || mergedStyles.value.list);

      return wrapSSR(
        <div
          ref={floatButtonGroupRef}
          {...attrs}
          style={mergedStyle as any}
          class={groupCls}
          {...hoverAction.value}
        >
          {isMenuMode ? (
            <>
              <Transition {...transitionProps}>
                <div v-show={open.value} class={wrapperCls} style={mergedStyles.value.list}>
                  {childrenNode}
                </div>
              </Transition>
              <TriggerContextProvider
                shape={shape}
                classNames={triggerSemanticClassNames.value}
                styles={triggerSemanticStyles.value}
              >
                <FloatButton
                  ref={floatButtonRef}
                  class={`${groupPrefixCls}-trigger`}
                  type={type}
                  shape={shape}
                  tooltip={tooltip}
                  content={content}
                  description={description}
                  badge={badge}
                  href={href}
                  target={target}
                  htmlType={htmlType}
                  disabled={mergedDisabled.value}
                  onClick={onTriggerButtonClick}
                  v-slots={{
                    icon: () =>
                      open.value
                        ? slots.closeIcon?.() ?? closeIcon ?? contextCloseIcon ?? <CloseOutlined />
                        : slots.icon?.() ?? icon ?? <FileTextOutlined />,
                    tooltip: slots.tooltip,
                    content: slots.content,
                    description: slots.description,
                  }}
                ></FloatButton>
              </TriggerContextProvider>
            </>
          ) : hasStaticListSemantic ? (
            <div
              class={classNames(`${groupPrefixCls}-list`, mergedClassNames.value.list)}
              style={mergedStyles.value.list}
            >
              {childrenNode}
            </div>
          ) : (
            childrenNode
          )}
        </div>,
      );
    };
  },
});

export default FloatButtonGroup;
