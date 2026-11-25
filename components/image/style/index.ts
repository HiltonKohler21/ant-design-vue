import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import { genModalMaskStyle } from '../../modal/style';
import { initZoomMotion, initFadeMotion } from '../../style/motion';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';
import { inkFlow1, inkFlow2, inkFlow3, progressActive } from './progressAnimation';

export interface ComponentToken {
  /**
   * @desc 预览浮层 z-index
   * @descEN z-index of preview popup
   */
  zIndexPopup: number;
  /**
   * @desc 预览操作图标大小
   * @descEN Size of preview operation icon
   */
  previewOperationSize: number;
  /**
   * @desc 预览操作图标颜色
   * @descEN Color of preview operation icon
   */
  previewOperationColor: string;
  /**
   * @desc 预览操作图标悬浮颜色
   * @descEN Color of hovered preview operation icon
   */
  previewOperationHoverColor: string;
  /**
   * @desc 预览操作图标禁用颜色
   * @descEN Disabled color of preview operation icon
   */
  previewOperationColorDisabled: string;
  /**
   * @desc 加载动画基础时长
   * @descEN Base duration of loading animation
   */
  progressAnimationDuration: string;
}

export interface ImageToken extends FullToken<'Image'> {
  previewCls: string;
  modalMaskBg: string;
  imagePreviewSwitchSize: number;
}

export type PositionType = 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky' | undefined;

export const genBoxStyle = (position?: PositionType): CSSObject => ({
  position: position || 'absolute',
  inset: 0,
});

export const genImageMaskStyle = (token: ImageToken): CSSObject => {
  const { iconCls, motionDurationSlow, paddingXXS, marginXXS, prefixCls } = token;
  return {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: new TinyColor('#000').setAlpha(0.5).toRgbString(),
    cursor: 'pointer',
    opacity: 0,
    transition: `opacity ${motionDurationSlow}`,

    [`.${prefixCls}-mask-info`]: {
      ...textEllipsis,
      padding: `0 ${unit(paddingXXS)}`,
      [iconCls]: {
        marginInlineEnd: marginXXS,
        svg: {
          verticalAlign: 'baseline',
        },
      },
    },
  };
};

export const genPreviewOperationsStyle = (token: ImageToken): CSSObject => {
  const {
    previewCls,
    modalMaskBg,
    paddingSM,
    previewOperationHoverColor,
    previewOperationColorDisabled,
    motionDurationSlow,
  } = token;

  const operationBg = new TinyColor((token as any)._realToken?.modalMaskBg ?? modalMaskBg).setAlpha(
    0.1,
  );
  const operationBgHover = operationBg.clone().setAlpha(0.2);

  return {
    [`${previewCls}-operations`]: {
      ...resetComponent(token),
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      color: token.previewOperationColor,
      listStyle: 'none',
      background: operationBg.toRgbString(),
      pointerEvents: 'auto',

      '&-operation': {
        marginInlineStart: paddingSM,
        padding: paddingSM,
        cursor: 'pointer',
        transition: `all ${motionDurationSlow}`,
        userSelect: 'none',

        '&:hover': {
          color: previewOperationHoverColor,
          background: operationBgHover.toRgbString(),
        },

        '&-disabled': {
          color: previewOperationColorDisabled,
          pointerEvents: 'none',
        },

        '&:last-of-type': {
          marginInlineStart: 0,
        },
      },

      '&-progress': {
        position: 'absolute',
        left: { _skip_check_: true, value: '50%' },
        transform: 'translateX(-50%)',
      },

      '&-icon': {
        fontSize: token.previewOperationSize,
      },
    },
  };
};

