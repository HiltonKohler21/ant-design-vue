# Change Log (The following content is translated by Google)

`ant-design-vue` strictly follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

- Weekly release: patch version at the end of every week for routine bugfix (anytime for urgent bugfix).
- Monthly release: minor version at the end of every month for new features.
- Major version release is not included in this schedule for breaking change and new features.

---

## 4.3.0

`2026-11-26`

`Adopt the antd v6 performance layer (aligned with antd@6.7.2): CSS variables, zero runtime, 61-component semantic DOM, 74 locales & 317+ component tokens`

- 🌟 Add `Masonry` layout component (responsive `columns`/`gutter`, `itemRender`, `onLayoutChange`, shortest-column packing, `MasonryRef`, automatic image load/error reflow, `fresh`, and functional `classNames`/`styles`).
- 🌟 Add `BorderBeam` component (aligned with antd v6 `offset-path` rounded comet motion; `color`/`count`/`duration`/`items`/`lineWidth`/`outset`/`size`).
- 🌟 Add `Listy` list component with full antd v6 alignment (`items`, `rowKey`, `group`, `sticky`, `scrollWidth`, auto `itemHeight`, virtual scrolling, pixel/index/key/group `scrollTo`, and functional `classNames`/`styles`; legacy `data`/`itemKey` kept backwards-compatible).
- 🌟 Add 6 new subcomponents and gallery config: `Alert.ErrorBoundary` (`<a-alert-error-boundary>`), `Tag.CheckableTagGroup` (`<a-checkable-tag-group>`), `Cascader.Panel` (`<a-cascader-panel>`), `Statistic.Timer` (`<a-statistic-timer>` countdown & countup), `Space.Addon` (`<a-space-addon>`), `Tooltip.UniqueProvider` (`<a-tooltip-unique-provider>`), and `Image.PreviewGroup.items`.
- 🌟 Add backwards-compatible Ant Design v6 API upgrades across components (aligned with `antd@6.7.2`):
  - `Alert` (`title`, `variant="filled"`, `closable` object), `Tag` (`variant`, `disabled`, `href`/`target`, `closable` object), `Image` (`preview.open`/`onOpenChange`, `actionsRender`, `imageRender`, `mask` blur, `cover`, `placeholder.progress` loading progress overlay, `wrapperStyle`/`rootStyle`), and `Divider` (`orientation`/`vertical`, `titlePlacement`).
  - `DatePicker`/`TimePicker` (`multiple`, `needConfirm`, `variant`), `Form` (`variant` propagation), `Input`/`TextArea`/`Input.OTP` (`autoComplete`), `InputNumber` (`suffix`, `changeOnWheel`), `Radio.Group` (`block`, `orientation`/`vertical`), `Rate` (`size`), `Slider` (`tooltip` object, `orientation`, `startPoint`, `ariaDescribedByForHandle`), `Table` (vertical/horizontal `virtual` with fixed columns & `ellipsis`, zero-rerender column resize performance, `column.hidden`), and `Watermark` (`onRemove`, per-line styled `content`).
  - `Breadcrumb`/`Descriptions`/`Timeline` config-driven `items` (`Timeline` `orientation`/`variant`/`titleSpan`), `Modal` (`loading`, `scrollLock`, `closable`/`mask` objects), `Drawer` (`resizable`, `focusable` focus restoration, `afterOpenChange`, `closable`/`mask` objects), `Notification` (`stack`, `closable` object), `FloatButton`/`FloatButton.Group` (`placement`, `content`, `individual` circle styling), `Cascader` (`onPopupVisibleChange` compat alias), `Dropdown` (`autoAdjustOverflow`), `Tabs` (`more`, `tabPlacement`), and `Tour` (`indicatorsRender`, `keyboard`).
  - `Space` (`orientation`/`separator`), `Steps`/`Splitter`/`Progress`/`Button`/`Collapse`/`Carousel` (`autoplay.dotDuration`, `dotPlacement`)/`Segmented`/`Flex`/`Spin` (`description`, `percent="auto"`)/`Transfer`/`Input.Search` (`searchIcon`)/`Select` (`suffix`, `loadingIcon`) v6 aliases and enhancements.
