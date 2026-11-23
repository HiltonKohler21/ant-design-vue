---
category: Components
type: Data Display
title: Timeline
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FkTySqNt3sYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*yIl9S4hAIBcAAAAAAAAAAAAADrJ8AQ/original
---

Vertical display timeline.

## When To Use

- When a series of information needs to be ordered by time (ascending or descending).
- When you need a timeline to make a visual connection.

## API

```html
<a-timeline>
  <a-timeline-item>step1 2015-09-01</a-timeline-item>
  <a-timeline-item>step2 2015-09-01</a-timeline-item>
  <a-timeline-item>step3 2015-09-01</a-timeline-item>
  <a-timeline-item>step4 2015-09-01</a-timeline-item>
</a-timeline>
```

### Timeline

Timeline

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Config-driven timeline items | [TimelineItemType\[\]](#timelineitemtype) | - | 4.3.0 |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right | `left` \| `alternate` \| `right` \| `start` \| `end` | `left` |  |
| orientation | Direction of the timeline | `vertical` \| `horizontal` | `vertical` | 4.3.0 |
| pending | Set the last ghost node's existence or its content | boolean \| string \| slot | `false` |  |
| pendingDot | Set the dot of the last ghost node when pending is true | string \| slot | `<LoadingOutlined />` |  |
| reverse | reverse nodes or not | boolean | false |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| titleSpan | Custom title/label column width (out of 24 columns as number, or CSS length/percentage as string) | number \| string | - | 4.3.0 |
| variant | Node style variant | `outlined` \| `filled` | `outlined` | 4.3.0 |

### TimelineItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ~~children~~ | Item content (alias of `content`) | string \| VNode | - | 4.3.0 |
| class | Additional css class | string | - | 4.3.0 |
| color | Set the circle's color to `blue`, `red`, `green`, `gray` or other custom colors | string | `blue` | 4.3.0 |
| content | Item content | string \| VNode | - | 4.3.0 |
| ~~dot~~ | Customize timeline dot (alias of `icon`) | string \| VNode | - | 4.3.0 |
| icon | Customize timeline node icon | string \| VNode | - | 4.3.0 |
| key | Unique key of the item | string \| number | - | 4.3.0 |
| ~~label~~ | Set the label (alias of `title`) | string \| VNode | - | 4.3.0 |
| loading | Show loading state on this node | boolean | false | 4.3.0 |
| placement | Customize node placement | `start` \| `end` | - | 4.3.0 |
| ~~position~~ | Customize node position (alias of `placement`) | `left` \| `right` \| `start` \| `end` | - | 4.3.0 |
| style | Inline style of the item | CSSProperties | - | 4.3.0 |
| title | Set the title/label | string \| VNode | - | 4.3.0 |

### Timeline.Item

Node of timeline

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green` or other custom colors | string | `blue` |  |
| dot | Customize timeline dot | string\|slot | - |  |
| label | Set the label | string \| slot | - | 3.0 |
| position | Customize node position | `left` \| `right` | - |  |