export const genPreviewSwitchStyle = (token: ImageToken): CSSObject => {
  const {
    modalMaskBg,
    iconCls,
    previewOperationColorDisabled,
    previewCls,
    zIndexPopup,
    motionDurationSlow,
  } = token;

  const operationBg = new TinyColor((token as any)._realToken?.modalMaskBg ?? modalMaskBg).setAlpha(
    0.1,
  );
  const operationBgHover = operationBg.clone().setAlpha(0.2);

  return {
    [`${previewCls}-switch-left, ${previewCls}-switch-right`]: {
      position: 'fixed',
      insetBlockStart: '50%',
      zIndex: token.calc(zIndexPopup).add(1).equal({ unit: false }),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: token.imagePreviewSwitchSize,
      height: token.imagePreviewSwitchSize,
      marginTop: token.calc(token.imagePreviewSwitchSize).div(2).mul(-1).equal(),
      color: token.previewOperationColor,
      background: operationBg.toRgbString(),
      borderRadius: '50%',
      transform: `translateY(-50%)`,
      cursor: 'pointer',
      transition: `all ${motionDurationSlow}`,
      pointerEvents: 'auto',
      userSelect: 'none',

      '&:hover': {
        color: token.previewOperationHoverColor,
        background: operationBgHover.toRgbString(),
      },

      [`&-disabled`]: {
        '&, &:hover': {
          color: previewOperationColorDisabled,
          background: 'transparent',
          cursor: 'not-allowed',
          [`> ${iconCls}`]: {
            cursor: 'not-allowed',
          },
        },
      },
      [`> ${iconCls}`]: {
        fontSize: token.previewOperationSize,
      },
    },

    [`${previewCls}-switch-left`]: {
      insetInlineStart: token.marginSM,
    },

    [`${previewCls}-switch-right`]: {
      insetInlineEnd: token.marginSM,
    },
  };
};

export const genImagePreviewStyle: GenerateStyle<ImageToken> = (token: ImageToken) => {
  const { motionEaseOut, previewCls, motionDurationSlow, componentCls } = token;

  return [
    {
      [`${componentCls}-preview-root`]: {
        [previewCls]: {
          height: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
        },

        [`${previewCls}-mask`]: {
          transition: `backdrop-filter ${motionDurationSlow}`,

          [`&${previewCls}-mask-blur`]: {
            backdropFilter: 'blur(4px)',
          },

          [`&${previewCls}-mask-hidden`]: {
            display: 'none',
          },
        },

        [`${previewCls}-body`]: {
          ...genBoxStyle(),
          overflow: 'hidden',
        },

        [`${previewCls}-img`]: {
          maxWidth: '100%',
          maxHeight: '100%',
          verticalAlign: 'middle',
          transform: 'scale3d(1, 1, 1)',
          cursor: 'grab',
          transition: `transform ${motionDurationSlow} ${motionEaseOut} 0s`,
          userSelect: 'none',
          pointerEvents: 'auto',

          '&-wrapper': {
            ...genBoxStyle(),
            transition: `transform ${motionDurationSlow} ${motionEaseOut} 0s`,

            // https://github.com/ant-design/ant-design/issues/39913
            // TailwindCSS will reset img default style.
            // Let's set back.
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            '&::before': {
              display: 'inline-block',
              width: 1,
              height: '50%',
              marginInlineEnd: -1,
              content: '""',
            },
          },
        },

        [`${previewCls}-not-movable`]: {
          [`${previewCls}-img`]: {
            cursor: 'default',
          },
        },

        [`${previewCls}-moving`]: {
          [`${previewCls}-img`]: {
            cursor: 'grabbing',

            '&-wrapper': {
              transitionDuration: '0s',
            },
          },
        },
      },
    },
    // Override
    {
      [`${componentCls}-preview-root`]: {
        [`${previewCls}-wrap`]: {
          zIndex: token.zIndexPopup,
        },
      },
    },

    // Preview operations & switch
    {
      [`${componentCls}-preview-operations-wrapper`]: {
        position: 'fixed',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        zIndex: token.calc(token.zIndexPopup).add(1).equal({ unit: false }),
        width: '100%',
      },
      '&': [genPreviewOperationsStyle(token), genPreviewSwitchStyle(token)],
    },
  ];
};

