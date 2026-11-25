import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function isPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return Boolean(window.matchMedia(REDUCED_MOTION_QUERY)?.matches);
}

/**
 * Subscribe to the user's `prefers-reduced-motion: reduce` media query preference.
 */
export default function useReducedMotion(): Ref<boolean> {
  const reducedMotion = ref(isPrefersReducedMotion());

  let mediaQuery: MediaQueryList | null = null;
  const onChange = (event: MediaQueryListEvent) => {
    reducedMotion.value = event.matches;
  };

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    if (!mediaQuery) {
      return;
    }
    reducedMotion.value = mediaQuery.matches;
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
    } else if (typeof (mediaQuery as any).addListener === 'function') {
      (mediaQuery as any).addListener(onChange);
    }
  });

  onBeforeUnmount(() => {
    if (!mediaQuery) {
      return;
    }
    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', onChange);
    } else if (typeof (mediaQuery as any).removeListener === 'function') {
      (mediaQuery as any).removeListener(onChange);
    }
    mediaQuery = null;
  });

  return reducedMotion;
}
