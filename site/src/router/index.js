/* eslint-disable import/no-unresolved */
import Layout from '../layouts/index.vue';
import Iframe from '../layouts/Iframe.vue';
// import Iframe from '../components/iframe.jsx';
import demoRoutes from './demoRoutes';
// import otherRoutes from './otherRoutes';
import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  // ...otherRoutes,
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/index',
    name: 'home-en',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/index-cn',
    name: 'home-cn',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/components',
    component: Layout,
    children: [
      {
        path: 'overview:lang(.*)',
        component: () => import('../views/ComponentOverview.vue'),
      },
      ...demoRoutes,
    ],
  },
  {
    path: '/iframe',
    component: Iframe,
    children: [
      {
        path: 'layout:lang(.*)',
        meta: {
          category: 'Components',
          subtitle: '布局',
          type: '布局',
          cols: 1,
          title: 'Layout',
          cover: 'https://gw.alipayobjects.com/zos/alicdn/hzEndUVEx/Layout.svg',
        },
        props: route => {
          const hash = route.hash.replace('#', '');
          return { iframeName: hash };
        },
        component: () => import('../../../components/layout/demo/index.vue'),
      },
      {
        path: 'float-button:lang(.*)',
        meta: {
          category: 'Components',
          subtitle: '悬浮按钮',
          type: '悬浮按钮',
          cols: 1,
          title: 'FloatButton',
          cover:
            'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HS-wTIIwu0kAAAAAAAAAAAAADrJ8AQ/original',
        },
        props: route => {
          const hash = route.hash.replace('#', '');
          return { iframeName: hash };
        },
        component: () => import('../../../components/float-button/demo/index.vue'),
      },
    ],
  },
  {
    path: '/docs',
    component: Layout,
    // props: route => {
    //   const name = route.path.split('/docs/vue/')[1].split('/')[0];
    //   return { name, showApi: true };
    // },
    children: [
      {
        path: 'vue/introduce-cn',
        meta: { enTitle: 'Ant Design of Vue', title: 'Ant Design of Vue', category: 'docs' },
        component: () => import('../vueDocs/introduce.zh-CN.md'),
      },
      {
        path: 'vue/introduce',
        meta: { enTitle: 'Ant Design of Vue', title: 'Ant Design of Vue', category: 'docs' },
        component: () => import('../vueDocs/introduce.en-US.md'),
      },
      {
        path: 'vue/getting-started-cn',
        meta: { enTitle: 'Getting Started', title: '快速上手', category: 'docs' },
        component: () => import('../vueDocs/getting-started.zh-CN.md'),
      },
      {
        path: 'vue/getting-started',
        meta: { enTitle: 'Getting Started', title: '快速上手', category: 'docs' },
        component: () => import('../vueDocs/getting-started.en-US.md'),
      },
      {
        path: 'vue/compatible-style-cn',
        meta: { enTitle: 'Compatible Style', title: '样式兼容', category: 'docs' },
        component: () => import('../vueDocs/compatible-style.zh-CN.md'),
      },
      {
        path: 'vue/compatible-style',
        meta: { enTitle: 'Compatible Style', title: '样式兼容', category: 'docs' },
        component: () => import('../vueDocs/compatible-style.en-US.md'),
      },
      {
        path: 'vue/customize-theme-cn',
        meta: { enTitle: 'Customize Theme', title: '定制主题', category: 'docs' },
        component: () => import('../vueDocs/customize-theme.zh-CN.md'),
      },
      {
        path: 'vue/customize-theme',
        meta: { enTitle: 'Customize Theme', title: '定制主题', category: 'docs' },
        component: () => import('../vueDocs/customize-theme.en-US.md'),
      },
      {
        path: 'vue/ssr-extract-ssr',
        meta: { enTitle: 'SSR Static style export', title: 'SSR 静态样式导出', category: 'docs' },
        component: () => import('../vueDocs/extract-ssr.en-US.md'),
      },
      {
        path: 'vue/ssr-extract-ssr-cn',
        meta: { enTitle: 'SSR Static style export', title: 'SSR 静态样式导出', category: 'docs' },
        component: () => import('../vueDocs/extract-ssr.zh-CN.md'),
      },
      {
        path: 'vue/replace-date-cn',
        meta: { enTitle: 'Custom Date Library', title: '自定义时间库', category: 'docs' },
        component: () => import('../vueDocs/replace-date.zh-CN.md'),
      },
      {
        path: 'vue/replace-date',
        meta: { enTitle: 'Custom Date Library', title: '自定义时间库', category: 'docs' },
        component: () => import('../vueDocs/replace-date.en-US.md'),
      },
      {
        path: 'vue/migration-v2-cn',
        meta: { enTitle: 'V1 to V2', title: '从 v1 到 v2', category: 'docs' },
        component: () => import('../vueDocs/migration-v2.zh-CN.md'),
      },
      {
        path: 'vue/migration-v2',
        meta: { enTitle: 'V1 to V2', title: '从 v1 到 v2', category: 'docs' },
        component: () => import('../vueDocs/migration-v2.en-US.md'),
      },
      {
        path: 'vue/migration-v3-cn',
        meta: { enTitle: 'V2 to V3', title: '从 v2 到 v3', category: 'docs' },
        component: () => import('../vueDocs/migration-v3.zh-CN.md'),
      },
      {
        path: 'vue/migration-v3',
        meta: { enTitle: 'V2 to V3', title: '从 v2 到 v3', category: 'docs' },
        component: () => import('../vueDocs/migration-v3.en-US.md'),
      },
      {
        path: 'vue/migration-v4-cn',
        meta: { enTitle: 'V3 to V4', title: '从 V3 到 V4', category: 'docs' },
        component: () => import('../vueDocs/migration-v4.zh-CN.md'),
      },
      {
        path: 'vue/migration-v4',
        meta: { enTitle: 'V3 to V4', title: '从 V3 到 V4', category: 'docs' },
        component: () => import('../vueDocs/migration-v4.en-US.md'),
      },
      {
        path: 'vue/i18n-cn',
        meta: { enTitle: 'Internationalization', title: '国际化', category: 'docs' },
        component: () => import('../vueDocs/i18n.zh-CN.md'),
      },
      {
        path: 'vue/i18n',
        meta: { enTitle: 'Internationalization', title: '国际化', category: 'docs' },
        component: () => import('../vueDocs/i18n.en-US.md'),
      },
      {
        path: 'vue/faq-cn',
        meta: { enTitle: 'FAQ', title: '常见问题', category: 'docs' },
        component: () => import('../vueDocs/faq.zh-CN.md'),
      },
      {
        path: 'vue/faq',
        meta: { enTitle: 'FAQ', title: '常见问题', category: 'docs' },
        component: () => import('../vueDocs/faq.en-US.md'),
      },
      {
        path: 'vue/download-cn',
        meta: { enTitle: 'Download Design Resources', title: '下载设计资源', category: 'docs' },
        component: () => import('../vueDocs/download.zh-CN.md'),
      },
      {
        path: 'vue/download',
        meta: { enTitle: 'Download Design Resources', title: '下载设计资源', category: 'docs' },
        component: () => import('../vueDocs/download.en-US.md'),
      },
      {
        path: 'vue/for-agents-cn',
        meta: {
          enTitle: 'For AI Agents',
          title: 'AI 智能体',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'AI',
        },
        component: () => import('../vueDocs/for-agents.zh-CN.md'),
      },
      {
        path: 'vue/for-agents',
        meta: {
          enTitle: 'For AI Agents',
          title: 'For AI Agents',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'AI',
        },
        component: () => import('../vueDocs/for-agents.en-US.md'),
      },
      {
        path: 'vue/mcp-cn',
        meta: {
          enTitle: 'MCP Server',
          title: 'MCP Server',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'MCP',
        },
        component: () => import('../vueDocs/mcp.zh-CN.md'),
      },
      {
        path: 'vue/mcp',
        meta: {
          enTitle: 'MCP Server',
          title: 'MCP Server',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'MCP',
        },
        component: () => import('../vueDocs/mcp.en-US.md'),
      },
      {
        path: 'vue/design-cn',
        meta: {
          enTitle: 'Design Specification',
          title: '设计规范',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'Spec',
        },
        component: () => import('../vueDocs/design.zh-CN.md'),
      },
      {
        path: 'vue/design',
        meta: {
          enTitle: 'Design Specification',
          title: 'Design Specification',
          category: 'docs',
          type: 'AI & Agent',
          tag: 'Spec',
        },
        component: () => import('../vueDocs/design.en-US.md'),
      },
      {
        path: 'vue/changelog-cn',
        meta: { enTitle: 'Change Log', title: '更新日志', category: 'docs' },
        component: () => import('../../../CHANGELOG.zh-CN.md'),
      },
      {
        path: 'vue/changelog',
        meta: { enTitle: 'Change Log', title: '更新日志', category: 'docs' },
        component: () => import('../../../CHANGELOG.en-US.md'),
      },
      { path: '', redirect: '/docs/vue/introduce/' },
    ],
  },
  {
    path: '/theme-editor',
    component: () => import('../views/theme-editor/index.vue'),
  },
  {
    path: '/theme-editor-cn',
    component: () => import('../views/theme-editor/index.vue'),
  },
  { path: '/for-agents', redirect: '/docs/vue/for-agents' },
  { path: '/for-agents-cn', redirect: '/docs/vue/for-agents-cn' },
  { path: '/mcp', redirect: '/docs/vue/mcp' },
  { path: '/mcp-cn', redirect: '/docs/vue/mcp-cn' },
  { path: '/design', redirect: '/docs/vue/design' },
  { path: '/design-cn', redirect: '/docs/vue/design-cn' },
  { path: '/docs/spec/introduce', redirect: '/docs/vue/design' },
  { path: '/docs/spec/introduce-cn', redirect: '/docs/vue/design-cn' },
  { path: '/docs/vue/sponsor', redirect: '/docs/vue/introduce' },
  { path: '/docs/vue/sponsor-cn', redirect: '/docs/vue/introduce-cn' },
  { path: '/sponsor', redirect: '/docs/vue/introduce' },
  { path: '/sponsor-cn', redirect: '/docs/vue/introduce-cn' },
  { path: '/debugger', component: () => import('../../debugger') },
  {
    path: '/:lang(.*)',
    redirect: to => (/-cn\/?$/.test(to.path) ? '/index-cn' : '/'),
  },
];

export default createRouter({
  history: createWebHistory(),
  fallback: false,
  routes,
  scrollBehavior: to => {
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'auto' };
    }
    return { top: 0 };
  },
});
