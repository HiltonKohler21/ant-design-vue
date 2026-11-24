<template>
  <article>
    <section class="markdown">
      <h1 class="component-doc-title">
        <span>{{ docTitle }}</span>
        <span v-if="isZhCN && docSubtitle" class="subtitle">{{ docSubtitle }}</span>
        <a-tag
          v-if="frontmatter.tag"
          :color="getTagColor(frontmatter.tag)"
          variant="filled"
          class="component-doc-tag"
        >
          {{ getTagLabel(frontmatter.tag) }}
        </a-tag>
        <a-tooltip v-if="docsGithubUrl" :title="$t('app.content.edit-page')">
          <a
            class="edit-button"
            :href="docsGithubUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="$t('app.content.edit-page')"
          >
            <EditOutlined />
          </a>
        </a-tooltip>
      </h1>
      <div v-if="importStatement || sourceGithubUrl || docsGithubUrl" class="component-meta">
        <table class="component-meta-table">
          <tbody>
            <tr v-if="importStatement">
              <th>{{ isZhCN ? '使用' : 'Import' }}</th>
              <td>
                <a-tooltip
                  :title="
                    importCopied
                      ? $t('app.demo.copied')
                      : isZhCN
                      ? '点击复制导入语句'
                      : 'Click to copy'
                  "
                >
                  <button type="button" class="component-meta-import" @click="handleCopyImport">
                    <code>{{ importStatement }}</code>
                    <CheckOutlined v-if="importCopied" class="component-meta-copy-ok" />
                    <CopyOutlined v-else class="component-meta-copy-icon" />
                  </button>
                </a-tooltip>
              </td>
            </tr>
            <tr v-if="sourceGithubUrl">
              <th>{{ isZhCN ? '源码' : 'Source' }}</th>
              <td>
                <a
                  class="component-meta-link"
                  :href="sourceGithubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubOutlined />
                  <span>components/{{ componentSlug }}</span>
                </a>
              </td>
            </tr>
            <tr v-if="docsGithubUrl">
              <th>{{ isZhCN ? '文档' : 'Docs' }}</th>
              <td>
                <a
                  class="component-meta-link"
                  :href="docsGithubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileTextOutlined />
                  <span>index.{{ isZhCN ? 'zh-CN' : 'en-US' }}.md</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <section class="markdown doc-description" v-html="description"></section>
    </section>
    <section v-if="beforeExamples" class="markdown before-examples-section">
      <h2 :id="beforeExamples.id">
        <span>{{ isZhCN ? beforeExamples.title['zh-CN'] : beforeExamples.title['en-US'] }}</span>
        <a :href="'#' + beforeExamples.id" class="anchor">#</a>
      </h2>
      <component :is="beforeExamples.component" />
    </section>
    <section class="markdown examples-header">
      <h2 id="examples" class="examples-title">
        <span>{{ $t('app.component.examples') }}</span>
        <a href="#examples" class="anchor">#</a>
      </h2>
      <div class="examples-actions">
        <a-tooltip
          :title="
            $t(isAllExpanded ? 'app.component.examples.collapse' : 'app.component.examples.expand')
          "
        >
          <a-button
            size="small"
            type="text"
            class="expand-all-btn examples-action-btn"
            :class="{
              'icon-enabled': isAllExpanded,
              'examples-action-btn-active': isAllExpanded,
            }"
            :aria-pressed="isAllExpanded"
            @click="toggleExpandAll"
          >
            <CodeOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip
          :title="
            $t(showDebugDemos ? 'app.component.examples.hide' : 'app.component.examples.visible')
          "
        >
          <a-button
            size="small"
            type="text"
            class="examples-action-btn examples-debug-btn"
            :class="{
              'icon-enabled': showDebugDemos,
              'examples-action-btn-active': showDebugDemos,
              'examples-debug-btn-active': showDebugDemos,
            }"
            :aria-pressed="showDebugDemos"
            :data-has-debug="hasDebugDemos ? 'true' : 'false'"
            @click="toggleDebugDemos"
          >
            <BugOutlined />
          </a-button>
        </a-tooltip>
      </div>
    </section>
    <slot />
    <section v-if="api" class="markdown api-container" v-html="api"></section>
    <section v-if="hasSemanticDom" class="markdown semantic-dom-section">
      <h2 id="semantic-dom">
        <span>{{ isZhCN ? '语义化 DOM' : 'Semantic DOM' }}</span>
        <a href="#semantic-dom" class="anchor">#</a>
      </h2>
      <slot v-if="$slots['semantic-dom']" name="semantic-dom" />
      <SemanticPreview v-else :component="semanticCompName" :is-zh-c-n="isZhCN" />
    </section>
    <section v-if="hasDesignTokens" id="design-tokens" class="markdown design-tokens-section">
      <h2>
        <span>{{ isZhCN ? '主题变量（Design Token）' : 'Design Token' }}</span>
        <a href="#design-tokens" class="anchor">#</a>
      </h2>
      <ComponentTokenTable :component="tokenCompName" />
    </section>
    <Contributor :is-zn="isZhCN" />
  </article>
