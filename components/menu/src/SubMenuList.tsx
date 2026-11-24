import classNames from '../../_util/classNames';
import type { CSSProperties, FunctionalComponent } from 'vue';
import { useInjectMenu } from './hooks/useMenuContext';
const InternalSubMenuList: FunctionalComponent<any> = (_props, { slots, attrs }) => {
  const {
    prefixCls,
    mode,
    classNames: semanticClassNames,
    styles: semanticStyles,
  } = useInjectMenu();
  const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
  const subListStyle = semanticStyles?.value?.subMenu?.list;
  const mergedStyle =
    subListStyle || attrStyle ? [subListStyle, attrStyle as CSSProperties] : undefined;
  return (
    <ul
      {...restAttrs}
      class={classNames(
        prefixCls.value,
        `${prefixCls.value}-sub`,
        `${prefixCls.value}-${mode.value === 'inline' ? 'inline' : 'vertical'}`,
        semanticClassNames?.value?.subMenu?.list,
        attrClass as any,
      )}
      style={mergedStyle}
      data-menu-list
    >
      {slots.default?.()}
    </ul>
  );
};

InternalSubMenuList.displayName = 'SubMenuList';

export default InternalSubMenuList;
