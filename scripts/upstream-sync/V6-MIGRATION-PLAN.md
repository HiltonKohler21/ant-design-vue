# antd 5.x → 6.x 完整差异梳理与迁移规划

> 评估对象：本仓库 `ant-design-vue@4.2.7`（已完整对齐 antd 5.29.3）目标版本：antd 6.7.1 方法：`antd@5.29.3` / `antd@6.7.1` npm 包 `.d.ts` 三方差分 + 官方 v6 迁移文档 + 本地实现核验状态：**仅分析与规划，未改动任何组件代码**

---

# 第一部分 · 5.x 与 6.x 的差异到底在哪

## 0. 一句话结论

v6 是**技术架构升级**，不是功能大爆发：

- 组件只多 3 个（Masonry / BorderBeam / Listy）
- props 总量 1307 → 1473（**+12.7%**），但其中 44 项是全新 API、约 60 个组件是**废弃改名**
- 真正的体量在**三件架构级重构**：纯 CSS 变量、语义化 DOM（100% 组件）、样式零运行时
- 官方承诺「v5 → v6 平滑迁移」指的是 **React 生态的 API 兼容性**，对我们（Vue 移植）反而要重做大量「命名 + 语义结构」

## 1. 架构层差异（4 项，最关键）

| 维度 | v5（本地现状） | v6 | 本地差距 |
| --- | --- | --- | --- |
| 样式架构 | CSS-in-JS **hash 模式**（`@emotion/hash` + stylis 运行时），cssVar 能力存在但**未启用** | **纯 CSS 变量模式**（`@ant-design/cssinjs@~2.1.2`），hash 模式移除 | 无 cssVar 字段、无 cssVar transformers，需重写样式层 |
| 零运行时 | 不支持 | `ConfigProvider theme={{ zeroRuntime: true }}` + `@ant-design/static-style-extract` | 本地有 `extractStyle`（SSR 用），但**无法脱离 hash 模式做静态提取** |
| 语义化 DOM | 部分组件（5.16+ 逐步，本地做了 18 个） | **全部组件 100% 完成**，语义位可按 `ConfigProvider.classNames/styles` 统一配置 | 需重构 ~60 个组件的 DOM 结构 |
| React 版本 | 16.9+ | **18+**，内置 React Compiler | **与 Vue 无关，忽略** |

## 2. 组件层差异

### 2.1 新增（3 个，需从零实现）

| 组件         | antd 编译后规模  | 说明       |
| ------------ | ---------------- | ---------- |
| `Masonry`    | 202 + 41 行      | 瀑布流布局 |
| `BorderBeam` | 100 + 32 + 36 行 | 边框光效   |
| `Listy`      | 69 行            | 列表容器   |

体量远小于 ColorPicker（约 3000 行），可复用现有 `classNames/styles` 基础设施。

### 2.2 废弃入口（5 个，v6 已标 `@deprecated`）

| 本地入口 | v6 替代 | 备注 |
| --- | --- | --- |
| **`BackTop` 独立组件**（4.2.7 刚新增） | `FloatButton.BackTop` | v6 源码注释：`@deprecated Please use FloatButton.BackTop instead` |
| `Button.Group` | `Space.Compact` |  |
| `Input.Group` | `Space.Compact` |  |
| `Dropdown.Button` | `Space.Compact + Dropdown + Button` |  |
| `Statistic.Countdown` | `Statistic.Timer type="countdown"` |  |

## 3. API 层差异

### 3.1 全新 API（44 项，5.x 全包都不存在）

```
config-provider(8): borderBeam, cardMeta, inputPassword, inputSearch, listy, masonry, otp, qrcode
splitter(6): collapsibleIcon, draggerClassName, draggerIcon, draggerStyle, onDraggerDoubleClick, supportMotion
steps(3): itemComponent, rootComponent, titlePlacement
modal(3): focusable, rootStyle, scrollLock
image(2): rootStyle, wrapperStyle          progress(2): gapPlacement, railColor
tabs(2): tabPlacement, tabPosition         typography(2): measureDeps, shimmer
button(2): _skipSemantic, iconPlacement    tree(1): rootStyle
drawer(1): focusable                       float-button(1): individual
input(1): searchIcon                       select(1): loadingIcon
skeleton(1): internalClassName             slider(1): ariaDescribedByForHandle
timeline(1): titleSpan                     upload(1): hasPreview
breadcrumb(1): dropdownIcon                carousel(1): dotPlacement
cascader(1): onPopupVisibleChange          collapse(1): expandIconPlacement
divider(1): titlePlacement
```

