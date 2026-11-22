import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { withInstall } from '../_util/type';
import VirtualList from '../vc-virtual-list';
import useStyle from './style';

export type ScrollAlign = 'top' | 'bottom' | 'auto';

export interface ListyScrollToConfig {
  index?: number;
  key?: string | number;
  align?: ScrollAlign;
  offset?: number;
}

export interface ListyRef {
  nativeElement?: HTMLElement;
  scrollTo: (config: ListyScrollToConfig | number) => void;
  scrollToIndex: (index: number) => void;
}

export const listyProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 数据源 */
  data: { type: Array as PropType<any[]>, default: () => [] },
  /** 自定义渲染 */
  itemRender: { type: Function as PropType<(item: any, index: number) => any> },
  /** 行 key（字段名或函数） */
  itemKey: { type: [String, Function] as PropType<string | ((item: any) => string | number)> },
  /** 列表高度（配合 virtual 使用） */
  height: { type: Number },
  /** 行高 */
  itemHeight: { type: Number },
  /** 是否虚拟滚动（未显式指定时：有 height + itemHeight 即开启） */
  virtual: { type: Boolean, default: undefined },
  /** 行 hover 背景 */
  rowHoverable: { type: Boolean, default: true },
  /** 语义化类名 */
  classNames: { type: Object as PropType<{ root?: string; item?: string }> },
  /** 语义化样式 */
  styles: { type: Object as PropType<{ root?: CSSProperties; item?: CSSProperties }> },
  onScroll: { type: Function as PropType<(e: UIEvent) => void> },
});

export type ListyProps = Partial<ExtractPropTypes<ReturnType<typeof listyProps>>>;

const Listy = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AListy',
  inheritAttrs: false,
  props: listyProps(),
  setup(props, { attrs, slots, expose }) {
    const { getPrefixCls } = useConfigInject('listy', props);
    const prefixCls = computed(() => getPrefixCls('listy', props.prefixCls));
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const listRef = ref<any>();
    const rootRef = ref<HTMLElement>();

    const mergedVirtual = computed(
      () =>
        props.virtual ??
        (!!props.height && !!props.itemHeight && (props.data?.length ?? 0) > 0),
    );

    const keyFn = computed(() => {
      const k = props.itemKey;
      if (typeof k === 'function') return k;
      if (typeof k === 'string') return (item: any) => item?.[k];
      return (item: any, index: number) => item?.key ?? index;
    });

    const renderItem = (item: any, index: number) => {
      if (props.itemRender) return props.itemRender(item, index);
      if (slots.item) return (slots.item as any)({ item, index });
      return item?.children ?? item?.label ?? String(item);
    };

    const renderRow = (item: any, index: number) => (
      <div
        key={keyFn.value(item, index)}
        class={classNames(`${prefixCls.value}-item`, (props.classNames as any)?.item)}
        style={(props.styles as any)?.item as CSSProperties}
      >
        {renderItem(item, index)}
      </div>
    );

    expose({
      nativeElement: rootRef,
      scrollTo: (config: ListyScrollToConfig | number) => {
        if (typeof config === 'number') listRef.value?.scrollTo?.({ index: config });
        else listRef.value?.scrollTo?.(config as any);
      },
      scrollToIndex: (index: number) => listRef.value?.scrollTo?.({ index }),
    } as unknown as ListyRef);

    return () => {
      const data = props.data || [];
      const rootClass = classNames(
        prefixCls.value,
        props.rootClassName,
        (props.classNames as any)?.root,
        { [`${prefixCls.value}-hoverable`]: props.rowHoverable },
        attrs.class as any,
        hashId.value,
      );
      const rootStyle = { ...((props.styles as any)?.root as CSSProperties), ...(attrs.style as CSSProperties) };

      if (mergedVirtual.value && props.height && props.itemHeight) {
        return wrapSSR(
          <div ref={rootRef} {...attrs} class={rootClass} style={rootStyle}>
            <VirtualList
              ref={listRef}
              data={data}
              height={props.height}
              itemHeight={props.itemHeight}
              itemKey={keyFn.value as any}
              onScroll={props.onScroll}
              v-slots={{
                default: (item: any, index: number) => renderRow(item, index),
              }}
            />
          </div>,
        );
      }

      return wrapSSR(
        <div ref={rootRef} {...attrs} class={rootClass} style={rootStyle}>
          {data.map((item, index) => renderRow(item, index))}
        </div>,
      );
    };
  },
});

export default withInstall(Listy);
