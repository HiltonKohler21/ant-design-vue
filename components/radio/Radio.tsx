import type { CSSProperties, ExtractPropTypes, PropType, VNode } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox/Checkbox';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import type {
  RadioChangeEvent,
  RadioClassNamesType,
  RadioSemanticClassNames,
  RadioSemanticStyles,
  RadioStylesType,
} from './interface';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import { useInjectRadioGroupContext, useInjectRadioOptionTypeContext } from './context';
import { booleanType, functionType } from '../_util/type';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';

const UNITLESS_CSS_PROPS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
]);

function applyStyleObjectToElement(
  el: unknown,
  styleObj: CSSProperties | undefined,
  prevKeys: string[],
): string[] {
  if (!(el instanceof HTMLElement)) return prevKeys;
  for (const key of prevKeys) {
    if (!styleObj || !(key in styleObj)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  }
  if (!styleObj) return [];
  const nextKeys = Object.keys(styleObj);
  for (const key of nextKeys) {
    const val = (styleObj as any)[key];
    if (val === undefined || val === null) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    } else if (key.startsWith('--')) {
      el.style.setProperty(key, String(val));
    } else {
      (el.style as any)[key] =
        typeof val === 'number' && !UNITLESS_CSS_PROPS.has(key) ? `${val}px` : val;
    }
  }
  return nextKeys;
}

export const radioProps = () => ({
  prefixCls: String,
  rootClassName: String,
  defaultChecked: booleanType(),
  checked: booleanType(),
  disabled: booleanType(),
  isGroup: booleanType(),
  value: PropTypes.any,
  name: String,
  id: String,
  title: String,
  required: booleanType(),
  autofocus: booleanType(),
  classNames: {
    type: [Object, Function] as PropType<RadioClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<RadioStylesType>,
    default: undefined,
  },
  onChange: functionType<(event: RadioChangeEvent) => void>(),
  onFocus: functionType<FocusEventHandler>(),
  onBlur: functionType<FocusEventHandler>(),
  onClick: functionType<MouseEventHandler>(),
  'onUpdate:checked': functionType<(checked: boolean) => void>(),
  'onUpdate:value': functionType<(checked: boolean) => void>(),
});

export type RadioProps = Partial<ExtractPropTypes<ReturnType<typeof radioProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ARadio',
  inheritAttrs: false,
  props: radioProps(),
  setup(props, { emit, expose, slots, attrs }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const radioOptionTypeContext = useInjectRadioOptionTypeContext();
    const radioGroupContext = useInjectRadioGroupContext();
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? disabledContext.value);

    const vcCheckbox = ref<HTMLElement>();
    let prevIconStyleKeys: string[] = [];

    const innerChecked = ref(props.checked !== undefined ? props.checked : props.defaultChecked);
    watch(
      () => props.checked,
      val => {
        innerChecked.value = val;
      },
    );

    const { prefixCls: radioPrefixCls, direction, disabled } = useConfigInject('radio', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('radio');
    const prefixCls = computed(() =>
      radioGroupContext?.optionType.value === 'button' || radioOptionTypeContext === 'button'
        ? `${radioPrefixCls.value}-button`
        : radioPrefixCls.value,
    );
    const contextDisabled = useInjectDisabled();

    // Style
    const [wrapSSR, hashId] = useStyle(radioPrefixCls);

    const focus = () => {
      vcCheckbox.value.focus();
    };

    const blur = () => {
      vcCheckbox.value.blur();
    };

    expose({ focus, blur });

    const handleChange = (event: RadioChangeEvent) => {
      const targetChecked = event.target.checked;
      if (props.checked === undefined) {
        innerChecked.value = targetChecked;
      }
      emit('update:checked', targetChecked);
      emit('update:value', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };

    const onChange = (e: RadioChangeEvent) => {
      emit('change', e);
      if (radioGroupContext && radioGroupContext.onChange) {
        radioGroupContext.onChange(e);
      }
    };

    return () => {
      const radioGroup = radioGroupContext;
      const {
        prefixCls: customizePrefixCls,
        rootClassName,
        id = formItemContext.id.value,
        title,
        classNames: propClassNames,
        styles: propStyles,
        ...restProps
      } = props;

      const rProps: RadioProps = {
        prefixCls: prefixCls.value,
        id,
        ...omit(restProps, ['onUpdate:checked', 'onUpdate:value']),
        disabled: disabled.value ?? contextDisabled.value,
      };

      let mergedChecked: boolean | undefined;
      if (radioGroup) {
        rProps.name = radioGroup.name.value;
        rProps.onChange = onChange;
        mergedChecked = props.value === radioGroup.value.value;
        rProps.checked = mergedChecked;
        rProps.disabled = mergedDisabled.value || radioGroup.disabled.value;
      } else {
        mergedChecked = props.checked !== undefined ? props.checked : innerChecked.value;
        rProps.onChange = handleChange;
      }

      const mergedPropsForSemantic: RadioProps = {
        ...props,
        ...rProps,
        checked: !!mergedChecked,
      };

      const [mergedClassNames, mergedStyles] = mergeSemantic<
        RadioSemanticClassNames,
        RadioSemanticStyles,
        RadioProps
      >(
        [contextClassNames.value, radioGroup?.classNames?.value, propClassNames],
        [contextStyles.value, radioGroup?.styles?.value, propStyles],
        {
          props: mergedPropsForSemantic,
        },
      );

      const syncIconStyle = (vnode: VNode) => {
        prevIconStyleKeys = applyStyleObjectToElement(
          vnode.el,
          mergedStyles.icon,
          prevIconStyleKeys,
        );
      };

      const wrapperClassString = classNames(
        {
          [`${prefixCls.value}-wrapper`]: true,
          [`${prefixCls.value}-wrapper-checked`]: rProps.checked,
          [`${prefixCls.value}-wrapper-disabled`]: rProps.disabled,
          [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput,
          [`${prefixCls.value}-wrapper-block`]: !!radioGroup?.block?.value,
        },
        contextClassName.value,
        rootClassName,
        mergedClassNames.root,
        attrs.class,
        hashId.value,
      );

      return wrapSSR(
        <label
          {...attrs}
          title={title}
          class={wrapperClassString}
          style={[contextStyle.value, mergedStyles.root, attrs.style as CSSProperties]}
        >
          <VcCheckbox
            {...rProps}
            type="radio"
            class={mergedClassNames.icon}
            style={mergedStyles.icon}
            onVnodeMounted={syncIconStyle}
            onVnodeUpdated={syncIconStyle}
            ref={vcCheckbox}
          />
          {slots.default && (
            <span class={mergedClassNames.label} style={mergedStyles.label}>
              {slots.default()}
            </span>
          )}
        </label>,
      );
    };
  },
});
