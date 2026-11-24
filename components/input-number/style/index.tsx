import { unit } from '../../_util/cssinjs';
import type { InputToken } from '../../input/style';
import {
  genActiveStyle,
  genBasicInputStyle,
  genDisabledStyle,
  genHoverStyle,
  genInputGroupStyle,
  genPlaceholderStyle,
  genStatusStyle,
  initComponentToken as initInputComponentToken,
  initInputToken,
} from '../../input/style';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, resetIcon } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';

export interface ComponentToken {
  controlWidth: number;
  handleWidth: number;
  handleFontSize: number;
  /** Default `auto`. Set `true` will always show the handle */
  handleVisible: 'auto' | true;
  handleBg?: string;
  handleActiveBg?: string;
  handleHoverColor?: string;
  handleBorderColor?: string;
  filledHandleBg?: string;
  paddingBlock?: number;
  paddingBlockSM?: number;
  paddingBlockLG?: number;
  paddingInline?: number;
  paddingInlineSM?: number;
  paddingInlineLG?: number;
  inputFontSize?: number;
  inputFontSizeLG?: number;
  inputFontSizeSM?: number;
}

type InputNumberToken = InputToken<FullToken<'InputNumber'>>;

const genInputNumberStyles: GenerateStyle<InputNumberToken> = (token: InputNumberToken) => {
  const {
    componentCls,
    lineWidth,
    lineType,
    colorBorder,
    borderRadius,
    fontSizeLG,
    controlHeightLG,
    controlHeightSM,
    colorError,
    colorErrorBg,
    colorErrorBgHover,
    colorErrorText,
    colorErrorBorderHover,
    colorWarning,
    colorWarningBg,
    colorWarningBgHover,
    colorWarningText,
    colorWarningBorderHover,
    inputPaddingHorizontalSM,
    inputPaddingHorizontalLG,
    colorTextDescription,
    motionDurationMid,
    motionDurationSlow,
    colorPrimary,
    colorPrimaryHover,
    controlHeight,
    inputPaddingHorizontal,
    inputAffixPadding,
    colorBgContainer,
    colorTextDisabled,
    colorBgContainerDisabled,
    borderRadiusSM,
    borderRadiusLG,
    controlWidth,
    handleVisible,
  } = token;

  const handleBg = token.handleBg ?? colorBgContainer;
  const handleActiveBg = token.handleActiveBg ?? token.colorFillAlter;
  const handleHoverColor = token.handleHoverColor ?? colorPrimary;
  const handleBorderColor = token.handleBorderColor ?? colorBorder;
  const filledHandleBg = token.filledHandleBg ?? token.colorFillSecondary;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),
        ...genBasicInputStyle(token),
        ...genStatusStyle(token, componentCls),

        display: 'inline-block',
        width: controlWidth,
        margin: 0,
        padding: 0,
        fontSize: token.inputFontSize ?? token.fontSize,
        border: `${unit(lineWidth)} ${lineType} ${colorBorder}`,
        borderRadius,

        '&-rtl': {
          direction: 'rtl',

          [`${componentCls}-input`]: {
            direction: 'rtl',
          },
        },

        '&-lg': {
          padding: 0,
          fontSize: token.inputFontSizeLG ?? fontSizeLG,
          borderRadius: borderRadiusLG,

          [`input${componentCls}-input`]: {
            height: token.calc(controlHeightLG).sub(token.calc(lineWidth).mul(2).equal()).equal(),
            padding: `0 ${unit(inputPaddingHorizontalLG)}`,
          },
        },

        '&-sm': {
          padding: 0,
          fontSize: token.inputFontSizeSM ?? token.fontSize,
          borderRadius: borderRadiusSM,

          [`input${componentCls}-input`]: {
            height: token.calc(controlHeightSM).sub(token.calc(lineWidth).mul(2).equal()).equal(),
            padding: `0 ${unit(inputPaddingHorizontalSM)}`,
          },
        },

        '&:hover': {
          ...genHoverStyle(token),
        },

        '&-focused': {
          ...genActiveStyle(token),
        },

        '&-disabled': {
          ...genDisabledStyle(token),
          [`${componentCls}-input`]: {
            cursor: 'not-allowed',
          },
        },

        // ===================== Out Of Range =====================
        '&-out-of-range': {
          input: {
            color: colorError,
          },
        },

        // Style for input-group: input with label, with button or dropdown...
        '&-group': {
          ...resetComponent(token),
          ...genInputGroupStyle(token),

          '&-wrapper': {
            display: 'inline-block',
            textAlign: 'start',
            verticalAlign: 'top', // https://github.com/ant-design/ant-design/issues/6403

            [`${componentCls}-affix-wrapper`]: {
              width: '100%',
            },

            // Size
            '&-lg': {
              [`${componentCls}-group-addon`]: {
                borderRadius: borderRadiusLG,
              },
            },
            '&-sm': {
              [`${componentCls}-group-addon`]: {
                borderRadius: borderRadiusSM,
              },
            },

            '&-filled': {
              [`${componentCls}-group-addon`]: {
                backgroundColor: token.colorFillTertiary,
                borderColor: 'transparent',
              },

              [`&${componentCls}-group-wrapper-disabled ${componentCls}-group-addon`]: {
                backgroundColor: colorBgContainerDisabled,
                borderColor: colorBorder,
                color: colorTextDisabled,
              },

              [`&${componentCls}-group-wrapper-status-error ${componentCls}-group-addon`]: {
                backgroundColor: colorErrorBg,
                color: colorErrorText,
              },

              [`&${componentCls}-group-wrapper-status-warning ${componentCls}-group-addon`]: {
                backgroundColor: colorWarningBg,
                color: colorWarningText,
              },
            },

            '&-underlined': {
              [`${componentCls}-group-addon`]: {
                backgroundColor: 'transparent',
                borderWidth: `${unit(lineWidth)} 0`,
                borderStyle: `${lineType} none`,
                borderColor: `transparent transparent ${colorBorder} transparent`,
                borderRadius: 0,
              },
            },

            '&-status-error': {
              [`${componentCls}-group-addon`]: {
                color: colorError,
                borderColor: colorError,
              },
            },

            '&-status-warning': {
              [`${componentCls}-group-addon`]: {
                color: colorWarning,
                borderColor: colorWarning,
              },
            },
          },
        },

        [componentCls]: {
          '&-input': {
            width: '100%',
            height: token.calc(controlHeight).sub(token.calc(lineWidth).mul(2).equal()).equal(),
            padding: `0 ${unit(inputPaddingHorizontal)}`,
            textAlign: 'start',
            backgroundColor: 'transparent',
            border: 0,
            borderRadius,
            outline: 0,
            transition: `all ${motionDurationMid} linear`,
            appearance: 'textfield',
            color: token.colorText,
            fontSize: 'inherit',
            verticalAlign: 'top',
            ...genPlaceholderStyle(token.colorTextPlaceholder),

            '&[type="number"]::-webkit-inner-spin-button, &[type="number"]::-webkit-outer-spin-button':
              {
                margin: 0,
                /* stylelint-disable-next-line property-no-vendor-prefix */
                webkitAppearance: 'none',
                appearance: 'none',
              },
          },
        },
      },
    },

    // Handler (Input Mode & Spinner Mode)
    {
      [componentCls]: {
        [`&:hover ${componentCls}-handler-wrap, &-focused ${componentCls}-handler-wrap`]: {
          opacity: 1,
        },

        [`${componentCls}-handler-wrap`]: {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineEnd: 0,
          width: token.handleWidth,
          height: '100%',
          background: handleBg,
          borderStartStartRadius: 0,
          borderStartEndRadius: borderRadius,
          borderEndEndRadius: borderRadius,
          borderEndStartRadius: 0,
          opacity: handleVisible === true ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          transition: `opacity ${motionDurationMid} linear ${motionDurationMid}`,

          // Fix input number inside Menu makes icon too large
          // We arise the selector priority by nest selector here
          // https://github.com/ant-design/ant-design/issues/14367
          [`${componentCls}-handler`]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'auto',
            height: '40%',

            [`
              ${componentCls}-handler-up-inner,
              ${componentCls}-handler-down-inner
            `]: {
              marginInlineEnd: 0,
              fontSize: token.handleFontSize,
            },
          },
        },

        [`${componentCls}-handler`]: {
          height: '50%',
          overflow: 'hidden',
          color: colorTextDescription,
          fontWeight: 'bold',
          lineHeight: 0,
          textAlign: 'center',
          cursor: 'pointer',
          borderInlineStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`,
          transition: `all ${motionDurationMid} linear`,

          [`&:active:not(${componentCls}-handler-up-disabled):not(${componentCls}-handler-down-disabled)`]:
            {
              background: handleActiveBg,
            },

          // Hover: only when not disabled
          [`&:hover:not(${componentCls}-handler-up-disabled):not(${componentCls}-handler-down-disabled)`]:
            {
              height: '60%',

              [`
                ${componentCls}-handler-up-inner,
                ${componentCls}-handler-down-inner
              `]: {
                color: handleHoverColor,
              },
            },

          '&-up-inner, &-down-inner': {
            ...resetIcon(),

            color: colorTextDescription,
            transition: `all ${motionDurationMid} linear`,
            userSelect: 'none',
          },
        },

        [`${componentCls}-handler-up`]: {
          borderStartEndRadius: borderRadius,
        },

        [`${componentCls}-handler-down`]: {
          borderBlockStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`,
          borderEndEndRadius: borderRadius,
        },

        // Disabled
        '&-disabled, &-readonly': {
          [`${componentCls}-handler-wrap`]: {
            display: 'none',
          },

          [`${componentCls}-input`]: {
            color: 'inherit',
          },
        },

        [`
          ${componentCls}-handler-up-disabled,
          ${componentCls}-handler-down-disabled
        `]: {
          cursor: 'not-allowed',
          color: colorTextDisabled,

          [`${componentCls}-handler-up-inner, ${componentCls}-handler-down-inner`]: {
            color: colorTextDisabled,
          },

          '&:hover': {
            [`${componentCls}-handler-up-inner, ${componentCls}-handler-down-inner`]: {
              color: colorTextDisabled,
            },
          },
        },

        // ==================== Spinner Mode ====================
        '&-mode-spinner': {
          display: 'inline-flex',
          alignItems: 'stretch',
          padding: 0,
          width: 'auto',

          [`${componentCls}-input-wrap`]: {
            flex: 'auto',
            minWidth: 0,
          },

          [`${componentCls}-input`]: {
            textAlign: 'center',
            paddingInline: inputPaddingHorizontal,
          },

          [`${componentCls}-prefix`]: {
            display: 'flex',
            flex: 'none',
            alignItems: 'center',
            marginInlineStart: inputPaddingHorizontal,
            marginInlineEnd: inputAffixPadding,
            pointerEvents: 'none',
          },

          [`${componentCls}-suffix`]: {
            display: 'flex',
            flex: 'none',
            alignItems: 'center',
            marginInlineStart: inputAffixPadding,
            marginInlineEnd: inputPaddingHorizontal,
            pointerEvents: 'none',

            [`${componentCls}-clear-icon`]: {
              pointerEvents: 'auto',
            },
          },

          [`${componentCls}-action`]: {
            display: 'inline-flex',
            flex: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            paddingInline: inputPaddingHorizontal,
            color: colorTextDescription,
            cursor: 'pointer',
            border: 0,
            transition: `all ${motionDurationMid} linear`,

            [`&:hover:not(${componentCls}-action-up-disabled):not(${componentCls}-action-down-disabled)`]:
              {
                height: 'auto',
                color: handleHoverColor,
                [`${componentCls}-handler-up-inner, ${componentCls}-handler-down-inner`]: {
                  color: handleHoverColor,
                },
              },

            [`&:active:not(${componentCls}-action-up-disabled):not(${componentCls}-action-down-disabled)`]:
              {
                background: handleActiveBg,
              },

            '&-up': {
              borderInlineStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`,
              borderStartEndRadius: borderRadius,
              borderEndEndRadius: borderRadius,
            },

            '&-down': {
              borderInlineEnd: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`,
              borderStartStartRadius: borderRadius,
              borderEndStartRadius: borderRadius,
            },

            [`&${componentCls}-action-up-disabled, &${componentCls}-action-down-disabled`]: {
              cursor: 'not-allowed',
              color: colorTextDisabled,
            },
          },
        },

        // ==================== Clear Icon ====================
        [`${componentCls}-clear-icon`]: {
          margin: 0,
          color: token.colorTextQuaternary,
          fontSize: token.fontSizeIcon,
          verticalAlign: -1,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: `color ${motionDurationSlow}`,
          display: 'inline-flex',
          alignItems: 'center',

          '&:hover': {
            color: token.colorTextTertiary,
          },

          '&:active': {
            color: token.colorText,
          },

          '&-hidden': {
            visibility: 'hidden',
            pointerEvents: 'none',
          },

          '&-has-suffix': {
            marginInlineEnd: inputAffixPadding,
          },
        },
      },
    },

    // Border-less (keep consistent height with Input & Select across sm/middle/lg)
    {
      [`${componentCls}-borderless`]: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',

        [`input${componentCls}-input`]: {
          height: controlHeight,
        },

        [`&${componentCls}-lg input${componentCls}-input`]: {
          height: controlHeightLG,
        },

        [`&${componentCls}-sm input${componentCls}-input`]: {
          height: controlHeightSM,
        },

        [`${componentCls}-handler-down`]: {
          borderBlockStartWidth: 0,
        },

        [`&${componentCls}-status-error ${componentCls}-input`]: {
          color: colorError,
        },

        [`&${componentCls}-status-warning ${componentCls}-input`]: {
          color: colorWarning,
        },
      },
    },

    // =====================================================
    // ==                     Variant                      ==
    // =====================================================
    {
      [`${componentCls}-filled, ${componentCls}-affix-wrapper-filled`]: {
        backgroundColor: token.colorFillTertiary,
        borderColor: 'transparent',

        [`${componentCls}-handler-wrap`]: {
          background: filledHandleBg,
        },

        '&:hover': {
          backgroundColor: token.colorFillSecondary,
          borderColor: 'transparent',
        },

        '&:focus, &:focus-within, &-focused': {
          backgroundColor: colorBgContainer,
          borderColor: colorPrimary,
          boxShadow: 'none',
          outline: 0,

          [`${componentCls}-handler-wrap`]: {
            background: handleBg,
          },
        },

        [`&${componentCls}-disabled, &${componentCls}-affix-wrapper-disabled`]: {
          backgroundColor: colorBgContainerDisabled,
          borderColor: colorBorder,
          color: colorTextDisabled,
        },

        [`&${componentCls}-status-error:not(${componentCls}-disabled), &${componentCls}-affix-wrapper-status-error:not(${componentCls}-affix-wrapper-disabled)`]:
          {
            backgroundColor: colorErrorBg,
            borderColor: 'transparent',
            [`${componentCls}-input`]: {
              color: colorErrorText,
            },
            [`${componentCls}-prefix, ${componentCls}-suffix`]: {
              color: colorError,
            },
            '&:hover': {
              backgroundColor: colorErrorBgHover,
              borderColor: 'transparent',
            },
            '&:focus, &:focus-within, &-focused': {
              backgroundColor: colorBgContainer,
              borderColor: colorError,
              boxShadow: 'none',
            },
          },

        [`&${componentCls}-status-warning:not(${componentCls}-disabled), &${componentCls}-affix-wrapper-status-warning:not(${componentCls}-affix-wrapper-disabled)`]:
          {
            backgroundColor: colorWarningBg,
            borderColor: 'transparent',
            [`${componentCls}-input`]: {
              color: colorWarningText,
            },
            [`${componentCls}-prefix, ${componentCls}-suffix`]: {
              color: colorWarning,
            },
            '&:hover': {
              backgroundColor: colorWarningBgHover,
              borderColor: 'transparent',
            },
            '&:focus, &:focus-within, &-focused': {
              backgroundColor: colorBgContainer,
              borderColor: colorWarning,
              boxShadow: 'none',
            },
          },
      },

      [`${componentCls}-underlined, ${componentCls}-affix-wrapper-underlined`]: {
        backgroundColor: colorBgContainer,
        borderWidth: `${unit(lineWidth)} 0`,
        borderStyle: `${lineType} none`,
        borderColor: `transparent transparent ${colorBorder} transparent`,
        borderRadius: 0,

        '&:hover': {
          borderColor: `transparent transparent ${colorPrimaryHover} transparent`,
        },

        '&:focus, &:focus-within, &-focused': {
          borderColor: `transparent transparent ${colorPrimary} transparent`,
          boxShadow: 'none',
          outline: 0,
        },

        [`&${componentCls}-status-error:not(${componentCls}-disabled), &${componentCls}-affix-wrapper-status-error:not(${componentCls}-affix-wrapper-disabled)`]:
          {
            borderColor: `transparent transparent ${colorError} transparent`,
            '&:hover': {
              borderColor: `transparent transparent ${colorErrorBorderHover} transparent`,
            },
            '&:focus, &:focus-within, &-focused': {
              borderColor: `transparent transparent ${colorError} transparent`,
              boxShadow: 'none',
            },
          },

        [`&${componentCls}-status-warning:not(${componentCls}-disabled), &${componentCls}-affix-wrapper-status-warning:not(${componentCls}-affix-wrapper-disabled)`]:
          {
            borderColor: `transparent transparent ${colorWarning} transparent`,
            '&:hover': {
              borderColor: `transparent transparent ${colorWarningBorderHover} transparent`,
            },
            '&:focus, &:focus-within, &-focused': {
              borderColor: `transparent transparent ${colorWarning} transparent`,
              boxShadow: 'none',
            },
          },
      },
    },
  ];
};

