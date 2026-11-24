import type { App, Plugin } from 'vue';
import FloatButton from './FloatButton';
import FloatButtonGroup from './FloatButtonGroup';
import BackTop from './BackTop';
import PurePanel from './PurePanel';

import type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  FloatButtonGroupPlacement,
  FloatButtonSemanticName,
  FloatButtonSemanticClassNames,
  FloatButtonSemanticStyles,
  FloatButtonClassNamesType,
  FloatButtonStylesType,
  FloatButtonGroupSemanticName,
  FloatButtonGroupSemanticClassNames,
  FloatButtonGroupSemanticStyles,
  FloatButtonGroupClassNamesType,
  FloatButtonGroupStylesType,
  BackTopProps,
} from './interface';
import type { PurePanelProps } from './PurePanel';

import type { SizeType as FloatButtonSize } from '../config-provider';

export type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  FloatButtonGroupPlacement,
  FloatButtonSemanticName,
  FloatButtonSemanticClassNames,
  FloatButtonSemanticStyles,
  FloatButtonClassNamesType,
  FloatButtonStylesType,
  FloatButtonGroupSemanticName,
  FloatButtonGroupSemanticClassNames,
  FloatButtonGroupSemanticStyles,
  FloatButtonGroupClassNamesType,
  FloatButtonGroupStylesType,
  BackTopProps,
  FloatButtonSize,
  PurePanelProps,
};

FloatButton.Group = FloatButtonGroup;
FloatButton.BackTop = BackTop;
(FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

/* istanbul ignore next */
FloatButton.install = function (app: App) {
  app.component(FloatButton.name, FloatButton);
  app.component(FloatButtonGroup.name, FloatButtonGroup);
  app.component(BackTop.name, BackTop);
  return app;
};

export { FloatButtonGroup, BackTop, PurePanel };

export default FloatButton as typeof FloatButton &
  Plugin & {
    readonly Group: typeof FloatButtonGroup;
    readonly BackTop: typeof BackTop;
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
