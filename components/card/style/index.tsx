import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { clearFix, resetComponent, textEllipsis } from '../../style';

export interface ComponentToken {
  /**
   * @desc 卡片头部背景色
   * @descEN Background color of card header
   */
  headerBg: string;
  /**
   * @desc 卡片头部文字大小
   * @descEN Font size of card header
   */
  headerFontSize: number;
  /**
   * @desc 小号卡片头部文字大小
   * @descEN Font size of small card header
   */
  headerFontSizeSM: number;
  /**
   * @desc 卡片头部高度
   * @descEN Height of card header
   */
  headerHeight: number;
  /**
   * @desc 小号卡片头部高度
   * @descEN Height of small card header
   */
  headerHeightSM: number;
  /**
   * @desc 操作区背景色
   * @descEN Background color of card actions
   */
  actionsBg: string;
  /**
   * @desc 操作区每一项的外间距
   * @descEN Margin of each item in card actions
   */
  actionsLiMargin: string;
  /**
   * @desc 内置标签页组件下间距
   * @descEN Margin bottom of tabs component
   */
  tabsMarginBottom: number;
  /**
   * @desc 额外区文字颜色
   * @descEN Text color of extra area
   */
  extraColor: string;
  /**
   * @desc 卡片内边距
   * @descEN Padding of card body
   */
  bodyPadding: number;
  /**
   * @desc 小号卡片内边距
   * @descEN Padding of small card body
   */
  bodyPaddingSM: number;
  /**
   * @desc 卡片头部内边距
   * @descEN Padding of card head
   */
  headerPadding: number;
  /**
   * @desc 小号卡片头部内边距
   * @descEN Padding of small card head
   */
  headerPaddingSM: number;
}

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
  const { antCls, componentCls, cardHeadHeight, headerPadding, cardHeadTabsMarginBottom } = token;

  return {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: cardHeadHeight,
    marginBottom: -1, // Fix card grid overflow bug: https://gw.alipayobjects.com/zos/rmsportal/XonYxBikwpgbqIQBeuhk.png
    padding: `0 ${unit(headerPadding)}`,
    color: token.colorTextHeading,
    fontWeight: token.fontWeightStrong,
    fontSize: token.headerFontSize,
    background: token.headerBg,
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
    background: token.actionsBg,
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
  margin: `${unit(token.calc(token.marginXXS).mul(-1).equal())} 0`,
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
  const { componentCls, headerPadding, bodyPadding, colorFillAlter } = token;

  return {
    [`${componentCls}-head`]: {
      padding: `0 ${unit(headerPadding)}`,
      background: colorFillAlter,

      '&-title': {
        fontSize: token.fontSize,
      },
    },

    [`${componentCls}-body`]: {
      padding: `${unit(token.padding)} ${unit(bodyPadding)}`,
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
  const { componentCls, cardShadow, cardHeadPadding, colorBorderSecondary, boxShadow } = token;

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
        color: token.extraColor,
        fontWeight: 'normal',
        fontSize: token.fontSize,
      },

      [`${componentCls}-body`]: {
        padding: token.bodyPadding,
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
  const { componentCls, bodyPaddingSM, headerPaddingSM, cardHeadHeightSM, headerFontSizeSM } =
    token;

  return {
    [`${componentCls}-small`]: {
      [`> ${componentCls}-head`]: {
        minHeight: cardHeadHeightSM,
        padding: `0 ${unit(headerPaddingSM)}`,
        fontSize: headerFontSizeSM,

        [`> ${componentCls}-head-wrapper`]: {
          [`> ${componentCls}-extra`]: {
            fontSize: token.fontSize,
          },
        },
      },

      [`> ${componentCls}-body`]: {
        padding: bodyPaddingSM,
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
export default genComponentStyleHook(
  'Card',
  token => {
    const cardToken = mergeToken<CardToken>(token, {
      cardShadow: token.boxShadowCard,
      cardHeadHeight: token.headerHeight,
      cardHeadHeightSM: token.headerHeightSM,
      cardHeadPadding: token.padding,
      cardPaddingBase: token.bodyPadding,
      cardHeadTabsMarginBottom: token.tabsMarginBottom,
      cardActionsLiMargin: token.actionsLiMargin,
      cardActionsIconSize: token.fontSize,
      cardPaddingSM: token.bodyPaddingSM,
    });

    return [
      // Style
      genCardStyle(cardToken),

      // Size
      genCardSizeStyle(cardToken),
    ];
  },
  token => ({
    headerBg: 'transparent',
    headerFontSize: token.fontSizeLG,
    headerFontSizeSM: token.fontSize,
    headerHeight: token.fontSizeLG * token.lineHeightLG + token.padding * 2,
    headerHeightSM: token.fontSize * token.lineHeight + token.paddingXS * 2,
    actionsBg: token.colorBgContainer,
    actionsLiMargin: `${token.paddingSM}px 0`,
    tabsMarginBottom: -token.padding - token.lineWidth,
    extraColor: token.colorText,
    bodyPadding: token.paddingLG,
    bodyPaddingSM: 12, // Fixed padding.
    headerPadding: token.paddingLG,
    headerPaddingSM: 12,
  }),
);
