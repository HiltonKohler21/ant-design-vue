import useCacheToken from './hooks/useCacheToken';
import type { CSSInterpolation, CSSObject } from './hooks/useStyleRegister';
import useStyleRegister, { extractStyle } from './hooks/useStyleRegister';
import useCSSVarRegister, { clearCSSVarRegistry, extractCSSVarStyle } from './hooks/useCSSVarRegister';
import type { CSSVarRegisterConfig } from './hooks/useCSSVarRegister';
import Keyframes from './Keyframes';
import type { Linter } from './linters';
import { legacyNotSelectorLinter, logicalPropertiesLinter, parentSelectorLinter } from './linters';
import type { StyleContextProps, StyleProviderProps } from './StyleContext';
import { createCache, useStyleInject, useStyleProvider, StyleProvider } from './StyleContext';
import type { DerivativeFunc, TokenType } from './theme';
import { createTheme, Theme } from './theme';
import type { Transformer } from './transformers/interface';
import legacyLogicalPropertiesTransformer from './transformers/legacyLogicalProperties';
import px2remTransformer from './transformers/px2rem';
import { supportLogicProps, supportWhere, unit } from './util';
import { serializeCSSVar, token2CSSVar, transformToken } from './util/css-variables';
import genCalc from './util/calc';
import type { AbstractCalculator } from './util/calc';

const cssinjs = {
  Theme,
  createTheme,
  useStyleRegister,
  useCSSVarRegister,
  useCacheToken,
  createCache,
  useStyleInject,
  useStyleProvider,
  Keyframes,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,

  // Transformer
  legacyLogicalPropertiesTransformer,
  px2remTransformer,

  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
  parentSelectorLinter,

  // CSS Variables（antd v6 纯变量架构）
  token2CSSVar,
  serializeCSSVar,
  transformToken,
  genCalc,
  unit,

  // cssinjs
  StyleProvider,
};
export {
  Theme,
  createTheme,
  useStyleRegister,
  useCSSVarRegister,
  useCacheToken,
  createCache,
  useStyleInject,
  useStyleProvider,
  Keyframes,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,

  // Transformer
  legacyLogicalPropertiesTransformer,
  px2remTransformer,

  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
  parentSelectorLinter,

  // CSS Variables（antd v6 纯变量架构）
  token2CSSVar,
  serializeCSSVar,
  transformToken,
  genCalc,
  unit,

  // cssinjs
  StyleProvider,
};
export type {
  TokenType,
  CSSObject,
  CSSInterpolation,
  DerivativeFunc,
  Transformer,
  Linter,
  StyleContextProps,
  StyleProviderProps,
  AbstractCalculator,
  CSSVarRegisterConfig,
};

export const _experimental = {
  supportModernCSS: () => supportWhere() && supportLogicProps(),
};

export default cssinjs;
