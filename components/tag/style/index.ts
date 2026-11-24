import { TinyColor } from '@ctrl/tinycolor';
import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genPresetColor, resetComponent } from '../../style';
import type { CSSProperties } from 'vue';
import { capitalize } from '../../_util/util';

export interface ComponentToken {
  /**
   * @desc 默认背景色
   * @descEN Default background color
   */
  defaultBg: string;
  /**
   * @desc 默认文字颜色
   * @descEN Default text color
   */
  defaultColor: string;
  /**
   * @desc 默认实心标签的背景色
   * @descEN Default background color for solid tag.
   */
  defaultSolidBg?: string;
  /**
   * @desc 默认实心标签的文本色
   * @descEN Default text color for solid tag.
   */
  solidTextColor: string;
}

interface TagToken extends FullToken<'Tag'> {
  tagFontSize: number;
  tagLineHeight: CSSProperties['lineHeight'];
  tagIconSize: number;
  tagPaddingHorizontal: number;
  tagBorderlessBg: string;
  tagSolidBg: string;
}

const compositeOnBackground = (foreground: string, background: string): string => {
  const fg = new TinyColor(foreground);
  const bg = new TinyColor(background);
  const alpha = fg.getAlpha();
  if (alpha >= 1) {
    return fg.toHexString();
  }
  const r = Math.round(fg.r * alpha + bg.r * (1 - alpha));
  const g = Math.round(fg.g * alpha + bg.g * (1 - alpha));
  const b = Math.round(fg.b * alpha + bg.b * (1 - alpha));
  return new TinyColor({ r, g, b }).toHexString();
};

// ============================== Styles ==============================

type CssVariableType = 'Success' | 'Info' | 'Error' | 'Warning';

const genTagStatusStyle = (
  token: TagToken,
  status: 'success' | 'processing' | 'error' | 'warning',
  cssVariableType: CssVariableType,
): CSSObject => {
  const capitalizedCssVariableType = capitalize(cssVariableType);
  return {
    [`${token.componentCls}${token.componentCls}-${status}:not(${token.componentCls}-disabled)`]: {
      color: token[`color${cssVariableType}`],
      background: token[`color${capitalizedCssVariableType}Bg`],
      borderColor: token[`color${capitalizedCssVariableType}Border`],

      [`&${token.componentCls}-outlined`]: {
        backgroundColor: token[`color${capitalizedCssVariableType}Bg`],
        borderColor: token[`color${capitalizedCssVariableType}Border`],
        color: token[`color${cssVariableType}`],
      },
      [`&${token.componentCls}-solid`]: {
        backgroundColor: token[`color${cssVariableType}`],
        borderColor: token[`color${cssVariableType}`],
        color: token.colorTextLightSolid,
      },
      [`&${token.componentCls}-filled, &${token.componentCls}-borderless`]: {
        backgroundColor: token[`color${capitalizedCssVariableType}Bg`],
        borderColor: 'transparent',
        color: token[`color${cssVariableType}`],
      },
    },
  };
};

const genPresetStyle = (token: TagToken) =>
  genPresetColor(token, (colorKey, { textColor, lightBorderColor, lightColor, darkColor }) => ({
    [`${token.componentCls}${token.componentCls}-${colorKey}:not(${token.componentCls}-disabled)`]:
      {
        color: textColor,
        background: lightColor,
        borderColor: lightBorderColor,

        [`&${token.componentCls}-outlined`]: {
          backgroundColor: lightColor,
          borderColor: lightBorderColor,
          color: textColor,
        },
        [`&${token.componentCls}-solid`]: {
          color: token.colorTextLightSolid,
          backgroundColor: darkColor,
          borderColor: darkColor,
        },
        [`&${token.componentCls}-filled, &${token.componentCls}-borderless`]: {
          backgroundColor: lightColor,
          borderColor: 'transparent',
          color: textColor,
        },
      },
    [`${token.componentCls}${token.componentCls}-${colorKey}-inverse:not(${token.componentCls}-disabled)`]:
      {
        color: token.colorTextLightSolid,
        backgroundColor: darkColor,
        borderColor: darkColor,
      },
  }));

