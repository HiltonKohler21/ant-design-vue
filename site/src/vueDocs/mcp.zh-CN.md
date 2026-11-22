# Model Context Protocol (MCP) 智能体协议集成

> 通过 Model Context Protocol (MCP)，将各类 AI 编码助手（Claude Code, Cursor, Windsurf, Antigravity）直接接入 Ant Design 生态，为智能体提供本地离线、版本锁定的组件元数据、属性类型、设计 Token 及代码示例。

---

## 1. 什么是 Model Context Protocol (MCP)？

**Model Context Protocol (MCP)** 是由模型厂商与开源社区共同推动的开放上下文交互协议。它允许大语言模型（LLM）与 IDE 编程工具安全高效地与本地开发环境、文档源和工具链进行双向通信。

相较于传统的在线网页爬取或易受训练时滞影响的静态大模型记忆，启用 MCP 的智能体可在本地实时查询：
- 准确的组件 Props 列表、TypeScript 泛型、默认值与事件签名。
- Design Token 架构与多套主题算法。
- 经过实际验证的可运行组件 Demo 源码。
- 跨版本升级差异与变更日志（Changelog）。

---

## 2. 快速配置官方 Ant Design MCP 服务

Ant Design 官方通过 `@ant-design/cli` 提供了基于标准 stdio 的内置 MCP 服务支持。

### 步骤 1：全局安装 CLI
```bash
npm install -g @ant-design/cli
# 或者使用 pnpm
pnpm add -g @ant-design/cli
```

### 步骤 2：自动配置客户端
安装完成后，可通过内置的交互式指令自动为你的 IDE 或终端客户端完成配置：

```bash
# 为 Claude Desktop / Claude Code 配置
antd setup --client claude

# 为 Cursor 配置
antd setup --client cursor --mode both
```

---

## 3. 手动配置各类 AI 客户端

你也可以在各客户端的配置文件中直接声明 MCP 服务：

### 3.1 Claude Desktop (`claude_desktop_config.json`)
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ant-design": {
      "command": "antd",
      "args": ["mcp"]
    }
  }
}
```

### 3.2 Cursor (`.cursor/mcp.json` 或 工作区设置)
在项目根目录下新建或修改 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "ant-design": {
      "command": "antd",
      "args": ["mcp"]
    }
  }
}
```

### 3.3 VS Code (Cline / Roo Code / Continue)
在插件的 MCP 设置面板中添加：

```json
{
  "mcpServers": {
    "ant-design": {
      "command": "antd",
      "args": ["mcp"]
    }
  }
}
```

---

## 4. MCP 工具清单与功能说明

连接成功后，AI 智能体将获得以下 8 个强大的上下文工具：

| 工具名称 | 功能描述 | 智能体典型调用指令 |
| :--- | :--- | :--- |
| `antd_list` | 列出全部组件库组件及其支持的版本 | "查询 antdv 支持的所有数据录入类组件" |
| `antd_info` | 查询特定组件的详细 Props、TS 类型定义与默认值 | "查询 Table 组件支持的全部属性与事件" |
| `antd_doc` | 获取组件完整的 Markdown 官方文档 | "获取 Form 和 FormItem 的完整使用文档" |
| `antd_demo` | 获取可直接运行的代码示例源码 | "获取 Button 的基础用法和加载状态 Demo" |
| `antd_token` | 查询 Design Token、种子变量、派生变量及别名 | "查询与按钮圆角和主色相关的 Token 名称" |
| `antd_semantic` | 查询组件的语义化类名与内部 DOM 结构 | "查询 Card 组件内部 body 区域的类名结构" |
| `antd_design_md` | 获取核心设计系统规范文件 | "查询 Ant Design 的四项核心设计价值观与栅格标准" |
| `antd_changelog` | 查询跨版本变更记录与破坏性变更说明 | "查询 Modal 组件在升级 v4 时废弃了哪些属性" |

---

## 5. AI 智能体在 Vue 3 项目中的适配指引

由于 `@ant-design/cli` 的规范源自 Ant Design 基础规范，AI 在为 Vue 3 项目生成代码时需执行以下语法转换：

### 1. 事件绑定语法转换
- MCP 原始签名：`onChange?: (value: any) => void`
- **Vue 3 规范写法**：使用 `@change="handleChange"` 或双向绑定 `v-model:value="state.val"`。

### 2. 插槽与渲染函数转换
- MCP 原始签名：`title?: ReactNode`、`icon?: ReactNode`、`extra?: ReactNode`
- **Vue 3 规范写法**：使用 Vue 3 SFC 具名插槽：
  ```vue
  <a-card>
    <template #title>自定义标题</template>
    <template #extra><a-button type="link">更多</a-button></template>
    卡片正文内容
  </a-card>
  ```

### 3. 表格自定义单元格渲染
- MCP 原始签名：`render: (text, record, index) => ...`
- **Vue 3 规范写法**：统一使用 `#bodyCell="{ column, record }"`：
  ```vue
  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status }}
        </a-tag>
      </template>
    </template>
  </a-table>
  ```

### 4. 浮层可见性状态
- MCP 原始签名：`open?: boolean` (或旧版 `visible`)
- **Vue 3 规范写法**：对于 Modal、Drawer、Popover 等，统一使用 `v-model:open="isOpen"`。

---

## 6. 典型智能体提效工作流 (Recipes)

### 场景 1：精准生成带表单校验的 Vue 3 组件
向 AI 助手提问：
> “使用 `antd_info` 查询 Form 和 Input 的属性，生成一个包含用户名、邮箱和密码的 Vue 3 `<script setup lang="ts">` 表单，使用 `v-model:value` 和校验规则，并使用 `<a-app>` 下的 `App.useApp()` 显示提交成功提示。”

### 场景 2：根据 Design Token 生成自适应组件
向 AI 助手提问：
> “调用 `antd_token` 检查 `colorBgContainer`、`borderRadius` 和 `boxShadowSecondary`。使用 `theme.useToken()` 编写一个自适应当前主题样式的 Vue 3 卡片组件。”

### 场景 3：检查过时属性并一键重构
向 AI 助手提问：
> “调用 `antd_changelog` 检查 Modal 属性在升级时的变化。将当前代码中的 `v-model:visible` 全部重构成规范的 `v-model:open`。”
