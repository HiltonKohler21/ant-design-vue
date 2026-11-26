import { getParameters } from 'codesandbox/lib/api/define';
import packageInfo from '../../../package.json';

const SCRIPT_CLOSE = '</' + 'script>';

const FROM_IMPORT_RE =
  /(?:^|[\r\n;])[ \t]*import\s+(?:type\s+)?[^'";]+?\s+from\s+['"]([^'"]+)['"]/g;

const SIDE_EFFECT_IMPORT_RE = /(?:^|[\r\n;])[ \t]*import\s+['"]([^'"]+)['"]/g;

const DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const TS_SCRIPT_TAG_RE = /<script\b[^>]*\blang\s*=\s*['"]tsx?['"][^>]*>/i;

const TS_CONFIG_JSON = JSON.stringify(
  {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      module: 'ESNext',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'preserve',
      strict: false,
    },
    include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
  },
  undefined,
  2,
);

const ENV_DTS = `/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
`;

const VITE_CONFIG = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
`;

const SANDBOX_CONFIG_JSON = JSON.stringify(
  {
    template: 'node',
  },
  undefined,
  2,
);

function createIndexHtml(title: string, entryFile: string): string {
  const safeTitle = (title || 'Ant Design Vue Demo').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      body {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/${entryFile}">${SCRIPT_CLOSE}
  </body>
</html>
`;
}

function createAppVue(isTs: boolean): string {
  return `<template>
  <Demo />
</template>

<script setup${isTs ? ' lang="ts"' : ''}>
import Demo from './demo.vue';
${SCRIPT_CLOSE}
`;
}

const MAIN_ENTRY = `import { createApp } from 'vue';
import Antd from '@hiltonkohler21/ant-design-vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
`;

function normalizePackageName(specifier: string): string {
  const trimmed = specifier.trim();
  if (
    !trimmed ||
    trimmed.startsWith('.') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('virtual:')
  ) {
    return '';
  }
  if (trimmed.startsWith('@')) {
    const parts = trimmed.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : '';
  }
  return trimmed.split('/')[0];
}

export function isTypeScriptDemo(code: string): boolean {
  return TS_SCRIPT_TAG_RE.test(code || '');
}

export function getDeps(code: string): Record<string, string> {
  const knownDeps: Record<string, string> = {
    ...(packageInfo.dependencies || {}),
    ...(packageInfo.devDependencies || {}),
  };
  const result: Record<string, string> = {};
  const source = code || '';

  const collect = (regex: RegExp) => {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      const pkgName = normalizePackageName(match[1]);
      if (pkgName && !result[pkgName]) {
        result[pkgName] = knownDeps[pkgName] || 'latest';
      }
    }
  };

  collect(FROM_IMPORT_RE);
  collect(SIDE_EFFECT_IMPORT_RE);
  collect(DYNAMIC_IMPORT_RE);

  return result;
}

export type Meta = {
  title: string;
};

function buildOnlineDemoFiles(code: string, meta: Meta): Record<string, string> {
  const isTs = isTypeScriptDemo(code);
  const entryFile = isTs ? 'src/main.ts' : 'src/main.js';
  const viteConfigFile = isTs ? 'vite.config.ts' : 'vite.config.js';
  const title = meta?.title || `Ant Design Vue@${packageInfo.version} Demo`;

  const devDependencies: Record<string, string> = {
    '@vitejs/plugin-vue': '^5.1.4',
    vite: '^5.4.8',
    ...(isTs
      ? {
          typescript: '^5.6.2',
          'vue-tsc': '^2.1.6',
        }
      : {}),
  };

  const packageJson = JSON.stringify(
    {
      name: 'ant-design-vue-demo',
      private: true,
      version: '0.0.0',
      type: 'module',
      title,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        ...getDeps(code),
        vue: '^3.4.0',
        '@hiltonkohler21/ant-design-vue': packageInfo.version,
      },
      devDependencies,
    },
    undefined,
    2,
  );

  const files: Record<string, string> = {
    'package.json': packageJson,
    'index.html': createIndexHtml(title, entryFile),
    [viteConfigFile]: VITE_CONFIG,
    [entryFile]: MAIN_ENTRY,
    'src/App.vue': createAppVue(isTs),
    'src/demo.vue': code,
  };

  if (isTs) {
    files['tsconfig.json'] = TS_CONFIG_JSON;
    files['src/env.d.ts'] = ENV_DTS;
  }

  return files;
}

// CodeSandbox (Vite 5 + Vue 3 + TypeScript 5 + @hiltonkohler21/ant-design-vue@4.3.0)
export function getCodeSandboxParams(code: string, meta: Meta): string {
  const projectFiles = buildOnlineDemoFiles(code, meta);
  const files: Record<string, { content: string; isBinary: boolean }> = {
    'sandbox.config.json': {
      content: SANDBOX_CONFIG_JSON,
      isBinary: false,
    },
  };

  Object.entries(projectFiles).forEach(([filePath, content]) => {
    files[filePath] = { content, isBinary: false };
  });

  return getParameters({ files });
}

// StackBlitz POST form fields (supports both TS with tsconfig.json + src/main.ts and JS)
export function getStackBlitzParams(code: string, meta: Meta): Record<string, string> {
  const title = meta?.title || `Ant Design Vue@${packageInfo.version} Demo`;
  const projectFiles = buildOnlineDemoFiles(code, meta);
  const fields: Record<string, string> = {
    'project[title]': title,
    'project[description]': 'Ant Design Vue live demo',
    'project[template]': 'node',
  };

  Object.entries(projectFiles).forEach(([filePath, content]) => {
    fields[`project[files][${filePath}]`] = content;
  });

  return fields;
}
