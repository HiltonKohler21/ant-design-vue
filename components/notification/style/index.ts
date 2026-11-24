import { Keyframes, unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genNotificationPlacementStyle from './placement';
import { resetComponent } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  /**
   * @desc 提醒框 z-index
   * @descEN z-index of Notification
   */
  zIndexPopup: number;
  /**
   * @desc 提醒框宽度
   * @descEN Width of Notification
   */
  width: number | string;
  /**
   * @desc 提醒框进度条背景色
   * @descEN Background color of Notification progress bar
   */
  progressBg: string;
  /**
   * @desc 成功提醒框容器背景色
   * @descEN Background color of success notification container
   */
  colorSuccessBg?: string;
  /**
   * @desc 错误提醒框容器背景色
   * @descEN Background color of error notification container
   */
  colorErrorBg?: string;
  /**
   * @desc 信息提醒框容器背景色
   * @descEN Background color of info notification container
   */
  colorInfoBg?: string;
  /**
   * @desc 警告提醒框容器背景色
   * @descEN Background color of warning notification container
   */
  colorWarningBg?: string;
}

export interface NotificationToken extends FullToken<'Notification'> {
  notificationBg: string;
  notificationPaddingVertical: number;
  notificationPaddingHorizontal: number;
  notificationPadding: string;
  notificationMarginBottom: number;
  notificationMarginEdge: number;
  animationMaxHeight: number;
  notificationIconSize: number;
  notificationCloseButtonSize: number;
  notificationProgressHeight: number;
}

