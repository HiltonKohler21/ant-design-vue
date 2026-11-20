/**
 * CSS 变量工具（移植自 @ant-design/cssinjs v2 / util/css-variables）
 *
 * 作用：把 Design Token 的字面值转换成 CSS 变量引用，
 * 使得「样式只生成一次，主题切换只改变量值」—— 这是 antd v6 性能收益的核心。
 */

/** token 名 → CSS 变量名（camelCase → kebab-case，加前缀） */
export const token2CSSVar = (token: string, prefix = ''): string => {
  return `--${prefix ? `${prefix}-` : ''}${token}`
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1-$2')
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .toLowerCase();
};

/** 生成 `:where(.hash).scope` 形式的选择器片段 */
export const where = (options?: { hashCls?: string; hashPriority?: 'low' | 'high' }): string => {
  const { hashCls, hashPriority = 'low' } = options || {};
  if (!hashCls) {
    return '';
  }
  const hashSelector = `.${hashCls}`;
  return hashPriority === 'low' ? `:where(${hashSelector})` : hashSelector;
};

/** 把 cssVars 映射序列化成 `<selector>{--a:1;--b:2}` */
export const serializeCSSVar = (
  cssVars: Record<string, string>,
  hashId: string,
  options?: {
    hashCls?: string;
    hashPriority?: 'low' | 'high';
    scope?: string | string[];
  },
): string => {
  const { hashCls, hashPriority = 'low', scope } = options || {};
  if (!Object.keys(cssVars).length) {
    return '';
  }

  const baseSelector = `${where({ hashCls, hashPriority })}.${hashId}`;
  const scopes = [scope].flat().filter(Boolean) as string[];
  const selector = scopes.length
    ? scopes.map(s => `${baseSelector}.${s}`).join(', ')
    : baseSelector;

  return `${selector}{${Object.entries(cssVars)
    .map(([key, value]) => `${key}:${value};`)
    .join('')}}`;
};

export interface TransformTokenConfig {
  prefix?: string;
  /** 数值型 token 是否不加 px（如 lineHeight / zIndex） */
  unitless?: Record<string, boolean>;
  /** 完全不转成变量的 token（如 motionBase） */
  ignore?: Record<string, boolean>;
  /** 保留原值、不转成变量的 token（如媒体查询用的 screenMD） */
  preserve?: Record<string, boolean>;
  scope?: string | string[];
  hashCls?: string;
  hashPriority?: 'low' | 'high';
}

/**
 * 把 token 的字面值替换成 `var(--ant-xxx)`，同时收集变量声明字符串。
 * @returns `[转换后的 token, 变量声明 CSS 文本]`
 */
export const transformToken = <T extends Record<string, any>>(
  token: T,
  themeKey: string,
  config?: TransformTokenConfig,
): [T, string] => {
  const { hashCls, hashPriority = 'low', prefix, unitless, ignore, preserve } = config || {};

  const cssVars: Record<string, string> = {};
  const result: Record<string, any> = {};

  Object.entries(token).forEach(([key, value]) => {
    if (preserve?.[key]) {
      result[key] = value;
    } else if ((typeof value === 'string' || typeof value === 'number') && !ignore?.[key]) {
      const cssVar = token2CSSVar(key, prefix);
      cssVars[cssVar] =
        typeof value === 'number' && !unitless?.[key] ? `${value}px` : String(value);
      result[key] = `var(${cssVar})`;
    }
  });

  return [
    result as T,
    serializeCSSVar(cssVars, themeKey, { scope: config?.scope, hashCls, hashPriority }),
  ];
};
