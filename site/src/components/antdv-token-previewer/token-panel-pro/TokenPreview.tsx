import { theme as antdTheme } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import type { PropType } from 'vue';
import { toRefs, defineComponent } from 'vue';

import getColorBgImg from '../utils/getColorBgImg';
import getDesignToken from '../utils/getDesignToken';

export type TokenPreviewProps = {
  theme: ThemeConfig;
  tokenName: string;
  type?: string;
};

const isDarkThemeConfig = (config?: ThemeConfig): boolean => {
  const algo = config?.algorithm;
  if (!algo) return false;
  return Array.isArray(algo)
    ? algo.includes(antdTheme.darkAlgorithm)
    : algo === antdTheme.darkAlgorithm;
};

const TokenPreview = defineComponent({
  name: 'TokenPreview',
  props: {
    theme: { type: Object as PropType<ThemeConfig> },
    tokenName: { type: String },
    type: { type: String },
  },
  setup(props) {
    const { theme, tokenName, type } = toRefs(props);

    return () => {
      const dark = isDarkThemeConfig(theme.value);
      const dt = getDesignToken(theme.value) as any;

      if (type.value === 'Color') {
        return (
          <div
            style={{
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: dt[tokenName.value],
                transition: 'background-color 0.2s',
              }}
            />
          </div>
        );
      }
      if (type.value === 'FontSize') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
              fontSize: `${dt[tokenName.value]}px`,
              fontWeight: 700,
              color: dt.colorText,
            }}
          >
            <span>Aa</span>
          </div>
        );
      }
      if (type.value === 'LineHeight') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              overflow: 'hidden',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
            }}
          >
            <span
              style={{
                fontSize: `${dt[tokenName.value.replace('lineHeight', 'fontSize')]}px`,
                lineHeight: dt[tokenName.value],
                background: dt.colorErrorBg,
                color: dt.colorText,
                paddingInline: '8px',
              }}
            >
              Aa
            </span>
          </div>
        );
      }
      if (type.value === 'Margin') {
        const margin = dt[tokenName.value];
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: dt.colorWarningBg,
                transform: 'translate(10%, 10%) scale(0.8)',
              }}
            >
              <div
                style={{
                  marginLeft: `${margin}px`,
                  marginTop: `${margin}px`,
                  width: `calc(100% - ${margin}px)`,
                  height: `calc(100% - ${margin}px)`,
                  background: dt.colorInfoBg,
                }}
              />
            </div>
          </div>
        );
      }
      if (type.value === 'Padding') {
        const padding = `${dt[tokenName.value]}px`;
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: dt.colorSuccessBg,
                transform: 'translate(10%, 10%) scale(0.8)',
                paddingLeft: padding,
                paddingTop: padding,
              }}
            >
              <div
                style={{
                  width: `100%`,
                  height: `100%`,
                  background: dt.colorInfoBg,
                }}
              />
            </div>
          </div>
        );
      }
      if (type.value === 'BorderRadius') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                transform: 'translate(30%, 30%)',
                border: `2px solid ${dt.colorBorder}`,
                background: dt.colorBgContainer,
                borderRadius: `${dt[tokenName.value]}px`,
              }}
            />
          </div>
        );
      }
      if (type.value === 'BoxShadow') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${getColorBgImg(dark)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '60%',
                height: '50%',
                borderRadius: '6px',
                background: dt.colorBgContainer,
                border: `1px solid ${dt.colorBorder}`,
                boxShadow: dt[tokenName.value],
              }}
            />
          </div>
        );
      }
      return null;
    };
  },
});

export default TokenPreview;
