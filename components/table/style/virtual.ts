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
    tablePaddingHorizontal,
    paddingContentVerticalLG,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
  } = token;

  const tableBorder = `${unit(lineWidth)} ${lineType} ${tableBorderColor}`;

  return {
    [`${componentCls}-wrapper`]: {
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
              padding: `${unit(paddingContentVerticalLG)} ${unit(tablePaddingHorizontal)}`,
              borderBottom: tableBorder,
              overflowWrap: 'break-word',
              transition: `background-color ${motionDurationMid}`,
            },

            '&:hover': {
              [`> ${componentCls}-cell`]: {
                background: tableRowHoverBg,
              },
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
      },

      [`${componentCls}-bordered`]: {
        [`${componentCls}-tbody-virtual`]: {
          [`${componentCls}-cell`]: {
            borderInlineEnd: tableBorder,
          },
        },
      },
    },
  };
};

export default genVirtualStyle;
