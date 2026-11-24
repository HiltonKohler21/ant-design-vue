<template>
  <demo-sort>
    <basic />
    <placement />
    <resizable />
    <loading />
    <extra />
    <render-in-current />
    <form-in-drawer />
    <user-profile />
    <multi-level-drawer />
    <size />
    <mask-demo />
    <closable-placement />
    <style-class />
    <config-provider-demo />
    <no-mask />
    <render-panel />
    <scroll-debug />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Extra from './extra.vue';
import Placement from './placement.vue';
import UserProfile from './user-profile.vue';
import MultiLevelDrawer from './multi-level-drawer.vue';
import FormInDrawer from './form-in-drawer.vue';
import RenderInCurrent from './render-in-current.vue';
import Size from './size.vue';
import Loading from './loading.vue';
import Resizable from './resizable.vue';
import MaskDemo from './mask.vue';
import ClosablePlacement from './closable-placement.vue';
import StyleClass from './style-class.vue';
import ConfigProviderDemo from './config-provider.vue';
import NoMask from './no-mask.vue';
import RenderPanel from './render-panel.vue';
import ScrollDebug from './scroll-debug.vue';
import ComponentToken from './component-token.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Extra,
    Placement,
    UserProfile,
    MultiLevelDrawer,
    FormInDrawer,
    RenderInCurrent,
    Size,
    Loading,
    Resizable,
    MaskDemo,
    ClosablePlacement,
    StyleClass,
    ConfigProviderDemo,
    NoMask,
    RenderPanel,
    ScrollDebug,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
