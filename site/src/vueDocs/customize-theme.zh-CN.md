# 定制主题

Ant Design Vue 设计规范和技术上支持灵活的样式定制，以满足业务和品牌上多样化的视觉需求，包括但不限于全局样式（主色、圆角、边框）和指定组件的视觉定制。

在 4.x 版本的 Ant Design Vue 中，我们提供了一套全新的定制主题方案。不同于 3.x 版本的 less 变量，有了 CSS-in-JS 与原生 CSS Variables（4.3.0 起默认开启）的加持后，动态主题的能力与性能都得到了全面增强，包括但不限于：

1. 支持动态切换主题与原生 `--ant-*` CSS 变量零开销切换；
2. 支持同时存在多个主题（多主题复用同一份组件样式）；
3. 支持针对某个/某些组件修改主题变量；
4. 支持 `zeroRuntime` 零运行时模式配合预提取的静态 CSS；
5. ...

## 在 ConfigProvider 中配置主题

在 4.x 版本中我们把影响主题的最小元素称为 **Design Token**。通过修改 Design Token，我们可以呈现出各种各样的主题或者组件。

### 修改主题变量

通过在 ConfigProvider 中传入 `theme`，可以配置主题。在升级 v4 后，将默认使用 v4 的主题，以下是将配置主题示例：

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <a-button />
  </a-config-provider>
</template>
```

这将会得到一个以 <ColorChunk color="#00b96b"></ColorChunk> 为主色的主题，以 Button 组件为例可以看到相应的变化：

![themed button](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*CbF_RJfKEiwAAAAAAAAAAAAAARQnAQ)

### 使用预设算法

通过修改算法可以快速生成风格迥异的主题，4.x 版本中默认提供三套预设算法，分别是默认算法 `theme.defaultAlgorithm`、暗色算法 `theme.darkAlgorithm` 和紧凑算法 `theme.compactAlgorithm`。你可以通过修改 ConfigProvider 中 `theme` 属性的 `algorithm` 属性来切换算法。

```html
<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
    <a-button />
  </a-config-provider>
</template>

<script setup>
  import { theme } from 'ant-design-vue';
</script>
```

### 修改组件变量 (Component Token)

除了整体的 Design Token，各个组件也会开放自己的 Component Token 来实现针对组件的样式定制能力，不同的组件之间不会相互影响。同样地，也可以通过这种方式来覆盖组件的其他 Design Token。

```html
<template>
  <a-config-provider
    :theme="{
      components: {
        Radio: {
          colorPrimary: '#00b96b',
        },
      },
    }"
  >
    <a-radio>Radio</a-radio>
    <a-checkbox>Checkbox</a-checkbox>
  </a-config-provider>
</template>
```

通过这种方式，我们可以仅将 Radio 组件的主色改为 <ColorChunk color="#00b96b"></ColorChunk> 而不会影响其他组件。

![component token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*EMY0QrHFDjsAAAAAAAAAAAAAARQnAQ)

> 注意：`ConfigProvider` 对 `message.xxx`、`Modal.xxx`、`notification.xxx` ant-design-vue 会通过 `render` 动态创建新的 vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `Modal.useModal` 方法会返回 modal 实体以及 contextHolder 节点。将其插入到你需要获取 context 位置即可。

## 动态主题的其他使用方式

### 动态切换

在 v4 中，动态切换主题对用户来说是非常简单的，你可以在任何时候通过 `ConfigProvider` 的 `theme` 属性来动态切换主题，而不需要任何额外配置。

### 局部主题

可以嵌套使用 `ConfigProvider` 来实现局部主题的更换。在子主题中未被改变的 Design Token 将会继承父主题。

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1677ff',
      },
    }"
  >
    <a-button />
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#1890ff',
        },
      }"
    >
      <a-button />
    </a-config-provider>
  </a-config-provider>
</template>
```

### 使用 Design Token

如果你希望使用当前主题下的 Design Token，我们提供了 `useToken` 这个 hook 来获取 Design Token。

```html
<template>
  <a-button :style="{ backgroundColor: token.colorPrimary }">Button</a-button>
</template>

<script setup>
  import { theme } from 'ant-design-vue';
  const { useToken } = theme;
  const { token } = useToken();
</script>
```

### 静态消费（如 less）

当你需要非 Vue 生命周期消费 Token 变量时，可以通过静态方法将其导出：

```jsx
import { theme } from 'ant-design-vue';

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
```

如果需要将其应用到静态样式编译框架，如 less 可以通过 less-loader 注入：

```jsx
{
  loader: "less-loader",
  options: {
    lessOptions: {
      modifyVars: mapToken,
    },
  },
}
```

兼容包提供了变量转换方法用于转成 v3 的 less 变量，如需使用[点击此处](/docs/vue/migration-v4)查看详情。

## 进阶使用

