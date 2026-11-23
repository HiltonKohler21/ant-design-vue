import type { Plugin, ExtractPropTypes, App } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import type { BaseSelectRef } from '../vc-select';
import RcSelect, { selectProps as vcSelectProps, Option, OptGroup } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-select/Select';
import type { OptionProps } from '../vc-select/Option';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { DefaultRenderEmpty } from '../config-provider/renderEmpty';
import omit from '../_util/omit';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import type { SelectCommonPlacement } from '../_util/transition';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import type { SizeType } from '../config-provider';
import type { Variant } from '../config-provider/context';
import { initDefaultProps } from '../_util/props-util';

import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { stringType, someType, functionType, booleanType, objectType } from '../_util/type';
import type { SemanticClassNames, SemanticStyles } from '../_util/semantic';
import { useCompactItemContext } from '../space/Compact';
// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import useVariant from '../form/hooks/useVariant';
import { deprecated } from '../_util/warning';
import devWarning from '../vc-util/devWarning';

import type { CustomSlotsType } from '../_util/type';

type RawValue = string | number;

export type OptionType = typeof Option;
export type { OptionProps, BaseSelectRef as RefSelectProps, BaseOptionType, DefaultOptionType };

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label?: any;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

export const selectProps = () => ({
  ...omit(vcSelectProps<SelectValue>(), [
    'inputIcon',
    'mode',
    'getInputElement',
    'getRawInputElement',
    'backfill',
  ]),
  value: someType<SelectValue>([Array, Object, String, Number]),
  defaultValue: someType<SelectValue>([Array, Object, String, Number]),
  notFoundContent: PropTypes.any,
  suffixIcon: PropTypes.any,
  /** 选择器内前缀图标 */
  prefix: PropTypes.any,
  itemIcon: PropTypes.any,
  size: stringType<SizeType>(),
  mode: stringType<'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'>(),
  bordered: booleanType(),
  variant: stringType<Variant>(),
  rootClassName: String,
  /** 语义化 classNames（antd 5.25+） */
  classNames: objectType<SemanticClassNames>(),
  /** 语义化 styles（antd 5.25+） */
  styles: objectType<SemanticStyles>(),
  transitionName: String,
  choiceTransitionName: stringType(''),
  popupClassName: String,
  /** 自定义弹层宽度（antd 5.25 起替代 dropdownMatchSelectWidth） */
  popupMatchSelectWidth: { type: [Number, Boolean], default: undefined },
  /** 自定义下拉内容（antd 5.25 起替代 dropdownRender） */
  popupRender: functionType<(menu: any) => any>(),
  /** 展开/收起回调（antd 5.25 起替代 onDropdownVisibleChange） */
  onOpenChange: functionType<(open: boolean) => void>(),
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName: String,
  placement: stringType<SelectCommonPlacement>(),
  status: stringType<InputStatus>(),
  'onUpdate:value': functionType<(val: SelectValue) => void>(),
});

