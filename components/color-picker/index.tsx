import { computed, defineComponent, ref, watch } from 'vue';
import type { PropType } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { withInstall } from '../_util/type';
import Popover from '../popover';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { FormItemInputContext } from '../form/FormItemContext';
import useStyle from './style';
import ColorPickerPanel from './ColorPickerPanel';
import { AggregationColor, generateColor } from './color';

export const colorPickerProps = () => ({
  prefixCls: String,
  rootClassName: String,
  value: { type: String, default: undefined },
  defaultValue: { type: String, default: '#1677ff' },
  open: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  disabledAlpha: { type: Boolean, default: false },
  disabledFormat: { type: Boolean, default: false },
  showText: {
    type: [Boolean, Function] as PropType<boolean | ((color: AggregationColor) => any)>,
    default: false,
  },
  presets: {
    type: Array as PropType<{ label: string; colors: string[] }[]>,
    default: undefined,
  },
  allowClear: { type: Boolean, default: false },
  format: { type: String as PropType<'hex' | 'rgb' | 'hsb'>, default: undefined },
  defaultFormat: { type: String as PropType<'hex' | 'rgb' | 'hsb'>, default: 'hex' },
  onFormatChange: Function as PropType<(format: 'hex' | 'rgb' | 'hsb') => void>,
  mode: {
    type: [String, Array] as PropType<'single' | 'gradient' | ('single' | 'gradient')[]>,
    default: 'single',
  },
  onModeChange: Function as PropType<(mode: 'single' | 'gradient') => void>,
  onClear: Function as PropType<() => void>,
  onChangeComplete: Function as PropType<(color: string) => void>,
  panelRender: Function as PropType<(panel: any) => any>,
  prefix: { type: Object as PropType<any>, default: undefined },
  formatter: Function as PropType<(color: string) => string>,
  onChange: Function as PropType<(color: string) => void>,
  'onUpdate:value': Function as PropType<(color: string) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onOpenChange: Function as PropType<(open: boolean) => void>,
  size: String as PropType<'large' | 'middle' | 'small'>,
  status: String as PropType<'error' | 'warning'>,
  trigger: { type: String as PropType<'click' | 'hover'>, default: 'click' },
  placement: { type: String as PropType<any>, default: 'bottomLeft' },
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter: boolean }>,
    default: false,
  },
});

