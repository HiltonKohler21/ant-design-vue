import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { CSSProperties } from 'vue';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

// Direction naming standard:
// Horizontal base:
// -0-------------
// vertical: part   (水平时，垂直方向命名为 part)
// horizontal: full (水平时，水平方向命名为 full)

export interface ComponentToken {
  controlSize: number;
  railSize: number;
  handleSize: number;
  handleSizeHover: number;
  handleLineWidth: number;
  handleLineWidthHover: number;
  dotSize: number;
}

interface SliderToken extends FullToken<'Slider'> {
  marginFull: number | string;
  marginPart: number | string;
  marginPartWithMark: number | string;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls, controlSize, dotSize, marginFull, marginPart, colorFillContentHover } =
    token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'relative',
      height: controlSize,
      margin: `${unit(marginPart)} ${unit(marginFull)}`,
      padding: 0,
      cursor: 'pointer',
      touchAction: 'none',

      [`&-vertical`]: {
        margin: `${unit(marginFull)} ${unit(marginPart)}`,
      },

      [`${componentCls}-rail`]: {
        position: 'absolute',
        backgroundColor: token.colorFillTertiary,
        borderRadius: token.borderRadiusXS,
        transition: `background-color ${token.motionDurationMid}`,
      },

      [`${componentCls}-track`]: {
        position: 'absolute',
        backgroundColor: token.colorPrimaryBorder,
        borderRadius: token.borderRadiusXS,
        transition: `background-color ${token.motionDurationMid}`,
      },

      '&:hover': {
        [`${componentCls}-rail`]: {
          backgroundColor: token.colorFillSecondary,
        },

        [`${componentCls}-track`]: {
          backgroundColor: token.colorPrimaryBorderHover,
        },

        [`${componentCls}-dot`]: {
          borderColor: colorFillContentHover,
        },

        [`${componentCls}-handle::after`]: {
          boxShadow: `0 0 0 ${unit(token.handleLineWidth)} ${token.colorPrimaryBorderHover}`,
        },

        [`${componentCls}-dot-active`]: {
          borderColor: token.colorPrimary,
        },
      },

      [`${componentCls}-handle`]: {
        position: 'absolute',
        width: token.handleSize,
        height: token.handleSize,
        outline: 'none',

        [`${componentCls}-dragging`]: {
          zIndex: 1,
        },

        // 扩大选区
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInlineStart: token.calc(token.handleLineWidth).mul(-1).equal(),
          insetBlockStart: token.calc(token.handleLineWidth).mul(-1).equal(),
          width: token.calc(token.handleSize).add(token.calc(token.handleLineWidth).mul(2)).equal(),
          height: token
            .calc(token.handleSize)
            .add(token.calc(token.handleLineWidth).mul(2))
            .equal(),
          backgroundColor: 'transparent',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: token.handleSize,
          height: token.handleSize,
          backgroundColor: token.colorBgElevated,
          boxShadow: `0 0 0 ${unit(token.handleLineWidth)} ${token.colorPrimaryBorder}`,
          borderRadius: '50%',
          cursor: 'pointer',
          transition: `
            inset-inline-start ${token.motionDurationMid},
            inset-block-start ${token.motionDurationMid},
            width ${token.motionDurationMid},
            height ${token.motionDurationMid},
            box-shadow ${token.motionDurationMid}
          `,
        },

        '&:hover, &:active, &:focus': {
          '&::before': {
            insetInlineStart: token
              .calc(token.handleSizeHover)
              .sub(token.handleSize)
              .div(2)
              .add(token.handleLineWidthHover)
              .mul(-1)
              .equal(),
            insetBlockStart: token
              .calc(token.handleSizeHover)
              .sub(token.handleSize)
              .div(2)
              .add(token.handleLineWidthHover)
              .mul(-1)
              .equal(),
            width: token
              .calc(token.handleSizeHover)
              .add(token.calc(token.handleLineWidthHover).mul(2))
              .equal(),
            height: token
              .calc(token.handleSizeHover)
              .add(token.calc(token.handleLineWidthHover).mul(2))
              .equal(),
          },

          '&::after': {
            boxShadow: `0 0 0 ${unit(token.handleLineWidthHover)} ${token.colorPrimary}`,
            width: token.handleSizeHover,
            height: token.handleSizeHover,
            insetInlineStart: token
              .calc(token.handleSize)
              .sub(token.handleSizeHover)
              .div(2)
              .equal(),
            insetBlockStart: token.calc(token.handleSize).sub(token.handleSizeHover).div(2).equal(),
          },
        },
      },

      [`${componentCls}-mark`]: {
        position: 'absolute',
        fontSize: token.fontSize,
      },

      [`${componentCls}-mark-text`]: {
        position: 'absolute',
        display: 'inline-block',
        color: token.colorTextDescription,
        textAlign: 'center',
        wordBreak: 'keep-all',
        cursor: 'pointer',
        userSelect: 'none',

        '&-active': {
          color: token.colorText,
        },
      },

      [`${componentCls}-step`]: {
        position: 'absolute',
        background: 'transparent',
        pointerEvents: 'none',
      },

      [`${componentCls}-dot`]: {
        position: 'absolute',
        width: dotSize,
        height: dotSize,
        backgroundColor: token.colorBgElevated,
        border: `${unit(token.handleLineWidth)} solid ${token.colorBorderSecondary}`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: `border-color ${token.motionDurationSlow}`,
        pointerEvents: 'auto',

        '&-active': {
          borderColor: token.colorPrimaryBorder,
        },
      },

      [`&${componentCls}-disabled`]: {
        cursor: 'not-allowed',

        [`${componentCls}-rail`]: {
          backgroundColor: `${token.colorFillSecondary} !important`,
        },

        [`${componentCls}-track`]: {
          backgroundColor: `${token.colorTextDisabled} !important`,
        },

        [`
          ${componentCls}-dot
        `]: {
          backgroundColor: token.colorBgElevated,
          borderColor: token.colorTextDisabled,
          boxShadow: 'none',
          cursor: 'not-allowed',
        },

        [`${componentCls}-handle::after`]: {
          backgroundColor: token.colorBgElevated,
          cursor: 'not-allowed',
          width: token.handleSize,
          height: token.handleSize,
          boxShadow: `0 0 0 ${unit(token.handleLineWidth)} ${new TinyColor(
            (token as any)._realToken?.colorTextDisabled ?? token.colorTextDisabled,
          )
            .onBackground((token as any)._realToken?.colorBgContainer ?? token.colorBgContainer)
            .toHexString()}`,
          insetInlineStart: 0,
          insetBlockStart: 0,
        },

        [`
          ${componentCls}-mark-text,
          ${componentCls}-dot
        `]: {
          cursor: `not-allowed !important`,
        },
      },
    },
  };
};

