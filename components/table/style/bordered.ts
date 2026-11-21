import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genBorderedStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls } = token;
  const tableBorder = `${unit(token.lineWidth)} ${token.lineType} ${token.tableBorderColor}`;

  const getSizeBorderStyle = (
    size: 'small' | 'middle',
    paddingVertical: number,
    paddingHorizontal: number,
  ) => ({
    [`&${componentCls}-${size}`]: {
      [`> ${componentCls}-container`]: {
        [`> ${componentCls}-content, > ${componentCls}-body`]: {
          '> table > tbody > tr > td': {
            [`> ${componentCls}-expanded-row-fixed`]: {
              margin: `${unit(token.calc(paddingVertical).mul(-1).equal())} -${unit(token.calc(paddingHorizontal).add(token.lineWidth).equal())}`,
            },
          },
        },
      },
    },
  });

  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}${componentCls}-bordered`]: {
        // ============================ Title =============================
        [`> ${componentCls}-title`]: {
          border: tableBorder,
          borderBottom: 0,
        },

        // ============================ Content ============================
        [`> ${componentCls}-container`]: {
          borderInlineStart: tableBorder,

          [`
            > ${componentCls}-content,
            > ${componentCls}-header,
            > ${componentCls}-body,
            > ${componentCls}-summary
          `]: {
            '> table': {
              // ============================= Cell =============================
              [`
                > thead > tr > th,
                > tbody > tr > td,
                > tfoot > tr > th,
                > tfoot > tr > td
              `]: {
                borderInlineEnd: tableBorder,
              },

              // ============================ Header ============================
              '> thead': {
                '> tr:not(:last-child) > th': {
                  borderBottom: tableBorder,
                },

                '> tr > th::before': {
                  backgroundColor: 'transparent !important',
                },
              },

              // Fixed right should provides additional border
              [`
                > thead > tr,
                > tbody > tr,
                > tfoot > tr
              `]: {
                [`> ${componentCls}-cell-fix-right-first::after`]: {
                  borderInlineEnd: tableBorder,
                },
              },

              // ========================== Expandable ==========================
              '> tbody > tr > td': {
                [`> ${componentCls}-expanded-row-fixed`]: {
                  margin: `${unit(token.calc(token.tablePaddingVertical).mul(-1).equal())} -${
                    token.calc(token.tablePaddingHorizontal).add(token.lineWidth).equal()
                  }px`,

                  '&::after': {
                    position: 'absolute',
                    top: 0,
                    insetInlineEnd: token.lineWidth,
                    bottom: 0,
                    borderInlineEnd: tableBorder,
                    content: '""',
                  },
                },
              },
            },
          },

          [`
            > ${componentCls}-content,
            > ${componentCls}-header
          `]: {
            '> table': {
              borderTop: tableBorder,
            },
          },
        },

        // ============================ Scroll ============================
        [`&${componentCls}-scroll-horizontal`]: {
          [`> ${componentCls}-container > ${componentCls}-body`]: {
            '> table > tbody': {
              [`
                > tr${componentCls}-expanded-row,
                > tr${componentCls}-placeholder
              `]: {
                '> td': {
                  borderInlineEnd: 0,
                },
              },
            },
          },
        },

        // ============================ Size ============================
        ...getSizeBorderStyle(
          'middle',
          token.tablePaddingVerticalMiddle,
          token.tablePaddingHorizontalMiddle,
        ),
        ...getSizeBorderStyle(
          'small',
          token.tablePaddingVerticalSmall,
          token.tablePaddingHorizontalSmall,
        ),

        // ============================ Footer ============================
        [`> ${componentCls}-footer`]: {
          border: tableBorder,
          borderTop: 0,
        },
      },

      // ============================ Nested ============================
      [`${componentCls}-cell`]: {
        [`${componentCls}-container:first-child`]: {
          // :first-child to avoid the case when bordered and title is set
          borderTop: 0,
        },
        // https://github.com/ant-design/ant-design/issues/35577
        '&-scrollbar:not([rowspan])': {
          boxShadow: `0 ${unit(token.lineWidth)} 0 ${unit(token.lineWidth)} ${token.tableHeaderBg}`,
        },
      },
    },
  };
};

export default genBorderedStyle;
