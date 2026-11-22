<template>
  <section class="markdown">
    <h1>{{ isZhCN ? '组件总览' : 'Overview' }}</h1>
    <section class="markdown">
      <p>
        <code>ant-design-vue</code>
        {{
          isZhCN
            ? '为 Web 应用提供了丰富的基础 UI 组件，我们还将持续探索企业级应用的最佳 UI 实践。'
            : 'provides plenty of UI components to enrich your web applications, and we will improve components experience consistently. '
        }}
      </p>
    </section>
    <a-divider />
    <template v-for="group in menuItems" :key="group.title">
      <div class="components-overview">
        <h2 class="ant-typography components-overview-group-title">
          <a-space align="center">
            {{ isZhCN ? group.title : group.enTitle }}
            <a-tag :bordered="false" color="processing" class="components-overview-tag">
              {{ group.children.length }}
            </a-tag>
          </a-space>
        </h2>
        <a-row :gutter="[24, 24]">
          <template v-for="component in group.children" :key="component.title">
            <a-col :xs="24" :sm="12" :lg="8" :xl="6">
              <component
                :is="component.target ? 'a' : 'router-link'"
                v-bind="
                  component.target
                    ? { href: component.path, target: component.target }
                    : { to: getLocalizedPathname(component.path, isZhCN) }
                "
              >
                <a-card size="small" class="components-overview-card">
                  <template #title>
                    <div class="components-overview-title">
                      <span class="components-overview-en">{{ component.title }}</span>
                      <span v-if="isZhCN && component.subtitle" class="components-overview-cn">
                        {{ component.subtitle }}
                      </span>
                    </div>
                  </template>
                  <div class="components-overview-img">
                    <img :src="component.cover" :alt="component.title" />
                  </div>
                </a-card>
              </component>
            </a-col>
          </template>
        </a-row>
      </div>
    </template>
  </section>
</template>
<script lang="ts">
import type { GlobalConfig } from '../type';
import { computed, defineComponent, inject } from 'vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import { getLocalizedPathname } from '../utils/util';
import useMenus from '../hooks/useMenus';

export default defineComponent({
  name: 'ComponentOverview',
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const { dataSource } = useMenus();

    const menuItems = computed(() => {
      return (dataSource.value || []).filter(i => i.order !== -1);
    });

    return {
      isZhCN: globalConfig.isZhCN,
      getLocalizedPathname,
      menuItems,
    };
  },
});
</script>
<style lang="less" src="./ComponentOverview.less"></style>