const ColorPicker = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AColorPicker',
  inheritAttrs: false,
  props: colorPickerProps(),
  setup(props, { attrs, emit, slots }) {
    const {
      prefixCls,
      direction,
      size,
      disabled: mergedDisabled,
    } = useConfigInject('color-picker', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const mergedSize = computed(() => props.size ?? size.value);

    // 内部颜色状态（受控/非受控）
    const innerValue = ref<string>(props.value ?? props.defaultValue);
    watch(
      () => props.value,
      v => {
        if (v !== undefined) innerValue.value = v;
      },
    );
    const color = computed(() => generateColor(innerValue.value));

    // mode 状态
    const initialMode = computed<'single' | 'gradient'>(() => {
      if (Array.isArray(props.mode)) {
        return props.mode[0] ?? 'single';
      }
      return props.mode ?? 'single';
    });
    const mergedMode = ref<'single' | 'gradient'>(initialMode.value);
    watch(
      () => props.mode,
      () => {
        mergedMode.value = initialMode.value;
      },
    );

    const mergedFormat = ref<'hex' | 'rgb' | 'hsb'>(props.format ?? props.defaultFormat ?? 'hex');
    watch(
      () => props.format,
      v => {
        if (v !== undefined) mergedFormat.value = v;
      },
    );
    const setFormat = (f: 'hex' | 'rgb' | 'hsb') => {
      mergedFormat.value = f;
      props.onFormatChange?.(f);
    };

    const setMode = (m: 'single' | 'gradient') => {
      mergedMode.value = m;
      props.onModeChange?.(m);
      if (m === 'gradient' && !color.value.isGradient()) {
        // 切换到渐变时，初始化为双色渐变
        setColor(
          new AggregationColor([
            { color: color.value, percent: 0 },
            { color: new AggregationColor('#ffffff'), percent: 100 },
          ]),
        );
      }
    };

    const open = ref(props.open ?? false);
    watch(
      () => props.open,
      v => {
        if (v !== undefined) open.value = v;
      },
    );

    const setOpen = (next: boolean) => {
      if (mergedDisabled.value) return;
      open.value = next;
      emit('update:open', next);
      props.onOpenChange?.(next);
    };

    const setColor = (nextColor: AggregationColor) => {
      const raw = nextColor.isGradient() ? nextColor.toCssString() : nextColor.toHexString();
      const val = props.formatter ? props.formatter(raw) : raw;
      innerValue.value = val;
      emit('update:value', val);
      props.onChange?.(val);
    };

    const setColorComplete = (nextColor: AggregationColor) => {
      const raw = nextColor.isGradient() ? nextColor.toCssString() : nextColor.toHexString();
      props.onChangeComplete?.(raw);
    };

    return () => {
      const { disabledAlpha, presets, showText, allowClear, rootClassName } = props;
      const isCleared = color.value.cleared;
      const display = isCleared ? 'transparent' : color.value.toCssString();

      const triggerNode = slots.default ? (
        slots.default()
      ) : (
        <div
          class={classNames(
            `${prefixCls.value}-trigger`,
            {
              [`${prefixCls.value}-trigger-disabled`]: mergedDisabled.value,
              [`${prefixCls.value}-trigger-active`]: open.value,
            },
            getStatusClassNames(`${prefixCls.value}-trigger`, mergedStatus.value),
          )}
        >
          {props.prefix && <span class={`${prefixCls.value}-trigger-prefix`}>{props.prefix}</span>}
          <div class={`${prefixCls.value}-color-block`}>
            <div
              class={classNames(
                `${prefixCls.value}-color-block-inner`,
                `${prefixCls.value}-trigger-color`,
              )}
              style={{ background: display }}
            />
            {isCleared && <span class={`${prefixCls.value}-clear`}>/</span>}
          </div>
          {showText && (
            <span class={`${prefixCls.value}-trigger-text`}>
              {typeof showText === 'function' ? showText(color.value) : isCleared ? '' : display}
            </span>
          )}
          {allowClear && !isCleared && (
            <span
              class={`${prefixCls.value}-trigger-clear`}
              onClick={e => {
                e.stopPropagation();
                setColor(new AggregationColor(''));
                props.onClear?.();
              }}
            >
              ×
            </span>
          )}
        </div>
      );

      return wrapSSR(
        <div
          class={classNames(
            prefixCls.value,
            rootClassName,
            hashId.value,
            {
              [`${prefixCls.value}-disabled`]: mergedDisabled.value,
              [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
              [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            attrs.class,
          )}
          style={attrs.style as any}
        >
          <Popover
            open={open.value}
            trigger={props.trigger}
            placement={props.placement}
            arrow={props.arrow}
            overlayClassName={classNames(
              `${prefixCls.value}-popover`,
              rootClassName,
              hashId.value,
            )}
            onOpenChange={setOpen}
            v-slots={{
              default: () => triggerNode,
              content: () => (
                <ColorPickerPanel
                  class={hashId.value}
                  prefixCls={prefixCls.value}
                  value={color.value}
                  onChange={setColor}
                  onChangeComplete={setColorComplete}
                  disabledAlpha={disabledAlpha}
                  presets={presets}
                  mode={mergedMode.value}
                  allowMode={
                    Array.isArray(props.mode)
                      ? props.mode.includes('gradient')
                      : props.mode === 'gradient'
                  }
                  onModeChange={setMode}
                  panelRender={props.panelRender}
                  format={mergedFormat.value}
                  onFormatChange={setFormat}
                  disabledFormat={props.disabledFormat}
                />
              ),
            }}
          />
        </div>,
      );
    };
  },
});

export default withInstall(ColorPicker);
