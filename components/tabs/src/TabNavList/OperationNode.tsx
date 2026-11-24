import Menu, { MenuItem } from '../../../menu';
import Dropdown from '../../../vc-dropdown';
import type { Tab, TabsLocale, EditableConfig, MoreProps } from '../interface';
import AddButton from './AddButton';
import type { CustomSlotsType, Key } from '../../../_util/type';
import { functionType, objectType } from '../../../_util/type';
import KeyCode from '../../../_util/KeyCode';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import classNames from '../../../_util/classNames';
import { defineComponent, watch, computed, onMounted } from 'vue';
import PropTypes from '../../../_util/vue-types';
import useState from '../../../_util/hooks/useState';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import { useProvideOverride } from '../../../menu/src/OverrideContext';
import { useInjectTabs } from '../TabContext';

export const operationNodeProps = {
  prefixCls: { type: String },
  id: { type: String },
  tabs: { type: Object as PropType<Tab[]> },
  rtl: { type: Boolean },
  tabBarGutter: { type: Number },
  activeKey: { type: [String, Number] },
  mobile: { type: Boolean },
  more: objectType<MoreProps>(),
  moreIcon: PropTypes.any,
  moreTransitionName: { type: String },
  editable: { type: Object as PropType<EditableConfig> },
  locale: { type: Object as PropType<TabsLocale>, default: undefined as TabsLocale },
  removeAriaLabel: String,
  onTabClick: { type: Function as PropType<(key: Key, e: MouseEvent | KeyboardEvent) => void> },
  popupClassName: String,
  getPopupContainer: functionType<
    ((triggerNode?: HTMLElement | undefined) => HTMLElement) | undefined
  >(),
};

