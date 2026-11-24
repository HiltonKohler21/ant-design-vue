export interface SemanticSlotItem {
  /** Semantic slot name, e.g. 'root', 'header', 'popup.root' */
  name: string;
  /** CSS selector(s) inside SemanticStage to measure and highlight */
  selector: string;
  /** Chinese description */
  descZh: string;
  /** English description */
  descEn: string;
  /** Optional version badge, e.g. '4.3.0' */
  version?: string;
  /** Whether this slot targets a dropdown/overlay popup */
  isPopup?: boolean;
}

export interface ComponentSemanticConfig {
  /** Canonical component display name matching doc title */
  component: string;
  /** Kebab-case tag name used in code snippet, e.g. 'a-alert' */
  tagName: string;
  /** Semantic slots supported by this component */
  semantics: SemanticSlotItem[];
  /** Whether functional `(info) => ({ ... })` is supported */
  functional?: boolean;
}

export const SEMANTICS_DATA: Record<string, ComponentSemanticConfig> = {
  Alert: {
    component: 'Alert',
    tagName: 'a-alert',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-alert',
        descZh: '警告提示根元素',
        descEn: 'Root container element of Alert',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-alert-icon',
        descZh: '左侧辅助状态图标元素',
        descEn: 'Status icon element on the start side',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-alert-section, .ant-alert-content',
        descZh: '包裹标题与描述的内容区容器',
        descEn: 'Content wrapper containing title and description',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-alert-title, .ant-alert-message',
        descZh: '警告提示标题元素',
        descEn: 'Alert title element',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-alert-description',
        descZh: '警告提示辅助性文字描述元素',
        descEn: 'Auxiliary description element',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-alert-action',
        descZh: '自定义操作区容器',
        descEn: 'Custom action area container',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-alert-close-icon',
        descZh: '关闭按钮元素',
        descEn: 'Close button element',
        version: '4.3.0',
      },
    ],
  },

  Anchor: {
    component: 'Anchor',
    tagName: 'a-anchor',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-anchor-wrapper, .ant-anchor',
        descZh: '根元素，包含布局定位、内边距、边距、背景色等基础样式',
        descEn:
          'Root element with layout positioning, padding, margin, background color and other basic styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-anchor-link',
        descZh: '链接项元素，包含内边距、文字颜色、悬停状态、过渡动画等样式',
        descEn:
          'Link item element with padding, text color, hover states, transition animations and other styles',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-anchor-link-title',
        descZh: '标题文字元素，包含字体样式、颜色变化、文本装饰、过渡效果等样式',
        descEn:
          'Title text element with font styles, color changes, text decoration, transition effects and other styles',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-anchor-ink-visible, .ant-anchor-ink',
        descZh: '指示器元素，包含宽度、高度、背景色、位置变化、过渡动画等样式',
        descEn:
          'Indicator element with width, height, background color, position changes, transition animations and other styles',
        version: '4.3.0',
      },
    ],
  },

  AutoComplete: {
    component: 'AutoComplete',
    tagName: 'a-auto-complete',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-select-auto-complete, .ant-select',
        descZh: '自动完成根容器元素',
        descEn: 'Root container element of AutoComplete',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-select-selector',
        descZh: '输入选择框主体容器',
        descEn: 'Input selector wrapper container',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-select-dropdown',
        descZh: '自动补全联想下拉弹层容器',
        descEn: 'Suggestion dropdown popup root container',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Badge: {
    component: 'Badge',
    tagName: 'a-badge',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-badge',
        descZh: '徽标外层包裹容器',
        descEn: 'Root badge wrapper container',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-badge-count, .ant-badge-dot',
        descZh: '徽标计数或圆点指示器',
        descEn: 'Badge count or dot indicator element',
        version: '4.3.0',
      },
    ],
  },

  Breadcrumb: {
    component: 'Breadcrumb',
    tagName: 'a-breadcrumb',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-breadcrumb',
        descZh: '根元素，包含文字颜色、字体大小、图标尺寸等基础样式，内部使用 flex 布局的有序列表',
        descEn:
          'Root element with text color, font size, icon size and other basic styles, using flex layout with ordered list',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-breadcrumb-link',
        descZh:
          'Item 元素，包含文字颜色、链接的颜色变化、悬浮效果、内边距、圆角、高度、外边距等样式',
        descEn:
          'Item element with text color, link color transitions, hover effects, padding, border-radius, height, and margin styles',
        version: '4.3.0',
      },
      {
        name: 'separator',
        selector: '.ant-breadcrumb-separator',
        descZh: '分隔符元素，包含分隔符的外边距和颜色样式',
        descEn: 'Separator element with margin and color styles for the divider',
        version: '4.3.0',
      },
    ],
  },

  Button: {
    component: 'Button',
    tagName: 'a-button',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-btn',
        descZh: '按钮根元素',
        descEn: 'Root <button> element of Button',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-btn-icon, .ant-btn .anticon',
        descZh: '按钮图标容器元素',
        descEn: 'Button icon wrapper element',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-btn > span:not(.anticon):not(.ant-btn-icon)',
        descZh: '按钮文本内容元素',
        descEn: 'Button text content wrapper',
        version: '4.3.0',
      },
    ],
  },

  Calendar: {
    component: 'Calendar',
    tagName: 'a-calendar',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-picker-calendar',
        descZh: '根元素，包含日历组件的背景色、边框、圆角等基础样式和整体布局结构',
        descEn:
          'Root element containing background, border, border-radius and overall layout structure of the calendar component',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-picker-calendar-header',
        descZh: '头部元素，包含年份选择器、月份选择器、模式切换器的布局和样式控制',
        descEn:
          'Header element with layout and style control for year selector, month selector and mode switcher',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-picker-body',
        descZh: '主体元素，包含日历表格的内边距、布局控制等样式，用于容纳日历网格',
        descEn:
          'Body element with padding and layout control for the calendar table that contains the calendar grid',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-picker-content',
        descZh: '内容元素，包含日历表格的宽度、高度等尺寸控制和表格样式',
        descEn:
          'Content element with width, height and table styling control for the calendar table',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-picker-cell',
        descZh: '条目元素，包含日历单元格的背景色、边框、悬停态、选中态等交互样式',
        descEn:
          'Item element with background, border, hover state, selected state and other interactive styles for calendar cells',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-picker-calendar-date-content, .ant-picker-cell-inner',
        descZh: '条目内容元素，包含日历单元格内自定义内容区域的高度、溢出等样式控制',
        descEn:
          'Item content element with height, overflow and other style control for custom content area inside calendar cells',
        version: '4.3.0',
      },
    ],
  },

  Card: {
    component: 'Card',
    tagName: 'a-card',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-card',
        descZh: '卡片根容器元素',
        descEn: 'Root container element of Card',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-card-head',
        descZh: '卡片头部区域',
        descEn: 'Card header container',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-card-head-title',
        descZh: '卡片头部标题元素',
        descEn: 'Card header title element',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-card-extra',
        descZh: '卡片右上角操作区',
        descEn: 'Top-right extra action area',
        version: '4.3.0',
      },
      {
        name: 'cover',
        selector: '.ant-card-cover',
        descZh: '卡片封面容器',
        descEn: 'Card cover container',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-card-body',
        descZh: '卡片内容区域',
        descEn: 'Card body content area',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-card-actions',
        descZh: '卡片底部操作组',
        descEn: 'Bottom actions list container',
        version: '4.3.0',
      },
    ],
  },

  Cascader: {
    component: 'Cascader',
    tagName: 'a-cascader',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-cascader, .ant-select',
        descZh: '级联选择器根容器元素',
        descEn: 'Root container element of Cascader',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧下拉箭头图标元素',
        descEn: 'Trailing dropdown arrow icon',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-cascader-dropdown, .ant-select-dropdown',
        descZh: '级联多列面板弹层容器',
        descEn: 'Cascader multi-column dropdown popup root',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Checkbox: {
    component: 'Checkbox',
    tagName: 'a-checkbox',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-checkbox-wrapper',
        descZh: '根元素，包含行内 flex 布局、基线对齐、光标样式、重置样式等复选框容器的基础样式',
        descEn:
          'Root element with inline-flex layout, baseline alignment, cursor style, reset styles and other basic checkbox container styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-checkbox',
        descZh:
          '选中框元素，包含尺寸、方向、背景色、边框、圆角、过渡动画，以及选中状态的勾选标记样式',
        descEn:
          'Checkbox icon element with size, direction, background, border, border-radius, transitions, and checked state checkmark styles',
        version: '4.3.0',
      },
      {
        name: 'label',
        selector: '.ant-checkbox + span',
        descZh: '文本元素，包含文本的内边距和与复选框的间距样式',
        descEn: 'Label text element with padding and spacing styles relative to the checkbox',
        version: '4.3.0',
      },
    ],
  },

  Collapse: {
    component: 'Collapse',
    tagName: 'a-collapse',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-collapse',
        descZh: '折叠面板根容器',
        descEn: 'Root container element of Collapse',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-collapse-header',
        descZh: '面板顶部触发栏',
        descEn: 'Collapsible panel header bar',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-collapse-expand-icon',
        descZh: '展开/收起切换图标',
        descEn: 'Expand/collapse indicator icon',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-collapse-header-text',
        descZh: '面板标题文字元素',
        descEn: 'Panel header title text element',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-collapse-content-box, .ant-collapse-content',
        descZh: '展开后的面板内容区域',
        descEn: 'Expanded panel content body area',
        version: '4.3.0',
      },
    ],
  },

  ColorPicker: {
    component: 'ColorPicker',
    tagName: 'a-color-picker',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-color-picker-trigger',
        descZh: '触发器容器，包含边框样式、过渡动画、尺寸控制等样式，显示颜色块和文本内容',
        descEn:
          'Trigger container with border styles, transition animations, size controls, displaying color block and text content',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-color-picker-color-block',
        descZh: '色块容器，包含底色、边框等样式',
        descEn: 'Color block container with background color, border styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-color-picker-color-block-inner',
        descZh: '色块颜色元素，包含实际选择的颜色样式',
        descEn: 'Color block element with actual selected color styles',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-color-picker-trigger-text',
        descZh: '描述文本内容，包含字体样式、颜色等样式',
        descEn: 'Description text content with font styles and color',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-color-picker-pure',
        descZh: '弹出面板根容器，包含背景色、阴影效果、色彩选择面板、滑块控制和预设颜色等样式',
        descEn:
          'Popup panel root container with background color, shadow effects, color selection panel, slider controls and preset colors',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.container',
        selector: '.ant-color-picker-pure-container',
        descZh: '弹出面板内容容器，包含背景色、内边距、圆角和阴影等样式',
        descEn:
          'Popup panel content container with background color, padding, border radius and shadow',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  DatePicker: {
    component: 'DatePicker',
    tagName: 'a-date-picker',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-picker',
        descZh:
          '根元素，包含相对定位、行内 flex 布局、内边距、边框圆角、过渡动画等日期选择器容器的基础样式',
        descEn:
          'Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for date picker container',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-picker-prefix',
        descZh: '前缀元素，包含 flex 布局、右外边距等前缀内容的布局样式',
        descEn: 'Prefix element with flex layout and margin styles for prefix content layout',
        version: '4.3.0',
      },
      {
        name: 'input',
        selector: '.ant-picker-input > input',
        descZh: '输入框元素，包含相对定位、宽度、颜色、字体、行高、过渡动画等输入框的核心交互样式',
        descEn:
          'Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-picker-suffix',
        descZh: '后缀元素，包含 flex 布局、颜色、行高、指针事件、过渡动画等后缀内容的样式',
        descEn:
          'Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-picker-dropdown-pure, .ant-picker-dropdown',
        descZh: '弹出框根元素',
        descEn: 'Popup root element',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.container',
        selector: '.ant-picker-panel-container',
        descZh: '弹出框容器元素，设置背景色、内边距、圆角、阴影、边框和内容展示样式',
        descEn:
          'Container element, set background color, padding, border radius, shadow, border and content display styles',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.header',
        selector: '.ant-picker-header',
        descZh: '弹出框头部元素，包含导航按钮、月份年份选择器等头部控制区域的布局和样式',
        descEn:
          'Popup header element with navigation buttons, month/year selectors and other header control area layout and styles',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.body',
        selector: '.ant-picker-body',
        descZh: '弹出框主体元素，包含日期面板表格的容器布局和样式',
        descEn: 'Popup body element with container layout and styles for date panel table',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.content',
        selector: '.ant-picker-content',
        descZh: '弹出框内容元素，包含日期表格的宽度、边框、单元格等内容展示样式',
        descEn:
          'Popup content element with width, border, cell and other content display styles for date table',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.item',
        selector: '.ant-picker-cell-inner',
        descZh: '弹出框单项元素，包含日期单元格的尺寸、背景色、边框圆角、悬停态、选中态等交互样式',
        descEn:
          'Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for date cells',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.footer',
        selector: '.ant-picker-footer',
        descZh: '弹出框底部元素，包含确认取消按钮、快捷选择等底部操作区域的布局样式',
        descEn:
          'Popup footer element with layout styles for bottom operation area including confirm/cancel buttons and shortcuts',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Descriptions: {
    component: 'Descriptions',
    tagName: 'a-descriptions',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-descriptions',
        descZh: '根元素，包含描述列表容器的基础样式、重置样式、边框样式、布局方向等整体样式',
        descEn:
          'Root element with basic styles, reset styles, border styles, layout direction and other overall styles for description list container',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-descriptions-header',
        descZh: '头部元素，包含 flex 布局、对齐方式、下边距等头部区域的布局和样式控制',
        descEn:
          'Header element with flex layout, alignment, bottom margin and other layout and style controls for header area',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-descriptions-title',
        descZh: '标题元素，包含文本省略、flex 占比、颜色、字体权重、字体大小、行高等标题文字样式',
        descEn:
          'Title element with text ellipsis, flex ratio, color, font weight, font size, line height and other title text styles',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-descriptions-extra',
        descZh: '额外内容元素，包含左边距、颜色、字体大小等额外操作区域的样式',
        descEn:
          'Extra content element with left margin, color, font size and other styles for additional operation area',
        version: '4.3.0',
      },
      {
        name: 'label',
        selector: '.ant-descriptions-item-label',
        descZh: '标签元素，包含颜色、字体权重、字体大小、行高、文本对齐、冒号样式等标签文字的样式',
        descEn:
          'Label element with color, font weight, font size, line height, text align, colon styles and other label text styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-descriptions-item-content',
        descZh: '内容元素，包含表格单元格布局、颜色、字体大小、行高、文字换行等内容展示样式',
        descEn:
          'Content element with table cell layout, color, font size, line height, word break and other content display styles',
        version: '4.3.0',
      },
    ],
  },

  Divider: {
    component: 'Divider',
    tagName: 'a-divider',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-divider',
        descZh: '分割线根容器元素',
        descEn: 'Root container element of Divider',
        version: '4.3.0',
      },
      {
        name: 'rail',
        selector: '.ant-divider-rail, .ant-divider',
        descZh: '分割线轨道线条元素',
        descEn: 'Divider rail line element',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-divider-inner-text',
        descZh: '分割线内置文字内容元素',
        descEn: 'Inner text content element inside Divider',
        version: '4.3.0',
      },
    ],
  },

  Drawer: {
    component: 'Drawer',
    tagName: 'a-drawer',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-drawer-pure, .ant-drawer',
        descZh: '根元素，包含固定定位、层级控制、指针事件、颜色等抽屉容器的基础样式和布局控制',
        descEn:
          'Root element with fixed positioning, z-index control, pointer events, color and other basic styles and layout control for drawer container',
        version: '4.3.0',
      },
      {
        name: 'mask',
        selector: '.sp-drawer-mask',
        descZh: '遮罩层元素，包含绝对定位、层级、背景色、指针事件等遮罩层的样式和交互控制',
        descEn:
          'Mask element with absolute positioning, z-index, background color, pointer events and other mask layer styles and interaction controls',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-drawer-wrapper-body',
        descZh:
          'Drawer 容器元素（兼容 content / wrapper），包含 flex 布局、宽高、溢出控制、背景色等抽屉主体样式',
        descEn:
          'Drawer container element (content/wrapper alias) with flex layout, width/height, overflow control, background color and other drawer body styles',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-drawer-header',
        descZh:
          '头部元素，包含 flex 布局、对齐方式、内边距、字体大小、行高、下边框等头部区域的样式',
        descEn:
          'Header element with flex layout, alignment, padding, font size, line height, bottom border and other header area styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-drawer-title',
        descZh: '标题元素，包含 flex 占比、外边距、字体权重、字体大小、行高等标题文字的样式',
        descEn:
          'Title element with flex ratio, margin, font weight, font size, line height and other title text styles',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-drawer-extra',
        descZh: '额外元素，包含 flex 固定布局等额外操作内容的样式控制',
        descEn:
          'Extra element with flex fixed layout and other additional operation content style controls',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-drawer-body',
        descZh: '内容元素，包含 flex 占比、最小尺寸、内边距、溢出滚动等内容区域的展示和布局样式',
        descEn:
          'Body element with flex ratio, minimum size, padding, overflow scroll and other content area display and layout styles',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-drawer-footer',
        descZh: '底部元素，包含 flex 收缩、内边距、上边框等底部操作区域的样式',
        descEn:
          'Footer element with flex shrink, padding, top border and other bottom operation area styles',
        version: '4.3.0',
      },
      {
        name: 'dragger',
        selector: '.sp-drawer-dragger',
        descZh: '拖拽元素，用于调整抽屉大小的拖拽手柄，包含悬停态和拖拽态样式',
        descEn:
          'Dragger element used to resize the drawer, with hover state styles and dragging state styles',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-drawer-close',
        descZh: '关闭按钮元素，包含按钮的基础样式',
        descEn: 'Close button element with basic button styling',
        version: '4.3.0',
      },
    ],
  },

  Dropdown: {
    component: 'Dropdown',
    tagName: 'a-dropdown',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-dropdown',
        descZh: '下拉菜单的根元素，设置定位、层级和容器样式',
        descEn: 'Root element of dropdown, sets positioning, z-index and container styles',
        version: '4.3.0',
      },
      {
        name: 'menu',
        selector: '.ant-dropdown-menu',
        descZh: '下拉菜单的菜单元素，设置菜单容器样式',
        descEn: 'Menu element of dropdown, sets menu container styles',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-dropdown-menu-item-group-title, .ant-dropdown-menu-submenu-title',
        descZh: '下拉选项的标题内容区域，设置布局和文字样式',
        descEn: 'Title content area of dropdown option, sets layout and text styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-dropdown-menu-item',
        descZh: '下拉菜单的单个选项元素，设置选项的交互状态和背景样式',
        descEn: 'Individual dropdown option element, sets interaction states and background styles',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-dropdown-menu-title-content',
        descZh: '下拉选项的主要内容区域，设置内容布局和链接样式',
        descEn: 'Main content area of dropdown option, sets content layout and link styles',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-dropdown-menu-item-icon, .ant-dropdown-menu-item .anticon',
        descZh: '下拉选项的图标区域，设置图标的尺寸和间距样式',
        descEn: 'Icon area of dropdown option, sets icon size and spacing styles',
        version: '4.3.0',
      },
    ],
  },

  Empty: {
    component: 'Empty',
    tagName: 'a-empty',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-empty',
        descZh: '空状态根容器元素',
        descEn: 'Root container element of Empty',
        version: '4.3.0',
      },
      {
        name: 'image',
        selector: '.ant-empty-image',
        descZh: '空状态插画图片区域',
        descEn: 'Illustration image container',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-empty-description',
        descZh: '空状态提示文案元素',
        descEn: 'Description text element',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-empty-footer',
        descZh: '空状态底部操作区',
        descEn: 'Bottom footer action area',
        version: '4.3.0',
      },
    ],
  },

  FloatButton: {
    component: 'FloatButton',
    tagName: 'a-float-button',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-float-btn',
        descZh:
          '根元素，设置悬浮按钮的基础样式、形状尺寸、类型主题、固定定位、层级、阴影、间距等容器样式',
        descEn:
          'Root element with float button base styles, shape size, type theme, fixed positioning, z-index, shadow, spacing and other container styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-float-btn-icon',
        descZh: '图标元素，设置按钮内图标的尺寸、颜色、行高、对齐等图标显示样式',
        descEn:
          'Icon element with button icon size, color, line height, alignment and other icon display styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-float-btn-content',
        descZh: '内容元素，设置按钮内文字内容的字体大小、颜色、对齐、换行等文本显示样式',
        descEn:
          'Content element with button text content font size, color, alignment, line wrap and other text display styles',
        version: '4.3.0',
      },
    ],
  },

  Form: {
    component: 'Form',
    tagName: 'a-form',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-form',
        descZh: '根元素，包含表单容器与表单项的布局、底边距、校验状态等基础样式',
        descEn:
          'Root element with form container layout, margins, transitions, and validation state base styles',
        version: '4.3.0',
      },
      {
        name: 'label',
        selector: '.ant-form-item-label',
        descZh: '标签元素，包含 flex 布局、溢出隐藏、文本对齐、标签颜色、字体大小与必填标记等样式',
        descEn:
          'Label element with flex layout, overflow hidden, text alignment, label color, font size, height, and required mark display styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-form-item-control-input-content, .ant-form-item-control',
        descZh: '内容元素，包含表单内容区域的布局、样式和控件容器的相关样式',
        descEn:
          'Content element with form content area layout, styling and control container related styles',
        version: '4.3.0',
      },
      {
        name: 'help',
        selector: '.ant-form-item-explain',
        descZh: '帮助信息容器元素，包含帮助文案与校验信息区域的间距、过渡与展示样式',
        descEn:
          'Help container element with spacing, motion, and presentation styles for help and validation areas',
        version: '4.3.0',
      },
      {
        name: 'helpItem',
        selector: '.ant-form-item-explain-error, .ant-form-item-explain > div',
        descZh: '帮助信息单项元素，包含错误、警告与提示文案的排版样式',
        descEn:
          'Single help message item with typography styles for prompt, error, and warning text',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-form-item-extra',
        descZh: '额外提示容器元素，包含补充说明文案的间距、颜色与排版样式',
        descEn:
          'Extra prompt container element with spacing, color, and typography styles for supplementary text',
        version: '4.3.0',
      },
    ],
  },

  Image: {
    component: 'Image',
    tagName: 'a-image',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-image',
        descZh: '图片外层包裹容器',
        descEn: 'Outer wrapper container of Image',
        version: '4.3.0',
      },
      {
        name: 'image',
        selector: '.ant-image-img',
        descZh: '原生 <img> 图片元素',
        descEn: 'Native <img> element',
        version: '4.3.0',
      },
      {
        name: 'cover',
        selector: '.ant-image-cover, .ant-image-mask',
        descZh: '悬浮预览遮罩覆盖层',
        descEn: 'Hover preview cover overlay element',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-image',
        descZh: '全屏预览弹窗根容器（点击图片打开预览）',
        descEn: 'Fullscreen preview modal root container (click image to preview)',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Input: {
    component: 'Input',
    tagName: 'a-input',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-input-affix-wrapper, .ant-input',
        descZh: '输入框外层根容器',
        descEn: 'Outer root wrapper element of Input',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-input-prefix',
        descZh: '输入框前缀容器',
        descEn: 'Leading prefix container',
        version: '4.3.0',
      },
      {
        name: 'input',
        selector: 'input.ant-input',
        descZh: '原生 <input> 输入框元素',
        descEn: 'Native <input> element',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-input-suffix',
        descZh: '输入框后缀容器',
        descEn: 'Trailing suffix container',
        version: '4.3.0',
      },
      {
        name: 'count',
        selector: '.ant-input-show-count-suffix',
        descZh: '字数统计展示元素',
        descEn: 'Character count indicator element',
        version: '4.3.0',
      },
    ],
  },

  InputNumber: {
    component: 'InputNumber',
    tagName: 'a-input-number',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-input-number-affix-wrapper, .ant-input-number',
        descZh: '根元素，设置行内块布局、宽度、边框圆角和重置样式',
        descEn: 'Root element, sets inline-block layout, width, border radius and reset styles',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-input-number-prefix',
        descZh: '前缀的包裹元素，设置 flex 布局、对齐方式和右边距样式',
        descEn: 'Prefix wrapper element, sets flex layout, alignment and right margin styles',
        version: '4.3.0',
      },
      {
        name: 'input',
        selector: '.ant-input-number-input',
        descZh: '输入框元素，设置字体、行高、文本输入和交互样式',
        descEn: 'Input element, sets font, line height, text input and interaction styles',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-input-number-suffix',
        descZh: '后缀的包裹元素，设置 flex 布局、边距和过渡动画样式',
        descEn: 'Suffix wrapper element, sets flex layout, margin and transition animation styles',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-input-number-handler-wrap',
        descZh: '操作元素，设置绝对定位、宽度、flex 布局和数值调节按钮样式',
        descEn:
          'Actions element, sets absolute positioning, width, flex layout and number adjustment button styles',
        version: '4.3.0',
      },
      {
        name: 'action',
        selector: '.ant-input-number-handler-up, .ant-input-number-handler',
        descZh: '单个操作按钮元素，设置按钮的样式、悬浮效果和点击交互',
        descEn:
          'Single action button element, sets button styling, hover effects and click interactions',
        version: '4.3.0',
      },
      {
        name: 'clear',
        selector: '.ant-input-number-clear-icon',
        descZh: '清除按钮元素，设置图标颜色、大小和交互样式',
        descEn: 'Clear button element, sets icon color, size and interaction styles',
        version: '4.3.0',
      },
    ],
  },

  Layout: {
    component: 'Layout',
    tagName: 'a-layout-sider',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-layout-sider, .ant-layout',
        descZh: '根元素，包含 Layout / Sider 的布局、主题、宽度和折叠状态样式',
        descEn: 'Root element with Layout / Sider layout, theme, width and collapsed state styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-layout-sider-children',
        descZh: '内容包裹元素，包含 Layout.Sider 子内容的布局和展示样式',
        descEn: 'Body element that wraps Layout.Sider children layout and display styles',
        version: '4.3.0',
      },
    ],
  },

  List: {
    component: 'List',
    tagName: 'a-list',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-list',
        descZh: '列表根容器元素',
        descEn: 'Root container element of List',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-list-header',
        descZh: '列表头部区域',
        descEn: 'List header container',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-list-item',
        descZh: '单个列表项容器',
        descEn: 'Individual list item element',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-list-item-action',
        descZh: 'List.Item 底部/右侧操作组',
        descEn: 'List.Item actions list container',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-list-item-extra',
        descZh: 'List.Item 额外扩展内容区',
        descEn: 'List.Item extra content area',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-list-footer',
        descZh: '列表底部区域',
        descEn: 'List footer container',
        version: '4.3.0',
      },
    ],
  },

  Listy: {
    component: 'Listy',
    tagName: 'a-listy',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-listy',
        descZh: '虚拟列表根容器',
        descEn: 'Root container element of Listy',
        version: '4.3.0',
      },
      {
        name: 'holder',
        selector: '.ant-listy-holder, .ant-listy',
        descZh: '内部滚动视口容器',
        descEn: 'Internal scrollable viewport holder',
        version: '4.3.0',
      },
      {
        name: 'groupSection',
        selector: '.ant-listy-group-section',
        descZh: '分组区块包裹容器',
        descEn: 'Group section wrapper container',
        version: '4.3.0',
      },
      {
        name: 'groupHeader',
        selector: '.ant-listy-group-header',
        descZh: '分组标题头元素',
        descEn: 'Group header element',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-listy-item',
        descZh: '列表单项元素',
        descEn: 'Individual list item element',
        version: '4.3.0',
      },
      {
        name: 'scrollbar',
        selector: '.ant-listy-scrollbar, .rc-virtual-list-scrollbar, .ant-listy',
        descZh: '虚拟滚动条轨道元素',
        descEn: 'Virtual scrollbar track element',
        version: '4.3.0',
      },
    ],
  },

  Masonry: {
    component: 'Masonry',
    tagName: 'a-masonry',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-masonry',
        descZh: '瀑布流根容器元素',
        descEn: 'Root container element of Masonry',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-masonry-item',
        descZh: '瀑布流单个子项容器',
        descEn: 'Individual masonry item wrapper',
        version: '4.3.0',
      },
    ],
  },

  Mentions: {
    component: 'Mentions',
    tagName: 'a-mentions',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-mentions',
        descZh: '根元素，设置行内 flex 布局、相对定位、内边距和边框样式',
        descEn:
          'Root element, set inline flex layout, relative positioning, padding and border styles',
        version: '4.3.0',
      },
      {
        name: 'textarea',
        selector: '.ant-mentions textarea',
        descZh: '文本域元素，设置字体、行高、文本输入和背景样式',
        descEn: 'Textarea element, set font, line height, text input and background styles',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-mentions-suffix',
        descZh: '后缀元素，包含后缀内容的布局和样式，如清除按钮等',
        descEn: 'Suffix element with layout and styling for suffix content like clear button, etc.',
        version: '4.3.0',
      },
      {
        name: 'popup',
        selector: '.ant-mentions-dropdown-pure, .ant-mentions-dropdown',
        descZh: '弹出框元素，设置绝对定位、层级、背景色、圆角、阴影和下拉选项样式',
        descEn:
          'Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Menu: {
    component: 'Menu',
    tagName: 'a-menu',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-menu',
        descZh: '根元素，包含菜单容器的基础样式和布局',
        descEn: 'Root element with basic menu container styles and layout',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-menu > .ant-menu-item',
        descZh: '条目元素，包含菜单项的相对定位、块级显示、外边距、光标样式与基础交互样式',
        descEn:
          'Item element with relative positioning, block display, margins, cursor styles, transitions and interactive styles for menu items',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-menu > .ant-menu-item .ant-menu-item-icon, .ant-menu-item-icon',
        descZh: '图标元素，包含最小宽度、字体大小、过渡动画及与文本的间距控制',
        descEn:
          'Icon element with min-width, font-size, transitions, icon reset styles, and spacing control with text',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-menu > .ant-menu-item .ant-menu-title-content, .ant-menu-title-content',
        descZh: '条目内容元素，包含菜单项内容的布局和排版样式',
        descEn: 'Item content element with layout and typography styles for menu item content',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-menu-item-group-title',
        descZh: '菜单分组标题元素（horizontal 模式不生效），包含标题文字的样式和布局',
        descEn:
          'Item title element (no effect in horizontal mode) with title text styles and layout',
        version: '4.3.0',
      },
      {
        name: 'list',
        selector: '.ant-menu-item-group-list',
        descZh: '菜单分组列表元素（horizontal 模式不生效），包含菜单列表的布局和容器样式',
        descEn:
          'Menu list element (no effect in horizontal mode) with menu list layout and container styles',
        version: '4.3.0',
      },
      {
        name: 'popup',
        selector: '.ant-menu-submenu-popup, .ant-menu-sub',
        descZh: '弹出菜单（inline 模式不生效），包含弹出层的定位、层级、背景等样式',
        descEn:
          'Popup menu element (no effect in inline mode) with popup layer positioning, z-index, background and other styles',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'subMenu.itemTitle',
        selector: '.ant-menu-submenu-title',
        descZh: '子菜单标题元素，包含子菜单标题的样式和交互效果',
        descEn: 'Submenu title element with submenu title styles and interactive effects',
        version: '4.3.0',
      },
      {
        name: 'subMenu.list',
        selector: '.ant-menu-sub',
        descZh: '子菜单列表元素，包含子菜单列表的布局和容器样式',
        descEn: 'Submenu list element with submenu list layout and container styles',
        version: '4.3.0',
      },
      {
        name: 'subMenu.item',
        selector: '.ant-menu-sub .ant-menu-item',
        descZh: '子菜单单项元素，包含子菜单项的样式和交互效果',
        descEn: 'Submenu item element with submenu item styles and interactive effects',
        version: '4.3.0',
      },
      {
        name: 'subMenu.itemIcon',
        selector: '.ant-menu-sub .ant-menu-item-icon, .ant-menu-sub .anticon',
        descZh: '子菜单条目图标元素，包含子菜单图标的尺寸和样式',
        descEn: 'Submenu item icon element with submenu icon size and styles',
        version: '4.3.0',
      },
      {
        name: 'subMenu.itemContent',
        selector: '.ant-menu-sub .ant-menu-title-content',
        descZh: '子菜单条目内容元素，包含子菜单内容的布局和排版',
        descEn: 'Submenu item content element with submenu content layout and typography',
        version: '4.3.0',
      },
    ],
  },

  Message: {
    component: 'Message',
    tagName: 'message',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-message-notice-content, .ant-message-notice',
        descZh: '消息项根元素，设置背景色、圆角、阴影、内边距和动画样式',
        descEn:
          'Message item root element, set background color, border radius, shadow, padding and animation styles',
        version: '4.3.0',
      },
      {
        name: 'wrapper',
        selector: '.ant-message-custom-content',
        descZh: '图标与标题的包裹元素，设置内容布局、间距和对齐样式',
        descEn: 'Wrapper element for icon and title, set content layout, gap and alignment styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-message-custom-content .anticon',
        descZh: '图标元素，设置字体大小、行高和状态颜色样式',
        descEn: 'Icon element, set font size, line height and status color styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-message-custom-content > span:last-child',
        descZh: '标题元素，设置文本颜色、字号、行高和内容展示样式',
        descEn: 'Title element, set text color, font size, line height and content display styles',
        version: '4.3.0',
      },
      {
        name: 'list',
        selector: '.sp-message-list',
        descZh: '消息列表根元素，设置定位、层级、宽度、滚动区域和位置样式',
        descEn:
          'Message list root element, set positioning, z-index, width, scroll area and placement styles',
        version: '4.3.0',
      },
      {
        name: 'listContent',
        selector: '.sp-message-list-content',
        descZh: '消息列表内容元素，设置消息项排列、间距和高度动画样式',
        descEn: 'Message list content element, set notice layout, gap and height transition styles',
        version: '4.3.0',
      },
    ],
  },

  Modal: {
    component: 'Modal',
    tagName: 'a-modal',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-modal-pure-panel, .ant-modal',
        descZh: '根元素，包含相对定位、顶部位置、宽度、最大宽度、外边距等模态框容器的基础布局样式',
        descEn:
          'Root element with relative positioning, top position, width, max-width, margins and other basic layout styles for modal container',
        version: '4.3.0',
      },
      {
        name: 'mask',
        selector: '.sp-modal-mask',
        descZh: '遮罩层元素，包含固定定位、层级、背景色、动画过渡等遮罩层的样式',
        descEn:
          'Mask element with fixed positioning, z-index, background color, animation transitions and other mask layer styles',
        version: '4.3.0',
      },
      {
        name: 'wrapper',
        selector: '.sp-modal-wrap',
        descZh: '包裹层元素，一般用于动画容器，包含动画和过渡效果的样式',
        descEn:
          'Wrapper element used for motion container with animation and transition effect styles',
        version: '4.3.0',
      },
      {
        name: 'container',
        selector: '.ant-modal-content',
        descZh:
          'Modal 容器元素（兼容 content），包含相对定位、背景色、边框、圆角、阴影和内边距等主体样式',
        descEn:
          'Modal container element (content alias) with relative positioning, background, border, border-radius, box-shadow, padding and other modal body styles',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-modal-header',
        descZh: '头部元素，包含头部内边距、下边框等头部区域样式',
        descEn: 'Header element with padding, bottom border and other header area styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-modal-title',
        descZh: '标题元素，包含外边距、颜色、字体权重、字体大小、行高、文字换行等标题文字样式',
        descEn:
          'Title element with margin, color, font-weight, font-size, line-height, word-wrap and other title text styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-modal-body',
        descZh: '内容元素，包含内容区域的背景色、内边距等内容展示样式',
        descEn:
          'Body element with content area background color, padding and other content display styles',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-modal-footer',
        descZh: '底部元素，包含底部的背景色、内边距、上边框、圆角等底部区域样式',
        descEn:
          'Footer element with footer background color, padding, top border, border-radius and other footer area styles',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-modal-close',
        descZh: '关闭按钮元素，设置按钮的基础样式',
        descEn: 'Close button element, sets basic button styles',
        version: '4.3.0',
      },
    ],
  },

  Notification: {
    component: 'Notification',
    tagName: 'notification',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-notification-notice',
        descZh: '通知项根元素，设置背景色、圆角、阴影、内边距和动画样式',
        descEn:
          'Notice root element, set background color, border radius, shadow, padding and animation styles',
        version: '4.3.0',
      },
      {
        name: 'wrapper',
        selector: '.ant-notification-notice-with-icon',
        descZh: '图标与内容的包裹元素，设置内容布局样式',
        descEn: 'Wrapper element for icon and content with content layout styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-notification-notice-icon',
        descZh: '图标元素，设置绝对定位、字体大小、行高和状态颜色样式',
        descEn:
          'Icon element, set absolute positioning, font size, line height and status color styles',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-notification-notice-section',
        descZh: '内容区域元素，包含标题和描述内容',
        descEn: 'Content section element that contains title and description',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-notification-notice-title, .ant-notification-notice-message',
        descZh: '标题元素，设置颜色、字体大小、行高和外边距样式',
        descEn: 'Title element, set color, font size, line height and margin styles',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-notification-notice-description',
        descZh: '描述元素，设置字体大小、颜色和外边距样式',
        descEn: 'Description element, set font size, color and margin styles',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-notification-notice-close',
        descZh: '关闭按钮元素，设置位置、尺寸和交互样式',
        descEn: 'Close button element, set position, size and interaction styles',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-notification-notice-actions, .ant-notification-notice-btn',
        descZh: '操作组元素，设置右浮动、上边距和操作按钮布局样式',
        descEn: 'Actions element, set float right, top margin and action button layout styles',
        version: '4.3.0',
      },
      {
        name: 'progress',
        selector: '.ant-notification-notice-progress',
        descZh: '进度条元素，设置自动关闭通知的进度样式',
        descEn: 'Progress element, set progress styles for auto-closing notifications',
        version: '4.3.0',
      },
      {
        name: 'list',
        selector: '.sp-notification-list',
        descZh: '通知列表根元素，设置定位、层级、宽度、滚动区域和位置样式',
        descEn:
          'Notification list root element, set positioning, z-index, width, scroll area and placement styles',
        version: '4.3.0',
      },
      {
        name: 'listContent',
        selector: '.sp-notification-list-content',
        descZh: '通知列表内容元素，设置通知项排列、间距和高度动画样式',
        descEn:
          'Notification list content element, set notice layout, gap and height transition styles',
        version: '4.3.0',
      },
    ],
  },

  Pagination: {
    component: 'Pagination',
    tagName: 'a-pagination',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-pagination',
        descZh: '根元素，设置 flex 布局、对齐方式、换行和列表样式',
        descEn: 'Root element, set flex layout, alignment, flex wrap and list styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-pagination-item',
        descZh: '页码元素，设置尺寸、内边距、边框、背景色、悬停态和激活态样式',
        descEn:
          'Item element, set size, padding, border, background color, hover state and active state styles',
        version: '4.3.0',
      },
    ],
  },

  Popconfirm: {
    component: 'Popconfirm',
    tagName: 'a-popconfirm',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-popconfirm, .ant-popover',
        descZh: '根元素，设置绝对定位、层级、变换原点、箭头指向和弹层容器样式',
        descEn:
          'Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles',
        version: '4.3.0',
      },
      {
        name: 'container',
        selector: '.ant-popover-inner',
        descZh: '容器元素（兼容 body），设置背景色、内边距、圆角、阴影、边框和内容展示样式',
        descEn:
          'Container element (body alias), set background color, padding, border radius, shadow, border and content display styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-popconfirm-message-icon, .ant-popconfirm-message > .anticon',
        descZh: '图标元素，设置确认图标的尺寸、颜色和布局样式',
        descEn: 'Icon element, set the confirmation icon size, color and layout styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-popconfirm-message-title, .ant-popconfirm-title',
        descZh: '标题元素，设置标题文本样式和间距',
        descEn: 'Title element, set title text styles and spacing',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-popconfirm-description, .ant-popconfirm-message-text',
        descZh: '描述元素，设置描述文本样式和布局',
        descEn: 'Description element, set content text styles and layout',
        version: '4.3.0',
      },
      {
        name: 'arrow',
        selector: '.ant-popover-arrow',
        descZh: '箭头元素，设置宽高、位置、颜色和边框样式',
        descEn: 'Arrow element with width, height, position, color and border styles',
        version: '4.3.0',
      },
    ],
  },

  Popover: {
    component: 'Popover',
    tagName: 'a-popover',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-popover',
        descZh: '气泡卡片弹层根容器',
        descEn: 'Popover overlay root container',
        version: '4.3.0',
      },
      {
        name: 'container',
        selector: '.ant-popover-inner',
        descZh: '气泡卡片内层容器（兼容 body 别名）',
        descEn: 'Popover card inner container (body alias)',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-popover-title',
        descZh: '气泡卡片标题元素',
        descEn: 'Popover title element',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-popover-inner-content',
        descZh: '气泡卡片正文内容区',
        descEn: 'Popover body content area',
        version: '4.3.0',
      },
      {
        name: 'arrow',
        selector: '.ant-popover-arrow',
        descZh: '气泡卡片指向箭头',
        descEn: 'Directional arrow of Popover',
        version: '4.3.0',
      },
    ],
  },

  Progress: {
    component: 'Progress',
    tagName: 'a-progress',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-progress',
        descZh: '根元素，设置相对定位和基础容器样式',
        descEn: 'Root element, set relative positioning and basic container styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-progress-outer',
        descZh: '主体元素，设置进度条的布局和尺寸样式',
        descEn: 'Body element, set progress bar layout and size styles',
        version: '4.3.0',
      },
      {
        name: 'rail',
        selector: '.ant-progress-inner',
        descZh: '导轨元素，设置背景轨道的颜色和圆角样式，steps 模式下没有该元素',
        descEn:
          'Rail element, set background track color and border radius styles. Not exist in steps mode',
        version: '4.3.0',
      },
      {
        name: 'track',
        selector: '.ant-progress-bg',
        descZh: '轨迹元素，设置进度填充部分的颜色和过渡动画样式',
        descEn: 'Track element, set progress fill color and transition animation styles',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-progress-text',
        descZh: '指示器元素，设置百分比文本或图标的位置和字体样式',
        descEn: 'Indicator element, set percentage text or icon position and font styles',
        version: '4.3.0',
      },
    ],
  },

  QRCode: {
    component: 'QRCode',
    tagName: 'a-qrcode',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-qrcode',
        descZh: '根元素，设置 flex 布局、内边距、背景色、边框、圆角和相对定位样式',
        descEn:
          'Root element, set flex layout, padding, background color, border, border radius and relative positioning styles',
        version: '4.3.0',
      },
      {
        name: 'cover',
        selector: '.ant-qrcode-mask',
        descZh: '遮罩层元素，设置绝对定位、层级、背景色和加载状态覆盖样式',
        descEn:
          'Cover element, set absolute positioning, z-index, background color and loading state overlay styles',
        version: '4.3.0',
      },
    ],
  },

  Radio: {
    component: 'Radio',
    tagName: 'a-radio',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-radio-wrapper',
        descZh: '根元素，包含布局样式、鼠标样式、禁用状态文字颜色等基础容器样式',
        descEn:
          'Root element with layout styles, cursor styles, disabled text color and other basic container styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-radio',
        descZh: '选中框元素，包含圆角样式、过渡动画、边框样式、悬停状态、焦点状态等交互样式',
        descEn:
          'Icon element with border radius, transition animations, border styles, hover states, focus states and other interactive styles',
        version: '4.3.0',
      },
      {
        name: 'label',
        selector: '.ant-radio + span',
        descZh: '文本元素，包含内边距、文字颜色、禁用状态、对齐方式等文本样式',
        descEn:
          'Label element with padding, text color, disabled states, alignment and other text styles',
        version: '4.3.0',
      },
    ],
  },

  Result: {
    component: 'Result',
    tagName: 'a-result',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-result',
        descZh: '根元素，包含文本对齐、布局样式等基础容器样式',
        descEn: 'Root element with text alignment, layout styles and other basic container styles',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-result-icon',
        descZh: '图标元素，包含外边距、文本对齐、字体大小、状态颜色等图标样式',
        descEn:
          'Icon element with margin, text alignment, font size, status colors and other icon styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-result-title',
        descZh: '标题元素，包含字体大小、文字颜色、行高、对齐方式等文字样式',
        descEn:
          'Title element with font size, text color, line height, text alignment and other text styles',
        version: '4.3.0',
      },
      {
        name: 'subTitle',
        selector: '.ant-result-subtitle',
        descZh: '副标题元素，包含字体大小、文字颜色、行高等文字样式',
        descEn: 'Subtitle element with font size, text color, line height and other text styles',
        version: '4.3.0',
      },
      {
        name: 'extra',
        selector: '.ant-result-extra',
        descZh: '操作区域元素，包含外边距、文本对齐、内部元素间距等布局样式',
        descEn:
          'Action area element with margin, text alignment, inner element spacing and other layout styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-result-content',
        descZh: '内容元素，包含外边距、内边距、背景色等内容区域样式',
        descEn:
          'Content element with margin, padding, background color and other content area styles',
        version: '4.3.0',
      },
    ],
  },

  Segmented: {
    component: 'Segmented',
    tagName: 'a-segmented',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-segmented',
        descZh: '分段控制器根容器',
        descEn: 'Root container element of Segmented',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-segmented-item',
        descZh: '单个分段选项元素',
        descEn: 'Individual segmented option item',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-segmented-item-icon',
        descZh: '分段选项前置图标',
        descEn: 'Option leading icon element',
        version: '4.3.0',
      },
      {
        name: 'label',
        selector: '.ant-segmented-item-label',
        descZh: '分段选项标签内容容器',
        descEn: 'Option label content wrapper',
        version: '4.3.0',
      },
    ],
  },

  Select: {
    component: 'Select',
    tagName: 'a-select',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-select',
        descZh: '选择器根容器元素',
        descEn: 'Root container element of Select',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-select-prefix, .ant-select-selection-item',
        descZh: '选择器前缀与选中项区域',
        descEn: 'Prefix and selected value area',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧下拉箭头后缀元素',
        descEn: 'Trailing dropdown arrow icon',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-select-dropdown',
        descZh: '下拉选项菜单弹层容器',
        descEn: 'Dropdown options popup root container',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Skeleton: {
    component: 'Skeleton',
    tagName: 'a-skeleton',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-skeleton',
        descZh: '根元素，包含表格显示、宽度、动画效果、圆角等骨架屏容器的基础样式',
        descEn:
          'Root element with table display, width, animation effects, border radius and other skeleton container basic styles',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-skeleton-header',
        descZh: '头部元素，包含表格单元格、内边距、垂直对齐等头像占位区域的布局样式',
        descEn:
          'Header element with table cell, padding, vertical alignment and other avatar placeholder area layout styles',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-skeleton-content',
        descZh: '区块元素，包含骨架屏内容区域的布局样式',
        descEn: 'Section element with skeleton content area layout styles',
        version: '4.3.0',
      },
      {
        name: 'avatar',
        selector: '.ant-skeleton-avatar',
        descZh: '头像元素，包含行内块显示、垂直对齐、背景色、尺寸、圆角等头像占位的样式',
        descEn:
          'Avatar element with inline-block display, vertical alignment, background color, size, border radius and other avatar placeholder styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-skeleton-title',
        descZh: '标题元素，包含宽度、高度、背景色、圆角等标题占位的样式',
        descEn:
          'Title element with width, height, background color, border radius and other title placeholder styles',
        version: '4.3.0',
      },
      {
        name: 'paragraph',
        selector: '.ant-skeleton-paragraph',
        descZh: '段落元素，包含内边距、列表项样式、背景色、圆角等段落占位的样式',
        descEn:
          'Paragraph element with padding, list item styles, background color, border radius and other paragraph placeholder styles',
        version: '4.3.0',
      },
    ],
  },

  Slider: {
    component: 'Slider',
    tagName: 'a-slider',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-slider',
        descZh: '根元素，设置相对定位、高度、边距、内边距、光标样式和触摸事件控制',
        descEn:
          'Root element with relative positioning, height, margin, padding, cursor style and touch action control',
        version: '4.3.0',
      },
      {
        name: 'rail',
        selector: '.ant-slider-rail',
        descZh: '背景轨道元素，设置绝对定位、背景色、圆角和过渡动画样式',
        descEn:
          'Background rail element with absolute positioning, background color, border radius and transition animation styles',
        version: '4.3.0',
      },
      {
        name: 'tracks',
        selector: '.ant-slider-tracks, .ant-slider-track',
        descZh: '多段轨道容器元素，设置绝对定位和过渡动画样式',
        descEn:
          'Multi-segment track container element with absolute positioning and transition animation styles',
        version: '4.3.0',
      },
      {
        name: 'track',
        selector: '.ant-slider-track',
        descZh: '轨道选取条元素，设置绝对定位、背景色、圆角和过渡动画样式',
        descEn:
          'Track selection bar element with absolute positioning, background color, border radius and transition animation styles',
        version: '4.3.0',
      },
      {
        name: 'handle',
        selector: '.ant-slider-handle',
        descZh: '滑块控制点元素，设置绝对定位、尺寸、背景色、边框阴影、圆角和交互过渡样式',
        descEn:
          'Slider handle control element with absolute positioning, size, background color, border shadow, border radius, cursor style and transition animation',
        version: '4.3.0',
      },
    ],
  },

  Space: {
    component: 'Space',
    tagName: 'a-space',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-space',
        descZh: '间距布局根容器',
        descEn: 'Root flex container of Space',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-space-item',
        descZh: '单个子元素包裹项',
        descEn: 'Individual child item wrapper',
        version: '4.3.0',
      },
      {
        name: 'separator',
        selector: '.ant-space-item-split',
        descZh: '子项之间的分隔符容器',
        descEn: 'Separator wrapper between child items',
        version: '4.3.0',
      },
    ],
  },

  Spin: {
    component: 'Spin',
    tagName: 'a-spin',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-spin-nested-loading, .ant-spin',
        descZh: '根元素，设置定位、显示控制、颜色、字体大小、透明度和过渡动画',
        descEn:
          'Root element setting positioning, display control, color, font size, opacity, and transition animation',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-spin-spinning, .ant-spin',
        descZh: '加载元素区域，设置相对定位、弹性盒子布局、对齐方式和颜色',
        descEn:
          'Loading element area setting relative positioning, flexbox layout, alignment, and color',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-spin-dot',
        descZh: '指示器元素，设置旋转加载动画尺寸、行内块显示与过渡动画',
        descEn:
          'Indicator element setting spinner width, height, inline-block display, and transition animation',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-spin-text',
        descZh: '描述元素（兼容 tip），设置加载提示文案的字体大小和行高',
        descEn: 'Description element (tip alias) setting loading text font size and line height',
        version: '4.3.0',
      },
      {
        name: 'container',
        selector: '.ant-spin-container',
        descZh: '容器元素（兼容 mask），放置被 Spin 包裹的子元素，设置透明度和过渡动画',
        descEn:
          'Container element (mask alias) holding child elements wrapped by Spin with opacity and transition animation',
        version: '4.3.0',
      },
    ],
  },

  Splitter: {
    component: 'Splitter',
    tagName: 'a-splitter',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-splitter',
        descZh: '分隔面板根容器',
        descEn: 'Root container element of Splitter',
        version: '4.3.0',
      },
      {
        name: 'panel',
        selector: '.ant-splitter-panel',
        descZh: '单个可伸缩面板区域',
        descEn: 'Individual resizable panel container',
        version: '4.3.0',
      },
      {
        name: 'dragger',
        selector: '.ant-splitter-bar-dragger, .ant-splitter-bar',
        descZh: '面板之间的可拖拽分割条',
        descEn: 'Draggable split bar handle between panels',
        version: '4.3.0',
      },
    ],
  },

  Statistic: {
    component: 'Statistic',
    tagName: 'a-statistic',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-statistic',
        descZh: '根元素，包含统计数值组件的重置样式和整体容器样式',
        descEn:
          'Root element with reset styles and overall container styles for statistic component',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-statistic-header, .ant-statistic-title',
        descZh: '头部元素，包含下内边距和标题区域的布局样式',
        descEn: 'Header element with bottom padding and title area layout styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-statistic-title',
        descZh: '标题元素，包含文字颜色、字体大小等标题文字的显示样式',
        descEn: 'Title element with text color, font size and other title text display styles',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-statistic-content-prefix',
        descZh: '前缀元素，包含行内块显示、右外边距等前缀内容的布局样式',
        descEn:
          'Prefix element with inline-block display, right margin and other prefix content layout styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-statistic-content',
        descZh: '内容元素，包含前缀、数值、后缀的布局和对齐等内容区域样式',
        descEn:
          'Content element with layout and alignment styles for the prefix, value and suffix area',
        version: '4.3.0',
      },
      {
        name: 'value',
        selector: '.ant-statistic-content-value',
        descZh: '数值元素，包含文字颜色、字体大小、字体族等统计数值的展示样式',
        descEn:
          'Value element with text color, font size, font family and other statistic number display styles',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-statistic-content-suffix',
        descZh: '后缀元素，包含行内块显示、左外边距等后缀内容的布局样式',
        descEn:
          'Suffix element with inline-block display, left margin and other suffix content layout styles',
        version: '4.3.0',
      },
    ],
  },

  Steps: {
    component: 'Steps',
    tagName: 'a-steps',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-steps',
        descZh: '根元素，包含 flex 布局、禁止换行、对齐方式、CSS 变量等步骤条容器的基础样式',
        descEn:
          'Root element with flex layout, nowrap, alignment, CSS variables and other basic step container styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-steps-item',
        descZh: '步骤项元素，包含 flex 布局、相对定位等单个步骤项的基础容器样式',
        descEn:
          'Step item element with flex layout, relative positioning and other basic step item container styles',
        version: '4.3.0',
      },
      {
        name: 'itemWrapper',
        selector: '.ant-steps-item-container',
        descZh: '步骤项内裹元素，包含步骤项内容的包装布局样式',
        descEn: 'Step item wrapper element with step content wrapping layout styles',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-steps-item-icon',
        descZh: '步骤项图标元素，包含图标的尺寸、定位、字体大小等图标显示相关样式',
        descEn:
          'Step item icon element with icon size, positioning, font-size and other icon display related styles',
        version: '4.3.0',
      },
      {
        name: 'itemSection',
        selector: '.ant-steps-item-content',
        descZh: '步骤项区域元素，包含步骤项内容区域的布局和样式',
        descEn: 'Step item section element with step content area layout and styling',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-steps-item-title',
        descZh: '步骤项标题元素，包含颜色、字体大小、行高、文字换行等标题文字样式',
        descEn:
          'Step item title element with color, font-size, line-height, word-break and other title text styles',
        version: '4.3.0',
      },
      {
        name: 'itemSubtitle',
        selector: '.ant-steps-item-subtitle',
        descZh: '步骤项副标题元素，包含颜色、字体大小、行高、外边距等副标题样式',
        descEn:
          'Step item subtitle element with color, font-size, line-height, margin and other subtitle styles',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-steps-item-description',
        descZh: '步骤项内容元素，包含颜色、字体大小、行高、文字换行等内容文字样式',
        descEn:
          'Step item content element with color, font-size, line-height, word-break and other content text styles',
        version: '4.3.0',
      },
      {
        name: 'itemRail',
        selector: '.ant-steps-item-tail, .ant-steps-item-title',
        descZh: '步骤项连接线元素，包含边框样式、边框宽度、过渡动画等连接线的样式',
        descEn:
          'Step item rail element with border-style, border-width, transitions and other connecting line styles',
        version: '4.3.0',
      },
    ],
  },

  Switch: {
    component: 'Switch',
    tagName: 'a-switch',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-switch',
        descZh:
          '根元素，包含最小宽度、高度、行高、垂直对齐、背景色、边框、圆角、光标样式、过渡动画等开关容器的基础样式',
        descEn:
          'Root element with min-width, height, line-height, vertical alignment, background color, border, border radius, cursor style, transition animations and other basic switch container styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-switch-inner',
        descZh:
          '内容元素，包含块级显示、溢出隐藏、圆角、高度、内边距、过渡动画等开关内容区域的布局和样式',
        descEn:
          'Content element with block display, overflow hidden, border radius, height, padding, transition animations and other switch content area layout and styles',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-switch-handle',
        descZh:
          '指示器元素，包含绝对定位、宽度、高度、背景色、圆角、阴影、过渡动画等开关把手的样式和交互效果',
        descEn:
          'Indicator element with absolute positioning, width, height, background color, border radius, shadow, transition animations and other switch handle styles and interactive effects',
        version: '4.3.0',
      },
    ],
  },

  Table: {
    component: 'Table',
    tagName: 'a-table',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-table-wrapper',
        descZh: '根元素，包含字体大小、背景色、圆角、滚动条颜色等表格容器的基础样式',
        descEn:
          'Root element with font-size, background, border-radius, scrollbar-color and other basic table container styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-table-title',
        descZh: '标题元素，包含表格标题的样式和布局',
        descEn: 'Title element with table title styling and layout',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-table-content',
        descZh: '内容元素，包含表格内容区域的样式和布局',
        descEn: 'Content element with table content area styling and layout',
        version: '4.3.0',
      },
      {
        name: 'header.wrapper',
        selector: '.ant-table-thead',
        descZh: '头部容器元素，包含表头的布局和容器样式',
        descEn: 'Header wrapper element with table header layout and container styles',
        version: '4.3.0',
      },
      {
        name: 'header.row',
        selector: '.ant-table-thead > tr',
        descZh: '头部行元素，包含表头行的布局和样式',
        descEn: 'Header row element with table header row layout and styling',
        version: '4.3.0',
      },
      {
        name: 'header.cell',
        selector: '.ant-table-thead > tr > th',
        descZh: '头部单元格元素，包含相对定位、内边距、背景色、文字颜色、字体权重等表头单元格样式',
        descEn:
          'Header cell element with relative positioning, padding, word-wrap, background, text color, font-weight and other header cell styles',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-table-container',
        descZh: '容器元素，包含清除浮动、最大宽度、滚动条背景等表格包装容器样式',
        descEn:
          'Container element with clear-fix, max-width, scrollbar background and other table wrapper styles',
        version: '4.3.0',
      },
      {
        name: 'body.wrapper',
        selector: '.ant-table-tbody',
        descZh: '主体容器元素，包含表格主体的布局和容器样式',
        descEn: 'Body wrapper element with table body layout and container styles',
        version: '4.3.0',
      },
      {
        name: 'body.row',
        selector: '.ant-table-tbody > tr.ant-table-row',
        descZh: '主体行元素，包含数据行的悬浮效果、选中状态、展开状态等交互样式',
        descEn:
          'Body row element with hover effects, selected states, expanded states and other interactive row styles',
        version: '4.3.0',
      },
      {
        name: 'body.cell',
        selector: '.ant-table-tbody > tr.ant-table-row > td',
        descZh: '主体单元格元素，包含相对定位、内边距、文字换行等数据单元格的基础样式',
        descEn:
          'Body cell element with relative positioning, padding, word-wrap and other basic data cell styles',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-table-footer',
        descZh: '底部元素，包含表格底部的背景色、文字颜色等样式',
        descEn:
          'Footer element with table footer background color, text color and other footer styles',
        version: '4.3.0',
      },
      {
        name: 'pagination.root',
        selector: '.ant-table-pagination, .ant-pagination',
        descZh: '分页根元素，包含分页组件的基础样式和布局',
        descEn: 'Pagination root element with pagination component basic styles and layout',
        version: '4.3.0',
      },
      {
        name: 'pagination.item',
        selector: '.ant-table-pagination .ant-pagination-item, .ant-pagination-item',
        descZh: '分页单项元素，包含分页项的样式和交互效果',
        descEn: 'Pagination item element with pagination item styling and interactive effects',
        version: '4.3.0',
      },
    ],
  },

  Tabs: {
    component: 'Tabs',
    tagName: 'a-tabs',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tabs',
        descZh: '根元素，包含标签页容器的基础样式、布局和方向控制',
        descEn: 'Root element with basic tab container styles, layout and direction control',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-tabs-nav',
        descZh: '头部元素，包含标签页头部导航的布局、背景、边框等样式',
        descEn:
          'Header element with tab navigation header layout, background, borders and other styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-tabs-tab',
        descZh:
          'Item 元素，包含相对定位、内边距、颜色、文本省略、圆角、过渡动画等标签项的样式和交互效果',
        descEn:
          'Item element with relative positioning, padding, colors, text ellipsis, border-radius, transitions and other tab item styles and interactive effects',
        version: '4.3.0',
      },
      {
        name: 'remove',
        selector: '.ant-tabs-tab-remove',
        descZh: '删除按钮元素，包含可编辑标签页关闭按钮的尺寸、颜色、悬浮态和交互反馈等样式',
        descEn:
          'Remove button element with editable tab close button size, color, hover state and other interactive feedback styles',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-tabs-ink-bar',
        descZh: '指示器元素，包含指示条的颜色、位置、尺寸、过渡动画等活跃状态指示样式',
        descEn:
          'Indicator element with indicator bar color, position, dimensions, transitions and other active state indication styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-tabs-content-holder',
        descZh: '内容区域元素，包含标签页面板容器的布局、动画和尺寸控制',
        descEn: 'Body element with tab panel container layout, animation and size control styles',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-tabs-tabpane-active, .ant-tabs-content',
        descZh: '内容元素，包含单个标签页面板的布局、内边距等内容展示样式',
        descEn:
          'Content element with single tab panel layout, padding and other content display styles',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-tabs-dropdown, .ant-tabs-nav-more',
        descZh: '弹出菜单元素，包含折叠标签页下拉菜单的绝对定位、层级、最大高度、滚动等样式',
        descEn:
          'Popup menu element with dropdown absolute positioning, z-index, display control, max-height, scrolling and other styles',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Tag: {
    component: 'Tag',
    tagName: 'a-tag',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tag',
        descZh: '标签根元素',
        descEn: 'Root element of Tag',
        version: '4.3.0',
      },
      {
        name: 'icon',
        selector: '.ant-tag .anticon:not(.ant-tag-close-icon), .ant-tag-icon',
        descZh: '前置图标元素',
        descEn: 'Leading icon element',
        version: '4.3.0',
      },
      {
        name: 'content',
        selector: '.ant-tag-content, .ant-tag > span:not(.anticon):not(.ant-tag-close-icon)',
        descZh: '标签文本内容元素',
        descEn: 'Tag text content element',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-tag-close-icon',
        descZh: '关闭图标按钮元素',
        descEn: 'Close icon button element',
        version: '4.3.0',
      },
    ],
  },

  TimePicker: {
    component: 'TimePicker',
    tagName: 'a-time-picker',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-picker',
        descZh:
          '根元素，包含相对定位、行内 flex 布局、内边距、边框圆角、过渡动画等时间选择器容器的基础样式',
        descEn:
          'Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for time picker container',
        version: '4.3.0',
      },
      {
        name: 'prefix',
        selector: '.ant-picker-prefix',
        descZh: '前缀元素，包含 flex 布局、右外边距等前缀内容的布局样式',
        descEn: 'Prefix element with flex layout and margin styles for prefix content layout',
        version: '4.3.0',
      },
      {
        name: 'input',
        selector: '.ant-picker-input > input',
        descZh: '输入框元素，包含相对定位、宽度、颜色、字体、行高、过渡动画等输入框的核心交互样式',
        descEn:
          'Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-picker-suffix',
        descZh: '后缀元素，包含 flex 布局、颜色、行高、指针事件、过渡动画等后缀内容的样式',
        descEn:
          'Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-picker-dropdown-pure, .ant-picker-dropdown',
        descZh: '弹出框根元素',
        descEn: 'Popup root element',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.container',
        selector: '.ant-picker-panel-container',
        descZh: '弹出框容器元素，设置背景色、内边距、圆角、阴影、边框和内容展示样式',
        descEn:
          'Container element, set background color, padding, border radius, shadow, border and content display styles',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.content',
        selector: '.ant-picker-content',
        descZh: '弹出框内容元素，包含时间选择列区域的布局和样式',
        descEn: 'Popup content element with layout and display styles for time picker columns',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.item',
        selector: '.ant-picker-time-panel-cell-inner',
        descZh: '弹出框单项元素，包含时间单元格的尺寸、背景色、圆角、悬停态、选中态等交互样式',
        descEn:
          'Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for time cells',
        version: '4.3.0',
        isPopup: true,
      },
      {
        name: 'popup.footer',
        selector: '.ant-picker-footer',
        descZh: '弹出框底部元素，包含此刻与确认按钮等底部操作区域的布局样式',
        descEn:
          'Popup footer element with layout styles for bottom operation area including Now and OK buttons',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Timeline: {
    component: 'Timeline',
    tagName: 'a-timeline',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-timeline',
        descZh: '根元素，设置时间轴容器的列表样式重置、垂直布局、点状图标、交替布局等基础容器样式',
        descEn:
          'Root element with timeline container list style reset, vertical layout, dot icon, outlined style, alternate layout and other basic container styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-timeline-item',
        descZh: '节点元素，设置单个时间节点的相对定位、外边距、内边距、字体大小等节点基础样式',
        descEn:
          'Item element with single timeline node relative positioning, margin, padding, font size and other node basic styles',
        version: '4.3.0',
      },
      {
        name: 'itemWrapper',
        selector: '.ant-timeline-item-wrapper',
        descZh: '节点包装元素，设置时间节点内容的包装容器样式',
        descEn: 'Item wrapper element with timeline node content wrapping container styles',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-timeline-item-icon, .ant-timeline-item-head',
        descZh: '节点图标元素，设置节点头部图标的定位、宽高尺寸、背景色、边框、圆角等图标样式',
        descEn:
          'Item icon element with node head icon positioning, width/height size, background color, border, border radius and other icon styles',
        version: '4.3.0',
      },
      {
        name: 'itemSection',
        selector: '.ant-timeline-item-section',
        descZh: '节点区域元素，设置包含内容区域容器的布局与间距样式',
        descEn: 'Item section element with section container layout and gap styles',
        version: '4.3.0',
      },
      {
        name: 'itemHeader',
        selector: '.ant-timeline-item-header',
        descZh: '节点头部元素，设置包含标题区域的布局、对齐方式、文本方向等样式',
        descEn:
          'Item header element with header area layout containing title, alignment, text direction and other styles',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-timeline-item-title, .ant-timeline-item-label',
        descZh: '节点标题元素，设置节点标题文字的字体大小、行高、颜色等文本样式',
        descEn:
          'Item title element with node title text font size, line height, color and other text styles',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-timeline-item-content',
        descZh: '节点内容元素，设置节点详细内容的相对定位、偏移、文字颜色、换行等内容样式',
        descEn:
          'Item content element with node detail content relative positioning, offset, text color, word break and other content styles',
        version: '4.3.0',
      },
      {
        name: 'itemRail',
        selector: '.ant-timeline-item-rail, .ant-timeline-item-tail',
        descZh: '节点连接线元素，设置连接时间节点的轨道线条的定位、高度、边框颜色和宽度等样式',
        descEn:
          'Item rail element with timeline node connection track line positioning, height, border color, width and style',
        version: '4.3.0',
      },
    ],
  },

  Tooltip: {
    component: 'Tooltip',
    tagName: 'a-tooltip',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tooltip',
        descZh: '文字提示弹层根容器',
        descEn: 'Tooltip overlay root container',
        version: '4.3.0',
      },
      {
        name: 'container',
        selector: '.ant-tooltip-inner',
        descZh: '提示气泡内层容器（兼容 body 别名）',
        descEn: 'Tooltip bubble inner container (body alias)',
        version: '4.3.0',
      },
      {
        name: 'arrow',
        selector: '.ant-tooltip-arrow',
        descZh: '提示气泡指向箭头',
        descEn: 'Directional arrow of Tooltip',
        version: '4.3.0',
      },
    ],
  },

  Tour: {
    component: 'Tour',
    tagName: 'a-tour',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tour',
        descZh: '引导根容器，设置定位、层级控制、最大宽度、主题样式等容器样式',
        descEn:
          'Tour root container with positioning, z-index control, max width, theme styles and other container styles',
        version: '4.3.0',
      },
      {
        name: 'mask',
        selector: '.sp-tour-mask',
        descZh: '遮罩层元素，设置覆盖层、层级、指针事件、过渡动画等遮罩样式',
        descEn:
          'Mask layer element with full screen coverage, z-index, pointer events, transition animation and other mask styles',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-tour-section, .ant-tour-inner',
        descZh: '卡片主要内容区域，设置圆角、阴影、相对定位、背景色、边框等卡片样式',
        descEn:
          'Card main content area with border radius, box shadow, relative positioning, background color, border and other card styles',
        version: '4.3.0',
      },
      {
        name: 'cover',
        selector: '.ant-tour-cover',
        descZh: '卡片封面区域，设置文本居中对齐、内边距、图片宽度等图片展示样式',
        descEn:
          'Card cover area with text center alignment, padding, image width and other image display styles',
        version: '4.3.0',
      },
      {
        name: 'close',
        selector: '.ant-tour-close',
        descZh: '关闭按钮元素，设置绝对定位、尺寸、颜色、悬浮态和交互反馈等关闭按钮样式',
        descEn:
          'Close button element with absolute positioning, size, color, hover state and other interactive feedback styles',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-tour-header',
        descZh: '卡片头部区域，设置内边距、宽度计算、词汇换行等头部容器样式',
        descEn:
          'Card header area with padding, width calculation, word break and other header container styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-tour-title',
        descZh: '引导标题文字，设置字体粗细等标题文本样式',
        descEn: 'Guide title text with font weight and other title text styles',
        version: '4.3.0',
      },
      {
        name: 'description',
        selector: '.ant-tour-description',
        descZh: '引导描述文字，设置内边距、词汇换行等描述文本样式',
        descEn: 'Guide description text with padding, word wrap and other description text styles',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-tour-footer',
        descZh: '卡片底部操作区域，设置内边距、对齐、圆角、Flex 布局等底部容器样式',
        descEn:
          'Card bottom action area with padding, text right alignment, border radius, flex layout and other bottom container styles',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-tour-actions, .ant-tour-buttons',
        descZh: '操作按钮组容器，设置左侧自动外边距、按钮间距等按钮组布局样式',
        descEn:
          'Action button group container with left auto margin, button spacing and other button group layout styles',
        version: '4.3.0',
      },
      {
        name: 'indicators',
        selector: '.ant-tour-indicators',
        descZh: '指示器组容器，设置行内块显示等指示器容器样式',
        descEn:
          'Indicator group container with inline-block display and other indicator container styles',
        version: '4.3.0',
      },
      {
        name: 'indicator',
        selector: '.ant-tour-indicator',
        descZh: '单个指示器元素，设置宽高尺寸、圆角、背景色、激活状态等圆点样式',
        descEn:
          'Single indicator element with width/height size, inline-block display, border radius, background color, active state and other dot styles',
        version: '4.3.0',
      },
    ],
  },

  Transfer: {
    component: 'Transfer',
    tagName: 'a-transfer',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-transfer',
        descZh: '根元素，设置 flex 布局、穿梭框容器的基础样式和布局控制',
        descEn: 'Root element with flex layout, transfer container base styles and layout control',
        version: '4.3.0',
      },
      {
        name: 'section',
        selector: '.ant-transfer-list',
        descZh: '区域元素，设置单侧穿梭框的容器样式（支持 source / target 独立定制）',
        descEn:
          'Section element for single-side transfer container styles (supports source / target scoping)',
        version: '4.3.0',
      },
      {
        name: 'header',
        selector: '.ant-transfer-list-header',
        descZh: '头部元素，设置全选框与标题栏的布局与边框样式',
        descEn: 'Header element with flex layout, alignment, padding, and border styles',
        version: '4.3.0',
      },
      {
        name: 'title',
        selector: '.ant-transfer-list-header-title',
        descZh: '标题元素，设置列表标题文字的省略、对齐与排版样式',
        descEn: 'Title element with text ellipsis, flex ratio, and text alignment styles',
        version: '4.3.0',
      },
      {
        name: 'body',
        selector: '.ant-transfer-list-body',
        descZh: '内容元素，设置列表主体区域的容器样式和布局控制',
        descEn: 'Body element with list main area container styles and layout control',
        version: '4.3.0',
      },
      {
        name: 'list',
        selector: '.ant-transfer-list-content',
        descZh: '列表元素，设置列表内容的样式、布局和滚动控制',
        descEn: 'List element with list content styles, layout and scroll control',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-transfer-list-content-item',
        descZh: '列表项元素，设置相对定位、内边距、悬停态、选中态等交互样式',
        descEn:
          'List item element with relative positioning, padding, hover state, selected state and other interaction styles',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-transfer-list-content-item .ant-checkbox-wrapper',
        descZh: '列表项图标元素，设置复选框等图标的样式和交互状态',
        descEn: 'List item icon element with checkbox and other icon styles and interaction states',
        version: '4.3.0',
      },
      {
        name: 'itemContent',
        selector: '.ant-transfer-list-content-item-text',
        descZh: '列表项内容元素，设置文本省略、内边距等列表项文本内容的展示样式',
        descEn:
          'List item content element with text ellipsis, padding and other list item text content display styles',
        version: '4.3.0',
      },
      {
        name: 'footer',
        selector: '.ant-transfer-list-footer',
        descZh: '页脚元素，设置底部操作区域的样式和布局',
        descEn: 'Footer element with bottom operation area styles and layout',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-transfer-operation',
        descZh: '操作元素，设置穿梭按钮组的样式、布局和交互状态',
        descEn: 'Actions element with transfer button group styles, layout and interaction states',
        version: '4.3.0',
      },
    ],
  },

  Tree: {
    component: 'Tree',
    tagName: 'a-tree',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tree',
        descZh: '根元素，设置树形控件的基础样式、布局和容器控制',
        descEn: 'Root element with tree control base styles, layout and container control',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-tree-treenode',
        descZh: '条目元素，设置树节点的基础样式、缩进、切换器、内容包装器等节点结构',
        descEn:
          'Item element with tree node base styles, drag state, indentation, switcher, content wrapper and other node structure',
        version: '4.3.0',
      },
      {
        name: 'itemIcon',
        selector: '.ant-tree-iconEle',
        descZh: '图标元素，设置树节点图标的样式、尺寸和状态显示',
        descEn: 'Icon element with tree node icon styles, size and state display',
        version: '4.3.0',
      },
      {
        name: 'itemTitle',
        selector: '.ant-tree-title',
        descZh: '标题元素，设置树节点标题文字的显示样式和文本内容',
        descEn: 'Title element with tree node title text display styles and text content',
        version: '4.3.0',
      },
      {
        name: 'itemSwitcher',
        selector: '.ant-tree-switcher',
        descZh: '展开收起切换器元素，设置树节点展开/收起按钮的样式和背景',
        descEn: 'Switcher element with tree node expand/collapse button styles and background',
        version: '4.3.0',
      },
    ],
  },

  TreeSelect: {
    component: 'TreeSelect',
    tagName: 'a-tree-select',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-tree-select, .ant-select',
        descZh: '树选择器根容器元素',
        descEn: 'Root container element of TreeSelect',
        version: '4.3.0',
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧展开箭头后缀图标',
        descEn: 'Trailing dropdown arrow icon',
        version: '4.3.0',
      },
      {
        name: 'popup.root',
        selector: '.ant-tree-select-dropdown, .ant-select-dropdown',
        descZh: '树形选择下拉弹层容器',
        descEn: 'Tree dropdown popup root container',
        version: '4.3.0',
        isPopup: true,
      },
    ],
  },

  Typography: {
    component: 'Typography',
    tagName: 'a-typography-paragraph',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-typography',
        descZh: '根元素，包含排版基础样式、布局和定位',
        descEn: 'Root element with base typography styles, layout, and positioning',
        version: '4.3.0',
      },
      {
        name: 'actions',
        selector: '.ant-typography-actions, .ant-typography-edit',
        descZh: '操作区域元素，包含复制、编辑、展开/收起等操作按钮的布局和间距样式',
        descEn:
          'Actions element with layout and spacing styles for copy, edit, expand/collapse buttons',
        version: '4.3.0',
      },
      {
        name: 'action',
        selector: '.ant-typography-copy, .ant-typography-edit',
        descZh: '单个操作按钮元素，包括复制、编辑、展开、收起按钮的样式，如内边距、圆角、颜色等',
        descEn:
          'Individual action button element including copy, edit, expand, collapse button styles like padding, border radius, colors, etc.',
        version: '4.3.0',
      },
      {
        name: 'textarea',
        selector: '.ant-typography-edit-content textarea, .ant-typography textarea',
        descZh: '可编辑模式下的 TextArea 元素样式，用于自定义编辑输入框的类名和内联样式',
        descEn:
          'TextArea element in editable mode, used to customize className and inline styles for the edit input',
        version: '4.3.0',
      },
    ],
  },

  Upload: {
    component: 'Upload',
    tagName: 'a-upload',
    functional: true,
    semantics: [
      {
        name: 'root',
        selector: '.ant-upload-wrapper',
        descZh: '根元素容器，包含布局样式、禁用状态文字颜色、用户选择控制、鼠标样式等基础样式',
        descEn:
          'Root container element with layout styles, disabled text color, user-select control, cursor styles and other basic styles',
        version: '4.3.0',
      },
      {
        name: 'list',
        selector: '.ant-upload-list',
        descZh: '文件列表容器，包含布局排列、过渡动画、间距控制等样式',
        descEn:
          'File list container with layout arrangement, transition animations, spacing control and other styles',
        version: '4.3.0',
      },
      {
        name: 'item',
        selector: '.ant-upload-list-item',
        descZh: '文件项元素，包含内边距、背景色、边框样式、悬停效果、状态颜色、过渡动画等样式',
        descEn:
          'File item element with padding, background color, border styles, hover effects, status colors, transition animations and other styles',
        version: '4.3.0',
      },
      {
        name: 'trigger',
        selector: '.ant-upload-select',
        descZh: '上传按钮容器，包含按钮样式、禁用状态、隐藏控制等样式',
        descEn:
          'Upload button container with button styles, disabled state, visibility control and other styles',
        version: '4.3.0',
      },
    ],
  },
};

