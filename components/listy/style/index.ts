import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';
import { unit } from '../../_util/cssinjs';

export interface ComponentToken {
  /** 行上下内边距 */
  itemPaddingBlock: number;
  /** 行左右内边距 */
  itemPaddingInline: number;
}

type ListyToken = FullToken<'Listy'>;

const genListyStyle: GenerateStyle<ListyToken> = token => {
  const { componentCls, itemPaddingBlock, itemPaddingInline } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      // fix https://github.com/ant-design/ant-design/issues/59633
      ['--rc-virtual-list-scrollbar-bg' as any]: token.colorSplit,
      color: token.colorText,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,

      // ======================== Item ========================
      [`${componentCls}-item`]: {
        padding: `${unit(itemPaddingBlock)} ${unit(itemPaddingInline)}`,
        borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      },

      [`&${componentCls}-hoverable`]: {
        [`${componentCls}-item`]: {
          transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,

          '&:hover': {
            backgroundColor: token.controlItemBgHover,
          },
        },
      },

      // ==================== Group header ====================
      [`${componentCls}-group-header`]: {
        boxSizing: 'border-box',
        padding: `${unit(token.paddingXS)} ${unit(itemPaddingInline)}`,
        color: token.colorTextDescription,
        fontWeight: token.fontWeightStrong,
        backgroundColor: token.colorBgContainer,
        backgroundImage: `linear-gradient(${token.colorFillAlter}, ${token.colorFillAlter})`,

        '&-sticky': {
          position: 'sticky',
          top: 0,
          insetInline: 0,
          zIndex: 1,
        },

        '&-fixed': {
          position: 'absolute',
          top: 0,
          insetInline: 0,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
        },

        '&-holder': {
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        },
      },

      [`${componentCls}-group-section`]: {
        position: 'relative',
      },

      [`${componentCls}-scrollbar`]: {
        zIndex: 1,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor: token.colorFillQuaternary,
        },
      },

      // ========================= RTL ========================
      '&-rtl': {
        direction: 'rtl',
      },
    },
  };
};

export default genComponentStyleHook(
  'Listy',
  token => genListyStyle(token as ListyToken),
  token => ({
    itemPaddingBlock: token.paddingSM,
    itemPaddingInline: token.padding,
  }),
);
