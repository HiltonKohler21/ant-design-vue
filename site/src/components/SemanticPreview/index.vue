<template>
  <div v-if="config" class="semantic-preview-card">
    <div class="semantic-preview-main">
      <!-- Left interactive live stage -->
      <div ref="stageRef" class="semantic-preview-stage">
        <SemanticStage
          :component="config.component"
          :active-semantic="activeSemantic"
          :is-zh-c-n="isZhCN"
        />
        <div
          class="semantic-highlight-box"
          :class="{ 'semantic-highlight-visible': highlightRect.visible }"
          :style="highlightStyle"
          aria-hidden="true"
        >
          <span v-if="activeSemantic" class="semantic-highlight-label">{{ activeSemantic }}</span>
        </div>
      </div>

      <!-- Right semantic slot list -->
      <div class="semantic-preview-panel">
        <div class="semantic-panel-header">
          <span class="semantic-panel-title">
            {{ isZhCN ? '语义化槽位' : 'Semantic Slots' }}
            <span class="semantic-panel-count">({{ config.semantics.length }})</span>
          </span>
          <a-tooltip
            :title="
              showCode
                ? isZhCN
                  ? '隐藏使用示例'
                  : 'Hide usage snippet'
                : isZhCN
                ? '查看 Vue 3 用法示例'
                : 'Show Vue 3 usage snippet'
            "
          >
            <a-button
              size="small"
              type="text"
              class="semantic-code-toggle"
              :class="{ 'semantic-code-toggle-active': showCode }"
              @click="showCode = !showCode"
            >
              <CodeOutlined />
              <span>{{ isZhCN ? '用法' : 'Usage' }}</span>
            </a-button>
          </a-tooltip>
        </div>

        <ul class="semantic-slot-list" @mouseleave="handleListLeave">
          <li
            v-for="item in config.semantics"
            :key="item.name"
            class="semantic-slot-item"
            :class="{
              'semantic-slot-active': activeSemantic === item.name,
              'semantic-slot-pinned': pinnedSemantic === item.name,
            }"
            role="button"
            tabindex="0"
            @mouseenter="handleHover(item.name)"
            @focus="handleHover(item.name)"
            @click="handleSelect(item.name)"
            @keydown.enter.prevent="handleSelect(item.name)"
            @keydown.space.prevent="handleSelect(item.name)"
          >
            <div class="semantic-slot-head">
              <code class="semantic-slot-key">{{ item.name }}</code>
              <span v-if="item.isPopup" class="semantic-slot-tag">popup</span>
              <span v-if="item.version" class="semantic-slot-tag">{{ item.version }}</span>
              <a-tooltip
                :title="
                  copiedKey === item.name
                    ? isZhCN
                      ? '已复制'
                      : 'Copied'
                    : isZhCN
                    ? '点击复制槽位名'
                    : 'Copy slot key'
                "
              >
                <button
                  type="button"
                  class="semantic-slot-copy"
                  :aria-label="`Copy ${item.name}`"
                  @click.stop="handleCopyKey(item.name)"
                >
                  <CheckOutlined v-if="copiedKey === item.name" class="semantic-copy-ok" />
                  <CopyOutlined v-else />
                </button>
              </a-tooltip>
            </div>
            <p class="semantic-slot-desc">
              {{ isZhCN ? item.descZh : item.descEn }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Toggleable Vue 3 usage snippet -->
    <div v-if="showCode" class="semantic-code-drawer">
      <div class="semantic-code-toolbar">
        <div class="semantic-code-tabs">
          <button
            type="button"
            class="semantic-code-tab"
            :class="{ active: snippetMode === 'object' }"
            @click="snippetMode = 'object'"
          >
            {{ isZhCN ? '静态对象' : 'Static Object' }}
          </button>
          <button
            v-if="config.functional"
            type="button"
            class="semantic-code-tab"
            :class="{ active: snippetMode === 'function' }"
            @click="snippetMode = 'function'"
          >
            {{ isZhCN ? '函数式 (info) => ({ ... })' : 'Functional (info) => ({ ... })' }}
          </button>
        </div>
        <a-button size="small" type="text" @click="handleCopySnippet">
          <CheckOutlined v-if="snippetCopied" class="semantic-copy-ok" />
          <CopyOutlined v-else />
          <span>
            {{ snippetCopied ? (isZhCN ? '已复制' : 'Copied') : isZhCN ? '复制代码' : 'Copy' }}
          </span>
        </a-button>
      </div>
      <pre class="semantic-code-pre"><code>{{ usageSnippet }}</code></pre>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { CheckOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { SEMANTICS_DATA, resolveSemanticComponentName } from './semanticsData';
import type { SemanticSlotItem } from './semanticsData';
import SemanticStage from './SemanticStage.vue';

const SCRIPT_CLOSE = '</' + 'script>';

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

function buildNestedSemanticObject(
  slots: SemanticSlotItem[],
  kind: 'classNames' | 'styles',
): string {
  const topLines: string[] = [];
  const nestedGroups = new Map<string, string[]>();

  slots.slice(0, 5).forEach(slot => {
    const val =
      kind === 'classNames'
        ? `'custom-${slot.name.replace(/\./g, '-')}'`
        : `{ /* ${slot.name} styles */ }`;
    const dotIndex = slot.name.indexOf('.');
    if (dotIndex > 0) {
      const parentKey = slot.name.slice(0, dotIndex);
      const childKey = slot.name.slice(dotIndex + 1);
      const group = nestedGroups.get(parentKey) || [];
      group.push(`    ${childKey}: ${val},`);
      nestedGroups.set(parentKey, group);
    } else {
      topLines.push(`  ${slot.name}: ${val},`);
    }
  });

  nestedGroups.forEach((lines, parentKey) => {
    topLines.push(`  ${parentKey}: {\n${lines.join('\n')}\n  },`);
  });

  return `{\n${topLines.join('\n')}\n}`;
}

export default defineComponent({
  name: 'SemanticPreview',
  components: {
    SemanticStage,
    CheckOutlined,
    CodeOutlined,
    CopyOutlined,
  },
  props: {
    component: {
      type: String,
      required: true,
    },
    isZhCN: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const stageRef = ref<HTMLElement | null>(null);
    const hoveredSemantic = ref('');
    const pinnedSemantic = ref('');
    const copiedKey = ref('');
    const snippetCopied = ref(false);
    const showCode = ref(false);
    const snippetMode = ref<'object' | 'function'>('object');

    let copyKeyTimer: ReturnType<typeof setTimeout> | null = null;
    let copySnippetTimer: ReturnType<typeof setTimeout> | null = null;
    let popupMeasureTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const highlightRect = reactive({
      visible: false,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    });

    const config = computed(() => {
      const resolved = resolveSemanticComponentName(props.component, props.component);
      return resolved ? SEMANTICS_DATA[resolved] : null;
    });

    const activeSemantic = computed(() => hoveredSemantic.value || pinnedSemantic.value);

    const activeSlot = computed<SemanticSlotItem | undefined>(() => {
      if (!config.value || !activeSemantic.value) return undefined;
      return config.value.semantics.find(item => item.name === activeSemantic.value);
    });

    const highlightStyle = computed(() => ({
      transform: `translate3d(${highlightRect.left}px, ${highlightRect.top}px, 0)`,
      width: `${highlightRect.width}px`,
      height: `${highlightRect.height}px`,
    }));

    const measureActiveSlot = () => {
      const stageEl = stageRef.value;
      const slot = activeSlot.value;
      if (!stageEl || !slot) {
        highlightRect.visible = false;
        return;
      }

      const matchedNodes = Array.from(stageEl.querySelectorAll(slot.selector)) as HTMLElement[];
      const targetEl =
        matchedNodes.find(node => {
          const box = node.getBoundingClientRect();
          return box.width > 0 || box.height > 0;
        }) ||
        matchedNodes[0] ||
        null;
      if (!targetEl) {
        highlightRect.visible = false;
        return;
      }

      const stageBox = stageEl.getBoundingClientRect();
      const targetBox = targetEl.getBoundingClientRect();

      if (targetBox.width === 0 && targetBox.height === 0) {
        highlightRect.visible = false;
        return;
      }

      highlightRect.top = Math.round(targetBox.top - stageBox.top);
      highlightRect.left = Math.round(targetBox.left - stageBox.left);
      highlightRect.width = Math.round(targetBox.width);
      highlightRect.height = Math.round(targetBox.height);
      highlightRect.visible = true;
    };

    const scheduleMeasure = () => {
      if (popupMeasureTimer) {
        clearTimeout(popupMeasureTimer);
        popupMeasureTimer = null;
      }
      nextTick(() => {
        window.requestAnimationFrame(() => {
          measureActiveSlot();
        });
      });
      if (activeSlot.value?.isPopup || activeSemantic.value === 'textarea') {
        popupMeasureTimer = setTimeout(() => {
          measureActiveSlot();
        }, 120);
      }
    };

    watch(activeSemantic, () => {
      scheduleMeasure();
    });

    watch(
      () => props.component,
      () => {
        hoveredSemantic.value = '';
        pinnedSemantic.value = '';
        highlightRect.visible = false;
        snippetMode.value = 'object';
      },
    );

    const handleHover = (name: string) => {
      hoveredSemantic.value = name;
    };

    const handleListLeave = () => {
      hoveredSemantic.value = '';
    };

    const handleSelect = (name: string) => {
      pinnedSemantic.value = pinnedSemantic.value === name ? '' : name;
      handleCopyKey(name);
    };

    const handleCopyKey = async (name: string) => {
      const ok = await copyToClipboard(name);
      if (ok) {
        copiedKey.value = name;
        if (copyKeyTimer) clearTimeout(copyKeyTimer);
        copyKeyTimer = setTimeout(() => {
          copiedKey.value = '';
        }, 1500);
      }
    };

    const usageSnippet = computed(() => {
      if (!config.value) return '';
      const { tagName, semantics } = config.value;
      const clsObj = buildNestedSemanticObject(semantics, 'classNames');
      const styObj = buildNestedSemanticObject(semantics, 'styles');

      if (snippetMode.value === 'function' && config.value.functional) {
        return `<template>
  <${tagName} :class-names="resolveClassNames" :styles="resolveStyles" />
</template>

<script setup lang="ts">
const resolveClassNames = ({ props }: { props: Record<string, any> }) => (${clsObj.replace(
          /\n/g,
          '\n  ',
        )});

const resolveStyles = ({ props }: { props: Record<string, any> }) => (${styObj.replace(
          /\n/g,
          '\n  ',
        )});
${SCRIPT_CLOSE}`;
      }

      return `<template>
  <${tagName} :class-names="semanticClassNames" :styles="semanticStyles" />
</template>

<script setup lang="ts">
const semanticClassNames = ${clsObj};

const semanticStyles = ${styObj};
${SCRIPT_CLOSE}`;
    });

    const handleCopySnippet = async () => {
      const ok = await copyToClipboard(usageSnippet.value);
      if (ok) {
        snippetCopied.value = true;
        if (copySnippetTimer) clearTimeout(copySnippetTimer);
        copySnippetTimer = setTimeout(() => {
          snippetCopied.value = false;
        }, 1800);
      }
    };

    onMounted(() => {
      if (typeof ResizeObserver !== 'undefined' && stageRef.value) {
        resizeObserver = new ResizeObserver(() => {
          if (activeSemantic.value) {
            measureActiveSlot();
          }
        });
        resizeObserver.observe(stageRef.value);
      }
    });

    onBeforeUnmount(() => {
      if (copyKeyTimer) clearTimeout(copyKeyTimer);
      if (copySnippetTimer) clearTimeout(copySnippetTimer);
      if (popupMeasureTimer) clearTimeout(popupMeasureTimer);
      resizeObserver?.disconnect();
    });

    return {
      stageRef,
      config,
      activeSemantic,
      pinnedSemantic,
      copiedKey,
      snippetCopied,
      showCode,
      snippetMode,
      highlightRect,
      highlightStyle,
      usageSnippet,
      handleHover,
      handleListLeave,
      handleSelect,
      handleCopyKey,
      handleCopySnippet,
    };
  },
});
</script>

<style lang="less" scoped>
.semantic-preview-card {
  border: 1px solid var(--site-border-color-split);
  border-radius: var(--border-radius-base, 8px);
  background: var(--component-background);
  overflow: hidden;
  margin-top: 12px;
}

.semantic-preview-main {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, 0.95fr);
  min-height: 260px;
}

.semantic-preview-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 24px;
  min-height: 260px;
  overflow: visible;
  background: radial-gradient(circle at 1px 1px, var(--site-border-color-split) 1px, transparent 0)
    0 0 / 16px 16px;
  background-color: var(--color-fill-alter, rgba(0, 0, 0, 0.015));
  border-inline-end: 1px solid var(--site-border-color-split);
}

