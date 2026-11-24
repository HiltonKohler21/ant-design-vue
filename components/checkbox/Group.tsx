import type { CSSProperties } from 'vue';
import { computed, ref, watch, defineComponent, provide } from 'vue';
import Checkbox from './Checkbox';
import { useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type {
  CheckboxGroupProps,
  CheckboxGroupSemanticClassNames,
  CheckboxGroupSemanticStyles,
  CheckboxOptionType,
  CheckboxSemanticClassNames,
  CheckboxSemanticStyles,
} from './interface';
import { CheckboxGroupContextKey, checkboxGroupProps } from './interface';

// CSSINJS
import useStyle from './style';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckboxGroup',
  inheritAttrs: false,
  props: checkboxGroupProps(),
  // emits: ['change', 'update:value'],
  setup(props, { slots, attrs, emit, expose }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction } = useConfigInject('checkbox', props);
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`);

    // style
    const [wrapSSR, hashId] = useStyle(groupPrefixCls);

    const mergedValue = ref((props.value === undefined ? props.defaultValue : props.value) || []);
    watch(
      () => props.value,
      () => {
        mergedValue.value = props.value || [];
      },
    );
    const options = computed(() => {
      return props.options.map(option => {
        if (typeof option === 'string' || typeof option === 'number') {
          return {
            label: option,
            value: option,
          };
        }
        return option;
      });
    });
    const triggerUpdate = ref(Symbol());
    const registeredValuesMap = ref(new Map<Symbol, string>());
    const cancelValue = (id: Symbol) => {
      registeredValuesMap.value.delete(id);
      triggerUpdate.value = Symbol();
    };
    const registerValue = (id: Symbol, value: string) => {
      registeredValuesMap.value.set(id, value);
      triggerUpdate.value = Symbol();
    };

    const registeredValues = ref(new Map());
    watch(triggerUpdate, () => {
      const valuseMap = new Map();
      for (const value of registeredValuesMap.value.values()) {
        valuseMap.set(value, true);
      }
      registeredValues.value = valuseMap;
    });

    const toggleOption = (option: CheckboxOptionType) => {
      const optionIndex = mergedValue.value.indexOf(option.value);
      const value = [...mergedValue.value];
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (props.value === undefined) {
        mergedValue.value = value;
      }
      const val = value
        .filter(val => registeredValues.value.has(val))
        .sort((a, b) => {
          const indexA = options.value.findIndex(opt => opt.value === a);
          const indexB = options.value.findIndex(opt => opt.value === b);
          return indexA - indexB;
        });
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };

    const mergedSemantic = computed(() =>
      mergeSemantic<
        CheckboxGroupSemanticClassNames,
        CheckboxGroupSemanticStyles,
        CheckboxGroupProps
      >([props.classNames], [props.styles], {
        props: {
          ...props,
          value: mergedValue.value,
        },
      }),
    );

    const itemSemanticClassNames = computed<CheckboxSemanticClassNames | undefined>(() => {
      const cn = mergedSemantic.value[0];
      if (!cn.item && !cn.itemIcon && !cn.itemLabel) return undefined;
      return {
        root: cn.item,
        icon: cn.itemIcon,
        label: cn.itemLabel,
      };
    });

    const itemSemanticStyles = computed<CheckboxSemanticStyles | undefined>(() => {
      const st = mergedSemantic.value[1];
      if (!st.item && !st.itemIcon && !st.itemLabel) return undefined;
      return {
        root: st.item,
        icon: st.itemIcon,
        label: st.itemLabel,
      };
    });

    provide(CheckboxGroupContextKey, {
      cancelValue,
      registerValue,
      toggleOption,
      mergedValue,
      name: computed(() => props.name),
      disabled: computed(() => props.disabled),
      classNames: itemSemanticClassNames,
      styles: itemSemanticStyles,
    });
    expose({
      mergedValue,
    });
    return () => {
      const { id = formItemContext.id.value } = props;
      const [mergedClassNames, mergedStyles] = mergedSemantic.value;
      let children = null;
      if (options.value && options.value.length > 0) {
        children = options.value.map(option => (
          <Checkbox
            prefixCls={prefixCls.value}
            key={option.value.toString()}
            disabled={'disabled' in option ? option.disabled : props.disabled}
            indeterminate={option.indeterminate}
            value={option.value}
            checked={mergedValue.value.indexOf(option.value) !== -1}
            onChange={option.onChange}
            class={classNames(`${groupPrefixCls.value}-item`, option.className)}
            style={option.style}
            title={option.title}
            id={option.id}
            required={option.required}
          >
            {slots.label !== undefined ? slots.label?.(option) : option.label}
          </Checkbox>
        ));
      }
      const mergedRootStyle = mergedStyles.root
        ? [mergedStyles.root, attrs.style as CSSProperties]
        : (attrs.style as CSSProperties);
      return wrapSSR(
        <div
          {...attrs}
          class={[
            groupPrefixCls.value,
            { [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl' },
            props.rootClassName,
            mergedClassNames.root,
            attrs.class,
            hashId.value,
          ]}
          style={mergedRootStyle}
          id={id}
        >
          {children || slots.default?.()}
        </div>,
      );
    };
  },
});