const genNotificationStyle: GenerateStyle<NotificationToken> = token => {
  const {
    iconCls,
    componentCls, // .ant-notification
    boxShadowSecondary,
    fontSizeLG,
    notificationMarginBottom,
    borderRadiusLG,
    colorSuccess,
    colorInfo,
    colorWarning,
    colorError,
    colorTextHeading,
    notificationBg,
    notificationPadding,
    notificationMarginEdge,
    motionDurationMid,
    motionEaseInOut,
    fontSize,
    lineHeight,
    width,
    notificationIconSize,
  } = token;

  const noticeCls = `${componentCls}-notice`;
  const cssVarMatch =
    typeof token.progressBg === 'string'
      ? /^var\(--(.+)-notification-progress-bg\)$/.exec(token.progressBg)
      : null;
  const cssVarPrefix = cssVarMatch?.[1];

  const notificationFadeIn = new Keyframes('antNotificationFadeIn', {
    '0%': {
      left: {
        _skip_check_: true,
        value: width,
      },
      opacity: 0,
    },

    '100%': {
      left: {
        _skip_check_: true,
        value: 0,
      },
      opacity: 1,
    },
  });

  const notificationFadeOut = new Keyframes('antNotificationFadeOut', {
    '0%': {
      maxHeight: token.animationMaxHeight,
      marginBottom: notificationMarginBottom,
      opacity: 1,
    },

    '100%': {
      maxHeight: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0,
    },
  });

  return [
    // ============================ Holder ============================
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'fixed',
        zIndex: token.zIndexPopup,
        marginInlineEnd: notificationMarginEdge,

        [`${componentCls}-hook-holder`]: {
          position: 'relative',
        },

        [`&${componentCls}-top, &${componentCls}-bottom`]: {
          [`${componentCls}-notice`]: {
            marginInline: 'auto auto',
          },
        },

        [`&${componentCls}-topLeft, &${componentCls}-bottomLeft`]: {
          [`${componentCls}-notice`]: {
            marginInlineEnd: 'auto',
            marginInlineStart: 0,
          },
        },

        //  animation
        [`${componentCls}-fade-enter, ${componentCls}-fade-appear`]: {
          animationDuration: token.motionDurationMid,
          animationTimingFunction: motionEaseInOut,
          animationFillMode: 'both',
          opacity: 0,
          animationPlayState: 'paused',
        },

        [`${componentCls}-fade-leave`]: {
          animationTimingFunction: motionEaseInOut,
          animationFillMode: 'both',

          animationDuration: motionDurationMid,
          animationPlayState: 'paused',
        },

        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]:
          {
            animationName: notificationFadeIn,
            animationPlayState: 'running',
          },

        [`${componentCls}-fade-leave${componentCls}-fade-leave-active`]: {
          animationName: notificationFadeOut,
          animationPlayState: 'running',
        },

        // placement
        ...genNotificationPlacementStyle(token),

        // stack
        [`&${componentCls}-stack`]: {
          [`> div`]: {
            position: 'relative',
          },

          [noticeCls]: {
            transition: `transform ${motionDurationMid} ${motionEaseInOut}, opacity ${motionDurationMid} ${motionEaseInOut}, box-shadow ${motionDurationMid} ${motionEaseInOut}`,
            transformOrigin: 'top center',
          },

          [`&:not(${componentCls}-stack-expanded)`]: {
            [`> div`]: {
              display: 'grid',
            },

            [noticeCls]: {
              gridArea: '1 / 1',
              marginBottom: 0,
              transform:
                'translateY(calc(min(var(--notification-index, 0), 2) * 8px)) scale(calc(1 - min(var(--notification-index, 0), 2) * 0.06))',
            },

            [`${noticeCls}-stack-hidden`]: {
              opacity: 0,
              pointerEvents: 'none',
            },
          },

          [`&${componentCls}-bottom, &${componentCls}-bottomLeft, &${componentCls}-bottomRight`]: {
            [noticeCls]: {
              transformOrigin: 'bottom center',
            },

            [`&:not(${componentCls}-stack-expanded)`]: {
              [noticeCls]: {
                transform:
                  'translateY(calc(min(var(--notification-index, 0), 2) * -8px)) scale(calc(1 - min(var(--notification-index, 0), 2) * 0.06))',
              },
            },
          },
        },

        // RTL
        '&-rtl': {
          direction: 'rtl',

          [`${noticeCls}-btn, ${noticeCls}-actions`]: {
            float: 'left',
          },
        },
      },
    },

    // ============================ Notice ============================
    {
      [noticeCls]: {
        ...resetComponent(token),
        position: 'relative',
        width,
        maxWidth: `calc(100vw - ${unit(token.calc(notificationMarginEdge).mul(2).equal())})`,
        marginBottom: notificationMarginBottom,
        marginInlineStart: 'auto',
        padding: notificationPadding,
        overflow: 'hidden',
        lineHeight,
        wordWrap: 'break-word',
        background: notificationBg,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,

        // Type background tokens (v6 ComponentToken)
        '&-success': {
          background: cssVarPrefix
            ? `var(--${cssVarPrefix}-notification-color-success-bg, ${notificationBg})`
            : token.colorSuccessBg || notificationBg,
        },
        '&-error': {
          background: cssVarPrefix
            ? `var(--${cssVarPrefix}-notification-color-error-bg, ${notificationBg})`
            : token.colorErrorBg || notificationBg,
        },
        '&-info': {
          background: cssVarPrefix
            ? `var(--${cssVarPrefix}-notification-color-info-bg, ${notificationBg})`
            : token.colorInfoBg || notificationBg,
        },
        '&-warning': {
          background: cssVarPrefix
            ? `var(--${cssVarPrefix}-notification-color-warning-bg, ${notificationBg})`
            : token.colorWarningBg || notificationBg,
        },

        [`${componentCls}-close-icon`]: {
          fontSize,
          cursor: 'pointer',
        },

        [`${noticeCls}-message, ${noticeCls}-title`]: {
          marginBottom: token.marginXS,
          color: colorTextHeading,
          fontSize: fontSizeLG,
          lineHeight: token.lineHeightLG,
        },

        [`${noticeCls}-description`]: {
          fontSize,
        },

        [`&${noticeCls}-closable`]: {
          [`${noticeCls}-message, ${noticeCls}-title, ${noticeCls}-description`]: {
            paddingInlineEnd: token.paddingLG,
          },
          [`${noticeCls}-message + ${noticeCls}-description, ${noticeCls}-title + ${noticeCls}-description`]:
            {
              paddingInlineEnd: 0,
            },
        },

        [`${noticeCls}-with-icon ${noticeCls}-message, ${noticeCls}-with-icon ${noticeCls}-title`]:
          {
            marginBottom: token.marginXS,
            marginInlineStart: token.calc(token.marginSM).add(notificationIconSize).equal(),
            fontSize: fontSizeLG,
          },

        [`${noticeCls}-with-icon ${noticeCls}-description`]: {
          marginInlineStart: token.calc(token.marginSM).add(notificationIconSize).equal(),
          fontSize,
        },

        // Icon & color style in different selector level
        // https://github.com/ant-design/ant-design/issues/16503
        // https://github.com/ant-design/ant-design/issues/15512
        [`${noticeCls}-icon`]: {
          position: 'absolute',
          fontSize: notificationIconSize,
          lineHeight: 0,

          // icon-font
          [`&-success${iconCls}`]: {
            color: colorSuccess,
          },
          [`&-info${iconCls}`]: {
            color: colorInfo,
          },
          [`&-warning${iconCls}`]: {
            color: colorWarning,
          },
          [`&-error${iconCls}`]: {
            color: colorError,
          },
        },

        [`${noticeCls}-close`]: {
          position: 'absolute',
          top: token.notificationPaddingVertical,
          insetInlineEnd: token.notificationPaddingHorizontal,
          color: token.colorIcon,
          outline: 'none',
          width: token.notificationCloseButtonSize,
          height: token.notificationCloseButtonSize,
          borderRadius: token.borderRadiusSM,
          transition: `background-color ${token.motionDurationMid}, color ${token.motionDurationMid}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          [`${componentCls}-close-x`]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
          },

          '&:hover': {
            color: token.colorIconHover,
            backgroundColor: token.wireframe ? 'transparent' : token.colorFillContent,
          },

          '&-disabled': {
            pointerEvents: 'none',
            cursor: 'not-allowed',
            opacity: 0.45,
          },
        },

        [`${noticeCls}-btn, ${noticeCls}-actions`]: {
          float: 'right',
          marginTop: token.marginSM,
        },

        // =========================== Progress ===========================
        [`${noticeCls}-progress`]: {
          position: 'absolute',
          bottom: 0,
          display: 'block',
          appearance: 'none',
          inlineSize: `calc(100% - ${unit(borderRadiusLG)} * 2)`,
          blockSize: token.notificationProgressHeight,
          border: 0,
          left: {
            _skip_check_: true,
            value: borderRadiusLG,
          },
          right: {
            _skip_check_: true,
            value: borderRadiusLG,
          },

          '&, &::-webkit-progress-bar': {
            borderRadius: borderRadiusLG,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },

          '&::-moz-progress-bar': {
            background: token.progressBg,
          },

          '&::-webkit-progress-value': {
            borderRadius: borderRadiusLG,
            background: token.progressBg,
          },
        },
      },
    },

    // ============================= Pure =============================
    {
      [`${noticeCls}-pure-panel`]: {
        margin: 0,

        [`${noticeCls}-btn, ${noticeCls}-actions`]: {
          float: 'none',
          textAlign: 'end',
        },
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Notification',
  token => {
    const notificationPaddingVertical = token.paddingMD;
    const notificationPaddingHorizontal = token.paddingLG;

    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const notificationToken = mergeToken<NotificationToken>(token, {
      // default.less variables
      notificationBg: token.colorBgElevated,
      notificationPaddingVertical,
      notificationPaddingHorizontal,
      // index.less variables
      notificationPadding: `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
      notificationMarginBottom: token.margin,
      notificationMarginEdge: token.marginLG,
      animationMaxHeight: 150,
      notificationIconSize: rawToken.fontSizeLG * rawToken.lineHeightLG,
      notificationCloseButtonSize: rawToken.controlHeightLG * 0.55,
      notificationProgressHeight: 2,
    });

    return [genNotificationStyle(notificationToken)];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
    width: 384,
    progressBg: `linear-gradient(90deg, ${token.colorPrimaryBorderHover}, ${token.colorPrimary})`,
    colorSuccessBg: undefined,
    colorErrorBg: undefined,
    colorInfoBg: undefined,
    colorWarningBg: undefined,
  }),
);
