<template>
  <demo-sort :cols="1">
    <Basic />
    <ControlHooks />
    <Layout />
    <LayoutMultiple />
    <Disabled />
    <Variant />
    <RequiredMark />
    <Size />
    <LayoutCanWrap />
    <WarningOnly />
    <UseWatch />
    <ValidateTrigger />
    <ValidateOnly />
    <FormItemPath />
    <DynamicFormItem />
    <dynamicFormItemsVue />
    <DynamicFormItemsDragSorting />
    <DynamicFormItemsNoStyle />
    <dynamicFormItemsComplexVue />
    <NestedForm />
    <ComplexFormControl />
    <CustomizedFormControls />
    <GlobalState />
    <formContextVue />
    <inlineLoginVue />
    <normalLoginVue />
    <Register />
    <advancedSearchVue />
    <formInModalVue />
    <timeRelatedControlsVue />
    <WithoutFormCreate />
    <validateStaticVue />
    <dynamicRuleVue />
    <FormDependencies />
    <ValidateScrollToField />
    <validateOtherVue />
    <StyleClass />
    <GetValuePropsNormalize />
    <LabelWidth />
    <HorizontalLogin />
    <validationVue />
    <CustomValidation />
    <UseFormBasic />
    <UseFormNested />
    <UseFormTrigger />
    <UseFormMerge />
    <DisabledInputDebug />
    <LabelDebug />
    <Col24Debug />
    <RefItem />
    <CustomFeedbackIcons />
    <ComponentToken />
  </demo-sort>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import advancedSearchVue from './advanced-search.vue';
import Basic from './basic.vue';
import Col24Debug from './col-24-debug.vue';
import ComplexFormControl from './complex-form-control.vue';
import ComponentToken from './component-token.vue';
import ControlHooks from './control-hooks.vue';
import CustomFeedbackIcons from './custom-feedback-icons.vue';
import CustomValidation from './custom-validation.vue';
import CustomizedFormControls from './customized-form-controls.vue';
import Disabled from './disabled.vue';
import DisabledInputDebug from './disabled-input-debug.vue';
import DynamicFormItem from './dynamic-form-item.vue';
import dynamicFormItemsComplexVue from './dynamic-form-items-complex.vue';
import DynamicFormItemsDragSorting from './dynamic-form-items-drag-sorting.vue';
import DynamicFormItemsNoStyle from './dynamic-form-items-no-style.vue';
import dynamicFormItemsVue from './dynamic-form-items.vue';
import dynamicRuleVue from './dynamic-rule.vue';
import formContextVue from './form-context.vue';
import FormDependencies from './form-dependencies.vue';
import formInModalVue from './form-in-modal.vue';
import FormItemPath from './form-item-path.vue';
import GetValuePropsNormalize from './getValueProps-normalize.vue';
import GlobalState from './global-state.vue';
import HorizontalLogin from './horizontal-login.vue';
import inlineLoginVue from './inline-login.vue';
import LabelDebug from './label-debug.vue';
import LabelWidth from './label-width.vue';
import Layout from './layout.vue';
import LayoutCanWrap from './layout-can-wrap.vue';
import LayoutMultiple from './layout-multiple.vue';
import NestedForm from './nest-messages.vue';
import normalLoginVue from './normal-login.vue';
import RefItem from './ref-item.vue';
import Register from './register.vue';
import RequiredMark from './required-mark.vue';
import Size from './size.vue';
import StyleClass from './style-class.vue';
import timeRelatedControlsVue from './time-related-controls.vue';
import UseFormBasic from './useForm-basic.vue';
import UseFormMerge from './useForm-merge.vue';
import UseFormNested from './useForm-nested.vue';
import UseFormTrigger from './useForm-trigger.vue';
import UseWatch from './useWatch.vue';
import ValidateOnly from './validate-only.vue';
import validateOtherVue from './validate-other.vue';
import ValidateScrollToField from './validate-scroll-to-field.vue';
import validateStaticVue from './validate-static.vue';
import ValidateTrigger from './validate-trigger.vue';
import validationVue from './validation.vue';
import Variant from './variant.vue';
import WarningOnly from './warning-only.vue';
import WithoutFormCreate from './without-form-create.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  US,
  CN,
  components: {
    advancedSearchVue,
    Basic,
    Col24Debug,
    ComplexFormControl,
    ComponentToken,
    ControlHooks,
    CustomFeedbackIcons,
    CustomValidation,
    CustomizedFormControls,
    Disabled,
    DisabledInputDebug,
    DynamicFormItem,
    dynamicFormItemsComplexVue,
    DynamicFormItemsDragSorting,
    DynamicFormItemsNoStyle,
    dynamicFormItemsVue,
    dynamicRuleVue,
    formContextVue,
    FormDependencies,
    formInModalVue,
    FormItemPath,
    GetValuePropsNormalize,
    GlobalState,
    HorizontalLogin,
    inlineLoginVue,
    LabelDebug,
    LabelWidth,
    Layout,
    LayoutCanWrap,
    LayoutMultiple,
    NestedForm,
    normalLoginVue,
    RefItem,
    Register,
    RequiredMark,
    Size,
    StyleClass,
    timeRelatedControlsVue,
    UseFormBasic,
    UseFormMerge,
    UseFormNested,
    UseFormTrigger,
    UseWatch,
    ValidateOnly,
    validateOtherVue,
    ValidateScrollToField,
    validateStaticVue,
    ValidateTrigger,
    validationVue,
    Variant,
    WarningOnly,
    WithoutFormCreate,
  },
});
</script>
<style>
[id^='components-form-demo-']
  .code-box-demo
  .ant-form:not(.ant-form-inline):not(.ant-form-vertical) {
  max-width: 600px;
}

article:has([id^='components-form-demo-']) .markdown.api-container table td:nth-of-type(4) {
  white-space: nowrap;
  word-wrap: break-word;
}
</style>
