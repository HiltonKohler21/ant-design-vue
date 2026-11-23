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
  value: { type: [String, Object, Array] as PropType<any>, default: undefined },
  defaultValue: { type: [String, Object, Array] as PropType<any>, default: '#1677ff' },
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
    const innerValue = ref<any>(props.value ?? props.defaultValue);
    watch(
      () => props.value,
      v => {
        if (v !== undefined) innerValue.value = v;
      },
    );
    const color = computed(() => generateColor(innerValue.value));

    // mode 状态：支持根据初始渐变值自动进入 gradient 模式
    const modeOptions = computed<('single' | 'gradient')[]>(() => {
      const list = Array.isArray(props.mode) ? props.mode : [props.mode ?? 'single'];
      return Array.from(new Set(list)).filter(
        (m): m is 'single' | 'gradient' => m === 'single' || m === 'gradient',
      );
    });
    const allowModeSwitch = computed(() => modeOptions.value.length > 1);
    const resolveMode = (): 'single' | 'gradient' => {
      if (color.value.isGradient() && modeOptions.value.includes('gradient')) {
        return 'gradient';
      }
      return modeOptions.value[0] ?? 'single';
    };
    const mergedMode = ref<'single' | 'gradient'>(resolveMode());
    watch(
      () => props.mode,
      () => {
        if (!modeOptions.value.includes(mergedMode.value)) {
          mergedMode.value = resolveMode();
        }
      },
    );
    watch(
      () => color.value.isGradient(),
      isGrad => {
        if (isGrad && modeOptions.value.includes('gradient')) {
          mergedMode.value = 'gradient';
        }
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

    const formatOutputColor = (nextColor: AggregationColor): string => {
      if (nextColor.cleared) return '';
      return nextColor.isGradient() ? nextColor.toCssString() : nextColor.toHexString();
    };

    const setColor = (nextColor: AggregationColor) => {
      const raw = formatOutputColor(nextColor);
      const val = props.formatter && raw ? props.formatter(raw) : raw;
      innerValue.value = val;
      emit('update:value', val);
      props.onChange?.(val);
    };

    const setColorComplete = (nextColor: AggregationColor) => {
      const raw = formatOutputColor(nextColor);
      const val = props.formatter && raw ? props.formatter(raw) : raw;
      props.onChangeComplete?.(val);
    };

    const setMode = (m: 'single' | 'gradient') => {
      mergedMode.value = m;
      props.onModeChange?.(m);
      if (m === 'gradient' && !color.value.isGradient()) {
        // 切换到渐变时，初始化为双色渐变
        const startColor = color.value.cleared ? new AggregationColor('#1677ff') : color.value;
        const grad = new AggregationColor([
          { color: startColor, percent: 0 },
          { color: new AggregationColor('#ffffff'), percent: 100 },
        ]);
        setColor(grad);
        setColorComplete(grad);
      } else if (m === 'single' && color.value.isGradient()) {
        const first = color.value.getColors()[0]?.color ?? new AggregationColor('#1677ff');
        const single = new AggregationColor(first);
        setColor(single);
        setColorComplete(single);
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

    return () => {
      const { disabledAlpha, presets, showText, allowClear, rootClassName } = props;
      const isCleared = color.value.cleared;
      const display = isCleared ? 'transparent' : color.value.toCssString();
      const triggerText = isCleared
        ? ''
        : color.value.isGradient()
        ? color.value.toCssString()
        : mergedFormat.value === 'rgb'
        ? color.value.toRgbString()
        : mergedFormat.value === 'hsb'
        ? color.value.toHsbString()
        : color.value.toHexString();

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
              {typeof showText === 'function' ? showText(color.value) : triggerText}
            </span>
          )}
          {allowClear && !isCleared && (
            <span
              class={`${prefixCls.value}-trigger-clear`}
              onClick={e => {
                e.stopPropagation();
                const cleared = new AggregationColor('');
                setColor(cleared);
                setColorComplete(cleared);
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
            overlayClassName={classNames(`${prefixCls.value}-popover`, rootClassName, hashId.value)}
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
                  allowMode={allowModeSwitch.value}
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
