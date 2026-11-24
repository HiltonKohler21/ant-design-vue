import type { CSSProperties } from 'vue';
import type { DropdownSemanticClassNames, DropdownSemanticStyles } from './props';

interface AppliedSemanticState {
  classes: string[];
  styleKeys: string[];
}

const appliedStateMap = new WeakMap<HTMLElement, AppliedSemanticState>();

function applySemanticToElement(
  el: HTMLElement,
  cls: string | undefined,
  styleObj: CSSProperties | undefined,
) {
  const prev = appliedStateMap.get(el) || { classes: [], styleKeys: [] };
  const nextClasses = (cls || '').split(/\s+/).filter(Boolean);
  const nextStyleKeys = styleObj ? Object.keys(styleObj) : [];

  if (
    !prev.classes.length &&
    !prev.styleKeys.length &&
    !nextClasses.length &&
    !nextStyleKeys.length
  ) {
    return;
  }

  prev.classes.forEach(c => {
    if (!nextClasses.includes(c)) {
      el.classList.remove(c);
    }
  });
  nextClasses.forEach(c => {
    el.classList.add(c);
  });

  prev.styleKeys.forEach(key => {
    if (!nextStyleKeys.includes(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  });

  if (styleObj) {
    nextStyleKeys.forEach(key => {
      const val = (styleObj as any)[key];
      if (val === undefined || val === null) {
        if (key.startsWith('--')) {
          el.style.removeProperty(key);
        } else {
          (el.style as any)[key] = '';
        }
      } else if (key.startsWith('--')) {
        el.style.setProperty(key, String(val));
      } else {
        (el.style as any)[key] = val;
      }
    });
  }

  appliedStateMap.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
}

export function applyDropdownMenuSemantics(
  rootEl: HTMLElement | null | undefined,
  prefixCls: string,
  semanticClassNames: DropdownSemanticClassNames,
  semanticStyles: DropdownSemanticStyles,
) {
  if (!rootEl || typeof rootEl.querySelectorAll !== 'function') {
    return;
  }
  const menuCls = `${prefixCls}-menu`;

  const applySlot = (
    selector: string,
    cls: string | undefined,
    styleObj: CSSProperties | undefined,
  ) => {
    if (rootEl.matches?.(selector)) {
      applySemanticToElement(rootEl, cls, styleObj);
    }
    const nodes = rootEl.querySelectorAll<HTMLElement>(selector);
    nodes.forEach(node => {
      applySemanticToElement(node, cls, styleObj);
    });
  };

  applySlot(`.${menuCls}`, semanticClassNames.menu, semanticStyles.menu);
  applySlot(`.${menuCls}-item`, semanticClassNames.item, semanticStyles.item);
  applySlot(
    `.${menuCls}-item-group-title, .${menuCls}-submenu-title`,
    semanticClassNames.itemTitle,
    semanticStyles.itemTitle,
  );
  applySlot(`.${menuCls}-item-icon`, semanticClassNames.itemIcon, semanticStyles.itemIcon);
  applySlot(
    `.${menuCls}-title-content`,
    semanticClassNames.itemContent,
    semanticStyles.itemContent,
  );
}

export function transformDropdownMenuItems(items: any[] | undefined, prefixCls: string): any[] {
  if (!Array.isArray(items)) {
    return [];
  }
  const menuCls = `${prefixCls}-menu`;
  return items
    .filter(item => item !== null && item !== undefined)
    .map(item => {
      if (typeof item !== 'object') {
        return item;
      }
      const { extra, children, label, ...rest } = item;
      const nextItem: Record<string, any> = { ...rest };
      if (extra !== undefined && label !== undefined) {
        nextItem.label = (
          <span class={`${menuCls}-title-content-with-extra`}>
            <span class={`${menuCls}-item-label`}>{label}</span>
            <span class={`${menuCls}-item-extra`}>{extra}</span>
          </span>
        );
      } else if (label !== undefined) {
        nextItem.label = label;
      }
      if (Array.isArray(children)) {
        nextItem.children = transformDropdownMenuItems(children, prefixCls);
      }
      return nextItem;
    });
}
