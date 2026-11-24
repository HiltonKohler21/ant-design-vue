import {
  onBeforeUpdate,
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  watch,
  defineComponent,
} from 'vue';
import classNames from '../_util/classNames';
import {
  FormItemInputContext,
  NoFormStatus,
  useInjectFormItemContext,
} from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import { hasPrefixSuffix } from '../vc-input/utils/commonUtils';
import VcInput from '../vc-input/Input';
import type { AllowClearConfig, InputSemanticClassNames, InputSemanticStyles } from './inputProps';
import inputProps from './inputProps';
import omit from '../_util/omit';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
import { deprecated } from '../_util/warning';
import useVariant from '../form/hooks/useVariant';
import {
  applyDomStyle,
  mergeSemanticClassNames,
  mergeSemanticStyles,
  resolveSemanticValue,
} from './util';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';

function resolveAllowClear(
  propAllowClear: boolean | AllowClearConfig | undefined,
  contextAllowClear: boolean | AllowClearConfig | undefined,
): { enabled: boolean; clearIcon?: any } {
  const source = propAllowClear !== undefined ? propAllowClear : contextAllowClear;
  if (!source) {
    return { enabled: false };
  }
  if (typeof source === 'object') {
    if (source.disabled) {
      return { enabled: false };
    }
    const ctxIcon =
      typeof contextAllowClear === 'object' && contextAllowClear !== null
        ? contextAllowClear.clearIcon
        : undefined;
    return { enabled: true, clearIcon: source.clearIcon ?? ctxIcon };
  }
  const ctxObj =
    typeof contextAllowClear === 'object' && contextAllowClear !== null
      ? contextAllowClear
      : undefined;
  return { enabled: true, clearIcon: ctxObj?.clearIcon };
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInput',
  inheritAttrs: false,
  props: inputProps(),
  setup(props, { slots, attrs, expose, emit }) {
    const inputRef = ref();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const { configProvider, direction, prefixCls, size, autocomplete } = useConfigInject(
      'input',
      props,
    );
    const inputConfig = computed(() => (configProvider as any).input?.value);

    // ====================== Count =======================
    const countStateValue = shallowRef(props.value ?? props.defaultValue ?? '');
    const isComposing = shallowRef(false);
    watch(
      () => props.value,
      val => {
        if (val !== undefined) {
          countStateValue.value = val;
        }
      },
    );

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'input',
      computed(() => props.variant),
      computed(() => props.bordered),
    );
    deprecated(props.bordered === undefined, 'bordered', 'variant', 'Input');

    // ===================== Compact Item =====================
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => {
      return compactSize.value || size.value;
    });
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const disabled = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabled.value);

    const semanticInfo = computed(() => ({
      props: {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
        variant: mergedVariant.value,
        status: mergedStatus.value,
      },
    }));
    const mergedClassNames = computed<InputSemanticClassNames>(() =>
      mergeSemanticClassNames(
        resolveSemanticValue(inputConfig.value?.classNames, semanticInfo.value),
        resolveSemanticValue(props.classNames, semanticInfo.value),
      ),
    );
    const mergedStyles = computed<InputSemanticStyles>(() =>
      mergeSemanticStyles(
        resolveSemanticValue(inputConfig.value?.styles, semanticInfo.value),
        resolveSemanticValue(props.styles, semanticInfo.value),
      ),
    );

    let lastWrappedInputStyleKeys: string[] = [];
    let isCurrentlyWrapped = false;
    const syncWrappedInputStyle = () => {
      const rootEl = inputRef.value?.$el as HTMLElement | undefined;
      if (!rootEl) return;
      const inputEl = rootEl.tagName === 'INPUT' ? rootEl : rootEl.querySelector('input');
      if (isCurrentlyWrapped) {
        lastWrappedInputStyleKeys = applyDomStyle(
          inputEl,
          mergedStyles.value.input,
          lastWrappedInputStyleKeys,
        );
      } else if (lastWrappedInputStyleKeys.length) {
        lastWrappedInputStyleKeys = applyDomStyle(inputEl, undefined, lastWrappedInputStyleKeys);
      }
    };

    const focus = (option?: InputFocusOptions) => {
      inputRef.value?.focus(option);
    };

    const blur = () => {
      inputRef.value?.blur();
    };

    const setSelectionRange = (
      start: number,
      end: number,
      direction?: 'forward' | 'backward' | 'none',
    ) => {
      inputRef.value?.setSelectionRange(start, end, direction);
    };

    const select = () => {
      inputRef.value?.select();
    };

    expose({
      focus,
      blur,
      input: inputRef,
      setSelectionRange,
      select,
      get nativeElement() {
        return inputRef.value?.$el;
      },
    });
    // ===================== Remove Password value =====================
    const removePasswordTimeoutRef = ref<any[]>([]);
    const removePasswordTimeout = () => {
      removePasswordTimeoutRef.value.push(
        setTimeout(() => {
          if (
            inputRef.value?.input &&
            inputRef.value?.input.getAttribute('type') === 'password' &&
            inputRef.value?.input.hasAttribute('value')
          ) {
            inputRef.value?.input.removeAttribute('value');
          }
        }),
      );
    };
    onMounted(() => {
      removePasswordTimeout();
      syncWrappedInputStyle();
    });
    onUpdated(() => {
      syncWrappedInputStyle();
    });
    onBeforeUpdate(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });
    onBeforeUnmount(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });

    const handleBlur = (e: FocusEvent) => {
      removePasswordTimeout();
      emit('blur', e);
      formItemContext.onFieldBlur();
    };

    const handleFocus = (e: FocusEvent) => {
      removePasswordTimeout();
      emit('focus', e);
    };

    const applyCountExceedFormat = (rawVal: string) => {
      const countConfig = props.count;
      if (!countConfig || !countConfig.exceedFormatter) {
        return rawVal;
      }
      const max = countConfig.max ?? props.maxlength;
      if (max === undefined) {
        return rawVal;
      }
      const strategy = countConfig.strategy ?? ((v: string) => v.length);
      if (strategy(rawVal) > max) {
        return countConfig.exceedFormatter(rawVal, { max });
      }
      return rawVal;
    };

    const handleCompositionStart = (e: CompositionEvent) => {
      isComposing.value = true;
      emit('compositionstart', e);
    };

    const handleCompositionEnd = (e: CompositionEvent) => {
      isComposing.value = false;
      if (props.count?.exceedFormatter) {
        const target = e.target as HTMLInputElement;
        const formatted = applyCountExceedFormat(target.value);
        if (formatted !== target.value) {
          target.value = formatted;
          if (props.value === undefined) {
            countStateValue.value = formatted;
          }
          emit('update:value', formatted);
          emit('change', e);
          emit('input', e);
          formItemContext.onFieldChange();
        }
      }
      emit('compositionend', e);
    };

    const triggerChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      let val = target.value;
      if (e.type === 'click') {
        emit('clear');
      } else if (props.count?.exceedFormatter && !isComposing.value) {
        const formatted = applyCountExceedFormat(val);
        if (formatted !== val) {
          val = formatted;
          target.value = val;
        }
      }
      if (props.value === undefined) {
        countStateValue.value = val;
      }
      emit('update:value', val);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };

    return () => {
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const {
        allowClear,
        count,
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        addonAfter = slots.addonAfter?.(),
        addonBefore = slots.addonBefore?.(),
        id = formItemContext.id?.value,
        ...rest
      } = props;
      const clearInfo = resolveAllowClear(allowClear, inputConfig.value?.allowClear);
      const effectiveAllowClear = clearInfo.enabled ? true : undefined;

      // Count config resolution
      const currentCountVal = String(
        (props.value !== undefined ? props.value : countStateValue.value) ?? '',
      );
      let effectiveShowCount: any = props.showCount || undefined;
      let isOutOfRange = false;
      if (count) {
        const countStrategy = count.strategy ?? ((v: string) => v.length);
        const countMax = count.max ?? props.maxlength;
        const valLen = countStrategy(currentCountVal);
        isOutOfRange = countMax !== undefined && valLen > countMax;
        if (count.show) {
          effectiveShowCount = {
            formatter: () =>
              typeof count.show === 'function'
                ? count.show({ value: currentCountVal, count: valLen, maxLength: countMax })
                : `${valLen}${countMax !== undefined ? ` / ${countMax}` : ''}`,
          };
        } else {
          effectiveShowCount = undefined;
        }
      }

      const suffixNode = (hasFeedback || suffix) && (
        <>
          {suffix}
          {hasFeedback && feedbackIcon}
        </>
      );
      const prefixClsValue = prefixCls.value;
      const inputHasPrefixSuffix = hasPrefixSuffix({ prefix, suffix }) || !!hasFeedback;
      const hasAffixWrapper = Boolean(
        hasPrefixSuffix({
          prefix,
          suffix: suffixNode || effectiveShowCount,
          allowClear: effectiveAllowClear,
        }),
      );
      const variantCls =
        enableVariantCls.value && mergedVariant.value !== 'outlined'
          ? `${prefixClsValue}-${mergedVariant.value}`
          : undefined;
      const isBorderless = mergedVariant.value === 'borderless';
      const clearIcon =
        slots.clearIcon ||
        (clearInfo.clearIcon !== undefined
          ? () => clearInfo.clearIcon
          : () => <CloseCircleFilled />);
      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;
      const hasWrapper = Boolean(hasAffixWrapper || addonAfter || addonBefore);
      isCurrentlyWrapped = hasWrapper;
      const hasCustomStyle =
        inputConfig.value?.style || currentStyles.root || (!hasWrapper && currentStyles.input);
      const mergedStyle = hasCustomStyle
        ? [
            inputConfig.value?.style,
            currentStyles.root,
            !hasWrapper ? currentStyles.input : undefined,
            attrs.style,
          ]
        : attrs.style;
      const vcExtraProps: Record<string, any> = {};
      if (count) {
        vcExtraProps.value = props.value !== undefined ? props.value : countStateValue.value;
      }
      return wrapSSR(
        <VcInput
          {...attrs}
          {...omit(rest, [
            'onUpdate:value',
            'onChange',
            'onInput',
            'onClear',
            'onCompositionstart',
            'onCompositionend',
            'classNames',
            'styles',
            'rootClassName',
            'showCount',
          ])}
          {...vcExtraProps}
          showCount={effectiveShowCount}
          style={mergedStyle as any}
          onChange={triggerChange}
          onCompositionstart={handleCompositionStart}
          onCompositionend={handleCompositionEnd}
          id={id}
          disabled={mergedDisabled.value}
          ref={inputRef}
          prefixCls={prefixClsValue}
          autocomplete={autocomplete.value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          prefix={prefix}
          suffix={suffixNode}
          prefixClassName={currentClassNames.prefix}
          suffixClassName={currentClassNames.suffix}
          countClassName={currentClassNames.count}
          prefixStyle={currentStyles.prefix}
          suffixStyle={currentStyles.suffix}
          countStyle={currentStyles.count}
          allowClear={effectiveAllowClear}
          addonAfter={
            addonAfter && (
              <NoCompactStyle>
                <NoFormStatus>{addonAfter}</NoFormStatus>
              </NoCompactStyle>
            )
          }
          addonBefore={
            addonBefore && (
              <NoCompactStyle>
                <NoFormStatus>{addonBefore}</NoFormStatus>
              </NoCompactStyle>
            )
          }
          class={[
            inputConfig.value?.className,
            attrs.class,
            compactItemClassnames.value,
            props.rootClassName,
            currentClassNames.root,
            isOutOfRange ? `${prefixClsValue}-out-of-range` : undefined,
          ]}
          inputClassName={classNames(
            {
              [`${prefixClsValue}-sm`]: mergedSize.value === 'small',
              [`${prefixClsValue}-lg`]: mergedSize.value === 'large',
              [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-borderless`]: isBorderless,
              [variantCls]: !hasAffixWrapper && !!variantCls,
              [currentClassNames.input as string]: !!currentClassNames.input,
            },
            !inputHasPrefixSuffix && getStatusClassNames(prefixClsValue, mergedStatus.value),
            hashId.value,
          )}
          affixWrapperClassName={classNames(
            {
              [`${prefixClsValue}-affix-wrapper-sm`]: mergedSize.value === 'small',
              [`${prefixClsValue}-affix-wrapper-lg`]: mergedSize.value === 'large',
              [`${prefixClsValue}-affix-wrapper-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-affix-wrapper-borderless`]: isBorderless,
              [`${prefixClsValue}-affix-wrapper-${mergedVariant.value}`]:
                (inputHasPrefixSuffix || (mergedVariant.value !== 'outlined' && hasAffixWrapper)) &&
                enableVariantCls.value,
            },
            getStatusClassNames(`${prefixClsValue}-affix-wrapper`, mergedStatus.value, hasFeedback),
            hashId.value,
          )}
          wrapperClassName={classNames(
            {
              [`${prefixClsValue}-group-rtl`]: direction.value === 'rtl',
            },
            hashId.value,
          )}
          groupClassName={classNames(
            {
              [`${prefixClsValue}-group-wrapper-sm`]: mergedSize.value === 'small',
              [`${prefixClsValue}-group-wrapper-lg`]: mergedSize.value === 'large',
              [`${prefixClsValue}-group-wrapper-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-group-wrapper-${mergedVariant.value}`]: enableVariantCls.value,
            },
            getStatusClassNames(`${prefixClsValue}-group-wrapper`, mergedStatus.value, hasFeedback),
            hashId.value,
          )}
          v-slots={{ ...slots, clearIcon }}
        ></VcInput>,
      );
    };
  },
});
