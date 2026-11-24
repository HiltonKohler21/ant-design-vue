import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsPanelStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const {
    componentCls,
    lineWidthBold,
    lineType,
    borderRadius,
    borderRadiusSM,
    motionDurationMid,
    paddingSM,
    paddingXS,
    controlHeightSM,
    colorBgContainer,
    colorBorder,
    colorFillTertiary,
    colorFillSecondary,
    colorPrimary,
    colorPrimaryBg,
    colorError,
    colorErrorBg,
    colorText,
    colorTextLightSolid,
    colorTextDescription,
  } = token;

  const itemCls = `${componentCls}-item`;
  const arrowWidth = controlHeightSM;
  const arrowWidthSM = token.calc(controlHeightSM).sub(token.paddingXXS).equal();

  const genPanelStatusColors = (
    status: 'wait' | 'process' | 'finish' | 'error',
    bg: string,
    border: string,
    activeBg: string,
    activeBorder: string,
    activeText: string,
  ): CSSObject => ({
    [`${itemCls}-${status}`]: {
      background: bg,
      borderColor: border,
      [`> ${componentCls}-panel-arrow path`]: {
        fill: bg,
        stroke: border,
      },
      [`&${itemCls}-active`]: {
        background: activeBg,
        borderColor: activeBorder,
        [`> ${componentCls}-panel-arrow path`]: {
          fill: activeBg,
          stroke: activeBorder,
        },
        [`> ${itemCls}-container > ${itemCls}-content`]: {
          [`> ${itemCls}-title, > ${itemCls}-title > ${itemCls}-subtitle, > ${itemCls}-description`]:
            {
              color: activeText,
            },
        },
      },
    },
  });

  return {
    [`&${componentCls}-panel`]: {
      alignItems: 'stretch',

      [`${itemCls}-tail, ${itemCls}-icon`]: {
        display: 'none',
      },

      [`${itemCls}-title::after`]: {
        display: 'none',
      },

      [`${componentCls}-panel-arrow`]: {
        position: 'absolute',
        top: token.calc(lineWidthBold).mul(-1).equal(),
        insetInlineStart: '100%',
        zIndex: 1,
        height: token.calc(lineWidthBold).mul(2).add('100%').equal(),
        width: arrowWidth,
        overflow: 'visible',
        strokeLinecap: 'round',
        pointerEvents: 'none',

        path: {
          fill: colorFillTertiary,
          stroke: colorBgContainer,
          strokeWidth: lineWidthBold,
          vectorEffect: 'non-scaling-stroke',
          transition: `fill ${motionDurationMid}, stroke ${motionDurationMid}`,
        },
      },

      [`${itemCls}:last-child > ${componentCls}-panel-arrow`]: {
        display: 'none',
      },

      [`&${componentCls}-rtl ${componentCls}-panel-arrow`]: {
        transform: 'scaleX(-1)',
      },

      [itemCls]: {
        flex: 1,
        overflow: 'visible',
        position: 'relative',
        margin: 0,
        padding: paddingSM,
        background: colorFillTertiary,
        borderBlock: `${unit(lineWidthBold)} ${lineType} ${colorBgContainer}`,
        transition: `background-color ${motionDurationMid}, border-color ${motionDurationMid}`,

        '&:last-child': {
          flex: 1,
          borderInlineEnd: `${unit(lineWidthBold)} ${lineType} ${colorBgContainer}`,
          borderStartEndRadius: borderRadius,
          borderEndEndRadius: borderRadius,
        },

        '&:first-child': {
          paddingInlineStart: paddingSM,
          borderInlineStart: `${unit(lineWidthBold)} ${lineType} ${colorBgContainer}`,
          borderStartStartRadius: borderRadius,
          borderEndStartRadius: borderRadius,
        },

        '&:not(:first-child)': {
          paddingInlineStart: token.calc(paddingSM).add(arrowWidth).equal(),
        },

        [`${itemCls}-container`]: {
          width: '100%',
        },

        [`${itemCls}-content`]: {
          display: 'block',
          width: '100%',
        },

        [`${itemCls}-title`]: {
          paddingInlineEnd: 0,
          lineHeight: token.lineHeightLG,
        },

        [`${itemCls}-description`]: {
          maxWidth: 'none',
          whiteSpace: 'normal',
        },
      },

      // Filled (default) panel status colors
      ...genPanelStatusColors(
        'wait',
        colorFillTertiary,
        colorBgContainer,
        colorFillSecondary,
        colorBgContainer,
        colorText,
      ),
      ...genPanelStatusColors(
        'finish',
        colorPrimaryBg,
        colorBgContainer,
        colorPrimary,
        colorBgContainer,
        colorTextLightSolid,
      ),
      ...genPanelStatusColors(
        'process',
        colorPrimaryBg,
        colorBgContainer,
        colorPrimary,
        colorBgContainer,
        colorTextLightSolid,
      ),
      ...genPanelStatusColors(
        'error',
        colorErrorBg,
        colorBgContainer,
        colorError,
        colorBgContainer,
        colorTextLightSolid,
      ),

      // Filled clip-path notch between adjacent items
      [`&:not(${componentCls}-outlined)`]: {
        [`${itemCls}:not(:first-child)`]: {
          clipPath: `polygon(${[
            `${unit(lineWidthBold)} 0`,
            `calc(100% + ${unit(arrowWidth)}) 0`,
            `calc(100% + ${unit(arrowWidth)}) 100%`,
            `${unit(lineWidthBold)} 100%`,
            `calc(${unit(arrowWidth)} + ${unit(lineWidthBold)}) 50%`,
          ].join(', ')})`,
        },
      },

      // Outlined variant panel
      [`&${componentCls}-outlined`]: {
        [itemCls]: {
          background: colorBgContainer,
          borderColor: colorBorder,
          '&:first-child': {
            borderInlineStartColor: colorBorder,
          },
          '&:last-child': {
            borderInlineEndColor: colorBorder,
          },
        },

        [`${componentCls}-panel-arrow`]: {
          top: token.calc(lineWidthBold).div(2).mul(-1).equal(),
          height: token.calc(lineWidthBold).add('100%').equal(),
        },

        ...genPanelStatusColors(
          'wait',
          colorBgContainer,
          colorBorder,
          colorFillTertiary,
          colorBorder,
          colorText,
        ),
        ...genPanelStatusColors(
          'finish',
          colorBgContainer,
          colorPrimary,
          colorPrimaryBg,
          colorPrimary,
          colorText,
        ),
        ...genPanelStatusColors(
          'process',
          colorBgContainer,
          colorPrimary,
          colorPrimaryBg,
          colorPrimary,
          colorText,
        ),
        ...genPanelStatusColors(
          'error',
          colorBgContainer,
          colorError,
          colorErrorBg,
          colorError,
          colorError,
        ),

        [`${itemCls}-active > ${itemCls}-container > ${itemCls}-content > ${itemCls}-description`]:
          {
            color: colorTextDescription,
          },
        [`${itemCls}-error${itemCls}-active > ${itemCls}-container > ${itemCls}-content > ${itemCls}-description`]:
          {
            color: colorError,
          },
      },

      // Small size panel
      [`&${componentCls}-small`]: {
        [`${componentCls}-panel-arrow`]: {
          width: arrowWidthSM,
        },
        [itemCls]: {
          padding: paddingXS,
          '&:first-child': {
            paddingInlineStart: paddingXS,
            borderStartStartRadius: borderRadiusSM,
            borderEndStartRadius: borderRadiusSM,
          },
          '&:last-child': {
            borderStartEndRadius: borderRadiusSM,
            borderEndEndRadius: borderRadiusSM,
          },
          '&:not(:first-child)': {
            paddingInlineStart: token.calc(paddingXS).add(arrowWidthSM).equal(),
          },
        },
        [`&:not(${componentCls}-outlined) ${itemCls}:not(:first-child)`]: {
          clipPath: `polygon(${[
            `${unit(lineWidthBold)} 0`,
            `calc(100% + ${unit(arrowWidthSM)}) 0`,
            `calc(100% + ${unit(arrowWidthSM)}) 100%`,
            `${unit(lineWidthBold)} 100%`,
            `calc(${unit(arrowWidthSM)} + ${unit(lineWidthBold)}) 50%`,
          ].join(', ')})`,
        },
      },
    },
  };
};

export default genStepsPanelStyle;
