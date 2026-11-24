import { useInjectForm, useInjectFormItemPrefix } from './context';
import type { VueNode } from '../_util/type';
import { computed, defineComponent, ref, Transition, watch, TransitionGroup } from 'vue';
import { getTransitionGroupProps, getTransitionProps } from '../_util/transition';
import classNames from '../_util/classNames';

import collapseMotion from '../_util/collapseMotion';
import useStyle from './style';

export interface ErrorListProps {
  errors?: VueNode[];
  warnings?: VueNode[];
  /** @private Internal Usage. Do not use in your production */
  help?: VueNode;
  onErrorVisibleChanged?: (visible: boolean) => void;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ErrorList',
  inheritAttrs: false,
  props: ['errors', 'help', 'onErrorVisibleChanged', 'helpStatus', 'warnings'],
  setup(props, { attrs }) {
    const { prefixCls, status } = useInjectFormItemPrefix();
    const { classNames: contextClassNames, styles: contextStyles } = useInjectForm();
    const baseClassName = computed(() => `${prefixCls.value}-item-explain`);
    const hasExplicitHelp = computed(() => props.help !== undefined && props.help !== null);
    const items = computed(() => {
      const list: { key: string; message: any; status?: string }[] = [];
      if (hasExplicitHelp.value) {
        (props.errors || []).forEach((error: any, index: number) => {
          list.push({ key: `help-${index}`, message: error, status: innerStatus.value });
        });
      } else {
        (props.errors || []).forEach((error: any, index: number) => {
          list.push({
            key: `error-${index}`,
            message: error,
            status: innerStatus.value || 'error',
          });
        });
        (props.warnings || []).forEach((warningMsg: any, index: number) => {
          list.push({ key: `warning-${index}`, message: warningMsg, status: 'warning' });
        });
      }
      return list;
    });
    const visible = computed(() => items.value.length > 0);
    const innerStatus = ref(status.value);
    const [, hashId] = useStyle(prefixCls);
    // Memo status in same visible
    watch([visible, status], () => {
      if (visible.value) {
        innerStatus.value = status.value;
      }
    });

    return () => {
      const colMItem = collapseMotion(`${prefixCls.value}-show-help-item`);
      const transitionGroupProps = getTransitionGroupProps(
        `${prefixCls.value}-show-help-item`,
        colMItem,
      );
      (transitionGroupProps as any).role = 'alert';
      (transitionGroupProps as any).class = [
        hashId.value,
        baseClassName.value,
        contextClassNames?.value?.help,
        attrs.class,
        `${prefixCls.value}-show-help`,
      ];
      (transitionGroupProps as any).style = contextStyles?.value?.help;
      return (
        <Transition
          {...getTransitionProps(`${prefixCls.value}-show-help`)}
          onAfterEnter={() => props.onErrorVisibleChanged?.(true)}
          onAfterLeave={() => props.onErrorVisibleChanged?.(false)}
        >
          <TransitionGroup {...transitionGroupProps} tag="div" v-show={items.value.length > 0}>
            {items.value.map(item => (
              <div
                key={item.key}
                class={classNames(
                  item.status ? `${baseClassName.value}-${item.status}` : '',
                  contextClassNames?.value?.helpItem,
                )}
                style={contextStyles?.value?.helpItem}
              >
                {item.message}
              </div>
            ))}
          </TransitionGroup>
        </Transition>
      );
    };
  },
});
