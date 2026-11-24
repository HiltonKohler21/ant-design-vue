import type { Plugin, ExtractPropTypes, App } from 'vue';
import { cloneVNode, computed, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import type { BaseSelectRef } from '../vc-select';
import RcSelect, { selectProps as vcSelectProps, Option, OptGroup } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-select/Select';
import type { OptionProps } from '../vc-select/Option';
import getIcons from './utils/iconUtil';
import genPurePanel from './utils/purePanel';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { DefaultRenderEmpty } from '../config-provider/renderEmpty';
import omit from '../_util/omit';
import useMergedState from '../_util/hooks/useMergedState';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import type { SelectCommonPlacement } from '../_util/transition';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import type { SizeType } from '../config-provider';
import type { Variant } from '../config-provider/context';
import { flattenChildren, initDefaultProps, isValidElement } from '../_util/props-util';

import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { stringType, someType, functionType, booleanType } from '../_util/type';
import {
  applySemanticToNode,
  mergeSemanticClassNames,
  mergeSemanticStyles,
  normalizePrefixNode,
  resolveSemanticValue,
} from './utils/semanticUtil';
import type {
  SelectClassNamesType,
  SelectSemanticClassNames,
  SelectSemanticStyles,
  SelectStylesType,
} from './utils/semanticUtil';
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
export type {
  OptionProps,
  BaseSelectRef as RefSelectProps,
  BaseOptionType,
  DefaultOptionType,
  SelectSemanticClassNames,
  SelectSemanticStyles,
  SelectClassNamesType,
  SelectStylesType,
};

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label?: any;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

export interface SelectSearchConfig<OptionType = DefaultOptionType> {
  autoClearSearchValue?: boolean;
  filterOption?: boolean | ((inputValue: string, option?: OptionType) => boolean);
  filterSort?: (optionA: OptionType, optionB: OptionType, info?: { searchValue: string }) => number;
  optionFilterProp?: string | string[];
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchIcon?: any;
}

export interface SelectOptionRenderInfo {
  index: number;
}

export interface SelectFlattenOptionData<OptionType = DefaultOptionType> {
  data: OptionType;
  label?: any;
  value?: any;
  key?: any;
}

export const selectProps = () => ({
  ...omit(vcSelectProps<SelectValue>(), [
    'inputIcon',
    'mode',
    'getInputElement',
    'getRawInputElement',
    'backfill',
    'showSearch',
    'optionFilterProp',
    'tokenSeparators',
  ]),
  value: someType<SelectValue>([Array, Object, String, Number]),
  defaultValue: someType<SelectValue>([Array, Object, String, Number]),
  notFoundContent: PropTypes.any,
  /** 选择器自定义后缀（antd v6 替代 suffixIcon） */
  suffix: PropTypes.any,
  suffixIcon: PropTypes.any,
  /** 加载中自定义图标（antd v6） */
  loadingIcon: PropTypes.any,
  /** 选择器内前缀图标 */
  prefix: PropTypes.any,
  itemIcon: PropTypes.any,
  size: stringType<SizeType>(),
  mode: stringType<'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'>(),
  bordered: booleanType(),
  variant: stringType<Variant>(),
  rootClassName: String,
  /** 语义化 classNames（支持对象与函数式） */
  classNames: someType<SelectClassNamesType>([Object, Function]),
  /** 语义化 styles（支持对象与函数式） */
  styles: someType<SelectStylesType>([Object, Function]),
  /** 最大可选中数量（仅在 multiple / tags 模式生效） */
  maxCount: Number,
  /** 自定义渲染下拉选项 */
  optionRender:
    functionType<
      (option: SelectFlattenOptionData<DefaultOptionType>, info: SelectOptionRenderInfo) => any
    >(),
  /** 自定义渲染当前选中的 label */
  labelRender: functionType<(props: { label: any; value: any; key?: any }) => any>(),
  /** 搜索配置（支持 boolean 或对象形式） */
  showSearch: someType<boolean | SelectSearchConfig>([Boolean, Object]),
  /** 搜索过滤字段（支持单字段或多字段数组） */
  optionFilterProp: someType<string | string[]>([String, Array]),
  /** 自动分词分隔符或自定义分词函数 */
  tokenSeparators: someType<string[] | ((input: string) => string[])>([Array, Function]),
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

function toRawValueArray(val: SelectValue): RawValue[] {
  if (val === undefined || val === null) {
    return [];
  }
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(item =>
    item !== null && typeof item === 'object' ? (item as LabeledValue).value : (item as RawValue),
  );
}

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
    suffix?: any;
    suffixIcon: any;
    loadingIcon?: any;
    prefix?: any;
    itemIcon: any;
    removeIcon: any;
    clearIcon: any;
    dropdownRender: any;
    popupRender?: any;
    option: any;
    optionRender?: any;
    labelRender?: any;
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

    const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags');

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
      devWarning(
        !(props.maxCount !== undefined && !isMultiple.value),
        'Select',
        '`maxCount` only works with mode `multiple` or `tags`.',
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
    const selectConfig = computed(() => configProvider.select?.value);
    const semanticInfo = computed(() => ({
      props: {
        ...props,
        variant: mergedVariant.value,
        status: mergedStatus.value,
        disabled: mergedDisabled.value,
        size: mergedSize.value,
      },
    }));
    const mergedClassNames = computed<SelectSemanticClassNames>(() =>
      mergeSemanticClassNames(
        resolveSemanticValue(selectConfig.value?.classNames, semanticInfo.value),
        resolveSemanticValue(props.classNames, semanticInfo.value),
      ),
    );
    const mergedStyles = computed<SelectSemanticStyles>(() =>
      mergeSemanticStyles(
        resolveSemanticValue(selectConfig.value?.styles, semanticInfo.value),
        resolveSemanticValue(props.styles, semanticInfo.value),
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
        selectConfig.value?.className,
        props.rootClassName,
        mergedClassNames.value.root,
        getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback),
        compactItemClassnames.value,
        hashId.value,
      ),
    );

    // ===================== Value / MaxCount / Tokenize =====================
    const [innerValue, setInnerValue] = useMergedState<SelectValue>(props.defaultValue, {
      value: computed(() => props.value),
    });
    const selectedRawValues = computed(() => toRawValueArray(innerValue.value));
    const selectedRawValueSet = computed(() => new Set(selectedRawValues.value));
    const isMaxCountActive = computed(
      () => isMultiple.value && typeof props.maxCount === 'number' && props.maxCount >= 0,
    );
    const isMaxCountReached = computed(
      () => isMaxCountActive.value && selectedRawValueSet.value.size >= (props.maxCount as number),
    );
    const isCustomTokenizer = computed(() => typeof props.tokenSeparators === 'function');
    const useControlledInnerValue = computed(
      () => isMaxCountActive.value || isCustomTokenizer.value,
    );

    // ===================== Search Config =====================
    const rawShowSearch = computed(() => props.showSearch ?? select?.value?.showSearch);
    const searchConfig = computed<SelectSearchConfig | undefined>(() =>
      rawShowSearch.value && typeof rawShowSearch.value === 'object'
        ? (rawShowSearch.value as SelectSearchConfig)
        : undefined,
    );
    const mergedShowSearchBool = computed<boolean | undefined>(() =>
      searchConfig.value ? true : (rawShowSearch.value as boolean | undefined),
    );
    const currentSearchValue = ref<string>(
      searchConfig.value?.searchValue ?? props.searchValue ?? '',
    );
    const mergedSearchValueProp = computed(
      () => searchConfig.value?.searchValue ?? props.searchValue,
    );
    const mergedAutoClearSearchValue = computed(
      () => searchConfig.value?.autoClearSearchValue ?? props.autoClearSearchValue,
    );
    const mergedOptionFilterProp = computed(
      () => searchConfig.value?.optionFilterProp ?? props.optionFilterProp,
    );
    const mergedFilterOption = computed(() => {
      const baseFilter =
        searchConfig.value?.filterOption !== undefined
          ? searchConfig.value.filterOption
          : props.filterOption;
      if (
        Array.isArray(mergedOptionFilterProp.value) &&
        baseFilter !== false &&
        typeof baseFilter !== 'function'
      ) {
        const fields = mergedOptionFilterProp.value;
        return (inputValue: string, option?: any) => {
          const lower = String(inputValue || '').toLowerCase();
          return fields.some(field => {
            const fieldVal = option?.[field];
            return (
              fieldVal !== undefined &&
              fieldVal !== null &&
              String(fieldVal).toLowerCase().includes(lower)
            );
          });
        };
      }
      return baseFilter;
    });
    const mergedFilterSort = computed(() => {
      const sortFn = searchConfig.value?.filterSort ?? props.filterSort;
      if (!sortFn) return undefined;
      return (optionA: any, optionB: any) =>
        sortFn(optionA, optionB, { searchValue: currentSearchValue.value });
    });

    const triggerChange: SelectProps['onChange'] = (...args) => {
      let nextVal = args[0] as SelectValue;
      let nextOpt = args[1];
      if (isMaxCountActive.value && Array.isArray(nextVal)) {
        const max = props.maxCount as number;
        const prevLen = selectedRawValues.value.length;
        if (nextVal.length > max && nextVal.length > prevLen) {
          if (prevLen >= max) {
            return;
          }
          nextVal = nextVal.slice(0, max) as SelectValue;
          if (Array.isArray(nextOpt)) {
            nextOpt = nextOpt.slice(0, max);
          }
        }
      }
      setInnerValue(nextVal);
      emit('update:value', nextVal);
      emit('change', nextVal, nextOpt);
      formItemContext.onFieldChange();
    };

    const commitTokenizedValues = (tokens: string[]) => {
      const cleaned = tokens.map(t => String(t).trim()).filter(Boolean);
      if (!cleaned.length) return;
      const customFieldNames = (props.fieldNames || {}) as {
        label?: string;
        value?: string;
        options?: string;
      };
      const fieldNames = {
        label: 'label',
        value: 'value',
        options: 'options',
        ...customFieldNames,
      };
      const allOptions: any[] = [];
      const collectOpts = (list?: any[]) => {
        if (!Array.isArray(list)) return;
        list.forEach(item => {
          if (item && Array.isArray(item[fieldNames.options])) {
            collectOpts(item[fieldNames.options]);
          } else if (item) {
            allOptions.push(item);
          }
        });
      };
      collectOpts(props.options);

      let nextTokens: RawValue[] = cleaned;
      if (mode.value !== 'tags') {
        nextTokens = cleaned
          .map(word => {
            const matched = allOptions.find(
              opt =>
                String(opt?.[fieldNames.label]) === word ||
                String(opt?.[fieldNames.value]) === word,
            );
            return matched?.[fieldNames.value];
          })
          .filter(v => v !== undefined);
      }
      if (!nextTokens.length) return;
      const mergedRaw = Array.from(new Set<RawValue>([...selectedRawValues.value, ...nextTokens]));
      const nextValues = props.labelInValue
        ? mergedRaw.map(v => {
            const matched = allOptions.find(opt => opt?.[fieldNames.value] === v);
            return { value: v, label: matched?.[fieldNames.label] ?? v };
          })
        : mergedRaw;
      const nextOpts = mergedRaw.map(
        v => allOptions.find(opt => opt?.[fieldNames.value] === v) ?? { value: v, label: v },
      );
      triggerChange(nextValues as SelectValue, nextOpts as any);
    };

    const handleSearch = (val: string) => {
      currentSearchValue.value = val;
      if (isCustomTokenizer.value && isMultiple.value && val) {
        const tokenize = props.tokenSeparators as (input: string) => string[];
        const tokens = tokenize(val);
        if (Array.isArray(tokens) && tokens.length > 1) {
          commitTokenizedValues(tokens);
          currentSearchValue.value = '';
          searchConfig.value?.onSearch?.('');
          props.onSearch?.('');
          return;
        }
      }
      searchConfig.value?.onSearch?.(val);
      props.onSearch?.(val);
    };

    const handleInputKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        isCustomTokenizer.value &&
        isMultiple.value &&
        currentSearchValue.value
      ) {
        const tokenize = props.tokenSeparators as (input: string) => string[];
        const tokens = tokenize(currentSearchValue.value);
        if (Array.isArray(tokens) && tokens.length > 0) {
          e.preventDefault();
          commitTokenizedValues(tokens);
          currentSearchValue.value = '';
          searchConfig.value?.onSearch?.('');
          props.onSearch?.('');
          props.onInputKeyDown?.(e);
          return;
        }
      }
      props.onInputKeyDown?.(e);
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
    const mergedShowArrow = computed(() =>
      props.showArrow !== undefined
        ? props.showArrow
        : props.loading || !(isMultiple.value || mode.value === 'combobox'),
    );

    // ===================== Popup API =====================
    const mergedPopupMatchSelectWidth = computed(
      () => props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth,
    );
    const mergedPopupRender = computed(() => props.popupRender ?? slots.popupRender);
    const mergedDropdownRender = computed(() => props.dropdownRender ?? slots.dropdownRender);
    const handleOpenChange = (open: boolean) => {
      props.onDropdownVisibleChange?.(open);
      emit('openChange', open);
      emit('update:open', open);
    };

    const applyMaxCountDisabledToOptions = (list: any[] | undefined): any[] | undefined => {
      if (!Array.isArray(list) || !isMaxCountReached.value) {
        return list;
      }
      const customFieldNames = (props.fieldNames || {}) as {
        label?: string;
        value?: string;
        options?: string;
      };
      const valueField = customFieldNames.value || 'value';
      const optionsField = customFieldNames.options || 'options';
      const selected = selectedRawValueSet.value;
      return list.map(item => {
        if (!item || typeof item !== 'object') return item;
        if (Array.isArray(item[optionsField])) {
          return {
            ...item,
            [optionsField]: applyMaxCountDisabledToOptions(item[optionsField]),
          };
        }
        const optVal = item[valueField];
        if (!selected.has(optVal) && !item.disabled) {
          return { ...item, disabled: true };
        }
        return item;
      });
    };

    const applyMaxCountDisabledToChildren = (nodes: any[]): any[] => {
      if (!isMaxCountReached.value || !Array.isArray(nodes)) {
        return nodes;
      }
      const selected = selectedRawValueSet.value;
      return nodes.map(node => {
        if (!isValidElement(node)) return node;
        const type: any = node.type;
        if (type?.isSelectOptGroup && typeof (node.children as any)?.default === 'function') {
          const origDefault = (node.children as any).default;
          return cloneVNode(node, {}, {
            ...((node.children as Record<string, any>) || {}),
            default: () => applyMaxCountDisabledToChildren(flattenChildren(origDefault())),
          } as any);
        }
        if (type?.isSelectOption) {
          const optVal = node.props?.value ?? node.key;
          if (!selected.has(optVal) && !node.props?.disabled) {
            return cloneVNode(node, { disabled: true });
          }
        }
        return node;
      });
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
      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;

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

      const hasExplicitSuffix =
        props.suffix !== undefined ||
        !!slots.suffix ||
        props.suffixIcon !== undefined ||
        !!slots.suffixIcon;
      const isSuffixHidden =
        props.suffix === null ||
        (props.suffix === undefined && !slots.suffix && props.suffixIcon === null);
      const effectiveShowArrow =
        showArrow !== undefined
          ? showArrow
          : isSuffixHidden
          ? false
          : hasExplicitSuffix && (isMultiple.value || mode.value === 'combobox')
          ? true
          : undefined;

      // ===================== Icons =====================
      const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          multiple: isMultiple.value,
          prefixCls: prefixCls.value,
          hasFeedback,
          feedbackIcon,
          showArrow: effectiveShowArrow !== undefined ? effectiveShowArrow : mergedShowArrow.value,
          suffixClassName: currentClassNames.suffix,
          suffixStyle: currentStyles.suffix,
          contextSuffix: selectConfig.value?.suffix,
          contextSuffixIcon: selectConfig.value?.suffixIcon,
          contextLoadingIcon: selectConfig.value?.loadingIcon,
          contextClearIcon: selectConfig.value?.clearIcon,
          contextMenuItemSelectedIcon: selectConfig.value?.menuItemSelectedIcon,
          contextRemoveIcon: selectConfig.value?.removeIcon,
        },
        slots,
      );

      const rawPrefix = props.prefix !== undefined ? props.prefix : slots.prefix?.();
      const mergedPrefix = applySemanticToNode(
        normalizePrefixNode(rawPrefix),
        currentClassNames.prefix,
        currentStyles.prefix,
      );

      const selectProps = omit(props, [
        'prefixCls',
        'prefix',
        'suffix',
        'suffixIcon',
        'loadingIcon',
        'itemIcon',
        'removeIcon',
        'clearIcon',
        'size',
        'bordered',
        'variant',
        'status',
        'popupRender',
        'dropdownRender',
        'popupMatchSelectWidth',
        'onOpenChange',
        'dropdownMatchSelectWidth',
        'rootClassName',
        'classNames',
        'styles',
        'dropdownStyle',
        'maxCount',
        'optionRender',
        'labelRender',
        'showSearch',
        'optionFilterProp',
        'filterOption',
        'filterSort',
        'searchValue',
        'onSearch',
        'autoClearSearchValue',
        'tokenSeparators',
        'onInputKeyDown',
        'options',
        'value',
      ]);

      const rcSelectRtlDropdownClassName = classNames(
        currentClassNames.popup?.root,
        popupClassName || dropdownClassName,
        {
          [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl',
        },
        hashId.value,
      );

      const mergedDropdownStyle =
        currentStyles.popup?.root || props.dropdownStyle
          ? { ...props.dropdownStyle, ...currentStyles.popup?.root }
          : undefined;

      const mergedOptions = applyMaxCountDisabledToOptions(props.options);
      const rawChildren = slots.default?.();
      const mergedChildren = rawChildren
        ? applyMaxCountDisabledToChildren(flattenChildren(rawChildren))
        : undefined;

      // OptionRender bridge
      const optionRenderFn = props.optionRender || slots.optionRender;
      const customFieldNames = (props.fieldNames || {}) as {
        label?: string;
        value?: string;
        options?: string;
      };
      let mergedOptionSlot = slots.option;
      if (!mergedOptionSlot && optionRenderFn) {
        const valueField = customFieldNames.value || 'value';
        const labelField = customFieldNames.label || 'label';
        const optionsField = customFieldNames.options || 'options';
        const indexMap = new Map<any, number>();
        let flatIdx = 0;
        const buildIndexMap = (list?: any[]) => {
          if (!Array.isArray(list)) return;
          list.forEach(item => {
            if (item && Array.isArray(item[optionsField])) {
              buildIndexMap(item[optionsField]);
            } else if (item) {
              indexMap.set(item[valueField], flatIdx++);
            }
          });
        };
        buildIndexMap(mergedOptions);
        mergedOptionSlot = (data: any) => {
          if (data && Array.isArray(data[optionsField])) {
            return data[labelField] ?? data.key;
          }
          const val = data?.[valueField];
          const label = data?.[labelField];
          const key = data?.key ?? val;
          const idx = indexMap.has(val) ? (indexMap.get(val) as number) : 0;
          return optionRenderFn({ data, label, value: val, key }, { index: idx });
        };
      }

      // LabelRender bridge
      const labelRenderFn = props.labelRender || slots.labelRender;
      const mergedOptionLabelRender = labelRenderFn
        ? (opt: any) => {
            const valueField = customFieldNames.value || 'value';
            const labelField = customFieldNames.label || 'label';
            if (opt && typeof opt === 'object') {
              return labelRenderFn({
                label: opt[labelField],
                value: opt[valueField],
                key: opt.key ?? opt[valueField],
              });
            }
            const rawVal = Array.isArray(innerValue.value) ? innerValue.value[0] : innerValue.value;
            const isObj = rawVal !== null && typeof rawVal === 'object';
            return labelRenderFn({
              label: isObj ? (rawVal as LabeledValue).label : undefined,
              value: isObj ? (rawVal as LabeledValue).value : rawVal,
              key: isObj ? (rawVal as LabeledValue).key ?? (rawVal as LabeledValue).value : rawVal,
            });
          }
        : slots.optionLabel;

      const resolvedSearchValue = isCustomTokenizer.value
        ? mergedSearchValueProp.value !== undefined
          ? mergedSearchValueProp.value
          : currentSearchValue.value
        : mergedSearchValueProp.value;

      const needSearchHandler = !!(
        props.onSearch ||
        searchConfig.value?.onSearch ||
        isCustomTokenizer.value ||
        (mergedShowSearchBool.value && mergedFilterSort.value)
      );
      const needInputKeyDownHandler = !!(isCustomTokenizer.value || props.onInputKeyDown);

      return wrapSSR(
        <RcSelect
          ref={selectRef}
          virtual={virtual}
          {...selectProps}
          options={mergedOptions}
          value={useControlledInnerValue.value ? innerValue.value : props.value}
          dropdownMatchSelectWidth={mergedPopupMatchSelectWidth.value}
          {...attrs}
          showSearch={mergedShowSearchBool.value}
          filterOption={mergedFilterOption.value}
          filterSort={mergedFilterSort.value}
          optionFilterProp={
            typeof mergedOptionFilterProp.value === 'string'
              ? mergedOptionFilterProp.value
              : undefined
          }
          searchValue={resolvedSearchValue}
          onSearch={needSearchHandler ? handleSearch : undefined}
          autoClearSearchValue={mergedAutoClearSearchValue.value}
          tokenSeparators={Array.isArray(props.tokenSeparators) ? props.tokenSeparators : undefined}
          onInputKeyDown={needInputKeyDownHandler ? handleInputKeyDown : undefined}
          placeholder={placeholder}
          listHeight={listHeight}
          listItemHeight={listItemHeight}
          mode={mode.value}
          prefixCls={prefixCls.value}
          direction={direction.value}
          inputIcon={suffixIcon}
          prefix={mergedPrefix}
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
          popupRender={mergedPopupRender.value}
          dropdownRender={mergedDropdownRender.value}
          onDropdownVisibleChange={handleOpenChange}
          dropdownStyle={mergedDropdownStyle}
          style={[selectConfig.value?.style, currentStyles.root, attrs.style as any]}
          v-slots={{ option: mergedOptionSlot }}
          transitionName={transitionName.value}
          children={mergedChildren}
          tagRender={props.tagRender || slots.tagRender}
          optionLabelRender={mergedOptionLabelRender}
          maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
          showArrow={hasFeedback || effectiveShowArrow}
          disabled={mergedDisabled.value}
        ></RcSelect>,
      );
    };
  },
});

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Select, 'dropdownAlign');
(Select as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

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
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
