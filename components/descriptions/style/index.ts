import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';

interface DescriptionsToken extends FullToken<'Descriptions'> {
  descriptionsTitleMarginBottom: number | string;
  descriptionsExtraColor: string;
  descriptionItemPaddingBottom: number;
  descriptionsDefaultPadding: string;
  descriptionsBg: string;
  descriptionsMiddlePadding: string;
  descriptionsSmallPadding: string;
  descriptionsItemLabelColonMarginRight: number;
  descriptionsItemLabelColonMarginLeft: number | string;
}

const genBorderedStyle = (token: DescriptionsToken): CSSObject => {
  const {
    componentCls,
    descriptionsSmallPadding,
    descriptionsDefaultPadding,
    descriptionsMiddlePadding,
    descriptionsBg,
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
        backgroundColor: descriptionsBg,
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
    descriptionsExtraColor,
    descriptionItemPaddingBottom,
    descriptionsItemLabelColonMarginRight,
    descriptionsItemLabelColonMarginLeft,
    descriptionsTitleMarginBottom,
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
        marginBottom: descriptionsTitleMarginBottom,
      },
      [`${componentCls}-title`]: {
        ...textEllipsis,
        flex: 'auto',
        color: token.colorText,
        fontWeight: token.fontWeightStrong,
        fontSize: token.fontSizeLG,
        lineHeight: token.lineHeightLG,
      },
      [`${componentCls}-extra`]: {
        marginInlineStart: 'auto',
        color: descriptionsExtraColor,
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
          paddingBottom: descriptionItemPaddingBottom,
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
          marginInline: `${unit(descriptionsItemLabelColonMarginLeft)} ${unit(descriptionsItemLabelColonMarginRight)}`,
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
        color: token.colorText,
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
// ============================== Export ==============================
export default genComponentStyleHook('Descriptions', token => {
  const descriptionsBg = token.colorFillAlter;
  const descriptionsTitleMarginBottom = token.calc(token.fontSizeSM).mul(token.lineHeightSM).equal();
  const descriptionsExtraColor = token.colorText;
  const descriptionsSmallPadding = `${unit(token.paddingXS)} ${unit(token.padding)}`;
  const descriptionsDefaultPadding = `${unit(token.padding)} ${unit(token.paddingLG)}`;
  const descriptionsMiddlePadding = `${unit(token.paddingSM)} ${unit(token.paddingLG)}`;
  const descriptionItemPaddingBottom = token.padding;
  const descriptionsItemLabelColonMarginRight = token.marginXS;
  const descriptionsItemLabelColonMarginLeft = token.calc(token.marginXXS).div(2).equal();

  const descriptionToken = mergeToken<DescriptionsToken>(token, {
    descriptionsBg,
    descriptionsTitleMarginBottom,
    descriptionsExtraColor,
    descriptionItemPaddingBottom,
    descriptionsSmallPadding,
    descriptionsDefaultPadding,
    descriptionsMiddlePadding,
    descriptionsItemLabelColonMarginRight,
    descriptionsItemLabelColonMarginLeft,
  });

  return [genDescriptionStyles(descriptionToken)];
});
