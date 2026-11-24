<template>
  <demo-sort :cols="1">
    <Simple />
    <Error />
    <Vertical />
    <Clickable />
    <Panel />
    <Icon />
    <StepNext />
    <TitlePlacement />
    <MaxCount />
    <ProgressDot />
    <CustomizedProgressDot />
    <Nav />
    <Progress />
    <ProgressDebug />
    <StepsInSteps />
    <Inline />
    <InlineVariant />
    <VariantDebug />
    <ComponentToken />
    <StyleClass />
    <LabelPlacement />
    <SmallSize />
    <VerticalSmall />
  </demo-sort>
</template>
<script lang="ts">
import CustomizedProgressDot from './customized-progress-dot.vue';
import Error from './error.vue';
import Icon from './icon.vue';
import ProgressDot from './progress-dot.vue';
import Simple from './simple.vue';
import SmallSize from './small-size.vue';
import StepNext from './step-next.vue';
import VerticalSmall from './vertical-small.vue';
import Vertical from './vertical.vue';
import Clickable from './clickable.vue';
import Panel from './panel.vue';
import TitlePlacement from './title-placement.vue';
import MaxCount from './max-count.vue';
import Progress from './progress.vue';
import ProgressDebug from './progress-debug.vue';
import StepsInSteps from './steps-in-steps.vue';
import LabelPlacement from './label-placement.vue';
import Inline from './inline.vue';
import InlineVariant from './inline-variant.vue';
import VariantDebug from './variant-debug.vue';
import Nav from './nav.vue';
import ComponentToken from './component-token.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Simple,
    Error,
    Vertical,
    Clickable,
    Panel,
    Icon,
    StepNext,
    TitlePlacement,
    MaxCount,
    ProgressDot,
    CustomizedProgressDot,
    Nav,
    Progress,
    ProgressDebug,
    StepsInSteps,
    Inline,
    InlineVariant,
    VariantDebug,
    ComponentToken,
    StyleClass,
    LabelPlacement,
    SmallSize,
    VerticalSmall,
  },
  setup() {
    return {};
  },
});
</script>
