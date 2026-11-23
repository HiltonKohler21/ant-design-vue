import {
  isEmptyElement,
  initDefaultProps,
  flattenChildren,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import type {
  CollapsibleType,
  CollapseSemanticClassNames,
  CollapseSemanticStyles,
  ExpandIconPlacement,
} from './commonProps';
import { collapseProps } from './commonProps';
import { getDataAndAriaProps } from '../_util/util';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import firstNotUndefined from '../_util/firstNotUndefined';
import classNames from '../_util/classNames';
import { mergeClassNames, mergeStyles, useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import type { CollapsePanelProps } from './CollapsePanel';
import collapseMotion from '../_util/collapseMotion';
import type { CustomSlotsType } from '../_util/type';

// CSSINJS
import useStyle from './style';

type Key = number | string;

function getActiveKeysArray(activeKey: Key | Key[]) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey =
      activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(key => String(key));
}
export { collapseProps };
export type CollapseProps = Partial<ExtractPropTypes<ReturnType<typeof collapseProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACollapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    accordion: false,
    destroyInactivePanel: false,
    bordered: true,
  }),
  slots: Object as CustomSlotsType<{
    default?: any;
    expandIcon?: CollapsePanelProps;
  }>,
  setup(props, { attrs, slots, emit }) {
    const stateActiveKey = ref<Key[]>(
      getActiveKeysArray(firstNotUndefined([props.activeKey, props.defaultActiveKey])),
    );

    watch(
      () => props.activeKey,
      () => {
        stateActiveKey.value = getActiveKeysArray(props.activeKey);
      },
      { deep: true },
    );
    const { prefixCls, direction, rootPrefixCls } = useConfigInject('collapse', props);
    const {
      componentConfig: collapseConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('collapse');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const iconPosition = computed<ExpandIconPlacement>(() => {
      const raw = props.expandIconPlacement ?? props.expandIconPosition;
      if (raw === 'left') {
        return 'start';
      }
      if (raw === 'right') {
        return 'end';
      }
      return raw ?? 'start';
    });

    const mergedPropsForSemantic = computed<CollapseProps>(() => ({
      ...props,
      size: props.size ?? 'middle',
      bordered: props.bordered,
      expandIconPlacement: iconPosition.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CollapseSemanticClassNames,
      CollapseSemanticStyles,
      CollapseProps
    >(
      () => [contextClassNames.value, props.classNames],
      () => [contextStyles.value, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const renderExpandIcon = (panelProps: CollapsePanelProps) => {
      const { expandIcon = slots.expandIcon ?? collapseConfig.value.expandIcon } = props;
      const icon = expandIcon ? (
        expandIcon(panelProps)
      ) : (
        <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />
      );
      const iconCls = panelProps.classNames?.icon ?? mergedClassNames.value.icon;
      const iconStyle = panelProps.styles?.icon ?? mergedStyles.value.icon;

      return (
        <div
          class={[`${prefixCls.value}-expand-icon`, iconCls, hashId.value]}
          style={iconStyle}
          onClick={() =>
            ['header', 'icon'].includes(props.collapsible) && onClickItem(panelProps.panelKey)
          }
        >
          {isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
            ? cloneElement(
                icon,
                {
                  class: `${prefixCls.value}-arrow`,
                },
                false,
              )
            : icon}
        </div>
      );
    };
    const setActiveKey = (activeKey: Key[]) => {
      if (props.activeKey === undefined) {
        stateActiveKey.value = activeKey;
      }
      const newKey = props.accordion ? activeKey[0] : activeKey;
      emit('update:activeKey', newKey);
      emit('change', newKey);
    };
    const onClickItem = (key: Key) => {
      let activeKey = stateActiveKey.value;
      if (props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      setActiveKey(activeKey);
    };

    const getNewChild = (child, index) => {
      if (isEmptyElement(child)) return;
      const activeKey = stateActiveKey.value;
      const { accordion, destroyInactivePanel, destroyOnHidden, collapsible, openAnimation } =
        props;
      const mergedDestroyInactivePanel = destroyOnHidden ?? destroyInactivePanel;
      const animation = openAnimation || collapseMotion(`${rootPrefixCls.value}-motion-collapse`);

      // If there is no key provide, use the panel order as default key
      const key = String(child.key ?? index);
      const {
        header = child.children?.header?.(),
        headerClass,
        collapsible: childCollapsible,
        disabled,
        classNames: childClassNames,
        styles: childStyles,
      } = child.props || {};
      let isActive = false;

      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      let mergeCollapsible: CollapsibleType = childCollapsible ?? collapsible;
      // legacy 2.x
      if (disabled || disabled === '') {
        mergeCollapsible = 'disabled';
      }
      const panelClassNames = childClassNames
        ? mergeClassNames(mergedClassNames.value, childClassNames)
        : mergedClassNames.value;
      const panelStyles = childStyles
        ? mergeStyles(mergedStyles.value, childStyles)
        : mergedStyles.value;
      const newProps = {
        key,
        panelKey: key,
        header,
        headerClass,
        isActive,
        prefixCls: prefixCls.value,
        destroyInactivePanel: mergedDestroyInactivePanel,
        openAnimation: animation,
        accordion,
        onItemClick: mergeCollapsible === 'disabled' ? null : onClickItem,
        expandIcon: renderExpandIcon,
        collapsible: mergeCollapsible,
        classNames: panelClassNames,
        styles: panelStyles,
      };

      return cloneElement(child, newProps);
    };

    const getItems = () => {
      return flattenChildren(slots.default?.()).map(getNewChild);
    };

    return () => {
      const { accordion, bordered, ghost, size } = props;
      const collapseClassName = classNames(
        prefixCls.value,
        contextClassName.value,
        mergedClassNames.value.root,
        {
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-icon-position-${iconPosition.value}`]: true,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-ghost`]: !!ghost,
          [`${prefixCls.value}-${size}`]: !!size && size !== 'middle',
          [attrs.class as string]: !!attrs.class,
        },
        props.rootClassName,
        hashId.value,
      );
      return wrapSSR(
        <div
          class={collapseClassName}
          {...getDataAndAriaProps(attrs)}
          style={[contextStyle.value, mergedStyles.value.root, attrs.style as CSSProperties]}
          role={accordion ? 'tablist' : null}
        >
          {getItems()}
        </div>,
      );
    };
  },
});
