import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genFocusStyle, resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 开关高度
   * @descEN Height of Switch
   */
  trackHeight: number;
  /**
   * @desc 小号开关高度
   * @descEN Height of small Switch
   */
  trackHeightSM: number;
  /**
   * @desc 开关最小宽度
   * @descEN Minimum width of Switch
   */
  trackMinWidth: number;
  /**
   * @desc 小号开关最小宽度
   * @descEN Minimum width of small Switch
   */
  trackMinWidthSM: number;
  /**
   * @desc 开关内边距
   * @descEN Padding of Switch
   */
  trackPadding: number;
  /**
   * @desc 开关把手背景色
   * @descEN Background color of Switch handle
   */
  handleBg: string;
  /**
   * @desc 开关把手大小
   * @descEN Size of Switch handle
   */
  handleSize: number;
  /**
   * @desc 小号开关把手大小
   * @descEN Size of small Switch handle
   */
  handleSizeSM: number;
  /**
   * @desc 开关把手阴影
   * @descEN Shadow of Switch handle
   */
  handleShadow: string;
  /**
   * @desc 内容区域最小边距
   * @descEN Minimum margin of content area
   */
  innerMinMargin: number;
  /**
   * @desc 内容区域最大边距
   * @descEN Maximum margin of content area
   */
  innerMaxMargin: number;
  /**
   * @desc 小号开关内容区域最小边距
   * @descEN Minimum margin of content area of small Switch
   */
  innerMinMarginSM: number;
  /**
   * @desc 小号开关内容区域最大边距
   * @descEN Maximum margin of content area of small Switch
   */
  innerMaxMarginSM: number;
}

interface SwitchToken extends FullToken<'Switch'> {
  switchMinWidth: number;
  switchHeight: number;
  switchDuration: string;
  switchColor: string;
  switchDisabledOpacity: number;
  switchInnerMarginMin: number;
  switchInnerMarginMax: number;
  switchPadding: number;
  switchPinSize: number;
  switchBg: string;
  switchMinWidthSM: number;
  switchHeightSM: number;
  switchInnerMarginMinSM: number;
  switchInnerMarginMaxSM: number;
  switchPinSizeSM: number;
  switchHandleShadow: string;
  switchLoadingIconSize: number;
  switchLoadingIconColor: string;
  switchHandleActiveInset: string;
}

const genSwitchSmallStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchInnerCls = `${componentCls}-inner`;

  return {
    [componentCls]: {
      [`&${componentCls}-small`]: {
        minWidth: token.switchMinWidthSM,
        height: token.switchHeightSM,
        lineHeight: `${unit(token.switchHeightSM)}`,

        [`${componentCls}-inner`]: {
          paddingInlineStart: token.switchInnerMarginMaxSM,
          paddingInlineEnd: token.switchInnerMarginMinSM,
          [`${switchInnerCls}-checked`]: {
            marginInlineStart: `calc(-100% + ${unit(
              token
                .calc(token.switchPinSizeSM)
                .add(token.calc(token.switchPadding).mul(2).equal())
                .equal(),
            )} - ${unit(token.calc(token.switchInnerMarginMaxSM).mul(2).equal())})`,
            marginInlineEnd: `calc(100% - ${unit(
              token
                .calc(token.switchPinSizeSM)
                .add(token.calc(token.switchPadding).mul(2).equal())
                .equal(),
            )} + ${unit(token.calc(token.switchInnerMarginMaxSM).mul(2).equal())})`,
          },

          [`${switchInnerCls}-unchecked`]: {
            marginTop: token.calc(token.switchHeightSM).mul(-1).equal(),
            marginInlineStart: 0,
            marginInlineEnd: 0,
          },
        },

        [`${componentCls}-handle`]: {
          width: token.switchPinSizeSM,
          height: token.switchPinSizeSM,
        },

        [`${componentCls}-loading-icon`]: {
          top: token.calc(token.switchPinSizeSM).sub(token.switchLoadingIconSize).div(2).equal(),
          fontSize: token.switchLoadingIconSize,
        },

        [`&${componentCls}-checked`]: {
          [`${componentCls}-inner`]: {
            paddingInlineStart: token.switchInnerMarginMinSM,
            paddingInlineEnd: token.switchInnerMarginMaxSM,
            [`${switchInnerCls}-checked`]: {
              marginInlineStart: 0,
              marginInlineEnd: 0,
            },

            [`${switchInnerCls}-unchecked`]: {
              marginInlineStart: `calc(100% - ${unit(
                token
                  .calc(token.switchPinSizeSM)
                  .add(token.calc(token.switchPadding).mul(2).equal())
                  .equal(),
              )} + ${unit(token.calc(token.switchInnerMarginMaxSM).mul(2).equal())})`,
              marginInlineEnd: `calc(-100% + ${unit(
                token
                  .calc(token.switchPinSizeSM)
                  .add(token.calc(token.switchPadding).mul(2).equal())
                  .equal(),
              )} - ${unit(token.calc(token.switchInnerMarginMaxSM).mul(2).equal())})`,
            },
          },

          [`${componentCls}-handle`]: {
            insetInlineStart: `calc(100% - ${unit(
              token.calc(token.switchPinSizeSM).add(token.switchPadding).equal(),
            )})`,
          },
        },

        [`&:not(${componentCls}-disabled):active`]: {
          [`&:not(${componentCls}-checked) ${switchInnerCls}`]: {
            [`${switchInnerCls}-unchecked`]: {
              marginInlineStart: token.calc(token.marginXXS).div(2).equal(),
              marginInlineEnd: token.calc(token.marginXXS).div(2).mul(-1).equal(),
            },
          },

          [`&${componentCls}-checked ${switchInnerCls}`]: {
            [`${switchInnerCls}-checked`]: {
              marginInlineStart: token.calc(token.marginXXS).div(2).mul(-1).equal(),
              marginInlineEnd: token.calc(token.marginXXS).div(2).equal(),
            },
          },
        },
      },
    },
  };
};

const genSwitchLoadingStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`${componentCls}-loading-icon${token.iconCls}`]: {
        position: 'relative',
        top: token.calc(token.switchPinSize).sub(token.fontSize).div(2).equal(),
        color: token.switchLoadingIconColor,
        verticalAlign: 'top',
      },

      [`&${componentCls}-checked ${componentCls}-loading-icon`]: {
        color: token.switchColor,
      },
    },
  };
};

const genSwitchHandleStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchHandleCls = `${componentCls}-handle`;

  return {
    [componentCls]: {
      [switchHandleCls]: {
        position: 'absolute',
        top: token.switchPadding,
        insetInlineStart: token.switchPadding,
        width: token.switchPinSize,
        height: token.switchPinSize,
        transition: `all ${token.switchDuration} ease-in-out`,

        '&::before': {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          backgroundColor: token.handleBg,
          borderRadius: token.calc(token.switchPinSize).div(2).equal(),
          boxShadow: token.switchHandleShadow,
          transition: `all ${token.switchDuration} ease-in-out`,
          content: '""',
        },
      },

      [`&${componentCls}-checked ${switchHandleCls}`]: {
        insetInlineStart: `calc(100% - ${unit(
          token.calc(token.switchPinSize).add(token.switchPadding).equal(),
        )})`,
      },

      [`&:not(${componentCls}-disabled):active`]: {
        [`${switchHandleCls}::before`]: {
          insetInlineEnd: token.switchHandleActiveInset,
          insetInlineStart: 0,
        },

        [`&${componentCls}-checked ${switchHandleCls}::before`]: {
          insetInlineEnd: 0,
          insetInlineStart: token.switchHandleActiveInset,
        },
      },
    },
  };
};

const genSwitchInnerStyle: GenerateStyle<SwitchToken, CSSObject> = token => {
  const { componentCls } = token;
  const switchInnerCls = `${componentCls}-inner`;

  return {
    [componentCls]: {
      [switchInnerCls]: {
        display: 'block',
        overflow: 'hidden',
        borderRadius: 100,
        height: '100%',
        paddingInlineStart: token.switchInnerMarginMax,
        paddingInlineEnd: token.switchInnerMarginMin,
        transition: `padding-inline-start ${token.switchDuration} ease-in-out, padding-inline-end ${token.switchDuration} ease-in-out`,

        [`${switchInnerCls}-checked, ${switchInnerCls}-unchecked`]: {
          display: 'block',
          color: token.colorTextLightSolid,
          fontSize: token.fontSizeSM,
          transition: `margin-inline-start ${token.switchDuration} ease-in-out, margin-inline-end ${token.switchDuration} ease-in-out`,
          pointerEvents: 'none',
        },

        [`${switchInnerCls}-checked`]: {
          marginInlineStart: `calc(-100% + ${unit(
            token
              .calc(token.switchPinSize)
              .add(token.calc(token.switchPadding).mul(2).equal())
              .equal(),
          )} - ${unit(token.calc(token.switchInnerMarginMax).mul(2).equal())})`,
          marginInlineEnd: `calc(100% - ${unit(
            token
              .calc(token.switchPinSize)
              .add(token.calc(token.switchPadding).mul(2).equal())
              .equal(),
          )} + ${unit(token.calc(token.switchInnerMarginMax).mul(2).equal())})`,
        },

        [`${switchInnerCls}-unchecked`]: {
          marginTop: token.calc(token.switchHeight).mul(-1).equal(),
          marginInlineStart: 0,
          marginInlineEnd: 0,
        },
      },

      [`&${componentCls}-checked ${switchInnerCls}`]: {
        paddingInlineStart: token.switchInnerMarginMin,
        paddingInlineEnd: token.switchInnerMarginMax,
        [`${switchInnerCls}-checked`]: {
          marginInlineStart: 0,
          marginInlineEnd: 0,
        },

        [`${switchInnerCls}-unchecked`]: {
          marginInlineStart: `calc(100% - ${unit(
            token
              .calc(token.switchPinSize)
              .add(token.calc(token.switchPadding).mul(2).equal())
              .equal(),
          )} + ${unit(token.calc(token.switchInnerMarginMax).mul(2).equal())})`,
          marginInlineEnd: `calc(-100% + ${unit(
            token
              .calc(token.switchPinSize)
              .add(token.calc(token.switchPadding).mul(2).equal())
              .equal(),
          )} - ${unit(token.calc(token.switchInnerMarginMax).mul(2).equal())})`,
        },
      },

      [`&:not(${componentCls}-disabled):active`]: {
        [`&:not(${componentCls}-checked) ${switchInnerCls}`]: {
          [`${switchInnerCls}-unchecked`]: {
            marginInlineStart: token.calc(token.switchPadding).mul(2).equal(),
            marginInlineEnd: token.calc(token.switchPadding).mul(2).mul(-1).equal(),
          },
        },

        [`&${componentCls}-checked ${switchInnerCls}`]: {
          [`${switchInnerCls}-checked`]: {
            marginInlineStart: token.calc(token.switchPadding).mul(2).mul(-1).equal(),
            marginInlineEnd: token.calc(token.switchPadding).mul(2).equal(),
          },
        },
      },
    },
  };
};

