import Icon, * as AntdIcons from '@ant-design/icons-vue';
import { computed, defineComponent, markRaw, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { all, categories } from './fields';
import metaInfo from './meta';
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons';
import Category from './Category';

export const ThemeType = {
  All: 'All',
  Filled: 'Filled',
  Outlined: 'Outlined',
  TwoTone: 'TwoTone',
};

const THEME_ORDER = [ThemeType.Outlined, ThemeType.Filled, ThemeType.TwoTone];
const IGNORE_ICONS = new Set([
  'CopyrightCircle', // same as Copyright
  'DollarCircle', // same as Dollar
]);
const NEW_ICON_VERSION = '6.5.0';
const NEW_ICON_NAMES = [];

const allIcons = markRaw(AntdIcons);
const AppstoreOutlined = markRaw(AntdIcons.AppstoreOutlined);

function resolveIconNames(baseName, theme) {
  if (theme === ThemeType.All) {
    return THEME_ORDER.map(item => baseName + item).filter(iconName => Boolean(allIcons[iconName]));
  }
  const fullName = baseName + theme;
  return allIcons[fullName] ? [fullName] : [];
}

function matchCategoriesFromTag(searchKey) {
  if (!searchKey) {
    return {};
  }

  return Object.keys(metaInfo).reduce((acc, key) => {
    const icon = metaInfo[key];
    const { category, tags } = icon;

    if (tags.some(tag => tag.toLowerCase().includes(searchKey))) {
      if (acc[category]) {
        acc[category].icons.push(key);
      } else {
        acc[category] = { category, icons: [key] };
      }
    }

    return acc;
  }, {});
}

function mergeCategory(categoryA, categoryB) {
  const merged = { ...categoryA };

  Object.keys(categoryB).forEach(key => {
    if (merged[key]) {
      merged[key] = {
        ...merged[key],
        icons: Array.from(new Set([...merged[key].icons, ...categoryB[key].icons])),
      };
    } else {
      merged[key] = categoryB[key];
    }
  });

  return merged;
}

const IconDisplay = defineComponent({
  name: 'IconDisplay',
  setup() {
    const { t } = useI18n();
    const theme = ref(ThemeType.All);
    const searchInput = ref('');
    const searchKey = ref('');
    const searchBarAffixed = ref(false);

    let searchTimer = null;
    let scrollTimer = null;

    const scheduleScrollToIcons = () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        if (typeof document === 'undefined') return;
        const element = document.querySelector('#list-of-icons');
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < 72) {
          const reducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          element.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
        }
      }, 300);
    };

    const handleSearchIcon = e => {
      const nextVal = e?.target?.value ?? '';
      searchInput.value = nextVal;
      if (searchTimer) {
        clearTimeout(searchTimer);
        searchTimer = null;
      }
      if (!nextVal.trim()) {
        searchKey.value = '';
      } else {
        searchTimer = setTimeout(() => {
          searchKey.value = nextVal;
          searchTimer = null;
        }, 120);
      }
      scheduleScrollToIcons();
    };

    const handleChangeTheme = val => {
      theme.value = val;
    };

    const handleAffixChange = affixed => {
      searchBarAffixed.value = Boolean(affixed);
    };

    onBeforeUnmount(() => {
      if (searchTimer) clearTimeout(searchTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
    });

    const segmentedOptions = computed(() => [
      {
        value: ThemeType.All,
        icon: () => <AppstoreOutlined />,
        label: t('app.docs.components.icon.all'),
        title: t('app.docs.components.icon.all'),
      },
      {
        value: ThemeType.Outlined,
        icon: () => <Icon component={OutlinedIcon} />,
        label: t('app.docs.components.icon.outlined'),
        title: t('app.docs.components.icon.outlined'),
      },
      {
        value: ThemeType.Filled,
        icon: () => <Icon component={FilledIcon} />,
        label: t('app.docs.components.icon.filled'),
        title: t('app.docs.components.icon.filled'),
      },
      {
        value: ThemeType.TwoTone,
        icon: () => <Icon component={TwoToneIcon} />,
        label: t('app.docs.components.icon.two-tone'),
        title: t('app.docs.components.icon.two-tone'),
      },
    ]);

    const matchedCategories = computed(() => {
      const currentTheme = theme.value;
      let normalizedSearchKey = searchKey.value.trim();

      if (normalizedSearchKey) {
        normalizedSearchKey = normalizedSearchKey
          .replace(/^<([a-z0-9-]+)\s*\/?>$/gi, (_, name) => name.replace(/-/g, ''))
          .replace(/(Filled|Outlined|TwoTone)$/i, '')
          .toLowerCase();
      }

      const tagMatchedCategoryObj = matchCategoriesFromTag(normalizedSearchKey);

      const namedMatchedCategoryObj = Object.keys(categories).reduce((acc, key) => {
        let iconList = categories[key];
        if (normalizedSearchKey) {
          iconList = iconList.filter(iconName =>
            iconName.toLowerCase().includes(normalizedSearchKey),
          );
        }

        iconList = iconList.filter(icon => !IGNORE_ICONS.has(icon));

        acc[key] = {
          category: key,
          icons: iconList,
        };

        return acc;
      }, {});

      const merged = mergeCategory(namedMatchedCategoryObj, tagMatchedCategoryObj);

      return Object.values(merged)
        .map(item => ({
          category: item.category,
          icons: item.icons.flatMap(iconName => resolveIconNames(iconName, currentTheme)),
        }))
        .filter(({ icons }) => icons.length > 0);
    });

    return () => (
      <div class="icon-display-wrapper">
        <a-affix offsetTop={72} onChange={handleAffixChange}>
          <div class={searchBarAffixed.value ? 'icons-affix icons-affixed' : 'icons-affix'}>
            <a-segmented
              size="large"
              value={theme.value}
              options={segmentedOptions.value}
              onChange={handleChangeTheme}
            />
            <a-input-search
              class="icons-search-input"
              placeholder={t('app.docs.components.icon.search.placeholder.total', {
                total: all.length,
              })}
              style={{ flex: 1, marginInlineStart: '16px' }}
              allowClear
              size="large"
              variant="filled"
              value={searchInput.value}
              onChange={handleSearchIcon}
            />
          </div>
        </a-affix>
        {matchedCategories.value.length === 0 ? (
          <a-empty style={{ margin: '2em 0' }} />
        ) : (
          matchedCategories.value.map(({ category, icons }) => (
            <Category
              key={category}
              title={category}
              theme={theme.value}
              icons={icons}
              newIcons={NEW_ICON_NAMES}
              newIconVersion={NEW_ICON_VERSION}
            />
          ))
        )}
      </div>
    );
  },
});

export default IconDisplay;