</template>
<script lang="ts">
import type { ComputedRef, Ref } from 'vue';
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import {
  BugOutlined,
  CheckOutlined,
  CodeOutlined,
  CopyOutlined,
  EditOutlined,
  FileTextOutlined,
  GithubOutlined,
} from '@ant-design/icons-vue';
import tokenData from 'ant-design-vue/es/version/token.json';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import Contributor from '../components/Contributors/index.vue';
import { resolveSemanticComponentName } from '../components/SemanticPreview/semanticsData';

const ComponentTokenTable = defineAsyncComponent(() => import('../components/ComponentTokenTable'));
const SemanticPreview = defineAsyncComponent(
  () => import('../components/SemanticPreview/index.vue'),
);

const API_HEADING_RE = /<h2 id="api">[\s\S]*?<\/h2>/i;

const TOKEN_COMPONENT_ALIAS: Record<string, string> = {
  TimePicker: 'DatePicker',
  AutoComplete: 'Select',
  QRCode: 'QRCode',
};

const IMPORT_OVERRIDES: Record<string, string> = {
  Grid: "import { Row, Col } from 'ant-design-vue';",
  Message: "import { message } from 'ant-design-vue';",
  Notification: "import { notification } from 'ant-design-vue';",
  Icon: "import { HomeOutlined } from '@ant-design/icons-vue';",
};

type TokenEntry = {
  component?: Record<string, any>;
  global?: string[];
};

const tokenMap = tokenData as Record<string, TokenEntry>;
const tokenMetaMap = tokenMeta as Record<string, any>;

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

function getTagColor(tag?: string): string {
  const normalized = String(tag || '')
    .trim()
    .toUpperCase();
  if (normalized === 'DEPRECATED' || normalized.includes('DEPRECATED')) return 'red';
  if (normalized === 'UPDATED') return 'processing';
  return 'success';
}

function resolveTokenCompName(title: string): string {
  const trimmed = String(title || '').trim();
  if (!trimmed) return '';
  const mapped = TOKEN_COMPONENT_ALIAS[trimmed] || trimmed;
  if (tokenMap[mapped]) return mapped;
  const compact = mapped.replace(/[\s-]+/g, '');
  if (tokenMap[compact]) return compact;
  const lower = compact.toLowerCase();
  return Object.keys(tokenMap).find(key => key.toLowerCase() === lower) || '';
}

