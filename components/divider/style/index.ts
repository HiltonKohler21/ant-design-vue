import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  sizePaddingEdgeHorizontal?: number;
  /** 文本横向内间距 */
  textPaddingInline: number | string;
  /** 文本与边缘距离，取值 0 ～ 1 */
  orientationMargin: number;
  /** 纵向分割线的横向外间距 */
  verticalMarginInline: number | string;
}

interface DividerToken extends FullToken<'Divider'> {
  dividerVerticalGutterMargin: number;
  dividerHorizontalWithTextGutterMargin: number;
  dividerHorizontalGutterMargin: number;
}

// ============================== Size ==============================
const genSizeDividerStyle: GenerateStyle<DividerToken> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '&-horizontal': {
        [`&${componentCls}`]: {
          '&-sm': {
            marginBlock: token.marginXS,
          },
          '&-md': {
            marginBlock: token.margin,
          },
        },
      },
    },
  };
};

// ============================== Shared ==============================
const genSharedDividerStyle: GenerateStyle<DividerToken> = (token): CSSObject => {
  const {
    componentCls,
    sizePaddingEdgeHorizontal,
    colorSplit,
    lineWidth,
    textPaddingInline,
    orientationMargin,
    verticalMarginInline,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      borderBlockStart: `${unit(lineWidth)} solid ${colorSplit}`,

      '&-rtl': {
        direction: 'rtl',
      },

      // vertical
      '&-vertical': {
        position: 'relative',
        top: '-0.06em',
        display: 'inline-block',
        height: '0.9em',
        marginInline: verticalMarginInline,
        marginBlock: 0,
        verticalAlign: 'middle',
        borderTop: 0,
        borderInlineStart: `${unit(lineWidth)} solid ${colorSplit}`,
      },

      '&-horizontal': {
        display: 'flex',
        clear: 'both',
        width: '100%',
        minWidth: '100%', // Fix https://github.com/ant-design/ant-design/issues/10914
        margin: `${unit(token.dividerHorizontalGutterMargin)} 0`,
      },

      [`&-horizontal${componentCls}-with-text`]: {
        display: 'flex',
        alignItems: 'center',
        margin: `${unit(token.dividerHorizontalWithTextGutterMargin)} 0`,
        color: token.colorTextHeading,
        fontWeight: 500,
        fontSize: token.fontSizeLG,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        borderBlockStart: `0 ${colorSplit}`,

        '&::before, &::after': {
          position: 'relative',
          width: '50%',
          borderBlockStart: `${unit(lineWidth)} solid transparent`,
          // Chrome not accept `inherit` in `border-top`
          borderBlockStartColor: 'inherit',
          borderBlockEnd: 0,
          transform: 'translateY(50%)',
          content: "''",
        },
      },

      [`&-horizontal${componentCls}-with-text-left`]: {
        '&::before': {
          width: `calc(${orientationMargin} * 100%)`,
        },

        '&::after': {
          width: `calc(100% - ${orientationMargin} * 100%)`,
        },
      },

      [`&-horizontal${componentCls}-with-text-right`]: {
        '&::before': {
          width: `calc(100% - ${orientationMargin} * 100%)`,
        },

        '&::after': {
          width: `calc(${orientationMargin} * 100%)`,
        },
      },

      [`${componentCls}-inner-text`]: {
        display: 'inline-block',
        paddingBlock: 0,
        paddingInline: textPaddingInline,
      },

      '&-dashed': {
        background: 'none',
        borderColor: colorSplit,
        borderStyle: 'dashed',
        borderWidth: `${unit(lineWidth)} 0 0`,
      },

      '&-dotted': {
        background: 'none',
        borderColor: colorSplit,
        borderStyle: 'dotted',
        borderWidth: `${unit(lineWidth)} 0 0`,
      },

      [`&-horizontal${componentCls}-with-text${componentCls}-dashed`]: {
        '&::before, &::after': {
          borderStyle: 'dashed none none',
        },
      },

      [`&-vertical${componentCls}-dashed`]: {
        borderInlineStartWidth: lineWidth,
        borderInlineEnd: 0,
        borderBlockStart: 0,
        borderBlockEnd: 0,
      },

      [`&-horizontal${componentCls}-with-text${componentCls}-dotted`]: {
        '&::before, &::after': {
          borderStyle: 'dotted none none',
        },
      },

      [`&-vertical${componentCls}-dotted`]: {
        borderInlineStartWidth: lineWidth,
        borderInlineStartStyle: 'dotted',
        borderInlineEnd: 0,
        borderBlockStart: 0,
        borderBlockEnd: 0,
      },

      [`&-plain${componentCls}-with-text`]: {
        color: token.colorText,
        fontWeight: 'normal',
        fontSize: token.fontSize,
      },

      [`&-horizontal${componentCls}-with-text-left${componentCls}-no-default-orientation-margin-left`]:
        {
          '&::before': {
            width: 0,
          },

          '&::after': {
            width: '100%',
          },

          [`${componentCls}-inner-text`]: {
            paddingInlineStart: sizePaddingEdgeHorizontal,
          },
        },

      [`&-horizontal${componentCls}-with-text-right${componentCls}-no-default-orientation-margin-right`]:
        {
          '&::before': {
            width: '100%',
          },

          '&::after': {
            width: 0,
          },

          [`${componentCls}-inner-text`]: {
            paddingInlineEnd: sizePaddingEdgeHorizontal,
          },
        },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Divider',
  token => {
    const dividerToken = mergeToken<DividerToken>(token, {
      dividerVerticalGutterMargin: token.marginXS,
      dividerHorizontalWithTextGutterMargin: token.margin,
      dividerHorizontalGutterMargin: token.marginLG,
    });
    return [genSharedDividerStyle(dividerToken), genSizeDividerStyle(dividerToken)];
  },
  token => ({
    sizePaddingEdgeHorizontal: 0,
    textPaddingInline: '1em',
    orientationMargin: 0.05,
    verticalMarginInline: token.marginXS,
  }),
  {
    unitless: {
      orientationMargin: true,
    },
  },
);
