import { unit } from '../../_util/cssinjs';
import type { CSSObject } from '../../_util/cssinjs';
import type { SelectToken } from './index';

/**
 * Select 的视觉变体样式（antd 5.13+ / `variant` 属性）
 *
 * 上游实现：antd `components/select/style/variants.ts`
 * 本地差异：ant-design-vue 的 Select 根节点统一挂 `${prefixCls}-${variant}`，
 * 由选中的 `selector` 元素承担视觉效果，因此变体规则都作用在 `selector` 上。
 */

const genSelectorBase = (
  token: SelectToken,
  options: {
    background: string;
    borderColor: string;
    borderWidth?: string | number;
    borderStyle?: string;
    color?: string;
    borderRadius?: number | string;
  },
): CSSObject => {
  const { componentCls } = token;
  return {
    [`&:not(${componentCls}-customize-input) ${componentCls}-selector`]: {
      backgroundColor: options.background,
      borderWidth: options.borderWidth ?? token.lineWidth,
      borderStyle: options.borderStyle ?? token.lineType,
      borderColor: options.borderColor,
      color: options.color ?? token.colorText,
      ...(options.borderRadius !== undefined ? { borderRadius: options.borderRadius } : {}),
    },
  };
};

const genInteractive = (
  token: SelectToken,
  options: { hover: CSSObject; focus: CSSObject; disabled?: CSSObject },
): CSSObject => {
  const { componentCls } = token;
  return {
    [`&:not(${componentCls}-disabled):not(${componentCls}-customize-input)`]: {
      [`&:hover ${componentCls}-selector`]: options.hover,
      [`${componentCls}-focused& ${componentCls}-selector`]: options.focus,
      ...(options.disabled ?? {}),
    },
  };
};

const genStatusVariant = (
  token: SelectToken,
  status: 'error' | 'warning',
  options: {
    background: string;
    borderColor: string;
    hoverBackground: string;
    activeBorderColor: string;
    color: string;
  },
): CSSObject => ({
  [`&${token.componentCls}-status-${status}`]: {
    ...genSelectorBase(token, {
      background: options.background,
      borderColor: options.borderColor,
      borderWidth: token.lineWidth,
      color: options.color,
    }),
    ...genInteractive(token, {
      hover: { backgroundColor: options.hoverBackground },
      focus: {
        backgroundColor: token.colorBgContainer,
        borderColor: options.activeBorderColor,
      },
    }),
  },
});

export const genOutlinedVariantStyle = (token: SelectToken): CSSObject => {
  const { componentCls } = token;
  return {
    ...genSelectorBase(token, {
      background: token.colorBgContainer,
      borderColor: token.colorBorder,
    }),
    ...genInteractive(token, {
      hover: { borderColor: token.colorPrimaryHover },
      focus: {
        borderColor: token.colorPrimary,
        boxShadow: `0 0 0 ${unit(token.controlOutlineWidth)} ${token.controlOutline}`,
        outline: 0,
      },
    }),
    ...genStatusVariant(token, 'error', {
      background: token.colorBgContainer,
      borderColor: token.colorError,
      hoverBackground: token.colorBgContainer,
      activeBorderColor: token.colorError,
      color: token.colorError,
    }),
    ...genStatusVariant(token, 'warning', {
      background: token.colorBgContainer,
      borderColor: token.colorWarning,
      hoverBackground: token.colorBgContainer,
      activeBorderColor: token.colorWarning,
      color: token.colorWarning,
    }),
    [`&${componentCls}-disabled ${componentCls}-selector`]: {
      backgroundColor: token.colorBgContainerDisabled,
      color: token.colorTextDisabled,
    },
  };
};

export const genFilledVariantStyle = (token: SelectToken): CSSObject => {
  const { componentCls } = token;
  return {
    ...genSelectorBase(token, {
      background: token.colorFillTertiary,
      borderColor: 'transparent',
    }),
    ...genInteractive(token, {
      hover: { backgroundColor: token.colorFillSecondary },
      focus: {
        backgroundColor: token.colorBgContainer,
        borderColor: token.colorPrimary,
        outline: 0,
      },
    }),
    ...genStatusVariant(token, 'error', {
      background: token.colorErrorBg,
      borderColor: 'transparent',
      hoverBackground: token.colorErrorBgHover,
      activeBorderColor: token.colorError,
      color: token.colorError,
    }),
    ...genStatusVariant(token, 'warning', {
      background: token.colorWarningBg,
      borderColor: 'transparent',
      hoverBackground: token.colorWarningBgHover,
      activeBorderColor: token.colorWarning,
      color: token.colorWarning,
    }),
    [`&${componentCls}-disabled ${componentCls}-selector`]: {
      backgroundColor: token.colorBgContainerDisabled,
      borderColor: token.colorBorder,
      color: token.colorTextDisabled,
    },
  };
};

export const genBorderlessVariantStyle = (token: SelectToken): CSSObject => {
  const { componentCls } = token;
  return {
    ...genSelectorBase(token, {
      background: 'transparent',
      borderColor: 'transparent',
    }),
    [`&${componentCls}-disabled ${componentCls}-selector`]: {
      color: token.colorTextDisabled,
    },
  };
};

export const genUnderlinedVariantStyle = (token: SelectToken): CSSObject => {
  return {
    ...genSelectorBase(token, {
      background: token.colorBgContainer,
      borderColor: `transparent transparent ${token.colorBorder} transparent`,
      borderWidth: `${token.lineWidth} 0`,
      borderStyle: `${token.lineType} none`,
      borderRadius: 0,
    }),
    ...genInteractive(token, {
      hover: {
        borderColor: `transparent transparent ${token.colorPrimaryHover} transparent`,
      },
      focus: {
        borderColor: `transparent transparent ${token.colorPrimary} transparent`,
        outline: 0,
      },
    }),
    ...genStatusVariant(token, 'error', {
      background: token.colorBgContainer,
      borderColor: `transparent transparent ${token.colorError} transparent`,
      hoverBackground: token.colorBgContainer,
      activeBorderColor: token.colorError,
      color: token.colorError,
    }),
    ...genStatusVariant(token, 'warning', {
      background: token.colorBgContainer,
      borderColor: `transparent transparent ${token.colorWarning} transparent`,
      hoverBackground: token.colorBgContainer,
      activeBorderColor: token.colorWarning,
      color: token.colorWarning,
    }),
  };
};

/** 汇总所有变体样式（绝对选择器，可安全追加在基础样式之后） */
export const genSelectVariantsStyle = (token: SelectToken): CSSObject => {
  const { componentCls } = token;
  return {
    [`${componentCls}-outlined`]: genOutlinedVariantStyle(token),
    [`${componentCls}-filled`]: genFilledVariantStyle(token),
    [`${componentCls}-borderless`]: genBorderlessVariantStyle(token),
    [`${componentCls}-underlined`]: genUnderlinedVariantStyle(token),
  };
};
