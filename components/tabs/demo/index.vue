<template>
  <demo-sort :cols="1">
    <Basic />
    <Disabled />
    <Centered />
    <Icon />
    <CustomIndicator />
    <Slide />
    <Extra />
    <Size />
    <Position />
    <PopupRenderSearch />
    <Card />
    <EditableCard />
    <CardTop />
    <CustomAddTrigger />
    <CustomTabBar />
    <CustomTabBarNode />
    <Items />
    <StyleClass />
    <Animated />
    <Nest />
    <ComponentToken />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import Centered from './centered.vue';
import Icon from './icon.vue';
import CustomIndicator from './custom-indicator.vue';
import Slide from './slide.vue';
import Extra from './extra.vue';
import Size from './size.vue';
import Position from './position.vue';
import PopupRenderSearch from './popupRender-Search.vue';
import Card from './card.vue';
import EditableCard from './editable-card.vue';
import CardTop from './card-top.vue';
import CustomAddTrigger from './custom-add-trigger.vue';
import CustomTabBar from './custom-tab-bar.vue';
import CustomTabBarNode from './custom-tab-bar-node.vue';
import Items from './items.vue';
import StyleClass from './style-class.vue';
import Animated from './animated.vue';
import Nest from './nest.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  category: 'Components',
  subtitle: '标签页',
  type: 'Data Display',
  title: 'Tabs',
  CN,
  US,
  components: {
    Basic,
    Disabled,
    Centered,
    Icon,
    CustomIndicator,
    Slide,
    Extra,
    Size,
    Position,
    PopupRenderSearch,
    Card,
    EditableCard,
    CardTop,
    CustomAddTrigger,
    CustomTabBar,
    CustomTabBarNode,
    Items,
    StyleClass,
    Animated,
    Nest,
    ComponentToken,
  },
});
</script>
