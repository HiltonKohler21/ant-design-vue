import { Keyframes, unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import {
  DEFAULT_BORDER_BEAM_DURATION,
  MAX_BEAM_COLOR_STOP_PERCENT,
  getBorderBeamVarName,
} from '../util';

export interface ComponentToken {}

type BorderBeamToken = FullToken<'BorderBeam'> & {
  rootPrefixCls: string;
};

const antBorderBeamMove = new Keyframes('antBorderBeamMove', {
  from: {
    offsetDistance: '0%',
  },
  to: {
    offsetDistance: '100%',
  },
});

const genBorderBeamStyle: GenerateStyle<BorderBeamToken> = token => {
  const { componentCls, rootPrefixCls, colorPrimary, colorPrimaryHover, lineWidth } = token;
  const rawToken: any = (token as any)._realToken ?? token;
  const motionDisabled = rawToken.motion === false || (token as any).motion === false;
  const varRef = (name: string, fallback?: string) =>
    fallback
      ? `var(${getBorderBeamVarName(rootPrefixCls, name)}, ${fallback})`
      : `var(${getBorderBeamVarName(rootPrefixCls, name)})`;

  const defaultBeamGradient = `linear-gradient(to left, ${colorPrimary} 0%, ${colorPrimaryHover} ${MAX_BEAM_COLOR_STOP_PERCENT}%, transparent)`;

  return {
    [componentCls]: {
      display: 'none',
      position: 'absolute',
      inset: varRef('inset-offset', '0px'),
      borderRadius: 'inherit',
      zIndex: 1,
      overflow: 'hidden',
      pointerEvents: 'none',
      padding: varRef('line-width', unit(lineWidth)),

      '@supports ((mask-composite: exclude) or (-webkit-mask-composite: xor))': {
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',

        '@supports (offset-path: rect(0 auto auto 0 round 1px))': {
          display: 'block',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: varRef('size', '100px'),
            aspectRatio: '1 / 1',
            opacity: 0.95,
            backgroundImage: varRef('beam-gradient', defaultBeamGradient),
            offsetAnchor: '90% 50%',
            offsetDistance: '0%',
            offsetPath: `rect(0 auto auto 0 round ${varRef('size', '100px')})`,
            offsetRotate: 'auto',
            ...(motionDisabled
              ? {
                  display: 'none',
                  animation: 'none',
                  transition: 'none',
                }
              : {
                  animationName: antBorderBeamMove,
                  animationDuration: varRef('duration', `${DEFAULT_BORDER_BEAM_DURATION}s`),
                  animationDelay: varRef('delay', '0s'),
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  willChange: 'offset-distance',
                }),
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              animation: 'none',
            },
          },
        },
      },

      '&-no-motion': {
        '&::before': {
          display: 'none',
          animation: 'none',
          transition: 'none',
        },
      },

      '@media (prefers-reduced-motion: reduce)': {
        '&::before': {
          display: 'none',
          animation: 'none',
          transition: 'none',
        },
      },
    },
  };
};

export default genComponentStyleHook('BorderBeam', (token, { rootPrefixCls }) =>
  genBorderBeamStyle({ ...token, rootPrefixCls } as BorderBeamToken),
);
