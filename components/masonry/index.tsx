import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import { withInstall } from '../_util/type';
import useStyle from './style';

export interface MasonryItemType<T = any> {
  key: string | number;
  /** 指定列（不指定则按最短列分配） */
  column?: number;
  /** 预估高度，避免首帧重新排序 */
  height?: number;
  children?: any;
  data?: T;
}

export type MasonryColumns =
  | number
  | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>;
export type MasonryGutter =
  | number
  | [number | string, number | string]
  | {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      xxl?: number;
    };

export type MasonrySemanticName = 'root' | 'item';
export type MasonrySemanticClassNames = Partial<Record<MasonrySemanticName, string>>;
export type MasonrySemanticStyles = Partial<Record<MasonrySemanticName, CSSProperties>>;
export type MasonryClassNamesType =
  | MasonrySemanticClassNames
  | ((info: { props: MasonryProps }) => MasonrySemanticClassNames);
export type MasonryStylesType =
  | MasonrySemanticStyles
  | ((info: { props: MasonryProps }) => MasonrySemanticStyles);

export interface MasonryRef {
  nativeElement: HTMLDivElement | null;
}

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: MasonryProps }) => T) | undefined,
  info: { props: MasonryProps },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

export const masonryProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 间距 */
  gutter: { type: [Number, Array, Object] as PropType<MasonryGutter>, default: 16 },
  /** 数据源 */
  items: { type: Array as PropType<MasonryItemType[]>, default: () => [] },
  /** 自定义渲染 */
  itemRender: { type: Function as PropType<(item: MasonryItemType & { index: number }) => any> },
  /** 列数（支持响应式断点） */
  columns: { type: [Number, Object] as PropType<MasonryColumns>, default: 2 },
  /** 布局变化回调 */
  onLayoutChange: {
    type: Function as PropType<(info: { key: string | number; column: number }[]) => void>,
  },
  /** 是否开启子项 ResizeObserver 自动响应尺寸变化（默认 true，设为 false 关闭） */
  fresh: { type: Boolean, default: true },
  classNames: { type: [Object, Function] as PropType<MasonryClassNamesType>, default: undefined },
  styles: { type: [Object, Function] as PropType<MasonryStylesType>, default: undefined },
});

export type MasonryProps = Partial<ExtractPropTypes<ReturnType<typeof masonryProps>>>;

const BREAKPOINTS = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

const normalizeGutter = (gutter: MasonryGutter, screens: Record<string, boolean>) => {
  if (typeof gutter === 'number') return [gutter, gutter] as const;
  if (Array.isArray(gutter)) {
    return [Number(gutter[0]) || 0, Number(gutter[1]) || 0] as const;
  }
  if (gutter && typeof gutter === 'object') {
    const bp = BREAKPOINTS.find(k => screens[k]);
    const v = bp ? gutter[bp] : undefined;
    const fallback = gutter.xs ?? 16;
    return [v ?? fallback, v ?? fallback] as const;
  }
  return [0, 0] as const;
};

