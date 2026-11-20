# antd v6.7.1 迁移评估报告

> 评估对象：本仓库 `ant-design-vue@4.2.7`（已对齐 antd 5.29.3）→ antd 6.7.1 评估方法：`antd@6.7.1` npm 包 `.d.ts` 三方差分（5.29.3 ↔ 6.7.1 ↔ 本地）+ 官方 v6 迁移文档生成时间：2026-11-20

---

## 一、结论摘要

**这不是 patch 升级，而是一次大版本级（对应发 5.0.0）的技术升级。**

| 维度                         | 差距                                                             |
| ---------------------------- | ---------------------------------------------------------------- |
| 组件数量                     | 缺 3 个（Masonry / BorderBeam / Listy），废弃 5 个入口           |
| 全新 API（5.x 全包都没有）   | 44 项                                                            |
| 语义化 `classNames`/`styles` | 从 18 个组件铺开到 ~60 个组件，语义位更细（如 Drawer 6 → 11 位） |
| API 废弃改名                 | ~60 个组件的旧命名在 v6 标记 deprecated（7.0 移除）              |
| 样式架构                     | 从纯 CSS-in-JS runtime 生成 → **CSS variables 唯一架构**         |
| 尺寸枚举                     | `middle` → `medium` 全局统一（6.3.0~6.3.2）                      |

扫描器对 6.7.1 基线实测：缺失组件 **3**、属性大缺口 **6**、小缺口 **50**、完全对齐仅 **15**（对比 5.29.3 基线的 0/0/0/72）。

---

## 二、L1 基础设施（阻塞项，必须最先做）

### 2.1 样式架构：CSS variables 成为唯一方案

- **antd v6**：`@ant-design/cssinjs` 只提供 CSS variables 解析，不再有 runtime hash 生成，不再支持 IE。
- **本地现状**：纯 CSS-in-JS（`genComponentStyleHook` + hash），**无 cssVar 支持**（`theme` 配置里连 `cssVar` 字段都没有）。
- **需要改动**：
  - `components/theme/internal.ts` + `components/_util/cssinjs`：接入 cssVar 模式
  - `ConfigProvider.theme` 支持 `cssVar: { prefix, key } | boolean`
  - 全部 `components/*/style/index.ts`（约 100 个文件）的样式输出改为 `var(--ant-*)`
  - 主题切换从"重新序列化 CSS"改为"改变量"
- **风险**：★★★★★（触及所有样式，且与 `classNames/styles` 语义化强耦合）

### 2.2 SizeType 枚举统一

- **本地**：`export type SizeType = 'small' | 'middle' | 'large'`
- **v6**：`'small' | 'medium' | 'large'`，分批废弃（6.3.0 ~ 6.3.2）
  - `Avatar`/`Badge`/`Card`/`Progress`/`Steps`/`Switch`/`Spin`：`default` → `medium`
  - `Descriptions`：`middle` → `medium`，`default` → `large`
  - `Table`/`Divider`：`middle` → `medium`
- **需要改动**：`SizeContext.ts` / `context.ts` 的 `SizeType`，及各组件 size 判断分支 + 样式类的 `-middle` → `-medium`

### 2.3 icons 版本联动

- antd v6 要求 `@ant-design/icons >= 6`
- 本地：`@ant-design/icons-vue ^7`，需确认 Vue 侧对应大版本并同步升级（icons v6 与 antd v5 不兼容，属联动破坏）

### 2.4 语义类型体系重建

v6 引入集中式语义类型（`GenerateSemantic` / `XxxSemanticType`，见 `_util/hooks/useMergeSemantic/semanticType`），例如：

```ts
// v6 Drawer 语义位（11 位，content 废弃→section）
root | mask | header | title | extra | section | body | footer | wrapper | dragger | close;
```

本地目前是各组件手写 `SemanticNames<'...'>`（5.29.3 的 6 位：mask/wrapper/content/header/body/footer），需要重建统一类型层。

---

## 三、L2 组件增删

### 3.1 新增（需从零实现）

| 组件         | 规模（antd 编译后）                | 说明                |
| ------------ | ---------------------------------- | ------------------- |
| `Masonry`    | Masonry 202 行 + MasonryItem 41 行 | 瀑布流布局          |
| `BorderBeam` | 100 + 32 + 36 行                   | 边框光效（v6 新增） |
| `Listy`      | 69 行                              | 列表容器（v6 新增） |

