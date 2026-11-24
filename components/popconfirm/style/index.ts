import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {
  zIndexPopup: number;
}

export interface PopconfirmToken extends FullToken<'Popconfirm'> {}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<PopconfirmToken> = token => {
  const {
    componentCls,
    iconCls,
    antCls,
    zIndexPopup,
    colorText,
    colorTextHeading,
    colorWarning,
    marginXS,
    fontSize,
    fontWeightStrong,
    lineHeight,
    sizePopupArrow,
  } = token;

  return {
    [componentCls]: {
      zIndex: zIndexPopup,

      [`&${antCls}-popover`]: {
        fontSize,
      },

      [`&${antCls}-popover-pure`]: {
        position: 'relative',
        maxWidth: 'none',
        margin: sizePopupArrow,
        display: 'inline-block',
        verticalAlign: 'top',

        [`${antCls}-popover-content`]: {
          display: 'block',
          width: '100%',
        },
      },

      [`${componentCls}-inner-content`]: {
        color: colorText,
      },

      [`${componentCls}-message`]: {
        position: 'relative',
        marginBottom: marginXS,
        color: colorText,
        fontSize,
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'start',

        [`> ${componentCls}-message-icon`]: {
          color: colorWarning,
        },

        [`> ${componentCls}-message-icon ${iconCls}`]: {
          fontSize,
          flex: 'none',
          lineHeight: 1,
          paddingTop:
            (Math.round(
              ((token as any)._realToken?.fontSize ?? Number(fontSize)) *
                ((token as any)._realToken?.lineHeight ?? Number(lineHeight)),
            ) -
              ((token as any)._realToken?.fontSize ?? Number(fontSize))) /
            2,
        },

        '&-title': {
          flex: 'auto',
          marginInlineStart: marginXS,
        },

        '&-title-only': {
          fontWeight: fontWeightStrong,
          color: colorTextHeading,
        },

        [`&${componentCls}-message-no-icon`]: {
          [`${componentCls}-message-title`]: {
            marginInlineStart: 0,
          },

          [`+ ${componentCls}-description`]: {
            marginInlineStart: 0,
          },
        },
      },

      [`${componentCls}-description`]: {
        position: 'relative',
        marginInlineStart: token.calc(fontSize).add(marginXS).equal(),
        marginBottom: marginXS,
        color: colorText,
        fontSize,
      },

      [`${componentCls}-buttons`]: {
        textAlign: 'end',
        whiteSpace: 'nowrap',

        button: {
          marginInlineStart: marginXS,
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Popconfirm',
  token => genBaseStyle(token),
  token => {
    const { zIndexPopupBase } = token;

    return {
      zIndexPopup: zIndexPopupBase + 60,
    };
  },
);
