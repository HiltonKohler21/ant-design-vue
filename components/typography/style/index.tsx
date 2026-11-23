import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import {
  getCopyableStyles,
  getEditableStyles,
  getEllipsisStyles,
  getLinkStyles,
  getResetStyles,
  getShimmerStyles,
  getTitleStyles,
} from './mixins';
import { operationUnit } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  /**
   * @desc 标题上间距
   * @descEN Margin top of title
   */
  titleMarginTop: number | string;
  /**
   * @desc 标题下间距
   * @descEN Margin bottom of title
   */
  titleMarginBottom: number | string;
  /**
   * @deprecated Use `titleMarginTop` instead
   */
  sizeMarginHeadingVerticalStart?: number | string;
  /**
   * @deprecated Use `titleMarginBottom` instead
   */
  sizeMarginHeadingVerticalEnd?: number | string;
}

export type TypographyToken = FullToken<'Typography'>;

const genTypographyStyle: GenerateStyle<TypographyToken> = token => {
  const { componentCls, titleMarginTop } = token;

  return {
    [componentCls]: {
      color: token.colorText,
      wordBreak: 'break-word',
      lineHeight: token.lineHeight,
      [`&${componentCls}-secondary, &${componentCls}-link${componentCls}-secondary`]: {
        color: token.colorTextDescription,
      },

      [`&${componentCls}-success, &${componentCls}-link${componentCls}-success`]: {
        color: token.colorSuccessText,
      },

      [`&${componentCls}-warning, &${componentCls}-link${componentCls}-warning`]: {
        color: token.colorWarningText,
      },

      [`&${componentCls}-danger, &${componentCls}-link${componentCls}-danger`]: {
        color: token.colorErrorText,
        [`&${componentCls}-link:active, &${componentCls}-link:focus`]: {
          color: token.colorErrorTextActive,
        },
        [`&${componentCls}-link:hover`]: {
          color: token.colorErrorTextHover,
        },
      },

      [`&${componentCls}-disabled`]: {
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
        userSelect: 'none',
      },

      'div&, p': {
        marginBottom: '1em',
      },

      ...getTitleStyles(token),

      [`& + h1${componentCls}, & + h2${componentCls}, & + h3${componentCls}, & + h4${componentCls}, & + h5${componentCls}`]:
        {
          marginTop: titleMarginTop,
        },

      'div, ul, li, p, h1, h2, h3, h4, h5': {
        '+ h1, + h2, + h3, + h4, + h5': {
          marginTop: titleMarginTop,
        },
      },

      ...getResetStyles(token),

      ...getLinkStyles(token),

      // Operation
      [`${componentCls}-actions`]: {
        display: 'inline',
      },

      [`
        ${componentCls}-expand,
        ${componentCls}-collapse,
        ${componentCls}-edit,
        ${componentCls}-copy
      `]: {
        ...operationUnit(token),
        marginInlineStart: token.marginXXS,
      },

      [`${componentCls}-actions-start`]: {
        [`
          ${componentCls}-expand,
          ${componentCls}-collapse,
          ${componentCls}-edit,
          ${componentCls}-copy:not(${componentCls}-copy-icon-only)
        `]: {
          marginInlineStart: 0,
          marginInlineEnd: token.marginXXS,
        },
      },

      ...getEditableStyles(token),

      ...getCopyableStyles(token),

      ...getEllipsisStyles(),

      // Shimmer
      [`&${componentCls}-shimmer`]: getShimmerStyles(token),

      '&-rtl': {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken = (token?: any): ComponentToken => {
  const typographyOverride = token?.Typography;
  const titleMarginTop =
    typographyOverride?.titleMarginTop ??
    typographyOverride?.sizeMarginHeadingVerticalStart ??
    '1.2em';
  const titleMarginBottom =
    typographyOverride?.titleMarginBottom ??
    typographyOverride?.sizeMarginHeadingVerticalEnd ??
    '0.5em';
  return {
    titleMarginTop,
    titleMarginBottom,
    sizeMarginHeadingVerticalStart: titleMarginTop,
    sizeMarginHeadingVerticalEnd: titleMarginBottom,
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Typography',
  token => [genTypographyStyle(token)],
  prepareComponentToken,
);
