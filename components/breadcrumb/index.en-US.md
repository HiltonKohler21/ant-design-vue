---
category: Components
type: Navigation
title: Breadcrumb
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*I5a2Tpqs3y0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Tr90QKrE_LcAAAAAAAAAAAAADrJ8AQ/original
---

A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy.

## When To Use

- When the system has more than two layers in a hierarchy.
- When you need to inform the user of where they are.
- When the user may need to navigate back to a higher level.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownIcon | Custom dropdown icon for items with menu/overlay | VNode \| slot | `<DownOutlined />` | 4.3.0 |
| itemRender | Custom item renderer, #itemRender="{route, params, routes, paths}" | ({route, params, routes, paths}) => vNode | - |  |
| items | The routing stack information of router | [ItemType\[\]](#itemtype) | - | 4.3.0 |
| params | Routing parameters | object | - |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| ~~routes~~ | The routing stack information of router (deprecated, please use `items` instead) | [routes\[\]](#routes) | - |  |
| separator | Custom separator | string \| slot | `/` |  |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| class | Additional css class | string | - | 4.3.0 |
| dropdownProps | The dropdown props | [Dropdown](/components/dropdown/#api) | - | 4.3.0 |
| href | Target of hyperlink. Can not work with `path` | string | - | 4.3.0 |
| key | Unique key of the item | string \| number | - | 4.3.0 |
| menu | The menu props | [MenuProps](/components/menu/#api) | - | 4.3.0 |
| onClick | Set the handler to handle `click` event | (e: MouseEvent) => void | - | 4.3.0 |
| path | Connected path. Each path will connect with prev one. Can not work with `href` | string | - | 4.3.0 |
| separator | Custom separator (when `type` is `'separator'`) | string \| VNode | `/` | 4.3.0 |
| title | Item name | string \| VNode | - | 4.3.0 |
| type | Item type, set to `'separator'` to render an inline separator | `'separator'` | - | 4.3.0 |

### Breadcrumb.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownIcon | Custom dropdown icon | VNode \| slot | `<DownOutlined />` | 4.3.0 |
| dropdownProps | The dropdown props | [Dropdown](/components/dropdown/#api) | - | 4.3.0 |
| href | Target of hyperlink | string | - | 1.5.0 |
| menu | The dropdown menu config | [MenuProps](/components/menu/#api) | - | 4.3.0 |
| overlay | The dropdown menu | [Menu](/components/menu) \| () => Menu | - | 1.5.0 |

#### Events

| Events Name | Description                   | Arguments               | Version |
| ----------- | ----------------------------- | ----------------------- | ------- |
| click       | Handler to handle click event | (e: MouseEvent) => void | 1.5.0   |

### Breadcrumb.Separator `1.5.0`

| Property | Description | Type | Default | Version |
| -------- | ----------- | ---- | ------- | ------- |
| -        | -           | -    | -       | -       |

> When using `Breadcrumb.Separator`,its parent component must be set to `separator=""`, otherwise the default separator of the parent component will appear.

### routes

```ts
interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}
```

### Use with browserHistory

The link of Breadcrumb item targets `#` by default, you can use `itemRender` to make a `browserHistory` Link.

```html
<template>
  <a-breadcrumb :routes="routes">
    <template #itemRender="{ route, params, routes, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
      <router-link v-else :to="paths.join('/')">{{route.breadcrumbName}}</router-link>
    </template>
  </a-breadcrumb>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  interface Route {
    path: string;
    breadcrumbName: string;
    children?: Array<{
      path: string;
      breadcrumbName: string;
    }>;
  }
  export default defineComponent({
    setup() {
      const routes = ref<Route[]>([
        {
          path: 'index',
          breadcrumbName: 'home',
        },
        {
          path: 'first',
          breadcrumbName: 'first',
          children: [
            {
              path: '/general',
              breadcrumbName: 'General',
            },
            {
              path: '/layout',
              breadcrumbName: 'Layout',
            },
            {
              path: '/navigation',
              breadcrumbName: 'Navigation',
            },
          ],
        },
        {
          path: 'second',
          breadcrumbName: 'second',
        },
      ]);
      return {
        routes,
      };
    },
  });
</script>
```
