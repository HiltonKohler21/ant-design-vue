import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsInlineStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const { componentCls, inlineDotSize, inlineTitleColor, inlineTailColor } = token;
  const containerPaddingTop = token.calc(token.paddingXS).add(token.lineWidth).equal();
  const titleStyle = {
    [`${componentCls}-item-container ${componentCls}-item-content ${componentCls}-item-title`]: {
      color: inlineTitleColor,
    },
  };

  return {
    [`&${componentCls}-inline`]: {
      width: 'auto',
      display: 'inline-flex',

      '&::before': {
        content: '""',
        flex: 'var(--ant-steps-items-offset, 0)',
      },

      [`${componentCls}-item`]: {
        flex: 1,

        '&:last-child': {
          flex: 1,
        },

        '&-container': {
          padding: `${unit(containerPaddingTop)} ${unit(token.paddingXXS)} 0`,
          margin: `0 ${unit(token.calc(token.marginXXS).div(2).equal())}`,
          borderRadius: token.borderRadiusSM,
          cursor: 'pointer',
          transition: `background-color ${token.motionDurationMid}`,
          '&:hover': {
            background: token.controlItemBgHover,
          },
          [`&[role='button']:hover`]: {
            opacity: 1,
          },
        },

        '&-icon': {
          width: inlineDotSize,
          height: inlineDotSize,
          marginInlineStart: `calc(50% - ${unit(token.calc(token.inlineDotSize).div(2).equal())})`,
          [`> ${componentCls}-icon`]: {
            top: 0,
          },
          [`${componentCls}-icon-dot`]: {
            borderRadius: token.calc(token.fontSizeSM).div(4).equal(),
          },
        },

        '&-content': {
          width: 'auto',
          marginTop: token.calc(token.marginXS).sub(token.lineWidth).equal(),
        },
        '&-title': {
          color: inlineTitleColor,
          fontSize: token.fontSizeSM,
          lineHeight: token.lineHeightSM,
          fontWeight: 'normal',
          marginBottom: token.calc(token.marginXXS).div(2).equal(),
        },
        '&-description': {
          display: 'none',
        },

        '&-tail': {
          marginInlineStart: 0,
          top: token
            .calc(containerPaddingTop)
            .add(token.calc(token.inlineDotSize).div(2).equal())
            .equal(),
          height: token.lineWidth,
          background: inlineTailColor,
          transform: `translateY(-50%)`,
          '&:after': {
            width: '100%',
            height: token.lineWidth,
            borderRadius: 0,
            marginInlineStart: 0,
            background: 'inherit',
          },
        },

        [`&:first-child ${componentCls}-item-tail`]: {
          width: '50%',
          marginInlineStart: '50%',
        },
        [`&:last-child ${componentCls}-item-tail`]: {
          display: 'block',
          width: '50%',
        },

        '&-wait': {
          [`${componentCls}-item-icon ${componentCls}-icon ${componentCls}-icon-dot`]: {
            backgroundColor: token.colorBorderBg,
            border: `${unit(token.lineWidth)} ${token.lineType} ${inlineTailColor}`,
          },
          ...titleStyle,
        },
        '&-finish': {
          [`${componentCls}-item-tail`]: {
            backgroundColor: inlineTailColor,
          },
          [`${componentCls}-item-tail::after`]: {
            backgroundColor: 'inherit',
          },
          [`${componentCls}-item-icon ${componentCls}-icon ${componentCls}-icon-dot`]: {
            backgroundColor: inlineTailColor,
            border: `${unit(token.lineWidth)} ${token.lineType} ${inlineTailColor}`,
          },
          ...titleStyle,
        },
        '&-error': titleStyle,
        '&-active, &-process': {
          [`${componentCls}-item-icon`]: {
            width: inlineDotSize,
            height: inlineDotSize,
            marginInlineStart: `calc(50% - ${unit(
              token.calc(token.inlineDotSize).div(2).equal(),
            )})`,
            top: 0,
          },
          ...titleStyle,
        },

        [`&:not(${componentCls}-item-active) > ${componentCls}-item-container[role='button']:hover`]:
          {
            [`${componentCls}-item-title`]: {
              color: inlineTitleColor,
            },
          },
      },
    },
  };
};

export default genStepsInlineStyle;
