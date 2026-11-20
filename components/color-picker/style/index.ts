import type { FullToken, GenerateStyle } from '../../theme/internal';
import { mergeToken, genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {}

interface ColorPickerToken extends FullToken<'ColorPicker'> {
  colorPickerWidth: number;
  colorPickerSliderHeight: number;
}

const genColorPickerStyle: GenerateStyle<ColorPickerToken, any> = token => {
  const { componentCls } = token;
  const panelCls = `${componentCls}-panel`;

  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      [`${componentCls}-trigger`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXS,
        minWidth: token.controlHeight,
        minHeight: token.controlHeight,
        padding: `${token.paddingXXS}px`,
        border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
        borderRadius: token.borderRadiusSM,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid}`,
        '&:hover': {
          borderColor: token.colorPrimaryHover,
        },
        '&-disabled': {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
        [`${componentCls}-trigger-color`]: {
          width: token.controlHeightSM,
          height: token.controlHeightSM,
          borderRadius: token.borderRadiusXS,
          border: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
          position: 'relative',
        },
        [`${componentCls}-trigger-text`]: {
          fontSize: token.fontSizeSM,
          color: token.colorText,
        },
        [`${componentCls}-trigger-clear`]: {
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
          cursor: 'pointer',
          '&:hover': {
            color: token.colorText,
          },
        },
      },
    },
    [panelCls]: {
      width: token.colorPickerWidth,
      padding: token.paddingSM,
      boxSizing: 'border-box',
      [`${panelCls}-sat`]: {
        position: 'relative',
        height: 160,
        borderRadius: token.borderRadiusSM,
        overflow: 'visible',
        cursor: 'crosshair',
        [`${panelCls}-sat-fill`]: {
          position: 'absolute',
          inset: 0,
          borderRadius: token.borderRadiusSM,
        },
        [`${panelCls}-sat-thumb`]: {
          position: 'absolute',
          width: 12,
          height: 12,
          margin: '-6px 0 0 -6px',
          border: '2px solid #fff',
          borderRadius: '50%',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
          pointerEvents: 'none',
        },
      },
      [`${panelCls}-sliders`]: {
        marginTop: token.marginSM,
        display: 'flex',
        flexDirection: 'column',
        gap: token.marginXS,
      },
      [`${panelCls}-hue, ${panelCls}-alpha`]: {
        position: 'relative',
        height: token.colorPickerSliderHeight,
        borderRadius: token.borderRadiusXS,
        cursor: 'pointer',
      },
      [`${panelCls}-hue-fill, ${panelCls}-alpha-fill`]: {
        position: 'absolute',
        inset: 0,
        borderRadius: token.borderRadiusXS,
      },
      [`${panelCls}-hue-thumb, ${panelCls}-alpha-thumb`]: {
        position: 'absolute',
        top: '50%',
        width: 12,
        height: 12,
        margin: '-6px 0 0 -6px',
        border: '2px solid #fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
        pointerEvents: 'none',
      },
      [`${panelCls}-mode`]: {
        marginBottom: token.marginSM,
      },

      [`${panelCls}-gradient-slider`]: {
        position: 'relative',
        marginTop: token.marginSM,
        outline: 'none',
        [`${panelCls}-gradient-slider-bg`]: {
          position: 'relative',
          height: 16,
          borderRadius: token.borderRadiusXS,
          cursor: 'crosshair',
        },
        [`${panelCls}-gradient-slider-handle`]: {
          position: 'absolute',
          top: '50%',
          width: 14,
          height: 14,
          margin: '-7px 0 0 -7px',
          border: '2px solid #fff',
          borderRadius: '50%',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
          cursor: 'pointer',
          [`&-active`]: {
            boxShadow: `0 0 0 2px ${token.colorPrimary}`,
          },
        },
      },

      [`${panelCls}-input`]: {
        marginTop: token.marginSM,
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXS,
        span: {
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
        },
        input: {
          flex: 1,
          minWidth: 0,
          height: token.controlHeightSM,
          padding: `0 ${token.paddingXS}px`,
          border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
          borderRadius: token.borderRadiusXS,
          fontSize: token.fontSizeSM,
          color: token.colorText,
          outline: 'none',
          '&:focus': {
            borderColor: token.colorPrimary,
          },
        },
      },
      [`${panelCls}-presets`]: {
        marginTop: token.marginSM,
        [`${panelCls}-presets-label`]: {
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
          display: 'block',
          marginBottom: token.marginXXS,
        },
        [`${panelCls}-presets-colors`]: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: token.marginXXS,
        },
        [`${panelCls}-presets-color`]: {
          width: 20,
          height: 20,
          borderRadius: token.borderRadiusXS,
          border: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
          cursor: 'pointer',
          '&.active': {
            boxShadow: `0 0 0 2px ${token.colorPrimary}`,
          },
        },
      },
    },
  };
};

export default genComponentStyleHook<'ColorPicker'>('ColorPicker', token =>
  genColorPickerStyle(
    mergeToken<ColorPickerToken>(token, {
      colorPickerWidth: 250,
      colorPickerSliderHeight: 12,
    }),
  ),
);
