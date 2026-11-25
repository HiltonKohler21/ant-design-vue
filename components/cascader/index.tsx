import type { ShowSearchType, FieldNames, BaseOptionType, DefaultOptionType } from '../vc-cascader';
import VcCascader, {
  cascaderProps as vcCascaderProps,
  SHOW_CHILD,
  SHOW_PARENT,
} from '../vc-cascader';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import getIcons from '../select/utils/iconUtil';
import genPurePanel from '../select/utils/purePanel';
import type { VueNode } from '../_util/type';
import omit from '../_util/omit';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import type { App, CSSProperties, ExtractPropTypes, Plugin, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { SizeType } from '../config-provider';
import type { Variant } from '../config-provider/context';
import {
  applySemanticToNode,
  mergeSemanticClassNames,
  mergeSemanticStyles,
  normalizePrefixNode,
  resolveSemanticValue,
} from '../select/utils/semanticUtil';
import type {
  SelectClassNamesType,
  SelectSemanticClassNames,
  SelectSemanticStyles,
  SelectStylesType,
} from '../select/utils/semanticUtil';
import devWarning from '../vc-util/devWarning';
import type { SelectCommonPlacement } from '../_util/transition';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import { useInjectFormItemContext } from '../form';
import type { ValueType } from '../vc-cascader/Cascader';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { FormItemInputContext } from '../form/FormItemContext';
import { useCompactItemContext } from '../space/Compact';
import useVariant from '../form/hooks/useVariant';
import { deprecated } from '../_util/warning';

import useSelectStyle from '../select/style';
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import CascaderPanel from './Panel';
export type { CascaderPanelProps } from './Panel';
export { CascaderPanel };
// Align the design since we use `rc-select` in root. This help:
// - List search content will show all content
// - Hover opacity style
// - Search filter match case

export type { BaseOptionType, DefaultOptionType, ShowSearchType };

export type FieldNamesType = FieldNames;

export type FilledFieldNamesType = Required<FieldNamesType>;

function highlightKeyword(str: string, lowerKeyword: string, prefixCls?: string) {
  const cells = str
    .toLowerCase()
    .split(lowerKeyword)
    .reduce((list, cur, index) => (index === 0 ? [cur] : [...list, lowerKeyword, cur]), []);
  const fillCells: VueNode[] = [];
  let start = 0;

  cells.forEach((cell, index) => {
    const end = start + cell.length;
    let originWorld: VueNode = str.slice(start, end);
    start = end;

    if (index % 2 === 1) {
      originWorld = (
        <span class={`${prefixCls}-menu-item-keyword`} key="seperator">
          {originWorld}
        </span>
      );
    }

    fillCells.push(originWorld);
  });

  return fillCells;
}

const defaultSearchRender: ShowSearchType['render'] = ({
  inputValue,
  path,
  prefixCls,
  fieldNames,
}) => {
  const optionList: VueNode[] = [];

  // We do lower here to save perf
  const lower = inputValue.toLowerCase();

  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ');
    }

    let label = (node as any)[fieldNames.label!];
    const type = typeof label;
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower, prefixCls);
    }

    optionList.push(label);
  });
  return optionList;
};

