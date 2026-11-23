import type { ComputedRef, Ref } from 'vue';
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';

const AUTO_INTERVAL = 200;
const STEP_BUCKETS: [limit: number, stepPtg: number][] = [
  [30, 0.05],
  [70, 0.03],
  [96, 0.01],
];

export default function usePercent(
  spinning: Ref<boolean>,
  percent: ComputedRef<number | 'auto' | undefined>,
): ComputedRef<number | undefined> {
  const mockPercent = shallowRef(0);
  let mockInterval: ReturnType<typeof setInterval> | null = null;

  const clearTimer = () => {
    if (mockInterval !== null) {
      clearInterval(mockInterval);
      mockInterval = null;
    }
  };

  const isAuto = computed(() => percent.value === 'auto');

  watch(
    [isAuto, spinning],
    ([auto, isSpinning]) => {
      clearTimer();
      if (auto && isSpinning) {
        mockPercent.value = 0;

        mockInterval = setInterval(() => {
          const prev = mockPercent.value;
          const restPTG = 100 - prev;

          for (let i = 0; i < STEP_BUCKETS.length; i += 1) {
            const [limit, stepPtg] = STEP_BUCKETS[i];

            if (prev <= limit) {
              mockPercent.value = prev + restPTG * stepPtg;
              return;
            }
          }
        }, AUTO_INTERVAL);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearTimer();
  });

  return computed(() => (isAuto.value ? mockPercent.value : (percent.value as number | undefined)));
}
