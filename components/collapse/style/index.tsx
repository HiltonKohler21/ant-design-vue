import { unit } from '../../_util/cssinjs';
import { genCollapseMotion } from '../../style/motion';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, resetIcon } from '../../style';

export interface ComponentToken {
  /**
   * @desc 折叠面板头部内边距
   * @descEN Padding of header
   */
  headerPadding: string | number;
  /**
   * @desc 折叠面板头部背景
   * @descEN Background of header
   */
  headerBg: string;
  /**
   * @desc 折叠面板内容内边距
   * @descEN Padding of content
   */
  contentPadding: string | number;
  /**
   * @desc 折叠面板内容背景
   * @descEN Background of content
   */
  contentBg: string;
}

type CollapseToken = FullToken<'Collapse'> & {
  collapseContentBg: string;
  collapseHeaderBg: string;
  collapseHeaderPadding: string | number;
  collapsePanelBorderRadius: number;
  collapseContentPaddingHorizontal: number;
};

export const genBaseStyle: GenerateStyle<CollapseToken> = token => {
  const {
    componentCls,
    collapseContentBg,
    collapseHeaderBg,
    collapseHeaderPadding,
    collapsePanelBorderRadius,
    contentPadding,

    lineWidth,
    lineType,
    colorBorder,
    colorText,
    colorTextHeading,
    colorTextDisabled,
    fontSize,
    lineHeight,
    marginSM,
    paddingSM,
    motionDurationSlow,
    fontSizeIcon,
  } = token;

  const borderBase = `${unit(lineWidth)} ${lineType} ${colorBorder}`;

  return {
    [componentCls]: {
      ...resetComponent(token),
      backgroundColor: collapseHeaderBg,
      border: borderBase,
      borderBottom: 0,
      borderRadius: `${unit(collapsePanelBorderRadius)}`,

      [`&-rtl`]: {
        direction: 'rtl',
      },

      '&-small': {
        [`> ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            padding: `${unit(token.paddingXS)} ${unit(token.paddingSM)}`,
            fontSize: token.fontSize,
          },
          [`> ${componentCls}-content > ${componentCls}-content-box`]: {
            padding: token.paddingSM,
          },
        },
      },

      '&-large': {
        [`> ${componentCls}-item`]: {
          fontSize: token.fontSizeLG,
          lineHeight: token.lineHeightLG,
          [`> ${componentCls}-header`]: {
            padding: `${unit(token.padding)} ${unit(token.paddingLG)}`,
            fontSize: token.fontSizeLG,

            [`> ${componentCls}-expand-icon`]: {
              height: token.calc(token.fontSizeLG).mul(token.lineHeightLG).equal(),
            },
          },
          [`> ${componentCls}-content > ${componentCls}-content-box`]: {
            padding: token.paddingLG,
          },
        },
      },

      [`& > ${componentCls}-item`]: {
        borderBottom: borderBase,
        [`&:last-child`]: {
          [`
            &,
            & > ${componentCls}-header`]: {
            borderRadius: `0 0 ${unit(collapsePanelBorderRadius)} ${unit(
              collapsePanelBorderRadius,
            )}`,
          },
        },

        [`> ${componentCls}-header`]: {
          position: 'relative', // Compatible with old version of antd, should remove in next version
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          padding: collapseHeaderPadding,
          color: colorTextHeading,
          lineHeight,
          cursor: 'pointer',
          transition: `all ${motionDurationSlow}, visibility 0s`,

          [`> ${componentCls}-header-text`]: {
            flex: 'auto',
          },

          '&:focus': {
            outline: 'none',
          },

          // >>>>> Arrow
          [`${componentCls}-expand-icon`]: {
            height: token.calc(fontSize).mul(lineHeight).equal(),
            display: 'flex',
            alignItems: 'center',
            paddingInlineEnd: marginSM,
          },

          [`${componentCls}-arrow`]: {
            ...resetIcon(),
            fontSize: fontSizeIcon,

            svg: {
              transition: `transform ${motionDurationSlow}`,
            },
          },

          // >>>>> Text
          [`${componentCls}-header-text`]: {
            marginInlineEnd: 'auto',

            '> svg': {
              display: 'inline-block',
              verticalAlign: 'middle',
              marginBlockEnd: '0.2em',
            },
          },
        },

        [`${componentCls}-header-collapsible-only`]: {
          cursor: 'default',

          [`${componentCls}-header-text`]: {
            flex: 'none',
            cursor: 'pointer',
          },
          [`${componentCls}-expand-icon`]: {
            cursor: 'pointer',
          },
        },

        [`${componentCls}-icon-collapsible-only`]: {
          cursor: 'default',

          [`${componentCls}-expand-icon`]: {
            cursor: 'pointer',
          },
        },

        [`&${componentCls}-no-arrow`]: {
          [`> ${componentCls}-header`]: {
            paddingInlineStart: paddingSM,
          },
        },
      },

      [`${componentCls}-content`]: {
        color: colorText,
        backgroundColor: collapseContentBg,
        borderTop: borderBase,

        [`& > ${componentCls}-content-box`]: {
          padding: contentPadding,
        },

        [`&-hidden`]: {
          display: 'none',
        },
      },

      [`${componentCls}-item:last-child`]: {
        [`> ${componentCls}-content`]: {
          borderRadius: `0 0 ${unit(collapsePanelBorderRadius)} ${unit(collapsePanelBorderRadius)}`,
        },
      },

      [`& ${componentCls}-item-disabled > ${componentCls}-header`]: {
        [`
          &,
          & > .arrow
        `]: {
          color: colorTextDisabled,
          cursor: 'not-allowed',
        },
      },

      // ========================== Icon Position ==========================
      [`&${componentCls}-icon-position-end`]: {
        [`& > ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            [`${componentCls}-expand-icon`]: {
              order: 1,
              paddingInlineEnd: 0,
              paddingInlineStart: marginSM,
            },
          },
        },
      },
    },
  };
};

