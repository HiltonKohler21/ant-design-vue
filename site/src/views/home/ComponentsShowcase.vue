<template>
  <section class="home-section home-components-section">
    <div class="home-container">
      <div class="home-section-header">
        <h2 class="home-section-title">
          {{ isZhCN ? '组件丰富，选用自如' : 'Rich components, ready to use' }}
        </h2>
        <p class="home-section-subtitle">
          {{
            isZhCN
              ? '覆盖 75 个企业级中后台组件，4.3.0 全新带来 Masonry、BorderBeam、Listy、Splitter 与 ColorPicker 等现代能力'
              : '75 enterprise-grade components, featuring Masonry, BorderBeam, Listy, Splitter, and ColorPicker in 4.3.0'
          }}
        </p>
      </div>

      <a-row :gutter="[20, 20]">
        <!-- 1. Masonry -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/masonry', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">Masonry</span>
                <span v-if="isZhCN" class="home-comp-card-cn">瀑布流</span>
              </div>
              <a-tag color="blue" :bordered="false" class="home-comp-badge">4.3.0</a-tag>
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/masonry', isZhCN)"
              class="home-comp-preview"
            >
              <a-masonry :items="masonryItems" :columns="3" :gutter="6" style="width: 100%">
                <template #item="{ item }">
                  <div
                    class="mini-masonry-tile"
                    :style="{ height: `${item.height}px`, background: item.bg }"
                  />
                </template>
              </a-masonry>
            </router-link>
          </div>
        </a-col>

        <!-- 2. BorderBeam -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/border-beam', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">BorderBeam</span>
                <span v-if="isZhCN" class="home-comp-card-cn">边框光束</span>
              </div>
              <a-tag color="purple" :bordered="false" class="home-comp-badge">4.3.0</a-tag>
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/border-beam', isZhCN)"
              class="home-comp-preview"
            >
              <a-border-beam :duration="4" :line-width="2" color="#1677ff">
                <div class="mini-beam-box">
                  <ThunderboltOutlined class="mini-beam-icon" />
                  <span>{{ isZhCN ? '光束动效卡片' : 'Animated Beam' }}</span>
                </div>
              </a-border-beam>
            </router-link>
          </div>
        </a-col>

        <!-- 3. ColorPicker -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/color-picker', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">ColorPicker</span>
                <span v-if="isZhCN" class="home-comp-card-cn">颜色选择器</span>
              </div>
              <a-tag color="cyan" :bordered="false" class="home-comp-badge">New</a-tag>
            </router-link>
            <div class="home-comp-preview home-comp-preview-interactive">
              <div class="mini-color-wrap">
                <a-color-picker v-model:value="sampleColor" show-text />
                <div class="mini-color-dots">
                  <button
                    v-for="c in ['#1677ff', '#722ed1', '#00b96b', '#fa8c16']"
                    :key="c"
                    type="button"
                    class="mini-color-dot"
                    :style="{ background: c }"
                    :aria-label="c"
                    @click="sampleColor = c"
                  />
                </div>
              </div>
            </div>
          </div>
        </a-col>

        <!-- 4. Splitter -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/splitter', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">Splitter</span>
                <span v-if="isZhCN" class="home-comp-card-cn">分隔面板</span>
              </div>
              <a-tag color="green" :bordered="false" class="home-comp-badge">New</a-tag>
            </router-link>
            <div class="home-comp-preview home-comp-preview-interactive">
              <a-splitter class="mini-splitter">
                <a-splitter-panel default-size="45%" min="25%">
                  <div class="mini-splitter-pane">A</div>
                </a-splitter-panel>
                <a-splitter-panel>
                  <div class="mini-splitter-pane">B</div>
                </a-splitter-panel>
              </a-splitter>
            </div>
          </div>
        </a-col>

        <!-- 5. Listy -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/listy', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">Listy</span>
                <span v-if="isZhCN" class="home-comp-card-cn">虚拟列表</span>
              </div>
              <a-tag color="geekblue" :bordered="false" class="home-comp-badge">4.3.0</a-tag>
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/listy', isZhCN)"
              class="home-comp-preview"
            >
              <a-listy
                :items="listyItems"
                row-key="key"
                :item-render="renderListyItem"
                class="mini-listy"
              />
            </router-link>
          </div>
        </a-col>

        <!-- 6. QRCode -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/qrcode', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">QRCode</span>
                <span v-if="isZhCN" class="home-comp-card-cn">二维码</span>
              </div>
              <ArrowRightOutlined class="home-comp-arrow" />
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/qrcode', isZhCN)"
              class="home-comp-preview"
            >
              <a-qrcode
                type="svg"
                value="https://hiltonkohler21.github.io/ant-design-vue"
                :size="92"
                :bordered="false"
                bg-color="transparent"
              />
            </router-link>
          </div>
        </a-col>

        <!-- 7. Table -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/table', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">Table</span>
                <span v-if="isZhCN" class="home-comp-card-cn">表格</span>
              </div>
              <ArrowRightOutlined class="home-comp-arrow" />
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/table', isZhCN)"
              class="home-comp-preview"
            >
              <div class="mini-table">
                <div class="mini-table-row mini-table-head">
                  <span class="c1" />
                  <span class="c2" />
                  <span class="c3" />
                </div>
                <div class="mini-table-row">
                  <span class="c1" />
                  <span class="c2 pill primary" />
                  <span class="c3" />
                </div>
                <div class="mini-table-row">
                  <span class="c1" />
                  <span class="c2 pill success" />
                  <span class="c3" />
                </div>
                <div class="mini-table-row">
                  <span class="c1" />
                  <span class="c2 pill warning" />
                  <span class="c3" />
                </div>
              </div>
            </router-link>
          </div>
        </a-col>

        <!-- 8. Form -->
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="home-comp-card">
            <router-link
              :to="getLocalizedPathname('/components/form', isZhCN)"
              class="home-comp-card-head"
            >
              <div class="home-comp-card-titles">
                <span class="home-comp-card-name">Form</span>
                <span v-if="isZhCN" class="home-comp-card-cn">表单</span>
              </div>
              <ArrowRightOutlined class="home-comp-arrow" />
            </router-link>
            <router-link
              :to="getLocalizedPathname('/components/form', isZhCN)"
              class="home-comp-preview"
            >
              <div class="mini-form">
                <div class="mini-form-item">
                  <span class="mini-form-label" />
                  <span class="mini-form-input active" />
                </div>
                <div class="mini-form-item">
                  <span class="mini-form-label short" />
                  <span class="mini-form-input" />
                </div>
                <div class="mini-form-actions">
                  <span class="mini-form-btn primary" />
                  <span class="mini-form-btn" />
                </div>
              </div>
            </router-link>
          </div>
        </a-col>
      </a-row>

      <div class="home-components-footer">
        <router-link :to="getLocalizedPathname('/components/overview', isZhCN)">
          <a-button size="large" shape="round">
            {{ isZhCN ? '查看全部 75 个组件' : 'Explore All 75 Components' }}
            <ArrowRightOutlined />
          </a-button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { ArrowRightOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
import { getLocalizedPathname } from '../../utils/util';

defineProps<{
  isZhCN: boolean;
}>();

const sampleColor = ref('#1677ff');

const masonryItems = [
  { key: '1', height: 28, bg: 'var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))' },
  { key: '2', height: 42, bg: 'var(--ant-color-primary, #1677ff)' },
  { key: '3', height: 32, bg: 'var(--ant-color-fill-secondary, rgba(0, 0, 0, 0.08))' },
  { key: '4', height: 40, bg: 'var(--ant-color-fill-secondary, rgba(0, 0, 0, 0.08))' },
  { key: '5', height: 26, bg: 'var(--ant-color-primary-border, rgba(22, 119, 255, 0.35))' },
  { key: '6', height: 36, bg: 'var(--ant-color-primary-bg, rgba(22, 119, 255, 0.16))' },
];

const listyItems = [
  { key: '1', label: 'CSS Variables', badge: '4.3.0' },
  { key: '2', label: 'Zero Runtime', badge: 'SSR' },
  { key: '3', label: 'Virtual Scroll', badge: 'Fast' },
];

const renderListyItem = (item: { key: string; label: string; badge: string }) =>
  h('div', { class: 'mini-listy-row' }, [
    h('span', { class: 'mini-listy-label' }, item.label),
    h('span', { class: 'mini-listy-tag' }, item.badge),
  ]);
</script>