const genSwitchStyle = (token: SwitchToken): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'relative',
      display: 'inline-block',
      boxSizing: 'border-box',
      minWidth: token.switchMinWidth,
      height: token.switchHeight,
      lineHeight: `${unit(token.switchHeight)}`,
      verticalAlign: 'middle',
      background: token.colorTextQuaternary,
      border: '0',
      borderRadius: 100,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid}`,
      userSelect: 'none',

      [`&:hover:not(${componentCls}-disabled)`]: {
        background: token.colorTextTertiary,
      },

      ...genFocusStyle(token),

      [`&${componentCls}-checked`]: {
        background: token.switchColor,

        [`&:hover:not(${componentCls}-disabled)`]: {
          background: token.colorPrimaryHover,
        },
      },

      [`&${componentCls}-loading, &${componentCls}-disabled`]: {
        cursor: 'not-allowed',
        opacity: token.switchDisabledOpacity,

        '*': {
          boxShadow: 'none',
          cursor: 'not-allowed',
        },
      },

      // rtl style
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Switch',
  token => {
    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const switchToken = mergeToken<SwitchToken>(token, {
      switchMinWidth: token.trackMinWidth,
      switchHeight: token.trackHeight,
      switchDuration: token.motionDurationMid,
      switchColor: token.colorPrimary,
      switchDisabledOpacity: token.opacityLoading,
      switchInnerMarginMin: token.innerMinMargin,
      switchInnerMarginMax: token.innerMaxMargin,
      switchPadding: token.trackPadding,
      switchPinSize: token.handleSize,
      switchBg: token.colorBgContainer,
      switchMinWidthSM: token.trackMinWidthSM,
      switchHeightSM: token.trackHeightSM,
      switchInnerMarginMinSM: token.innerMinMarginSM,
      switchInnerMarginMaxSM: token.innerMaxMarginSM,
      switchPinSizeSM: token.handleSizeSM,
      switchHandleShadow: token.handleShadow,
      switchLoadingIconSize: rawToken.fontSizeIcon * 0.75,
      switchLoadingIconColor: `rgba(0, 0, 0, ${token.opacityLoading})`,
      switchHandleActiveInset: '-30%',
    });

    return [
      genSwitchStyle(switchToken),

      // inner style
      genSwitchInnerStyle(switchToken),

      // handle style
      genSwitchHandleStyle(switchToken),

      // loading style
      genSwitchLoadingStyle(switchToken),

      // small style
      genSwitchSmallStyle(switchToken),
    ];
  },
  token => {
    const { fontSize, lineHeight, controlHeight, colorWhite } = token;
    const height = fontSize * lineHeight;
    const heightSM = controlHeight / 2;
    const padding = 2; // Fixed value
    const handleSize = height - padding * 2;
    const handleSizeSM = heightSM - padding * 2;

    return {
      trackHeight: height,
      trackHeightSM: heightSM,
      trackMinWidth: handleSize * 2 + padding * 4,
      trackMinWidthSM: handleSizeSM * 2 + padding * 2,
      trackPadding: padding,
      handleBg: colorWhite,
      handleSize,
      handleSizeSM,
      handleShadow: `0 2px 4px 0 ${new TinyColor('#00230b').setAlpha(0.2).toRgbString()}`,
      innerMinMargin: handleSize / 2,
      innerMaxMargin: handleSize + padding + padding * 2,
      innerMinMarginSM: handleSizeSM / 2,
      innerMaxMarginSM: handleSizeSM + padding + padding * 2,
    };
  },
);
