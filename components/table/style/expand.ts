import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';
import { operationUnit } from '../../style';

const genExpandStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    antCls,
    motionDurationSlow,
    lineWidth,
    paddingXS,
    lineType,
    tableBorderColor,
    tableExpandIconBg,
    tableExpandColumnWidth,
    borderRadius,
    tablePaddingVertical,
    tablePaddingHorizontal,
    tableExpandedRowBg,
  } = token;
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const halfInnerSize = rawToken.controlInteractiveSize / 2 - rawToken.lineWidth;
  // must be odd number, unless it cannot align center
  const expandIconSize = halfInnerSize * 2 + rawToken.lineWidth * 3;
  const tableBorder = `${unit(lineWidth)} ${lineType} ${tableBorderColor}`;
  const expandIconLineOffset = rawToken.paddingXXS - rawToken.lineWidth;

  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-expand-icon-col`]: {
        width: tableExpandColumnWidth,
      },

      [`${componentCls}-row-expand-icon-cell`]: {
        textAlign: 'center',

        [`${componentCls}-row-expand-icon`]: {
          display: 'inline-flex',
          float: 'none',
          verticalAlign: 'sub',
        },
      },

      [`${componentCls}-row-indent`]: {
        height: 1,
        float: 'left',
      },

      [`${componentCls}-row-expand-icon`]: {
        ...operationUnit(token),
        position: 'relative',
        float: 'left',
        boxSizing: 'border-box',
        width: expandIconSize,
        height: expandIconSize,
        padding: 0,
        color: 'inherit',
        lineHeight: `${unit(expandIconSize)}`,
        background: tableExpandIconBg,
        border: tableBorder,
        borderRadius,
        transform: `scale(${rawToken.controlInteractiveSize / expandIconSize})`,
        transition: `all ${motionDurationSlow}`,
        userSelect: 'none',

        [`&:focus, &:hover, &:active`]: {
          borderColor: 'currentcolor',
        },

        [`&::before, &::after`]: {
          position: 'absolute',
          background: 'currentcolor',
          transition: `transform ${motionDurationSlow} ease-out`,
          content: '""',
        },

        '&::before': {
          top: halfInnerSize,
          insetInlineEnd: expandIconLineOffset,
          insetInlineStart: expandIconLineOffset,
          height: lineWidth,
        },

        '&::after': {
          top: expandIconLineOffset,
          bottom: expandIconLineOffset,
          insetInlineStart: halfInnerSize,
          width: lineWidth,
          transform: 'rotate(90deg)',
        },

        // Motion effect
        '&-collapsed::before': {
          transform: 'rotate(-180deg)',
        },

        '&-collapsed::after': {
          transform: 'rotate(0deg)',
        },

        '&-spaced': {
          '&::before, &::after': {
            display: 'none',
            content: 'none',
          },
          background: 'transparent',
          border: 0,
          visibility: 'hidden',
        },
      },

      [`${componentCls}-row-indent + ${componentCls}-row-expand-icon`]: {
        marginTop:
          (rawToken.fontSize * rawToken.lineHeight - rawToken.lineWidth * 3) / 2 -
          Math.ceil((rawToken.fontSizeSM * 1.4 - rawToken.lineWidth * 3) / 2),
        marginInlineEnd: paddingXS,
      },

      [`tr${componentCls}-expanded-row`]: {
        '&, &:hover': {
          '> td': {
            background: tableExpandedRowBg,
          },
        },

        // https://github.com/ant-design/ant-design/issues/25573
        [`${antCls}-descriptions-view`]: {
          display: 'flex',

          table: {
            flex: 'auto',
            width: 'auto',
          },
        },
      },

      // With fixed
      [`${componentCls}-expanded-row-fixed`]: {
        position: 'relative',
        margin: `${unit(token.calc(tablePaddingVertical).mul(-1).equal())} ${unit(token.calc(tablePaddingHorizontal).mul(-1).equal())}`,
        padding: `${unit(tablePaddingVertical)} ${unit(tablePaddingHorizontal)}`,
      },
    },
  };
};

export default genExpandStyle;
