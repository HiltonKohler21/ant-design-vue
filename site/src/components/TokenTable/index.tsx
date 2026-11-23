import { defineComponent, toRefs, computed, ref } from 'vue';
import type { ComputedRef, PropType } from 'vue';
import type { TableProps } from 'ant-design-vue';
import { Table, Tooltip, theme } from 'ant-design-vue';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { token2CSSVar } from 'ant-design-vue/es/_util/cssinjs';
import getDesignToken from '../antdv-token-previewer/utils/getDesignToken';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import { useLocale } from '../../i18n';
import useSiteToken from '../../hooks/useSiteToken';
import ColorChunk from '../ColorChunk';

type TokenTableProps = {
  type: 'seed' | 'map' | 'alias';
  lang: 'zh' | 'en';
};

export type TokenData = {
  name: string;
  desc?: string;
  type: string;
  value: any;
  cssVar?: string;
};

const defaultToken = getDesignToken();

const locales = {
  cn: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
    copyCssVar: '复制 CSS 变量',
    copied: '已复制',
  },
  en: {
    token: 'Token Name',
    description: 'Description',
    type: 'Type',
    value: 'Default Value',
    copyCssVar: 'Copy CSS Variable',
    copied: 'Copied',
  },
};

export function isColorValue(value: any): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.startsWith('#') ||
    trimmed.startsWith('rgb(') ||
    trimmed.startsWith('rgba(') ||
    trimmed.startsWith('hsl(') ||
    trimmed.startsWith('hsla(') ||
    trimmed === 'transparent'
  );
}

export function copyText(text: string): void {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch {
      // ignore clipboard fallback failure
    }
    document.body.removeChild(textarea);
  }
}

export const CssVarBadge = defineComponent({
  name: 'CssVarBadge',
  props: {
    cssVar: {
      type: String,
      required: true,
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
      copyText(props.cssVar);
      copied.value = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        copied.value = false;
      }, 1500);
    };

    return () => (
      <Tooltip title={copied.value ? locale.value.copied : locale.value.copyCssVar}>
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
            marginTop: '4px',
            padding: '1px 6px',
            fontSize: '12px',
            lineHeight: '1.4',
            color: copied.value ? token.value.colorSuccess : token.value.colorTextSecondary,
            background: token.value.siteMarkdownCodeBg,
            border: `1px solid ${
              copied.value ? token.value.colorSuccessBorder : token.value.colorSplit
            }`,
            borderRadius: `${token.value.borderRadiusSM}px`,
            fontFamily: 'monospace',
            cursor: 'pointer',
            userSelect: 'all',
            transition: 'all 0.2s',
          }}
        >
          <span>{props.cssVar}</span>
          {copied.value ? (
            <CheckOutlined style={{ fontSize: '11px', color: token.value.colorSuccess }} />
          ) : (
            <CopyOutlined style={{ fontSize: '11px', opacity: 0.7 }} />
          )}
        </span>
      </Tooltip>
    );
  },
});

export function useColumns(options?: {
  hideDescription?: boolean;
}): ComputedRef<Exclude<TableProps<TokenData>['columns'], undefined>> {
  const [locale] = useLocale(locales);

  return computed(() => {
    const cols: Exclude<TableProps<TokenData>['columns'], undefined> = [
      {
        title: locale.value.token,
        key: 'name',
        dataIndex: 'name',
      },
    ];
    if (!options?.hideDescription) {
      cols.push({
        title: locale.value.description,
        key: 'desc',
        dataIndex: 'desc',
      });
    }
    cols.push(
      {
        title: locale.value.type,
        key: 'type',
        dataIndex: 'type',
      },
      {
        title: locale.value.value,
        key: 'value',
        dataIndex: 'value',
      },
    );
    return cols;
  });
}

const TokenTable = defineComponent({
  props: {
    type: {
      type: String as PropType<TokenTableProps['type']>,
    },
    lang: {
      type: String as PropType<TokenTableProps['lang']>,
    },
  },
  setup(props, { attrs }) {
    const { type } = toRefs(props);
    const siteToken = useSiteToken();
    const token = computed(() => siteToken.value.token);
    const { realToken } = theme.useToken();
    const liveToken = computed<Record<string, any>>(
      () => (realToken?.value || defaultToken) as Record<string, any>,
    );

    const [, lang] = useLocale(locales);
    const columns = useColumns();

    const data = computed<TokenData[]>(() => {
      return Object.entries(tokenMeta)
        .filter(([, meta]: any) => meta.source === type.value)
        .map(([tokenName, meta]: any) => ({
          name: tokenName,
          desc: lang.value === 'cn' ? meta.desc || meta.name : meta.descEn || meta.nameEn,
          type: meta.type,
          value: liveToken.value[tokenName] ?? (defaultToken as any)[tokenName],
          cssVar: token2CSSVar(tokenName, 'ant'),
        }));
    });

    return () => {
      return (
        <Table
          dataSource={data.value}
          columns={columns.value}
          pagination={false}
          bordered
          rowKey="name"
          {...attrs}
          v-slots={{
            bodyCell: ({ text, record, column }) => {
              if (column.key === 'name') {
                return (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
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
                    {typeof record.value !== 'string' ? JSON.stringify(record.value) : record.value}
                  </span>
                );
              }
              return <span>{text}</span>;
            },
          }}
        />
      );
    };
  },
});
export default TokenTable;
