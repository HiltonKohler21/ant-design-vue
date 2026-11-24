---
category: Components
type: Data Display
title: List
tag: DEPRECATED
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

Simple List.

> **Tip:** For long lists, virtual scrolling, grouped sticky headers, or lightweight list rendering, we recommend using the new [Listy](/components/listy/) component (`4.3.0+`). `List` is transitioning into maintenance mode.

## When To Use

A list can be used to display content related to a single subject. The content can consist of multiple elements of varying type and size.

## API

### List

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bordered | Toggles rendering of the border around the list | boolean | `false` |  |
| dataSource | DataSource array for list | any\[] | - | 1.5.0 |
| footer | List footer renderer | string \| slot | - |  |
| grid | The grid type of list. You can set grid to something like `{ gutter: 16, column: 4 }` | object | - |  |
| header | List header renderer | string \| slot | - |  |
| itemLayout | The layout of list, default is `horizontal`. If a vertical list is desired, set the itemLayout property to `vertical` | `horizontal` \| `vertical` | `horizontal` |  |
| loading | Shows a loading indicator while the contents of the list are being fetched | boolean \| [SpinProps](/components/spin/#api) | `false` |  |
| loadMore | Shows a load more content | string \| slot | - |  |
| locale | i18n text including empty text | object | `emptyText: 'No Data'` |  |
| pagination | Pagination [config](/components/pagination/#api), hide it by setting it to false | boolean \| object | `false` |  |
| renderItem | Custom item renderer, `#renderItem="{ item, index }"` | ({ item, index }) => VueNode | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| rowKey | Item's unique key, could be a string or function that returns a key | string \| number \| (item: any) => Key | - |  |
| size | Size of list | `default` \| `large` \| `small` | `default` |  |
| split | Toggles rendering of the split under the list item | boolean | `true` |  |

### pagination

Properties for pagination.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| position | Specify the position of `Pagination` | `top` \| `bottom` \| `both` | `bottom` |  |
| align | Specify the alignment of `Pagination` | `start` \| `center` \| `end` | `end` | 4.3.0 |

More about pagination, please check [`Pagination`](/components/pagination/#api).

### List grid props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| column | Column of grid | number oneOf [ 1, 2, 3, 4, 6, 8, 12, 24] | - |  |
| gutter | Spacing between grid | number | 0 |  |
| xxxl | `≥2000px` column of grid | number | - | 3.0 |
| xs | `<576px` column of grid | number | - |  |
| sm | `≥576px` column of grid | number | - |  |
| md | `≥768px` column of grid | number | - |  |
| lg | `≥992px` column of grid | number | - |  |
| xl | `≥1200px` column of grid | number | - |  |
| xxl | `≥1600px` column of grid | number | - |  |

### List.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | The actions content of list item. If `itemLayout` is `vertical`, shows the content on bottom, otherwise shows content on the far right | VueNode[] \| slot | - |  |
| classNames | Semantic DOM class names for list item, supports object or function and merges `ConfigProvider.list` | Record\<`actions` \| `extra`, string\> \| (info: { props: ListItemProps }) => Record\<`actions` \| `extra`, string\> | - | 4.3.0 |
| extra | The extra content of list item. If `itemLayout` is `vertical`, shows the content on right, otherwise shows content on the far right | string \| slot | - |  |
| styles | Semantic DOM inline styles for list item, supports object or function and merges `ConfigProvider.list` | Record\<`actions` \| `extra`, CSSProperties\> \| (info: { props: ListItemProps }) => Record\<`actions` \| `extra`, CSSProperties\> | - | 4.3.0 |

### List.Item.Meta

| Property    | Description                  | Type           | Default |
| ----------- | ---------------------------- | -------------- | ------- |
| avatar      | The avatar of list item      | slot           | -       |
| description | The description of list item | string \| slot | -       |
| title       | The title of list item       | string \| slot | -       |

## FAQ

### Is there a replacement for the deprecated List component?

Yes — please use [Listy](/components/listy/), available since `4.3.0`. It is the successor to List, with built-in virtual scrolling, sticky group headers, programmatic scrolling, and flexible custom rendering.

### How do I migrate off List?

- **Data and rendering**: `dataSource` maps to `items`, `renderItem` maps to `itemRender` (or the `#item` slot); `rowKey` keeps its meaning. For large datasets, enable `virtual` with `height` for built-in virtual scrolling.
- **Preset structures inside a row**: `List.Item`, `List.Item.Meta`, `actions`, and `extra` can all be recomposed inside `itemRender` / `#item`.
- **Structures outside the list**: place `header` and `footer` around Listy directly, wrap with [Spin](/components/spin/) for `loading`, slice your data with [Pagination](/components/pagination/) for `pagination`, and refer to the [Listy infinite loading](/components/listy/) demo for `loadMore`.
- **Styles**: customize `bordered`, `split`, and `size` via semantic DOM `classNames` / `styles` and Design Tokens; for `grid` card walls, use [Row / Col](/components/grid/) with [Card](/components/card/) directly.
