<template>
  <article>
    <section class="markdown">
      <h1>
        {{ docTitle }}
        <span v-if="isZhCN" class="subtitle">{{ docSubtitle }}</span>
      </h1>
      <section class="markdown" v-html="description"></section>
    </section>
    <section
      class="markdown"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      "
    >
      <h2 style="margin: 0">{{ $t('app.component.examples') }}</h2>
      <a-tooltip
        :title="
          isAllExpanded
            ? isZhCN
              ? '收起全部代码'
              : 'Collapse All'
            : isZhCN
            ? '展开全部代码'
            : 'Expand All'
        "
      >
        <a-button size="small" shape="circle" class="expand-all-btn" @click="toggleExpandAll">
          <CodeOutlined style="font-size: 14px" />
        </a-button>
      </a-tooltip>
    </section>
    <slot />
    <!-- <GoogleAds v-if="showAd" :key="`goo-${route.path}`" /> -->
    <section class="markdown api-container" v-html="api"></section>
    <Contributor :is-zn="isZhCN" />
  </article>
</template>
<script lang="ts">
import { defineComponent, computed, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import { CodeOutlined } from '@ant-design/icons-vue';
import Contributor from '../components/Contributors/index.vue';

const showAd = location.host.indexOf('antdv.com') > -1;
export default defineComponent({
  name: 'Demo',
  components: {
    Contributor,
    CodeOutlined,
  },
  props: ['pageData', 'isZhCN'],
  setup(props) {
    const route = useRoute();
    const isAllExpanded = ref(false);
    provide('isAllExpanded', isAllExpanded);

    const toggleExpandAll = () => {
      isAllExpanded.value = !isAllExpanded.value;
    };

    const frontmatter = computed(() => props?.pageData?.frontmatter || {});
    // 兜底：pageData 在懒加载完成前可能为空，此时用路由 meta 保证标题不缺失
    const docTitle = computed(() => frontmatter.value.title || route.meta?.title || '');
    const docSubtitle = computed(() => frontmatter.value.subtitle || route.meta?.subtitle || '');
    const docHtml = computed(() => {
      return props?.pageData?.html || '';
    });
    const description = computed(() => {
      return docHtml.value.split('<h2 id="api">API <a class="header-anchor" href="#api">')[0];
    });
    const api = computed(() => {
      return `
      <h2 id="api"><span>API</span><a href="#api" class="anchor">#</a></h2>
      ${docHtml.value.split('<h2 id="api">API <a class="header-anchor" href="#api">')[1]}
      `;
    });
    return {
      frontmatter,
      docTitle,
      docSubtitle,
      description,
      api,
      route,
      showAd,
      docHtml,
      isAllExpanded,
      toggleExpandAll,
    };
  },
});
</script>
<style lang="less" scoped></style>
