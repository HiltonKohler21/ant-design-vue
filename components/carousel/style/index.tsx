import { Keyframes, unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  dotWidth: number | string;
  dotHeight: number | string;
  dotGap: number;
  dotOffset: number;
  /** @deprecated Use `dotActiveWidth` instead. */
  dotWidthActive: number;
  dotActiveWidth: number | string;
  arrowSize: number;
  arrowOffset: number;
}

interface CarouselToken extends FullToken<'Carousel'> {
  carouselArrowSize: number;
  carouselDotOffset: number;
  carouselDotInline: number;
}

export const DotDuration = '--dot-duration';

const genCarouselStyle: GenerateStyle<CarouselToken> = token => {
  const { componentCls, antCls, dotOffset, dotGap, arrowSize, arrowOffset, motionDurationSlow } =
    token;
  const arrowLength = token.calc(arrowSize).div(Math.SQRT2).equal();

  const dotAnimation = new Keyframes(`${token.prefixCls}-dot-animation`, {
    from: {
      width: 0,
    },
    to: {
      width: token.dotActiveWidth,
    },
  });

  return {
    [componentCls]: {
      ...resetComponent(token),

      '.slick-slider': {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',

        '.slick-track, .slick-list': {
          transform: 'translate3d(0, 0, 0)',
          touchAction: 'pan-y',
        },
      },

      '.slick-list': {
        position: 'relative',
        display: 'block',
        margin: 0,
        padding: 0,
        overflow: 'hidden',

        '&:focus': {
          outline: 'none',
        },

        '&.dragging': {
          cursor: 'pointer',
        },

        '.slick-slide': {
          pointerEvents: 'none',

          // https://github.com/ant-design/ant-design/issues/23294
          [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
            visibility: 'hidden',
          },

          '&.slick-active': {
            pointerEvents: 'auto',

            [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
              visibility: 'visible',
            },
          },

          // fix Carousel content height not match parent node
          // when children is empty node
          // https://github.com/ant-design/ant-design/issues/25878
          '> div > div': {
            verticalAlign: 'bottom',
          },
        },
      },

      '.slick-track': {
        position: 'relative',
        top: 0,
        insetInlineStart: 0,
        display: 'block',

        '&::before, &::after': {
          display: 'table',
          content: '""',
        },

        '&::after': {
          clear: 'both',
        },
      },

      '.slick-slide': {
        display: 'none',
        float: 'left',
        height: '100%',
        minHeight: 1,

        img: {
          display: 'block',
        },

        '&.dragging img': {
          pointerEvents: 'none',
        },
      },

      '.slick-initialized .slick-slide': {
        display: 'block',
      },

      '.slick-vertical .slick-slide': {
        display: 'block',
        height: 'auto',
      },

      '.slick-arrow.slick-hidden': {
        display: 'none',
      },

      // Arrows
      '.slick-prev, .slick-next': {
        position: 'absolute',
        top: '50%',
        display: 'block',
        width: arrowSize,
        height: arrowSize,
        transform: 'translateY(-50%)',
        padding: 0,
        color: '#fff',
        opacity: 0.4,
        fontSize: 0,
        lineHeight: 0,
        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',
        zIndex: 1,
        transition: `opacity ${motionDurationSlow}`,

        '&:hover, &:focus': {
          opacity: 1,
          background: 'transparent',
          outline: 'none',
        },

        '&.slick-disabled': {
          pointerEvents: 'none',
          opacity: 0,
        },

        '&:empty::after': {
          boxSizing: 'border-box',
          position: 'absolute',
          top: token.calc(arrowSize).sub(arrowLength).div(2).equal(),
          insetInlineStart: token.calc(arrowSize).sub(arrowLength).div(2).equal(),
          display: 'inline-block',
          width: arrowLength,
          height: arrowLength,
          border: '0 solid currentcolor',
          borderInlineStartWidth: 2,
          borderBlockStartWidth: 2,
          borderRadius: 1,
          content: '""',
        },
      },

      '.slick-prev': {
        insetInlineStart: arrowOffset,

        '&:empty::after': {
          transform: 'rotate(-45deg)',
        },
      },

      '.slick-next': {
        insetInlineEnd: arrowOffset,

        '&:empty::after': {
          transform: 'rotate(135deg)',
        },
      },

      // Dots
      '.slick-dots': {
        position: 'absolute',
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: 15,
        display: 'flex !important',
        justifyContent: 'center',
        paddingInlineStart: 0,
        margin: 0,
        listStyle: 'none',

        '&-bottom': {
          bottom: dotOffset,
        },

        '&-top': {
          top: dotOffset,
          bottom: 'auto',
        },

        li: {
          position: 'relative',
          display: 'inline-block',
          flex: '0 1 auto',
          boxSizing: 'content-box',
          width: token.dotWidth,
          height: token.dotHeight,
          marginInline: dotGap,
          padding: 0,
          textAlign: 'center',
          textIndent: -999,
          verticalAlign: 'top',
          transition: `all ${token.motionDurationSlow}`,
          borderRadius: token.dotHeight,
          overflow: 'hidden',

          '&::after': {
            display: 'block',
            position: 'absolute',
            top: 0,
            insetInlineStart: 0,
            width: 0,
            height: token.dotHeight,
            content: '""',
            background: 'transparent',
            borderRadius: token.dotHeight,
            opacity: 1,
            outline: 'none',
            cursor: 'pointer',
            overflow: 'hidden',
          },

          button: {
            position: 'relative',
            display: 'block',
            width: '100%',
            height: token.dotHeight,
            padding: 0,
            color: 'transparent',
            fontSize: 0,
            background: token.colorBgContainer,
            border: 0,
            borderRadius: token.dotHeight,
            outline: 'none',
            cursor: 'pointer',
            opacity: 0.3,
            transition: `all ${token.motionDurationSlow}`,
            overflow: 'hidden',

            '&:hover, &:focus': {
              opacity: 0.75,
            },

            '&::after': {
              position: 'absolute',
              inset: token.calc(dotGap).mul(-1).equal(),
              content: '""',
            },
          },

          '&.slick-active': {
            width: token.dotActiveWidth,
            position: 'relative',

            '&:hover, &:focus': {
              opacity: 1,
            },

            '&::after': {
              background: token.colorBgContainer,
              animationName: dotAnimation,
              animationDuration: `var(${DotDuration}, 0s)`,
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
            },
          },
        },
      },
    },
  };
};

