import { TinyColor } from '@ctrl/tinycolor';
import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { PresetColors } from '../../theme/interface';
import genGroupStyle from './group';
import { genFocusStyle } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import { genCompactItemVerticalStyle } from '../../style/compact-item-vertical';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  solidBg?: string;
  solidBgHover?: string;
  solidBgActive?: string;
  solidTextColor?: string;
}

export interface ButtonToken extends FullToken<'Button'> {
  // FIXME: should be removed
  colorOutlineDefault: string;
  buttonPaddingHorizontal: number;
}

// ============================== Shared ==============================
const genSharedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token): CSSObject => {
  const { componentCls, iconCls } = token;

  return {
    [componentCls]: {
      outline: 'none',
      position: 'relative',
      display: 'inline-block',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      backgroundImage: 'none',
      backgroundColor: 'transparent',
      border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      userSelect: 'none',
      touchAction: 'manipulation',
      lineHeight: token.lineHeight,
      color: token.colorText,

      '> span': {
        display: 'inline-block',
      },

      // Leave a space between icon and text.
      [`> ${iconCls} + span, > span + ${iconCls}`]: {
        marginInlineStart: token.marginXS,
      },

      '> a': {
        color: 'currentColor',
      },

      '&:not(:disabled)': {
        ...genFocusStyle(token),
      },

      [`&${componentCls}-icon-end`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row-reverse',

        [`&${componentCls}-block`]: {
          display: 'flex',
        },

        [`> ${iconCls} + span, > span + ${iconCls}`]: {
          marginInlineStart: 0,
          marginInlineEnd: token.marginXS,
        },

        [`&:not(${componentCls}-icon-only) ${componentCls}-loading-icon > ${iconCls}`]: {
          marginInlineStart: token.marginXS,
          marginInlineEnd: 0,
        },
      },

      // make `btn-icon-only` not too narrow
      [`&-icon-only${componentCls}-compact-item`]: {
        flex: 'none',
      },
      // Special styles for Primary Button
      [`&-compact-item${componentCls}-primary`]: {
        [`&:not([disabled]) + ${componentCls}-compact-item${componentCls}-primary:not([disabled])`]:
          {
            position: 'relative',

            '&:before': {
              position: 'absolute',
              top: token.calc(token.lineWidth).mul(-1).equal(),
              insetInlineStart: token.calc(token.lineWidth).mul(-1).equal(),
              display: 'inline-block',
              width: token.lineWidth,
              height: `calc(100% + ${unit(token.calc(token.lineWidth).mul(2).equal())})`,
              backgroundColor: token.colorPrimaryHover,
              content: '""',
            },
          },
      },
      // Special styles for Primary Button
      '&-compact-vertical-item': {
        [`&${componentCls}-primary`]: {
          [`&:not([disabled]) + ${componentCls}-compact-vertical-item${componentCls}-primary:not([disabled])`]:
            {
              position: 'relative',

              '&:before': {
                position: 'absolute',
                top: token.calc(token.lineWidth).mul(-1).equal(),
                insetInlineStart: token.calc(token.lineWidth).mul(-1).equal(),
                display: 'inline-block',
                width: `calc(100% + ${unit(token.calc(token.lineWidth).mul(2).equal())})`,
                height: token.lineWidth,
                backgroundColor: token.colorPrimaryHover,
                content: '""',
              },
            },
        },
      },
    },
  };
};

const genHoverActiveButtonStyle = (hoverStyle: CSSObject, activeStyle: CSSObject): CSSObject => ({
  '&:not(:disabled)': {
    '&:hover': hoverStyle,
    '&:active': activeStyle,
  },
});

// ============================== Shape ===============================
const genCircleButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  minWidth: token.controlHeight,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,
  borderRadius: '50%',
});

const genRoundButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  borderRadius: token.controlHeight,
  paddingInlineStart: token.calc(token.controlHeight).div(2).equal(),
  paddingInlineEnd: token.calc(token.controlHeight).div(2).equal(),
});

// =============================== Type ===============================
const genDisabledStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  cursor: 'not-allowed',
  borderColor: token.colorBorder,
  color: token.colorTextDisabled,
  backgroundColor: token.colorBgContainerDisabled,
  boxShadow: 'none',
});

