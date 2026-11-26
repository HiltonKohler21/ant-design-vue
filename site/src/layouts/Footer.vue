<template>
  <footer id="footer">
    <div class="footer-wrap">
      <a-row :gutter="[32, 32]">
        <a-col :lg="6" :md="12" :sm="12" :xs="24">
          <div class="footer-center">
            <h2>{{ resolvedIsCN ? '相关资源' : 'Resources' }}</h2>
            <div class="footer-item">
              <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Ant Design</a>
              <span class="footer-item-desc">- React</span>
            </div>
            <div class="footer-item">
              <a href="https://antv.antgroup.com" target="_blank" rel="noopener noreferrer">AntV</a>
              <span class="footer-item-desc">
                - {{ resolvedIsCN ? '数据可视化' : 'Data Visualization' }}
              </span>
            </div>
            <div class="footer-item">
              <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">Vue.js</a>
              <span class="footer-item-desc">
                - {{ resolvedIsCN ? '渐进式框架' : 'Progressive Framework' }}
              </span>
            </div>
            <div class="footer-item">
              <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">Vite</a>
              <span class="footer-item-desc">
                - {{ resolvedIsCN ? '前端构建工具' : 'Next Gen Build Tool' }}
              </span>
            </div>
            <div class="footer-item">
              <a
                href="https://github.com/websemantics/awesome-ant-design"
                target="_blank"
                rel="noopener noreferrer"
              >
                Awesome Ant Design
              </a>
            </div>
          </div>
        </a-col>

        <a-col :lg="6" :md="12" :sm="12" :xs="24">
          <div class="footer-center">
            <h2>{{ resolvedIsCN ? '社区' : 'Community' }}</h2>
            <div class="footer-item">
              <a
                href="https://github.com/HiltonKohler21/ant-design-vue/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageOutlined class="footer-link-icon" />
                <span>{{ resolvedIsCN ? '讨论区' : 'Discussions' }}</span>
              </a>
            </div>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/docs/vue/changelog', resolvedIsCN)">
                <HistoryOutlined class="footer-link-icon" />
                <span>{{ resolvedIsCN ? '更新日志' : 'Change Log' }}</span>
              </router-link>
            </div>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/docs/vue/faq', resolvedIsCN)">
                <QuestionCircleOutlined class="footer-link-icon" />
                <span>{{ resolvedIsCN ? '常见问题' : 'FAQ' }}</span>
              </router-link>
            </div>
          </div>
        </a-col>

        <a-col :lg="6" :md="12" :sm="12" :xs="24">
          <div class="footer-center">
            <h2>{{ resolvedIsCN ? '帮助' : 'Help' }}</h2>
            <div class="footer-item">
              <a
                href="https://github.com/HiltonKohler21/ant-design-vue"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined class="footer-link-icon" />
                <span>GitHub</span>
              </a>
            </div>
            <div class="footer-item">
              <a
                href="https://github.com/HiltonKohler21/ant-design-vue/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IssuesCloseOutlined class="footer-link-icon" />
                <span>Issues</span>
              </a>
            </div>
            <div class="footer-item">
              <a
                href="https://github.com/HiltonKohler21/ant-design-vue/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BugOutlined class="footer-link-icon" />
                <span>{{ resolvedIsCN ? '报告 Bug' : 'Bug Report' }}</span>
              </a>
            </div>
            <div class="footer-item">
              <router-link :to="resolvedIsCN ? '/theme-editor-cn' : '/theme-editor'">
                <BgColorsOutlined class="footer-link-icon" />
                <span>{{ resolvedIsCN ? '主题编辑器' : 'Theme Editor' }}</span>
              </router-link>
            </div>
          </div>
        </a-col>

        <a-col :lg="6" :md="12" :sm="12" :xs="24">
          <div class="footer-center">
            <h2>{{ resolvedIsCN ? '生态与设计' : 'Ecosystem' }}</h2>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/components/overview', resolvedIsCN)">
                {{ resolvedIsCN ? '组件总览' : 'Components Overview' }}
              </router-link>
            </div>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/docs/vue/design', resolvedIsCN)">
                {{ resolvedIsCN ? '设计规范 (DESIGN.md)' : 'Design Specification' }}
              </router-link>
            </div>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/docs/vue/for-agents', resolvedIsCN)">
                {{ resolvedIsCN ? 'AI 智能体 & MCP' : 'For AI Agents & MCP' }}
              </router-link>
            </div>
            <div class="footer-item">
              <router-link :to="getLocalizedPathname('/docs/vue/download', resolvedIsCN)">
                {{ resolvedIsCN ? '设计资源下载' : 'Design Resources' }}
              </router-link>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="bottom-bar">
      <span>Made with</span>
      <span class="heart" aria-hidden="true">❤</span>
      <span>by</span>
      <a
        href="https://github.com/HiltonKohler21/ant-design-vue"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ant Design Vue
      </a>
      <span class="bottom-bar-sep">·</span>
      <span>v{{ antdVersion }}</span>
      <span class="bottom-bar-sep">·</span>
      <span>MIT Licensed</span>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { version as antdVersion } from '@hiltonkohler21/ant-design-vue';
import {
  BgColorsOutlined,
  BugOutlined,
  GithubOutlined,
  HistoryOutlined,
  IssuesCloseOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import type { GlobalConfig } from '../type';
import { getLocalizedPathname } from '../utils/util';

export default defineComponent({
  name: 'SiteFooter',
  components: {
    BgColorsOutlined,
    BugOutlined,
    GithubOutlined,
    HistoryOutlined,
    IssuesCloseOutlined,
    MessageOutlined,
    QuestionCircleOutlined,
  },
  props: {
    isCN: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props) {
    const globalConfig = inject<GlobalConfig | null>(GLOBAL_CONFIG, null);
    const resolvedIsCN = computed<boolean>(() => {
      if (props.isCN !== undefined) {
        return props.isCN;
      }
      return globalConfig?.isZhCN?.value ?? false;
    });

    return {
      antdVersion,
      resolvedIsCN,
      getLocalizedPathname,
    };
  },
});
</script>
