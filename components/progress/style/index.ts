import { Keyframes } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 进度条默认颜色
   * @descEN Default color of progress bar
   */
  defaultColor: string;
  /**
   * @desc 进度条剩余部分颜色
   * @descEN Color of remaining part of progress bar
   */
  remainingColor: string;
  /**
   * @desc 圆形进度条文字颜色
   * @descEN Text color of circular progress bar
   */
  circleTextColor: string;
  /**
   * @desc 条状进度条圆角
   * @descEN Border radius of line progress bar
   */
  lineBorderRadius: number;
  /**
   * @desc 圆形进度条文本大小
   * @descEN Text size of circular progress bar
   */
  circleTextFontSize: string;
  /**
   * @desc 圆形进度条图标大小
   * @descEN Icon size of circular progress bar
   */
  circleIconFontSize: string;
}

interface ProgressToken extends FullToken<'Progress'> {
  progressLineRadius: number;
  progressInfoTextColor: string;
  progressRemainingColor: string;
  progressDefaultColor: string;
  progressStepMinWidth: number | string;
  progressStepMarginInlineEnd: number | string;
  progressActiveMotionDuration: string;
}

const antProgressActive = new Keyframes('antProgressActive', {
  '0%': {
    transform: 'translateX(-100%) scaleX(0)',
    opacity: 0.1,
  },
  '20%': {
    transform: 'translateX(-100%) scaleX(0)',
    opacity: 0.5,
  },
  to: {
    transform: 'translateX(0) scaleX(1)',
    opacity: 0,
  },
});

const genBaseStyle: GenerateStyle<ProgressToken> = token => {
  const { componentCls: progressCls, iconCls: iconPrefixCls } = token;

  return {
    [progressCls]: {
      ...resetComponent(token),

      display: 'inline-block',

      '&-rtl': {
        direction: 'rtl',
      },

      '&-line': {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        fontSize: token.fontSize,
        [`&${progressCls}-steps`]: {
          display: 'inline-block',
          width: 'auto',
        },
      },

      [`${progressCls}-outer`]: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      },

      [`&${progressCls}-line-position-outer, &${progressCls}-line-position-inner`]: {
        [`${progressCls}-outer`]: {
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          [`${progressCls}-inner`]: {
            flex: 1,
            minWidth: 0,
          },
        },
      },

      [`${progressCls}-layout-bottom`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '100%',
        [`${progressCls}-text`]: {
          width: 'max-content',
          minWidth: 'unset',
          marginInlineStart: 0,
          marginTop: token.marginXXS,
        },
      },

      [`${progressCls}-inner`]: {
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        verticalAlign: 'middle',
        backgroundColor: token.progressRemainingColor,
        borderRadius: token.progressLineRadius,
      },

      [`${progressCls}-inner:not(${progressCls}-circle-gradient)`]: {
        [`${progressCls}-circle-path`]: {
          stroke: token.progressDefaultColor,
        },
      },

      [`${progressCls}-success-bg, ${progressCls}-bg`]: {
        position: 'relative',
        backgroundColor: token.progressDefaultColor,
        borderRadius: token.progressLineRadius,
        transition: `all ${token.motionDurationSlow} ${token.motionEaseInOutCirc}`,
      },

      [`${progressCls}-bg-inner`]: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 'max-content',
        [`${progressCls}-text${progressCls}-text-inner`]: {
          color: token.colorWhite,
          [`&${progressCls}-text-bright`]: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
      },

      [`${progressCls}-success-bg`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        backgroundColor: token.colorSuccess,
      },

      [`${progressCls}-text`]: {
        display: 'inline-block',
        flexShrink: 0,
        minWidth: '2em',
        marginInlineStart: token.marginXS,
        color: token.progressInfoTextColor,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textAlign: 'start',
        verticalAlign: 'middle',
        wordBreak: 'normal',
        [iconPrefixCls]: {
          fontSize: token.fontSize,
        },
        [`&${progressCls}-text-outer`]: {
          width: 'max-content',
          minWidth: 'unset',
        },
        [`&${progressCls}-text-outer${progressCls}-text-start`]: {
          width: 'max-content',
          minWidth: 'unset',
          marginInlineStart: 0,
          marginInlineEnd: token.marginXS,
        },
        [`&${progressCls}-text-outer${progressCls}-text-center`]: {
          width: 'max-content',
          minWidth: 'unset',
          marginInlineStart: 0,
        },
      },

      [`${progressCls}-text-inner`]: {
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minWidth: 'unset',
        height: '100%',
        marginInlineStart: 0,
        paddingInline: token.paddingXXS,
        [`&${progressCls}-text-start`]: {
          justifyContent: 'start',
        },
        [`&${progressCls}-text-center`]: {
          justifyContent: 'center',
        },
        [`&${progressCls}-text-end`]: {
          justifyContent: 'end',
        },
      },

      [`&${progressCls}-status-active`]: {
        [`${progressCls}-bg::before`]: {
          position: 'absolute',
          inset: 0,
          backgroundColor: token.colorBgContainer,
          borderRadius: token.progressLineRadius,
          opacity: 0,
          animationName: antProgressActive,
          animationDuration: token.progressActiveMotionDuration,
          animationTimingFunction: token.motionEaseOutQuint,
          animationIterationCount: 'infinite',
          content: '""',
        },
      },

      [`&${progressCls}-status-exception`]: {
        [`${progressCls}-bg`]: {
          backgroundColor: token.colorError,
        },
        [`${progressCls}-text:not(${progressCls}-text-inner)`]: {
          color: token.colorError,
        },
      },

      [`&${progressCls}-status-exception ${progressCls}-inner:not(${progressCls}-circle-gradient)`]:
        {
          [`${progressCls}-circle-path`]: {
            stroke: token.colorError,
          },
        },

      [`&${progressCls}-status-success`]: {
        [`${progressCls}-bg`]: {
          backgroundColor: token.colorSuccess,
        },
        [`${progressCls}-text:not(${progressCls}-text-inner)`]: {
          color: token.colorSuccess,
        },
      },

      [`&${progressCls}-status-success ${progressCls}-inner:not(${progressCls}-circle-gradient)`]: {
        [`${progressCls}-circle-path`]: {
          stroke: token.colorSuccess,
        },
      },
    },
  };
};