const genGhostButtonStyle = (
  btnCls: string,
  textColor: string | false,
  borderColor: string | false,
  textColorDisabled: string | false,
  borderColorDisabled: string | false,
  hoverStyle?: CSSObject,
  activeStyle?: CSSObject,
): CSSObject => ({
  [`&${btnCls}-background-ghost`]: {
    color: textColor || undefined,
    backgroundColor: 'transparent',
    borderColor: borderColor || undefined,
    boxShadow: 'none',

    ...genHoverActiveButtonStyle(
      {
        backgroundColor: 'transparent',
        ...hoverStyle,
      },
      {
        backgroundColor: 'transparent',
        ...activeStyle,
      },
    ),

    '&:disabled': {
      cursor: 'not-allowed',
      color: textColorDisabled || undefined,
      borderColor: borderColorDisabled || undefined,
    },
  },
});

const genSolidDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  '&:disabled': {
    ...genDisabledStyle(token),
  },
});

const genSolidButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidDisabledButtonStyle(token),
});

const genPureDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  '&:disabled': {
    cursor: 'not-allowed',
    color: token.colorTextDisabled,
  },
});

// Type: Default
const genDefaultButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidButtonStyle(token),

  backgroundColor: token.colorBgContainer,
  borderColor: token.colorBorder,

  boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlTmpOutline}`,

  ...genHoverActiveButtonStyle(
    {
      color: token.colorPrimaryHover,
      borderColor: token.colorPrimaryHover,
    },
    {
      color: token.colorPrimaryActive,
      borderColor: token.colorPrimaryActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.colorBgContainer,
    token.colorBgContainer,
    token.colorTextDisabled,
    token.colorBorder,
  ),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,
    borderColor: token.colorError,

    ...genHoverActiveButtonStyle(
      {
        color: token.colorErrorHover,
        borderColor: token.colorErrorBorderHover,
      },
      {
        color: token.colorErrorActive,
        borderColor: token.colorErrorActive,
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      token.colorError,
      token.colorError,
      token.colorTextDisabled,
      token.colorBorder,
    ),
    ...genSolidDisabledButtonStyle(token),
  },
});

// Type: Primary
const genPrimaryButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genSolidButtonStyle(token),

  color: token.colorTextLightSolid,
  backgroundColor: token.colorPrimary,

  boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlOutline}`,

  ...genHoverActiveButtonStyle(
    {
      color: token.colorTextLightSolid,
      backgroundColor: token.colorPrimaryHover,
    },
    {
      color: token.colorTextLightSolid,
      backgroundColor: token.colorPrimaryActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.colorPrimary,
    token.colorPrimary,
    token.colorTextDisabled,
    token.colorBorder,
    {
      color: token.colorPrimaryHover,
      borderColor: token.colorPrimaryHover,
    },
    {
      color: token.colorPrimaryActive,
      borderColor: token.colorPrimaryActive,
    },
  ),

  [`&${token.componentCls}-dangerous`]: {
    backgroundColor: token.colorError,
    boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.colorErrorOutline}`,

    ...genHoverActiveButtonStyle(
      {
        backgroundColor: token.colorErrorHover,
      },
      {
        backgroundColor: token.colorErrorActive,
      },
    ),

    ...genGhostButtonStyle(
      token.componentCls,
      token.colorError,
      token.colorError,
      token.colorTextDisabled,
      token.colorBorder,
      {
        color: token.colorErrorHover,
        borderColor: token.colorErrorHover,
      },
      {
        color: token.colorErrorActive,
        borderColor: token.colorErrorActive,
      },
    ),
    ...genSolidDisabledButtonStyle(token),
  },
});

// Type: Dashed
const genDashedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genDefaultButtonStyle(token),
  borderStyle: 'dashed',
});

// Type: Link
const genLinkButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  color: token.colorLink,

  ...genHoverActiveButtonStyle(
    {
      color: token.colorLinkHover,
    },
    {
      color: token.colorLinkActive,
    },
  ),

  ...genPureDisabledButtonStyle(token),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,

    ...genHoverActiveButtonStyle(
      {
        color: token.colorErrorHover,
      },
      {
        color: token.colorErrorActive,
      },
    ),

    ...genPureDisabledButtonStyle(token),
  },
});

// Type: Text
const genTextButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genHoverActiveButtonStyle(
    {
      color: token.colorText,
      backgroundColor: token.colorBgTextHover,
    },
    {
      color: token.colorText,
      backgroundColor: token.colorBgTextActive,
    },
  ),

  ...genPureDisabledButtonStyle(token),

  [`&${token.componentCls}-dangerous`]: {
    color: token.colorError,

    ...genPureDisabledButtonStyle(token),
    ...genHoverActiveButtonStyle(
      {
        color: token.colorErrorHover,
        backgroundColor: token.colorErrorBg,
      },
      {
        color: token.colorErrorHover,
        backgroundColor: token.colorErrorBg,
      },
    ),
  },
});

// Href and Disabled
const genDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => ({
  ...genDisabledStyle(token),
  [`&${token.componentCls}:hover`]: {
    ...genDisabledStyle(token),
  },
});

const genTypeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}-default`]: genDefaultButtonStyle(token),
    [`${componentCls}-primary`]: genPrimaryButtonStyle(token),
    [`${componentCls}-dashed`]: genDashedButtonStyle(token),
    [`${componentCls}-link`]: genLinkButtonStyle(token),
    [`${componentCls}-text`]: genTextButtonStyle(token),
    [`${componentCls}-disabled`]: genDisabledButtonStyle(token),
  };
};

