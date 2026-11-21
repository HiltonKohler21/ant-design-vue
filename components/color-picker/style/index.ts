import { unit } from '../../_util/cssinjs';
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

      // Trigger
      [`${componentCls}-trigger, &-trigger`]: {
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderRadius: token.borderRadiusSM,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
        background: token.colorBgContainer,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid}`,
        padding: '3px',

        '&:hover': {
          borderColor: token.colorPrimaryHover,
        },
        '&-active, &:focus': {
          borderColor: token.colorPrimary,
          boxShadow: `0 0 0 2px ${token.controlOutline}`,
        },
        '&-disabled': {
          cursor: 'not-allowed',
          background: token.colorBgContainerDisabled,
          borderColor: token.colorBorder,
          opacity: 0.65,
        },

        // Color Block
        [`${componentCls}-color-block, ${componentCls}-trigger-color`]: {
          position: 'relative',
          width: token.controlHeightSM,
          height: token.controlHeightSM,
          borderRadius: token.borderRadiusXS,
          overflow: 'hidden',
          boxSizing: 'border-box',
          backgroundImage: `conic-gradient(rgba(0, 0, 0, 0.08) 0 25%, transparent 0 50%, rgba(0, 0, 0, 0.08) 0 75%, transparent 0)`,
          backgroundSize: '8px 8px',

          [`${componentCls}-color-block-inner`]: {
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08)',
          },

          [`${componentCls}-clear`]: {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: token.fontSizeSM,
            color: token.colorError,
            fontWeight: 'bold',
          },
        },

        // Text
        [`${componentCls}-trigger-text`]: {
          margin: `0 ${unit(token.marginXS)} 0 ${unit(token.marginXS)}`,
          fontSize: token.fontSizeSM,
          color: token.colorText,
          lineHeight: 1,
        },

        // Clear button
        [`${componentCls}-trigger-clear`]: {
          marginRight: token.marginXXS,
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
          cursor: 'pointer',
          lineHeight: 1,
          transition: `color ${token.motionDurationMid}`,
          '&:hover': {
            color: token.colorText,
          },
        },
      },

      // Sizes
      [`&${componentCls}-sm, &-sm`]: {
        [`${componentCls}-trigger, &-trigger`]: {
          padding: '2px',
          [`${componentCls}-color-block, ${componentCls}-trigger-color`]: {
            width: 16,
            height: 16,
          },
          [`${componentCls}-trigger-text`]: {
            fontSize: token.fontSizeSM,
            margin: '0 4px',
          },
        },
      },

      [`&${componentCls}-lg, &-lg`]: {
        [`${componentCls}-trigger, &-trigger`]: {
          padding: '4px',
          [`${componentCls}-color-block, ${componentCls}-trigger-color`]: {
            width: 30,
            height: 30,
          },
          [`${componentCls}-trigger-text`]: {
            fontSize: token.fontSize,
            margin: '0 8px',
          },
        },
      },
    },

    // Popover overlay styling
    [`${componentCls}-popover`]: {
      [`&.ant-popover .ant-popover-inner`]: {
        padding: 0,
        overflow: 'hidden',
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        background: token.colorBgElevated,
      },
    },

    // Panel styling
    [panelCls]: {
      width: token.colorPickerWidth,
      padding: token.paddingSM,
      boxSizing: 'border-box',
      background: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,

      // Saturation SV Board
      [`${panelCls}-sat`]: {
        position: 'relative',
        height: 160,
        borderRadius: token.borderRadiusSM,
        overflow: 'hidden',
        cursor: 'crosshair',
        userSelect: 'none',

        [`${panelCls}-sat-fill`]: {
          position: 'absolute',
          inset: 0,
          borderRadius: token.borderRadiusSM,
        },
        [`${panelCls}-sat-thumb`]: {
          position: 'absolute',
          width: 14,
          height: 14,
          margin: '-7px 0 0 -7px',
          border: '2px solid #fff',
          borderRadius: '50%',
          boxShadow: '0 0 2px 1px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        },
      },

      // Sliders
      [`${panelCls}-sliders`]: {
        marginTop: token.marginSM,
        display: 'flex',
        flexDirection: 'column',
        gap: token.marginXS,
      },

      // Hue & Alpha sliders
      [`${panelCls}-hue, ${panelCls}-alpha`]: {
        position: 'relative',
        height: token.colorPickerSliderHeight,
        borderRadius: token.borderRadiusXS,
        cursor: 'pointer',
        userSelect: 'none',
      },

      [`${panelCls}-alpha`]: {
        backgroundImage: `conic-gradient(rgba(0, 0, 0, 0.08) 0 25%, transparent 0 50%, rgba(0, 0, 0, 0.08) 0 75%, transparent 0)`,
        backgroundSize: '8px 8px',
      },

      [`${panelCls}-hue-fill, ${panelCls}-alpha-fill`]: {
        position: 'absolute',
        inset: 0,
        borderRadius: token.borderRadiusXS,
      },

      [`${panelCls}-hue-thumb, ${panelCls}-alpha-thumb`]: {
        position: 'absolute',
        top: '50%',
        width: 14,
        height: 14,
        margin: '-7px 0 0 -7px',
        border: '2px solid #fff',
        borderRadius: '50%',
        boxShadow: '0 0 2px 1px rgba(0,0,0,0.4)',
        pointerEvents: 'none',
      },

      // Segmented mode
      [`${panelCls}-mode`]: {
        marginBottom: token.marginSM,
      },

      // Gradient slider
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
          boxShadow: '0 0 2px 1px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          [`&-active`]: {
            boxShadow: `0 0 0 2px ${token.colorPrimary}`,
          },
        },
      },

      // Input section
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
          padding: `0 ${unit(token.paddingXS)}`,
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
          borderRadius: token.borderRadiusXS,
          fontSize: token.fontSizeSM,
          color: token.colorText,
          background: token.colorBgContainer,
          outline: 'none',
          boxSizing: 'border-box',
          transition: `all ${token.motionDurationMid}`,
          '&:focus': {
            borderColor: token.colorPrimary,
            boxShadow: `0 0 0 2px ${token.controlOutline}`,
          },
        },
      },

      // Presets
      [`${panelCls}-presets`]: {
        marginTop: token.marginSM,
        borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        paddingTop: token.paddingXS,

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
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
          cursor: 'pointer',
          boxSizing: 'border-box',
          transition: `all ${token.motionDurationFast}`,
          '&:hover': {
            transform: 'scale(1.15)',
          },
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
      colorPickerWidth: 256,
      colorPickerSliderHeight: 12,
    }),
  ),
);
