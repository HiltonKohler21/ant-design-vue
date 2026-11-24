import type { Ref, InjectionKey } from 'vue';
import { inject, provide, ref } from 'vue';

import type {
  FloatButtonSemanticClassNames,
  FloatButtonSemanticStyles,
  FloatButtonShape,
} from './interface';

export interface FloatButtonGroupContext {
  shape: Ref<FloatButtonShape | undefined>;
  classNames?: Ref<FloatButtonSemanticClassNames | undefined>;
  styles?: Ref<FloatButtonSemanticStyles | undefined>;
}
const contextKey: InjectionKey<FloatButtonGroupContext> = Symbol('floatButtonGroupContext');

export const useProvideFloatButtonGroupContext = (props: FloatButtonGroupContext) => {
  provide(contextKey, props);

  return props;
};

export const useInjectFloatButtonGroupContext = () => {
  return inject(contextKey, { shape: ref() } as FloatButtonGroupContext);
};
