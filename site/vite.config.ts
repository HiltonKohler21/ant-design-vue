import path from 'path';
import vue from '@vitejs/plugin-vue';
import md from '../plugin/md';
import docs from '../plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';
/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      vue:
        process.env.NODE_ENV === 'production'
          ? 'vue/dist/vue.runtime.esm-browser.prod.js'
          : 'vue/dist/vue.esm-bundler.js',
      'ant-design-vue/es': path.resolve(__dirname, '../components'),
      'ant-design-vue': path.resolve(__dirname, '../components'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
  plugins: [
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
    include: [
      'fetch-jsonp',
      'lodash-es',
      'dayjs',
      'vue',
      'vue-router',
      'vue-i18n',
      'async-validator',
      '@ctrl/tinycolor',
      'resize-observer-polyfill',
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
