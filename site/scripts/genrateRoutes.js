/* eslint-disable @typescript-eslint/no-var-requires */
const globby = require('globby');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function formatJsValue(value, indent = 4) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'string') {
      return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
    }
    return JSON.stringify(value);
  }
  const pad = ' '.repeat(indent);
  const nextPad = ' '.repeat(indent + 2);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const items = value.map(item => `${nextPad}${formatJsValue(item, indent + 2)},`);
    return `[\n${items.join('\n')}\n${pad}]`;
  }
  const entries = Object.entries(value);
  if (!entries.length) return '{}';
  const lines = entries.map(([key, val]) => {
    const formattedKey = IDENTIFIER_RE.test(key) ? key : formatJsValue(key, indent + 2);
    return `${nextPad}${formattedKey}: ${formatJsValue(val, indent + 2)},`;
  });
  return `{\n${lines.join('\n')}\n${pad}}`;
}

(async () => {
  const paths = (await globby('components/*/index.*.md')).sort();
  const components = {};

  paths.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const componentName = filePath.split('/')[1];

    const { data } = matter(content);
    components[componentName] = { ...components[componentName], ...data };
  });

  const routeEntries = Object.keys(components)
    .sort()
    .map(
      component => `  {
    path: '${component}:lang(-cn)?',
    meta: ${formatJsValue(components[component], 4)},
    component: () => import('../../../components/${component}/demo/index.vue'),
  },`,
    )
    .join('\n');

  const output = `export default [\n${routeEntries}\n];\n`;
  const targetPath = path.join(process.cwd(), 'site/src/router/demoRoutes.js');
  const existing = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf8') : null;
  if (existing !== output) {
    fs.writeFileSync(targetPath, output, 'utf8');
  }
})();
