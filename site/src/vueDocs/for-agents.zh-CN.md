# 为 AI 智能体准备的 Ant Design Vue 开发指南

> 本文档为各类 AI 编码智能体（Cursor, Claude Code, Windsurf, GitHub Copilot, Antigravity）提供权威的 Ant Design Vue 4.x 开发准则、系统提示词模板与防幻觉最佳实践。

---

## 1. 为什么 AI 智能体需要此指南

现代大语言模型（LLMs）训练数据中混杂了大量旧版本 Vue 代码以及 React 版 Ant Design 代码。在生成 **Ant Design Vue** 代码时，AI 往往容易出现以下典型幻觉：

1. **混淆 Vue 2 与 Vue 3**：生成基于 Options API 的 `this.$message` 或早已废弃的 `v-decorator`。
2. **混淆 React AntD 与 Vue AntD**：写出 JSX 格式、将 `@change="val => ..."` 误写为 React 的 `onChange={(e) => ...}`，或混淆插槽语法。
3. **多余的样式文件引入**：尝试通过 `import 'ant-design-vue/dist/antd.css'` 引入样式。在 Ant Design Vue 4.x 中，已全面采用 CSS-in-JS 动态样式引擎，**无需引入任何 CSS 文件**。
4. **错误的图标引入路径**：从 `ant-design-vue` 或 `@ant-design/icons` 导入图标。正确包名为 `@ant-design/icons-vue`。
5. **浮层控制属性过时**：使用旧版的 `v-model:visible`，而在 v4 中已统一规范为 `v-model:open`。
6. **丢失全局上下文**：直接调用静态 `message.info()`，导致在暗色模式或自定义主题下无法响应 Token 变化。

遵循本文档的规则可以彻底消除此类幻觉，生成高品质、符合现代企业级规范的 Vue 3 SFC 代码。

---

## 2. 防幻觉对照表 (Anti-Patterns Guardrails)

在生成任何组件代码前，请严格参考下述对照表：

| 废弃 / 幻觉写法 | Ant Design Vue 4.x 现代正确写法 | 原因与规范 |
| :--- | :--- | :--- |
| `import 'ant-design-vue/dist/antd.css'` | **无需引入任何 CSS** | 4.x 采用 `@ant-design/cssinjs` 运行时动态注入 |
| `import { SmileOutlined } from 'ant-design-vue'` | `import { SmileOutlined } from '@ant-design/icons-vue'` | 图标统一独立分发于 `@ant-design/icons-vue` |
| `<a-modal v-model:visible="open">` | `<a-modal v-model:open="open">` | 4.x 中 `visible` 已废弃，统一使用 `open` |
| `<a-drawer v-model:visible="open">` | `<a-drawer v-model:open="open">` | 4.x 中 `visible` 已废弃，统一使用 `open` |
| `<a-input v-model="text">` | `<a-input v-model:value="text">` | Vue 3 自定义参数规范：表单输入使用 `v-model:value` |
| `<a-select v-model="val">` | `<a-select v-model:value="val">` | 所有数据录入控件均使用 `v-model:value` |
| 直接调用全局 `message.success(...)` | `<a-app>` 内使用 `const { message } = App.useApp()` | 确保获取动态主题 Token、语言包及响应式上下文 |
| `Form.create({ ... })` | `<a-form>` 配合响应式对象或 `Form.useForm()` | Vue 3 组合式 API 标准范式 |
| `<a-table>` 行内插槽直接传 slot | 使用 `#bodyCell="{ column, record }"` | Vue 3 作用域插槽现代规范 |

---

## 3. Ant Design Vue 4.x 的八大黄金准则

### 准则 1：必须使用 `<script setup lang="ts">`
所有单文件组件（SFC）必须统一采用 `<script setup lang="ts">` 及 Vue 3 组合式 API（`ref`, `reactive`, `computed`, `watch`, `h` 等）。

### 准则 2：准确的组件与图标导入
组件从 `'ant-design-vue'` 导入，图标从 `'@ant-design/icons-vue'` 导入：
```ts
import { Button, Table, Modal, Form, Input, Space, theme, App } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
```

### 准则 3：表单输入必须使用 `v-model:value`
所有数据录入组件（Input, Select, DatePicker, Switch 等）均使用 `v-model:value` 绑定：
```vue
<a-form layout="vertical" :model="formState">
  <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
    <a-input v-model:value="formState.username" placeholder="请输入用户名" />
  </a-form-item>
  <a-form-item label="角色" name="role">
    <a-select v-model:value="formState.role" :options="roleOptions" />
  </a-form-item>
</a-form>
```

