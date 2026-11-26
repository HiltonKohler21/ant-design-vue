<docs>
---
order: 18
debug: true
title:
  zh-CN: 嵌套弹框
  en-US: Nested Modal
---

## zh-CN

嵌套弹框。

## en-US

Nested modal.
</docs>

<template>
  <a-space>
    <a-switch
      v-model:checked="isModalOpen"
      :style="{ position: 'relative', zIndex: isModalOpen ? 4000 : 0 }"
      checked-children="Open"
      un-checked-children="Close"
    />
    <a-button @click="onShowStatic">Static</a-button>
    <a-modal
      v-model:open="isModalOpen"
      title="Basic Modal"
      :footer="null"
      destroy-on-hidden
      :mask="{ closable: false }"
      :closable="false"
      :styles="{
        container: {
          marginBlockStart: '100px',
        },
      }"
    >
      <a-select open value="1" :options="options" />
      <a-modal
        v-model:open="isModalOpen"
        title="Nested Modal"
        :footer="null"
        destroy-on-hidden
        :mask="false"
        :mask-closable="false"
        :closable="false"
        :styles="{
          container: {
            marginBlockStart: '250px',
          },
          body: {
            display: 'flex',
            justifyContent: 'center',
          },
        }"
      >
        <a-select open value="1" :options="options" />

        <a-modal
          v-model:open="isModalOpen"
          title="Nested Modal"
          :footer="null"
          destroy-on-hidden
          :mask="false"
          :mask-closable="false"
          :closable="false"
          :styles="{
            container: {
              marginBlockStart: '400px',
            },
            body: {
              display: 'flex',
              justifyContent: 'flex-end',
            },
          }"
        >
          <a-space wrap>
            <a-button @click="showStaticConfirm">Static Confirm</a-button>
            <a-button @click="showStaticNotice">Static Message, Notification</a-button>
            <a-button @click="showHookNotice">Hook Message, Notification</a-button>
            <a-select open value="1" :options="options" />
          </a-space>
        </a-modal>
      </a-modal>
    </a-modal>

    <messageHolder />
    <notificationHolder />
  </a-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { message, Modal, notification, Select } from '@hiltonkohler21/ant-design-vue';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

const [messageInstance, messageHolder] = message.useMessage();
const [notificationInstance, notificationHolder] = notification.useNotification();
const isModalOpen = ref<boolean>(false);

const onShowStatic = () => {
  Modal.confirm({
    content: h(Select, { open: true, value: '1', options }),
  });
};

const showStaticConfirm = () => {
  Modal.confirm({
    title: 'Are you OK?',
    content: 'I am OK',
  });
};

const showStaticNotice = () => {
  message.success('Hello World');
  notification.success({
    message: 'Hello World',
  });
};

const showHookNotice = () => {
  messageInstance.success('Hello World');
  notificationInstance.success({
    message: 'Hello World',
  });
};
</script>
