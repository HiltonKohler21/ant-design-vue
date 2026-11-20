import { computed, defineComponent, ref, watch, type PropType } from 'vue';
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
  showText: { type: Boolean, default: false },
  presets: {
    type: Array as PropType<{ label: string; colors: string[] }[]>,
    default: undefined,
  },
  allowClear: { type: Boolean, default: false },
  format: { type: String as PropType<'hex' | 'rgb' | 'hsb'>, default: 'hex' },
  mode: { type: String as PropType<'single' | 'gradient'>, default: 'single' },
  onModeChange: Function as PropType<(mode: 'single' | 'gradient') => void>,
  disabledFormat: { type: Boolean, default: undefined },
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
});

const ColorPicker = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AColorPicker',
  inheritAttrs: false,
  props: colorPickerProps(),
  setup(props, { attrs, emit }) {
    const { prefixCls } = useConfigInject('color-picker', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));

    // 内部颜色状态（受控/非受控）
    const innerValue = ref<string>(props.value ?? props.defaultValue);
    watch(
      () => props.value,
      v => {
        if (v !== undefined) innerValue.value = v;
      },
    );
    const color = computed(() => generateColor(innerValue.value));

    // mode 状态（非受控）
    const mergedMode = ref<'single' | 'gradient'>(props.mode);
    watch(
      () => props.mode,
      v => {
        mergedMode.value = v;
      },
    );
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
      const { disabled, disabledAlpha, presets, showText, allowClear, rootClassName } = props;
      const display = color.value.toCssString();

      const trigger = (
        <div
          class={classNames(
            `${prefixCls.value}-trigger`,
            rootClassName,
            {
              [`${prefixCls.value}-trigger-disabled`]: disabled,
            },
            getStatusClassNames(`${prefixCls.value}-trigger`, mergedStatus.value),
          )}
        >
          {props.prefix && <span class={`${prefixCls.value}-trigger-prefix`}>{props.prefix}</span>}
          <div
            class={`${prefixCls.value}-trigger-color`}
            style={{ background: color.value.cleared ? 'transparent' : display }}
          />
          {showText && <span class={`${prefixCls.value}-trigger-text`}>{display}</span>}
          {allowClear && color.value.cleared === false && (
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
        <Popover
          {...attrs}
          class={classNames(prefixCls.value, rootClassName, hashId.value, attrs.class)}
          open={open.value}
          trigger="click"
          placement="bottomLeft"
          onOpenChange={setOpen}
          v-slots={{
            default: () => trigger,
            content: () => (
              <ColorPickerPanel
                prefixCls={prefixCls.value}
                value={color.value}
                onChange={setColor}
                onChangeComplete={setColorComplete}
                disabledAlpha={disabledAlpha}
                presets={presets}
                mode={mergedMode.value}
                onModeChange={setMode}
                panelRender={props.panelRender}
              />
            ),
          }}
        />,
      );
    };
  },
});

export default withInstall(ColorPicker);