const SLUG_TO_COMPONENT: Record<string, string> = {};
Object.keys(SEMANTICS_DATA).forEach(comp => {
  const kebab = comp.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  SLUG_TO_COMPONENT[kebab] = comp;
  SLUG_TO_COMPONENT[comp.toLowerCase()] = comp;
});
SLUG_TO_COMPONENT['qr-code'] = 'QRCode';

export function resolveSemanticComponentName(title?: string, slug?: string): string {
  const trimmed = String(title || '').trim();
  if (trimmed && SEMANTICS_DATA[trimmed]) {
    return trimmed;
  }
  const compact = trimmed.replace(/[\s-]+/g, '').toLowerCase();
  if (compact && SLUG_TO_COMPONENT[compact]) {
    return SLUG_TO_COMPONENT[compact];
  }
  const cleanSlug = String(slug || '')
    .trim()
    .toLowerCase();
  if (cleanSlug && SLUG_TO_COMPONENT[cleanSlug]) {
    return SLUG_TO_COMPONENT[cleanSlug];
  }
  const compactSlug = cleanSlug.replace(/[\s-]+/g, '');
  if (compactSlug && SLUG_TO_COMPONENT[compactSlug]) {
    return SLUG_TO_COMPONENT[compactSlug];
  }
  return '';
}

export function hasSemanticDom(title?: string, slug?: string): boolean {
  return Boolean(resolveSemanticComponentName(title, slug));
}
