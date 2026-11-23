/* eslint-disable import/no-unresolved,no-console,global-require,import/no-dynamic-require */

const chalk = require('chalk');
const VueServerRenderer = require('vue/server-renderer');

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const ProgressBar = require('progress');
const { statistic } = require('../components/theme/util/statistic');
const { DesignTokenProvider } = require('../components/theme/internal');
const seedTokenModule = require('../components/theme/themes/seed');
const seedToken = seedTokenModule.default ?? seedTokenModule;
const { defineComponent, ref, createVNode, createSSRApp } = require('vue');

console.log(chalk.green(`🔥 Collecting token statistics...`));

const EmptyElement = createVNode('div');

const styleFiles = [
  ...glob.sync(
    path
      .join(
        process.cwd(),
        'components/!(version|config-provider|icon|locale-provider|auto-complete|col|row|time-picker)/style/index.?(ts|tsx)',
      )
      .replace(/\\/g, '/'),
  ),
  ...glob.sync(
    path.join(process.cwd(), 'components/input/style/otp.?(ts|tsx)').replace(/\\/g, '/'),
  ),
];

const bar = new ProgressBar('🚀 Collecting by component: [:bar] :component (:current/:total)', {
  complete: '=',
  incomplete: ' ',
  total: styleFiles.length,
});

(async () => {
  for (const file of styleFiles) {
    const pathArr = file.split('/');
    const styleIndex = pathArr.lastIndexOf('style');
    const baseName = path.basename(file, path.extname(file));
    const componentName =
      baseName === 'index' ? pathArr[styleIndex - 1] : `${pathArr[styleIndex - 1]}/${baseName}`;
    bar.tick(1, { component: componentName });
    let useStyle = () => {};
    if (file.includes('grid')) {
      const { useColStyle, useRowStyle } = require(file);
      useStyle = prefixCls => {
        useRowStyle(prefixCls);
        useColStyle(prefixCls);
      };
    } else {
      useStyle = require(file).default;
    }
    const Component = defineComponent({
      setup() {
        useStyle(ref('file'), ref('file'));
        return () => EmptyElement;
      },
    });
    await VueServerRenderer.renderToString(
      createSSRApp({
        setup() {
          return () => createVNode(Component);
        },
      }),
    );
    // Render wireframe
    await VueServerRenderer.renderToString(
      createSSRApp({
        setup() {
          return () =>
            createVNode(
              DesignTokenProvider,
              { value: { token: { ...seedToken, wireframe: true } } },
              () => createVNode(Component),
            );
        },
      }),
    );
  }

  const tokenPath = `${process.cwd()}/components/version/token.json`;
  fs.writeJsonSync(tokenPath, statistic, 'utf8');

  console.log(chalk.green(`✅  Collected token statistics successfully, check it in`), tokenPath);
})();
