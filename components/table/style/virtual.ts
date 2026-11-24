import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genVirtualStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    motionDurationMid,
    lineWidth,
    lineType,
    tableBorderColor,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
  } = token;

  const tableBorder = `${unit(lineWidth)} ${lineType} ${tableBorderColor}`;
  const rowCellCls = `${componentCls}-expanded-row-cell`;

  return {
    [`${componentCls}-wrapper`]: {
      // ========================== Row ==========================
      [`${componentCls}-tbody-virtual`]: {
        [`${componentCls}-tbody-virtual-scrollbar`]: {
          cursor: 'pointer',

          '&:hover': {
            backgroundColor: token.colorFillQuaternary,
          },
        },

        [`${componentCls}-tbody-virtual-holder-inner`]: {
          [`& > ${componentCls}-row, & > div:not(${componentCls}-row) > ${componentCls}-row`]: {
            display: 'flex',
            boxSizing: 'border-box',
            width: '100%',

            [`> ${componentCls}-cell`]: {
              boxSizing: 'border-box',
              alignContent: 'center',
            },

            [`&${componentCls}-row-selected`]: {
              [`> ${componentCls}-cell`]: {
                background: tableSelectedRowBg,
              },
              '&:hover': {
                [`> ${componentCls}-cell`]: {
                  background: tableSelectedRowHoverBg,
                },
              },
            },
          },
        },

        [`${componentCls}-cell`]: {
          borderBottom: tableBorder,
          transition: `background-color ${motionDurationMid}`,
        },

        [`${componentCls}-expanded-row`]: {
          [`${rowCellCls}${rowCellCls}-fixed`]: {
            position: 'sticky',
            insetInlineStart: 0,
            overflow: 'hidden',
            width: `calc(var(--virtual-width) - ${unit(lineWidth)})`,
            borderInlineEnd: 'none',
          },
        },
      },

      [`${componentCls}:not(${componentCls}-row-hover-disabled) ${componentCls}-tbody-virtual-holder-inner`]:
        {
          [`& > ${componentCls}-row:hover, & > div:not(${componentCls}-row) > ${componentCls}-row:hover`]:
            {
              [`> ${componentCls}-cell`]: {
                background: tableRowHoverBg,
              },
            },
          [`& > ${componentCls}-row${componentCls}-row-selected:hover, & > div:not(${componentCls}-row) > ${componentCls}-row${componentCls}-row-selected:hover`]:
            {
              [`> ${componentCls}-cell`]: {
                background: tableSelectedRowHoverBg,
              },
            },
        },

      // ======================== Border =========================
      [`${componentCls}-bordered`]: {
        [`${componentCls}-tbody-virtual`]: {
          '&:after': {
            content: '""',
            insetInline: 0,
            bottom: 0,
            borderBottom: tableBorder,
            position: 'absolute',
          },

          [`${componentCls}-cell`]: {
            borderInlineEnd: tableBorder,
          },
        },

        // Empty placeholder
        [`&${componentCls}-virtual`]: {
          [`${componentCls}-placeholder ${componentCls}-cell`]: {
            borderInlineEnd: tableBorder,
            borderBottom: tableBorder,
          },
        },
      },
    },
  };
};

export default genVirtualStyle;
