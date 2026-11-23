import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import md from '../plugin/md';
import docs from '../plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';

const REPO_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.resolve(REPO_ROOT, 'components');
const DEV_LIB_SCHEMA_VERSION = 'v5';
const NODE_MODULES_RE = /(?:^|[/\\])node_modules(?:[/\\]|$)/i;

/**
 * Runtime subpaths inside `components/` imported by `site/src` or `components/<name>/demo`.
 * Built together with `splitting: true` so every Vue InjectionKey / Symbol singleton
 * (`configProviderKey`, `DesignTokenContextKey`, `StyleContextKey`, etc.) is shared across
 * the entire site and all 75 component demo pages.
 */
const DEV_LIB_ENTRIES: Record<string, string> = {
  index: 'components/index.ts',
  'config-provider/context': 'components/config-provider/context.ts',
  'config-provider/hooks/useConfigInject': 'components/config-provider/hooks/useConfigInject.ts',
  '_util/cssinjs': 'components/_util/cssinjs/index.ts',
  'theme/internal': 'components/theme/internal.ts',
  'theme/themes/default': 'components/theme/themes/default/index.ts',
  'theme/themes/seed': 'components/theme/themes/seed.ts',
  'theme/util/alias': 'components/theme/util/alias.ts',
  'locale/en_US': 'components/locale/en_US.ts',
  'locale/zh_CN': 'components/locale/zh_CN.ts',
  'segmented/src/segmented': 'components/segmented/src/segmented.tsx',
};

/**
 * Huge multi-hundred-file ESM packages (`@ant-design/icons-vue` ~1,578 files, `lodash-es` ~640 files)
 * that Vite 3's JS `esbuildDepPlugin` takes ~25s to pre-bundle on Windows, whereas native esbuild
 * bundles them alongside `components/` in <400ms while sharing external `vue`.
 */
const DEV_VENDOR_ENTRIES: Record<string, string> = {
  'vendor/icons-vue': '@ant-design/icons-vue',
  'vendor/lodash-es': 'lodash-es',
};

const EXTERNAL_SHIMS: Record<string, { file: string; code: string }> = {
  vue: {
    file: '_ext-vue.js',
    code: `export * from 'vue';\n`,
  },
  dayjs: {
    file: '_ext-dayjs.js',
    code: `export { default } from 'dayjs';\nexport * from 'dayjs';\n`,
  },
  '@ctrl/tinycolor': {
    file: '_ext-tinycolor.js',
    code: `export * from '@ctrl/tinycolor';\n`,
  },
};

const EXTERNAL_PACKAGES = new Set(Object.keys(EXTERNAL_SHIMS));

const SKIP_DIRS = new Set(['demo', '__tests__', '__snapshots__', 'node_modules']);

function normalizeFsPath(p: string): string {
  const normalized = path.resolve(p).replace(/\\/g, '/');
  return process.platform === 'win32'
    ? normalized.replace(/^[A-Z]:/, m => m.toLowerCase())
    : normalized;
}

function computeComponentsFingerprint(targetDir: string): string {
  const hash = crypto.createHash('md5');
  hash.update(DEV_LIB_SCHEMA_VERSION);
  hash.update('\n');
  hash.update(normalizeFsPath(targetDir));
  hash.update('\n');
  const items: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) {
          walk(path.join(dir, entry.name));
        }
        continue;
      }
      if (!/\.(?:[jt]sx?|json)$/.test(entry.name)) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      const stat = fs.statSync(fullPath);
      const rel = path.relative(COMPONENTS_DIR, fullPath).replace(/\\/g, '/');
      items.push(`${rel}:${stat.size}:${Math.trunc(stat.mtimeMs)}`);
    }
  }

  walk(COMPONENTS_DIR);
  items.sort();
  for (const item of items) {
    hash.update(item);
    hash.update('\n');
  }
  return hash.digest('hex');
}

