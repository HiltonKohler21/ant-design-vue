import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  contentWidth: number;
}

interface ListToken extends FullToken<'List'> {
  listBorderedCls: string;
  minHeight: number;
  listItemPaddingLG: string;
  listItemPaddingSM: string;
  listItemPadding: string;
}

const genBorderedStyle = (token: ListToken): CSSObject => {
  const {
    listBorderedCls,
    componentCls,
    paddingLG,
    margin,
    padding,
    listItemPaddingSM,
    marginLG,
    borderRadiusLG,
  } = token;
  return {
    [`${listBorderedCls}`]: {
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
      borderRadius: borderRadiusLG,
      [`${componentCls}-header,${componentCls}-footer,${componentCls}-item`]: {
        paddingInline: paddingLG,
      },

      [`${componentCls}-pagination`]: {
        margin: `${unit(margin)} ${unit(marginLG)}`,
      },
    },
    [`${listBorderedCls}${componentCls}-sm`]: {
      [`${componentCls}-item,${componentCls}-header,${componentCls}-footer`]: {
        padding: listItemPaddingSM,
      },
    },

    [`${listBorderedCls}${componentCls}-lg`]: {
      [`${componentCls}-item,${componentCls}-header,${componentCls}-footer`]: {
        padding: `${unit(padding)} ${unit(paddingLG)}`,
      },
    },
  };
};
const genResponsiveStyle = (token: ListToken): CSSObject => {
  const { componentCls, screenSM, screenMD, marginLG, marginSM, margin } = token;
  return {
    [`@media screen and (max-width:${screenMD})`]: {
      [`${componentCls}`]: {
        [`${componentCls}-item`]: {
          [`${componentCls}-item-action`]: {
            marginInlineStart: marginLG,
          },
        },
      },

      [`${componentCls}-vertical`]: {
        [`${componentCls}-item`]: {
          [`${componentCls}-item-extra`]: {
            marginInlineStart: marginLG,
          },
        },
      },
    },

    [`@media screen and (max-width: ${screenSM})`]: {
      [`${componentCls}`]: {
        [`${componentCls}-item`]: {
          flexWrap: 'wrap',

          [`${componentCls}-action`]: {
            marginInlineStart: marginSM,
          },
        },
      },

      [`${componentCls}-vertical`]: {
        [`${componentCls}-item`]: {
          flexWrap: 'wrap-reverse',

          [`${componentCls}-item-main`]: {
            minWidth: token.contentWidth,
          },

          [`${componentCls}-item-extra`]: {
            margin: `auto auto ${unit(margin)}`,
          },
        },
      },
    },
  };
};

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<ListToken> = token => {
  const {
    componentCls,
    antCls,
    controlHeight,
    minHeight,
    paddingSM,
    marginLG,
    padding,
    listItemPadding,
    colorPrimary,
    listItemPaddingSM,
    listItemPaddingLG,
    paddingXS,
    margin,
    colorText,
    colorTextDescription,
    motionDurationSlow,
    lineWidth,
  } = token;

  return {
    [`${componentCls}`]: {
      ...resetComponent(token),
      position: 'relative',
      '*': {
        outline: 'none',
      },
      [`${componentCls}-header, ${componentCls}-footer`]: {
        background: 'transparent',
        paddingBlock: paddingSM,
      },
      [`${componentCls}-pagination`]: {
        marginBlockStart: marginLG,
        textAlign: 'end',

        // https://github.com/ant-design/ant-design/issues/20037
        [`${antCls}-pagination-options`]: {
          textAlign: 'start',
        },
      },

      [`${componentCls}-spin`]: {
        minHeight,
        textAlign: 'center',
      },

      [`${componentCls}-items`]: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },

      [`${componentCls}-item`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: listItemPadding,
        color: colorText,

        [`${componentCls}-item-meta`]: {
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          maxWidth: '100%',

          [`${componentCls}-item-meta-avatar`]: {
            marginInlineEnd: padding,
          },

          [`${componentCls}-item-meta-content`]: {
            flex: '1 0',
            width: 0,
            color: colorText,
          },

          [`${componentCls}-item-meta-title`]: {
            marginBottom: token.marginXXS,
            color: colorText,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,

            '> a': {
              color: colorText,
              transition: `all ${motionDurationSlow}`,

              [`&:hover`]: {
                color: colorPrimary,
              },
            },
          },

          [`${componentCls}-item-meta-description`]: {
            color: colorTextDescription,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
          },
        },

        [`${componentCls}-item-action`]: {
          flex: '0 0 auto',
          marginInlineStart: token.marginXXL,
          padding: 0,
          fontSize: 0,
          listStyle: 'none',

          [`& > li`]: {
            position: 'relative',
            display: 'inline-block',
            padding: `0 ${unit(paddingXS)}`,
            color: colorTextDescription,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            textAlign: 'center',

            [`&:first-child`]: {
              paddingInlineStart: 0,
            },
          },

          [`${componentCls}-item-action-split`]: {
            position: 'absolute',
            insetBlockStart: '50%',
            insetInlineEnd: 0,
            width: lineWidth,
            height: token
              .calc(token.fontSize)
              .mul(token.lineHeight)
              .sub(token.calc(token.marginXXS).mul(2).equal())
              .equal(),
            transform: 'translateY(-50%)',
            backgroundColor: token.colorSplit,
          },
        },
      },

      [`${componentCls}-empty`]: {
        padding: `${unit(padding)} 0`,
        color: colorTextDescription,
        fontSize: token.fontSizeSM,
        textAlign: 'center',
      },

      [`${componentCls}-empty-text`]: {
        padding,
        color: token.colorTextDisabled,
        fontSize: token.fontSize,
        textAlign: 'center',
      },

      // ============================ without flex ============================
      [`${componentCls}-item-no-flex`]: {
        display: 'block',
      },
    },
    [`${componentCls}-grid ${antCls}-col > ${componentCls}-item`]: {
      display: 'block',
      maxWidth: '100%',
      marginBlockEnd: margin,
      paddingBlock: 0,
      borderBlockEnd: 'none',
    },
    [`${componentCls}-vertical ${componentCls}-item`]: {
      alignItems: 'initial',

      [`${componentCls}-item-main`]: {
        display: 'block',
        flex: 1,
      },

      [`${componentCls}-item-extra`]: {
        marginInlineStart: marginLG,
      },

      [`${componentCls}-item-meta`]: {
        marginBlockEnd: padding,

        [`${componentCls}-item-meta-title`]: {
          marginBlockEnd: paddingSM,
          color: colorText,
          fontSize: token.fontSizeLG,
          lineHeight: token.lineHeightLG,
        },
      },

      [`${componentCls}-item-action`]: {
        marginBlockStart: padding,
        marginInlineStart: 'auto',

        '> li': {
          padding: `0 ${unit(padding)}`,

          [`&:first-child`]: {
            paddingInlineStart: 0,
          },
        },
      },
    },

    [`${componentCls}-split ${componentCls}-item`]: {
      borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,

      [`&:last-child`]: {
        borderBlockEnd: 'none',
      },
    },

    [`${componentCls}-split ${componentCls}-header`]: {
      borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
    },
    [`${componentCls}-split${componentCls}-empty ${componentCls}-footer`]: {
      borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
    },
    [`${componentCls}-loading ${componentCls}-spin-nested-loading`]: {
      minHeight: controlHeight,
    },
    [`${componentCls}-split${componentCls}-something-after-last-item ${antCls}-spin-container > ${componentCls}-items > ${componentCls}-item:last-child`]:
      {
        borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      },
    [`${componentCls}-lg ${componentCls}-item`]: {
      padding: listItemPaddingLG,
    },
    [`${componentCls}-sm ${componentCls}-item`]: {
      padding: listItemPaddingSM,
    },
    // Horizontal
    [`${componentCls}:not(${componentCls}-vertical)`]: {
      [`${componentCls}-item-no-flex`]: {
        [`${componentCls}-item-action`]: {
          float: 'right',
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'List',
  token => {
    const listToken = mergeToken<ListToken>(token, {
      listBorderedCls: `${token.componentCls}-bordered`,
      minHeight: token.controlHeightLG,
      listItemPadding: `${unit(token.paddingContentVertical)} ${unit(token.paddingContentHorizontalLG)}`,
      listItemPaddingSM: `${unit(token.paddingContentVerticalSM)} ${unit(token.paddingContentHorizontal)}`,
      listItemPaddingLG: `${unit(token.paddingContentVerticalLG)} ${unit(token.paddingContentHorizontalLG)}`,
    });

    return [genBaseStyle(listToken), genBorderedStyle(listToken), genResponsiveStyle(listToken)];
  },
  {
    contentWidth: 220,
  },
);
