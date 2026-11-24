<docs>
---
order: 16
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="modalTheme">
    <a-space wrap>
      <a-button @click="openBasic = true">Basic Modal</a-button>
      <a-button @click="openWireframe = true">Wireframe Modal</a-button>
      <ModalHookDemo />
    </a-space>
    <a-modal v-model:open="openBasic" title="Hello World!">Hello World?!</a-modal>
    <a-config-provider :theme="wireframeTheme">
      <a-modal v-model:open="openWireframe" title="Hello World!">Hello World?!</a-modal>
    </a-config-provider>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { Button, Modal } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const openBasic = ref<boolean>(false);
const openWireframe = ref<boolean>(false);

const ModalHookDemo = defineComponent({
  setup() {
    const [modal, contextHolder] = Modal.useModal();

    const showSuccess = () => {
      modal.success({
        content: 'A good news!',
        width: 200,
      });
    };

    const showConfirm = () => {
      modal.confirm({
        title: 'Confirm This?',
        content: 'Some descriptions.',
        width: 300,
      });
    };

    return () => [
      h(contextHolder),
      h(Button, { onClick: showSuccess }, () => 'Success Modal'),
      h(Button, { onClick: showConfirm }, () => 'Confirm Modal'),
    ];
  },
});

const modalTheme: ConfigProviderProps['theme'] = {
  components: {
    Modal: {
      footerBg: '#f6ffed',
      contentBg: '#e6fffb',
      headerBg: '#f9f0ff',
      titleLineHeight: 3,
      titleFontSize: 12,
      titleColor: '#1d39c4',
    } as Record<string, any>,
  },
};

const wireframeTheme: ConfigProviderProps['theme'] = {
  token: {
    wireframe: true,
  },
};
</script>