.semantic-highlight-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 40;
  pointer-events: none;
  border: 1.5px solid var(--primary-color, #1677ff);
  border-radius: 4px;
  background: rgba(22, 119, 255, 0.14);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.12);
  opacity: 0;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.2s cubic-bezier(0.22, 1, 0.36, 1), height 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.18s ease;

  &.semantic-highlight-visible {
    opacity: 1;
  }
}

.semantic-highlight-label {
  position: absolute;
  top: -22px;
  left: -1px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--primary-color, #1677ff);
  color: #fff;
  font-size: 11px;
  font-family: var(--code-family, monospace);
  line-height: 16px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
}

.semantic-preview-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--component-background);
}

.semantic-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--site-border-color-split);
}

.semantic-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--site-text-color);
}

.semantic-panel-count {
  margin-inline-start: 4px;
  font-weight: 400;
  color: var(--site-text-color-secondary);
}

.semantic-code-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--site-text-color-secondary);

  &.semantic-code-toggle-active {
    color: var(--primary-color);
    background: var(--primary-color-bg, rgba(22, 119, 255, 0.08));
  }
}

.semantic-slot-list {
  list-style: none !important;
  margin: 0;
  padding: 8px;
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.semantic-slot-item {
  list-style: none !important;
  margin-inline-start: 0 !important;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;

  &:hover,
  &:focus-visible,
  &.semantic-slot-active {
    background: var(--primary-color-bg, rgba(22, 119, 255, 0.08));
    border-color: var(--primary-color-border, rgba(22, 119, 255, 0.25));
    outline: none;
  }

  &.semantic-slot-pinned {
    border-color: var(--primary-color, #1677ff);
  }
}

.semantic-slot-head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.semantic-slot-key {
  margin: 0;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--code-family, monospace);
  color: var(--primary-color, #1677ff);
  background: var(--site-markdown-code-bg, rgba(0, 0, 0, 0.04));
  border: 0;
}

.semantic-slot-tag {
  font-size: 11px;
  line-height: 16px;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--site-text-color-secondary);
  background: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
}

.semantic-slot-copy {
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--site-text-color-secondary);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease, background-color 0.15s ease;

  &:hover {
    opacity: 1;
    color: var(--primary-color);
    background: var(--site-hover-bg, rgba(0, 0, 0, 0.06));
  }
}

