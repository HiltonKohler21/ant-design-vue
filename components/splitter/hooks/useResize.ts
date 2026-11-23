import { computed, ref, shallowRef } from 'vue';
import type { InternalPanelItem } from './useItems';
import { getPtg, parsePxSize } from './useItems';
import type { ResizableInfo } from './useResizable';

export interface ResizeSnapshot {
  items: InternalPanelItem[];
  resizableInfos: ResizableInfo[];
  percentSizes: number[];
  containerSize: number | undefined;
  reverse: boolean;
}

/**
 * Handle user drag resize & collapse logic against the latest rendered snapshot.
 */
export default function useResize(
  getSnapshot: () => ResizeSnapshot,
  updateSizes: (sizes: number[]) => void,
) {
  const cacheSizes = ref<number[]>([]);
  const cacheCollapsedSize = shallowRef<number[]>([]);
  const movingIndex = ref<{ index: number; confirmed: boolean } | null>(null);

  const getPxSizes = () => {
    const { percentSizes, containerSize } = getSnapshot();
    const mergedContainerSize = containerSize || 0;
    return percentSizes.map(ptg => ptg * mergedContainerSize);
  };

  function getLimitSize(
    str: number | string | undefined,
    defaultLimit: number,
    mergedContainerSize: number,
  ): number {
    if (typeof str === 'string') {
      if (str.endsWith('%')) {
        return getPtg(str) * mergedContainerSize;
      }
      const parsed = parsePxSize(str);
      return parsed !== undefined ? parsed : defaultLimit;
    }
    return str !== undefined ? str : defaultLimit;
  }

  const onOffsetStart = (index: number) => {
    cacheSizes.value = getPxSizes();
    movingIndex.value = { index, confirmed: false };
  };

  const onOffsetUpdate = (index: number, offset: number) => {
    const { items, resizableInfos, containerSize } = getSnapshot();
    const mergedContainerSize = containerSize || 0;
    const limitSizes = items.map(item => [item.min, item.max]);

    let confirmedIndex: number | null = null;
    if ((!movingIndex.value || !movingIndex.value.confirmed) && offset !== 0) {
      if (offset > 0) {
        confirmedIndex = index;
        movingIndex.value = { index, confirmed: true };
      } else {
        for (let i = index; i >= 0; i -= 1) {
          if (cacheSizes.value[i] > 0 && resizableInfos[i]?.resizable) {
            confirmedIndex = i;
            movingIndex.value = { index: i, confirmed: true };
            break;
          }
        }
      }
    }
    const mergedIndex =
      confirmedIndex !== null ? confirmedIndex : movingIndex.value?.index ?? index;
    const numSizes = [...cacheSizes.value];
    const nextIndex = mergedIndex + 1;

    const mergedLimits = limitSizes[mergedIndex] || [undefined, undefined];
    const nextLimits = limitSizes[nextIndex] || [undefined, undefined];
    const startMinSize = getLimitSize(mergedLimits[0], 0, mergedContainerSize);
    const endMinSize = getLimitSize(nextLimits[0], 0, mergedContainerSize);
    const startMaxSize = getLimitSize(mergedLimits[1], mergedContainerSize, mergedContainerSize);
    const endMaxSize = getLimitSize(nextLimits[1], mergedContainerSize, mergedContainerSize);

    let mergedOffset = offset;
    if (numSizes[mergedIndex] + mergedOffset < startMinSize) {
      mergedOffset = startMinSize - numSizes[mergedIndex];
    }
    if (numSizes[nextIndex] - mergedOffset < endMinSize) {
      mergedOffset = numSizes[nextIndex] - endMinSize;
    }
    if (numSizes[mergedIndex] + mergedOffset > startMaxSize) {
      mergedOffset = startMaxSize - numSizes[mergedIndex];
    }
    if (numSizes[nextIndex] - mergedOffset > endMaxSize) {
      mergedOffset = numSizes[nextIndex] - endMaxSize;
    }

    numSizes[mergedIndex] += mergedOffset;
    numSizes[nextIndex] -= mergedOffset;
    updateSizes(numSizes);
    return numSizes;
  };

  const onOffsetEnd = () => {
    movingIndex.value = null;
  };

  const onCollapse = (index: number, type: 'start' | 'end') => {
    const { items, containerSize, reverse } = getSnapshot();
    const mergedContainerSize = containerSize || 0;
    const limitSizes = items.map(item => [item.min, item.max]);

    const currentSizes = getPxSizes();
    const adjustedType = reverse ? (type === 'start' ? 'end' : 'start') : type;
    const currentIndex = adjustedType === 'start' ? index : index + 1;
    const targetIndex = adjustedType === 'start' ? index + 1 : index;
    const currentSize = currentSizes[currentIndex];
    const targetSize = currentSizes[targetIndex];

    if (currentSize !== 0 && targetSize !== 0) {
      currentSizes[currentIndex] = 0;
      currentSizes[targetIndex] += currentSize;
      cacheCollapsedSize.value[index] = currentSize;
    } else {
      const totalSize = currentSize + targetSize;
      const currentLimits = limitSizes[currentIndex] || [undefined, undefined];
      const targetLimits = limitSizes[targetIndex] || [undefined, undefined];
      const currentSizeMin = getLimitSize(currentLimits[0], 0, mergedContainerSize);
      const currentSizeMax = getLimitSize(
        currentLimits[1],
        mergedContainerSize,
        mergedContainerSize,
      );
      const targetSizeMin = getLimitSize(targetLimits[0], 0, mergedContainerSize);
      const targetSizeMax = getLimitSize(targetLimits[1], mergedContainerSize, mergedContainerSize);
      const limitStart = Math.max(currentSizeMin, totalSize - targetSizeMax);
      const limitEnd = Math.min(currentSizeMax, totalSize - targetSizeMin);
      const halfOffset = targetSizeMin || (limitEnd - limitStart) / 2;
      const targetCacheCollapsedSize = cacheCollapsedSize.value[index];
      const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize;
      const shouldUseCache =
        targetCacheCollapsedSize &&
        targetCacheCollapsedSize <= targetSizeMax &&
        targetCacheCollapsedSize >= targetSizeMin &&
        currentCacheCollapsedSize <= currentSizeMax &&
        currentCacheCollapsedSize >= currentSizeMin;
      if (shouldUseCache) {
        currentSizes[targetIndex] = targetCacheCollapsedSize;
        currentSizes[currentIndex] = currentCacheCollapsedSize;
      } else {
        currentSizes[currentIndex] -= halfOffset;
        currentSizes[targetIndex] += halfOffset;
      }
    }
    updateSizes(currentSizes);
    return currentSizes;
  };

  return [
    onOffsetStart,
    onOffsetUpdate,
    onOffsetEnd,
    onCollapse,
    computed(() => movingIndex.value?.index),
  ] as const;
}
