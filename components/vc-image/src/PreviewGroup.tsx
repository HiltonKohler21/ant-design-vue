import type { PropType, Ref, ComputedRef } from 'vue';
import {
  ref,
  shallowRef,
  provide,
  defineComponent,
  inject,
  watch,
  reactive,
  computed,
  watchEffect,
} from 'vue';
import type { VueNode } from '../../_util/type';
import { objectType } from '../../_util/type';
import { type ImagePreviewType, mergeDefaultValue } from './Image';
import Preview from './Preview';
import type { PreviewPopupClassNames, PreviewPopupStyles, PreviewProps } from './Preview';
import useMergedState from '../../_util/hooks/useMergedState';

export interface PreviewGroupItemObject {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  crossOrigin?: string;
  [key: string]: any;
}

export type PreviewGroupItem = string | PreviewGroupItemObject;

export interface PreviewGroupPreview
  extends Omit<ImagePreviewType, 'icons' | 'maskClassName' | 'onVisibleChange' | 'onOpenChange'> {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
  countRender?: (current: number, total: number) => VueNode;
  onChange?: (current: number, prevCurrent: number) => void;
  onOpenChange?: (open: boolean, info: { current: number }) => void;
  /** @deprecated Use `onOpenChange` instead */
  onVisibleChange?: (visible: boolean, prevVisible: boolean, current?: number) => void;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  preview?: boolean | PreviewGroupPreview;
  items?: PreviewGroupItem[];
  fallback?: string;
}

interface PreviewUrl {
  url: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  canPreview: boolean;
}

