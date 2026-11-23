import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import type { CustomSlotsType, VueNode } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import useStyle from './style';

export const checkableTagProps = () => ({
  prefixCls: String,
  checked: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  icon: PropTypes.any as unknown as PropType<VueNode>,
  onChange: {
    type: Function as PropType<(checked: boolean) => void>,
  },
  onClick: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  onKeydown: {
    type: Function as PropType<(e: KeyboardEvent) => void>,
  },
  'onUpdate:checked': Function as PropType<(checked: boolean) => void>,
});
export type CheckableTagProps = Partial<ExtractPropTypes<ReturnType<typeof checkableTagProps>>>;

const CheckableTag = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckableTag',
  inheritAttrs: false,
  props: checkableTagProps(),
  slots: Object as CustomSlotsType<{
    icon: any;
    default: any;
  }>,
  setup(props, { slots, emit, attrs }) {
    const { prefixCls, configProvider } = useConfigInject('tag', props);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);
    const tagConfig = computed(() => configProvider.tag?.value as any);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const handleClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        return;
      }
      const { checked } = props;
      emit('update:checked', !checked);
      emit('change', !checked);
      emit('click', e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      emit('keydown', e);
      if (e.defaultPrevented || mergedDisabled.value) {
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (!e.repeat) {
          const { checked } = props;
          emit('update:checked', !checked);
          emit('change', !checked);
        }
      }
    };

    const cls = computed(() =>
      classNames(
        prefixCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-checkable`]: true,
          [`${prefixCls.value}-checkable-checked`]: props.checked,
          [`${prefixCls.value}-checkable-disabled`]: mergedDisabled.value,
        },
        tagConfig.value?.className,
      ),
    );

    return () => {
      const iconNode = props.icon ?? slots.icon?.();
      const children = slots.default?.();
      return wrapSSR(
        <span
          {...attrs}
          role="checkbox"
          aria-checked={!!props.checked}
          aria-disabled={mergedDisabled.value || undefined}
          tabindex={mergedDisabled.value ? -1 : 0}
          class={[cls.value, attrs.class]}
          style={[tagConfig.value?.style, attrs.style as CSSProperties]}
          onClick={handleClick}
          onKeydown={handleKeyDown}
        >
          {iconNode ? (
            <>
              {iconNode}
              <span>{children}</span>
            </>
          ) : (
            children
          )}
        </span>,
      );
    };
  },
});

export default CheckableTag;
