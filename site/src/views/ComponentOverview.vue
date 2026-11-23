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
        <code>ant-design-vue</code>
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
                <a-card size="small" class="components-overview-card">
                  <template #title>
                    <div class="components-overview-title">
                      <span class="components-overview-en">{{ component.title }}</span>
                      <span v-if="isZhCN && component.subtitle" class="components-overview-cn">
                        {{ component.subtitle }}
                      </span>
                    </div>
                  </template>
                  <template v-if="component.tag" #extra>
                    <a-tag color="blue" :bordered="false" class="components-overview-new-tag">
                      {{ component.tag }}
                    </a-tag>
                  </template>
                  <div class="components-overview-img">
                    <img
                      v-if="getCoverSrc(component) && !failedCovers[component.title]"
                      :src="getCoverSrc(component)"
                      :alt="component.title"
                      loading="lazy"
                      @error="handleCoverError(component.title)"
                    />
                    <!-- Inline themed SVG placeholders for components without a cover image -->
                    <svg
                      v-else-if="component.title === 'BorderBeam'"
                      class="components-overview-svg-placeholder"
                      viewBox="0 0 180 110"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="ov-beam-grad"
                          x1="0"
                          y1="0"
                          x2="180"
                          y2="110"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stop-color="var(--ant-color-primary, #1677ff)" />
                          <stop offset="50%" stop-color="#722ed1" />
                          <stop offset="100%" stop-color="#13c2c2" stop-opacity="0.2" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="22"
                        y="18"
                        width="136"
                        height="74"
                        rx="12"
                        fill="var(--ant-color-bg-container, var(--component-background))"
                        stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                        stroke-width="1.5"
                      />
                      <rect
                        x="22"
                        y="18"
                        width="136"
                        height="74"
                        rx="12"
                        stroke="url(#ov-beam-grad)"
                        stroke-width="2.5"
                        stroke-dasharray="110 310"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="46"
                        cy="44"
                        r="9"
                        fill="var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))"
                      />
                      <circle cx="46" cy="44" r="4" fill="var(--ant-color-primary, #1677ff)" />
                      <rect
                        x="64"
                        y="38"
                        width="64"
                        height="7"
                        rx="3.5"
                        fill="var(--ant-color-fill, rgba(128,128,128,0.22))"
                      />
                      <rect
                        x="64"
                        y="51"
                        width="46"
                        height="6"
                        rx="3"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <rect
                        x="38"
                        y="68"
                        width="104"
                        height="8"
                        rx="4"
                        fill="var(--ant-color-fill-tertiary, rgba(128,128,128,0.1))"
                      />
                    </svg>

                    <svg
                      v-else-if="component.title === 'Masonry'"
                      class="components-overview-svg-placeholder"
                      viewBox="0 0 180 110"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="20"
                        y="14"
                        width="42"
                        height="34"
                        rx="6"
                        fill="var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))"
                        stroke="var(--ant-color-primary-border, rgba(22,119,255,0.3))"
                      />
                      <rect
                        x="20"
                        y="54"
                        width="42"
                        height="42"
                        rx="6"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <rect
                        x="69"
                        y="14"
                        width="42"
                        height="48"
                        rx="6"
                        fill="var(--ant-color-primary, #1677ff)"
                      />
                      <rect
                        x="69"
                        y="68"
                        width="42"
                        height="28"
                        rx="6"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <rect
                        x="118"
                        y="14"
                        width="42"
                        height="28"
                        rx="6"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <rect
                        x="118"
                        y="48"
                        width="42"
                        height="48"
                        rx="6"
                        fill="var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))"
                        stroke="var(--ant-color-primary-border, rgba(22,119,255,0.3))"
                      />
                    </svg>

                    <svg
                      v-else-if="component.title === 'Splitter'"
                      class="components-overview-svg-placeholder"
                      viewBox="0 0 180 110"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="18"
                        y="18"
                        width="144"
                        height="74"
                        rx="8"
                        fill="var(--ant-color-bg-container, var(--component-background))"
                        stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                        stroke-width="1.5"
                      />
                      <rect
                        x="26"
                        y="26"
                        width="52"
                        height="58"
                        rx="5"
                        fill="var(--ant-color-primary-bg, rgba(22, 119, 255, 0.12))"
                      />
                      <rect
                        x="94"
                        y="26"
                        width="60"
                        height="58"
                        rx="5"
                        fill="var(--ant-color-fill-tertiary, rgba(128,128,128,0.1))"
                      />
                      <line
                        x1="86"
                        y1="20"
                        x2="86"
                        y2="90"
                        stroke="var(--ant-color-primary, #1677ff)"
                        stroke-width="2"
                      />
                      <rect
                        x="82"
                        y="45"
                        width="8"
                        height="20"
                        rx="4"
                        fill="var(--ant-color-primary, #1677ff)"
                      />
                    </svg>

                    <svg
                      v-else-if="component.title === 'Listy'"
                      class="components-overview-svg-placeholder"
                      viewBox="0 0 180 110"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="20"
                        y="14"
                        width="140"
                        height="82"
                        rx="8"
                        fill="var(--ant-color-bg-container, var(--component-background))"
                        stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                        stroke-width="1.5"
                      />
                      <circle cx="38" cy="32" r="7" fill="var(--ant-color-primary, #1677ff)" />
                      <rect
                        x="52"
                        y="27"
                        width="58"
                        height="5"
                        rx="2.5"
                        fill="var(--ant-color-fill, rgba(128,128,128,0.22))"
                      />
                      <rect
                        x="52"
                        y="35"
                        width="38"
                        height="4"
                        rx="2"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <rect
                        x="128"
                        y="28"
                        width="22"
                        height="8"
                        rx="4"
                        fill="var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))"
                      />
                      <line
                        x1="28"
                        y1="47"
                        x2="152"
                        y2="47"
                        stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                      />
                      <circle
                        cx="38"
                        cy="60"
                        r="7"
                        fill="var(--ant-color-primary-border, rgba(22,119,255,0.45))"
                      />
                      <rect
                        x="52"
                        y="55"
                        width="66"
                        height="5"
                        rx="2.5"
                        fill="var(--ant-color-fill, rgba(128,128,128,0.22))"
                      />
                      <rect
                        x="52"
                        y="63"
                        width="44"
                        height="4"
                        rx="2"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.14))"
                      />
                      <line
                        x1="28"
                        y1="74"
                        x2="152"
                        y2="74"
                        stroke="var(--ant-color-border-secondary, var(--site-border-color-split))"
                      />
                      <circle
                        cx="38"
                        cy="84"
                        r="5"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.2))"
                      />
                      <rect
                        x="52"
                        y="81"
                        width="54"
                        height="5"
                        rx="2.5"
                        fill="var(--ant-color-fill-secondary, rgba(128,128,128,0.16))"
                      />
                    </svg>

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
import { computed, defineComponent, inject, reactive, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import { getLocalizedPathname } from '../utils/util';
import useMenus from '../hooks/useMenus';

export default defineComponent({
  name: 'ComponentOverview',
  components: {
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
    const failedCovers = reactive<Record<string, boolean>>({});

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
            String(a.title || '').localeCompare(String(b.title || '')),
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

    const getCoverSrc = (component: any) => {
      if (!component) return '';
      return isDark.value && component.coverDark ? component.coverDark : component.cover || '';
    };

    const handleCoverError = (title: string) => {
      if (title) {
        failedCovers[title] = true;
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
      failedCovers,
      totalCount,
      filteredCount,
      filteredGroups,
      getCoverSrc,
      handleCoverError,
      handleAffixChange,
    };
  },
});
</script>

<style lang="less" src="./ComponentOverview.less"></style>
