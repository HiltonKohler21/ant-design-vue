import type { CSSProperties, ExtractPropTypes } from 'vue';
import {
  computed,
  toRef,
  defineComponent,
  ref,
  watch,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import DoubleLeftOutlined from '@ant-design/icons-vue/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons-vue/DoubleRightOutlined';
import MiniSelect, { MiddleSelect } from './Select';
import VcSelect from '../select';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import classNames from '../_util/classNames';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic, {
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import {
  booleanType,
  arrayType,
  stringType,
  functionType,
  someType,
  objectType,
} from '../_util/type';

// CSSINJS
import useStyle from './style';

export type PaginationAlign = 'start' | 'center' | 'end';
export type PaginationSemanticName = 'root' | 'item';
export type PaginationSemanticClassNames = SemanticClassNames<PaginationSemanticName>;
export type PaginationSemanticStyles = SemanticStyles<PaginationSemanticName>;
export type PaginationClassNamesType = SemanticClassNamesType<
  Record<string, any>,
  PaginationSemanticName
>;
export type PaginationStylesType = SemanticStylesType<Record<string, any>, PaginationSemanticName>;

interface AppliedSemanticState {
  classes: string[];
  styleKeys: string[];
}

const UNITLESS_CSS_PROPS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
  'orphans',
  'widows',
  'scale',
]);

const appliedSemanticMap = new WeakMap<HTMLElement, AppliedSemanticState>();

