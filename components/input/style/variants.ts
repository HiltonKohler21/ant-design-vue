import type { CSSObject } from '../../_util/cssinjs';
import type { InputToken } from './index';

/**
 * 输入类组件的视觉变体样式（antd 5.13+ / `variant` 属性）
 *
 * 上游实现：antd `components/input/style/variants.ts`
 * 本地差异：ant-design-vue 的 affix wrapper / group wrapper 使用
 * `-affix-wrapper-${variant}` / `-group-wrapper-${variant}` 命名，
 * 因此每个变体同时产出三份选择器，保证三种 DOM 位置（纯 input / 前后缀 / 组合框）都生效。
 */

export const genVariantHoverStyle = (token: InputToken): CSSObject => ({
  borderColor: token.inputBorderHoverColor,
});

export const genVariantDisabledStyle = (token: InputToken): CSSObject => ({
  color: token.colorTextDisabled,
  backgroundColor: token.colorBgContainerDisabled,
  borderColor: token.colorBorder,
  boxShadow: 'none',
  cursor: 'not-allowed',
  opacity: 1,
  'input[disabled], textarea[disabled]': {
    cursor: 'not-allowed',
  },
  '&:hover:not([disabled])': {
    borderColor: token.colorBorder,
    backgroundColor: token.colorBgContainerDisabled,
  },
});

/**
 * 生成「聚焦态」选择器：
 * `&` 此时绑定的是变体类（如 `.ant-input-filled`），因此必须用显式的 `${componentCls}-focused`。
 */
const genFocusSelector = (token: InputToken, style: CSSObject): CSSObject => ({
  '&:focus, &:focus-within': style,
  [`&${token.componentCls}-focused`]: style,
});

/* ============== Outlined ============== */
const genBaseOutlinedStyle = (
  token: InputToken,
  options: {
    borderColor: string;
    hoverBorderColor: string;
    activeBorderColor: string;
    activeShadow: string;
  },
): CSSObject => ({
  backgroundColor: token.colorBgContainer,
  borderWidth: token.lineWidth,
  borderStyle: token.lineType,
  borderColor: options.borderColor,
  '&:hover': {
    borderColor: options.hoverBorderColor,
  },
  ...genFocusSelector(token, {
    borderColor: options.activeBorderColor,
    boxShadow: options.activeShadow,
    outline: 0,
  }),
});

const genOutlinedStatusStyle = (
  token: InputToken,
  options: {
    status: 'error' | 'warning';
    borderColor: string;
    hoverBorderColor: string;
    activeBorderColor: string;
    activeShadow: string;
  },
): CSSObject => ({
  [`&${token.componentCls}-status-${options.status}:not(${token.componentCls}-disabled)`]: {
    ...genBaseOutlinedStyle(token, options),
    [`${token.componentCls}-prefix, ${token.componentCls}-suffix`]: {
      color: options.borderColor,
    },
  },
});

export const genOutlinedStyle = (token: InputToken): CSSObject => ({
  ...genBaseOutlinedStyle(token, {
    borderColor: token.colorBorder,
    hoverBorderColor: token.inputBorderHoverColor,
    activeBorderColor: token.inputBorderActiveColor,
    activeShadow: `0 0 0 ${token.controlOutlineWidth}px ${token.controlOutline}`,
  }),
  [`&${token.componentCls}-disabled, &[disabled]`]: {
    ...genVariantDisabledStyle(token),
  },
  ...genOutlinedStatusStyle(token, {
    status: 'error',
    borderColor: token.colorError,
    hoverBorderColor: token.colorErrorBorderHover,
    activeBorderColor: token.colorError,
    activeShadow: `0 0 0 ${token.controlOutlineWidth}px ${token.colorErrorOutline}`,
  }),
  ...genOutlinedStatusStyle(token, {
    status: 'warning',
    borderColor: token.colorWarning,
    hoverBorderColor: token.colorWarningBorderHover,
    activeBorderColor: token.colorWarning,
    activeShadow: `0 0 0 ${token.controlOutlineWidth}px ${token.colorWarningOutline}`,
  }),
});

/* ============ Borderless ============ */
export const genBorderlessStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token;
  return {
    backgroundColor: 'transparent',
    border: 'none',
    ...genFocusSelector(token, {
      outline: 'none',
      boxShadow: 'none',
    }),
    [`&${componentCls}-disabled, &[disabled]`]: {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
    [`&${componentCls}-status-error`]: {
      '&, & input, & textarea': {
        color: token.colorError,
      },
    },
    [`&${componentCls}-status-warning`]: {
      '&, & input, & textarea': {
        color: token.colorWarning,
      },
    },
  };
};

/* ============== Filled ============== */
const genBaseFilledStyle = (
  token: InputToken,
  options: { bg: string; hoverBg: string; activeBorderColor: string; inputColor?: string },
): CSSObject => ({
  backgroundColor: options.bg,
  borderWidth: token.lineWidth,
  borderStyle: token.lineType,
  borderColor: 'transparent',
  'input&, & input, textarea&, & textarea': {
    color: options.inputColor ?? 'unset',
  },
  '&:hover': {
    backgroundColor: options.hoverBg,
  },
  ...genFocusSelector(token, {
    outline: 0,
    borderColor: options.activeBorderColor,
    backgroundColor: token.colorBgContainer,
  }),
});

