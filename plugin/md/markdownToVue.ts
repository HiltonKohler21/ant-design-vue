import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import LRUCache from 'lru-cache';
import type { MarkdownOptions, MarkdownParsedData, MarkdownRenderer } from './markdown/markdown';
import { createMarkdownRenderer } from './markdown/markdown';
import { deeplyParseHeader } from './utils/parseHeader';
import type { PageData, HeadConfig } from '../shared';
import slash from 'slash';
import escapeHtml from 'escape-html';
import fetchCode from './utils/fetchCode';
import tsToJs from './utils/tsToJs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('vitepress:md');
const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 });

export interface MarkdownCompileResult {
  vueSrc: string;
  pageData: PageData;
}

export function createMarkdownToVueRenderFn(
  root: string = process.cwd(),
  options: MarkdownOptions = {},
) {
  const md = createMarkdownRenderer(options);

  return async (src: string, file: string): Promise<MarkdownCompileResult> => {
    const relativePath = slash(path.relative(root, file));

    const cacheKey = `${file}\0${src}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      debug(`[cache hit] ${relativePath}`);
      return cached;
    }

    const start = Date.now();

    const { content, data: frontmatter } = matter(src);
    // eslint-disable-next-line prefer-const
    let { html, data } = md.render(content);
    // avoid env variables being replaced by vite
    html = html
      .replace(/import\.meta/g, 'import.<wbr/>meta')
      .replace(/process\.env/g, 'process.<wbr/>env');
    // TODO validate data.links?
    const pageData: PageData = {
      title: inferTitle(frontmatter, content),
      description: inferDescription(frontmatter),
      frontmatter,
      headers: data.headers,
      relativePath,
      content: escapeHtml(content),
      html,
      // TODO use git timestamp?
      lastUpdated: Math.round(fs.statSync(file).mtimeMs),
    };
    const isComponentDemo =
      (file.endsWith('.vue') || relativePath.endsWith('.vue')) && !relativePath.includes('vueDocs');
    const newContent =
      data.vueCode && isComponentDemo
        ? await genComponentCode(md, data, pageData)
        : await genDocCode(pageData, data);

    debug(`[render] ${file} in ${Date.now() - start}ms.`);
    const result = {
      vueSrc: newContent?.trim(),
      pageData,
    };
    cache.set(cacheKey, result);
    return result;
  };
}

async function genComponentCode(md: MarkdownRenderer, data: PageData, pageData: PageData) {
  const { vueCode, headers = [] } = data as MarkdownParsedData;
  const cn = headers.find(h => h.title === 'zh-CN')?.content;
  const us = headers.find(h => h.title === 'en-US')?.content;
  let { html } = md.render(`\`\`\`vue
${vueCode?.trim()}
\`\`\``);
  html = html
    .replace(/import\.meta/g, 'import.<wbr/>meta')
    .replace(/process\.env/g, 'process.<wbr/>env');
  const template = fetchCode(vueCode, 'template');
  const script = fetchCode(vueCode, 'script');
  const style = fetchCode(vueCode, 'style');
  const scriptContent = fetchCode(vueCode, 'scriptContent');
  let jsCode = (await tsToJs(scriptContent))?.trim();
  const isScriptSetup = /<script\b[^>]*\bsetup\b/i.test(script);
  const jsScriptOpenTag = isScriptSetup ? '<script setup>' : '<script>';
  jsCode = jsCode
    ? `${jsScriptOpenTag}
${jsCode}
</script>`
    : '';
  const jsSourceCode = `
${template}
${jsCode}
${style}
  `.trim();
  let { html: jsVersion } = md.render(`\`\`\`vue
${jsSourceCode}
\`\`\``);
  jsVersion = jsVersion
    .replace(/import\.meta/g, 'import.<wbr/>meta')
    .replace(/process\.env/g, 'process.<wbr/>env');

  const jsfiddle = escapeHtml(
    JSON.stringify({
      us,
      cn,
      docHtml: pageData.html.split('<pre class="language-vue" v-pre>')[0],
      ...pageData.frontmatter,
      relativePath: pageData.relativePath,
      // htmlCode: Buffer.from(html).toString('base64'),
      // jsVersionHtml: Buffer.from(jsVersion).toString('base64'),
      sourceCode: Buffer.from(vueCode).toString('base64'),
      jsSourceCode: Buffer.from(jsSourceCode).toString('base64'),
    }),
  );

  const newContent = `
    <template>
      <demo-box :jsfiddle="${jsfiddle}">
        ${template.replace('<template>', '<template v-slot:default>')}
        <template #htmlCode>${html}</template>
        <template #jsVersionHtml>${jsVersion}</template>
      </demo-box>
    </template>
    ${script}
    ${style}
    `;
  return newContent;
}

const DOC_COMPONENTS = [
  {
    name: 'ColorChunk',
    path: '@/components/ColorChunk',
    re: /<(?:ColorChunk|color-chunk)(?=[\s/>])/i,
  },
  {
    name: 'TokenTable',
    path: '@/components/TokenTable',
    re: /<(?:TokenTable|token-table)(?=[\s/>])/i,
  },
  {
    name: 'ComponentTokenTable',
    path: '@/components/ComponentTokenTable',
    re: /<(?:ComponentTokenTable|component-token-table)(?=[\s/>])/i,
  },
];

async function genDocCode(pageData: PageData, data: MarkdownParsedData) {
  const usedComponents = DOC_COMPONENTS.filter(({ re }) => re.test(pageData.html));
  const imports = usedComponents
    .map(({ name, path: compPath }) => `import ${name} from '${compPath}';`)
    .join('\n');
  const componentsBlock = usedComponents.length
    ? `    components: {\n        ${usedComponents
        .map(({ name }) => name)
        .join(',\n        ')}\n    },\n`
    : '';
  const hoistedStyles = (data?.hoistedTags || [])
    .filter(tag => /^<style(?=[\s>])/i.test(tag.trim()))
    .join('\n');
  return `
<template><article class="markdown">${pageData.html}</article></template>

<script>
${imports}
export default {
${componentsBlock}    pageData: ${JSON.stringify(pageData)}
}
</script>
${hoistedStyles}
`;
}

const inferTitle = (frontmatter: any, content: string) => {
  if (frontmatter.home) {
    return 'Home';
  }
  if (frontmatter.title) {
    if (typeof frontmatter.title === 'object') {
      return deeplyParseHeader(frontmatter.title['zh-CN'] || frontmatter.title['en-US'] || '');
    }
    return deeplyParseHeader(frontmatter.title);
  }
  const match = content.match(/^\s*#+\s+(.*)/m);
  if (match) {
    return deeplyParseHeader(match[1]?.trim());
  }
  return '';
};

const inferDescription = (frontmatter: Record<string, any>) => {
  if (!frontmatter.head) {
    return '';
  }

  return getHeadMetaContent(frontmatter.head, 'description') || '';
};

const getHeadMetaContent = (head: HeadConfig[], name: string): string | undefined => {
  if (!head || !head.length) {
    return undefined;
  }

  const meta = head.find(([tag, attrs = {}]) => {
    return tag === 'meta' && attrs.name === name && attrs.content;
  });

  return meta && meta[1].content;
};
