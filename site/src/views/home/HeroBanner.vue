<template>
  <section class="home-hero">
    <div class="home-hero-backdrop" aria-hidden="true">
      <div class="home-hero-mesh home-hero-mesh-1" />
      <div class="home-hero-mesh home-hero-mesh-2" />
      <div class="home-hero-mesh home-hero-mesh-3" />
      <div class="home-hero-grid" />
    </div>

    <div class="home-container home-hero-inner">
      <router-link
        :to="getLocalizedPathname('/docs/vue/customize-theme', isZhCN)"
        class="home-hero-badge"
      >
        <span class="home-hero-badge-dot" />
        <span>Ant Design Vue {{ antdVersion }} · CSS Variables</span>
        <RightOutlined class="home-hero-badge-arrow" />
      </router-link>

      <h1 class="home-hero-title">
        <span>Ant Design</span>
        <span class="home-hero-title-accent">Vue</span>
      </h1>

      <p class="home-hero-desc">
        {{
          isZhCN
            ? '助力设计开发者「更灵活」地搭建出「更美」的产品，让用户「快乐工作」～'
            : 'Help designers/developers building beautiful products more flexible and working with happiness'
        }}
      </p>

      <div class="home-hero-actions">
        <router-link :to="getLocalizedPathname('/docs/vue/introduce', isZhCN)">
          <a-button type="primary" size="large" shape="round" class="home-hero-btn-primary">
            {{ isZhCN ? '开始使用' : 'Getting Started' }}
            <ArrowRightOutlined />
          </a-button>
        </router-link>

        <router-link :to="getLocalizedPathname('/docs/vue/design', isZhCN)">
          <a-button size="large" shape="round" class="home-hero-btn-secondary">
            {{ isZhCN ? '设计语言' : 'Design Language' }}
          </a-button>
        </router-link>

        <router-link :to="getLocalizedPathname('/components/overview', isZhCN)">
          <a-button size="large" shape="round" class="home-hero-btn-ghost">
            <AppstoreOutlined />
            {{ isZhCN ? '组件总览' : 'Components' }}
          </a-button>
        </router-link>
      </div>

      <div class="home-hero-highlights">
        <div v-for="item in highlights" :key="item.key" class="home-hero-highlight-pill">
          <component :is="item.icon" class="home-hero-highlight-icon" />
          <span>{{ isZhCN ? item.zh : item.en }}</span>
        </div>
      </div>

      <div class="home-hero-visual" aria-hidden="true">
        <div class="home-hero-orbit home-hero-orbit-left">
          <div class="home-hero-float-card">
            <span class="home-hero-float-dot primary" />
            <div class="home-hero-float-lines">
              <span class="line w-70" />
              <span class="line w-45 subtle" />
            </div>
          </div>
          <div class="home-hero-float-chip">
            <code>--ant-color-primary</code>
          </div>
        </div>

        <div class="home-hero-emblem">
          <div class="home-hero-emblem-ring ring-outer" />
          <div class="home-hero-emblem-ring ring-inner" />
          <div class="home-hero-emblem-core">
            <img :src="logo" alt="" class="home-hero-emblem-logo" />
          </div>
        </div>

        <div class="home-hero-orbit home-hero-orbit-right">
          <div class="home-hero-float-chip accent">
            <span>v{{ antdVersion }}</span>
          </div>
          <div class="home-hero-float-card">
            <div class="home-hero-float-bars">
              <span class="bar b1" />
              <span class="bar b2" />
              <span class="bar b3" />
              <span class="bar b4" />
            </div>
            <div class="home-hero-float-lines">
              <span class="line w-60" />
              <span class="line w-40 subtle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { version as antdVersion } from 'ant-design-vue';
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  BgColorsOutlined,
  CodeOutlined,
  RightOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';
import logo from '../../assets/logo.svg';
import { getLocalizedPathname } from '../../utils/util';

defineProps<{
  isZhCN: boolean;
}>();

const highlights = computed(() => [
  {
    key: 'components',
    icon: AppstoreOutlined,
    zh: '75 个企业级组件',
    en: '75 Enterprise Components',
  },
  {
    key: 'cssvar',
    icon: BgColorsOutlined,
    zh: '默认 CSS Variables · 零运行时',
    en: 'CSS Variables & Zero-Runtime',
  },
  {
    key: 'new',
    icon: ThunderboltOutlined,
    zh: 'BorderBeam · Splitter · Masonry',
    en: 'BorderBeam · Splitter · Masonry',
  },
  {
    key: 'ts',
    icon: CodeOutlined,
    zh: 'Vue 3 + TypeScript',
    en: 'Vue 3 + TypeScript',
  },
  {
    key: 'ai',
    icon: RobotOutlined,
    zh: 'AI & MCP 友好',
    en: 'AI & MCP Ready',
  },
]);
</script>
