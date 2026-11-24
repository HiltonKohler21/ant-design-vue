<template>
  <demo-sort>
    <basic />
    <variant />
    <async />
    <FormMentions />
    <prefix />
    <readonly />
    <placement />
    <statusVue />
    <component-token />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import Async from './async.vue';
import FormMentions from './form.vue';
import Prefix from './prefix.vue';
import Readonly from './readonly.vue';
import Placement from './placement.vue';
import statusVue from './status.vue';
import Variant from './variant.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    Basic,
    Async,
    Prefix,
    Readonly,
    Placement,
    FormMentions,
    Variant,
    ComponentToken,
  },
});
</script>
