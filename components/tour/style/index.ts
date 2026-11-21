import { unit } from '../../_util/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';
import getArrowStyle, { MAX_VERTICAL_CONTENT_RADIUS } from '../../style/placementArrow';

export interface ComponentToken {}

interface TourToken extends FullToken<'Tour'> {
  tourZIndexPopup: number;
  indicatorWidth: number;
  indicatorHeight: number;
  tourBorderRadius: number;
  tourCloseSize: number;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<TourToken> = token => {
  const {
    componentCls,
    lineHeight,
    padding,
    paddingXS,
    borderRadius,
    borderRadiusXS,
    colorPrimary,
    colorText,
    colorFill,
    indicatorHeight,
    indicatorWidth,
    boxShadowTertiary,
    tourZIndexPopup,
    fontSize,
    colorBgContainer,
    fontWeightStrong,
    marginXS,
    colorTextLightSolid,
    tourBorderRadius,
    colorWhite,
    colorBgTextHover,
    tourCloseSize,
    motionDurationSlow,
    antCls,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        color: colorText,
        position: 'absolute',
        zIndex: tourZIndexPopup,
        display: 'block',
        visibility: 'visible',
        fontSize,
        lineHeight,
        width: 520,
        '--antd-arrow-background-color': colorBgContainer,

        '&-pure': {
          maxWidth: '100%',
          position: 'relative',
        },

        [`&${componentCls}-hidden`]: {
          display: 'none',
        },

        // ============================= panel content ============================
        [`${componentCls}-content`]: {
          position: 'relative',
        },
        [`${componentCls}-inner`]: {
          textAlign: 'start',
          textDecoration: 'none',
          borderRadius: tourBorderRadius,
          boxShadow: boxShadowTertiary,
          position: 'relative',
          backgroundColor: colorBgContainer,
          border: 'none',
          backgroundClip: 'padding-box',

          [`${componentCls}-close`]: {
            position: 'absolute',
            top: padding,
            insetInlineEnd: padding,
            color: token.colorIcon,
            outline: 'none',
            width: tourCloseSize,
            height: tourCloseSize,
            borderRadius: token.borderRadiusSM,
            transition: `background-color ${token.motionDurationMid}, color ${token.motionDurationMid}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '&:hover': {
              color: token.colorIconHover,
              backgroundColor: token.wireframe ? 'transparent' : token.colorFillContent,
            },
          },

          [`${componentCls}-cover`]: {
            textAlign: 'center',
            padding: `${padding + tourCloseSize + paddingXS}px ${unit(padding)} 0`,
            img: {
              width: '100%',
            },
          },
          [`${componentCls}-header`]: {
            padding: `${unit(padding)} ${unit(padding)} ${unit(paddingXS)}`,

            [`${componentCls}-title`]: {
              lineHeight,
              fontSize,
              fontWeight: fontWeightStrong,
            },
          },

          [`${componentCls}-description`]: {
            padding: `0 ${unit(padding)}`,
            lineHeight,
            wordWrap: 'break-word',
          },

          [`${componentCls}-footer`]: {
            padding: `${unit(paddingXS)} ${unit(padding)} ${unit(padding)}`,
            textAlign: 'end',
            borderRadius: `0 0 ${unit(borderRadiusXS)} ${unit(borderRadiusXS)}`,
            display: 'flex',
            [`${componentCls}-indicators`]: {
              display: 'inline-block',

              [`${componentCls}-indicator`]: {
                width: indicatorWidth,
                height: indicatorHeight,
                display: 'inline-block',
                borderRadius: '50%',
                background: colorFill,
                '&:not(:last-child)': {
                  marginInlineEnd: indicatorHeight,
                },
                '&-active': {
                  background: colorPrimary,
                },
              },
            },
            [`${componentCls}-buttons`]: {
              marginInlineStart: 'auto',
              [`${antCls}-btn`]: {
                marginInlineStart: marginXS,
              },
            },
          },
        },

        // =============================  primary type  ===========================
        // `$` for panel, `&$` for pure panel
        [`${componentCls}-primary, &${componentCls}-primary`]: {
          '--antd-arrow-background-color': colorPrimary,

          [`${componentCls}-inner`]: {
            color: colorTextLightSolid,
            textAlign: 'start',
            textDecoration: 'none',
            backgroundColor: colorPrimary,
            borderRadius,
            boxShadow: boxShadowTertiary,

            [`${componentCls}-close`]: {
              color: colorTextLightSolid,
            },

            [`${componentCls}-indicators`]: {
              [`${componentCls}-indicator`]: {
                background: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
                '&-active': {
                  background: colorTextLightSolid,
                },
              },
            },

            [`${componentCls}-prev-btn`]: {
              color: colorTextLightSolid,
              borderColor: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
              backgroundColor: colorPrimary,

              '&:hover': {
                backgroundColor: new TinyColor(colorTextLightSolid).setAlpha(0.15).toRgbString(),
                borderColor: 'transparent',
              },
            },

            [`${componentCls}-next-btn`]: {
              color: colorPrimary,
              borderColor: 'transparent',
              background: colorWhite,

              '&:hover': {
                background: new TinyColor(colorBgTextHover).onBackground(colorWhite).toRgbString(),
              },
            },
          },
        },
      },

      // ============================= mask ===========================
      [`${componentCls}-mask`]: {
        [`${componentCls}-placeholder-animated`]: {
          transition: `all ${motionDurationSlow}`,
        },
      },

      // =========== Limit left and right placement radius ==============
      [[
        '&-placement-left',
        '&-placement-leftTop',
        '&-placement-leftBottom',
        '&-placement-right',
        '&-placement-rightTop',
        '&-placement-rightBottom',
      ].join(',')]: {
        [`${componentCls}-inner`]: {
          borderRadius: Math.min(tourBorderRadius, MAX_VERTICAL_CONTENT_RADIUS),
        },
      },
    },

    // ============================= Arrow ===========================
    getArrowStyle<TourToken>(token, {
      colorBg: 'var(--antd-arrow-background-color)',
      contentRadius: tourBorderRadius,
      limitVerticalRadius: true,
    }),
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook('Tour', token => {
  const { borderRadiusLG, fontSize, lineHeight } = token;
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const TourToken = mergeToken<TourToken>(token, {
    tourZIndexPopup: rawToken.zIndexPopupBase + 70,
    indicatorWidth: 6,
    indicatorHeight: 6,
    tourBorderRadius: borderRadiusLG,
    tourCloseSize: fontSize * lineHeight,
  });
  return [genBaseStyle(TourToken)];
});
