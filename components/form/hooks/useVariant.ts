import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import type { Variant } from '../../config-provider/context';
import { configProviderKey, defaultConfigProvider, Variants } from '../../config-provider/context';
import { useInjectFormVariant } from '../context';

/** 支持 `variant` 的组件名（对应 ConfigProvider 上的同名配置项） */
export type VariantComponent =
  | 'input'
  | 'inputPassword'
  | 'inputSearch'
  | 'textArea'
  | 'otp'
  | 'inputNumber'
  | 'select'
  | 'card'
  | 'cascader'
  | 'treeSelect'
  | 'mentions'
  | 'autoComplete'
  | 'datePicker'
  | 'rangePicker'
  | 'timePicker'
  | 'divider'
  | 'button'
  | 'tag'
  | 'alert'
  | 'steps'
  | 'timeline';

export interface VariantOptions<T extends readonly string[]> {
  variants: T;
  defaultVariant: T[number];
}

const DEFAULT_FALLBACK_COMPONENT: Partial<Record<VariantComponent, VariantComponent>> = {
  textArea: 'input',
  inputPassword: 'input',
  inputSearch: 'input',
  otp: 'input',
  rangePicker: 'datePicker',
};

const COMPONENT_OWN_VARIANTS: Partial<
  Record<VariantComponent, { variants: readonly string[]; defaultVariant: string }>
> = {
  card: { variants: ['outlined', 'borderless'], defaultVariant: 'outlined' },
  divider: { variants: ['solid', 'dashed', 'dotted'], defaultVariant: 'solid' },
  alert: { variants: ['outlined', 'filled'], defaultVariant: 'outlined' },
  tag: { variants: ['filled', 'solid', 'outlined'], defaultVariant: 'filled' },
  steps: { variants: ['filled', 'outlined'], defaultVariant: 'filled' },
  timeline: { variants: ['filled', 'outlined'], defaultVariant: 'filled' },
};

/**
 * 解析组件的视觉变体，兼容 antd 5.13 之前的 `bordered` 属性。
 *
 * 优先级：props.variant > props.bordered(false) > Form variant 上下文（仅标准表单控件）> 组件级 ConfigProvider 配置 > 回退组件配置（如 textArea -> input）> 全局 ConfigProvider > defaultVariant
 *
 * @see https://github.com/ant-design/ant-design/blob/master/components/form/hooks/useVariants.ts
 */
export default function useVariant<T extends string = Variant>(
  component: VariantComponent,
  variant: ComputedRef<T | undefined>,
  legacyBordered?: ComputedRef<boolean | undefined> | VariantOptions<readonly T[]>,
  fallbackComponent?: VariantComponent,
): [ComputedRef<T>, ComputedRef<boolean>] {
  const configProvider = inject(configProviderKey, defaultConfigProvider);
  const ctxVariant = useInjectFormVariant();
  const isOptions =
    legacyBordered &&
    typeof legacyBordered === 'object' &&
    'variants' in legacyBordered &&
    'defaultVariant' in legacyBordered;
  const options = isOptions
    ? (legacyBordered as VariantOptions<readonly T[]>)
    : (COMPONENT_OWN_VARIANTS[component] as VariantOptions<readonly T[]> | undefined);
  const borderedRef = isOptions
    ? undefined
    : (legacyBordered as ComputedRef<boolean | undefined> | undefined);
  const resolvedFallback = fallbackComponent ?? DEFAULT_FALLBACK_COMPONENT[component];

  const configComponentVariant = computed<T | undefined>(() => {
    const componentConfig = (configProvider as any)[component]?.value;
    if (componentConfig?.variant !== undefined) {
      return componentConfig.variant;
    }
    if (resolvedFallback) {
      const fallbackConfig = (configProvider as any)[resolvedFallback]?.value;
      if (fallbackConfig?.variant !== undefined) {
        return fallbackConfig.variant;
      }
    }
    return undefined;
  });

  const supportedVariants = (options?.variants ?? Variants) as readonly string[];
  const defaultVariant = (options?.defaultVariant ?? 'outlined') as T;

  const mergedVariant = computed<T>(() => {
    if (variant.value !== undefined) return variant.value;
    if (borderedRef?.value === false) return 'borderless' as T;
    if (!options && ctxVariant.value !== undefined) return ctxVariant.value as T;
    if (configComponentVariant.value !== undefined) return configComponentVariant.value;
    const globalVariant = configProvider.variant?.value;
    if (globalVariant !== undefined && supportedVariants.includes(globalVariant)) {
      return globalVariant as T;
    }
    return defaultVariant;
  });

  const enableVariantCls = computed(() => supportedVariants.includes(mergedVariant.value));

  return [mergedVariant, enableVariantCls];
}
