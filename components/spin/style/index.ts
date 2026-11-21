import type { CSSObject } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  contentHeight: number;
}

interface SpinToken extends FullToken<'Spin'> {
  spinDotDefault: string;
  spinDotSize: number;
  spinDotSizeSM: number;
  spinDotSizeLG: number;
}

const antSpinMove = new Keyframes('antSpinMove', {
  to: { opacity: 1 },
});

const antRotate = new Keyframes('antRotate', {
  to: { transform: 'rotate(405deg)' },
});

const genSpinStyle: GenerateStyle<SpinToken> = (token: SpinToken): CSSObject => ({
  [`${token.componentCls}`]: {
    ...resetComponent(token),
    position: 'absolute',
    display: 'none',
    color: token.colorPrimary,
    textAlign: 'center',
    verticalAlign: 'middle',
    opacity: 0,
    transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOutCirc}`,

    '&-fullscreen': {
      position: 'fixed',
      inset: 0,
      zIndex: token.zIndexPopupBase,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: token.colorBgMask,
      transition: `opacity ${token.motionDurationMid}`,
      '&-show': {
        display: 'flex',
      },
    },

    '&-spinning': {
      position: 'static',
      display: 'inline-block',
      opacity: 1,
    },

    '&-nested-loading': {
      position: 'relative',
      [`> div > ${token.componentCls}`]: {
        position: 'absolute',
        top: 0,
        insetInlineStart: 0,
        zIndex: 4,
        display: 'block',
        width: '100%',
        height: '100%',
        maxHeight: token.contentHeight,

        [`${token.componentCls}-dot`]: {
          position: 'absolute',
          top: '50%',
          insetInlineStart: '50%',
          margin: token.calc(token.spinDotSize).div(2).mul(-1).equal(),
        },

        [`${token.componentCls}-text`]: {
          position: 'absolute',
          top: '50%',
          width: '100%',
          paddingTop: token.calc(token.spinDotSize).sub(token.fontSize).div(2).add(2).equal(),
          textShadow: `0 1px 2px ${token.colorBgContainer}`, // FIXME: shadow
        },

        [`&${token.componentCls}-show-text ${token.componentCls}-dot`]: {
          marginTop: token.calc(token.spinDotSize).div(2).add(10).mul(-1).equal(),
        },

        '&-sm': {
          [`${token.componentCls}-dot`]: {
            margin: token.calc(token.spinDotSizeSM).div(2).mul(-1).equal(),
          },
          [`${token.componentCls}-text`]: {
            paddingTop: token.calc(token.spinDotSizeSM).sub(token.fontSize).div(2).add(2).equal(),
          },
          [`&${token.componentCls}-show-text ${token.componentCls}-dot`]: {
            marginTop: token.calc(token.spinDotSizeSM).div(2).add(10).mul(-1).equal(),
          },
        },

        '&-lg': {
          [`${token.componentCls}-dot`]: {
            margin: token.calc(token.spinDotSizeLG).div(2).mul(-1).equal(),
          },
          [`${token.componentCls}-text`]: {
            paddingTop: token.calc(token.spinDotSizeLG).sub(token.fontSize).div(2).add(2).equal(),
          },
          [`&${token.componentCls}-show-text ${token.componentCls}-dot`]: {
            marginTop: token.calc(token.spinDotSizeLG).div(2).add(10).mul(-1).equal(),
          },
        },
      },

      [`${token.componentCls}-container`]: {
        position: 'relative',
        transition: `opacity ${token.motionDurationSlow}`,

        '&::after': {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          zIndex: 10,
          width: '100%',
          height: '100%',
          background: token.colorBgContainer,
          opacity: 0,
          transition: `all ${token.motionDurationSlow}`,
          content: '""',
          pointerEvents: 'none',
        },
      },

      [`${token.componentCls}-blur`]: {
        clear: 'both',
        opacity: 0.5,
        userSelect: 'none',
        pointerEvents: 'none',

        [`&::after`]: {
          opacity: 0.4,
          pointerEvents: 'auto',
        },
      },
    },

    // tip
    // ------------------------------
    [`&-tip`]: {
      color: token.spinDotDefault,
    },

    // dots
    // ------------------------------
    [`${token.componentCls}-dot`]: {
      position: 'relative',
      display: 'inline-block',
      fontSize: token.spinDotSize,
      width: '1em',
      height: '1em',

      '&-item': {
        position: 'absolute',
        display: 'block',
        width: token.calc(token.spinDotSize).sub(token.calc(token.marginXXS).div(2).equal()).div(2).equal(),
        height: token.calc(token.spinDotSize).sub(token.calc(token.marginXXS).div(2).equal()).div(2).equal(),
        backgroundColor: token.colorPrimary,
        borderRadius: '100%',
        transform: 'scale(0.75)',
        transformOrigin: '50% 50%',
        opacity: 0.3,
        animationName: antSpinMove,
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationDirection: 'alternate',

        '&:nth-child(1)': {
          top: 0,
          insetInlineStart: 0,
        },

        '&:nth-child(2)': {
          top: 0,
          insetInlineEnd: 0,
          animationDelay: '0.4s',
        },

        '&:nth-child(3)': {
          insetInlineEnd: 0,
          bottom: 0,
          animationDelay: '0.8s',
        },

        '&:nth-child(4)': {
          bottom: 0,
          insetInlineStart: 0,
          animationDelay: '1.2s',
        },
      },

      '&-spin': {
        transform: 'rotate(45deg)',
        animationName: antRotate,
        animationDuration: '1.2s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      },
    },

    // Sizes
    // ------------------------------

    // small
    [`&-sm ${token.componentCls}-dot`]: {
      fontSize: token.spinDotSizeSM,

      i: {
        width: token.calc(token.spinDotSizeSM).sub(token.calc(token.marginXXS).div(2).equal()).div(2).equal(),
        height: token.calc(token.spinDotSizeSM).sub(token.calc(token.marginXXS).div(2).equal()).div(2).equal(),
      },
    },

    // large
    [`&-lg ${token.componentCls}-dot`]: {
      fontSize: token.spinDotSizeLG,

      i: {
        width: token.calc(token.spinDotSizeLG).sub(token.marginXXS).div(2).equal(),
        height: token.calc(token.spinDotSizeLG).sub(token.marginXXS).div(2).equal(),
      },
    },

    [`&${token.componentCls}-show-text ${token.componentCls}-text`]: {
      display: 'block',
    },
  },
});

// ============================== Export ==============================
export default genComponentStyleHook(
  'Spin',
  token => {
    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const spinToken = mergeToken<SpinToken>(token, {
      spinDotDefault: token.colorTextDescription,
      spinDotSize: rawToken.controlHeightLG / 2,
      spinDotSizeSM: rawToken.controlHeightLG * 0.35,
      spinDotSizeLG: token.controlHeight,
    });
    return [genSpinStyle(spinToken)];
  },
  {
    contentHeight: 400,
  },
);
