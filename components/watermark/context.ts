import type { InjectionKey } from 'vue';
import { inject, onBeforeUnmount, provide, shallowRef } from 'vue';

export interface WatermarkContextProps {
  add: (ele: HTMLElement) => void;
  remove: (ele: HTMLElement) => void;
}

function voidFunc() {}

const defaultWatermarkContext: WatermarkContextProps = {
  add: voidFunc,
  remove: voidFunc,
};

export const WatermarkContextKey: InjectionKey<WatermarkContextProps> = Symbol('WatermarkContext');

export function useProvideWatermark(context: WatermarkContextProps) {
  provide(WatermarkContextKey, context);
}

export function useInjectWatermark(): WatermarkContextProps {
  return inject(WatermarkContextKey, defaultWatermarkContext);
}

export function usePanelRef(panelSelector?: string) {
  const watermark = useInjectWatermark();
  const panelEleRef = shallowRef<HTMLElement | null>(null);

  const panelRef = (ele: any) => {
    const domEl: HTMLElement | null = ele?.$el ?? ele ?? null;
    if (domEl && domEl instanceof HTMLElement) {
      const innerContentEle = panelSelector
        ? domEl.querySelector<HTMLElement>(panelSelector)
        : domEl;
      if (innerContentEle) {
        if (panelEleRef.value && panelEleRef.value !== innerContentEle) {
          watermark.remove(panelEleRef.value);
        }
        watermark.add(innerContentEle);
        panelEleRef.value = innerContentEle;
      }
    } else if (panelEleRef.value) {
      watermark.remove(panelEleRef.value);
      panelEleRef.value = null;
    }
  };

  onBeforeUnmount(() => {
    if (panelEleRef.value) {
      watermark.remove(panelEleRef.value);
      panelEleRef.value = null;
    }
  });

  return panelRef;
}

export default WatermarkContextKey;
