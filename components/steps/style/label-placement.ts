import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsLabelPlacementStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const { componentCls, lineHeight } = token;

  return {
    [`&${componentCls}-label-vertical`]: {
      [`${componentCls}-item`]: {
        overflow: 'visible',

        '&-tail': {
          marginInlineStart: token.calc(token.calc(token.stepsIconSize).div(2).equal()).add(token.controlHeightLG).equal(),
          padding: `${unit(token.paddingXXS)} ${unit(token.paddingLG)}`,
        },

        '&-content': {
          display: 'block',
          width: token.calc(token.calc(token.calc(token.stepsIconSize).div(2).equal()).add(token.controlHeightLG).equal()).mul(2).equal(),
          marginTop: token.marginSM,
          textAlign: 'center',
        },

        '&-icon': {
          display: 'inline-block',
          marginInlineStart: token.controlHeightLG,
        },

        '&-title': {
          paddingInlineEnd: 0,
          paddingInlineStart: 0,

          '&::after': {
            display: 'none',
          },
        },

        '&-subtitle': {
          display: 'block',
          marginBottom: token.marginXXS,
          marginInlineStart: 0,
          lineHeight,
        },
      },
      [`&${componentCls}-small:not(${componentCls}-dot)`]: {
        [`${componentCls}-item`]: {
          '&-icon': {
            marginInlineStart: token.calc(token.controlHeightLG).add(token.calc(token.calc(token.stepsIconSize).sub(token.stepsSmallIconSize).equal()).div(2).equal()).equal(),
          },
        },
      },
    },
  };
};
export default genStepsLabelPlacementStyle;