- 🌟 Standardize Semantic DOM (`classNames`/`styles` supporting both static objects and functional `(info) => ...` callbacks) across **61 components**, and wire all **72 `ConfigProvider` per-component default configs**.
- 🌟 Expand internationalization to **74 locale packs** (adding `es_US`, `eu_ES`, `mr_IN`, `my_MM`, `si_LK`, `sq_AL`, `tk_TK`, `uz_UZ`, fixing `ckb_IQ` imports, and syncing upstream translations such as `ko_KR` and new keys `global.clear`/`Input.otpCell`/`ColorPicker`/`Splitter`/`Carousel`/`Text.collapse`).
- 🌟 Improve motion accessibility: add `useReducedMotion` composable so `Anchor`, `BackTop`, `FloatButton.BackTop`, `Table` scrolling, and docs code expansion honor `prefers-reduced-motion: reduce`.
- 🌟 Expand Component Design Tokens from 112 to **317+ runtime tokens** (341 documented across 61 components in `token-meta.json`, typing all `ComponentTokenMap` entries), and upgrade `ComponentTokenTable` with bilingual descriptions, real-time search/filter, click-to-copy, and `@since` tags.
- 🌟 Add CSS variable mode and enable it **by default** (aligned with antd v6). Styles are generated once, cutting CSS size by 50.5% with three themes and reducing multi-theme increments from 312129 B to 41299 B (-86.8%); a single theme costs +21.5% in exchange for theme switching. Pass `theme: { cssVar: false }` to keep the previous hashed-mode behavior.
- 🐞 Port upstream `antd@6.7.2` + `master` bug fixes and refinements: preserve `Steps` `icon={0}`, optimize `Tree` `calcRangeKeys` with `Set`, include `Calendar` `validRange` boundary dates regardless of time-of-day, settle `Message` promise when closed before mount, retain base classes on `Layout` with custom `prefixCls`, apply `defaultSortOrder` on `Table` grouping columns, preserve `Form.Item` `name={0}` validation label, sync native `Checkbox` `indeterminate` DOM state, refine `Statistic.Timer` `onChange` typing, guard `Upload` invalid JSON `linkProps` & preview keyboard semantics, and tighten `Button`/`Tabs`/`Card` transitions and selectors.
- 🐞 Fix theme customization being silently ignored in CSS-variable mode (`theme.token`, `theme.algorithm` and runtime theme switching had no effect): variable blocks were prepended to `<head>`, so the outer default `:root` won the cascade. Blocks are now appended in registration order.
- 🌟 Add `theme.zeroRuntime`. When enabled, no `<style>` is injected at runtime; pair it with pre-extracted static CSS.
- 🌟 Add `npm run static-style-extract`, which emits `dist/static-style/antdv.css`.
- 🛠 Express all dimension derivations with `calc()`, and add a `unit()` helper that appends `px` for numbers and returns strings untouched, fixing `NaN`, `undefined` and invalid `var()px` values.
- 🛠 Distinguish "plain numbers" from "CSS variables" contexts internally (`_realToken`) so rounding, ratios and color mixing stay correct in variable mode.
- 🐞 Fix 18 overlay components (`Drawer`, `Message`, `Notification`, `Modal`, `Popover`, `Dropdown`, `Select`, `Tooltip`, `Image`, etc.) emitting invalid `px` suffixes on `z-index` CSS variables that caused popups to render beneath sticky headers.
- 🐞 Fix `Splitter` blank panels, drag resize/collapse calculations, and stuck overlay mask on quick clicks; fix `ColorPicker` single/gradient mode switching, alpha dragging, `allowClear`, and `onChangeComplete`; fix `FloatButton.BackTop` component registration collision and positioning.
- 🐞 Fix Table header background turning solid black in variable mode (`TinyColor` cannot parse `var()` strings).
- 🐞 Fix Select status border width, which referenced an undefined token.
- 🐞 Fix runtime logic that depends on real color/number values after enabling CSS variables: Empty dark-mode detection (spurious opacity), Empty/Table/dark Menu/DatePicker/Slider/Tour/Image colors turning solid black, QRCode size and foreground color, Steps dimensions, and Watermark canvas font size/color.
- 🐞 Fix Layout, Upload, Carousel, BackTop, Anchor, Form, InputNumber, Popconfirm, Tour, DatePicker, dark Menu, Tree, Cascader, Transfer, Dropdown, Table and Image emitting invalid `NaN` / concatenated `var()` CSS in CSS-variable mode.
- 📖 Upgrade the documentation site to an ant.design-inspired layout with an interactive **Semantic DOM (`#semantic-dom`) previewer** across **61 components**, searchable Design Token tables with descriptions, a live nested `ConfigProvider` theme playground, upgraded Command-K search (`Ctrl/⌘ + K`, indexing docs, subcomponents & Design Tokens), TypeScript-aware StackBlitz export, expanded Theme Editor previews, Progress component-token demo, responsive horizontal scroll for narrow viewports, the **4.2.6 → 4.3.0 Migration Guide** (`/docs/vue/migration-v43`), Vite & Common Props guides, 74-locale i18n table, For AI Agents / MCP / `DESIGN.md` / `llms.txt` assets, and esbuild dev-mode library pre-bundling.

