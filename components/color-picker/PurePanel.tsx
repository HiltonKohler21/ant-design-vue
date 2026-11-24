import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import { mergeClassNames, mergeStyles, resolveSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { AggregationColor, generateColor } from './color';
import ColorPickerPanel from './ColorPickerPanel';
import type { PresetsItem } from './ColorPickerPanel';
import useStyle from './style';
import type {
  ColorPickerClassNamesType,
  ColorPickerSemanticClassNames,
  ColorPickerSemanticStyles,
  ColorPickerStylesType,
} from './index';

const POPUP_SUB_KEYS = new Set(['root', 'container']);

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function normalizeColorPickerClassNames(
  input: ColorPickerSemanticClassNames | undefined,
): Record<string, any> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  if (typeof input.popup === 'string') {
    return { ...input, popup: { root: input.popup } };
  }
  return input;
}

export function normalizeColorPickerStyles(
  input: ColorPickerSemanticStyles | undefined,
): Record<string, any> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const { popup } = input;
  if (isPlainObject(popup)) {
    const keys = Object.keys(popup);
    const isNested =
      keys.length > 0 &&
      keys.every(k => POPUP_SUB_KEYS.has(k) && (popup[k] === undefined || isPlainObject(popup[k])));
    if (!isNested && keys.length > 0) {
      return { ...input, popup: { root: popup as CSSProperties } };
    }
  }
  return input;
}

export const colorPickerPurePanelProps = () => ({
  prefixCls: String,
  rootClassName: String,
  value: { type: [String, Object, Array] as PropType<any>, default: undefined },
  defaultValue: { type: [String, Object, Array] as PropType<any>, default: '#1677ff' },
  disabled: { type: Boolean, default: undefined },
  disabledAlpha: { type: Boolean, default: false },
  disabledFormat: { type: Boolean, default: false },
  presets: { type: Array as PropType<PresetsItem[]>, default: undefined },
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
  panelRender: Function as PropType<
    (panel: any, extra?: { components: { Picker: any; Presets: any } }) => any
  >,
  formatter: Function as PropType<(color: string) => string>,
  onChange: Function as PropType<(color: string) => void>,
  'onUpdate:value': Function as PropType<(color: string) => void>,
  size: String as PropType<'large' | 'middle' | 'medium' | 'small'>,
  classNames: {
    type: [Object, Function] as PropType<ColorPickerClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<ColorPickerStylesType>,
    default: undefined,
  },
});

export type ColorPickerPurePanelProps = Partial<
  ExtractPropTypes<ReturnType<typeof colorPickerPurePanelProps>>
>;

const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AColorPickerPurePanel',
  inheritAttrs: false,
  props: colorPickerPurePanelProps(),
  setup(props, { attrs, emit }) {
    const {
      configProvider,
      prefixCls,
      direction,
      size,
      disabled: mergedDisabled,
    } = useConfigInject('color-picker', props);
    const colorPickerConfig = computed(() => (configProvider as any).colorPicker?.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const innerValue = ref<any>(props.value ?? props.defaultValue);
    watch(
      () => props.value,
      v => {
        if (v !== undefined) innerValue.value = v;
      },
    );
    const color = computed(() => generateColor(innerValue.value));

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

    const mergedSize = computed(() => props.size ?? size.value);

    const resolvedSemantics = computed(() => {
      const info = {
        props: {
          ...props,
          disabled: mergedDisabled.value,
          size: mergedSize.value,
        },
      };
      const mergedCN = mergeClassNames<Record<string, any>>(
        normalizeColorPickerClassNames(resolveSemantic(colorPickerConfig.value?.classNames, info)),
        normalizeColorPickerClassNames(resolveSemantic(props.classNames as any, info)),
      );
      const mergedST = mergeStyles<Record<string, any>>(
        normalizeColorPickerStyles(resolveSemantic(colorPickerConfig.value?.styles, info)),
        colorPickerConfig.value?.style ? { root: colorPickerConfig.value.style } : undefined,
        normalizeColorPickerStyles(resolveSemantic(props.styles as any, info)),
      );
      return { mergedCN, mergedST };
    });

    return () => {
      const { mergedCN, mergedST } = resolvedSemantics.value;
      const popupContainerStyle =
        mergedST.popupOverlayInner || mergedST.popup?.container
          ? { ...(mergedST.popupOverlayInner || {}), ...(mergedST.popup?.container || {}) }
          : undefined;

      return wrapSSR(
        <div
          {...attrs}
          class={classNames(
            prefixCls.value,
            `${prefixCls.value}-pure`,
            colorPickerConfig.value?.className,
            props.rootClassName,
            mergedCN.root,
            mergedCN.popup?.root,
            hashId.value,
            {
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            },
            attrs.class,
          )}
          style={[mergedST.root, mergedST.popup?.root, attrs.style as CSSProperties]}
        >
          <div
            class={classNames(`${prefixCls.value}-pure-container`, mergedCN.popup?.container)}
            style={popupContainerStyle}
          >
            <ColorPickerPanel
              class={classNames(hashId.value, {
                [`${prefixCls.value}-panel-rtl`]: direction.value === 'rtl',
              })}
              prefixCls={prefixCls.value}
              value={color.value}
              onChange={setColor}
              onChangeComplete={setColorComplete}
              disabled={mergedDisabled.value}
              disabledAlpha={props.disabledAlpha}
              presets={props.presets}
              mode={mergedMode.value}
              allowMode={allowModeSwitch.value}
              onModeChange={setMode}
              panelRender={props.panelRender}
              format={mergedFormat.value}
              onFormatChange={setFormat}
              disabledFormat={props.disabledFormat}
            />
          </div>
        </div>,
      );
    };
  },
});

export default PurePanel;
