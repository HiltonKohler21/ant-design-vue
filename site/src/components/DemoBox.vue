<template>
  <template v-if="inIframe">
    <div :id="sectionId"><slot /></div>
  </template>
  <VersionRibbonWrapper v-else-if="!isDebug || showDebugDemos" :version="demoVersion">
    <section
      :id="sectionId"
      :class="[
        'code-box',
        {
          expand: codeExpand,
          'code-box-debug': isDebug,
          'code-box-compact': isCompact || Boolean(iframeSrc),
          'code-box-simplify': isSimplify && !iframeSrc,
        },
      ]"
    >
      <section class="code-box-demo notranslate" translate="no" :style="codeBoxDemoStyle">
        <template v-if="iframeSrc">
          <div class="browser-mockup with-url">
            <iframe
              :src="iframeSrc"
              :height="iframeHeight"
              loading="lazy"
              title="demo"
              class="iframe-demo"
            />
          </div>
        </template>
        <template v-else>
          <slot />
        </template>
      </section>
      <section v-if="!isSimplify || iframeSrc" class="code-box-meta markdown">
        <div class="code-box-title">
          <a-tooltip v-if="isDebug" :title="$t('app.demo.debug')">
            <a :href="`#${sectionId}`">{{ title }}</a>
          </a-tooltip>
          <a v-else :href="`#${sectionId}`">{{ title }}</a>
          <a-tooltip v-if="editGithubUrl" :title="$t('app.content.edit-demo')">
            <a
              class="edit-button"
              :href="editGithubUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('app.content.edit-demo')"
            >
              <EditOutlined />
            </a>
          </a-tooltip>
        </div>
        <div class="code-box-description" v-html="docHtml"></div>
        <div class="code-box-actions">
          <a-dropdown
            v-if="showDebugDemos && hasDebugDropdownItems"
            :arrow="{ pointAtCenter: true }"
          >
            <a-button
              color="purple"
              variant="filled"
              size="small"
              class="code-box-debug-action"
              :aria-label="$t('app.demo.debug.actions')"
            >
              <template #icon><BugOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu class="code-box-debug-menu">
                <a-menu-item v-if="antdOnlineUrl" key="online">
                  <template #icon>
                    <a-tag variant="filled" color="blue">ant.design</a-tag>
                  </template>
                  <a
                    aria-label="Go to online documentation"
                    :href="antdOnlineUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ $t('app.demo.online') }}
                  </a>
                </a-menu-item>
                <a-menu-item v-if="editGithubUrl" key="github">
                  <template #icon>
                    <a-tag variant="filled" color="purple">GitHub</a-tag>
                  </template>
                  <a
                    aria-label="Edit this demo on GitHub"
                    :href="editGithubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ $t('app.content.edit-demo') }}
                  </a>
                </a-menu-item>
                <a-menu-item v-if="sectionId" key="copy-id" @click="handleCopyDemoId">
                  <template #icon>
                    <a-tag variant="filled" color="geekblue">#ID</a-tag>
                  </template>
                  <span>
                    {{ demoIdCopied ? $t('app.demo.copied') : $t('app.demo.debug.copyId') }}
                  </span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-tooltip :title="$t('app.demo.codesandbox')">
            <span
              class="code-box-code-action"
              tabindex="0"
              :aria-label="$t('app.demo.codesandbox')"
              @click="handleCodeSandbox"
              @keydown.enter="handleCodeSandbox"
              @keydown.space.prevent="handleCodeSandbox"
            >
              <CodeSandboxOutlined />
            </span>
          </a-tooltip>
          <a-tooltip :title="$t('app.demo.stackblitz')">
            <span
              class="code-box-code-action"
              tabindex="0"
              :aria-label="$t('app.demo.stackblitz')"
              @click="handleStackBlitz"
              @keydown.enter="handleStackBlitz"
              @keydown.space.prevent="handleStackBlitz"
            >
              <ThunderboltOutlined />
            </span>
          </a-tooltip>
          <a-tooltip
            :title="$t(`app.demo.${copied ? 'copied' : 'copy'}`)"
            :open="copyTooltipVisible"
            @openChange="onCopyTooltipVisibleChange"
          >
            <span
              class="code-box-code-action code-box-code-copy"
              :class="{ 'code-box-code-copied': copied }"
              tabindex="0"
              :aria-label="$t('app.demo.copy')"
              @click="handleCopyCode"
              @keydown.enter="handleCopyCode"
              @keydown.space.prevent="handleCopyCode"
            >
              <CheckOutlined v-if="copied" class="anticon-check" />
              <CopyOutlined v-else />
            </span>
          </a-tooltip>
          <a-tooltip :title="$t(`app.demo.type.${type === 'JS' ? 'js' : 'ts'}`)">
            <span class="code-box-type-switch">
              <span
                class="code-box-type-item"
                :class="{ active: type === 'TS' }"
                tabindex="0"
                @click="handleChangeType('TS')"
                @keydown.enter="handleChangeType('TS')"
                @keydown.space.prevent="handleChangeType('TS')"
              >
                TS
              </span>
              <span
                class="code-box-type-item"
                :class="{ active: type === 'JS' }"
                tabindex="0"
                @click="handleChangeType('JS')"
                @keydown.enter="handleChangeType('JS')"
                @keydown.space.prevent="handleChangeType('JS')"
              >
                JS
              </span>
            </span>
          </a-tooltip>
          <a-tooltip :title="$t(`app.demo.code.${codeExpand ? 'hide' : 'show'}`)">
            <span
              class="code-box-code-action code-box-expand-btn"
              :class="{ 'code-box-expand-btn-active': codeExpand }"
              tabindex="0"
              :aria-expanded="codeExpand"
              :aria-label="$t(`app.demo.code.${codeExpand ? 'hide' : 'show'}`)"
              @click="handleCodeExpand"
              @keydown.enter="handleCodeExpand"
              @keydown.space.prevent="handleCodeExpand"
            >
              <svg
                v-if="codeExpand"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="8 6 2 12 8 18" />
                <polyline points="16 6 22 12 16 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="8 6 2 12 8 18" />
                <polyline points="16 6 22 12 16 18" />
              </svg>
            </span>
          </a-tooltip>
        </div>
      </section>
      <section :class="highlightClass">
        <div ref="codeRef" class="highlight">
          <slot v-if="type === 'TS'" name="htmlCode" />
          <slot v-else name="jsVersionHtml" />
        </div>
        <div
          tabindex="0"
          role="button"
          class="code-box-hide-btn"
          :aria-label="$t('app.demo.code.hide')"
          @click="handleCodeExpand($event, sectionId)"
          @keydown.enter="handleCodeExpand($event, sectionId)"
          @keydown.space.prevent="handleCodeExpand($event, sectionId)"
        >
          <UpOutlined />
          <span>{{ $t('app.demo.code.hide.simplify') }}</span>
        </div>
      </section>
    </section>
  </VersionRibbonWrapper>
