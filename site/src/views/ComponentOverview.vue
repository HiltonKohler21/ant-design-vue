<template>
  <section class="markdown components-overview-page">
    <div class="components-overview-header">
      <h1>
        {{ isZhCN ? '组件总览' : 'Components Overview' }}
        <a-tag :bordered="false" color="processing" class="components-overview-total-tag">
          {{ hasSearch ? `${filteredCount} / ${totalCount}` : totalCount }}
        </a-tag>
      </h1>
      <p class="components-overview-desc">
        <code>@hiltonkohler21/ant-design-vue</code>
        {{
          isZhCN
            ? '为 Web 应用提供了丰富的基础 UI 组件，我们还将持续探索企业级应用的最佳 UI 实践。'
            : 'provides plenty of UI components to enrich your web applications, and we will improve components experience consistently.'
        }}
      </p>
    </div>

    <a-divider class="components-overview-divider" />

    <a-affix :offset-top="72" @change="handleAffixChange">
      <div class="components-overview-search-wrap" :class="{ 'is-affixed': isAffixed }">
        <a-input
          v-model:value="search"
          size="large"
          allow-clear
          class="components-overview-search"
          :placeholder="
            isZhCN
              ? '搜索组件（支持英文名、中文名或分类，如 Button / 按钮 / 布局）'
              : 'Search in components (e.g. Button, Layout, Data Entry)'
          "
        >
          <template #prefix>
            <SearchOutlined class="components-overview-search-icon" />
          </template>
          <template #suffix>
            <span class="components-overview-search-count">
              {{
                isZhCN
                  ? `共 ${filteredCount} 个组件`
                  : `${filteredCount} ${filteredCount === 1 ? 'component' : 'components'}`
              }}
            </span>
          </template>
        </a-input>
      </div>
    </a-affix>

    <div v-if="filteredGroups.length === 0" class="components-overview-empty">
      <a-empty
        :description="
          isZhCN
            ? `未找到与「${search.trim()}」匹配的组件`
            : `No components found for '${search.trim()}'`
        "
      >
        <a-button type="primary" @click="search = ''">
          {{ isZhCN ? '清空搜索' : 'Clear Search' }}
        </a-button>
      </a-empty>
    </div>

    <template v-for="group in filteredGroups" :key="group.title">
      <div class="components-overview">
        <h2 class="ant-typography components-overview-group-title">
          <a-space align="center" :size="8">
            <span>{{ isZhCN ? group.title : group.enTitle || group.title }}</span>
            <a-tag :bordered="false" color="processing" class="components-overview-tag">
              {{ group.children.length }}
            </a-tag>
          </a-space>
        </h2>
        <a-row :gutter="[24, 24]">
          <template v-for="component in group.children" :key="component.title">
            <a-col :xs="24" :sm="12" :lg="8" :xl="6">
              <component
                :is="component.target ? 'a' : 'router-link'"
                class="components-overview-link"
                v-bind="
                  component.target
                    ? { href: component.path, target: component.target, rel: 'noopener noreferrer' }
                    : { to: getLocalizedPathname(component.path, isZhCN) }
                "
              >
                <OverviewCardWrapper
                  :border-beam="isBorderBeam(component)"
                  :ribbon-color="getRibbonColor(component)"
                  :ribbon-text="getRibbonText(component)"
                >
                  <a-card size="small" class="components-overview-card">
                    <template #title>
                      <div class="components-overview-title">
                        <span class="components-overview-en">{{ component.title }}</span>
                        <span v-if="isZhCN && component.subtitle" class="components-overview-cn">
                          {{ component.subtitle }}
                        </span>
                      </div>
                    </template>
                    <template v-if="showExtraTag(component)" #extra>
                      <a-tag
                        :color="getTagColor(component.tag)"
                        variant="filled"
                        class="components-overview-new-tag"
                      >
                        {{ component.tag }}
                      </a-tag>
                    </template>
                    <div class="components-overview-img">
                      <img
                        v-if="getCoverSrc(component) && !brokenCovers[getCoverKey(component)]"
                        :src="getCoverSrc(component)"
                        :alt="component.title"
                        loading="lazy"
                        @error="handleCoverError(component)"
                      />
                      <svg
                        v-else
                        class="components-overview-svg-placeholder"
                        viewBox="0 0 180 110"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="24"
                          y="18"
                          width="132"
                          height="74"
                          rx="10"
                          fill="var(--ant-color-bg-container, var(--component-background))"
                          stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                          stroke-width="1.5"
                        />
                        <rect
                          x="38"
                          y="34"
                          width="44"
                          height="12"
                          rx="4"
                          fill="var(--ant-color-primary, #1677ff)"
                        />
                        <rect
                          x="90"
                          y="34"
                          width="52"
                          height="12"
                          rx="4"
                          fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                        />
                        <rect
                          x="38"
                          y="56"
                          width="104"
                          height="8"
                          rx="4"
                          fill="var(--ant-color-fill-tertiary, rgba(128,128,128,0.12))"
                        />
                        <rect
                          x="38"
                          y="70"
                          width="72"
                          height="8"
                          rx="4"
                          fill="var(--ant-color-fill-tertiary, rgba(128,128,128,0.12))"
                        />
                      </svg>
                    </div>
                  </a-card>
                </OverviewCardWrapper>
              </component>
            </a-col>
          </template>
        </a-row>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import type { GlobalConfig } from '../type';
import { computed, defineComponent, h, inject, reactive, ref } from 'vue';
import { BadgeRibbon, BorderBeam } from '@hiltonkohler21/ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import { getLocalizedPathname } from '../utils/util';
import useMenus from '../hooks/useMenus';