function resolvePkgEsmEntry(pkgName: string): string {
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`, { paths: [REPO_ROOT] });
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  return path.resolve(path.dirname(pkgJsonPath), pkg.module || pkg.main || 'index.js');
}

function ensureWritableOutDir(primaryDir: string): string {
  if (!NODE_MODULES_RE.test(primaryDir)) {
    try {
      fs.mkdirSync(primaryDir, { recursive: true });
      const probe = path.join(primaryDir, `.write-probe-${process.pid}`);
      fs.writeFileSync(probe, 'ok');
      fs.unlinkSync(probe);
      return primaryDir;
    } catch {
      // fall through to os.tmpdir() fallback
    }
  }
  const repoHash = crypto
    .createHash('md5')
    .update(normalizeFsPath(REPO_ROOT))
    .digest('hex')
    .slice(0, 10);
  const fallback = path.join(os.tmpdir(), `antdv-dev-lib-${repoHash}`);
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

function devAntdBundlePlugin(): Plugin {
  const useRawSrc = process.env.SITE_RAW_SRC === '1';
  const componentsRootNorm = normalizeFsPath(COMPONENTS_DIR);
  const babelCache = new Map<string, { mtimeMs: number; size: number; code: string }>();

  let outDir = '';
  let outDirNorm = '';
  let active = false;
  let buildPromise: Promise<void> | null = null;
  let esbuildMod: any = null;
  let esModuleLexer: any = null;
  let babelCore: any = null;
  let vueJsxPluginPath = '';
  let tsPluginPath = '';

  function getBuildTools() {
    if (!esbuildMod) {
      // Prefer Vite's newer nested esbuild (supports code splitting & modern ESM)
      const viteDir = path.dirname(require.resolve('vite'));
      const esbuildPath = require.resolve('esbuild', { paths: [viteDir] });
      const lexerPath = require.resolve('es-module-lexer', { paths: [viteDir] });
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      esbuildMod = require(esbuildPath);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      esModuleLexer = require(lexerPath);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      babelCore = require('@babel/core');
      vueJsxPluginPath = require.resolve('@vue/babel-plugin-jsx');
      tsPluginPath = require.resolve('@babel/plugin-transform-typescript');
    }
    return {
      esbuild: esbuildMod,
      lexer: esModuleLexer,
      babel: babelCore,
      vueJsxPluginPath,
      tsPluginPath,
    };
  }

  async function runDevBuild(targetDir: string, force = false): Promise<void> {
    if (buildPromise) {
      return buildPromise;
    }
    buildPromise = (async () => {
      const manifestPath = path.join(targetDir, '.manifest.json');
      const indexPath = path.join(targetDir, 'index.js');
      const fingerprint = computeComponentsFingerprint(targetDir);

      if (!force && fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          if (manifest.fingerprint === fingerprint) {
            return;
          }
        } catch {
          // Rebuild on corrupt manifest
        }
      }

      const {
        esbuild,
        lexer,
        babel,
        vueJsxPluginPath: jsxPlugin,
        tsPluginPath: tsPlugin,
      } = getBuildTools();

      // Remove stale chunk files before rebuilding
      if (fs.existsSync(targetDir)) {
        for (const name of fs.readdirSync(targetDir)) {
          if (/^chunk-.*\.js$/.test(name)) {
            try {
              fs.unlinkSync(path.join(targetDir, name));
            } catch {
              // ignore cleanup errors
            }
          }
        }
      }

      const entryPoints: Record<string, string> = {};
      for (const [key, rel] of Object.entries(DEV_LIB_ENTRIES)) {
        entryPoints[key] = path.resolve(REPO_ROOT, rel);
      }
      for (const [key, pkg] of Object.entries(DEV_VENDOR_ENTRIES)) {
        entryPoints[key] = resolvePkgEsmEntry(pkg);
      }

      const iconsEntry = entryPoints['vendor/icons-vue'];
      const lodashEntry = entryPoints['vendor/lodash-es'];
      const targetDirPosix = targetDir.replace(/\\/g, '/');

      // Emit tiny external-dep proxy modules so large pre-built chunks only import canonical
      // `/@fs/...` URLs and skip MagicString hires sourcemap generation in Vite's import-analysis.
      for (const shim of Object.values(EXTERNAL_SHIMS)) {
        fs.writeFileSync(path.join(targetDir, shim.file), shim.code, 'utf8');
      }

      await esbuild.build({
        absWorkingDir: REPO_ROOT,
        entryPoints,
        outdir: targetDir,
        bundle: true,
        splitting: true,
        format: 'esm',
        platform: 'browser',
        target: 'es2020',
        minifyWhitespace: true,
        minifySyntax: true,
        define: {
          'process.env.NODE_ENV': '"development"',
        },
        plugins: [
          {
            name: 'antdv-dev-externals',
            setup(build: any) {
              build.onResolve(
                { filter: /^@ant-design\/icons-vue\/([A-Za-z0-9_]+)$/ },
                (args: any) => ({
                  path: args.path,
                  namespace: 'antdv-icon-shim',
                }),
              );
              build.onLoad({ filter: /.*/, namespace: 'antdv-icon-shim' }, (args: any) => {
                const iconName = args.path.slice('@ant-design/icons-vue/'.length);
                return {
                  contents: `export { ${iconName} as default } from '@ant-design/icons-vue';`,
                  loader: 'js',
                  resolveDir: REPO_ROOT,
                };
              });

              build.onResolve({ filter: /^lodash-es\/([A-Za-z0-9_]+)$/ }, (args: any) => ({
                path: args.path,
                namespace: 'antdv-lodash-shim',
              }));
              build.onLoad({ filter: /.*/, namespace: 'antdv-lodash-shim' }, (args: any) => {
                const fnName = args.path.slice('lodash-es/'.length);
                return {
                  contents: `export { ${fnName} as default } from 'lodash-es';`,
                  loader: 'js',
                  resolveDir: REPO_ROOT,
                };
              });

              build.onResolve({ filter: /^[^./]/ }, (args: any) => {
                if (path.isAbsolute(args.path)) {
                  return null;
                }
                if (args.path === 'ant-design-vue') {
                  return { path: path.resolve(COMPONENTS_DIR, 'index.ts') };
                }
                if (args.path.startsWith('ant-design-vue/es/')) {
                  return {
                    path: path.resolve(
                      COMPONENTS_DIR,
                      args.path.slice('ant-design-vue/es/'.length),
                    ),
                  };
                }
                if (args.path === '@ant-design/icons-vue') {
                  return { path: iconsEntry };
                }
                if (args.path === 'lodash-es') {
                  return { path: lodashEntry };
                }
                const shim = EXTERNAL_SHIMS[args.path];
                if (shim) {
                  return { path: `/@fs/${targetDirPosix}/${shim.file}`, external: true };
                }
                return null;
              });
            },
          },
          {
            name: 'antdv-vue-jsx',
            setup(build: any) {
              build.onLoad({ filter: /\.[jt]sx$/ }, async (args: any) => {
                const stat = await fs.promises.stat(args.path);
                const cached = babelCache.get(args.path);
                if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
                  return { contents: cached.code, loader: 'js' };
                }
                const src = await fs.promises.readFile(args.path, 'utf8');
                const plugins: any[] = [
                  [jsxPlugin, { mergeProps: false, enableObjectSlots: false }],
                ];
                if (args.path.endsWith('.tsx')) {
                  plugins.push([tsPlugin, { isTSX: true, allowExtensions: true }]);
                }
                const transformed = babel.transformSync(src, {
                  filename: args.path,
                  babelrc: false,
                  configFile: false,
                  sourceMaps: false,
                  plugins,
                });
                const code = transformed?.code || '';
                babelCache.set(args.path, { mtimeMs: stat.mtimeMs, size: stat.size, code });
                return { contents: code, loader: 'js' };
              });
            },
          },
        ],
      });

      // Coalesce duplicate external/chunk import statements (esbuild emits one `import` per source
      // module for externals — e.g. 796 separate `vue` imports in icons-vue and ~600 in components,
      // which makes Vite's import-analysis run ~1,400 sequential resolves) AND canonicalize relative
      // chunk specifiers to `/@fs/...` so Vite's import-analysis skips MagicString sourcemap gen.
      await lexer.init;
      const optimizeBundleImports = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            optimizeBundleImports(full);
            continue;
          }
          if (!entry.name.endsWith('.js') || entry.name.startsWith('_ext-')) {
            continue;
          }
          const raw = fs.readFileSync(full, 'utf8');
          const [imports] = lexer.parse(raw);
          if (!imports.length) {
            continue;
          }
          const namedByUrl = new Map<string, string[]>();
          const extraByUrl = new Set<string>();
          const extraStmts: string[] = [];
          const removals: Array<[number, number]> = [];

          for (const imp of imports) {
            // Only rewrite static `import ...` statements (not `export ... from` or dynamic `import()`)
            if (imp.d !== -1) continue;
            const stmt = raw.slice(imp.ss, imp.se).trim();
            if (!stmt.startsWith('import')) continue;
            const origSpec = imp.n;
            if (!origSpec) continue;
            const targetUrl =
              origSpec.startsWith('./') || origSpec.startsWith('../')
                ? `/@fs/${path.resolve(dir, origSpec).replace(/\\/g, '/')}`
                : origSpec;

            let endIdx = imp.se;
            while (
              endIdx < raw.length &&
              (raw[endIdx] === ';' || raw[endIdx] === '\r' || raw[endIdx] === '\n')
            ) {
              endIdx++;
            }

            const clause = raw.slice(imp.ss + 'import'.length, imp.s).trim();
            // Strip trailing `from` and opening quote
            const fromIdx = clause.lastIndexOf('from');
            if (fromIdx === -1) {
              // Side-effect import: `import "..."`
              removals.push([imp.ss, endIdx]);
              const key = `side:${targetUrl}`;
              if (!extraByUrl.has(key)) {
                extraByUrl.add(key);
                extraStmts.push(`import "${targetUrl}";`);
              }
              continue;
            }
            const binding = clause.slice(0, fromIdx).trim();
            if (binding.startsWith('*')) {
              removals.push([imp.ss, endIdx]);
              const key = `ns:${binding}:${targetUrl}`;
              if (!extraByUrl.has(key)) {
                extraByUrl.add(key);
                extraStmts.push(`import ${binding} from "${targetUrl}";`);
              }
              continue;
            }

            const list = namedByUrl.get(targetUrl) || [];
            namedByUrl.set(targetUrl, list);
            if (binding.startsWith('{') && binding.endsWith('}')) {
              const inner = binding.slice(1, -1).trim();
              if (inner) list.push(inner);
            } else if (binding.includes('{')) {
              const braceIdx = binding.indexOf('{');
              const defName = binding.slice(0, braceIdx).replace(/,\s*$/, '').trim();
              const inner = binding.slice(braceIdx + 1, binding.lastIndexOf('}')).trim();
              if (defName) list.push(`default as ${defName}`);
              if (inner) list.push(inner);
            } else if (binding) {
              list.push(`default as ${binding}`);
            }
            removals.push([imp.ss, endIdx]);
          }

          if (!removals.length) {
            continue;
          }

          // Rebuild file: coalesced imports at top + remaining body with removed spans excised
          const headerLines: string[] = [];
          for (const [url, specs] of namedByUrl.entries()) {
            const joined = specs.join(',');
            headerLines.push(joined ? `import{${joined}}from "${url}";` : `import "${url}";`);
          }
          headerLines.push(...extraStmts);

          let out = `${headerLines.join('\n')}\n`;
          let cursor = 0;
          for (const [start, end] of removals) {
            if (start > cursor) {
              out += raw.slice(cursor, start);
            }
            cursor = Math.max(cursor, end);
          }
          if (cursor < raw.length) {
            out += raw.slice(cursor);
          }
          fs.writeFileSync(full, out, 'utf8');
        }
      };
      optimizeBundleImports(targetDir);

      fs.writeFileSync(
        manifestPath,
        JSON.stringify({ schema: DEV_LIB_SCHEMA_VERSION, fingerprint }),
        'utf8',
      );
    })();

    try {
      await buildPromise;
    } finally {
      buildPromise = null;
    }
  }

  function matchDevEntryFromAbsPath(absPath: string): string | null {
    const norm = normalizeFsPath(absPath);
    if (
      norm === componentsRootNorm ||
      norm === `${componentsRootNorm}/index` ||
      norm === `${componentsRootNorm}/index.ts`
    ) {
      return path.join(outDir, 'index.js').replace(/\\/g, '/');
    }
    if (!norm.startsWith(`${componentsRootNorm}/`)) {
      return null;
    }
    let rel = norm.slice(componentsRootNorm.length + 1);
    rel = rel.replace(/\/index\.[jt]sx?$/, '').replace(/\.[jt]sx?$/, '');
    if (Object.prototype.hasOwnProperty.call(DEV_LIB_ENTRIES, rel)) {
      return path.join(outDir, `${rel}.js`).replace(/\\/g, '/');
    }
    return null;
  }

  return {
    name: 'antdv-dev-lib',
    enforce: 'pre',
    async config(userConfig, { command }) {
      const baseAliases = [
        {
          find: 'vue',
          replacement:
            process.env.NODE_ENV === 'production'
              ? 'vue/dist/vue.runtime.esm-browser.prod.js'
              : 'vue/dist/vue.esm-bundler.js',
        },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ];

      if (command !== 'serve' || useRawSrc) {
        active = false;
        return {
          resolve: {
            alias: [
              ...baseAliases,
              { find: 'ant-design-vue/es', replacement: COMPONENTS_DIR },
              { find: 'ant-design-vue', replacement: COMPONENTS_DIR },
            ],
          },
          ...(command === 'serve'
            ? {
                optimizeDeps: {
                  include: ['@ant-design/icons-vue', 'lodash-es'],
                },
              }
            : {}),
        };
      }

      active = true;
      // Never place antdv-dev-lib inside node_modules/ — Vite's preAliasPlugin / dep optimizer
      // treats resolved paths containing `node_modules` as npm deps to pre-bundle with esbuild,
      // which cannot resolve the `/@fs/...` URLs emitted inside antdv-dev-lib bundles.
      const configuredCacheDir = userConfig.cacheDir
        ? path.resolve(userConfig.root || __dirname, userConfig.cacheDir)
        : '';
      const primaryOutDir =
        configuredCacheDir && !NODE_MODULES_RE.test(configuredCacheDir)
          ? path.join(configuredCacheDir, 'antdv-dev-lib')
          : path.resolve(REPO_ROOT, '.cache/antdv-dev-lib');
      outDir = ensureWritableOutDir(primaryOutDir);
      outDirNorm = normalizeFsPath(outDir);

      // Clean up legacy stale cache directory inside node_modules/.vite from earlier versions
      const legacyOutDir = path.resolve(REPO_ROOT, 'node_modules/.vite/antdv-dev-lib');
      if (normalizeFsPath(legacyOutDir) !== outDirNorm && fs.existsSync(legacyOutDir)) {
        try {
          fs.rmSync(legacyOutDir, { recursive: true, force: true });
        } catch {
          // ignore cleanup errors
        }
      }

      await runDevBuild(outDir);

      const entryKeys = Object.keys(DEV_LIB_ENTRIES).filter(k => k !== 'index');
      const entryAliases = entryKeys.map(key => ({
        find: new RegExp(`^ant-design-vue/es/${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
        replacement: path.join(outDir, `${key}.js`),
      }));
      const devLibExcludes = [
        'ant-design-vue',
        'ant-design-vue/es',
        ...entryKeys.map(key => `ant-design-vue/es/${key}`),
        ...Object.values(DEV_VENDOR_ENTRIES),
      ];

      const existingAllow = userConfig.server?.fs?.allow || [];

      return {
        resolve: {
          alias: [
            ...baseAliases,
            { find: /^ant-design-vue$/, replacement: path.join(outDir, 'index.js') },
            {
              find: /^@ant-design\/icons-vue$/,
              replacement: path.join(outDir, 'vendor/icons-vue.js'),
            },
            { find: /^lodash-es$/, replacement: path.join(outDir, 'vendor/lodash-es.js') },
            ...entryAliases,
            { find: 'ant-design-vue/es', replacement: COMPONENTS_DIR },
            { find: 'ant-design-vue', replacement: COMPONENTS_DIR },
          ],
        },
        css: {
          // Skip heavy autoprefixer/browserslist init (~2.4s) during local dev; production build keeps postcss.config.js
          postcss: {
            plugins: [],
          },
        },
        optimizeDeps: {
          exclude: devLibExcludes,
          esbuildOptions: {
            nodePaths: [path.join(REPO_ROOT, 'node_modules')],
          },
        },
        server: {
          fs: {
            allow: [...existingAllow, REPO_ROOT, outDir],
          },
        },
      };
    },
    configResolved(config: ResolvedConfig) {
      if (!active) return;
      // Ensure outDir stays allowed even if another plugin modified server.fs.allow
      if (config.server?.fs?.allow && !config.server.fs.allow.includes(outDir)) {
        config.server.fs.allow.push(outDir);
      }
    },
    async resolveId(source, importer, options) {
      if (!active || !importer) {
        return null;
      }
      const cleanImporter = normalizeFsPath(importer.split('?')[0]);
      // Resolve external bare deps imported from outDir (which may live in os.tmpdir()) against REPO_ROOT
      if (cleanImporter.startsWith(`${outDirNorm}/`)) {
        if (EXTERNAL_PACKAGES.has(source)) {
          return this.resolve(source, path.join(REPO_ROOT, 'site/src/main.js'), { skipSelf: true });
        }
        return null;
      }
      if (cleanImporter.startsWith(`${componentsRootNorm}/`) && !cleanImporter.includes('/demo/')) {
        return null;
      }

      let devTarget: string | null = null;
      if (source === 'ant-design-vue') {
        devTarget = path.join(outDir, 'index.js').replace(/\\/g, '/');
      } else if (source.startsWith('ant-design-vue/es/')) {
        const sub = source.slice('ant-design-vue/es/'.length).replace(/\.[jt]sx?$/, '');
        if (Object.prototype.hasOwnProperty.call(DEV_LIB_ENTRIES, sub)) {
          devTarget = path.join(outDir, `${sub}.js`).replace(/\\/g, '/');
        }
      } else if (source.startsWith('.')) {
        const resolved = path.resolve(path.dirname(importer.split('?')[0]), source);
        devTarget = matchDevEntryFromAbsPath(resolved);
      }

      if (!devTarget) {
        return null;
      }
      // During Vite's esbuild dep-scan phase, never hand outDir bundles (which contain `/@fs/...`
      // URLs) to esbuild; mark them as virtual/external so the scanner skips crawling them.
      if (options && (options as { scan?: boolean }).scan) {
        return `\0antdv-dev-lib-scan:${devTarget}`;
      }
      return devTarget;
    },
    configureServer(server) {
      if (!active) {
        return;
      }
      let rebuildTimer: ReturnType<typeof setTimeout> | null = null;
      const onComponentChange = (changedFile: string) => {
        const norm = normalizeFsPath(changedFile);
        if (!norm.startsWith(`${componentsRootNorm}/`)) return;
        if (
          norm.includes('/demo/') ||
          norm.includes('/__tests__/') ||
          !/\.(?:[jt]sx?|json)$/.test(norm)
        ) {
          return;
        }
        if (rebuildTimer) clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(async () => {
          try {
            await runDevBuild(outDir, true);
            for (const [id, mod] of server.moduleGraph.idToModuleMap.entries()) {
              if (normalizeFsPath(id.split('?')[0]).startsWith(`${outDirNorm}/`)) {
                server.moduleGraph.invalidateModule(mod);
              }
            }
            server.ws.send({ type: 'full-reload' });
          } catch (err) {
            server.config.logger.error(`[antdv-dev-lib] rebuild failed: ${err}`);
          }
        }, 180);
      };
      server.watcher.on('change', onComponentChange);
      server.watcher.on('add', onComponentChange);
      server.watcher.on('unlink', onComponentChange);
    },
  };
}