## 4.2.7

`Align with the antd 5.29.3 component and props API surface`

- 🌟 Add Splitter component, supporting `horizontal`/`vertical` layout, `lazy` dragging, `collapsible`, `min`/`max` constraints and `onResizeStart`/`onResize`/`onResizeEnd`/`onCollapse` events.
- 🌟 Add ColorPicker component, supporting solid and gradient colors, `mode` switching, `format` switching (HEX/RGB/HSB), `presets`, `disabledAlpha`, `allowClear` and `onFormatChange`/`onChangeComplete`/`onClear`.
- 🌟 Add BackTop component, supporting `target`/`visibilityHeight`/`duration`/`onClick`.
- 🌟 Add Input.OTP component for one-time passwords, supporting `length`/`mask`/`separator`/`formatter`/`onActiveChange` with automatic focus moving.
- 🌟 Input / InputNumber / Select / Cascader / TreeSelect / Mentions / AutoComplete support the `variant` prop (`outlined` / `borderless` / `filled` / `underlined`), and `ConfigProvider` supports global and per-component `variant` config.
- 🌟 Select / TreeSelect / Cascader / AutoComplete support `popupMatchSelectWidth`, `popupRender` and `onOpenChange`; the legacy `dropdownMatchSelectWidth`/`dropdownRender`/`onDropdownVisibleChange` are kept and marked as deprecated.
- 🌟 All components support `rootClassName` (aligned with antd 5.16+ for 50+ components).
- 🌟 Select / TreeSelect / Cascader / AutoComplete / Modal / Drawer / Badge / Empty / Space / Tooltip / Button / Card / Descriptions / List / Input / Slider support semantic `classNames` and `styles`.
- 🌟 Modal / Drawer / Tabs / Dropdown / Tooltip / Collapse support `destroyOnHidden`, compatible with legacy `destroyOnClose`/`destroyInactiveTabPane`/`destroyPopupOnHide`/`destroyTooltipOnHide`/`destroyInactivePanel`.
- 🌟 ConfigProvider adds `popupMatchSelectWidth`, `popupOverflow`, `holderRender` and 60 per-component default configs (`button`/`card`/`tabs`/`modal`/`table`/`image`/`empty`/`switch`/`message`/`notification`/`flex`/`warning` etc.).
- 🌟 Button supports `variant` (`outlined`/`dashed`/`solid`/`filled`/`text`/`link`), `color` and `iconPosition`.
- 🌟 Card supports `variant` and `tabProps`; Modal supports `onConfirm`/`afterOpenChange`; Drawer supports `loading`/`ariaId`.
- 🌟 Tabs supports config-driven `items` and `indicatorSize`; Calendar supports `cellRender`/`fullCellRender`/`showWeek`.
- 🌟 Table supports `sortIcon`/`filterOnClose`/`filterDropdownProps`/`virtual`.
- 🌟 Slider supports `formatter`/`onChangeComplete`/`handleRender`/`keyboard` and aria props; Progress supports `percentPosition`/`rounding`.
- 🌟 Spin supports `percent`/`fullscreen`; QRCode supports `onRefresh`/`statusRender`.
- 🌟 Switch supports `defaultValue`; Checkbox supports `required`; Radio.Group supports `defaultValue`; Avatar.Group supports `max`.
- 🌟 Divider supports `variant` (`solid`/`dashed`/`dotted`) and `size`; Collapse supports `size`; Segmented supports `shape`/`vertical`.
- 🌟 Tooltip supports `defaultOpen`/`afterOpenChange`; Typography supports `italic`; Watermark supports `inherit`; Tour supports `actionsRender`.
- 🌟 Notification supports `actions`/`showProgress`/`pauseOnHover`; Upload supports `extra`; Transfer supports `deselectAll`/`selectionsIcon`.
- 🌟 FloatButton supports `disabled`/`htmlType`/`backTop`; FloatButton.Group supports config-driven `items`.
- 🌟 Select supports `prefix`; Tree supports `switcherLoadingIcon`; Form supports `feedbackIcons`; Carousel supports `waitForAnimate`.
- 🌟 TreeSelect / Cascader / Dropdown support `dropdownRender`/`popupRender`/`dropdownStyle`; Dropdown.Button supports `buttonsRender`.
- 🌟 Cascader supports `dropdownMenuColumnStyle`/`popupMenuColumnStyle`/`autoClearSearchValue`; Mentions supports `popupClassName`.
- 🌟 Anchor.Link supports `replace`; Popconfirm supports `onPopupClick`; Empty / Layout / Calendar / Upload / Table / Form / Transfer / DatePicker / TimePicker / RangePicker add `rootClassName`.
- 🐞 Fix Switch `defaultValue` not working (the `checked` type casting overrode the uncontrolled initial value).
- 🐞 Fix `dropdownMatchSelectWidth` being overridden by the internal props spread.
- 🐞 Fix Modal `dialogClass`/`dialogStyle` not applied to `.ant-modal-content`.
- 🐞 Fix Dropdown still rendering popup content after closing (`destroyPopupOnHide` was not implemented).
- 🐞 Fix Input `autoSize` type narrowing error and Table `useSorter` event type error.
- 💄 Add Button `filled` variant style; add Collapse `small`/`large` size styles; add Segmented `shape-round` and `vertical` styles.
- 💄 Progress supports inner percent text; Input adds `filled`/`underlined` variant styles (including disabled/error/warning states).
- 📖 Add docs and demos for Splitter / ColorPicker / BackTop.
- 🛠 Add `scripts/upstream-sync` upstream gap scanner with weekly CI tracking against the latest antd API surface.

