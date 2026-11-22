/* eslint-disable import/prefer-default-export */
import { defaultConfig, useToken as useInternalToken } from './internal';
import type { GlobalToken } from './interface';
import defaultAlgorithm from './themes/default';
import darkAlgorithm from './themes/dark';
import compactAlgorithm from './themes/compact';

// ZombieJ: We export as object to user but array in internal.
// This is used to minimize the bundle size for antd package but safe to refactor as object also.
// Please do not export internal `useToken` directly to avoid something export unexpected.
/** Get current context Design Token. Will be different if you are using nest theme config. */
function useToken() {
  const [theme, token, hashId, realToken] = useInternalToken();

  // realToken：未做 CSS 变量替换的原始 token。
  // cssVar 模式下 token 的值是 `var(--ant-*)` 字符串，凡是需要参与 JS 数值/颜色运算
  // （取整、比例、TinyColor、拼接 px 等）都必须使用 realToken，否则会产出 NaN / 黑色。
  return { theme, token, hashId, realToken };
}

export { type GlobalToken };

export default {
  /** @private Test Usage. Do not use in production. */
  defaultConfig,

  /** Default seedToken */
  defaultSeed: defaultConfig.token,

  useToken,
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
};