### 3.2 废弃改名（约 60 个组件，官方迁移文档清单）

**其中与我们 4.2.7 已实现项直接冲突的（需要二次改造）**：

| 组件 | 我们已实现（5.x 命名） | v6 要求 |
| --- | --- | --- |
| Cascader | `autoClearSearchValue` | 移除 |
| Progress | `successPercent` / `progress` | → `success` 对象 |
| Table | `filterDropdownOpen` / `onFilterDropdownOpenChange` | → `filterDropdownProps.open` / `.onOpenChange` |
| Tabs | `indicatorSize` | → `indicator={{ size }}` |
| Button | `iconPosition` | → `iconPlacement` |
| Collapse | `expandIconPosition` | → `expandIconPlacement` |
| Carousel | `dotPosition` | → `dotPlacement` |
| Divider | `type` / `orientationMargin` | → `orientation` / `styles.content.margin` |
| Space | `direction` / `split` | → `orientation` / `separator` |
| Spin | `tip` / `wrapperClassName` | → `description` / `classNames.root` |
| Splitter | `layout` | → `orientation` |
| Steps | `direction` / `labelPlacement` / `progressDot` | → `orientation` / `titlePlacement` / `type="dot"` |
| Timeline | `Timeline.Item.*` / `mode: left\|right` | → `items` / `mode: start\|end` |
| **Tooltip** | `classNames.body`（我们实现的语义位） | → `classNames.container` |
| **Drawer** | `classNames.content` / `width` / `height` / `maskClosable` | → `section` / `size` / `mask.closable` |
| Modal | `maskClosable` / `focusTriggerAfterClose` | → `mask.closable` / `focusable.focusTriggerAfterClose` |
| Tag | `bordered={false}` / `color="x-inverse"` | → `variant="filled"` / `variant="solid"` |
| Image | `visible` / `maskClassName` / `toolbarRender` / `wrapperStyle` | → `open` / `classNames.cover` / `actionsRender` / `styles.root` |
| Transfer | `operations` / `listStyle` / `operationStyle` | → `actions` / `styles.section` / `styles.actions` |
| FloatButton | `description` | → `content` |
| Statistic | `valueStyle` | → `styles.content` |
| Steps | `items.description` | → `items.content` |

### 3.3 横向体系变化（v6 的方向性演进）

| 体系 | 内容 | 涉及组件 |
| --- | --- | --- |
| `orientation` 统一 | 新枚举 `'horizontal' \| 'vertical'` 替代 `vertical: boolean` / `direction` | Space / Steps / Segmented / Radio / Slider / Flex / Timeline / Splitter |
| `variant` 扩展 | 新增 `variant` | Alert / Tag / Timeline / Steps |
| `classNames` + `styles` 全面铺开 | 几乎所有组件成对新增 | ~60 组件 |
| 对象化收敛 | `closable` / `mask` / `focusable` | Alert / Modal / Drawer / Tag |
| `suffix` 替代 `suffixIcon` | 图标入口收敛 | Select / Cascader / DatePicker / TreeSelect |
| 语义位命名 | `content`→`section`、`body`→`container` | Drawer / Tooltip 等 |

## 4. 语义化 DOM 差异（工作量最大项）

v6 官方：「v6 has completed the DOM semantic transformation for **all components**」。

| 抽样 | 5.29.3 语义位 | 6.7.1 语义位 |
| --- | --- | --- |
| Drawer | 6 位（mask / wrapper / content / header / body / footer） | **11 位**（root / mask / header / title / extra / **section** / body / footer / wrapper / dragger / close），`content` 废弃 |
| Tooltip | 2 位（root / **body**） | root / **container**（body 废弃） |
| Cascader 列样式 | `dropdownMenuColumnStyle` | `styles.popup.listItem` |

v6 还支持**函数式语义位**（`classNames: ({ props }) => ({...})`），本地是静态对象。

结构性改动：

- v6 引入集中式语义类型（`GenerateSemantic` / `XxxSemanticType`，见 `_util/hooks/useMergeSemantic/semanticType`）
- 本地是各组件手写 `SemanticNames<'...'>`

