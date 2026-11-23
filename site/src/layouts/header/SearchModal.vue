<template>
  <a-modal
    :open="open"
    :footer="null"
    :closable="false"
    :width="620"
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
            isZhCN
              ? '搜索组件、子组件、文档或 Design Token...'
              : 'Search components, subcomponents, docs, or Design Tokens...'
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
              :key="item.id + ':' + group.key"
              :data-search-idx="item._flatIdx"
              class="site-search-item"
              :class="{ active: activeIndex === item._flatIdx }"
              @mouseenter="activeIndex = item._flatIdx"
              @click="selectItem(item)"
            >
              <span class="site-search-item-icon" :class="`kind-${item.kind}`">
                <AppstoreOutlined v-if="item.kind === 'component'" />
                <BranchesOutlined v-else-if="item.kind === 'subcomponent'" />
                <ControlOutlined v-else-if="item.kind === 'token'" />
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
              <span
                v-if="getDisplayBadge(item)"
                class="site-search-item-badge"
                :class="`badge-${item.kind}`"
              >
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
              ? `${baseEntries.length} 篇页面${
                  tokenEntries.length ? ` · ${tokenEntries.length} 个 Token` : ''
                }`
              : `${baseEntries.length} pages${
                  tokenEntries.length ? ` · ${tokenEntries.length} tokens` : ''
                }`
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
  BranchesOutlined,
  CloseCircleFilled,
  ControlOutlined,
  EnterOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { getLocalizedPathname } from '../../utils/util';

type SearchKind = 'component' | 'subcomponent' | 'doc' | 'tool' | 'token';

