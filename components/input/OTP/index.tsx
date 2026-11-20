import { Fragment, computed, defineComponent, ref, watch, type PropType } from 'vue';
import classNames from '../../_util/classNames';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getMergedStatus } from '../../_util/statusUtils';
import { FormItemInputContext } from '../../form/FormItemContext';
import useStyle from '../style/otp';
import OTPInput from './OTPInput';
import type { Variant } from '../../config-provider/context';
import type { InputStatus } from '../../_util/statusUtils';

function strToArr(str: string): string[] {
  return (str || '').split('');
}

export const otpProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 位数 */
  length: { type: Number, default: 6 },
  size: String as PropType<'large' | 'middle' | 'small'>,
  defaultValue: String,
  value: String,
  onChange: Function as PropType<(value: string) => void>,
  formatter: Function as PropType<(value: string) => string>,
  separator: { type: [Function, String] as PropType<((index: number) => any) | string> },
  variant: String as PropType<Variant>,
  disabled: { type: Boolean, default: undefined },
  status: String as PropType<InputStatus>,
  autoFocus: { type: Boolean, default: undefined },
  mask: { type: [Boolean, String] as PropType<boolean | string>, default: undefined },
  type: String,
  onInput: Function as PropType<(value: string[]) => void>,
  inputMode: String,
  'onUpdate:value': Function as PropType<(value: string) => void>,
});

const OTP = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputOTP',
  inheritAttrs: false,
  props: otpProps(),
  setup(props, { attrs, expose }) {
    const { prefixCls, direction } = useConfigInject('otp', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() =>
      getMergedStatus(formContext.status, props.status),
    );

    // ========================= Refs =========================
    const containerRef = ref<HTMLElement>();
    const refs = ref<Record<number, any>>({});

    expose({
      focus: () => refs.value[0]?.focus(),
      blur: () => {
        for (let i = 0; i < props.length; i += 1) {
          refs.value[i]?.blur();
        }
      },
      nativeElement: containerRef.value,
    });

    // ======================= Formatter ======================
    const internalFormatter = (txt: string) => (props.formatter ? props.formatter(txt) : txt);

    // ======================== Values ========================
    const valueCells = ref<string[]>(
      strToArr(internalFormatter(props.value ?? props.defaultValue ?? '')),
    );

    watch(
      () => props.value,
      value => {
        if (value !== undefined) {
          valueCells.value = strToArr(value);
        }
      },
      { immediate: true },
    );

    const triggerValueCellsChange = (nextValueCells: string[]) => {
      const prevValueCells = valueCells.value;
      valueCells.value = nextValueCells;
      props.onInput?.(nextValueCells);
      if (
        props.onChange &&
        nextValueCells.length === props.length &&
        nextValueCells.every(c => c) &&
        nextValueCells.some((c, index) => prevValueCells[index] !== c)
      ) {
        const val = nextValueCells.join('');
        props.onChange(val);
        props['onUpdate:value']?.(val);
      }
    };

    const patchValue = (index: number, txt: string): string[] => {
      let nextCells = [...valueCells.value];
      for (let i = 0; i < index; i += 1) {
        if (!nextCells[i]) {
          nextCells[i] = '';
        }
      }
      if (txt.length <= 1) {
        nextCells[index] = txt;
      } else {
        nextCells = nextCells.slice(0, index).concat(strToArr(txt));
      }
      nextCells = nextCells.slice(0, props.length);
      for (let i = nextCells.length - 1; i >= 0; i -= 1) {
        if (nextCells[i]) {
          break;
        }
        nextCells.pop();
      }
      const formattedValue = internalFormatter(nextCells.map(c => c || ' ').join(''));
      nextCells = strToArr(formattedValue).map((c, i) => {
        if (c === ' ' && !nextCells[i]) {
          return nextCells[i];
        }
        return c;
      });
      return nextCells;
    };

    // ======================== Change ========================
    const onInputChange = (index: number, txt: string) => {
      const nextCells = patchValue(index, txt);
      const nextIndex = Math.min(index + txt.length, props.length - 1);
      if (nextIndex !== index && nextCells[index] !== undefined) {
        refs.value[nextIndex]?.focus();
      }
      triggerValueCellsChange(nextCells);
    };

    const onInputActiveChange = (nextIndex: number) => {
      refs.value[nextIndex]?.focus();
    };

    return () => {
      const inputSharedProps = {
        variant: props.variant,
        disabled: props.disabled,
        status: mergedStatus.value,
        mask: props.mask,
        type: props.type,
        inputMode: props.inputMode,
      };

      return wrapSSR(
        <div
          {...attrs}
          ref={containerRef}
          class={classNames(
            prefixCls.value,
            {
              [`${prefixCls.value}-sm`]: props.size === 'small',
              [`${prefixCls.value}-lg`]: props.size === 'large',
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            hashId.value,
          )}
          role="group"
        >
          {Array.from({ length: props.length }).map((_, index) => {
            const singleValue = valueCells.value[index] || '';
            return (
              <Fragment key={`otp-${index}`}>
                <OTPInput
                  ref={el => {
                    refs.value[index] = el;
                  }}
                  index={index}
                  size={props.size}
                  htmlSize={1}
                  class={`${prefixCls.value}-input`}
                  onChange={onInputChange}
                  value={singleValue}
                  onActiveChange={onInputActiveChange}
                  autoFocus={index === 0 && props.autoFocus}
                  {...inputSharedProps}
                />
                {index < props.length - 1 && (
                  <span class={`${prefixCls.value}-separator`}>
                    {typeof props.separator === 'function'
                      ? props.separator(index)
                      : props.separator}
                  </span>
                )}
              </Fragment>
            );
          })}
        </div>,
      );
    };
  },
});

export default OTP;