## 5. 行为 / 默认值差异

| 变化 | 影响 |
| --- | --- |
| Tag 移除末尾默认 `margin-inline-end` | 依赖该行为的布局会塌 |
| Form `onFinish` 不再包含 `Form.List` 未注册子项数据 | 表单提交数据变小 |
| 弹层 `mask` 模糊（6.0~6.2 默认开，6.3 起默认关） | Modal / Drawer 视觉 |
| `size` 枚举 `middle` → `medium`（6.3.0~6.3.2） | Avatar/Badge/Card/Progress/Steps/Switch/Spin/Descriptions/Table/Divider |
| 大量组件 DOM 结构升级 | 依赖内部选择器的自定义样式会失效 |

---

# 第二部分 · 性能提升对 Vue 是否有效（逐项拆解）

## 1. v6 性能提升的 4 个来源，逐个判定

| # | v6 性能来源 | 机制 | 对 Vue 有效？ | 判定理由 |
| --- | --- | --- | --- | --- |
| 1 | **纯 CSS 变量** | 样式只生成一次，主题切换仅改 `var(--ant-*)` 值，不再重新 stylis 序列化 + 重新插入 `<style>` | ✅ **部分有效（最重要）** | `@ant-design/cssinjs` 的 stylis 解析与 style 注入是**框架无关的 JS 工作**。本地同样跑 stylis 运行时（`components/_util/cssinjs`，133 个 style 文件 / 26598 行样式） |
| 2 | **zeroRuntime 静态提取** | 构建时提取 CSS，运行时零样式生成 | ✅ **有效（显著）** | 与框架无关。可移除运行时全部样式解析开销 + 减小 JS bundle。本地虽有 `extractStyle`（SSR），但 hash 模式下**无法预生成可多主题复用的静态 CSS** |
| 3 | 消除 `memo` 比较 | v5 动态样式需 `useMemo` 比较 token 依赖 | ❌ **基本无效** | Vue 用 `computed` 做依赖追踪，**本来就没有"手动 memo 比较"这层开销**。本地 `useStyleRegister` 已是 computed 驱动（`tokenKey` / `fullPath` 均为 computed） |
| 4 | React Compiler / React 18 并发 / 移除 findDOMNode | React 渲染层优化 | ❌ **完全无效** | React 专属，Vue 不存在这些问题 |

**结论：v6 的 4 项性能来源里，2 项对 Vue 有效（且是"样式层"），2 项对 Vue 无效。**

## 2. 官方 benchmark 测的是什么？（关键，决定收益能否落地）

官方 v6 发布文（issue #55804）的性能对比图，**自变量是 `theme count`（主题数量）**：

- v5（hash 模式）：N 个主题 = **N 份完整样式**，体积与生成时间线性增长
- v6（cssVar）：样式只生成 **1 份**，主题只是变量值 → 体积/时间基本恒定
- v6 + `zeroRuntime`：最优（体积最小、速度最快）

**所以这个收益的前提是「多主题 / 动态主题」。**

我们是否满足前提？是的：

```ts
// components/theme/index.ts —— 本地已导出三个算法
defaultAlgorithm,   // 默认亮色
darkAlgorithm,      // 暗色
compactAlgorithm,   // 紧凑
```

→ 我们支持**暗色 + 紧凑 + 运行时主题切换**，所以 cssVar 的收益可以真实落地。

## 3. 一个反证：不要夸大性能期待

antd 官方 issue **#57294《AntD v6 is still slow - Just as slow as AntD v5》**：

> 页面上放 3000 个组件，渲染仍要 1-2 秒，与 v5 无差别。

说明 v6 优化**只解决"样式生成"开销，不解决"组件渲染"开销**。后者本质是 React context 重渲染问题（antd 博客《非必要的渲染》主题），而 Vue 的响应式粒度更细、context 消费模型不同，**本来就不完全同构**——这既说明我们不需要为"渲染性能"迁移，也说明**不应把 v6 当作"性能救命药"**。

## 4. 实测数据（本地基准，theme count 口径）

> 脚本：`tests/bench/cssvar-bench.test.js`（14 个代表性组件 × theme count 1/2/3，warmup + 3 轮取中位数）运行：`npx jest --config .jest.js tests/bench/cssvar-bench.test.js`

<!-- BENCH:BEGIN（由 scripts/upstream-sync/sync-bench-doc.mjs 生成，勿手改） -->

