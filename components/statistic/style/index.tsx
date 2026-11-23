import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { GlobalToken } from '../../theme/interface';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 标题字体大小
   * @descEN Title font size
   */
  titleFontSize: number;
  /**
   * @desc 内容字体大小
   * @descEN Content font size
   */
  contentFontSize: number;
}

interface StatisticToken extends FullToken<'Statistic'>, ComponentToken {
  statisticFontFamily: string;
}

const genStatisticStyle: GenerateStyle<StatisticToken> = (token: StatisticToken): CSSObject => {
  const {
    componentCls,
    marginXXS,
    padding,
    colorTextDescription,
    titleFontSize,
    colorTextHeading,
    contentFontSize,
    statisticFontFamily,
  } = token;

  return {
    [`${componentCls}`]: {
      ...resetComponent(token),
      [`${componentCls}-title`]: {
        marginBottom: marginXXS,
        color: colorTextDescription,
        fontSize: titleFontSize,
      },

      [`${componentCls}-skeleton`]: {
        paddingTop: padding,
      },

      [`${componentCls}-content`]: {
        color: colorTextHeading,
        fontSize: contentFontSize,
        fontFamily: statisticFontFamily,
        [`${componentCls}-content-value`]: {
          display: 'inline-block',
          direction: 'ltr',
        },
        [`${componentCls}-content-prefix, ${componentCls}-content-suffix`]: {
          display: 'inline-block',
        },
        [`${componentCls}-content-prefix`]: {
          marginInlineEnd: marginXXS,
        },
        [`${componentCls}-content-suffix`]: {
          marginInlineStart: marginXXS,
        },
      },
    },
  };
};

export const prepareComponentToken = (token: GlobalToken): ComponentToken => {
  const { fontSizeHeading3, fontSize } = token;
  return {
    titleFontSize: fontSize,
    contentFontSize: fontSizeHeading3,
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Statistic',
  token => {
    const { fontFamily } = token;

    const statisticToken = mergeToken<StatisticToken>(token, {
      statisticFontFamily: fontFamily,
    });
    return [genStatisticStyle(statisticToken)];
  },
  prepareComponentToken,
);
