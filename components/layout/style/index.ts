import type { CSSProperties } from 'vue';
import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import genLayoutLightStyle from './light';

export interface ComponentToken {
  /** @deprecated Use headerBg instead */
  colorBgHeader: string;
  /** @deprecated Use bodyBg instead */
  colorBgBody: string;
  /** @deprecated Use triggerBg instead */
  colorBgTrigger: string;

  bodyBg: string;
  headerBg: string;
  headerHeight: number | string;
  headerPadding: CSSProperties['padding'];
  headerColor: string;
  footerPadding: CSSProperties['padding'];
  footerBg: string;
  siderBg: string;
  triggerHeight: number | string;
  triggerBg: string;
  triggerColor: string;
  zeroTriggerWidth: number;
  zeroTriggerHeight: number;
  lightSiderBg: string;
  lightTriggerBg: string;
  lightTriggerColor: string;
}

export interface LayoutToken extends FullToken<'Layout'> {}

const genLayoutStyle: GenerateStyle<LayoutToken, CSSObject> = token => {
  const {
    antCls, // .ant
    componentCls, // .ant-layout
    colorText,
    bodyBg,
    headerBg,
    headerHeight,
    headerPadding,
    headerColor,
    footerPadding,
    footerBg,
    siderBg,
    triggerHeight,
    triggerBg,
    triggerColor,
    zeroTriggerWidth,
    zeroTriggerHeight,
    motionDurationMid,
    motionDurationSlow,
    fontSize,
    borderRadius,
  } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      color: colorText,

      /* fix firefox can't set height smaller than content on flex item */
      minHeight: 0,
      background: bodyBg,

      '&, *': {
        boxSizing: 'border-box',
      },

      [`&${componentCls}-has-sider`]: {
        flexDirection: 'row',
        [`> ${componentCls}, > ${componentCls}-content`]: {
          // https://segmentfault.com/a/1190000019498300
          width: 0,
        },
      },

      [`${componentCls}-header, ${componentCls}-footer`]: {
        flex: '0 0 auto',
      },

      [`${componentCls}-sider`]: {
        position: 'relative',

        // fix firefox can't set width smaller than content on flex item
        minWidth: 0,
        background: siderBg,
        transition: `all ${motionDurationMid}, background 0s`,

        '&-children': {
          height: '100%',
          // Hack for fixing margin collapse bug
          // https://github.com/ant-design/ant-design/issues/7967
          // solution from https://stackoverflow.com/a/33132624/3040605
          marginTop: -0.1,
          paddingTop: 0.1,

          [`${antCls}-menu${antCls}-menu-inline-collapsed`]: {
            width: 'auto',
          },
        },

        '&-has-trigger': {
          paddingBottom: triggerHeight,
        },

        '&-right': {
          order: 1,
        },

        '&-trigger': {
          position: 'fixed',
          bottom: 0,
          zIndex: 1,
          height: triggerHeight,
          color: triggerColor,
          lineHeight: unit(triggerHeight),
          textAlign: 'center',
          background: triggerBg,
          cursor: 'pointer',
          transition: `all ${motionDurationMid}`,
        },

        '&-zero-width': {
          '> *': {
            overflow: 'hidden',
          },

          '&-trigger': {
            position: 'absolute',
            top: headerHeight,
            insetInlineEnd: token.calc(zeroTriggerWidth).mul(-1).equal(),
            zIndex: 1,
            width: zeroTriggerWidth,
            height: zeroTriggerHeight,
            color: triggerColor,
            fontSize: token.fontSizeXL,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: siderBg,
            borderStartStartRadius: 0,
            borderStartEndRadius: borderRadius,
            borderEndEndRadius: borderRadius,
            borderEndStartRadius: 0,

            cursor: 'pointer',
            transition: `background ${motionDurationSlow} ease`,

            '&::after': {
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              transition: `all ${motionDurationSlow}`,
              content: '""',
            },

            '&:hover::after': {
              // FIXME: Hardcode, but seems no need to create a token for this
              background: `rgba(255, 255, 255, 0.2)`,
            },

            '&-right': {
              insetInlineStart: token.calc(zeroTriggerWidth).mul(-1).equal(),
              borderStartStartRadius: borderRadius,
              borderStartEndRadius: 0,
              borderEndEndRadius: 0,
              borderEndStartRadius: borderRadius,
            },
          },
        },
      },
      // Light
      ...genLayoutLightStyle(token),
      // RTL
      '&-rtl': {
        direction: 'rtl',
      },
    },

    // ==================== Header ====================
    [`${componentCls}-header`]: {
      height: headerHeight,
      padding: headerPadding,
      color: headerColor,
      lineHeight: unit(headerHeight),
      background: headerBg,
      // Other components/menu/style/index.less line:686
      // Integration with header element so menu items have the same height
      [`${antCls}-menu`]: {
        lineHeight: 'inherit',
      },
    },

    // ==================== Footer ====================
    [`${componentCls}-footer`]: {
      padding: footerPadding,
      color: colorText,
      fontSize,
      background: footerBg,
    },

    // =================== Content ====================
    [`${componentCls}-content`]: {
      flex: 'auto',
      color: colorText,

      // fix firefox can't set height smaller than content on flex item
      minHeight: 0,
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Layout',
  token => [genLayoutStyle(token)],
  token => {
    const {
      colorBgLayout,
      controlHeight,
      controlHeightLG,
      colorText,
      controlHeightSM,
      marginXXS,
      colorTextLightSolid,
      colorBgContainer,
      Layout: layoutOverride,
    } = token;

    const paddingInline = controlHeightLG * 1.25;
    const colorBgHeader = layoutOverride?.colorBgHeader ?? '#001529';
    const colorBgBody = layoutOverride?.colorBgBody ?? colorBgLayout;
    const colorBgTrigger = layoutOverride?.colorBgTrigger ?? '#002140';

    return {
      // Deprecated
      colorBgHeader,
      colorBgBody,
      colorBgTrigger,

      bodyBg: colorBgBody,
      headerBg: colorBgHeader,
      headerHeight: controlHeight * 2,
      headerPadding: `0 ${paddingInline}px`,
      headerColor: colorText,
      footerPadding: `${controlHeightSM}px ${paddingInline}px`,
      footerBg: colorBgBody,
      siderBg: colorBgHeader,
      triggerHeight: controlHeightLG + marginXXS * 2,
      triggerBg: colorBgTrigger,
      triggerColor: colorTextLightSolid,
      zeroTriggerWidth: controlHeightLG,
      zeroTriggerHeight: controlHeightLG,
      lightSiderBg: colorBgContainer,
      lightTriggerBg: colorBgContainer,
      lightTriggerColor: colorText,
    };
  },
);
