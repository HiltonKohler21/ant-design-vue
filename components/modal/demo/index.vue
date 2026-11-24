<template>
  <demo-sort>
    <basic />
    <async />
    <custom-footer />
    <mask-demo />
    <loading />
    <footer-render />
    <HookModal />
    <locale />
    <manual />
    <position />
    <dark />
    <button-props />
    <modalRenderVue />
    <width />
    <info />
    <confirm />
    <confirm-router />
    <style-class />
    <nested />
    <render-panel />
    <custom-mouse-position />
    <wireframe />
    <component-token />
    <confirm-promise />
    <fullscreen />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Async from './async.vue';
import Footer from './footer.vue';
import MaskDemo from './mask.vue';
import Loading from './loading.vue';
import FooterRender from './footer-render.vue';
import HookModal from './hook-modal.vue';
import Locale from './locale.vue';
import Manual from './manual.vue';
import Position from './position.vue';
import Dark from './dark.vue';
import ButtonProps from './button-props.vue';
import modalRenderVue from './modal-render.vue';
import Width from './width.vue';
import Info from './info.vue';
import Confirm from './confirm.vue';
import ConfirmRouter from './confirm-router.vue';
import StyleClass from './style-class.vue';
import Nested from './nested.vue';
import RenderPanel from './render-panel.vue';
import CustomMousePosition from './custom-mouse-position.vue';
import Wireframe from './wireframe.vue';
import ComponentToken from './component-token.vue';
import ConfirmPromise from './confirm-promise.vue';
import Fullscreen from './fullscreen.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Async,
    CustomFooter: Footer,
    MaskDemo,
    Loading,
    FooterRender,
    HookModal,
    Locale,
    Manual,
    Position,
    Dark,
    ButtonProps,
    modalRenderVue,
    Width,
    Info,
    Confirm,
    ConfirmRouter,
    StyleClass,
    Nested,
    RenderPanel,
    CustomMousePosition,
    Wireframe,
    ComponentToken,
    ConfirmPromise,
    Fullscreen,
  },
  setup() {
    return {};
  },
});
</script>
<style>
[id^='components-modal-demo'] .ant-btn {
  margin-right: 8px;
}
</style>
