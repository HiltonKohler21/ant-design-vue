<template>
  <demo-sort>
    <basic />
    <disabled />
    <radio-group />
    <radio-group-more />
    <radio-group-block />
    <radio-group-options />
    <radio-button />
    <radio-group-with-name />
    <size />
    <radio-button-solid />
    <component-token />
  </demo-sort>
</template>

<script>
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import RadioButton from './radioButton.vue';
import RadioGroupMore from './radioGroup-more.vue';
import RadioGroupOptions from './radioGroup-options.vue';
import RadioGroupWithName from './radioGroup-with-name.vue';
import RadioGroup from './radioGroup.vue';
import RadioGroupBlock from './radiogroup-block.vue';
import RadioButtonSolid from './radioButton-solid.vue';
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
    Disabled,
    RadioButton,
    RadioButtonSolid,
    RadioGroupMore,
    RadioGroupOptions,
    RadioGroupWithName,
    RadioGroup,
    RadioGroupBlock,
    Size,
    ComponentToken,
  },
});
</script>