</template>

<script lang="ts">
import type { CSSProperties, Ref } from 'vue';
import type { GlobalConfig } from '../type';
import { GLOBAL_CONFIG } from '../SymbolKey';
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { BadgeRibbon } from 'ant-design-vue';
import {
  BugOutlined,
  CheckOutlined,
  CodeSandboxOutlined,
  CopyOutlined,
  EditOutlined,
  ThunderboltOutlined,
  UpOutlined,
} from '@ant-design/icons-vue';
import { getCodeSandboxParams, getStackBlitzParams } from '../utils/generateOnlineDemo';
import packageInfo from '../../../package.json';

const ZH_HEADING_RE = /<h2 id="zh-cn">[\s\S]*?<\/h2>/i;
const EN_HEADING_RE = /<h2 id="en-us">[\s\S]*?<\/h2>/i;

function decodeBase64(str?: string): string {
  if (!str || typeof str !== 'string') return '';
  try {
    const binary = window.atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder('utf-8').decode(bytes);
    }
    return decodeURIComponent(
      Array.from(bytes, b => `%${b.toString(16).padStart(2, '0')}`).join(''),
    );
  } catch {
    return '';
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
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

function submitPostForm(action: string, fields: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.target = '_blank';
  form.style.display = 'none';
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

const VersionRibbonWrapper = defineComponent({
  name: 'VersionRibbonWrapper',
  props: {
    version: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.();
      if (props.version) {
        return h(
          BadgeRibbon,
          {
            text: props.version,
            color: props.version.includes('<') ? 'red' : undefined,
          },
          { default: () => children },
        );
      }
      return children && children.length === 1 ? children[0] : children;
    };
  },
});

export default defineComponent({
  name: 'DemoBox',
  components: {
    VersionRibbonWrapper,
    BugOutlined,
    CheckOutlined,
    CodeSandboxOutlined,
    CopyOutlined,
    EditOutlined,
    ThunderboltOutlined,
    UpOutlined,
  },
  props: {
    jsfiddle: Object,
  },
  setup(props) {
    const route = useRoute();
    const codeExpand = ref(false);
    const type = ref<'TS' | 'JS'>('TS');
    const copyTooltipVisible = ref(false);
    const copied = ref(false);
    const demoIdCopied = ref(false);
    const codeRef = ref<HTMLDivElement>();
    let copyTimer: ReturnType<typeof setTimeout> | null = null;
    let demoIdCopyTimer: ReturnType<typeof setTimeout> | null = null;

    const sectionId = computed(() => {
      const relativePath = props.jsfiddle?.relativePath || '';
      return `${relativePath.split('/').join('-').replace('.vue', '')}`.toLocaleLowerCase();
    });

    const isDebug = computed(() => Boolean(props.jsfiddle?.debug));
    const isCompact = computed(() => Boolean(props.jsfiddle?.compact));
    const isSimplify = computed(() => Boolean(props.jsfiddle?.simplify));
    const demoVersion = computed(() =>
      props.jsfiddle?.version != null && props.jsfiddle?.version !== ''
        ? String(props.jsfiddle.version)
        : '',
    );
    const inIframe = inject('inIframe', false);
    const isAllExpanded = inject<Ref<boolean>>('isAllExpanded', ref(false));
    const showDebugDemos = inject<Ref<boolean>>('showDebugDemos', ref(false));
    const themeMode = inject<{ theme: Ref<string> }>('themeMode', { theme: ref('light') });
    const theme = computed(() => themeMode.theme.value);
    const isDark = computed(() => theme.value === 'dark');
    const iframeDemo = inject<Record<string, string>>('iframeDemo', {});
    const addDemosInfo = inject<(info: any) => void>('addDemosInfo', () => {});
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);

    watch(
      () => isAllExpanded?.value,
      val => {
        if (typeof val === 'boolean') {
          codeExpand.value = val;
        }
      },
    );

    const zhTitle = computed(() =>
      typeof props.jsfiddle?.title === 'string'
        ? props.jsfiddle.title
        : props.jsfiddle?.title?.['zh-CN'] || '',
    );
    const enTitle = computed(() =>
      typeof props.jsfiddle?.title === 'string'
        ? props.jsfiddle.title
        : props.jsfiddle?.title?.['en-US'] || '',
    );
    const title = computed(() =>
      globalConfig.isZhCN.value ? zhTitle.value || enTitle.value : enTitle.value || zhTitle.value,
    );

    const editGithubUrl = computed(() => {
      const relativePath = props.jsfiddle?.relativePath || '';
      return relativePath
        ? `https://github.com/vueComponent/ant-design-vue/edit/main/${relativePath}`
        : '';
    });

    const antdOnlineUrl = computed(() => {
      const relativePath = String(props.jsfiddle?.relativePath || '');
      const relMatch = relativePath.match(/^components\/([^/]+)\/demo\/(.+?)(?:\.vue)?$/i);
      let slug = relMatch ? relMatch[1] : '';
      const routePath = typeof route?.path === 'string' ? route.path : '';
      if (!slug && routePath) {
        const pathMatch = routePath.match(/^\/components\/([^/]+?)(?:-cn)?\/?$/i);
        if (pathMatch) {
          slug = pathMatch[1];
        }
      }
      if (!slug) return '';
      const normalizedSlug = slug.toLowerCase();
      const langSuffix = globalConfig?.isZhCN?.value ? '-cn' : '';
      const demoName = relMatch ? relMatch[2].replace(/\//g, '-').toLowerCase() : '';
      const anchor = demoName ? `#${normalizedSlug}-demo-${demoName}` : '';
      return `https://ant.design/components/${normalizedSlug}${langSuffix}${anchor}`;
    });

    const hasDebugDropdownItems = computed(() =>
      Boolean(antdOnlineUrl.value || editGithubUrl.value || sectionId.value),
    );

    const iframeDemoKey = computed(() => {
      const en = enTitle.value;
      return en ? String(en).split(' ').join('-').toLowerCase() : '';
    });

    const iframeSrc = computed(() => {
      if (iframeDemo[iframeDemoKey.value]) {
        return iframeDemo[iframeDemoKey.value];
      }
      const raw = props.jsfiddle?.iframe;
      if (typeof raw === 'string' && /^(https?:)?\//.test(raw)) {
        return raw;
      }
      return '';
    });

    const iframeHeight = computed(() => {
      const raw = props.jsfiddle?.iframe;
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string' && /^\d+(px)?$/.test(raw.trim())) return raw;
      return undefined;
    });

    const codeBoxDemoStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {};
      if (iframeSrc.value || isCompact.value) {
        style.padding = 0;
        style.overflow = 'hidden';
      }
      if (props.jsfiddle?.background === 'grey') {
        style.backgroundColor = isDark.value ? '#303030' : '#f0f2f5';
      }
      return style;
    });

    const sourceCode = computed(() => decodeBase64(props.jsfiddle?.sourceCode));
    const jsSourceCode = computed(() => decodeBase64(props.jsfiddle?.jsSourceCode));
    const activeCode = computed(() =>
      type.value === 'TS' ? sourceCode.value : jsSourceCode.value || sourceCode.value,
    );

    const docHtml = computed(() => {
      const rawDoc = props.jsfiddle?.docHtml;
      if (!rawDoc) return '';
      const stripped = rawDoc.replace(ZH_HEADING_RE, '');
      const parts = stripped.split(EN_HEADING_RE);
      return (parts[globalConfig.isZhCN.value ? 0 : 1] || '').trim();
    });

    const onCopyTooltipVisibleChange = (visible: boolean) => {
      copyTooltipVisible.value = visible;
      if (visible) {
        copied.value = false;
      }
    };

    const handleCopyCode = async () => {
      const ok = await copyToClipboard(activeCode.value);
      if (ok) {
        copied.value = true;
        copyTooltipVisible.value = true;
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          copied.value = false;
        }, 2000);
      }
    };

    const handleCopyDemoId = async () => {
      if (!sectionId.value) return;
      const ok = await copyToClipboard(`#${sectionId.value}`);
      if (ok) {
        demoIdCopied.value = true;
        if (demoIdCopyTimer) clearTimeout(demoIdCopyTimer);
        demoIdCopyTimer = setTimeout(() => {
          demoIdCopied.value = false;
        }, 2000);
      }
    };

    const handleCodeExpand = (_event?: Event, targetId?: string) => {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < 80) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
      codeExpand.value = !codeExpand.value;
    };

    const handleChangeType = (nextType?: 'TS' | 'JS') => {
      const target = nextType || (type.value === 'TS' ? 'JS' : 'TS');
      type.value = target;
      if (!codeExpand.value) {
        codeExpand.value = true;
      }
    };

    const handleCodeSandbox = () => {
      const code = activeCode.value;
      if (!code) return;
      const params = getCodeSandboxParams(code, {
        title: `${title.value} - ant-design-vue@${packageInfo.version}`,
      });
      submitPostForm('https://codesandbox.io/api/v1/sandboxes/define', {
        parameters: params,
      });
    };

    const handleStackBlitz = () => {
      const code = activeCode.value;
      if (!code) return;
      const fields = getStackBlitzParams(code, {
        title: `${title.value} - ant-design-vue@${packageInfo.version}`,
      });
      submitPostForm('https://stackblitz.com/run?file=src%2Fdemo.vue', fields);
    };

    const highlightClass = computed(() => ({
      'highlight-wrapper': true,
      'highlight-wrapper-expand': codeExpand.value,
    }));

    onMounted(() => {
      addDemosInfo({
        href: `#${sectionId.value}`,
        title,
        enTitle,
        debug: isDebug.value,
      });
      if (
        typeof window !== 'undefined' &&
        sectionId.value &&
        window.location.hash.toLocaleLowerCase() === `#${sectionId.value}`
      ) {
        nextTick(() => {
          const el = document.getElementById(sectionId.value);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < 64 || rect.top > window.innerHeight - 100) {
              window.scrollTo({
                top: Math.max(0, window.scrollY + rect.top - 80),
                behavior: 'auto',
              });
            }
          }
        });
      }
    });

    onBeforeUnmount(() => {
      if (copyTimer) clearTimeout(copyTimer);
      if (demoIdCopyTimer) clearTimeout(demoIdCopyTimer);
    });

    return {
      docHtml,
      iframeDemo,
      iframeDemoKey,
      iframeSrc,
      iframeHeight,
      inIframe,
      theme,
      type,
      isZhCN: globalConfig.isZhCN,
      isDebug,
      isCompact,
      isSimplify,
      demoVersion,
      codeBoxDemoStyle,
      showDebugDemos,
      sectionId,
      title,
      editGithubUrl,
      antdOnlineUrl,
      hasDebugDropdownItems,
      codeExpand,
      copyTooltipVisible,
      copied,
      demoIdCopied,
      onCopyTooltipVisibleChange,
      handleCopyCode,
      handleCopyDemoId,
      handleCodeExpand,
      handleChangeType,
      highlightClass,
      sourceCode,
      jsSourceCode,
      codeRef,
      handleCodeSandbox,
      handleStackBlitz,
    };
  },
});
</script>

<style></style>
