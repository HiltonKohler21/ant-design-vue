<template>
  <demo-sort>
    <basic />
    <size />
    <half />
    <Text />
    <disabled />
    <clear />
    <character />
    <character-function />
    <component-token />
  </demo-sort>
</template>

<script>
import Basic from './basic.vue';
import Half from './half.vue';
import Text from './text.vue';
import Disabled from './disabled.vue';
import Clear from './clear.vue';
import Character from './character.vue';
import CharacterFunction from './character-function.vue';
import Size from './size.vue';
import ComponentToken from './component-token.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Half,
    Text,
    Disabled,
    Clear,
    Character,
    CharacterFunction,
    Size,
    ComponentToken,
  },
});
</script>
