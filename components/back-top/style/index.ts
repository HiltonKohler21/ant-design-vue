import type { FullToken, GenerateStyle } from '../../theme/internal';
import { mergeToken, genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  zIndexPopup: number;
}

interface BackTopToken extends FullToken<'BackTop'> {
  backTopBackground: string;
  backTopColor: string;
  backTopHoverBackground: string;
  backTopFontSize: number;
  backTopSize: number;
  backTopBlockEnd: number | string;
  backTopInlineEnd: number | string;
  backTopInlineEndMD: number | string;
  backTopInlineEndXS: number | string;
}

const genSharedBackTopStyle: GenerateStyle<BackTopToken> = token => {
  const { componentCls, backTopFontSize, backTopSize, zIndexPopup } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'fixed',
      insetInlineEnd: token.backTopInlineEnd,
      insetBlockEnd: token.backTopBlockEnd,
      zIndex: zIndexPopup,
      width: 40,
      height: 40,
      cursor: 'pointer',
      '&:empty': {
        display: 'none',
      },
      [`${componentCls}-content`]: {
        width: backTopSize,
        height: backTopSize,
        overflow: 'hidden',
        color: token.backTopColor,
        textAlign: 'center',
        backgroundColor: token.backTopBackground,
        borderRadius: backTopSize,
        transition: `all ${token.motionDurationMid}`,
        '&:hover': {
          backgroundColor: token.backTopHoverBackground,
          transition: `all ${token.motionDurationMid}`,
        },
      },
      [`${componentCls}-icon`]: {
        fontSize: backTopFontSize,
        lineHeight: `${backTopSize}px`,
      },
    },
  };
};

const genMediaBackTopStyle: GenerateStyle<BackTopToken> = token => {
  const { componentCls, screenMD, screenXS, backTopInlineEndMD, backTopInlineEndXS } = token;
  return {
    [`@media (max-width: ${screenMD}px)`]: {
      [componentCls]: {
        insetInlineEnd: backTopInlineEndMD,
      },
    },
    [`@media (max-width: ${screenXS}px)`]: {
      [componentCls]: {
        insetInlineEnd: backTopInlineEndXS,
      },
    },
  };
};

export default genComponentStyleHook<'BackTop'>('BackTop', token => {
  const {
    fontSizeHeading3,
    colorTextDescription,
    colorTextLightSolid,
    colorText,
    controlHeightLG,
  } = token;
  const backTopToken = mergeToken<BackTopToken>(token, {
    zIndexPopup: token.zIndexPopupBase + 10,
    backTopBackground: colorTextDescription,
    backTopColor: colorTextLightSolid,
    backTopHoverBackground: colorText,
    backTopFontSize: fontSizeHeading3,
    backTopSize: controlHeightLG,
    backTopBlockEnd: controlHeightLG * 1.25,
    backTopInlineEnd: controlHeightLG * 2.5,
    backTopInlineEndMD: controlHeightLG * 1.5,
    backTopInlineEndXS: controlHeightLG * 0.5,
  });
  return [genSharedBackTopStyle(backTopToken), genMediaBackTopStyle(backTopToken)];
});