interface SearchEntry {
  id: string;
  path: string;
  hash?: string;
  kind: SearchKind;
  title: string;
  zhTitle: string;
  enTitle: string;
  subtitle?: string;
  subtitleEn?: string;
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

const QUICK_ACCESS_IDS = [
  '/components/overview',
  '/docs/vue/migration-v43',
  '/docs/vue/common-props',
  '/components/button',
  '/components/table',
  '/components/form',
  '/components/modal',
  '/components/select',
  '/docs/vue/customize-theme',
  '/theme-editor',
];

const DOC_EXTRA_KEYWORDS: Record<string, { zh: string; en: string; keywords: string }> = {
  '/docs/vue/migration-v43': {
    zh: '4.2.6 升级至 4.3.0 完整迁移指南（cssVar、语义化 DOM、新组件）',
    en: '4.2.6 to 4.3.0 migration guide (cssVar, Semantic DOM, new components)',
    keywords: '4.3.0 4.2.6 migration upgrade 迁移 升级 cssvar realtoken zeroruntime',
  },
  '/docs/vue/use-with-vite': {
    zh: '在 Vite 中按需加载、配置主题与 TypeScript',
    en: 'Tree-shaking, theme config and TypeScript setup with Vite',
    keywords: 'vite unplugin-vue-components auto-import 按需引入 构建',
  },
  '/docs/vue/common-props': {
    zh: '通用语义化 classNames / styles、函数式配置与 ConfigProvider',
    en: 'Semantic classNames / styles, functional config & ConfigProvider',
    keywords: 'common props classNames styles semantic dom 语义化 通用属性',
  },
  '/docs/vue/customize-theme': {
    zh: 'Design Token 定制、CSS 变量模式、暗黑与紧凑算法',
    en: 'Design Token customization, CSS Variables, dark & compact algorithms',
    keywords: 'theme token cssvar dark compact seed map alias 定制主题 变量',
  },
};

interface SubcomponentSeed {
  title: string;
  path: string;
  hash: string;
  descZh: string;
  descEn: string;
  keywords: string;
}

const SUBCOMPONENT_SEEDS: SubcomponentSeed[] = [
  {
    title: 'Alert.ErrorBoundary',
    path: '/components/alert',
    hash: '#alert-errorboundary',
    descZh: '错误边界包裹组件，自动捕获子组件渲染异常',
    descEn: 'Error boundary wrapper that catches child component render errors',
    keywords: 'alert error boundary errorboundary 错误边界 异常捕获 4.3.0',
  },
  {
    title: 'Tag.CheckableTagGroup',
    path: '/components/tag',
    hash: '#tag-checkabletaggroup',
    descZh: '可单选或多选的标签组子组件',
    descEn: 'Single or multiple selectable tag group subcomponent',
    keywords: 'tag checkable tag group checkabletaggroup 可选标签组 4.3.0',
  },
  {
    title: 'Image.PreviewGroup',
    path: '/components/image',
    hash: '#image-previewgroup',
    descZh: '多图组合预览，支持 items 配置式数据源',
    descEn: 'Multi-image preview group with declarative items support',
    keywords: 'image preview group previewgroup items 多图预览 画廊 4.3.0',
  },
  {
    title: 'Input.OTP',
    path: '/components/input',
    hash: '#input-otp',
    descZh: '一次性验证码分段输入框',
    descEn: 'One-time password segmented input subcomponent',
    keywords: 'input otp verification code 验证码 一次性密码 4.3.0',
  },
  {
    title: 'Cascader.Panel',
    path: '/components/cascader',
    hash: '#cascader-panel',
    descZh: '独立内联级联选择面板（无浮层包裹）',
    descEn: 'Standalone inline Cascader selection panel without dropdown overlay',
    keywords: 'cascader panel cascaderpanel 级联面板 内联 4.3.0',
  },
  {
    title: 'Statistic.Timer',
    path: '/components/statistic',
    hash: '#api',
    descZh: '支持倒计时（countdown）与正计时（countup）的计时器组件',
    descEn: 'Timer subcomponent supporting both countdown and countup modes',
    keywords: 'statistic timer countdown countup 计时器 倒计时 正计时 4.3.0',
  },
  {
    title: 'Space.Addon',
    path: '/components/space',
    hash: '#api',
    descZh: '配合 Space.Compact 使用的统一风格前后置附加框',
    descEn: 'Compact-styled addon container used alongside Space.Compact',
    keywords: 'space addon compact spaceaddon 前置 后置 附加项 4.3.0',
  },
  {
    title: 'Tooltip.UniqueProvider',
    path: '/components/tooltip',
    hash: '#api',
    descZh: '在多个相邻 Tooltip 之间共享弹层并平滑过渡',
    descEn: 'Shared smooth transition provider across sibling Tooltips',
    keywords: 'tooltip unique provider uniqueprovider 平滑过渡 共享提示 4.3.0',
  },
];

const TOKEN_COMPONENT_SLUG_MAP: Record<string, string> = {
  AutoComplete: 'auto-complete',
  BackTop: 'back-top',
  BorderBeam: 'border-beam',
  ColorPicker: 'color-picker',
  DatePicker: 'date-picker',
  FloatButton: 'float-button',
  FloatButtonGroup: 'float-button',
  InputNumber: 'input-number',
  PageHeader: 'page-header',
  QRCode: 'qrcode',
  RangePicker: 'date-picker',
  TextArea: 'input',
  TimePicker: 'time-picker',
  TreeSelect: 'tree-select',
};

function componentNameToSlug(compName: string): string {
  if (TOKEN_COMPONENT_SLUG_MAP[compName]) {
    return TOKEN_COMPONENT_SLUG_MAP[compName];
  }
  return compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const RECENT_STORAGE_KEY = 'antdv-site-recent-searches';
const MAX_RECENT = 5;
const MAX_TOKEN_RESULTS = 12;

// Module-level cache for lazily loaded Design Token entries
let cachedTokenEntries: SearchEntry[] | null = null;
let tokenLoadPromise: Promise<SearchEntry[]> | null = null;

function buildTokenEntries(rawMeta: Record<string, any>): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const globalMeta: Record<string, any> = rawMeta?.global || {};
  const componentsMeta: Record<string, Record<string, any>> = rawMeta?.components || {};

  Object.entries(globalMeta).forEach(([tokenName, meta]) => {
    if (!meta || tokenName.startsWith('_')) return;
    const descZh = String(meta.desc || meta.name || '').trim();
    const descEn = String(meta.descEn || meta.nameEn || '').trim();
    const source = String(meta.source || 'alias').toLowerCase();
    const hash = source === 'seed' ? '#seedtoken' : source === 'map' ? '#maptoken' : '#aliastoken';
    const path = '/docs/vue/customize-theme';
    const id = `token:global:${tokenName}`;
    const searchText = [tokenName, descZh, descEn, source, meta.type || '', 'design token global']
      .join(' ')
      .toLowerCase();

    entries.push({
      id,
      path,
      hash,
      kind: 'token',
      title: tokenName,
      zhTitle: tokenName,
      enTitle: tokenName,
      subtitle: descZh || `${source} token`,
      subtitleEn: descEn || `${source} token`,
      groupZh: 'Design Token',
      groupEn: 'Design Token',
      slug: tokenName,
      searchText,
    });
  });

  Object.entries(componentsMeta).forEach(([compName, tokenMap]) => {
    if (!tokenMap || typeof tokenMap !== 'object') return;
    const slug = componentNameToSlug(compName);
    const path = `/components/${slug}`;

    Object.entries(tokenMap).forEach(([tokenName, meta]) => {
      if (!meta || tokenName.startsWith('_')) return;
      const fullName = `${compName}.${tokenName}`;
      const descZh = String(meta.desc || meta.name || '').trim();
      const descEn = String(meta.descEn || meta.nameEn || '').trim();
      const id = `token:comp:${fullName}`;
      const searchText = [
        fullName,
        tokenName,
        compName,
        slug,
        descZh,
        descEn,
        meta.type || '',
        'design token component',
      ]
        .join(' ')
        .toLowerCase();

      entries.push({
        id,
        path,
        hash: '#design-tokens',
        kind: 'token',
        title: fullName,
        zhTitle: fullName,
        enTitle: fullName,
        subtitle: descZh || `${compName} 组件变量`,
        subtitleEn: descEn || `${compName} component token`,
        groupZh: 'Design Token',
        groupEn: 'Design Token',
        slug: tokenName,
        searchText,
      });
    });
  });

  return entries;
}

function loadDesignTokenEntries(): Promise<SearchEntry[]> {
  if (cachedTokenEntries) {
    return Promise.resolve(cachedTokenEntries);
  }
  if (!tokenLoadPromise) {
    tokenLoadPromise = import('ant-design-vue/es/version/token-meta.json')
      .then(mod => {
        const raw = (mod as any)?.default || mod || {};
        cachedTokenEntries = buildTokenEntries(raw);
        return cachedTokenEntries;
      })
      .catch(() => {
        tokenLoadPromise = null;
        return [];
      });
  }
  return tokenLoadPromise;
}

function readRecentIds(): string[] {
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

function saveRecentId(id: string) {
  if (typeof localStorage === 'undefined') return;
  const current = readRecentIds().filter(p => p !== id);
  current.unshift(id);
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
    BranchesOutlined,
    CloseCircleFilled,
    ControlOutlined,
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
    const recentIds = ref<string[]>(readRecentIds());
    const tokenEntries = ref<SearchEntry[]>(cachedTokenEntries || []);

    const baseEntries = computed<SearchEntry[]>(() => {
      const routes = router.getRoutes();
      const map = new Map<string, SearchEntry>();

      const addEntry = (entry: Omit<SearchEntry, 'id' | 'searchText'>, extraKeywords = '') => {
        const id = entry.hash ? `${entry.path}${entry.hash}` : entry.path;
        const cleanSlug = entry.slug.replace(/-/g, '');
        const searchText = [
          entry.title,
          entry.zhTitle,
          entry.enTitle,
          entry.subtitle || '',
          entry.subtitleEn || '',
          entry.groupZh,
          entry.groupEn,
          entry.slug,
          cleanSlug,
          entry.tag || '',
          extraKeywords,
        ]
          .join(' ')
          .toLowerCase();
        map.set(id, { ...entry, id, searchText });
      };

      addEntry({
        path: '/components/overview',
        kind: 'component',
        title: 'Components Overview',
        zhTitle: '组件总览',
        enTitle: 'Components Overview',
        subtitle: '全部组件',
        subtitleEn: 'All Components',
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
        subtitleEn: 'Visual Design Token Editor',
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
          const docExtra = DOC_EXTRA_KEYWORDS[basePath];

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
              existing.subtitle || '',
              existing.subtitleEn || '',
              existing.groupZh,
              existing.groupEn,
              existing.slug,
              existing.slug.replace(/-/g, ''),
              existing.tag || '',
              docExtra?.keywords || '',
            ]
              .join(' ')
              .toLowerCase();
          } else {
            addEntry(
              {
                path: basePath,
                kind: 'doc',
                title: enTitleVal,
                zhTitle: titleVal,
                enTitle: enTitleVal,
                subtitle: docExtra?.zh,
                subtitleEn: docExtra?.en,
                groupZh,
                groupEn,
                tag: r.meta.tag ? String(r.meta.tag) : undefined,
                slug,
              },
              docExtra?.keywords || '',
            );
          }
        }
      }

      SUBCOMPONENT_SEEDS.forEach(sub => {
        const cleanSlug = sub.title.toLowerCase().replace(/\./g, '-');
        addEntry(
          {
            path: sub.path,
            hash: sub.hash,
            kind: 'subcomponent',
            title: sub.title,
            zhTitle: sub.title,
            enTitle: sub.title,
            subtitle: sub.descZh,
            subtitleEn: sub.descEn,
            groupZh: '子组件',
            groupEn: 'Subcomponent',
            tag: '4.3.0',
            slug: cleanSlug,
          },
          sub.keywords,
        );
      });

      return Array.from(map.values());
    });

