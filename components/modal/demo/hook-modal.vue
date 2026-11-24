<docs>
---
order: 6
title:
  zh-CN: 使用 hooks 获得上下文
  en-US: Use hooks to get context
---

## zh-CN

通过 `Modal.useModal` 创建支持读取 context 的 `contextHolder`。其中仅有 hooks 方法支持 Promise `await` 操作。

## en-US

Use `Modal.useModal` to get `contextHolder` with context accessible issue. Only hooks method support Promise `await` operation.
</docs>

<template>
  <a-space>
    <a-button @click="showConfirm">Confirm</a-button>
    <a-button @click="showWarning">Warning</a-button>
    <a-button @click="showInfo">Info</a-button>
    <a-button @click="showError">Error</a-button>
  </a-space>
  <contextHolder />
  <UnreachableProvider />
</template>

<script lang="ts" setup>
import { defineComponent, h, inject, provide } from 'vue';
import { Modal } from 'ant-design-vue';

const ReachableContext = Symbol('ReachableContext');
const UnreachableContext = Symbol('UnreachableContext');

provide(ReachableContext, 'Light');

const UnreachableProvider = defineComponent({
  setup() {
    provide(UnreachableContext, 'Bamboo');
    return () => null;
  },
});

const ModalContent = defineComponent({
  setup() {
    const reachable = inject<string | null>(ReachableContext, null);
    const unreachable = inject<string | null>(UnreachableContext, null);
    return () => [`Reachable: ${reachable}!`, h('br'), `Unreachable: ${unreachable}!`];
  },
});

const config = {
  title: 'Use Hook!',
  content: h(ModalContent),
};

const [modal, contextHolder] = Modal.useModal();

const showConfirm = async () => {
  const confirmed = await modal.confirm(config);
  console.log('Confirmed: ', confirmed);
};

const showWarning = () => {
  modal.warning(config);
};

const showInfo = () => {
  modal.info(config);
};

const showError = () => {
  modal.error(config);
};
</script>
