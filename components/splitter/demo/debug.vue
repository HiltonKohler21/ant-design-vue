<docs>
---
order: 12
debug: true
title:
  zh-CN: 调试
  en-US: Debug
---

## zh-CN

面板 2 宽度为 0，面板 3 禁止调整大小。

## en-US

Panel 2 width is 0, panel 3 is not resizable.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-typography-title :level="3">[true, 0, false]</a-typography-title>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 1
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel :default-size="0">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 2
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel :resizable="false">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 3
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>

    <a-typography-title :level="3">[false, 0, true]</a-typography-title>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel :resizable="false">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 1
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel :default-size="0">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 2
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 3
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>

    <a-typography-title :level="3">Start have min &amp; max</a-typography-title>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel :min="50" :max="100">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 1
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 2
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>

    <a-typography-title :level="3">End have min &amp; max</a-typography-title>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 1
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel min="20%" max="70%">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Panel 2
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>