const genArrowStyle: GenerateStyle<CollapseToken> = token => {
  const { componentCls } = token;

  const fixedSelector = `> ${componentCls}-item > ${componentCls}-header ${componentCls}-arrow svg`;

  return {
    [`${componentCls}-rtl`]: {
      [fixedSelector]: {
        transform: `rotate(180deg)`,
      },
    },
  };
};

const genBorderlessStyle: GenerateStyle<CollapseToken> = token => {
  const {
    componentCls,
    collapseHeaderBg,
    paddingXXS,

    colorBorder,
  } = token;

  return {
    [`${componentCls}-borderless`]: {
      backgroundColor: collapseHeaderBg,
      border: 0,

      [`> ${componentCls}-item`]: {
        borderBottom: `1px solid ${colorBorder}`,
      },

      [`
        > ${componentCls}-item:last-child,
        > ${componentCls}-item:last-child ${componentCls}-header
      `]: {
        borderRadius: 0,
      },

      [`> ${componentCls}-item:last-child`]: {
        borderBottom: 0,
      },

      [`> ${componentCls}-item > ${componentCls}-content`]: {
        backgroundColor: 'transparent',
        borderTop: 0,
      },

      [`> ${componentCls}-item > ${componentCls}-content > ${componentCls}-content-box`]: {
        paddingTop: paddingXXS,
      },
    },
  };
};

const genGhostStyle: GenerateStyle<CollapseToken> = token => {
  const { componentCls, paddingSM } = token;

  return {
    [`${componentCls}-ghost`]: {
      backgroundColor: 'transparent',
      border: 0,
      [`> ${componentCls}-item`]: {
        borderBottom: 0,
        [`> ${componentCls}-content`]: {
          backgroundColor: 'transparent',
          border: 0,
          [`> ${componentCls}-content-box`]: {
            paddingBlock: paddingSM,
          },
        },
      },
    },
  };
};

export default genComponentStyleHook(
  'Collapse',
  token => {
    const collapseToken = mergeToken<CollapseToken>(token, {
      collapseContentBg: token.contentBg,
      collapseHeaderBg: token.headerBg,
      collapseHeaderPadding: token.headerPadding,
      collapsePanelBorderRadius: token.borderRadiusLG,
      collapseContentPaddingHorizontal: 16, // Fixed value
    });

    return [
      genBaseStyle(collapseToken),
      genBorderlessStyle(collapseToken),
      genGhostStyle(collapseToken),
      genArrowStyle(collapseToken),
      genCollapseMotion(collapseToken),
    ];
  },
  token => ({
    headerPadding: `${token.paddingSM}px ${token.padding}px`,
    headerBg: token.colorFillAlter,
    contentPadding: `${token.padding}px 16px`,
    contentBg: token.colorBgContainer,
  }),
);