const genFilledStatusStyle = (
  token: InputToken,
  options: {
    status: 'error' | 'warning';
    bg: string;
    hoverBg: string;
    activeBorderColor: string;
    inputColor: string;
    affixColor: string;
  },
): CSSObject => ({
  [`&${token.componentCls}-status-${options.status}:not(${token.componentCls}-disabled)`]: {
    ...genBaseFilledStyle(token, options),
    [`${token.componentCls}-prefix, ${token.componentCls}-suffix`]: {
      color: options.affixColor,
    },
  },
});

export const genFilledStyle = (token: InputToken): CSSObject => ({
  ...genBaseFilledStyle(token, {
    bg: token.colorFillTertiary,
    hoverBg: token.colorFillSecondary,
    activeBorderColor: token.inputBorderActiveColor,
  }),
  [`&${token.componentCls}-disabled, &[disabled]`]: {
    ...genVariantDisabledStyle(token),
  },
  ...genFilledStatusStyle(token, {
    status: 'error',
    bg: token.colorErrorBg,
    hoverBg: token.colorErrorBgHover,
    activeBorderColor: token.colorError,
    inputColor: token.colorErrorText,
    affixColor: token.colorError,
  }),
  ...genFilledStatusStyle(token, {
    status: 'warning',
    bg: token.colorWarningBg,
    hoverBg: token.colorWarningBgHover,
    activeBorderColor: token.colorWarning,
    inputColor: token.colorWarningText,
    affixColor: token.colorWarning,
  }),
});

/* ============== Underlined ============== */
const genBaseUnderlinedStyle = (
  token: InputToken,
  options: { borderColor: string; hoverBorderColor: string; activeBorderColor: string },
): CSSObject => ({
  backgroundColor: token.colorBgContainer,
  borderWidth: `${token.lineWidth} 0`,
  borderStyle: `${token.lineType} none`,
  borderColor: `transparent transparent ${options.borderColor} transparent`,
  borderRadius: 0,
  '&:hover': {
    borderColor: `transparent transparent ${options.hoverBorderColor} transparent`,
  },
  ...genFocusSelector(token, {
    borderColor: `transparent transparent ${options.activeBorderColor} transparent`,
    outline: 0,
  }),
});

const genUnderlinedStatusStyle = (
  token: InputToken,
  options: {
    status: 'error' | 'warning';
    borderColor: string;
    hoverBorderColor: string;
    activeBorderColor: string;
  },
): CSSObject => ({
  [`&${token.componentCls}-status-${options.status}:not(${token.componentCls}-disabled)`]: {
    ...genBaseUnderlinedStyle(token, options),
    [`${token.componentCls}-prefix, ${token.componentCls}-suffix`]: {
      color: options.borderColor,
    },
  },
});

export const genUnderlinedStyle = (token: InputToken): CSSObject => ({
  ...genBaseUnderlinedStyle(token, {
    borderColor: token.colorBorder,
    hoverBorderColor: token.inputBorderHoverColor,
    activeBorderColor: token.inputBorderActiveColor,
  }),
  [`&${token.componentCls}-disabled, &[disabled]`]: {
    color: token.colorTextDisabled,
    boxShadow: 'none',
    cursor: 'not-allowed',
    '&:hover': {
      borderColor: `transparent transparent ${token.colorBorder} transparent`,
    },
  },
  'input[disabled], textarea[disabled]': {
    cursor: 'not-allowed',
  },
  ...genUnderlinedStatusStyle(token, {
    status: 'error',
    borderColor: token.colorError,
    hoverBorderColor: token.colorErrorBorderHover,
    activeBorderColor: token.colorError,
  }),
  ...genUnderlinedStatusStyle(token, {
    status: 'warning',
    borderColor: token.colorWarning,
    hoverBorderColor: token.colorWarningBorderHover,
    activeBorderColor: token.colorWarning,
  }),
});

/* ============== Group（前后置标签）============== */
export const genGroupVariantStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token;
  return {
    [`${componentCls}-filled`]: {
      [`${componentCls}-group-addon`]: {
        backgroundColor: token.colorFillTertiary,
        '&:last-child': {
          position: 'static',
        },
      },
      [`${componentCls}-group-wrapper-status-error`]: {
        [`${componentCls}-group-addon`]: {
          backgroundColor: token.colorErrorBg,
          color: token.colorErrorText,
        },
      },
      [`${componentCls}-group-wrapper-status-warning`]: {
        [`${componentCls}-group-addon`]: {
          backgroundColor: token.colorWarningBg,
          color: token.colorWarningText,
        },
      },
    },
    [`${componentCls}-underlined`]: {
      [`${componentCls}-group-addon`]: {
        backgroundColor: 'transparent',
        borderWidth: `${token.lineWidth} 0`,
        borderStyle: `${token.lineType} none`,
        borderColor: `transparent transparent ${token.colorBorder} transparent`,
      },
    },
  };
};

/**
 * 汇总所有变体样式。以「绝对选择器」形式产出，可安全追加在基础样式之后。
 */
export const genVariantsStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token;

  const perVariant = (variant: string, style: CSSObject): CSSObject => ({
    [`${componentCls}-${variant}`]: style,
    [`${componentCls}-affix-wrapper-${variant}`]: style,
  });

  return {
    ...perVariant('outlined', genOutlinedStyle(token)),
    ...perVariant('borderless', genBorderlessStyle(token)),
    ...perVariant('filled', genFilledStyle(token)),
    ...perVariant('underlined', genUnderlinedStyle(token)),
    ...genGroupVariantStyle(token),
  };
};
