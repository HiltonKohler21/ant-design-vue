import type { Ref, InjectionKey, ComputedRef } from 'vue';
import type { AnchorDirection, AnchorSemanticClassNames, AnchorSemanticStyles } from './Anchor';
import { computed, inject, provide } from 'vue';

export interface AnchorContext {
  registerLink: (link: string, targetOffset?: number) => void;
  unregisterLink: (link: string) => void;
  activeLink: Ref<string>;
  scrollTo: (link: string, targetOffset?: number) => void;
  handleClick: (e: Event, info: { title: any; href: string }) => void;
  direction: ComputedRef<AnchorDirection>;
  classNames?: ComputedRef<AnchorSemanticClassNames>;
  styles?: ComputedRef<AnchorSemanticStyles>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function noop(..._any: any[]): any {}

export const AnchorContextKey: InjectionKey<AnchorContext> = Symbol('anchorContextKey');

const useProvideAnchor = (state: AnchorContext) => {
  provide(AnchorContextKey, state);
};

const useInjectAnchor = () => {
  return inject(AnchorContextKey, {
    registerLink: noop,
    unregisterLink: noop,
    scrollTo: noop,
    activeLink: computed(() => ''),
    handleClick: noop,
    direction: computed(() => 'vertical'),
    classNames: computed(() => ({})),
    styles: computed(() => ({})),
  } as AnchorContext);
};

export { useInjectAnchor, useProvideAnchor };
export default useProvideAnchor;