const Masonry = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMasonry',
  inheritAttrs: false,
  props: masonryProps(),
  setup(props, { attrs, slots, expose }) {
    const { direction, getPrefixCls } = useConfigInject('masonry', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('masonry');
    const prefixCls = computed(() => getPrefixCls('masonry', props.prefixCls));
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const screens = useBreakpoint();
    const rtl = computed(() => direction.value === 'rtl');

    const rootRef = ref<HTMLDivElement | null>(null);
    expose({
      nativeElement: rootRef,
    });

    const columnCount = computed(() => {
      const columns = props.columns;
      if (typeof columns === 'number') return Math.max(1, Math.floor(columns) || 1);
      if (columns && typeof columns === 'object') {
        const bp = BREAKPOINTS.find(k => screens.value?.[k] && columns[k]);
        if (bp && columns[bp]) return Math.max(1, Math.floor(columns[bp]!));
        const first = Object.values(columns).find(v => typeof v === 'number');
        return Math.max(1, Math.floor((first as number) ?? 1));
      }
      return 1;
    });

    const gutter = computed(() =>
      normalizeGutter(props.gutter as MasonryGutter, screens.value || {}),
    );

    const measured = reactive<Record<string, number>>({});
    const itemEls = new Map<string, HTMLElement>();
    let observer: ResizeObserver | null = null;
    const layoutVersion = ref(0);

    const collectItemSize = () => {
      let changed = false;
      itemEls.forEach(el => {
        const key = el.getAttribute('data-masonry-key');
        if (key == null) return;
        const rectHeight = el.getBoundingClientRect ? el.getBoundingClientRect().height : 0;
        const height = rectHeight > 0 ? rectHeight : el.offsetHeight || 0;
        if (
          (height > 0 || measured[key] !== undefined) &&
          Math.abs((measured[key] ?? 0) - height) > 0.5
        ) {
          measured[key] = height;
          changed = true;
        }
      });
      if (changed) {
        layoutVersion.value += 1;
      }
    };

    const measure = (el: any, slotKey: string) => {
      const prevEl = itemEls.get(slotKey);
      if (!el) {
        if (prevEl) {
          observer?.unobserve(prevEl);
          itemEls.delete(slotKey);
        }
        return;
      }
      const nextEl = el as HTMLElement;
      if (prevEl && prevEl !== nextEl) {
        observer?.unobserve(prevEl);
      }
      itemEls.set(slotKey, nextEl);
      if (prevEl !== nextEl && props.fresh !== false) {
        observer?.observe(nextEl);
      }
    };

    const teardownObserver = () => {
      observer?.disconnect();
      observer = null;
    };

    const setupObserver = () => {
      if (props.fresh === false || typeof ResizeObserver === 'undefined') return;
      if (observer) return;
      observer = new ResizeObserver(entries => {
        let changed = false;
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          const key = el.getAttribute('data-masonry-key');
          if (key == null) return;
          const height = entry.contentRect.height;
          if (Math.abs((measured[key] ?? 0) - height) > 0.5) {
            measured[key] = height;
            changed = true;
          }
        });
        if (changed) layoutVersion.value += 1;
      });
      itemEls.forEach(el => observer!.observe(el));
    };

    const handleMediaReflow = () => {
      collectItemSize();
    };

    onMounted(() => {
      if (props.fresh !== false) {
        setupObserver();
        nextTick(() => {
          if (props.fresh !== false) {
            itemEls.forEach(el => observer?.observe(el));
          }
        });
      }
      rootRef.value?.addEventListener('load', handleMediaReflow, true);
      rootRef.value?.addEventListener('error', handleMediaReflow, true);
    });
    onBeforeUnmount(() => {
      rootRef.value?.removeEventListener('load', handleMediaReflow, true);
      rootRef.value?.removeEventListener('error', handleMediaReflow, true);
      teardownObserver();
      itemEls.clear();
    });
    watch(
      () => props.items,
      nextItems => {
        const activeKeys = new Set((nextItems || []).map(item => String(item.key)));
        Object.keys(measured).forEach(k => {
          if (!activeKeys.has(k)) {
            delete measured[k];
          }
        });
      },
    );
    watch(
      () => props.fresh,
      nextFresh => {
        if (nextFresh === false) {
          teardownObserver();
        } else {
          setupObserver();
          collectItemSize();
          layoutVersion.value += 1;
        }
      },
    );

    const rendered = computed(() => {
      const items = props.items || [];
      const count = columnCount.value;
      // 依赖测量结果，触发重排
      // eslint-disable-next-line no-unused-expressions
      layoutVersion.value;

      const heights = new Array(count).fill(0);
      const buckets: { item: MasonryItemType; index: number }[][] = Array.from(
        { length: count },
        () => [],
      );

      items.forEach((item, index) => {
        let column = typeof item.column === 'number' ? item.column : -1;
        if (column < 0 || column >= count) {
          let min = 0;
          for (let i = 1; i < count; i += 1) if (heights[i] < heights[min]) min = i;
          column = min;
        }
        buckets[column].push({ item, index });
        heights[column] += (measured[String(item.key)] ?? item.height ?? 0) + gutter.value[1];
      });

      return buckets;
    });

    watch(
      rendered,
      buckets => {
        if (!props.onLayoutChange) return;
        const info: { key: string | number; column: number }[] = [];
        buckets.forEach((bucket, column) => {
          bucket.forEach(({ item }) => info.push({ key: item.key, column }));
        });
        props.onLayoutChange(info);
      },
      { immediate: true },
    );

    const renderItem = (item: MasonryItemType, index: number) => {
      if (props.itemRender) return props.itemRender({ ...item, index });
      if (item.children !== undefined) return item.children;
      if (slots.item) return slots.item({ item, index });
      return null;
    };

    return () => {
      const [gapX, gapY] = gutter.value;
      const semanticInfo = {
        props: {
          ...props,
          columns: columnCount.value,
        } as MasonryProps,
      };
      const mergedClassNames = mergeSemanticClassNames(
        resolveSemanticValue(contextClassNames.value as MasonryClassNamesType, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles(
        resolveSemanticValue(contextStyles.value as MasonryStylesType, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );
      const rootStyle: CSSProperties = {
        ...contextStyle.value,
        ...(mergedStyles?.root as CSSProperties),
        columnGap: `${gapX}px`,
        flexDirection: rtl.value ? 'row-reverse' : 'row',
      };
      return wrapSSR(
        <div
          {...attrs}
          ref={rootRef}
          class={classNames(
            prefixCls.value,
            { [`${prefixCls.value}-rtl`]: rtl.value },
            props.rootClassName,
            contextClassName.value,
            mergedClassNames?.root,
            attrs.class as any,
            hashId.value,
          )}
          style={{ ...rootStyle, ...(attrs.style as CSSProperties) }}
        >
          {rendered.value.map((bucket, column) => (
            <div key={column} class={`${prefixCls.value}-column`}>
              {bucket.map(({ item, index }) => (
                <div
                  key={String(item.key)}
                  data-masonry-key={String(item.key)}
                  class={classNames(`${prefixCls.value}-item`, mergedClassNames?.item)}
                  style={{
                    marginBottom: `${gapY}px`,
                    ...(mergedStyles?.item as CSSProperties),
                  }}
                  ref={(el: any) => measure(el, `${column}:${String(item.key)}`)}
                >
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          ))}
        </div>,
      );
    };
  },
});

export default withInstall(Masonry);
