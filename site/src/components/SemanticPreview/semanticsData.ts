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
      },
      {
        name: 'icon',
        selector: '.ant-alert-icon',
        descZh: '左侧辅助状态图标元素',
        descEn: 'Status icon element on the start side',
      },
      {
        name: 'section',
        selector: '.ant-alert-section, .ant-alert-content',
        descZh: '包裹标题与描述的内容区容器',
        descEn: 'Content wrapper containing title and description',
      },
      {
        name: 'title',
        selector: '.ant-alert-title, .ant-alert-message',
        descZh: '警告提示标题元素',
        descEn: 'Alert title element',
      },
      {
        name: 'description',
        selector: '.ant-alert-description',
        descZh: '警告提示辅助性文字描述元素',
        descEn: 'Auxiliary description element',
      },
      {
        name: 'actions',
        selector: '.ant-alert-action',
        descZh: '自定义操作区容器',
        descEn: 'Custom action area container',
      },
      {
        name: 'close',
        selector: '.ant-alert-close-icon',
        descZh: '关闭按钮元素',
        descEn: 'Close button element',
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
      },
      {
        name: 'icon',
        selector: '.ant-tag .anticon:not(.ant-tag-close-icon), .ant-tag-icon',
        descZh: '前置图标元素',
        descEn: 'Leading icon element',
      },
      {
        name: 'content',
        selector: '.ant-tag-content, .ant-tag > span:not(.anticon):not(.ant-tag-close-icon)',
        descZh: '标签文本内容元素',
        descEn: 'Tag text content element',
      },
      {
        name: 'close',
        selector: '.ant-tag-close-icon',
        descZh: '关闭图标按钮元素',
        descEn: 'Close icon button element',
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
      },
      {
        name: 'image',
        selector: '.ant-image-img',
        descZh: '原生 <img> 图片元素',
        descEn: 'Native <img> element',
      },
      {
        name: 'cover',
        selector: '.ant-image-cover, .ant-image-mask',
        descZh: '悬浮预览遮罩覆盖层',
        descEn: 'Hover preview cover overlay element',
      },
      {
        name: 'popup.root',
        selector: '.ant-image',
        descZh: '全屏预览弹窗根容器（点击图片打开预览）',
        descEn: 'Fullscreen preview modal root container (click image to preview)',
        isPopup: true,
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
      },
      {
        name: 'rail',
        selector: '.ant-divider-rail, .ant-divider',
        descZh: '分割线轨道线条元素',
        descEn: 'Divider rail line element',
      },
      {
        name: 'content',
        selector: '.ant-divider-inner-text',
        descZh: '分割线内置文字内容元素',
        descEn: 'Inner text content element inside Divider',
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
      },
      {
        name: 'holder',
        selector: '.ant-listy-holder, .ant-listy',
        descZh: '内部滚动视口容器',
        descEn: 'Internal scrollable viewport holder',
      },
      {
        name: 'groupSection',
        selector: '.ant-listy-group-section',
        descZh: '分组区块包裹容器',
        descEn: 'Group section wrapper container',
      },
      {
        name: 'groupHeader',
        selector: '.ant-listy-group-header',
        descZh: '分组标题头元素',
        descEn: 'Group header element',
      },
      {
        name: 'item',
        selector: '.ant-listy-item',
        descZh: '列表单项元素',
        descEn: 'Individual list item element',
      },
      {
        name: 'scrollbar',
        selector: '.ant-listy-scrollbar, .rc-virtual-list-scrollbar, .ant-listy',
        descZh: '虚拟滚动条轨道元素',
        descEn: 'Virtual scrollbar track element',
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
      },
      {
        name: 'item',
        selector: '.ant-masonry-item',
        descZh: '瀑布流单个子项容器',
        descEn: 'Individual masonry item wrapper',
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
      },
      {
        name: 'icon',
        selector: '.ant-btn-icon, .ant-btn .anticon',
        descZh: '按钮图标容器元素',
        descEn: 'Button icon wrapper element',
      },
      {
        name: 'content',
        selector: '.ant-btn > span:not(.anticon):not(.ant-btn-icon)',
        descZh: '按钮文本内容元素',
        descEn: 'Button text content wrapper',
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
      },
      {
        name: 'header',
        selector: '.ant-card-head',
        descZh: '卡片头部区域',
        descEn: 'Card header container',
      },
      {
        name: 'title',
        selector: '.ant-card-head-title',
        descZh: '卡片头部标题元素',
        descEn: 'Card header title element',
      },
      {
        name: 'extra',
        selector: '.ant-card-extra',
        descZh: '卡片右上角操作区',
        descEn: 'Top-right extra action area',
      },
      {
        name: 'cover',
        selector: '.ant-card-cover',
        descZh: '卡片封面容器',
        descEn: 'Card cover container',
      },
      {
        name: 'body',
        selector: '.ant-card-body',
        descZh: '卡片内容区域',
        descEn: 'Card body content area',
      },
      {
        name: 'actions',
        selector: '.ant-card-actions',
        descZh: '卡片底部操作组',
        descEn: 'Bottom actions list container',
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
      },
      {
        name: 'prefix',
        selector: '.ant-input-prefix',
        descZh: '输入框前缀容器',
        descEn: 'Leading prefix container',
      },
      {
        name: 'input',
        selector: 'input.ant-input',
        descZh: '原生 <input> 输入框元素',
        descEn: 'Native <input> element',
      },
      {
        name: 'suffix',
        selector: '.ant-input-suffix',
        descZh: '输入框后缀容器',
        descEn: 'Trailing suffix container',
      },
      {
        name: 'count',
        selector: '.ant-input-show-count-suffix',
        descZh: '字数统计展示元素',
        descEn: 'Character count indicator element',
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
      },
      {
        name: 'prefix',
        selector: '.ant-select-prefix, .ant-select-selection-item',
        descZh: '选择器前缀与选中项区域',
        descEn: 'Prefix and selected value area',
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧下拉箭头后缀元素',
        descEn: 'Trailing dropdown arrow icon',
      },
      {
        name: 'popup.root',
        selector: '.ant-select-dropdown',
        descZh: '下拉选项菜单弹层容器',
        descEn: 'Dropdown options popup root container',
        isPopup: true,
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
      },
      {
        name: 'suffix',
        selector: '.ant-select-selector',
        descZh: '输入选择框主体容器',
        descEn: 'Input selector wrapper container',
      },
      {
        name: 'popup.root',
        selector: '.ant-select-dropdown',
        descZh: '自动补全联想下拉弹层容器',
        descEn: 'Suggestion dropdown popup root container',
        isPopup: true,
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
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧下拉箭头图标元素',
        descEn: 'Trailing dropdown arrow icon',
      },
      {
        name: 'popup.root',
        selector: '.ant-cascader-dropdown, .ant-select-dropdown',
        descZh: '级联多列面板弹层容器',
        descEn: 'Cascader multi-column dropdown popup root',
        isPopup: true,
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
      },
      {
        name: 'suffix',
        selector: '.ant-select-arrow',
        descZh: '右侧展开箭头后缀图标',
        descEn: 'Trailing dropdown arrow icon',
      },
      {
        name: 'popup.root',
        selector: '.ant-tree-select-dropdown, .ant-select-dropdown',
        descZh: '树形选择下拉弹层容器',
        descEn: 'Tree dropdown popup root container',
        isPopup: true,
      },
    ],
  },

  Slider: {
    component: 'Slider',
    tagName: 'a-slider',
    functional: false,
    semantics: [
      {
        name: 'root',
        selector: '.ant-slider',
        descZh: '滑动输入条根元素',
        descEn: 'Root container element of Slider',
      },
      {
        name: 'rail',
        selector: '.ant-slider-rail',
        descZh: '底层背景轨道条',
        descEn: 'Background rail bar element',
      },
      {
        name: 'tracks',
        selector: '.ant-slider-tracks, .ant-slider-track',
        descZh: '范围模式下多段轨道容器',
        descEn: 'Tracks container in range mode',
      },
      {
        name: 'track',
        selector: '.ant-slider-track',
        descZh: '已选中进度轨道条',
        descEn: 'Active selected track bar',
      },
      {
        name: 'handle',
        selector: '.ant-slider-handle',
        descZh: '可拖拽滑块手柄',
        descEn: 'Draggable thumb handle element',
      },
    ],
  },

  Modal: {
    component: 'Modal',
    tagName: 'a-modal',
    functional: false,
    semantics: [
      {
        name: 'mask',
        selector: '.sp-modal-mask',
        descZh: '模态框背景遮罩层',
        descEn: 'Modal backdrop mask layer',
      },
      {
        name: 'wrapper',
        selector: '.sp-modal-wrap',
        descZh: '对话框外层定位包裹容器',
        descEn: 'Outer positioning wrapper container',
      },
      {
        name: 'content',
        selector: '.sp-modal-content',
        descZh: '对话框主体内容卡片容器',
        descEn: 'Modal dialog content card container',
      },
      {
        name: 'header',
        selector: '.sp-modal-header',
        descZh: '对话框顶部标题栏',
        descEn: 'Modal header title bar',
      },
      {
        name: 'body',
        selector: '.sp-modal-body',
        descZh: '对话框中间主体内容区',
        descEn: 'Modal main body section',
      },
      {
        name: 'footer',
        selector: '.sp-modal-footer',
        descZh: '对话框底部操作按钮区',
        descEn: 'Modal bottom footer action bar',
      },
    ],
  },

  Drawer: {
    component: 'Drawer',
    tagName: 'a-drawer',
    functional: false,
    semantics: [
      {
        name: 'mask',
        selector: '.sp-drawer-mask',
        descZh: '抽屉背景遮罩层',
        descEn: 'Drawer backdrop mask overlay',
      },
      {
        name: 'wrapper',
        selector: '.sp-drawer-wrapper',
        descZh: '抽屉侧边滑出定位容器',
        descEn: 'Drawer slide-out positioning wrapper',
      },
      {
        name: 'content',
        selector: '.sp-drawer-content',
        descZh: '抽屉面板内容容器',
        descEn: 'Drawer panel content container',
      },
      {
        name: 'header',
        selector: '.sp-drawer-header',
        descZh: '抽屉顶部标题区',
        descEn: 'Drawer top header section',
      },
      {
        name: 'body',
        selector: '.sp-drawer-body',
        descZh: '抽屉主体滚动内容区',
        descEn: 'Drawer main body section',
      },
      {
        name: 'footer',
        selector: '.sp-drawer-footer',
        descZh: '抽屉底部操作栏',
        descEn: 'Drawer bottom footer section',
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
      },
      {
        name: 'indicator',
        selector: '.ant-badge-count, .ant-badge-dot',
        descZh: '徽标计数或圆点指示器',
        descEn: 'Badge count or dot indicator element',
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
      },
      {
        name: 'image',
        selector: '.ant-empty-image',
        descZh: '空状态插画图片区域',
        descEn: 'Illustration image container',
      },
      {
        name: 'description',
        selector: '.ant-empty-description',
        descZh: '空状态提示文案元素',
        descEn: 'Description text element',
      },
      {
        name: 'footer',
        selector: '.ant-empty-footer',
        descZh: '空状态底部操作区',
        descEn: 'Bottom footer action area',
      },
    ],
  },

  Descriptions: {
    component: 'Descriptions',
    tagName: 'a-descriptions',
    functional: false,
    semantics: [
      {
        name: 'root',
        selector: '.ant-descriptions',
        descZh: '描述列表根容器',
        descEn: 'Root container element of Descriptions',
      },
      {
        name: 'header',
        selector: '.ant-descriptions-header',
        descZh: '描述列表顶部标题栏',
        descEn: 'Top header bar container',
      },
      {
        name: 'title',
        selector: '.ant-descriptions-title',
        descZh: '描述列表标题元素',
        descEn: 'Descriptions title element',
      },
      {
        name: 'extra',
        selector: '.ant-descriptions-extra',
        descZh: '顶部右侧操作区域',
        descEn: 'Top-right extra action area',
      },
      {
        name: 'label',
        selector: '.ant-descriptions-item-label',
        descZh: '描述项标签单元格',
        descEn: 'Description item label cell',
      },
      {
        name: 'content',
        selector: '.ant-descriptions-item-content',
        descZh: '描述项内容单元格',
        descEn: 'Description item content cell',
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
      },
      {
        name: 'item',
        selector: '.ant-space-item',
        descZh: '单个子元素包裹项',
        descEn: 'Individual child item wrapper',
      },
      {
        name: 'separator',
        selector: '.ant-space-item-split',
        descZh: '子项之间的分隔符容器',
        descEn: 'Separator wrapper between child items',
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
      },
      {
        name: 'container',
        selector: '.ant-tooltip-inner',
        descZh: '提示气泡内层容器（兼容 body 别名）',
        descEn: 'Tooltip bubble inner container (body alias)',
      },
      {
        name: 'arrow',
        selector: '.ant-tooltip-arrow',
        descZh: '提示气泡指向箭头',
        descEn: 'Directional arrow of Tooltip',
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
      },
      {
        name: 'container',
        selector: '.ant-popover-inner',
        descZh: '气泡卡片内层容器（兼容 body 别名）',
        descEn: 'Popover card inner container (body alias)',
      },
      {
        name: 'title',
        selector: '.ant-popover-title',
        descZh: '气泡卡片标题元素',
        descEn: 'Popover title element',
      },
      {
        name: 'content',
        selector: '.ant-popover-inner-content',
        descZh: '气泡卡片正文内容区',
        descEn: 'Popover body content area',
      },
      {
        name: 'arrow',
        selector: '.ant-popover-arrow',
        descZh: '气泡卡片指向箭头',
        descEn: 'Directional arrow of Popover',
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
        descZh: '气泡确认框弹层根容器',
        descEn: 'Popconfirm overlay root container',
      },
      {
        name: 'container',
        selector: '.ant-popover-inner',
        descZh: '确认框气泡内层容器（兼容 body 别名）',
        descEn: 'Popconfirm inner container (body alias)',
      },
      {
        name: 'title',
        selector: '.ant-popconfirm-title',
        descZh: '确认提示标题元素',
        descEn: 'Confirmation title element',
      },
      {
        name: 'content',
        selector: '.ant-popconfirm-description, .ant-popconfirm-message-text',
        descZh: '确认提示描述内容元素',
        descEn: 'Confirmation description content element',
      },
      {
        name: 'arrow',
        selector: '.ant-popover-arrow',
        descZh: '确认框指向箭头',
        descEn: 'Directional arrow of Popconfirm',
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
      },
      {
        name: 'panel',
        selector: '.ant-splitter-panel',
        descZh: '单个可伸缩面板区域',
        descEn: 'Individual resizable panel container',
      },
      {
        name: 'dragger',
        selector: '.ant-splitter-bar-dragger, .ant-splitter-bar',
        descZh: '面板之间的可拖拽分割条',
        descEn: 'Draggable split bar handle between panels',
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
        descZh: '步骤条根容器',
        descEn: 'Root container element of Steps',
      },
      {
        name: 'item',
        selector: '.ant-steps-item',
        descZh: '单个步骤项容器',
        descEn: 'Individual step item container',
      },
      {
        name: 'itemIcon',
        selector: '.ant-steps-item-icon',
        descZh: '步骤序号或状态图标',
        descEn: 'Step index or status icon element',
      },
      {
        name: 'itemTitle',
        selector: '.ant-steps-item-title',
        descZh: '步骤标题元素',
        descEn: 'Step title element',
      },
      {
        name: 'itemContent',
        selector: '.ant-steps-item-description',
        descZh: '步骤详细描述内容区',
        descEn: 'Step description content element',
      },
      {
        name: 'itemRail',
        selector: '.ant-steps-item-tail, .ant-steps-item-title',
        descZh: '步骤间连接轨道线',
        descEn: 'Connector rail between steps',
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
        descZh: '进度条根容器',
        descEn: 'Root container element of Progress',
      },
      {
        name: 'rail',
        selector: '.ant-progress-inner',
        descZh: '未完成部分的底层轨道',
        descEn: 'Background rail track element',
      },
      {
        name: 'track',
        selector: '.ant-progress-bg',
        descZh: '已完成部分的进度轨道',
        descEn: 'Active progress fill track element',
      },
      {
        name: 'indicator',
        selector: '.ant-progress-text',
        descZh: '右侧百分比或状态图标指示器',
        descEn: 'Percentage or status icon indicator',
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
      },
      {
        name: 'header',
        selector: '.ant-collapse-header',
        descZh: '面板顶部触发栏',
        descEn: 'Collapsible panel header bar',
      },
      {
        name: 'icon',
        selector: '.ant-collapse-expand-icon',
        descZh: '展开/收起切换图标',
        descEn: 'Expand/collapse indicator icon',
      },
      {
        name: 'title',
        selector: '.ant-collapse-header-text',
        descZh: '面板标题文字元素',
        descEn: 'Panel header title text element',
      },
      {
        name: 'body',
        selector: '.ant-collapse-content-box, .ant-collapse-content',
        descZh: '展开后的面板内容区域',
        descEn: 'Expanded panel content body area',
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
        descZh: '加载中组件根容器',
        descEn: 'Root container element of Spin',
      },
      {
        name: 'indicator',
        selector: '.ant-spin-dot',
        descZh: '旋转加载动画指示器',
        descEn: 'Animated loading spinner indicator',
      },
      {
        name: 'description',
        selector: '.ant-spin-text',
        descZh: '加载提示文案（兼容 tip）',
        descEn: 'Loading description text (tip alias)',
      },
      {
        name: 'mask',
        selector: '.ant-spin-container',
        descZh: '包裹内容的半透明模糊层',
        descEn: 'Wrapped content blur mask container',
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
      },
      {
        name: 'item',
        selector: '.ant-segmented-item',
        descZh: '单个分段选项元素',
        descEn: 'Individual segmented option item',
      },
      {
        name: 'icon',
        selector: '.ant-segmented-item-icon',
        descZh: '分段选项前置图标',
        descEn: 'Option leading icon element',
      },
      {
        name: 'label',
        selector: '.ant-segmented-item-label',
        descZh: '分段选项标签内容容器',
        descEn: 'Option label content wrapper',
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
        descZh: '穿梭框根容器',
        descEn: 'Root container element of Transfer',
      },
      {
        name: 'section',
        selector: '.ant-transfer-list',
        descZh: '左侧源列表或右侧目标列表区块',
        descEn: 'Source or target list panel section',
      },
      {
        name: 'header',
        selector: '.ant-transfer-list-header',
        descZh: '列表顶部全选与标题栏',
        descEn: 'List panel top header bar',
      },
      {
        name: 'list',
        selector: '.ant-transfer-list-content',
        descZh: '列表选项滚动容器',
        descEn: 'Scrollable list items container',
      },
      {
        name: 'item',
        selector: '.ant-transfer-list-content-item',
        descZh: '单个可勾选数据项',
        descEn: 'Individual selectable list item',
      },
      {
        name: 'actions',
        selector: '.ant-transfer-operation',
        descZh: '中间穿梭方向操作按钮区',
        descEn: 'Center transfer direction buttons area',
      },
    ],
  },

  List: {
    component: 'List',
    tagName: 'a-list',
    functional: false,
    semantics: [
      {
        name: 'root',
        selector: '.ant-list',
        descZh: '列表根容器元素',
        descEn: 'Root container element of List',
      },
      {
        name: 'header',
        selector: '.ant-list-header',
        descZh: '列表头部区域',
        descEn: 'List header container',
      },
      {
        name: 'item',
        selector: '.ant-list-item',
        descZh: '单个列表项容器',
        descEn: 'Individual list item element',
      },
      {
        name: 'actions',
        selector: '.ant-list-item-action',
        descZh: 'List.Item 底部/右侧操作组',
        descEn: 'List.Item actions list container',
      },
      {
        name: 'extra',
        selector: '.ant-list-item-extra',
        descZh: 'List.Item 额外扩展内容区',
        descEn: 'List.Item extra content area',
      },
      {
        name: 'footer',
        selector: '.ant-list-footer',
        descZh: '列表底部区域',
        descEn: 'List footer container',
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
  return '';
}

export function hasSemanticDom(title?: string, slug?: string): boolean {
  return Boolean(resolveSemanticComponentName(title, slug));
}
