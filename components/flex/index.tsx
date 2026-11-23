import { computed, defineComponent } from 'vue';
import type { CSSProperties } from 'vue';
import { useConfigContextInject } from '../config-provider/context';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { isPresetSize } from '../_util/gapSize';
import omit from '../_util/omit';
import { withInstall } from '../_util/type';
import type { FlexOrientation, FlexProps } from './interface';
import { flexProps } from './interface';
import createFlexClassNames from './utils';

const AFlex = defineComponent({
  name: 'AFlex',
  inheritAttrs: false,
  props: flexProps(),
  setup(props, { slots, attrs }) {
    const { flex: ctxFlex, direction: ctxDirection } = useConfigContextInject();
    const { prefixCls } = useConfigInject('flex', props);
    const { className: contextClassName, style: contextStyle } = useComponentConfig('flex');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedVertical = computed<boolean>(() => {
      if (props.orientation !== undefined) {
        return props.orientation === 'vertical';
      }
      return Boolean(props.vertical ?? ctxFlex?.value?.vertical);
    });
    const mergedCls = computed(() => [
      prefixCls.value,
      hashId.value,
      createFlexClassNames(prefixCls.value, { ...props, vertical: mergedVertical.value }),
      {
        [`${prefixCls.value}-rtl`]: ctxDirection.value === 'rtl',
        [`${prefixCls.value}-gap-${props.gap}`]: isPresetSize(props.gap),
        [`${prefixCls.value}-vertical`]: mergedVertical.value,
      },
    ]);
    return () => {
      const { flex, gap, component: Component = 'div', ...othersProps } = props;

      const mergedStyle: CSSProperties = {};

      if (flex) {
        mergedStyle.flex = flex;
      }

      if (gap !== undefined && gap !== null && gap !== '' && !isPresetSize(gap)) {
        const isNumeric = typeof gap === 'number' || /^\d+(\.\d+)?$/.test(String(gap).trim());
        mergedStyle.gap = isNumeric ? `${gap}px` : gap;
      }

      return wrapSSR(
        <Component
          class={[contextClassName.value, attrs.class, props.rootClassName, mergedCls.value]}
          style={[contextStyle.value, attrs.style as CSSProperties, mergedStyle]}
          {...omit(othersProps, ['justify', 'wrap', 'align', 'vertical', 'orientation'])}
        >
          {slots.default?.()}
        </Component>,
      );
    };
  },
});

export default withInstall(AFlex);
export type { FlexOrientation, FlexProps };