.semantic-copy-ok {
  color: var(--green-6, #52c41a);
}

.semantic-slot-desc {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--site-text-color-secondary);
}

.semantic-code-drawer {
  border-top: 1px solid var(--site-border-color-split);
  background: var(--color-fill-alter, rgba(0, 0, 0, 0.02));
}

.semantic-code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--site-border-color-split);
}

.semantic-code-tabs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.semantic-code-tab {
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--site-text-color-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: var(--site-text-color);
  }

  &.active {
    color: var(--primary-color);
    background: var(--primary-color-bg, rgba(22, 119, 255, 0.08));
    border-color: var(--primary-color-border, rgba(22, 119, 255, 0.25));
  }
}

.semantic-code-pre {
  margin: 0;
  padding: 12px 16px;
  overflow-x: auto;
  font-size: 12.5px;
  line-height: 1.6;
  font-family: var(--code-family, monospace);
  color: var(--site-text-color);
  background: transparent;

  code {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
  }
}

@media only screen and (max-width: 767.99px) {
  .semantic-preview-main {
    grid-template-columns: 1fr;
  }

  .semantic-preview-stage {
    border-inline-end: 0;
    border-bottom: 1px solid var(--site-border-color-split);
    min-height: 220px;
    padding: 24px 16px;
  }
}
</style>
