---
category: Components
subtitle: 表单
type: 数据录入
cols: 1
title: Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-lcdS5Qm1bsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ylFATY6w-ygAAAAAAAAAAAAADrJ8AQ/original
---

高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。

## 何时使用

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

## 表单

我们为 `form` 提供了以下三种排列方式：

- 水平排列：标签和表单控件水平排列；（默认）
- 垂直排列：标签和表单控件上下垂直排列；
- 行内排列：表单项水平行内排列。

## 表单域

表单一定会包含表单域，表单域可以是输入控件，标准表单域，标签，下拉菜单，文本域等。

## API

### Form

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<FormSemanticName, string>` \| `(info: { props: FormProps }) => Record<FormSemanticName, string>` | - | 4.3.0 |
| colon | 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效) | boolean | true |  |
| disabled | 设置表单组件禁用，仅对 antdv 组件有效 | boolean | false | '4.0' |
| feedbackIcons | 当 `Form.Item` 有 `hasFeedback` 属性时可以自定义图标 | `({ status, errors, warnings }) => Partial<Record<ValidateStatus, VueNode>>` | - | 4.3.0 |
| ~~hideRequiredMark~~ | 隐藏所有表单项的必选标记（已废弃，请使用 `requiredMark`） | boolean | false |  |
| labelAlign | label 标签的文本对齐方式 | `'left'` \| `'right'` \| `'start'` \| `'end'` | `'right'` | `start`/`end`: 4.3.0 |
| labelCol | label 标签布局，同 `<Col>` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | [object](/components/grid-cn/#col) | - |  |
| labelWrap | label 标签的文本换行方式 | boolean | false | '3.0' |
| layout | 表单布局 | `'horizontal'` \| `'vertical'` \| `'inline'` | `'horizontal'` |  |
| model | 表单数据对象 | object | - |  |
| name | 表单名称，会作为表单字段 `id` 前缀使用 | string | - | 2.0.0 |
| requiredMark | 必选样式，可以切换为必选、可选、隐藏或自定义渲染函数样式 | boolean \| `'optional'` \| `((label: VueNode, info: { required: boolean }) => VueNode)` | true | `renderProps`: 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| rules | 表单验证规则 | object | - |  |
| scrollToFirstError | 提交失败自动滚动到第一个错误字段 | boolean \| [options](https://github.com/stipsan/scroll-into-view-if-needed/#options) \| `{ focus?: boolean }` | false | 2.0.0 \| `focus`: 4.3.0 |
| size | 设置字段组件的尺寸（仅限 antdv 组件） | `'small'` \| `'middle'` \| `'large'` | - |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<FormSemanticName, CSSProperties>` \| `(info: { props: FormProps }) => Record<FormSemanticName, CSSProperties>` | - | 4.3.0 |
| tooltip | 统一配置表单项提示属性 | `TooltipProps & { icon?: VueNode }` | - | 4.3.0 |
| validateMessages | 验证提示模板 | ValidateMessages | - |  |
| validateOnRuleChange | 是否在 rules 属性改变后立即触发一次验证 | boolean | true |  |
| validateTrigger | 统一设置字段校验规则 | string \| string\[] | `change` | 2.0.0 |
| variant | 表单内控件变体 | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | [object](/components/grid-cn/#col) | - |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| fieldsChange | 字段更新时触发回调事件 | function(changedFields, allFields) |  |
| finish | 提交表单且数据验证成功后回调事件 | function(values) | 2.0.0 |
| finishFailed | 提交表单且数据验证失败后回调事件 | function({ values, errorFields, outOfDate }) | 2.0.0 |
| submit | 数据验证成功后回调事件 | Function(e: Event) |  |
| validate | 任一表单项被校验后触发 | Function(name, status, errorMsgs) |  |
| valuesChange | 字段值更新时触发回调事件 | function(changedValues, allValues) |  |

### 方法

| 方法名 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 name 属性或者 name 组成的数组，如不传则移除整个表单的校验结果 | (nameList?: [NamePath](#namepath)\[]) => void |  |
| getFieldInstance | 获取对应字段 DOM 节点 | (name: [NamePath](#namepath)) => HTMLElement \| null | 4.3.0 |
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | (nameList?: [NamePath](#namepath)\[]) => void |  |
| scrollToField | 滚动到对应字段位置 | (name: [NamePath](#namepath), options?: [ScrollOptions](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options) \| `{ focus?: boolean }`) => void | `focus`: 4.3.0 |
| validate | 触发表单验证, 同 validateFields | (nameList?: [NamePath](#namepath)\[] \| ValidateOptions, options?: ValidateOptions) => Promise | `validateOnly`: 4.3.0 |
| validateFields | 触发表单验证，支持 `{ validateOnly: true }` 仅校验不展示错误信息 | (nameList?: [NamePath](#namepath)\[] \| ValidateOptions, options?: ValidateOptions) => Promise | `validateOnly`: 4.3.0 |

#### NamePath

`string | number | (string | number)[]`

### Form.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoLink | 是否自动关联表单域，对于大部分情况都可以使用自动关联，如果不满足自动关联的条件，可以手动关联，参见下方注意事项 | boolean | true |  |
| colon | 配合 label 属性使用，表示是否显示 label 后面的冒号 | boolean | true |  |
| dependencies | 设置依赖字段，当依赖字段更新时自动触发关联校验 | [NamePath](#namepath)\[] | - | 4.3.0 |
| extra | 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 | string \| slot | - |  |
| hasFeedback | 配合 validateStatus 属性使用，展示校验状态图标，支持自定义反馈图标 | boolean \| `{ icons?: FeedbackIcons }` | false | `icons`: 4.3.0 |
| help | 提示信息，如不设置，则会根据校验规则自动生成 | string \| slot | - |  |
| hidden | 是否隐藏字段（依然会收集和校验字段） | boolean | false |  |
| htmlFor | 设置子元素 label `htmlFor` 属性 | string | - |  |
| label | label 标签的文本，设为 `null` 时可自动根据表单 `labelCol` 对齐控件列 | string \| null \| slot | - | `null`: 4.3.0 |
| labelAlign | 标签文本对齐方式 | `'left'` \| `'right'` \| `'start'` \| `'end'` | `'right'` | `start`/`end`: 4.3.0 |
| labelCol | label 标签布局，同 `<Col>` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | [object](/components/grid-cn/#col) | - |  |
| layout | 表单项独立布局 | `'horizontal'` \| `'vertical'` | - | 4.3.0 |
| messageVariables | 默认验证字段的信息 | `Record<string, string>` | - |  |
| name | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | [NamePath](#namepath) | - |  |
| noStyle | 为 `true` 时不带样式，作为纯字段控件使用 | boolean | false | '3.0' |
| required | 是否必填，如不设置，则会根据校验规则自动生成 | boolean | - |  |
| rules | 表单验证规则 | object \| array | - |  |
| tooltip | 配置提示信息 | string \| slot \| `(TooltipProps & { icon?: VueNode })` | - | 4.0.4 \| `object`: 4.3.0 |
| validateDebounce | 设置防抖，延迟毫秒数后进行校验 | number | - | 4.3.0 |
| validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验，设置 `parallel` 时会并行校验 | boolean \| `'parallel'` | false | 2.0.0 \| `parallel`: 4.3.0 |
| validateStatus | 校验状态，如不设置，则会根据校验规则自动生成，可选：`'success'` `'warning'` `'error'` `'validating'` | string | - |  |
| validateTrigger | 设置字段校验的时机 | string \| string\[] | `change` | 2.0.0 |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | [object](/components/grid-cn/#col) | - |  |

### 注意：

#### 3.x

自 3.0 版本以后，Form.Item 不再劫持子元素，而是通过 provider / inject 依赖注入的方式进行自动校验，这种方式可以提高组件性能，子元素也不会限制个数，同样子元素也可以是进一步封装的高级组件。你可以参考[自定义表单控件示例](#components-form-demo-customized-form-controls)

但它同样会有一些缺点：

1、自定义组件如果希望 Form.Item 进行校验展示，你需要 `const {id, onFieldChange, onFieldBlur} = useInjectFormItemContext()` 注入，并调用相应的方法。

2、一个 Form.Item 只能收集一个表单项的数据，如果有多个表单项，会导致收集错乱，例如，

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-input name="b"></a-input>
</a-form-item>
```

如上 Form.Item 并不知道需要收集 `name="a"` 还是 `name="b"`，你可以通过如下三种方式去解决此类问题：

第一种，使用多个 `a-form-item`:

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-form-item><a-input name="b"></a-input></a-form-item>
</a-form-item>
```

第二种，使用自定义组件包裹，并在自定义组件中调用 `useInjectFormItemContext`，相当于把多个表单项合并成了一个

```html
<script>
  // 自定义组件
  import { Form } from '@hiltonkohler21/ant-design-vue';
  export default {
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

第三种，组件库提供了一个 `a-form-item-rest` 组件，它会阻止数据的收集，你可以将不需要收集校验的表单项放到这个组件中即可，它和第一种方式很类似，但它不会产生额外的 dom 节点。

```html
<a-form-item>
  <a-input name="a"></a-input>
  <a-form-item-rest><a-input name="b"></a-input></a-form-item-rest>
</a-form-item>
```

#### 2.x

Form.Item 会对唯一子元素进行劫持，并监听 `blur` 和 `change` 事件，来达到自动校验的目的，所以请确保表单域没有其它元素包裹。如果有多个子元素，将只会监听第一个子元素的变化。

如果要监听的表单域不满足自动监听的条件，可以通过如下方式关联表单域：

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

### 校验规则

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| enum | 枚举类型 | string | - |
| len | 字段长度 | number | - |
| max | 最大长度 | number | - |
| message | 校验文案 | string | - |
| min | 最小长度 | number | - |
| pattern | 正则表达式校验 | RegExp | - |
| required | 是否必选 | boolean | `false` |
| transform | 校验前转换字段值 | function(value) => transformedValue:any | - |
| trigger | 校验触发的时机 | 'blur' \| 'change' \| `['change', 'blur']` | - |
| type | 内建校验类型，[可选项](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | 自定义校验（注意，[callback 必须被调用](https://github.com/ant-design/ant-design/issues/5155)） | function(rule, value, callback) | - |
| warningOnly | 仅警告，不阻塞表单提交 | boolean | `false` |
| whitespace | 必选时，空格是否会被视为错误 | boolean | `false` |

更多高级用法可研究 [async-validator](https://github.com/yiminghe/async-validator)。

## Semantic DOM

| 名称     | 说明                                                               | 版本  |
| -------- | ------------------------------------------------------------------ | ----- |
| root     | 根元素，包含表单容器的基础样式                                     | 4.3.0 |
| label    | 标签元素，包含标签的颜色、字体大小、高度、必填标记等显示样式       | 4.3.0 |
| content  | 内容元素，包含表单控件内容容器的相关样式                           | 4.3.0 |
| help     | 帮助信息容器元素，包含帮助文案与校验信息区域的间距、过渡与展示样式 | 4.3.0 |
| helpItem | 帮助信息单项元素，包含错误、警告与提示文案的排版样式               | 4.3.0 |
| extra    | 额外提示容器元素，包含补充说明文案的间距、颜色与排版样式           | 4.3.0 |

### useForm (v2.2)

`useForm` 是一个可以独立 Form 组件运行的方法，它使用 Vue 响应式机制进行数据的监听和校验，并将校验结果返回，你可以将校验结果绑定到任何组件上，`Form.Item` 也仅仅是将结果展示。

2.2 以下版本需要需要 @ant-design-vue/use 库单独提供，不建议继续使用，你应该尽快升级到 2.2+ 版本

```ts
import { Form } from '@hiltonkohler21/ant-design-vue';
const useForm = Form.useForm;

useForm(modelRef, ruleRef, [options]);
```

参数说明：

```ts
/*
 `modelRef`, `ruleRef` 必须是响应式数据
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
