<docs>
---
order: 40
debug: true
title:
  zh-CN: Disabled Input Debug
  en-US: Disabled Input Debug
---

## zh-CN

调试表单中禁用状态、错误状态与前后缀组合的输入框样式。

## en-US

Debug disabled, error, addonBefore, and prefix input combinations inside Form.
</docs>

<template>
  <a-form style="max-width: 600px">
    <a-form-item label="Normal0">
      <a-input placeholder="unavailable choice" value="Buggy!" />
    </a-form-item>
    <a-form-item label="Fail0" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" value="Buggy!" />
    </a-form-item>
    <a-form-item label="FailDisabled0" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" disabled value="Buggy!" />
    </a-form-item>
    <a-form-item label="Normal1">
      <a-input placeholder="unavailable choice" value="Buggy!" />
    </a-form-item>
    <a-form-item label="Fail1" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" value="Buggy!" />
    </a-form-item>
    <a-form-item label="FailDisabled1" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" disabled value="Buggy!" />
    </a-form-item>
    <a-form-item label="Normal2">
      <a-input placeholder="unavailable choice" addon-before="Buggy!" />
    </a-form-item>
    <a-form-item label="Fail2" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" addon-before="Buggy!" />
    </a-form-item>
    <a-form-item label="FailDisabled2" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" disabled addon-before="Buggy!" />
    </a-form-item>
    <a-form-item label="Normal3">
      <a-input placeholder="unavailable choice" prefix="RMB" value="50" />
    </a-form-item>
    <a-form-item label="Fail3" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" prefix="RMB" value="50" />
    </a-form-item>
    <a-form-item label="FailDisabled3" validate-status="error" help="Buggy!">
      <a-input placeholder="unavailable choice" disabled prefix="RMB" value="50" />
    </a-form-item>
  </a-form>
</template>
