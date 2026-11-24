<template>
  <demo-sort>
    <basic />
    <with-icon />
    <with-params />
    <separator />
    <overlay />
    <separator-component />
    <separator-indepent />
    <router />
    <debug-routes />
    <style-class />
    <component-token />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import US from './../index.en-US.md';
import CN from './../index.zh-CN.md';
import Basic from './basic.vue';
import WithIcon from './withIcon.vue';
import WithParams from './withParams.vue';
import Separator from './separator.vue';
import Overlay from './overlay.vue';
import SeparatorComponent from './separator-component.vue';
import SeparatorIndepent from './separator-indepent.vue';
import Router from './router.vue';
import DebugRoutes from './debug-routes.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    WithIcon,
    WithParams,
    Separator,
    Overlay,
    SeparatorComponent,
    SeparatorIndepent,
    Router,
    DebugRoutes,
    StyleClass,
    ComponentToken,
  },
});
</script>