// ============================ Horizontal ============================
const genDirectionStyle = (token: SliderToken, horizontal: boolean): CSSObject => {
  const { componentCls, railSize, handleSize, dotSize, marginFull } = token;

  const railPadding: keyof CSSProperties = horizontal ? 'paddingBlock' : 'paddingInline';
  const full: keyof CSSProperties = horizontal ? 'width' : 'height';
  const part: keyof CSSProperties = horizontal ? 'height' : 'width';
  const handlePos: keyof CSSProperties = horizontal ? 'insetBlockStart' : 'insetInlineStart';
  const markInset: keyof CSSProperties = horizontal ? 'top' : 'insetInlineStart';

  return {
    [railPadding]: railSize,
    [part]: token.calc(railSize).mul(3).equal(),

    [`${componentCls}-rail`]: {
      [full]: '100%',
      [part]: railSize,
    },

    [`${componentCls}-track`]: {
      [part]: railSize,
    },

    [`${componentCls}-handle`]: {
      [handlePos]: token.calc(railSize).mul(3).sub(handleSize).div(2).equal(),
    },

    [`${componentCls}-mark`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      // https://github.com/ant-design/ant-design/issues/43731
      [markInset]: token
        .calc(railSize)
        .mul(3)
        .add(horizontal ? 0 : marginFull)
        .equal(),
      [full]: '100%',
    },

    [`${componentCls}-step`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      [markInset]: railSize,
      [full]: '100%',
      [part]: railSize,
    },

    [`${componentCls}-dot`]: {
      position: 'absolute',
      [handlePos]: token.calc(railSize).sub(dotSize).div(2).equal(),
    },
  };
};
// ============================ Horizontal ============================
const genHorizontalStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls, marginPartWithMark } = token;

  return {
    [`${componentCls}-horizontal`]: {
      ...genDirectionStyle(token, true),

      [`&${componentCls}-with-marks`]: {
        marginBottom: marginPartWithMark,
      },
    },
  };
};

// ============================= Vertical =============================
const genVerticalStyle: GenerateStyle<SliderToken> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-vertical`]: {
      ...genDirectionStyle(token, false),
      height: '100%',
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Slider',
  token => {
    const sliderToken = mergeToken<SliderToken>(token, {
      marginPart: token.calc(token.controlHeight).sub(token.controlSize).div(2).equal(),
      marginFull: token.calc(token.controlSize).div(2).equal(),
      marginPartWithMark: token.calc(token.controlHeightLG).sub(token.controlSize).equal(),
    });
    return [
      genBaseStyle(sliderToken),
      genHorizontalStyle(sliderToken),
      genVerticalStyle(sliderToken),
    ];
  },
  token => {
    // Handle line width is always width-er 1px
    const increaseHandleWidth = 1;
    const controlSize = token.controlHeightLG / 4;
    const controlSizeHover = token.controlHeightSM / 2;
    const handleLineWidth = token.lineWidth + increaseHandleWidth;
    const handleLineWidthHover = token.lineWidth + increaseHandleWidth * 3;
    return {
      controlSize,
      railSize: 4,
      handleSize: controlSize,
      handleSizeHover: controlSizeHover,
      dotSize: 8,
      handleLineWidth,
      handleLineWidthHover,
    };
  },
);
