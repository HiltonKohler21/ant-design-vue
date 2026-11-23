import { defineComponent, toRefs, computed } from 'vue';
import type { PropType } from 'vue';
import { ConfigProvider, Table, theme } from 'ant-design-vue';
import { token2CSSVar } from 'ant-design-vue/es/_util/cssinjs';
import getDesignToken from '../antdv-token-previewer/utils/getDesignToken';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import tokenData from 'ant-design-vue/es/version/token.json';
import { useLocale } from '../../i18n';
import useSiteToken from '../../hooks/useSiteToken';
import { CssVarBadge, isColorValue, useColumns } from '../TokenTable';
import type { TokenData } from '../TokenTable';
import ColorChunk from '../ColorChunk';

const defaultToken = getDesignToken();

const locales = {
  cn: {
    componentToken: '组件 Token',
    globalToken: '全局 Token',
  },
  en: {
    componentToken: 'Component Token',
    globalToken: 'Global Token',
  },
};

export interface ComponentTokenItem {
  comp: string;
  name: string;
  value: any;
}

const toComponentCssVar = (comp: string, tokenName: string, prefix = 'ant') => {
  const key = `${comp}${tokenName.charAt(0).toUpperCase()}${tokenName.slice(1)}`;
  return token2CSSVar(key, prefix);
};

const inferTokenType = (name: string, value: any): string => {
  const meta = (tokenMeta as Record<string, any>)[name];
  if (meta?.type) {
    return meta.type;
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'string') {
    return 'string';
  }
  if (value === null || value === undefined) {
    return 'any';
  }
  return typeof value;
};

const sortTokenNames = (token1: string, token2: string) => {
  const hasColor1 = token1.toLowerCase().includes('color');
  const hasColor2 = token2.toLowerCase().includes('color');

  if (hasColor1 && !hasColor2) {
    return -1;
  }
  if (!hasColor1 && hasColor2) {
    return 1;
  }
  return token1 < token2 ? -1 : token1 > token2 ? 1 : 0;
};

const collectComponentTokens = (component?: string) => {
  const globalTokenSet = new Set<string>();
  const componentTokenMap = new Map<string, ComponentTokenItem>();

  if (!component) {
    return {
      mergedGlobalTokens: [] as string[],
      mergedComponentTokens: [] as ComponentTokenItem[],
    };
  }

  component
    .split(',')
    .map(comp => comp.trim())
    .filter(Boolean)
    .forEach(comp => {
      const entry = (tokenData as Record<string, any>)[comp];
      if (!entry) {
        return;
      }
      const { global: globalTokens = [], component: singleComponentTokens = {} } = entry;

      (globalTokens as string[]).forEach(tokenName => {
        if (
          typeof tokenName === 'string' &&
          !tokenName.startsWith('_') &&
          (tokenMeta as Record<string, any>)[tokenName]
        ) {
          globalTokenSet.add(tokenName);
        }
      });

      if (singleComponentTokens && typeof singleComponentTokens === 'object') {
        Object.entries(singleComponentTokens).forEach(([tokenName, val]) => {
          if (!tokenName.startsWith('_')) {
            componentTokenMap.set(`${comp}:${tokenName}`, {
              comp,
              name: tokenName,
              value: val,
            });
          }
        });
      }
    });

  return {
    mergedGlobalTokens: Array.from(globalTokenSet).sort(sortTokenNames),
    mergedComponentTokens: Array.from(componentTokenMap.values()).sort((a, b) =>
      sortTokenNames(a.name, b.name),
    ),
  };
};

export function hasComponentTokens(component?: string): boolean {
  const { mergedGlobalTokens, mergedComponentTokens } = collectComponentTokens(component);
  return mergedComponentTokens.length > 0 || mergedGlobalTokens.length > 0;
}

interface SubTokenTableProps {
  defaultOpen?: boolean;
  title: string;
  tokens?: string[];
  componentTokens?: ComponentTokenItem[];
}

