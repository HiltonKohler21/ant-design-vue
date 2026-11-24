import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import BackTop from './BackTop';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import FloatButtonGroup from './FloatButtonGroup';
import {
  floatButtonGroupProps,
  type FloatButtonClassNamesType,
  type FloatButtonGroupClassNamesType,
  type FloatButtonGroupStylesType,
  type FloatButtonProps,
  type FloatButtonStylesType,
} from './interface';

export interface PureFloatButtonProps extends Omit<FloatButtonProps, 'target'> {
  backTop?: boolean;
}

export const purePanelProps = () => ({
  ...floatButtonGroupProps(),
  items: { type: Array as PropType<PureFloatButtonProps[]>, default: undefined },
  classNames: {
    type: [Object, Function] as PropType<
      FloatButtonClassNamesType | FloatButtonGroupClassNamesType
    >,
  },
  styles: {
    type: [Object, Function] as PropType<FloatButtonStylesType | FloatButtonGroupStylesType>,
  },
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

const PureFloatButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APureFloatButton',
  inheritAttrs: false,
  props: {
    backTop: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      props.backTop ? (
        <BackTop {...attrs} visibilityHeight={0} v-slots={slots} />
      ) : (
        <FloatButton {...attrs} v-slots={slots} />
      );
  },
});

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonPurePanel',
  inheritAttrs: false,
  props: purePanelProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls } = useConfigInject(floatButtonPrefixCls, props);

    return () => {
      const { items, classNames: semanticClassNames, styles: semanticStyles, ...restProps } = props;
      const pureCls = `${prefixCls.value}-pure`;

      if (items) {
        return (
          <FloatButtonGroup
            {...attrs}
            {...restProps}
            class={classNames(attrs.class, pureCls)}
            classNames={semanticClassNames as FloatButtonGroupClassNamesType}
            styles={semanticStyles as FloatButtonGroupStylesType}
            v-slots={{
              icon: slots.icon,
              closeIcon: slots.closeIcon,
              tooltip: slots.tooltip,
              content: slots.content,
              description: slots.description,
              default: () =>
                items.map((item, index) => <PureFloatButton key={index} {...(item as any)} />),
            }}
          />
        );
      }

      return (
        <PureFloatButton
          {...attrs}
          {...(restProps as any)}
          class={classNames(attrs.class, pureCls)}
          classNames={semanticClassNames as FloatButtonClassNamesType}
          styles={semanticStyles as FloatButtonStylesType}
          v-slots={slots}
        />
      );
    };
  },
});

export default PurePanel;
