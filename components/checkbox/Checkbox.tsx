import type { CSSProperties, VNode } from 'vue';
import {
  computed,
  watch,
  watchEffect,
  onMounted,
  defineComponent,
  inject,
  onBeforeUnmount,
  ref,
} from 'vue';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import VcCheckbox from '../vc-checkbox/Checkbox';
import { flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import type { EventHandler } from '../_util/EventInterface';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';

import type {
  CheckboxChangeEvent,
  CheckboxProps,
  CheckboxSemanticClassNames,
  CheckboxSemanticStyles,
} from './interface';
import { CheckboxGroupContextKey, checkboxProps } from './interface';

// CSSINJS
import useStyle from './style';

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

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: checkboxProps(),
  // emits: ['change', 'update:checked'],
  setup(props, { emit, attrs, slots, expose }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const { prefixCls, direction, disabled } = useConfigInject('checkbox', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('checkbox');

    const contextDisabled = useInjectDisabled();
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const checkboxGroup = inject(CheckboxGroupContextKey, undefined);
    const uniId = Symbol('checkboxUniId');
    const mergedDisabled = computed(() => {
      return checkboxGroup?.disabled.value || disabled.value;
    });
    const innerChecked = ref(props.checked !== undefined ? props.checked : props.defaultChecked);
    watch(
      () => props.checked,
      val => {
        innerChecked.value = val;
      },
    );
    watchEffect(() => {
      if (!props.skipGroup && checkboxGroup) {
        checkboxGroup.registerValue(uniId, props.value);
      }
    });
    onBeforeUnmount(() => {
      if (checkboxGroup) {
        checkboxGroup.cancelValue(uniId);
      }
    });
    onMounted(() => {
      warning(
        !!(props.checked !== undefined || checkboxGroup || props.value === undefined),
        'Checkbox',
        '`value` is not validate prop, do you mean `checked`?',
      );
    });

    const handleChange = (event: CheckboxChangeEvent) => {
      const targetChecked = event.target.checked;
      if (props.checked === undefined) {
        innerChecked.value = targetChecked;
      }
      emit('update:checked', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };
    const checkboxRef = ref();
    let prevIconStyleKeys: string[] = [];
    const focus = () => {
      checkboxRef.value?.focus();
    };
    const blur = () => {
      checkboxRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });
    return () => {
      const children = flattenChildren(slots.default?.());
      const {
        indeterminate,
        skipGroup,
        id = formItemContext.id.value,
        classNames: propClassNames,
        styles: propStyles,
        title,
        ...restProps
      } = props;
      const { onMouseenter, onMouseleave, onInput, class: className, style, ...restAttrs } = attrs;
      const checkboxProps: CheckboxProps = {
        ...restProps,
        id,
        prefixCls: prefixCls.value,
        ...restAttrs,
        disabled: mergedDisabled.value,
      };
      let mergedChecked: boolean | undefined;
      if (checkboxGroup && !skipGroup) {
        checkboxProps.onChange = (...args) => {
          emit('change', ...args);
          checkboxGroup.toggleOption({ label: children, value: props.value });
        };
        checkboxProps.name = checkboxGroup.name.value;
        mergedChecked = checkboxGroup.mergedValue.value.includes(props.value);
        checkboxProps.checked = mergedChecked;
        checkboxProps.disabled = mergedDisabled.value || contextDisabled.value;
        checkboxProps.indeterminate = indeterminate;
      } else {
        mergedChecked = props.checked !== undefined ? props.checked : innerChecked.value;
        checkboxProps.onChange = handleChange;
      }

      const mergedPropsForSemantic: CheckboxProps = {
        ...props,
        indeterminate,
        disabled: checkboxProps.disabled,
        checked: !!mergedChecked,
      };

      const [mergedClassNames, mergedStyles] = mergeSemantic<
        CheckboxSemanticClassNames,
        CheckboxSemanticStyles,
        CheckboxProps
      >(
        [
          contextClassNames.value,
          skipGroup ? undefined : checkboxGroup?.classNames?.value,
          propClassNames,
        ],
        [contextStyles.value, skipGroup ? undefined : checkboxGroup?.styles?.value, propStyles],
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

      const classString = classNames(
        props.rootClassName,
        contextClassName.value,
        mergedClassNames.root,
        {
          [`${prefixCls.value}-wrapper`]: true,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-wrapper-checked`]: checkboxProps.checked,
          [`${prefixCls.value}-wrapper-disabled`]: checkboxProps.disabled,
          [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput,
        },
        className,
        hashId.value,
      );
      const checkboxClass = classNames(
        {
          [`${prefixCls.value}-indeterminate`]: indeterminate,
        },
        mergedClassNames.icon,
        hashId.value,
      );
      const ariaChecked = indeterminate ? 'mixed' : undefined;
      return wrapSSR(
        <label
          class={classString}
          style={[contextStyle.value, mergedStyles.root, style as CSSProperties]}
          title={title}
          onMouseenter={onMouseenter as EventHandler}
          onMouseleave={onMouseleave as EventHandler}
        >
          <VcCheckbox
            aria-checked={ariaChecked}
            {...checkboxProps}
            class={checkboxClass}
            style={mergedStyles.icon}
            onVnodeMounted={syncIconStyle}
            onVnodeUpdated={syncIconStyle}
            ref={checkboxRef}
          />
          {children.length ? (
            <span class={mergedClassNames.label} style={mergedStyles.label}>
              {children}
            </span>
          ) : null}
        </label>,
      );
    };
  },
});