const genCarouselVerticalStyle: GenerateStyle<CarouselToken> = token => {
  const { componentCls, dotOffset, arrowOffset, marginXXS } = token;

  const dotVerticalAnimation = new Keyframes(`${token.prefixCls}-dot-vertical-animation`, {
    from: {
      height: 0,
    },
    to: {
      height: token.dotActiveWidth,
    },
  });

  const reverseSizeOfDot = {
    width: token.dotHeight,
    height: token.dotWidth,
  };

  return {
    [`${componentCls}-vertical`]: {
      '.slick-prev, .slick-next': {
        insetInlineStart: '50%',
        insetInlineEnd: 'auto',
        marginBlockStart: 'unset',
        transform: 'translateX(-50%)',
      },
      '.slick-prev': {
        insetBlockStart: arrowOffset,
        insetInlineStart: '50%',

        '&:empty::after': {
          transform: 'rotate(45deg)',
        },
      },
      '.slick-next': {
        insetBlockStart: 'auto',
        insetBlockEnd: arrowOffset,

        '&:empty::after': {
          transform: 'rotate(-135deg)',
        },
      },
      '.slick-dots': {
        top: '50%',
        bottom: 'auto',
        flexDirection: 'column',
        width: token.dotHeight,
        height: 'auto',
        margin: 0,
        transform: 'translateY(-50%)',

        '&-left, &-start': {
          insetInlineEnd: 'auto',
          insetInlineStart: dotOffset,
        },

        '&-right, &-end': {
          insetInlineEnd: dotOffset,
          insetInlineStart: 'auto',
        },

        li: {
          // reverse width and height in vertical situation
          ...reverseSizeOfDot,
          margin: `${unit(marginXXS)} 0`,
          verticalAlign: 'baseline',

          button: reverseSizeOfDot,

          '&::after': {
            ...reverseSizeOfDot,
            height: 0,
          },

          '&.slick-active': {
            ...reverseSizeOfDot,
            height: token.dotActiveWidth,

            button: {
              ...reverseSizeOfDot,
              height: token.dotActiveWidth,
            },

            '&::after': {
              ...reverseSizeOfDot,
              background: token.colorBgContainer,
              animationName: dotVerticalAnimation,
              animationDuration: `var(${DotDuration}, 0s)`,
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
            },
          },
        },
      },
    },
  };
};

const genCarouselRtlStyle: GenerateStyle<CarouselToken> = token => {
  const { componentCls } = token;

  return [
    {
      [`${componentCls}-rtl`]: {
        direction: 'rtl',

        // Dots
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'row-reverse',
          },
        },
      },
    },
    {
      [`${componentCls}-vertical`]: {
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'column',
          },
        },
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Carousel',
  token => {
    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawCarouselToken: any = (token as any)._realToken ?? token;
    const carouselToken = mergeToken<CarouselToken>(token, {
      carouselArrowSize: rawCarouselToken.controlHeightLG / 2,
      carouselDotOffset: rawCarouselToken.controlHeightSM / 2,
    });

    return [
      genCarouselStyle(carouselToken),
      genCarouselVerticalStyle(carouselToken),
      genCarouselRtlStyle(carouselToken),
    ];
  },
  token => ({
    arrowSize: 16,
    arrowOffset: token.marginXS,
    dotWidth: 16,
    dotHeight: 3,
    dotGap: token.marginXXS,
    dotOffset: 12,
    dotWidthActive: 24,
    dotActiveWidth: 24,
  }),
);
