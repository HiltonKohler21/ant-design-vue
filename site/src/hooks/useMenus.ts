import { groupBy } from 'lodash-es';
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GLOBAL_CONFIG } from '../SymbolKey';

const typeOrder: Record<string, { order: number; zh?: string; en: string }> = {
  组件总览: { order: -1, en: 'Overview' },
  docs: { order: 0, zh: '研发文档', en: 'Documentation' },
  通用: { order: 0, en: 'General' },
  布局: { order: 1, en: 'Layout' },
  导航: { order: 2, en: 'Navigation' },
  数据录入: { order: 3, en: 'Data Entry' },
  数据展示: { order: 4, en: 'Data Display' },
  反馈: { order: 5, en: 'Feedback' },
  其他: { order: 6, en: 'Other' },
  废弃: { order: 7, en: 'Deprecated' },
  'AI & Agent': { order: 8, en: 'AI & Agent' },
};

const normalizeType = (type?: string) => {
  if (type === '其它') return '其他';
  return type;
};

const compareComponentTitle = (a: any, b: any) =>
  String(a?.title || '').localeCompare(String(b?.title || ''), 'en', { sensitivity: 'base' });

const useMenus = (): {
  menus: ComputedRef<any[]>;
  dataSource: ComputedRef<any[]>;
  currentMenuIndex: ComputedRef<number>;
  activeMenuItem: ComputedRef<string>;
} => {
  const route = useRoute();
  const router = useRouter();
  const routes = router.getRoutes();
  const globalConfig = inject<any>(GLOBAL_CONFIG);

  const rawMenus = computed(() => {
    const path = route.path;
    const category = path.split('/')[1];
    const pattern = /^\/iframe/;
    const isZhCN = globalConfig.isZhCN.value;
    return routes
      .filter(r => {
        const inCategory =
          r.meta &&
          r.meta.category &&
          (r.meta.category as string).toLowerCase() === category &&
          !pattern.test(r.path);
        if (inCategory && category === 'docs') {
          if (isZhCN) {
            return r.path.indexOf('-cn') >= 0;
          } else {
            return r.path.indexOf('-cn') === -1;
          }
        } else {
          return inCategory;
        }
      })
      .map(r => {
        const meta: any = { ...r.meta };
        if (meta.type) {
          meta.type = normalizeType(meta.type);
        }
        return {
          ...meta,
          path: r.path.split(':lang')[0].replace(/-cn\/?$/, ''),
        };
      });
  });

  const activeMenuItem = computed(() => {
    return route.path.replace(/-cn\/?$/, '').replace(/\/$/, '') || '/';
  });

  const dataSource = computed(() => {
    const group = groupBy(rawMenus.value, (m: any) => normalizeType(m.type) || m.category);
    const keys: string[] = Object.keys(group);
    if (keys.length === 1) {
      return rawMenus.value;
    }
    return keys
      .map(key => {
        const meta = typeOrder[key];
        const isDocsGroup = key === 'docs' || key === 'AI & Agent';
        return {
          title: meta?.zh || key,
          order: meta ? meta.order : 99,
          enTitle: meta ? meta.en : key,
          children: isDocsGroup ? group[key] : [...group[key]].sort(compareComponentTitle),
        };
      })
      .sort((a, b) => a.order - b.order);
  });

  // Flatten grouped dataSource so PrevAndNext follows the exact visual sidebar order
  const menus = computed(() => {
    const flattened: any[] = [];
    for (const item of dataSource.value) {
      if (Array.isArray(item.children)) {
        flattened.push(...item.children);
      } else {
        flattened.push(item);
      }
    }
    return flattened;
  });

  const currentMenuIndex = computed(() => {
    return menus.value.findIndex(m => m.path === activeMenuItem.value);
  });

  return { menus, dataSource, activeMenuItem, currentMenuIndex };
};

export default useMenus;
