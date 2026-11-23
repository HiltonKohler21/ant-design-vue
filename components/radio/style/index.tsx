import type { CSSObject } from '../../_util/cssinjs';
import { unit, Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { GlobalToken } from '../../theme/interface';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genFocusOutline, resetComponent } from '../../style';

// ============================== Tokens ==============================
export interface ComponentToken {
  // Radio
  /**
   * @desc 单选框大小
   * @descEN Radio size
   */
  radioSize: number;
  /**
   * @desc 单选框圆点大小
   * @descEN Size of Radio dot
   */
  dotSize: number;
  /**
   * @desc 单选框圆点禁用颜色
   * @descEN Color of disabled Radio dot
   */
  dotColorDisabled: string;

  // Radio buttons
  /**
   * @desc 单选框按钮背景色
   * @descEN Background color of Radio button
   */
  buttonBg: string;
  /**
   * @desc 单选框按钮选中背景色
   * @descEN Background color of checked Radio button
   */
  buttonCheckedBg: string;
  /**
   * @desc 单选框按钮文本颜色
   * @descEN Color of Radio button text
   */
  buttonColor: string;
  /**
   * @desc 单选框按钮横向内间距
   * @descEN Horizontal padding of Radio button
   */
  buttonPaddingInline: number;
  /**
   * @desc 单选框按钮选中并禁用时的背景色
   * @descEN Background color of checked and disabled Radio button
   */
  buttonCheckedBgDisabled: string;
  /**
   * @desc 单选框按钮选中并禁用时的文本颜色
   * @descEN Color of checked and disabled Radio button text
   */
  buttonCheckedColorDisabled: string;
  /**
   * @desc 单选框实色按钮选中时的文本颜色
   * @descEN Color of checked solid Radio button text
   */
  buttonSolidCheckedColor: string;
  /**
   * @desc 单选框实色按钮选中时的背景色
   * @descEN Background color of checked solid Radio button background
   */
  buttonSolidCheckedBg: string;
  /**
   * @desc 单选框实色按钮选中时的悬浮态背景色
   * @descEN Background color of checked solid Radio button when hover
   */
  buttonSolidCheckedHoverBg: string;
  /**
   * @desc 单选框实色按钮选中时的激活态背景色
   * @descEN Background color of checked solid Radio button when active
   */
  buttonSolidCheckedActiveBg: string;
  /**
   * @desc 单选框右间距
   * @descEN Margin right of Radio wrapper
   */
  wrapperMarginInlineEnd: number;
}

interface RadioToken extends FullToken<'Radio'> {
  radioFocusShadow: string;
  radioButtonFocusShadow: string;
}

// ============================== Styles ==============================
const antRadioEffect = new Keyframes('antRadioEffect', {
  '0%': { transform: 'scale(1)', opacity: 0.5 },
  '100%': { transform: 'scale(1.6)', opacity: 0 },
});

