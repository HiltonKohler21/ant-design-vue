<template>
  <demo-sort>
    <Basic />
    <Avatar />
    <DefaultFileList />
    <PictureCard />
    <PictureCircle />
    <FileList />
    <Drag />
    <Paste />
    <Directory />
    <UploadManually />
    <uploadPngOnlyVue />
    <PictureStyle />
    <PreviewFile />
    <maxCountVue />
    <TransformFile />
    <UploadWithAliyunOss />
    <uploadCustomActionIconVue />
    <DragSorting />
    <CropImage />
    <customizeProgressBarVue />
    <customRenderVue />
    <StyleClass />
    <FileType />
    <ComponentToken />
    <DebugDisabled />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Avatar from './avatar.vue';
import DefaultFileList from './defaultFileList.vue';
import PictureCard from './picture-card.vue';
import PictureCircle from './picture-circle.vue';
import FileList from './fileList.vue';
import Drag from './drag.vue';
import Paste from './paste.vue';
import PictureStyle from './picture-style.vue';
import UploadManually from './upload-manually.vue';
import Directory from './directory.vue';
import PreviewFile from './preview-file.vue';
import TransformFile from './transform-file.vue';
import UploadWithAliyunOss from './upload-with-aliyun-oss.vue';
import customizeProgressBarVue from './customize-progress-bar.vue';
import maxCountVue from './max-count.vue';
import uploadCustomActionIconVue from './upload-custom-action-icon.vue';
import uploadPngOnlyVue from './upload-png-only.vue';
import DragSorting from './drag-sorting.vue';
import CropImage from './crop-image.vue';
import customRenderVue from './custom-render.vue';
import StyleClass from './style-class.vue';
import FileType from './file-type.vue';
import ComponentToken from './component-token.vue';
import DebugDisabled from './debug-disabled.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Avatar,
    DefaultFileList,
    PictureCard,
    PictureCircle,
    FileList,
    Drag,
    Paste,
    PictureStyle,
    UploadManually,
    Directory,
    PreviewFile,
    TransformFile,
    UploadWithAliyunOss,
    customizeProgressBarVue,
    maxCountVue,
    uploadCustomActionIconVue,
    uploadPngOnlyVue,
    DragSorting,
    CropImage,
    customRenderVue,
    StyleClass,
    FileType,
    ComponentToken,
    DebugDisabled,
  },
  setup() {
    return {};
  },
});
</script>
