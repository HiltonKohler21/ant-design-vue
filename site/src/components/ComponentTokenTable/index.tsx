import { defineComponent, toRefs, computed, ref } from 'vue';
import type { PropType } from 'vue';
import {
  ConfigProvider,
  Empty,
  Input,
  Table,
  Tag,
  Tooltip,
  message,
  theme,
} from '@hiltonkohler21/ant-design-vue';
import { CheckOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { token2CSSVar } from '@hiltonkohler21/ant-design-vue/es/_util/cssinjs';
import getDesignToken from '../antdv-token-previewer/utils/getDesignToken';
import tokenMeta from '@hiltonkohler21/ant-design-vue/es/version/token-meta.json';
import tokenData from '@hiltonkohler21/ant-design-vue/es/version/token.json';
import { useLocale } from '../../i18n';
import useSiteToken from '../../hooks/useSiteToken';
import { CssVarBadge, copyText, isColorValue, useColumns } from '../TokenTable';
import type { TokenData } from '../TokenTable';
import ColorChunk from '../ColorChunk';

const defaultToken = getDesignToken();
const rawTokenMeta = tokenMeta as Record<string, any>;
const globalTokenMeta: Record<string, any> = rawTokenMeta.global || rawTokenMeta;
const componentTokenMeta: Record<string, Record<string, any>> = rawTokenMeta.components || {};

const getGlobalMeta = (name: string) => {
  if (name === 'global' || name === 'components') {
    return undefined;
  }
  return globalTokenMeta[name];
};

const locales = {
  cn: {
    componentToken: '组件 Token',
    globalToken: '全局 Token',
    searchPlaceholder: '搜索 Token',
    copyTokenName: '复制 Token 名称',
    copied: '已复制',
    emptySearch: '未找到匹配的 Token',
  },
  en: {
    componentToken: 'Component Token',
    globalToken: 'Global Token',
    searchPlaceholder: 'Search Token',
    copyTokenName: 'Copy Token Name',
    copied: 'Copied',
    emptySearch: 'No matching tokens found',
  },
};

export interface ComponentTokenItem {
  comp: string;
  name: string;
  value: any;
}

interface ComponentTokenRowData extends TokenData {
  since?: string;
}

const toComponentCssVar = (comp: string, tokenName: string, prefix = 'ant') => {
  const key = `${comp}${tokenName.charAt(0).toUpperCase()}${tokenName.slice(1)}`;
  return token2CSSVar(key, prefix);
};

const inferTokenType = (name: string, value: any, comp?: string): string => {
  const compMeta = comp ? componentTokenMeta[comp]?.[name] : undefined;
  if (compMeta?.type) {
    return compMeta.type;
  }
  const meta = getGlobalMeta(name);
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
          getGlobalMeta(tokenName)
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

const TokenNameButton = defineComponent({
  name: 'TokenNameButton',
  props: {
    name: {
      type: String,
      required: true,
    },
    since: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const [locale] = useLocale(locales);
    const siteToken = useSiteToken();
    const token = computed(() => siteToken.value.token);
    const copied = ref(false);
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleCopy = (e: MouseEvent) => {
      e.stopPropagation();
      copyText(props.name);
      copied.value = true;
      message.success(`${locale.value.copied}: ${props.name}`);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        copied.value = false;
      }, 1500);
    };

    return () => (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <Tooltip title={copied.value ? locale.value.copied : locale.value.copyTokenName}>
          <span
            role="button"
            tabindex={0}
            onClick={handleCopy}
            onKeydown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCopy(e as unknown as MouseEvent);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500,
              cursor: 'pointer',
              color: copied.value ? token.value.colorSuccess : token.value.colorText,
              transition: 'color 0.2s',
            }}
          >
            <span>{props.name}</span>
            {copied.value ? (
              <CheckOutlined style={{ fontSize: '12px', color: token.value.colorSuccess }} />
            ) : (
              <CopyOutlined
                style={{ fontSize: '12px', color: token.value.colorTextTertiary, opacity: 0.75 }}
              />
            )}
          </span>
        </Tooltip>
        {props.since ? (
          <Tag
            color="blue"
            bordered={false}
            style={{
              margin: 0,
              padding: '0 6px',
              fontSize: '11px',
              lineHeight: '18px',
            }}
          >
            {props.since}
          </Tag>
        ) : null}
      </div>
    );
  },
});

