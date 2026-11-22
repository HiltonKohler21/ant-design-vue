---
category: Components
type: Data Display
title: Listy
subtitle: Listy
---

A lightweight list container with row hover, separators and optional virtual scrolling.

## When To Use

- Row-based data of medium size (messages, logs, options, ...).
- Large data sets that need virtual scrolling (pass `height` + `itemHeight`, or `virtual`).

## API

### Listy

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| data | Data source | any[] | [] | 4.3.0 |
| itemRender | Custom render | (item, index) => VueNode | - | 4.3.0 |
| itemKey | Row key (field name or function) | string \| (item) => Key | - | 4.3.0 |
| height | List height (required for virtual) | number | - | 4.3.0 |
| itemHeight | Row height (required for virtual) | number | - | 4.3.0 |
| virtual | Enable virtual scrolling; auto-enabled when height + itemHeight are provided | boolean | - | 4.3.0 |
| rowHoverable | Row hover background | boolean | true | 4.3.0 |
| classNames | Semantic class names `{ root, item }` | object | - | 4.3.0 |
| styles | Semantic styles `{ root, item }` | object | - | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |
| onScroll | Scroll callback | (e: UIEvent) => void | - | 4.3.0 |

### Instance Methods

| Method | Description |
| --- | --- |
| scrollTo({ index, align, offset }) | Scroll to an item |
| scrollToIndex(index) | Scroll to an index |
