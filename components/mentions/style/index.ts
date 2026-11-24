import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { InputToken } from '../../input/style';
import {
  genActiveStyle,
  genBasicInputStyle,
  genDisabledStyle,
  genPlaceholderStyle,
  genStatusStyle,
  initInputToken,
} from '../../input/style';
import {
  genBorderlessStyle,
  genFilledStyle,
  genOutlinedStyle,
  genUnderlinedStyle,
} from '../../input/style/variants';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';

export interface ComponentToken {
  zIndexPopup: number;
  dropdownHeight: number;
  controlItemWidth: number;
}

type MentionsToken = InputToken<FullToken<'Mentions'>>;

const genMentionsStyle: GenerateStyle<MentionsToken> = token => {
  const {
    componentCls,
    antCls,
    colorTextDisabled,
    controlItemBgHover,
    controlPaddingHorizontal,
    colorText,
    motionDurationSlow,
    lineHeight,
    lineHeightLG,
    controlHeight,
    controlHeightLG,
    controlHeightSM,
    inputPaddingHorizontal,
    inputPaddingHorizontalLG,
    inputPaddingHorizontalSM,
    inputPaddingVertical,
    inputPaddingVerticalLG,
    inputPaddingVerticalSM,
    fontSize,
    fontSizeLG,
    borderRadiusLG,
    borderRadiusSM,
    colorBgElevated,
    boxShadowSecondary,
  } = token;

  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawMentionsToken: any = (token as any)._realToken ?? token;
  const itemPaddingVertical = Math.round(
    (rawMentionsToken.controlHeight - rawMentionsToken.fontSize * rawMentionsToken.lineHeight) / 2,
  );

  return {
    [componentCls]: {
      ...resetComponent(token),
      ...genBasicInputStyle(token),

      position: 'relative',
      display: 'inline-flex',
      height: 'auto',
      padding: 0,
      overflow: 'hidden',
      lineHeight,
      whiteSpace: 'pre-wrap',
      verticalAlign: 'bottom',

      ...genStatusStyle(token, componentCls),

      '&-disabled': {
        '> textarea': {
          ...genDisabledStyle(token),
        },
      },

      '&-focused': {
        ...genActiveStyle(token),
      },

      // ================= Size =================
      '&-lg': {
        padding: 0,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG,
        borderRadius: borderRadiusLG,

        [`> textarea, ${componentCls}-measure`]: {
          minHeight: token.calc(controlHeightLG).sub(2).equal(),
          padding: `${unit(inputPaddingVerticalLG)} ${unit(inputPaddingHorizontalLG)}`,
        },
      },

      '&-sm': {
        padding: 0,
        fontSize,
        borderRadius: borderRadiusSM,

        [`> textarea, ${componentCls}-measure`]: {
          minHeight: token.calc(controlHeightSM).sub(2).equal(),
          padding: `${unit(inputPaddingVerticalSM)} ${unit(inputPaddingHorizontalSM)}`,
        },
      },

      // ================= Suffix & AllowClear =================
      [`${componentCls}-suffix`]: {
        display: 'inline-flex',
        alignItems: 'center',
        flex: 'none',
        color: token.colorTextQuaternary,
        fontSize: token.fontSizeIcon,
        lineHeight: 1,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        insetInlineEnd: inputPaddingHorizontal,
        columnGap: token.marginXS,
        zIndex: 1,

        [`${componentCls}-clear-icon`]: {
          cursor: 'pointer',
          border: 0,
          background: 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          color: token.colorTextQuaternary,
          transition: `color ${motionDurationSlow}`,

          '&:hover': {
            color: token.colorTextTertiary,
          },

          '&:active': {
            color: colorText,
          },

          '&-hidden': {
            visibility: 'hidden',
            pointerEvents: 'none',
          },
        },

        [`${antCls}-form-item-feedback-icon`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },

      '&-has-suffix': {
        '> textarea': {
          paddingInlineEnd: token
            .calc(token.paddingXXS)
            .mul(1.5)
            .add(token.fontSizeIcon)
            .add(inputPaddingHorizontal)
            .equal(),
        },
      },

      // ================= Input Area =================
      [`> textarea, ${componentCls}-measure`]: {
        color: colorText,
        boxSizing: 'border-box',
        minHeight: token.calc(controlHeight).sub(2).equal(),
        margin: 0,
        padding: `${unit(inputPaddingVertical)} ${unit(inputPaddingHorizontal)}`,
        overflow: 'inherit',
        overflowX: 'hidden',
        overflowY: 'auto',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        fontStyle: 'inherit',
        fontVariant: 'inherit',
        fontSizeAdjust: 'inherit',
        fontStretch: 'inherit',
        lineHeight: 'inherit',
        direction: 'inherit',
        letterSpacing: 'inherit',
        whiteSpace: 'inherit',
        textAlign: 'inherit',
        verticalAlign: 'top',
        wordWrap: 'break-word',
        wordBreak: 'inherit',
        tabSize: 'inherit',
      },

      '> textarea': {
        width: '100%',
        flex: 'auto',
        minWidth: 0,
        border: 'none',
        outline: 'none',
        resize: 'none',
        backgroundColor: 'inherit',
        ...genPlaceholderStyle(token.colorTextPlaceholder),
      },

      [`${componentCls}-measure`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: -1,
        color: 'transparent',
        pointerEvents: 'none',

        '> span': {
          display: 'inline-block',
          minHeight: '1em',
        },
      },

      // ================== Dropdown ==================
      '&-dropdown': {
        // Ref select dropdown style
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        insetInlineStart: -9999,
        zIndex: token.zIndexPopup,
        boxSizing: 'border-box',
        fontSize,
        fontVariant: 'initial',
        backgroundColor: colorBgElevated,
        borderRadius: borderRadiusLG,
        outline: 'none',
        boxShadow: boxShadowSecondary,

        '&-pure': {
          position: 'static',
          top: 'auto',
          insetInlineStart: 'auto',
          marginTop: token.marginXXS,
          display: 'inline-block',
          minWidth: token.controlItemWidth,
        },

        '&-hidden': {
          display: 'none',
        },

        [`${componentCls}-dropdown-menu`]: {
          maxHeight: token.dropdownHeight,
          marginBottom: 0,
          paddingInlineStart: 0, // Override default ul/ol
          overflow: 'auto',
          listStyle: 'none',
          outline: 'none',

          '&-item': {
            ...textEllipsis,
            position: 'relative',
            display: 'block',
            minWidth: token.controlItemWidth,
            padding: `${unit(itemPaddingVertical)} ${unit(controlPaddingHorizontal)}`,
            color: colorText,
            fontWeight: 'normal',
            lineHeight,
            cursor: 'pointer',
            transition: `background ${motionDurationSlow} ease`,

            '&:hover': {
              backgroundColor: controlItemBgHover,
            },

            '&:first-child': {
              borderStartStartRadius: borderRadiusLG,
              borderStartEndRadius: borderRadiusLG,
              borderEndStartRadius: 0,
              borderEndEndRadius: 0,
            },

            '&:last-child': {
              borderStartStartRadius: 0,
              borderStartEndRadius: 0,
              borderEndStartRadius: borderRadiusLG,
              borderEndEndRadius: borderRadiusLG,
            },

            '&-disabled': {
              color: colorTextDisabled,
              cursor: 'not-allowed',

              '&:hover': {
                color: colorTextDisabled,
                backgroundColor: controlItemBgHover,
                cursor: 'not-allowed',
              },
            },

            '&-selected': {
              color: colorText,
              fontWeight: token.fontWeightStrong,
              backgroundColor: controlItemBgHover,
            },

            '&-active': {
              backgroundColor: controlItemBgHover,
            },
          },
        },
      },
    },
  };
};

const genMentionsVariantStyle = (token: MentionsToken): CSSObject[] => {
  const { componentCls } = token;
  return [
    {
      [`${componentCls}-outlined`]: genOutlinedStyle(token),
      [`${componentCls}-filled`]: genFilledStyle(token),
      [`${componentCls}-borderless`]: genBorderlessStyle(token),
      [`${componentCls}-underlined`]: genUnderlinedStyle(token),
    },
    {
      [`${componentCls}-filled, ${componentCls}-underlined`]: {
        [`&:focus, &:focus-within, &${componentCls}-focused`]: {
          boxShadow: 'none',
        },
      },
      [`${componentCls}-borderless${componentCls}-disabled`]: {
        '> textarea': {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Mentions',
  token => {
    const mentionsToken = initInputToken<FullToken<'Mentions'>>(token);
    return [genMentionsStyle(mentionsToken), ...genMentionsVariantStyle(mentionsToken)];
  },
  token => ({
    dropdownHeight: 250,
    controlItemWidth: 100,
    zIndexPopup: token.zIndexPopupBase + 50,
  }),
);
