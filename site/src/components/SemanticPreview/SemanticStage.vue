<template>
  <div ref="popupHostRef" class="semantic-stage-inner" :class="`semantic-stage-${componentKey}`">
    <!-- Alert -->
    <a-alert
      v-if="component === 'Alert'"
      type="info"
      show-icon
      closable
      :title="isZhCN ? '信息提示标题' : 'Informational Notes'"
      :description="
        isZhCN
          ? '关于警告提示语义化 DOM 结构的辅助说明文案。'
          : 'Additional description and information about semantic DOM structure.'
      "
      style="width: 100%"
    >
      <template #action>
        <a-button size="small" type="text">{{ isZhCN ? '详情' : 'Detail' }}</a-button>
      </template>
    </a-alert>

    <!-- Tag -->
    <a-tag v-else-if="component === 'Tag'" color="processing" closable @close.prevent>
      <template #icon>
        <TagOutlined />
      </template>
      Ant Design Vue
    </a-tag>

    <!-- Image -->
    <div
      v-else-if="component === 'Image'"
      class="sp-image-wrap"
      :class="{ 'sp-image-force-cover': activeSemantic === 'cover' }"
    >
      <a-image
        :width="200"
        :height="136"
        :src="IMAGE_PLACEHOLDER"
        alt="Semantic Preview"
        :preview="{ mask: isZhCN ? '预览' : 'Preview' }"
      />
    </div>

    <!-- Divider -->
    <div v-else-if="component === 'Divider'" style="width: 100%">
      <p class="sp-muted-line">
        {{
          isZhCN
            ? '分割线可用于区隔不同章节的文本段落。'
            : 'A divider line separates different content sections.'
        }}
      </p>
      <a-divider>Ant Design Vue</a-divider>
      <p class="sp-muted-line">
        {{
          isZhCN
            ? '悬停右侧语义槽位即可查看对应 DOM 区域。'
            : 'Hover a semantic slot on the right to inspect its DOM region.'
        }}
      </p>
    </div>

    <!-- Listy -->
    <a-listy
      v-else-if="component === 'Listy'"
      :items="listyItems"
      row-key="key"
      :height="196"
      :item-height="36"
      :group="listyGroup"
      :item-render="renderListyItem"
      style="width: 100%"
    />

    <!-- Masonry -->
    <a-masonry
      v-else-if="component === 'Masonry'"
      :items="masonryItems"
      :columns="3"
      :gutter="10"
      style="width: 100%"
    >
      <template #item="{ item }">
        <div
          class="sp-masonry-card"
          :style="{
            height: `${item.height}px`,
            background: item.bg,
          }"
        >
          {{ item.label }}
        </div>
      </template>
    </a-masonry>

    <!-- Button -->
    <a-button v-else-if="component === 'Button'" type="primary" size="large">
      <template #icon>
        <SearchOutlined />
      </template>
      {{ isZhCN ? '搜索按钮' : 'Search' }}
    </a-button>

    <!-- Card -->
    <a-card
      v-else-if="component === 'Card'"
      size="small"
      :title="isZhCN ? '卡片标题' : 'Card Title'"
      style="width: 100%; max-width: 300px"
    >
      <template #extra>
        <a href="javascript:void(0)">{{ isZhCN ? '更多' : 'More' }}</a>
      </template>
      <template #cover>
        <img :src="CARD_COVER_SVG" alt="Card cover" style="height: 86px; object-fit: cover" />
      </template>
      <p style="margin: 0">
        {{ isZhCN ? '卡片语义化内容区域示例文本。' : 'Card semantic body content example.' }}
      </p>
      <template #actions>
        <SettingOutlined key="setting" />
        <EditOutlined key="edit" />
        <EllipsisOutlined key="ellipsis" />
      </template>
    </a-card>

    <!-- Input -->
    <a-input
      v-else-if="component === 'Input'"
      v-model:value="inputValue"
      show-count
      :maxlength="30"
      :placeholder="isZhCN ? '请输入内容' : 'Enter text'"
      style="width: 100%; max-width: 320px"
    >
      <template #prefix>
        <UserOutlined />
      </template>
      <template #suffix>
        <InfoCircleOutlined />
      </template>
    </a-input>

    <!-- Select -->
    <div v-else-if="component === 'Select'" class="sp-popup-stage">
      <a-select
        v-model:value="selectValue"
        style="width: 240px"
        :options="selectOptions"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- AutoComplete -->
    <div v-else-if="component === 'AutoComplete'" class="sp-popup-stage">
      <a-auto-complete
        v-model:value="autoValue"
        style="width: 240px"
        :options="autoOptions"
        :placeholder="isZhCN ? '输入联想内容' : 'Type to search'"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Cascader -->
    <div v-else-if="component === 'Cascader'" class="sp-popup-stage">
      <a-cascader
        v-model:value="cascaderValue"
        style="width: 240px"
        :options="cascaderOptions"
        :placeholder="isZhCN ? '请选择地区' : 'Please select'"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- TreeSelect -->
    <div v-else-if="component === 'TreeSelect'" class="sp-popup-stage">
      <a-tree-select
        v-model:value="treeSelectValue"
        style="width: 240px"
        :tree-data="treeSelectData"
        tree-default-expand-all
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Slider -->
    <div v-else-if="component === 'Slider'" style="width: 100%; max-width: 300px; padding: 12px 0">
      <a-slider v-model:value="sliderValue" range />
    </div>

    <!-- Modal (scoped inline preview to avoid locking document.body scroll) -->
    <div v-else-if="component === 'Modal'" class="sp-dialog-stage">
      <div class="sp-modal-mask" />
      <div class="sp-modal-wrap">
        <div class="sp-modal-content">
          <div class="sp-modal-header">
            <span class="sp-modal-title">{{ isZhCN ? '对话框标题' : 'Basic Modal' }}</span>
            <CloseOutlined class="sp-modal-close" />
          </div>
          <div class="sp-modal-body">
            {{
              isZhCN
                ? '自定义 Modal 语义化结构（mask / wrapper / content / header / body / footer）。'
                : 'Customize Modal semantic slots (mask / wrapper / content / header / body / footer).'
            }}
          </div>
          <div class="sp-modal-footer">
            <a-button size="small">{{ isZhCN ? '取消' : 'Cancel' }}</a-button>
            <a-button size="small" type="primary">{{ isZhCN ? '确定' : 'OK' }}</a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer (scoped inline preview to avoid locking document.body scroll) -->
    <div v-else-if="component === 'Drawer'" class="sp-dialog-stage">
      <div class="sp-drawer-mask" />
      <div class="sp-drawer-wrapper">
        <div class="sp-drawer-content">
          <div class="sp-drawer-header">
            <span class="sp-drawer-title">{{ isZhCN ? '抽屉标题' : 'Basic Drawer' }}</span>
            <CloseOutlined class="sp-drawer-close" />
          </div>
          <div class="sp-drawer-body">
            {{ isZhCN ? '抽屉主体内容区域示例。' : 'Drawer body content example.' }}
          </div>
          <div class="sp-drawer-footer">
            <a-button size="small">{{ isZhCN ? '取消' : 'Cancel' }}</a-button>
            <a-button size="small" type="primary">{{ isZhCN ? '提交' : 'Submit' }}</a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Badge -->
    <a-badge v-else-if="component === 'Badge'" :count="12">
      <a-avatar shape="square" size="large">A</a-avatar>
    </a-badge>

    <!-- Empty -->
    <a-empty
      v-else-if="component === 'Empty'"
      :description="isZhCN ? '暂无数据' : 'No Data Available'"
    >
      <a-button type="primary" size="small">{{ isZhCN ? '立即创建' : 'Create Now' }}</a-button>
    </a-empty>

    <!-- Descriptions -->
    <a-descriptions
      v-else-if="component === 'Descriptions'"
      :title="isZhCN ? '用户信息' : 'User Info'"
      bordered
      size="small"
      :column="2"
      style="width: 100%"
    >
      <template #extra>
        <a-button size="small" type="primary">{{ isZhCN ? '编辑' : 'Edit' }}</a-button>
      </template>
      <a-descriptions-item :label="isZhCN ? '组件库' : 'Library'">
        Ant Design Vue
      </a-descriptions-item>
      <a-descriptions-item :label="isZhCN ? '版本' : 'Version'">4.3.0</a-descriptions-item>
      <a-descriptions-item :label="isZhCN ? '主题' : 'Theme'">CSS Var</a-descriptions-item>
      <a-descriptions-item :label="isZhCN ? '状态' : 'Status'">Active</a-descriptions-item>
    </a-descriptions>

    <!-- Space -->
    <a-space v-else-if="component === 'Space'" size="middle">
      <template #split>
        <a-divider type="vertical" />
      </template>
      <a-button type="primary">{{ isZhCN ? '主按钮' : 'Primary' }}</a-button>
      <a-button>{{ isZhCN ? '默认按钮' : 'Default' }}</a-button>
      <a-button type="dashed">{{ isZhCN ? '虚线按钮' : 'Dashed' }}</a-button>
    </a-space>

    <!-- Tooltip -->
    <div v-else-if="component === 'Tooltip'" class="sp-overlay-stage">
      <a-tooltip
        :title="isZhCN ? '语义化文字提示内容' : 'Semantic Tooltip Prompt'"
        :open="true"
        placement="bottom"
        :auto-adjust-overflow="false"
        :get-popup-container="getPopupContainer"
      >
        <a-button>{{ isZhCN ? '提示触发元素' : 'Tooltip Trigger' }}</a-button>
      </a-tooltip>
    </div>

    <!-- Popover -->
    <div v-else-if="component === 'Popover'" class="sp-overlay-stage sp-overlay-stage-lg">
      <a-popover
        :title="isZhCN ? '气泡标题' : 'Popover Title'"
        :content="isZhCN ? '气泡卡片语义化内容区。' : 'Popover semantic body content.'"
        :open="true"
        placement="bottom"
        :auto-adjust-overflow="false"
        :get-popup-container="getPopupContainer"
      >
        <a-button type="primary">{{ isZhCN ? '气泡触发器' : 'Popover Trigger' }}</a-button>
      </a-popover>
    </div>

    <!-- Popconfirm -->
    <div v-else-if="component === 'Popconfirm'" class="sp-overlay-stage sp-overlay-stage-lg">
      <a-popconfirm
        :title="isZhCN ? '确认删除该条目？' : 'Delete this task?'"
        :description="isZhCN ? '删除后将无法恢复。' : 'This action cannot be undone.'"
        :ok-text="isZhCN ? '确定' : 'Yes'"
        :cancel-text="isZhCN ? '取消' : 'No'"
        :open="true"
        placement="bottom"
        :auto-adjust-overflow="false"
        :get-popup-container="getPopupContainer"
      >
        <a-button danger>{{ isZhCN ? '删除操作' : 'Delete' }}</a-button>
      </a-popconfirm>
    </div>

    <!-- Splitter -->
    <a-splitter v-else-if="component === 'Splitter'" class="sp-splitter-box">
      <a-splitter-panel default-size="45%">
        <div class="sp-splitter-pane">{{ isZhCN ? '面板一' : 'First Panel' }}</div>
      </a-splitter-panel>
      <a-splitter-panel>
        <div class="sp-splitter-pane">{{ isZhCN ? '面板二' : 'Second Panel' }}</div>
      </a-splitter-panel>
    </a-splitter>

    <!-- Steps -->
    <a-steps
      v-else-if="component === 'Steps'"
      :current="1"
      size="small"
      :items="stepsItems"
      style="width: 100%"
    />

    <!-- Progress -->
    <a-progress
      v-else-if="component === 'Progress'"
      :percent="68"
      style="width: 100%; max-width: 320px"
    />

    <!-- Collapse -->
    <a-collapse
      v-else-if="component === 'Collapse'"
      v-model:active-key="collapseActiveKey"
      style="width: 100%"
    >
      <a-collapse-panel key="1" :header="isZhCN ? '折叠面板标题 1' : 'Collapse Panel Header 1'">
        <p style="margin: 0">
          {{
            isZhCN
              ? '折叠面板展开后的正文内容区域。'
              : 'Expanded content area inside Collapse panel.'
          }}
        </p>
      </a-collapse-panel>
      <a-collapse-panel key="2" :header="isZhCN ? '折叠面板标题 2' : 'Collapse Panel Header 2'">
        <p style="margin: 0">{{ isZhCN ? '第二项面板内容。' : 'Second panel content.' }}</p>
      </a-collapse-panel>
    </a-collapse>

    <!-- Spin -->
    <a-spin
      v-else-if="component === 'Spin'"
      :spinning="true"
      :tip="isZhCN ? '加载中...' : 'Loading...'"
      style="width: 100%"
    >
      <div class="sp-spin-box">
        {{
          isZhCN
            ? 'Spin 包裹的内容容器示例，用于演示 mask 与 indicator 语义位。'
            : 'Wrapped content container inside Spin to preview mask and indicator slots.'
        }}
      </div>
    </a-spin>

    <!-- Segmented -->
    <a-segmented
      v-else-if="component === 'Segmented'"
      v-model:value="segmentedValue"
      :options="segmentedOptions"
    />

    <!-- Transfer -->
    <a-transfer
      v-else-if="component === 'Transfer'"
      v-model:target-keys="transferTargetKeys"
      :data-source="transferData"
      :render="item => item.title"
      :titles="isZhCN ? ['源列表', '目标列表'] : ['Source', 'Target']"
      :list-style="{ width: '146px', height: '188px' }"
    />

    <!-- List -->
    <a-list
      v-else-if="component === 'List'"
      bordered
      size="small"
      :data-source="listData"
      style="width: 100%"
    >
      <template #header>
        <strong>{{ isZhCN ? '列表头部' : 'List Header' }}</strong>
      </template>
      <template #footer>
        <span>{{ isZhCN ? '列表底部' : 'List Footer' }}</span>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a href="javascript:void(0)">{{ isZhCN ? '编辑' : 'Edit' }}</a>
            <a href="javascript:void(0)">{{ isZhCN ? '更多' : 'More' }}</a>
          </template>
          <template #extra>
            <a-tag color="blue">v4.3</a-tag>
          </template>
          {{ item }}
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, h, ref } from 'vue';
import {
  AppstoreOutlined,
  BarsOutlined,
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';

const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="240" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1677ff"/>
          <stop offset="55%" stop-color="#69b1ff"/>
          <stop offset="100%" stop-color="#91caff"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" rx="8" fill="url(#bg)"/>
      <circle cx="182" cy="48" r="18" fill="#ffffff" fill-opacity="0.85"/>
      <path d="M0 132 L68 78 L124 118 L168 88 L240 136 L240 160 L0 160 Z" fill="#ffffff" fill-opacity="0.32"/>
      <path d="M0 144 L92 102 L156 134 L204 112 L240 140 L240 160 L0 160 Z" fill="#ffffff" fill-opacity="0.5"/>
    </svg>`,
  );

const CARD_COVER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96" fill="none">
      <defs>
        <linearGradient id="c" x1="0" y1="0" x2="320" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1677ff"/>
          <stop offset="100%" stop-color="#722ed1"/>
        </linearGradient>
      </defs>
      <rect width="320" height="96" fill="url(#c)"/>
      <circle cx="272" cy="26" r="32" fill="#ffffff" fill-opacity="0.16"/>
      <circle cx="56" cy="76" r="40" fill="#ffffff" fill-opacity="0.12"/>
    </svg>`,
  );

export default defineComponent({
  name: 'SemanticStage',
  components: {
    CloseOutlined,
    EditOutlined,
    EllipsisOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    SettingOutlined,
    TagOutlined,
    UserOutlined,
  },
  props: {
    component: {
      type: String,
      required: true,
    },
    activeSemantic: {
      type: String,
      default: '',
    },
    isZhCN: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const popupHostRef = ref<HTMLElement | null>(null);
    const inputValue = ref('Ant Design Vue');
    const selectValue = ref('vue');
    const autoValue = ref('Ant Design');
    const cascaderValue = ref(['zhejiang', 'hangzhou']);
    const treeSelectValue = ref('leaf1');
    const sliderValue = ref<[number, number]>([25, 75]);
    const collapseActiveKey = ref<string[]>(['1']);
    const segmentedValue = ref('list');
    const transferTargetKeys = ref<string[]>(['2']);

    const componentKey = computed(() =>
      props.component.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
    );

    const isPopupSlotActive = computed(() => props.activeSemantic === 'popup.root');

    const getPopupContainer = (trigger?: HTMLElement) =>
      popupHostRef.value ||
      (trigger?.closest?.('.semantic-stage-inner') as HTMLElement | null) ||
      trigger?.parentElement ||
      document.body;

    const listyItems = [
      { key: '1', group: 'Core', label: 'Virtual List Item 1' },
      { key: '2', group: 'Core', label: 'Virtual List Item 2' },
      { key: '3', group: 'Extra', label: 'Virtual List Item 3' },
      { key: '4', group: 'Extra', label: 'Virtual List Item 4' },
      { key: '5', group: 'Extra', label: 'Virtual List Item 5' },
      { key: '6', group: 'Extra', label: 'Virtual List Item 6' },
      { key: '7', group: 'Extra', label: 'Virtual List Item 7' },
    ];

    const listyGroup = {
      key: 'group',
      title: (groupKey: string) => groupKey,
    };

    const renderListyItem = (item: any) => h('span', item.label);

    const masonryItems = [
      { key: '1', height: 64, label: 'Card 1', bg: 'rgba(22, 119, 255, 0.14)' },
      { key: '2', height: 92, label: 'Card 2', bg: 'rgba(114, 46, 209, 0.14)' },
      { key: '3', height: 72, label: 'Card 3', bg: 'rgba(19, 194, 194, 0.14)' },
      { key: '4', height: 84, label: 'Card 4', bg: 'rgba(82, 196, 26, 0.14)' },
      { key: '5', height: 62, label: 'Card 5', bg: 'rgba(250, 173, 20, 0.14)' },
      { key: '6', height: 76, label: 'Card 6', bg: 'rgba(235, 47, 150, 0.14)' },
    ];

    const selectOptions = [
      { value: 'vue', label: 'Ant Design Vue' },
      { value: 'cssvar', label: 'CSS Variables' },
      { value: 'semantic', label: 'Semantic DOM' },
    ];

    const autoOptions = [
      { value: 'Ant Design Vue 4.3' },
      { value: 'Ant Design Semantic DOM' },
      { value: 'Ant Design Tokens' },
    ];

    const cascaderOptions = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          { value: 'hangzhou', label: 'Hangzhou' },
          { value: 'ningbo', label: 'Ningbo' },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{ value: 'nanjing', label: 'Nanjing' }],
      },
    ];

    const treeSelectData = [
      {
        title: 'Ant Design Vue',
        value: 'root',
        children: [
          { title: 'Semantic DOM', value: 'leaf1' },
          { title: 'Design Token', value: 'leaf2' },
        ],
      },
    ];

    const stepsItems = computed(() => [
      {
        title: props.isZhCN ? '已完成' : 'Finished',
        description: props.isZhCN ? '步骤说明' : 'Description',
      },
      {
        title: props.isZhCN ? '进行中' : 'In Progress',
        description: props.isZhCN ? '步骤说明' : 'Description',
      },
      {
        title: props.isZhCN ? '待处理' : 'Waiting',
        description: props.isZhCN ? '步骤说明' : 'Description',
      },
    ]);

    const segmentedOptions = computed(() => [
      {
        value: 'list',
        label: props.isZhCN ? '列表' : 'List',
        icon: h(BarsOutlined),
      },
      {
        value: 'kanban',
        label: props.isZhCN ? '看板' : 'Kanban',
        icon: h(AppstoreOutlined),
      },
    ]);

    const transferData = [
      { key: '1', title: 'Item 1' },
      { key: '2', title: 'Item 2' },
      { key: '3', title: 'Item 3' },
      { key: '4', title: 'Item 4' },
    ];

    const listData = computed(() =>
      props.isZhCN
        ? ['语义化列表项示例一', '语义化列表项示例二']
        : ['Semantic list item example 1', 'Semantic list item example 2'],
    );

    return {
      popupHostRef,
      componentKey,
      isPopupSlotActive,
      getPopupContainer,
      IMAGE_PLACEHOLDER,
      CARD_COVER_SVG,
      inputValue,
      selectValue,
      autoValue,
      cascaderValue,
      treeSelectValue,
      sliderValue,
      collapseActiveKey,
      segmentedValue,
      transferTargetKeys,
      listyItems,
      listyGroup,
      renderListyItem,
      masonryItems,
      selectOptions,
      autoOptions,
      cascaderOptions,
      treeSelectData,
      stepsItems,
      segmentedOptions,
      transferData,
      listData,
    };
  },
});
</script>

