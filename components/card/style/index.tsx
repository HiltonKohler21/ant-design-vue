import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { clearFix, resetComponent, textEllipsis } from '../../style';

export interface ComponentToken {}

interface CardToken extends FullToken<'Card'> {
  cardHeadHeight: number;
  cardHeadHeightSM: number;
  cardShadow: string;
  cardHeadPadding: number;
  cardPaddingSM: number;
  cardPaddingBase: number;
  cardHeadTabsMarginBottom: number;
  cardActionsLiMargin: string;
  cardActionsIconSize: number;
}

// ============================== Styles ==============================

// ============================== Head ==============================
const genCardHeadStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { antCls, componentCls, cardHeadHeight, cardPaddingBase, cardHeadTabsMarginBottom } = token;

  return {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: cardHeadHeight,
    marginBottom: -1, // Fix card grid overflow bug: https://gw.alipayobjects.com/zos/rmsportal/XonYxBikwpgbqIQBeuhk.png
    padding: `0 ${unit(cardPaddingBase)}`,
    color: token.colorTextHeading,
    fontWeight: token.fontWeightStrong,
    fontSize: token.fontSizeLG,
    background: 'transparent',
    borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
    borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,

    ...clearFix(),

    '&-wrapper': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },

    '&-title': {
      display: 'inline-block',
      flex: 1,
      ...textEllipsis,

      [`
          > ${componentCls}-typography,
          > ${componentCls}-typography-edit-content
        `]: {
        insetInlineStart: 0,
        marginTop: 0,
        marginBottom: 0,
      },
    },

    [`${antCls}-tabs-top`]: {
      clear: 'both',
      marginBottom: cardHeadTabsMarginBottom,
      color: token.colorText,
      fontWeight: 'normal',
      fontSize: token.fontSize,

      '&-bar': {
        borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
      },
    },
  };
};

// ============================== Grid ==============================
const genCardGridStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { cardPaddingBase, colorBorderSecondary, cardShadow, lineWidth } = token;
  return {
    width: '33.33%',
    padding: cardPaddingBase,
    border: 0,
    borderRadius: 0,
    boxShadow: `
      ${unit(lineWidth)} 0 0 0 ${colorBorderSecondary},
      0 ${unit(lineWidth)} 0 0 ${colorBorderSecondary},
      ${unit(lineWidth)} ${unit(lineWidth)} 0 0 ${colorBorderSecondary},
      ${unit(lineWidth)} 0 0 0 ${colorBorderSecondary} inset,
      0 ${unit(lineWidth)} 0 0 ${colorBorderSecondary} inset;
    `,
    transition: `all ${token.motionDurationMid}`,

    '&-hoverable:hover': {
      position: 'relative',
      zIndex: 1,
      boxShadow: cardShadow,
    },
  };
};

