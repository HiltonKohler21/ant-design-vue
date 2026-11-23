import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  watch,
} from 'vue';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import isVisible from '../../vc-util/Dom/isVisible';
import classNames from '../classNames';
import { findDOMNode } from '../props-util';
import useStyle from './style';
import useWave from './useWave';

export type { ShowWave, ShowWaveEffect, WaveConfig } from './interface';

export interface WaveProps {
  disabled?: boolean;
  component?: string;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Wave',
  props: {
    disabled: Boolean,
    component: String,
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const { prefixCls, configProvider } = useConfigInject('wave', props);
    const wave = computed(() => configProvider.wave?.value);

    // ============================== Style ===============================
    const [, hashId] = useStyle(prefixCls);

    // =============================== Wave ===============================
    const showWave = useWave(
      computed(() => classNames(prefixCls.value, hashId.value)),
      wave,
      computed(() => props.component),
      hashId,
    );
    let onClick: (e: MouseEvent) => void;
    const clear = () => {
      const node = findDOMNode(instance) as HTMLElement;
      node?.removeEventListener('click', onClick, true);
    };
    onMounted(() => {
      watch(
        () => [props.disabled, wave.value?.disabled],
        () => {
          clear();
          nextTick(() => {
            const node: HTMLElement = findDOMNode(instance);
            node?.removeEventListener('click', onClick, true);
            if (!node || node.nodeType !== 1 || props.disabled || wave.value?.disabled) {
              return;
            }

            // Click handler
            onClick = (e: MouseEvent) => {
              // Fix radio button click twice
              if (
                wave.value?.disabled ||
                (e.target as HTMLElement).tagName === 'INPUT' ||
                !isVisible(e.target as HTMLElement) ||
                // No need wave
                !node.getAttribute ||
                node.getAttribute('disabled') ||
                (node as HTMLInputElement).disabled ||
                (typeof node.className === 'string' &&
                  node.className.includes('disabled') &&
                  !node.className.includes('disabled:')) ||
                node.getAttribute('aria-disabled') === 'true' ||
                (typeof node.className === 'string' && node.className.includes('-leave'))
              ) {
                return;
              }

              showWave(e);
            };

            // Bind events
            node.addEventListener('click', onClick, true);
          });
        },
        {
          immediate: true,
          flush: 'post',
        },
      );
    });
    onBeforeUnmount(() => {
      clear();
    });

    return () => {
      // ============================== Render ==============================
      const children = slots.default?.()[0];
      return children;
    };
  },
});