function applySemanticToElement(
  el: HTMLElement,
  cls: string | undefined,
  styleObj: CSSProperties | undefined,
) {
  const prev = appliedSemanticMap.get(el) || { classes: [], styleKeys: [] };
  const nextClasses = (cls || '').split(/\s+/).filter(Boolean);
  const nextStyleKeys = styleObj ? Object.keys(styleObj) : [];

  if (
    !prev.classes.length &&
    !prev.styleKeys.length &&
    !nextClasses.length &&
    !nextStyleKeys.length
  ) {
    return;
  }

  prev.classes.forEach(c => {
    if (!nextClasses.includes(c)) {
      el.classList.remove(c);
    }
  });
  nextClasses.forEach(c => {
    if (!el.classList.contains(c)) {
      el.classList.add(c);
    }
  });

  prev.styleKeys.forEach(key => {
    if (!nextStyleKeys.includes(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  });

  if (styleObj) {
    nextStyleKeys.forEach(key => {
      const val = (styleObj as any)[key];
      if (val === undefined || val === null) {
        if (key.startsWith('--')) {
          el.style.removeProperty(key);
        } else {
          (el.style as any)[key] = '';
        }
      } else if (key.startsWith('--')) {
        el.style.setProperty(key, String(val));
      } else if (typeof val === 'number' && !UNITLESS_CSS_PROPS.has(key)) {
        (el.style as any)[key] = `${val}px`;
      } else {
        (el.style as any)[key] = val;
      }
    });
  }

  appliedSemanticMap.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
}

function parseShowSizeChanger(val: boolean | Record<string, any> | undefined) {
  if (val && typeof val === 'object') {
    return [true, val] as const;
  }
  return [val as boolean | undefined, undefined] as const;
}

export const paginationProps = () => ({
  rootClassName: String,
  align: stringType<PaginationAlign>(),
  total: Number,
  defaultCurrent: Number,
  disabled: booleanType(),
  current: Number,
  defaultPageSize: Number,
  pageSize: Number,
  hideOnSinglePage: booleanType(),
  showSizeChanger: someType<boolean | Record<string, any>>([Boolean, Object]),
  pageSizeOptions: arrayType<(string | number)[]>(),
  buildOptionText: functionType<(opt: { value: any }) => any>(),
  showQuickJumper: someType<boolean | { goButton?: any }>([Boolean, Object]),
  showTotal: functionType<(total: number, range: [number, number]) => any>(),
  size: stringType<'default' | 'small' | 'middle' | 'medium' | 'large'>(),
  simple: someType<boolean | { readOnly?: boolean }>([Boolean, Object]),
  locale: Object,
  prefixCls: String,
  selectPrefixCls: String,
  totalBoundaryShowSizeChanger: Number,
  selectComponentClass: someType<any>([String, Object, Function]),
  components: objectType<{
    sizeChanger?: any;
  }>(),
  classNames: someType<PaginationClassNamesType>([Object, Function]),
  styles: someType<PaginationStylesType>([Object, Function]),
  itemRender:
    functionType<
      (opt: {
        page: number;
        type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';
        originalElement: any;
      }) => any
    >(),
  role: String,
  responsive: Boolean,
  showLessItems: booleanType(),
  onChange: functionType<(page: number, pageSize: number) => void>(),
  onShowSizeChange: functionType<(current: number, size: number) => void>(),
  'onUpdate:current': functionType<(current: number) => void>(),
  'onUpdate:pageSize': functionType<(size: number) => void>(),
});

export type PaginationPosition = 'top' | 'bottom' | 'both';
export const paginationConfig = () => ({
  ...paginationProps(),
  position: stringType<PaginationPosition>(),
});

export type PaginationProps = Partial<ExtractPropTypes<ReturnType<typeof paginationProps>>>;
export type PaginationConfig = Partial<ExtractPropTypes<ReturnType<typeof paginationConfig>>>;

export interface PaginationLocale {
  items_per_page?: string;
  jump_to?: string;
  jump_to_confirm?: string;
  page?: string;
  prev_page?: string;
  next_page?: string;
  prev_5?: string;
  next_5?: string;
  prev_3?: string;
  next_3?: string;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APagination',
  inheritAttrs: false,
  props: paginationProps(),
  // emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(props, { slots, attrs }) {
    const { prefixCls, configProvider, direction, size } = useConfigInject('pagination', props);
    const {
      componentConfig: paginationConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('pagination');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const selectPrefixCls = computed(() =>
      configProvider.getPrefixCls('select', props.selectPrefixCls),
    );
    const breakpoint = useBreakpoint();
    const [locale] = useLocaleReceiver('Pagination', enUS, toRef(props, 'locale'));
    const variant = computed(() => configProvider.variant?.value);

    const isSmallRef = computed(
      () => size.value === 'small' || !!(breakpoint.value?.xs && !size.value && props.responsive),
    );

    const mergedShowSizeChangerState = computed(() => {
      const [propShow, propSelectProps] = parseShowSizeChanger(props.showSizeChanger);
      const [ctxShow, ctxSelectProps] = parseShowSizeChanger(
        paginationConfig.value.showSizeChanger as any,
      );
      return {
        show: propShow ?? ctxShow,
        selectProps: propSelectProps ?? ctxSelectProps,
      };
    });

    const mergedProps = computed<PaginationProps>(() => ({
      ...props,
      size: size.value as any,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PaginationSemanticClassNames,
      PaginationSemanticStyles,
      PaginationProps
    >(
      () => [contextClassNames.value as PaginationClassNamesType, props.classNames],
      () => [
        contextStyles.value as PaginationStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.styles,
        attrs.style ? { root: attrs.style as CSSProperties } : undefined,
      ],
      () => ({ props: mergedProps.value }),
    );

    const CustomSizeChangerWrapper = defineComponent({
      name: 'PaginationCustomSizeChanger',
      compatConfig: { MODE: 3 },
      inheritAttrs: false,
      props: ['value', 'disabled', 'onChange'],
      Option: () => null,
      setup(wrapperProps, { attrs: wrapperAttrs }) {
        return () => {
          const SizeChangerComp = props.components?.sizeChanger;
          if (!SizeChangerComp) return null;
          const numVal = Number(wrapperProps.value);
          return (
            <SizeChangerComp
              value={Number.isNaN(numVal) ? wrapperProps.value : numVal}
              disabled={!!wrapperProps.disabled}
              className={wrapperAttrs.class}
              class={wrapperAttrs.class}
              onChange={(nextVal: number) => wrapperProps.onChange?.(nextVal)}
            />
          );
        };
      },
    });

    const ConfiguredSelectWrapper = defineComponent({
      name: 'PaginationConfiguredSelect',
      compatConfig: { MODE: 3 },
      inheritAttrs: false,
      Option: VcSelect.Option,
      setup(_wrapperProps, { attrs: wrapperAttrs, slots: wrapperSlots }) {
        return () => {
          const BaseSelect = isSmallRef.value ? MiniSelect : MiddleSelect;
          const extraSelectProps = mergedShowSizeChangerState.value.selectProps || {};
          const { onChange: extraOnChange, class: extraClass, ...restExtra } = extraSelectProps;
          const baseOnChange = wrapperAttrs.onChange as ((val: any) => void) | undefined;
          return (
            <BaseSelect
              {...wrapperAttrs}
              {...restExtra}
              class={classNames(wrapperAttrs.class as any, extraClass)}
              onChange={(val: any, option: any) => {
                baseOnChange?.(val);
                extraOnChange?.(val, option);
              }}
              v-slots={wrapperSlots}
            />
          );
        };
      },
    });

    const vcPaginationRef = ref<any>(null);
    let isSyncing = false;
    let observer: MutationObserver | null = null;

    const syncItemSemantics = () => {
      if (isSyncing) return;
      const rootEl = vcPaginationRef.value?.$el as HTMLElement | undefined;
      if (!rootEl || typeof rootEl.querySelectorAll !== 'function') {
        return;
      }
      isSyncing = true;
      try {
        const pre = prefixCls.value;
        const itemCls = mergedClassNames.value.item;
        const itemStyle = mergedStyles.value.item;
        const nodes = rootEl.querySelectorAll<HTMLElement>(
          `li.${pre}-item, li.${pre}-prev, li.${pre}-next, li.${pre}-jump-prev, li.${pre}-jump-next`,
        );
        nodes.forEach(node => {
          applySemanticToElement(node, itemCls, itemStyle);
        });
        if (props.simple && typeof props.simple === 'object') {
          const simpleInput = rootEl.querySelector<HTMLInputElement>(`.${pre}-simple-pager input`);
          if (simpleInput) {
            simpleInput.readOnly = !!props.simple.readOnly;
          }
        }
      } finally {
        isSyncing = false;
      }
    };

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      const rootEl = vcPaginationRef.value?.$el as HTMLElement | undefined;
      if (rootEl && typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
          if (!isSyncing && (mergedClassNames.value.item || mergedStyles.value.item)) {
            syncItemSemantics();
          }
        });
        observer.observe(rootEl, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
        });
      }
    };

    onMounted(() => {
      syncItemSemantics();
      setupObserver();
    });

    onUpdated(() => {
      syncItemSemantics();
      if (!observer) {
        setupObserver();
      }
    });

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });

    watch(
      [
        mergedClassNames,
        mergedStyles,
        () => props.current,
        () => props.pageSize,
        () => props.total,
        () => props.disabled,
        () => props.size,
        () => props.simple,
      ],
      () => {
        syncItemSemantics();
      },
      { flush: 'post', deep: true },
    );

    const getIconsProps = (pre: string) => {
      const ellipsis = <span class={`${pre}-item-ellipsis`}>•••</span>;
      const prevIcon = (
        <button class={`${pre}-item-link`} type="button" tabindex={-1}>
          {direction.value === 'rtl' ? <RightOutlined /> : <LeftOutlined />}
        </button>
      );
      const nextIcon = (
        <button class={`${pre}-item-link`} type="button" tabindex={-1}>
          {direction.value === 'rtl' ? <LeftOutlined /> : <RightOutlined />}
        </button>
      );
      const jumpPrevIcon = (
        <a rel="nofollow" class={`${pre}-item-link`}>
          <div class={`${pre}-item-container`}>
            {direction.value === 'rtl' ? (
              <DoubleRightOutlined class={`${pre}-item-link-icon`} />
            ) : (
              <DoubleLeftOutlined class={`${pre}-item-link-icon`} />
            )}
            {ellipsis}
          </div>
        </a>
      );
      const jumpNextIcon = (
        <a rel="nofollow" class={`${pre}-item-link`}>
          <div class={`${pre}-item-container`}>
            {direction.value === 'rtl' ? (
              <DoubleLeftOutlined class={`${pre}-item-link-icon`} />
            ) : (
              <DoubleRightOutlined class={`${pre}-item-link-icon`} />
            )}
            {ellipsis}
          </div>
        </a>
      );
      return { prevIcon, nextIcon, jumpPrevIcon, jumpNextIcon };
    };

    return () => {
      const {
        itemRender = slots.itemRender,
        buildOptionText = slots.buildOptionText,
        selectComponentClass,
        responsive: _responsive,
        align,
        components,
        classNames: _classNames,
        styles: _styles,
        showSizeChanger: _showSizeChanger,
        simple,
        onChange,
        onShowSizeChange,
        ...restProps
      } = props;

      const isSmall = isSmallRef.value;
      const { class: attrClass, style: _attrStyle, ...restAttrs } = attrs;
      const resolvedSelectClass = components?.sizeChanger
        ? CustomSizeChangerWrapper
        : selectComponentClass ||
          (mergedShowSizeChangerState.value.selectProps
            ? ConfiguredSelectWrapper
            : isSmall
            ? MiniSelect
            : MiddleSelect);

      const rootStyle =
        mergedStyles.value.root && Object.keys(mergedStyles.value.root).length > 0
          ? mergedStyles.value.root
          : undefined;

      const mergedPaginationProps = {
        ...restProps,
        simple: Boolean(simple),
        showSizeChanger: mergedShowSizeChangerState.value.show,
        totalBoundaryShowSizeChanger:
          props.totalBoundaryShowSizeChanger ?? paginationConfig.value.totalBoundaryShowSizeChanger,
        ...getIconsProps(prefixCls.value),
        prefixCls: prefixCls.value,
        selectPrefixCls: selectPrefixCls.value,
        selectComponentClass: resolvedSelectClass,
        locale: locale.value,
        buildOptionText,
        onChange: (page: number, pageSize: number) => {
          onChange?.(page, pageSize);
          nextTick(syncItemSemantics);
        },
        onShowSizeChange: (current: number, pageSize: number) => {
          onShowSizeChange?.(current, pageSize);
          nextTick(syncItemSemantics);
        },
        ...restAttrs,
        class: classNames(
          {
            [`${prefixCls.value}-${align}`]: !!align,
            [`${prefixCls.value}-${variant.value}`]:
              !!variant.value && variant.value !== 'outlined',
            [`${prefixCls.value}-mini`]: isSmall,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          contextClassName.value,
          mergedClassNames.value.root,
          props.rootClassName,
          attrClass,
          hashId.value,
        ),
        style: rootStyle,
        itemRender,
      };

      return wrapSSR(<VcPagination ref={vcPaginationRef} {...mergedPaginationProps} />);
    };
  },
});