### 准则 4：浮层与弹窗可见性必须使用 `v-model:open`
对于 `Modal`、`Drawer`、`Tooltip`、`Popover`、`Dropdown` 等浮层组件，统一使用 `v-model:open`：
```vue
<a-modal v-model:open="isModalOpen" title="编辑信息" @ok="handleOk">
  <p>弹窗内容...</p>
</a-modal>
```

### 准则 5：顶层包裹 `<a-app>` 并使用 `App.useApp()`
在根组件或路由布局层外层包裹 `<a-app>`。在子组件中通过 `App.useApp()` 获取上下文感知的交互方法：
```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-app>
      <router-view />
    </a-app>
  </a-config-provider>
</template>
```

在子组件中使用：
```ts
import { App } from 'ant-design-vue';

const { message, modal, notification } = App.useApp();

const handleDelete = () => {
  modal.confirm({
    title: '确认删除？',
    content: '删除后数据将无法找回。',
    onOk() {
      message.success('删除成功');
    },
  });
};
```

### 准则 6：表格列规范与强类型定义
表格列必须使用 `TableColumnsType` 进行类型约束：
```ts
import type { TableColumnsType } from 'ant-design-vue';

interface UserItem {
  id: number;
  name: string;
  role: string;
}

const columns: TableColumnsType<UserItem> = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '操作', key: 'action', fixed: 'right', width: 120 },
];
```

通过 `#bodyCell` 插槽自定义单元格渲染：
```vue
<a-table :columns="columns" :data-source="userList" row-key="id">
  <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'action'">
      <a-button type="link" danger @click="handleDelete(record.id)">删除</a-button>
    </template>
  </template>
</a-table>
```

### 准则 7：使用 `theme.useToken()` 消费设计变量
若需要编写具有主题自适应能力的自定义样式，使用 `theme.useToken()` 获取当前 Token：
```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { useToken } = theme;
const { token } = useToken();

const customStyle = computed(() => ({
  color: token.value.colorPrimary,
  backgroundColor: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));
</script>
```

### 准则 8：使用 Day.js 处理日期
Ant Design Vue 4.x 原生内置 Day.js：
```ts
import dayjs, { Dayjs } from 'dayjs';

const selectedDate = ref<Dayjs>(dayjs());
```

---

## 4. 智能体系统提示词模板 (可直接复制)

### 4.1 适用于 Cursor (`.cursor/rules/antdv.mdc` 或 `.cursorrules`)

```markdown
---
description: Ant Design Vue 4.x \u4e0e Vue 3 规范提示词
globs: **/*.{vue,ts,tsx}
---

你是一名精通 Vue 3 与 Ant Design Vue 4.x 的资深前端架构专家，请严格遵守以下开发规则：

1. 始终使用 `<script setup lang="ts">` 和组合式 API。
2. 组件必须从 `'ant-design-vue'` 导入。
3. 图标必须且只能从 `'@ant-design/icons-vue'` 导入，严禁从 `'ant-design-vue'` 导入图标。
4. 绝不引入任何 CSS 文件（4.x 使用 CSS-in-JS，不存在 antd.css）。
5. 输入类控件统一使用 `v-model:value`（如 `<a-input v-model:value="..." />`）。
6. Modal、Drawer 等浮层组件的可见性必须使用 `v-model:open`（严禁使用过时的 `v-model:visible`）。
7. 根组件使用 `<a-app>` 包裹，交互弹窗统一通过 `App.useApp()` 获取 `message`、`modal` 和 `notification`。
8. 表格列类型必须使用 `TableColumnsType` 约束，单元格定制使用 `#bodyCell="{ column, record }"`。
9. 全局主题通过 `<a-config-provider :theme="{ token: { ... } }">` 配置，子组件通过 `theme.useToken()` 获取变量。
```

### 4.2 适用于 Claude Code (`CLAUDE.md`)

```markdown
# Ant Design Vue 4.x 开发准则

