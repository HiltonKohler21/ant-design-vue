import { unit } from '../../_util/cssinjs';
import { initZoomMotion } from '../../style/motion';
import type { FullToken, GenerateStyle, UseComponentStyleResult } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genPresetColor, resetComponent } from '../../style';
import getArrowStyle, { MAX_VERTICAL_CONTENT_RADIUS } from '../../style/placementArrow';
import type { Ref } from 'vue';

export interface ComponentToken {
  zIndexPopup: number;
  colorBgDefault: string;
  maxWidth?: number;
}

interface TooltipToken extends FullToken<'Tooltip'> {
  // default variables
  tooltipMaxWidth: number;
  tooltipColor: string;
  tooltipBg: string;
  tooltipBorderRadius: number;
  tooltipRadiusOuter: number;
}

const genTooltipStyle: GenerateStyle<TooltipToken> = token => {
  const {
    componentCls, // ant-tooltip
    tooltipMaxWidth,
    tooltipColor,
    tooltipBg,
    tooltipBorderRadius,
    zIndexPopup,
    controlHeight,
    boxShadowSecondary,
    paddingSM,
    paddingXS,
    tooltipRadiusOuter,
  } = token;

  // Math.min 需要真实数值（cssVar 模式下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),
        position: 'absolute',
        zIndex: zIndexPopup,
        display: 'block',
        '&': [{ width: 'max-content' }, { width: 'intrinsic' }],
        maxWidth: tooltipMaxWidth,
        visibility: 'visible',
        '&-hidden': {
          display: 'none',
        },

        '--antd-arrow-background-color': tooltipBg,

        // Wrapper for the tooltip content
        [`${componentCls}-inner`]: {
          minWidth: controlHeight,
          minHeight: controlHeight,
          padding: `${unit(token.calc(paddingSM).div(2).equal())} ${unit(paddingXS)}`,
          color: tooltipColor,
          textAlign: 'start',
          textDecoration: 'none',
          wordWrap: 'break-word',
          backgroundColor: tooltipBg,
          borderRadius: tooltipBorderRadius,
          boxShadow: boxShadowSecondary,
          boxSizing: 'border-box',
        },

        // Limit left and right placement radius
        [[
          `&-placement-left`,
          `&-placement-leftTop`,
          `&-placement-leftBottom`,
          `&-placement-right`,
          `&-placement-rightTop`,
          `&-placement-rightBottom`,
        ].join(',')]: {
          [`${componentCls}-inner`]: {
            borderRadius: Math.min(
              rawToken.tooltipBorderRadius ?? rawToken.borderRadius,
              MAX_VERTICAL_CONTENT_RADIUS,
            ),
          },
        },

        [`${componentCls}-content`]: {
          position: 'relative',
        },

        // generator for preset color
        ...genPresetColor(token, (colorKey, { darkColor }) => ({
          [`&${componentCls}-${colorKey}`]: {
            [`${componentCls}-inner`]: {
              backgroundColor: darkColor,
            },
            [`${componentCls}-arrow`]: {
              '--antd-arrow-background-color': darkColor,
            },
          },
        })),

        // RTL
        '&-rtl': {
          direction: 'rtl',
        },
      },
    },

    // Arrow Style
    (() => {
      const arrowToken = mergeToken<TooltipToken>(token, {
        borderRadiusOuter: tooltipRadiusOuter,
      });
      if ((token as any)._realToken) {
        const clampedOuter = (rawToken.borderRadiusOuter ?? 0) > 4 ? 4 : rawToken.borderRadiusOuter;
        Object.defineProperty(arrowToken, '_realToken', {
          value: { ...(token as any)._realToken, borderRadiusOuter: clampedOuter },
          enumerable: false,
          configurable: true,
        });
      }
      return getArrowStyle<TooltipToken>(arrowToken, {
        colorBg: 'var(--antd-arrow-background-color)',
        showArrowCls: '',
        contentRadius: tooltipBorderRadius,
        limitVerticalRadius: true,
      });
    })(),

    // Pure Render
    {
      [`${componentCls}-pure`]: {
        position: 'relative',
        maxWidth: 'none',
        margin: token.sizePopupArrow,
        display: 'inline-block',
      },
    },

    // Unique Provider Shared Container
    {
      [`${componentCls}-unique-container`]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        pointerEvents: 'auto',
        transition: `left ${token.motionDurationMid} ${token.motionEaseInOut}, top ${token.motionDurationMid} ${token.motionEaseInOut}, opacity ${token.motionDurationFast} ${token.motionEaseInOut}`,

        '&-hidden': {
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
        },

        '&-visible': {
          opacity: 1,
          visibility: 'visible',
        },
      },
    },
  ];
};

// ============================== Export ==============================
export default (prefixCls: Ref<string>, injectStyle: Ref<boolean>): UseComponentStyleResult => {
  const useOriginHook = genComponentStyleHook(
    'Tooltip',
    token => {
      // Popover use Tooltip as internal component. We do not need to handle this.
      if (injectStyle?.value === false) {
        return [];
      }

      const rawToken: any = (token as any)._realToken ?? token;
      const { borderRadius, colorTextLightSolid, colorBgDefault, borderRadiusOuter } = token;

      const TooltipToken = mergeToken<TooltipToken>(token, {
        // default variables
        tooltipMaxWidth: token.maxWidth ?? 250,
        tooltipColor: colorTextLightSolid,
        tooltipBorderRadius: borderRadius,
        tooltipBg: colorBgDefault,
        tooltipRadiusOuter: (rawToken.borderRadiusOuter ?? 0) > 4 ? 4 : borderRadiusOuter,
      });

      return [genTooltipStyle(TooltipToken), initZoomMotion(token, 'zoom-big-fast')];
    },
    ({ zIndexPopupBase, colorBgSpotlight }) => ({
      zIndexPopup: zIndexPopupBase + 70,
      colorBgDefault: colorBgSpotlight,
      maxWidth: 250,
    }),
  );

  return useOriginHook(prefixCls);
};