相对 ColorPicker（约 3000 行）体量较小，可复用现有 `classNames/styles` + `cssVar` 基础设施。

### 3.2 废弃入口（v6 标记 `@deprecated`）

| 本地入口                               | v6 替代                                 |
| -------------------------------------- | --------------------------------------- |
| **`BackTop` 独立组件**（4.2.7 刚新增） | `FloatButton.BackTop`                   |
| `Button.Group`                         | `Space.Compact`                         |
| `Input.Group`                          | `Space.Compact`                         |
| `Dropdown.Button`                      | `Space.Compact` + `Dropdown` + `Button` |
| `Statistic.Countdown`                  | `Statistic.Timer type="countdown"`      |

---

## 四、L3 API 废弃改名（核心 breaking）

官方 v6 迁移文档列出的废弃项覆盖约 60 个组件。**重点是：这些不是"再补一层新 API"，而是把 5.x 的命名体系整体替换成 v6 体系。**

### 4.1 我们 4.2.7 已实现、但 v6 要废弃/改名的（需要二次改造）

| 组件 | 4.2.7 已实现 | v6 要求 |
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
| Tooltip | `classNames.body`（我们实现的语义位） | → `classNames.container` |
| Drawer | `classNames.content` / `width` / `height` / `maskClosable` | → `section` / `size` / `mask.closable` |
| Modal | `maskClosable` / `focusTriggerAfterClose` | → `mask.closable` / `focusable.focusTriggerAfterClose` |
| Tag | `bordered={false}` / `color="x-inverse"` | → `variant="filled"` / `variant="solid"` |
| Image | `visible` / `maskClassName` / `toolbarRender` / `wrapperStyle` | → `open` / `classNames.cover` / `actionsRender` / `styles.root` |
| Transfer | `operations` / `listStyle` / `operationStyle` | → `actions` / `styles.section` / `styles.actions` |
| Cascader/Select/TreeSelect/AutoComplete | `popupClassName`、`dropdownXxx` | → `classNames.popup.root`、`styles.popup.root`（部分我们已做） |

（完整清单见 antd 官方 `docs/react/migration-v6` 文档「API 调整」章节）

### 4.2 v6 全新 API（44 项，5.x 全包都没有）

```
config-provider(8): borderBeam, cardMeta, inputPassword, inputSearch, listy, masonry, otp, qrcode(+ribbon)
splitter(6): collapsibleIcon, draggerClassName, draggerIcon, draggerStyle, onDraggerDoubleClick, supportMotion
steps(3): itemComponent, rootComponent, titlePlacement
modal(3): focusable, rootStyle, scrollLock
image(2): rootStyle, wrapperStyle
progress(2): gapPlacement, railColor
tabs(2): tabPlacement, tabPosition
typography(2): measureDeps, shimmer
button(2): _skipSemantic, iconPlacement
tree(1): rootStyle  |  drawer(1): focusable  |  float-button(1): individual
input(1): searchIcon  |  select(1): loadingIcon  |  skeleton(1): internalClassName
slider(1): ariaDescribedByForHandle  |  timeline(1): titleSpan  |  upload(1): hasPreview
breadcrumb(1): dropdownIcon  |  carousel(1): dotPlacement  |  cascader(1): onPopupVisibleChange
collapse(1): expandIconPlacement  |  divider(1): titlePlacement
```

### 4.3 横向新体系（v6 的方向性变化）

| 体系 | 内容 | 影响组件 |
| --- | --- | --- |
| `orientation` 替代 `vertical`/`direction` | 新枚举 `'horizontal' \| 'vertical'` | Space / Steps / Segmented / Radio / Slider / Flex / Timeline / Splitter |
| `variant` 体系扩展 | 新增 `variant` 的组件 | Alert / Tag / Timeline / Steps |
| `classNames` + `styles` 全面铺开 | 几乎所有组件成对新增 | ~60 组件 |
| `closable` / `mask` / `focusable` 对象化 | 从扁平 prop 收敛为对象 | Alert / Modal / Drawer / Tag |
| `suffix` 替代 `suffixIcon` | 图标收敛 | Select / Cascader / DatePicker / TreeSelect |

