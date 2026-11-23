import type { PropType } from 'vue';
import type { Key } from '../_util/type';
import { booleanType, someType, stringType, functionType, objectType } from '../_util/type';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import type { CollapseProps } from './Collapse';
import PropTypes from '../_util/vue-types';

export type CollapsibleType = 'header' | 'icon' | 'disabled';

export type ActiveKeyType = Array<string | number> | string | number;

export type ExpandIconPlacement = 'start' | 'end';
export type ExpandIconPosition = 'start' | 'end' | 'left' | 'right';

export type CollapseSemanticName = 'root' | 'header' | 'title' | 'body' | 'icon';
export type CollapseSemanticClassNames = SemanticClassNames<CollapseSemanticName>;
export type CollapseSemanticStyles = SemanticStyles<CollapseSemanticName>;
export type CollapseClassNamesType =
  | CollapseSemanticClassNames
  | ((info: { props: CollapseProps }) => CollapseSemanticClassNames);
export type CollapseStylesType =
  | CollapseSemanticStyles
  | ((info: { props: CollapseProps }) => CollapseSemanticStyles);

export interface PanelProps {
  isActive?: boolean;
  header?: any;
  showArrow?: boolean;
  forceRender?: boolean;
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled?: boolean;
  extra?: any;
  collapsible?: CollapsibleType;
  classNames?: CollapseSemanticClassNames;
  styles?: CollapseSemanticStyles;
}

const collapseProps = () => ({
  prefixCls: String,
  rootClassName: String,
  size: stringType<'small' | 'middle' | 'large'>(),
  activeKey: someType<ActiveKeyType>([Array, Number, String]),
  defaultActiveKey: someType<ActiveKeyType>([Array, Number, String]),
  accordion: booleanType(),
  destroyInactivePanel: booleanType(),
  /** 5.25+ 替代 destroyInactivePanel */
  destroyOnHidden: booleanType(),
  bordered: booleanType(),
  expandIcon: functionType<(panelProps: PanelProps) => any>(),
  openAnimation: PropTypes.object,
  /** 展开图标位置（antd 6.x 推荐，优先级高于 expandIconPosition） */
  expandIconPlacement: stringType<ExpandIconPlacement>(),
  /** @deprecated 请使用 `expandIconPlacement` 替代 */
  expandIconPosition: stringType<ExpandIconPosition>(),
  collapsible: stringType<CollapsibleType>(),
  ghost: booleanType(),
  /** 语义化 classNames（antd 6.x 支持对象或函数）：root / header / title / body / icon */
  classNames: {
    type: [Object, Function] as PropType<CollapseClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（antd 6.x 支持对象或函数）：root / header / title / body / icon */
  styles: {
    type: [Object, Function] as PropType<CollapseStylesType>,
    default: undefined,
  },
  onChange: functionType<(key: Key | Key[]) => void>(),
  'onUpdate:activeKey': functionType<(key: Key | Key[]) => void>(),
});

const collapsePanelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: String,
  header: PropTypes.any,
  headerClass: String,
  showArrow: booleanType(),
  isActive: booleanType(),
  destroyInactivePanel: booleanType(),
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: booleanType(),
  accordion: booleanType(),
  forceRender: booleanType(),
  expandIcon: functionType<(panelProps: PanelProps) => any>(),
  extra: PropTypes.any,
  panelKey: someType<number | string>(),
  collapsible: stringType<CollapsibleType>(),
  role: String,
  classNames: objectType<CollapseSemanticClassNames>(),
  styles: objectType<CollapseSemanticStyles>(),
  onItemClick: functionType<(panelKey: Key) => void>(),
});

export { collapseProps, collapsePanelProps };