const genAffixWrapperStyles: GenerateStyle<InputNumberToken> = (token: InputNumberToken) => {
  const {
    componentCls,
    inputPaddingHorizontal,
    inputAffixPadding,
    controlWidth,
    borderRadiusLG,
    borderRadiusSM,
    motionDurationMid,
    handleVisible,
  } = token;

  return {
    [`${componentCls}-affix-wrapper`]: {
      ...genBasicInputStyle(token),
      ...genStatusStyle(token, `${componentCls}-affix-wrapper`),
      // or number handler will cover form status
      position: 'relative',
      display: 'inline-flex',
      width: controlWidth,
      padding: 0,
      paddingInlineStart: inputPaddingHorizontal,

      '&-lg': {
        borderRadius: borderRadiusLG,
      },

      '&-sm': {
        borderRadius: borderRadiusSM,
      },

      [`&:not(${componentCls}-affix-wrapper-disabled):hover`]: {
        ...genHoverStyle(token),
        zIndex: 1,
      },

      '&-focused, &:focus': {
        zIndex: 1,
      },

      '&-disabled': {
        [`${componentCls}[disabled]`]: {
          background: 'transparent',
        },
      },

      [`> div${componentCls}`]: {
        position: 'static',
        width: '100%',
        minWidth: 0,
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',

        [`&${componentCls}-focused`]: {
          boxShadow: 'none !important',
        },
      },

      [`input${componentCls}-input`]: {
        padding: 0,
      },

      '&::before': {
        width: 0,
        visibility: 'hidden',
        content: '"\\a0"',
      },

      [`${componentCls}-handler-wrap`]: {
        zIndex: 2,
      },

      [`&:not(${componentCls}-affix-wrapper-disabled):not(${componentCls}-affix-wrapper-readonly):not(${componentCls}-affix-wrapper-without-controls)`]:
        {
          ...(handleVisible === true
            ? {
                [`${componentCls}-suffix`]: {
                  marginInlineEnd: token.calc(token.handleWidth).add(inputAffixPadding).equal(),
                },
              }
            : {
                [`&:hover, &${componentCls}-affix-wrapper-focused`]: {
                  [`${componentCls}-handler-wrap`]: {
                    opacity: 1,
                  },
                  [`${componentCls}-suffix`]: {
                    marginInlineEnd: token.calc(token.handleWidth).add(inputAffixPadding).equal(),
                  },
                },
              }),
        },

      [componentCls]: {
        '&-prefix, &-suffix': {
          display: 'flex',
          flex: 'none',
          alignItems: 'center',
          pointerEvents: 'none',
        },

        '&-prefix': {
          marginInlineEnd: inputAffixPadding,
        },

        '&-suffix': {
          zIndex: 1,
          marginInlineEnd: inputPaddingHorizontal,
          marginInlineStart: inputAffixPadding,
          transition: `margin ${motionDurationMid}`,

          [`${componentCls}-clear-icon`]: {
            pointerEvents: 'auto',
          },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'InputNumber',
  token => {
    const baseToken = initInputToken<FullToken<'InputNumber'>>(token);
    const inputNumberToken = mergeToken<InputNumberToken>(baseToken, {
      inputPaddingVertical: token.paddingBlock ?? baseToken.inputPaddingVertical,
      inputPaddingVerticalLG: token.paddingBlockLG ?? baseToken.inputPaddingVerticalLG,
      inputPaddingVerticalSM: token.paddingBlockSM ?? baseToken.inputPaddingVerticalSM,
      inputPaddingHorizontal: token.paddingInline ?? baseToken.inputPaddingHorizontal,
      inputPaddingHorizontalLG: token.paddingInlineLG ?? baseToken.inputPaddingHorizontalLG,
      inputPaddingHorizontalSM: token.paddingInlineSM ?? baseToken.inputPaddingHorizontalSM,
      inputFontSize: token.inputFontSize ?? token.fontSize,
      inputFontSizeLG: token.inputFontSizeLG ?? token.fontSizeLG,
      inputFontSizeSM: token.inputFontSizeSM ?? token.fontSize,
    });
    return [
      genInputNumberStyles(inputNumberToken),
      genAffixWrapperStyles(inputNumberToken),
      // =====================================================
      // ==             Space Compact                       ==
      // =====================================================
      genCompactItemStyle(inputNumberToken),
    ];
  },
  token => {
    const shared = initInputComponentToken(token);
    return {
      ...shared,
      controlWidth: 90,
      handleWidth:
        ((token as any)._realToken?.controlHeightSM ?? Number(token.controlHeightSM)) -
        ((token as any)._realToken?.lineWidth ?? Number(token.lineWidth)) * 2,
      handleFontSize: token.fontSize / 2,
      handleVisible: 'auto',
      handleBg: token.colorBgContainer,
      handleActiveBg: token.colorFillAlter,
      handleHoverColor: token.colorPrimary,
      handleBorderColor: token.colorBorder,
      filledHandleBg: token.colorFillSecondary,
    };
  },
);
