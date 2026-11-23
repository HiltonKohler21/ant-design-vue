import classNames from '../_util/classNames';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import Input from './Input';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons-vue/EyeInvisibleOutlined';
import type { InputProps } from './inputProps';
import inputProps from './inputProps';
import type { PropType } from 'vue';
import { computed, defineComponent, shallowRef, watchEffect } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';

const ActionMap = {
  click: 'onClick',
  hover: 'onMouseover',
};
const defaultIconRender = (visible: boolean) =>
  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputPassword',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    prefixCls: String,
    inputPrefixCls: String,
    action: { type: String, default: 'click' },
    visibilityToggle: { type: Boolean, default: true },
    visible: { type: Boolean, default: undefined },
    'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
    iconRender: Function,
  },
  setup(props, { slots, attrs, expose, emit }) {
    const visible = shallowRef(false);
    const onVisibleChange = () => {
      const { disabled } = props;
      if (disabled) {
        return;
      }
      visible.value = !visible.value;
      emit('update:visible', visible.value);
    };
    watchEffect(() => {
      if (props.visible !== undefined) {
        visible.value = !!props.visible;
      }
    });
    const inputRef = shallowRef();
    const focus = () => {
      inputRef.value?.focus();
    };
    const blur = () => {
      inputRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });
    const getIcon = (prefixCls: string) => {
      const { action, iconRender = slots.iconRender || defaultIconRender } = props;
      const iconTrigger = ActionMap[action] || '';
      const icon = iconRender(visible.value);
      const iconProps = {
        [iconTrigger]: onVisibleChange,
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
        onMousedown: (e: MouseEvent) => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: (e: MouseEvent) => {
          // Prevent caret position change
          // https://github.com/ant-design/ant-design/issues/23524
          e.preventDefault();
        },
      };
      return cloneElement(isValidElement(icon) ? icon : <span>{icon}</span>, iconProps);
    };
    const { configProvider, prefixCls, getPrefixCls } = useConfigInject('input-password', props);
    const passwordConfig = computed(() => (configProvider as any).inputPassword?.value);
    const inputPrefixCls = computed(() => getPrefixCls('input', props.inputPrefixCls));
    const renderPassword = () => {
      const {
        size,
        visibilityToggle,
        classNames: propClassNames,
        styles: propStyles,
        ...restProps
      } = props;

      const suffixIcon = visibilityToggle && getIcon(prefixCls.value);
      const inputClassName = classNames(
        prefixCls.value,
        passwordConfig.value?.className,
        attrs.class,
        {
          [`${prefixCls.value}-${size}`]: !!size,
        },
      );
      const mergedStyle = passwordConfig.value?.style
        ? [passwordConfig.value.style, attrs.style]
        : attrs.style;
      const mergedClassNames =
        passwordConfig.value?.classNames || propClassNames
          ? { ...passwordConfig.value?.classNames, ...propClassNames }
          : undefined;
      const mergedStyles =
        passwordConfig.value?.styles || propStyles
          ? { ...passwordConfig.value?.styles, ...propStyles }
          : undefined;

      const omittedProps = {
        ...omit(restProps, ['suffix', 'iconRender', 'action']),
        ...attrs,
        type: visible.value ? 'text' : 'password',
        class: inputClassName,
        style: mergedStyle,
        classNames: mergedClassNames,
        styles: mergedStyles,
        prefixCls: inputPrefixCls.value,
        suffix: suffixIcon,
      } as InputProps;

      if (size) {
        omittedProps.size = size;
      }

      return <Input ref={inputRef} {...omittedProps} v-slots={slots} />;
    };
    return () => {
      return renderPassword();
    };
  },
});
