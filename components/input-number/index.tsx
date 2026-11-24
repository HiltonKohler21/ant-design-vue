import type { CSSProperties, ExtractPropTypes, HTMLAttributes, PropType, App } from 'vue';
import { watch, defineComponent, shallowRef, computed } from 'vue';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import MinusOutlined from '@ant-design/icons-vue/MinusOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import VcInputNumber, { inputNumberProps as baseInputNumberProps } from './src/InputNumber';
import type { SizeType } from '../config-provider';
import ConfigProvider from '../config-provider';
import type { Variant } from '../config-provider/context';
import { useComponentConfig } from '../config-provider/hooks/useComponentConfig';
import useVariant from '../form/hooks/useVariant';
import { deprecated } from '../_util/warning';
import {
  FormItemInputContext,
  NoFormStatus,
  useInjectFormItemContext,
} from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { cloneElement } from '../_util/vnode';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import isValidValue from '../_util/isValidValue';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { booleanType, functionType, stringType } from '../_util/type';
import type { CustomSlotsType, VueNode } from '../_util/type';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import {
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticStyles,
  type SemanticClassNamesType,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

// CSSINJS
import useStyle from './style';
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
import { useInjectDisabled } from '../config-provider/DisabledContext';

export type InputNumberSemanticName =
  | 'root'
  | 'prefix'
  | 'suffix'
  | 'input'
  | 'actions'
  | 'action'
  | 'clear';

export type InputNumberSemanticClassNames = SemanticClassNames<InputNumberSemanticName>;
export type InputNumberSemanticStyles = SemanticStyles<InputNumberSemanticName>;
export type InputNumberClassNamesType<P = Record<string, any>> = SemanticClassNamesType<
  P,
  InputNumberSemanticName
>;
export type InputNumberStylesType<P = Record<string, any>> = SemanticStylesType<
  P,
  InputNumberSemanticName
>;

export type InputNumberMode = 'input' | 'spinner';

export interface InputNumberAllowClearConfig {
  clearIcon?: VueNode;
  disabled?: boolean;
  label?: string;
  tabIndex?: number;
}

export interface InputNumberControlsConfig {
  upIcon?: VueNode;
  downIcon?: VueNode;
}

function resolveAllowClear(
  propAllowClear: boolean | InputNumberAllowClearConfig | undefined,
  contextAllowClear: boolean | InputNumberAllowClearConfig | undefined,
): { enabled: boolean; clearIcon?: VueNode; label?: string; tabIndex?: number } {
  const propObj =
    typeof propAllowClear === 'object' && propAllowClear !== null ? propAllowClear : undefined;
  const ctxObj =
    typeof contextAllowClear === 'object' && contextAllowClear !== null
      ? contextAllowClear
      : undefined;

  if (propAllowClear === false || propObj?.disabled) {
    return { enabled: false };
  }
  if (propAllowClear === undefined) {
    if (!contextAllowClear || ctxObj?.disabled) {
      return { enabled: false };
    }
    return {
      enabled: true,
      clearIcon: ctxObj?.clearIcon,
      label: ctxObj?.label,
      tabIndex: ctxObj?.tabIndex,
    };
  }
  return {
    enabled: true,
    clearIcon: propObj?.clearIcon ?? ctxObj?.clearIcon,
    label: propObj?.label ?? ctxObj?.label,
    tabIndex: propObj?.tabIndex ?? ctxObj?.tabIndex,
  };
}

const baseProps = baseInputNumberProps();
export const inputNumberProps = () => ({
  ...omit(baseProps, ['controls']),
  size: stringType<SizeType>(),
  bordered: booleanType(),
  rootClassName: String,
  variant: stringType<Variant>(),
  mode: stringType<InputNumberMode>('input'),
  controls: {
    type: [Boolean, Object] as PropType<boolean | InputNumberControlsConfig>,
    default: true,
  },
  allowClear: {
    type: [Boolean, Object] as PropType<boolean | InputNumberAllowClearConfig>,
    default: undefined,
  },
  onClear: functionType<() => void>(),
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  'onUpdate:value': baseProps.onChange,
  valueModifiers: Object,
  status: stringType<InputStatus>(),
  /** 语义化 classNames（支持对象与函数式）：root / prefix / suffix / input / actions / action / clear */
  classNames: {
    type: [Object, Function] as PropType<InputNumberClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（支持对象与函数式）：root / prefix / suffix / input / actions / action / clear */
  styles: {
    type: [Object, Function] as PropType<InputNumberStylesType>,
    default: undefined,
  },
});

export type InputNumberProps = Partial<ExtractPropTypes<ReturnType<typeof inputNumberProps>>>;

const InputNumber = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps(),
  // emits: ['focus', 'blur', 'change', 'input', 'update:value', 'clear'],
  slots: Object as CustomSlotsType<{
    addonBefore?: any;
    addonAfter?: any;
    prefix?: any;
    suffix?: any;
    clearIcon?: any;
    default?: any;
    upIcon?: any;
    downIcon?: any;
  }>,

  setup(props, { emit, expose, attrs, slots }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const { prefixCls, size, direction, disabled } = useConfigInject('input-number', props);
    const {
      componentConfig: inputNumberConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('inputNumber');

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'inputNumber',
      computed(() => props.variant),
      computed(() => props.bordered),
    );
    deprecated(props.bordered === undefined, 'bordered', 'variant', 'InputNumber');
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? disabledContext.value);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedSize = computed(() => compactSize.value || size.value);
    const mergedMode = computed<InputNumberMode>(() => props.mode || 'input');

    const mergedAllowClear = computed(() =>
      resolveAllowClear(props.allowClear, inputNumberConfig.value?.allowClear),
    );

    const mergedControls = computed(() => {
      if (!props.controls || mergedDisabled.value || props.readonly) {
        return false;
      }
      return props.controls;
    });

    const semanticInfo = computed(() => ({
      props: {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
        variant: mergedVariant.value,
        status: mergedStatus.value as any,
        mode: mergedMode.value,
        controls: mergedControls.value,
        allowClear: mergedAllowClear.value.enabled ? props.allowClear ?? true : false,
      },
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputNumberSemanticClassNames,
      InputNumberSemanticStyles,
      Record<string, any>
    >(
      computed(() => [contextClassNames.value as any, props.classNames as any]),
      computed(() => [contextStyles.value as any, props.styles as any]),
      semanticInfo,
    );

    const mergedValue = shallowRef<number | string | null | undefined>(
      props.value ?? props.defaultValue,
    );
    const focused = shallowRef(false);
    watch(
      () => props.value,
      () => {
        mergedValue.value = props.value;
      },
    );
    const inputNumberRef = shallowRef<any>(null);
    const outerRootRef = shallowRef<HTMLElement | null>(null);
    const focus = (option?: InputFocusOptions) => {
      inputNumberRef.value?.focus(option);
    };
    const blur = () => {
      inputNumberRef.value?.blur();
    };
    expose({
      focus,
      blur,
      get nativeElement() {
        return outerRootRef.value || inputNumberRef.value?.nativeElement;
      },
    });
    const handleChange = (val: number | string | null) => {
      if (props.value === undefined) {
        mergedValue.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleClear = (e: Event) => {
      e.stopPropagation();
      if (mergedDisabled.value || props.readonly) {
        return;
      }
      inputNumberRef.value?.clear?.();
      if (props.value === undefined) {
        mergedValue.value = null;
      }
      emit('clear');
    };
    const handleBlur = (e: FocusEvent) => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleFocus = (e: FocusEvent) => {
      focused.value = true;
      emit('focus', e);
    };

    return () => {
      const { hasFeedback, isFormItemInput, feedbackIcon } = formItemInputContext;
      const id = props.id ?? formItemContext.id.value;
      const {
        class: className,
        readonly,
        style,
        addonBefore = slots.addonBefore?.(),
        addonAfter = slots.addonAfter?.(),
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        valueModifiers = {},
        ...others
      } = { ...attrs, ...props, id, disabled: mergedDisabled.value } as InputNumberProps &
        HTMLAttributes;

      const preCls = prefixCls.value;
      const isSpinner = mergedMode.value === 'spinner';
      const hasAddon = isValidValue(addonBefore) || isValidValue(addonAfter);
      const hasPrefix = isValidValue(prefix);
      const hasSuffix = isValidValue(suffix);
      const clearCfg = mergedAllowClear.value;
      const hasClear = clearCfg.enabled;
      const hasAffix = !isSpinner && (hasPrefix || hasSuffix || hasFeedback || hasClear);

      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;

      const rootCombinedClass = classNames(
        contextClassName.value,
        className,
        props.rootClassName,
        currentClassNames.root,
      );
      const hasRootCustomStyle = Boolean(contextStyle.value || currentStyles.root || style);
      const rootCombinedStyle = hasRootCustomStyle
        ? ([contextStyle.value, currentStyles.root, style].filter(Boolean) as any)
        : undefined;

      const showClearBtn =
        hasClear &&
        !mergedDisabled.value &&
        !readonly &&
        mergedValue.value !== null &&
        mergedValue.value !== undefined &&
        mergedValue.value !== '';

      const customClearIcon = slots.clearIcon?.() ?? clearCfg.clearIcon;
      const clearNode = hasClear ? (
        <span
          role="button"
          tabindex={clearCfg.tabIndex ?? 0}
          aria-label={clearCfg.label || 'Clear'}
          class={classNames(
            `${preCls}-clear-icon`,
            {
              [`${preCls}-clear-icon-hidden`]: !showClearBtn,
              [`${preCls}-clear-icon-has-suffix`]: hasSuffix || hasFeedback,
            },
            currentClassNames.clear,
          )}
          style={currentStyles.clear}
          onMousedown={e => e.preventDefault()}
          onClick={handleClear}
          onKeydown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClear(e);
            }
          }}
        >
          {customClearIcon ?? <CloseCircleFilled />}
        </span>
      ) : null;

      const controlsObj: InputNumberControlsConfig | undefined =
        typeof props.controls === 'object' && props.controls !== null
          ? (props.controls as InputNumberControlsConfig)
          : undefined;
      const controlsEnabled = typeof props.controls === 'boolean' ? props.controls : true;

      const defaultUpIcon = isSpinner ? (
        <PlusOutlined class={`${preCls}-handler-up-inner`} />
      ) : (
        <UpOutlined class={`${preCls}-handler-up-inner`} />
      );
      const defaultDownIcon = isSpinner ? (
        <MinusOutlined class={`${preCls}-handler-down-inner`} />
      ) : (
        <DownOutlined class={`${preCls}-handler-down-inner`} />
      );

      const upHandlerSlot = slots.upIcon
        ? () => <span class={`${preCls}-handler-up-inner`}>{slots.upIcon()}</span>
        : controlsObj?.upIcon
        ? () => <span class={`${preCls}-handler-up-inner`}>{controlsObj.upIcon}</span>
        : () => defaultUpIcon;

      const downHandlerSlot = slots.downIcon
        ? () => <span class={`${preCls}-handler-down-inner`}>{slots.downIcon()}</span>
        : controlsObj?.downIcon
        ? () => <span class={`${preCls}-handler-down-inner`}>{controlsObj.downIcon}</span>
        : () => defaultDownIcon;

      const prefixNode = hasPrefix ? (
        <span
          class={classNames(`${preCls}-prefix`, currentClassNames.prefix)}
          style={currentStyles.prefix}
        >
          {prefix}
        </span>
      ) : null;

      const suffixNode =
        hasSuffix || hasFeedback || hasClear ? (
          <span
            class={classNames(`${preCls}-suffix`, currentClassNames.suffix)}
            style={currentStyles.suffix}
          >
            {clearNode}
            {suffix}
            {hasFeedback && feedbackIcon}
          </span>
        ) : null;

      const inputNumberClass = classNames(
        {
          [`${preCls}-lg`]: mergedSize.value === 'large',
          [`${preCls}-sm`]: mergedSize.value === 'small',
          [`${preCls}-rtl`]: direction.value === 'rtl',
          [`${preCls}-readonly`]: readonly,
          [`${preCls}-borderless`]: mergedVariant.value === 'borderless',
          [`${preCls}-${mergedVariant.value}`]:
            enableVariantCls.value && mergedVariant.value !== 'outlined',
          [`${preCls}-in-form-item`]: isFormItemInput,
          [`${preCls}-without-controls`]: !controlsEnabled,
        },
        getStatusClassNames(preCls, mergedStatus.value, isSpinner && hasFeedback),
        !hasAffix && !hasAddon && rootCombinedClass,
        compactItemClassnames.value,
        hashId.value,
      );

      let element = (
        <VcInputNumber
          {...omit(others, [
            'size',
            'defaultValue',
            'variant',
            'bordered',
            'controls',
            'allowClear',
            'onClear',
            'classNames',
            'styles',
            'rootClassName',
            'mode',
          ])}
          ref={inputNumberRef}
          mode={mergedMode.value}
          controls={controlsEnabled}
          semanticClassNames={currentClassNames}
          semanticStyles={currentStyles}
          lazy={!!valueModifiers.lazy}
          value={mergedValue.value as any}
          class={inputNumberClass}
          prefixCls={preCls}
          readonly={readonly}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          v-slots={{
            upHandler: upHandlerSlot,
            downHandler: downHandlerSlot,
            ...(isSpinner
              ? {
                  prefix: prefixNode ? () => prefixNode : undefined,
                  suffix: suffixNode ? () => suffixNode : undefined,
                }
              : {}),
          }}
        />
      );

      if (hasAffix) {
        const affixWrapperCls = classNames(
          `${preCls}-affix-wrapper`,
          getStatusClassNames(`${preCls}-affix-wrapper`, mergedStatus.value, hasFeedback),
          {
            [`${preCls}-affix-wrapper-focused`]: focused.value,
            [`${preCls}-affix-wrapper-disabled`]: mergedDisabled.value,
            [`${preCls}-affix-wrapper-sm`]: mergedSize.value === 'small',
            [`${preCls}-affix-wrapper-lg`]: mergedSize.value === 'large',
            [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
            [`${preCls}-affix-wrapper-readonly`]: readonly,
            [`${preCls}-affix-wrapper-borderless`]: mergedVariant.value === 'borderless',
            [`${preCls}-affix-wrapper-${mergedVariant.value}`]:
              enableVariantCls.value && mergedVariant.value !== 'outlined',
            [`${preCls}-affix-wrapper-without-controls`]: !controlsEnabled,
          },
          !hasAddon && rootCombinedClass,
          hashId.value,
        );
        element = (
          <div
            ref={!hasAddon ? outerRootRef : undefined}
            class={affixWrapperCls}
            style={!hasAddon ? rootCombinedStyle : undefined}
            onClick={() => focus()}
          >
            {prefixNode}
            {element}
            {suffixNode}
          </div>
        );
      }

      if (hasAddon) {
        const wrapperClassName = `${preCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;
        const addonBeforeNode = addonBefore ? (
          <div class={addonClassName}>{addonBefore}</div>
        ) : null;
        const addonAfterNode = addonAfter ? <div class={addonClassName}>{addonAfter}</div> : null;

        const mergedWrapperClassName = classNames(
          `${preCls}-wrapper`,
          wrapperClassName,
          {
            [`${wrapperClassName}-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
        );

        const mergedGroupClassName = classNames(
          `${preCls}-group-wrapper`,
          {
            [`${preCls}-group-wrapper-sm`]: mergedSize.value === 'small',
            [`${preCls}-group-wrapper-lg`]: mergedSize.value === 'large',
            [`${preCls}-group-wrapper-rtl`]: direction.value === 'rtl',
            [`${preCls}-group-wrapper-${mergedVariant.value}`]: enableVariantCls.value,
            [`${preCls}-group-wrapper-disabled`]: mergedDisabled.value,
          },
          getStatusClassNames(`${preCls}-group-wrapper`, mergedStatus.value, hasFeedback),
          rootCombinedClass,
          hashId.value,
        );
        element = (
          <div ref={outerRootRef} class={mergedGroupClassName} style={rootCombinedStyle}>
            <div class={mergedWrapperClassName}>
              {addonBeforeNode && (
                <NoCompactStyle>
                  <NoFormStatus>{addonBeforeNode}</NoFormStatus>
                </NoCompactStyle>
              )}
              {element}
              {addonAfterNode && (
                <NoCompactStyle>
                  <NoFormStatus>{addonAfterNode}</NoFormStatus>
                </NoCompactStyle>
              )}
            </div>
          </div>
        );
      }
      if (!hasAffix && !hasAddon && rootCombinedStyle) {
        return wrapSSR(cloneElement(element, { style: rootCombinedStyle as CSSProperties }));
      }
      return wrapSSR(element);
    };
  },
});

/** @private Internal Component. Do not use in your production. */
const PureInputNumber = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputNumberPurePanel',
  inheritAttrs: false,
  props: inputNumberProps(),
  setup(props, { attrs, slots }) {
    return () => (
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              handleVisible: true,
            },
          },
        }}
      >
        <InputNumber {...attrs} {...props} v-slots={slots} />
      </ConfigProvider>
    );
  },
});

export { PureInputNumber as InputNumberPurePanel };

export default Object.assign(InputNumber, {
  _InternalPanelDoNotUseOrYouWillBeFired: PureInputNumber,
  install: (app: App) => {
    app.component(InputNumber.name, InputNumber);
    return app;
  },
});
