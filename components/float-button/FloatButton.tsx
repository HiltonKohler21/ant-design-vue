import classNames from '../_util/classNames';
import { defineComponent, computed, ref } from 'vue';
import Tooltip from '../tooltip';
import Badge from '../badge';
import Content from './FloatButtonContent';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectFloatButtonGroupContext } from './context';
import warning from '../_util/warning';
import scrollTo from '../_util/scrollTo';
import { initDefaultProps } from '../_util/props-util';
import { floatButtonProps } from './interface';
// import { useCompactItemContext } from '../space/Compact';

// CSSINJS
import useStyle from './style';

export const floatButtonPrefixCls = 'float-btn';

const FloatButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButton',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonProps(), { type: 'default', shape: 'circle' }),
  setup(props, { attrs, slots }) {
    const { configProvider, prefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);
    const floatButtonConfig = computed(() => (configProvider as any).floatButton?.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const { shape: groupShape } = useInjectFloatButtonGroupContext();

    const floatButtonRef = ref<HTMLAnchorElement | HTMLButtonElement>(null);

    const mergeShape = computed(() => {
      return groupShape?.value || props.shape;
    });

    return () => {
      const {
        prefixCls: customPrefixCls,
        type = 'default',
        shape,
        content,
        description,
        tooltip,
        badge = {},
        backTop,
        htmlType,
        ...restProps
      } = props;

      const mergedContent = content ?? slots.content?.() ?? description ?? slots.description?.();

      const handleClick = (e: MouseEvent) => {
        if (props.backTop) {
          scrollTo(0);
        }
        props.onClick?.(e);
      };

      const classString = classNames(
        prefixCls.value,
        `${prefixCls.value}-${type}`,
        `${prefixCls.value}-${mergeShape.value}`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        floatButtonConfig.value?.className,
        attrs.class,
        props.rootClassName,
        hashId.value,
      );
      const mergedStyle = floatButtonConfig.value?.style
        ? [floatButtonConfig.value.style, attrs.style]
        : attrs.style;

      const buttonNode = (
        <Tooltip
          placement="left"
          v-slots={{
            title:
              slots.tooltip || tooltip
                ? () => (slots.tooltip && slots.tooltip()) || tooltip
                : undefined,
            default: () => (
              <Badge {...badge}>
                <div class={`${prefixCls.value}-body`}>
                  <Content
                    prefixCls={prefixCls.value}
                    v-slots={{
                      icon: slots.icon,
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
