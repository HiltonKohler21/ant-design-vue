<docs>
---
order: 10
version: 4.3.0
debug: true
title:
  zh-CN: 聚焦描边调试
  en-US: Focus outline debug
---

## zh-CN

调试关闭 `focusOutline` 时待覆盖组件的聚焦描边。

## en-US

Debug focus outlines for components pending `focusOutline` coverage.
</docs>

<template>
  <a-config-provider :get-popup-container="getPopupContainer" :theme="themeConfig">
    <a-app :notification="{ getContainer: getNotificationContainer }">
      <a-space direction="vertical" size="middle" style="width: 100%">
        <a-space wrap>
          <a-switch v-model:checked="focusOutline" />
          <a-typography-text>focusOutline: {{ String(focusOutline) }}</a-typography-text>
        </a-space>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            只需要覆盖 lineWidthFocus 的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Alert.Close</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Alert.Close'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-alert closable title="Closable Alert" type="info" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Breadcrumb.Link</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Breadcrumb.Link'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-breadcrumb :items="breadcrumbItems" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Button</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Button }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-space wrap>
                <a-button type="primary">Button</a-button>
                <a-button type="link">Link Button</a-button>
              </a-space>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Checkbox</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Checkbox }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-checkbox>Checkbox</a-checkbox>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Collapse.Header</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Collapse.Header'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-collapse>
                <a-collapse-panel key="1" header="Collapse Header">
                  Collapse content
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.Operation</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.Operation'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-date-picker v-model:value="defaultDate" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Drawer.Close</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Drawer.Close'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="drawerOpen = true">Open Drawer</a-button>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Dropdown.Menu</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Dropdown.Menu'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-dropdown>
                <a-button>Open Dropdown</a-button>
                <template #overlay>
                  <a-menu :items="dropdownMenuItems" />
                </template>
              </a-dropdown>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Image.Root</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Image.Root'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-image
                :width="96"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Image.Preview</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Image.Preview'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-image
                :width="96"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                :preview="imagePreviewConfig"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.ClearIcon</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.ClearIcon'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input v-model:value="clearableInput" allow-clear />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Menu.Item</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Menu.Item'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-menu mode="horizontal" :selectable="false" :items="horizontalMenuItems" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Modal</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Modal }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="modalOpen = true">Open Modal</a-button>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Notification.Close</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Notification.Close'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <NotifyTrigger @set-container="setNotificationContainer" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Pagination.Item</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Pagination.Item'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-pagination :default-current="5" :total="500" size="small" show-less-items />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Radio</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Radio }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-radio-group default-value="a">
                <a-radio value="a">A</a-radio>
                <a-radio value="b">B</a-radio>
              </a-radio-group>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Radio.Button</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Radio.Button'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-radio-group default-value="left">
                <a-radio-button value="left">Left</a-radio-button>
                <a-radio-button value="right">Right</a-radio-button>
              </a-radio-group>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Segmented</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Segmented }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-segmented
                v-model:value="segmentedValue"
                :options="['Daily', 'Weekly', 'Monthly']"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Switch</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Switch }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-switch />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Table.Expand</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Table.Expand'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-table
                size="small"
                :pagination="false"
                :data-source="tableData"
                :columns="tableColumns"
              >
                <template #expandedRowRender="{ record }">
                  <a-typography-text>{{ record.description }}</a-typography-text>
                </template>
              </a-table>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Tabs</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Tabs }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tabs type="editable-card" :items="tabsItems" @edit="() => {}" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Tour.Close</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Tour.Close'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="showTour">Open Tour</a-button>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Transfer.Operation</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Transfer.Operation'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-transfer
                v-model:target-keys="transferTargetKeys"
                v-model:selected-keys="transferSelectedKeys"
                one-way
                :list-style="{ width: '160px', height: '160px' }"
                :data-source="transferData"
                :render="item => item.title"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Tree.Node</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Tree.Node'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tree default-expand-all :tree-data="treeData" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Typography.Operation</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Typography.Operation'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-space wrap>
                <a-typography-link href="#focus-outline-debug-typography">Link</a-typography-link>
                <a-typography-text v-model:content="editableText" editable />
                <a-typography-text copyable>Copyable</a-typography-text>
                <a-typography-paragraph
                  :ellipsis="{ rows: 1, expandable: true }"
                  :style="{ width: '120px', margin: '0px' }"
                  content="Expandable typography content"
                />
              </a-space>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Upload.Dragger</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Upload.Dragger'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-upload-dragger :before-upload="() => false" :max-count="1">
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p class="ant-upload-text">Focus Upload Dragger</p>
              </a-upload-dragger>
            </div>
          </div>
        </section>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            需要处理共享或复用样式 Token 归属的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Anchor.Link</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Anchor.Link'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-anchor :affix="false" :items="anchorItems" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Tag.Link</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Tag.Link'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tag href="#focus-outline-debug-tag" color="blue">Link Tag</a-tag>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>FloatButton</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.FloatButton }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-float-button :style="inlineFloatButtonStyle" />
            </div>
          </div>

          <div class="focus-row" :style="{ minHeight: '120px' }">
            <div class="focus-label">
              <a-typography-text strong>FloatButton.Group</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['FloatButton.Group'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-float-button-group
                trigger="click"
                :open="true"
                :style="inlineFloatButtonStyle"
                placement="right"
              >
                <a-float-button />
                <a-float-button />
              </a-float-button-group>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>FloatButton.BackTop</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['FloatButton.BackTop'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-float-button-back-top :visibility-height="0" :style="inlineFloatButtonStyle" />
            </div>
          </div>
        </section>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            需要覆盖浏览器原生 outline 的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Steps.Item</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Steps.Item'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-steps :current="1" :items="stepsItems" @change="() => {}" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Splitter.Collapse</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Splitter.Collapse'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-splitter :style="{ height: '96px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.08)' }">
                <a-splitter-panel collapsible min="20%">Panel 1</a-splitter-panel>
                <a-splitter-panel>Panel 2</a-splitter-panel>
              </a-splitter>
            </div>
          </div>
        </section>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            需要覆盖 controlOutlineWidth 的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Form.NativeControl</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Form.NativeControl'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-form>
                <a-space wrap>
                  <input aria-label="File" type="file" />
                  <label>
                    <input name="native-radio" type="radio" />
                    Native radio
                  </label>
                  <label>
                    <input type="checkbox" />
                    Native checkbox
                  </label>
                </a-space>
              </a-form>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input placeholder="Outlined Input" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.OTP</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.OTP'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <InputOTP :length="4" default-value="1234" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>InputNumber.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['InputNumber.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input-number placeholder="Outlined InputNumber" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Mentions.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Mentions.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-mentions
                placeholder="Outlined Mentions"
                :options="mentionsOptions"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-date-picker placeholder="Outlined DatePicker" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TimePicker.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TimePicker.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-time-picker placeholder="Outlined TimePicker" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Select.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Select.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-select placeholder="Outlined Select" :options="options" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>AutoComplete.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['AutoComplete.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-auto-complete
                placeholder="Outlined AutoComplete"
                :options="options"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Cascader.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Cascader.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-cascader
                placeholder="Outlined Cascader"
                :options="cascaderOptions"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TreeSelect.Outlined</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TreeSelect.Outlined'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tree-select
                tree-default-expand-all
                placeholder="Outlined TreeSelect"
                :tree-data="treeData"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>ColorPicker.Trigger</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['ColorPicker.Trigger'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-color-picker default-value="#1677ff" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Pagination.QuickJumper</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Pagination.QuickJumper'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-pagination :default-current="2" :total="50" size="small" show-quick-jumper />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Radio.FocusShadow</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Radio.FocusShadow'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-space direction="vertical">
                <a-radio>Radio</a-radio>
                <a-radio-group default-value="left">
                  <a-radio-button value="left">Left</a-radio-button>
                  <a-radio-button value="right">Right</a-radio-button>
                </a-radio-group>
              </a-space>
            </div>
          </div>
        </section>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            需要覆盖自定义 outline 或 box-shadow 的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input variant="borderless" placeholder="Borderless Input" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.Search.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.Search.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input-search variant="borderless" placeholder="Borderless Search" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.Password.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.Password.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input-password variant="borderless" placeholder="Borderless Password" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Input.TextArea.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Input.TextArea.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-textarea variant="borderless" placeholder="Borderless TextArea" :rows="2" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>InputNumber.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['InputNumber.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-input-number
                variant="borderless"
                placeholder="Borderless InputNumber"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Mentions.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Mentions.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-mentions
                variant="borderless"
                placeholder="Borderless Mentions"
                :options="mentionsOptions"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-date-picker
                variant="borderless"
                placeholder="Borderless DatePicker"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.RangePicker.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.RangePicker.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-range-picker variant="borderless" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TimePicker.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TimePicker.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-time-picker
                variant="borderless"
                placeholder="Borderless TimePicker"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TimePicker.RangePicker.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TimePicker.RangePicker.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-time-range-picker variant="borderless" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Select.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Select.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-select
                variant="borderless"
                placeholder="Borderless Select"
                :options="options"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>AutoComplete.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['AutoComplete.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-auto-complete
                variant="borderless"
                placeholder="Borderless AutoComplete"
                :options="options"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Cascader.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Cascader.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-cascader
                variant="borderless"
                placeholder="Borderless Cascader"
                :options="cascaderOptions"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TreeSelect.Borderless</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TreeSelect.Borderless'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tree-select
                variant="borderless"
                tree-default-expand-all
                placeholder="Borderless TreeSelect"
                :tree-data="treeData"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Rate</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Rate }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-rate v-model:value="rateValue" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Slider</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap.Slider }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-slider v-model:value="sliderValue" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>ColorPicker.Panel</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['ColorPicker.Panel'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-color-picker default-value="#1677ff" placement="right" />
            </div>
          </div>
        </section>

        <section class="focus-section">
          <a-typography-title :level="4" class="focus-section-title">
            需要处理复合组件公开 Token 的
          </a-typography-title>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>AutoComplete.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['AutoComplete.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-auto-complete
                placeholder="AutoComplete public token"
                :options="options"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TimePicker.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TimePicker.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-time-picker placeholder="TimePicker public token" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TimePicker.RangePicker.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TimePicker.RangePicker.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-time-range-picker style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Cascader.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Cascader.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-cascader
                placeholder="Cascader public token"
                :options="cascaderOptions"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>TreeSelect.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['TreeSelect.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-tree-select
                tree-checkable
                tree-default-expand-all
                placeholder="TreeSelect public token"
                :tree-data="treeData"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Select.PopupToken</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Select.PopupToken'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-select placeholder="Select popup token" :options="options" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.PopupToken</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.PopupToken'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-date-picker placeholder="DatePicker popup token" style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>DatePicker.RangePicker.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['DatePicker.RangePicker.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-range-picker style="width: 100%" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>ColorPicker.PopupToken</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['ColorPicker.PopupToken'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-color-picker default-value="#1677ff" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Dropdown.PopupToken</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Dropdown.PopupToken'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-dropdown>
                <a-button>Open Dropdown</a-button>
                <template #overlay>
                  <a-menu :items="dropdownMenuItems" />
                </template>
              </a-dropdown>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Image.PreviewToken</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Image.PreviewToken'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-image
                :width="96"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                :preview="tokenImagePreviewConfig"
              />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Modal.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Modal.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="modalOpen = true">Open Modal</a-button>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Drawer.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Drawer.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="drawerOpen = true">Open Drawer</a-button>
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Notification.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Notification.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <NotifyTrigger @set-container="setNotificationContainer" />
            </div>
          </div>

          <div class="focus-row">
            <div class="focus-label">
              <a-typography-text strong>Tour.Token</a-typography-text>
              <a-typography-text type="secondary" class="focus-target">
                {{ focusTargetMap['Tour.Token'] }}
              </a-typography-text>
            </div>
            <div class="focus-control">
              <a-button @click="showTour">Open Tour</a-button>
            </div>
          </div>
        </section>
      </a-space>

      <a-modal
        v-model:open="modalOpen"
        :get-container="false"
        title="Modal focus target"
        @ok="modalOpen = false"
      >
        Focus the dialog root and close button.
      </a-modal>

      <a-drawer v-model:open="drawerOpen" :get-container="false" title="Drawer focus target">
        Focus the close button.
      </a-drawer>

      <a-tour :open="tourOpen" :steps="tourSteps" @close="tourOpen = false" />
    </a-app>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { App, Button, Input } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps, TourProps } from '@hiltonkohler21/ant-design-vue';

const InputOTP = Input.OTP;

const focusOutline = ref(false);
const drawerOpen = ref(false);
const modalOpen = ref(false);
const tourOpen = ref(false);
const imagePreviewOpen = ref(false);
const tokenImagePreviewOpen = ref(false);
const segmentedValue = ref('Daily');
const editableText = ref('Editable');
const clearableInput = ref('Clearable Input');
const rateValue = ref(3);
const sliderValue = ref(40);
const transferTargetKeys = ref<string[]>(['2']);
const transferSelectedKeys = ref<string[]>([]);
const notificationContainerRef = ref<HTMLElement | null>(null);
const tourTargetRef = ref<HTMLElement | null>(null);

const defaultDate = ref(dayjs('2026-07-08'));

const themeConfig = computed<ConfigProviderProps['theme']>(() => ({
  token: {
    ...(focusOutline.value ? {} : { controlOutlineWidth: 0 }),
    focusOutline: focusOutline.value,
  } as Record<string, any>,
}));

const getPopupContainer = (triggerNode?: HTMLElement) => {
  if (!triggerNode || triggerNode === document.body) {
    return document.body;
  }
  return triggerNode.parentElement ?? document.body;
};

const getNotificationContainer = () => notificationContainerRef.value ?? document.body;

const setNotificationContainer = (el: HTMLElement | null) => {
  notificationContainerRef.value = el;
};

const showTour = (event: MouseEvent) => {
  tourTargetRef.value = event.currentTarget as HTMLElement;
  tourOpen.value = true;
};

const tourSteps = computed<TourProps['steps']>(() => [
  {
    title: 'Tour focus target',
    description: 'Focus the close button.',
    target: () => tourTargetRef.value as HTMLElement,
  },
]);

const imagePreviewConfig = computed(() => ({
  getContainer: false as const,
  open: imagePreviewOpen.value,
  onOpenChange: (val: boolean) => {
    imagePreviewOpen.value = val;
  },
}));

const tokenImagePreviewConfig = computed(() => ({
  getContainer: false as const,
  open: tokenImagePreviewOpen.value,
  onOpenChange: (val: boolean) => {
    tokenImagePreviewOpen.value = val;
  },
}));

const NotifyTrigger = defineComponent({
  name: 'FocusOutlineNotifyTrigger',
  emits: ['setContainer'],
  setup(_, { emit }) {
    const { notification } = App.useApp();

    const handleClick = (event: MouseEvent) => {
      emit('setContainer', (event.currentTarget as HTMLElement)?.parentElement ?? null);
      notification.open({
        title: 'Notification focus target',
        description: 'Focus the close button.',
        actions: h(Button, { size: 'small' }, () => 'Action'),
      });
    };

    return () => h(Button, { onClick: handleClick }, () => 'Open Notification');
  },
});

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'orange', label: 'Orange' },
  { value: 'banana', label: 'Banana' },
];

const mentionsOptions = [{ value: 'antd', label: 'antd' }];

const cascaderOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{ value: 'hangzhou', label: 'Hangzhou' }],
  },
];

const treeData = [
  {
    title: 'Parent',
    value: 'parent',
    key: 'parent',
    children: [{ title: 'Child', value: 'child', key: 'child' }],
  },
];

const tableData = [
  { key: '1', name: 'Apple', count: 3, description: 'Apple details' },
  { key: '2', name: 'Orange', count: 5, description: 'Orange details' },
];

const tableColumns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Count', dataIndex: 'count' },
];

const transferData = [
  { key: '1', title: 'Apple' },
  { key: '2', title: 'Orange' },
  { key: '3', title: 'Banana' },
  { key: '4', title: 'Pear' },
];

const tabsItems = Array.from({ length: 8 }, (_, index) => ({
  key: String(index + 1),
  label: `Tab ${index + 1}`,
  children: `Tab panel ${index + 1}`,
}));

const breadcrumbItems = [
  { title: 'Home', href: '#focus-outline-debug-home' },
  { title: 'List', href: '#focus-outline-debug-list' },
  { title: 'Detail' },
];

const dropdownMenuItems = [
  { key: '1', label: 'Menu Item 1' },
  { key: '2', label: 'Menu Item 2' },
];

const horizontalMenuItems = [
  { key: 'mail', label: 'Mail' },
  { key: 'app', label: 'App' },
];

const anchorItems = [
  { key: '1', href: '#focus-outline-anchor-1', title: 'Anchor 1' },
  { key: '2', href: '#focus-outline-anchor-2', title: 'Anchor 2' },
];

const stepsItems = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];

