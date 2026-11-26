/* eslint-disable no-console */
import 'docsearch.js/dist/cdn/docsearch.css';
import './index.less';
import 'nprogress/nprogress.css';
import { createApp, Transition, TransitionGroup, version as vueVersion } from 'vue';
import i18n from './i18n';
import NProgress from 'nprogress';
import router from './router';
import Antd from '@hiltonkohler21/ant-design-vue';
import demoBox from './components/DemoBox.vue';
import demoContainer from './components/demoContainer.vue';
import demoSort from './components/demoSort.jsx';
import clipboard from './directives/clipboard';
import App from './App.vue';
console.log('vue version: ', vueVersion);
console.log('ant design vue version: ', Antd.version);
const app = createApp(App);

app.use(Antd);
app.use(clipboard);
app.component('Transition', Transition);
app.component('TransitionGroup', TransitionGroup);
app.component('DemoBox', demoBox);
app.component('DemoContainer', demoContainer);
app.component('DemoSort', demoSort);
app.component('VNodes', function (_, { attrs: { value } }) {
  return value;
});

// app.component('tempVar', {
//   functional: true,
//   render: (h, ctx) => {
//     return ctx.scopedSlots && ctx.scopedSlots.default && ctx.scopedSlots.default(ctx.props);
//   },
// });

// 开发态：依赖预构建重启会让首次模块请求被中断，导致深链接首屏空白。
// 这里对「动态导入失败」做一次自动重试，避免用户点开链接看到空白页。
let lazyRetried = 0;
router.onError(error => {
  const message = String((error && error.message) || error);
  if (
    lazyRetried < 2 &&
    /dynamically imported module|Failed to fetch|Importing a module script failed/i.test(message)
  ) {
    lazyRetried += 1;
    const target = window.location.pathname + window.location.search + window.location.hash;
    window.setTimeout(() => {
      // eslint-disable-next-line no-console
      router
        .replace(target)
        .then(fail =>
          console.log(
            '[site] retry nav result',
            JSON.stringify(fail),
            router.currentRoute.value.fullPath,
          ),
        )
        .catch(e => console.error('[site] retry nav error', e));
    }, 300);
  }
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    NProgress.done();
    document.documentElement.scrollTop = 0;
  }
  // 与 ant.design 站点保持一致：页面标题体现当前组件/文档名
  const metaTitle = to.meta?.title || to.meta?.enTitle;
  document.title = metaTitle
    ? `${metaTitle} - Ant Design Vue`
    : 'Ant Design Vue — An enterprise-class UI components based on Ant Design and Vue.js';
});

app.use(router);
app.use(i18n);

app.config.globalProperties.$i18n = i18n;

// 先挂载、后等待路由就绪：让站点外壳（Header/侧边栏）尽快出现，
// 避免 dev 下首屏因路由 chunk 较慢而整页空白。
app.mount('#app');

const ensureInitialRoute = () => {
  if (router.currentRoute.value.matched.length > 0) return;
  const target = window.location.pathname + window.location.search + window.location.hash;
  if (target && target !== '/') {
    router.replace(target).catch(() => {});
  }
};

router
  .isReady()
  .catch(() => {})
  .finally(() => {
    ensureInitialRoute();
    window.setTimeout(ensureInitialRoute, 600);
  });

// setTimeout(() => {
//   const clicked = localStorage.getItem('surveybyantdv_22_03_14');
//   if (!clicked) {
//     const btn = document.getElementsByClassName('surveybyantdv-launch-button')?.[0];
//     if (btn) {
//       btn.click();
//       localStorage.setItem('surveybyantdv_22_03_14', true);
//     }
//   }
// }, 3000);
