/**
 * CSS 变量转换时的 token 分类表（对齐 antd v6 `theme/useToken.ts`）
 *
 * - unitless：数值型 token，转成变量时**不加 px**（如行高、z-index）
 * - ignore：完全不转成变量的 token
 * - preserve：保留字面值、不转成变量（如媒体查询断点，CSS 变量不能用于 `@media`）
 */

export const unitless: Record<string, boolean> = {
  lineHeight: true,
  lineHeightSM: true,
  lineHeightLG: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  opacityLoading: true,
  fontWeightStrong: true,
  zIndexPopupBase: true,
  zIndexBase: true,
  zIndexPopup: true,
  opacityImage: true,
};

export const ignore: Record<string, boolean> = {
  motionBase: true,
  motionUnit: true,
};

export const preserve: Record<string, boolean> = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
  screenXXLMax: true,
  screenXXXL: true,
  screenXXXLMin: true,
  wireframe: true,
  motion: true,
};
