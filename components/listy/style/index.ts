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

interface ListyToken extends FullToken<'Listy'> {
  listyItemPaddingBlock: number;
  listyItemPaddingInline: number;
}

const genListyStyle: GenerateStyle<ListyToken> = token => {
  const { componentCls, listyItemPaddingBlock, listyItemPaddingInline } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      color: token.colorText,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,

      [`${componentCls}-item`]: {
        padding: `${unit(listyItemPaddingBlock)} ${unit(listyItemPaddingInline)}`,
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