const genVariantColorButtonStyle: GenerateStyle<ButtonToken, CSSObject> = token => {
  const { componentCls } = token;
  const colorBgSolid = (token as any).colorBgSolid ?? token.solidBg;
  const colorBgSolidHover = (token as any).colorBgSolidHover ?? token.solidBgHover;
  const colorBgSolidActive = (token as any).colorBgSolidActive ?? token.solidBgActive;
  const solidTextColor = token.solidTextColor ?? token.colorTextLightSolid;

  const presetColorStyles: CSSObject = {};
  PresetColors.forEach(colorKey => {
    const baseColor = token[`${colorKey}-6`];
    const hoverColor = token[`${colorKey}-5`];
    const activeColor = token[`${colorKey}-7`];
    const lightColor = token[`${colorKey}-1`];
    const lightHoverColor = token[`${colorKey}-2`];
    const lightActiveColor = token[`${colorKey}-3`];

    presetColorStyles[`&${componentCls}-color-${colorKey}`] = {
      [`&${componentCls}-variant-solid`]: {
        color: token.colorTextLightSolid,
        backgroundColor: baseColor,
        borderColor: 'transparent',
        boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlTmpOutline}`,

        ...genHoverActiveButtonStyle(
          {
            color: token.colorTextLightSolid,
            backgroundColor: hoverColor,
            borderColor: 'transparent',
          },
          {
            color: token.colorTextLightSolid,
            backgroundColor: activeColor,
            borderColor: 'transparent',
          },
        ),

        ...genGhostButtonStyle(
          componentCls,
          baseColor,
          baseColor,
          token.colorTextDisabled,
          token.colorBorder,
          {
            color: hoverColor,
            borderColor: hoverColor,
          },
          {
            color: activeColor,
            borderColor: activeColor,
          },
        ),
        ...genSolidDisabledButtonStyle(token),
      },

      [`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
        color: baseColor,
        borderColor: baseColor,
        backgroundColor: token.colorBgContainer,
        boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlTmpOutline}`,

        ...genHoverActiveButtonStyle(
          {
            color: hoverColor,
            borderColor: hoverColor,
          },
          {
            color: activeColor,
            borderColor: activeColor,
          },
        ),

        ...genGhostButtonStyle(
          componentCls,
          baseColor,
          baseColor,
          token.colorTextDisabled,
          token.colorBorder,
          {
            color: hoverColor,
            borderColor: hoverColor,
          },
          {
            color: activeColor,
            borderColor: activeColor,
          },
        ),
        ...genSolidDisabledButtonStyle(token),
      },

      [`&${componentCls}-variant-dashed`]: {
        borderStyle: 'dashed',
      },

      [`&${componentCls}-filled, &${componentCls}-variant-filled`]: {
        color: baseColor,
        backgroundColor: lightColor,
        borderColor: 'transparent',
        boxShadow: 'none',

        ...genHoverActiveButtonStyle(
          {
            color: hoverColor,
            backgroundColor: lightHoverColor,
            borderColor: 'transparent',
          },
          {
            color: activeColor,
            backgroundColor: lightActiveColor,
            borderColor: 'transparent',
          },
        ),
        ...genSolidDisabledButtonStyle(token),
      },

      [`&${componentCls}-variant-text`]: {
        color: baseColor,
        backgroundColor: 'transparent',
        borderColor: 'transparent',

        ...genHoverActiveButtonStyle(
          {
            color: hoverColor,
            backgroundColor: lightColor,
          },
          {
            color: activeColor,
            backgroundColor: lightActiveColor,
          },
        ),
        ...genPureDisabledButtonStyle(token),
      },

      [`&${componentCls}-variant-link`]: {
        color: baseColor,
        backgroundColor: 'transparent',
        borderColor: 'transparent',

        ...genHoverActiveButtonStyle(
          {
            color: hoverColor,
          },
          {
            color: activeColor,
          },
        ),
        ...genPureDisabledButtonStyle(token),
      },
    };
  });

  return {
    [componentCls]: {
      [`&${componentCls}-filled, &${componentCls}-variant-filled`]: {
        color: token.colorText,
        backgroundColor: token.colorFillTertiary,
        borderColor: 'transparent',
        boxShadow: 'none',

        ...genHoverActiveButtonStyle(
          {
            color: token.colorText,
            backgroundColor: token.colorFillSecondary,
            borderColor: 'transparent',
          },
          {
            color: token.colorText,
            backgroundColor: token.colorFill,
            borderColor: 'transparent',
          },
        ),

        [`&${componentCls}-dangerous`]: {
          color: token.colorError,
          backgroundColor: token.colorErrorBg,
          borderColor: 'transparent',

          ...genHoverActiveButtonStyle(
            {
              color: token.colorError,
              backgroundColor: token.colorErrorBgHover,
              borderColor: 'transparent',
            },
            {
              color: token.colorErrorActive,
              backgroundColor: token.colorErrorBorder,
              borderColor: 'transparent',
            },
          ),
          ...genSolidDisabledButtonStyle(token),
        },

        ...genSolidDisabledButtonStyle(token),
      },

      [`&${componentCls}-color-default`]: {
        [`&${componentCls}-variant-solid`]: {
          color: solidTextColor,
          backgroundColor: colorBgSolid,
          borderColor: 'transparent',
          boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlTmpOutline}`,

          ...genHoverActiveButtonStyle(
            {
              color: solidTextColor,
              backgroundColor: colorBgSolidHover,
              borderColor: 'transparent',
            },
            {
              color: solidTextColor,
              backgroundColor: colorBgSolidActive,
              borderColor: 'transparent',
            },
          ),

          ...genGhostButtonStyle(
            componentCls,
            token.colorBgContainer,
            token.colorBgContainer,
            token.colorTextDisabled,
            token.colorBorder,
          ),
          ...genSolidDisabledButtonStyle(token),
        },

        [`&${componentCls}-variant-link`]: {
          color: token.colorText,
          ...genHoverActiveButtonStyle(
            {
              color: token.colorPrimaryHover,
            },
            {
              color: token.colorPrimaryActive,
            },
          ),
          ...genPureDisabledButtonStyle(token),
        },
      },

      [`&${componentCls}-color-primary`]: {
        [`&${componentCls}-variant-solid`]: {
          color: token.colorTextLightSolid,
          backgroundColor: token.colorPrimary,
          borderColor: 'transparent',
          boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.controlOutline}`,

          ...genHoverActiveButtonStyle(
            {
              color: token.colorTextLightSolid,
              backgroundColor: token.colorPrimaryHover,
              borderColor: 'transparent',
            },
            {
              color: token.colorTextLightSolid,
              backgroundColor: token.colorPrimaryActive,
              borderColor: 'transparent',
            },
          ),
          ...genSolidDisabledButtonStyle(token),
        },

        [`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
          color: token.colorPrimary,
          borderColor: token.colorPrimary,
          ...genHoverActiveButtonStyle(
            {
              color: token.colorPrimaryHover,
              borderColor: token.colorPrimaryHover,
            },
            {
              color: token.colorPrimaryActive,
              borderColor: token.colorPrimaryActive,
            },
          ),
          ...genSolidDisabledButtonStyle(token),
        },

        [`&${componentCls}-filled, &${componentCls}-variant-filled`]: {
          color: token.colorPrimary,
          backgroundColor: token.colorPrimaryBg,
          borderColor: 'transparent',
          ...genHoverActiveButtonStyle(
            {
              color: token.colorPrimaryHover,
              backgroundColor: token.colorPrimaryBgHover,
              borderColor: 'transparent',
            },
            {
              color: token.colorPrimaryActive,
              backgroundColor: token.colorPrimaryBorder,
              borderColor: 'transparent',
            },
          ),
          ...genSolidDisabledButtonStyle(token),
        },

        [`&${componentCls}-text, &${componentCls}-variant-text`]: {
          color: token.colorPrimary,
          ...genHoverActiveButtonStyle(
            {
              color: token.colorPrimaryHover,
              backgroundColor: token.colorPrimaryBg,
            },
            {
              color: token.colorPrimaryActive,
              backgroundColor: token.colorPrimaryBgHover,
            },
          ),
          ...genPureDisabledButtonStyle(token),
        },

        [`&${componentCls}-link, &${componentCls}-variant-link`]: {
          color: token.colorPrimary,
          ...genHoverActiveButtonStyle(
            {
              color: token.colorPrimaryHover,
            },
            {
              color: token.colorPrimaryActive,
            },
          ),
          ...genPureDisabledButtonStyle(token),
        },
      },

      [`&${componentCls}-color-dangerous`]: {
        [`&${componentCls}-variant-solid`]: {
          color: token.colorTextLightSolid,
          backgroundColor: token.colorError,
          borderColor: 'transparent',
          boxShadow: `0 ${unit(token.controlOutlineWidth)} 0 ${token.colorErrorOutline}`,

          ...genHoverActiveButtonStyle(
            {
              color: token.colorTextLightSolid,
              backgroundColor: token.colorErrorHover,
              borderColor: 'transparent',
            },
            {
              color: token.colorTextLightSolid,
              backgroundColor: token.colorErrorActive,
              borderColor: 'transparent',
            },
          ),

          ...genGhostButtonStyle(
            componentCls,
            token.colorError,
            token.colorError,
            token.colorTextDisabled,
            token.colorBorder,
            {
              color: token.colorErrorHover,
              borderColor: token.colorErrorHover,
            },
            {
              color: token.colorErrorActive,
              borderColor: token.colorErrorActive,
            },
          ),
          ...genSolidDisabledButtonStyle(token),
        },
      },

      ...presetColorStyles,
    },
  };
};