在 Design Token 中我们提供了一套更加贴合设计的三层结构，将 Design Token 拆解为 Seed Token、Map Token 和 Alias Token 三部分。这三组 Token 并不是简单的分组，而是一个三层的派生关系，由 Seed Token 派生 Map Token，再由 Map Token 派生 Alias Token。在大部分情况下，使用 Seed Token 就可以满足定制主题的需要。但如果您需要更高程度的主题定制，您需要了解 antd 中 Design Token 的生命周期。

### 演变过程

![token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*uF3kTrY4InUAAAAAAAAAAAAAARQnAQ)

### 基础变量（Seed Token）

Seed Token 意味着所有设计意图的起源。比如我们可以通过改变 `colorPrimary` 来改变主题色，antd 内部的算法会自动的根据 Seed Token 计算出对应的一系列颜色并应用：

```jsx
const theme = {
  token: {
    colorPrimary: '#1890ff',
  },
};
```

### 梯度变量（Map Token）

Map Token 是基于 Seed 派生的梯度变量。定制 Map Token 推荐通过 `theme.algorithm` 来实现，这样可以保证 Map Token 之间的梯度关系。也可以通过 `theme.token` 覆盖，用于单独修改一些 map token 的值。

```jsx
const theme = {
  token: {
    colorPrimaryBg: '#e6f7ff',
  },
};
```

### 别名变量（Alias Token）

Alias Token 用于批量控制某些共性组件的样式，基本上是 Map Token 别名，或者特殊处理过的 Map Token。

```jsx
const theme = {
  token: {
    colorLink: '#1890ff',
  },
};
```

### 基本算法（algorithm)

基本算法用于将 Seed Token 展开为 Map Token，比如由一个基本色算出一个梯度色板，或者由一个基本的圆角算出各种大小的圆角。算法可以单独使用，也可以任意地组合使用，比如可以将暗色算法和紧凑算法组合使用，得到一个暗色和紧凑相结合的主题。

```jsx
import { theme } from 'ant-design-vue';

const { darkAlgorithm, compactAlgorithm } = theme;

const theme = {
  algorithm: [darkAlgorithm, compactAlgorithm],
};
```

### CSS 变量模式（4.3.0 默认开启）

从 `4.3.0` 开始，`ant-design-vue` 默认开启 CSS 变量模式（`theme.cssVar` 默认为 `true`）。组件样式只生成一份，多主题与动态切换时仅更新 `--ant-*` CSS 变量声明，显著降低样式体积与切换开销：

```html
<template>
  <!-- 4.3.0 默认已开启 CSS 变量模式；可自定义变量前缀与隔离 key -->
  <a-config-provider
    :theme="{
      cssVar: { prefix: 'ant', key: 'my-theme' },
      token: { colorPrimary: '#00b96b' },
    }"
  >
    <a-button type="primary">CSS Variables</a-button>
  </a-config-provider>
</template>
```

如需回退到旧版 hash 模式，可显式传入 `:theme="{ cssVar: false }"`。

### 零运行时模式（4.3.0 新增）

在 `4.3.0` 中，你可以配合预提取的静态样式文件（运行 `npm run static-style-extract` 生成 `dist/static-style/antdv.css`）开启 `zeroRuntime: true`，运行时将不再动态注入 `<style>` 标签：

```html
<template>
  <a-config-provider :theme="{ zeroRuntime: true }">
    <App />
  </a-config-provider>
</template>
```

### 兼容旧版浏览器

请参考文档 [样式兼容](/docs/vue/compatible-style-cn)。

## API

### Theme

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| token | 用于修改 Design Token | `AliasToken` | - |
| inherit | 继承上层 ConfigProvider 中配置的主题。 | boolean | true |
| algorithm | 用于修改 Seed Token 到 Map Token 的算法 | `(token: SeedToken) => MapToken` \| `((token: SeedToken) => MapToken)[]` | `defaultAlgorithm` |
| components | 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token | OverrideToken | - |
| cssVar | 开启 CSS 变量模式（4.3.0 起默认开启），传 `false` 回退至 hash 模式 | `boolean \| { prefix?: string; key?: string }` | `true` |
| zeroRuntime | 零运行时模式（4.3.0 新增），开启后不再动态注入 `<style>`，需配合预提取静态 CSS 使用 | boolean | `false` |

### OverrideToken

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `Component` (可以是任意 antd 组件名，如 `Button`) | 用于修改 Component Token 以及覆盖该组件消费的 Alias Token | `ComponentToken & AliasToken` | - |

### SeedToken

<TokenTable type="seed"></TokenTable>

### MapToken

> 继承所有 SeedToken 的属性

<TokenTable type="map"></TokenTable>

### AliasToken

> 继承所有 SeedToken 和 MapToken 的属性

<TokenTable type="alias"></TokenTable>

## 调试主题

我们提供了帮助用户调试主题的工具：[主题编辑器](/theme-editor-cn)

你可以使用此工具自由地修改 Design Token，以达到您对主题的期望。
