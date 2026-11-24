import type { CSSProperties } from 'vue';
import { computed, defineComponent, provide, shallowRef } from 'vue';
import classNames from '../_util/classNames';
import ConfigProvider from '../config-provider';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideOverride } from '../menu/src/OverrideContext';
import DropdownMenu from '../vc-mentions/src/DropdownMenu';
import MentionsContextKey from '../vc-mentions/src/MentionsContext';
import useStyle from './style';

function noop() {}

export default function genMentionsPurePanel(
  MentionsComponent: any,
  getProps: () => Record<string, any>,
) {
  return defineComponent({
    compatConfig: { MODE: 3 },
    name: 'AMentionsPurePanel',
    inheritAttrs: false,
    props: getProps(),
    setup(props, { attrs, slots }) {
      const { prefixCls } = useConfigInject('mentions', props as any);
      const [wrapSSR, hashId] = useStyle(prefixCls);
      const activeIndex = shallowRef(0);

      useProvideOverride({
        prefixCls: computed(() => `${prefixCls.value}-menu`),
        mode: computed(() => 'vertical'),
        selectable: computed(() => false),
        onClick: noop,
      });

      provide(MentionsContextKey, {
        activeIndex,
        setActiveIndex: (idx: number) => {
          activeIndex.value = idx;
        },
        selectOption: noop,
        onFocus: noop,
        onBlur: noop,
        loading: computed(() => !!(props as any).loading),
      });

      return () => {
        const p = props as any;
        const options = p.options || [];
        const dropdownPrefix = `${prefixCls.value}-dropdown`;
        const menuNode = (
          <DropdownMenu
            prefixCls={dropdownPrefix}
            options={options}
            v-slots={{ notFoundContent: slots.notFoundContent, option: slots.option }}
          />
        );
        const popupContent = p.popupRender
          ? p.popupRender(menuNode)
          : slots.popupRender
          ? slots.popupRender({ menu: menuNode, originNode: menuNode })
          : menuNode;

        return wrapSSR(
          <ConfigProvider theme={{ token: { zIndexPopupBase: 0 } }}>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: (attrs.style as CSSProperties)?.width || '100%',
              }}
            >
              <MentionsComponent
                {...attrs}
                {...props}
                style={[attrs.style, { margin: 0 }] as any}
                v-slots={slots}
              />
              <div
                class={classNames(
                  dropdownPrefix,
                  `${dropdownPrefix}-pure`,
                  p.popupClassName,
                  p.rootClassName,
                  hashId.value,
                )}
              >
                {popupContent}
              </div>
            </div>
          </ConfigProvider>,
        );
      };
    },
  });
}
