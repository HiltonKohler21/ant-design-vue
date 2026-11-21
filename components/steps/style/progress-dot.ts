import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsProgressDotStyle: GenerateStyle<StepsToken, CSSObject> = token => {
  const {
    componentCls,
    descriptionWidth,
    lineHeight,
    stepsCurrentDotSize,
    stepsDotSize,
    motionDurationSlow,
  } = token;

  return {
    [`&${componentCls}-dot, &${componentCls}-dot${componentCls}-small`]: {
      [`${componentCls}-item`]: {
        '&-title': {
          lineHeight,
        },

        '&-tail': {
          top: token.calc(token.calc(token.stepsDotSize).sub(token.calc(token.lineWidth).mul(3).equal()).equal()).div(2).equal(),
          width: '100%',
          marginTop: 0,
          marginBottom: 0,
          marginInline: `${unit(token.calc(token.descriptionWidth).div(2).equal())} 0`,
          padding: 0,

          '&::after': {
            width: `calc(100% - ${unit(token.calc(token.marginSM).mul(2).equal())})`,
            height: token.calc(token.lineWidth).mul(3).equal(),
            marginInlineStart: token.marginSM,
          },
        },
        '&-icon': {
          width: stepsDotSize,
          height: stepsDotSize,
          marginInlineStart: token.calc(token.calc(token.descriptionWidth).sub(token.stepsDotSize).equal()).div(2).equal(),
          paddingInlineEnd: 0,
          lineHeight: `${unit(stepsDotSize)}`,
          background: 'transparent',
          border: 0,

          [`${componentCls}-icon-dot`]: {
            position: 'relative',
            float: 'left',
            width: '100%',
            height: '100%',
            borderRadius: 100, // very large number
            transition: `all ${motionDurationSlow}`,

            /* expand hover area */
            '&::after': {
              position: 'absolute',
              top: token.calc(token.marginSM).mul(-1).equal(),
              insetInlineStart: token.calc(token.calc(token.stepsDotSize).sub(token.calc(token.controlHeightLG).mul(1.5).equal()).equal()).div(2).equal(),
              width: token.calc(token.controlHeightLG).mul(1.5).equal(),
              height: token.controlHeight,
              background: 'transparent',
              content: '""',
            },
          },
        },

        '&-content': {
          width: descriptionWidth,
        },
        [`&-process ${componentCls}-item-icon`]: {
          position: 'relative',
          top: token.calc(token.calc(token.stepsDotSize).sub(token.stepsCurrentDotSize).equal()).div(2).equal(),
          width: stepsCurrentDotSize,
          height: stepsCurrentDotSize,
          lineHeight: `${unit(stepsCurrentDotSize)}`,
          background: 'none',
          marginInlineStart: token.calc(token.calc(token.descriptionWidth).sub(token.stepsCurrentDotSize).equal()).div(2).equal(),
        },
        [`&-process ${componentCls}-icon`]: {
          [`&:first-child ${componentCls}-icon-dot`]: {
            insetInlineStart: 0,
          },
        },
      },
    },
    [`&${componentCls}-vertical${componentCls}-dot`]: {
      [`${componentCls}-item-icon`]: {
        marginTop: token.calc(token.calc(token.controlHeight).sub(token.stepsDotSize).equal()).div(2).equal(),
        marginInlineStart: 0,
        background: 'none',
      },
      [`${componentCls}-item-process ${componentCls}-item-icon`]: {
        marginTop: token.calc(token.calc(token.controlHeight).sub(token.stepsCurrentDotSize).equal()).div(2).equal(),
        top: 0,
        insetInlineStart: token.calc(token.calc(token.stepsDotSize).sub(token.stepsCurrentDotSize).equal()).div(2).equal(),
        marginInlineStart: 0,
      },

      // https://github.com/ant-design/ant-design/issues/18354
      [`${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-tail`]: {
        top: token.calc(token.calc(token.controlHeight).sub(token.stepsDotSize).equal()).div(2).equal(),
        insetInlineStart: 0,
        margin: 0,
        padding: `${unit(token.calc(token.stepsDotSize).add(token.paddingXS).equal())} 0 ${unit(token.paddingXS)}`,

        '&::after': {
          marginInlineStart: token.calc(token.calc(token.stepsDotSize).sub(token.lineWidth).equal()).div(2).equal(),
        },
      },

      [`&${componentCls}-small`]: {
        [`${componentCls}-item-icon`]: {
          marginTop: token.calc(token.calc(token.controlHeightSM).sub(token.stepsDotSize).equal()).div(2).equal(),
        },
        [`${componentCls}-item-process ${componentCls}-item-icon`]: {
          marginTop: token.calc(token.calc(token.controlHeightSM).sub(token.stepsCurrentDotSize).equal()).div(2).equal(),
        },

        [`${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-tail`]: {
          top: token.calc(token.calc(token.controlHeightSM).sub(token.stepsDotSize).equal()).div(2).equal(),
        },
      },

      [`${componentCls}-item:first-child ${componentCls}-icon-dot`]: {
        insetInlineStart: 0,
      },
      [`${componentCls}-item-content`]: {
        width: 'inherit',
      },
    },
  };
};

export default genStepsProgressDotStyle;
