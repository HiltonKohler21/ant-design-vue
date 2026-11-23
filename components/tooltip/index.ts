import type { App, Plugin } from 'vue';
import ToolTip, { tooltipProps } from './Tooltip';
import UniqueProvider from './UniqueProvider';

export type {
  TooltipProps,
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

export { tooltipProps, UniqueProvider as TooltipUniqueProvider };

const Tooltip = ToolTip as typeof ToolTip &
  Plugin & {
    readonly UniqueProvider: typeof UniqueProvider;
  };

(Tooltip as any).UniqueProvider = UniqueProvider;

Tooltip.install = function (app: App) {
  app.component(ToolTip.name, ToolTip);
  app.component(UniqueProvider.name, UniqueProvider);
  return app;
};

export default Tooltip;
