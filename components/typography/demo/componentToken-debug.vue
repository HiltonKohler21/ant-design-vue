<docs>
---
order: 12
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

自定义组件 Token。

## en-US

Custom component token.
</docs>
<template>
  <a-config-provider :theme="theme">
    <a-typography>
      <a-typography-title>Introduction</a-typography-title>
      <a-typography-paragraph>
        After massive project practice and summaries, Ant Design, a design language for background
        applications, is refined by Ant UED Team, which aims to
        <a-typography-text strong>
          uniform the user interface specs for internal background projects, lower the unnecessary
          cost of design differences and implementation and liberate the resources of design and
          front-end development
        </a-typography-text>
        .
      </a-typography-paragraph>
      <a-typography-title :level="2">Guidelines and Resources</a-typography-title>
      <a-typography-paragraph>
        We supply a series of design principles, practical patterns and high quality design
        resources (
        <a-typography-text code>Sketch</a-typography-text>
        and
        <a-typography-text code>Axure</a-typography-text>
        ), to help people create their product prototypes beautifully and efficiently.
      </a-typography-paragraph>

      <a-typography-paragraph>
        <ul>
          <li>
            <a-typography-link href="/docs/spec/proximity">Principles</a-typography-link>
          </li>
          <li>
            <a-typography-link href="/docs/spec/overview">Patterns</a-typography-link>
          </li>
          <li>
            <a-typography-link href="/docs/resources">Resource Download</a-typography-link>
          </li>
        </ul>
      </a-typography-paragraph>

      <a-typography-paragraph>
        Press
        <a-typography-text keyboard>Esc</a-typography-text>
        to exit...
      </a-typography-paragraph>

      <a-divider />

      <a-typography-title>介绍</a-typography-title>
      <a-typography-paragraph>
        随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标，我们（蚂蚁集团体验技术部）经过大量的项目实践和总结，逐步打磨出一个服务于企业级产品的设计体系
        Ant Design。基于
        <a-typography-text mark>『确定』和『自然』</a-typography-text>
        的设计价值观，通过模块化的解决方案，降低冗余的生产成本，让设计者专注于
        <a-typography-text strong>更好的用户体验</a-typography-text>
        。
      </a-typography-paragraph>
      <a-typography-title :level="2">设计资源</a-typography-title>
      <a-typography-paragraph>
        我们提供完善的设计原则、最佳实践和设计资源文件（
        <a-typography-text code>Sketch</a-typography-text>
        和
        <a-typography-text code>Axure</a-typography-text>
        ），来帮助业务快速设计出高质量的产品原型。
      </a-typography-paragraph>

      <a-typography-paragraph>
        <ul>
          <li>
            <a-typography-link href="/docs/spec/proximity-cn">设计原则</a-typography-link>
          </li>
          <li>
            <a-typography-link href="/docs/spec/overview-cn">设计模式</a-typography-link>
          </li>
          <li>
            <a-typography-link href="/docs/resources-cn">设计资源</a-typography-link>
          </li>
        </ul>
      </a-typography-paragraph>

      <a-typography-paragraph>
        <blockquote>{{ blockContent }}</blockquote>
        <pre>{{ blockContent }}</pre>
      </a-typography-paragraph>

      <a-typography-paragraph>
        按
        <a-typography-text keyboard>Esc</a-typography-text>
        键退出阅读……
      </a-typography-paragraph>
    </a-typography>

    <a-typography-text type="success">Success but red</a-typography-text>
    <a-typography-text type="warning">Warning but green</a-typography-text>
    <a-typography-text type="danger">Danger but blue</a-typography-text>
  </a-config-provider>
</template>
<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const blockContent = `AntV 是蚂蚁集团全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、不限可能的数据可视化最佳实践。得益于丰富的业务场景和用户需求挑战，AntV 经历多年积累与不断打磨，已支撑整个阿里集团内外 20000+ 业务系统，通过了日均千万级 UV 产品的严苛考验。
我们正在基础图表，图分析，图编辑，地理空间可视化，智能可视化等各个可视化的领域耕耘，欢迎同路人一起前行。`;

const theme: ConfigProviderProps['theme'] = {
  components: {
    Typography: {
      fontWeightStrong: 700,
      titleMarginTop: '2.4em',
      titleMarginBottom: '1em',
      colorSuccessText: '#FF0000',
      colorWarningText: '#00FF00',
      colorErrorText: '#0000FF',
    },
  },
};
</script>
