---
category: Components
type: 通用
title: Icon
subtitle: 图标
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PdAYS7anRpoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xEDOTJx2DEkAAAAAAAAAAAAADrJ8AQ/original
---

语义化的矢量图形。

## 使用方法

使用图标组件，你需要安装 [@ant-design/icons-vue](https://github.com/vueComponent/ant-design-icons-vue) 图标组件包：

```bash
# npm
npm install --save @ant-design/icons-vue

# yarn
yarn add @ant-design/icons-vue

# pnpm
pnpm add @ant-design/icons-vue

# bun
bun add @ant-design/icons-vue
```

## API

从 2.0 开始，`@hiltonkohler21/ant-design-vue` 不再内置 Icon 组件，请使用独立的包 `@ant-design/icons-vue`。

### 通用图标

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| class | 设置图标的样式名 | string | - |  |
| rotate | 图标旋转角度（IE9 无效） | number | - |  |
| spin | 是否有旋转动画 | boolean | false |  |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - |  |
| twoToneColor | 仅适用双色图标。设置双色图标的主要颜色，或主要颜色和次要颜色 | string \| \[string, string] | - |  |

其中我们提供了三种主题的图标，不同主题的 Icon 组件名为图标名加主题做为后缀。

```html
<template>
  <StarOutlined />
  <StarFilled />
  <StarTwoTone two-tone-color="#eb2f96" />
</template>
<script lang="ts" setup>
  import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue';
</script>
```

### 自定义 Icon

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| component | 控制如何渲染图标，通常是一个渲染根标签为 `<svg>` 的 Vue 组件，也可通过 `#component` 插槽传入 | Component \| slot | - |  |
| rotate | 图标旋转角度（IE9 无效） | number | - |  |
| spin | 是否有旋转动画 | boolean | false |  |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - |  |

### 关于 SVG 图标

在 `1.2.0` 之后，我们使用了 SVG 图标替换了原先的 font 图标，从而带来了以下优势：

- 完全离线化使用，不需要从 CDN 下载字体文件，图标不会因为网络问题呈现方块，也无需字体文件本地部署。
- 在低端设备上 SVG 有更好的清晰度。
- 支持多色图标。
- 对于内建图标的更换可以提供更多 API，而不需要进行样式覆盖。

更多讨论可参考：[#10353](https://github.com/ant-design/ant-design/issues/10353)。

所有的图标都会以 `<svg>` 标签渲染，可以使用 `style` 和 `class` 设置图标的大小和单色图标的颜色。例如：

```html
<template>
  <MessageOutlined :style="{ fontSize: '16px', color: '#08c' }" />
</template>
<script lang="ts" setup>
  import { MessageOutlined } from '@ant-design/icons-vue';
</script>
```

### 双色图标主色

对于双色图标，可以通过使用 `getTwoToneColor()` 和 `setTwoToneColor(colorString)` 来全局设置图标主色。

```ts
import { getTwoToneColor, setTwoToneColor } from '@ant-design/icons-vue';

setTwoToneColor('#eb2f96');
getTwoToneColor(); // #eb2f96
```

### 自定义 font 图标

在 `1.2.0` 之后，我们提供了一个 `createFromIconfontCN` 方法，方便开发者调用在 [iconfont.cn](https://iconfont.cn/) 上自行管理的图标。

```html
<template>
  <MyIcon type="icon-example" />
</template>
<script lang="ts" setup>
  import { createFromIconfontCN } from '@ant-design/icons-vue';

  const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 在 iconfont.cn 上生成
  });
</script>
```

其本质上是创建了一个使用 `<use>` 标签来渲染图标的组件。

`options` 的配置项如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| extraCommonProps | 给所有的 `svg` 图标 `<Icon />` 组件设置额外的属性 | `{ [key: string]: any }` | `{}` |
| scriptUrl | [iconfont.cn](https://iconfont.cn/) 项目在线生成的 `js` 地址，支持 `string[]` 类型 | string \| string\[] | - |

在 `scriptUrl` 都设置有效的情况下，组件在渲染前会自动引入 [iconfont.cn](https://iconfont.cn/) 项目中的图标符号集，无需手动引入。

见 [iconfont.cn 使用帮助](https://iconfont.cn/help/detail?spm=a313x.7781069.1998910419.15&helptype=code) 查看如何生成 `js` 地址。

### 自定义 SVG 图标

#### Vite

如果使用 `Vite`，可以通过配置 [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader) 将 `svg` 文件直接作为 Vue 组件导入：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [vue(), svgLoader()],
});
```

```html
<template>
  <Icon :component="MessageSvg" />
</template>
<script lang="ts" setup>
  import Icon from '@ant-design/icons-vue';
  import MessageSvg from './path/to/message.svg?component';
</script>
```

#### Vue CLI

如果使用 `Vue CLI`，可以通过配置 [vue-svg-loader](https://www.npmjs.com/package/vue-svg-loader) 来将 `svg` 图标作为 `Vue` 组件导入。更多 `vue-svg-loader` 的使用方式请参阅 [文档](https://github.com/visualfanatic/vue-svg-loader)。

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
};
```

```html
<template>
  <Icon :component="MessageSvg" />
</template>
<script lang="ts" setup>
  import Icon from '@ant-design/icons-vue';
  import MessageSvg from 'path/to/message.svg'; // 你的 '*.svg' 文件路径
</script>
```

#### Rsbuild

Rsbuild 是新一代构建工具，官网 https://rsbuild.dev/

可以自定义一个 `vue-svg-loader.js` 文件，在 `rsbuild.config.ts` 中配置：

```js
// vue-svg-loader.js
/* eslint-disable */
const { optimize } = require('svgo');
const { version } = require('vue');
const semverMajor = require('semver/functions/major');

module.exports = async function (svg) {
  const callback = this.async();

  try {
    ({ data: svg } = await optimize(svg, {
      path: this.resourcePath,
      js2svg: {
        indent: 2,
        pretty: true,
      },
      plugins: [
        'convertStyleToAttrs',
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeStyleElement',
        'removeXMLNS',
      ],
    }));
  } catch (error) {
    callback(error);
    return;
  }

  if (semverMajor(version) === 2) {
    svg = svg.replace('<svg', '<svg v-on="$listeners"');
  }

  callback(null, `<template>${svg}</template>`);
};
```

```ts
// rsbuild.config.ts
/* eslint-disable */
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  plugins: [pluginVue()],
  tools: {
    bundlerChain(chain, { CHAIN_ID }) {
      chain.module
        // 先给 svg 排除默认的规则，方便下面自定义 loader
        .rule(CHAIN_ID.RULE.SVG)
        .exclude.add(/\.svg$/);
    },
    rspack: {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: ['vue-loader', 'vue-svg-loader'],
          },
        ],
      },
      resolveLoader: {
        alias: {
          'vue-svg-loader': require('path').join(__dirname, './vue-svg-loader.js'),
        },
      },
    },
  },
});
```

`Icon` 中的 `component` 组件接受的属性如下：

| 参数   | 说明                    | 类型             | 默认值         |
| ------ | ----------------------- | ---------------- | -------------- |
| class  | 计算后的 `svg` 类名     | string           | -              |
| fill   | `svg` 元素填充的颜色    | string           | `currentColor` |
| height | `svg` 元素高度          | string \| number | `1em`          |
| style  | 计算后的 `svg` 元素样式 | CSSProperties    | -              |
| width  | `svg` 元素宽度          | string \| number | `1em`          |

## FAQ

### 为什么有时 icon 注入的样式会引起全局样式异常？

相关 issue：[#54391](https://github.com/ant-design/ant-design/issues/54391)

启用 CSS `layer` 时，动态注入的图标样式可能会影响 `@layer` 优先级，进而导致组件样式异常。

可以通过以下方式解决：

1. 确保使用最新版本的 `@ant-design/icons-vue` 配合当前版本的 `@hiltonkohler21/ant-design-vue`。
2. 尽量避免直接调用 `message`、`Modal`、`notification` 的静态方法，优先使用 `useMessage`、`useModal`、`useNotification` 或 `<a-app>` 提供的上下文实例。

如果无法避免使用静态方法，可以在 `<a-app>` 组件下提前渲染任意一个图标组件，以规避静态方法首次挂载时对样式注入顺序的影响：

```diff
 <a-style-provider layer>
   <a-config-provider>
     <a-app>
+      <!-- any icon -->
+      <RightOutlined />
       <!-- your pages -->
     </a-app>
   </a-config-provider>
 </a-style-provider>
```
