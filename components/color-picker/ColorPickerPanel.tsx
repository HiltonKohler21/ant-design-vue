import { computed, defineComponent, onBeforeUnmount, ref, type PropType } from 'vue';
import classNames from '../_util/classNames';
import { AggregationColor, generateColor, type HsbType } from './color';

const colorPickerPanelProps = () => ({
  prefixCls: String,
  value: { type: Object as PropType<AggregationColor>, required: true },
  onChange: Function as PropType<(color: AggregationColor) => void>,
  disabledAlpha: { type: Boolean, default: false },
  presets: { type: Array as PropType<{ label: string; colors: string[] }[]>, default: undefined },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ColorPickerPanel',
  props: colorPickerPanelProps(),
  setup(props) {
    const panelPrefixCls = computed(() => `${props.prefixCls}-panel`);

    // 拖拽状态：null 表示未拖拽，否则记录拖拽的维度
    const dragging = ref<'sv' | 'hue' | 'alpha' | null>(null);

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

    /* ====================== Hex 输入 ====================== */
    const hexInput = ref(hsv.value ? props.value.toHex() : '');
    const onHexInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      const color = new TinyColorWrapper(val);
      if (color.isValid) {
        props.onChange?.(new AggregationColor(val));
      }
    };

    const svBg = computed(() => {
      const hue = `hsl(${Math.round(hsv.value.h)}, 100%, 50%)`;
      return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hue})`;
    });

    const hueBg = `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;

    return () => {
      const { disabledAlpha, presets } = props;
      const color = props.value;
      const { h, s, b, a } = hsv.value;

      return (
        <div class={panelPrefixCls.value}>
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
          {/* Hex 输入 */}
          <div class={`${panelPrefixCls.value}-input`}>
            <span>Hex</span>
            <input
              value={hexInput.value}
              onInput={onHexInput}
              onChange={() => {}}
              spellcheck={false}
            />
          </div>
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

// TinyColor 包装（避免引入额外依赖，直接复用 color.ts 的类型）
class TinyColorWrapper {
  isValid: boolean;
  constructor(input: string) {
    this.isValid = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input);
  }
}

export { generateColor };
