import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { getStatusClassNames } from '../_util/statusUtils';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType, Variant } from '../config-provider/context';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useCompactItemContext } from './Compact';
import useStyle from './style/addon';

export const spaceAddonProps = () => ({
  prefixCls: String,
  variant: {
    type: String as PropType<Variant>,
    default: 'outlined' as Variant,
  },
  disabled: {
    type: Boolean,
    default: undefined,
  },
  status: String as PropType<InputStatus>,
  size: String as PropType<SizeType>,
});

export type SpaceAddonProps = Partial<ExtractPropTypes<ReturnType<typeof spaceAddonProps>>>;

const SpaceAddon = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASpaceAddon',
  inheritAttrs: false,
  props: spaceAddonProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject('space-addon', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const { compactItemClassnames, compactSize } = useCompactItemContext(prefixCls, direction);

    const mergedSize = computed(() => props.size ?? compactSize.value);

    const classes = computed(() => {
      const statusCls = getStatusClassNames(prefixCls.value, props.status);
      return classNames(
        prefixCls.value,
        hashId.value,
        compactItemClassnames.value,
        `${prefixCls.value}-variant-${props.variant || 'outlined'}`,
        statusCls,
        {
          [`${prefixCls.value}-${mergedSize.value}`]: !!mergedSize.value,
          [`${prefixCls.value}-disabled`]: !!props.disabled,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      );
    });

    return () =>
      wrapSSR(
        <div {...attrs} class={[classes.value, attrs.class]} style={attrs.style as CSSProperties}>
          {slots.default?.()}
        </div>,
      );
  },
});

export default SpaceAddon;
