<template>
  <template v-if="inIframe">
    <div :id="sectionId"><slot /></div>
  </template>
  <section
    v-else
    v-show="!isDebug || showDebugDemos"
    :id="sectionId"
    :class="['code-box', { expand: codeExpand, 'code-box-debug': isDebug }]"
  >
    <section class="code-box-demo">
      <template v-if="iframeDemo[iframeDemoKey]">
        <div class="browser-mockup with-url">
          <iframe :src="iframeDemo[iframeDemoKey]" :height="iframeHeight" />
        </div>
      </template>
      <template v-else>
        <slot />
      </template>
    </section>
    <section class="code-box-meta markdown">
      <div class="code-box-title">
        <a :href="`#${sectionId}`">{{ title }}</a>
        <a-tooltip v-if="isDebug" :title="$t('app.demo.debug')">
          <span class="code-box-debug-tag">Debug</span>
        </a-tooltip>
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
      <div class="code-box-actions code-box-actions-bottom">
        <a-tooltip :title="$t('app.demo.code.hide')">
          <span
            class="code-box-code-action code-box-expand-btn code-box-expand-btn-active"
            tabindex="0"
            :aria-label="$t('app.demo.code.hide')"
            @click="handleCodeExpand($event, sectionId)"
            @keydown.enter="handleCodeExpand($event, sectionId)"
            @keydown.space.prevent="handleCodeExpand($event, sectionId)"
          >
            <svg
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
          </span>
        </a-tooltip>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import type { GlobalConfig } from '../type';
import { GLOBAL_CONFIG } from '../SymbolKey';
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  CheckOutlined,
  CodeSandboxOutlined,
  CopyOutlined,
  EditOutlined,
  ThunderboltOutlined,
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

export default defineComponent({
  name: 'DemoBox',
  components: {
    CheckOutlined,
    CodeSandboxOutlined,
    CopyOutlined,
    EditOutlined,
    ThunderboltOutlined,
  },
  props: {
    jsfiddle: Object,
  },
  setup(props) {
    const codeExpand = ref(false);
    const type = ref<'TS' | 'JS'>('TS');
    const copyTooltipVisible = ref(false);
    const copied = ref(false);
    const codeRef = ref<HTMLDivElement>();
    let copyTimer: ReturnType<typeof setTimeout> | null = null;

    const sectionId = computed(() => {
      const relativePath = props.jsfiddle?.relativePath || '';
      return `${relativePath.split('/').join('-').replace('.vue', '')}`.toLocaleLowerCase();
    });

    const isDebug = computed(() => Boolean(props.jsfiddle?.debug));
    const inIframe = inject('inIframe', false);
    const isAllExpanded = inject<Ref<boolean>>('isAllExpanded', ref(false));
    const showDebugDemos = inject<Ref<boolean>>('showDebugDemos', ref(true));
    const registerDebugDemo = inject<(id: string) => void>('registerDebugDemo', () => {});
    const themeMode = inject<{ theme: Ref<string> }>('themeMode', { theme: ref('light') });
    const theme = computed(() => themeMode.theme.value);
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

    const iframeHeight = computed(() => props.jsfiddle?.iframe);
    const zhTitle = computed(() => props.jsfiddle?.title?.['zh-CN'] || '');
    const enTitle = computed(() => props.jsfiddle?.title?.['en-US'] || '');
    const title = computed(() =>
      globalConfig.isZhCN.value ? zhTitle.value || enTitle.value : enTitle.value || zhTitle.value,
    );

    const editGithubUrl = computed(() => {
      const relativePath = props.jsfiddle?.relativePath || '';
      return relativePath
        ? `https://github.com/vueComponent/ant-design-vue/edit/main/${relativePath}`
        : '';
    });

    const iframeDemoKey = computed(() => {
      const en = enTitle.value;
      return en ? String(en).split(' ').join('-').toLowerCase() : '';
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
      if (isDebug.value) {
        registerDebugDemo(sectionId.value);
      }
      addDemosInfo({
        href: `#${sectionId.value}`,
        title,
        enTitle,
      });
    });

    onBeforeUnmount(() => {
      if (copyTimer) clearTimeout(copyTimer);
    });

    return {
      docHtml,
      iframeDemo,
      iframeDemoKey,
      iframeHeight,
      inIframe,
      theme,
      type,
      isZhCN: globalConfig.isZhCN,
      isDebug,
      showDebugDemos,
      sectionId,
      title,
      editGithubUrl,
      codeExpand,
      copyTooltipVisible,
      copied,
      onCopyTooltipVisibleChange,
      handleCopyCode,
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
