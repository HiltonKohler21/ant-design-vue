import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /** 列间距 */
  columnGap: number;
  /** 行间距 */
  rowGap: number;
}

type MasonryToken = FullToken<'Masonry'>;

const genMasonryStyle: GenerateStyle<MasonryToken> = token => {
  const { componentCls, columnGap, rowGap } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%',
      boxSizing: 'border-box',
      columnGap: unit(columnGap),
      rowGap: unit(rowGap),

      [`${componentCls}-column`]: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      },

      [`${componentCls}-item`]: {
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
      },
    },
  };
};

export default genComponentStyleHook(
  'Masonry',
  token => genMasonryStyle(token as MasonryToken),
  token => ({
    columnGap: token.margin,
    rowGap: token.margin,
  }),
);
