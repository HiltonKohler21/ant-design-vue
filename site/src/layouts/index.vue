<template>
  <Header />
  <div class="main-wrapper">
    <a-row>
      <template v-if="isMobile">
        <a-drawer
          key="mobile-menu"
          v-model:open="visible"
          :closable="false"
          :placement="direction === 'rtl' ? 'right' : 'left'"
          class="drawer drawer-left"
          wrapper-class-name="drawer-wrapper"
          width="260"
        >
          <Menu :menus="dataSource" :active-menu-item="activeMenuItem" :is-zh-c-n="isZhCN" />
        </a-drawer>
        <div
          class="drawer-handle"
          role="button"
          tabindex="0"
          :aria-label="isZhCN ? '切换菜单' : 'Toggle menu'"
          @click="handleClickShowButton"
        >
          <close-outlined v-if="visible" :style="iconStyle" />
          <MenuOutlined v-else :style="iconStyle" />
        </div>
      </template>
      <template v-else>
        <a-col :xxxl="4" :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24" class="main-menu">
          <section class="main-menu-inner">
            <Menu :menus="dataSource" :active-menu-item="activeMenuItem" :is-zh-c-n="isZhCN" />
          </section>
        </a-col>
      </template>
      <a-col
        :xxxl="20"
        :xxl="20"
        :xl="19"
        :lg="18"
        :md="18"
        :sm="24"
        :xs="24"
        class="main-content-col"
      >
        <div class="content-layout">
          <div class="content-body">
            <section :class="mainContainerClass">
              <Demo v-if="isDemo" :page-data="pageData" :is-zh-c-n="isZhCN">
                <component :is="matchCom" />
              </Demo>
              <router-view v-else />
            </section>
            <PrevAndNext
              :menus="menus"
              :current-menu-index="currentMenuIndex"
              :is-zh-c-n="isZhCN"
            />
          </div>
          <aside v-if="headers.length" class="toc-affix">
            <a-anchor
              :affix="false"
              :show-ink-in-fixed="true"
              :offset-top="80"
              :target-offset="80"
              :items="headers"
            />
          </aside>
        </div>
      </a-col>
    </a-row>
  </div>
  <a-back-top :visibility-height="300" :style="{ insetInlineEnd: '24px', bottom: '32px' }" />
  <Footer :is-c-n="isZhCN" />