<style lang="less" scoped>
.semantic-stage-inner {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-muted-line {
  margin: 4px 0;
  font-size: 13px;
  color: var(--site-text-color-secondary);
}

.sp-image-wrap {
  display: inline-flex;

  &.sp-image-force-cover :deep(.ant-image-mask),
  &.sp-image-force-cover :deep(.ant-image-cover) {
    opacity: 1 !important;
  }
}

.sp-masonry-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--site-border-color-split);
  color: var(--site-text-color);
  font-size: 13px;
  font-weight: 500;
}

.sp-popup-stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 210px;
  padding-top: 8px;
}

.sp-overlay-stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 112px;
  padding-top: 8px;

  &.sp-overlay-stage-lg {
    min-height: 168px;
  }
}

.sp-dialog-stage {
  position: relative;
  width: 100%;
  height: 248px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--site-border-color-split);
  background: var(--component-background);
}

.sp-modal-mask,
.sp-drawer-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.sp-modal-wrap {
  position: absolute;
  inset: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-modal-content {
  width: 100%;
  max-width: 316px;
  border-radius: 8px;
  background: var(--color-bg-elevated, var(--component-background));
  border: 1px solid var(--site-border-color-split);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.sp-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--site-border-color-split);
}

.sp-modal-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--site-text-color);
}

