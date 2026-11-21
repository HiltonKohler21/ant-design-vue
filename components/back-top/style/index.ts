import { unit } from '../../_util/cssinjs';
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
        lineHeight: `${unit(backTopSize)}`,
      },
    },
  };
};

const genMediaBackTopStyle: GenerateStyle<BackTopToken> = token => {
  const { componentCls, screenMD, screenXS, backTopInlineEndMD, backTopInlineEndXS } = token;
  return {
    [`@media (max-width: ${unit(screenMD)})`]: {
      [componentCls]: {
        insetInlineEnd: backTopInlineEndMD,
      },
    },
    [`@media (max-width: ${unit(screenXS)})`]: {
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

  } = token;
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const backTopToken = mergeToken<BackTopToken>(token, {
    zIndexPopup: rawToken.zIndexPopupBase + 10,
    backTopBackground: colorTextDescription,
    backTopColor: colorTextLightSolid,
    backTopHoverBackground: colorText,
    backTopFontSize: fontSizeHeading3,
    backTopSize: rawToken.controlHeightLG,
    backTopBlockEnd: rawToken.controlHeightLG * 1.25,
    backTopInlineEnd: rawToken.controlHeightLG * 2.5,
    backTopInlineEndMD: rawToken.controlHeightLG * 1.5,
    backTopInlineEndXS: rawToken.controlHeightLG * 0.5,
  });
  return [genSharedBackTopStyle(backTopToken), genMediaBackTopStyle(backTopToken)];
});
