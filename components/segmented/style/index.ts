import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';

export interface ComponentToken {
  /**
   * @desc 选项文本颜色
   * @descEN Text color of item
   */
  itemColor: string;
  /**
   * @desc 选项悬浮态文本颜色
   * @descEN Text color of item when hover
   */
  itemHoverColor: string;
  /**
   * @desc 选项悬浮态背景颜色
   * @descEN Background color of item when hover
   */
  itemHoverBg: string;
  /**
   * @desc 选项选中时背景颜色
   * @descEN Background color of item when selected
   */
  itemSelectedBg: string;
  /**
   * @desc 选项选中时文字颜色
   * @descEN Text color of item when selected
   */
  itemSelectedColor: string;
  /**
   * @desc Segmented 控件容器背景色
   * @descEN Background of Segmented container
   */
  trackBg: string;
  /**
   * @desc Segmented 控件容器的 padding
   * @descEN Padding of Segmented container
   */
  trackPadding: number | string;
}

interface SegmentedToken extends FullToken<'Segmented'> {
  segmentedPaddingHorizontal: number;
  segmentedPaddingHorizontalSM: number;
  segmentedContainerPadding: number | string;
  labelColor: string;
  labelColorHover: string;
  bgColor: string;
  bgColorHover: string;
  bgColorSelected: string;
}

// ============================== Mixins ==============================
function getItemDisabledStyle(cls: string, token: SegmentedToken): CSSObject {
  return {
    [`${cls}, ${cls}:hover, ${cls}:focus`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  };
}

function getItemSelectedStyle(token: SegmentedToken): CSSObject {
  return {
    backgroundColor: token.bgColorSelected,
    boxShadow: token.boxShadow,
  };
}

const segmentedTextEllipsisCss: CSSObject = {
  overflow: 'hidden',
  // handle text ellipsis
  ...textEllipsis,
};

// ============================== Styles ==============================
const genSegmentedStyle: GenerateStyle<SegmentedToken> = (token: SegmentedToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      display: 'inline-block',
      padding: token.segmentedContainerPadding,
      color: token.labelColor,
      backgroundColor: token.bgColor,
      borderRadius: token.borderRadius,
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,

      [`${componentCls}-group`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyItems: 'flex-start',
        width: '100%',
      },

      // RTL styles
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // vertical styles
      [`&${componentCls}-vertical`]: {
        [`${componentCls}-group`]: {
          flexDirection: 'column',
        },
        [`${componentCls}-thumb`]: {
          width: '100%',
          height: 0,
          padding: `0 ${unit(token.paddingXXS)}`,
        },
      },

      // block styles
      [`&${componentCls}-block`]: {
        display: 'flex',
      },

      [`&${componentCls}-block ${componentCls}-item`]: {
        flex: 1,
        minWidth: 0,
      },

      // item styles
      [`${componentCls}-item`]: {
        position: 'relative',
        textAlign: 'center',
        cursor: 'pointer',
        transition: `color ${token.motionDurationMid} ${token.motionEaseInOut}`,
        borderRadius: token.borderRadiusSM,

        '&-selected': {
          ...getItemSelectedStyle(token),
          color: token.itemSelectedColor,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          insetInlineStart: 0,
          borderRadius: 'inherit',
          transition: `background-color ${token.motionDurationMid}`,
          pointerEvents: 'none',
        },

        [`&:hover:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.labelColorHover,

          '&::after': {
            backgroundColor: token.bgColorHover,
          },
        },

        '&-label': {
          minHeight: token
            .calc(token.controlHeight)
            .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
            .equal(),
          lineHeight: unit(
            token
              .calc(token.controlHeight)
              .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
              .equal(),
          ),
          padding: `0 ${unit(token.segmentedPaddingHorizontal)}`,
          ...segmentedTextEllipsisCss,
        },

        // syntactic sugar to add `icon` for Segmented Item
        '&-icon + *': {
          marginInlineStart: token.calc(token.marginSM).div(2).equal(),
        },

        '&-input': {
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        },
      },

      // thumb styles
      [`${componentCls}-thumb`]: {
        ...getItemSelectedStyle(token),

        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: '100%',
        padding: `${unit(token.paddingXXS)} 0`,
        borderRadius: token.borderRadiusSM,

        [`& ~ ${componentCls}-item:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)::after`]:
          {
            backgroundColor: 'transparent',
          },
      },

      // size styles
      [`&${componentCls}-lg`]: {
        borderRadius: token.borderRadiusLG,
        [`${componentCls}-item-label`]: {
          minHeight: token
            .calc(token.controlHeightLG)
            .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
            .equal(),
          lineHeight: unit(
            token
              .calc(token.controlHeightLG)
              .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
              .equal(),
          ),
          padding: `0 ${unit(token.segmentedPaddingHorizontal)}`,
          fontSize: token.fontSizeLG,
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadius,
        },
      },

      [`&${componentCls}-shape-round`]: {
        borderRadius: 9999,
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: 9999,
        },
      },

      [`&${componentCls}-sm`]: {
        borderRadius: token.borderRadiusSM,
        [`${componentCls}-item-label`]: {
          minHeight: token
            .calc(token.controlHeightSM)
            .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
            .equal(),
          lineHeight: unit(
            token
              .calc(token.controlHeightSM)
              .sub(token.calc(token.segmentedContainerPadding).mul(2).equal())
              .equal(),
          ),
          padding: `0 ${unit(token.segmentedPaddingHorizontalSM)}`,
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadiusXS,
        },
      },

      // disabled styles
      ...getItemDisabledStyle(`&-disabled ${componentCls}-item`, token),
      ...getItemDisabledStyle(`${componentCls}-item-disabled`, token),

      // transition effect when `appear-active`
      [`${componentCls}-thumb-motion-appear-active`]: {
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, width ${token.motionDurationSlow} ${token.motionEaseInOut}, height ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        willChange: 'transform, width, height',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Segmented',
  token => {
    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const segmentedToken = mergeToken<SegmentedToken>(token, {
      segmentedPaddingHorizontal: rawToken.controlPaddingHorizontal - rawToken.lineWidth,
      segmentedPaddingHorizontalSM: rawToken.controlPaddingHorizontalSM - rawToken.lineWidth,
      segmentedContainerPadding: token.trackPadding,
      labelColor: token.itemColor,
      labelColorHover: token.itemHoverColor,
      bgColor: token.trackBg,
      bgColorHover: token.itemHoverBg,
      bgColorSelected: token.itemSelectedBg,
    });
    return [genSegmentedStyle(segmentedToken)];
  },
  token => ({
    trackPadding: token.lineWidthBold,
    trackBg: token.colorBgLayout,
    itemColor: token.colorTextLabel,
    itemHoverColor: token.colorText,
    itemHoverBg: token.colorFillSecondary,
    itemSelectedBg: token.colorBgElevated,
    itemSelectedColor: token.colorText,
  }),
);
