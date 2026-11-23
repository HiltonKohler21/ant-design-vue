<template>
  <a-modal
    :open="open"
    :footer="null"
    :closable="false"
    :width="580"
    :mask-closable="true"
    :destroy-on-close="false"
    wrap-class-name="site-search-modal-wrap"
    class="site-search-modal"
    :body-style="{ padding: 0 }"
    @cancel="closeModal"
  >
    <div class="site-search-panel">
      <div class="site-search-input-bar search-box">
        <SearchOutlined class="site-search-bar-icon" />
        <input
          ref="inputRef"
          v-model="query"
          type="search"
          class="site-search-input"
          autocomplete="off"
          spellcheck="false"
          :placeholder="
            isZhCN ? '搜索组件、文档或设计规范...' : 'Search components, docs, or guidelines...'
          "
          @keydown="handleInputKeydown"
        />
        <button
          v-if="query"
          type="button"
          class="site-search-clear-btn"
          :aria-label="isZhCN ? '清除搜索' : 'Clear search'"
          @click="clearQuery"
        >
          <CloseCircleFilled />
        </button>
        <kbd class="site-search-esc-kbd" @click="closeModal">ESC</kbd>
      </div>

      <div ref="listRef" class="site-search-results">
        <template v-if="flatResults.length">
          <template v-for="group in groupedResults" :key="group.key">
            <div class="site-search-group-title">{{ group.label }}</div>
            <div
              v-for="item in group.items"
              :key="item.path + ':' + group.key"
              :data-search-idx="item._flatIdx"
              class="site-search-item"
              :class="{ active: activeIndex === item._flatIdx }"
              @mouseenter="activeIndex = item._flatIdx"
              @click="selectItem(item)"
            >
              <span class="site-search-item-icon">
                <AppstoreOutlined v-if="item.kind === 'component'" />
                <BgColorsOutlined v-else-if="item.kind === 'tool'" />
                <FileTextOutlined v-else />
              </span>
              <span class="site-search-item-main">
                <span class="site-search-item-title">
                  <template
                    v-for="(seg, sIdx) in splitHighlight(getDisplayTitle(item), query)"
                    :key="sIdx"
                  >
                    <mark v-if="seg.hit" class="site-search-mark">{{ seg.text }}</mark>
                    <template v-else>{{ seg.text }}</template>
                  </template>
                </span>
                <span v-if="getDisplaySubtitle(item)" class="site-search-item-sub">
                  <template
                    v-for="(seg, sIdx) in splitHighlight(getDisplaySubtitle(item), query)"
                    :key="sIdx"
                  >
                    <mark v-if="seg.hit" class="site-search-mark">{{ seg.text }}</mark>
                    <template v-else>{{ seg.text }}</template>
                  </template>
                </span>
              </span>
              <span v-if="getDisplayBadge(item)" class="site-search-item-badge">
                {{ getDisplayBadge(item) }}
              </span>
              <EnterOutlined class="site-search-item-enter" />
            </div>
          </template>
        </template>
        <div v-else class="site-search-empty">
          <a-empty
            :description="
              isZhCN
                ? `未找到与「${query}」相关的结果`
                : `No results found for &quot;${query}&quot;`
            "
          />
        </div>
      </div>

      <div class="site-search-footer">
        <div class="site-search-hints">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            {{ isZhCN ? '切换' : 'Navigate' }}
          </span>
          <span>
            <kbd>↵</kbd>
            {{ isZhCN ? '打开' : 'Select' }}
          </span>
          <span>
            <kbd>ESC</kbd>
            {{ isZhCN ? '关闭' : 'Close' }}
          </span>
        </div>
        <span class="site-search-count">
          {{
            query.trim()
              ? isZhCN
                ? `共 ${flatResults.length} 项`
                : `${flatResults.length} results`
              : isZhCN
              ? `${allEntries.length} 篇组件与文档`
              : `${allEntries.length} pages indexed`
          }}
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  AppstoreOutlined,
  BgColorsOutlined,
  CloseCircleFilled,
  EnterOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { getLocalizedPathname } from '../../utils/util';