const genImageStyle: GenerateStyle<ImageToken> = (token: ImageToken) => {
  const { componentCls } = token;
  return {
    // ============================== image ==============================
    [componentCls]: {
      position: 'relative',
      display: 'inline-block',
      [`${componentCls}-img`]: {
        width: '100%',
        height: 'auto',
        verticalAlign: 'middle',
      },
      [`${componentCls}-img-placeholder`]: {
        backgroundColor: token.colorBgContainerDisabled,
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuNSAyLjVoLTEzQS41LjUgMCAwIDAgMSAzdjEwYS41LjUgMCAwIDAgLjUuNWgxM2EuNS41IDAgMCAwIC41LS41VjNhLjUuNSAwIDAgMC0uNS0uNXpNNS4yODEgNC43NWExIDEgMCAwIDEgMCAyIDEgMSAwIDAgMSAwLTJ6bTguMDMgNi44M2EuMTI3LjEyNyAwIDAgMS0uMDgxLjAzSDIuNzY5YS4xMjUuMTI1IDAgMCAxLS4wOTYtLjIwN2wyLjY2MS0zLjE1NmEuMTI2LjEyNiAwIDAgMSAuMTc3LS4wMTZsLjAxNi4wMTZMNy4wOCAxMC4wOWwyLjQ3LTIuOTNhLjEyNi4xMjYgMCAwIDEgLjE3Ny0uMDE2bC4wMTUuMDE2IDMuNTg4IDQuMjQ0YS4xMjcuMTI3IDAgMCAxLS4wMi4xNzV6IiBmaWxsPSIjOEM4QzhDIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '30%',
      },
      [`${componentCls}-mask`]: {
        ...genImageMaskStyle(token),
      },
      [`${componentCls}-mask:hover`]: {
        opacity: 1,
      },
      [`${componentCls}-cover-top`]: {
        inset: '0 0 auto 0',
        justifyContent: 'center',
      },
      [`${componentCls}-cover-bottom`]: {
        inset: 'auto 0 0 0',
        justifyContent: 'center',
      },
      [`${componentCls}-placeholder`]: {
        ...genBoxStyle(),
      },
    },
  };
};

const genPreviewMotion: GenerateStyle<ImageToken> = token => {
  const { previewCls } = token;

  return {
    [`${previewCls}-root`]: initZoomMotion(token, 'zoom'),
    [`&`]: initFadeMotion(token, true),
  };
};

export const prepareComponentToken = (token: any): ComponentToken => ({
  zIndexPopup: token.zIndexPopupBase + 80,
  previewOperationColor: new TinyColor(token.colorTextLightSolid).setAlpha(0.65).toRgbString(),
  previewOperationHoverColor: new TinyColor(token.colorTextLightSolid).setAlpha(0.85).toRgbString(),
  previewOperationColorDisabled: new TinyColor(token.colorTextLightSolid)
    .setAlpha(0.25)
    .toRgbString(),
  previewOperationSize: token.fontSizeIcon * 1.5, // FIXME: fontSizeIconLG
  progressAnimationDuration: '3s',
});