## 4.2.6

- 🐞 Fix Modal component aria-hidden error problem under chrome [#7823](https://github.com/vueComponent/ant-design-vue/issues/7823)
- 🐞 Fix the problem that the built-in input method of Safari automatically fills in the decimal point when inputting Chinese [#7918](https://github.com/vueComponent/ant-design-vue/issues/7918)
- 🐞 Fix InputNumber component disabled style problem [#7776](https://github.com/vueComponent/ant-design-vue/issues/7776)
- 🐞 Fix Select cannot lose focus problem [#7819](https://github.com/vueComponent/ant-design-vue/issues/7819)

## 4.2.5

- 🐞 Fix Empty component memory leak problem
- 🐞 Fix Image width & height property not working problem

## 4.2.4

- 🐞 Fix Wave memory leak problem

## 4.2.3

- 🌟 TourStep custom Button, support function children [#7628](https://github.com/vueComponent/ant-design-vue/pull/7628)
- 🐞 Fix the problem that the input value is hidden in Select and Cascader search multi-select mode [#7640](https://github.com/vueComponent/ant-design-vue/issues/7640)

## 4.2.2

- 🐞 Fix TreeSelect placeholder slot invalid [#7545](https://github.com/vueComponent/ant-design-vue/issues/7545)
- 🐞 Fix Tree slot responsive invalid issue [40ad45](https://github.com/vueComponent/ant-design-vue/commit/40ad45bc05b2bf9d0a2445d9f6ff365468ba90b7)
- 🐞 Fix FloatButton target type error issue [#7576](https://github.com/vueComponent/ant-design-vue/issues/7576)
- 🐞 Fix FormItem className error issue [#7582](https://github.com/vueComponent/ant-design-vue/issues/7582)
- 🐞 Fix Input Cannot input problem under lazy [#7543](https://github.com/vueComponent/ant-design-vue/issues/7543)
- 🐞 Fix the problem that placeholder is not hidden when inputting Chinese in Select [#7611](https://github.com/vueComponent/ant-design-vue/issues/7611)
- 🐞 Fix the problem that the pop-up window flashes when clicking the preset option in DatePicker [#7550](https://github.com/vueComponent/ant-design-vue/issues/7550)

## 4.2.1

- 🐞 fix Input clear action error [#7523](https://github.com/vueComponent/ant-design-vue/issues/7523)

## 4.2.0

- 🌟 Optimize the textColor change when the layout component switches to dark mode [#7498](https://github.com/vueComponent/ant-design-vue/issues/7498)
- 🌟 Tooltip added arrow hidden configuration [#7459](https://github.com/vueComponent/ant-design-vue/issues/7459)
- 🌟 Optimize Table hover performance [#7451](https://github.com/vueComponent/ant-design-vue/issues/7451)
- 🐞 Fixed the problem of changing the model during useForm verification, resulting in verification errors [#ffd4d8](https://github.com/vueComponent/ant-design-vue/commit/ffd4d8fe927f9ea40cbb6358ad997c447bd9a74e)
- 🐞 Fix Tabs folding calculation error issue [#7491](https://github.com/vueComponent/ant-design-vue/issues/7491)
- 🐞 Fix Qrcode missing type hint issue [#7502](https://github.com/vueComponent/ant-design-vue/issues/7502)
- 🐞 Fix Menu rendering error under SSR [#7349](https://github.com/vueComponent/ant-design-vue/issues/7349)
- 🐞 Fix Select and Cascader rendering errors under SSR [#7377](https://github.com/vueComponent/ant-design-vue/issues/7377)
- 🐞 Fix AutoComplete missing option slot declaration issue [#7396](https://github.com/vueComponent/ant-design-vue/issues/7396)
- 🐞 Fix Textarea autoSize not taking effect [#7478](https://github.com/vueComponent/ant-design-vue/issues/7478)
- 🐞 Fix Pagination’s Enter key triggering two page turns [#7368](https://github.com/vueComponent/ant-design-vue/issues/7368)
- 🐞 Fix the problem of Chinese input in the input box [#7391](https://github.com/vueComponent/ant-design-vue/issues/7391)[#7516](https://github.com/vueComponent/ant- design-vue/issues/7516)
- 🐞 Fix Carousel beforeChange current parameter error issue [#7419](https://github.com/vueComponent/ant-design-vue/issues/7419)

## 4.1.2

- 🐞 Fix table resize error reporting under vue 3.4 [#7291](https://github.com/vueComponent/ant-design-vue/issues/7291)
- 🐞 Fix the problem that the Segmented title attribute is not displayed [#7302](https://github.com/vueComponent/ant-design-vue/issues/7302)

## 4.1.1

- 🌟 QRcode adds scanned status [#7242](https://github.com/vueComponent/ant-design-vue/issues/7242)
- 🐞 Fix css prefix issue in nuxt [#7256](https://github.com/vueComponent/ant-design-vue/issues/7256)
- 🐞 Fix dropdown closing issue [#7246](https://github.com/vueComponent/ant-design-vue/issues/7246)
- 🐞 Fix divider vertical dashed not display issue [#7218](https://github.com/vueComponent/ant-design-vue/issues/7218)
- 🐞 Fix hook mode message console warning issue [#7281](https://github.com/vueComponent/ant-design-vue/issues/7281)
- 🐞 Fix table expansion error reporting under vue 3.4 [#7265](https://github.com/vueComponent/ant-design-vue/issues/7265)
- 🐞 Fix table group filter status error issue [#7233](https://github.com/vueComponent/ant-design-vue/issues/7233)

## 4.1.0

- 🐞 support vue 3.4 [#7239](https://github.com/vueComponent/ant-design-vue/issues/7239)

## 4.0.8

- 🐞 Fix theme responsiveness failure issue under Nuxt [#7180](https://github.com/vueComponent/ant-design-vue/issues/7180)
- 🐞 Fix error reporting caused by Wave [#7108](https://github.com/vueComponent/ant-design-vue/issues/7108)
- 🐞 Fix Upload disabled inheritance issue [#7110](https://github.com/vueComponent/ant-design-vue/issues/7110)
- 🐞 Fix Tooltip popupAlign not taking effect [#7112](https://github.com/vueComponent/ant-design-vue/issues/7112)
- 🐞 Fix Typography flashing problem [#7146](https://github.com/vueComponent/ant-design-vue/issues/7146)
- 🐞 Fix the issue that RangePicker prevIcon nextIcon does not take effect [#7127](https://github.com/vueComponent/ant-design-vue/issues/7127)
- 🐞 Fixed the issue of watermark not monitoring child element changes [#7149](https://github.com/vueComponent/ant-design-vue/issues/7149)
- 🐞 Fix Menu animation missing issue [#7130](https://github.com/vueComponent/ant-design-vue/issues/7130)
- 🐞 Fix the cursor change issue when TextArea autosize [#7121](https://github.com/vueComponent/ant-design-vue/issues/7121)

## 4.0.7

- 🌟 Added Flex component [#7052](https://github.com/vueComponent/ant-design-vue/issues/7052)
- 🌟 ConfigProvider adds wave configuration [#7036](https://github.com/vueComponent/ant-design-vue/issues/7036)
- 🌟 Watermark supports dark mode [#7067](https://github.com/vueComponent/ant-design-vue/issues/7067)
- 🐞 Fix Space duplicate Key problem [#7048](https://github.com/vueComponent/ant-design-vue/issues/7048)
- 🐞 Fix Upload disabled priority error issue [#7047](https://github.com/vueComponent/ant-design-vue/issues/7047)
- 🐞 Fix Carousel rendering error in jsx [#7077](https://github.com/vueComponent/ant-design-vue/issues/7077)
- 🐞 Fix Message offset position problem [#7093](https://github.com/vueComponent/ant-design-vue/issues/7093)
- 🐞 Fix the problem of animation failure when using Collapse custom prefix [#7074](https://github.com/vueComponent/ant-design-vue/issues/7074)

## 4.0.6

- 🐞 Fix the Dropdown onVisibleChange failure issue introduced in 4.0.4 [#7031](https://github.com/vueComponent/ant-design-vue/issues/7031)

## 4.0.5

- 🐞 Fix cssinjs performance issue [#7023](https://github.com/vueComponent/ant-design-vue/issues/7023)

## 4.0.4

- 🌟 Added esm target file
- 🌟 Added tooltip attribute to FormItem [#7014](https://github.com/vueComponent/ant-design-vue/issues/7014)
- 🐞 Fix useMessage getContainer not taking effect [#6942](https://github.com/vueComponent/ant-design-vue/issues/6942)
- 🐞 Fix the problem of Image triggering onPreviewVisibleChange event multiple times [#6945](https://github.com/vueComponent/ant-design-vue/issues/6945)
- 🐞 Fix the problem that Checkbox global disabled does not take effect [#6970](https://github.com/vueComponent/ant-design-vue/issues/6970)
- 🐞 Fix Drawer contentWrapperStyle not taking effect [#6983](https://github.com/vueComponent/ant-design-vue/issues/6983)
- 🐞 Optimize Select Dropdown and other drop-down list scroll bar display hidden logic [#6987](https://github.com/vueComponent/ant-design-vue/issues/6987)
- 🐞 Fix the problem of hiding when there are components such as input in the drop-down list such as Select Dropdown [#7020](https://github.com/vueComponent/ant-design-vue/issues/7020)

## 4.0.3

- 🐞 Fix the problem of style loss under shadow Dom [#6912](https://github.com/vueComponent/ant-design-vue/issues/6912)
- 🐞 Upgrade Icon dependency and fix icon css missing problem under shadow Dom [#6914](https://github.com/vueComponent/ant-design-vue/issues/6914)

## 4.0.2

- 🐞 Fix useMessage causing body to be removed [#6880](https://github.com/vueComponent/ant-design-vue/issues/6880)
- 🐞 Fix the problem that the water ripple effect does not disappear after Button loading is switched [#6895](https://github.com/vueComponent/ant-design-vue/issues/6895)
- 🐞 Fixed the problem that flip does not reset after Image is closed [#6913](https://github.com/vueComponent/ant-design-vue/issues/6913)
- 🐞 Fix ImageGroup animation effect loss problem [#6898](https://github.com/vueComponent/ant-design-vue/issues/6898)
- 🐞 Fix Modal missing onUpdate:open attribute declaration [#6876](https://github.com/vueComponent/ant-design-vue/issues/6876)
- 🐞 Fixed the issue of multiple clicks being triggered at the edge of Transfer's Checkbox [#6902](https://github.com/vueComponent/ant-design-vue/issues/6902)

## 4.0.1

- 🌟 FloatButton add Badge support [#6738](https://github.com/vueComponent/ant-design-vue/issues/6738)
- 🌟 Image preview zoom in and out sensitivity adjustment [#6784](https://github.com/vueComponent/ant-design-vue/issues/6784)
- 🌟 Add flip feature to Image [#6785](https://github.com/vueComponent/ant-design-vue/issues/6785)
- 🌟 Add App component to provide context [#6735](https://github.com/vueComponent/ant-design-vue/issues/6735)
- 🌟 Style extraction feature for SSR [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🌟 Support px2rem [#6817](https://github.com/vueComponent/ant-design-vue/issues/6817)
- 🌟 Tag supports borderless mode [#6819](https://github.com/vueComponent/ant-design-vue/issues/6819)
- 🌟 Avatar group mode supports shape [#6822](https://github.com/vueComponent/ant-design-vue/issues/6822)
- 🌟 AutoComplete supports borderless and custom clearIcon [#6829](https://github.com/vueComponent/ant-design-vue/issues/6829)
- 🌟 InputPassword supports controlled visible [#6863](https://github.com/vueComponent/ant-design-vue/issues/6863)
- 🐞 Fix the style misalignment problem when InputGroup is large [#6866](https://github.com/vueComponent/ant-design-vue/issues/6866)
- 🐞 Fix the problem that Checkable Tag cannot customize class [#6854](https://github.com/vueComponent/ant-design-vue/issues/6854)
- 🐞 Fix the rendering problem in Tabs animation mode [#6855](https://github.com/vueComponent/ant-design-vue/issues/6855)
- 🐞 Fix the problem that the Image height attribute does not take effect [#6840](https://github.com/vueComponent/ant-design-vue/issues/6840)
- 🐞 Fix InputNumber trigger mouseup event [#6772](https://github.com/vueComponent/ant-design-vue/issues/6772)
- 🐞 Fix the Dropdown style problem when Tabs are collapsed [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🐞 Fix Table expandedRowRender property does not take effect [#6783](https://github.com/vueComponent/ant-design-vue/issues/6783)
- 🐞 Fix dayjs not packaged into dist [#6767](https://github.com/vueComponent/ant-design-vue/issues/6767)
- 🐞 Fix clipPath browser compatibility issue [#6770](https://github.com/vueComponent/ant-design-vue/issues/6770)
- 🐞 Fix Carousel autoplay responsive problem [#6768](https://github.com/vueComponent/ant-design-vue/issues/6768)
- 🐞 Fix PageHeader ghost style problem [#6761](https://github.com/vueComponent/ant-design-vue/issues/6761)
- 🐞 Fix Checkbox not triggering Form validation [#6741](https://github.com/vueComponent/ant-design-vue/issues/6741)
- 🐞 Fix the problem that the Input prefix attribute does not take effect [#6810](https://github.com/vueComponent/ant-design-vue/issues/6810)
- 🐞 Fix Badge style problem in Avatar [#6874](https://github.com/vueComponent/ant-design-vue/issues/6874)

## 4.0

### 🔥🔥🔥 4.0 official version released 🔥🔥🔥

### Design specification adjustment

- Basic rounded corner adjustment, changed from unified `2px` to four-level rounded corners, which are `2px` `4px` `6px` `8px` respectively, which are applied to different scenarios, for example, the rounded corners of the default size Button are adjusted to `6px`.
- Main color adjustment, changed from `#1890ff` to `#1677ff`.
- Overall shadow adjustment, from the original three-level shadow adjustment to two levels, which are used for resident page components (such as Card) and interactive feedback (such as Dropdown).
- Adjust the internal spacing of some components.
- Overall de-wireframing.

### Add 5 new components

- Segmented segment controller
- WaterMark watermark
- QrCode QR code
- FloatButton floating button
- Tour roaming guide

### Technical adjustments

- Deprecated less and adopted CSS-in-JS to better support dynamic themes.
  - All less files are removed, and less variables no longer support leaking.
  - css files are no longer included in the product. Since CSS-in-JS supports importing on demand, the original `ant-design-vue/dist/antd.css` has also been removed. If you need to reset some basic styles, please import `ant-design-vue/dist/reset .css`.
  - If you need to reset the style of the component and don't want to introduce `ant-design-vue/dist/reset.css` to pollute the global style, you can try to use [App component](/components/app), to solve the problem that native elements do not have ant-design-vue specification style.
- Removed css variables and dynamic theme schemes built on top of it.
- LocaleProvider has been deprecated in 3.x (use `<ConfigProvider locale />` instead), we have completely removed the related directories `ant-design-vue/es/locale-provider`, `ant- design-vue/lib/locale-provider`.
- `babel-plugin-import` is no longer supported, CSS-in-JS itself has the ability to load on demand, no longer need plug-in support.

#### Component API adjustments

- The classname API of the component popup is unified to `popupClassName`, and similar APIs such as `dropdownClassName` will be replaced.

  - AutoComplete component
  - Cascader component
  - Select component
  - TreeSelect component
  - TimePicker component
  - DatePicker component
  - Mentions component

- The controlled visibility API of the component popup is unified as `open`, and `visible` and other similar APIs will be replaced.
  - Drawer component `visible` becomes `open`.
  - Modal component `visible` becomes `open`.
  - Dropdown component `visible` becomes `open`.
  - Tooltip component `visible` becomes `open`.
  - Tag component `visible` has been removed.
  - Slider component `tooltip` related API converges to `tooltip` property.
  - Table component `filterDropdownVisible` changed to `filterDropdownOpen`.
- `getPopupContainer`: All `getPopupContainer` needs to ensure that the returned div is unique.
- Drawer `style` and `class` are migrated to the Drawer popup area, and the original attributes are replaced by `rootClassName` and `rootStyle`.

#### Component refactoring and removal

- Remove the `locale-provider` directory. `LocaleProvider` has been removed in v4, please use `ConfigProvider` instead.

- Remove `xxxl` breakpoint attribute in grid layout. `xxxl` attribute has been removed in v4, you can use [theme customization](/docs/vue/customize-theme) to modify `screen[XS|SM|MD|LG|XL|XXL]` to modify the break Point value achieved.

- The BackTop component was deprecated in `4.0.0` and moved to the FloatButton floating button. If needed, it can be imported from FloatButton.

### [Upgrade Guide](/docs/vue/migration-v4)

## 3.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/3.x/CHANGELOG.zh-CN.md) `3.x` Change Log。

## 2.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/2.x/CHANGELOG.zh-CN.md) `2.x` Change Log。

## 1.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/1.x/CHANGELOG.en-US.md) to read change logs from `0.x` to `1.x`.
