<template>
  <section class="home-section home-framework-section">
    <div class="home-container">
      <div class="home-section-header">
        <h2 class="home-section-title">
          {{ isZhCN ? '设计语言与研发框架' : 'Design language and framework' }}
        </h2>
        <p class="home-section-subtitle">
          {{
            isZhCN
              ? '配套完整的设计价值观、工程规范、AI 协作协议与 CSS Variables 主题架构，助力团队高效交付'
              : 'Complete design values, engineering spec, AI/MCP protocol, and CSS Variables architecture for teams'
          }}
        </p>
      </div>

      <a-row :gutter="[24, 24]">
        <!-- 1. Design Values -->
        <a-col :xs="24" :md="12">
          <router-link
            :to="getLocalizedPathname('/docs/vue/design', isZhCN)"
            class="home-framework-card card-values"
          >
            <div class="home-framework-card-icon">
              <CompassOutlined />
            </div>
            <div class="home-framework-card-content">
              <h3>{{ isZhCN ? '设计价值观' : 'Design Values' }}</h3>
              <p>
                {{
                  isZhCN
                    ? '基于「自然、确定、意义、生长」四大企业级设计价值观，构建直觉高效的产品体验。'
                    : 'Built on four enterprise design values — Natural, Certain, Meaningful, and Growing.'
                }}
              </p>
              <div class="home-framework-pillars">
                <span v-for="pillar in pillars" :key="pillar.en" class="home-framework-pillar">
                  {{ isZhCN ? pillar.zh : pillar.en }}
                </span>
              </div>
              <span class="home-framework-link">
                {{ isZhCN ? '了解设计价值观' : 'Explore values' }}
                <ArrowRightOutlined />
              </span>
            </div>
          </router-link>
        </a-col>

        <!-- 2. Design Spec (DESIGN.md) -->
        <a-col :xs="24" :md="12">
          <router-link
            :to="getLocalizedPathname('/docs/vue/design', isZhCN)"
            class="home-framework-card card-spec"
          >
            <div class="home-framework-card-icon">
              <BookOutlined />
            </div>
            <div class="home-framework-card-content">
              <div class="home-framework-title-row">
                <h3>{{ isZhCN ? '设计规范' : 'Design Specification' }}</h3>
                <a-tag color="blue" :bordered="false">DESIGN.md</a-tag>
              </div>
              <p>
                {{
                  isZhCN
                    ? '标准化的色彩体系、字体阶梯、8px 空间网格与组件交互规范，人类与 AI 皆可直接读取。'
                    : 'Standardized color scales, typography hierarchy, 8px spacing grid, and interaction patterns.'
                }}
              </p>
              <span class="home-framework-link">
                {{ isZhCN ? '阅读 DESIGN.md 规范' : 'Read DESIGN.md' }}
                <ArrowRightOutlined />
              </span>
            </div>
          </router-link>
        </a-col>

        <!-- 3. AI & MCP -->
        <a-col :xs="24" :md="12">
          <div class="home-framework-card card-ai">
            <div class="home-framework-card-icon">
              <RobotOutlined />
            </div>
            <div class="home-framework-card-content">
              <div class="home-framework-title-row">
                <h3>{{ isZhCN ? 'AI 智能体与 MCP' : 'AI & MCP Ecosystem' }}</h3>
                <a-tag color="purple" :bordered="false">For Agents</a-tag>
              </div>
              <p>
                {{
                  isZhCN
                    ? '内置 llms.txt 索引与标准 MCP Server，让 Cursor、Claude 等 AI 编程助手精准生成高质量 Ant Design Vue 代码。'
                    : 'Built-in llms.txt index and MCP Server enabling Cursor, Claude, and AI agents to craft accurate UI code.'
                }}
              </p>
              <div class="home-framework-links-row">
                <router-link
                  :to="getLocalizedPathname('/docs/vue/for-agents', isZhCN)"
                  class="home-framework-link"
                >
                  {{ isZhCN ? 'For Agents 指南' : 'For Agents Guide' }}
                  <ArrowRightOutlined />
                </router-link>
                <router-link
                  :to="getLocalizedPathname('/docs/vue/mcp', isZhCN)"
                  class="home-framework-link subtle"
                >
                  MCP Server
                  <ArrowRightOutlined />
                </router-link>
              </div>
            </div>
          </div>
        </a-col>

        <!-- 4. CSS-in-JS / CSS Variables + Zero Runtime -->
        <a-col :xs="24" :md="12">
          <router-link
            :to="getLocalizedPathname('/docs/vue/customize-theme', isZhCN)"
            class="home-framework-card card-cssvar"
          >
            <div class="home-framework-card-icon">
              <BgColorsOutlined />
            </div>
            <div class="home-framework-card-content">
              <div class="home-framework-title-row">
                <h3>{{ isZhCN ? 'CSS Variables 与零运行时' : 'CSS Variables & Zero Runtime' }}</h3>
                <a-tag color="cyan" :bordered="false">4.3.0</a-tag>
              </div>
              <p>
                {{
                  isZhCN
                    ? '4.3.0 默认开启组件级 Design Token 与原生 --ant-* CSS 变量体系，支持毫秒级主题切换、零运行时模式与静态样式抽取。'
                    : 'Enabled by default in 4.3.0: component Design Tokens with native --ant-* CSS variables for instant theme switching, zero-runtime mode, and static CSS extraction.'
                }}
              </p>
              <span class="home-framework-link">
                {{ isZhCN ? '定制主题文档' : 'Customize Theme' }}
                <ArrowRightOutlined />
              </span>
            </div>
          </router-link>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  ArrowRightOutlined,
  BgColorsOutlined,
  BookOutlined,
  CompassOutlined,
  RobotOutlined,
} from '@ant-design/icons-vue';
import { getLocalizedPathname } from '../../utils/util';

defineProps<{
  isZhCN: boolean;
}>();

const pillars = [
  { zh: '自然', en: 'Natural' },
  { zh: '确定', en: 'Certain' },
  { zh: '意义', en: 'Meaningful' },
  { zh: '生长', en: 'Growing' },
];
</script>