const genBaseStyle = (token: TagToken): CSSObject => {
  const { paddingXXS, lineWidth, tagPaddingHorizontal, componentCls } = token;
  const paddingInline = token.calc(tagPaddingHorizontal).sub(lineWidth).equal();
  const iconMarginInline = token.calc(paddingXXS).sub(lineWidth).equal();

  return {
    // Result
    [componentCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      height: 'auto',
      marginInlineEnd: token.marginXS,
      paddingInline,
      fontSize: token.tagFontSize,
      lineHeight: `${unit(token.tagLineHeight)}`,
      whiteSpace: 'nowrap',
      backgroundColor: token.defaultBg,
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
      borderRadius: token.borderRadiusSM,
      opacity: 1,
      transition: `all ${token.motionDurationMid}`,
      textAlign: 'start',
      position: 'relative',

      // RTL
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      '&, a, a:hover': {
        color: token.defaultColor,
      },

      [`${componentCls}-close-icon`]: {
        marginInlineStart: iconMarginInline,
        color: token.colorIcon,
        fontSize: token.tagIconSize,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid}`,

        '&:hover': {
          color: token.colorTextHeading,
        },
      },

      [`&${componentCls}-has-color`]: {
        borderColor: 'transparent',

        [`&, a, a:hover, ${token.iconCls}-close, ${token.iconCls}-close:hover`]: {
          color: token.colorTextLightSolid,
        },
      },

      [`&-checkable`]: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        cursor: 'pointer',

        [`&:not(${componentCls}-checkable-checked):hover`]: {
          color: token.colorPrimary,
          backgroundColor: token.colorFillSecondary,
        },

        '&:active, &-checked': {
          color: token.colorTextLightSolid,
        },

        '&-checked': {
          backgroundColor: token.colorPrimary,
          '&:hover': {
            backgroundColor: token.colorPrimaryHover,
          },
        },

        '&:active': {
          backgroundColor: token.colorPrimaryActive,
        },

        '&-disabled': {
          cursor: 'not-allowed',

          [`&:not(${componentCls}-checkable-checked)`]: {
            color: token.colorTextDisabled,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },

          [`&${componentCls}-checkable-checked`]: {
            color: token.colorTextDisabled,
            backgroundColor: token.colorBgContainerDisabled,
          },

          '&:hover, &:active': {
            backgroundColor: token.colorBgContainerDisabled,
            color: token.colorTextDisabled,
          },

          [`&:not(${componentCls}-checkable-checked):hover`]: {
            color: token.colorTextDisabled,
          },
        },

        '&-group': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: token.paddingXS,
        },
      },

      [`&-hidden`]: {
        display: 'none',
      },

      '> svg': {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginBlockEnd: '0.2em',
      },

      // To ensure that a space will be placed between character and `Icon`.
      [`> ${token.iconCls} + span, > span + ${token.iconCls}, > svg + span, > span + svg`]: {
        marginInlineStart: paddingInline,
      },
    },

    [`${componentCls}-outlined`]: {
      backgroundColor: token.defaultBg,
      borderColor: token.colorBorder,
    },

    [`${componentCls}-solid`]: {
      borderColor: 'transparent',
      color: token.colorTextLightSolid,
      backgroundColor: token.tagSolidBg,

      [`&, a, a:hover, ${componentCls}-close-icon, ${componentCls}-close-icon:hover`]: {
        color: token.colorTextLightSolid,
      },

      [`&${componentCls}-default`]: {
        color: token.solidTextColor,
        [`a, a:hover, ${componentCls}-close-icon, ${componentCls}-close-icon:hover`]: {
          color: token.solidTextColor,
        },
      },
    },

    [`${componentCls}-filled, ${componentCls}-borderless`]: {
      borderColor: 'transparent',
      backgroundColor: token.tagBorderlessBg,
    },

    [`${componentCls}-disabled`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
      backgroundColor: token.colorBgContainerDisabled,

      a: {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        color: token.colorTextDisabled,
        '&:hover': {
          color: token.colorTextDisabled,
        },
      },

      'a&': {
        '&:hover, &:active': {
          color: token.colorTextDisabled,
        },
      },

      [`&${componentCls}-outlined`]: {
        borderColor: token.colorBorder,
      },

      [`&${componentCls}-solid, &${componentCls}-filled`]: {
        color: token.colorTextDisabled,
        [`${componentCls}-close-icon`]: {
          color: token.colorTextDisabled,
        },
      },

      [`${componentCls}-close-icon`]: {
        cursor: 'not-allowed',
        color: token.colorTextDisabled,
        '&:hover': {
          color: token.colorTextDisabled,
        },
      },
    },
  };
};

export const prepareComponentToken = (token: any): ComponentToken => {
  const isDarkBg = new TinyColor(token.colorBgBase || '#fff').isDark();
  const rawTextBase = token.colorTextBase || (isDarkBg ? '#fff' : '#000');
  const defaultSolidBg =
    token.colorBgSolid || new TinyColor(rawTextBase).setAlpha(isDarkBg ? 0.95 : 1).toRgbString();
  const solidTextColor = new TinyColor(defaultSolidBg).isLight() ? '#000' : '#fff';

  return {
    defaultBg: compositeOnBackground(token.colorFillTertiary, token.colorBgContainer),
    defaultColor: token.colorText,
    defaultSolidBg,
    solidTextColor,
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Tag',
  token => {
    // 尺寸派生需要真实数值（cssVar 模式下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const tagHeight = Math.round(rawToken.fontSize * rawToken.lineHeight);

    const tagFontSize = token.fontSizeSM;
    const tagLineHeight = tagHeight - rawToken.lineWidth * 2;

    const tagToken = mergeToken<TagToken>(token, {
      tagFontSize,
      tagLineHeight,
      tagIconSize: rawToken.fontSizeIcon - 2 * rawToken.lineWidth, // Tag icon is much more smaller
      tagPaddingHorizontal: 8, // Fixed padding.
      tagBorderlessBg: token.defaultBg,
      tagSolidBg: token.defaultSolidBg!,
    });

    return [
      genBaseStyle(tagToken),
      genPresetStyle(tagToken),
      genTagStatusStyle(tagToken, 'success', 'Success'),
      genTagStatusStyle(tagToken, 'processing', 'Info'),
      genTagStatusStyle(tagToken, 'error', 'Error'),
      genTagStatusStyle(tagToken, 'warning', 'Warning'),
    ];
  },
  prepareComponentToken,
);
