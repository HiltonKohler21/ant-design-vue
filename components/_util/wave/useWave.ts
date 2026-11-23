import type { ComputedRef, Ref } from 'vue';
import { onBeforeUnmount, getCurrentInstance } from 'vue';
import { useToken } from '../../theme/internal';
import { findDOMNode } from '../props-util';
import type { ShowWave, WaveConfig } from './interface';
import showWaveEffect from './WaveEffect';

export default function useWave(
  className: Ref<string>,
  wave?: ComputedRef<WaveConfig | undefined>,
  component?: Ref<string | undefined>,
  hashId?: Ref<string>,
): ShowWave {
  const instance = getCurrentInstance();
  const [, , tokenHashId, realToken] = useToken();
  let stopWave: (() => void) | undefined;

  function showWave(event: MouseEvent) {
    const node = findDOMNode(instance) as HTMLElement;
    stopWave?.();
    stopWave = undefined;
    if (wave?.value?.disabled || !node) {
      return;
    }

    if (typeof wave?.value?.showEffect === 'function') {
      wave.value.showEffect(node, {
        className: className.value,
        token: realToken.value,
        component: component?.value,
        event,
        hashId: hashId?.value ?? tokenHashId.value ?? '',
      });
      return;
    }

    stopWave = showWaveEffect(node, className.value);
  }

  onBeforeUnmount(() => {
    stopWave?.();
  });

  return showWave;
}
