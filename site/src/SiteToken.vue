<template>
  <slot></slot>
</template>
<script lang="ts" setup>
import { provide } from 'vue';
import useSiteToken, { SITE_TOKEN_ROOT_MANAGED } from './hooks/useSiteToken';

provide(SITE_TOKEN_ROOT_MANAGED, true);
useSiteToken({ syncRootStyle: true });
</script>
