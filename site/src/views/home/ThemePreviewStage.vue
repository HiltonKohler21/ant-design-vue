<template>
  <div class="theme-stage" :style="stageStyle">
    <!-- Top Mini-App Toolbar -->
    <div class="theme-stage-header" :style="headerStyle">
      <div class="theme-stage-brand">
        <a-avatar :style="{ backgroundColor: rawToken.colorPrimary }" size="default">
          <template #icon><RocketOutlined /></template>
        </a-avatar>
        <div class="theme-stage-brand-text">
          <div class="theme-stage-brand-title" :style="{ color: rawToken.colorText }">
            {{ isZhCN ? 'Ant Design Vue 控制台' : 'Ant Design Vue Studio' }}
          </div>
          <div class="theme-stage-brand-sub" :style="{ color: rawToken.colorTextSecondary }">
            {{ presetLabel }} · {{ rawToken.colorPrimary }} · {{ rawToken.borderRadius }}px
          </div>
        </div>
        <a-tag color="processing" :bordered="false">
          {{ isZhCN ? '实时生效' : 'Live' }}
        </a-tag>
      </div>

      <div class="theme-stage-toolbar">
        <a-segmented v-model:value="activeView" :options="viewOptions" />
        <a-space :size="8">
          <a-button size="small">
            <template #icon><ExportOutlined /></template>
            {{ isZhCN ? '导出' : 'Export' }}
          </a-button>
          <a-button type="primary" size="small">
            <template #icon><PlusOutlined /></template>
            {{ isZhCN ? '新建发布' : 'New Release' }}
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- Main 2-Column Interactive Workspace -->
    <div class="theme-stage-body">
      <a-row :gutter="[16, 16]">
        <!-- Left Column: Alert + Config Form Card -->
        <a-col :xs="24" :lg="12">
          <a-space direction="vertical" :size="12" style="width: 100%">
            <a-alert
              type="info"
              show-icon
              :message="
                isZhCN
                  ? '嵌套 ConfigProvider 独立运行，不影响站点全局主题'
                  : 'Isolated nested ConfigProvider — zero side effects on page theme'
              "
            />

            <a-card
              size="small"
              :title="isZhCN ? '项目发布配置' : 'Release Configuration'"
              class="theme-stage-card"
            >
              <template #extra>
                <a-badge status="processing" :text="isZhCN ? '已就绪' : 'Ready'" />
              </template>

              <div class="theme-stage-form">
                <div class="theme-stage-field">
                  <label :style="{ color: rawToken.colorTextSecondary }">
                    {{ isZhCN ? '应用名称' : 'Application Name' }}
                  </label>
                  <a-input
                    v-model:value="appName"
                    :placeholder="isZhCN ? '输入应用名称' : 'Enter app name'"
                    allow-clear
                  />
                </div>

                <div class="theme-stage-field">
                  <label :style="{ color: rawToken.colorTextSecondary }">
                    {{ isZhCN ? '部署环境' : 'Target Environment' }}
                  </label>
                  <a-select v-model:value="env" style="width: 100%" :options="envOptions" />
                </div>

                <div class="theme-stage-switches">
                  <div class="theme-stage-switch-item">
                    <span :style="{ color: rawToken.colorText }">
                      {{ isZhCN ? '开启 CSS 变量' : 'Enable CSS Vars' }}
                    </span>
                    <a-switch v-model:checked="enableCssVar" size="small" />
                  </div>
                  <div class="theme-stage-switch-item">
                    <span :style="{ color: rawToken.colorText }">
                      {{ isZhCN ? '自动发布' : 'Auto Deploy' }}
                    </span>
                    <a-switch v-model:checked="autoDeploy" size="small" />
                  </div>
                </div>

                <div class="theme-stage-form-footer">
                  <a-checkbox v-model:checked="notifyTeam">
                    {{ isZhCN ? '通知协作成员' : 'Notify team members' }}
                  </a-checkbox>
                  <a-space :size="8">
                    <a-button type="dashed" size="small" @click="resetDemo">
                      {{ isZhCN ? '重置' : 'Reset' }}
                    </a-button>
                    <a-button type="primary" size="small">
                      {{ isZhCN ? '立即应用' : 'Apply' }}
                    </a-button>
                  </a-space>
                </div>
              </div>
            </a-card>
          </a-space>
        </a-col>

        <!-- Right Column: Tabs + Steps + Progress + Slider + Team -->
        <a-col :xs="24" :lg="12">
          <a-card size="small" class="theme-stage-card theme-stage-card-full">
            <a-tabs v-model:active-key="activeTab" size="small" class="theme-stage-tabs">
              <a-tab-pane key="pipeline" :tab="isZhCN ? '构建流水线' : 'Pipeline'">
                <a-steps
                  size="small"
                  :current="stepCurrent"
                  :items="stepItems"
                  style="margin-bottom: 16px"
                />

                <div class="theme-stage-metric">
                  <div class="theme-stage-metric-row">
                    <span :style="{ color: rawToken.colorText }">
                      {{ isZhCN ? '组件构建进度' : 'Build Progress' }}
                    </span>
                    <span :style="{ color: rawToken.colorPrimary, fontWeight: 600 }">
                      {{ progressPercent }}%
                    </span>
                  </div>
                  <a-progress :percent="progressPercent" status="active" />
                  <a-slider
                    v-model:value="progressPercent"
                    :min="10"
                    :max="100"
                    style="margin: 6px 0 12px"
                  />
                  <div class="theme-stage-metric-row">
                    <span :style="{ color: rawToken.colorTextSecondary, fontSize: '12px' }">
                      {{ isZhCN ? '单元测试覆盖' : 'Unit Test Coverage' }}
                    </span>
                    <a-tag color="success" :bordered="false">100%</a-tag>
                  </div>
                  <a-progress :percent="100" size="small" />
                </div>
              </a-tab-pane>

              <a-tab-pane key="tokens" :tab="isZhCN ? '当前令牌' : 'Active Tokens'">
                <div class="theme-stage-tokens">
                  <div
                    v-for="tk in tokenSamples"
                    :key="tk.name"
                    class="theme-stage-token-row"
                    :style="{
                      borderColor: rawToken.colorBorderSecondary,
                      background: rawToken.colorFillQuaternary,
                    }"
                  >
                    <span
                      class="theme-stage-token-swatch"
                      :style="{ backgroundColor: tk.value, borderColor: rawToken.colorBorder }"
                    />
                    <code :style="{ color: rawToken.colorText }">{{ tk.name }}</code>
                    <span :style="{ color: rawToken.colorTextSecondary }">{{ tk.value }}</span>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>

            <a-divider style="margin: 12px 0" />

            <div class="theme-stage-team">
              <a-avatar-group :max-count="4" size="small">
                <a-avatar :style="{ backgroundColor: rawToken.colorPrimary }">A</a-avatar>
                <a-avatar style="background-color: #722ed1">V</a-avatar>
                <a-avatar style="background-color: #00b96b">D</a-avatar>
                <a-avatar style="background-color: #fa8c16">U</a-avatar>
              </a-avatar-group>
              <a-space :size="6" wrap>
                <a-tag :color="rawToken.colorPrimary">Design Token</a-tag>
                <a-tag color="cyan">Vue 3</a-tag>
                <a-tag color="purple">a11y</a-tag>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { theme as antdTheme } from 'ant-design-vue';
