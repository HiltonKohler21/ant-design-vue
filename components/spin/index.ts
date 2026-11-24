import type { App, Plugin } from 'vue';
import Spin, { setDefaultIndicator } from './Spin';

export type {
  SpinProps,
  SpinRef,
  SpinSize,
  SpinSemanticName,
  SpinSemanticClassNames,
  SpinSemanticStyles,
  SpinClassNamesType,
  SpinStylesType,
} from './Spin';
export { spinProps } from './Spin';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function (app: App) {
  app.component(Spin.name, Spin);
  return app;
};

export default Spin as typeof Spin &
  Plugin & {
    readonly setDefaultIndicator: typeof setDefaultIndicator;
  };
