import type { CSSProperties, ExtractPropTypes, PropType, Ref } from 'vue';
import { computed, defineComponent, ref, toRef, watchEffect } from 'vue';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import classNames from '../_util/classNames';
import useMergedState from '../_util/hooks/useMergedState';
import { toReactive } from '../_util/toReactive';
import type { Key } from '../_util/type';
import { objectType } from '../_util/type';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { useInjectFormItemContext } from '../form';
import type { BaseSelectContextProps } from '../vc-select/hooks/useBaseProps';
import { useProvideBaseSelectProps } from '../vc-select/hooks/useBaseProps';
import type {
  DefaultOptionType,
  FieldNames,
  ShowCheckedStrategy,
  SingleValueType,
  ValueType,
} from '../vc-cascader/Cascader';
import {
  fillFieldNames,
  SHOW_PARENT,
  toPathKey,
  toPathKeys,
} from '../vc-cascader/utils/commonUtil';
import { formatStrategyValues, toPathOptions } from '../vc-cascader/utils/treeUtil';
import useEntities from '../vc-cascader/hooks/useEntities';
import useMissingValues from '../vc-cascader/hooks/useMissingValues';
import { useProvideCascader } from '../vc-cascader/context';
import OptionList from '../vc-cascader/OptionList';
import { conductCheck } from '../vc-tree/utils/conductUtil';
import useMaxLevel from '../vc-tree/useMaxLevel';
import useStyle from './style';

export interface CascaderPanelOptionType extends DefaultOptionType {
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderPanelOptionType[];
  [key: string]: any;
}

export function cascaderPanelProps<
  DataNodeType extends CascaderPanelOptionType = CascaderPanelOptionType,
>() {
  return {
    prefixCls: String,
    rootClassName: String,
    options: Array as PropType<DataNodeType[]>,
    value: { type: [String, Number, Array] as PropType<ValueType> },
    defaultValue: { type: [String, Number, Array] as PropType<ValueType> },
    fieldNames: objectType<FieldNames>(),
    changeOnSelect: { type: Boolean, default: undefined },
    multiple: { type: Boolean, default: undefined },
    showCheckedStrategy: {
      type: String as PropType<ShowCheckedStrategy>,
      default: SHOW_PARENT,
    },
    expandTrigger: String as PropType<'hover' | 'click'>,
    loadData: Function as PropType<(selectOptions: DataNodeType[]) => void>,
    disabled: { type: Boolean, default: undefined },
    notFoundContent: PropTypes.any,
    expandIcon: PropTypes.any,
    loadingIcon: PropTypes.any,
    direction: String as PropType<'ltr' | 'rtl'>,
    dropdownMenuColumnStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    popupMenuColumnStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    onChange: Function as PropType<
      (value: ValueType, selectOptions: DataNodeType[] | DataNodeType[][]) => void
    >,
    'onUpdate:value': Function as PropType<(value: ValueType) => void>,
  };
}

export type CascaderPanelProps = Partial<ExtractPropTypes<ReturnType<typeof cascaderPanelProps>>>;

function isMultipleValue(value: ValueType): value is SingleValueType[] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

function toRawValues(value: ValueType): SingleValueType[] {
  if (!value) {
    return [];
  }

  if (isMultipleValue(value)) {
    return value;
  }

  return (value.length === 0 ? [] : [value]).map(val => (Array.isArray(val) ? val : [val]));
}

function markOptionsDisabled<T extends DefaultOptionType>(options: T[], childrenKey: string): T[] {
  return options.map(opt => {
    const children = opt[childrenKey];
    return {
      ...opt,
      disabled: true,
      ...(Array.isArray(children)
        ? { [childrenKey]: markOptionsDisabled(children, childrenKey) }
        : {}),
    };
  });
}

const noop = () => {};

const CascaderPanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACascaderPanel',
  inheritAttrs: false,
  props: cascaderPanelProps(),
  setup(props, { attrs, slots, emit }) {
    const formItemContext = useInjectFormItemContext();
    const {
      prefixCls: cascaderPrefixCls,
      direction,
      renderEmpty,
      disabled,
    } = useConfigInject('cascader', props);

    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? contextDisabled.value);
    const mergedDirection = computed(() => props.direction ?? direction.value);
    const isRtl = computed(() => mergedDirection.value === 'rtl');
    const multiple = computed(() => !!props.multiple);

    const [wrapCascaderSSR, hashId] = useStyle(cascaderPrefixCls);

    // =========================== Values ===========================
    const [rawValues, setRawValues] = useMergedState<ValueType, Ref<SingleValueType[]>>(
      props.defaultValue,
      {
        value: computed(() => props.value),
        postState: toRawValues,
      },
    );

    // ========================= FieldNames =========================
    const mergedFieldNames = computed(() => fillFieldNames(props.fieldNames));

    // =========================== Option ===========================
    const rawOptions = computed(() => props.options || []);
    const mergedOptions = computed(() =>
      mergedDisabled.value
        ? markOptionsDisabled(rawOptions.value, mergedFieldNames.value.children)
        : rawOptions.value,
    );

    const pathKeyEntities = useEntities(mergedOptions, mergedFieldNames);

    const getValueByKeyPath = (pathKeys: Key[]): SingleValueType[] => {
      const keyPathEntities = pathKeyEntities.value;

      return pathKeys.map(pathKey => {
        const { nodes } = keyPathEntities[pathKey];

        return nodes.map(node => node[mergedFieldNames.value.value]);
      });
    };

    const missingValuesInfo = useMissingValues(mergedOptions, mergedFieldNames, rawValues);

    const [checkedValues, halfCheckedValues, missingCheckedValues] = [
      ref<SingleValueType[]>([]),
      ref<SingleValueType[]>([]),
      ref<SingleValueType[]>([]),
    ];

    const { maxLevel, levelEntities } = useMaxLevel(pathKeyEntities);
    watchEffect(() => {
      const [existValues, missingValues] = missingValuesInfo.value;

      if (!multiple.value || !rawValues.value.length) {
        [checkedValues.value, halfCheckedValues.value, missingCheckedValues.value] = [
          existValues,
          [],
          missingValues,
        ];
        return;
      }

      const keyPathValues = toPathKeys(existValues);
      const keyPathEntities = pathKeyEntities.value;

      const { checkedKeys, halfCheckedKeys } = conductCheck(
        keyPathValues,
        true,
        keyPathEntities,
        maxLevel.value,
        levelEntities.value,
      );

      [checkedValues.value, halfCheckedValues.value, missingCheckedValues.value] = [
        getValueByKeyPath(checkedKeys),
        getValueByKeyPath(halfCheckedKeys),
        missingValues,
      ];
    });

    // =========================== Change ===========================
    const triggerChange = (nextValues: ValueType) => {
      setRawValues(nextValues);

      const nextRawValues = toRawValues(nextValues);
      const valueOptions = nextRawValues.map(valueCells =>
        toPathOptions(valueCells, rawOptions.value, mergedFieldNames.value).map(
          valueOpt => valueOpt.option,
        ),
      );

      const triggerValues = multiple.value ? nextRawValues : nextRawValues[0];
      const triggerOptions = multiple.value ? valueOptions : valueOptions[0];

      emit('update:value', triggerValues);
      emit('change', triggerValues, triggerOptions);
      formItemContext.onFieldChange();
    };

    // =========================== Select ===========================
    const onInternalSelect = (valuePath: SingleValueType) => {
      if (mergedDisabled.value) {
        return;
      }
      if (!multiple.value) {
        triggerChange(valuePath);
      } else {
        const pathKey = toPathKey(valuePath);
        const checkedPathKeys = toPathKeys(checkedValues.value);
        const halfCheckedPathKeys = toPathKeys(halfCheckedValues.value);

        const existInChecked = checkedPathKeys.includes(pathKey);
        const existInMissing = missingCheckedValues.value.some(
          valueCells => toPathKey(valueCells) === pathKey,
        );

        let nextCheckedValues = checkedValues.value;
        let nextMissingValues = missingCheckedValues.value;

        if (existInMissing && !existInChecked) {
          nextMissingValues = missingCheckedValues.value.filter(
            valueCells => toPathKey(valueCells) !== pathKey,
          );
        } else {
          const nextRawCheckedKeys = existInChecked
            ? checkedPathKeys.filter(key => key !== pathKey)
            : [...checkedPathKeys, pathKey];

          let checkedKeys: Key[];
          if (existInChecked) {
            ({ checkedKeys } = conductCheck(
              nextRawCheckedKeys,
              { checked: false, halfCheckedKeys: halfCheckedPathKeys },
              pathKeyEntities.value,
              maxLevel.value,
              levelEntities.value,
            ));
          } else {
            ({ checkedKeys } = conductCheck(
              nextRawCheckedKeys,
              true,
              pathKeyEntities.value,
              maxLevel.value,
              levelEntities.value,
            ));
          }

          const deDuplicatedKeys = formatStrategyValues(
            checkedKeys,
            pathKeyEntities.value,
            props.showCheckedStrategy,
          );
          nextCheckedValues = getValueByKeyPath(deDuplicatedKeys);
        }

        triggerChange([...nextMissingValues, ...nextCheckedValues]);
      }
    };

    // =========================== Icons ============================
    const mergedExpandIcon = computed(() => {
      const customIcon = props.expandIcon ?? slots.expandIcon?.();
      if (customIcon !== undefined) {
        return customIcon;
      }
      return isRtl.value ? <LeftOutlined /> : <RightOutlined />;
    });

    const mergedLoadingIcon = computed(() => {
      const customIcon = props.loadingIcon ?? slots.loadingIcon?.();
      if (customIcon !== undefined) {
        return customIcon;
      }
      return (
        <span class={`${cascaderPrefixCls.value}-menu-item-loading-icon`}>
          <LoadingOutlined spin />
        </span>
      );
    });

    const mergedNotFoundContent = computed(() => {
      if (props.notFoundContent !== undefined) {
        return props.notFoundContent;
      }
      const slotEmpty = slots.notFoundContent?.();
      if (slotEmpty !== undefined) {
        return slotEmpty;
      }
      return renderEmpty('Cascader');
    });

    const mergedMenuColumnStyle = computed(
      () => props.popupMenuColumnStyle ?? props.dropdownMenuColumnStyle,
    );

    const customSlots = computed<Record<string, Function>>(() => ({
      ...slots,
      checkable: () => <span class={`${cascaderPrefixCls.value}-checkbox-inner`} />,
    }));

    // ========================== Context ===========================
    useProvideBaseSelectProps(
      toReactive({
        prefixCls: cascaderPrefixCls,
        direction: mergedDirection,
        multiple,
        open: ref(true),
        triggerOpen: ref(true),
        searchValue: ref(''),
        notFoundContent: mergedNotFoundContent,
        disabled: mergedDisabled,
        toggleOpen: noop,
      } as unknown as BaseSelectContextProps),
    );

    useProvideCascader({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: checkedValues,
      halfValues: halfCheckedValues,
      changeOnSelect: toRef(props, 'changeOnSelect'),
      onSelect: onInternalSelect,
      checkable: multiple,
      searchOptions: ref([]),
      dropdownPrefixCls: cascaderPrefixCls,
      loadData: toRef(props, 'loadData'),
      expandTrigger: toRef(props, 'expandTrigger'),
      expandIcon: mergedExpandIcon,
      loadingIcon: mergedLoadingIcon,
      dropdownMenuColumnStyle: mergedMenuColumnStyle,
      customSlots,
    });

    return () => {
      const isEmpty = !mergedOptions.value.length;
      return wrapCascaderSSR(
        <div
          {...attrs}
          class={classNames(
            `${cascaderPrefixCls.value}-panel`,
            {
              [`${cascaderPrefixCls.value}-panel-empty`]: isEmpty,
              [`${cascaderPrefixCls.value}-panel-rtl`]: isRtl.value,
              [`${cascaderPrefixCls.value}-panel-disabled`]: mergedDisabled.value,
            },
            props.rootClassName,
            attrs.class,
            hashId.value,
          )}
        >
          <OptionList v-slots={slots} />
        </div>,
      );
    };
  },
});

export default CascaderPanel;
