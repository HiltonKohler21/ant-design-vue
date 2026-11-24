<template>
  <demo-sort>
    <basic />
    <extra />
    <placement />
    <arrow-vue />
    <item />
    <arrow-center-vue />
    <trigger />
    <event />
    <dropdown-button />
    <custom-dropdown />
    <sub-menu />
    <sub-menu-debug />
    <overlay-visible />
    <context-menu />
    <loadingVue />
    <selectable />
    <selection-demo />
    <style-class />
    <menu-full />
    <render-panel />
    <icon-debug />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import US from '../index.en-US.md';
import CN from '../index.zh-CN.md';
import Basic from './basic.vue';
import Extra from './extra.vue';
import Placement from './placement.vue';
import arrowVue from './arrow.vue';
import Item from './item.vue';
import arrowCenterVue from './arrow-center.vue';
import Trigger from './trigger.vue';
import Event from './event.vue';
import DropdownButton from './dropdown-button.vue';
import CustomDropdown from './custom-dropdown.vue';
import SubMenu from './sub-menu.vue';
import SubMenuDebug from './sub-menu-debug.vue';
import OverlayVisible from './overlay-visible.vue';
import ContextMenu from './context-menu.vue';
import loadingVue from './loading.vue';
import Selectable from './selectable.vue';
import SelectionDemo from './selection.vue';
import StyleClass from './style-class.vue';
import MenuFull from './menu-full.vue';
import RenderPanel from './render-panel.vue';
import IconDebug from './icon-debug.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Extra,
    Placement,
    arrowVue,
    Item,
    arrowCenterVue,
    Trigger,
    Event,
    DropdownButton,
    CustomDropdown,
    SubMenu,
    SubMenuDebug,
    OverlayVisible,
    ContextMenu,
    loadingVue,
    Selectable,
    SelectionDemo,
    StyleClass,
    MenuFull,
    RenderPanel,
    IconDebug,
  },
});
</script>