// styles from RadioGroup only
const getGroupRadioStyle: GenerateStyle<RadioToken> = token => {
  const { componentCls, antCls, lineWidth, borderRadius, borderRadiusLG, borderRadiusSM, calc } =
    token;
  const groupPrefixCls = `${componentCls}-group`;
  const buttonWrapperCls = `${componentCls}-button-wrapper`;
  const badgeCls = `${antCls}-badge`;

  const genVerticalBadgeButtonStyle = (radius: number): CSSObject => ({
    [`> ${badgeCls}`]: {
      width: 'auto',
    },

    [`> ${badgeCls} > ${buttonWrapperCls}`]: {
      width: '100%',
    },

    [`> ${badgeCls}:not(:last-child)`]: {
      marginBlockEnd: calc(lineWidth).mul(-1).equal(),
    },

    [`> ${badgeCls} > ${buttonWrapperCls}:not(:last-child)`]: {
      marginBlockEnd: 0,
    },

    [`> ${badgeCls}:first-child > ${buttonWrapperCls}`]: {
      borderStartStartRadius: radius,
      borderStartEndRadius: radius,
      borderEndStartRadius: 0,
      borderEndEndRadius: 0,
    },

    [`> ${badgeCls}:last-child > ${buttonWrapperCls}`]: {
      borderStartStartRadius: 0,
      borderStartEndRadius: 0,
      borderEndStartRadius: radius,
      borderEndEndRadius: radius,
    },

    [`> ${badgeCls}:not(:first-child):not(:last-child) > ${buttonWrapperCls}`]: {
      borderRadius: 0,
    },

    [`> ${badgeCls}:first-child:last-child > ${buttonWrapperCls}`]: {
      borderRadius: radius,
    },
  });

  return {
    [groupPrefixCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      fontSize: 0,

      // RTL
      [`&${groupPrefixCls}-rtl`]: {
        direction: 'rtl',
      },

      [`&${groupPrefixCls}-block`]: {
        display: 'flex',
      },

      [`${antCls}-badge ${antCls}-badge-count`]: {
        zIndex: 1,
      },

      [`> ${antCls}-badge:not(:first-child) > ${antCls}-button-wrapper`]: {
        borderInlineStart: 'none',
      },

      '&-vertical': {
        display: 'flex',
        flexDirection: 'column',
        rowGap: token.marginXS,

        [`&:has(> ${buttonWrapperCls}, > ${badgeCls} > ${buttonWrapperCls})`]: {
          rowGap: 0,
        },

        [`${componentCls}-wrapper`]: {
          marginInlineEnd: 0,
        },

        ...genVerticalBadgeButtonStyle(borderRadius),

        [`&${groupPrefixCls}-large`]: {
          ...genVerticalBadgeButtonStyle(borderRadiusLG),
        },

        [`&${groupPrefixCls}-small`]: {
          ...genVerticalBadgeButtonStyle(borderRadiusSM),
        },
      },
    },
  };
};

// Styles from radio-wrapper
const getRadioBasicStyle: GenerateStyle<RadioToken> = token => {
  // 比例计算需要真实数值（cssVar 模式下 token 值是 var() 字符串）
  const rawNum: any = (token as any)._realToken ?? token;
  const dotPadding = 4; // Fixed value（与导出处保持一致）
  const rawRadioSize = rawNum.radioSize;
  const rawDotSize = rawNum.dotSize;
  const disabledDot = rawRadioSize - dotPadding * 2;
  const radioRatio = rawDotSize / rawRadioSize;
  const radioDisabledRatio = disabledDot / rawRadioSize;

  const {
    componentCls,
    wrapperMarginInlineEnd,
    colorPrimary,
    radioSize,
    motionDurationSlow,
    motionDurationMid,
    motionEaseInOut,
    motionEaseInOutCirc,
    colorBgContainer,
    colorBorder,
    lineWidth,
    colorBgContainerDisabled,
    colorTextDisabled,
    paddingXS,
    dotColorDisabled,
    lineType,
    wireframe,
    colorWhite,
  } = token;
  const radioInnerPrefixCls = `${componentCls}-inner`;

  return {
    [`${componentCls}-wrapper`]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      marginInlineStart: 0,
      marginInlineEnd: wrapperMarginInlineEnd,
      cursor: 'pointer',

      '&:last-child': {
        marginInlineEnd: 0,
      },

      // RTL
      [`&${componentCls}-wrapper-rtl`]: {
        direction: 'rtl',
      },

      '&-disabled': {
        cursor: 'not-allowed',
        color: token.colorTextDisabled,
      },

      '&::after': {
        display: 'inline-block',
        width: 0,
        overflow: 'hidden',
        content: '"\\a0"',
      },

      '&-block': {
        flex: 1,
        justifyContent: 'center',
      },

      // hashId 在 wrapper 上，只能铺平
      [`${componentCls}-checked::after`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: '100%',
        height: '100%',
        border: `${unit(lineWidth)} ${lineType} ${colorPrimary}`,
        borderRadius: '50%',
        visibility: 'hidden',
        animationName: antRadioEffect,
        animationDuration: motionDurationSlow,
        animationTimingFunction: motionEaseInOut,
        animationFillMode: 'both',
        content: '""',
      },

      [componentCls]: {
        ...resetComponent(token),
        position: 'relative',
        display: 'inline-block',
        outline: 'none',
        cursor: 'pointer',
        alignSelf: 'center',
      },

      [`${componentCls}-wrapper:hover &,
        &:hover ${radioInnerPrefixCls}`]: {
        borderColor: colorPrimary,
      },

      [`${componentCls}-input:focus-visible + ${radioInnerPrefixCls}`]: {
        ...genFocusOutline(token),
      },

      [`${componentCls}:hover::after, ${componentCls}-wrapper:hover &::after`]: {
        visibility: 'visible',
      },

      [`${componentCls}-inner`]: {
        '&::after': {
          boxSizing: 'border-box',
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          display: 'block',
          width: radioSize,
          height: radioSize,
          marginBlockStart: token.calc(radioSize).div(-2).equal(),
          marginInlineStart: token.calc(radioSize).div(-2).equal(),
          backgroundColor: wireframe ? colorPrimary : colorWhite,
          borderBlockStart: 0,
          borderInlineStart: 0,
          borderRadius: radioSize,
          transform: 'scale(0)',
          opacity: 0,
          transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          content: '""',
        },

        boxSizing: 'border-box',
        position: 'relative',
        insetBlockStart: 0,
        insetInlineStart: 0,
        display: 'block',
        width: radioSize,
        height: radioSize,
        backgroundColor: colorBgContainer,
        borderColor: colorBorder,
        borderStyle: 'solid',
        borderWidth: lineWidth,
        borderRadius: '50%',
        transition: `all ${motionDurationMid}`,
      },

      [`${componentCls}-input`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetBlockEnd: 0,
        insetInlineStart: 0,
        zIndex: 1,
        cursor: 'pointer',
        opacity: 0,
      },

      // 选中状态
      [`${componentCls}-checked`]: {
        [radioInnerPrefixCls]: {
          borderColor: colorPrimary,
          backgroundColor: wireframe ? colorBgContainer : colorPrimary,

          '&::after': {
            transform: `scale(${radioRatio})`,
            opacity: 1,
            transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          },
        },
      },

      [`${componentCls}-disabled`]: {
        cursor: 'not-allowed',

        [radioInnerPrefixCls]: {
          backgroundColor: colorBgContainerDisabled,
          borderColor: colorBorder,
          cursor: 'not-allowed',

          '&::after': {
            backgroundColor: dotColorDisabled,
          },
        },

        [`${componentCls}-input`]: {
          cursor: 'not-allowed',
        },

        [`${componentCls}-disabled + span`]: {
          color: colorTextDisabled,
          cursor: 'not-allowed',
        },

        [`&${componentCls}-checked`]: {
          [radioInnerPrefixCls]: {
            '&::after': {
              transform: `scale(${radioDisabledRatio})`,
            },
          },
        },
      },

      [`span${componentCls} + *`]: {
        paddingInlineStart: paddingXS,
        paddingInlineEnd: paddingXS,
      },
    },
  };
};

