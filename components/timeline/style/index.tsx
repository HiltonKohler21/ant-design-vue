import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { GlobalToken } from '../../theme/interface';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 轨迹颜色
   * @descEN Line color
   */
  tailColor: string;
  /**
   * @desc 轨迹宽度
   * @descEN Line width
   */
  tailWidth: number;
  /**
   * @desc 节点边框宽度
   * @descEN Border width of node
   */
  dotBorderWidth: number;
  /**
   * @desc 节点背景色
   * @descEN Background color of node
   */
  dotBg: string;
  /**
   * @desc 时间项下间距
   * @descEN Bottom padding of item
   */
  itemPaddingBottom: number;
  /**
   * @desc 节点大小
   * @descEN Node size
   */
  dotSize: number;
}

interface TimelineToken extends FullToken<'Timeline'>, ComponentToken {
  timeLineItemCustomHeadPaddingVertical: number;
  timeLinePaddingInlineEnd: number;
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
        paddingBottom: token.itemPaddingBottom,
        fontSize: token.fontSize,
        listStyle: 'none',

        '&-tail': {
          position: 'absolute',
          insetBlockStart: token.dotSize,
          insetInlineStart: token.calc(token.dotSize).sub(token.tailWidth).div(2).equal(),
          height: `calc(100% - ${unit(token.dotSize)})`,
          borderInlineStart: `${unit(token.tailWidth)} ${token.lineType} ${token.tailColor}`,
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
          width: token.dotSize,
          height: token.dotSize,
          backgroundColor: token.dotBg,
          border: `${unit(token.dotBorderWidth)} ${token.lineType} transparent`,
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
          insetBlockStart: token.calc(token.dotSize).div(2).equal(),
          insetInlineStart: token.calc(token.dotSize).div(2).equal(),
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
          marginInlineStart: token.calc(token.margin).add(token.dotSize).equal(),
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

      // ====================== Filled Variant =======================
      [`&${componentCls}-filled`]: {
        [`${componentCls}-item-head:not(${componentCls}-item-head-custom)`]: {
          backgroundColor: 'currentColor',
        },
      },

      // ====================== Vertical Modes =======================
      [`&:not(${componentCls}-horizontal)`]: {
        [`&${componentCls}-alternate,
          &${componentCls}-right,
          &${componentCls}-label`]: {
          [`${componentCls}-item`]: {
            '&-tail, &-head, &-head-custom': {
              insetInlineStart: 'var(--ant-timeline-head-span-ptg, 50%)',
            },

            '&-head': {
              marginInlineStart: token.calc(token.marginXXS).mul(-1).equal(),

              '&-custom': {
                marginInlineStart: token.calc(token.tailWidth).div(2).equal(),
              },
            },

            '&-left': {
              [`${componentCls}-item-content`]: {
                insetInlineStart: `calc(var(--ant-timeline-head-span-ptg, 50%) - ${unit(
                  token.marginXXS,
                )})`,
                width: `calc(100% - var(--ant-timeline-head-span-ptg, 50%) - ${unit(
                  token.marginSM,
                )})`,
                textAlign: 'start',
              },
            },

            '&-right': {
              [`${componentCls}-item-content`]: {
                width: `calc(100% - var(--ant-timeline-head-span-ptg, 50%) - ${unit(
                  token.marginSM,
                )})`,
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
                token.calc(token.dotSize).add(token.tailWidth).div(2).equal(),
              )})`,
            },

            [`${componentCls}-item-content`]: {
              width: `calc(100% - ${unit(token.calc(token.dotSize).add(token.marginXS).equal())})`,
            },
          },
        },

        [`&${componentCls}-label`]: {
          [`${componentCls}-item:not(${componentCls}-item-right)`]: {
            [`${componentCls}-item-content`]: {
              insetInlineStart: `calc(var(--ant-timeline-head-span-ptg, 50%) - ${unit(
                token.marginXXS,
              )})`,
              width: `calc(100% - var(--ant-timeline-head-span-ptg, 50%) - ${unit(
                token.marginSM,
              )})`,
              textAlign: 'start',
            },
          },

          [`${componentCls}-item-label`]: {
            position: 'absolute',
            insetBlockStart: token
              .calc(token.calc(token.fontSize).mul(token.lineHeight).equal())
              .sub(token.fontSize)
              .add(token.tailWidth)
              .mul(-1)
              .equal(),
            width: `calc(var(--ant-timeline-head-span-ptg, 50%) - ${unit(token.marginSM)})`,
            textAlign: 'end',
          },

          [`${componentCls}-item-right`]: {
            [`${componentCls}-item-tail,
              ${componentCls}-item-head,
              ${componentCls}-item-head-custom`]: {
              insetInlineStart: 'calc(100% - var(--ant-timeline-head-span-ptg, 50%))',
            },

            [`${componentCls}-item-label`]: {
              insetInlineStart: `calc(100% - var(--ant-timeline-head-span-ptg, 50%) + ${unit(
                token.marginSM,
              )})`,
              width: `calc(var(--ant-timeline-head-span-ptg, 50%) - ${unit(token.marginSM)})`,
              textAlign: 'start',
            },
          },
        },
      },

      // ====================== Horizontal =======================
      [`&${componentCls}-horizontal`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',

        [`${componentCls}-item`]: {
          flex: 1,
          minWidth: 0,
          paddingBottom: 0,
          paddingInlineEnd: token.padding,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',

          '&-tail': {
            position: 'absolute',
            insetBlockStart: token.calc(token.dotSize).sub(token.tailWidth).div(2).equal(),
            insetInlineStart: token.dotSize,
            width: `calc(100% - ${unit(token.dotSize)})`,
            height: 0,
            borderInlineStart: 'none',
            borderBlockStart: `${unit(token.tailWidth)} ${token.lineType} ${token.tailColor}`,
          },

          '&-head': {
            position: 'relative',
            insetBlockStart: 'auto',
            insetInlineStart: 'auto',
            marginInlineStart: 0,
            flexShrink: 0,
            zIndex: 1,
          },

          '&-head-custom': {
            position: 'relative',
            insetBlockStart: 'auto',
            insetInlineStart: 'auto',
            marginInlineStart: 0,
            paddingBlock: 0,
            paddingInline: token.timeLineItemCustomHeadPaddingVertical,
            transform: 'none',
            flexShrink: 0,
            zIndex: 1,
          },

          '&-label': {
            position: 'relative',
            insetBlockStart: 'auto',
            insetInlineStart: 'auto',
            width: 'auto',
            marginBlockEnd: token.marginXS,
            textAlign: 'start',
            color: token.colorTextDescription,
            minHeight: token.calc(token.fontSize).mul(token.lineHeight).equal(),
          },

          '&-content': {
            position: 'relative',
            insetBlockStart: 'auto',
            insetInlineStart: 'auto',
            width: 'auto',
            marginInlineStart: 0,
            marginBlockStart: token.marginXS,
            textAlign: 'start',
          },

          '&-last': {
            paddingInlineEnd: 0,

            [`> ${componentCls}-item-tail`]: {
              display: 'none',
            },

            [`> ${componentCls}-item-content`]: {
              minHeight: 'auto',
            },
          },
        },

        [`&${componentCls}-label`]: {
          [`${componentCls}-item-tail`]: {
            insetBlockStart: token
              .calc(token.calc(token.fontSize).mul(token.lineHeight).equal())
              .add(token.marginXS)
              .add(token.calc(token.dotSize).sub(token.tailWidth).div(2).equal())
              .equal(),
          },
        },

        [`&${componentCls}-right`]: {
          [`${componentCls}-item`]: {
            flexDirection: 'column-reverse',

            '&-tail': {
              insetBlockStart: 'auto',
              insetBlockEnd: token.calc(token.dotSize).sub(token.tailWidth).div(2).equal(),
            },

            '&-content': {
              marginBlockStart: 0,
              marginBlockEnd: token.marginXS,
            },
          },
        },

        [`&${componentCls}-pending ${componentCls}-item-last ${componentCls}-item-tail`]: {
          display: 'block',
          height: 0,
          width: `calc(100% - ${unit(token.dotSize)})`,
          borderInlineStart: 'none',
          borderBlockStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
        },

        [`&${componentCls}-reverse ${componentCls}-item-pending ${componentCls}-item-tail`]: {
          insetBlockStart: token.calc(token.dotSize).sub(token.tailWidth).div(2).equal(),
          display: 'block',
          height: 0,
          width: `calc(100% - ${unit(token.dotSize)})`,
          borderInlineStart: 'none',
          borderBlockStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
        },
      },

      [`&${componentCls}-pending
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: 'block',
        height: `calc(100% - ${unit(token.margin)})`,
        borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
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
          borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
        },

        [`${componentCls}-item-content`]: {
          minHeight: token.calc(token.controlHeightLG).mul(1.2).equal(),
        },
      },

      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl',

        [`${componentCls}-item-head-custom`]: {
          transform: `translate(50%, -50%)`,
        },

        [`&${componentCls}-horizontal ${componentCls}-item-head-custom`]: {
          transform: 'none',
        },
      },
    },
  };
};

export const prepareComponentToken = (token: GlobalToken): ComponentToken => ({
  tailColor: token.colorSplit,
  tailWidth: token.lineWidthBold,
  dotBorderWidth: token.lineWidthBold,
  dotBg: token.colorBgContainer,
  itemPaddingBottom: token.padding * 1.25,
  dotSize: 10,
});

// ============================== Export ==============================
export default genComponentStyleHook(
  'Timeline',
  token => {
    const timeLineToken = mergeToken<TimelineToken>(token, {
      timeLineItemCustomHeadPaddingVertical: token.paddingXXS,
      timeLinePaddingInlineEnd: 2,
    });

    return [genTimelineStyle(timeLineToken)];
  },
  prepareComponentToken,
);
