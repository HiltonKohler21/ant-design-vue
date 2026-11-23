# SSR 静态样式导出

我们在思考是否可以如 v3 版本一样，预先烘焙组件的样式来使前端消费，所以提出了 [\[RFC\] Static Extract style](https://github.com/ant-design/ant-design/discussions/40985)。它的思路很简单，我们只需要提前将所有的组件进行一次渲染就可以从 cache 中获得完整的样式，然后将其写入到 css 文件中即可。

```tsx
const cache = createCache();

// HTML Content
renderToString(
  <StyleProvider cache={cache}>
    <Button />
    <Switch />
    <Input />
    {/* Rest antd components */}
  </StyleProvider>,
);

// Style Content
const styleText = extractStyle(cache);
```

当然，这对于开发者而言稍微有点麻烦。所以我们提供了一个方法来实现该需求：

```tsx
import { extractStyle } from 'ant-design-vue/lib/_util/static-style-extract';
import fs from 'fs';

// `extractStyle` containers all the antd component
// excludes popup like component which is no need in ssr: Modal, message, notification, etc.
const css = extractStyle();

fs.writeFile(...);
```

如果开发者使用了混合主题，也可以自行实现混合需求：

```tsx
// `node` is the components set we prepared
const css = extractStyle(node => (
  <>
    <ConfigProvider theme={theme1}>{node}</ConfigProvider>
    <ConfigProvider theme={theme2}>{node}</ConfigProvider>
    <ConfigProvider theme={theme3}>{node}</ConfigProvider>
  </>
));
```

## 零运行时静态样式（4.3.0+）

从 `4.3.0` 开始，可直接使用内置脚本预提取完整的静态样式文件：

```bash
npm run static-style-extract
```

脚本会在 `dist/static-style/antdv.css` 产出完整静态 CSS；随后在应用入口引入该 CSS，并在 `ConfigProvider` 中配置 `:theme="{ zeroRuntime: true }"`，即可在运行时彻底跳过 `<style>` 注入。
