import { camelize } from '../../_util/props-util';
import type { PanelProps } from '../interface';
import { autoPtgSizes } from './sizeUtil';

const isNonNullable = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null;

export function getPtg(str: string): number {
  return Number(str.slice(0, -1)) / 100;
}

function isPtg(itemSize: any): itemSize is string {
  return typeof itemSize === 'string' && itemSize.endsWith('%');
}

export function parsePxSize(val: number | string | undefined): number | undefined {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    if (trimmed.endsWith('px')) {
      const parsed = Number.parseFloat(trimmed);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

export interface CollapsibleType {
  start?: boolean;
  end?: boolean;
  showCollapsibleIcon: 'auto' | boolean;
}

function getCollapsible(collapsible: PanelProps['collapsible'] | ''): CollapsibleType {
  if (collapsible && typeof collapsible === 'object') {
    const showIcon =
      collapsible.showCollapsibleIcon ?? (collapsible as any)['show-collapsible-icon'];
    return {
      ...collapsible,
      showCollapsibleIcon: showIcon === undefined ? 'auto' : showIcon,
    };
  }
  // Vue templates compile bare boolean attributes like `<a-splitter-panel collapsible>` to `""`
  const mergedCollapsible = collapsible === '' || !!collapsible;
  return {
    start: mergedCollapsible,
    end: mergedCollapsible,
    showCollapsibleIcon: 'auto',
  };
}

export type InternalPanelItem = PanelProps & {
  class?: any;
  children?: any;
  collapsible: CollapsibleType;
};

/**
 * Convert flattened slot VNodes into normalized `InternalPanelItem[]`.
 */
export function parseItems(children: any[]): InternalPanelItem[] {
  return children
    .filter(item => item && typeof item !== 'string' && typeof item !== 'number' && item.type)
    .map(node => {
      const rawProps = node.props || {};
      const normalizedProps: Record<string, any> = {};
      Object.keys(rawProps).forEach(key => {
        const camelKey = key === 'class' || key === 'style' ? key : camelize(key);
        normalizedProps[camelKey] = rawProps[key];
      });

      const { collapsible, resizable, destroyOnHidden, ...restProps } = normalizedProps;

      let mergedResizable: boolean | undefined;
      if (resizable === '' || resizable === true || resizable === 'true') {
        mergedResizable = true;
      } else if (resizable === false || resizable === 'false') {
        mergedResizable = false;
      } else {
        mergedResizable = resizable;
      }

      let mergedDestroyOnHidden: boolean | undefined;
      if (destroyOnHidden === '' || destroyOnHidden === true || destroyOnHidden === 'true') {
        mergedDestroyOnHidden = true;
      } else if (destroyOnHidden === false || destroyOnHidden === 'false') {
        mergedDestroyOnHidden = false;
      } else {
        mergedDestroyOnHidden = undefined;
      }

      return {
        ...restProps,
        resizable: mergedResizable,
        destroyOnHidden: mergedDestroyOnHidden,
        children: node.children,
        collapsible: getCollapsible(collapsible),
      };
    });
}

export interface ComputedSizes {
  panelSizes: (number | string | undefined)[];
  itemPxSizes: number[];
  itemPtgSizes: number[];
  itemPtgMinSizes: number[];
  itemPtgMaxSizes: number[];
}

/**
 * Compute panel sizes, pixel sizes, and percentage sizes/limits for the current render.
 */
export function computeSizes(
  items: InternalPanelItem[],
  containerSize: number | undefined,
  innerSizes: any[],
): ComputedSizes {
  const propSizes = items.map(item => item.size);
  const itemsCount = items.length;
  const mergedContainerSize = containerSize || 0;

  // Match antd: if any panel has `size`, use `propSizes`; otherwise use `innerSizes`.
  const sizes = propSizes.some(isNonNullable) ? propSizes : innerSizes;

  const itemPtgMinSizes = items.map(item => {
    if (isPtg(item.min)) {
      return getPtg(item.min);
    }
    if (mergedContainerSize <= 0) {
      return 0;
    }
    return (parsePxSize(item.min) || 0) / mergedContainerSize;
  });

  const itemPtgMaxSizes = items.map(item => {
    if (isPtg(item.max)) {
      return getPtg(item.max);
    }
    if (mergedContainerSize <= 0) {
      return 1;
    }
    const parsedMax = parsePxSize(item.max);
    return (parsedMax !== undefined ? parsedMax : mergedContainerSize) / mergedContainerSize;
  });

  const ptgList: (number | undefined)[] = [];
  for (let i = 0; i < itemsCount; i += 1) {
    const itemSize = sizes[i];
    if (isPtg(itemSize)) {
      ptgList[i] = getPtg(itemSize);
    } else if (itemSize || itemSize === 0) {
      const num = parsePxSize(itemSize);
      if (num !== undefined && !Number.isNaN(num)) {
        if (mergedContainerSize > 0) {
          ptgList[i] = num / mergedContainerSize;
        } else {
          ptgList[i] = num === 0 ? 0 : undefined;
        }
      } else {
        ptgList[i] = undefined;
      }
    } else {
      ptgList[i] = undefined;
    }
  }

  const itemPtgSizes = autoPtgSizes(ptgList, itemPtgMinSizes, itemPtgMaxSizes);
  const itemPxSizes = itemPtgSizes.map(ptg => ptg * mergedContainerSize);
  const panelSizes = containerSize ? itemPxSizes : sizes;

  return {
    panelSizes,
    itemPxSizes,
    itemPtgSizes,
    itemPtgMinSizes,
    itemPtgMaxSizes,
  };
}
