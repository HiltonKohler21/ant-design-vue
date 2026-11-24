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

    <!-- Anchor -->
    <a-anchor
      v-else-if="component === 'Anchor'"
      :affix="false"
      :items="anchorItems"
      :get-current-anchor="getAnchorCurrent"
      class="sp-anchor-box"
    />

    <!-- AutoComplete -->
    <div v-else-if="component === 'AutoComplete'" class="sp-popup-stage">
      <a-auto-complete
        v-model:value="autoValue"
        style="width: 240px; max-width: 100%"
        :options="autoOptions"
        :placeholder="isZhCN ? '输入联想内容' : 'Type to search'"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Badge -->
    <a-badge v-else-if="component === 'Badge'" :count="12">
      <a-avatar shape="square" size="large">A</a-avatar>
    </a-badge>

    <!-- Breadcrumb -->
    <a-breadcrumb v-else-if="component === 'Breadcrumb'">
      <a-breadcrumb-item>
        <a href="javascript:void(0)">
          <HomeOutlined />
        </a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <a href="javascript:void(0)">
          <UserOutlined />
          <span style="margin-inline-start: 4px">
            {{ isZhCN ? '应用列表' : 'Application List' }}
          </span>
        </a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ isZhCN ? '应用详情' : 'Application' }}</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- Button -->
    <a-button v-else-if="component === 'Button'" type="primary" size="large">
      <template #icon>
        <SearchOutlined />
      </template>
      {{ isZhCN ? '搜索按钮' : 'Search' }}
    </a-button>

    <!-- Calendar -->
    <div v-else-if="component === 'Calendar'" class="sp-calendar-stage">
      <a-calendar :fullscreen="false" />
    </div>

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

    <!-- Cascader -->
    <div v-else-if="component === 'Cascader'" class="sp-popup-stage">
      <a-cascader
        v-model:value="cascaderValue"
        style="width: 240px; max-width: 100%"
        :options="cascaderOptions"
        :placeholder="isZhCN ? '请选择地区' : 'Please select'"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Checkbox -->
    <a-checkbox v-else-if="component === 'Checkbox'" v-model:checked="checkboxChecked">
      {{ isZhCN ? '复选框选项' : 'Checkbox' }}
    </a-checkbox>

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

    <!-- ColorPicker (inline trigger + PurePanel, zero floating portal) -->
    <div v-else-if="component === 'ColorPicker'" class="sp-inline-picker-stage">
      <a-color-picker :open="false" default-value="#1677ff" show-text />
      <ColorPickerPurePanel default-value="#1677ff" class="sp-color-pure-panel" />
    </div>

    <!-- DatePicker (inline input + PurePanel, zero floating portal) -->
    <div v-else-if="component === 'DatePicker'" class="sp-inline-picker-stage">
      <a-date-picker
        :open="false"
        :placeholder="isZhCN ? '请选择日期' : 'Select date'"
        style="width: 240px; max-width: 100%"
      >
        <template #prefix>
          <SmileOutlined />
        </template>
      </a-date-picker>
      <DatePickerPurePanel :show-today="true" />
    </div>

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

    <!-- Drawer (scoped inline preview with real Drawer PurePanel) -->
    <div v-else-if="component === 'Drawer'" class="sp-dialog-stage">
      <div class="sp-drawer-mask" />
      <div class="sp-drawer-wrapper">
        <div class="sp-drawer-dragger" aria-hidden="true" />
        <DrawerPurePanel
          placement="right"
          :title="isZhCN ? '抽屉标题' : 'Basic Drawer'"
          class="sp-drawer-pure"
        >
          <template #extra>
            <a-button size="small">{{ isZhCN ? '取消' : 'Cancel' }}</a-button>
          </template>
          <p style="margin: 0">
            {{ isZhCN ? '抽屉主体内容区域示例。' : 'Drawer body content example.' }}
          </p>
          <template #footer>
            <a-space size="small">
              <a-button size="small">{{ isZhCN ? '取消' : 'Cancel' }}</a-button>
              <a-button size="small" type="primary">{{ isZhCN ? '提交' : 'Submit' }}</a-button>
            </a-space>
          </template>
        </DrawerPurePanel>
      </div>
    </div>

    <!-- Dropdown (inline PurePanel, zero floating portal) -->
    <DropdownPurePanel
      v-else-if="component === 'Dropdown'"
      :menu="dropdownMenu"
      style="width: 220px; max-width: 100%"
    />

    <!-- Empty -->
    <a-empty
      v-else-if="component === 'Empty'"
      :description="isZhCN ? '暂无数据' : 'No Data Available'"
    >
      <a-button type="primary" size="small">{{ isZhCN ? '立即创建' : 'Create Now' }}</a-button>
    </a-empty>

    <!-- FloatButton (inline PurePanel, zero fixed positioning) -->
    <FloatButtonPurePanel
      v-else-if="component === 'FloatButton'"
      type="primary"
      shape="square"
      :description="isZhCN ? '帮助' : 'HELP'"
    >
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </FloatButtonPurePanel>

    <!-- Form -->
    <a-form
      v-else-if="component === 'Form'"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
      style="width: 100%; max-width: 340px"
    >
      <a-form-item
        :label="isZhCN ? '用户名' : 'Username'"
        required
        validate-status="error"
        :help="isZhCN ? '请输入 4 到 16 位字符。' : 'Use 4 to 16 characters.'"
      >
        <a-input
          :value="isZhCN ? 'antdv' : 'antdv'"
          :placeholder="isZhCN ? '请输入用户名' : 'Username'"
        />
      </a-form-item>
      <a-form-item
        :label="isZhCN ? '密码' : 'Password'"
        :extra="isZhCN ? '需包含字母与数字。' : 'Must contain letters and numbers.'"
        style="margin-bottom: 0"
      >
        <a-input-password :placeholder="isZhCN ? '请输入密码' : 'Password'" />
      </a-form-item>
    </a-form>

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

    <!-- InputNumber (inline PurePanel with handleVisible: true) -->
    <InputNumberPurePanel
      v-else-if="component === 'InputNumber'"
      v-model:value="inputNumberValue"
      allow-clear
      prefix="￥"
      suffix="RMB"
      style="width: 220px; max-width: 100%"
    />

    <!-- Layout -->
    <a-layout v-else-if="component === 'Layout'" class="sp-layout-stage">
      <a-layout-sider :width="136" class="sp-layout-sider">
        <div class="sp-layout-sider-text">Sider</div>
      </a-layout-sider>
      <a-layout-content class="sp-layout-content">
        {{ isZhCN ? '主内容区域' : 'Content' }}
      </a-layout-content>
    </a-layout>

    <!-- List -->
    <a-list
      v-else-if="component === 'List'"
      bordered
      size="small"
      item-layout="vertical"
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

    <!-- Mentions (inline PurePanel, zero floating portal) -->
    <MentionsPurePanel
      v-else-if="component === 'Mentions'"
      v-model:value="mentionsValue"
      allow-clear
      :options="mentionsOptions"
      style="width: 240px; max-width: 100%"
    />

    <!-- Menu -->
    <a-menu
      v-else-if="component === 'Menu'"
      mode="inline"
      :selected-keys="['mail']"
      :open-keys="['SubMenu']"
      :items="menuItems"
      class="sp-menu-stage"
    />

    <!-- Message (inline PurePanel list, zero floating portal) -->
    <div v-else-if="component === 'Message'" class="sp-message-list">
      <div class="sp-message-list-content">
        <MessagePurePanel
          type="success"
          :content="isZhCN ? '这是一条成功提示！' : 'Hello, Ant Design Vue!'"
        />
        <MessagePurePanel
          type="info"
          :content="isZhCN ? '欢迎体验语义化 DOM 预览。' : 'Welcome back!'"
        />
      </div>
    </div>

    <!-- Modal (scoped inline preview with real Modal PurePanel) -->
    <div v-else-if="component === 'Modal'" class="sp-dialog-stage">
      <div class="sp-modal-mask" />
      <div class="sp-modal-wrap">
        <ModalPurePanel
          :title="isZhCN ? '对话框标题' : 'Basic Modal'"
          :ok-text="isZhCN ? '确定' : 'OK'"
          :cancel-text="isZhCN ? '取消' : 'Cancel'"
          width="100%"
          class="sp-modal-pure"
        >
          <p style="margin: 0">
            {{
              isZhCN
                ? '自定义 Modal 语义化结构（root / mask / wrapper / container / header / title / body / footer / close）。'
                : 'Customize Modal semantic slots (root / mask / wrapper / container / header / title / body / footer / close).'
            }}
          </p>
        </ModalPurePanel>
      </div>
    </div>

    <!-- Notification (inline PurePanel list, zero floating portal) -->
    <div v-else-if="component === 'Notification'" class="sp-notification-list">
      <div class="sp-notification-list-content">
        <NotificationPurePanel
          type="success"
          :title="isZhCN ? '通知标题' : 'Hello World!'"
          :description="
            isZhCN ? '这是一条带操作按钮的通知内容。' : 'Notification content with actions.'
          "
          class="sp-notification-pure"
        >
          <template #actions>
            <a-button type="primary" size="small">
              {{ isZhCN ? '确认' : 'Confirm' }}
            </a-button>
          </template>
        </NotificationPurePanel>
        <div class="sp-notification-progress-wrap">
          <NotificationPurePanel
            type="info"
            :title="isZhCN ? '进度通知' : 'Welcome back!'"
            :description="
              isZhCN
                ? '带自动关闭进度条的通知提醒框。'
                : 'This is another notification with progress.'
            "
            class="sp-notification-pure"
          />
          <progress
            class="ant-notification-notice-progress sp-notification-progress"
            max="100"
            value="68"
          >
            68%
          </progress>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <a-pagination v-else-if="component === 'Pagination'" :current="1" :total="50" size="small" />

    <!-- Popconfirm (inline PurePanel, zero floating portal) -->
    <PopconfirmPurePanel
      v-else-if="component === 'Popconfirm'"
      placement="top"
      :title="isZhCN ? '确认删除该条目？' : 'Delete this task?'"
      :description="isZhCN ? '删除后将无法恢复。' : 'This action cannot be undone.'"
      :ok-text="isZhCN ? '确定' : 'Yes'"
      :cancel-text="isZhCN ? '取消' : 'No'"
    />

    <!-- Popover (inline PurePanel, zero floating portal) -->
    <PopoverPurePanel
      v-else-if="component === 'Popover'"
      placement="top"
      :title="isZhCN ? '气泡标题' : 'Popover Title'"
      :content="isZhCN ? '气泡卡片语义化内容区。' : 'Popover semantic body content.'"
    />

    <!-- Progress -->
    <a-progress
      v-else-if="component === 'Progress'"
      :percent="68"
      style="width: 100%; max-width: 320px"
    />

    <!-- QRCode -->
    <a-qrcode v-else-if="component === 'QRCode'" value="https://www.antdv.com" status="loading" />

    <!-- Radio -->
    <a-radio v-else-if="component === 'Radio'" v-model:checked="radioChecked">
      {{ isZhCN ? '单选框选项' : 'Radio' }}
    </a-radio>

    <!-- Result -->
    <a-result
      v-else-if="component === 'Result'"
      status="info"
      :title="isZhCN ? '操作结果标题' : 'Result Title'"
      :sub-title="
        isZhCN ? '关于结果页语义化 DOM 的辅助说明。' : 'Semantic result subtitle example.'
      "
      class="sp-result-compact"
    >
      <template #extra>
        <a-button type="primary" size="small">{{ isZhCN ? '返回首页' : 'Back Home' }}</a-button>
      </template>
      <div class="sp-result-body">
        {{ isZhCN ? '结果页自定义正文内容区域。' : 'The Content of Result' }}
      </div>
    </a-result>

    <!-- Segmented -->
    <a-segmented
      v-else-if="component === 'Segmented'"
      v-model:value="segmentedValue"
      :options="segmentedOptions"
    />

    <!-- Select -->
    <div v-else-if="component === 'Select'" class="sp-popup-stage">
      <a-select
        v-model:value="selectValue"
        style="width: 240px; max-width: 100%"
        :options="selectOptions"
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Skeleton -->
    <a-skeleton
      v-else-if="component === 'Skeleton'"
      avatar
      :paragraph="{ rows: 3 }"
      style="width: 100%"
    />

    <!-- Slider -->
    <div v-else-if="component === 'Slider'" style="width: 100%; max-width: 300px; padding: 12px 0">
      <a-slider v-model:value="sliderValue" range />
    </div>

    <!-- Space -->
    <a-space v-else-if="component === 'Space'" size="middle">
      <template #split>
        <a-divider type="vertical" />
      </template>
      <a-button type="primary">{{ isZhCN ? '主按钮' : 'Primary' }}</a-button>
      <a-button>{{ isZhCN ? '默认按钮' : 'Default' }}</a-button>
      <a-button type="dashed">{{ isZhCN ? '虚线按钮' : 'Dashed' }}</a-button>
    </a-space>

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
            ? 'Spin 包裹的内容容器示例，用于演示 section / indicator / container 语义位。'
            : 'Wrapped content container inside Spin to preview section, indicator and container slots.'
        }}
      </div>
    </a-spin>

    <!-- Splitter -->
    <a-splitter v-else-if="component === 'Splitter'" class="sp-splitter-box">
      <a-splitter-panel default-size="45%">
        <div class="sp-splitter-pane">{{ isZhCN ? '面板一' : 'First Panel' }}</div>
      </a-splitter-panel>
      <a-splitter-panel>
        <div class="sp-splitter-pane">{{ isZhCN ? '面板二' : 'Second Panel' }}</div>
      </a-splitter-panel>
    </a-splitter>

    <!-- Statistic -->
    <a-statistic
      v-else-if="component === 'Statistic'"
      :title="isZhCN ? '活跃增长' : 'Active'"
      :value="11.28"
      :precision="2"
      suffix="%"
    >
      <template #prefix>
        <ArrowUpOutlined />
      </template>
    </a-statistic>

    <!-- Steps -->
    <a-steps
      v-else-if="component === 'Steps'"
      :current="1"
      size="small"
      :items="stepsItems"
      style="width: 100%"
    />

    <!-- Switch -->
    <a-switch
      v-else-if="component === 'Switch'"
      v-model:checked="switchChecked"
      checked-children="ON"
      un-checked-children="OFF"
    />

    <!-- Table -->
    <a-table
      v-else-if="component === 'Table'"
      bordered
      size="small"
      :columns="tableColumns"
      :data-source="tableData"
      :pagination="tablePagination"
      style="width: 100%"
    >
      <template #title>
        <span>{{ isZhCN ? '表格标题' : 'Table Title' }}</span>
      </template>
      <template #footer>
        <span>{{ isZhCN ? '表格底部' : 'Table Footer' }}</span>
      </template>
    </a-table>

    <!-- Tabs -->
    <a-tabs
      v-else-if="component === 'Tabs'"
      v-model:active-key="tabsActiveKey"
      type="editable-card"
      hide-add
      :styles="tabsPreviewStyles"
      style="width: 100%"
    >
      <a-tab-pane v-for="pane in tabsPanes" :key="pane.key" :tab="pane.tab">
        <div class="sp-tabs-pane-body">{{ pane.content }}</div>
      </a-tab-pane>
    </a-tabs>

    <!-- Tag -->
    <a-tag v-else-if="component === 'Tag'" color="processing" closable @close.prevent>
      <template #icon>
        <TagOutlined />
      </template>
      Ant Design Vue
    </a-tag>

    <!-- TimePicker (inline input + PurePanel, zero floating portal) -->
    <div v-else-if="component === 'TimePicker'" class="sp-inline-picker-stage">
      <a-time-picker
        :open="false"
        :placeholder="isZhCN ? '请选择时间' : 'Select time'"
        style="width: 240px; max-width: 100%"
      >
        <template #prefix>
          <SmileOutlined />
        </template>
      </a-time-picker>
      <TimePickerPurePanel :show-now="true" />
    </div>

    <!-- Timeline -->
    <a-timeline
      v-else-if="component === 'Timeline'"
      :items="timelineItems"
      style="width: 100%; max-width: 340px"
    />

    <!-- Tooltip (inline PurePanel, zero floating portal) -->
    <TooltipPurePanel
      v-else-if="component === 'Tooltip'"
      placement="top"
      :title="isZhCN ? '语义化文字提示内容' : 'Semantic Tooltip Prompt'"
    />

    <!-- Tour (scoped inline preview with real Tour PurePanel) -->
    <div v-else-if="component === 'Tour'" class="sp-tour-stage">
      <div class="sp-tour-mask" />
      <TourPurePanel
        :title="isZhCN ? '漫游式引导标题' : 'Upload File'"
        :description="
          isZhCN ? '点击此处可快速上传本地文件。' : 'Put your files here to get started.'
        "
        :cover="tourCoverNode"
        :current="1"
        :total="3"
        placement="top"
        class="sp-tour-pure"
      />
    </div>

    <!-- Transfer -->
    <a-transfer
      v-else-if="component === 'Transfer'"
      v-model:target-keys="transferTargetKeys"
      :data-source="transferData"
      :render="item => item.title"
      :titles="isZhCN ? ['源列表', '目标列表'] : ['Source', 'Target']"
      :list-style="{ width: '140px', height: '196px' }"
    >
      <template #footer>
        <div class="sp-transfer-footer">{{ isZhCN ? '自定义页脚' : 'Footer' }}</div>
      </template>
    </a-transfer>

    <!-- Tree -->
    <a-tree
      v-else-if="component === 'Tree'"
      show-icon
      default-expand-all
      :default-selected-keys="['0-0-0']"
      :tree-data="treeData"
      class="sp-tree-stage"
    />

    <!-- TreeSelect -->
    <div v-else-if="component === 'TreeSelect'" class="sp-popup-stage">
      <a-tree-select
        v-model:value="treeSelectValue"
        style="width: 240px; max-width: 100%"
        :tree-data="treeSelectData"
        tree-default-expand-all
        :open="isPopupSlotActive"
        :get-popup-container="getPopupContainer"
      />
    </div>

    <!-- Typography -->
    <div v-else-if="component === 'Typography'" class="sp-typography-stage">
      <a-typography-paragraph
        v-model:content="typoContent"
        copyable
        :editable="{ editing: activeSemantic === 'textarea' }"
        :ellipsis="{ rows: 2, expandable: true }"
        style="margin-bottom: 0"
      />
    </div>

    <!-- Upload (local mock list, zero external network requests) -->
    <a-upload
      v-else-if="component === 'Upload'"
      :file-list="uploadFileList"
      :before-upload="preventUpload"
      style="width: 100%; max-width: 300px"
    >
      <a-button>
        <UploadOutlined />
        <span>{{ isZhCN ? '点击上传' : 'Upload' }}</span>
      </a-button>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, h, ref } from 'vue';
