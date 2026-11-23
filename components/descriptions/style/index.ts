import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { GlobalToken } from '../../theme/interface';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';

export interface ComponentToken {
  /**
   * @desc 标签背景色
   * @descEN Background color of label
   */
  labelBg: string;
  /**
   * @desc 标题文字颜色
   * @descEN Text color of title
   */
  titleColor: string;
  /**
   * @desc 标题下间距
   * @descEN Bottom margin of title
   */
  titleMarginBottom: number;
  /**
   * @desc 子项下间距
   * @descEN Bottom padding of item
   */
  itemPaddingBottom: number;
  /**
   * @desc 子项结束间距
   * @descEN End padding of item
   */
  itemPaddingEnd: number;
  /**
   * @desc 冒号右间距
   * @descEN Right margin of colon
   */
  colonMarginRight: number;
  /**
   * @desc 冒号左间距
   * @descEN Left margin of colon
   */
  colonMarginLeft: number;
  /**
   * @desc 内容区域文字颜色
   * @descEN Text color of content
   */
  contentColor: string;
  /**
   * @desc 额外区域文字颜色
   * @descEN Text color of extra area
   */
  extraColor: string;
}

interface DescriptionsToken extends FullToken<'Descriptions'>, ComponentToken {
  descriptionsDefaultPadding: string;
  descriptionsMiddlePadding: string;
  descriptionsSmallPadding: string;
}

const genBorderedStyle = (token: DescriptionsToken): CSSObject => {
  const {
    componentCls,
    descriptionsSmallPadding,
    descriptionsDefaultPadding,
    descriptionsMiddlePadding,
    labelBg,
  } = token;
  return {
    [`&${componentCls}-bordered`]: {
      [`${componentCls}-view`]: {
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        '> table': {
          tableLayout: 'auto',
          borderCollapse: 'collapse',
        },
      },
      [`${componentCls}-item-label, ${componentCls}-item-content`]: {
        padding: descriptionsDefaultPadding,
        borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        '&:last-child': {
          borderInlineEnd: 'none',
        },
      },
      [`${componentCls}-item-label`]: {
        backgroundColor: labelBg,
        '&::after': {
          display: 'none',
        },
      },
      [`${componentCls}-row`]: {
        borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        '&:last-child': {
          borderBottom: 'none',
        },
      },
      [`&${componentCls}-middle`]: {
        [`${componentCls}-item-label, ${componentCls}-item-content`]: {
          padding: descriptionsMiddlePadding,
        },
      },
      [`&${componentCls}-small`]: {
        [`${componentCls}-item-label, ${componentCls}-item-content`]: {
          padding: descriptionsSmallPadding,
        },
      },
    },
  };
};

const genDescriptionStyles: GenerateStyle<DescriptionsToken> = (token: DescriptionsToken) => {
  const {
    componentCls,
    extraColor,
    itemPaddingBottom,
    itemPaddingEnd,
    colonMarginRight,
    colonMarginLeft,
    titleMarginBottom,
  } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      ...genBorderedStyle(token),
      [`&-rtl`]: {
        direction: 'rtl',
      },
      [`${componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: titleMarginBottom,
      },
      [`${componentCls}-title`]: {
        ...textEllipsis,
        flex: 'auto',
        color: token.titleColor,
        fontWeight: token.fontWeightStrong,
        fontSize: token.fontSizeLG,
        lineHeight: token.lineHeightLG,
      },
      [`${componentCls}-extra`]: {
        marginInlineStart: 'auto',
        color: extraColor,
        fontSize: token.fontSize,
      },
      [`${componentCls}-view`]: {
        width: '100%',
        borderRadius: token.borderRadiusLG,
        table: {
          width: '100%',
          tableLayout: 'fixed',
        },
      },
      [`${componentCls}-row`]: {
        '> th, > td': {
          paddingBottom: itemPaddingBottom,
          paddingInlineEnd: itemPaddingEnd,
        },
        '> th:last-child, > td:last-child': {
          paddingInlineEnd: 0,
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      },
      [`${componentCls}-item-label`]: {
        color: token.colorText,
        fontWeight: 'normal',
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        textAlign: `start`,

        '&::after': {
          content: '":"',
          position: 'relative',
          top: -0.5, // magic for position
          marginInline: `${unit(colonMarginLeft)} ${unit(colonMarginRight)}`,
        },

        [`&${componentCls}-item-no-colon::after`]: {
          content: '""',
        },
      },
      [`${componentCls}-item-no-label`]: {
        '&::after': {
          margin: 0,
          content: '""',
        },
      },
      [`${componentCls}-item-content`]: {
        display: 'table-cell',
        flex: 1,
        color: token.contentColor,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      },
      [`${componentCls}-item`]: {
        paddingBottom: 0,
        verticalAlign: 'top',
        '&-container': {
          display: 'flex',
          [`${componentCls}-item-label`]: {
            display: 'inline-flex',
            alignItems: 'baseline',
          },
          [`${componentCls}-item-content`]: {
            display: 'inline-flex',
            alignItems: 'baseline',
          },
        },
      },
      '&-middle': {
        [`${componentCls}-row`]: {
          '> th, > td': {
            paddingBottom: token.paddingSM,
          },
        },
      },
      '&-small': {
        [`${componentCls}-row`]: {
          '> th, > td': {
            paddingBottom: token.paddingXS,
          },
        },
      },
    },
  };
};

export const prepareComponentToken = (token: GlobalToken): ComponentToken => ({
  labelBg: token.colorFillAlter,
  titleColor: token.colorText,
  titleMarginBottom: token.fontSizeSM * token.lineHeightSM,
  itemPaddingBottom: token.padding,
  itemPaddingEnd: token.padding,
  colonMarginRight: token.marginXS,
  colonMarginLeft: token.marginXXS / 2,
  contentColor: token.colorText,
  extraColor: token.colorText,
});

// ============================== Export ==============================
export default genComponentStyleHook(
  'Descriptions',
  token => {
    const descriptionsSmallPadding = `${unit(token.paddingXS)} ${unit(token.padding)}`;
    const descriptionsDefaultPadding = `${unit(token.padding)} ${unit(token.paddingLG)}`;
    const descriptionsMiddlePadding = `${unit(token.paddingSM)} ${unit(token.paddingLG)}`;

    const descriptionToken = mergeToken<DescriptionsToken>(token, {
      descriptionsSmallPadding,
      descriptionsDefaultPadding,
      descriptionsMiddlePadding,
    });

    return [genDescriptionStyles(descriptionToken)];
  },
  prepareComponentToken,
);