export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const Select = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASelect',
  Option,
  OptGroup,
  inheritAttrs: false,
  props: initDefaultProps(selectProps(), {
    listHeight: 256,
    listItemHeight: 24,
  }),
  SECRET_COMBOBOX_MODE_DO_NOT_USE,
  slots: Object as CustomSlotsType<{
    notFoundContent: any;
    suffixIcon: any;
    prefix?: any;
    itemIcon: any;
    removeIcon: any;
    clearIcon: any;
    dropdownRender: any;
    option: any;
    placeholder: any;
    tagRender: any;
    maxTagPlaceholder: any;
    optionLabel: any;
    default: any;
  }>,
  setup(props, { attrs, emit, slots, expose }) {
    const selectRef = ref<BaseSelectRef>();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const focus = () => {
      selectRef.value?.focus();
    };

    const blur = () => {
      selectRef.value?.blur();
    };

    const scrollTo: BaseSelectRef['scrollTo'] = arg => {
      selectRef.value?.scrollTo(arg);
    };

    const mode = computed(() => {
      const { mode } = props;

      if ((mode as any) === 'combobox') {
        return undefined;
      }

      if (mode === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
        return 'combobox';
      }

      return mode;
    });

    // ====================== Warning ======================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !props.popupClassName,
        'Select',
        '`popupClassName` is deprecated. Please use `classNames.popup.root` instead.',
      );
      devWarning(
        !props.dropdownStyle,
        'Select',
        '`dropdownStyle` is deprecated. Please use `styles.popup.root` instead.',
      );
      devWarning(
        !props.dropdownClassName,
        'Select',
        '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
      );
    }
    const {
      prefixCls,
      direction,
      configProvider,
      renderEmpty,
      size: contextSize,
      getPrefixCls,
      getPopupContainer,
      disabled,
      select,
    } = useConfigInject('select', props);
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => compactSize.value || contextSize.value);

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'select',
      computed(() => props.variant),
      computed(() => props.bordered),
    );
    deprecated(props.bordered === undefined, 'bordered', 'variant', 'Select');
    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? contextDisabled.value);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const rootPrefixCls = computed(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl'
        ? ('bottomRight' as SelectCommonPlacement)
        : ('bottomLeft' as SelectCommonPlacement);
    });
    const transitionName = computed(() =>
      getTransitionName(
        rootPrefixCls.value,
        getTransitionDirection(placement.value),
        props.transitionName,
      ),
    );
    const mergedClassName = computed(() =>
      classNames(
        {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-borderless`]: mergedVariant.value === 'borderless',
          [`${prefixCls.value}-${mergedVariant.value}`]:
            enableVariantCls.value && mergedVariant.value !== 'outlined',
          [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput,
        },
        props.rootClassName,
        props.classNames?.root,
        getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback),
        compactItemClassnames.value,
        hashId.value,
      ),
    );
    const triggerChange: SelectProps['onChange'] = (...args) => {
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur: SelectProps['onBlur'] = e => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    expose({
      blur,
      focus,
      scrollTo,
    });
    const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags');
    const mergedShowArrow = computed(() =>
      props.showArrow !== undefined
        ? props.showArrow
        : props.loading || !(isMultiple.value || mode.value === 'combobox'),
    );

    // ===================== Popup API =====================
    const mergedPopupMatchSelectWidth = computed(
      () => props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth,
    );
    const mergedPopupRender = computed(
      () => props.popupRender ?? props.dropdownRender ?? slots.dropdownRender,
    );
    const handleOpenChange = (open: boolean) => {
      props.onDropdownVisibleChange?.(open);
      emit('openChange', open);
      emit('update:open', open);
    };

    return () => {
      const {
        notFoundContent,
        listHeight = 256,
        listItemHeight = 24,
        popupClassName,
        dropdownClassName,
        virtual,
        id = formItemContext.id.value,
        placeholder = slots.placeholder?.(),
        showArrow,
      } = props;
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const {} = configProvider;

      // ===================== Empty =====================
      let mergedNotFound: any;
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else if (slots.notFoundContent) {
        mergedNotFound = slots.notFoundContent();
      } else if (mode.value === 'combobox') {
        mergedNotFound = null;
      } else {
        mergedNotFound = renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
      }

      // ===================== Icons =====================
      const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          multiple: isMultiple.value,
          prefixCls: prefixCls.value,
          hasFeedback,
          feedbackIcon,
          showArrow: mergedShowArrow.value,
        },
        slots,
      );

      const selectProps = omit(props, [
        'prefixCls',
        'suffixIcon',
        'itemIcon',
        'removeIcon',
        'clearIcon',
        'size',
        'bordered',
        'variant',
        'status',
        'popupRender',
        'popupMatchSelectWidth',
        'onOpenChange',
        'dropdownMatchSelectWidth',
        'rootClassName',
        'classNames',
        'styles',
        'dropdownStyle',
      ]);

      const rcSelectRtlDropdownClassName = classNames(
        props.classNames?.popup?.root,
        popupClassName || dropdownClassName,
        {
          [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl',
        },
        hashId.value,
      );

      return wrapSSR(
        <RcSelect
          ref={selectRef}
          virtual={virtual}
          {...selectProps}
          dropdownMatchSelectWidth={mergedPopupMatchSelectWidth.value}
          {...attrs}
          showSearch={props.showSearch ?? select?.value?.showSearch}
          placeholder={placeholder}
          listHeight={listHeight}
          listItemHeight={listItemHeight}
          mode={mode.value}
          prefixCls={prefixCls.value}
          direction={direction.value}
          inputIcon={suffixIcon}
          prefix={props.prefix ?? slots.prefix?.()}
          menuItemSelectedIcon={itemIcon}
          removeIcon={removeIcon}
          clearIcon={clearIcon}
          notFoundContent={mergedNotFound}
          class={[mergedClassName.value, attrs.class]}
          getPopupContainer={getPopupContainer?.value}
          dropdownClassName={rcSelectRtlDropdownClassName}
          onChange={triggerChange}
          onBlur={handleBlur}
          id={id}
          dropdownRender={mergedPopupRender.value}
          onDropdownVisibleChange={handleOpenChange}
          dropdownStyle={props.styles?.popup?.root ?? props.dropdownStyle}
          style={[props.styles?.root, attrs.style as any]}
          v-slots={{ option: slots.option }}
          transitionName={transitionName.value}
          children={slots.default?.()}
          tagRender={props.tagRender || slots.tagRender}
          optionLabelRender={slots.optionLabel}
          maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
          showArrow={hasFeedback || showArrow}
          disabled={mergedDisabled.value}
        ></RcSelect>,
      );
    };
  },
});
/* istanbul ignore next */
Select.install = function (app: App) {
  app.component(Select.name, Select);
  app.component(Select.Option.displayName, Select.Option);
  app.component(Select.OptGroup.displayName, Select.OptGroup);
  return app;
};

export const SelectOption = Select.Option;
export const SelectOptGroup = Select.OptGroup;
export default Select as typeof Select &
  Plugin & {
    readonly Option: typeof Option;
    readonly OptGroup: typeof OptGroup;
    readonly SECRET_COMBOBOX_MODE_DO_NOT_USE: 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  };