| theme count | hash 体积 (B) | cssVar 体积 (B) | 体积变化 | hash 规则字节 (B) | cssVar 规则字节 (B) | hash 耗时 (ms) | cssVar 耗时 (ms) | 耗时变化 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 156896 | 190643 | +21.5% | 156896 | 179604 | 73.9 | 86.8 | +17.5% |
| 2 | 312947 | 211293 | -32.5% | 312947 | 189209 | 160.2 | 167.3 | +4.4% |
| 3 | 469025 | 231942 | -50.5% | 469025 | 198810 | 224.3 | 254.8 | +13.6% |

> 绝对字节随组件样式演进会变化；本表由 `scripts/upstream-sync/sync-bench-doc.mjs` 从 `.cache/cssvar-bench.json` 直接生成，与实测同源。耗时受 jsdom 调度影响有 ±20% 抖动，仅作参考。

`cssVar` 增量拆解（1 → 2 → 3 套主题）：

| 指标                 | theme 1 | theme 2 | theme 3 | 1→3 增量   |
| -------------------- | ------- | ------- | ------- | ---------- |
| CSS 体积 (B)         | 190643  | 211293  | 231942  | **+41299** |
| 组件规则 (B)         | 179604  | 189209  | 198810  | +19206     |
| 变量声明 (B)         | 11039   | 22084   | 33132   | +22093     |
| `.ant-btn{` 规则份数 | 7       | 7       | 7       | **0**      |

对照 hash 模式：`.ant-btn{` 份数 7 / 14 / 21（每套主题各生成一整份）， 1→3 的 CSS 增量为 **+312129 B**。

**结论（实测，非估算）**：

- **组件样式确实只生成一份**：`.ant-btn{` 在 cssVar 下恒为 7 份；hash 下随主题数线性增长；
- **多主题增量**（1→3）：hash +312129 B ｜ cssVar **+41299 B** → **增量降低 86.8%**；
- **单主题是净负收益**：cssVar 体积 +21.5%（多出的变量声明 + calc 表达）； **从 2 个主题起反超**（-32.5%），3 个主题 **-50.5%**；
- 单主题且不换主题的应用可显式 `theme: { cssVar: false }` 回到 hash 模式；
- cssVar 下组件规则仍有小幅增量（+19206 B）：来自必须实干色/实数值的规则（带透明度混合的 box-shadow、实色表头背景等），这部分无法用变量表达，属预期。

> 方法：挂载 N 个独立 `ConfigProvider` 子树（N 套主题用 token 覆盖表达，因为 `theme.algorithm` 本地存量不生效），14 个代表组件，warmup + 3 轮取中位数。复现：`npx jest --config .jest.js tests/bench/cssvar-bench.test.js` → `.cache/cssvar-bench.{json,md}` → `node scripts/upstream-sync/sync-bench-doc.mjs`。

**基准本身就是回归门禁**（断言，非仅打印）：

1. cssVar 多主题增量 < hash 增量的 15%；
2. 3 主题时 cssVar 总体积 < hash 总体积；
3. `.ant-btn{` 份数不随主题数增长（cssVar 恒定；hash ≥ 2 倍）；
4. cssVar 规则增量 < hash 规则增量的 20%。

> 反证：临时去掉「`_tokenKey` 主题无关化」后，本用例立即失败，证明断言有效。

<!-- BENCH:END -->

## 3.2c zeroRuntime 与静态样式提取（P1-4c）

**目标**：cssVar 模式下样式只需生成一次。开启 `zeroRuntime` 后运行时完全不注入 `<style>`，样式由构建期一次性提取成静态 CSS 文件，客户端只承担 class 计算。

### 用法

```bash
npm run static-style-extract      # 产物：dist/static-style/antdv.css（约 235 KB，含 :root 变量声明）
```

```vue
<!-- 入口引入静态 CSS（或交给打包器内联） -->
<a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
  <app />
</a-config-provider>
```

### 实现要点

| 层 | 改动 |
| --- | --- |
| `useStyleRegister` | info 新增 `zeroRuntime`；为真时仍计算样式并写入 cssinjs cache，只是跳过 `updateCSS`（含 effect 样式） |
| `useCSSVarRegister` | 变量声明登记进模块级 registry；`extractCSSVarStyle()` 汇总输出，供静态提取使用 |
| `genComponentStyleHook` | 把 `designTokenContext.zeroRuntime` 透传到每个组件的 style info |
| `config-provider/style` | 图标样式在 DesignTokenContext provide **之前**生成，故由外层显式传入 zeroRuntime（此前会漏注入一条 `anticon` 样式） |