interface SearchEntry {
  path: string;
  kind: 'component' | 'doc' | 'tool';
  title: string;
  zhTitle: string;
  enTitle: string;
  subtitle?: string;
  groupZh: string;
  groupEn: string;
  tag?: string;
  slug: string;
  searchText: string;
}

const GROUP_EN_MAP: Record<string, string> = {
  组件总览: 'Overview',
  通用: 'General',
  布局: 'Layout',
  导航: 'Navigation',
  数据录入: 'Data Entry',
  数据展示: 'Data Display',
  反馈: 'Feedback',
  其他: 'Other',
  废弃: 'Deprecated',
  'AI & Agent': 'AI & Agent',
  研发文档: 'Documentation',
  主题工具: 'Theme',
};

const QUICK_ACCESS_PATHS = [
  '/components/overview',
  '/components/button',
  '/components/table',
  '/components/form',
  '/components/modal',
  '/components/select',
  '/components/date-picker',
  '/docs/vue/customize-theme',
  '/docs/vue/for-agents',
  '/theme-editor',
];

const RECENT_STORAGE_KEY = 'antdv-site-recent-searches';
const MAX_RECENT = 5;

function readRecentPaths(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(v => typeof v === 'string').slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function saveRecentPath(path: string) {
  if (typeof localStorage === 'undefined') return;
  const current = readRecentPaths().filter(p => p !== path);
  current.unshift(path);
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(current.slice(0, MAX_RECENT)));
  } catch {
    // ignore quota errors
  }
}