    const entryLookupMap = computed(() => {
      const m = new Map<string, SearchEntry>();
      baseEntries.value.forEach(e => m.set(e.id, e));
      tokenEntries.value.forEach(e => m.set(e.id, e));
      return m;
    });

    const scoreEntry = (entry: SearchEntry, q: string, tokens: string[]): number => {
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
        const lookup = entryLookupMap.value;
        const recentItems = recentIds.value
          .map(id => lookup.get(id))
          .filter((e): e is SearchEntry => !!e);
        if (recentItems.length) {
          groups.push({
            key: 'recent',
            label: props.isZhCN ? '最近访问' : 'Recent',
            items: recentItems.map(item => ({ ...item, _flatIdx: idx++ })),
          });
        }
        const recentSet = new Set(recentItems.map(i => i.id));
        const quickItems = QUICK_ACCESS_IDS.filter(id => !recentSet.has(id))
          .map(id => lookup.get(id))
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

      const queryTokens = trimmed.split(/\s+/).filter(Boolean);

      const scoredBase = baseEntries.value
        .map(entry => ({ entry, score: scoreEntry(entry, trimmed, queryTokens) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

      const compItems = scoredBase.filter(x => x.entry.kind === 'component').map(x => x.entry);
      const subCompItems = scoredBase
        .filter(x => x.entry.kind === 'subcomponent')
        .map(x => x.entry);
      const docItems = scoredBase
        .filter(x => x.entry.kind === 'doc' || x.entry.kind === 'tool')
        .map(x => x.entry);

      if (compItems.length) {
        groups.push({
          key: 'components',
          label: props.isZhCN ? '组件' : 'Components',
          items: compItems.map(item => ({ ...item, _flatIdx: idx++ })),
        });
      }
      if (subCompItems.length) {
        groups.push({
          key: 'subcomponents',
          label: props.isZhCN ? '子组件' : 'Subcomponents',
          items: subCompItems.map(item => ({ ...item, _flatIdx: idx++ })),
        });
      }
      if (docItems.length) {
        groups.push({
          key: 'docs',
          label: props.isZhCN ? '文档与工具' : 'Docs & Tools',
          items: docItems.map(item => ({ ...item, _flatIdx: idx++ })),
        });
      }

      if (trimmed.length >= 2 && tokenEntries.value.length) {
        const scoredTokens = tokenEntries.value
          .map(entry => ({ entry, score: scoreEntry(entry, trimmed, queryTokens) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
          .slice(0, MAX_TOKEN_RESULTS)
          .map(x => x.entry);

        if (scoredTokens.length) {
          groups.push({
            key: 'tokens',
            label: 'Design Token',
            items: scoredTokens.map(item => ({ ...item, _flatIdx: idx++ })),
          });
        }
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
          recentIds.value = readRecentIds();
          activeIndex.value = 0;
          if (!tokenEntries.value.length) {
            loadDesignTokenEntries().then(entries => {
              tokenEntries.value = entries;
            });
          }
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
      saveRecentId(item.id);
      recentIds.value = readRecentIds();
      closeModal();
      const target = getLocalizedPathname(item.path, props.isZhCN);
      router.push({
        path: target.path,
        query: target.query,
        hash: item.hash || undefined,
      });
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
      if (item.kind === 'subcomponent' || item.kind === 'token') {
        return props.isZhCN ? item.subtitle || '' : item.subtitleEn || item.subtitle || '';
      }
      if (item.kind === 'doc') {
        const explicit = props.isZhCN ? item.subtitle : item.subtitleEn;
        if (explicit) return explicit;
        const other = props.isZhCN ? item.enTitle : item.zhTitle;
        return other && other !== getDisplayTitle(item) ? other : '';
      }
      if (item.path === '/components/overview') {
        return props.isZhCN ? item.enTitle : item.zhTitle;
      }
      if (item.kind === 'tool') {
        return props.isZhCN ? item.subtitle || '' : item.subtitleEn || item.subtitle || '';
      }
      return '';
    };

    const getDisplayBadge = (item: SearchEntry) => {
      if (item.kind === 'component') {
        return props.isZhCN ? '组件' : 'Component';
      }
      if (item.kind === 'subcomponent') {
        return props.isZhCN ? '子组件' : 'Subcomponent';
      }
      if (item.kind === 'token') {
        return 'Design Token';
      }
      if (item.kind === 'doc') {
        return props.isZhCN ? '文档' : 'Doc';
      }
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
      baseEntries,
      tokenEntries,
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
  max-height: min(440px, calc(100vh - 240px));
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

    &.kind-subcomponent {
      color: #722ed1;
    }

    &.kind-token {
      color: #d46b08;
    }
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

    &.badge-component {
      color: var(--primary-color, #1677ff);
      background: var(--primary-color-bg, rgba(22, 119, 255, 0.1));
    }

    &.badge-subcomponent {
      color: #722ed1;
      background: rgba(114, 46, 209, 0.1);
    }

    &.badge-doc {
      color: #08979c;
      background: rgba(19, 194, 194, 0.1);
    }

    &.badge-token {
      color: #d46b08;
      background: rgba(250, 140, 22, 0.12);
    }
  }

  .site-search-item-enter {
    flex: none;
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
}

html[data-doc-theme='dark'] .site-search-item {
  .site-search-item-icon {
    &.kind-subcomponent {
      color: #b37feb;
    }

    &.kind-token {
      color: #ffa940;
    }
  }

  .site-search-item-badge {
    &.badge-subcomponent {
      color: #b37feb;
      background: rgba(179, 127, 235, 0.16);
    }

    &.badge-doc {
      color: #36cfc9;
      background: rgba(54, 207, 201, 0.16);
    }

    &.badge-token {
      color: #ffa940;
      background: rgba(255, 169, 64, 0.16);
    }
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