const inlineFloatButtonStyle: CSSProperties = {
  position: 'relative',
  inset: 'auto',
  insetInlineEnd: 'auto',
  insetBlockEnd: 'auto',
};

const focusTargetMap: Record<string, string> = {
  'Alert.Close': '描边位置：关闭按钮',
  'Anchor.Link': '描边位置：锚点链接',
  'Breadcrumb.Link': '描边位置：面包屑链接',
  Button: '描边位置：按钮根节点、链接形态',
  Checkbox: '描边位置：checkbox 方框外圈',
  'Collapse.Header': '描边位置：面板标题外框',
  'DatePicker.Operation': '描边位置：清除按钮',
  'Drawer.Close': '描边位置：关闭按钮',
  'Dropdown.Menu': '描边位置：菜单根节点、菜单项；触发按钮由 Button 处理',
  FloatButton: '描边位置：悬浮按钮外框',
  'FloatButton.Group': '描边位置：Group 触发按钮外框',
  'FloatButton.BackTop': '描边位置：回到顶部按钮外框',
  'Image.Root': '描边位置：图片根节点',
  'Image.Preview': '描边位置：预览层关闭按钮、工具栏按钮',
  'Input.ClearIcon': '描边位置：清除按钮；输入框 active shadow 在其他分组',
  'Menu.Item': '描边位置：菜单根节点、菜单项',
  Modal: '描边位置：对话框根节点、关闭按钮；底部按钮由 Button 处理',
  'Notification.Close': '描边位置：关闭按钮；操作按钮由 Button 处理',
  'Pagination.Item': '描边位置：页码、跳转项、上一页和下一页按钮',
  Radio: '描边位置：radio 圆点外圈',
  'Radio.Button': '描边位置：Radio.Button 分段外框',
  Segmented: '描边位置：根节点、当前聚焦项',
  Switch: '描边位置：开关外框',
  'Table.Expand': '描边位置：行展开按钮',
  Tabs: '描边位置：标签、更多、添加和删除按钮',
  'Tag.Link': '描边位置：链接形态 Tag',
  'Tour.Close': '描边位置：关闭按钮；步骤按钮由 Button 处理',
  'Transfer.Operation': '描边位置：目标列表移除按钮、穿梭按钮',
  'Tree.Node': '描边位置：树节点标题',
  'Typography.Operation': '描边位置：链接、编辑、复制和展开操作',
  'Upload.Dragger': '描边位置：拖拽上传区域',
  'Steps.Item': '原生描边位置：可点击步骤项',
  'Splitter.Collapse': '原生描边位置：分割条折叠按钮区域',
  'Form.NativeControl': 'shadow 位置：原生 file、radio、checkbox 控件',
  'Input.Outlined': 'shadow 位置：常规输入框外层',
  'Input.OTP': 'shadow 位置：当前 OTP 单格输入框',
  'InputNumber.Outlined': 'shadow 位置：常规数字输入框外层',
  'Mentions.Outlined': 'shadow 位置：常规文本域外层',
  'DatePicker.Outlined': 'shadow 位置：常规日期输入框外层',
  'TimePicker.Outlined': 'shadow 位置：常规时间输入框外层',
  'Select.Outlined': 'shadow 位置：常规选择框外层',
  'AutoComplete.Outlined': 'shadow 位置：常规自动完成输入框外层',
  'Cascader.Outlined': 'shadow 位置：常规级联选择框外层',
  'TreeSelect.Outlined': 'shadow 位置：常规树选择框外层',
  'ColorPicker.Trigger': 'shadow 位置：颜色触发器外框',
  'Pagination.QuickJumper': 'shadow 位置：快速跳转输入框',
  'Radio.FocusShadow': 'shadow 位置：radio 与 Radio.Button 聚焦节点',
  'Input.Borderless': '自定义描边位置：无边框输入框自身轮廓',
  'Input.Search.Borderless': '自定义描边位置：无边框搜索框自身轮廓',
  'Input.Password.Borderless': '自定义描边位置：无边框密码框自身轮廓',
  'Input.TextArea.Borderless': '自定义描边位置：无边框文本域自身轮廓',
  'InputNumber.Borderless': '自定义描边位置：无边框数字输入框自身轮廓',
  'Mentions.Borderless': '自定义描边位置：无边框文本域自身轮廓',
  'DatePicker.Borderless': '自定义描边位置：无边框日期输入框自身轮廓',
  'DatePicker.RangePicker.Borderless': '自定义描边位置：无边框范围输入框自身轮廓',
  'TimePicker.Borderless': '自定义描边位置：无边框时间输入框自身轮廓',
  'TimePicker.RangePicker.Borderless': '自定义描边位置：无边框时间范围输入框自身轮廓',
  'Select.Borderless': '自定义描边位置：无边框选择框自身轮廓',
  'AutoComplete.Borderless': '自定义描边位置：无边框自动完成输入框自身轮廓',
  'Cascader.Borderless': '自定义描边位置：无边框级联选择框自身轮廓',
  'TreeSelect.Borderless': '自定义描边位置：无边框树选择框自身轮廓',
  Rate: '自定义描边位置：当前星星',
  Slider: '自定义描边位置：滑块拖拽点',
  'ColorPicker.Panel': '自定义描边位置：面板内色板、滑条拖拽点、输入框',
  'AutoComplete.Token': '传递位置：AutoComplete 公开 Token 到内部 Select',
  'TimePicker.Token': '传递位置：TimePicker 公开 Token 到内部 DatePicker',
  'TimePicker.RangePicker.Token': '传递位置：TimePicker 公开 Token 到时间范围选择器',
  'Cascader.Token': '传递位置：Cascader 公开 Token 到内部 Select 和弹层',
  'TreeSelect.Token': '传递位置：TreeSelect 公开 Token 到内部 Select、Tree、Checkbox 和弹层',
  'Select.PopupToken': '传递位置：Select 组件 Token 到弹层',
  'DatePicker.PopupToken': '传递位置：DatePicker 组件 Token 到日期弹层',
  'DatePicker.RangePicker.Token': '传递位置：DatePicker 组件 Token 到 RangePicker 和弹层',
  'ColorPicker.PopupToken': '传递位置：ColorPicker 组件 Token 到 panel 弹层',
  'Dropdown.PopupToken': '传递位置：Dropdown 组件 Token 到 Menu 弹层',
  'Image.PreviewToken': '传递位置：Image 组件 Token 到预览层',
  'Modal.Token': '传递位置：Modal 组件 Token 到 portal 内容',
  'Drawer.Token': '传递位置：Drawer 组件 Token 到 portal 内容',
  'Notification.Token': '传递位置：Notification 组件 Token 到 portal 内容',
  'Tour.Token': '传递位置：Tour 组件 Token 到 portal 内容',
};
</script>

<style scoped>
.focus-section {
  width: 100%;
}

.focus-section-title {
  margin-block: 24px 4px;
}

.focus-row {
  display: grid;
  grid-template-columns: minmax(140px, 240px) minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding-block: 10px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}

.focus-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.focus-target {
  font-size: 12px;
  line-height: 1.35;
  word-break: break-all;
}

.focus-control {
  max-width: 420px;
  width: 100%;
  min-width: 0;
  position: relative;
}
</style>
