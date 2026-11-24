<docs>
---
order: 100
debug: true
title:
  zh-CN: Filled Debug
  en-US: Filled Debug
---

## zh-CN

Filled Debug.

## en-US

Filled Debug.
</docs>

<template>
  <a-flex vertical :gap="12">
    <a-flex :gap="12" wrap="wrap">
      <a-input-number placeholder="Filled" variant="filled" />
      <a-input-number placeholder="Filled" variant="filled" disabled />
      <a-input-number placeholder="Filled" variant="filled" status="error" />
    </a-flex>
    <a-flex :gap="12" wrap="wrap">
      <a-input-number prefix="$" placeholder="Filled" variant="filled" />
      <a-input-number prefix="$" placeholder="Filled" variant="filled" disabled />
      <a-input-number prefix="$" placeholder="Filled" variant="filled" status="error" />
    </a-flex>
    <a-flex vertical :gap="8">
      <a-input-number
        addon-before="http://"
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
      />
      <a-input-number
        addon-before="http://"
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
        disabled
      />
      <a-input-number
        addon-before="http://"
        addon-after=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
      />
    </a-flex>
    <a-flex :gap="12" wrap="wrap">
      <a-input-number addon-after=".com" placeholder="Filled" variant="filled" />
      <a-input-number addon-after=".com" placeholder="Filled" variant="filled" disabled />
      <a-input-number addon-after=".com" placeholder="Filled" variant="filled" status="error" />
    </a-flex>
    <a-flex :gap="12" wrap="wrap">
      <a-input-number addon-before="http://" placeholder="Filled" variant="filled" />
      <a-input-number addon-before="http://" placeholder="Filled" variant="filled" disabled />
      <a-input-number addon-before="http://" placeholder="Filled" variant="filled" status="error" />
    </a-flex>
    <a-flex :gap="12" wrap="wrap">
      <a-input-number
        addon-before="http://"
        placeholder="Outlined"
        variant="outlined"
        status="warning"
      />
      <a-input-number
        addon-before="http://"
        placeholder="Filled"
        variant="filled"
        status="warning"
        disabled
      />
      <a-input-number
        addon-before="http://"
        placeholder="Filled"
        variant="filled"
        status="warning"
      />
    </a-flex>
  </a-flex>
</template>
