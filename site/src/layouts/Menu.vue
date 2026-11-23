<template>
  <a-menu
    :inline-indent="16"
    class="aside-container menu-site"
    mode="inline"
    :selected-keys="[activeMenuItem]"
  >
    <a-menu-item v-if="showOverview" key="/components/overview">
      <router-link :to="getLocalizedPathname('/components/overview', isZhCN)">
        <span>{{ isZhCN ? '组件总览' : 'Components Overview' }}</span>
      </router-link>
    </a-menu-item>
    <template v-for="m in menus" :key="m.path || m.title">
      <template v-if="m.children">
        <a-menu-item-group :key="`${m.order}-${m.title}`" :title="isZhCN ? m.title : m.enTitle">
          <template v-for="n in m.children" :key="n.path">
            <a-menu-item v-if="n.path" :key="n.path">
              <a v-if="n.target" :target="n.target" rel="noopener noreferrer" :href="n.path">
                <span>{{ isZhCN ? n.title : n.enTitle || n.title }}</span>
                <span v-if="isZhCN && n.subtitle" class="chinese">{{ n.subtitle }}</span>
              </a>
              <router-link v-else :to="getLocalizedPathname(n.path, isZhCN)">
                <span>{{ isZhCN ? n.title : n.enTitle || n.title }}</span>
                <span v-if="isZhCN && n.subtitle" class="chinese">{{ n.subtitle }}</span>
              </router-link>
              <a-tag
                v-if="n.tag"
                :color="getTagColor(n.tag)"
                variant="filled"
                class="aside-item-tag"
              >
                {{ getTagLabel(n.tag) }}
              </a-tag>
            </a-menu-item>
          </template>
        </a-menu-item-group>
      </template>
      <template v-else>
        <a-menu-item v-if="m.path" :key="m.path">
          <a v-if="m.target" :target="m.target" rel="noopener noreferrer" :href="m.path">
            <span>{{ isZhCN ? `${m.title} ${m.subtitle || ''}` : m.enTitle || m.title }}</span>
          </a>
          <router-link v-else :to="getLocalizedPathname(m.path, isZhCN)">
            <span>{{ isZhCN ? `${m.title} ${m.subtitle || ''}` : m.enTitle || m.title }}</span>
          </router-link>
          <a-tag v-if="m.tag" :color="getTagColor(m.tag)" variant="filled" class="aside-item-tag">
            {{ getTagLabel(m.tag) }}
          </a-tag>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>
<script lang="ts">
import { getLocalizedPathname } from '../utils/util';
import { computed, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'SiteMenu',
  props: ['menus', 'isZhCN', 'activeMenuItem'],
  setup(props) {
    const route = useRoute();
    const showOverview = computed(() => {
      return route.path.indexOf('/components') === 0;
    });

    watch(
      [() => props.activeMenuItem, () => props.isZhCN, () => props.menus],
      () => {
        const list = (props.menus || []).reduce(
          (pre: any[], current: any) => [...pre, current, ...(current.children || [])],
          [{ path: '/components/overview', title: '组件总览', enTitle: 'Components Overview' }],
        );
        const item = list.find((m: any) => m.path === props.activeMenuItem);
        let title = props.isZhCN
          ? 'Ant Design Vue - 一套企业级 Vue 组件库'
          : 'Ant Design Vue — An enterprise-class UI components based on Ant Design and Vue.js';
        if (item && item.title) {
          title = props.isZhCN
            ? `${item.subtitle || ''} ${item.title} - Ant Design Vue`
            : `${item.enTitle || item.title} - Ant Design Vue`;
        }
        document.title = title.trim();
      },
      { immediate: true, flush: 'post' },
    );

    const TAG_LOCALES: Record<'cn' | 'en', Record<string, string>> = {
      cn: {
        deprecated: '废弃',
        updated: '更新',
        new: '新增',
      },
      en: {
        deprecated: 'DEPRECATED',
        updated: 'UPDATED',
        new: 'NEW',
      },
    };

    const getTagColor = (tag?: string) => {
      switch (
        String(tag || '')
          .trim()
          .toUpperCase()
      ) {
        case 'UPDATED':
          return 'processing';
        case 'DEPRECATED':
          return 'red';
        default:
          return 'success';
      }
    };

    const getTagLabel = (tag?: string) => {
      const raw = String(tag || '').trim();
      if (!raw) return '';
      const dict = props.isZhCN ? TAG_LOCALES.cn : TAG_LOCALES.en;
      return dict[raw.toLowerCase()] ?? raw;
    };

    return {
      getLocalizedPathname,
      getTagColor,
      getTagLabel,
      showOverview,
    };
  },
});
</script>
<style lang="less" scoped>
.aside-item-tag {
  margin-inline-start: auto;
  margin-inline-end: 0;
  font-size: 10px;
  line-height: 16px;
  padding: 0 5px;
  border-radius: 4px;
}
</style>