export interface CascaderOptionType extends DefaultOptionType {
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
  [key: string]: any;
}
export function cascaderProps<DataNodeType extends CascaderOptionType = CascaderOptionType>() {
  return {
    ...omit(vcCascaderProps(), ['customSlots', 'checkable', 'options']),
    multiple: { type: Boolean, default: undefined },
    size: String as PropType<SizeType>,
    bordered: { type: Boolean, default: undefined },
    variant: { type: String as PropType<Variant> },
    /** 展开/收起回调（antd 5.25 起替代 onDropdownVisibleChange） */
    onOpenChange: { type: Function as PropType<(open: boolean) => void> },
    /** @deprecated Please use `onOpenChange` instead */
    onPopupVisibleChange: { type: Function as PropType<(open: boolean) => void> },
    /** 选择后自动清除搜索值 */
    autoClearSearchValue: { type: Boolean, default: true },
    rootClassName: String,
    /** 语义化 classNames（支持对象与函数式） */
    classNames: {
      type: [Object, Function] as PropType<SelectClassNamesType>,
      default: undefined,
    },
    /** 语义化 styles（支持对象与函数式） */
    styles: {
      type: [Object, Function] as PropType<SelectStylesType>,
      default: undefined,
    },
    placement: { type: String as PropType<SelectCommonPlacement> },
    prefix: PropTypes.any,
    /** 自定义后缀（antd v6 替代 suffixIcon） */
    suffix: PropTypes.any,
    suffixIcon: PropTypes.any,
    status: String as PropType<InputStatus>,
    options: Array as PropType<DataNodeType[]>,
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    /** 自定义下拉内容渲染（popupRender 别名） */
    dropdownRender: { type: Function as PropType<(menu: any) => any>, default: undefined },
    popupRender: { type: Function as PropType<(menu: any) => any>, default: undefined },
    dropdownStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    /** 下拉菜单列样式 */
    dropdownMenuColumnStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    popupMenuColumnStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    'onUpdate:value': Function as PropType<(value: ValueType) => void>,
  };
}

export type CascaderProps = Partial<ExtractPropTypes<ReturnType<typeof cascaderProps>>>;

export interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

