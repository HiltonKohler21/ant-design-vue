import {
  Fragment,
  computed,
  defineComponent,
  ref,
  watch,
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
} from 'vue';
import classNames from '../../_util/classNames';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getMergedStatus } from '../../_util/statusUtils';
import { FormItemInputContext } from '../../form/FormItemContext';
import useStyle from '../style/otp';
import OTPInput from './OTPInput';
import type { Variant } from '../../config-provider/context';
import type { InputStatus } from '../../_util/statusUtils';
import useVariant from '../../form/hooks/useVariant';
import {
  mergeSemanticClassNames,
  mergeSemanticStyles,
  resolveSemanticValue,
  type SemanticValue,
} from '../util';

export type OTPSemanticName = 'root' | 'input' | 'separator';
export type OTPSemanticClassNames = Partial<Record<OTPSemanticName, string>>;
export type OTPSemanticStyles = Partial<Record<OTPSemanticName, CSSProperties>>;
export type OTPClassNamesType<P = Record<string, any>> = SemanticValue<OTPSemanticClassNames, P>;
export type OTPStylesType<P = Record<string, any>> = SemanticValue<OTPSemanticStyles, P>;

function strToArr(str: string): string[] {
  return (str || '').split('');
}

export const otpProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 语义化 classNames（支持对象与函数式）：root / input / separator */
  classNames: {
    type: [Object, Function] as PropType<OTPClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（支持对象与函数式）：root / input / separator */
  styles: {
    type: [Object, Function] as PropType<OTPStylesType>,
    default: undefined,
  },
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
  autoComplete: String,
  mask: { type: [Boolean, String] as PropType<boolean | string>, default: undefined },
  type: String,
  onInput: Function as PropType<(value: string[]) => void>,
  inputMode: String,
  'onUpdate:value': Function as PropType<(value: string) => void>,
});

export type OTPProps = Partial<ExtractPropTypes<ReturnType<typeof otpProps>>>;

const OTP = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputOTP',
  inheritAttrs: false,
  props: otpProps(),
  setup(props, { attrs, emit, expose }) {
    const { configProvider, prefixCls, direction } = useConfigInject('otp', props);
    const otpConfig = computed(() => (configProvider as any).otp?.value);
    const [mergedVariant] = useVariant(
      'otp',
      computed(() => props.variant),
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formContext.status, props.status));

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
      get nativeElement() {
        return containerRef.value;
      },
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
      emit('input', nextValueCells);
      const val = nextValueCells.join('');
      emit('update:value', val);
      if (
        nextValueCells.length === props.length &&
        nextValueCells.every(c => c) &&
        nextValueCells.some((c, index) => prevValueCells[index] !== c)
      ) {
        emit('change', val);
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
      const currentVariant = mergedVariant.value;
      const inputSharedProps = {
        variant: currentVariant,
        disabled: props.disabled,
        status: mergedStatus.value,
        mask: props.mask,
        type: props.type,
        inputMode: props.inputMode,
        autoComplete: props.autoComplete ?? otpConfig.value?.autoComplete,
      };

      const semanticInfo = {
        props: {
          ...props,
          variant: currentVariant,
          status: mergedStatus.value,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<OTPSemanticClassNames>(
        resolveSemanticValue(otpConfig.value?.classNames, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<OTPSemanticStyles>(
        resolveSemanticValue(otpConfig.value?.styles, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );

      const mergedStyle =
        otpConfig.value?.style || mergedStyles.root
          ? [otpConfig.value?.style, mergedStyles.root, attrs.style]
          : attrs.style;

      return wrapSSR(
        <div
          {...attrs}
          ref={containerRef}
          style={mergedStyle as any}
          class={classNames(
            prefixCls.value,
            otpConfig.value?.className,
            props.rootClassName,
            mergedClassNames.root,
            {
              [`${prefixCls.value}-sm`]: props.size === 'small',
              [`${prefixCls.value}-lg`]: props.size === 'large',
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            hashId.value,
            attrs.class,
          )}
          role="group"
        >
          {Array.from({ length: props.length }).map((_, index) => {
            const singleValue = valueCells.value[index] || '';
            const separatorNode =
              props.separator !== undefined && props.separator !== null
                ? typeof props.separator === 'function'
                  ? props.separator(index)
                  : props.separator
                : null;
            return (
              <Fragment key={`otp-${index}`}>
                <OTPInput
                  ref={el => {
                    refs.value[index] = el;
                  }}
                  index={index}
                  size={props.size}
                  htmlSize={1}
                  class={classNames(`${prefixCls.value}-input`, mergedClassNames.input)}
                  style={mergedStyles.input}
                  onChange={onInputChange}
                  value={singleValue}
                  onActiveChange={onInputActiveChange}
                  autoFocus={index === 0 && props.autoFocus}
                  {...inputSharedProps}
                />
                {index < props.length - 1 &&
                  separatorNode !== null &&
                  separatorNode !== undefined &&
                  separatorNode !== false && (
                    <span
                      class={classNames(`${prefixCls.value}-separator`, mergedClassNames.separator)}
                      style={mergedStyles.separator}
                    >
                      {separatorNode}
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