</template>
<script lang="ts">
import { GLOBAL_CONFIG } from '../SymbolKey';
import { computed, defineComponent, inject, provide, ref, unref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './header/index.vue';
import Footer from './Footer.vue';
import Menu from './Menu.vue';
import PrevAndNext from './PrevAndNext.vue';
import Demo from './Demo.vue';
import useMenus from '../hooks/useMenus';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons-vue';
import type { GlobalConfig } from '../type';

const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;

export default defineComponent({
  name: 'Layout',
  components: {
    Demo,
    Header,
    Footer,
    Menu,
    PrevAndNext,
    CloseOutlined,
    MenuOutlined,
  },
  setup() {
    const route = useRoute();
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);

    const visible = ref(false);
    const { menus, activeMenuItem, currentMenuIndex, dataSource } = useMenus();

    const demos = ref<any[]>([]);
    const hasDesignTokens = ref(false);

    provide('addDemosInfo', (info: any) => {
      if (!info || !info.href) return;
      const idx = demos.value.findIndex(d => d.href === info.href);
      if (idx === -1) {
        demos.value.push(info);
      } else {
        demos.value[idx] = info;
      }
    });

    provide('setHasDesignTokens', (val: boolean) => {
      hasDesignTokens.value = !!val;
    });

    const baseRoutePath = computed(() => route.path.replace(/-cn\/?$/, '').replace(/\/$/, ''));

    // Only reset demos/design-tokens when navigating to a different base route
    // so switching zh-CN <-> en-US on the same page preserves the TOC.
    watch(baseRoutePath, () => {
      demos.value = [];
      hasDesignTokens.value = false;
    });

    watch(
      () => route.path,
      () => {
        visible.value = false;
      },
    );

    const isDemo = computed(() => {
      return (
        route.path.indexOf('/components') === 0 && route.path.indexOf('/components/overview') !== 0
      );
    });

    const matchCom = computed(() => {
      return route.matched[route.matched.length - 1]?.components?.default;
    });
    const isZhCN = globalConfig.isZhCN;
    const pageData = computed(() =>
      isDemo.value
        ? matchCom.value?.[isZhCN.value ? 'CN' : 'US']?.pageData
        : (matchCom.value as any)?.pageData,
    );

    const slugifyTitle = (str: string) => {
      return str
        .replace(rControl, '')
        .replace(rSpecial, '-')
        .replace(/\-{2,}/g, '-')
        .replace(/^\-+|\-+$/g, '')
        .replace(/^(\d)/, '_$1');
    };

    const headers = computed(() => {
      if (isDemo.value) {
        const demoItems = demos.value
          .map((demo, idx) => {
            const rawTitle = unref(demo.title);
            const rawEnTitle = unref(demo.enTitle);
            const titleText = String(
              (isZhCN.value ? rawTitle : rawEnTitle || rawTitle) || '',
            ).trim();
            const href = String(demo.href || '').toLocaleLowerCase();
            if (!href) return null;
            return {
              key: href || `demo-${idx}`,
              href,
              title: titleText || href.replace(/^#/, ''),
            };
          })
          .filter(Boolean) as Array<{ key: string; href: string; title: string }>;

        const items: Array<{ key: string; href: string; title: string; children?: any[] }> = [
          {
            key: '#examples',
            href: '#examples',
            title: isZhCN.value ? '代码演示' : 'Examples',
            ...(demoItems.length ? { children: demoItems } : {}),
          },
          {
            key: '#api',
            href: '#api',
            title: 'API',
          },
        ];

        if (hasDesignTokens.value) {
          items.push({
            key: '#design-tokens',
            href: '#design-tokens',
            title: isZhCN.value ? '主题变量' : 'Design Token',
          });
        }

        return items;
      }

      const docHeaders = (pageData.value?.headers || []).filter((h: any) => h.level === 2);
      return docHeaders.map((header: any, idx: number) => {
        const rawTitle = String(unref(header.title) || '');
        const rawEnTitle = header.enTitle ? String(unref(header.enTitle)) : '';
        const title = isZhCN.value ? rawTitle : rawEnTitle || rawTitle;
        const slug = header.slug || slugifyTitle(rawTitle);
        const href = (header.href || `#${slug}`).toLocaleLowerCase();
        return {
          key: `${href}-${idx}`,
          title,
          href,
        };
      });
    });

    const mainContainerClass = computed(() => {
      return {
        'main-container': true,
        'main-container-component': isDemo.value,
      };
    });

    const handleClickShowButton = () => {
      visible.value = !visible.value;
    };

    return {
      visible,
      isMobile: globalConfig.isMobile,
      direction: globalConfig.direction,
      isZhCN,
      mainContainerClass,
      menus,
      currentMenuIndex,
      activeMenuItem,
      headers,
      isDemo,
      matchCom,
      pageData,
      dataSource,
      handleClickShowButton,
      iconStyle: {
        fontSize: '18px',
      },
    };
  },
});
</script>
<style lang="less" scoped>
.toc-affix :deep(.ant-anchor-wrapper) {
  background: transparent;
  padding-inline-start: 4px;
  overflow: visible;
}

.toc-affix :deep(.ant-anchor) {
  width: 168px;
  font-size: 12px;

  .ant-anchor-link {
    padding-block: 4px;
    padding-inline: 14px 0;
  }

  .ant-anchor-link-title {
    color: var(--site-text-color-secondary);
    transition: color 0.2s;

    &:hover {
      color: var(--primary-color);
    }
  }

  .ant-anchor-link-title-active {
    color: var(--primary-color);
    font-weight: 500;
  }
}
</style>