const genCircleStyle: GenerateStyle<ProgressToken> = token => {
  const { componentCls: progressCls, iconCls: iconPrefixCls } = token;

  return {
    [progressCls]: {
      [`${progressCls}-circle-trail`]: {
        stroke: token.progressRemainingColor,
      },

      [`&${progressCls}-circle ${progressCls}-inner`]: {
        position: 'relative',
        lineHeight: 1,
        backgroundColor: 'transparent',
      },

      [`&${progressCls}-circle ${progressCls}-text`]: {
        position: 'absolute',
        insetBlockStart: '50%',
        insetInlineStart: 0,
        width: '100%',
        margin: 0,
        padding: 0,
        color: token.circleTextColor,
        fontSize: token.circleTextFontSize,
        lineHeight: 1,
        whiteSpace: 'normal',
        textAlign: 'center',
        transform: 'translateY(-50%)',

        [iconPrefixCls]: {
          fontSize: token.circleIconFontSize,
        },
      },

      [`${progressCls}-circle&-status-exception`]: {
        [`${progressCls}-text`]: {
          color: token.colorError,
        },
      },

      [`${progressCls}-circle&-status-success`]: {
        [`${progressCls}-text`]: {
          color: token.colorSuccess,
        },
      },
    },
    [`${progressCls}-inline-circle`]: {
      lineHeight: 1,
      [`${progressCls}-inner`]: {
        verticalAlign: 'bottom',
      },
    },
  };
};

const genStepStyle: GenerateStyle<ProgressToken> = (token: ProgressToken): CSSObject => {
  const { componentCls: progressCls } = token;

  return {
    [progressCls]: {
      [`${progressCls}-steps`]: {
        display: 'inline-block',
        '&-outer': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '&-item': {
          flexShrink: 0,
          minWidth: token.progressStepMinWidth,
          marginInlineEnd: token.progressStepMarginInlineEnd,
          backgroundColor: token.progressRemainingColor,
          transition: `all ${token.motionDurationSlow}`,

          '&-active': {
            backgroundColor: token.progressDefaultColor,
          },
        },
      },
    },
  };
};

const genSmallLine: GenerateStyle<ProgressToken> = (token: ProgressToken): CSSObject => {
  const { componentCls: progressCls, iconCls: iconPrefixCls } = token;

  return {
    [progressCls]: {
      [`${progressCls}-small&-line, ${progressCls}-small&-line ${progressCls}-text ${iconPrefixCls}`]:
        {
          fontSize: token.fontSizeSM,
        },
    },
  };
};

export default genComponentStyleHook(
  'Progress',
  token => {
    const progressStepMarginInlineEnd = token.calc(token.marginXXS).div(2).equal();

    const progressToken = mergeToken<ProgressToken>(token, {
      progressLineRadius: token.lineBorderRadius,
      progressInfoTextColor: token.colorText,
      progressDefaultColor: token.defaultColor,
      progressRemainingColor: token.remainingColor,
      progressStepMarginInlineEnd,
      progressStepMinWidth: progressStepMarginInlineEnd,
      progressActiveMotionDuration: '2.4s',
    });
    return [
      genBaseStyle(progressToken),
      genCircleStyle(progressToken),
      genStepStyle(progressToken),
      genSmallLine(progressToken),
    ];
  },
  token => ({
    circleTextColor: token.colorText,
    defaultColor: token.colorInfo,
    remainingColor: token.colorFillSecondary,
    lineBorderRadius: 100, // magic for capsule shape, should be a very large number
    circleTextFontSize: '1em',
    circleIconFontSize: `${token.fontSize / token.fontSizeSM}em`,
  }),
);
