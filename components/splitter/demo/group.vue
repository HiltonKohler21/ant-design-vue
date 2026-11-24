<docs>
---
order: 6
title:
  zh-CN: 复杂组合
  en-US: Complex combination
---

## zh-CN

复杂组合面板，快捷折叠，禁止改变大小。

## en-US

Complex combination panel, quick folding, prohibited from changing size.

</docs>

<template>
  <a-splitter style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <a-splitter-panel collapsible>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          Left
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-splitter orientation="vertical">
        <a-splitter-panel>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Top
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Bottom
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>
    </a-splitter-panel>
  </a-splitter>
</template>
