import { computed, type Ref } from 'vue';
import type { InternalPanelItem } from './useItems';

interface ResizableInfo {
  resizable: boolean;
  startCollapsible: boolean;
  endCollapsible: boolean;
  showStartCollapsibleIcon: 'auto' | boolean;
  showEndCollapsibleIcon: 'auto' | boolean;
}

function getShowCollapsibleIcon(
  prev: { collapsible: boolean; showCollapsibleIcon: 'auto' | boolean },
  next: { collapsible: boolean; showCollapsibleIcon: 'auto' | boolean },
): 'auto' | boolean {
  if (prev.collapsible && next.collapsible) {
    if (prev.showCollapsibleIcon === true || next.showCollapsibleIcon === true) {
      return true;
    }
    if (prev.showCollapsibleIcon === 'auto' || next.showCollapsibleIcon === 'auto') {
      return 'auto';
    }
    return false;
  }
  if (prev.collapsible) {
    return prev.showCollapsibleIcon;
  }
  if (next.collapsible) {
    return next.showCollapsibleIcon;
  }
  return false;
}

export default function useResizable(
  items: Ref<InternalPanelItem[]>,
  pxSizes: Ref<number[]>,
  isRTL: Ref<boolean>,
): Ref<ResizableInfo[]> {
  return computed(() => {
    const resizeInfos: ResizableInfo[] = [];
    for (let i = 0; i < items.value.length - 1; i += 1) {
      const prevItem = items.value[i];
      const nextItem = items.value[i + 1];
      const prevSize = pxSizes.value[i];
      const nextSize = pxSizes.value[i + 1];
      const {
        resizable: prevResizable = true,
        min: prevMin,
        collapsible: prevCollapsible,
      } = prevItem;
      const {
        resizable: nextResizable = true,
        min: nextMin,
        collapsible: nextCollapsible,
      } = nextItem;

      const mergedResizable =
        prevResizable &&
        nextResizable &&
        (prevSize !== 0 || !prevMin) &&
        (nextSize !== 0 || !nextMin);

      const prevEndCollapsible = !!prevCollapsible.end && prevSize > 0;
      const nextStartExpandable = !!nextCollapsible.start && nextSize === 0 && prevSize > 0;
      const startCollapsible = prevEndCollapsible || nextStartExpandable;

      const nextStartCollapsible = !!nextCollapsible.start && nextSize > 0;
      const prevEndExpandable = !!prevCollapsible.end && prevSize === 0 && nextSize > 0;
      const endCollapsible = nextStartCollapsible || prevEndExpandable;

      const showStartCollapsibleIcon = getShowCollapsibleIcon(
        {
          collapsible: prevEndCollapsible,
          showCollapsibleIcon: prevCollapsible.showCollapsibleIcon,
        },
        {
          collapsible: nextStartExpandable,
          showCollapsibleIcon: nextCollapsible.showCollapsibleIcon,
        },
      );

      const showEndCollapsibleIcon = getShowCollapsibleIcon(
        {
          collapsible: nextStartCollapsible,
          showCollapsibleIcon: nextCollapsible.showCollapsibleIcon,
        },
        {
          collapsible: prevEndExpandable,
          showCollapsibleIcon: prevCollapsible.showCollapsibleIcon,
        },
      );

      resizeInfos[i] = {
        resizable: mergedResizable,
        startCollapsible: !!(isRTL.value ? endCollapsible : startCollapsible),
        endCollapsible: !!(isRTL.value ? startCollapsible : endCollapsible),
        showStartCollapsibleIcon: isRTL.value ? showEndCollapsibleIcon : showStartCollapsibleIcon,
        showEndCollapsibleIcon: isRTL.value ? showStartCollapsibleIcon : showEndCollapsibleIcon,
      };
    }
    return resizeInfos;
  });
}