// ============================== Actions ==============================
const genCardActionsStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { componentCls, iconCls, cardActionsLiMargin, cardActionsIconSize, colorBorderSecondary } =
    token;
  return {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    background: token.colorBgContainer,
    borderTop: `${unit(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
    display: 'flex',
    borderRadius: `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} `,
    ...clearFix(),

    '& > li': {
      margin: cardActionsLiMargin,
      color: token.colorTextDescription,
      textAlign: 'center',

      '> span': {
        position: 'relative',
        display: 'block',
        minWidth: token.calc(token.cardActionsIconSize).mul(2).equal(),
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        cursor: 'pointer',

        '&:hover': {
          color: token.colorPrimary,
          transition: `color ${token.motionDurationMid}`,
        },

        [`a:not(${componentCls}-btn), > ${iconCls}`]: {
          display: 'inline-block',
          width: '100%',
          color: token.colorTextDescription,
          lineHeight: `${unit(token.calc(token.fontSize).mul(token.lineHeight).equal())}`,
          transition: `color ${token.motionDurationMid}`,

          '&:hover': {
            color: token.colorPrimary,
          },
        },

        [`> ${iconCls}`]: {
          fontSize: cardActionsIconSize,
          lineHeight: unit(token.calc(cardActionsIconSize).mul(token.lineHeight).equal()),
        },
      },

      '&:not(:last-child)': {
        borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
      },
    },
  };
};

// ============================== Meta ==============================
const genCardMetaStyle: GenerateStyle<CardToken> = (token): CSSObject => ({
  margin: `-${unit(token.marginXXS)} 0`,
  display: 'flex',
  ...clearFix(),

  '&-avatar': {
    paddingInlineEnd: token.padding,
  },

  '&-detail': {
    overflow: 'hidden',
    flex: 1,

    '> div:not(:last-child)': {
      marginBottom: token.marginXS,
    },
  },

  '&-title': {
    color: token.colorTextHeading,
    fontWeight: token.fontWeightStrong,
    fontSize: token.fontSizeLG,
    ...textEllipsis,
  },

  '&-description': {
    color: token.colorTextDescription,
  },
});

// ============================== Inner ==============================
const genCardTypeInnerStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { componentCls, cardPaddingBase, colorFillAlter } = token;

  return {
    [`${componentCls}-head`]: {
      padding: `0 ${unit(cardPaddingBase)}`,
      background: colorFillAlter,

      '&-title': {
        fontSize: token.fontSize,
      },
    },

    [`${componentCls}-body`]: {
      padding: `${unit(token.padding)} ${unit(cardPaddingBase)}`,
    },
  };
};

// ============================== Loading ==============================
const genCardLoadingStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    overflow: 'hidden',

    [`${componentCls}-body`]: {
      userSelect: 'none',
    },
  };
};

// ============================== Basic ==============================
const genCardStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const {
    componentCls,
    cardShadow,
    cardHeadPadding,
    colorBorderSecondary,
    boxShadow,
    cardPaddingBase,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'relative',
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,

      [`&:not(${componentCls}-bordered)`]: {
        boxShadow,
      },

      [`${componentCls}-head`]: genCardHeadStyle(token),

      [`${componentCls}-extra`]: {
        // https://stackoverflow.com/a/22429853/3040605
        marginInlineStart: 'auto',
        color: '',
        fontWeight: 'normal',
        fontSize: token.fontSize,
      },

      [`${componentCls}-body`]: {
        padding: cardPaddingBase,
        borderRadius: ` 0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}`,
        ...clearFix(),
      },

      [`${componentCls}-grid`]: genCardGridStyle(token),

      [`${componentCls}-cover`]: {
        '> *': {
          display: 'block',
          width: '100%',
        },

        img: {
          borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,
        },
      },

      [`${componentCls}-actions`]: genCardActionsStyle(token),

      [`${componentCls}-meta`]: genCardMetaStyle(token),
    },

    [`${componentCls}-bordered`]: {
      border: `${unit(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,

      [`${componentCls}-cover`]: {
        marginTop: -1,
        marginInlineStart: -1,
        marginInlineEnd: -1,
      },
    },

    [`${componentCls}-hoverable`]: {
      cursor: 'pointer',
      transition: `box-shadow ${token.motionDurationMid}, border-color ${token.motionDurationMid}`,

      '&:hover': {
        borderColor: 'transparent',
        boxShadow: cardShadow,
      },
    },

    [`${componentCls}-contain-grid`]: {
      [`${componentCls}-body`]: {
        display: 'flex',
        flexWrap: 'wrap',
      },

      [`&:not(${componentCls}-loading) ${componentCls}-body`]: {
        marginBlockStart: token.calc(token.lineWidth).mul(-1).equal(),
        marginInlineStart: token.calc(token.lineWidth).mul(-1).equal(),
        padding: 0,
      },
    },

    [`${componentCls}-contain-tabs`]: {
      [`> ${componentCls}-head`]: {
        [`${componentCls}-head-title, ${componentCls}-extra`]: {
          paddingTop: cardHeadPadding,
        },
      },
    },

    [`${componentCls}-type-inner`]: genCardTypeInnerStyle(token),

    [`${componentCls}-loading`]: genCardLoadingStyle(token),

    [`${componentCls}-rtl`]: {
      direction: 'rtl',
    },
  };
};

// ============================== Size ==============================
const genCardSizeStyle: GenerateStyle<CardToken> = (token): CSSObject => {
  const { componentCls, cardPaddingSM, cardHeadHeightSM } = token;

  return {
    [`${componentCls}-small`]: {
      [`> ${componentCls}-head`]: {
        minHeight: cardHeadHeightSM,
        padding: `0 ${unit(cardPaddingSM)}`,
        fontSize: token.fontSize,

        [`> ${componentCls}-head-wrapper`]: {
          [`> ${componentCls}-extra`]: {
            fontSize: token.fontSize,
          },
        },
      },

      [`> ${componentCls}-body`]: {
        padding: cardPaddingSM,
      },
    },
    [`${componentCls}-small${componentCls}-contain-tabs`]: {
      [`> ${componentCls}-head`]: {
        [`${componentCls}-head-title, ${componentCls}-extra`]: {
          minHeight: cardHeadHeightSM,
          paddingTop: 0,
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Card', token => {
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const cardToken = mergeToken<CardToken>(token, {
    cardShadow: token.boxShadowCard,
    cardHeadHeight: rawToken.fontSizeLG * rawToken.lineHeightLG + rawToken.padding * 2,
    cardHeadHeightSM: rawToken.fontSize * rawToken.lineHeight + rawToken.paddingXS * 2,
    cardHeadPadding: token.padding,
    cardPaddingBase: token.paddingLG,
    cardHeadTabsMarginBottom: rawToken.lineWidth - rawToken.padding,
    cardActionsLiMargin: `${unit(token.paddingSM)} 0`,
    cardActionsIconSize: token.fontSize,
    cardPaddingSM: 12, // Fixed padding.
  });

  return [
    // Style
    genCardStyle(cardToken),

    // Size
    genCardSizeStyle(cardToken),
  ];
});
