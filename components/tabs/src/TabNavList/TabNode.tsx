import type { Tab, EditableConfig } from '../interface';
import type { CSSProperties, PropType } from 'vue';
import { defineComponent, computed, ref } from 'vue';
import type { FocusEventHandler } from '../../../_util/EventInterface';
import KeyCode from '../../../_util/KeyCode';
import classNames from '../../../_util/classNames';
import { useInjectTabs } from '../TabContext';

export interface TabNodeProps {
  id: string;
  prefixCls: string;
  tab: Tab;
  active: boolean;
  closable?: boolean;
  editable?: EditableConfig;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
  onResize?: (width: number, height: number, left: number, top: number) => void;
  renderWrapper?: (node: any) => any;
  removeAriaLabel?: string;
  onRemove: () => void;
  onFocus: FocusEventHandler;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TabNode',
  props: {
    id: { type: String as PropType<string> },
    prefixCls: { type: String as PropType<string> },
    tab: { type: Object as PropType<Tab> },
    active: { type: Boolean },
    closable: { type: Boolean },
    editable: { type: Object as PropType<EditableConfig> },
    onClick: { type: Function as PropType<(e: MouseEvent | KeyboardEvent) => void> },
    onResize: {
      type: Function as PropType<
        (width: number, height: number, left: number, top: number) => void
      >,
    },
    renderWrapper: { type: Function as PropType<(node: any) => any> },
    removeAriaLabel: { type: String },
    // onRemove: { type: Function as PropType<() => void> },
    onFocus: { type: Function as PropType<FocusEventHandler> },
  },
  emits: ['click', 'resize', 'remove', 'focus'],
  setup(props, { expose, attrs }) {
    const domRef = ref();
    function onInternalClick(e: MouseEvent | KeyboardEvent) {
      if (props.tab?.disabled) {
        return;
      }
      props.onClick(e);
    }
    expose({
      domRef,
    });
    // onBeforeUnmount(() => {
    //   props.onRemove();
    // });
    function onRemoveTab(event: MouseEvent | KeyboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key: props.tab?.key,
        event,
      });
    }

    const { classNames: semanticClassNames, styles: semanticStyles } = useInjectTabs();

    const removable = computed(
      () =>
        props.editable &&
        props.closable !== false &&
        props.tab?.closeIcon !== null &&
        props.tab?.closeIcon !== false &&
        !props.tab?.disabled,
    );
    return () => {
      const {
        prefixCls,
        id,
        active,
        tab: { key, tab, icon, disabled, closeIcon },
        renderWrapper,
        removeAriaLabel,
        editable,
        onFocus,
      } = props;
      const tabPrefix = `${prefixCls}-tab`;
      const resolvedIcon = typeof icon === 'function' ? (icon as () => any)() : icon;
      const resolvedTab = typeof tab === 'function' ? (tab as () => any)() : tab;
      const resolvedCloseIcon =
        typeof closeIcon === 'function' ? (closeIcon as () => any)() : closeIcon;
      const itemStyle = semanticStyles?.value?.item;
      const mergedItemStyle = itemStyle
        ? ([attrs.style as CSSProperties, itemStyle] as any)
        : (attrs.style as CSSProperties);
      const node = (
        <div
          key={key}
          ref={domRef}
          class={classNames(
            tabPrefix,
            {
              [`${tabPrefix}-with-remove`]: removable.value,
              [`${tabPrefix}-active`]: active,
              [`${tabPrefix}-disabled`]: disabled,
            },
            semanticClassNames?.value?.item,
          )}
          style={mergedItemStyle}
          onClick={onInternalClick}
        >
          {/* Primary Tab Button */}
          <div
            role="tab"
            aria-selected={active}
            id={id && `${id}-tab-${key}`}
            class={`${tabPrefix}-btn`}
            aria-controls={id && `${id}-panel-${key}`}
            aria-disabled={disabled}
            tabindex={disabled ? null : 0}
            onClick={e => {
              e.stopPropagation();
              onInternalClick(e);
            }}
            onKeydown={e => {
              if ([KeyCode.SPACE, KeyCode.ENTER].includes(e.which)) {
                e.preventDefault();
                onInternalClick(e);
              }
            }}
            onFocus={onFocus}
          >
            {resolvedIcon !== undefined && resolvedIcon !== null
              ? [<span class={`${tabPrefix}-icon`}>{resolvedIcon}</span>, resolvedTab]
              : resolvedTab}
          </div>

          {/* Remove Button */}
          {removable.value && (
            <button
              type="button"
              aria-label={removeAriaLabel || 'remove'}
              tabindex={0}
              class={classNames(`${tabPrefix}-remove`, semanticClassNames?.value?.remove)}
              style={semanticStyles?.value?.remove}
              onClick={e => {
                e.stopPropagation();
                onRemoveTab(e);
              }}
            >
              {resolvedCloseIcon ?? editable.removeIcon?.() ?? '×'}
            </button>
          )}
        </div>
      );
      return renderWrapper ? renderWrapper(node) : node;
    };
  },
});