// =============================== Size ===============================
const genSizeButtonStyle = (token: ButtonToken, sizePrefixCls: string = ''): CSSInterpolation => {
  const {
    componentCls,
    iconCls,
    controlHeight,
    fontSize,
    lineHeight,
    lineWidth,
    borderRadius,
    buttonPaddingHorizontal,
  } = token;

  // cssVar 模式下 token 值是 var() 字符串，算术必须走 calc 链
  const paddingVertical = token
    .calc(token.calc(controlHeight).sub(token.calc(fontSize).mul(lineHeight).equal()).equal())
    .div(2)
    .sub(lineWidth)
    .equal();
  const paddingHorizontal = token.calc(buttonPaddingHorizontal).sub(lineWidth).equal();

  const iconOnlyCls = `${componentCls}-icon-only`;

  return [
    // Size
    {
      [`${componentCls}${sizePrefixCls}`]: {
        fontSize,
        height: controlHeight,
        padding: `${unit(paddingVertical)} ${unit(paddingHorizontal)}`,
        borderRadius,

        [`&${iconOnlyCls}`]: {
          width: controlHeight,
          paddingInlineStart: 0,
          paddingInlineEnd: 0,
          [`&${componentCls}-round`]: {
            width: 'auto',
          },
          '> span': {
            transform: 'scale(1.143)', // 14px -> 16px
          },
        },

        // Loading
        [`&${componentCls}-loading`]: {
          opacity: token.opacityLoading,
          cursor: 'default',
        },

        [`${componentCls}-loading-icon`]: {
          transition: `width ${token.motionDurationSlow} ${token.motionEaseInOut}, opacity ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        },

        [`&:not(${iconOnlyCls}) ${componentCls}-loading-icon > ${iconCls}`]: {
          marginInlineEnd: token.marginXS,
        },
      },
    },

    // Shape - patch prefixCls again to override solid border radius style
    {
      [`${componentCls}${componentCls}-circle${sizePrefixCls}`]: genCircleButtonStyle(token),
    },
    {
      [`${componentCls}${componentCls}-round${sizePrefixCls}`]: genRoundButtonStyle(token),
    },
  ];
};

const genSizeBaseButtonStyle: GenerateStyle<ButtonToken> = token => genSizeButtonStyle(token);

const genSizeSmallButtonStyle: GenerateStyle<ButtonToken> = token => {
  const smallToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightSM,
    padding: token.paddingXS,
    buttonPaddingHorizontal: 8, // Fixed padding
    borderRadius: token.borderRadiusSM,
  });

  return genSizeButtonStyle(smallToken, `${token.componentCls}-sm`);
};

const genSizeLargeButtonStyle: GenerateStyle<ButtonToken> = token => {
  const largeToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightLG,
    fontSize: token.fontSizeLG,
    borderRadius: token.borderRadiusLG,
  });

  return genSizeButtonStyle(largeToken, `${token.componentCls}-lg`);
};

const genBlockButtonStyle: GenerateStyle<ButtonToken> = token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-block`]: {
        width: '100%',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Button',
  token => {
    const { controlTmpOutline, paddingContentHorizontal } = token;
    const buttonToken = mergeToken<ButtonToken>(token, {
      colorOutlineDefault: controlTmpOutline,
      buttonPaddingHorizontal: paddingContentHorizontal,
    });

    return [
      // Shared
      genSharedButtonStyle(buttonToken),

      // Size
      genSizeSmallButtonStyle(buttonToken),
      genSizeBaseButtonStyle(buttonToken),
      genSizeLargeButtonStyle(buttonToken),

      // Block
      genBlockButtonStyle(buttonToken),

      // Group (type, ghost, danger, disabled, loading)
      genTypeButtonStyle(buttonToken),

      // Variant & Color overrides (must come after genTypeButtonStyle)
      genVariantColorButtonStyle(buttonToken),

      // Button Group
      genGroupStyle(buttonToken),

      // Space Compact
      genCompactItemStyle(token, { focus: false }),
      genCompactItemVerticalStyle(token),
    ];
  },
  token => {
    const isDarkBg = new TinyColor(token.colorBgBase || '#fff').isDark();
    const rawTextBase = token.colorTextBase || (isDarkBg ? '#fff' : '#000');
    const solidBg =
      (token as any).colorBgSolid ||
      new TinyColor(rawTextBase).setAlpha(isDarkBg ? 0.95 : 1).toRgbString();
    const solidBgHover =
      (token as any).colorBgSolidHover ||
      new TinyColor(rawTextBase).setAlpha(isDarkBg ? 1 : 0.75).toRgbString();
    const solidBgActive =
      (token as any).colorBgSolidActive ||
      new TinyColor(rawTextBase).setAlpha(isDarkBg ? 0.9 : 0.95).toRgbString();
    const solidTextColor = new TinyColor(solidBg).isLight() ? '#000' : token.colorTextLightSolid;
    return {
      solidBg,
      solidBgHover,
      solidBgActive,
      solidTextColor,
    };
  },
);
