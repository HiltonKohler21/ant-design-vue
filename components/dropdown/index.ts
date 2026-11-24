import type { App, Plugin } from 'vue';
import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';
import PurePanel from './PurePanel';
import { dropdownProps, dropdownButtonProps } from './props';
export type { DropdownProps } from './dropdown';
export type { DropdownButtonProps } from './dropdown-button';
export type { PurePanelProps as DropdownPurePanelProps } from './PurePanel';
export type {
  DropdownPlacement,
  DropdownSemanticName,
  DropdownSemanticClassNames,
  DropdownSemanticStyles,
  DropdownClassNamesType,
  DropdownStylesType,
  DropdownMenuProps,
} from './props';

Dropdown.Button = DropdownButton;
(Dropdown as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

/* istanbul ignore next */
Dropdown.install = function (app: App) {
  app.component(Dropdown.name, Dropdown);
  app.component(DropdownButton.name, DropdownButton);
  return app;
};

export { DropdownButton, dropdownProps, dropdownButtonProps };

export default Dropdown as typeof Dropdown &
  Plugin & {
    readonly Button: typeof DropdownButton;
    readonly _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  };
