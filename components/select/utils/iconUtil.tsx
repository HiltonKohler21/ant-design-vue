import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import { applySemanticToNode } from './semanticUtil';

export default function getIcons(props: any, slots: any = {}) {
  const {
    loading,
    multiple,
    prefixCls,
    hasFeedback,
    feedbackIcon,
    showArrow,
    suffixClassName,
    suffixStyle,
    contextSuffix,
    contextSuffixIcon,
    contextLoadingIcon,
    contextClearIcon,
    contextMenuItemSelectedIcon,
    contextRemoveIcon,
  } = props;

  const customSuffix =
    props.suffix !== undefined
      ? props.suffix
      : slots.suffix
      ? slots.suffix()
      : props.suffixIcon !== undefined
      ? props.suffixIcon
      : slots.suffixIcon
      ? slots.suffixIcon()
      : undefined;

  const mergedContextSuffix = contextSuffix !== undefined ? contextSuffix : contextSuffixIcon;

  const customLoadingIcon =
    props.loadingIcon !== undefined
      ? props.loadingIcon
      : slots.loadingIcon
      ? slots.loadingIcon()
      : contextLoadingIcon;

  const clearIcon =
    props.clearIcon !== undefined
      ? props.clearIcon
      : slots.clearIcon
      ? slots.clearIcon()
      : contextClearIcon;

  const menuItemSelectedIcon =
    props.menuItemSelectedIcon !== undefined
      ? props.menuItemSelectedIcon
      : slots.menuItemSelectedIcon
      ? slots.menuItemSelectedIcon()
      : contextMenuItemSelectedIcon;

  const removeIcon =
    props.removeIcon !== undefined
      ? props.removeIcon
      : slots.removeIcon
      ? slots.removeIcon()
      : contextRemoveIcon;

  // Clear Icon
  const mergedClearIcon = clearIcon ?? <CloseCircleFilled />;
  // Validation Feedback Icon
  const getSuffixIconNode = (arrowIcon: any) => (
    <>
      {showArrow !== false && applySemanticToNode(arrowIcon, suffixClassName, suffixStyle)}
      {hasFeedback && feedbackIcon}
    </>
  );
  // Arrow item icon
  let mergedSuffixIcon: any = null;
  if (customSuffix !== undefined) {
    mergedSuffixIcon =
      typeof customSuffix === 'function'
        ? (iconProps: any) => getSuffixIconNode(customSuffix(iconProps))
        : getSuffixIconNode(customSuffix);
  } else if (loading) {
    mergedSuffixIcon = getSuffixIconNode(
      customLoadingIcon !== undefined ? customLoadingIcon : <LoadingOutlined spin />,
    );
  } else {
    const iconCls = `${prefixCls}-suffix`;
    mergedSuffixIcon = (iconProps: { open: boolean; showSearch: boolean }) => {
      const { open, showSearch } = iconProps;
      if (open && showSearch) {
        return getSuffixIconNode(<SearchOutlined class={iconCls} />);
      }
      if (mergedContextSuffix !== undefined) {
        return getSuffixIconNode(
          typeof mergedContextSuffix === 'function'
            ? mergedContextSuffix(iconProps)
            : mergedContextSuffix,
        );
      }
      return getSuffixIconNode(<DownOutlined class={iconCls} />);
    };
  }

  // Checked item icon
  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = <CheckOutlined />;
  } else {
    mergedItemIcon = null;
  }

  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = <CloseOutlined />;
  }

  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  };
}
