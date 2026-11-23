import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genBorderedStyle from './bordered';
import genEllipsisStyle from './ellipsis';
import genEmptyStyle from './empty';
import genExpandStyle from './expand';
import genFilterStyle from './filter';
import genFixedStyle from './fixed';
import genPaginationStyle from './pagination';
import genRadiusStyle from './radius';
import genRtlStyle from './rtl';
import genSelectionStyle from './selection';
import genSizeStyle from './size';
import genResizeStyle from './resize';
import genSorterStyle from './sorter';
import genStickyStyle from './sticky';
import genSummaryStyle from './summary';
import genVirtualStyle from './virtual';
import { clearFix, resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 表头背景
   * @descEN Background of table header
   */
  headerBg: string;
  /**
   * @desc 表头文字颜色
   * @descEN Color of table header text
   */
  headerColor: string;
  /**
   * @desc 表头排序激活态背景色
   * @descEN Background color of table header when sorted
   */
  headerSortActiveBg: string;
  /**
   * @desc 表头排序激活态悬浮背景色
   * @descEN Background color of table header when sorted and hovered
   */
  headerSortHoverBg: string;
  /**
   * @desc 表格排序列背景色
   * @descEN Background color of table sorted column
   */
  bodySortBg: string;
  /**
   * @desc 表格行悬浮背景色
   * @descEN Background color of table hovered row
   */
  rowHoverBg: string;
  /**
   * @desc 表格行选中背景色
   * @descEN Background color of table selected row
   */
  rowSelectedBg: string;
  /**
   * @desc 表格行选中悬浮背景色
   * @descEN Background color of table selected row when hovered
   */
  rowSelectedHoverBg: string;
  /**
   * @desc 表格行展开背景色
   * @descEN Background color of table expanded row
   */
  rowExpandedBg: string;
  /**
   * @desc 单元格纵向内间距
   * @descEN Vertical padding of table cell
   */
  cellPaddingBlock: number;
  /**
   * @desc 单元格横向内间距（默认大尺寸）
   * @descEN Horizontal padding of table cell (large size by default)
   */
  cellPaddingInline: number;
  /**
   * @desc 单元格纵向内间距（中等尺寸）
   * @descEN Vertical padding of table cell (middle size)
   */
  cellPaddingBlockMD: number;
  /**
   * @desc 单元格横向内间距（中等尺寸）
   * @descEN Horizontal padding of table cell (middle size)
   */
  cellPaddingInlineMD: number;
  /**
   * @desc 单元格纵向内间距（小尺寸）
   * @descEN Vertical padding of table cell (small size)
   */
  cellPaddingBlockSM: number;
  /**
   * @desc 单元格横向内间距（小尺寸）
   * @descEN Horizontal padding of table cell (small size)
   */
  cellPaddingInlineSM: number;
  /**
   * @desc 表格边框/分割线颜色
   * @descEN Border color of table
   */
  borderColor: string;
  /**
   * @desc 表头圆角
   * @descEN Border radius of table header
   */
  headerBorderRadius: number;
  /**
   * @desc 表格底部背景色
   * @descEN Background of footer
   */
  footerBg: string;
  /**
   * @desc 表格底部文字颜色
   * @descEN Color of footer text
   */
  footerColor: string;
  /**
   * @desc 单元格文字大小（默认大尺寸）
   * @descEN Font size of table cell (large size by default)
   */
  cellFontSize: number;
  /**
   * @desc 单元格文字大小（中等尺寸）
   * @descEN Font size of table cell (middle size)
   */
  cellFontSizeMD: number;
  /**
   * @desc 单元格文字大小（小尺寸）
   * @descEN Font size of table cell (small size)
   */
  cellFontSizeSM: number;
  /**
   * @desc 表头分割线颜色
   * @descEN Split border color of table header
   */
  headerSplitColor: string;
  /**
   * @desc 固定表头排序激活态背景色
   * @descEN Background color of fixed table header when sorted
   */
  fixedHeaderSortActiveBg: string;
  /**
   * @desc 表头过滤按钮悬浮背景色
   * @descEN Background color of table header filter button when hovered
   */
  headerFilterHoverBg: string;
  /**
   * @desc 过滤下拉菜单选项背景
   * @descEN Background of filter dropdown menu item
   */
  filterDropdownMenuBg: string;
  /**
   * @desc 过滤下拉菜单颜色
   * @descEN Color of filter dropdown
   */
  filterDropdownBg: string;
  /**
   * @desc 展开按钮背景色
   * @descEN Background of expand button
   */
  expandIconBg: string;
  /**
   * @desc 选择列宽度
   * @descEN Width of selection column
   */
  selectionColumnWidth: number | string;
  /**
   * @desc Sticky 模式下滚动条背景色
   * @descEN Background of sticky scrollbar
   */
  stickyScrollBarBg: string;
  /**
   * @desc Sticky 模式下滚动条圆角
   * @descEN Border radius of sticky scrollbar
   */
  stickyScrollBarBorderRadius: number;
}

