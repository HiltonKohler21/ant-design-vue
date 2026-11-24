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
  const itemCls = `${componentCls}-item`;
  const fontHeight = token.calc(token.fontSize).mul(token.lineHeight).equal();
  const tailOffset = token.calc(token.dotSize).sub(token.tailWidth).div(2).equal();

  return {
    [componentCls]: {
      ...resetComponent(token),
      '--ant-timeline-font-height': unit(fontHeight),
      '--ant-timeline-heading-height': `max(${unit(
        token.dotSize,
      )}, var(--ant-timeline-font-height))`,
      '--ant-timeline-dot-offset': `calc((var(--ant-timeline-heading-height) - ${unit(
        token.dotSize,
      )}) / 2)`,
      '--ant-timeline-text-offset': `calc((var(--ant-timeline-heading-height) - var(--ant-timeline-font-height)) / 2)`,
      '--ant-timeline-head-span': '12',
      '--ant-timeline-head-span-ptg': 'calc(var(--ant-timeline-head-span) / 24 * 100%)',
      '--ant-timeline-alternate-gap': `calc(${unit(token.margin)} * 2 + ${unit(token.dotSize)})`,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',

      [itemCls]: {
        position: 'relative',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        listStyle: 'none',

        '&-wrapper': {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
        },

        '&-head': {
          position: 'relative',
          flex: 'none',
          boxSizing: 'border-box',
          width: token.dotSize,
          height: token.dotSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: token.dotBg,
          border: `${unit(token.dotBorderWidth)} ${token.lineType} transparent`,
          borderRadius: '50%',
          zIndex: 1,

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
          backgroundColor: 'transparent',
          border: 0,
          borderRadius: 0,
          fontSize: token.fontSize,
          lineHeight: 1,
          textAlign: 'center',

          '& > *': {
            backgroundColor: token.colorBgContainer,
            borderRadius: '50%',
          },
        },

        '&-pending': {
          [`${itemCls}-head`]: {
            fontSize: token.fontSizeSM,
            backgroundColor: 'transparent',
          },
        },

        '&-section': {
          flex: 1,
          minWidth: 0,
        },

        '&-header': {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        },

        '&-title': {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          color: token.colorText,
          wordBreak: 'break-word',
        },

        '&-content': {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          color: token.colorText,
          wordBreak: 'break-word',
          minWidth: 0,
        },

        '&-tail': {
          position: 'absolute',
          insetInlineStart: tailOffset,
          boxSizing: 'border-box',
          borderWidth: 0,
          borderStyle: token.lineType as any,
          borderColor: token.tailColor,
        },

        '&-rail-dotted': {
          [`> ${itemCls}-tail`]: {
            borderStyle: 'dotted',
          },
        },

        '&:last-child': {
          [`> ${itemCls}-tail`]: {
            display: 'none',
          },
        },
      },

      // ====================== Filled Variant =======================
      [`&${componentCls}-filled`]: {
        [`${itemCls}-head:not(${itemCls}-head-custom)`]: {
          backgroundColor: 'currentColor',
          borderColor: 'transparent',
        },
      },

      // ====================== Vertical Modes =======================
      [`&:not(${componentCls}-horizontal)`]: {
        [`> ${itemCls}`]: {
          paddingBottom: token.itemPaddingBottom,

          '&:last-child': {
            paddingBottom: 0,
          },

          [`> ${itemCls}-wrapper`]: {
            columnGap: token.margin,
          },

          [`${itemCls}-head`]: {
            marginBlockStart: 'var(--ant-timeline-dot-offset)',
          },

          [`${itemCls}-section`]: {
            marginBlockStart: 'var(--ant-timeline-text-offset)',
          },

          [`> ${itemCls}-tail`]: {
            insetBlockStart: `calc(${unit(token.dotSize)} + var(--ant-timeline-dot-offset))`,
            insetBlockEnd: 'calc(var(--ant-timeline-dot-offset) * -1)',
            borderInlineStartWidth: token.tailWidth,
          },
        },

        // Vertical Same-Side End (mode="end" / "right")
        [`&:not(${componentCls}-layout-alternate)`]: {
          [`> ${itemCls}-placement-end`]: {
            textAlign: 'end',

            [`${itemCls}-head`]: {
              order: 1,
            },

            [`> ${itemCls}-tail`]: {
              insetInlineStart: 'auto',
              insetInlineEnd: tailOffset,
            },
          },
        },

        // Vertical Alternate & Label/Title
        [`&${componentCls}-layout-alternate`]: {
          [`> ${itemCls}`]: {
            [`> ${itemCls}-wrapper`]: {
              columnGap: 0,
            },

            [`${itemCls}-head`]: {
              position: 'absolute',
              insetBlockStart: 0,
              insetInlineStart: 'var(--ant-timeline-head-span-ptg)',
              marginInlineStart: token.calc(token.dotSize).div(2).mul(-1).equal(),
            },

            [`> ${itemCls}-tail`]: {
              insetInlineStart: 'var(--ant-timeline-head-span-ptg)',
              marginInlineStart: token.calc(token.tailWidth).div(2).mul(-1).equal(),
            },

            [`${itemCls}-section`]: {
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'flex-start',
              gap: 'var(--ant-timeline-alternate-gap)',
              width: '100%',
            },

            [`${itemCls}-header`]: {
              textAlign: 'end',
              flexDirection: 'column',
              alignItems: 'stretch',
              flex: '1 1 calc(var(--ant-timeline-head-span-ptg) - var(--ant-timeline-alternate-gap) / 2)',
              minWidth: 0,
            },

            [`${itemCls}-content`]: {
              textAlign: 'start',
              flex: '1 1 calc(100% - var(--ant-timeline-head-span-ptg) - var(--ant-timeline-alternate-gap) / 2)',
              minWidth: 0,
            },

            [`&${itemCls}-placement-end`]: {
              [`${itemCls}-header`]: {
                textAlign: 'start',
                order: 1,
              },

              [`${itemCls}-content`]: {
                textAlign: 'end',
              },

              [`${itemCls}-head, > ${itemCls}-tail`]: {
                insetInlineStart: 'calc(100% - var(--ant-timeline-head-span-ptg))',
              },
            },
          },
        },
      },

      // ====================== Horizontal Modes =======================
      [`&${componentCls}-horizontal`]: {
        flexDirection: 'row',
        alignItems: 'stretch',

        [`${itemCls}-tail`]: {
          insetBlockStart: tailOffset,
          insetInlineStart: `calc(50% + ${unit(token.dotSize)} / 2)`,
          width: `calc(100% - ${unit(token.dotSize)})`,
          height: 0,
          borderBlockStartWidth: token.tailWidth,
        },

        [`> ${itemCls}`]: {
          flex: '1 1 0%',
          minWidth: 0,
          paddingBottom: 0,
          display: 'flex',
          flexDirection: 'column',

          [`> ${itemCls}-wrapper`]: {
            flex: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: token.paddingXS,
            width: '100%',
            minWidth: 0,
          },

          [`${itemCls}-head`]: {
            marginBlockStart: 0,
          },

          [`${itemCls}-section`]: {
            flex: 'none',
            alignSelf: 'stretch',
            paddingInline: token.paddingXXS,
            textAlign: 'center',
          },

          [`${itemCls}-header`]: {
            alignItems: 'center',
            textAlign: 'center',
          },

          [`${itemCls}-title, ${itemCls}-content`]: {
            textAlign: 'center',
            maxWidth: '100%',
          },
        },

        // Horizontal Same-Side End (mode="end" / "right")
        [`&:not(${componentCls}-layout-alternate)`]: {
          [`> ${itemCls}-placement-end`]: {
            justifyContent: 'flex-end',

            [`> ${itemCls}-wrapper`]: {
              flex: 'auto',
              flexDirection: 'column-reverse',
              justifyContent: 'flex-start',
            },

            [`> ${itemCls}-tail`]: {
              insetBlockStart: 'auto',
              insetBlockEnd: tailOffset,
            },
          },
        },

        // Horizontal Alternate (mode="alternate")
        [`&${componentCls}-layout-alternate`]: {
          [`> ${itemCls}`]: {
            [`> ${itemCls}-wrapper`]: {
              position: 'relative',
              rowGap: 0,
            },

            [`${itemCls}-head`]: {
              position: 'absolute',
              top: '50%',
              insetInlineStart: '50%',
              marginInlineStart: token.calc(token.dotSize).div(2).mul(-1).equal(),
              transform: 'translateY(-50%)',
              marginBlockStart: 0,
            },

            [`> ${itemCls}-tail`]: {
              insetBlockStart: '50%',
              transform: 'translateY(-50%)',
              margin: 0,
            },

            [`${itemCls}-section`]: {
              flex: '1 1 auto',
              display: 'grid',
              gridTemplateRows:
                'minmax(var(--ant-timeline-font-height), 1fr) minmax(var(--ant-timeline-font-height), 1fr)',
              rowGap: `calc(${unit(token.dotSize)} + ${unit(token.paddingXS)} * 2)`,
              width: '100%',
            },

            [`${itemCls}-header`]: {
              gridRow: 1,
              alignSelf: 'end',
              justifySelf: 'center',
              width: '100%',
            },

            [`${itemCls}-content`]: {
              gridRow: 2,
              alignSelf: 'start',
              justifySelf: 'center',
              width: '100%',
            },

            [`&${itemCls}-placement-end`]: {
              [`${itemCls}-content`]: {
                gridRow: 1,
                alignSelf: 'end',
              },

              [`${itemCls}-header`]: {
                gridRow: 2,
                alignSelf: 'start',
              },
            },
          },
        },
      },

      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl',
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
