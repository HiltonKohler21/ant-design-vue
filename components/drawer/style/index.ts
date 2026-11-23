import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genMotionStyle from './motion';

export interface ComponentToken {
  /**
   * @desc 弹窗 z-index
   * @descEN z-index of drawer
   */
  zIndexPopup: number;
}

export interface DrawerToken extends FullToken<'Drawer'> {
  drawerFooterPaddingVertical: number;
  drawerFooterPaddingHorizontal: number;
  drawerDraggerSize: number;
}

// =============================== Base ===============================
const genDrawerStyle: GenerateStyle<DrawerToken> = (token: DrawerToken) => {
  const {
    componentCls,
    zIndexPopup,
    colorBgMask,
    colorBgElevated,
    motionDurationSlow,
    motionDurationMid,
    padding,
    paddingLG,
    fontSizeLG,
    lineHeightLG,
    lineWidth,
    lineType,
    colorSplit,
    marginSM,
    colorIcon,
    colorIconHover,
    colorText,
    fontWeightStrong,
    drawerFooterPaddingVertical,
    drawerFooterPaddingHorizontal,
    drawerDraggerSize,
  } = token;

  const wrapperCls = `${componentCls}-content-wrapper`;
  const draggerCls = `${componentCls}-resizable-dragger`;

  return {
    [componentCls]: {
      position: 'fixed',
      inset: 0,
      zIndex: zIndexPopup,
      pointerEvents: 'none',

      '&-pure': {
        position: 'relative',
        background: colorBgElevated,

        [`&${componentCls}-left`]: {
          boxShadow: token.boxShadowDrawerLeft,
        },
        [`&${componentCls}-right`]: {
          boxShadow: token.boxShadowDrawerRight,
        },
        [`&${componentCls}-top`]: {
          boxShadow: token.boxShadowDrawerUp,
        },
        [`&${componentCls}-bottom`]: {
          boxShadow: token.boxShadowDrawerDown,
        },
      },

      '&-inline': {
        position: 'absolute',
      },

      // ====================== Mask ======================
      [`${componentCls}-mask`]: {
        position: 'absolute',
        inset: 0,
        zIndex: zIndexPopup,
        background: colorBgMask,
        pointerEvents: 'auto',

        [`&${componentCls}-mask-blur`]: {
          backdropFilter: 'blur(4px)',
        },
      },

      // ==================== Content =====================
      [wrapperCls]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        maxWidth: '100vw',
        maxHeight: '100vh',
        transition: `all ${motionDurationSlow}`,

        '&-hidden': {
          display: 'none',
        },
      },

      // Placement
      [`&-left > ${wrapperCls}`]: {
        top: 0,
        bottom: 0,
        left: {
          _skip_check_: true,
          value: 0,
        },
        boxShadow: token.boxShadowDrawerLeft,
      },
      [`&-right > ${wrapperCls}`]: {
        top: 0,
        right: {
          _skip_check_: true,
          value: 0,
        },
        bottom: 0,
        boxShadow: token.boxShadowDrawerRight,
      },
      [`&-top > ${wrapperCls}`]: {
        top: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerUp,
      },
      [`&-bottom > ${wrapperCls}`]: {
        bottom: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerDown,
      },

      [`${componentCls}-content`]: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: colorBgElevated,
        pointerEvents: 'auto',
      },

      // ===================== Panel ======================
      [`${componentCls}-wrapper-body`]: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      },

      // Header
      [`${componentCls}-header`]: {
        display: 'flex',
        flex: 0,
        alignItems: 'center',
        padding: `${unit(padding)} ${unit(paddingLG)}`,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG,
        borderBottom: `${unit(lineWidth)} ${lineType} ${colorSplit}`,

        '&-title': {
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          minWidth: 0,
          minHeight: 0,
        },
      },

      [`${componentCls}-extra`]: {
        flex: 'none',
      },

      [`${componentCls}-close`]: {
        display: 'inline-block',
        marginInlineEnd: marginSM,
        color: colorIcon,
        fontWeight: fontWeightStrong,
        fontSize: fontSizeLG,
        fontStyle: 'normal',
        lineHeight: 1,
        textAlign: 'center',
        textTransform: 'none',
        textDecoration: 'none',
        background: 'transparent',
        border: 0,
        outline: 0,
        cursor: 'pointer',
        transition: `color ${motionDurationMid}`,
        textRendering: 'auto',

        '&:focus, &:hover': {
          color: colorIconHover,
          textDecoration: 'none',
        },

        [`&${componentCls}-close-end`]: {
          marginInlineEnd: 0,
          marginInlineStart: marginSM,
        },

        '&:disabled': {
          pointerEvents: 'none',
          cursor: 'not-allowed',
          opacity: 0.45,
        },
      },

      [`${componentCls}-title`]: {
        flex: 1,
        margin: 0,
        color: colorText,
        fontWeight: token.fontWeightStrong,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG,
      },

      // Body
      [`${componentCls}-body`]: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        padding: paddingLG,
        overflow: 'auto',

        [`${componentCls}-body-skeleton`]: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        },
      },

      // Footer
      [`${componentCls}-footer`]: {
        flexShrink: 0,
        padding: `${unit(drawerFooterPaddingVertical)} ${unit(drawerFooterPaddingHorizontal)}`,
        borderTop: `${unit(lineWidth)} ${lineType} ${colorSplit}`,
      },

      // ==================== Resizable ===================
      [draggerCls]: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'transparent',
        userSelect: 'none',
        pointerEvents: 'auto',

        '&:hover': {
          backgroundColor: token.colorPrimary,
          opacity: 0.2,
        },

        '&-dragging': {
          backgroundColor: token.colorPrimary,
          opacity: 0.3,
        },
      },

      [`${draggerCls}-left`]: {
        top: 0,
        bottom: 0,
        right: {
          _skip_check_: true,
          value: 0,
        },
        width: drawerDraggerSize,
        cursor: 'col-resize',
      },

      [`${draggerCls}-right`]: {
        top: 0,
        bottom: 0,
        left: {
          _skip_check_: true,
          value: 0,
        },
        width: drawerDraggerSize,
        cursor: 'col-resize',
      },

      [`${draggerCls}-top`]: {
        insetInline: 0,
        bottom: 0,
        height: drawerDraggerSize,
        cursor: 'row-resize',
      },

      [`${draggerCls}-bottom`]: {
        insetInline: 0,
        top: 0,
        height: drawerDraggerSize,
        cursor: 'row-resize',
      },

      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Drawer',
  token => {
    const drawerToken = mergeToken<DrawerToken>(token, {
      drawerFooterPaddingVertical: token.paddingXS,
      drawerFooterPaddingHorizontal: token.padding,
      drawerDraggerSize: 4,
    });

    return [genDrawerStyle(drawerToken), genMotionStyle(drawerToken)];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase,
  }),
);