// Styles from radio-button
const getRadioButtonStyle: GenerateStyle<RadioToken> = token => {
  const {
    buttonColor,
    controlHeight,
    componentCls,
    lineWidth,
    lineType,
    colorBorder,
    motionDurationSlow,
    motionDurationMid,
    buttonPaddingInline,
    fontSize,
    buttonBg,
    fontSizeLG,
    controlHeightLG,
    controlHeightSM,
    paddingXS,
    borderRadius,
    borderRadiusSM,
    borderRadiusLG,
    colorPrimary,
    buttonCheckedBg,
    colorPrimaryHover,
    colorPrimaryActive,
    buttonSolidCheckedColor,
    buttonSolidCheckedBg,
    buttonSolidCheckedHoverBg,
    buttonSolidCheckedActiveBg,
    colorTextDisabled,
    colorBgContainerDisabled,
    buttonCheckedColorDisabled,
    buttonCheckedBgDisabled,
  } = token;
  return {
    [`${componentCls}-button-wrapper`]: {
      position: 'relative',
      display: 'inline-block',
      height: controlHeight,
      margin: 0,
      paddingInline: buttonPaddingInline,
      paddingBlock: 0,
      color: buttonColor,
      fontSize,
      lineHeight: token.calc(controlHeight).sub(token.calc(lineWidth).mul(2).equal()).equal(),
      background: buttonBg,
      border: `${unit(lineWidth)} ${lineType} ${colorBorder}`,
      // strange align fix for chrome but works
      // https://gw.alipayobjects.com/zos/rmsportal/VFTfKXJuogBAXcvfAUWJ.gif
      borderBlockStartWidth: token.calc(lineWidth).add(0.02).equal(),
      borderInlineStartWidth: 0,
      borderInlineEndWidth: lineWidth,
      cursor: 'pointer',
      transition: [
        `color ${motionDurationMid}`,
        `background ${motionDurationMid}`,
        `border-color ${motionDurationMid}`,
        `box-shadow ${motionDurationMid}`,
      ].join(','),

      a: {
        color: buttonColor,
      },

      [`> ${componentCls}-button`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      },

      '&:not(:first-child)': {
        '&::before': {
          position: 'absolute',
          insetBlockStart: token.calc(lineWidth).mul(-1).equal(),
          insetInlineStart: token.calc(lineWidth).mul(-1).equal(),
          display: 'block',
          boxSizing: 'content-box',
          width: 1,
          height: '100%',
          paddingBlock: lineWidth,
          paddingInline: 0,
          backgroundColor: colorBorder,
          transition: `background-color ${motionDurationSlow}`,
          content: '""',
        },
      },

      '&:first-child': {
        borderInlineStart: `${unit(lineWidth)} ${lineType} ${colorBorder}`,
        borderStartStartRadius: borderRadius,
        borderEndStartRadius: borderRadius,
      },

      '&:last-child': {
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius,
      },

      '&:first-child:last-child': {
        borderRadius,
      },

      [`${componentCls}-group-large &`]: {
        height: controlHeightLG,
        fontSize: fontSizeLG,
        lineHeight: token.calc(controlHeightLG).sub(token.calc(lineWidth).mul(2).equal()).equal(),

        '&:first-child': {
          borderStartStartRadius: borderRadiusLG,
          borderEndStartRadius: borderRadiusLG,
        },

        '&:last-child': {
          borderStartEndRadius: borderRadiusLG,
          borderEndEndRadius: borderRadiusLG,
        },
      },

      [`${componentCls}-group-small &`]: {
        height: controlHeightSM,
        paddingInline: token.calc(paddingXS).sub(lineWidth).equal(),
        paddingBlock: 0,
        lineHeight: token.calc(controlHeightSM).sub(token.calc(lineWidth).mul(2).equal()).equal(),

        '&:first-child': {
          borderStartStartRadius: borderRadiusSM,
          borderEndStartRadius: borderRadiusSM,
        },

        '&:last-child': {
          borderStartEndRadius: borderRadiusSM,
          borderEndEndRadius: borderRadiusSM,
        },
      },

      [`${componentCls}-group-vertical > &`]: {
        marginInlineEnd: 0,
        borderInlineStartWidth: lineWidth,
        borderRadius: 0,

        '&::before': {
          display: 'none',
        },

        '&:not(:last-child)': {
          marginBlockEnd: token.calc(lineWidth).mul(-1).equal(),
        },

        '&:first-child': {
          borderStartStartRadius: borderRadius,
          borderStartEndRadius: borderRadius,
          borderEndStartRadius: 0,
          borderEndEndRadius: 0,
        },

        '&:last-child': {
          borderStartStartRadius: 0,
          borderStartEndRadius: 0,
          borderEndStartRadius: borderRadius,
          borderEndEndRadius: borderRadius,
        },

        '&:first-child:last-child': {
          borderRadius,
        },
      },

      [`${componentCls}-group-vertical${componentCls}-group-large > &`]: {
        '&:first-child': {
          borderStartStartRadius: borderRadiusLG,
          borderStartEndRadius: borderRadiusLG,
        },

        '&:last-child': {
          borderEndStartRadius: borderRadiusLG,
          borderEndEndRadius: borderRadiusLG,
        },

        '&:first-child:last-child': {
          borderRadius: borderRadiusLG,
        },
      },

      [`${componentCls}-group-vertical${componentCls}-group-small > &`]: {
        '&:first-child': {
          borderStartStartRadius: borderRadiusSM,
          borderStartEndRadius: borderRadiusSM,
        },

        '&:last-child': {
          borderEndStartRadius: borderRadiusSM,
          borderEndEndRadius: borderRadiusSM,
        },

        '&:first-child:last-child': {
          borderRadius: borderRadiusSM,
        },
      },

      '&:hover': {
        position: 'relative',
        color: colorPrimary,
      },

      '&:has(:focus-visible)': {
        ...genFocusOutline(token),
      },

      [`${componentCls}-inner, input[type='checkbox'], input[type='radio']`]: {
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      },

      [`&-checked:not(${componentCls}-button-wrapper-disabled)`]: {
        zIndex: 1,
        color: colorPrimary,
        background: buttonCheckedBg,
        borderColor: colorPrimary,

        '&::before': {
          backgroundColor: colorPrimary,
        },

        '&:first-child': {
          borderColor: colorPrimary,
        },

        '&:hover': {
          color: colorPrimaryHover,
          borderColor: colorPrimaryHover,

          '&::before': {
            backgroundColor: colorPrimaryHover,
          },
        },

        '&:active': {
          color: colorPrimaryActive,
          borderColor: colorPrimaryActive,

          '&::before': {
            backgroundColor: colorPrimaryActive,
          },
        },
      },

      [`${componentCls}-group-solid &-checked:not(${componentCls}-button-wrapper-disabled)`]: {
        color: buttonSolidCheckedColor,
        background: buttonSolidCheckedBg,
        borderColor: buttonSolidCheckedBg,

        '&:hover': {
          color: buttonSolidCheckedColor,
          background: buttonSolidCheckedHoverBg,
          borderColor: buttonSolidCheckedHoverBg,
        },

        '&:active': {
          color: buttonSolidCheckedColor,
          background: buttonSolidCheckedActiveBg,
          borderColor: buttonSolidCheckedActiveBg,
        },
      },

      '&-disabled': {
        color: colorTextDisabled,
        backgroundColor: colorBgContainerDisabled,
        borderColor: colorBorder,
        cursor: 'not-allowed',

        '&:first-child, &:hover': {
          color: colorTextDisabled,
          backgroundColor: colorBgContainerDisabled,
          borderColor: colorBorder,
        },
      },

      [`&-disabled${componentCls}-button-wrapper-checked`]: {
        color: buttonCheckedColorDisabled,
        backgroundColor: buttonCheckedBgDisabled,
        borderColor: colorBorder,
        boxShadow: 'none',
      },

      '&-block': {
        flex: 1,
        textAlign: 'center',
      },
    },
  };
};