const genImageProgressStyle: GenerateStyle<ImageToken> = (token: ImageToken): CSSObject => {
  const { componentCls, motionDurationMid, motionEaseInOut, progressAnimationDuration } = token;

  const inkBaseStyle: CSSObject = {
    position: 'absolute',
    width: '150%',
    height: '150%',
    left: '-25%',
    top: '-25%',
    animationTimingFunction: motionEaseInOut,
    animationIterationCount: 'infinite',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  };

  return {
    [`${componentCls}-progress-wrapper`]: {
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
      borderRadius: 'inherit',
      backgroundColor: token.colorBgBase,
      backdropFilter: 'blur(8px)',

      [`${componentCls}-progress-ink-1`]: {
        ...inkBaseStyle,
        background:
          'radial-gradient(ellipse 65% 55% at 25% 30%, rgba(100, 180, 255, 0.98) 0%, transparent 55%)',
        animationName: inkFlow1,
        animationDuration: progressAnimationDuration,
        filter: 'blur(40px)',

        '&::before': {
          content: '""',
          ...inkBaseStyle,
          background:
            'radial-gradient(ellipse 60% 65% at 75% 45%, rgba(180, 140, 255, 0.95) 0%, transparent 50%)',
          animationName: inkFlow2,
          animationDuration: `calc(${progressAnimationDuration} + 2s)`,
          animationDelay: '-1s',
          filter: 'blur(45px)',
        },

        '&::after': {
          content: '""',
          ...inkBaseStyle,
          background:
            'radial-gradient(ellipse 55% 50% at 50% 70%, rgba(100, 220, 220, 0.9) 0%, transparent 45%)',
          animationName: inkFlow3,
          animationDuration: `calc(${progressAnimationDuration} + 0.5s)`,
          animationDelay: '-2s',
          filter: 'blur(38px)',
        },
      },

      [`${componentCls}-progress-ink-2`]: {
        ...inkBaseStyle,
        background:
          'radial-gradient(ellipse 45% 40% at 60% 20%, rgba(255, 150, 200, 0.88) 0%, transparent 45%)',
        animationName: inkFlow3,
        animationDuration: `calc(${progressAnimationDuration} + 1.5s)`,
        animationDelay: '-3s',
        filter: 'blur(42px)',

        '&::before': {
          content: '""',
          ...inkBaseStyle,
          background:
            'radial-gradient(ellipse 50% 55% at 20% 75%, rgba(160, 190, 255, 0.88) 0%, transparent 50%)',
          animationName: inkFlow1,
          animationDuration: `calc(${progressAnimationDuration} + 2.5s)`,
          animationDelay: '-2.5s',
          filter: 'blur(35px)',
        },
      },

      [`${componentCls}-progress-content`]: {
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingInline: token.paddingLG,
        textAlign: 'center',
        fontSize: token.fontSize,
        color: token.colorTextSecondary,
        zIndex: 1,
      },

      [`${componentCls}-progress-rail`]: {
        width: '100%',
        height: 6,
        marginTop: token.marginSM,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: token.borderRadiusXS,
        overflow: 'hidden',
        backdropFilter: 'blur(4px)',

        '&::before': {
          content: '""',
          display: 'block',
          height: '100%',
          width: 'var(--progress-percent, 0%)',
          background:
            'linear-gradient(90deg, rgba(120, 170, 255, 0.85) 0%, rgba(160, 150, 245, 0.85) 40%, rgba(130, 200, 220, 0.85) 60%, rgba(120, 170, 255, 0.85) 100%)',
          backgroundSize: '200% 100%',
          borderRadius: token.calc(token.borderRadiusXS).div(2).equal(),
          transition: `width ${motionDurationMid} ease`,
          animationName: progressActive,
          animationDuration: progressAnimationDuration,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        },
      },

      [`${componentCls}-progress-indicator`]: {
        marginTop: token.marginXS,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Image',
  token => {
    const previewCls = `${token.componentCls}-preview`;

    const imageToken = mergeToken<ImageToken>(token, {
      previewCls,
      modalMaskBg: new TinyColor('#000').setAlpha(0.45).toRgbString(), // FIXME: Shared Token
      imagePreviewSwitchSize: token.controlHeightLG,
    });

    return [
      genImageStyle(imageToken),
      genImageProgressStyle(imageToken),
      genImagePreviewStyle(imageToken),
      genModalMaskStyle(mergeToken<ImageToken>(imageToken, { componentCls: previewCls })),
      genPreviewMotion(imageToken),
    ];
  },
  prepareComponentToken,
);
