<template>
  <demo-sort :cols="1">
    <Basic />
    <BorderLess />
    <Simple />
    <FlexibleContent />
    <InColumn />
    <Loading />
    <GridCard />
    <Inner />
    <Tabs />
    <Meta />
    <Variant />
    <StyleClass />
    <NoBodyDebug />
    <ButtonAlignmentDebug />
    <ComponentToken />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import BorderLess from './border-less.vue';
import Variant from './variant.vue';
import FlexibleContent from './flexible-content.vue';
import GridCard from './grid-card.vue';
import InColumn from './in-column.vue';
import Inner from './inner.vue';
import Loading from './loading.vue';
import Meta from './meta.vue';
import Simple from './simple.vue';
import Tabs from './tabs.vue';
import StyleClass from './style-class.vue';
import NoBodyDebug from './no-body-debug.vue';
import ButtonAlignmentDebug from './button-alignment-debug.vue';
import ComponentToken from './component-token.vue';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    BorderLess,
    Variant,
    FlexibleContent,
    GridCard,
    InColumn,
    Inner,
    Loading,
    Meta,
    Simple,
    Tabs,
    StyleClass,
    NoBodyDebug,
    ButtonAlignmentDebug,
    ComponentToken,
  },
});
</script>
