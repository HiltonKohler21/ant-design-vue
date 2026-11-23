export interface BorderBeamGradientItem {
  color: string;
  percent: number;
}

export type BorderBeamGradient = BorderBeamGradientItem[];
export type BorderBeamColor = string | string[] | BorderBeamGradient;
export type BorderWidth = readonly [number, number, number, number];

export const DEFAULT_BORDER_BEAM_DURATION = 6;
export const MAX_BEAM_COLOR_STOP_PERCENT = 70;

export const getBorderBeamVarName = (rootPrefixCls: string, name: string) =>
  `--${rootPrefixCls}-border-beam-${name}`;

const getLinearGradient = (...colorStops: string[]) =>
  `linear-gradient(to left, ${colorStops.join(', ')}, transparent)`;

const normalizeBorderBeamColor = (value?: BorderBeamColor): BorderBeamGradient => {
  if (!value) return [];
  if (typeof value === 'string') {
    return [{ color: value, percent: 0 }];
  }
  if (Array.isArray(value) && value.length > 0) {
    // Support string[] (e.g. ['#1677ff', '#722ed1']) in addition to { color, percent }[]
    if (typeof value[0] === 'string') {
      const colors = value as string[];
      if (colors.length === 1) {
        return [{ color: colors[0], percent: 0 }];
      }
      return colors.map((color, index) => ({
        color,
        percent: (index / (colors.length - 1)) * 100,
      }));
    }
    return value as BorderBeamGradient;
  }
  return [];
};

const fillGradientEnd = (items: BorderBeamGradient): BorderBeamGradient => {
  const lastItem = items[items.length - 1];
  if (!lastItem || lastItem.percent === 100) {
    return items;
  }
  return [...items, { ...lastItem, percent: 100 }];
};

// Map user-facing 0~100 stops into 0~70% so the trailing segment fades smoothly to transparent.
const getMappedBeamColorStopPercent = (percent: number): number =>
  Number(((Math.min(Math.max(percent, 0), 100) / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2));

const normalizeGradientItems = (items: BorderBeamGradient): BorderBeamGradient =>
  fillGradientEnd(items).map(item => ({
    ...item,
    percent: getMappedBeamColorStopPercent(item.percent),
  }));

export const getBorderBeamGradient = (value?: BorderBeamColor): string | undefined => {
  const normalizedStops = normalizeGradientItems(normalizeBorderBeamColor(value));
  return normalizedStops.length
    ? getLinearGradient(...normalizedStops.map(item => `${item.color} ${item.percent}%`))
    : undefined;
};

export const isSameBorderWidth = (left: BorderWidth, right: BorderWidth): boolean =>
  left[0] === right[0] && left[1] === right[1] && left[2] === right[2] && left[3] === right[3];
