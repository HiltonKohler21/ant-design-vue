import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import type { InputToken } from './index';

export interface ComponentToken {}

type OtpToken = FullToken<'OTP'> & InputToken<FullToken<'OTP'>>;

const genOTPStyle: GenerateStyle<OtpToken, CSSObject> = token => {
  const { componentCls, paddingXS, paddingXXS } = token;

  return {
    [componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      columnGap: paddingXS,
      [`${componentCls}-input-wrapper`]: {
        position: 'relative',
        [`${componentCls}-mask-icon`]: {
          position: 'absolute',
          zIndex: 1,
          top: '50%',
          right: '50%',
          transform: 'translate(50%, -50%)',
          pointerEvents: 'none',
        },
        [`${componentCls}-mask-input`]: {
          color: 'transparent',
          caretColor: token.colorText,
        },
        [`${componentCls}-mask-input[type=number]::-webkit-inner-spin-button`]: {
          WebkitAppearance: 'none',
          margin: 0,
        },
      },
      '&-rtl': {
        direction: 'rtl',
      },
      [`${componentCls}-input`]: {
        textAlign: 'center',
        paddingInline: paddingXXS,
      },
      [`&${componentCls}-sm ${componentCls}-input`]: {
        paddingInline: token.calc(paddingXXS).div(2).equal(),
      },
      [`&${componentCls}-lg ${componentCls}-input`]: {
        paddingInline: paddingXS,
      },
    },
  };
};

export default genComponentStyleHook<'OTP'>('OTP', token => genOTPStyle(token as OtpToken));
