---
category: Components
type: Feedback
title: Drawer
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BD2JSKm8I-kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*r29rQ51bNdwAAAAAAAAAAAAADrJ8AQ/original
---

A panel which slides in from the edge of the screen.

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

## API

**🚨 Note:** v4 uses `rootClassName` & `rootStyle` to config wrapper style instead of `class` & `style` to align the API with Modal. Prefer `classNames` and `styles` for semantic sections.

| Props | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - | 4.3.0 |
| ariaId | Accessibility `aria-labelledby` identifier bound to the Drawer root and title element `id` | string | - | 4.3.0 |
| autofocus | Whether Drawer should get focused after open | boolean | `true` | 3.0.0 |
| ~~bodyStyle~~ | Style of the drawer content part (deprecated, use `styles.body` instead) | CSSProperties | - |  |
| class | Config Drawer Panel className. Use `rootClassName` if you want to config top dom style | string | - |  |
| classNames | Semantic DOM class names | { mask?: string; wrapper?: string; content?: string; header?: string; body?: string; footer?: string } | - | 4.3.0 |
| closable | Whether a close (x) button is visible or custom close button config | boolean \| `{ closeIcon?: VueNode; disabled?: boolean; placement?: 'start' \| 'end'; 'aria-label'?: string }` | `true` | 4.3.0 |
| closeIcon | Custom close icon | VueNode \| slot | `<CloseOutlined />` | 3.0.0 |
| ~~contentWrapperStyle~~ | Style of the drawer wrapper of content part (deprecated, use `styles.wrapper` instead) | CSSProperties | - | 3.0.0 |
| ~~destroyOnClose~~ | Whether to unmount child components on closing drawer or not (deprecated, use `destroyOnHidden` instead) | boolean | `false` |  |
| destroyOnHidden | Whether to unmount child components when closing drawer | boolean | `false` | 4.3.0 |
| ~~drawerStyle~~ | Style of the Drawer popup layer (deprecated, use `styles.content` instead) | CSSProperties | - |  |
| extra | Extra actions area at corner | VueNode \| slot | - | 3.0.0 |
| footer | The footer for Drawer | VueNode \| slot | - | 3.0.0 |
| ~~footerStyle~~ | Style of the drawer footer part (deprecated, use `styles.footer` instead) | CSSProperties | - | 3.0.0 |
| forceRender | Prerender Drawer component forcely | boolean | `false` | 3.0.0 |
| getContainer | Mounted node and display window for Drawer | string \| HTMLElement \| (() => HTMLElement) \| false | `'body'` |  |
| ~~headerStyle~~ | Style of the drawer header part (deprecated, use `styles.header` instead) | CSSProperties | - | 3.0.0 |
| height | Placement is `top` or `bottom`, height of the Drawer dialog | string \| number | `378` |  |
| keyboard | Whether support press esc to close | boolean | `true` |  |
| loading | Show the skeleton loading state | boolean | `false` | 4.3.0 |
| mask | Whether to show mask or not, or configure mask blur/closable | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` | 4.3.0 |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not | boolean | `true` |  |
| ~~maskStyle~~ | Style for Drawer's mask element (deprecated, use `styles.mask` instead) | CSSProperties | `{}` |  |
| open(v-model) | Whether the Drawer dialog is visible or not | boolean | - | 4.0 |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` |  |
| push | Nested drawers push behavior | boolean \| { distance: string \| number } | `{ distance: 180 }` | 3.0.0 |
| resizable | Whether the Drawer can be resized by dragging its edge | boolean \| `{ onResizeStart?: () => void; onResize?: (size: number) => void; onResizeEnd?: () => void }` | `false` | 4.3.0 |
| rootClassName | The class name of the container of the Drawer dialog | string | - | 4.0 |
| rootStyle | Style of wrapper element which **contains mask** compared to `style` | CSSProperties | - | 4.0 |
| size | Presetted size of drawer (`default` 378px, `large` 736px) or custom width/height | `default` \| `large` \| number \| string | `default` | 3.0.0 |
| style | Style of Drawer panel. Use `styles.body` if you want to config body only | CSSProperties | - |  |
| styles | Semantic DOM inline styles | { mask?: CSSProperties; wrapper?: CSSProperties; content?: CSSProperties; header?: CSSProperties; body?: CSSProperties; footer?: CSSProperties } | - | 4.3.0 |
| title | The title for Drawer | string \| slot | - |  |
| width | Width of the Drawer dialog | string \| number | `378` |  |
| zIndex | The `z-index` of the Drawer | number | `1000` |  |

## Events

| Events Name | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | function(open) | - | 4.0 |
| close | Specify a callback that will be called when a user clicks mask, close button or Cancel button | function(e) | - |  |
