---
category: Components
type: Data Display
title: Segmented
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XJR2TbS1aaQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-9tSSoO_MkIAAAAAAAAAAAAADrJ8AQ/original
---

Segmented Controls.

## When To Use

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## API

### Segmented

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent's width | boolean | false |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| disabled | Disable all segments | boolean | false |  |
| options | Set children optional | string[] \| number[] \| SegmentedOption[] | [] |  |
| orientation | Orientation direction (takes priority over `vertical` when set) | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |
| shape | Shape of Segmented | `default` \| `round` | `default` | 4.3.0 |
| size | The size of the Segmented. | `large` \| `middle` \| `small` | - |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| value | Currently selected value | string \| number | - |  |
| vertical | Orientation, vertical or not (`orientation` takes priority when both are set) | boolean | false | 4.3.0 |
| label | custom label by slot | v-slot:label="SegmentedBaseOption" | - |  |

> Supported `SemanticDOM` keys: `root` \| `icon` \| `label` \| `item`.

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | The callback function that is triggered when the state changes | function(value: string \| number) |

#### SegmentedBaseOption、 SegmentedOption

```ts
interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any; // payload more data
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
}
interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}
```
