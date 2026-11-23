<template>
  <a-style-provider :hash-priority="hashPriority">
    <a-config-provider :locale="locale" :theme="themeConfig" :direction="direction">
      <SiteToken>
        <router-view />
      </SiteToken>
    </a-config-provider>
  </a-style-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useMediaQuery from './hooks/useMediaQuery';
import { GLOBAL_CONFIG } from './SymbolKey';
import enUS from '../../components/locale/en_US';
import zhCN from '../../components/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { theme as antdTheme } from 'ant-design-vue';
import SiteToken from './SiteToken.vue';
import type { Direction, GlobalConfig } from './type';
import { installHappyWorkEffect } from './layouts/header/happyWork';

function isZhCN(name: string) {
  return /-cn\/?$/.test(name);
}

export type ThemeName = '' | 'light' | 'dark' | 'compact';
export type ThemeSetting = 'system' | 'light' | 'dark';

const getAlgorithm = (themes: ThemeName[] = []) =>
  themes
    .filter(t => !!t)
    .map(t => {
      if (t === 'dark') {
        return antdTheme.darkAlgorithm;
      }
      if (t === 'compact') {
        return antdTheme.compactAlgorithm;
      }
      return antdTheme.defaultAlgorithm;
    });

function readStoredThemeSetting(): ThemeSetting {
  if (typeof localStorage === 'undefined') return 'light';
  const saved = localStorage.getItem('themeSetting') || localStorage.getItem('theme');
  if (saved === 'system' || saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'light';
}

export default defineComponent({
  components: {
    SiteToken,
  },
  setup() {
    const route = useRoute();
    const i18n = useI18n();
    const colSize = useMediaQuery();
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');

    // Follow-system dark mode media query
    const mediaQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    const systemDark = ref<boolean>(mediaQuery ? mediaQuery.matches : false);
    const onSystemThemeChange = (e: MediaQueryListEvent) => {
      systemDark.value = e.matches;
    };

    const themeSetting = ref<ThemeSetting>(readStoredThemeSetting());
    const theme = computed<'light' | 'dark'>(() => {
      if (themeSetting.value === 'system') {
        return systemDark.value ? 'dark' : 'light';
      }
      return themeSetting.value;
    });

    const compactTheme = ref<ThemeName>(
      (typeof localStorage !== 'undefined' &&
        (localStorage.getItem('compactTheme') as ThemeName)) ||
        '',
    );

    const primaryColor = ref<string>(
      (typeof localStorage !== 'undefined' && localStorage.getItem('primaryColor')) || '',
    );

    const happyWork = ref<boolean>(
      typeof localStorage !== 'undefined' && localStorage.getItem('happyWork') === 'true',
    );

    const direction = ref<Direction>(
      typeof localStorage !== 'undefined' && localStorage.getItem('direction') === 'rtl'
        ? 'rtl'
        : 'ltr',
    );

    const themeConfig = computed(() => {
      const algorithms = getAlgorithm([...new Set([theme.value, compactTheme.value])]);
      if (primaryColor.value) {
        return {
          algorithm: algorithms,
          token: {
            colorPrimary: primaryColor.value,
          },
        };
      }
      return { algorithm: algorithms };
    });

    const hashPriority = ref('low' as const);
    watch(hashPriority, () => {
      location.reload();
    });

    const responsive = computed(() => {
      if (colSize.value === 'xs') {
        return 'crowded';
      } else if (colSize.value === 'sm') {
        return 'narrow';
      }
      return null;
    });

    const changeTheme = (t: ThemeSetting | ThemeName) => {
      const next: ThemeSetting = t === 'dark' || t === 'system' ? t : 'light';
      themeSetting.value = next;
      localStorage.setItem('themeSetting', next);
      localStorage.setItem('theme', next);
    };

    const changeCompactTheme = (t: ThemeName) => {
      compactTheme.value = t;
      localStorage.setItem('compactTheme', t);
    };

    const changePrimaryColor = (color: string) => {
      primaryColor.value = color;
      if (color) {
        localStorage.setItem('primaryColor', color);
      } else {
        localStorage.removeItem('primaryColor');
      }
    };

    const toggleHappyWork = () => {
      happyWork.value = !happyWork.value;
      localStorage.setItem('happyWork', String(happyWork.value));
    };

    const changeDirection = (dir: Direction) => {
      direction.value = dir;
      localStorage.setItem('direction', dir);
    };

    const globalConfig: GlobalConfig = {
      isMobile,
      responsive,
      lang: computed<any>(() => i18n.locale.value),
      isZhCN: computed(() => i18n.locale.value === 'zh-CN'),
      blocked: ref(false),
      direction,
      changeDirection,
    };

    provide('themeMode', {
      theme,
      themeSetting,
      compactTheme,
      primaryColor,
      happyWork,
      direction,
      changeTheme,
      changeCompactTheme,
      changePrimaryColor,
      toggleHappyWork,
      changeDirection,
    });
    provide(GLOBAL_CONFIG, globalConfig);

    watch(
      () => route.path,
      val => {
        i18n.locale.value = isZhCN(val) ? 'zh-CN' : 'en-US';
      },
      { immediate: true },
    );

    watch(
      globalConfig.isZhCN,
      val => {
        if (val) {
          dayjs.locale(zhCN.locale);
        } else {
          dayjs.locale(enUS.locale);
        }
      },
      { immediate: true },
    );

    const locale = computed(() => {
      return globalConfig.isZhCN.value ? zhCN : enUS;
    });

    watch(
      theme,
      val => {
        const html = document.documentElement;
        const body = document.body;
        if (val === 'dark') {
          html.setAttribute('data-doc-theme', 'dark');
          html.setAttribute('data-theme', 'dark');
          body.setAttribute('data-theme', 'dark');
          html.style.colorScheme = 'dark';
        } else {
          html.setAttribute('data-doc-theme', 'light');
          html.setAttribute('data-theme', 'light');
          body.setAttribute('data-theme', 'light');
          html.style.colorScheme = 'light';
        }
      },
      { immediate: true },
    );

    watch(
      direction,
      dir => {
        const html = document.documentElement;
        html.setAttribute('dir', dir);
        if (dir === 'rtl') {
          html.classList.add('rtl');
        } else {
          html.classList.remove('rtl');
        }
      },
      { immediate: true },
    );

    let disposeHappyWork: (() => void) | null = null;
    watch(
      happyWork,
      enabled => {
        if (disposeHappyWork) {
          disposeHappyWork();
          disposeHappyWork = null;
        }
        if (enabled) {
          document.documentElement.setAttribute('data-happy-work', 'true');
          disposeHappyWork = installHappyWorkEffect();
        } else {
          document.documentElement.removeAttribute('data-happy-work');
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      mediaQuery?.addEventListener?.('change', onSystemThemeChange);
    });

    onBeforeUnmount(() => {
      mediaQuery?.removeEventListener?.('change', onSystemThemeChange);
      if (disposeHappyWork) {
        disposeHappyWork();
        disposeHappyWork = null;
      }
    });

    return { globalConfig, locale, themeConfig, hashPriority, direction };
  },
});
</script>