### 提取流程

1. `StyleProvider(cache)` + `ConfigProvider(theme: {cssVar: true, zeroRuntime: true})` 挂载目标组件树；
2. 组件样式进入 cache，但 DOM 无任何 `style[data-css-hash]` / `style[data-css-var-id]`；
3. `extractStyle(cache, true) + extractCSSVarStyle()` 拼成完整 CSS 落盘；
4. 用例 `tests/bench/zero-runtime-extract.test.js` 同时断言「零注入」与「产物非空且含 :root 变量」。

> 组件源码是 Vue JSX，需经项目 babel 编译，故提取逻辑跑在 jest 环境下； `scripts/static-style-extract.mjs` 是对外稳定入口（npm script / CI 均可调用）。

### 已知边界

- 提取产物面向「主题固定」的应用；若需要运行时切换主题，请回到常规模式（cssVar 开、zeroRuntime 关），此时样式仍只生成一次，只是注入动作发生在浏览器。
- 提取覆盖多少组件取决于提取脚本里挂载的组件树；默认覆盖 Button/Input/Select/Table/Modal/Tag/Card/Tabs/Space，业务侧可按需扩充。

## 3.2d 视觉一致性抽检（P1-5）

**目的**：在不渲染截图的前提下，证明 cssVar 模式与 hash 模式产出的视觉要素一致。

**做法**（）：

1. 分别在 （hash）与 （cssVar）下挂载同一组件树；
2. 从生成的 CSS 中按选择器抽取关键属性；
3. 把 cssVar 侧的 逐层解析为具体值，并对 做四则求值；
4. 归一化后逐项比对，差异必须修复或解释。

**覆盖**（9 组选择器，含 `.ant-menu-dark`）：

| 组件 | 选择器 | 比对属性 |
| --- | --- | --- |
| Button |  | font-size / height / border-radius / padding / color / background / border-color |
| Button(primary) |  | color / background / border-color / box-shadow |
| Input |  | font-size / height / border-radius / padding / color / background |
| Select |  | border-radius / background / border-color |
| Table |  | font-size / background / border-radius |
| TableHeader |  | color / background / font-weight / text-align |
| Modal |  | border-radius / background / padding |

**抽检发现并修复的真实缺陷**：

- `.ant-table-thead >tr>th` 在 cssVar 模式下 `background` 变成 `#000000`（hash 模式为 `#fafafa`）。根因：表格用 `new TinyColor(colorFillAlter).onBackground(colorBgContainer)` 计算实色背景，而 cssVar 模式下这些 token 是 `var(--ant-*)` 字符串，TinyColor 解析失败退化成黑色。修复：颜色运算改用 `_realToken`（真实色值），CSS 输出仍走变量。

结论：抽检差异 0 项；jsdom 不支持 测量，测试内对 做了打桩。

## 3.4 阶段 C 收尾（antd v6 性能层）

**状态：已完成并可通过测试验证。**

| 交付物 | 位置 | 验收 |
| --- | --- | --- |
| CSS 变量架构 | `components/_util/cssinjs/util/css-variables.ts`、`hooks/useCSSVarRegister.ts`、`util/calc/*` | `cssvar-token-chain` 用例：未解析变量 0 |
| 主题层接线 | `components/theme/internal.ts`（useToken 五元组）、`util/genComponentStyleHook.ts`、`util/unitless.ts` | Button PoC + 40 组件冒烟 |
| token 算术 calc 化 | 全库 `components/**/style/**` | `cssvar-illegal-check`：NaN / undefined / 裸变量算术 均为 0 |
| zeroRuntime + 静态提取 | `scripts/static-style-extract.mjs`、`npm run static-style-extract` | `zero-runtime-extract`：运行时零注入、产物 235 KB（约 230 KiB） |
| 视觉一致性 | `tests/bench/visual-parity.test.js` | 9 组选择器（含暗色 Menu）差异 0 |
| 运行时取值守卫 | `tests/bench/runtime-token-values.test.js` | 5 个用例：Empty 暗色判断/SVG、QRCode 尺寸、Steps、Watermark 语义、源码级 realToken 守卫 |
| 基准实测 | `tests/bench/cssvar-bench.test.js` | 3 主题 CSS 体积 -50.5%；多主题增量 hash +312129 B → cssVar +41299 B（降低 86.8%）；组件规则份数不随主题数增长（已写入性能契约断言） |

