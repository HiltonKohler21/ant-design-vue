<template>
  <div id="search-box" :class="{ 'narrow-mode': responsive, focused: !!focused }">
    <SearchOutlined class="search-icon" />
    <a-input
      ref="inputRef"
      :placeholder="searchPlaceholder"
      @focus="triggerFocus(true)"
      @blur="triggerFocus(false)"
    ></a-input>
    <kbd class="search-kbd">{{ isMac ? '⌘ K' : 'Ctrl K' }}</kbd>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'SearchBox',
  components: {
    SearchOutlined,
  },
  props: ['isZhCN', 'responsive'],
  emits: ['triggerFocus'],
  setup(props, { emit }) {
    const inputRef = ref();
    const focused = ref(false);
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    function triggerFocus(focus: boolean) {
      focused.value = focus;
      emit('triggerFocus', focus);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.value?.focus?.();
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
      isMac,
      triggerFocus,
      searchPlaceholder: props.isZhCN ? '在 Ant Design 中搜索' : 'Search in Ant Design',
    };
  },
});
</script>
