<template>
  <demo-sort :cols="1">
    <horizontal />
    <horizontal-dark />
    <inline />
    <inline-collapsed />
    <tooltip-demo />
    <sider-current />
    <vertical />
    <theme />
    <submenu-theme />
    <switch-mode />
    <style-class />
    <style-debug />
    <menu-v4 />
    <component-token />
    <extra-style />
    <extra-collapsed-debug />
    <custom-popup-render />
    <collapsed-icon-debug />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Horizontal from './horizontal.vue';
import HorizontalDark from './horizontal-dark.vue';
import Inline from './inline.vue';
import InlineCollapsed from './inline-collapsed.vue';
import TooltipDemo from './tooltip.vue';
import SiderCurrent from './sider-current.vue';
import Vertical from './vertical.vue';
import Theme from './theme.vue';
import SubmenuTheme from './submenu-theme.vue';
import SwitchMode from './switch-mode.vue';
import StyleClass from './style-class.vue';
import StyleDebug from './style-debug.vue';
import MenuV4 from './menu-v4.vue';
import ComponentToken from './component-token.vue';
import ExtraStyle from './extra-style.vue';
import ExtraCollapsedDebug from './extra-collapsed-debug.vue';
import CustomPopupRender from './custom-popup-render.vue';
import CollapsedIconDebug from './collapsed-icon-debug.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Horizontal,
    HorizontalDark,
    Inline,
    InlineCollapsed,
    TooltipDemo,
    SiderCurrent,
    Vertical,
    Theme,
    SubmenuTheme,
    SwitchMode,
    StyleClass,
    StyleDebug,
    MenuV4,
    ComponentToken,
    ExtraStyle,
    ExtraCollapsedDebug,
    CustomPopupRender,
    CollapsedIconDebug,
  },
});
</script>
