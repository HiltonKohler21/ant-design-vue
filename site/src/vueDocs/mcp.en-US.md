# Model Context Protocol (MCP) Integration

> Connect AI coding assistants (Claude Code, Cursor, Windsurf, Antigravity) directly to the Ant Design ecosystem using the Model Context Protocol (MCP) for offline, version-pinned component metadata, props, design tokens, and live demos.

---

## 1. What is Model Context Protocol (MCP)?

The **Model Context Protocol (MCP)** is an open standard that allows Large Language Models (LLMs) and IDE agents to interface securely with local development toolchains, documentation sources, and contextual databases.

Instead of scraping static web pages or relying on outdated training data, an MCP-enabled agent queries a local server in real time to fetch:
- Complete component property definitions, valid types, and default values.
- Design tokens and theme algorithms.
- Canonical code examples and demos.
- Version migration diffs and changelogs.

---

## 2. Setting Up the Official Ant Design MCP Server

The Ant Design ecosystem provides built-in stdio MCP server support through the official `@ant-design/cli` toolkit.

### Step 1: Install the CLI Globally
```bash
npm install -g @ant-design/cli
# Or with pnpm:
pnpm add -g @ant-design/cli
```

### Step 2: Automated Client Configuration
The CLI includes an interactive setup command that automatically configures your chosen AI client:

```bash
# For Claude Desktop / Claude Code
antd setup --client claude

# For Cursor
antd setup --client cursor --mode both
```

---

## 3. Manual Client Configuration

If you prefer to configure your client manually, add the MCP server definition to your configuration file:

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

### 3.2 Cursor (`.cursor/mcp.json` or Workspace Settings)
Create or edit `.cursor/mcp.json` in your project root:

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
Add to your extension's MCP configuration settings:

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

## 4. MCP Tools Reference

When connected, the MCP server provides your AI assistant with the following tools:

| MCP Tool Name | Description | Example Query |
| :--- | :--- | :--- |
| `antd_list` | Lists all available components and supported versions. | "List all data entry components in antd" |
| `antd_info` | Inspects exact props, TypeScript types, and default values for a component. | "What are the props and events for Table?" |
| `antd_doc` | Retrieves complete markdown documentation for a component. | "Show documentation for Form and FormItem" |
| `antd_demo` | Fetches runnable code demos. | "Show basic and modal usage demos for Button" |
| `antd_token` | Queries design tokens, seeds, maps, and aliases. | "What is the token name for button border radius?" |
| `antd_semantic` | Inspects class names and DOM structures for styling. | "What is the semantic class name for Card body?" |
| `antd_design_md` | Fetches the core design system specification. | "Get the design principles and color tokens" |
| `antd_changelog` | Queries API diffs and breaking changes across versions. | "What changed in Modal between v3 and v4?" |

---

## 5. Vue 3 Adaptation Guidelines for AI Agents

Because `@ant-design/cli` encapsulates the core Ant Design specification, AI agents must adapt the metadata to **Vue 3 SFC conventions**:

### 1. Events and Event Listeners
- React MCP tool signature: `onChange?: (value: any) => void`
- **Vue 3 implementation**: `@change="handleChange"` or two-way binding `v-model:value="formState.value"`.

### 2. Slots vs Render Props
- React MCP tool signature: `title?: ReactNode`, `icon?: ReactNode`, `extra?: ReactNode`
- **Vue 3 implementation**: Template slots:
  ```vue
  <a-card>
    <template #title>Custom Card Title</template>
    <template #extra><a-button type="link">More</a-button></template>
    Card content
  </a-card>
  ```

### 3. Table Scoped Slots
- React MCP tool signature: `render: (text, record, index) => ...`
- **Vue 3 implementation**: `#bodyCell="{ column, record, text }"`:
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

### 4. Visibility Control
- React MCP tool signature: `open?: boolean` (or legacy `visible`)
- **Vue 3 implementation**: `v-model:open="isOpen"` on `Modal`, `Drawer`, `Tooltip`, etc.

---

## 6. Practical Agent Workflow Recipes

### Recipe 1: Generating Validated Forms from Schema
Ask your AI assistant:
> "Use `antd_info` on Form and Input to generate a Vue 3 `<script setup lang="ts">` registration form with name, email, and password fields, using `v-model:value` and `Form.useForm()`."

### Recipe 2: Querying Design Tokens for Custom Components
Ask your AI assistant:
> "Use `antd_token` to inspect `colorBgContainer`, `borderRadius`, and `boxShadowSecondary`. Write a Vue 3 custom card component using `theme.useToken()` that reflects those exact tokens."

### Recipe 3: Checking Version Compatibility
Ask your AI assistant:
> "Use `antd_changelog` to check how Modal visibility properties changed from v3 to v4. Refactor this Vue component from `v-model:visible` to `v-model:open`."