const SubTokenTable = defineComponent({
  name: 'SubTokenTable',
  props: {
    defaultOpen: {
      type: Boolean as PropType<SubTokenTableProps['defaultOpen']>,
      default: false,
    },
    title: {
      type: String as PropType<SubTokenTableProps['title']>,
      required: true,
    },
    tokens: {
      type: Array as PropType<SubTokenTableProps['tokens']>,
      default: () => [],
    },
    componentTokens: {
      type: Array as PropType<SubTokenTableProps['componentTokens']>,
      default: undefined,
    },
  },
  setup(props) {
    const { defaultOpen, title, tokens, componentTokens } = toRefs(props);
    const [, lang] = useLocale(locales);
    const siteToken = useSiteToken();
    const token = computed(() => siteToken.value.token);
    const { realToken } = theme.useToken();
    const liveToken = computed<Record<string, any>>(
      () => (realToken?.value || defaultToken) as Record<string, any>,
    );

    const isComponentMode = computed(() => Array.isArray(componentTokens.value));
    const globalColumns = useColumns();
    const componentColumns = useColumns({ hideDescription: true });

    const data = computed<TokenData[]>(() => {
      if (isComponentMode.value) {
        return (componentTokens.value || []).map(({ comp, name, value }) => {
          const overrideVal = liveToken.value[comp]?.[name];
          const resolvedValue = overrideVal !== undefined ? overrideVal : value;
          return {
            name,
            type: inferTokenType(name, resolvedValue),
            value: resolvedValue,
            cssVar: toComponentCssVar(comp, name),
          };
        });
      }

      return [...(tokens.value || [])]
        .sort(sortTokenNames)
        .map<TokenData | null>(name => {
          const meta = (tokenMeta as Record<string, any>)[name];
          if (!meta) {
            return null;
          }
          return {
            name,
            desc: lang.value === 'cn' ? meta.desc || meta.name : meta.descEn || meta.nameEn,
            type: meta.type,
            value: liveToken.value[name] ?? (defaultToken as any)[name],
            cssVar: token2CSSVar(name, 'ant'),
          };
        })
        .filter((info): info is TokenData => Boolean(info));
    });

    return () => {
      if (!data.value.length) {
        return null;
      }

      const activeColumns = isComponentMode.value ? componentColumns.value : globalColumns.value;

      return (
        // Reuse `.markdown` style
        <details class="markdown" open={defaultOpen.value} style={{ marginBottom: '12px' }}>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
            <h3 style={{ display: 'inline' }}>
              {title.value}
              <span
                style={{
                  marginLeft: '8px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: token.value.colorTextSecondary,
                }}
              >
                ({data.value.length})
              </span>
            </h3>
          </summary>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 0,
              },
            }}
          >
            <Table
              size="middle"
              columns={activeColumns}
              bordered
              dataSource={data.value}
              style={{ marginBottom: token.value.margin }}
              pagination={false}
              rowKey={record => record.cssVar || record.name}
              v-slots={{
                bodyCell: ({ text, record, column }) => {
                  if (column.key === 'name') {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{record.name}</span>
                        {record.cssVar ? <CssVarBadge cssVar={record.cssVar} /> : null}
                      </div>
                    );
                  }
                  if (column.key === 'type') {
                    return (
                      <span
                        style={{
                          margin: '0 1px',
                          padding: '0.2em 0.4em',
                          fontSize: '0.9em',
                          background: `${token.value.siteMarkdownCodeBg}`,
                          border: `1px solid ${token.value.colorSplit}`,
                          borderRadius: '3px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {record.type}
                      </span>
                    );
                  }
                  if (column.key === 'value') {
                    if (isColorValue(record.value)) {
                      return <ColorChunk color={record.value}>{record.value}</ColorChunk>;
                    }
                    return (
                      <span>
                        {typeof record.value !== 'string'
                          ? JSON.stringify(record.value)
                          : record.value}
                      </span>
                    );
                  }
                  return <span>{text}</span>;
                },
              }}
            />
          </ConfigProvider>
        </details>
      );
    };
  },
});

export interface ComponentTokenTableProps {
  component: string;
}

const ComponentTokenTable = defineComponent({
  name: 'ComponentTokenTable',
  props: {
    component: {
      type: String as PropType<ComponentTokenTableProps['component']>,
      default: '',
    },
  },
  setup(props) {
    const { component } = toRefs(props);
    const [locale] = useLocale(locales);

    const mergedTokens = computed(() => collectComponentTokens(component.value));

    return () => {
      const { mergedComponentTokens, mergedGlobalTokens } = mergedTokens.value;
      if (!mergedComponentTokens.length && !mergedGlobalTokens.length) {
        return null;
      }

      return (
        <>
          <SubTokenTable
            title={locale.value.componentToken}
            componentTokens={mergedComponentTokens}
            defaultOpen={true}
          />
          <SubTokenTable
            title={locale.value.globalToken}
            tokens={mergedGlobalTokens}
            defaultOpen={false}
          />
        </>
      );
    };
  },
});

export default ComponentTokenTable;
