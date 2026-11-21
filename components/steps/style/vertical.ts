import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsVerticalStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const { componentCls, stepsSmallIconSize, stepsIconSize } = token;

  return {
    [`&${componentCls}-vertical`]: {
      display: 'flex',
      flexDirection: 'column',

      [`> ${componentCls}-item`]: {
        display: 'block',
        flex: '1 0 auto',
        paddingInlineStart: 0,
        overflow: 'visible',

        [`${componentCls}-item-icon`]: {
          float: 'left',
          marginInlineEnd: token.margin,
        },
        [`${componentCls}-item-content`]: {
          display: 'block',
          minHeight: token.calc(token.controlHeight).mul(1.5).equal(),
          overflow: 'hidden',
        },
        [`${componentCls}-item-title`]: {
          lineHeight: `${unit(stepsIconSize)}`,
        },
        [`${componentCls}-item-description`]: {
          paddingBottom: token.paddingSM,
        },
      },
      [`> ${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-tail`]: {
        position: 'absolute',
        top: 0,
        insetInlineStart: token.calc(token.calc(token.stepsIconSize).div(2).equal()).sub(token.lineWidth).equal(),
        width: token.lineWidth,
        height: '100%',
        padding: `${unit(token.calc(stepsIconSize).add(token.calc(token.marginXXS).mul(1.5).equal()).equal())} 0 ${unit(token.calc(token.marginXXS).mul(1.5).equal())}`,

        '&::after': {
          width: token.lineWidth,
          height: '100%',
        },
      },
      [`> ${componentCls}-item:not(:last-child) > ${componentCls}-item-container > ${componentCls}-item-tail`]:
        {
          display: 'block',
        },
      [` > ${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-content > ${componentCls}-item-title`]:
        {
          '&::after': {
            display: 'none',
          },
        },
      [`&${componentCls}-small ${componentCls}-item-container`]: {
        [`${componentCls}-item-tail`]: {
          position: 'absolute',
          top: 0,
          insetInlineStart: token.calc(token.calc(token.stepsSmallIconSize).div(2).equal()).sub(token.lineWidth).equal(),
          padding: `${unit(token.calc(stepsSmallIconSize).add(token.calc(token.marginXXS).mul(1.5).equal()).equal())} 0 ${unit(token.calc(token.marginXXS).mul(1.5).equal())}`,
        },
        [`${componentCls}-item-title`]: {
          lineHeight: `${unit(stepsSmallIconSize)}`,
        },
      },
    },
  };
};
export default genStepsVerticalStyle;
