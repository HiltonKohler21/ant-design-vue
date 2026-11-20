<docs>
---
order: 3
title:
  zh-CN: 可折叠
  en-US: Collapsible
---

## zh-CN

通过 `collapsible` 配置面板快速折叠。

## en-US

Configure collapsible panels via `collapsible`.

</docs>
<template>
  <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px">
    <a-splitter-panel collapsible default-size="25%" min="15%">
      <div style="padding: 16px">Collapsible Panel</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">Main Content</div>
    </a-splitter-panel>
  </a-splitter>
</template>