/**
 * @type {import('vite').UserConfig}
 */
export default {
  server: {
    host: true,
  },
  plugins: [
    devAntdBundlePlugin(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
      mergeProps: false,
      enableObjectSlots: false,
    }),
    docs(),
    md(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
  optimizeDeps: {
    // Avoid crawling all 647 component demos & 276 theme-editor files on every cold start (~27s);
    // all site & demo runtime dependencies are listed explicitly in `include` below.
    entries: ['src/App.vue'],
    include: [
      'fetch-jsonp',
      'lodash-es/difference',
      'lodash',
      'dayjs',
      'dayjs/locale/zh-cn',
      'dayjs/plugin/relativeTime',
      'dayjs/plugin/isBetween',
      'vue',
      'vue-router',
      'vue-i18n',
      'nprogress',
      '@vueuse/core',
      'async-validator',
      '@ctrl/tinycolor',
      'resize-observer-polyfill',
      'axios',
      'vue-request',
      'umi-request',
      'marked',
      'prismjs',
      'tinycolor2',
      'codesandbox/lib/api/define',
      'vue-types',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'vue-i18n'],
          // 注意：cssinjs 已内联到 components/_util/cssinjs，不再是独立依赖
          'antd-vendor': ['@ant-design/icons-vue', 'dayjs'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // includePaths: ["node_modules/"],
      },
    },
  },
};
