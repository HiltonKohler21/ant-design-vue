import { TinyColor } from '@ctrl/tinycolor';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { mergeToken, genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc QRCode 遮罩背景颜色
   * @descEN Cover background color of QRCode
   */
  QRCodeCoverBackgroundColor: string;
}

interface QRCodeToken extends FullToken<'QRCode'> {
  QRCodeTextColor: string;
}

const genQRCodeStyle: GenerateStyle<QRCodeToken> = token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: token.paddingSM,
      backgroundColor: token.colorWhite,
      borderRadius: token.borderRadiusLG,
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      [`& > ${componentCls}-mask`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: token.colorText,
        lineHeight: token.lineHeight,
        background: token.QRCodeCoverBackgroundColor,
        textAlign: 'center',
        [`& > ${componentCls}-expired , & > ${componentCls}-scanned`]: {
          color: token.QRCodeTextColor,
        },
      },
      '&-icon': {
        marginBlockEnd: token.marginXS,
        fontSize: token.controlHeight,
      },
    },
    [`${componentCls}-borderless`]: {
      borderColor: 'transparent',
    },
  };
};

export default genComponentStyleHook<'QRCode'>(
  'QRCode',
  token =>
    genQRCodeStyle(
      mergeToken<QRCodeToken>(token, {
        QRCodeTextColor: 'rgba(0, 0, 0, 0.88)',
      }),
    ),
  token => ({
    QRCodeCoverBackgroundColor: new TinyColor(token.colorBgContainer).setAlpha(0.96).toRgbString(),
  }),
);
