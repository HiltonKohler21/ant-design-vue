import { cloneElement } from '../_util/vnode';
import type { AvatarSize } from './Avatar';
import Avatar from './Avatar';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
import { computed, defineComponent, watchEffect } from 'vue';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { useAvatarProviderContext } from './AvatarContext';
import classNames from '../_util/classNames';

export interface AvatarGroupMaxProps {
  count?: number;
  style?: CSSProperties;
  popover?: PopoverProps;
}

export const groupProps = () => ({
  prefixCls: String,
  rootClassName: String,
  maxCount: Number,
  /** 5.18+ 支持 `{ count, style, popover }`，同时兼容旧版 `number` */
  max: {
    type: [Number, Object] as PropType<number | AvatarGroupMaxProps>,
    default: undefined,
  },
  maxStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  maxPopoverPlacement: { type: String as PropType<'top' | 'bottom'>, default: 'top' },
  maxPopoverTrigger: String as PropType<'hover' | 'focus' | 'click'>,
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: {
    type: [Number, String, Object] as PropType<AvatarSize>,
    default: 'default' as AvatarSize,
  },
  shape: { type: String as PropType<'circle' | 'square'>, default: 'circle' },
});

export type AvatarGroupProps = Partial<ExtractPropTypes<ReturnType<typeof groupProps>>>;

const Group = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAvatarGroup',
  inheritAttrs: false,
  props: groupProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('avatar', props);
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    watchEffect(() => {
      const context = { size: props.size, shape: props.shape };
      useAvatarProviderContext(context);
    });
    return () => {
      const {
        maxPopoverPlacement = 'top',
        maxCount,
        max,
        maxStyle,
        maxPopoverTrigger = 'hover',
        shape,
      } = props;
      const maxConfig = typeof max === 'object' && max !== null ? max : undefined;
      const mergedMax = typeof max === 'number' ? max : maxConfig?.count ?? maxCount;

      const cls = {
        [groupPrefixCls.value]: true,
        [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${attrs.class}`]: !!attrs.class,
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: true,
      };

      const children = getPropsSlot(slots, props);
      const childrenWithProps = flattenChildren(children).map((child, index) =>
        cloneElement(child, {
          key: `avatar-key-${index}`,
        }),
      );

      const numOfChildren = childrenWithProps.length;
      if (mergedMax && mergedMax < numOfChildren) {
        const childrenShow = childrenWithProps.slice(0, mergedMax);
        const childrenHidden = childrenWithProps.slice(mergedMax, numOfChildren);

        const mergedMaxStyle = maxConfig?.style ? { ...maxStyle, ...maxConfig.style } : maxStyle;
        const maxPopover = maxConfig?.popover || {};
        const mergedPopoverTrigger = maxPopover.trigger || maxPopoverTrigger;
        const mergedPopoverPlacement = maxPopover.placement || maxPopoverPlacement;

        childrenShow.push(
          <Popover
            key="avatar-popover-key"
            content={childrenHidden}
            {...maxPopover}
            trigger={mergedPopoverTrigger}
            placement={mergedPopoverPlacement}
            overlayClassName={classNames(
              `${groupPrefixCls.value}-popover`,
              maxPopover.overlayClassName,
            )}
          >
            <Avatar style={mergedMaxStyle} shape={shape}>{`+${numOfChildren - mergedMax}`}</Avatar>
          </Popover>,
        );
        return wrapSSR(
          <div {...attrs} class={cls} style={attrs.style as CSSProperties}>
            {childrenShow}
          </div>,
        );
      }

      return wrapSSR(
        <div {...attrs} class={cls} style={attrs.style as CSSProperties}>
          {childrenWithProps}
        </div>,
      );
    };
  },
});

export default Group;