### 使用方式

```vue
<!-- 默认即为运行时模式：样式只生成一次，注入发生在浏览器（无需配置） -->
<a-config-provider>
  <app />
</a-config-provider>

<!-- 需要回退到 4.x 的 hash 模式时 -->
<a-config-provider :theme="{ cssVar: false }">
  <app />
</a-config-provider>

<!-- 零运行时模式：配合预提取 CSS（主题固定时使用） -->
<a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
  <app />
</a-config-provider>
```

```bash
npm run static-style-extract   # 产出 dist/static-style/antdv.css
```

### 兼容性

- `cssVar` **默认开启**（对齐 antd v6）：需要在存量项目里保持旧行为时，显式传 `theme: { cssVar: false }`；
- 两种模式共用同一套 styleFn，仅 token 表示形式不同，因此不存在双份样式代码；
- `zeroRuntime` 仅影响「是否注入 DOM」，样式计算与缓存逻辑不变。

### 反证实验（证明测试不是弱验证）

| 用例 | 人为回退修复 | 结果 |
| --- | --- | --- |
| `cssvar-bench`（性能契约） | 去掉 `_tokenKey` 主题无关化 | **失败**：多主题增量 379033 B > 阈值 78046 B |
| `runtime-token-values`（Empty 暗色判断） | 把 `realToken` 改回 `token` | **失败**：svg 被误加 `opacity: 0.65` |
| `runtime-token-values`（Watermark 语义） | 把 Watermark 改回 `token.value` | **失败**：编译期/断言即报错（realToken 缺失） |
| `cssvar-illegal-check`（全量探针） | 回退 DatePicker/Menu/Tree 的 calc 化 | **失败**：命中 Nanpx / `var()px` 计数 > 0 |

恢复修复后两者均通过，说明断言确实能捕捉对应回归。

### 运行时取值退化（cssVar 下必须用 `realToken` 的清单）

cssVar 模式下 token 值是 `var(--ant-*)` 字符串，以下位置的取值参与 JS 计算 / Canvas / SVG 绘制，必须使用 `useToken()` 返回的 `realToken`：

| 组件 | 位置 | 退化表现 |
| --- | --- | --- |
| Empty | `empty.tsx` 暗色判断 `TinyColor(colorBgBase).toHsl().l` | 恒判为暗色，误加 `opacity: 0.65` |
| Empty | `simple.tsx` SVG 配色（TinyColor 混合） | 边框/阴影/内容色变 `#000000` |
| QRCode | `index.tsx` 尺寸 `size - (paddingSM + lineWidth) * 2`、默认前景色 | 尺寸 NaN / 前景变黑 |
| Steps | `index.tsx` `controlHeight` 数值 | 尺寸计算 NaN |
| Watermark | `index.tsx` Canvas 字号与颜色 | 字号 NaN / 文字变黑 |
| Table | `style/index.ts` 实色背景 `TinyColor().onBackground()` | 表头背景变 `#000000` |

### 已知限制（不阻塞本阶段验收）

1. `ConfigProvider` 的 `theme.algorithm`（`darkAlgorithm` / `compactAlgorithm`）在本地不生效，属存量缺陷，与 cssVar 无关，需单独排查；
2. 组件级变量的 scope 采用组件根类名（未叠加 hash 隔离类），嵌套 `ConfigProvider` 的局部主题场景下变量声明会相互覆盖；
3. 静态提取的组件覆盖范围取决于提取脚本挂载的组件树，业务侧可按需扩充；
4. `getTargetScrollBarSize` 与 `vc-util/Dom/css` 的 `getComputedStyle` 在未挂载节点/不支持伪元素的环境下已加 try/catch 兜底（jsdom、SSR 场景）；
5. 非法 CSS 检测已从「手挑组件一次性挂载」升级为「**67 个组件/状态逐个挂载**」（含 DatePicker/Menu 暗色/Tree/Cascader/Dropdown 弹层、Upload 三形态、Tour 打开态、Image 预览、Table expandable、Layout/Form/InputNumber/Carousel/Anchor/BackTop/Popconfirm/Modal/Drawer/Affix/Grid）；检测类别也补齐为 `NaN` / `undefined` / `[object Object]` / 裸变量算术 / `-var()` / `var() 拼数字`（如 `var(--x)32`）。历史上的 NaN 盲区（DatePicker 50 处、Menu 28 处、Tree 12 处、Layout/Upload/Carousel/Form/Image 等）均由此前「覆盖不足 + 检测类别不全」导致，现已全部修复并纳入门禁。

