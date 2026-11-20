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

| theme count | hash 体积 (B) | cssVar 体积 (B) | 体积变化 | hash 耗时 (ms) | cssVar 耗时 (ms) | 耗时变化 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 168720 | 174211 | 3.3% | 113.2 | 84.3 | -25.5% |
| 2 | 325259 | 185689 | -42.9% | 196 | 170 | -13.3% |
| 3 | 481820 | 185819 | -61.4% | 262.2 | 266 | 1.4% |

**多主题增量（theme 1 → 3）**：hash +313100 B ｜ cssVar +11608 B ｜ 增量降低 -96.3%

**结论**：

- 单主题时 cssVar 体积略大（+3.3%，多出变量声明），但**首次生成更快**（jsdom 下 -25.5%）；
- 从 2 个主题开始 cssVar 反超（-42.9%），3 个主题时 **-61.4%**；
- 多主题增量（1→3）hash 要再增 313 KB，cssVar 只增 11.6 KB，**增量降低 96.3%** —— 与 antd 官方 benchmark 的「theme count 越大优势越大」完全一致；
- 这说明收益来自 **多主题/动态主题**；单主题项目收益有限，但也不倒扣。

> ⚠️ 基准过程中发现一个既有缺陷（与本次改造无关）：本地 `ConfigProvider` 的 `theme.algorithm`（darkAlgorithm / compactAlgorithm）**实测不生效**，因此基准改用 token 覆盖表达不同主题。该缺陷需单独排查（建议纳入后续任务）。

## 5. 对我们（Vue）的收益估算（定性补充）

## 4. 对我们（Vue）的收益估算

> 以下为**基于代码结构的估算**，正式决策前需做基准实测（见 3.5 验收方案）。

| 场景 | 现状（v5 hash 模式） | v6（cssVar + zeroRuntime） | 收益 |
| --- | --- | --- | --- |
| 单主题首屏 | 运行时解析 133 个 style 文件（26.6k 行）→ stylis 转 CSS → 插入 `<style>` | 构建时提取静态 CSS，运行时 0 解析 | JS 主线程 ↓、bundle ↓ |
| 暗色 / 紧凑切换 | 主题 token 变化 → **全部组件 style 函数重跑 + stylis 序列化 + style 替换** | 仅改写 `--ant-*` 变量值 | 主题切换**明显更快** |
| 多品牌 / 多主题共存 | 每主题一份完整样式（体积 × N） | 1 份样式 + N 组变量 | 体积**显著下降** |
| 3000 组件纯渲染 | 取决于 Vue 虚拟 DOM | 相同 | **无收益** |
| 单组件首次挂载 | 有样式生成开销 | zeroRuntime 后为 0 | 微降 |

**结论一句话**：v6 的性能收益对我们**真实存在，但集中在「样式生成 / 主题切换 / 包体积」，不在「组件渲染」**。如果我们的目标是"主题切换卡顿、首屏样式体积"，值得做；如果目标是"长列表渲染更快"，迁 v6 无用。

---

# 第三部分 · 迁移规划

## 3.1 三条候选路线（必须先选一条）

| 路线 | 内容 | 收益 | 成本/风险 | 版本 |
| --- | --- | --- | --- | --- |
| **A. 完整追平 v6** | cssVar + 语义化 DOM + API 改名 + 新组件 + 废弃入口 | 全量对齐，可宣称"支持 antd 6 API" | 最大（133 样式文件 + 60 组件 DOM + 60 组件 API） | 5.0.0 |
| **B. 仅 API 层追平** | API 改名/新增 + 新组件 + 废弃入口，**跳过 cssVar 与语义化 DOM** | API 兼容量 100% | 中（无架构改动，可保留 4.x 兼容） | 4.3.0 |
| **C. 仅性能优先** | cssVar + zeroRuntime，**API 保持 5.x** | 拿到全部**可落地**性能收益 | 中（133 样式文件） | 4.3.0 |

### 推荐：**C → B 两期走**（语义化 DOM 作为长期项 P4）

理由：

1. **C 是唯一能拿到 v6 承诺性能的路径**（也是用户最关心的点），且与 API 解耦、可独立交付；
2. **B 复用我们已完成 5.29.3 全量对齐的基础**，机械改名 + 补 44 项新 API，风险可控；
3. **语义化 DOM（A 的核心工作量）收益是可定制性，不是功能或性能**，可延后；且 v6 语义位命名（section/container）还在演进，早做易返工。

## 3.2 分阶段实施计划

### P0 · 基线切换（0.5 天）

- 把 `scripts/upstream-sync/sync-status.json` 基线切到 `6.7.1`，`bump` 出新的缺口矩阵
- CI（`.github/workflows/upstream-sync.yml`）目标版本改为 6.7.1
- **验收**：`node scripts/upstream-sync/scan.mjs --antd 6.7.1` 能稳定产出报告并入库

### P1 · CSS 变量架构（性能，5~8 天）★ 收益最高

范围：

1. `components/_util/cssinjs`：升级到支持纯 CSS 变量（对齐 cssinjs v2 行为），保留 `extractStyle`
2. `components/theme/internal.ts`：`useToken` 输出 `cssVar` 映射；`genComponentStyleHook` 支持变量模式
3. `ConfigProvider.theme`：新增 `cssVar: { prefix, key } | boolean`、`zeroRuntime: boolean`
4. **133 个 `components/*/style/index.ts`**：token 引用从字面值改为 `token.cssVar.xxx`（可用 codemod 辅助）
5. 新增 Vue 侧静态提取脚本（对标 `@ant-design/static-style-extract`）

**验收**：

- 主题切换（light ↔ dark）不产生新的 `<style>` 插入（可用 MutationObserver 断言）
- `zeroRuntime` 模式下运行时无 style 生成
- 提供基准数据对比（首屏 style 解析耗时、切换耗时、bundle 体积）

### P2 · API 改名批处理（3~5 天）

按官方 v6 迁移文档清单，**机械执行 + 兼容别名**：

- 每个废弃项：新增 v6 命名 → 旧命名保留并 `deprecated()` 告警（走我们已有的 `_util/warning.deprecated`）
- 优先级：高频组件先做（Select 族 / Modal / Drawer / Table / Steps / Timeline / Tooltip / Space / Divider）
- 补 44 项全新 API（新功能）

**验收**：每批一个 commit，新增用例 + 既有用例零回归（沿用前几轮的 stash 基线对照法）

### P3 · 新组件（3~4 天）

`Masonry` → `BorderBeam` → `Listy`（含 demo、文档、单测）

### P4 · 语义化 DOM（长期，10~15 天，可延后）

- 重建语义类型层（对标 `GenerateSemantic` / `XxxSemanticType`）
- 按族推进：Select 族 → 弹层族 → 数据展示族 → 表单族 → 其余
- 语义位命名跟随 v6（`section` / `container`），旧名双写兼容

### P5 · 废弃入口与行为调整（2~3 天）

- BackTop / Button.Group / Input.Group / Dropdown.Button / Statistic.Countdown 标废弃并引导
- SizeType `middle` → `medium`（全组件）
- Tag margin、Form `onFinish`、弹层 mask blur

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
