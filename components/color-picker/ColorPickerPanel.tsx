import { computed, defineComponent, onBeforeUnmount, ref, type PropType } from 'vue';
import classNames from '../_util/classNames';
import Segmented from '../segmented';
import { AggregationColor, generateColor, type HsbType } from './color';
import GradientColorBar from './components/GradientColorBar';

const colorPickerPanelProps = () => ({
  prefixCls: String,
  value: { type: Object as PropType<AggregationColor>, required: true },
  onChange: Function as PropType<(color: AggregationColor) => void>,
  disabledAlpha: { type: Boolean, default: false },
  presets: { type: Array as PropType<{ label: string; colors: string[] }[]>, default: undefined },
  mode: { type: String as PropType<'single' | 'gradient'>, default: 'single' },
  onModeChange: Function as PropType<(mode: 'single' | 'gradient') => void>,
  onChangeComplete: Function as PropType<(color: AggregationColor) => void>,
  panelRender: Function as PropType<(panel: any) => any>,
  format: { type: String as PropType<'hex' | 'rgb' | 'hsb'>, default: 'hex' },
  onFormatChange: Function as PropType<(format: 'hex' | 'rgb' | 'hsb') => void>,
  disabledFormat: { type: Boolean, default: false },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ColorPickerPanel',
  props: colorPickerPanelProps(),
  setup(props) {
    const panelPrefixCls = computed(() => `${props.prefixCls}-panel`);

    // 拖拽状态：null 表示未拖拽，否则记录拖拽的维度
    const dragging = ref<'sv' | 'hue' | 'alpha' | null>(null);

    // 渐变点激活索引
    const activeIndex = ref(0);

    const hsv = computed(() => props.value.toHsb());

    const onChangeColor = (next: HsbType) => {
      props.onChange?.(new AggregationColor(next));
    };

    /* ====================== SV 色板拖选 ====================== */
    const svRef = ref<HTMLElement>();
    const svUpdate = (e: MouseEvent) => {
      const el = svRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      onChangeColor({ h: hsv.value.h, s: x, b: 1 - y });
    };
    const svDown = (e: MouseEvent) => {
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
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      onChangeColor({ h: x * 360, s: hsv.value.s, b: hsv.value.b });
    };
    const hueDown = (e: MouseEvent) => {
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
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const { h, s, b } = hsv.value;
      onChangeColor({ h, s, b, a: x });
    };
    const alphaDown = (e: MouseEvent) => {
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
      dragging.value = null;
      unbindWindow();
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
      if (props.format === 'rgb') return props.value.toRgbString();
      if (props.format === 'hsb') return props.value.toHsbString();
      return props.value.toHex();
    });
    const onFormatInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      if (props.format === 'hex') {
        if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val)) {
          props.onChange?.(new AggregationColor(val));
        }
      } else if (props.format === 'rgb') {
        const m = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
          props.onChange?.(
            new AggregationColor({
              r: +m[1],
              g: +m[2],
              b: +m[3],
              a: m[4] !== undefined ? +m[4] : 1,
            }),
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
      const { disabledAlpha, presets, mode, onModeChange } = props;
      const color = props.value;
      const { h, s, b, a } = hsv.value;
      const isGradient = mode === 'gradient';

      return (
        <div class={panelPrefixCls.value}>
          {/* mode 切换 */}
          <Segmented
            size="small"
            class={`${panelPrefixCls.value}-mode`}
            options={[
              { label: '单色', value: 'single' },
              { label: '渐变', value: 'gradient' },
            ]}
            value={mode}
            onChange={val => onModeChange?.(val as 'single' | 'gradient')}
          />
          {isGradient ? (
            <GradientColorBar
              prefixCls={panelPrefixCls.value}
              value={color}
              activeIndex={activeIndex.value}
              onChange={c => props.onChange?.(c)}
              onActive={i => {
                activeIndex.value = i;
              }}
            />
          ) : (
            <>
              {/* SV 色板 */}
              <div class={`${panelPrefixCls.value}-sat`} ref={svRef} onMousedown={svDown}>
                <div
                  class={`${panelPrefixCls.value}-sat-fill`}
                  style={{ background: svBg.value }}
                />
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
                  <div
                    class={`${panelPrefixCls.value}-alpha`}
                    ref={alphaRef}
                    onMousedown={alphaDown}
                  >
                    <div
                      class={`${panelPrefixCls.value}-alpha-fill`}
                      style={{
                        background: `linear-gradient(to right, transparent, ${color.toHexString()})`,
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
                  onInput={onFormatInput}
                  onChange={() => {}}
                  spellcheck={false}
                />
              </div>
            </>
          )}
          {/* 预设色 */}
          {presets?.map(preset => (
            <div key={preset.label} class={`${panelPrefixCls.value}-presets`}>
              <span class={`${panelPrefixCls.value}-presets-label`}>{preset.label}</span>
              <div class={`${panelPrefixCls.value}-presets-colors`}>
                {preset.colors.map(c => (
                  <div
                    key={c}
                    class={classNames(`${panelPrefixCls.value}-presets-color`, {
                      active: color.toHexString().toLowerCase() === c.toLowerCase(),
                    })}
                    style={{ background: c }}
                    onClick={() => props.onChange?.(new AggregationColor(c))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };
  },
});

export { generateColor };
