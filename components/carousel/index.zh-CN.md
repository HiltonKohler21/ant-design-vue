---
category: Components
type: 数据展示
title: Carousel
cols: 1
subtitle: 走马灯
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bPMSSqbaTMkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-58QpYnqOsAAAAAAAAAAAAADrJ8AQ/original
---

旋转木马，一组轮播的区域。

## 何时使用

- 当有一组平级的内容。
- 当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
- 常用于一组图片或卡片轮播。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| adaptiveHeight | 启用自适应高度 | boolean | false |  |
| arrows | 是否显示切换箭头 | boolean | false |  |
| autoplay | 是否自动切换 | boolean | false |  |
| autoplaySpeed | 自动切换间隔时间（毫秒） | number | 3000 |  |
| dotPosition | 面板指示点位置，可选 `top` `bottom` `left` `right` | string | `bottom` | 1.5.0 |
| dots | 是否显示面板指示点 | boolean | true |  |
| dotsClass | 面板指示点类名 | string | `slick-dots` |  |
| draggable | 是否启用拖拽切换 | boolean | false |  |
| easing | 动画效果 | string | `linear` |  |
| effect | 动画效果函数 | `scrollx` \| `fade` | `scrollx` |  |
| fade | 使用渐变切换 | boolean | false |  |
| infinite | 是否无限循环播放 | boolean | true |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| speed | 切换动画时长（毫秒） | number | 500 |  |
| waitForAnimate | 是否等待过渡动画完成再切换 | boolean | false | 4.3.0 |
| afterChange | 切换面板的回调 | function(current) | - |  |
| beforeChange | 切换面板的回调 | function(from, to) | - |  |

## 方法

| 名称                           | 描述                                              | 版本 |
| ------------------------------ | ------------------------------------------------- | ---- |
| goTo(slideNumber, dontAnimate) | 切换到指定面板, dontAnimate = true 时，不使用动画 |      |
| next()                         | 切换到下一面板                                    |      |
| prev()                         | 切换到上一面板                                    |      |

更多属性可参考源码：[carousel props](https://github.com/vueComponent/ant-design-vue/blob/main/components/carousel/index.tsx)
