import type { App, Plugin } from 'vue';
import Splitter from './Splitter';
import Panel from './Panel';

export type { SplitterProps, PanelProps } from './interface';

Splitter.Panel = Panel;

/* istanbul ignore next */
Splitter.install = function (app: App) {
  app.component(Splitter.name, Splitter);
  app.component(Panel.name, Panel);
  return app;
};

export { Panel };

export default Splitter as typeof Splitter &
  Plugin & {
    readonly Panel: typeof Panel;
  };
