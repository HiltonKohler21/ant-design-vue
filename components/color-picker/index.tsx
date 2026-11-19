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
      const hex = nextColor.toHexString();
      innerValue.value = hex;
      emit('update:value', hex);
      props.onChange?.(hex);
    };

    return () => {
      const { disabled, disabledAlpha, presets, showText, allowClear, rootClassName } = props;
      const display = color.value.toHexString();

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
                disabledAlpha={disabledAlpha}
                presets={presets}
              />
            ),
          }}
        />,
      );
    };
  },
});

export default withInstall(ColorPicker);
