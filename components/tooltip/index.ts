import type { App, Plugin } from 'vue';
import ToolTip, { tooltipProps } from './Tooltip';
import UniqueProvider from './UniqueProvider';
import PurePanel from './PurePanel';

export type {
  TooltipProps,
  TooltipRef,
  AdjustOverflow,
  PlacementsConfig,
  TooltipAlignConfig,
  TooltipPlacement,
  TooltipSemanticName,
  TooltipSemanticClassNames,
  TooltipSemanticStyles,
  TooltipClassNamesType,
  TooltipStylesType,
} from './Tooltip';
export type { TooltipUniqueProviderProps } from './UniqueProvider';
export type { PurePanelProps as TooltipPurePanelProps } from './PurePanel';

export { tooltipProps, UniqueProvider as TooltipUniqueProvider };

const Tooltip = ToolTip as typeof ToolTip &
  Plugin & {
    readonly UniqueProvider: typeof UniqueProvider;
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };

(Tooltip as any).UniqueProvider = UniqueProvider;
(Tooltip as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

Tooltip.install = function (app: App) {
  app.component(ToolTip.name, ToolTip);
  app.component(UniqueProvider.name, UniqueProvider);
  return app;
};

export default Tooltip;
