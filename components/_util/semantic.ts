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

export interface SemanticClassNames {
  root?: string;
  popup?: Partial<Record<PopupSemanticName, string>>;
}

export interface SemanticStyles {
  root?: CSSProperties;
  popup?: Partial<Record<PopupSemanticName, CSSProperties>>;
}
