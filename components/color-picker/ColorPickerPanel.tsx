import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import type { PropType } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Segmented from '../segmented';
import type { VueNode } from '../_util/type';
import { AggregationColor, generateColor, type HsbType } from './color';
import GradientColorBar from './components/GradientColorBar';

export type PresetColorValue =
  | string
  | AggregationColor
  | { color: string | AggregationColor; percent: number }[];

export interface PresetsItem {
  label: VueNode;
  colors: PresetColorValue[];
  defaultOpen?: boolean;
  key?: string | number;
}

const colorPickerPanelProps = () => ({
  prefixCls: String,
  class: String,
  value: { type: Object as PropType<AggregationColor>, required: true },
  onChange: Function as PropType<(color: AggregationColor) => void>,
  disabled: { type: Boolean, default: false },
  disabledAlpha: { type: Boolean, default: false },
  presets: { type: Array as PropType<PresetsItem[]>, default: undefined },
  mode: { type: String as PropType<'single' | 'gradient'>, default: 'single' },
  allowMode: { type: Boolean, default: false },
  onModeChange: Function as PropType<(mode: 'single' | 'gradient') => void>,
  onChangeComplete: Function as PropType<(color: AggregationColor) => void>,
  panelRender: Function as PropType<
    (panel: any, extra?: { components: { Picker: any; Presets: any } }) => any
  >,
  format: { type: String as PropType<'hex' | 'rgb' | 'hsb'>, default: 'hex' },
  onFormatChange: Function as PropType<(format: 'hex' | 'rgb' | 'hsb') => void>,
  disabledFormat: { type: Boolean, default: false },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ColorPickerPanel',
  inheritAttrs: false,
  props: colorPickerPanelProps(),
  setup(props, { attrs }) {
    const { configProvider } = useConfigInject('color-picker', props);
    const panelPrefixCls = computed(() => `${props.prefixCls}-panel`);
    const isZhLocale = computed(() =>
      configProvider.locale?.value?.locale?.toLowerCase().startsWith('zh'),
    );

    // 拖拽状态：null 表示未拖拽，否则记录拖拽的维度
    const dragging = ref<'sv' | 'hue' | 'alpha' | null>(null);
    let lastDraggedColor: AggregationColor | null = null;

    // 渐变点激活索引
    const activeIndex = ref(0);

    const isGradientMode = computed(() => props.mode === 'gradient');
    const gradientColors = computed(() => props.value.getColors());
    const safeActiveIndex = computed(() =>
      Math.min(activeIndex.value, Math.max(0, gradientColors.value.length - 1)),
    );
    // 渐变模式下 SV / 色相 / Alpha / 输入框绑定到当前选中的渐变色点
    const activeColor = computed(() =>
      isGradientMode.value
        ? gradientColors.value[safeActiveIndex.value]?.color ?? props.value
        : props.value,
    );

    const hsv = computed(() => activeColor.value.toHsb());

    const emitSingleColor = (nextSingle: AggregationColor, complete = false) => {
      if (props.disabled) return;
      let nextColor: AggregationColor;
      if (isGradientMode.value) {
        const stops = gradientColors.value;
        const baseStops =
          stops.length >= 2
            ? stops
            : [
                { color: activeColor.value, percent: 0 },
                { color: new AggregationColor('#ffffff'), percent: 100 },
              ];
        const idx = Math.min(safeActiveIndex.value, baseStops.length - 1);
        const nextStops = baseStops.map((item, i) =>
          i === idx ? { ...item, color: nextSingle } : item,
        );
        nextColor = new AggregationColor(nextStops);
      } else {
        nextColor = nextSingle;
      }
      lastDraggedColor = nextColor;
      props.onChange?.(nextColor);
      if (complete) {
        props.onChangeComplete?.(nextColor);
      }
    };

    const handlePresetClick = (presetRaw: PresetColorValue) => {
      if (props.disabled) return;
      const presetColor = generateColor(presetRaw as any);
      if (presetColor.isGradient()) {
        if (props.allowMode || isGradientMode.value) {
          if (!isGradientMode.value) {
            props.onModeChange?.('gradient');
          }
          props.onChange?.(presetColor);
          props.onChangeComplete?.(presetColor);
        } else {
          const first = presetColor.getColors()[0]?.color ?? presetColor;
          emitSingleColor(new AggregationColor(first), true);
        }
      } else if (isGradientMode.value && props.allowMode) {
        props.onModeChange?.('single');
        props.onChange?.(presetColor);
        props.onChangeComplete?.(presetColor);
      } else {
        emitSingleColor(presetColor, true);
      }
    };

    const onChangeColor = (next: HsbType) => {
      emitSingleColor(new AggregationColor(next));
    };

    /* ====================== SV 色板拖选 ====================== */
    const svRef = ref<HTMLElement>();
    const svUpdate = (e: MouseEvent) => {
      const el = svRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.width ? Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) : 0;
      const y = rect.height ? Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)) : 0;
      onChangeColor({ h: hsv.value.h, s: x, b: 1 - y, a: hsv.value.a ?? 1 });
    };
    const svDown = (e: MouseEvent) => {
      if (props.disabled) return;
      dragging.value = 'sv';
      svUpdate(e);
      bindWindow();
    };

    /* ====================== 色相滑块 ====================== */
    const hueRef = ref<HTMLElement>();
    const hueUpdate = (e: MouseEvent) => {
      const el = hueRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.width ? Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) : 0;
      onChangeColor({ h: x * 360, s: hsv.value.s, b: hsv.value.b, a: hsv.value.a ?? 1 });
    };
    const hueDown = (e: MouseEvent) => {
      if (props.disabled) return;
      dragging.value = 'hue';
      hueUpdate(e);
      bindWindow();
    };

    /* ====================== Alpha 滑块 ====================== */
    const alphaRef = ref<HTMLElement>();
    const alphaUpdate = (e: MouseEvent) => {
      const el = alphaRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.width ? Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) : 0;
      const { h, s, b } = hsv.value;
      onChangeColor({ h, s, b, a: Math.round(x * 100) / 100 });
    };
    const alphaDown = (e: MouseEvent) => {
      if (props.disabled) return;
      dragging.value = 'alpha';
      alphaUpdate(e);
      bindWindow();
    };

    const onWindowMove = (e: MouseEvent) => {
      if (dragging.value === 'sv') svUpdate(e);
      else if (dragging.value === 'hue') hueUpdate(e);
      else if (dragging.value === 'alpha') alphaUpdate(e);
    };
    const onWindowUp = () => {
      const wasDragging = dragging.value !== null;
      dragging.value = null;
      unbindWindow();
      if (wasDragging) {
        props.onChangeComplete?.(lastDraggedColor ?? props.value);
        lastDraggedColor = null;
      }
    };
    const bindWindow = () => {
      window.addEventListener('mousemove', onWindowMove);
      window.addEventListener('mouseup', onWindowUp);
    };
    const unbindWindow = () => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
    };
    onBeforeUnmount(unbindWindow);

    /* ====================== 格式输入 ====================== */
    const formatValue = computed(() => {
      if (props.format === 'rgb') return activeColor.value.toRgbString();
      if (props.format === 'hsb') return activeColor.value.toHsbString();
      return activeColor.value.toHex();
    });
    const onFormatInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value.trim();
      if (props.format === 'hex') {
        if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val)) {
          emitSingleColor(new AggregationColor(val), true);
        }
      } else if (props.format === 'rgb') {
        const m = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
        if (m) {
          emitSingleColor(
            new AggregationColor({
              r: Math.min(255, +m[1]),
              g: Math.min(255, +m[2]),
              b: Math.min(255, +m[3]),
              a: m[4] !== undefined ? Math.min(1, Math.max(0, +m[4])) : 1,
            }),
            true,
          );
        }
      } else if (props.format === 'hsb') {
        const m = val.match(
          /hsba?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?(?:\s*,\s*([\d.]+))?\s*\)/i,
        );
        if (m) {
          emitSingleColor(
            new AggregationColor({
              h: Math.min(360, Math.max(0, +m[1])),
              s: Math.min(100, Math.max(0, +m[2])) / 100,
              b: Math.min(100, Math.max(0, +m[3])) / 100,
              a: m[4] !== undefined ? Math.min(1, Math.max(0, +m[4])) : hsv.value.a ?? 1,
            }),
            true,
          );
        }
      }
    };

    const svBg = computed(() => {
      const hue = `hsl(${Math.round(hsv.value.h)}, 100%, 50%)`;
      return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hue})`;
    });

    const hueBg = `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;

    return () => {
      const { disabledAlpha, presets, mode, allowMode, onModeChange } = props;
      const color = props.value;
      const curColor = activeColor.value;
      const { h, s, b, a } = hsv.value;
      const isGradient = isGradientMode.value;
      const opaqueColor = new AggregationColor({ h, s, b, a: 1 }).toHexString();

      const renderPickerSection = () => (
        <>
          {/* mode 切换（仅在同时允许 single 与 gradient 时展示） */}
          {allowMode && (
            <Segmented
              size="small"
              class={`${panelPrefixCls.value}-mode`}
              options={[
                { label: isZhLocale.value ? '单色' : 'Single', value: 'single' },
                { label: isZhLocale.value ? '渐变' : 'Gradient', value: 'gradient' },
              ]}
              value={mode}
              onChange={val => onModeChange?.(val as 'single' | 'gradient')}
            />
          )}
          {isGradient && (
            <GradientColorBar
              prefixCls={panelPrefixCls.value}
              value={color}
              activeIndex={safeActiveIndex.value}
              onChange={c => props.onChange?.(c)}
              onChangeComplete={c => props.onChangeComplete?.(c)}
              onActive={i => {
                activeIndex.value = i;
              }}
            />
          )}
          {/* SV 色板 */}
          <div class={`${panelPrefixCls.value}-sat`} ref={svRef} onMousedown={svDown}>
            <div class={`${panelPrefixCls.value}-sat-fill`} style={{ background: svBg.value }} />
            <div
              class={`${panelPrefixCls.value}-sat-thumb`}
              style={{ left: `${s * 100}%`, top: `${(1 - b) * 100}%` }}
            />
          </div>
          <div class={`${panelPrefixCls.value}-sliders`}>
            {/* 色相 */}
            <div class={`${panelPrefixCls.value}-hue`} ref={hueRef} onMousedown={hueDown}>
              <div class={`${panelPrefixCls.value}-hue-fill`} style={{ background: hueBg }} />
              <div
                class={`${panelPrefixCls.value}-hue-thumb`}
                style={{ left: `${(h / 360) * 100}%` }}
              />
            </div>
            {/* Alpha */}
            {!disabledAlpha && (
              <div class={`${panelPrefixCls.value}-alpha`} ref={alphaRef} onMousedown={alphaDown}>
                <div
                  class={`${panelPrefixCls.value}-alpha-fill`}
                  style={{
                    background: `linear-gradient(to right, transparent, ${opaqueColor})`,
                  }}
                />
                <div
                  class={`${panelPrefixCls.value}-alpha-thumb`}
                  style={{ left: `${(a ?? 1) * 100}%` }}
                />
              </div>
            )}
          </div>
          {/* 格式输入 */}
          <div class={`${panelPrefixCls.value}-input`}>
            {!props.disabledFormat && (
              <Segmented
                size="small"
                options={[
                  { label: 'HEX', value: 'hex' },
                  { label: 'RGB', value: 'rgb' },
                  { label: 'HSB', value: 'hsb' },
                ]}
                value={props.format}
                onChange={val => props.onFormatChange?.(val as 'hex' | 'rgb' | 'hsb')}
              />
            )}
            <input
              value={formatValue.value}
              disabled={props.disabled}
              onInput={onFormatInput}
              onChange={() => {}}
              spellcheck={false}
            />
          </div>
        </>
      );

      const renderPresetsSection = () =>
        presets?.map((preset, presetIdx) => (
          <div
            key={preset.key ?? String(preset.label ?? presetIdx)}
            class={`${panelPrefixCls.value}-presets`}
          >
            <span class={`${panelPrefixCls.value}-presets-label`}>{preset.label}</span>
            <div class={`${panelPrefixCls.value}-presets-colors`}>
              {preset.colors.map((c, idx) => {
                const presetColor = generateColor(c as any);
                const cssBg = presetColor.toCssString();
                const isActive = presetColor.isGradient()
                  ? color.equals(presetColor)
                  : curColor.equals(presetColor);
                return (
                  <div
                    key={`${cssBg}-${idx}`}
                    class={classNames(`${panelPrefixCls.value}-presets-color`, {
                      active: isActive,
                    })}
                    style={{ background: cssBg }}
                    onClick={() => handlePresetClick(c)}
                  />
                );
              })}
            </div>
          </div>
        ));

      const panelContent = (
        <div class={classNames(panelPrefixCls.value, props.class, attrs.class)}>
          {renderPickerSection()}
          {renderPresetsSection()}
        </div>
      );

      if (props.panelRender) {
        const PickerComp = () => (
          <div class={`${panelPrefixCls.value}-picker`}>{renderPickerSection()}</div>
        );
        const PresetsComp = () => (
          <div class={`${panelPrefixCls.value}-presets-wrapper`}>{renderPresetsSection()}</div>
        );
        return props.panelRender(panelContent, {
          components: { Picker: PickerComp, Presets: PresetsComp },
        });
      }
      return panelContent;
    };
  },
});

export { generateColor };
