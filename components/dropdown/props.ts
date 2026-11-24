import type { CSSProperties, PropType } from 'vue';
import PropTypes from '../_util/vue-types';

import buttonTypes from '../button/buttonTypes';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { MenuProps } from '../menu';
import type { AdjustOverflow } from '../_util/placements';
import { booleanType, eventType, functionType, objectType, someType } from '../_util/type';
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

export type Align = {
  points?: [string, string];
  offset?: [number, number];
  targetOffset?: [number, number];
  overflow?: {
    adjustX?: boolean;
    adjustY?: boolean;
  };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
};

export type Trigger = 'click' | 'hover' | 'contextmenu' | 'contextMenu';

export type DropdownArrowOptions = {
  pointAtCenter?: boolean;
};

export type DropdownPlacement =
  | 'topLeft'
  | 'topCenter'
  | 'top'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottom'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

export type DropdownSemanticName =
  | 'root'
  | 'menu'
  | 'item'
  | 'itemTitle'
  | 'itemIcon'
  | 'itemContent';

export type DropdownSemanticClassNames = SemanticClassNames<DropdownSemanticName>;
export type DropdownSemanticStyles = SemanticStyles<DropdownSemanticName>;
export type DropdownClassNamesType<Props = any> = SemanticClassNamesType<
  Props,
  DropdownSemanticName
>;
export type DropdownStylesType<Props = any> = SemanticStylesType<Props, DropdownSemanticName>;

export type DropdownMenuProps = MenuProps & {
  defaultSelectedKeys?: (string | number)[];
  defaultOpenKeys?: (string | number)[];
  items?: any[];
  class?: any;
  style?: CSSProperties;
};

const dropdownProps = () => ({
  rootClassName: String,
  /** 自定义下拉内容渲染（popupRender 别名） */
  dropdownRender: functionType<(menu: any) => any>(),
  popupRender: functionType<(menu: any) => any>(),
  arrow: someType<boolean | DropdownArrowOptions>([Boolean, Object]),
  autoAdjustOverflow: someType<boolean | AdjustOverflow>([Boolean, Object], true),
  trigger: {
    type: [Array, String] as PropType<Trigger[] | Trigger>,
  },
  menu: objectType<DropdownMenuProps>(),
  overlay: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: booleanType(),
  open: booleanType(),
  disabled: booleanType(),
  danger: booleanType(),
  autofocus: booleanType(),
  align: objectType<Align>(),
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  prefixCls: String,
  transitionName: String,
  placement: String as PropType<DropdownPlacement>,
  overlayClassName: String,
  overlayStyle: objectType<CSSProperties>(),
  /** 语义化 classNames（支持对象或函数）：root / menu / item / itemTitle / itemIcon / itemContent */
  classNames: [Object, Function] as PropType<DropdownClassNamesType>,
  /** 语义化 styles（支持对象或函数）：root / menu / item / itemTitle / itemIcon / itemContent */
  styles: [Object, Function] as PropType<DropdownStylesType>,
  forceRender: booleanType(),
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: booleanType(),
  destroyPopupOnHide: booleanType(),
  /** 5.14+ 自定义左右按钮渲染 */
  buttonsRender: functionType<(buttons: any[]) => any[]>(),
  /** 关闭后是否销毁 Dropdown */
  destroyOnHidden: booleanType(),
  /** @deprecated Please use `onOpenChange` instead */
  onVisibleChange: {
    type: Function as PropType<(val: boolean, info?: { source: 'trigger' | 'menu' }) => void>,
  },
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': {
    type: Function as PropType<(val: boolean) => void>,
  },
  onOpenChange: {
    type: Function as PropType<(val: boolean, info?: { source: 'trigger' | 'menu' }) => void>,
  },
  'onUpdate:open': {
    type: Function as PropType<(val: boolean) => void>,
  },
});

const buttonTypesProps = buttonTypes();
const dropdownButtonProps = () => ({
  ...dropdownProps(),
  type: buttonTypesProps.type,
  size: String as PropType<'small' | 'large'>,
  htmlType: buttonTypesProps.htmlType,
  href: String,
  disabled: booleanType(),
  prefixCls: String,
  icon: PropTypes.any,
  title: String,
  loading: buttonTypesProps.loading,
  onClick: eventType<MouseEventHandler>(),
});

export { dropdownProps, dropdownButtonProps };

export default dropdownProps;
