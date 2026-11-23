import { createVueToMarkdownRenderFn } from './vueToMarkdown';
import type { MarkdownOptions } from '../md/markdown/markdown';
import type { Plugin } from 'vite';
import { createMarkdownToVueRenderFn } from '../md/markdownToVue';

export interface DemoMeta {
  debug: boolean;
  sectionId: string;
  title: { 'zh-CN'?: string; 'en-US'?: string } | string;
  version?: string;
}

interface Options {
  root?: string;
  markdown?: MarkdownOptions;
}

const normalizeId = (id: string): string => id.split('?')[0].replace(/\\/g, '/');

const isComponentDemoFile = (cleanId: string): boolean =>
  cleanId.endsWith('.vue') && cleanId.includes('/demo/') && cleanId.indexOf('index.vue') === -1;

const extractDemoMeta = (frontmatter: Record<string, any> = {}, relativePath = ''): DemoMeta => {
  const sectionId = relativePath.split('/').join('-').replace('.vue', '').toLocaleLowerCase();
  const rawTitle = frontmatter.title;
  const title: DemoMeta['title'] =
    rawTitle && typeof rawTitle === 'object'
      ? {
          ...(rawTitle['zh-CN'] != null ? { 'zh-CN': String(rawTitle['zh-CN']) } : {}),
          ...(rawTitle['en-US'] != null ? { 'en-US': String(rawTitle['en-US']) } : {}),
        }
      : typeof rawTitle === 'string'
      ? rawTitle
      : '';
  const meta: DemoMeta = {
    debug: Boolean(frontmatter.debug),
    sectionId,
    title,
  };
  if (frontmatter.version != null && frontmatter.version !== '') {
    meta.version = String(frontmatter.version);
  }
  return meta;
};

export default (options: Options = {}): Plugin[] => {
  const { root, markdown } = options;
  const vueToMarkdown = createVueToMarkdownRenderFn(root);
  const markdownToVue = createMarkdownToVueRenderFn(root, markdown);
  const demoMetaMap = new Map<string, DemoMeta>();

  return [
    {
      name: 'vueToMdToVue',
      async transform(code, id) {
        if (id.includes('?')) return;
        const cleanId = normalizeId(id);
        const isDemo = isComponentDemoFile(cleanId);
        if (isDemo || cleanId.includes('/examples/App.vue')) {
          const res = vueToMarkdown(code, id);
          if (res.ignore) {
            if (isDemo) {
              demoMetaMap.delete(cleanId);
            }
            return {
              code: res.vueSrc,
              map: null,
            };
          }
          // transform .md files into vueSrc so plugin-vue can handle it
          const compiled = await markdownToVue(res.vueSrc, id);
          if (isDemo) {
            demoMetaMap.set(
              cleanId,
              extractDemoMeta(compiled.pageData?.frontmatter, compiled.pageData?.relativePath),
            );
          }
          return {
            code: compiled.vueSrc,
            map: null,
          };
        }
      },
    },
    {
      name: 'vueDemoMetaPost',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('?')) return;
        const cleanId = normalizeId(id);
        const meta = demoMetaMap.get(cleanId);
        if (!meta) return;

        // Match the last line-anchored `export default ` so embedded demo source strings
        // inside render functions are never touched.
        const exportDefaultRe = /^[ \t]*export\s+default\s+/gm;
        let lastMatch: RegExpExecArray | null = null;
        let match = exportDefaultRe.exec(code);
        while (match) {
          lastMatch = match;
          match = exportDefaultRe.exec(code);
        }
        if (!lastMatch || lastMatch.index === undefined) return;

        const start = lastMatch.index;
        const end = start + lastMatch[0].length;
        const serializedMeta = JSON.stringify(meta);
        const patched =
          `${code.slice(0, start)}const __antdv_demo_sfc = ${code.slice(end)}` +
          `\n__antdv_demo_sfc.__demoMeta = ${serializedMeta};\nexport default __antdv_demo_sfc;\n`;
        return {
          code: patched,
          map: null,
        };
      },
    },
  ];
};
