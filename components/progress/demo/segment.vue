<docs>
---
order: 8
title:
  zh-CN: 分段进度条
  en-US: Progress bar with success segment
---

## zh-CN

分段展示进度，可以用于细化进度语义。

## en-US

Show several parts of progress with different status.

</docs>

<template>
  <a-flex gap="small" vertical>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress :percent="60" :success="{ percent: 30 }" />
    </a-tooltip>
    <a-flex gap="small" wrap="wrap">
      <a-tooltip title="3 done / 3 in progress / 4 to do">
        <a-progress :percent="60" :success="{ percent: 30 }" type="circle" />
      </a-tooltip>
      <a-tooltip title="3 done / 3 in progress / 4 to do">
        <a-progress :percent="60" :success="{ percent: 30 }" type="dashboard" />
      </a-tooltip>
    </a-flex>
  </a-flex>
</template>