interface SubTokenTableProps {
  defaultOpen?: boolean;
  title: string;
  tokens?: string[];
  componentTokens?: ComponentTokenItem[];
  searchKeyword?: string;
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
    searchKeyword: {
      type: String as PropType<SubTokenTableProps['searchKeyword']>,
      default: '',
    },
  },
  setup(props) {
    const { defaultOpen, title, tokens, componentTokens, searchKeyword } = toRefs(props);
    const [, lang] = useLocale(locales);
    const siteToken = useSiteToken();
    const token = computed(() => siteToken.value.token);
    const { realToken } = theme.useToken();
    const liveToken = computed<Record<string, any>>(
      () => (realToken?.value || defaultToken) as Record<string, any>,
    );

    const isComponentMode = computed(() => Array.isArray(componentTokens.value));
    const columns = useColumns();

    const allData = computed<ComponentTokenRowData[]>(() => {
      if (isComponentMode.value) {
        return (componentTokens.value || []).map(({ comp, name, value }) => {
          const overrideVal = liveToken.value[comp]?.[name];
          const resolvedValue = overrideVal !== undefined ? overrideVal : value;
          const compMeta = componentTokenMeta[comp]?.[name];
          const descText =
            lang.value === 'cn'
              ? compMeta?.desc || compMeta?.name
              : compMeta?.descEn || compMeta?.nameEn;
          return {
            name,
            desc: descText || '-',
            type: inferTokenType(name, resolvedValue, comp),
            value: resolvedValue,
            cssVar: toComponentCssVar(comp, name),
            since: compMeta?.since || '',
          };
        });
      }

      return [...(tokens.value || [])]
        .sort(sortTokenNames)
        .map<ComponentTokenRowData | null>(name => {
          const meta = getGlobalMeta(name);
          if (!meta) {
            return null;
          }
          const descText =
            lang.value === 'cn' ? meta.desc || meta.name : meta.descEn || meta.nameEn;
          return {
            name,
            desc: descText || '-',
            type: meta.type,
            value: liveToken.value[name] ?? (defaultToken as any)[name],
            cssVar: token2CSSVar(name, 'ant'),
            since: meta.since || '',
          };
        })
        .filter((info): info is ComponentTokenRowData => Boolean(info));
    });

    const filteredData = computed<ComponentTokenRowData[]>(() => {
      const keyword = (searchKeyword.value || '').trim().toLowerCase();
      if (!keyword) {
        return allData.value;
      }
      return allData.value.filter(
        item =>
          item.name.toLowerCase().includes(keyword) ||
          (item.cssVar && item.cssVar.toLowerCase().includes(keyword)) ||
          (item.desc && item.desc.toLowerCase().includes(keyword)) ||
          (item.type && item.type.toLowerCase().includes(keyword)),
      );
    });

    return () => {
      const hasKeyword = Boolean((searchKeyword.value || '').trim());
      if (!allData.value.length || (hasKeyword && !filteredData.value.length)) {
        return null;
      }

      const countLabel = hasKeyword
        ? `(${filteredData.value.length}/${allData.value.length})`
        : `(${allData.value.length})`;

      return (
        // Reuse `.markdown` style
        <details
          class="markdown"
          open={hasKeyword ? true : defaultOpen.value}
          style={{ marginBottom: '12px' }}
        >
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
                {countLabel}
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
              columns={columns.value}
              bordered
              dataSource={filteredData.value}
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
                        <TokenNameButton name={record.name} since={record.since} />
                        {record.cssVar ? <CssVarBadge cssVar={record.cssVar} /> : null}
                      </div>
                    );
                  }
                  if (column.key === 'desc') {
                    return <span>{record.desc || '-'}</span>;
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
    const [locale, lang] = useLocale(locales);
    const searchKeyword = ref('');

    const mergedTokens = computed(() => collectComponentTokens(component.value));

    const hasAnyMatch = computed(() => {
      const keyword = searchKeyword.value.trim().toLowerCase();
      if (!keyword) {
        return true;
      }
      const { mergedComponentTokens, mergedGlobalTokens } = mergedTokens.value;
      const compHit = mergedComponentTokens.some(({ comp, name, value }) => {
        const compMeta = componentTokenMeta[comp]?.[name];
        const desc =
          (lang.value === 'cn'
            ? compMeta?.desc || compMeta?.name
            : compMeta?.descEn || compMeta?.nameEn) || '';
        const type = inferTokenType(name, value, comp);
        const cssVar = toComponentCssVar(comp, name);
        return (
          name.toLowerCase().includes(keyword) ||
          cssVar.toLowerCase().includes(keyword) ||
          desc.toLowerCase().includes(keyword) ||
          type.toLowerCase().includes(keyword)
        );
      });
      if (compHit) {
        return true;
      }
      return mergedGlobalTokens.some(name => {
        const meta = getGlobalMeta(name);
        if (!meta) {
          return false;
        }
        const desc =
          (lang.value === 'cn' ? meta.desc || meta.name : meta.descEn || meta.nameEn) || '';
        const cssVar = token2CSSVar(name, 'ant');
        return (
          name.toLowerCase().includes(keyword) ||
          cssVar.toLowerCase().includes(keyword) ||
          desc.toLowerCase().includes(keyword) ||
          (meta.type && String(meta.type).toLowerCase().includes(keyword))
        );
      });
    });

    return () => {
      const { mergedComponentTokens, mergedGlobalTokens } = mergedTokens.value;
      if (!mergedComponentTokens.length && !mergedGlobalTokens.length) {
        return null;
      }

      return (
        <div>
          <div style={{ marginBottom: '12px', maxWidth: '320px' }}>
            <Input
              value={searchKeyword.value}
              {...{
                'onUpdate:value': (val: string) => {
                  searchKeyword.value = val;
                },
              }}
              placeholder={locale.value.searchPlaceholder}
              allowClear
              prefix={<SearchOutlined />}
            />
          </div>
          {hasAnyMatch.value ? (
            <>
              <SubTokenTable
                title={locale.value.componentToken}
                componentTokens={mergedComponentTokens}
                searchKeyword={searchKeyword.value}
                defaultOpen={true}
              />
              <SubTokenTable
                title={locale.value.globalToken}
                tokens={mergedGlobalTokens}
                searchKeyword={searchKeyword.value}
                defaultOpen={false}
              />
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={locale.value.emptySearch}
              style={{ marginBlock: '24px' }}
            />
          )}
        </div>
      );
    };
  },
});

export default ComponentTokenTable;
