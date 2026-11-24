<docs>
---
order: 100
debug: true
title:
  zh-CN: 面性变体 Debug
  en-US: Filled Debug
---

## zh-CN

Filled Debug.

## en-US

Filled Debug.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-flex :gap="12" wrap="wrap">
      <a-input placeholder="Filled" variant="filled" style="flex: 1; min-width: 110px" />
      <a-input placeholder="Filled" variant="filled" disabled style="flex: 1; min-width: 110px" />
      <a-input
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
        style="flex: 1; min-width: 110px"
      />
    </a-flex>
    <a-flex :gap="12" wrap="wrap">
      <a-input prefix="$" placeholder="Filled" variant="filled" style="flex: 1; min-width: 110px" />
      <a-input
        prefix="$"
        placeholder="Filled"
        variant="filled"
        disabled
        style="flex: 1; min-width: 110px"
      />
      <a-input
        prefix="$"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
        style="flex: 1; min-width: 110px"
      />
    </a-flex>
    <a-flex vertical :gap="8">
      <a-input addon-before="http://" addon-after=".com" placeholder="Filled" variant="filled" />
      <a-input
        addon-before="http://"
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
        disabled
      />
      <a-input
        addon-before="http://"
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </a-flex>
    <a-flex vertical :gap="8">
      <a-input addon-after=".com" placeholder="Filled" variant="filled" />
      <a-input addon-after=".com" placeholder="Filled" variant="filled" disabled />
      <a-input
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </a-flex>
    <a-flex vertical :gap="8">
      <a-input addon-before="http://" placeholder="Filled" variant="filled" />
      <a-input addon-before="http://" placeholder="Filled" variant="filled" disabled />
      <a-input
        addon-before="http://"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </a-flex>
    <a-textarea variant="filled" placeholder="Basic" />
    <a-textarea variant="filled" placeholder="Basic" status="error" value="Filled Error" />
    <a-textarea variant="filled" placeholder="Allow Clear" allow-clear />
    <a-textarea variant="filled" placeholder="Show Count" show-count />
    <a-textarea
      variant="filled"
      placeholder="Show Count"
      show-count
      status="error"
      value="Filled Error"
    />
  </a-flex>
</template>
