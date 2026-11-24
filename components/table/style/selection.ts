import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genSelectionStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    antCls,
    iconCls,
    fontSizeIcon,
    padding,
    paddingXS,
    tableHeaderIconColor,
    tableHeaderIconColorHover,
    tableSelectionColumnWidth,
    calc,
  } = token;
  return {
    [`${componentCls}-wrapper`]: {
      // ========================== Selections ==========================
      [`${componentCls}-selection-col`]: {
        width: tableSelectionColumnWidth,
        [`&${componentCls}-selection-col-with-dropdown`]: {
          width: calc(tableSelectionColumnWidth)
            .add(fontSizeIcon)
            .add(calc(padding).div(4))
            .equal(),
        },
      },

      [`${componentCls}-bordered ${componentCls}-selection-col`]: {
        width: calc(tableSelectionColumnWidth).add(calc(paddingXS).mul(2)).equal(),
        [`&${componentCls}-selection-col-with-dropdown`]: {
          width: calc(tableSelectionColumnWidth)
            .add(fontSizeIcon)
            .add(calc(padding).div(4))
            .add(calc(paddingXS).mul(2))
            .equal(),
        },
      },

      [`
        table tr th${componentCls}-selection-column,
        table tr td${componentCls}-selection-column,
        ${componentCls}-selection-column
      `]: {
        paddingInlineEnd: paddingXS,
        paddingInlineStart: paddingXS,
        textAlign: 'center',

        [`${antCls}-radio-wrapper`]: {
          marginInlineEnd: 0,
        },
      },

      [`table tr th${componentCls}-selection-column${componentCls}-cell-fix-left`]: {
        zIndex: calc(token.zIndexTableFixed).add(1).equal({ unit: false }),
      },

      [`table tr th${componentCls}-selection-column::after`]: {
        backgroundColor: 'transparent !important',
      },

      [`${componentCls}-selection`]: {
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
      },

      [`${componentCls}-selection-extra`]: {
        position: 'absolute',
        top: 0,
        zIndex: 1,
        cursor: 'pointer',
        transition: `all ${token.motionDurationSlow}`,
        marginInlineStart: '100%',
        paddingInlineStart: unit(calc(token.tablePaddingHorizontal).div(4).equal()),

        [iconCls]: {
          color: tableHeaderIconColor,
          fontSize: fontSizeIcon,
          verticalAlign: 'baseline',

          '&:hover': {
            color: tableHeaderIconColorHover,
          },
        },
      },
    },
  };
};

export default genSelectionStyle;