// ============================== Export ==============================
export const prepareComponentToken = (token: GlobalToken): ComponentToken => {
  const {
    wireframe,
    padding,
    marginXS,
    lineWidth,
    fontSizeLG,
    colorText,
    colorBgContainer,
    colorTextDisabled,
    controlItemBgActiveDisabled,
    colorTextLightSolid,
    colorPrimary,
    colorPrimaryHover,
    colorPrimaryActive,
  } = token;

  const dotPadding = 4; // Fixed value
  const radioSize = fontSizeLG;
  const radioDotSize = wireframe
    ? radioSize - dotPadding * 2
    : radioSize - (dotPadding + lineWidth) * 2;

  return {
    // Radio
    radioSize,
    dotSize: radioDotSize,
    dotColorDisabled: colorTextDisabled,

    // Radio buttons
    buttonSolidCheckedColor: colorTextLightSolid,
    buttonSolidCheckedBg: colorPrimary,
    buttonSolidCheckedHoverBg: colorPrimaryHover,
    buttonSolidCheckedActiveBg: colorPrimaryActive,
    buttonBg: colorBgContainer,
    buttonCheckedBg: colorBgContainer,
    buttonColor: colorText,
    buttonCheckedBgDisabled: controlItemBgActiveDisabled,
    buttonCheckedColorDisabled: colorTextDisabled,
    buttonPaddingInline: padding - lineWidth,
    wrapperMarginInlineEnd: marginXS,
  };
};

export default genComponentStyleHook(
  'Radio',
  token => {
    const { controlOutline, controlOutlineWidth } = token;

    // Radio
    const radioFocusShadow = `0 0 0 ${unit(controlOutlineWidth)} ${controlOutline}`;
    const radioButtonFocusShadow = radioFocusShadow;

    const radioToken = mergeToken<RadioToken>(token, {
      radioFocusShadow,
      radioButtonFocusShadow,
    });

    return [
      getGroupRadioStyle(radioToken),
      getRadioBasicStyle(radioToken),
      getRadioButtonStyle(radioToken),
    ];
  },
  prepareComponentToken,
);
