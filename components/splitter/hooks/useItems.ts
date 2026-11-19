import { computed, ref, type Ref } from 'vue';
import type { PanelProps } from '../interface';
import { autoPtgSizes } from './sizeUtil';

export function getPtg(str: string): number {
  return Number(str.slice(0, -1)) / 100;
}

function isPtg(itemSize: any): itemSize is string {
  return typeof itemSize === 'string' && itemSize.endsWith('%');
}

export interface CollapsibleType {
  start?: boolean;
  end?: boolean;
  showCollapsibleIcon: 'auto' | boolean;
}

function getCollapsible(collapsible: PanelProps['collapsible']): CollapsibleType {
  if (collapsible && typeof collapsible === 'object') {
    return {
      ...collapsible,
      showCollapsibleIcon:
        collapsible.showCollapsibleIcon === undefined ? 'auto' : collapsible.showCollapsibleIcon,
    };
  }
  const mergedCollapsible = !!collapsible;
  return {
    start: mergedCollapsible,
    end: mergedCollapsible,
    showCollapsibleIcon: 'auto',
  };
}

export type InternalPanelItem = PanelProps & {
  children?: any;
  collapsible: CollapsibleType;
};

/**
 * Convert `children` into `items`.
 */
export function useItems(children: Ref<any[]>): Ref<InternalPanelItem[]> {
  return computed(() =>
    children.value
      .filter(item => item && typeof item !== 'string' && typeof item !== 'number' && item.type)
      .map(node => {
        const { collapsible, ...restProps } = node.props || {};
        return {
          ...restProps,
          children: node.children,
          collapsible: getCollapsible(collapsible),
        };
      }),
  );
}

/**
 * Save the size state.
 * Align the size into flex percentage base.
 */
export function useSizes(items: Ref<InternalPanelItem[]>, containerSize: Ref<number | undefined>) {
  const propSizes = computed(() => items.value.map(item => item.size));
  const itemsCount = computed(() => items.value.length);
  const mergedContainerSize = computed(() => containerSize.value || 0);

  const innerSizes = ref<any[]>(items.value.map(item => item.defaultSize));

  const sizes = computed(() => {
    const mergedSizes: any[] = [];
    for (let i = 0; i < itemsCount.value; i += 1) {
      mergedSizes[i] = propSizes.value[i] !== undefined ? propSizes.value[i] : innerSizes.value[i];
    }
    return mergedSizes;
  });

  const postPercentMinSizes = computed(() =>
    items.value.map(item => {
      if (isPtg(item.min)) {
        return getPtg(item.min);
      }
      return (item.min || 0) / mergedContainerSize.value;
    }),
  );

  const postPercentMaxSizes = computed(() =>
    items.value.map(item => {
      if (isPtg(item.max)) {
        return getPtg(item.max);
      }
      return (item.max || mergedContainerSize.value) / mergedContainerSize.value;
    }),
  );

  const postPercentSizes = computed(() => {
    const ptgList: (number | undefined)[] = [];
    for (let i = 0; i < itemsCount.value; i += 1) {
      const itemSize = sizes.value[i];
      if (isPtg(itemSize)) {
        ptgList[i] = getPtg(itemSize);
      } else if (itemSize || itemSize === 0) {
        const num = Number(itemSize);
        if (!Number.isNaN(num)) {
          ptgList[i] = num / mergedContainerSize.value;
        }
      } else {
        ptgList[i] = undefined;
      }
    }
    return autoPtgSizes(ptgList, postPercentMinSizes.value, postPercentMaxSizes.value);
  });

  const postPxSizes = computed(() =>
    postPercentSizes.value.map(ptg => ptg * mergedContainerSize.value),
  );

  // If ssr, we will use the size from developer config first.
  const panelSizes = computed(() => (containerSize.value ? postPxSizes.value : sizes.value));

  return [
    panelSizes,
    postPxSizes,
    postPercentSizes,
    postPercentMinSizes,
    postPercentMaxSizes,
    (sizes: number[]) => {
      innerSizes.value = sizes;
    },
  ] as const;
}