const Cascader = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACascader',
  inheritAttrs: false,
  props: initDefaultProps(cascaderProps(), {
    choiceTransitionName: '',
    allowClear: true,
  }),
  setup(props, { attrs, expose, slots, emit }) {
    // ====================== Warning ======================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !props.dropdownClassName,
        'Cascader',
        '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
      );
    }
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      prefixCls: cascaderPrefixCls,
      rootPrefixCls,
      getPrefixCls,
      direction,
      getPopupContainer,
      renderEmpty,
      size: contextSize,
      disabled,
      configProvider,
    } = useConfigInject('cascader', props);
    const prefixCls = computed(() => getPrefixCls('select', props.prefixCls));

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'cascader',
      computed(() => props.variant),
      computed(() => props.bordered),
    );
    deprecated(props.bordered === undefined, 'bordered', 'variant', 'Cascader');
    const handleOpenChange = (open: boolean) => {
      props.onDropdownVisibleChange?.(open);
      props.onPopupVisibleChange?.(open);
      emit('openChange', open);
      emit('update:open', open);
    };
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => compactSize.value || contextSize.value);
    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? contextDisabled.value);

    const [wrapSelectSSR, hashId] = useSelectStyle(prefixCls);
    const [wrapCascaderSSR] = useStyle(cascaderPrefixCls);

    const isRtl = computed(() => direction.value === 'rtl');
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        devWarning(
          !props.multiple || !props.displayRender || !slots.displayRender,
          'Cascader',
          '`displayRender` not work on `multiple`. Please use `tagRender` instead.',
        );
      });
    }
    // ==================== Search =====================
    const mergedShowSearch = computed(() => {
      if (!props.showSearch) {
        return props.showSearch;
      }

      let searchConfig: ShowSearchType = {
        render: defaultSearchRender,
      };

      if (typeof props.showSearch === 'object') {
        searchConfig = {
          ...searchConfig,
          ...props.showSearch,
        };
      }

      return searchConfig;
    });

    const cascaderConfig = computed(() => configProvider.cascader?.value);
    const semanticInfo = computed(() => ({
      props: {
        ...props,
        variant: mergedVariant.value,
        size: mergedSize.value,
        status: mergedStatus.value,
        disabled: mergedDisabled.value,
      },
    }));
    const mergedClassNames = computed<SelectSemanticClassNames>(() =>
      mergeSemanticClassNames(
        resolveSemanticValue(cascaderConfig.value?.classNames, semanticInfo.value),
        resolveSemanticValue(props.classNames, semanticInfo.value),
      ),
    );
    const mergedStyles = computed<SelectSemanticStyles>(() =>
      mergeSemanticStyles(
        resolveSemanticValue(cascaderConfig.value?.styles, semanticInfo.value),
        resolveSemanticValue(props.styles, semanticInfo.value),
      ),
    );

    // =================== Dropdown ====================
    const mergedDropdownClassName = computed(() =>
      classNames(
        mergedClassNames.value.popup?.root,
        props.popupClassName || props.dropdownClassName,
        `${cascaderPrefixCls.value}-dropdown`,
        {
          [`${cascaderPrefixCls.value}-dropdown-rtl`]: isRtl.value,
        },
        hashId.value,
      ),
    );

    const selectRef = ref<CascaderRef>();
    expose({
      focus() {
        selectRef.value?.focus();
      },
      blur() {
        selectRef.value?.blur();
      },
    } as CascaderRef);

    const handleChange: CascaderProps['onChange'] = (...args) => {
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur: CascaderProps['onBlur'] = (...args) => {
      emit('blur', ...args);
      formItemContext.onFieldBlur();
    };
    const mergedShowArrow = computed(() =>
      props.showArrow !== undefined ? props.showArrow : props.loading || !props.multiple,
    );
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl'
        ? ('bottomRight' as SelectCommonPlacement)
        : ('bottomLeft' as SelectCommonPlacement);
    });
    return () => {
      const {
        notFoundContent = slots.notFoundContent?.(),
        expandIcon = slots.expandIcon?.(),
        multiple,
        allowClear,
        choiceTransitionName,
        transitionName,
        id = formItemContext.id.value,
        ...restProps
      } = props;
      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;
      // =================== No Found ====================
      const mergedNotFoundContent = notFoundContent || renderEmpty('Cascader');

      // ===================== Icon ======================
      let mergedExpandIcon = expandIcon ?? cascaderConfig.value?.expandIcon;
      if (!mergedExpandIcon) {
        mergedExpandIcon = isRtl.value ? <LeftOutlined /> : <RightOutlined />;
      }

      const loadingIcon = (
        <span class={`${prefixCls.value}-menu-item-loading-icon`}>
          {props.loadingIcon ?? cascaderConfig.value?.loadingIcon ?? <LoadingOutlined spin />}
        </span>
      );

      const hasExplicitSuffix =
        props.suffix !== undefined ||
        !!slots.suffix ||
        props.suffixIcon !== undefined ||
        !!slots.suffixIcon;
      const isSuffixHidden =
        props.suffix === null ||
        (props.suffix === undefined && !slots.suffix && props.suffixIcon === null);
      const effectiveShowArrow =
        props.showArrow !== undefined
          ? props.showArrow
          : isSuffixHidden
          ? false
          : hasExplicitSuffix && !!multiple
          ? true
          : undefined;

      // ===================== Icons =====================
      const { suffixIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          hasFeedback: formItemInputContext.hasFeedback,
          feedbackIcon: formItemInputContext.feedbackIcon,
          multiple,
          prefixCls: prefixCls.value,
          showArrow: effectiveShowArrow !== undefined ? effectiveShowArrow : mergedShowArrow.value,
          suffixClassName: currentClassNames.suffix,
          suffixStyle: currentStyles.suffix,
          contextSuffix: cascaderConfig.value?.suffix,
          contextSuffixIcon: cascaderConfig.value?.suffixIcon,
          contextClearIcon: cascaderConfig.value?.clearIcon,
          contextRemoveIcon: cascaderConfig.value?.removeIcon,
        },
        slots,
      );

      const rawPrefix = props.prefix !== undefined ? props.prefix : slots.prefix?.();
      const mergedPrefix = applySemanticToNode(
        normalizePrefixNode(rawPrefix),
        currentClassNames.prefix,
        currentStyles.prefix,
      );

      const cascaderAttrs = {
        ...attrs,
        prefix: mergedPrefix,
      } as any;

      return wrapCascaderSSR(
        wrapSelectSSR(
          <VcCascader
            {...omit(restProps, [
              'variant',
              'bordered',
              'onOpenChange',
              'onPopupVisibleChange',
              'rootClassName',
              'classNames',
              'styles',
              'prefix',
              'suffix',
              'suffixIcon',
              'dropdownMenuColumnStyle',
              'popupMenuColumnStyle',
              'popupRender',
              'dropdownRender',
            ])}
            dropdownStyle={{ ...props.dropdownStyle, ...currentStyles.popup?.root }}
            dropdownMenuColumnStyle={props.popupMenuColumnStyle ?? props.dropdownMenuColumnStyle}
            onDropdownVisibleChange={handleOpenChange}
            {...cascaderAttrs}
            id={id}
            prefixCls={prefixCls.value}
            style={[cascaderConfig.value?.style, currentStyles.root, attrs.style as any]}
            class={[
              cascaderPrefixCls.value,
              {
                [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
                [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
                [`${prefixCls.value}-rtl`]: isRtl.value,
                [`${prefixCls.value}-borderless`]: mergedVariant.value === 'borderless',
                [`${prefixCls.value}-${mergedVariant.value}`]:
                  enableVariantCls.value && mergedVariant.value !== 'outlined',
                [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput,
              },
              cascaderConfig.value?.className,
              props.rootClassName,
              currentClassNames.root,
              getStatusClassNames(
                prefixCls.value,
                mergedStatus.value,
                formItemInputContext.hasFeedback,
              ),
              compactItemClassnames.value,
              attrs.class,
              hashId.value,
            ]}
            disabled={mergedDisabled.value}
            direction={direction.value}
            placement={placement.value}
            notFoundContent={mergedNotFoundContent}
            allowClear={allowClear}
            showSearch={mergedShowSearch.value}
            expandIcon={mergedExpandIcon}
            inputIcon={suffixIcon}
            removeIcon={removeIcon}
            clearIcon={clearIcon}
            loadingIcon={loadingIcon}
            checkable={!!multiple}
            dropdownClassName={mergedDropdownClassName.value}
            popupRender={props.popupRender ?? slots.popupRender}
            dropdownRender={props.dropdownRender ?? slots.dropdownRender}
            dropdownPrefixCls={cascaderPrefixCls.value}
            choiceTransitionName={getTransitionName(rootPrefixCls.value, '', choiceTransitionName)}
            transitionName={getTransitionName(
              rootPrefixCls.value,
              getTransitionDirection(placement.value),
              transitionName,
            )}
            getPopupContainer={getPopupContainer?.value}
            customSlots={{
              ...slots,
              checkable: () => <span class={`${cascaderPrefixCls.value}-checkbox-inner`} />,
            }}
            tagRender={props.tagRender || slots.tagRender}
            displayRender={props.displayRender || slots.displayRender}
            maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
            showArrow={formItemInputContext.hasFeedback || effectiveShowArrow}
            onChange={handleChange}
            onBlur={handleBlur}
            v-slots={slots}
            ref={selectRef}
          />,
        ),
      );
    };
  },
});
// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Cascader, 'dropdownAlign', (props: any) => omit(props, ['visible']));

export default Object.assign(Cascader, {
  SHOW_CHILD,
  SHOW_PARENT,
  Panel: CascaderPanel,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
  install: (app: App) => {
    app.component(Cascader.name, Cascader);
    app.component(CascaderPanel.name, CascaderPanel);
    return app;
  },
}) as typeof Cascader &
  Plugin & {
    readonly SHOW_PARENT: typeof SHOW_PARENT;
    readonly SHOW_CHILD: typeof SHOW_CHILD;
    readonly Panel: typeof CascaderPanel;
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
