<template>
  <demo-sort :cols="1">
    <Basic />
    <NoticeCalendar />
    <EventRange />
    <Card />
    <Select />
    <Lunar />
    <Week />
    <CustomizeHeader />
    <StyleClass />
    <ComponentToken />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import NoticeCalendar from './notice-calendar.vue';
import EventRange from './event-range.vue';
import Card from './card.vue';
import Select from './select.vue';
import Lunar from './lunar.vue';
import Week from './week.vue';
import CustomizeHeader from './customize-header.vue';
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
    NoticeCalendar,
    EventRange,
    Card,
    Select,
    Lunar,
    Week,
    CustomizeHeader,
    StyleClass,
    ComponentToken,
  },
});
</script>