export interface TableToken extends FullToken<'Table'> {
  tableFontSize: number;
  tableBg: string;
  tableRadius: number;
  tablePaddingHorizontal: number;
  tablePaddingVertical: number;
  tablePaddingHorizontalMiddle: number;
  tablePaddingVerticalMiddle: number;
  tablePaddingHorizontalSmall: number;
  tablePaddingVerticalSmall: number;
  tableBorderColor: string;
  tableHeaderTextColor: string;
  tableHeaderBg: string;
  tableFooterTextColor: string;
  tableFooterBg: string;
  tableHeaderCellSplitColor: string;
  tableHeaderSortBg: string;
  tableHeaderSortHoverBg: string;
  tableHeaderIconColor: string;
  tableHeaderIconColorHover: string;
  tableBodySortBg: string;
  tableFixedHeaderSortActiveBg: string;
  tableHeaderFilterActiveBg: string;
  tableFilterDropdownBg: string;
  tableFilterDropdownHeight: number;
  tableRowHoverBg: string;
  tableSelectedRowBg: string;
  tableSelectedRowHoverBg: string;

  tableFontSizeMiddle: number;
  tableFontSizeSmall: number;
  tableSelectionColumnWidth: number | string;
  tableExpandIconBg: string;
  tableExpandColumnWidth: number;
  tableExpandedRowBg: string;
  tableFilterDropdownWidth: number;
  tableFilterDropdownSearchWidth: number;

  // Z-Index
  zIndexTableFixed: number;
  zIndexTableSticky: number;

  // Virtual Scroll Bar
  tableScrollThumbSize: number;
  tableScrollThumbBg: string;
  tableScrollThumbBgHover: string;
  tableScrollBg: string;
}

const genTableStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    fontWeightStrong,
    tablePaddingVertical,
    tablePaddingHorizontal,
    lineWidth,
    lineType,
    tableBorderColor,
    tableFontSize,
    tableBg,
    tableRadius,
    tableHeaderTextColor,
    motionDurationMid,
    tableHeaderBg,
    tableHeaderCellSplitColor,
    tableRowHoverBg,
    tableSelectedRowBg,
    tableSelectedRowHoverBg,
    tableFooterTextColor,
    tableFooterBg,
  } = token;
  const tableBorder = `${unit(lineWidth)} ${lineType} ${tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: {
      clear: 'both',
      maxWidth: '100%',
      ...clearFix(),

      [componentCls]: {
        ...resetComponent(token),
        fontSize: tableFontSize,
        background: tableBg,
        borderRadius: `${unit(tableRadius)} ${unit(tableRadius)} 0 0`,
      },
      // https://github.com/ant-design/ant-design/issues/17611
      table: {
        width: '100%',
        textAlign: 'start',
        borderRadius: `${unit(tableRadius)} ${unit(tableRadius)} 0 0`,
        borderCollapse: 'separate',
        borderSpacing: 0,
      },

      // ============================= Cell =============================
      [`
          ${componentCls}-thead > tr > th,
          ${componentCls}-tbody > tr > td,
          tfoot > tr > th,
          tfoot > tr > td
        `]: {
        position: 'relative',
        padding: `${unit(tablePaddingVertical)} ${unit(tablePaddingHorizontal)}`,
        overflowWrap: 'break-word',
      },

      // ============================ Title =============================
      [`${componentCls}-title`]: {
        padding: `${unit(tablePaddingVertical)} ${unit(tablePaddingHorizontal)}`,
      },

      // ============================ Header ============================
      [`${componentCls}-thead`]: {
        [`
          > tr > th,
          > tr > td
        `]: {
          position: 'relative',
          color: tableHeaderTextColor,
          fontWeight: fontWeightStrong,
          textAlign: 'start',
          background: tableHeaderBg,
          borderBottom: tableBorder,
          transition: `background ${motionDurationMid} ease`,

          "&[colspan]:not([colspan='1'])": {
            textAlign: 'center',
          },

          [`&:not(:last-child):not(${componentCls}-selection-column):not(${componentCls}-row-expand-icon-cell):not([colspan])::before`]:
            {
              position: 'absolute',
              top: '50%',
              insetInlineEnd: 0,
              width: 1,
              height: '1.6em',
              backgroundColor: tableHeaderCellSplitColor,
              transform: 'translateY(-50%)',
              transition: `background-color ${motionDurationMid}`,
              content: '""',
            },
        },

        '> tr:not(:last-child) > th[colspan]': {
          borderBottom: 0,
        },
      },

      // ============================ Body ============================
      // Borderless Table has unique hover style, which would be implemented with `borderTop`.
      [`${componentCls}:not(${componentCls}-bordered)`]: {
        [`${componentCls}-tbody`]: {
          '> tr': {
            '> td': {
              borderTop: tableBorder,
              borderBottom: 'transparent',
            },

            '&:last-child > td': {
              borderBottom: tableBorder,
            },

            [`&:first-child > td,
              &${componentCls}-measure-row + tr > td`]: {
              borderTop: 'none',
              borderTopColor: 'transparent',
            },
          },
        },
      },

      // Bordered Table remains simple `borderBottom`.
      // Ref issue: https://github.com/ant-design/ant-design/issues/38724
      [`${componentCls}${componentCls}-bordered`]: {
        [`${componentCls}-tbody`]: {
          '> tr': {
            '> td': {
              borderBottom: tableBorder,
            },
          },
        },
      },

      [`${componentCls}-tbody`]: {
        '> tr': {
          '> td': {
            transition: `background ${motionDurationMid}, border-color ${motionDurationMid}`,

            // ========================= Nest Table ===========================
            [`
              > ${componentCls}-wrapper:only-child,
              > ${componentCls}-expanded-row-fixed > ${componentCls}-wrapper:only-child
            `]: {
              [componentCls]: {
                marginBlock: `${unit(token.calc(tablePaddingVertical).mul(-1).equal())}`,
                marginInline: `${unit(
                  token.calc(token.tableExpandColumnWidth).sub(tablePaddingHorizontal).equal(),
                )} ${unit(token.calc(tablePaddingHorizontal).mul(-1).equal())}`,
                [`${componentCls}-tbody > tr:last-child > td`]: {
                  borderBottom: 0,
                  '&:first-child, &:last-child': {
                    borderRadius: 0,
                  },
                },
              },
            },
          },

          [`
            &${componentCls}-row:hover > td,
            > td${componentCls}-cell-row-hover
          `]: {
            background: tableRowHoverBg,
          },

          [`&${componentCls}-row-selected`]: {
            '> td': {
              background: tableSelectedRowBg,
            },

            '&:hover > td': {
              background: tableSelectedRowHoverBg,
            },
          },
        },
      },

      // ============================ Footer ============================
      [`${componentCls}-footer`]: {
        padding: `${unit(tablePaddingVertical)} ${unit(tablePaddingHorizontal)}`,
        color: tableFooterTextColor,
        background: tableFooterBg,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Table',
  token => {
    const {
      colorTextHeading,
      colorSplit,
      colorBgContainer,
      headerBg,
      headerColor,
      headerSortActiveBg,
      headerSortHoverBg,
      bodySortBg,
      rowHoverBg,
      rowSelectedBg,
      rowSelectedHoverBg,
      rowExpandedBg,
      cellPaddingBlock,
      cellPaddingInline,
      cellPaddingBlockMD,
      cellPaddingInlineMD,
      cellPaddingBlockSM,
      cellPaddingInlineSM,
      borderColor,
      headerBorderRadius,
      footerBg,
      footerColor,
      cellFontSize,
      cellFontSizeMD,
      cellFontSizeSM,
      headerSplitColor,
      fixedHeaderSortActiveBg,
      headerFilterHoverBg,
      filterDropdownBg,
      expandIconBg,
      selectionColumnWidth,
      stickyScrollBarBg,
    } = token;

    // 颜色运算需要真实色值（cssVar 下 token 值是 var() 字符串，TinyColor 无法解析会得到 #000000）
    const rawToken: any = (token as any)._realToken ?? token;

    const baseColorAction = new TinyColor(rawToken.colorIcon);
    const baseColorActionHover = new TinyColor(rawToken.colorIconHover);

    const zIndexTableFixed = 2;

    const tableToken = mergeToken<TableToken>(token, {
      tableFontSize: cellFontSize,
      tableBg: colorBgContainer,
      tableRadius: headerBorderRadius,

      tablePaddingVertical: cellPaddingBlock,
      tablePaddingHorizontal: cellPaddingInline,
      tablePaddingVerticalMiddle: cellPaddingBlockMD,
      tablePaddingHorizontalMiddle: cellPaddingInlineMD,
      tablePaddingVerticalSmall: cellPaddingBlockSM,
      tablePaddingHorizontalSmall: cellPaddingInlineSM,
      tableBorderColor: borderColor,
      tableHeaderTextColor: headerColor,
      tableHeaderBg: headerBg,
      tableFooterTextColor: footerColor,
      tableFooterBg: footerBg,
      tableHeaderCellSplitColor: headerSplitColor,
      tableHeaderSortBg: headerSortActiveBg,
      tableHeaderSortHoverBg: headerSortHoverBg,
      tableHeaderIconColor: baseColorAction
        .clone()
        .setAlpha(baseColorAction.getAlpha() * rawToken.opacityLoading)
        .toRgbString(),
      tableHeaderIconColorHover: baseColorActionHover
        .clone()
        .setAlpha(baseColorActionHover.getAlpha() * rawToken.opacityLoading)
        .toRgbString(),
      tableBodySortBg: bodySortBg,
      tableFixedHeaderSortActiveBg: fixedHeaderSortActiveBg,
      tableHeaderFilterActiveBg: headerFilterHoverBg,
      tableFilterDropdownBg: filterDropdownBg,
      tableRowHoverBg: rowHoverBg,
      tableSelectedRowBg: rowSelectedBg,
      tableSelectedRowHoverBg: rowSelectedHoverBg,
      zIndexTableFixed,
      zIndexTableSticky: zIndexTableFixed + 1,
      tableFontSizeMiddle: cellFontSizeMD,
      tableFontSizeSmall: cellFontSizeSM,
      tableSelectionColumnWidth: selectionColumnWidth,
      tableExpandIconBg: expandIconBg,
      tableExpandColumnWidth: rawToken.controlInteractiveSize + 2 * rawToken.padding,
      tableExpandedRowBg: rowExpandedBg,

      // Dropdown
      tableFilterDropdownWidth: 120,
      tableFilterDropdownHeight: 264,
      tableFilterDropdownSearchWidth: 140,

      // Virtual Scroll Bar
      tableScrollThumbSize: 8, // Mac scroll bar size
      tableScrollThumbBg: stickyScrollBarBg,
      tableScrollThumbBgHover: colorTextHeading,
      tableScrollBg: colorSplit,
    });

    return [
      genTableStyle(tableToken),
      genPaginationStyle(tableToken),
      genSummaryStyle(tableToken),
      genSorterStyle(tableToken),
      genFilterStyle(tableToken),
      genBorderedStyle(tableToken),
      genRadiusStyle(tableToken),
      genExpandStyle(tableToken),
      genSummaryStyle(tableToken),
      genEmptyStyle(tableToken),
      genSelectionStyle(tableToken),
      genFixedStyle(tableToken),
      genStickyStyle(tableToken),
      genEllipsisStyle(tableToken),
      genSizeStyle(tableToken),
      genResizeStyle(tableToken),
      genRtlStyle(tableToken),
      genVirtualStyle(tableToken),
    ];
  },
  token => {
    const colorFillSecondarySolid = new TinyColor(token.colorFillSecondary)
      .onBackground(token.colorBgContainer)
      .toHexString();
    const colorFillContentSolid = new TinyColor(token.colorFillContent)
      .onBackground(token.colorBgContainer)
      .toHexString();
    const colorFillAlterSolid = new TinyColor(token.colorFillAlter)
      .onBackground(token.colorBgContainer)
      .toHexString();

    return {
      headerBg: colorFillAlterSolid,
      headerColor: token.colorTextHeading,
      headerSortActiveBg: colorFillSecondarySolid,
      headerSortHoverBg: colorFillContentSolid,
      bodySortBg: colorFillAlterSolid,
      rowHoverBg: colorFillAlterSolid,
      rowSelectedBg: token.controlItemBgActive,
      rowSelectedHoverBg: token.controlItemBgActiveHover,
      rowExpandedBg: token.colorFillAlter,
      cellPaddingBlock: token.padding,
      cellPaddingInline: token.padding,
      cellPaddingBlockMD: token.paddingSM,
      cellPaddingInlineMD: token.paddingXS,
      cellPaddingBlockSM: token.paddingXS,
      cellPaddingInlineSM: token.paddingXS,
      borderColor: token.colorBorderSecondary,
      headerBorderRadius: token.borderRadiusLG,
      footerBg: colorFillAlterSolid,
      footerColor: token.colorTextHeading,
      cellFontSize: token.fontSize,
      cellFontSizeMD: token.fontSize,
      cellFontSizeSM: token.fontSize,
      headerSplitColor: token.colorBorderSecondary,
      fixedHeaderSortActiveBg: colorFillSecondarySolid,
      headerFilterHoverBg: token.colorFillContent,
      filterDropdownMenuBg: token.colorBgContainer,
      filterDropdownBg: token.colorBgContainer,
      expandIconBg: token.colorBgContainer,
      selectionColumnWidth: token.controlHeight,
      stickyScrollBarBg: token.colorTextPlaceholder,
      stickyScrollBarBorderRadius: 100,
    };
  },
);