---

## 五、L4 语义化 DOM 重构（工作量最大项）

v6 的头号变化是「组件语义化结构」：

- 每个组件内部 DOM 被拆成语义节点，并通过 `classNames` / `styles` 暴露
- 语义位命名与 5.29.3 不完全一致（`content` → `section`、`body` → `container` 等）
- **ConfigProvider 支持按语义位配置**（`<ConfigProvider drawer={{ classNames: {...}, styles: {...} }} />`）

本地已完成 5.29.3 语义化的 18 个组件（Select 族 / Modal / Drawer / Badge / Empty / Space / Tooltip / Button / Card / Descriptions / List / Input / Slider）， v6 需要：**~60 个组件 × 平均 6~11 个语义位**，且命名体系要换。

---

## 六、L5 行为/默认值变化

| 变化                 | 说明                                | 影响                           |
| -------------------- | ----------------------------------- | ------------------------------ |
| Tag 默认 margin 移除 | 去掉末尾 `margin-inline-end`        | 依赖该行为的布局会塌           |
| Form `onFinish` 语义 | 不再包含 `Form.List` 未注册子项数据 | 表单提交数据变小               |
| 弹层 `mask` 模糊     | 6.0~6.2 默认开，6.3 起默认关        | Modal/Drawer 视觉              |
| DOM 结构升级         | 大量组件内部节点变化                | 依赖内部选择器的自定义样式失效 |
| 移除 v4 遗留 API     | `findDOMNode` 兼容逻辑等            | 低影响（Vue 侧本就不同构）     |
| React >= 18          | 与 Vue 无关                         | 忽略                           |

---

## 七、实施建议

### 7.1 版本策略

**不建议在 4.x 上直接迁 v6**：废弃改名 + CSS 变量 + 语义化 DOM 三重破坏叠加，应作为 **5.0.0 大版本**独立分支（如 `feat/antd-6`）。

### 7.2 分阶段顺序（按风险从高到低）

| 阶段 | 内容 | 说明 |
| --- | --- | --- |
| **P0** | 扫描基线切到 6.7.1（`sync-status.json` + CI 目标版本） | 让缺口可量化跟踪 |
| **P1** | CSS variables 架构 + SizeType 枚举 + icons 升级 | 阻塞项，先做 |
| **P2** | 语义类型体系 + 语义化 DOM（~60 组件） | 工作量最大，按组件族分批 |
| **P3** | API 废弃改名批处理（按官方清单机械执行，保留兼容别名 + 废弃告警） | 可脚本化，风险中等 |
| **P4** | 新组件 Masonry / BorderBeam / Listy | 体量可控 |
| **P5** | 废弃入口迁移（BackTop→FloatButton.BackTop 等）+ 行为默认值调整 | 收尾 |

### 7.3 可复用的现有资产

- `scripts/upstream-sync/scan.mjs`：改 `--antd 6.7.1` 即可产出 v6 缺口矩阵（已验证可跑）
- `components/_util/semantic.ts` + `useVariant` + `rootClassName` 基础设施：v6 可直接演进，不必从零搭
- 已实现的 `popupXxx` / `variant` / `destroyOnHidden` / `classNames+styles`：v6 大多延续，改名为主

### 7.4 关键决策点（需拍板）

1. **v6 别名兼容层**：是否先做「v6 新名 = 新 API，5.x 名保留为废弃别名」，一次性交付兼容，还是直接切 v6 命名（更干净但破坏性更大）？
2. **CSS 变量切换方式**：全量切换到 v6 cssinjs（大改），还是先做双模式（兼容现有 hash 模式）？
3. **废弃组件处理**：BackTop / Button.Group / Input.Group / Dropdown.Button 是直接标废弃（保留实现），还是彻底移除？
4. **语义位命名**：跟随 v6（`section`/`container`）还是保留 5.x（`content`/`body`）做双写兼容？

---

## 八、附：可复现命令

```bash
# v6 缺口扫描（产出 .cache/upstream/report-6.7.1.md）
node scripts/upstream-sync/scan.mjs --antd 6.7.1

# 5.29.3 ↔ 6.7.1 API 双向差分
node .cache/analyze-v6.mjs
node .cache/analyze-v6-verify.mjs
```
