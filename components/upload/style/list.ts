import { unit } from '../../_util/cssinjs';
import type { UploadToken } from '.';
import type { GenerateStyle } from '../../theme/internal';
import { clearFix, textEllipsis } from '../../style';

const genListStyle: GenerateStyle<UploadToken> = token => {
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawListToken: any = (token as any)._realToken ?? token;
  const { componentCls, antCls, iconCls, fontSize, lineHeight } = token;
  const itemCls = `${componentCls}-list-item`;
  const actionsCls = `${itemCls}-actions`;
  const actionCls = `${itemCls}-action`;
  const listItemHeightSM = Math.round(rawListToken.fontSize * rawListToken.lineHeight);

  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-list`]: {
        ...clearFix(),
        lineHeight: token.lineHeight,

        [itemCls]: {
          position: 'relative',
          height: token.calc(token.lineHeight).mul(fontSize).equal(),
          marginTop: token.marginXS,
          fontSize,
          display: 'flex',
          alignItems: 'center',
          transition: `background-color ${token.motionDurationSlow}`,

          '&:hover': {
            backgroundColor: token.controlItemBgHover,
          },

          [`${itemCls}-name`]: {
            ...textEllipsis,
            padding: `0 ${unit(token.paddingXS)}`,
            lineHeight,
            flex: 'auto',
            transition: `all ${token.motionDurationSlow}`,
          },

          [`${itemCls}-extra`]: {
            flex: 'none',
            marginInlineStart: token.marginXS,
            color: token.colorTextDescription,
            fontSize,
            whiteSpace: 'nowrap',
          },

          [actionsCls]: {
            [actionCls]: {
              opacity: 0,
            },

            [`${actionCls}${antCls}-btn-sm`]: {
              height: listItemHeightSM,
              border: 0,
              lineHeight: 1,
              // FIXME: should not override small button
              '> span': {
                transform: 'scale(1)',
              },
            },

            [`
              ${actionCls}:focus,
              &.picture ${actionCls}
            `]: {
              opacity: 1,
            },

            [iconCls]: {
              color: token.colorTextDescription,
              transition: `all ${token.motionDurationSlow}`,
            },

            [`&:hover ${iconCls}`]: {
              color: token.colorText,
            },
          },

          [`${componentCls}-icon ${iconCls}`]: {
            color: token.colorTextDescription,
            fontSize,
          },

          [`${itemCls}-progress`]: {
            position: 'absolute',
            bottom: token.calc(token.uploadProgressOffset).mul(-1).equal(),
            width: '100%',
            paddingInlineStart: token.calc(fontSize).add(token.paddingXS).equal(),
            fontSize,
            lineHeight: 0,
            pointerEvents: 'none',

            '> div': {
              margin: 0,
            },
          },
        },

        [`${itemCls}:hover ${actionCls}`]: {
          opacity: 1,
          color: token.colorText,
        },

        [`${itemCls}-error`]: {
          color: token.colorError,
          [`${itemCls}-name, ${componentCls}-icon ${iconCls}`]: {
            color: token.colorError,
          },

          [actionsCls]: {
            [`${iconCls}, ${iconCls}:hover`]: {
              color: token.colorError,
            },

            [actionCls]: {
              opacity: 1,
            },
          },
        },

        [`${componentCls}-list-item-container`]: {
          transition: `opacity ${token.motionDurationSlow}, height ${token.motionDurationSlow}`,

          // For smooth removing animation
          '&::before': {
            display: 'table',
            width: 0,
            height: 0,
            content: '""',
          },
        },
      },
    },
  };
};

export default genListStyle;
