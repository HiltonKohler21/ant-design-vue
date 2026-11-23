<template>
  <li :class="[themeClass, { copied: isCopied }]" @click="handleCopy">
    <span v-if="isNew && newIconVersion" class="new-icon-version">{{ newIconVersion }}</span>
    <component :is="iconComponent" />
    <span class="anticon-class">{{ name }}</span>
  </li>
</template>
<script>
import * as AntdIcons from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { computed, defineComponent, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';

const allIcons = markRaw(AntdIcons);

async function copyText(text) {
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
  name: 'CopyableIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    newIconVersion: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'All',
    },
    justCopied: {
      type: String,
      default: null,
    },
  },
  emits: ['copied'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const iconComponent = computed(() => allIcons[props.name]);
    const themeClass = computed(() => {
      const match = props.name.match(/(Outlined|Filled|TwoTone)$/);
      return match ? match[0] : props.theme;
    });
    const isCopied = computed(() => props.justCopied === props.name);

    const handleCopy = async () => {
      const text = `<${props.name} />`;
      const ok = await copyText(text);
      if (ok) {
        emit('copied', props.name, text);
      } else {
        message.error(t('app.docs.components.icon.copy-failed'));
      }
    };

    return {
      iconComponent,
      themeClass,
      isCopied,
      handleCopy,
    };
  },
});
</script>