async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default defineComponent({
  name: 'Demo',
  components: {
    Contributor,
    ComponentTokenTable,
    SemanticPreview,
    BugOutlined,
    CheckOutlined,
    CodeOutlined,
    CopyOutlined,
    EditOutlined,
    FileTextOutlined,
    GithubOutlined,
  },
  props: ['pageData', 'isZhCN', 'beforeExamples'],
  setup(props, { slots }) {
    const route = useRoute();
    const isAllExpanded = ref(false);
    const importCopied = ref(false);
    let copyTimer: ReturnType<typeof setTimeout> | null = null;

    const showDebugDemos = inject<Ref<boolean>>('showDebugDemos', ref(false));
    const toggleDebugDemos = inject<() => void>('toggleDebugDemos', () => {
      showDebugDemos.value = !showDebugDemos.value;
    });
    const hasDebugDemos = inject<ComputedRef<boolean>>(
      'hasDebugDemos',
      computed(() => false),
    );

    provide('isAllExpanded', isAllExpanded);

    const toggleExpandAll = () => {
      isAllExpanded.value = !isAllExpanded.value;
    };

    const getTagLabel = (tag?: string): string => {
      const raw = String(tag || '').trim();
      if (!raw) return '';
      const dict = props.isZhCN ? TAG_LOCALES.cn : TAG_LOCALES.en;
      return dict[raw.toLowerCase()] ?? raw;
    };

    const baseRoutePath = computed(() => route.path.replace(/-cn\/?$/, '').replace(/\/$/, ''));
    watch(baseRoutePath, () => {
      isAllExpanded.value = false;
      importCopied.value = false;
    });

    const frontmatter = computed(() => props?.pageData?.frontmatter || {});
    // 兜底：pageData 在懒加载完成前可能为空，此时用路由 meta 保证标题不缺失
    const docTitle = computed(() => frontmatter.value.title || route.meta?.title || '');
    const docSubtitle = computed(() => frontmatter.value.subtitle || route.meta?.subtitle || '');
    const docHtml = computed(() => props?.pageData?.html || '');

    const componentSlug = computed(() => {
      const rel = props?.pageData?.relativePath || '';
      const relMatch = rel.match(/^components\/([^/]+)\//);
      if (relMatch) return relMatch[1];
      return route.path
        .replace(/^\/components\//, '')
        .replace(/-cn\/?$/, '')
        .replace(/\/$/, '');
    });

    const semanticCompName = computed(() =>
      resolveSemanticComponentName(String(docTitle.value || ''), componentSlug.value),
    );
    const hasSemanticDom = computed(
      () => Boolean(semanticCompName.value) || Boolean(slots['semantic-dom']),
    );

    const htmlParts = computed(() => docHtml.value.split(API_HEADING_RE));
    const description = computed(() => htmlParts.value[0] || '');
    const api = computed(() => {
      const apiBody = htmlParts.value[1];
      if (!apiBody || !apiBody.trim()) {
        return '';
      }
      const normalizedBody = hasSemanticDom.value
        ? apiBody
            .replace(/id="semantic-dom"/gi, 'id="semantic-dom-api"')
            .replace(/href="#semantic-dom"/gi, 'href="#semantic-dom-api"')
        : apiBody;
      return `<h2 id="api"><span>API</span><a href="#api" class="anchor">#</a></h2>\n${normalizedBody}`;
    });

    const importStatement = computed(() => {
      const title = String(docTitle.value || '').trim();
      if (!title) return '';
      if (IMPORT_OVERRIDES[title]) return IMPORT_OVERRIDES[title];
      return `import { ${title} } from 'ant-design-vue';`;
    });

    const sourceGithubUrl = computed(() =>
      componentSlug.value
        ? `https://github.com/vueComponent/ant-design-vue/tree/main/components/${componentSlug.value}`
        : '',
    );

    const docsGithubUrl = computed(() =>
      componentSlug.value
        ? `https://github.com/vueComponent/ant-design-vue/blob/main/components/${
            componentSlug.value
          }/index.${props.isZhCN ? 'zh-CN' : 'en-US'}.md`
        : '',
    );

    const handleCopyImport = async () => {
      const ok = await copyText(importStatement.value);
      if (ok) {
        importCopied.value = true;
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          importCopied.value = false;
        }, 2000);
      }
    };

    const tokenCompName = computed(() => resolveTokenCompName(String(docTitle.value || '')));
    const hasDesignTokens = computed(() => {
      const name = tokenCompName.value;
      if (!name) return false;
      const entry = tokenMap[name];
      if (!entry) return false;
      const compCount = entry.component
        ? Object.keys(entry.component).filter(tokenName => !tokenName.startsWith('_')).length
        : 0;
      const globalCount = Array.isArray(entry.global)
        ? entry.global.filter(
            tokenName =>
              typeof tokenName === 'string' &&
              !tokenName.startsWith('_') &&
              Boolean(tokenMetaMap[tokenName]),
          ).length
        : 0;
      return compCount > 0 || globalCount > 0;
    });

    const setHasDesignTokens = inject<(val: boolean) => void>('setHasDesignTokens', () => {});
    const setHasSemanticDom = inject<(val: boolean) => void>('setHasSemanticDom', () => {});
    watch(
      [hasDesignTokens, tokenCompName, () => route.path],
      () => {
        setHasDesignTokens(hasDesignTokens.value);
      },
      { immediate: true, flush: 'post' },
    );
    watch(
      [hasSemanticDom, semanticCompName, () => route.path],
      () => {
        setHasSemanticDom(hasSemanticDom.value);
      },
      { immediate: true, flush: 'post' },
    );

    onBeforeUnmount(() => {
      if (copyTimer) clearTimeout(copyTimer);
      setHasDesignTokens(false);
      setHasSemanticDom(false);
    });

    return {
      frontmatter,
      docTitle,
      docSubtitle,
      description,
      api,
      route,
      docHtml,
      isAllExpanded,
      toggleExpandAll,
      showDebugDemos,
      hasDebugDemos,
      toggleDebugDemos,
      componentSlug,
      importStatement,
      sourceGithubUrl,
      docsGithubUrl,
      importCopied,
      handleCopyImport,
      semanticCompName,
      hasSemanticDom,
      tokenCompName,
      hasDesignTokens,
      getTagColor,
      getTagLabel,
    };
  },
});
</script>
<style lang="less" scoped>
.component-doc-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  .subtitle {
    margin-inline-start: 4px;
  }

  .component-doc-tag {
    margin-inline-end: 0;
    font-weight: 500;
    line-height: 20px;
  }
}

