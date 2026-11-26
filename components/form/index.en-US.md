---
category: Components
type: Data Entry
cols: 1
title: Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-lcdS5Qm1bsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ylFATY6w-ygAAAAAAAAAAAAADrJ8AQ/original
---

High performance Form component with data scope management. Including data collection, verification, and styles.

## When to use

- When you need to create an instance or collect information.
- When you need to validate fields in certain rules.

## Form Component

You can align the controls of a `form` using the `layout` prop：

- `horizontal`：to horizontally align the `label`s and controls of the fields. (Default)
- `vertical`：to vertically align the `label`s and controls of the fields.
- `inline`：to render form fields in one line.

## Form Item Component

A form consists of one or more form fields whose type includes input, textarea, checkbox, radio, select, tag, and more. A form field is defined using `<a-form-item />`.

## API

### Form

| Property | Description | Type | Default Value | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<FormSemanticName, string>` \| `(info: { props: FormProps }) => Record<FormSemanticName, string>` | - | 4.3.0 |
| colon | Change default props colon value of Form.Item (only effective when prop layout is horizontal) | boolean | true |  |
| disabled | Set form component disable, only available for antdv components | boolean | false | '4.0' |
| feedbackIcons | Can be passed custom icons while `Form.Item` element has `hasFeedback` | `({ status, errors, warnings }) => Partial<Record<ValidateStatus, VueNode>>` | - | 4.3.0 |
| ~~hideRequiredMark~~ | Hide required mark of all form items (deprecated, please use `requiredMark` instead) | boolean | false |  |
| labelAlign | Text align of label of all items | `'left'` \| `'right'` \| `'start'` \| `'end'` | `'right'` | `start`/`end`: 4.3.0 |
| labelCol | The layout of label. You can set `span` `offset` to something like `{span: 3, offset: 12}` or `sm: {span: 3, offset: 12}` same as with `<Col>` | [object](/components/grid/#col) | - |  |
| labelWrap | Whether label can be wrap | boolean | false | '3.0' |
| layout | Define form layout | `'horizontal'` \| `'vertical'` \| `'inline'` | `'horizontal'` |  |
| model | Data of form component | object | - |  |
| name | Form name. Will be the prefix of Field `id` | string | - | 2.0.0 |
| requiredMark | Required mark style. Supports required, optional, hidden, or custom render function | boolean \| `'optional'` \| `((label: VueNode, info: { required: boolean }) => VueNode)` | true | `renderProps`: 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| rules | Validation rules of form | object | - |  |
| scrollToFirstError | Auto scroll to first failed field when submit | boolean \| [options](https://github.com/stipsan/scroll-into-view-if-needed/#options) \| `{ focus?: boolean }` | false | 2.0.0 \| `focus`: 4.3.0 |
| size | Set field component size (antdv components only) | `'small'` \| `'middle'` \| `'large'` | - |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<FormSemanticName, CSSProperties>` \| `(info: { props: FormProps }) => Record<FormSemanticName, CSSProperties>` | - | 4.3.0 |
| tooltip | Config default tooltip props for form items | `TooltipProps & { icon?: VueNode }` | - | 4.3.0 |
| validateMessages | Validation prompt template | ValidateMessages | - |  |
| validateOnRuleChange | Whether to trigger validation when the `rules` prop is changed | boolean | true |  |
| validateTrigger | Config field validate trigger | string \| string\[] | `change` | 2.0.0 |
| variant | Variant of components inside form | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |
| wrapperCol | The layout for input controls, same as `labelCol` | [object](/components/grid/#col) | - |  |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| fieldsChange | Trigger when field updated | function(changedFields, allFields) |  |
| finish | Trigger after submitting the form and verifying data successfully | function(values) | 2.0.0 |
| finishFailed | Trigger after submitting the form and verifying data failed | function({ values, errorFields, outOfDate }) | 2.0.0 |
| submit | Defines a function will be called if form data validation is successful. | Function(e: Event) |  |
| validate | Triggers after a form item is validated | Function(name, status, errorMsgs) |  |
| valuesChange | Trigger when value updated | function(changedValues, allValues) |  |

### Methods

| Method | Description | Parameters | Version |
| --- | --- | --- | --- |
| clearValidate | clear validation message for certain fields. The parameter is name or an array of names of the form items whose validation messages will be removed. When omitted, all fields' validation messages will be cleared | (nameList?: [NamePath](#namepath)\[]) => void |  |
| getFieldInstance | Get the DOM element of a field by name | (name: [NamePath](#namepath)) => HTMLElement \| null | 4.3.0 |
| resetFields | reset all the fields and remove validation result | (nameList?: [NamePath](#namepath)\[]) => void |  |
| scrollToField | Scroll to field position | (name: [NamePath](#namepath), options?: [ScrollOptions](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options) \| `{ focus?: boolean }`) => void | `focus`: 4.3.0 |
| validate | Validate fields, it is same as validateFields | (nameList?: [NamePath](#namepath)\[] \| ValidateOptions, options?: ValidateOptions) => Promise | `validateOnly`: 4.3.0 |
| validateFields | Validate fields; supports `{ validateOnly: true }` to validate silently without UI errors | (nameList?: [NamePath](#namepath)\[] \| ValidateOptions, options?: ValidateOptions) => Promise | `validateOnly`: 4.3.0 |

#### NamePath

`string | number | (string | number)[]`

### Form.Item

| Property | Description | Type | Default Value | Version |
| --- | --- | --- | --- | --- |
| autoLink | Whether to automatically associate form fields. In most cases, you can use automatic association. If the conditions for automatic association are not met, you can manually associate them. See the notes below. | boolean | true |  |
| colon | Used with `label`, whether to display `:` after label text. | boolean | true |  |
| dependencies | Set dependency fields to re-validate automatically when upstream fields change | [NamePath](#namepath)\[] | - | 4.3.0 |
| extra | The extra prompt message. It is similar to help. Usage example: to display error message and prompt message at the same time. | string \| slot | - |  |
| hasFeedback | Used with `validateStatus`, this option specifies the validation status icon; also supports custom `icons` | boolean \| `{ icons?: FeedbackIcons }` | false | `icons`: 4.3.0 |
| help | The prompt message. If not provided, the prompt message will be generated by the validation rule. | string \| slot | - |  |
| hidden | Whether to hide Form.Item (still collect and validate value) | boolean | false |  |
| htmlFor | Set sub label `htmlFor`. | string | - |  |
| label | Label text; set to `null` to auto-align wrapper column with Form `labelCol` | string \| null \| slot | - | `null`: 4.3.0 |
| labelAlign | Text align of label | `'left'` \| `'right'` \| `'start'` \| `'end'` | `'right'` | `start`/`end`: 4.3.0 |
| labelCol | The layout of label. You can set `span` `offset` to something like `{span: 3, offset: 12}` or `sm: {span: 3, offset: 12}` same as with `<Col>` | [object](/components/grid/#col) | - |  |
| layout | Form item independent layout | `'horizontal'` \| `'vertical'` | - | 4.3.0 |
| messageVariables | The default validate field info | `Record<string, string>` | - |  |
| name | A key of `model`. In the use of validate and resetFields method, the attribute is required | [NamePath](#namepath) | - | 2.0.0 |
| noStyle | No style for `true`, used as a pure field control | boolean | false | '3.0' |
| required | Whether provided or not, it will be generated by the validation rule. | boolean | - |  |
| rules | Validation rules of form | object \| array | - |  |
| tooltip | Config tooltip info | string \| slot \| `(TooltipProps & { icon?: VueNode })` | - | 4.0.4 \| `object`: 4.3.0 |
| validateDebounce | Delay milliseconds to start validation | number | - | 4.3.0 |
| validateFirst | Whether stop validate on first rule of error for this field; supports `'parallel'` | boolean \| `'parallel'` | false | `parallel`: 4.3.0 |
| validateStatus | The validation status. If not provided, it will be generated by validation rule. options: `'success'` `'warning'` `'error'` `'validating'` | string | - |  |
| validateTrigger | When to validate the value of children node | string \| string\[] | `change` |  |
| wrapperCol | The layout for input controls, same as `labelCol` | [object](/components/grid/#col) | - |  |

### Note

#### 3.x

Since version 3.0, Form.Item no longer hijacks child elements, but automatically checks through provider/inject dependency injection. This method can improve component performance, and there is no limit to the number of child elements. The same is true for child elements. It can be a high-level component that is further encapsulated.

You can reference [Customized Form Controls](#components-form-demo-customized-form-controls)

But it also has some disadvantages:

1. If the custom component wants Form.Item to be verified and displayed, you need to inject `const {id, onFieldChange, onFieldBlur} = useInjectFormItemContext()` and call the corresponding method.

2. A Form.Item can only collect the data of one form item. If there are multiple form items, it will cause collection confusion, for example,

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-input name="b"></a-input>
</a-form-item>
```

As above Form.Item does not know whether to collect `name="a"` or `name="b"`, you can solve this kind of problem in the following two ways:

The first is to use multiple `a-form-item`:

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-form-item><a-input name="b"></a-input></a-form-item>
</a-form-item>
```

The second way is to wrap it with a custom component and call `useInjectFormItemContext` in the custom component, It is equivalent to merging multiple form items into one.

```html
<script>
  // custom component
  import { Form } from '@hiltonkohler21/ant-design-vue';
  export default {
    name: 'custom-name',
    setup() {
      const formItemContext = Form.useInjectFormItemContext();
    },
  };
</script>
```

```html
<a-form-item>
  <custom-com>
    <a-input name="a"></a-input>
    <a-input name="b"></a-input>
  </custom-com>
</a-form-item>
```

Third, the component library provides an `a-form-item-rest` component, which will prevent data collection. You can put form items that do not need to be collected and verified into this component. It is the same as the first This method is very similar, but it does not generate additional dom nodes.

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-form-item-rest><a-input name="b"></a-input></a-form-item-rest>
</a-form-item>
```

#### 2.x

Form.Item hijacks the only child element and listens to the `blur` and `change` events to achieve the purpose of automatic verification, so please make sure that the form field is not wrapped by other elements. If there are multiple child elements, only the change of the first child element will be monitored.

If the form field to be monitored does not meet the conditions of automatic monitoring, you can associate the form field as follows:

```html
<a-form-item name="form.name" ref="name" :autoLink="false">
  <a-input v-model:value="other" />
  <span>hahha</span>
  <div>
    <a-input
      v-model:value="form.name"
      @blur="() => {$refs.name.onFieldBlur()}"
      @change="() => {$refs.name.onFieldChange()}"
    />
  </div>
</a-form-item>
```

### Validation Rules

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| enum | validate a value from a list of possible values | string | - |
| len | validate an exact length of a field | number | - |
| max | validate a max length of a field | number | - |
| message | validation error message | string | - |
| min | validate a min length of a field | number | - |
| pattern | validate from a regular expression | RegExp | - |
| required | indicates whether field is required | boolean | `false` |
| transform | transform a value before validation | function(value) => transformedValue:any | - |
| trigger | When to validate the value of children node. | 'blur' \| 'change' \| `['change', 'blur']` | - |
| type | built-in validation type, [available options](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | custom validate function (Note: [callback must be called](https://github.com/ant-design/ant-design/issues/5155)) | function(rule, value, callback) | - |
| warningOnly | Warning only. Does not block form submit | boolean | `false` |
| whitespace | treat required fields that only contain whitespace as errors | boolean | `false` |

See more advanced usage at [async-validator](https://github.com/yiminghe/async-validator).

## Semantic DOM

| Name | Description | Version |
| --- | --- | --- |
| root | Root form element styles | 4.3.0 |
| label | Label element with label color, font size, height, and required mark display styles | 4.3.0 |
| content | Content element with form control container styling | 4.3.0 |
| help | Help container element with spacing, motion, and presentation styles for help and validation areas | 4.3.0 |
| helpItem | Single help message item with typography styles for prompt, error, and warning text | 4.3.0 |
| extra | Extra prompt container element with spacing, color, and typography styles for supplementary text | 4.3.0 |

### useForm (v2.2)

`useForm` is a method that can run independently of the Form component. It uses the Vue response mechanism to monitor and verify data, and returns the verification result. You can bind the verification result to any component, `Form. Item` only displays the results.

The following versions need to be provided separately by `@ant-design-vue/use` library, it is not recommended to continue to use, you should upgrade to version 2.2+ as soon as possible

```ts
import { Form } from '@hiltonkohler21/ant-design-vue';
const useForm = Form.useForm;

useForm(modelRef, ruleRef, [options]);
```

Parameter Description:

```ts
/*
 `modelRef`, `ruleRef` must be responsive data
*/

interface Props {
  [key: string]: any;
}
function useForm(
  modelRef: Props | Ref<Props>,
  rulesRef?: Props | Ref<Props>,
  options?: {
    immediate?: boolean;
    deep?: boolean;
    validateOnRuleChange?: boolean;
    debounce?: DebounceSettings;
  },
): {
  modelRef: Props | Ref<Props>;
  rulesRef: Props | Ref<Props>;
  initialModel: Props;
  validateInfos: validateInfos;
  resetFields: (newValues?: Props) => void;
  validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>;
  validateField: (
    name?: string,
    value?: any,
    rules?: [Record<string, unknown>],
    option?: validateOptions,
  ) => Promise<RuleError[]>;
  mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  clearValidate: (names?: namesType) => void;
  onValidate?: (
    name: string | number | string[] | number[],
    status: boolean,
    errorMsgs: string[] | null,
  ) => void;
};
```
