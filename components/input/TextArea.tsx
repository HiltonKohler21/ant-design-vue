import type { CSSProperties } from 'vue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import { textAreaProps } from './inputProps';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import { fixControlledValue, resolveOnChange, triggerFocus } from '../vc-input/utils/commonUtils';
import classNames from '../_util/classNames';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import type { FocusEventHandler } from '../_util/EventInterface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import type { VueNode } from '../_util/type';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import useVariant from '../form/hooks/useVariant';
import { deprecated } from '../_util/warning';

function fixEmojiLength(value: string, maxLength: number) {
  return [...(value || '')].slice(0, maxLength).join('');
}

function setTriggerValue(
  isCursorInEnd: boolean,
  preValue: string,
  triggerValue: string,
  maxLength: number,
) {
  let newTriggerValue = triggerValue;
  if (isCursorInEnd) {
    // 光标在尾部，直接截断
    newTriggerValue = fixEmojiLength(triggerValue, maxLength);
  } else if (
    [...(preValue || '')].length < triggerValue.length &&
    [...(triggerValue || '')].length > maxLength
  ) {
    // 光标在中间，如果最后的值超过最大值，则采用原先的值
    newTriggerValue = preValue;
  }
  return newTriggerValue;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATextarea',
  inheritAttrs: false,
  props: textAreaProps(),
  setup(props, { attrs, expose, emit }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const stateValue = shallowRef(props.value ?? props.defaultValue);
    const resizableTextArea = shallowRef();
    const mergedValue = shallowRef('');
    const { configProvider, prefixCls, size, direction } = useConfigInject('input', props);
    const textAreaConfig = computed(() => (configProvider as any).textArea?.value);

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'textArea' as any,
      computed(() => {
        if (props.variant !== undefined) return props.variant;
        if (props.bordered === false) return undefined;
        return (
          (configProvider as any).textArea?.value?.variant ??
          (configProvider as any).input?.value?.variant
        );
      }),
      computed(() => props.bordered),
    );
    deprecated(props.bordered === undefined, 'bordered', 'variant', 'TextArea');

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabled = useInjectDisabled();

    const showCount = computed(() => {
      return (props.showCount as any) === '' || props.showCount || false;
    });
    // Max length value
    const hasMaxLength = computed(() => Number(props.maxlength) > 0);
    const compositing = shallowRef(false);

    const oldCompositionValueRef = shallowRef<string>();
    const oldSelectionStartRef = shallowRef<number>(0);
    const onInternalCompositionStart = (e: CompositionEvent) => {
      compositing.value = true;
      // 拼音输入前保存一份旧值
      oldCompositionValueRef.value = mergedValue.value;
      // 保存旧的光标位置
      oldSelectionStartRef.value = (e.currentTarget as any).selectionStart;
      emit('compositionstart', e);
    };

    const onInternalCompositionEnd = (e: CompositionEvent) => {
      compositing.value = false;
      let triggerValue = (e.currentTarget as any).value;
      if (hasMaxLength.value) {
        const isCursorInEnd =
          oldSelectionStartRef.value >= props.maxlength + 1 ||
          oldSelectionStartRef.value === oldCompositionValueRef.value?.length;
        triggerValue = setTriggerValue(
          isCursorInEnd,
          oldCompositionValueRef.value,
          triggerValue,
          props.maxlength,
        );
      }
      // Patch composition onChange when value changed
      if (triggerValue !== mergedValue.value) {
        setValue(triggerValue);
        resolveOnChange(e.currentTarget as any, e, triggerChange, triggerValue);
      }

      emit('compositionend', e);
    };
    const instance = getCurrentInstance();
    watch(
      () => props.value,
      () => {
        if ('value' in instance.vnode.props || {}) {
          stateValue.value = props.value ?? '';
        }
      },
    );

    const focus = (option?: InputFocusOptions) => {
      triggerFocus(resizableTextArea.value?.textArea, option);
    };

    const blur = () => {
      resizableTextArea.value?.textArea?.blur();
    };

    const setValue = (value: string | number, callback?: Function) => {
      if (stateValue.value === value) {
        return;
      }
      if (props.value === undefined) {
        stateValue.value = value;
      } else {
        nextTick(() => {
          if (resizableTextArea.value.textArea.value !== mergedValue.value) {
            resizableTextArea.value?.instance.update?.();
          }
        });
      }
      nextTick(() => {
        callback && callback();
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        emit('pressEnter', e);
      }
      emit('keydown', e);
    };

    const onBlur: FocusEventHandler = e => {
      const { onBlur } = props;
      onBlur?.(e);
      formItemContext.onFieldBlur();
    };
    const triggerChange = (e: Event) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };

    const handleReset = (e: MouseEvent) => {
      resolveOnChange(resizableTextArea.value.textArea, e, triggerChange);
      setValue('', () => {
        focus();
      });
    };

    const handleChange = (e: Event) => {
      let triggerValue = (e.target as any).value;
      if (stateValue.value === triggerValue) return;

      if (hasMaxLength.value) {
        // 1. 复制粘贴超过maxlength的情况 2.未超过maxlength的情况
        const target = e.target as any;
        const isCursorInEnd =
          target.selectionStart >= props.maxlength + 1 ||
          target.selectionStart === triggerValue.length ||
          !target.selectionStart;
        triggerValue = setTriggerValue(
          isCursorInEnd,
          mergedValue.value,
          triggerValue,
          props.maxlength,
        );
      }
      resolveOnChange(e.currentTarget as any, e, triggerChange, triggerValue);
      setValue(triggerValue);
    };
    const renderTextArea = () => {
      const { class: customClass, style: customStyle } = attrs;
      const isBorderless = mergedVariant.value === 'borderless';
      const variantCls =
        enableVariantCls.value && mergedVariant.value !== 'outlined'
          ? `${prefixCls.value}-${mergedVariant.value}`
          : undefined;
      const mergedSemanticClassNames = {
        ...textAreaConfig.value?.classNames,
        ...props.classNames,
      };
      const mergedSemanticStyles = {
        ...textAreaConfig.value?.styles,
        ...props.styles,
      };
      const hasOuterWrapper =
        showCount.value || formItemInputContext.hasFeedback || props.allowClear;
      const mergedTextareaStyle =
        !hasOuterWrapper && textAreaConfig.value?.style
          ? [textAreaConfig.value.style, customStyle]
          : customStyle;
      const resizeProps = {
        ...omit(props, ['allowClear', 'rootClassName']),
        ...attrs,
        classNames: mergedSemanticClassNames,
        styles: mergedSemanticStyles,
        style: mergedTextareaStyle,
        class: [
          {
            [`${prefixCls.value}-borderless`]: isBorderless,
            [variantCls]: !!variantCls,
            [`${customClass}`]: customClass && !showCount.value,
            [`${prefixCls.value}-sm`]: size.value === 'small',
            [`${prefixCls.value}-lg`]: size.value === 'large',
          },
          !hasOuterWrapper && textAreaConfig.value?.className,
          !hasOuterWrapper && props.rootClassName,
          getStatusClassNames(prefixCls.value, mergedStatus.value),
          hashId.value,
        ],
        disabled: disabled.value,
        showCount: null,
        prefixCls: prefixCls.value,
        onInput: handleChange,
        onChange: handleChange,
        onBlur,
        onKeydown: handleKeyDown,
        onCompositionstart: onInternalCompositionStart,
        onCompositionend: onInternalCompositionEnd,
      };
      if (props.valueModifiers?.lazy) {
        delete resizeProps.onInput;
      }
      return (
        <ResizableTextArea
          {...resizeProps}
          id={resizeProps?.id ?? formItemContext.id.value}
          ref={resizableTextArea}
          maxlength={props.maxlength}
          lazy={props.lazy}
        />
      );
    };

    expose({
      focus,
      blur,
      resizableTextArea,
    });

    watchEffect(() => {
      let val = fixControlledValue(stateValue.value);
      if (
        !compositing.value &&
        hasMaxLength.value &&
        (props.value === null || props.value === undefined)
      ) {
        // fix #27612 将value转为数组进行截取，解决 '😂'.length === 2 等emoji表情导致的截取乱码的问题
        val = fixEmojiLength(val, props.maxlength);
      }
      mergedValue.value = val;
    });
    return () => {
      const { maxlength, hidden } = props;
      const { style, class: customClass } = attrs;
      const mergedSemanticClassNames = {
        ...textAreaConfig.value?.classNames,
        ...props.classNames,
      };
      const mergedSemanticStyles = {
        ...textAreaConfig.value?.styles,
        ...props.styles,
      };
      const mergedOuterStyle = textAreaConfig.value?.style
        ? [textAreaConfig.value.style, style]
        : style;
      const hasShowCountWrapper = showCount.value || formItemInputContext.hasFeedback;
      const clearableClass = !hasShowCountWrapper
        ? classNames(textAreaConfig.value?.className, props.rootClassName, customClass)
        : customClass;
      const inputProps: any = {
        ...omit(props, ['classNames', 'styles', 'rootClassName']),
        ...attrs,
        class: clearableClass,
        prefixCls: prefixCls.value,
        inputType: 'text',
        handleReset,
        direction: direction.value,
        bordered: mergedVariant.value !== 'borderless',
        variant: mergedVariant.value,
        style: hasShowCountWrapper ? undefined : mergedOuterStyle,
        hashId: hashId.value,
        disabled: props.disabled ?? disabled.value,
      };

      let textareaNode = (
        <ClearableLabeledInput
          {...inputProps}
          value={mergedValue.value}
          v-slots={{ element: renderTextArea }}
          status={props.status}
        />
      );

      if (hasShowCountWrapper) {
        const valueLength = [...mergedValue.value].length;
        let dataCount: VueNode = '';
        if (typeof showCount.value === 'object') {
          dataCount = showCount.value.formatter({
            value: mergedValue.value,
            count: valueLength,
            maxlength,
          });
        } else {
          dataCount = `${valueLength}${hasMaxLength.value ? ` / ${maxlength}` : ''}`;
        }
        const useSemanticCountNode =
          showCount.value && !!(mergedSemanticClassNames.count || mergedSemanticStyles.count);
        textareaNode = (
          <div
            hidden={hidden}
            class={classNames(
              `${prefixCls.value}-textarea`,
              {
                [`${prefixCls.value}-textarea-rtl`]: direction.value === 'rtl',
                [`${prefixCls.value}-textarea-show-count`]: showCount.value,
                [`${prefixCls.value}-textarea-in-form-item`]: formItemInputContext.isFormItemInput,
              },
              `${prefixCls.value}-textarea-show-count`,
              textAreaConfig.value?.className,
              props.rootClassName,
              customClass,
              hashId.value,
            )}
            style={mergedOuterStyle as CSSProperties}
            data-count={
              !useSemanticCountNode && typeof dataCount !== 'object' ? dataCount : undefined
            }
          >
            {textareaNode}
            {useSemanticCountNode && (
              <span
                class={classNames(`${prefixCls.value}-data-count`, mergedSemanticClassNames.count)}
                style={mergedSemanticStyles.count}
              >
                {dataCount}
              </span>
            )}
            {formItemInputContext.hasFeedback && (
              <span
                class={classNames(
                  `${prefixCls.value}-textarea-suffix`,
                  mergedSemanticClassNames.suffix,
                )}
                style={mergedSemanticStyles.suffix}
              >
                {formItemInputContext.feedbackIcon}
              </span>
            )}
          </div>
        );
      }
      return wrapSSR(textareaNode);
    };
  },
});