- 技术栈：Vue 3 + SFC `<script setup lang="ts">` + TypeScript。
- 组件库：`ant-design-vue` 4.x。
- 图标库：`@ant-design/icons-vue`。
- 样式机制：CSS-in-JS，无需任何样式文件 import。
- 表单绑定：统一 `v-model:value`。
- 浮层状态：统一 `v-model:open`。
- 反馈服务：`<a-app>` 配合 `App.useApp()`。
- 日期库：`dayjs`。
```

### 4.3 适用于 GitHub Copilot (`.github/copilot-instructions.md`)

```markdown
编写 Vue 代码时请注意：
- 严格使用 Vue 3 `<script setup lang="ts">`。
- 使用 `ant-design-vue` 组件与 `@ant-design/icons-vue` 图标。
- 表单数据绑定使用 `v-model:value`。
- 弹窗显示隐藏使用 `v-model:open`。
- 不导入任何 CSS 文件。
```

---

## 5. 生产级全功能 CRUD 标准示例

以下示例完整演示了标准页面布局、表格检索、弹窗表单编辑、校验与反馈调用的规范写法：

```vue
<template>
  <div class="user-management">
    <a-card title="用户管理系统" :bordered="false">
      <!-- 顶部操作栏 -->
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索用户姓名"
            style="width: 220px"
            @search="handleSearch"
          />
          <a-button type="primary" :icon="h(PlusOutlined)" @click="openModal()">
            新建用户
          </a-button>
        </a-space>
      </template>

      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredUsers"
        :loading="loading"
        row-key="id"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'blue' : 'green'">
              {{ record.role.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openModal(record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除该用户吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 新建/编辑弹窗 -->
      <a-modal
        v-model:open="isModalOpen"
        :title="editingUser ? '编辑用户' : '新建用户'"
        @ok="handleSave"
        @cancel="closeModal"
      >
        <a-form
          ref="formRef"
          :model="formState"
          layout="vertical"
        >
          <a-form-item
            label="用户名"
            name="name"
            :rules="[{ required: true, message: '请输入用户姓名' }]"
          >
            <a-input v-model:value="formState.name" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item
            label="电子邮箱"
            name="email"
            :rules="[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]"
          >
            <a-input v-model:value="formState.email" placeholder="user@example.com" />
          </a-form-item>
          <a-form-item
            label="所属角色"
            name="role"
            :rules="[{ required: true, message: '请选择用户角色' }]"
          >
            <a-select v-model:value="formState.role" :options="roleOptions" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue';
import {
  Card as ACard,
  Table as ATable,
  Button as AButton,
  Input as AInput,
  InputSearch as AInputSearch,
  Modal as AModal,
  Form as AForm,
  FormItem as AFormItem,
  Select as ASelect,
  Tag as ATag,
  Space as ASpace,
  Popconfirm as APopconfirm,
  App,
} from 'ant-design-vue';
import type { TableColumnsType, FormInstance } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

const { message } = App.useApp();

// 表格列配置
const columns: TableColumnsType<User> = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '操作', key: 'actions', width: 160, fixed: 'right' },
];

const users = ref<User[]>([
  { id: 1, name: '张伟', email: 'zhangwei@example.com', role: 'admin' },
  { id: 2, name: '李娜', email: 'lina@example.com', role: 'editor' },
  { id: 3, name: '王强', email: 'wangqiang@example.com', role: 'user' },
]);

const loading = ref(false);
const searchKeyword = ref('');

const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value;
  return users.value.filter(u =>
    u.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  );
});

const handleSearch = () => {
  message.info(`已按关键字 "${searchKeyword.value}" 筛选`);
};

// 弹窗与表单状态
const isModalOpen = ref(false);
const editingUser = ref<User | null>(null);
const formRef = ref<FormInstance>();

const formState = reactive({
  name: '',
  email: '',
  role: 'user' as User['role'],
});

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑人员', value: 'editor' },
  { label: '普通用户', value: 'user' },
];

const openModal = (user?: User) => {
  if (user) {
    editingUser.value = user;
    formState.name = user.name;
    formState.email = user.email;
    formState.role = user.role;
  } else {
    editingUser.value = null;
    formState.name = '';
    formState.email = '';
    formState.role = 'user';
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  formRef.value?.resetFields();
};

const handleSave = async () => {
  try {
    await formRef.value?.validate();
    if (editingUser.value) {
      Object.assign(editingUser.value, formState);
      message.success('用户信息已更新');
    } else {
      users.value.push({
        id: Date.now(),
        ...formState,
      });
      message.success('用户创建成功');
    }
    closeModal();
  } catch (error) {
    // 校验未通过
  }
};

const handleDelete = (id: number) => {
  users.value = users.value.filter(u => u.id !== id);
  message.success('已删除该用户');
};
</script>
```
