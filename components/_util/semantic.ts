import type { CSSProperties } from 'vue';

/**
 * 弹层组件的语义化样式/类名（antd 5.25 起统一入口）
 *
 * 用于替代 `popupClassName` / `dropdownClassName` / `dropdownStyle` 等零散 API：
 * - `classNames.root`       最外层节点
 * - `classNames.popup.root` 弹层最外层
 * - `styles.root`           最外层节点内联样式
 * - `styles.popup.root`     弹层最外层内联样式
 */
export type PopupSemanticName = 'root';

/** 通用语义化 classNames / styles（按组件语义位集合生成） */
export type SemanticNames<K extends string> = Partial<Record<K, string>>;

export type SemanticStylesMap<K extends string> = Partial<Record<K, CSSProperties>>;

export interface SemanticClassNames {
  root?: string;
  popup?: Partial<Record<PopupSemanticName, string>>;
}

export interface SemanticStyles {
  root?: CSSProperties;
  popup?: Partial<Record<PopupSemanticName, CSSProperties>>;
}

/** Card 语义位 */
export type CardSemanticName = 'header' | 'body' | 'extra' | 'actions' | 'title' | 'cover';

/** Descriptions 语义位 */
export type DescriptionsSemanticName = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content';

/** 弹窗类组件（Modal / Drawer）的语义位 */
export type DialogSemanticName = 'mask' | 'wrapper' | 'content' | 'header' | 'body' | 'footer';

export type DialogSemanticClassNames = Partial<Record<DialogSemanticName, string>>;

export type DialogSemanticStyles = Partial<Record<DialogSemanticName, CSSProperties>>;
