import type { ExtractPropTypes, HTMLAttributes } from 'vue';
import { computed, defineComponent } from 'vue';
import Button from '../button';
import Dropdown from './dropdown';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import { dropdownButtonProps } from './props';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';

import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';

const ButtonGroup = Button.Group;

export type DropdownButtonProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownButtonProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADropdownButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: initDefaultProps(dropdownButtonProps(), {
    trigger: 'hover',
    placement: 'bottomRight',
    type: 'default',
  }),
  // emits: ['click', 'visibleChange', 'update:visible'],
  slots: Object as CustomSlotsType<{
    icon: any;
    leftButton: { button: any };
    rightButton: { button: any };
    overlay: any;
    default: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const handleVisibleChange = (val: boolean, info?: { source: 'trigger' | 'menu' }) => {
      emit('update:visible', val);
      emit('visibleChange', val, info);
      emit('update:open', val);
      emit('openChange', val, info);
    };

    const { prefixCls, direction, getPopupContainer } = useConfigInject('dropdown', props);
    const buttonPrefixCls = computed(() => `${prefixCls.value}-button`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const {
        type = 'default',
        disabled,
        danger,
        loading,
        htmlType,
        class: className = '',
        overlay = slots.overlay?.(),
        menu,
        arrow,
        autoAdjustOverflow,
        trigger,
        align,
        open,
        visible,
        onVisibleChange: _onVisibleChange,
        placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
        href,
        title,
        icon = slots.icon?.() || <EllipsisOutlined />,
        mouseEnterDelay,
        mouseLeaveDelay,
        overlayClassName,
        overlayStyle,
        rootClassName,
        classNames: semanticClassNames,
        styles: semanticStyles,
        dropdownRender,
        popupRender,
        destroyPopupOnHide,
        destroyOnHidden,
        onClick,
        buttonsRender,
        'onUpdate:open': _updateVisible,
        ...restProps
      } = { ...props, ...attrs } as DropdownButtonProps & HTMLAttributes;

      const dropdownProps = {
        align,
        arrow,
        autoAdjustOverflow,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer: getPopupContainer?.value,
        onOpenChange: handleVisibleChange,
        buttonsRender,
        mouseEnterDelay,
        mouseLeaveDelay,
        open,
        visible,
        menu,
        overlayClassName,
        overlayStyle,
        rootClassName,
        classNames: semanticClassNames,
        styles: semanticStyles,
        dropdownRender,
        popupRender,
        destroyPopupOnHide,
        destroyOnHidden,
      };

      const leftButton = (
        <Button
          danger={danger}
          type={type}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
          htmlType={htmlType}
          href={href}
          title={title}
          v-slots={{ default: slots.default }}
        ></Button>
      );

      const rightButton = <Button danger={danger} type={type} icon={icon} />;

      const [leftButtonToRender, rightButtonToRender] = buttonsRender
        ? buttonsRender([leftButton, rightButton])
        : [leftButton, rightButton];

      const hasOverlay = props.overlay !== undefined || !!slots.overlay;

      return wrapSSR(
        <ButtonGroup
          {...restProps}
          class={classNames(buttonPrefixCls.value, className, hashId.value)}
        >
          {slots.leftButton ? slots.leftButton({ button: leftButtonToRender }) : leftButtonToRender}
          <Dropdown
            {...dropdownProps}
            v-slots={hasOverlay ? { overlay: () => overlay } : undefined}
          >
            {slots.rightButton
              ? slots.rightButton({ button: rightButtonToRender })
              : rightButtonToRender}
          </Dropdown>
        </ButtonGroup>,
      );
    };
  },
});
