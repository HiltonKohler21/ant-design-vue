import { computed, h, type ComputedRef } from 'vue';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import type { StepProps } from './index';

export interface DisplayStep {
  item: StepProps;
  originIndex: number;
}

export interface UseDisplayStepsResult {
  canApplyMaxCount: ComputedRef<boolean>;
  displaySteps: ComputedRef<DisplayStep[]>;
  mappedDisplayCurrent: ComputedRef<number>;
  displayItems: ComputedRef<StepProps[]>;
}

function getDisplayStep(item: StepProps, index: number): DisplayStep {
  return {
    item: {
      ...item,
      key: item.key ?? index,
    },
    originIndex: index,
  };
}

function getEllipsisStep(
  items: StepProps[],
  currentIndex: number,
  prevIndex: number,
  nextIndex: number,
  prefixCls: string,
): DisplayStep {
  const prevKey = items[prevIndex]?.key ?? prevIndex;
  const nextKey = items[nextIndex]?.key ?? nextIndex;
  const hasError = items.slice(prevIndex + 1, nextIndex).some(step => step?.status === 'error');
  const ellipsisStatus = hasError ? 'error' : nextIndex - 1 < currentIndex ? 'finish' : 'wait';

  return {
    item: {
      key: `ellipsis-${prevKey}-${nextKey}`,
      title: '',
      icon: h(EllipsisOutlined),
      status: ellipsisStatus,
      disabled: true,
      className: `${prefixCls}-item-ellipsis`,
    },
    originIndex: -1,
  };
}

function getCollapsedIndexes(
  total: number,
  currentIndex: number,
  maxCount: number,
): Array<number | null> {
  const safeCurrent = Math.min(Math.max(currentIndex, 0), total - 1);
  const targetCount = Math.min(maxCount, total);
  const indexes = new Set([0, safeCurrent, total - 1]);

  for (let distance = 1; indexes.size < targetCount && distance < total; distance += 1) {
    const candidates = [
      safeCurrent - distance,
      safeCurrent + distance,
      distance,
      total - 1 - distance,
    ];

    for (const index of candidates) {
      if (indexes.size >= targetCount) {
        break;
      }

      if (index >= 0 && index < total) {
        indexes.add(index);
      }
    }
  }

  return Array.from(indexes)
    .sort((a, b) => a - b)
    .flatMap((index, order, sortedIndexes) =>
      order > 0 && index - sortedIndexes[order - 1] > 1 ? [null, index] : [index],
    );
}

export default function useDisplaySteps(
  mergedItems: ComputedRef<StepProps[]>,
  current: ComputedRef<number>,
  initial: ComputedRef<number>,
  maxCount: ComputedRef<number | undefined>,
  prefixCls: ComputedRef<string>,
): UseDisplayStepsResult {
  const canApplyMaxCount = computed(
    () =>
      maxCount.value !== undefined &&
      maxCount.value >= 3 &&
      mergedItems.value.length > maxCount.value,
  );

  const mappedCurrent = computed(() => current.value - initial.value);

  const displaySteps = computed<DisplayStep[]>(() => {
    const items = mergedItems.value;
    if (!canApplyMaxCount.value || maxCount.value === undefined) {
      return items.map((item, originIndex) => ({ item, originIndex }));
    }

    const collapsedIndexes = getCollapsedIndexes(items.length, mappedCurrent.value, maxCount.value);

    return collapsedIndexes.map((index, collapsedIndex) =>
      index === null
        ? getEllipsisStep(
            items,
            mappedCurrent.value,
            collapsedIndexes[collapsedIndex - 1] as number,
            collapsedIndexes[collapsedIndex + 1] as number,
            prefixCls.value,
          )
        : getDisplayStep(items[index], index),
    );
  });

  const mappedDisplayCurrent = computed(() => {
    if (!canApplyMaxCount.value) {
      return current.value;
    }
    const displayCurrent = displaySteps.value.findIndex(
      step => step.originIndex === mappedCurrent.value,
    );
    return displayCurrent >= 0 ? displayCurrent : mappedCurrent.value;
  });

  const displayItems = computed(() => displaySteps.value.map(step => step.item));

  return {
    canApplyMaxCount,
    displaySteps,
    mappedDisplayCurrent,
    displayItems,
  };
}
