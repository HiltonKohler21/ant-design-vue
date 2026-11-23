import {
  onBeforeUpdate,
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
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
import type { InputSemanticClassNames, InputSemanticStyles } from './inputProps';
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

    const triggerChange = (e: Event) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };

    return () => {
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const {
        allowClear,
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        addonAfter = slots.addonAfter?.(),
        addonBefore = slots.addonBefore?.(),
        id = formItemContext.id?.value,
        ...rest
      } = props;
      const suffixNode = (hasFeedback || suffix) && (
        <>
          {suffix}
          {hasFeedback && feedbackIcon}
        </>
      );
      const prefixClsValue = prefixCls.value;
      const inputHasPrefixSuffix = hasPrefixSuffix({ prefix, suffix }) || !!hasFeedback;
      const variantCls =
        enableVariantCls.value && mergedVariant.value !== 'outlined'
          ? `${prefixClsValue}-${mergedVariant.value}`
          : undefined;
      const isBorderless = mergedVariant.value === 'borderless';
      const clearIcon = slots.clearIcon || (() => <CloseCircleFilled />);
      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;
      const hasWrapper = Boolean(
        hasPrefixSuffix({ prefix, suffix: suffixNode || props.showCount, allowClear }) ||
          addonAfter ||
          addonBefore,
      );
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
      return wrapSSR(
        <VcInput
          {...attrs}
          {...omit(rest, [
            'onUpdate:value',
            'onChange',
            'onInput',
            'classNames',
            'styles',
            'rootClassName',
          ])}
          style={mergedStyle as any}
          onChange={triggerChange}
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
          allowClear={allowClear}
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
          ]}
          inputClassName={classNames(
            {
              [`${prefixClsValue}-sm`]: mergedSize.value === 'small',
              [`${prefixClsValue}-lg`]: mergedSize.value === 'large',
              [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-borderless`]: isBorderless,
              [variantCls]: !inputHasPrefixSuffix && !!variantCls,
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
                inputHasPrefixSuffix && enableVariantCls.value,
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
