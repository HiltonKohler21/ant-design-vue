import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide } from 'vue';
import type { BreadcrumbSemanticClassNames, BreadcrumbSemanticStyles } from './Breadcrumb';

export interface BreadcrumbContextProps {
  classNames: ComputedRef<BreadcrumbSemanticClassNames>;
  styles: ComputedRef<BreadcrumbSemanticStyles>;
}

export const BreadcrumbContextKey: InjectionKey<BreadcrumbContextProps> =
  Symbol('BreadcrumbContextKey');

export const useProvideBreadcrumb = (value: BreadcrumbContextProps) => {
  provide(BreadcrumbContextKey, value);
};

export const useInjectBreadcrumb = () => {
  return inject(BreadcrumbContextKey, {
    classNames: computed<BreadcrumbSemanticClassNames>(() => ({})),
    styles: computed<BreadcrumbSemanticStyles>(() => ({})),
  });
};
