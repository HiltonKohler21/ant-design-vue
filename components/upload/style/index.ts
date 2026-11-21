import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genDraggerStyle from './dragger';
import genListStyle from './list';
import genMotionStyle from './motion';
import { genPictureCardStyle, genPictureStyle } from './picture';
import genRtlStyle from './rtl';
import { resetComponent } from '../../style';
import { genCollapseMotion } from '../../style/motion';

export interface ComponentToken {}

export interface UploadToken extends FullToken<'Upload'> {
  uploadThumbnailSize: number;
  uploadProgressOffset: number;
  uploadPicCardSize: number;
}

const genBaseStyle: GenerateStyle<UploadToken> = token => {
  const { componentCls, colorTextDisabled } = token;

  return {
    [`${componentCls}-wrapper`]: {
      ...resetComponent(token),

      [componentCls]: {
        outline: 0,
        "input[type='file']": {
          cursor: 'pointer',
        },
      },

      [`${componentCls}-select`]: {
        display: 'inline-block',
      },

      [`${componentCls}-disabled`]: {
        color: colorTextDisabled,
        cursor: 'not-allowed',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Upload', token => {
  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawUploadToken: any = (token as any)._realToken ?? token;
  const listItemHeightSM = Math.round(rawUploadToken.fontSize * rawUploadToken.lineHeight);

  const uploadToken = mergeToken<UploadToken>(token, {
    uploadThumbnailSize: rawUploadToken.fontSizeHeading3 * 2,
    uploadProgressOffset: listItemHeightSM / 2 + rawUploadToken.lineWidth,
    uploadPicCardSize: rawUploadToken.controlHeightLG * 2.55,
  });

  return [
    genBaseStyle(uploadToken),
    genDraggerStyle(uploadToken),
    genPictureStyle(uploadToken),
    genPictureCardStyle(uploadToken),
    genListStyle(uploadToken),
    genMotionStyle(uploadToken),
    genRtlStyle(uploadToken),
    genCollapseMotion(uploadToken),
  ];
});
