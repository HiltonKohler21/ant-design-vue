import type { CSSProperties } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ConfigProvider from '../../config-provider';
import useConfigInject from '../../config-provider/hooks/useConfigInject';

/* istanbul ignore next */
export default function genPurePanel(
  Component: any,
  alignPropName: 'align' | 'dropdownAlign' | 'popupAlign' = 'dropdownAlign',
  postProps?: (props: Record<string, any>) => Record<string, any>,
  defaultPrefixCls = 'select',
  getDropdownCls?: (prefixCls: string) => string,
) {
  const PurePanelInner = defineComponent({
    compatConfig: { MODE: 3 },
    name: `${Component.name || 'Select'}PurePanel`,
    inheritAttrs: false,
    props: {
      prefixCls: String,
      open: { type: Boolean, default: undefined },
    },
    setup(props, { attrs, slots }) {
      const holderRef = ref<HTMLDivElement | null>(null);
      const popupHeight = ref(0);
      const popupWidth = ref(0);
      const mounted = ref(false);
      const innerOpen = ref(false);

      const { prefixCls } = useConfigInject(defaultPrefixCls, props);

      const mergedOpen = computed(() =>
        mounted.value ? (props.open !== undefined ? props.open : innerOpen.value) : false,
      );

      let resizeObserver: ResizeObserver | undefined;
      let timer: ReturnType<typeof setInterval> | undefined;

      const cleanupObserver = () => {
        if (timer) {
          clearInterval(timer);
          timer = undefined;
        }
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = undefined;
        }
      };

      const observePopup = () => {
        cleanupObserver();
        if (!mergedOpen.value) {
          popupHeight.value = 0;
          popupWidth.value = 0;
          return;
        }
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(entries => {
            const element = entries[0]?.target as HTMLDivElement | undefined;
            if (element) {
              popupHeight.value = element.offsetHeight + 8;
              popupWidth.value = element.offsetWidth;
            }
          });

          const dropdownCls = getDropdownCls
            ? `.${getDropdownCls(prefixCls.value)}`
            : `.${prefixCls.value}-dropdown`;

          const tryObserve = () => {
            const popup = holderRef.value?.querySelector(dropdownCls) as HTMLDivElement | null;
            if (popup) {
              if (timer) {
                clearInterval(timer);
                timer = undefined;
              }
              popupHeight.value = popup.offsetHeight + 8;
              popupWidth.value = popup.offsetWidth;
              resizeObserver?.observe(popup);
              return true;
            }
            return false;
          };

          if (!tryObserve()) {
            timer = setInterval(tryObserve, 10);
          }
        }
      };

      onMounted(() => {
        mounted.value = true;
        innerOpen.value = true;
        observePopup();
      });

      watch([mergedOpen, prefixCls], () => {
        observePopup();
      });

      onBeforeUnmount(() => {
        cleanupObserver();
      });

      return () => {
        const { style: attrStyle, class: attrClass, ...restAttrs } = attrs;
        const baseStyle: CSSProperties =
          attrStyle && typeof attrStyle === 'object' && !Array.isArray(attrStyle)
            ? { ...(attrStyle as CSSProperties), margin: 0 }
            : { margin: 0 };

        let mergedProps: Record<string, any> = {
          ...restAttrs,
          ...(props.prefixCls !== undefined ? { prefixCls: props.prefixCls } : {}),
          class: attrClass,
          style: Array.isArray(attrStyle) ? [...attrStyle, { margin: 0 }] : baseStyle,
          open: mergedOpen.value,
          getPopupContainer: () => holderRef.value || document.body,
        };

        if (postProps) {
          mergedProps = postProps(mergedProps);
        }

        if (alignPropName) {
          mergedProps = {
            ...mergedProps,
            [alignPropName]: {
              overflow: {
                adjustX: false,
                adjustY: false,
              },
            },
          };
        }

        const holderStyle: CSSProperties = {
          paddingBottom: popupHeight.value ? `${popupHeight.value}px` : undefined,
          position: 'relative',
          minWidth: popupWidth.value ? `${popupWidth.value}px` : undefined,
          maxWidth: '100%',
        };

        return (
          <div ref={holderRef} style={holderStyle}>
            <Component {...mergedProps} v-slots={slots} />
          </div>
        );
      };
    },
  });

  return defineComponent({
    compatConfig: { MODE: 3 },
    name: `${Component.name || 'Select'}PurePanelWrapper`,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => (
        <ConfigProvider theme={{ token: { motion: false, zIndexPopupBase: 0 } as any }}>
          <PurePanelInner {...attrs} v-slots={slots} />
        </ConfigProvider>
      );
    },
  });
}