export type OperationNodeProps = Partial<ExtractPropTypes<typeof operationNodeProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OperationNode',
  inheritAttrs: false,
  props: operationNodeProps,
  emits: ['tabClick'],
  slots: Object as CustomSlotsType<{
    moreIcon?: any;
    default?: any;
  }>,
  setup(props, { attrs, slots }) {
    // ======================== Dropdown ========================
    const [open, setOpen] = useState(false);
    const mergedOpen = computed(() => props.more?.open ?? props.more?.visible ?? open.value);
    const handleVisibleChange = (nextOpen: boolean) => {
      setOpen(nextOpen);
      props.more?.onOpenChange?.(nextOpen);
      props.more?.onVisibleChange?.(nextOpen);
    };
    const [selectedKey, setSelectedKey] = useState<Key>(null);
    const selectOffset = (offset: -1 | 1) => {
      const enabledTabs = props.tabs.filter(tab => !tab.disabled);
      let selectedIndex = enabledTabs.findIndex(tab => tab.key === selectedKey.value) || 0;
      const len = enabledTabs.length;

      for (let i = 0; i < len; i += 1) {
        selectedIndex = (selectedIndex + offset + len) % len;
        const tab = enabledTabs[selectedIndex];
        if (!tab.disabled) {
          setSelectedKey(tab.key);
          return;
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const { which } = e;

      if (!mergedOpen.value) {
        if ([KeyCode.DOWN, KeyCode.SPACE, KeyCode.ENTER].includes(which)) {
          handleVisibleChange(true);
          e.preventDefault();
        }
        return;
      }

      switch (which) {
        case KeyCode.UP:
          selectOffset(-1);
          e.preventDefault();
          break;
        case KeyCode.DOWN:
          selectOffset(1);
          e.preventDefault();
          break;
        case KeyCode.ESC:
          handleVisibleChange(false);
          break;
        case KeyCode.SPACE:
        case KeyCode.ENTER:
          if (selectedKey.value !== null) props.onTabClick(selectedKey.value, e);
          break;
      }
    };
    const popupId = computed(() => `${props.id}-more-popup`);

    const selectedItemId = computed(() =>
      selectedKey.value !== null ? `${popupId.value}-${selectedKey.value}` : null,
    );

    const onRemoveTab = (event: MouseEvent | KeyboardEvent, key: Key) => {
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key,
        event,
      });
    };

    onMounted(() => {
      watch(
        selectedKey,
        () => {
          const ele = document.getElementById(selectedItemId.value);
          if (ele && ele.scrollIntoView) {
            ele.scrollIntoView(false);
          }
        },
        { flush: 'post', immediate: true },
      );
    });

    watch(mergedOpen, () => {
      if (!mergedOpen.value) {
        setSelectedKey(null);
      }
    });
    const { classNames: semanticClassNames, styles: semanticStyles } = useInjectTabs();
    useProvideOverride({});
    return () => {
      const {
        prefixCls,
        id,
        tabs,
        locale,
        mobile,
        more,
        moreIcon,
        moreTransitionName,
        editable,
        tabBarGutter,
        rtl,
        onTabClick,
        popupClassName,
      } = props;
      if (!tabs.length && !more?.open && !more?.visible) return null;
      const dropdownPrefix = `${prefixCls}-dropdown`;

      const dropdownAriaLabel = locale?.dropdownAriaLabel;

      const {
        icon: morePropIcon,
        trigger: moreTrigger = ['hover'],
        overlayClassName: moreOverlayClassName,
        overlayStyle: moreOverlayStyle,
        transitionName: morePropTransitionName,
        open: _moreOpen,
        visible: _moreVisible,
        onOpenChange: _moreOnOpenChange,
        onVisibleChange: _moreOnVisibleChange,
        getPopupContainer: moreGetPopupContainer,
        popupRender: morePopupRender,
        ...restMoreProps
      } = more || {};

      const resolvedMoreIcon =
        morePropIcon !== undefined
          ? morePropIcon
          : moreIcon !== undefined
          ? moreIcon
          : slots.moreIcon?.() || <EllipsisOutlined />;
      const normalizedTrigger = Array.isArray(moreTrigger) ? moreTrigger : [moreTrigger];

      // ========================= Render =========================
      const moreStyle: CSSProperties = {
        [rtl ? 'marginRight' : 'marginLeft']: tabBarGutter,
      };
      if (!tabs.length) {
        moreStyle.visibility = 'hidden';
        moreStyle.order = 1;
      }

      const popupRootClassName = semanticClassNames?.value?.popup?.root;
      const popupRootStyle = semanticStyles?.value?.popup?.root;

      const overlayClassName = classNames(
        {
          [`${dropdownPrefix}-rtl`]: rtl,
        },
        popupClassName,
        popupRootClassName,
        moreOverlayClassName,
      );
      const mergedOverlayStyle =
        popupRootStyle || moreOverlayStyle ? { ...popupRootStyle, ...moreOverlayStyle } : undefined;
      const moreNode = mobile ? null : (
        <Dropdown
          {...restMoreProps}
          prefixCls={dropdownPrefix}
          trigger={normalizedTrigger}
          visible={mergedOpen.value}
          transitionName={morePropTransitionName ?? moreTransitionName}
          onVisibleChange={handleVisibleChange}
          overlayClassName={overlayClassName}
          overlayStyle={mergedOverlayStyle}
          mouseEnterDelay={0.1}
          mouseLeaveDelay={0.1}
          getPopupContainer={moreGetPopupContainer ?? props.getPopupContainer}
          v-slots={{
            overlay: () => {
              const menuNode = (
                <Menu
                  onClick={({ key, domEvent }) => {
                    onTabClick(key, domEvent);
                    handleVisibleChange(false);
                  }}
                  id={popupId.value}
                  tabindex={-1}
                  role="listbox"
                  aria-activedescendant={selectedItemId.value}
                  selectedKeys={[selectedKey.value]}
                  aria-label={
                    dropdownAriaLabel !== undefined ? dropdownAriaLabel : 'expanded dropdown'
                  }
                >
                  {tabs.map(tab => {
                    const removable =
                      editable &&
                      tab.closable !== false &&
                      tab.closeIcon !== null &&
                      tab.closeIcon !== false &&
                      !tab.disabled;
                    const resolvedCloseIcon =
                      typeof tab.closeIcon === 'function'
                        ? (tab.closeIcon as () => any)()
                        : tab.closeIcon;
                    return (
                      <MenuItem
                        key={tab.key}
                        id={`${popupId.value}-${tab.key}`}
                        role="option"
                        aria-controls={id && `${id}-panel-${tab.key}`}
                        disabled={tab.disabled}
                      >
                        <span>{typeof tab.tab === 'function' ? tab.tab() : tab.tab}</span>
                        {removable && (
                          <button
                            type="button"
                            aria-label={props.removeAriaLabel || 'remove'}
                            tabindex={0}
                            class={classNames(
                              `${dropdownPrefix}-menu-item-remove`,
                              semanticClassNames?.value?.remove,
                            )}
                            style={semanticStyles?.value?.remove}
                            onClick={e => {
                              e.stopPropagation();
                              onRemoveTab(e, tab.key);
                            }}
                          >
                            {resolvedCloseIcon ?? editable.removeIcon?.() ?? '×'}
                          </button>
                        )}
                      </MenuItem>
                    );
                  })}
                </Menu>
              );
              if (morePopupRender) {
                const restTabs = tabs.map(tab => ({
                  ...tab,
                  label: tab.label ?? (typeof tab.tab === 'function' ? tab.tab() : tab.tab),
                }));
                return morePopupRender(menuNode, {
                  restTabs,
                  onClose: () => handleVisibleChange(false),
                });
              }
              return menuNode;
            },
            default: () => (
              <button
                type="button"
                class={`${prefixCls}-nav-more`}
                style={moreStyle}
                tabindex={-1}
                aria-hidden="true"
                aria-haspopup="listbox"
                aria-controls={popupId.value}
                id={`${id}-more`}
                aria-expanded={mergedOpen.value}
                onKeydown={onKeyDown}
              >
                {resolvedMoreIcon}
              </button>
            ),
          }}
        ></Dropdown>
      );

      return (
        <div
          class={classNames(`${prefixCls}-nav-operations`, attrs.class)}
          style={attrs.style as CSSProperties}
        >
          {moreNode}
          <AddButton prefixCls={prefixCls} locale={locale} editable={editable} />
        </div>
      );
    };
  },
});
