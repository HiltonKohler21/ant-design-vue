import type { Ref } from 'vue';
import { isRef, unref, computed, defineComponent, shallowRef, watch } from 'vue';
import type { MaybeRef, VueNode } from '../../_util/type';
import type { ModalFuncProps } from '../Modal';
import type { HookModalRef } from './HookModal';
import type { ModalStaticFunctions } from '../confirm';
import { withConfirm, withError, withInfo, withSuccess, withWarn } from '../confirm';

import HookModal from './HookModal';
import destroyFns from '../destroyFns';

let uuid = 0;

interface ElementsHolderRef {
  addModal: (modal: () => VueNode) => () => void;
}

const ElementsHolder = defineComponent({
  name: 'ElementsHolder',
  inheritAttrs: false,
  setup(_, { expose }) {
    const modals = shallowRef<(() => VueNode)[]>([]);
    const addModal = (modal: () => VueNode) => {
      modals.value.push(modal);
      modals.value = modals.value.slice();
      return () => {
        modals.value = modals.value.filter(currentModal => currentModal !== modal);
      };
    };

    expose({ addModal });
    return () => {
      return modals.value.map(modal => modal());
    };
  },
});

type HookConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);

export type ModalFuncWithRef = (props: MaybeRef<ModalFuncProps>) => {
  destroy: () => void;
  update: (configUpdate: HookConfigUpdate) => void;
  then: <T>(resolve: (confirmed: boolean) => T, reject?: () => void) => Promise<T>;
};

function useModal(): readonly [
  Omit<ModalStaticFunctions<ModalFuncWithRef>, 'warn'>,
  () => VueNode,
] {
  const holderRef = shallowRef<ElementsHolderRef>(null);
  // ========================== Effect ==========================
  const actionQueue = shallowRef([]);
  watch(
    actionQueue,
    () => {
      if (actionQueue.value.length) {
        const cloneQueue = [...actionQueue.value];
        cloneQueue.forEach(action => {
          action();
        });
        actionQueue.value = [];
      }
    },
    {
      immediate: true,
    },
  );

  // =========================== Hook ===========================
  const getConfirmFunc = (withFunc: (config: ModalFuncProps) => ModalFuncProps) =>
    function hookConfirm(config: Ref<ModalFuncProps> | ModalFuncProps) {
      uuid += 1;
      const open = shallowRef(true);
      const modalRef = shallowRef<HookModalRef>(null);
      const configRef = shallowRef(unref(config));
      const updateConfig = shallowRef({});

      let resolvePromise: (confirmed: boolean) => void;
      const promise = new Promise<boolean>(resolve => {
        resolvePromise = resolve;
      });

      watch(
        () => config,
        val => {
          updateAction({
            ...(isRef(val) ? val.value : val),
            ...updateConfig.value,
          });
        },
      );

      const destroyAction = (...args: any[]) => {
        open.value = false;
        const triggerCancel = args.some(param => param && param.triggerCancel);
        if (configRef.value.onCancel && triggerCancel) {
          configRef.value.onCancel(() => {}, ...args.slice(1));
        }
      };
      // eslint-disable-next-line prefer-const
      let closeFunc: Function | undefined;
      const modal = () => (
        <HookModal
          key={`modal-${uuid}`}
          config={withFunc(configRef.value)}
          ref={modalRef}
          open={open.value}
          destroyAction={destroyAction}
          onConfirm={(confirmed: boolean) => {
            resolvePromise(confirmed);
          }}
          afterClose={() => {
            if (closeFunc) {
              closeFunc();
              const index = destroyFns.indexOf(closeFunc);
              if (index !== -1) {
                destroyFns.splice(index, 1);
              }
            }
          }}
        />
      );

      closeFunc = holderRef.value?.addModal(modal);

      if (closeFunc) {
        destroyFns.push(closeFunc);
      }

      const updateAction = (newConfig: HookConfigUpdate) => {
        const nextConfig = typeof newConfig === 'function' ? newConfig(configRef.value) : newConfig;
        configRef.value = {
          ...configRef.value,
          ...nextConfig,
        };
      };

      const destroy = () => {
        if (modalRef.value) {
          destroyAction();
        } else {
          actionQueue.value = [...actionQueue.value, destroyAction];
        }
      };

      const update = (newConfig: HookConfigUpdate) => {
        if (typeof newConfig !== 'function') {
          updateConfig.value = newConfig;
        }
        if (modalRef.value) {
          updateAction(newConfig);
        } else {
          actionQueue.value = [...actionQueue.value, () => updateAction(newConfig)];
        }
      };
      return {
        destroy,
        update,
        then: <T,>(resolve: (confirmed: boolean) => T, reject?: () => void) =>
          promise.then(resolve, reject as any),
      };
    };

  const fns = computed(() => ({
    info: getConfirmFunc(withInfo),
    success: getConfirmFunc(withSuccess),
    error: getConfirmFunc(withError),
    warning: getConfirmFunc(withWarn),
    confirm: getConfirmFunc(withConfirm),
  }));
  const holderKey = Symbol('modalHolderKey');
  return [fns.value, () => <ElementsHolder key={holderKey} ref={holderRef} />] as const;
}

export default useModal;