.sp-modal-close,
.sp-drawer-close {
  font-size: 12px;
  color: var(--site-text-color-secondary);
}

.sp-modal-body {
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--site-text-color-secondary);
}

.sp-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--site-border-color-split);
}

.sp-drawer-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-end: 0;
  width: 240px;
  max-width: 82%;
}

.sp-drawer-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--color-bg-elevated, var(--component-background));
  border-inline-start: 1px solid var(--site-border-color-split);
  box-shadow: -6px 0 16px rgba(0, 0, 0, 0.14);
}

.sp-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--site-border-color-split);
}

.sp-drawer-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--site-text-color);
}

.sp-drawer-body {
  flex: 1;
  padding: 14px 16px;
  font-size: 13px;
  color: var(--site-text-color-secondary);
}

.sp-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--site-border-color-split);
}

.sp-splitter-box {
  width: 100%;
  height: 156px;
  border: 1px solid var(--site-border-color-split);
  border-radius: 6px;
  background: var(--component-background);
}

.sp-splitter-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--site-text-color-secondary);
}

.sp-spin-box {
  padding: 28px 20px;
  border-radius: 6px;
  border: 1px dashed var(--site-border-color-split);
  background: var(--color-fill-alter, rgba(0, 0, 0, 0.02));
  color: var(--site-text-color-secondary);
  font-size: 13px;
  text-align: center;
}
</style>
