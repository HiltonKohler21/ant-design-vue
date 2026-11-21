import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {}

interface TimelineToken extends FullToken<'Timeline'> {
  timeLineItemPaddingBottom: number;
  timeLineItemHeadSize: number;
  timeLineItemCustomHeadPaddingVertical: number;
  timeLineItemTailWidth: number;
  timeLinePaddingInlineEnd: number;
  timeLineHeadBorderWidth: number;
}

const genTimelineStyle: GenerateStyle<TimelineToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      margin: 0,
      padding: 0,
      listStyle: 'none',

      [`${componentCls}-item`]: {
        position: 'relative',
        margin: 0,
        paddingBottom: token.timeLineItemPaddingBottom,
        fontSize: token.fontSize,
        listStyle: 'none',

        '&-tail': {
          position: 'absolute',
          insetBlockStart: token.timeLineItemHeadSize,
          insetInlineStart: token
            .calc(token.timeLineItemHeadSize)
            .sub(token.timeLineItemTailWidth)
            .div(2)
            .equal(),
          height: `calc(100% - ${unit(token.timeLineItemHeadSize)})`,
          borderInlineStart: `${unit(token.timeLineItemTailWidth)} ${token.lineType} ${token.colorSplit}`,
        },

        '&-pending': {
          [`${componentCls}-item-head`]: {
            fontSize: token.fontSizeSM,
            backgroundColor: 'transparent',
          },

          [`${componentCls}-item-tail`]: {
            display: 'none',
          },
        },

        '&-head': {
          position: 'absolute',
          width: token.timeLineItemHeadSize,
          height: token.timeLineItemHeadSize,
          backgroundColor: token.colorBgContainer,
          border: `${unit(token.timeLineHeadBorderWidth)} ${token.lineType} transparent`,
          borderRadius: '50%',

          '&-blue': {
            color: token.colorPrimary,
            borderColor: token.colorPrimary,
          },

          '&-red': {
            color: token.colorError,
            borderColor: token.colorError,
          },

          '&-green': {
            color: token.colorSuccess,
            borderColor: token.colorSuccess,
          },

          '&-gray': {
            color: token.colorTextDisabled,
            borderColor: token.colorTextDisabled,
          },
        },

        '&-head-custom': {
          position: 'absolute',
          insetBlockStart: token.calc(token.timeLineItemHeadSize).div(2).equal(),
          insetInlineStart: token.calc(token.timeLineItemHeadSize).div(2).equal(),
          width: 'auto',
          height: 'auto',
          marginBlockStart: 0,
          paddingBlock: token.timeLineItemCustomHeadPaddingVertical,
          lineHeight: 1,
          textAlign: 'center',
          border: 0,
          borderRadius: 0,
          transform: `translate(-50%, -50%)`,
        },

        '&-content': {
          position: 'relative',
          insetBlockStart: token
            .calc(token.calc(token.fontSize).mul(token.lineHeight).equal())
            .sub(token.fontSize)
            .add(token.lineWidth)
            .mul(-1)
            .equal(),
          marginInlineStart: token.calc(token.margin).add(token.timeLineItemHeadSize).equal(),
          marginInlineEnd: 0,
          marginBlockStart: 0,
          marginBlockEnd: 0,
          wordBreak: 'break-word',
        },

        '&-last': {
          [`> ${componentCls}-item-tail`]: {
            display: 'none',
          },

          [`> ${componentCls}-item-content`]: {
            minHeight: token.calc(token.controlHeightLG).mul(1.2).equal(),
          },
        },
      },

      [`&${componentCls}-alternate,
        &${componentCls}-right,
        &${componentCls}-label`]: {
        [`${componentCls}-item`]: {
          '&-tail, &-head, &-head-custom': {
            insetInlineStart: '50%',
          },

          '&-head': {
            marginInlineStart: `-${unit(token.marginXXS)}`,

            '&-custom': {
              marginInlineStart: token.calc(token.timeLineItemTailWidth).div(2).equal(),
            },
          },

          '&-left': {
            [`${componentCls}-item-content`]: {
              insetInlineStart: `calc(50% - ${unit(token.marginXXS)})`,
              width: `calc(50% - ${unit(token.marginSM)})`,
              textAlign: 'start',
            },
          },

          '&-right': {
            [`${componentCls}-item-content`]: {
              width: `calc(50% - ${unit(token.marginSM)})`,
              margin: 0,
              textAlign: 'end',
            },
          },
        },
      },

      [`&${componentCls}-right`]: {
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-tail,
            ${componentCls}-item-head,
            ${componentCls}-item-head-custom`]: {
            insetInlineStart: `calc(100% - ${unit(
              token.calc(token.timeLineItemHeadSize).add(token.timeLineItemTailWidth).div(2).equal(),
            )})`,
          },

          [`${componentCls}-item-content`]: {
            width: `calc(100% - ${unit(token.calc(token.timeLineItemHeadSize).add(token.marginXS).equal())})`,
          },
        },
      },

      [`&${componentCls}-pending
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: 'block',
        height: `calc(100% - ${unit(token.margin)})`,
        borderInlineStart: `${unit(token.timeLineItemTailWidth)} dotted ${token.colorSplit}`,
      },

      [`&${componentCls}-reverse
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: 'none',
      },

      [`&${componentCls}-reverse ${componentCls}-item-pending`]: {
        [`${componentCls}-item-tail`]: {
          insetBlockStart: token.margin,
          display: 'block',
          height: `calc(100% - ${unit(token.margin)})`,
          borderInlineStart: `${unit(token.timeLineItemTailWidth)} dotted ${token.colorSplit}`,
        },

        [`${componentCls}-item-content`]: {
          minHeight: token.calc(token.controlHeightLG).mul(1.2).equal(),
        },
      },

      [`&${componentCls}-label`]: {
        [`${componentCls}-item-label`]: {
          position: 'absolute',
          insetBlockStart:
            token
              .calc(token.calc(token.fontSize).mul(token.lineHeight).equal())
              .sub(token.fontSize)
              .add(token.timeLineItemTailWidth)
              .mul(-1)
              .equal(),
          width: `calc(50% - ${unit(token.marginSM)})`,
          textAlign: 'end',
        },

        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-label`]: {
            insetInlineStart: `calc(50% + ${unit(token.marginSM)})`,
            width: `calc(50% - ${unit(token.marginSM)})`,
            textAlign: 'start',
          },
        },
      },

      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl',

        [`${componentCls}-item-head-custom`]: {
          transform: `translate(50%, -50%)`,
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Timeline', token => {
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const timeLineToken = mergeToken<TimelineToken>(token, {
    timeLineItemPaddingBottom: rawToken.padding * 1.25,
    timeLineItemHeadSize: 10,
    timeLineItemCustomHeadPaddingVertical: token.paddingXXS,
    timeLinePaddingInlineEnd: 2,
    timeLineItemTailWidth: token.lineWidthBold,
    timeLineHeadBorderWidth: rawToken.wireframe ? rawToken.lineWidthBold : rawToken.lineWidth * 3,
  });

  return [genTimelineStyle(timeLineToken)];
});