## 3.3 工作量汇总

| 阶段          | 工作量         | 风险                   | 交付价值                 |
| ------------- | -------------- | ---------------------- | ------------------------ |
| P0 基线       | 0.5 天         | 低                     | 可量化跟踪               |
| P1 cssVar     | 5~8 天         | **高**（133 样式文件） | **性能收益（唯一来源）** |
| P2 API 改名   | 3~5 天         | 中                     | API 兼容量               |
| P3 新组件     | 3~4 天         | 低                     | 功能补齐                 |
| P4 语义化 DOM | 10~15 天       | 高                     | 可定制性                 |
| P5 废弃/行为  | 2~3 天         | 中                     | 一致性                   |
| **合计**      | **24~36 人天** |                        |                          |

## 3.4 关键风险

| 风险 | 说明 | 缓解 |
| --- | --- | --- |
| cssVar 改造面广 | 133 个样式文件，逐个改易漏 | 先做 3 个组件试点（Button / Input / Select），验证方案后再批量 codemod |
| 视觉回归 | 变量化后像素级可能偏移 | 引入视觉回归（demo 快照已有基础） |
| 语义位命名返工 | v6 自己也在迭代（content→section 就在 6.x 内变过） | 语义化 DOM 延后到 P4 |
| 与在途改动冲突 | 工作区当前有其他未提交改动（color-picker / site 等） | 动工前先清场确认 |
| 双模式维护成本 | 若保留 hash + cssVar 双模式，样式层复杂度翻倍 | 建议**一次性切换**，不保留双模式（与 v6 一致） |

## 3.5 动工前的必做验证（建议）

1. **性能基准实测**（决定 P1 是否值得做）
   - 用现有 demo 站点测：亮暗切换耗时、首屏 style 标签数量与解析耗时、bundle 中样式代码占比
   - 与 antd 官方 benchmark 口径对齐（theme count = 1 / 2 / 3）
2. **试点组件**：Button + Input + Select 三个组件先 cssVar 化，量测收益
3. **工作区清场**：确认当前未提交改动归属

## 3.6 需要你拍板的决策点

| #   | 决策                    | 选项                                                  |
| --- | ----------------------- | ----------------------------------------------------- |
| 1   | 路线选择                | A 完整追平 / B 仅 API / **C 仅性能 → 再做 B（推荐）** |
| 2   | cssVar 是否保留双模式   | 一次性切换（推荐，同 v6）/ 双模式并存                 |
| 3   | 版本号                  | 4.3.0（B/C 路线）/ 5.0.0（A 路线）                    |
| 4   | 语义化 DOM 时机         | 延后（推荐）/ 与 P1 同期                              |
| 5   | 废弃入口处理            | 标废弃保留实现（推荐）/ 直接移除                      |
| 6   | 是否先做性能实测再定 P1 | **建议先实测**（半天成本，避免 10 天投错方向）        |

---

# 附录 · 可复现命令与数据

```bash
# v6 缺口扫描
node scripts/upstream-sync/scan.mjs --antd 6.7.1

# 5.29.3 ↔ 6.7.1 API 双向差分（新增 / 移除 props）
node scripts/upstream-sync/tools/analyze-v6.mjs
node scripts/upstream-sync/tools/analyze-v6-verify.mjs
```

实测数据（扫描器口径）：

| 指标         | 5.29.3 | 6.7.1          |
| ------------ | ------ | -------------- |
| 组件数       | 72     | 74             |
| props 总量   | 1307   | 1473（+12.7%） |
| 本地缺失组件 | 0      | 3              |
| 属性大缺口   | 0      | 6              |
| 属性小缺口   | 0      | 50             |
| 完全对齐     | 72     | 15             |

本地样式资产：`components/**/style/*.ts*` = **133 个文件 / 26598 行**（P1 的改造面）。
