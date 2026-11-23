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
            <section ref="mainContainerRef" :class="mainContainerClass">
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
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  provide,
  ref,
  unref,
  watch,
} from 'vue';
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

type TocItem = {
  key: string;
  href: string;
  title: string;
  children?: TocItem[];
};

const extractHeadingText = (el: Element | null): string => {
  if (!el) return '';
  const clone = el.cloneNode(true) as Element;
  clone
    .querySelectorAll('.anchor, .header-anchor, [aria-hidden="true"]')
    .forEach(node => node.remove());
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
};

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

    const mainContainerRef = ref<HTMLElement | null>(null);
    const demos = ref<any[]>([]);
    const hasDesignTokens = ref(false);
    const domApiSections = ref<TocItem[]>([]);
    const domSemanticItem = ref<TocItem | null>(null);

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
      domApiSections.value = [];
      domSemanticItem.value = null;
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

    const buildApiSectionsFromHeaders = (rawHeaders: any[]): TocItem[] => {
      if (!Array.isArray(rawHeaders) || rawHeaders.length === 0) return [];
      const apiStartIdx = rawHeaders.findIndex(h => {
        if (!h || h.level !== 2) return false;
        const slug = String(h.slug || '').toLowerCase();
        const title = String(unref(h.title) || '')
          .trim()
          .toLowerCase();
        return slug === 'api' || title === 'api';
      });
      if (apiStartIdx === -1) return [];

      const sections: TocItem[] = [];
      const seen = new Set<string>();
      let currentH2: TocItem | null = null;

      for (let i = apiStartIdx; i < rawHeaders.length; i += 1) {
        const header = rawHeaders[i];
        if (!header || (header.level !== 2 && header.level !== 3)) continue;
        const title = String(unref(header.title) || '').trim();
        if (!title) continue;
        const slug = String(header.slug || slugifyTitle(title)).trim();
        if (!slug) continue;
        const href = `#${slug}`;
        const lowerHref = href.toLowerCase();
        if (seen.has(lowerHref)) continue;
        seen.add(lowerHref);

        const item: TocItem = {
          key: href,
          href,
          title,
        };

        if (header.level === 2) {
          sections.push(item);
          currentH2 = item;
        } else if (currentH2) {
          if (!currentH2.children) {
            currentH2.children = [];
          }
          currentH2.children.push(item);
        } else {
          sections.push(item);
        }
      }

      return sections;
    };

    const collectComponentTocFromDom = async () => {
      if (!isDemo.value) {
        domApiSections.value = [];
        domSemanticItem.value = null;
        return;
      }
      await nextTick();
      const container = mainContainerRef.value;
      if (!container) {
        domApiSections.value = [];
        domSemanticItem.value = null;
        return;
      }

      const apiContainer = container.querySelector('.api-container');
      const sections: TocItem[] = [];
      const seen = new Set<string>();
      let currentH2: TocItem | null = null;

      if (apiContainer) {
        const headingNodes = apiContainer.querySelectorAll('h2[id], h3[id]');
        headingNodes.forEach(node => {
          const id = node.getAttribute('id')?.trim();
          if (!id) return;
          const title = extractHeadingText(node);
          if (!title) return;
          const href = `#${id}`;
          const lowerHref = href.toLowerCase();
          if (seen.has(lowerHref)) return;
          seen.add(lowerHref);

          const item: TocItem = {
            key: href,
            href,
            title,
          };

          if (node.tagName === 'H2') {
            sections.push(item);
            currentH2 = item;
          } else if (currentH2) {
            if (!currentH2.children) {
              currentH2.children = [];
            }
            currentH2.children.push(item);
          } else {
            sections.push(item);
          }
        });
      }

      domApiSections.value = sections;

      const semanticEl = container.querySelector('#semantic-dom');
      if (semanticEl && !seen.has('#semantic-dom')) {
        const headingEl =
          semanticEl.tagName === 'SECTION' ? semanticEl.querySelector('h2, h3') : semanticEl;
        const semanticTitle =
          extractHeadingText(headingEl) || (isZhCN.value ? '语义化 DOM' : 'Semantic DOM');
        domSemanticItem.value = {
          key: '#semantic-dom',
          href: '#semantic-dom',
          title: semanticTitle,
        };
      } else {
        domSemanticItem.value = null;
      }
    };

    watch(
      [isDemo, () => route.path, isZhCN, pageData],
      () => {
        collectComponentTocFromDom();
      },
      { immediate: true, flush: 'post' },
    );

    onMounted(() => {
      collectComponentTocFromDom();
    });

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
          .filter(Boolean) as TocItem[];

        const items: TocItem[] = [
          {
            key: '#examples',
            href: '#examples',
            title: isZhCN.value ? '代码演示' : 'Examples',
            ...(demoItems.length ? { children: demoItems } : {}),
          },
        ];

        const apiSections = domApiSections.value.length
          ? domApiSections.value
          : buildApiSectionsFromHeaders(pageData.value?.headers || []);

        if (apiSections.length) {
          items.push(...apiSections);
        } else {
          items.push({
            key: '#api',
            href: '#api',
            title: 'API',
          });
        }

        if (
          domSemanticItem.value &&
          !items.some(item => item.href.toLowerCase() === '#semantic-dom')
        ) {
          items.push(domSemanticItem.value);
        }

        if (hasDesignTokens.value) {
          items.push({
            key: '#design-tokens',
            href: '#design-tokens',
            title: isZhCN.value ? '主题变量' : 'Design Token',
          });
        }

        return items;
      }

      const docHeaders = (pageData.value?.headers || []).filter(
        (h: any) => h && h.level === 2 && String(unref(h.title) || '').trim(),
      );
      return docHeaders.map((header: any, idx: number) => {
        const rawTitle = String(unref(header.title) || '').trim();
        const rawEnTitle = header.enTitle ? String(unref(header.enTitle)).trim() : '';
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
      mainContainerRef,
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

    .ant-anchor-link {
      padding-block: 3px;
      padding-inline: 12px 0;
    }
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
