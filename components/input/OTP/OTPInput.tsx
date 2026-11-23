import { computed, defineComponent, ref, type PropType } from 'vue';
import classNames from '../../_util/classNames';
import raf from '../../_util/raf';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import omit from '../../_util/omit';
import Input from '../Input';
import type { Variant } from '../../config-provider/context';
import type { SizeType } from '../../config-provider';

const otpInputProps = () => ({
  index: { type: Number, required: true },
  value: String,
  mask: { type: [Boolean, String], default: undefined },
  variant: String as PropType<Variant>,
  disabled: { type: Boolean, default: undefined },
  status: String as PropType<any>,
  type: String,
  inputMode: String,
  className: String,
  size: String as PropType<SizeType>,
  htmlSize: Number,
  autoFocus: { type: Boolean, default: undefined },
  onChange: Function as PropType<(index: number, txt: string) => void>,
  onActiveChange: Function as PropType<(nextIndex: number) => void>,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OTPInput',
  inheritAttrs: false,
  props: otpInputProps(),
  setup(props, { expose, attrs }) {
    const { prefixCls } = useConfigInject('otp', props);
    const inputRef = ref<any>();

    expose({
      focus: () => inputRef.value?.focus(),
      blur: () => inputRef.value?.blur(),
      get input() {
        return inputRef.value?.input ?? inputRef.value;
      },
    });

    const maskValue = computed(() => (typeof props.mask === 'string' ? props.mask : props.value));

    const onInternalChange = (e: Event) => {
      props.onChange?.(props.index, (e.target as HTMLInputElement).value);
    };

    const syncSelection = () => {
      raf(() => {
        const inputEle = inputRef.value?.input ?? inputRef.value;
        if (document.activeElement === inputEle && inputEle) {
          inputEle.select?.();
        }
      });
    };

    const onInternalKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;
      if (key === 'ArrowLeft') {
        props.onActiveChange?.(props.index - 1);
      } else if (key === 'ArrowRight') {
        props.onActiveChange?.(props.index + 1);
      } else if (key === 'z' && (ctrlKey || metaKey)) {
        event.preventDefault();
      } else if (key === 'Backspace' && !props.value) {
        props.onActiveChange?.(props.index - 1);
      }
      syncSelection();
    };

    return () => (
      <span class={`${prefixCls.value}-input-wrapper`} role="presentation">
        {props.mask && props.value !== '' && props.value !== undefined && (
          <span class={`${prefixCls.value}-mask-icon`} aria-hidden="true">
            {maskValue.value}
          </span>
        )}
        <Input
          {...omit(props, ['index', 'onChange', 'onActiveChange', 'mask', 'value', 'className'])}
          aria-label={`OTP Input ${props.index + 1}`}
          type={(props.type ?? (props.mask === true ? 'password' : 'text')) as any}
          ref={inputRef}
          value={props.value}
          onInput={onInternalChange}
          onFocus={syncSelection}
          onKeydown={onInternalKeyDown}
          class={classNames(attrs.class, props.className, {
            [`${prefixCls.value}-mask-input`]: props.mask,
          })}
        />
      </span>
    );
  },
});
