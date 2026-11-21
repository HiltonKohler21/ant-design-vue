import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genSizeStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls } = token;
  const getSizeStyle = (
    size: 'small' | 'middle',
    paddingVertical: number,
    paddingHorizontal: number,
    fontSize: number,
  ) => ({
    [`${componentCls}${componentCls}-${size}`]: {
      fontSize,
      [`
        ${componentCls}-title,
        ${componentCls}-footer,
        ${componentCls}-thead > tr > th,
        ${componentCls}-tbody > tr > td,
        tfoot > tr > th,
        tfoot > tr > td
      `]: {
        padding: `${unit(paddingVertical)} ${unit(paddingHorizontal)}`,
      },

      [`${componentCls}-filter-trigger`]: {
        marginInlineEnd: `-${paddingHorizontal / 2}px`,
      },

      [`${componentCls}-expanded-row-fixed`]: {
        margin: `-${unit(paddingVertical)} -${unit(paddingHorizontal)}`,
      },

      [`${componentCls}-tbody`]: {
        // ========================= Nest Table ===========================
        [`${componentCls}-wrapper:only-child ${componentCls}`]: {
          marginBlock: `-${unit(paddingVertical)}`,
          marginInline: `${
            token.tableExpandColumnWidth - paddingHorizontal
          }px -${unit(paddingHorizontal)}`,
        },
      },

      // https://github.com/ant-design/ant-design/issues/35167
      [`${componentCls}-selection-column`]: {
        paddingInlineStart: `${paddingHorizontal / 4}px`,
      },
    },
  });
  return {
    [`${componentCls}-wrapper`]: {
      ...getSizeStyle(
        'middle',
        token.tablePaddingVerticalMiddle,
        token.tablePaddingHorizontalMiddle,
        token.tableFontSizeMiddle,
      ),
      ...getSizeStyle(
        'small',
        token.tablePaddingVerticalSmall,
        token.tablePaddingHorizontalSmall,
        token.tableFontSizeSmall,
      ),
    },
  };
};

export default genSizeStyle;