import {
  ColorPicker,
  DatePicker,
  Drawer,
  Dropdown,
  FloatButton,
  InputNumber,
  Mentions,
  Modal,
  Popconfirm,
  Popover,
  TimePicker,
  Tooltip,
  Tour,
  message,
  notification,
} from 'ant-design-vue';
import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MehOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  SmileOutlined,
  TagOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';

const DropdownPurePanel = (Dropdown as any)._InternalPanelDoNotUseOrYouWillBeFired;
const MessagePurePanel = (message as any)._InternalPanelDoNotUseOrYouWillBeFired;
const NotificationPurePanel = (notification as any)._InternalPanelDoNotUseOrYouWillBeFired;
const TourPurePanel = (Tour as any)._InternalPanelDoNotUseOrYouWillBeFired;
const FloatButtonPurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired;
const DatePickerPurePanel = (DatePicker as any)._InternalPanelDoNotUseOrYouWillBeFired;
const TimePickerPurePanel = (TimePicker as any)._InternalPanelDoNotUseOrYouWillBeFired;
const ColorPickerPurePanel = (ColorPicker as any)._InternalPanelDoNotUseOrYouWillBeFired;
const InputNumberPurePanel = (InputNumber as any)._InternalPanelDoNotUseOrYouWillBeFired;
const MentionsPurePanel = (Mentions as any)._InternalPanelDoNotUseOrYouWillBeFired;
const ModalPurePanel = (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired;
const DrawerPurePanel = (Drawer as any)._InternalPanelDoNotUseOrYouWillBeFired;
const TooltipPurePanel = (Tooltip as any)._InternalPanelDoNotUseOrYouWillBeFired;
const PopoverPurePanel = (Popover as any)._InternalPanelDoNotUseOrYouWillBeFired;
const PopconfirmPurePanel = (Popconfirm as any)._InternalPanelDoNotUseOrYouWillBeFired;

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

const TOUR_COVER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 88" fill="none">
      <defs>
        <linearGradient id="t" x1="0" y1="0" x2="280" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1677ff"/>
          <stop offset="100%" stop-color="#13c2c2"/>
        </linearGradient>
      </defs>
      <rect width="280" height="88" rx="6" fill="url(#t)"/>
      <rect x="24" y="22" width="96" height="14" rx="4" fill="#ffffff" fill-opacity="0.85"/>
      <rect x="24" y="44" width="152" height="10" rx="3" fill="#ffffff" fill-opacity="0.45"/>
      <circle cx="232" cy="44" r="22" fill="#ffffff" fill-opacity="0.22"/>
    </svg>`,
  );

export default defineComponent({
  name: 'SemanticStage',
  components: {
    ArrowUpOutlined,
    ColorPickerPurePanel,
    DatePickerPurePanel,
    DrawerPurePanel,
    DropdownPurePanel,
    EditOutlined,
    EllipsisOutlined,
    FloatButtonPurePanel,
    HomeOutlined,
    InfoCircleOutlined,
    InputNumberPurePanel,
    MentionsPurePanel,
    MessagePurePanel,
    ModalPurePanel,
    NotificationPurePanel,
    PopconfirmPurePanel,
    PopoverPurePanel,
    QuestionCircleOutlined,
    SearchOutlined,
    SettingOutlined,
    SmileOutlined,
    TagOutlined,
    TimePickerPurePanel,
    TooltipPurePanel,
    TourPurePanel,
    UploadOutlined,
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
    const inputNumberValue = ref(100);
    const mentionsValue = ref('Hi, @');
    const selectValue = ref('vue');
    const autoValue = ref('Ant Design');
    const cascaderValue = ref(['zhejiang', 'hangzhou']);
    const treeSelectValue = ref('leaf1');
    const sliderValue = ref<[number, number]>([25, 75]);
    const collapseActiveKey = ref<string[]>(['1']);
    const segmentedValue = ref('list');
    const transferTargetKeys = ref<string[]>(['2']);
    const checkboxChecked = ref(true);
    const radioChecked = ref(true);
    const switchChecked = ref(true);
    const tabsActiveKey = ref('1');
    const typoContent = ref(
      'Ant Design Vue is a design system for enterprise-level web applications, standardizing semantic DOM styling across every component.',
    );

    const componentKey = computed(() =>
      props.component.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
    );

    const isPopupSlotActive = computed(
      () => props.activeSemantic === 'popup' || props.activeSemantic.startsWith('popup.'),
    );

    const getPopupContainer = (trigger?: HTMLElement) =>
      popupHostRef.value ||
      (trigger?.closest?.('.semantic-stage-inner') as HTMLElement | null) ||
      trigger?.parentElement ||
      document.body;

    const getAnchorCurrent = () => '#sp-anchor-api';
    const preventUpload = () => false;

    const anchorItems = computed(() => [
      {
        key: 'api',
        href: '#sp-anchor-api',
        title: 'API',
        children: [
          {
            key: 'props',
            href: '#sp-anchor-props',
            title: props.isZhCN ? 'Anchor 属性' : 'Anchor Props',
          },
          {
            key: 'link',
            href: '#sp-anchor-link',
            title: props.isZhCN ? 'Link 属性' : 'Link Props',
          },
        ],
      },
      {
        key: 'basic',
        href: '#sp-anchor-basic',
        title: props.isZhCN ? '基础示例' : 'Basic Demo',
      },
    ]);

    const dropdownMenu = computed(() => ({
      items: [
        {
          key: 'group-1',
          type: 'group',
          label: props.isZhCN ? '分组标题' : 'Group Title',
          children: [
            {
              key: '1-1',
              label: props.isZhCN ? '保存配置' : 'Save Config',
              icon: () => h(SaveOutlined),
            },
            {
              key: '1-2',
              label: props.isZhCN ? '编辑内容' : 'Edit Item',
              icon: () => h(EditOutlined),
            },
          ],
        },
        {
          key: 'divider-1',
          type: 'divider',
        },
        {
          key: 'delete',
          label: props.isZhCN ? '删除条目' : 'Delete',
          icon: () => h(DeleteOutlined),
          danger: true,
        },
      ],
    }));

    const menuItems = computed(() => [
      {
        key: 'mail',
        label: props.isZhCN ? '导航一' : 'Navigation One',
        icon: () => h(MailOutlined),
      },
      {
        key: 'SubMenu',
        label: props.isZhCN ? '导航二' : 'Navigation Two',
        icon: () => h(AppstoreOutlined),
        children: [
          {
            key: 'opt-1',
            label: props.isZhCN ? '子菜单项 1' : 'Option 1',
            icon: () => h(MailOutlined),
          },
          {
            key: 'opt-2',
            label: props.isZhCN ? '子菜单项 2' : 'Option 2',
          },
        ],
      },
      {
        key: 'grp',
        type: 'group',
        label: props.isZhCN ? '分组标题' : 'Group Three',
        children: [
          {
            key: 'opt-3',
            label: props.isZhCN ? '分组项 3' : 'Option 3',
          },
        ],
      },
    ]);

    const mentionsOptions = [
      { value: 'antdv', label: 'antdv' },
      { value: 'vue', label: 'vue' },
      { value: 'semantic', label: 'semantic' },
    ];

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

    const treeData = [
      {
        title: 'parent 1',
        key: '0-0',
        icon: () => h(SmileOutlined),
        children: [
          {
            title: 'leaf 1',
            key: '0-0-0',
            icon: () => h(MehOutlined),
          },
          {
            title: 'leaf 2',
            key: '0-0-1',
            icon: () => h(SmileOutlined),
          },
        ],
      },
    ];

    const stepsItems = computed(() => [
      {
        title: props.isZhCN ? '已完成' : 'Finished',
        subTitle: '00:01',
        description: props.isZhCN ? '步骤说明' : 'Description',
      },
      {
        title: props.isZhCN ? '进行中' : 'In Progress',
        subTitle: '00:02',
        description: props.isZhCN ? '步骤说明' : 'Description',
      },
      {
        title: props.isZhCN ? '待处理' : 'Waiting',
        subTitle: '00:03',
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

    const tableColumns = computed(() => [
      {
        title: props.isZhCN ? '姓名' : 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: props.isZhCN ? '年龄' : 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 64,
      },
      {
        title: props.isZhCN ? '城市' : 'City',
        dataIndex: 'city',
        key: 'city',
      },
    ]);

    const tableData = [
      { key: '1', name: 'Alice', age: 28, city: 'Hangzhou' },
      { key: '2', name: 'Bob', age: 34, city: 'Shanghai' },
      { key: '3', name: 'Carol', age: 30, city: 'Beijing' },
      { key: '4', name: 'Dave', age: 26, city: 'Shenzhen' },
    ];

    const tablePagination = { pageSize: 2, size: 'small' as const };

    const tabsPreviewStyles = {
      indicator: { visibility: 'visible' as const },
    };

    const tabsPanes = computed(() =>
      Array.from({ length: 8 }, (_, idx) => {
        const num = String(idx + 1);
        return {
          key: num,
          tab: `Tab ${num}`,
          content: props.isZhCN ? `标签页 ${num} 内容区域示例。` : `Content of Tab Pane ${num}.`,
        };
      }),
    );

    const timelineItems = computed(() => [
      {
        title: '2026-01-01',
        content: props.isZhCN ? '创建服务节点' : 'Create a services site',
      },
      {
        title: '2026-02-15',
        content: props.isZhCN ? '解决网络初始化问题' : 'Solve initial network problems',
      },
      {
        title: '2026-03-20',
        content: props.isZhCN ? '完成语义化 DOM 升级' : 'Complete Semantic DOM upgrade',
      },
    ]);

    const tourCoverNode = h('img', {
      src: TOUR_COVER_SVG,
      alt: 'Tour cover',
      style: { width: '100%', height: '72px', objectFit: 'cover', borderRadius: '6px' },
    });

    const uploadFileList = [
      {
        uid: '1',
        name: 'semantic-spec.pdf',
        status: 'done',
      },
      {
        uid: '2',
        name: 'design-tokens.json',
        status: 'uploading',
        percent: 58,
      },
      {
        uid: '3',
        name: 'failed-sample.png',
        status: 'error',
      },
    ];

    return {
      popupHostRef,
      componentKey,
      isPopupSlotActive,
      getPopupContainer,
      getAnchorCurrent,
      preventUpload,
      IMAGE_PLACEHOLDER,
      CARD_COVER_SVG,
      inputValue,
      inputNumberValue,
      mentionsValue,
      selectValue,
      autoValue,
      cascaderValue,
      treeSelectValue,
      sliderValue,
      collapseActiveKey,
      segmentedValue,
      transferTargetKeys,
      checkboxChecked,
      radioChecked,
      switchChecked,
      tabsActiveKey,
      typoContent,
      anchorItems,
      dropdownMenu,
      menuItems,
      mentionsOptions,
      listyItems,
      listyGroup,
      renderListyItem,
      masonryItems,
      selectOptions,
      autoOptions,
      cascaderOptions,
      treeSelectData,
      treeData,
      stepsItems,
      segmentedOptions,
      transferData,
      listData,
      tableColumns,
      tableData,
      tablePagination,
      tabsPreviewStyles,
      tabsPanes,
      timelineItems,
      tourCoverNode,
      uploadFileList,
    };
  },
});
</script>

<style lang="less" scoped>
.semantic-stage-inner {
  position: relative;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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

.sp-inline-picker-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 100%;
}

.sp-color-pure-panel {
  max-width: 100%;
}

.sp-dialog-stage {
  position: relative;
  width: 100%;
  height: 268px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--site-border-color-split);
  background: var(--component-background);
}

.sp-modal-mask,
.sp-drawer-mask,
.sp-tour-mask {
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

.sp-modal-pure {
  width: 100%;
  max-width: 316px;
}

.sp-drawer-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-end: 0;
  width: 264px;
  max-width: 84%;
  display: flex;
}

.sp-drawer-dragger {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: -3px;
  width: 6px;
  z-index: 2;
  cursor: col-resize;
  background: rgba(22, 119, 255, 0.18);
}

.sp-drawer-pure {
  width: 100%;
  height: 100%;
}

.sp-tour-stage {
  position: relative;
  width: 100%;
  min-height: 276px;
  padding: 18px 14px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--site-border-color-split);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.sp-tour-pure {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 296px;
}

.sp-message-list {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed var(--site-border-color-split);
  box-sizing: border-box;
}

.sp-message-list-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.sp-notification-list {
  width: 100%;
  max-width: 348px;
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed var(--site-border-color-split);
  box-sizing: border-box;
}

.sp-notification-list-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.sp-notification-pure {
  width: 100% !important;
  max-width: 100% !important;
  margin-bottom: 0 !important;
}

.sp-notification-progress-wrap {
  position: relative;
  width: 100%;
}

.sp-notification-progress {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 4px;
  width: calc(100% - 24px);
  height: 3px;
  border: 0;
  border-radius: 2px;
  accent-color: var(--primary-color, #1677ff);
}

.sp-anchor-box {
  min-width: 180px;
}

.sp-calendar-stage {
  width: 100%;
  max-width: 310px;
  border: 1px solid var(--site-border-color-split);
  border-radius: 8px;
  overflow: hidden;

  :deep(.ant-picker-calendar-date-content) {
    min-height: 4px;
  }
}

.sp-layout-stage {
  width: 100%;
  max-width: 340px;
  min-height: 132px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--site-border-color-split);
}

.sp-layout-sider {
  color: #fff;
}

.sp-layout-sider-text {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  font-size: 13px;
  font-weight: 500;
}

.sp-layout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  font-size: 13px;
  color: var(--site-text-color-secondary);
}

.sp-menu-stage {
  width: 240px;
  max-width: 100%;
  border: 1px solid var(--site-border-color-split);
  border-radius: 8px;
}

.sp-result-compact {
  width: 100%;
  padding: 16px 12px;

  :deep(.ant-result-icon) {
    margin-bottom: 8px;
  }

  :deep(.ant-result-extra) {
    margin-top: 12px;
  }

  :deep(.ant-result-content) {
    margin-top: 12px;
    padding: 12px 16px;
  }
}

.sp-result-body {
  text-align: center;
  font-size: 13px;
  color: var(--site-text-color-secondary);
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

.sp-tabs-pane-body {
  padding: 8px 4px;
  font-size: 13px;
  color: var(--site-text-color-secondary);
}

.sp-transfer-footer {
  padding: 4px 8px;
  font-size: 12px;
  color: var(--site-text-color-secondary);
}

.sp-tree-stage {
  min-width: 200px;
}

.sp-typography-stage {
  width: 100%;
  max-width: 340px;
}
</style>
