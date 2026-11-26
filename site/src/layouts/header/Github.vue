<template>
  <a-tooltip placement="bottom" title="GitHub">
    <a
      id="github-btn"
      class="header-button header-icon-btn github-btn"
      href="https://github.com/HiltonKohler21/ant-design-vue"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub Repository"
    >
      <GithubOutlined class="github-icon" />
    </a>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GithubOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'HeaderGithub',
  components: {
    GithubOutlined,
  },
});
</script>

<style lang="less" scoped>
@import './Github.less';
</style>
