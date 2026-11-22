import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

const borderBeamRotate = new Keyframes('antBorderBeamRotate', {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export interface ComponentToken {
  /** 默认光束颜色 */
  beamDefaultColor: string;
  /** 默认动画时长（秒） */
  beamDuration: number;
}

interface BorderBeamToken extends FullToken<'BorderBeam'> {
  beamDefaultColor: string;
  beamDuration: number;
}

const genBorderBeamStyle: GenerateStyle<BorderBeamToken> = token => {
  const { componentCls, beamDefaultColor } = token;
  return {
    [componentCls]: {
      position: 'relative',
      display: 'block',
      borderRadius: 'inherit',

      [`${componentCls}-beam`]: {
        position: 'absolute',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        overflow: 'hidden',
        // 仅保留边框环：内层 content-box 被排除
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        animationName: borderBeamRotate,
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',

        '&::before': {
          content: '""',
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '220%',
          aspectRatio: '1 / 1',
          translate: '-50% -50%',
          background:
            'var(--beam-gradient, conic-gradient(from 0deg, transparent 0%, var(--beam-color) 70%, transparent 90%))',
          animationName: borderBeamRotate,
          animationDuration: 'inherit',
          animationDelay: 'inherit',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        },
      },

      '--beam-color': beamDefaultColor,
    },
  };
};

export default genComponentStyleHook(
  'BorderBeam',
  token => genBorderBeamStyle(token as BorderBeamToken),
  token => ({
    beamDefaultColor: token.colorPrimary,
    beamDuration: 6,
  }),
);
