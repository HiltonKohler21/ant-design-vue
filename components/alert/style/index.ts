import type { CSSProperties } from 'vue';
import { unit } from '../../_util/cssinjs';
import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { genFocusStyle, resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 容器圆角
   * @descEN Border radius of the container
   * @since 6.7.0
   */
  containerBorderRadius: CSSProperties['borderRadius'];
  /**
   * @desc 默认内间距
   * @descEN Default padding
   */
  defaultPadding: CSSProperties['padding'];
  /**
   * @desc 带有描述的内间距
   * @descEN Padding with description
   */
  withDescriptionPadding: CSSProperties['padding'];
  /**
   * @desc 带有描述时的图标尺寸
   * @descEN Icon size with description
   */
  withDescriptionIconSize: number | string;
}

type AlertToken = FullToken<'Alert'>;

const genAlertTypeStyle = (bgColor: string, iconColor: string, alertCls: string): CSSObject => ({
  backgroundColor: bgColor,
  [`${alertCls}-icon`]: {
    color: iconColor,
  },
});

export const genBaseStyle: GenerateStyle<AlertToken> = (token: AlertToken): CSSObject => {
  const {
    componentCls,
    motionDurationSlow: duration,
    marginXS,
    marginSM,
    fontSize,
    fontSizeLG,
    lineHeight,
    motionEaseInOutCirc,
    containerBorderRadius,
    withDescriptionIconSize,
    colorText,
    colorTextHeading,
    withDescriptionPadding,
    defaultPadding,
    lineWidth,
    lineType,
    colorSuccessBorder,
    colorWarningBorder,
    colorErrorBorder,
    colorInfoBorder,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: defaultPadding,
      wordWrap: 'break-word',
      borderRadius: containerBorderRadius,
      borderWidth: unit(lineWidth),
      borderStyle: lineType,

      [`&${componentCls}-success`]: {
        borderColor: colorSuccessBorder,
      },

      [`&${componentCls}-info`]: {
        borderColor: colorInfoBorder,
      },

      [`&${componentCls}-warning`]: {
        borderColor: colorWarningBorder,
      },

      [`&${componentCls}-error`]: {
        borderColor: colorErrorBorder,
      },

      [`&${componentCls}-filled`]: {
        borderColor: 'transparent',
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`${componentCls}-content, ${componentCls}-section`]: {
        flex: 1,
        minWidth: 0,
      },

      [`${componentCls}-icon`]: {
        marginInlineEnd: marginXS,
        lineHeight: 0,
      },

      [`&-description`]: {
        display: 'none',
        fontSize,
        lineHeight,
      },

      '&-message, &-title': {
        color: colorTextHeading,
      },

      [`&${componentCls}-motion-leave`]: {
        overflow: 'hidden',
        opacity: 1,
        transition: `max-height ${duration} ${motionEaseInOutCirc}, opacity ${duration} ${motionEaseInOutCirc},
        padding-top ${duration} ${motionEaseInOutCirc}, padding-bottom ${duration} ${motionEaseInOutCirc},
        margin-bottom ${duration} ${motionEaseInOutCirc}`,
      },

      [`&${componentCls}-motion-leave-active`]: {
        maxHeight: 0,
        marginBottom: '0 !important',
        paddingTop: 0,
        paddingBottom: 0,
        opacity: 0,
      },
    },

    [`${componentCls}-with-description`]: {
      alignItems: 'flex-start',
      padding: withDescriptionPadding,

      [`${componentCls}-icon`]: {
        marginInlineEnd: marginSM,
        fontSize: withDescriptionIconSize,
        lineHeight: 0,
      },

      [`${componentCls}-message, ${componentCls}-title`]: {
        display: 'block',
        marginBottom: marginXS,
        color: colorTextHeading,
        fontSize: fontSizeLG,
      },

      [`${componentCls}-description`]: {
        display: 'block',
        color: colorText,
      },
    },

    [`${componentCls}-banner`]: {
      marginBottom: 0,
      border: '0 !important',
      borderRadius: 0,
    },
  };
};

export const genTypeStyle: GenerateStyle<AlertToken> = (token: AlertToken): CSSObject => {
  const {
    componentCls,

    colorSuccess,
    colorSuccessBg,

    colorWarning,
    colorWarningBg,

    colorError,
    colorErrorBg,

    colorInfo,
    colorInfoBg,
  } = token;

  return {
    [componentCls]: {
      '&-success': genAlertTypeStyle(colorSuccessBg, colorSuccess, componentCls),
      '&-info': genAlertTypeStyle(colorInfoBg, colorInfo, componentCls),
      '&-warning': genAlertTypeStyle(colorWarningBg, colorWarning, componentCls),
      '&-error': {
        ...genAlertTypeStyle(colorErrorBg, colorError, componentCls),
        [`${componentCls}-description > pre`]: {
          margin: 0,
          padding: 0,
        },
      },
    },
  };
};

export const genActionStyle: GenerateStyle<AlertToken> = (token: AlertToken): CSSObject => {
  const {
    componentCls,
    iconCls,
    motionDurationMid,
    marginXS,
    fontSizeIcon,
    colorIcon,
    colorIconHover,
    colorTextDisabled,
  } = token;

  return {
    [componentCls]: {
      [`&-action, &-actions`]: {
        marginInlineStart: marginXS,
      },

      [`${componentCls}-close-icon`]: {
        marginInlineStart: marginXS,
        padding: 0,
        overflow: 'hidden',
        fontSize: fontSizeIcon,
        lineHeight: `${unit(fontSizeIcon)}`,
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        ...genFocusStyle(token),

        [`${iconCls}-close`]: {
          color: colorIcon,
          transition: `color ${motionDurationMid}`,
          '&:hover': {
            color: colorIconHover,
          },
        },

        '&:disabled': {
          cursor: 'not-allowed',
          color: colorTextDisabled,
          [`${iconCls}-close`]: {
            color: 'inherit',
            pointerEvents: 'none',
          },
        },
      },

      '&-close-text': {
        color: colorIcon,
        transition: `color ${motionDurationMid}`,
        '&:hover': {
          color: colorIconHover,
        },
      },
    },
  };
};

export const genAlertStyle: GenerateStyle<AlertToken> = (token: AlertToken): CSSInterpolation => [
  genBaseStyle(token),
  genTypeStyle(token),
  genActionStyle(token),
];

export const prepareComponentToken = (token: any): ComponentToken => {
  const paddingHorizontal = 12; // Fixed value here.
  return {
    containerBorderRadius: token.borderRadiusLG,
    withDescriptionIconSize: token.fontSizeHeading3,
    defaultPadding: `${token.paddingContentVerticalSM}px ${paddingHorizontal}px`,
    withDescriptionPadding: `${token.paddingMD}px ${token.paddingContentHorizontalLG}px`,
  };
};

export default genComponentStyleHook(
  'Alert',
  token => [genAlertStyle(token)],
  prepareComponentToken,
);
