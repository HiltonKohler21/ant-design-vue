import type { CSSProperties } from 'vue';
import { unit } from '../../_util/cssinjs';
// deps-lint-skip-all
import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
  height: number;
  zIndexPopup: number;
  /**
   * @desc 提示框背景色
   * @descEN Background color of Message
   */
  contentBg: string;
  /**
   * @desc 提示框内边距
   * @descEN Padding of Message
   */
  contentPadding: CSSProperties['padding'];
}

interface MessageToken extends FullToken<'Message'> {
  // Custom token here
  messageNoticeContentPadding: CSSProperties['padding'];
}

const genMessageStyle: GenerateStyle<MessageToken> = token => {
  const {
    componentCls,
    iconCls,
    boxShadowSecondary,
    contentBg,
    colorSuccess,
    colorError,
    colorWarning,
    colorInfo,
    fontSizeLG,
    motionEaseInOutCirc,
    motionEaseInOut,
    motionDurationMid,
    motionDurationSlow,
    marginXS,
    paddingXS,
    borderRadiusLG,
    zIndexPopup,
    // Custom token
    messageNoticeContentPadding,
  } = token;

  const noticeCls = `${componentCls}-notice`;

  const messageMoveIn = new Keyframes('MessageMoveIn', {
    '0%': {
      transform: 'translateY(-100%)',
      opacity: 0,
    },

    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  });

  const messageMoveOut = new Keyframes('MessageMoveOut', {
    '0%': {
      maxHeight: token.height,
      opacity: 1,
    },
    '100%': {
      maxHeight: 0,
      marginBlock: 0,
      paddingBlock: 0,
      opacity: 0,
    },
  });

  return [
    // ============================ Holder ============================
    {
      [componentCls]: {
        ...resetComponent(token),
        position: 'fixed',
        top: marginXS,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        pointerEvents: 'none',
        zIndex: zIndexPopup,

        [`${componentCls}-move-up`]: {
          animationFillMode: 'forwards',
        },
        [`
        ${componentCls}-move-up-appear,
        ${componentCls}-move-up-enter
      `]: {
          animationName: messageMoveIn,
          animationDuration: motionDurationSlow,
          animationPlayState: 'paused',
          animationTimingFunction: motionEaseInOutCirc,
        },
        [`
        ${componentCls}-move-up-appear${componentCls}-move-up-appear-active,
        ${componentCls}-move-up-enter${componentCls}-move-up-enter-active
      `]: {
          animationPlayState: 'running',
        },
        [`${componentCls}-move-up-leave`]: {
          animationName: messageMoveOut,
          animationDuration: motionDurationSlow,
          animationPlayState: 'paused',
          animationTimingFunction: motionEaseInOutCirc,
        },
        [`${componentCls}-move-up-leave${componentCls}-move-up-leave-active`]: {
          animationPlayState: 'running',
        },

        // Stack
        [`&${componentCls}-stack`]: {
          [`> div`]: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },

          [noticeCls]: {
            transition: `transform ${motionDurationMid} ${motionEaseInOut}, opacity ${motionDurationMid} ${motionEaseInOut}`,
            transformOrigin: 'top center',
          },

          [`&:not(${componentCls}-stack-expanded)`]: {
            [`> div`]: {
              display: 'grid',
              justifyItems: 'center',
            },

            [noticeCls]: {
              gridArea: '1 / 1',
              marginBlock: 0,
              transform:
                'translateY(calc(min(var(--notification-index, 0), 2) * 8px)) scale(calc(1 - min(var(--notification-index, 0), 2) * 0.06))',
            },

            [`${noticeCls}-stack-hidden`]: {
              opacity: 0,
              pointerEvents: 'none',
            },
          },
        },

        '&-rtl': {
          direction: 'rtl',
          span: {
            direction: 'rtl',
          },
        },
      },
    },

    // ============================ Notice ============================
    {
      [noticeCls]: {
        width: 'max-content',
        maxWidth: '100%',
        marginInline: 'auto',
        marginBlock: paddingXS,
        padding: messageNoticeContentPadding,
        background: contentBg,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        pointerEvents: 'all',
        textAlign: 'center',

        [iconCls]: {
          verticalAlign: 'text-bottom',
          marginInlineEnd: marginXS, // affected by ltr or rtl
          fontSize: fontSizeLG,
        },

        [`${noticeCls}-content`]: {
          display: 'inline-block',
        },

        [`${componentCls}-success ${iconCls}`]: {
          color: colorSuccess,
        },
        [`${componentCls}-error ${iconCls}`]: {
          color: colorError,
        },
        [`${componentCls}-warning ${iconCls}`]: {
          color: colorWarning,
        },
        [`
        ${componentCls}-info ${iconCls},
        ${componentCls}-loading ${iconCls}`]: {
          color: colorInfo,
        },
      },
    },

    // ============================= Pure =============================
    {
      [`${noticeCls}-pure-panel`]: {
        margin: 0,
        textAlign: 'start',
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Message',
  token => {
    // Gen-style functions here
    const combinedToken = mergeToken<MessageToken>(token, {
      messageNoticeContentPadding:
        typeof token.contentPadding === 'number'
          ? unit(token.contentPadding)
          : token.contentPadding,
    });
    return [genMessageStyle(combinedToken)];
  },
  token => {
    const rawToken: any = (token as any)._realToken ?? token;
    return {
      height: 150,
      zIndexPopup: token.zIndexPopupBase + 10,
      contentBg: token.colorBgElevated,
      contentPadding: `${
        (rawToken.controlHeightLG - rawToken.fontSize * rawToken.lineHeight) / 2
      }px ${rawToken.paddingSM}px`,
    };
  },
);
