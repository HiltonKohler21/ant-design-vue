import { Fragment, h } from 'vue';
import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined';
import type { GenerateConfig } from '../vc-picker/generate';
import type { CustomFormat, PickerMode } from '../vc-picker/interface';
import { isSameDate, isSameMonth, isSameQuarter, isSameYear } from '../vc-picker/utils/dateUtil';
import type { SelectCommonPlacement } from '../_util/transition';
import type { PickerLocale } from './generatePicker';
import type { DirectionType } from '../config-provider';
import type { VueNode } from '../_util/type';

export type MaskFormatConfig = {
  format: string;
  type?: 'mask';
};

export type FormatType<DateType = any> =
  | string
  | CustomFormat<DateType>
  | (string | CustomFormat<DateType> | MaskFormatConfig)[]
  | MaskFormatConfig;

export function getPlaceholder(
  locale: PickerLocale,
  picker: PickerMode,
  customizePlaceholder?: string,
): string {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder;
  }

  if (picker === 'year' && locale.lang.yearPlaceholder) {
    return locale.lang.yearPlaceholder;
  }
  if (picker === 'quarter' && locale.lang.quarterPlaceholder) {
    return locale.lang.quarterPlaceholder;
  }
  if (picker === 'month' && locale.lang.monthPlaceholder) {
    return locale.lang.monthPlaceholder;
  }
  if (picker === 'week' && locale.lang.weekPlaceholder) {
    return locale.lang.weekPlaceholder;
  }
  if (picker === 'time' && locale.timePickerLocale.placeholder) {
    return locale!.timePickerLocale.placeholder;
  }
  return locale.lang.placeholder;
}

export function getRangePlaceholder(
  locale: PickerLocale,
  picker: PickerMode,
  customizePlaceholder?: [string, string],
) {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder;
  }

  if (picker === 'year' && locale.lang.yearPlaceholder) {
    return locale.lang.rangeYearPlaceholder;
  }
  if (picker === 'month' && locale.lang.monthPlaceholder) {
    return locale.lang.rangeMonthPlaceholder;
  }
  if (picker === 'week' && locale.lang.weekPlaceholder) {
    return locale.lang.rangeWeekPlaceholder;
  }
  if (picker === 'time' && locale.timePickerLocale.placeholder) {
    return locale!.timePickerLocale.rangePlaceholder;
  }
  return locale.lang.rangePlaceholder;
}

export function transPlacement2DropdownAlign(
  direction: DirectionType,
  placement?: SelectCommonPlacement,
) {
  const overflow = {
    adjustX: 1,
    adjustY: 1,
  };
  switch (placement) {
    case 'bottomLeft': {
      return {
        points: ['tl', 'bl'],
        offset: [0, 4],
        overflow,
      };
    }
    case 'bottomRight': {
      return {
        points: ['tr', 'br'],
        offset: [0, 4],
        overflow,
      };
    }
    case 'topLeft': {
      return {
        points: ['bl', 'tl'],
        offset: [0, -4],
        overflow,
      };
    }
    case 'topRight': {
      return {
        points: ['br', 'tr'],
        offset: [0, -4],
        overflow,
      };
    }
    default: {
      return {
        points: direction === 'rtl' ? ['tr', 'br'] : ['tl', 'bl'],
        offset: [0, 4],
        overflow,
      };
    }
  }
}

export function normalizeFormat<DateType>(format: FormatType<DateType> | undefined): {
  format: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[] | undefined;
  isMask: boolean;
  maskPattern?: string;
} {
  if (!format) {
    return { format: undefined, isMask: false };
  }
  if (typeof format === 'object' && !Array.isArray(format) && 'format' in format) {
    return {
      format: format.format,
      isMask: format.type === 'mask',
      maskPattern: format.format,
    };
  }
  if (Array.isArray(format)) {
    let isMask = false;
    let maskPattern: string | undefined;
    const list: (string | CustomFormat<DateType>)[] = format.map(item => {
      if (typeof item === 'object' && item !== null && 'format' in item) {
        if (item.type === 'mask') {
          isMask = true;
          maskPattern = maskPattern || item.format;
        }
        return item.format;
      }
      return item as string | CustomFormat<DateType>;
    });
    return { format: list, isMask, maskPattern };
  }
  return { format, isMask: false };
}