export interface PreviewItemData {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

export interface GroupConsumerValue extends Omit<GroupConsumerProps, 'fallback'> {
  isPreviewGroup?: Ref<boolean | undefined>;
  previewUrls: ComputedRef<Map<number, string>>;
  previewItems?: ComputedRef<Map<number, PreviewItemData>>;
  setPreviewUrls: (id: number, url: string, canPreview?: boolean) => void;
  current: Ref<number>;
  setCurrent: (current: number) => void;
  onActive?: (offset: number) => void;
  setShowPreview: (isShowPreview: boolean) => void;
  setMousePosition: (mousePosition: null | { x: number; y: number }) => void;
  registerImage: (
    id: number,
    url: string,
    canPreview?: boolean,
    meta?: { alt?: string; width?: string | number; height?: string | number },
  ) => () => void;
  fallback?: ComputedRef<string | undefined>;
  rootClassName?: string;
}

const previewGroupContext = Symbol('previewGroupContext');
export const context = {
  provide: (val: GroupConsumerValue) => {
    provide(previewGroupContext, val);
  },
  inject: () => {
    return inject<GroupConsumerValue>(previewGroupContext, {
      isPreviewGroup: shallowRef(false),
      previewUrls: computed(() => new Map()),
      previewItems: computed(() => new Map()),
      setPreviewUrls: () => {},
      current: ref(null),
      setCurrent: () => {},
      onActive: () => {},
      setShowPreview: () => {},
      setMousePosition: () => {},
      registerImage: null,
      fallback: computed(() => undefined),
      rootClassName: '',
    });
  },
};

export const imageGroupProps = () => ({
  previewPrefixCls: String,
  preview: {
    type: [Boolean, Object] as PropType<boolean | PreviewGroupPreview>,
    default: true as boolean | PreviewGroupPreview,
  },
  items: {
    type: Array as PropType<PreviewGroupItem[]>,
    default: undefined,
  },
  fallback: String,
  countRender: Function as PropType<(current: number, total: number) => VueNode>,
  onChange: Function as PropType<(current: number, prevCurrent: number) => void>,
  popupClassNames: objectType<PreviewPopupClassNames>(),
  popupStyles: objectType<PreviewPopupStyles>(),
  icons: {
    type: Object as PropType<PreviewProps['icons']>,
    default: () => ({}),
  },
});

const Group = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'PreviewGroup',
  inheritAttrs: false,
  props: imageGroupProps(),
  setup(props, { slots }) {
    const preview = computed<PreviewGroupPreview>(() => {
      const defaultValues = {
        visible: undefined,
        open: undefined,
        onVisibleChange: undefined,
        onOpenChange: undefined,
        getContainer: undefined,
        current: 0,
      };
      return typeof props.preview === 'object' && props.preview !== null
        ? mergeDefaultValue(props.preview, defaultValues)
        : defaultValues;
    });
    const previewUrls = reactive(new Map<number, PreviewUrl>());
    const current = ref<number>(0);

    const hasItems = computed(() => Array.isArray(props.items));

    const canPreviewItems = computed(() => {
      if (hasItems.value) {
        const map = new Map<number, PreviewItemData>();
        (props.items || []).forEach((item, index) => {
          if (typeof item === 'string') {
            map.set(index, { src: item });
          } else if (item && typeof item === 'object') {
            map.set(index, {
              src: item.src,
              alt: item.alt,
              width: item.width,
              height: item.height,
            });
          }
        });
        return map;
      }
      return new Map<number, PreviewItemData>(
        Array.from(previewUrls)
          .filter(([, { canPreview }]) => !!canPreview)
          .map(([id, { url, alt, width, height }]) => [id, { src: url, alt, width, height }]),
      );
    });

    const canPreviewUrls = computed(() => {
      const map = new Map<number, string>();
      canPreviewItems.value.forEach((item, key) => {
        map.set(key, item.src);
      });
      return map;
    });

    const previewUrlsKeys = computed(() => Array.from(canPreviewUrls.value.keys()));
    const currentIndex = computed(() => {
      const idx = previewUrlsKeys.value.indexOf(current.value);
      return idx >= 0 ? idx : 0;
    });

    const previewVisible = computed(() => preview.value.open ?? preview.value.visible);
    const getPreviewContainer = computed(() => preview.value.getContainer);
    const onPreviewVisibleChange = (val: boolean, preval: boolean) => {
      preview.value.onOpenChange?.(val, { current: currentIndex.value });
      preview.value.onVisibleChange?.(val, preval, currentIndex.value);
    };
    const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange,
    });

    const mousePosition = ref<{ x: number; y: number }>(null);
    const isControlled = computed(() => previewVisible.value !== undefined);
    const currentControlledKey = computed(
      () => previewUrlsKeys.value[preview.value.current ?? 0] ?? previewUrlsKeys.value[0],
    );

    const setPreviewUrls = (id: number, url: string, canPreview = true) => {
      previewUrls.set(id, {
        url,
        canPreview,
      });
    };

    const setCurrent = (val: number) => {
      if (hasItems.value && !canPreviewUrls.value.has(val)) {
        // When items prop is provided and a child Image is clicked, map to its index or 0
        const keys = Array.from(previewUrls.keys());
        const childIdx = keys.indexOf(val);
        const targetKey = childIdx >= 0 && canPreviewUrls.value.has(childIdx) ? childIdx : 0;
        current.value = targetKey;
        return;
      }
      current.value = val;
    };

    const onActive = (offset: number) => {
      const prevIdx = currentIndex.value;
      const nextIdx = prevIdx + offset;
      if (nextIdx >= 0 && nextIdx < previewUrlsKeys.value.length) {
        current.value = previewUrlsKeys.value[nextIdx];
        const onChangeFn = preview.value.onChange ?? props.onChange;
        onChangeFn?.(nextIdx, prevIdx);
      }
    };

    const setMousePosition = (val: null | { x: number; y: number }) => {
      mousePosition.value = val;
    };

    const registerImage = (
      id: number,
      url: string,
      canPreview = true,
      meta?: { alt?: string; width?: string | number; height?: string | number },
    ) => {
      const unRegister = () => {
        previewUrls.delete(id);
      };
      previewUrls.set(id, {
        url,
        alt: meta?.alt,
        width: meta?.width,
        height: meta?.height,
        canPreview,
      });
      return unRegister;
    };

    const onPreviewClose = (e: any) => {
      e?.stopPropagation();
      setShowPreview(false);
      setMousePosition(null);
    };

    watch(
      currentControlledKey,
      val => {
        if (val !== undefined) {
          current.value = val;
        }
      },
      {
        immediate: true,
        flush: 'post',
      },
    );
    watchEffect(
      () => {
        if (isShowPreview.value && isControlled.value && currentControlledKey.value !== undefined) {
          current.value = currentControlledKey.value;
        }
      },
      {
        flush: 'post',
      },
    );

    const fallbackRef = computed(() => props.fallback);

    context.provide({
      isPreviewGroup: shallowRef(true),
      previewUrls: canPreviewUrls,
      previewItems: canPreviewItems,
      setPreviewUrls,
      current,
      setCurrent,
      onActive,
      setShowPreview,
      setMousePosition,
      registerImage,
      fallback: fallbackRef,
    });

    return () => {
      const {
        open: _open,
        visible: _visible,
        onOpenChange: _onOpenChange,
        onVisibleChange: _onVisibleChange,
        current: _current,
        onChange: _onChange,
        countRender: previewCountRender,
        mask: previewMaskProp,
        ...dialogProps
      } = preview.value;

      return (
        <>
          {slots.default && slots.default()}
          <Preview
            {...dialogProps}
            mask={typeof previewMaskProp === 'boolean' ? previewMaskProp : true}
            aria-hidden={!isShowPreview.value}
            visible={isShowPreview.value}
            prefixCls={props.previewPrefixCls}
            onClose={onPreviewClose}
            mousePosition={mousePosition.value}
            src={canPreviewUrls.value.get(current.value)}
            fallback={props.fallback}
            countRender={previewCountRender ?? props.countRender}
            popupClassNames={props.popupClassNames}
            popupStyles={props.popupStyles}
            icons={props.icons}
            getContainer={getPreviewContainer.value}
          />
        </>
      );
    };
  },
});

export default Group;
