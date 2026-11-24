<docs>
---
order: 3
version: 5.25.0
title:
  zh-CN: 计时器
  en-US: Timer
---

## zh-CN

`Statistic.Timer` 组件支持倒计时（`countdown`）与正计时（`countup`）模式。

## en-US

`Statistic.Timer` supports both `countdown` and `countup` timer modes.

</docs>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-timer type="countdown" title="Countdown" :value="deadline" @finish="onFinish" />
    </a-col>
    <a-col :span="12">
      <a-statistic-timer
        type="countdown"
        title="Million Seconds"
        :value="deadline"
        format="HH:mm:ss:SSS"
      />
    </a-col>
    <a-col :span="12" style="margin-top: 32px">
      <a-statistic-timer type="countup" title="Countup" :value="before" />
    </a-col>
    <a-col :span="12" style="margin-top: 32px">
      <a-statistic-timer
        type="countup"
        title="Day Level"
        :value="before"
        format="D 天 H 时 m 分 s 秒"
      />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
const before = Date.now() - 1000 * 60 * 60 * 24 * 2 - 1000 * 30;
const onFinish = () => {
  console.log('finished!');
};
</script>
