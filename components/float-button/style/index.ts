import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { initFadeMotion } from '../../style/motion/fade';
import { resetComponent } from '../../style';
import { initMotion } from '../../style/motion/motion';
import getOffset from '../util';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  zIndexPopup: number;
}

type FloatButtonToken = FullToken<'FloatButton'> & {
  floatButtonColor: string;
  floatButtonBackgroundColor: string;
  floatButtonHoverBackgroundColor: string;
  floatButtonFontSize: number;
  floatButtonSize: number;
  floatButtonIconSize: number;
  floatButtonBodySize: number;
  floatButtonBodyPadding: number;
  badgeOffset: number;
  dotOffsetInCircle: number;
  dotOffsetInSquare: number;

  // Position
  floatButtonInsetBlockEnd: number;
  floatButtonInsetInlineEnd: number;
};

const initFloatButtonGroupMotion = (token: FloatButtonToken) => {
  const { componentCls, floatButtonSize, motionDurationSlow, motionEaseInOutCirc } = token;
  const groupPrefixCls = `${componentCls}-group`;
  const negativeFloatButtonSize = unit(token.calc(floatButtonSize).mul(-1).equal());
  const positiveFloatButtonSize = unit(floatButtonSize);

  const moveDownIn = new Keyframes('antFloatButtonMoveDownIn', {
    '0%': {
      transform: `translate3d(0, ${positiveFloatButtonSize}, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },

    '100%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },
  });
  const moveDownOut = new Keyframes('antFloatButtonMoveDownOut', {
    '0%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },

    '100%': {
      transform: `translate3d(0, ${positiveFloatButtonSize}, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },
  });

  const moveUpIn = new Keyframes('antFloatButtonMoveUpIn', {
    '0%': {
      transform: `translate3d(0, ${negativeFloatButtonSize}, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },

    '100%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },
  });
  const moveUpOut = new Keyframes('antFloatButtonMoveUpOut', {
    '0%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },

    '100%': {
      transform: `translate3d(0, ${negativeFloatButtonSize}, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },
  });

  const moveRightIn = new Keyframes('antFloatButtonMoveRightIn', {
    '0%': {
      transform: `translate3d(${positiveFloatButtonSize}, 0, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },

    '100%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },
  });
  const moveRightOut = new Keyframes('antFloatButtonMoveRightOut', {
    '0%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },

    '100%': {
      transform: `translate3d(${positiveFloatButtonSize}, 0, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },
  });

  const moveLeftIn = new Keyframes('antFloatButtonMoveLeftIn', {
    '0%': {
      transform: `translate3d(${negativeFloatButtonSize}, 0, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },

    '100%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },
  });
  const moveLeftOut = new Keyframes('antFloatButtonMoveLeftOut', {
    '0%': {
      transform: 'translate3d(0, 0, 0)',
      transformOrigin: '0 0',
      opacity: 1,
    },

    '100%': {
      transform: `translate3d(${negativeFloatButtonSize}, 0, 0)`,
      transformOrigin: '0 0',
      opacity: 0,
    },
  });

  return [
    {
      [`${groupPrefixCls}-wrap`]: {
        ...initMotion(`${groupPrefixCls}-wrap`, moveDownIn, moveDownOut, motionDurationSlow, true),
      },
      [`${groupPrefixCls}-bottom ${groupPrefixCls}-wrap`]: {
        ...initMotion(`${groupPrefixCls}-wrap`, moveUpIn, moveUpOut, motionDurationSlow, true),
      },
      [`${groupPrefixCls}-left ${groupPrefixCls}-wrap`]: {
        ...initMotion(
          `${groupPrefixCls}-wrap`,
          moveRightIn,
          moveRightOut,
          motionDurationSlow,
          true,
        ),
      },
      [`${groupPrefixCls}-right ${groupPrefixCls}-wrap`]: {
        ...initMotion(`${groupPrefixCls}-wrap`, moveLeftIn, moveLeftOut, motionDurationSlow, true),
      },
    },
    {
      [`${groupPrefixCls}-wrap`]: {
        [`
          &${groupPrefixCls}-wrap-enter,
          &${groupPrefixCls}-wrap-appear
        `]: {
          opacity: 0,
          animationTimingFunction: motionEaseInOutCirc,
        },

        [`&${groupPrefixCls}-wrap-leave`]: {
          animationTimingFunction: motionEaseInOutCirc,
        },
      },
    },
  ];
};

// ============================== Group ==============================
const floatButtonGroupStyle: GenerateStyle<FloatButtonToken, CSSObject> = token => {
  const {
    antCls,
    componentCls,
    floatButtonSize,
    margin,
    borderRadiusSM,
    borderRadiusLG,
    floatButtonBodyPadding,
  } = token;
  const groupPrefixCls = `${componentCls}-group`;
  const listTriggerOffset = token.calc(floatButtonSize).add(margin).equal();
  const menuBridgeOffset = token.calc(margin).mul(-1).equal();

  return {
    [groupPrefixCls]: {
      ...resetComponent(token),
      zIndex: token.zIndexPopup,
      display: 'block',
      border: 'none',
      position: 'fixed',
      width: floatButtonSize,
      height: 'auto',
      boxShadow: 'none',
      minHeight: floatButtonSize,
      insetInlineEnd: token.floatButtonInsetInlineEnd,
      insetBlockEnd: token.floatButtonInsetBlockEnd,
      borderRadius: borderRadiusLG,

      [`${groupPrefixCls}-wrap`]: {
        zIndex: -1,
        display: 'block',
        position: 'relative',
        marginBottom: margin,
      },
      [`&${groupPrefixCls}-menu-mode ${groupPrefixCls}-wrap`]: {
        position: 'absolute',
        display: 'flex',
        marginBottom: 0,

        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
        },
      },
      [`&${groupPrefixCls}-top`]: {
        [`${groupPrefixCls}-wrap`]: {
          flexDirection: 'column',
          bottom: listTriggerOffset,
          insetInlineStart: 0,

          '&::after': {
            top: '100%',
            bottom: menuBridgeOffset,
          },
        },
      },
      [`&${groupPrefixCls}-bottom`]: {
        [`${groupPrefixCls}-wrap`]: {
          flexDirection: 'column',
          top: listTriggerOffset,
          insetInlineStart: 0,

          '&::after': {
            top: menuBridgeOffset,
            bottom: '100%',
          },
        },
      },
      [`&${groupPrefixCls}-left`]: {
        [`${groupPrefixCls}-wrap`]: {
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: 'max-content',
          top: 0,
          right: listTriggerOffset,

          '&::after': {
            left: '100%',
            right: menuBridgeOffset,
          },
        },
      },
      [`&${groupPrefixCls}-right`]: {
        [`${groupPrefixCls}-wrap`]: {
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: 'max-content',
          top: 0,
          left: listTriggerOffset,

          '&::after': {
            left: menuBridgeOffset,
            right: '100%',
          },
        },
      },
      [`&${groupPrefixCls}-rtl`]: {
        direction: 'rtl',
      },
      [componentCls]: {
        position: 'static',
        flexShrink: 0,
      },
    },
    [`${groupPrefixCls}-circle`]: {
      [`${componentCls}-circle:not(:last-child)`]: {
        marginBottom: token.margin,
        [`${componentCls}-body`]: {
          width: floatButtonSize,
          height: floatButtonSize,
          borderRadius: '50%',
        },
      },
      [`&${groupPrefixCls}-left ${groupPrefixCls}-wrap, &${groupPrefixCls}-right ${groupPrefixCls}-wrap`]:
        {
          [`${componentCls}-circle:not(:last-child)`]: {
            marginBottom: 0,
            marginInlineEnd: token.margin,
          },
        },
    },
    [`${groupPrefixCls}-square`]: {
      [`${componentCls}-square`]: {
        borderRadius: 0,
        padding: 0,
        '&:first-child': {
          borderStartStartRadius: borderRadiusLG,
          borderStartEndRadius: borderRadiusLG,
        },
        '&:last-child': {
          borderEndStartRadius: borderRadiusLG,
          borderEndEndRadius: borderRadiusLG,
        },
        '&:not(:last-child)': {
          borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        },
        [`${antCls}-badge`]: {
          [`${antCls}-badge-count`]: {
            top: token.calc(token.floatButtonBodyPadding).add(token.badgeOffset).mul(-1).equal(),
            insetInlineEnd: token
              .calc(token.floatButtonBodyPadding)
              .add(token.badgeOffset)
              .mul(-1)
              .equal(),
          },
        },
      },
      [`${groupPrefixCls}-wrap`]: {
        display: 'block',
        borderRadius: borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        [`${componentCls}-square`]: {
          boxShadow: 'none',
          marginTop: 0,
          borderRadius: 0,
          padding: floatButtonBodyPadding,
          '&:first-child': {
            borderStartStartRadius: borderRadiusLG,
            borderStartEndRadius: borderRadiusLG,
          },
          '&:last-child': {
            borderEndStartRadius: borderRadiusLG,
            borderEndEndRadius: borderRadiusLG,
          },
          '&:not(:last-child)': {
            borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
          },
          [`${componentCls}-body`]: {
            width: token.floatButtonBodySize,
            height: token.floatButtonBodySize,
          },
        },
      },
      [`&${groupPrefixCls}-left ${groupPrefixCls}-wrap, &${groupPrefixCls}-right ${groupPrefixCls}-wrap`]:
        {
          display: 'flex',
          [`${componentCls}-square`]: {
            '&:first-child': {
              borderRadius: 0,
              borderStartStartRadius: borderRadiusLG,
              borderEndStartRadius: borderRadiusLG,
            },
            '&:last-child': {
              borderRadius: 0,
              borderStartEndRadius: borderRadiusLG,
              borderEndEndRadius: borderRadiusLG,
            },
            '&:first-child:last-child': {
              borderRadius: borderRadiusLG,
            },
            '&:not(:last-child)': {
              borderBottom: 'none',
              borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
            },
          },
        },
    },

    [`${groupPrefixCls}-circle-shadow`]: {
      boxShadow: 'none',
    },
    [`${groupPrefixCls}-square-shadow`]: {
      boxShadow: token.boxShadowSecondary,
      [`${componentCls}-square`]: {
        boxShadow: 'none',
        padding: floatButtonBodyPadding,
        [`${componentCls}-body`]: {
          width: token.floatButtonBodySize,
          height: token.floatButtonBodySize,
          borderRadius: borderRadiusSM,
        },
      },
    },
  };
};

// ============================== Shared ==============================
const sharedFloatButtonStyle: GenerateStyle<FloatButtonToken, CSSObject> = token => {
  const {
    antCls,
    componentCls,
    floatButtonBodyPadding,
    floatButtonIconSize,
    floatButtonSize,
    borderRadiusLG,
    badgeOffset,
    dotOffsetInSquare,
    dotOffsetInCircle,
  } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      border: 'none',
      position: 'fixed',
      cursor: 'pointer',
      zIndex: token.zIndexPopup,
      display: 'block',
      justifyContent: 'center',
      alignItems: 'center',
      width: floatButtonSize,
      height: floatButtonSize,
      insetInlineEnd: token.floatButtonInsetInlineEnd,
      insetBlockEnd: token.floatButtonInsetBlockEnd,
      boxShadow: token.boxShadowSecondary,

      // Pure Panel
      '&-pure': {
        position: 'relative',
        inset: 'auto',
      },

      '&:empty': {
        display: 'none',
      },
      [`${antCls}-badge`]: {
        width: '100%',
        height: '100%',
        [`${antCls}-badge-count`]: {
          transform: 'translate(0, 0)',
          transformOrigin: 'center',
          top: -badgeOffset,
          insetInlineEnd: -badgeOffset,
        },
      },
      [`${componentCls}-body`]: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: `all ${token.motionDurationMid}`,
        [`${componentCls}-content`]: {
          overflow: 'hidden',
          textAlign: 'center',
          minHeight: floatButtonSize,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: `${unit(token.calc(floatButtonBodyPadding).div(2).equal())} ${unit(
            floatButtonBodyPadding,
          )}`,
          [`${componentCls}-icon`]: {
            textAlign: 'center',
            margin: 'auto',
            width: floatButtonIconSize,
            fontSize: floatButtonIconSize,
            lineHeight: 1,
          },
        },
      },
    },
    [`${componentCls}-rtl`]: {
      direction: 'rtl',
    },
    [`${componentCls}-circle`]: {
      height: floatButtonSize,
      borderRadius: '50%',
      [`${antCls}-badge`]: {
        [`${antCls}-badge-dot`]: {
          top: dotOffsetInCircle,
          insetInlineEnd: dotOffsetInCircle,
        },
      },
      [`${componentCls}-body`]: {
        borderRadius: '50%',
      },
    },
    [`${componentCls}-square`]: {
      height: 'auto',
      minHeight: floatButtonSize,
      borderRadius: borderRadiusLG,
      [`${antCls}-badge`]: {
        [`${antCls}-badge-dot`]: {
          top: dotOffsetInSquare,
          insetInlineEnd: dotOffsetInSquare,
        },
      },
      [`${componentCls}-body`]: {
        height: 'auto',
        borderRadius: borderRadiusLG,
      },
    },
    [`${componentCls}-default`]: {
      backgroundColor: token.floatButtonBackgroundColor,
      transition: `background-color ${token.motionDurationMid}`,
      [`${componentCls}-body`]: {
        backgroundColor: token.floatButtonBackgroundColor,
        transition: `background-color ${token.motionDurationMid}`,
        '&:hover': {
          backgroundColor: token.colorFillContent,
        },
        [`${componentCls}-content`]: {
          [`${componentCls}-icon`]: {
            color: token.colorText,
          },
          [`${componentCls}-description`]: {
            display: 'flex',
            alignItems: 'center',
            lineHeight: `${unit(token.fontSizeLG)}`,
            color: token.colorText,
            fontSize: token.fontSizeSM,
          },
        },
      },
    },
    [`${componentCls}-primary`]: {
      backgroundColor: token.colorPrimary,
      [`${componentCls}-body`]: {
        backgroundColor: token.colorPrimary,
        transition: `background-color ${token.motionDurationMid}`,
        '&:hover': {
          backgroundColor: token.colorPrimaryHover,
        },
        [`${componentCls}-content`]: {
          [`${componentCls}-icon`]: {
            color: token.colorTextLightSolid,
          },
          [`${componentCls}-description`]: {
            display: 'flex',
            alignItems: 'center',
            lineHeight: `${unit(token.fontSizeLG)}`,
            color: token.colorTextLightSolid,
            fontSize: token.fontSizeSM,
          },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook<'FloatButton'>(
  'FloatButton',
  token => {
    const {
      colorTextLightSolid,
      colorBgElevated,
      controlHeightLG,
      marginXXL,
      marginLG,
      fontSize,
      controlItemBgHover,
    } = token;
    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const floatButtonToken = mergeToken<FloatButtonToken>(token, {
      floatButtonBackgroundColor: colorBgElevated,
      floatButtonColor: colorTextLightSolid,
      floatButtonHoverBackgroundColor: controlItemBgHover,
      floatButtonFontSize: fontSize,
      floatButtonIconSize: rawToken.fontSizeIcon * 1.5,
      floatButtonSize: controlHeightLG,

      floatButtonInsetBlockEnd: marginXXL,
      floatButtonInsetInlineEnd: marginLG,
      floatButtonBodySize: rawToken.controlHeightLG - rawToken.paddingXXS * 2,
      // 这里的 paddingXXS 是简写，完整逻辑是 (controlHeightLG - (controlHeightLG - paddingXXS * 2)) / 2,
      floatButtonBodyPadding: rawToken.paddingXXS,
      badgeOffset: rawToken.paddingXXS * 1.5,
      dotOffsetInCircle: getOffset(rawToken.controlHeightLG / 2),
      dotOffsetInSquare: getOffset(rawToken.borderRadiusLG),
    });
    return [
      floatButtonGroupStyle(floatButtonToken),
      sharedFloatButtonStyle(floatButtonToken),
      initFadeMotion(token),
      initFloatButtonGroupMotion(floatButtonToken),
    ];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 10,
  }),
);