import { ExportOutlined, PlusOutlined, RocketOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  isZhCN: boolean;
  presetLabel: string;
}>();

const { realToken, token } = antdTheme.useToken();
const rawToken = computed(() => (realToken?.value || token.value) as Record<string, any>);

const activeView = ref<string>('overview');
const activeTab = ref<string>('pipeline');
const appName = ref('ant-design-vue-pro');
const env = ref('production');
const enableCssVar = ref(true);
const autoDeploy = ref(true);
const notifyTeam = ref(true);
const progressPercent = ref(78);

const viewOptions = computed(() =>
  props.isZhCN
    ? [
        { label: '总览', value: 'overview' },
        { label: '看板', value: 'kanban' },
        { label: '分析', value: 'analytics' },
      ]
    : [
        { label: 'Overview', value: 'overview' },
        { label: 'Kanban', value: 'kanban' },
        { label: 'Analytics', value: 'analytics' },
      ],
);

const envOptions = computed(() =>
  props.isZhCN
    ? [
        { label: '生产环境 (Production)', value: 'production' },
        { label: '预发环境 (Staging)', value: 'staging' },
        { label: '预览环境 (Preview)', value: 'preview' },
      ]
    : [
        { label: 'Production', value: 'production' },
        { label: 'Staging', value: 'staging' },
        { label: 'Preview', value: 'preview' },
      ],
);

const stepCurrent = computed(() => (progressPercent.value >= 100 ? 2 : 1));

const stepItems = computed(() =>
  props.isZhCN
    ? [{ title: '设计规范' }, { title: '主题构建' }, { title: '上线发布' }]
    : [{ title: 'Design' }, { title: 'Build' }, { title: 'Release' }],
);

const tokenSamples = computed(() => [
  { name: 'colorPrimary', value: rawToken.value.colorPrimary },
  { name: 'colorBgContainer', value: rawToken.value.colorBgContainer },
  { name: 'colorBgLayout', value: rawToken.value.colorBgLayout },
  { name: 'colorText', value: rawToken.value.colorText },
]);

const stageStyle = computed(() => ({
  backgroundColor: rawToken.value.colorBgLayout,
  color: rawToken.value.colorText,
  borderRadius: `${Math.min(Number(rawToken.value.borderRadiusLG) || 12, 20)}px`,
  border: `1px solid ${rawToken.value.colorBorderSecondary}`,
}));

const headerStyle = computed(() => ({
  backgroundColor: rawToken.value.colorBgContainer,
  borderBottom: `1px solid ${rawToken.value.colorBorderSecondary}`,
}));

const resetDemo = () => {
  appName.value = 'ant-design-vue-pro';
  env.value = 'production';
  enableCssVar.value = true;
  autoDeploy.value = true;
  notifyTeam.value = true;
  progressPercent.value = 78;
};
</script>