export default defineComponent({
  name: 'SearchModal',
  components: {
    AppstoreOutlined,
    BgColorsOutlined,
    CloseCircleFilled,
    EnterOutlined,
    FileTextOutlined,
    SearchOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    isZhCN: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    const router = useRouter();
    const inputRef = ref<HTMLInputElement | null>(null);
    const listRef = ref<HTMLDivElement | null>(null);
    const query = ref('');
    const activeIndex = ref(0);
    const recentPaths = ref<string[]>(readRecentPaths());

    const allEntries = computed<SearchEntry[]>(() => {
      const routes = router.getRoutes();
      const map = new Map<string, SearchEntry>();

      const addEntry = (entry: Omit<SearchEntry, 'searchText'>) => {
        const cleanSlug = entry.slug.replace(/-/g, '');
        const searchText = [
          entry.title,
          entry.zhTitle,
          entry.enTitle,
          entry.subtitle || '',
          entry.groupZh,
          entry.groupEn,
          entry.slug,
          cleanSlug,
          entry.tag || '',
        ]
          .join(' ')
          .toLowerCase();
        map.set(entry.path, { ...entry, searchText });
      };

      addEntry({
        path: '/components/overview',
        kind: 'component',
        title: 'Components Overview',
        zhTitle: '组件总览',
        enTitle: 'Components Overview',
        subtitle: '全部组件',
        groupZh: '组件总览',
        groupEn: 'Overview',
        slug: 'overview',
      });

      addEntry({
        path: '/theme-editor',
        kind: 'tool',
        title: 'Theme Editor',
        zhTitle: '主题编辑器',
        enTitle: 'Theme Editor',
        subtitle: 'Design Token 可视化定制',
        groupZh: '主题工具',
        groupEn: 'Theme',
        slug: 'theme-editor',
      });

      for (const r of routes) {
        if (!r.meta || !r.meta.category || /^\/iframe/.test(r.path)) continue;
        const category = String(r.meta.category).toLowerCase();
        const basePath = r.path
          .split(':lang')[0]
          .replace(/-cn\/?$/, '')
          .replace(/\/$/, '');
        if (!basePath || basePath === '/components/overview') continue;

        const slug = basePath.split('/').pop() || '';
        const rawType = r.meta.type ? String(r.meta.type) : '';
        const normType = rawType === '其它' ? '其他' : rawType;

        if (category === 'components') {
          const title = String(r.meta.title || slug);
          const subtitle = r.meta.subtitle ? String(r.meta.subtitle) : '';
          const groupZh = normType || '其他';
          const groupEn = GROUP_EN_MAP[groupZh] || groupZh;
          addEntry({
            path: basePath,
            kind: 'component',
            title,
            zhTitle: title,
            enTitle: title,
            subtitle,
            groupZh,
            groupEn,
            tag: r.meta.tag ? String(r.meta.tag) : undefined,
            slug,
          });
        } else if (category === 'docs') {
          const isCnRoute = /-cn\/?$/.test(r.path);
          const existing = map.get(basePath);
          const titleVal = String(r.meta.title || slug);
          const enTitleVal = String(r.meta.enTitle || titleVal);
          const groupZh = normType || '研发文档';
          const groupEn = GROUP_EN_MAP[groupZh] || groupZh;

          if (existing) {
            if (isCnRoute) {
              existing.zhTitle = titleVal;
            } else {
              existing.enTitle = enTitleVal;
            }
            existing.searchText = [
              existing.title,
              existing.zhTitle,
              existing.enTitle,
              existing.groupZh,
              existing.groupEn,
              existing.slug,
              existing.slug.replace(/-/g, ''),
              existing.tag || '',
            ]
              .join(' ')
              .toLowerCase();
          } else {
            addEntry({
              path: basePath,
              kind: 'doc',
              title: enTitleVal,
              zhTitle: titleVal,
              enTitle: enTitleVal,
              groupZh,
              groupEn,
              tag: r.meta.tag ? String(r.meta.tag) : undefined,
              slug,
            });
          }
        }
      }

      return Array.from(map.values());
    });

    const scoreEntry = (entry: SearchEntry, q: string): number => {
      const titleL = entry.title.toLowerCase();
      const zhL = entry.zhTitle.toLowerCase();
      const enL = entry.enTitle.toLowerCase();
      const subL = (entry.subtitle || '').toLowerCase();
      const slugL = entry.slug.toLowerCase();
      const slugCompact = slugL.replace(/-/g, '');

      if (
        titleL === q ||
        zhL === q ||
        enL === q ||
        subL === q ||
        slugL === q ||
        slugCompact === q
      ) {
        return 100;
      }
      if (
        titleL.startsWith(q) ||
        zhL.startsWith(q) ||
        enL.startsWith(q) ||
        subL.startsWith(q) ||
        slugL.startsWith(q) ||
        slugCompact.startsWith(q)
      ) {
        return 75;
      }
      if (titleL.includes(q) || zhL.includes(q) || enL.includes(q) || subL.includes(q)) {
        return 50;
      }
      if (slugL.includes(q) || slugCompact.includes(q)) {
        return 35;
      }
      if (entry.searchText.includes(q)) {
        return 15;
      }
      // Multi-token AND match
      const tokens = q.split(/\s+/).filter(Boolean);
      if (tokens.length > 1 && tokens.every(t => entry.searchText.includes(t))) {
        return 10;
      }
      return 0;
    };

    const groupedResults = computed(() => {
      const trimmed = query.value.trim().toLowerCase();
      const groups: Array<{
        key: string;
        label: string;
        items: Array<SearchEntry & { _flatIdx: number }>;
      }> = [];
      let idx = 0;

      if (!trimmed) {
        const entryByPath = new Map(allEntries.value.map(e => [e.path, e]));
        const recentItems = recentPaths.value
          .map(p => entryByPath.get(p))
          .filter((e): e is SearchEntry => !!e);
        if (recentItems.length) {
          groups.push({
            key: 'recent',
            label: props.isZhCN ? '最近访问' : 'Recent',
            items: recentItems.map(item => ({ ...item, _flatIdx: idx++ })),
          });
        }
        const recentSet = new Set(recentItems.map(i => i.path));
        const quickItems = QUICK_ACCESS_PATHS.filter(p => !recentSet.has(p))
          .map(p => entryByPath.get(p))
          .filter((e): e is SearchEntry => !!e);
        if (quickItems.length) {
          groups.push({
            key: 'quick',
            label: props.isZhCN ? '常用推荐' : 'Quick Access',
            items: quickItems.map(item => ({ ...item, _flatIdx: idx++ })),
          });
        }
        return groups;
      }

      const scored = allEntries.value
        .map(entry => ({ entry, score: scoreEntry(entry, trimmed) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

      const compItems = scored.filter(x => x.entry.kind === 'component').map(x => x.entry);
      const docItems = scored.filter(x => x.entry.kind !== 'component').map(x => x.entry);

      if (compItems.length) {
        groups.push({
          key: 'components',
          label: props.isZhCN ? '组件' : 'Components',
          items: compItems.map(item => ({ ...item, _flatIdx: idx++ })),
        });
      }
      if (docItems.length) {
        groups.push({
          key: 'docs',
          label: props.isZhCN ? '文档与工具' : 'Docs & Tools',
          items: docItems.map(item => ({ ...item, _flatIdx: idx++ })),
        });
      }
      return groups;
    });

    const flatResults = computed(() => {
      const items: Array<SearchEntry & { _flatIdx: number }> = [];
      for (const g of groupedResults.value) {
        items.push(...g.items);
      }
      return items;
    });

    watch(query, () => {
      activeIndex.value = 0;
    });

    watch(
      () => props.open,
      val => {
        if (val) {
          recentPaths.value = readRecentPaths();
          activeIndex.value = 0;
          nextTick(() => {
            inputRef.value?.focus();
            inputRef.value?.select();
          });
          window.setTimeout(() => {
            inputRef.value?.focus();
          }, 60);
        } else {
          query.value = '';
        }
      },
    );

    const closeModal = () => {
      emit('update:open', false);
    };

    const clearQuery = () => {
      query.value = '';
      nextTick(() => inputRef.value?.focus());
    };

    const scrollActiveIntoView = () => {
      nextTick(() => {
        const activeEl = listRef.value?.querySelector(
          `[data-search-idx="${activeIndex.value}"]`,
        ) as HTMLElement | null;
        activeEl?.scrollIntoView?.({ block: 'nearest' });
      });
    };

    const selectItem = (item: SearchEntry) => {
      saveRecentPath(item.path);
      recentPaths.value = readRecentPaths();
      closeModal();
      const target = getLocalizedPathname(item.path, props.isZhCN);
      router.push(target);
    };

    const handleInputKeydown = (e: KeyboardEvent) => {
      const total = flatResults.value.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (total > 0) {
          activeIndex.value = (activeIndex.value + 1) % total;
          scrollActiveIntoView();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (total > 0) {
          activeIndex.value = (activeIndex.value - 1 + total) % total;
          scrollActiveIntoView();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatResults.value[activeIndex.value];
        if (item) {
          selectItem(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    const getDisplayTitle = (item: SearchEntry) => {
      if (item.kind === 'component') {
        return props.isZhCN && item.subtitle && item.path !== '/components/overview'
          ? `${item.title} ${item.subtitle}`
          : props.isZhCN
          ? item.zhTitle
          : item.enTitle;
      }
      return props.isZhCN ? item.zhTitle : item.enTitle;
    };

    const getDisplaySubtitle = (item: SearchEntry) => {
      if (item.kind === 'doc') {
        const other = props.isZhCN ? item.enTitle : item.zhTitle;
        return other && other !== getDisplayTitle(item) ? other : '';
      }
      if (item.path === '/components/overview') {
        return props.isZhCN ? item.enTitle : item.zhTitle;
      }
      if (item.kind === 'tool') {
        return item.subtitle || '';
      }
      return '';
    };

    const getDisplayBadge = (item: SearchEntry) => {
      return props.isZhCN ? item.groupZh : item.groupEn;
    };

    const splitHighlight = (text: string, q: string): Array<{ text: string; hit: boolean }> => {
      const needle = q.trim();
      if (!needle || !text) return [{ text, hit: false }];
      const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'ig');
      const parts = text.split(regex);
      return parts
        .filter(p => p.length > 0)
        .map(p => ({
          text: p,
          hit: p.toLowerCase() === needle.toLowerCase(),
        }));
    };

    return {
      inputRef,
      listRef,
      query,
      activeIndex,
      allEntries,
      groupedResults,
      flatResults,
      closeModal,
      clearQuery,
      selectItem,
      handleInputKeydown,
      getDisplayTitle,
      getDisplaySubtitle,
      getDisplayBadge,
      splitHighlight,
    };
  },
});
</script>

<style lang="less">
.site-search-modal-wrap {
  .ant-modal {
    top: 72px;
    max-width: calc(100vw - 32px);
  }

  .ant-modal-content {
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--color-bg-elevated, var(--component-background));
    border: 1px solid var(--site-border-color-split);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.site-search-panel {
  display: flex;
  flex-direction: column;
  color: var(--site-text-color);
}

.site-search-input-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 54px;
  padding: 0 16px;
  border-bottom: 1px solid var(--site-border-color-split);

  .site-search-bar-icon {
    font-size: 16px;
    color: var(--primary-color);
    flex: none;
  }

  .site-search-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--site-text-color);
    font-size: 15px;

    &::placeholder {
      color: var(--site-text-color-secondary);
      opacity: 0.7;
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  .site-search-clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 0;
    background: transparent;
    color: var(--site-text-color-secondary);
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: var(--site-text-color);
    }
  }

  .site-search-esc-kbd {
    flex: none;
    font-family: inherit;
    font-size: 11px;
    line-height: 18px;
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--site-text-color-secondary);
    background: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
    border: 1px solid var(--site-border-color-split);
    cursor: pointer;
    user-select: none;
  }
}

.site-search-results {
  max-height: min(420px, calc(100vh - 240px));
  overflow-y: auto;
  padding: 8px;
}

.site-search-group-title {
  padding: 8px 10px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--site-text-color-secondary);
  letter-spacing: 0.02em;
}

.site-search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &.active {
    background: var(--primary-color-bg, rgba(22, 119, 255, 0.08));
    color: var(--primary-color);

    .site-search-item-icon {
      color: var(--primary-color);
    }

    .site-search-item-enter {
      opacity: 1;
      color: var(--primary-color);
    }
  }

  .site-search-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
    color: var(--site-text-color-secondary);
    font-size: 14px;
    flex: none;
  }

  .site-search-item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .site-search-item-title {
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .site-search-item-sub {
    font-size: 12px;
    color: var(--site-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .site-search-item-badge {
    flex: none;
    font-size: 11px;
    line-height: 18px;
    padding: 0 7px;
    border-radius: 4px;
    color: var(--site-text-color-secondary);
    background: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
  }

  .site-search-item-enter {
    flex: none;
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
}

.site-search-mark {
  background: transparent;
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 0;
}

.site-search-empty {
  padding: 36px 16px;
}

.site-search-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--site-border-color-split);
  font-size: 12px;
  color: var(--site-text-color-secondary);
  background: var(--color-fill-alter, rgba(0, 0, 0, 0.02));

  .site-search-hints {
    display: flex;
    align-items: center;
    gap: 14px;

    kbd {
      display: inline-block;
      font-family: inherit;
      font-size: 11px;
      line-height: 16px;
      padding: 0 5px;
      margin-inline-end: 3px;
      border-radius: 4px;
      background: var(--component-background);
      border: 1px solid var(--site-border-color-split);
      color: var(--site-text-color-secondary);
    }
  }
}

@media only screen and (max-width: 767.99px) {
  .site-search-footer .site-search-hints {
    display: none;
  }
}
</style>
