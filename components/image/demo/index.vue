<template>
  <demo-sort :cols="1">
    <basic />
    <placeholder />
    <fallback />
    <preview-group />
    <previewGroupVisibleVue />
    <previewSrc />
    <controlled-preview />
    <toolbar-render />
    <image-render />
    <mask-demo />
    <style-class />
    <preview-mask />
    <cover-placement />
    <nested />
    <preview-group-top-progress />
    <component-token />
    <preview-img-info />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Fallback from './fallback.vue';
import Placeholder from './placeholder.vue';
import previewSrc from './preview-src.vue';
import PreviewGroup from './preview-group.vue';
import ControlledPreview from './controlled-preview.vue';
import previewGroupVisibleVue from './preview-group-visible.vue';
import ToolbarRender from './toolbar-render.vue';
import ImageRender from './image-render.vue';
import MaskDemo from './mask.vue';
import StyleClass from './style-class.vue';
import PreviewMask from './preview-mask.vue';
import CoverPlacement from './coverPlacement.vue';
import Nested from './nested.vue';
import PreviewGroupTopProgress from './preview-group-top-progress.vue';
import ComponentToken from './component-token.vue';
import PreviewImgInfo from './preview-imgInfo.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Fallback,
    previewSrc,
    Placeholder,
    PreviewGroup,
    ControlledPreview,
    previewGroupVisibleVue,
    ToolbarRender,
    ImageRender,
    MaskDemo,
    StyleClass,
    PreviewMask,
    CoverPlacement,
    Nested,
    PreviewGroupTopProgress,
    ComponentToken,
    PreviewImgInfo,
  },
});
</script>
<style></style>