export function getLocaleDefaultFormat(
  locale: PickerLocale | undefined,
  picker: PickerMode,
  showTime?: boolean | object,
): string | undefined {
  const lang = locale?.lang as Record<string, any> | undefined;
  if (!lang) return undefined;
  switch (picker) {
    case 'time':
      return lang.fieldTimeFormat;
    case 'year':
      return lang.fieldYearFormat;
    case 'quarter':
      return lang.fieldQuarterFormat;
    case 'month':
      return lang.fieldMonthFormat;
    case 'week':
      return lang.fieldWeekFormat;
    default:
      return showTime ? lang.fieldDateTimeFormat : lang.fieldDateFormat;
  }
}

export function isDateOutOfBounds<DateType>(
  generateConfig: GenerateConfig<DateType>,
  current: DateType,
  minDate: DateType | undefined,
  maxDate: DateType | undefined,
  picker: PickerMode,
): boolean {
  const isSameUnit = (a: DateType, b: DateType) => {
    switch (picker) {
      case 'year':
        return isSameYear(generateConfig, a, b);
      case 'quarter':
        return isSameQuarter(generateConfig, a, b);
      case 'month':
        return isSameMonth(generateConfig, a, b);
      default:
        return isSameDate(generateConfig, a, b);
    }
  };
  if (minDate && !isSameUnit(current, minDate) && generateConfig.isAfter(minDate, current)) {
    return true;
  }
  if (maxDate && !isSameUnit(current, maxDate) && generateConfig.isAfter(current, maxDate)) {
    return true;
  }
  return false;
}

export function composeMinMaxDisabledDate<DateType>(
  generateConfig: GenerateConfig<DateType>,
  disabledDate: ((date: DateType, info?: any) => boolean) | undefined,
  minDate: DateType | undefined,
  maxDate: DateType | undefined,
  picker: PickerMode,
): ((date: DateType, info?: any) => boolean) | undefined {
  if (!disabledDate && !minDate && !maxDate) {
    return undefined;
  }
  return (current: DateType, info?: any) => {
    if (disabledDate?.(current, info)) {
      return true;
    }
    return isDateOutOfBounds(generateConfig, current, minDate, maxDate, picker);
  };
}

export function resolveSuffixNode({
  picker,
  hasFeedback,
  feedbackIcon,
  suffix,
}: {
  picker?: PickerMode;
  hasFeedback?: boolean;
  feedbackIcon?: VueNode;
  suffix?: VueNode;
}): VueNode {
  if (suffix === null || suffix === false) {
    return hasFeedback ? feedbackIcon : null;
  }
  if (suffix === true || suffix === undefined) {
    return h(Fragment, null, [
      picker === 'time' ? h(ClockCircleOutlined) : h(CalendarOutlined),
      hasFeedback && feedbackIcon,
    ]);
  }
  return hasFeedback ? h(Fragment, null, [suffix, feedbackIcon]) : suffix;
}

export interface AllowClearConfig {
  clearIcon?: VueNode;
  disabled?: boolean;
  label?: string;
  tabIndex?: number;
}

export function resolveAllowClearConfig(
  allowClear: boolean | AllowClearConfig | undefined,
  clearIcon: VueNode | undefined,
  contextAllowClear: boolean | AllowClearConfig | undefined,
  contextClearIcon: VueNode | undefined,
): { allowClear: boolean; clearIcon?: VueNode } {
  const ctxObj =
    contextAllowClear && typeof contextAllowClear === 'object' ? contextAllowClear : undefined;
  const propObj = allowClear && typeof allowClear === 'object' ? allowClear : undefined;

  let enabled = true;
  if (allowClear === false) {
    enabled = false;
  } else if (propObj) {
    enabled = propObj.disabled === true ? false : true;
  } else if (allowClear === true) {
    enabled = ctxObj?.disabled === true ? false : true;
  } else if (contextAllowClear === false || ctxObj?.disabled === true) {
    enabled = false;
  }

  const mergedClearIcon = propObj?.clearIcon ?? clearIcon ?? ctxObj?.clearIcon ?? contextClearIcon;

  return {
    allowClear: enabled,
    clearIcon: mergedClearIcon,
  };
}

/**
 * Find mask segment ranges (e.g. YYYY, MM, DD, HH, mm, ss) inside a format pattern
 * to support arrow-left / arrow-right segment selection in mask format inputs.
 */
export function getMaskSegments(pattern: string): Array<{ start: number; end: number }> {
  const segments: Array<{ start: number; end: number }> = [];
  const regex = /(Y+|M+|D+|H+|h+|m+|s+|A|a|B+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(pattern)) !== null) {
    segments.push({ start: match.index, end: match.index + match[0].length });
  }
  return segments;
}