.component-meta {
  max-width: 100%;
  margin: 0 0 20px;
  padding: 12px 16px;
  overflow-x: auto;
  box-sizing: border-box;
  background: var(--color-fill-alter, var(--site-markdown-code-bg));
  border: 1px solid var(--site-border-color-split);
  border-radius: var(--border-radius-base, 8px);
}

.component-meta-table {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.6;

  th,
  td {
    padding: 4px 0;
    border: 0;
    vertical-align: middle;
    text-align: start;
  }

  th {
    width: 68px;
    padding-inline-end: 16px;
    color: var(--site-text-color-secondary);
    font-weight: 400;
    white-space: nowrap;
  }

  td {
    color: var(--site-text-color);
  }
}

.component-meta-import {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 2px 8px;
  color: var(--site-text-color);
  font-size: 13px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background: var(--site-hover-bg);
    border-color: var(--site-border-color-split);
  }

  code {
    margin: 0;
    padding: 0;
    overflow-x: auto;
    color: inherit;
    font-size: 12.5px;
    font-family: var(--code-family);
    background: transparent;
    border: 0;
    white-space: nowrap;
  }
}

.component-meta-copy-icon {
  color: var(--site-text-color-secondary);
  font-size: 13px;
  flex-shrink: 0;
}

.component-meta-copy-ok {
  color: var(--green-6);
  font-size: 13px;
  flex-shrink: 0;
}

.component-meta-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--site-text-color-secondary);
  font-family: var(--code-family);
  font-size: 12.5px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-color);
  }
}

.examples-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 16px;
}

.examples-title {
  margin: 0;
}

.examples-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.examples-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-color-text-secondary, var(--site-text-color-secondary));
  border: 0;
  transition: color 0.2s, background-color 0.2s, opacity 0.2s;

  &:hover {
    color: var(--ant-color-text, var(--site-text-color));
    background-color: var(--ant-color-fill-tertiary, var(--site-hover-bg));
  }

  &.icon-enabled,
  &.examples-action-btn-active {
    background-color: var(--ant-color-fill-secondary, var(--site-hover-bg));
    opacity: 1;

    :deep(.anticon) {
      color: var(--ant-color-text-base, var(--site-text-color));
      font-weight: bold;
    }
  }

  &.examples-debug-btn-active {
    color: var(--ant-purple-6, var(--purple-6, #722ed1));
    background-color: var(--ant-purple-1, var(--purple-1, #f9f0ff));

    :deep(.anticon) {
      color: var(--ant-purple-6, var(--purple-6, #722ed1));
      font-weight: bold;
    }

    &:hover {
      color: var(--ant-purple-5, var(--purple-5, #9254de));
      background-color: var(--ant-purple-2, var(--purple-2, #efdbff));

      :deep(.anticon) {
        color: var(--ant-purple-5, var(--purple-5, #9254de));
      }
    }
  }
}

.semantic-dom-section,
.design-tokens-section {
  margin-top: 32px;
}
</style>
