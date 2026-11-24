import { computed, defineComponent, ref, watch } from 'vue';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import classNames from '../_util/classNames';
import { mergeClassNames, mergeStyles, resolveSemantic } from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { withInstall } from '../_util/type';
import Popover from '../popover';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { FormItemInputContext } from '../form/FormItemContext';
import useStyle from './style';
import ColorPickerPanel from './ColorPickerPanel';
import type { PresetsItem, PresetColorValue } from './ColorPickerPanel';
import { AggregationColor, generateColor } from './color';
import PurePanel, { normalizeColorPickerClassNames, normalizeColorPickerStyles } from './PurePanel';

export type { PresetsItem, PresetColorValue };
export { AggregationColor, generateColor };

export interface ColorPickerPopupSemanticClassNames {
  root?: string;
  container?: string;
}

export interface ColorPickerPopupSemanticStyles {
  root?: CSSProperties;
  container?: CSSProperties;
}

export interface ColorPickerSemanticClassNames {
  root?: string;
  body?: string;
  content?: string;
  description?: string;
  popup?: string | ColorPickerPopupSemanticClassNames;
}

export interface ColorPickerSemanticStyles {
  root?: CSSProperties;
  body?: CSSProperties;
  content?: CSSProperties;
  description?: CSSProperties;
  /** @deprecated Please use `popup.container` instead. */
  popupOverlayInner?: CSSProperties;
  popup?: CSSProperties | ColorPickerPopupSemanticStyles;
}

export type ColorPickerClassNamesType =
  | ColorPickerSemanticClassNames
  | ((info: { props: ColorPickerProps }) => ColorPickerSemanticClassNames);

export type ColorPickerStylesType =
  | ColorPickerSemanticStyles
  | ((info: { props: ColorPickerProps }) => ColorPickerSemanticStyles);

export const colorPickerProps = () => ({
  prefixCls: String,
  rootClassName: String,
  classNames: {
    type: [Object, Function] as PropType<ColorPickerClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<ColorPickerStylesType>,
    default: undefined,
  },
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
    type: Array as PropType<PresetsItem[]>,
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
  panelRender: Function as PropType<
    (panel: any, extra?: { components: { Picker: any; Presets: any } }) => any
  >,
  prefix: { type: Object as PropType<any>, default: undefined },
  formatter: Function as PropType<(color: string) => string>,
  onChange: Function as PropType<(color: string) => void>,
  'onUpdate:value': Function as PropType<(color: string) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onOpenChange: Function as PropType<(open: boolean) => void>,
  size: String as PropType<'large' | 'middle' | 'medium' | 'small'>,
  status: String as PropType<'error' | 'warning'>,
  trigger: { type: String as PropType<'click' | 'hover'>, default: 'click' },
  placement: { type: String as PropType<any>, default: 'bottomLeft' },
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter?: boolean }>,
    default: undefined,
  },
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  autoAdjustOverflow: { type: Boolean, default: true },
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyTooltipOnHide: { type: Boolean, default: undefined },
  destroyOnHidden: { type: Boolean, default: undefined },
});

export type ColorPickerProps = Partial<ExtractPropTypes<ReturnType<typeof colorPickerProps>>>;

const ColorPicker = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AColorPicker',
  inheritAttrs: false,
  props: colorPickerProps(),
  setup(props, { attrs, emit, slots }) {
    const {
      configProvider,
      prefixCls,
      direction,
      size,
      disabled: mergedDisabled,
      getPopupContainer: contextGetPopupContainer,
    } = useConfigInject('color-picker', props);
    const colorPickerConfig = computed(() => (configProvider as any).colorPicker?.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const isZhLocale = computed(() =>
      configProvider.locale?.value?.locale?.toLowerCase().startsWith('zh'),
    );

    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const mergedSize = computed(() => props.size ?? size.value);
    const mergedArrow = computed(() => props.arrow ?? colorPickerConfig.value?.arrow ?? true);

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

    // ===================== Semantic Merge =====================
    const resolvedSemantics = computed(() => {
      const mergedProps: ColorPickerProps = {
        ...props,
        disabled: mergedDisabled.value,
        size: mergedSize.value,
        status: mergedStatus.value as any,
        arrow: mergedArrow.value,
      };
      const info = { props: mergedProps };
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
      const { disabledAlpha, presets, showText, allowClear, rootClassName } = props;
      const { mergedCN, mergedST } = resolvedSemantics.value;
      const isCleared = color.value.cleared;
      const display = isCleared ? 'transparent' : color.value.toCssString();
      const triggerText = isCleared
        ? isZhLocale.value
          ? '透明'
          : 'Transparent'
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
          <div
            class={classNames(`${prefixCls.value}-color-block`, mergedCN.body)}
            style={mergedST.body}
          >
            <div
              class={classNames(
                `${prefixCls.value}-color-block-inner`,
                `${prefixCls.value}-trigger-color`,
                mergedCN.content,
              )}
              style={{ background: display, ...(mergedST.content || {}) }}
            />
            {isCleared && <span class={`${prefixCls.value}-clear`}>/</span>}
          </div>
          {showText && (
            <span
              class={classNames(`${prefixCls.value}-trigger-text`, mergedCN.description)}
              style={mergedST.description}
            >
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

      const mergedPopupCls = classNames(
        `${prefixCls.value}-popover`,
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
        rootClassName,
        mergedCN.popup?.root,
        hashId.value,
      );

      const popupContainerStyle: CSSProperties | undefined =
        mergedST.popupOverlayInner || mergedST.popup?.container
          ? { ...(mergedST.popupOverlayInner || {}), ...(mergedST.popup?.container || {}) }
          : undefined;

      const popoverClassNames =
        mergedCN.popup?.root || mergedCN.popup?.container
          ? {
              root: mergedCN.popup?.root,
              container: mergedCN.popup?.container,
            }
          : undefined;

      const popoverStyles =
        mergedST.popup?.root || popupContainerStyle
          ? {
              root: mergedST.popup?.root,
              container: popupContainerStyle,
            }
          : undefined;

      const mergedDestroyOnHidden = props.destroyOnHidden ?? props.destroyTooltipOnHide;

      return wrapSSR(
        <div
          class={classNames(
            prefixCls.value,
            colorPickerConfig.value?.className,
            rootClassName,
            mergedCN.root,
            hashId.value,
            {
              [`${prefixCls.value}-disabled`]: mergedDisabled.value,
              [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
              [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            attrs.class,
          )}
          style={[mergedST.root, attrs.style as CSSProperties]}
        >
          <Popover
            open={open.value}
            trigger={props.trigger}
            placement={props.placement}
            arrow={mergedArrow.value}
            getPopupContainer={props.getPopupContainer ?? contextGetPopupContainer?.value}
            autoAdjustOverflow={props.autoAdjustOverflow}
            destroyTooltipOnHide={mergedDestroyOnHidden}
            overlayClassName={mergedPopupCls}
            classNames={popoverClassNames}
            styles={popoverStyles}
            onOpenChange={setOpen}
            v-slots={{
              default: () => triggerNode,
              content: () => (
                <ColorPickerPanel
                  class={classNames(hashId.value, {
                    [`${prefixCls.value}-panel-rtl`]: direction.value === 'rtl',
                  })}
                  prefixCls={prefixCls.value}
                  value={color.value}
                  onChange={setColor}
                  onChangeComplete={setColorComplete}
                  disabled={mergedDisabled.value}
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

const ColorPickerWithPanel = Object.assign(ColorPicker, {
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
});

export default withInstall(ColorPickerWithPanel);
