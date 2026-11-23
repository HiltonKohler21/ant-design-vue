import { initFadeMotion, initZoomMotion } from '../../style/motion';
import { unit } from '../../_util/cssinjs';
import type { AliasToken, FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import type { TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';
import { clearFix, genFocusStyle, resetComponent } from '../../style';
import type { CSSProperties } from 'vue';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  /**
   * @desc 顶部背景色
   * @descEN Background color of header
   */
  headerBg: string;
  /**
   * @desc 标题行高
   * @descEN Line height of title
   */
  titleLineHeight: number | string;
  /**
   * @desc 标题字体大小
   * @descEN Font size of title
   */
  titleFontSize: number | string;
  /**
   * @desc 标题字体颜色
   * @descEN Font color of title
   */
  titleColor: string;
  /**
   * @desc 内容区域背景色
   * @descEN Background color of content
   */
  contentBg: string;
  /**
   * @desc 底部区域背景色
   * @descEN Background color of footer
   */
  footerBg: string;
  /**
   * @desc 关闭按钮悬浮背景色
   * @descEN Hover background color of close button
   */
  closeBtnHoverBg: string;
}

export interface ModalToken extends FullToken<'Modal'> {
  // Custom token here
  modalBodyPadding: number;
  modalHeaderBg: string;
  modalHeaderPadding: string;
  modalHeaderBorderWidth: number;
  modalHeaderBorderStyle: string;
  modalHeaderTitleLineHeight: number | string;
  modalHeaderTitleFontSize: number | string;
  modalHeaderBorderColorSplit: string;
  modalHeaderCloseSize: number;
  modalContentBg: string;
  modalHeadingColor: string;
  modalCloseColor: string;
  modalCloseBtnSize: number;
  modalFooterBg: string;
  modalFooterBorderColorSplit: string;
  modalFooterBorderStyle: string;
  modalFooterPaddingVertical: number;
  modalFooterPaddingHorizontal: number;
  modalFooterBorderWidth: number;
  modalConfirmTitleFontSize: number;
  modalIconHoverColor: string;
  modalConfirmIconSize: number;
}

function box(position: CSSProperties['position']): CSSProperties {
  return {
    position,
    top: 0,
    insetInlineEnd: 0,
    bottom: 0,
    insetInlineStart: 0,
  };
}

export const genModalMaskStyle: GenerateStyle<TokenWithCommonCls<AliasToken>> = token => {
  const { componentCls } = token;

  return [
    {
      [`${componentCls}-root`]: {
        [`${componentCls}${token.antCls}-zoom-enter, ${componentCls}${token.antCls}-zoom-appear`]: {
          // reset scale avoid mousePosition bug
          transform: 'none',
          opacity: 0,
          animationDuration: token.motionDurationSlow,
          // https://github.com/ant-design/ant-design/issues/11777
          userSelect: 'none',
        },

        [`${componentCls}${token.antCls}-zoom-leave ${componentCls}-content`]: {
          pointerEvents: 'none',
        },

        [`${componentCls}-mask`]: {
          ...box('fixed'),
          zIndex: token.zIndexPopupBase,
          height: '100%',
          backgroundColor: token.colorBgMask,
          [`${componentCls}-hidden`]: {
            display: 'none',
          },
          [`&${componentCls}-mask-blur`]: {
            backdropFilter: 'blur(4px)',
          },
        },

        [`${componentCls}-wrap`]: {
          ...box('fixed'),
          overflow: 'auto',
          outline: 0,
          WebkitOverflowScrolling: 'touch',
        },
      },
    },
    { [`${componentCls}-root`]: initFadeMotion(token) },
  ];
};

const genModalStyle: GenerateStyle<ModalToken> = token => {
  const { componentCls } = token;

  return [
    // ======================== Root =========================
    {
      [`${componentCls}-root`]: {
        [`${componentCls}-wrap`]: {
          zIndex: token.zIndexPopupBase,
          position: 'fixed',
          inset: 0,
          overflow: 'auto',
          outline: 0,
          WebkitOverflowScrolling: 'touch',
        },
        [`${componentCls}-wrap-rtl`]: {
          direction: 'rtl',
        },

        [`${componentCls}-centered`]: {
          textAlign: 'center',

          '&::before': {
            display: 'inline-block',
            width: 0,
            height: '100%',
            verticalAlign: 'middle',
            content: '""',
          },
          [componentCls]: {
            top: 0,
            display: 'inline-block',
            paddingBottom: 0,
            textAlign: 'start',
            verticalAlign: 'middle',
          },
        },

        [`@media (max-width: ${unit(token.screenSMMax)})`]: {
          [componentCls]: {
            maxWidth: 'calc(100vw - 16px)',
            margin: `${unit(token.marginXS)} auto`,
          },
          [`${componentCls}-centered`]: {
            [componentCls]: {
              flex: 1,
            },
          },
        },
      },
    },

    // ======================== Modal ========================
    {
      [componentCls]: {
        ...resetComponent(token),
        pointerEvents: 'none',
        position: 'relative',
        top: 100,
        width: 'auto',
        maxWidth: `calc(100vw - ${unit(token.calc(token.margin).mul(2).equal())})`,
        margin: '0 auto',
        paddingBottom: token.paddingLG,

        [`${componentCls}-title`]: {
          margin: 0,
          color: token.modalHeadingColor,
          fontWeight: token.fontWeightStrong,
          fontSize: token.modalHeaderTitleFontSize,
          lineHeight: token.modalHeaderTitleLineHeight,
          wordWrap: 'break-word',
        },

        [`${componentCls}-content`]: {
          position: 'relative',
          backgroundColor: token.modalContentBg,
          backgroundClip: 'padding-box',
          border: 0,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
          pointerEvents: 'auto',
          padding: `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
        },

        [`${componentCls}-close`]: {
          position: 'absolute',
          top: token.calc(token.modalHeaderCloseSize).sub(token.modalCloseBtnSize).div(2).equal(),
          insetInlineEnd: token
            .calc(token.modalHeaderCloseSize)
            .sub(token.modalCloseBtnSize)
            .div(2)
            .equal(),
          zIndex: token.calc(token.zIndexPopupBase).add(10).equal({ unit: false }),
          padding: 0,
          color: token.modalCloseColor,
          fontWeight: token.fontWeightStrong,
          lineHeight: 1,
          textDecoration: 'none',
          background: 'transparent',
          borderRadius: token.borderRadiusSM,
          width: token.modalConfirmIconSize,
          height: token.modalConfirmIconSize,
          border: 0,
          outline: 0,
          cursor: 'pointer',
          transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,

          '&-x': {
            display: 'block',
            fontSize: token.fontSizeLG,
            fontStyle: 'normal',
            lineHeight: `${unit(token.modalCloseBtnSize)}`,
            textAlign: 'center',
            textTransform: 'none',
            textRendering: 'auto',
          },

          '&:disabled': {
            pointerEvents: 'none',
            cursor: 'not-allowed',
            opacity: 0.45,
          },

          '&:hover': {
            color: token.modalIconHoverColor,
            backgroundColor: token.closeBtnHoverBg,
            textDecoration: 'none',
          },

          '&:active': {
            backgroundColor: token.wireframe ? 'transparent' : token.colorFillContentHover,
          },

          ...genFocusStyle(token),
        },

        [`${componentCls}-header`]: {
          color: token.colorText,
          background: token.modalHeaderBg,
          borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,
          marginBottom: token.marginXS,
        },

        [`${componentCls}-body`]: {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          wordWrap: 'break-word',

          [`${componentCls}-body-skeleton`]: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: `${unit(token.margin)} auto`,
          },
        },

        [`${componentCls}-footer`]: {
          textAlign: 'end',
          background: token.modalFooterBg,
          marginTop: token.marginSM,

          [`${token.antCls}-btn + ${token.antCls}-btn:not(${token.antCls}-dropdown-trigger)`]: {
            marginBottom: 0,
            marginInlineStart: token.marginXS,
          },
        },

        [`${componentCls}-open`]: {
          overflow: 'hidden',
        },
      },
    },

    // ======================== Pure =========================
    {
      [`${componentCls}-pure-panel`]: {
        top: 'auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',

        [`${componentCls}-content,
          ${componentCls}-body,
          ${componentCls}-confirm-body-wrapper`]: {
          display: 'flex',
          flexDirection: 'column',
          flex: 'auto',
        },

        [`${componentCls}-confirm-body`]: {
          marginBottom: 'auto',
        },
      },
    },
  ];
};

const genModalConfirmStyle: GenerateStyle<ModalToken> = token => {
  const { componentCls } = token;
  const confirmComponentCls = `${componentCls}-confirm`;

  return {
    [confirmComponentCls]: {
      '&-rtl': {
        direction: 'rtl',
      },
      [`${token.antCls}-modal-header`]: {
        display: 'none',
      },
      [`${confirmComponentCls}-body-wrapper`]: {
        ...clearFix(),
      },
      [`${confirmComponentCls}-body`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',

        [`${confirmComponentCls}-title`]: {
          flex: '0 0 100%',
          display: 'block',
          // create BFC to avoid
          // https://user-images.githubusercontent.com/507615/37702510-ba844e06-2d2d-11e8-9b67-8e19be57f445.png
          overflow: 'hidden',
          color: token.colorTextHeading,
          fontWeight: token.fontWeightStrong,
          fontSize: token.modalHeaderTitleFontSize,
          lineHeight: token.modalHeaderTitleLineHeight,

          [`+ ${confirmComponentCls}-content`]: {
            marginBlockStart: token.marginXS,
            flexBasis: '100%',
            maxWidth: `calc(100% - ${unit(
              token.calc(token.modalConfirmIconSize).add(token.marginSM).equal(),
            )})`,
          },
        },

        [`${confirmComponentCls}-content`]: {
          color: token.colorText,
          fontSize: token.fontSize,
        },

        [`> ${token.iconCls}`]: {
          flex: 'none',
          marginInlineEnd: token.marginSM,
          fontSize: token.modalConfirmIconSize,

          [`+ ${confirmComponentCls}-title`]: {
            flex: 1,
          },

          // `content` after `icon` should set marginLeft
          [`+ ${confirmComponentCls}-title + ${confirmComponentCls}-content`]: {
            marginInlineStart: token.calc(token.modalConfirmIconSize).add(token.marginSM).equal(),
          },
        },
      },
      [`${confirmComponentCls}-btns`]: {
        textAlign: 'end',
        marginTop: token.marginSM,

        [`${token.antCls}-btn + ${token.antCls}-btn`]: {
          marginBottom: 0,
          marginInlineStart: token.marginXS,
        },
      },
    },

    [`${confirmComponentCls}-error ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorError,
    },

    [`${confirmComponentCls}-warning ${confirmComponentCls}-body > ${token.iconCls},
        ${confirmComponentCls}-confirm ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorWarning,
    },

    [`${confirmComponentCls}-info ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorInfo,
    },

    [`${confirmComponentCls}-success ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorSuccess,
    },

    // https://github.com/ant-design/ant-design/issues/37329
    [`${componentCls}-zoom-leave ${componentCls}-btns`]: {
      pointerEvents: 'none',
    },
  };
};

const genRTLStyle: GenerateStyle<ModalToken> = token => {
  const { componentCls } = token;
  return {
    [`${componentCls}-root`]: {
      [`${componentCls}-wrap-rtl`]: {
        direction: 'rtl',

        [`${componentCls}-confirm-body`]: {
          direction: 'rtl',
        },
      },
    },
  };
};

const genWireframeStyle: GenerateStyle<ModalToken> = token => {
  const { componentCls, antCls } = token;
  const confirmComponentCls = `${componentCls}-confirm`;

  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
        padding: 0,
      },

      [`${componentCls}-header`]: {
        padding: token.modalHeaderPadding,
        borderBottom: `${unit(token.modalHeaderBorderWidth)} ${token.modalHeaderBorderStyle} ${
          token.modalHeaderBorderColorSplit
        }`,
        marginBottom: 0,
      },

      [`${componentCls}-body`]: {
        padding: token.modalBodyPadding,
      },

      [`${componentCls}-footer`]: {
        padding: `${unit(token.modalFooterPaddingVertical)} ${unit(
          token.modalFooterPaddingHorizontal,
        )}`,
        borderTop: `${unit(token.modalFooterBorderWidth)} ${token.modalFooterBorderStyle} ${
          token.modalFooterBorderColorSplit
        }`,
        borderRadius: `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}`,
        marginTop: 0,
      },
    },

    [confirmComponentCls]: {
      [`${antCls}-modal-body`]: {
        padding: `${unit(token.calc(token.padding).mul(2).equal())} ${unit(
          token.calc(token.padding).mul(2).equal(),
        )} ${unit(token.paddingLG)}`,
      },
      [`${confirmComponentCls}-body`]: {
        [`> ${token.iconCls}`]: {
          marginInlineEnd: token.margin,

          // `content` after `icon` should set marginLeft
          [`+ ${confirmComponentCls}-title + ${confirmComponentCls}-content`]: {
            marginInlineStart: token.calc(token.modalConfirmIconSize).add(token.margin).equal(),
          },
        },
      },
      [`${confirmComponentCls}-btns`]: {
        marginTop: token.marginLG,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Modal',
  token => {
    const headerPaddingVertical = token.padding;

    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const modalToken = mergeToken<ModalToken>(token, {
      modalBodyPadding: token.paddingLG,
      modalHeaderBg: token.headerBg,
      modalHeaderPadding: `${unit(headerPaddingVertical)} ${unit(token.paddingLG)}`,
      modalHeaderBorderWidth: token.lineWidth,
      modalHeaderBorderStyle: token.lineType,
      modalHeaderTitleLineHeight: token.titleLineHeight,
      modalHeaderTitleFontSize: token.titleFontSize,
      modalHeaderBorderColorSplit: token.colorSplit,
      modalHeaderCloseSize:
        rawToken.lineHeightHeading5 * rawToken.fontSizeHeading5 + rawToken.padding * 2,

      modalContentBg: token.contentBg,
      modalHeadingColor: token.titleColor,
      modalCloseColor: token.colorTextDescription,
      modalFooterBg: token.footerBg,
      modalFooterBorderColorSplit: token.colorSplit,
      modalFooterBorderStyle: token.lineType,
      modalFooterPaddingVertical: token.paddingXS,
      modalFooterPaddingHorizontal: token.padding,
      modalFooterBorderWidth: token.lineWidth,
      modalConfirmTitleFontSize: token.fontSizeLG,
      modalIconHoverColor: token.colorIconHover,
      modalConfirmIconSize: rawToken.fontSize * rawToken.lineHeight,
      modalCloseBtnSize: rawToken.controlHeightLG * 0.55,
    });
    return [
      genModalStyle(modalToken),
      genModalConfirmStyle(modalToken),
      genRTLStyle(modalToken),
      genModalMaskStyle(modalToken),
      token.wireframe && genWireframeStyle(modalToken),
      initZoomMotion(modalToken, 'zoom'),
    ];
  },
  token => ({
    headerBg: token.colorBgElevated,
    titleLineHeight: token.lineHeightHeading5,
    titleFontSize: token.fontSizeHeading5,
    titleColor: token.colorTextHeading,
    contentBg: token.colorBgElevated,
    footerBg: 'transparent',
    closeBtnHoverBg: token.wireframe ? 'transparent' : token.colorFillContent,
  }),
  {
    unitless: {
      titleLineHeight: true,
    },
  },
);
