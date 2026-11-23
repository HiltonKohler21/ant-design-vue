<template>
  <div
    id="search-box"
    :class="{ 'narrow-mode': responsive, focused: modalOpen || focused }"
    role="search"
    @click="openModal"
  >
    <SearchOutlined class="search-icon" />
    <input
      ref="inputRef"
      type="search"
      readonly
      :placeholder="searchPlaceholder"
      :aria-label="searchPlaceholder"
      @focus="handleInputFocus"
      @blur="triggerFocus(false)"
    />
    <kbd class="search-kbd">{{ isMac ? '⌘ K' : 'Ctrl K' }}</kbd>
  </div>
  <SearchModal v-model:open="modalOpen" :is-zh-c-n="isZhCN" />
</template>
<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import SearchModal from './SearchModal.vue';

export default defineComponent({
  name: 'SearchBox',
  components: {
    SearchOutlined,
    SearchModal,
  },
  props: ['isZhCN', 'responsive'],
  emits: ['triggerFocus'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    const focused = ref(false);
    const modalOpen = ref(false);
    const isMac =
      typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    const searchPlaceholder = computed(() =>
      props.isZhCN ? '在 Ant Design Vue 中搜索' : 'Search in Ant Design Vue',
    );

    function triggerFocus(focus: boolean) {
      focused.value = focus;
      emit('triggerFocus', focus);
    }

    function openModal() {
      modalOpen.value = true;
      triggerFocus(true);
    }

    function handleInputFocus() {
      triggerFocus(true);
      modalOpen.value = true;
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modalOpen.value = !modalOpen.value;
        triggerFocus(modalOpen.value);
        return;
      }
      if (e.key === '/' && !modalOpen.value) {
        const active = document.activeElement as HTMLElement | null;
        const tag = active?.tagName;
        if (
          tag !== 'INPUT' &&
          tag !== 'TEXTAREA' &&
          tag !== 'SELECT' &&
          !active?.isContentEditable
        ) {
          e.preventDefault();
          openModal();
        }
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      inputRef,
      focused,
      modalOpen,
      isMac,
      triggerFocus,
      openModal,
      handleInputFocus,
      searchPlaceholder,
    };
  },
});
</script>
