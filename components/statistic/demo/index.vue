<template>
  <demo-sort>
    <basic />
    <unit />
    <animated />
    <card />
    <timer />
    <countdown />
    <countdown-slot />
    <style-class />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Unit from './unit.vue';
import Animated from './animated.vue';
import Card from './card.vue';
import Timer from './timer.vue';
import Countdown from './countdown.vue';
import CountdownSlot from './countdown-slot.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Unit,
    Animated,
    Card,
    Timer,
    Countdown,
    CountdownSlot,
    StyleClass,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
