import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

const genSummaryStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls, lineWidth, tableBorderColor } = token;
  const tableBorder = `${unit(lineWidth)} ${token.lineType} ${tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-summary`]: {
        position: 'relative',
        zIndex: token.zIndexTableFixed,
        background: token.tableBg,

        '> tr': {
          '> th, > td': {
            borderBottom: tableBorder,
          },
        },
      },

      [`div${componentCls}-summary`]: {
        boxShadow: `0 -${unit(lineWidth)} 0 ${tableBorderColor}`,
      },
    },
  };
};

export default genSummaryStyle;