const OverviewCardWrapper = defineComponent({
  name: 'OverviewCardWrapper',
  props: {
    borderBeam: {
      type: Boolean,
      default: false,
    },
    ribbonColor: {
      type: String,
      default: '',
    },
    ribbonText: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.();
      let node: any = children && children.length === 1 ? children[0] : children;
      if (props.borderBeam) {
        const inner = node;
        node = h(BorderBeam, { duration: 6, lineWidth: 2 }, { default: () => [inner] });
      }
      if (props.ribbonText) {
        const inner = node;
        node = h(
          BadgeRibbon,
          {
            color: props.ribbonColor || undefined,
            text: props.ribbonText,
          },
          { default: () => [inner] },
        );
      }
      return node;
    };
  },
});

export default defineComponent({
  name: 'ComponentOverview',
  components: {
    OverviewCardWrapper,
    SearchOutlined,
  },
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const themeMode = inject<{ theme: Ref<string> }>('themeMode', {
      theme: ref('light'),
    });
    const { dataSource } = useMenus();

    const search = ref('');
    const isAffixed = ref(false);
    const brokenCovers = reactive<Record<string, boolean>>({});

    const isDark = computed(() => themeMode?.theme?.value === 'dark');

    const normalizedGroups = computed(() => {
      const raw = (dataSource.value || []).filter(group => group && group.order !== -1);
      // Defensively normalize typo group '其它' into '其他' if present
      const map = new Map<string, any>();
      raw.forEach(group => {
        const key = group.title === '其它' ? '其他' : group.title;
        if (map.has(key)) {
          const existing = map.get(key);
          existing.children = [...existing.children, ...(group.children || [])].sort((a, b) =>
            String(a.title || '').localeCompare(String(b.title || ''), 'en', {
              sensitivity: 'base',
            }),
          );
        } else {
          map.set(key, {
            ...group,
            title: key,
            enTitle: key === '其他' ? group.enTitle || 'Other' : group.enTitle,
            order: key === '其他' ? group.order ?? 6 : group.order ?? 99,
            children: [...(group.children || [])],
          });
        }
      });
      return Array.from(map.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    });

    const totalCount = computed(() =>
      normalizedGroups.value.reduce((acc, g) => acc + (g.children?.length || 0), 0),
    );

    const hasSearch = computed(() => search.value.trim().length > 0);

    const filteredGroups = computed(() => {
      const q = search.value.trim().toLowerCase();
      if (!q) {
        return normalizedGroups.value;
      }
      const compactQ = q.replace(/\s+/g, '');
      return normalizedGroups.value
        .map(group => {
          const groupMatch =
            String(group.title || '')
              .toLowerCase()
              .includes(q) ||
            String(group.enTitle || '')
              .toLowerCase()
              .includes(q);
          if (groupMatch) {
            return group;
          }
          const matchedChildren = (group.children || []).filter((item: any) => {
            const title = String(item.title || '').toLowerCase();
            const subtitle = String(item.subtitle || '').toLowerCase();
            return (
              title.includes(q) ||
              title.replace(/\s+/g, '').includes(compactQ) ||
              subtitle.includes(q)
            );
          });
          return {
            ...group,
            children: matchedChildren,
          };
        })
        .filter(group => group.children.length > 0);
    });

    const filteredCount = computed(() =>
      filteredGroups.value.reduce((acc, g) => acc + (g.children?.length || 0), 0),
    );

    const isBorderBeam = (component: any) => component?.title === 'BorderBeam';

    const isDeprecated = (component: any) =>
      String(component?.tag || '')
        .trim()
        .toUpperCase() === 'DEPRECATED';

    const isNewComponent = (component: any) => {
      const tag = String(component?.tag || '').trim();
      if (!tag || isDeprecated(component)) return false;
      if (tag.toUpperCase() === 'NEW') return true;
      const match = tag.match(/^(\d+)\.(\d+)\.(\d+)/);
      if (!match) return false;
      const major = Number(match[1]);
      const minor = Number(match[2]);
      return major > 4 || (major === 4 && minor >= 3);
    };

    const getRibbonColor = (component: any) => {
      if (isDeprecated(component)) return 'orange';
      if (isNewComponent(component)) return 'green';
      return '';
    };

    const getRibbonText = (component: any) => {
      if (isDeprecated(component)) {
        return globalConfig.isZhCN.value ? '已废弃' : 'Deprecated';
      }
      if (isNewComponent(component)) {
        return String(component.tag || '').trim();
      }
      return '';
    };

    const showExtraTag = (component: any) =>
      Boolean(component?.tag) && !isDeprecated(component) && !isNewComponent(component);

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

    const getCoverSrc = (component: any) => {
      if (!component) return '';
      return isDark.value && component.coverDark ? component.coverDark : component.cover || '';
    };

    const getCoverKey = (component: any) => {
      return `${isDark.value ? 'dark' : 'light'}:${component?.title || ''}`;
    };

    const handleCoverError = (component: any) => {
      const key = getCoverKey(component);
      if (key) {
        brokenCovers[key] = true;
      }
    };

    const handleAffixChange = (affixed: boolean) => {
      isAffixed.value = !!affixed;
    };

    return {
      isZhCN: globalConfig.isZhCN,
      getLocalizedPathname,
      search,
      hasSearch,
      isAffixed,
      brokenCovers,
      totalCount,
      filteredCount,
      filteredGroups,
      isBorderBeam,
      getRibbonColor,
      getRibbonText,
      showExtraTag,
      getTagColor,
      getCoverSrc,
      getCoverKey,
      handleCoverError,
      handleAffixChange,
    };
  },
});
</script>

<style lang="less" src="./ComponentOverview.less"></style>
