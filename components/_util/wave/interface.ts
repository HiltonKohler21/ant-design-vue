import type { GlobalToken } from '../../theme/interface';

export type ShowWaveEffect = (
  element: HTMLElement,
  info: {
    className: string;
    token: GlobalToken;
    component?: string;
    event: MouseEvent;
    hashId: string;
  },
) => void;

export type ShowWave = (event: MouseEvent) => void;

export interface WaveConfig {
  disabled?: boolean;
  showEffect?: ShowWaveEffect;
}
