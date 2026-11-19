import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import type { Variant } from '../../config-provider/context';
import { configProviderKey, defaultConfigProvider, Variants } from '../../config-provider/context';

/** 支持 `variant` 的组件名（对应 ConfigProvider 上的同名配置项） */
export type VariantComponent =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'cascader'
  | 'treeSelect'
  | 'mentions'
  | 'autoComplete'
  | 'datePicker'
  | 'timePicker';

/**
 * 解析组件的视觉变体，兼容 antd 5.13 之前的 `bordered` 属性。
 *
 * 优先级：props.variant > props.bordered(false) > 组件级 ConfigProvider 配置 > 全局 ConfigProvider
 *
 * @see https://github.com/ant-design/ant-design/blob/master/components/form/hooks/useVariants.ts
 */
export default function useVariant(
  component: VariantComponent,
  variant: ComputedRef<Variant | undefined>,
  legacyBordered?: ComputedRef<boolean | undefined>,
): [ComputedRef<Variant>, ComputedRef<boolean>] {
  const configProvider = inject(configProviderKey, defaultConfigProvider);

  const configComponentVariant = computed<Variant | undefined>(() => {
    const componentConfig = (configProvider as any)[component]?.value;
    return componentConfig?.variant;
  });

  const mergedVariant = computed<Variant>(() => {
    if (variant.value !== undefined) return variant.value;
    if (legacyBordered?.value === false) return 'borderless';
    return configComponentVariant.value ?? configProvider.variant?.value ?? 'outlined';
  });

  const enableVariantCls = computed(() =>
    (Variants as readonly string[]).includes(mergedVariant.value),
  );

  return [mergedVariant, enableVariantCls];
}
