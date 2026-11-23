---
category: Components
type: Data Display
title: Carousel
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bPMSSqbaTMkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-58QpYnqOsAAAAAAAAAAAAADrJ8AQ/original
---

A carousel component. Scales with its container.

## When To Use

- When there is a group of content on the same level.
- When there is insufficient content space, it can be used to save space in the form of a revolving door.
- Commonly used for a group of pictures/cards.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| adaptiveHeight | Adjust the slide's height automatically | boolean | `false` |  |
| arrows | Whether to show the arrow buttons | boolean | `false` |  |
| autoplay | Whether to scroll automatically; pass `{ dotDuration: true }` to display a progress bar on dots | `boolean \| { dotDuration?: boolean }` | `false` | 4.3.0 |
| autoplaySpeed | Delay between each auto scroll (in milliseconds) | number | `3000` |  |
| dotPlacement | The position of the dots (`top`, `bottom`, `start`, `end`, RTL-aware), takes precedence over `dotPosition` | `top` \| `bottom` \| `start` \| `end` | `bottom` | 4.3.0 |
| dotPosition | The position of the dots (deprecated, please use `dotPlacement`), options: `top` `bottom` `left` `right` `start` `end` | string | `bottom` | 1.5.0 |
| dots | Whether to show the dots, or `{ className?: string }` to customize dot class name | `boolean \| { className?: string }` | `true` |  |
| dotsClass | Class name of the dots | string | `slick-dots` |  |
| draggable | Enable scrollable via dragging on desktop | boolean | `false` |  |
| easing | Transition interpolation function name | string | `linear` |  |
| effect | Transition effect | `scrollx` \| `fade` | `scrollx` |  |
| fade | Use fade transition | boolean | `false` |  |
| infinite | Infinitely wrap around contents | boolean | `true` |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| speed | Animation speed in milliseconds | number | `500` |  |
| waitForAnimate | Whether to wait for the animation when switching | boolean | `false` | 4.3.0 |
| afterChange | Callback function called after the current index changes | function(current) | - |  |
| beforeChange | Callback function called before the current index changes | function(from, to) | - |  |

## Methods

| Name | Description | Version |
| --- | --- | --- |
| goTo(slideNumber, dontAnimate) | Go to slide index, if dontAnimate=true, it happens without animation |  |
| next() | Change current slide to next slide |  |
| prev() | Change current slide to previous slide |  |

For more info on the props, refer to the [carousel props](https://github.com/vueComponent/ant-design-vue/blob/main/components/carousel/index.tsx)
