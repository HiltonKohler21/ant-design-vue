import type { CSSProperties, HTMLAttributes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Direction } from '../config-provider';
import {
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticStyles,
  type SemanticClassNamesType,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

// CSSINJS
import useStyle from './style';

export type TypographySemanticName = 'root' | 'actions' | 'action' | 'textarea';
export type TypographySemanticClassNames = SemanticClassNames<TypographySemanticName>;
export type TypographySemanticStyles = SemanticStyles<TypographySemanticName>;
export type TypographyClassNamesType<P = Record<string, any>> = SemanticClassNamesType<
  P,
  TypographySemanticName
>;
export type TypographyStylesType<P = Record<string, any>> = SemanticStylesType<
  P,
  TypographySemanticName
>;

export interface TypographyProps extends HTMLAttributes {
  direction?: Direction;
  prefixCls?: string;
  rootClassName?: string;
  classNames?: TypographyClassNamesType;
  styles?: TypographyStylesType;
}

export interface InternalTypographyProps extends TypographyProps {
  component?: string;
}

export const typographyProps = () => ({
  prefixCls: String,
  rootClassName: String,
  direction: String as PropType<Direction>,
  // Form Internal use
  component: String,
  classNames: [Object, Function] as PropType<TypographyClassNamesType>,
  styles: [Object, Function] as PropType<TypographyStylesType>,
});

export const InternalTypography = defineComponent({
  name: 'InternalTypography',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    rootClassName: String,
    direction: String as PropType<Direction>,
    component: String,
    classNames: {
      type: Object as PropType<TypographySemanticClassNames>,
      default: undefined,
    },
    styles: {
      type: Object as PropType<TypographySemanticStyles>,
      default: undefined,
    },
    onClick: Function as PropType<(e: MouseEvent) => void>,
    onMouseenter: Function as PropType<(e: MouseEvent) => void>,
    onMouseleave: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props, { slots, attrs }) {
    const prefixClsRef = computed(() => props.prefixCls);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixClsRef);

    return () => {
      const {
        prefixCls: _prefixCls,
        direction: _direction,
        component: Component = 'article' as any,
        rootClassName,
        classNames: semanticClassNames,
        styles: semanticStyles,
        ...restProps
      } = { ...props, ...attrs };
      return wrapSSR(
        <Component
          {...restProps}
          class={classNames(
            props.prefixCls,
            { [`${props.prefixCls}-rtl`]: props.direction === 'rtl' },
            rootClassName,
            attrs.class,
            semanticClassNames?.root,
            hashId.value,
          )}
          style={[semanticStyles?.root, attrs.style as CSSProperties]}
        >
          {slots.default?.()}
        </Component>,
      );
    };
  },
});

const Typography = defineComponent({
  name: 'ATypography',
  inheritAttrs: false,
  props: typographyProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('typography', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('typography');

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TypographySemanticClassNames,
      TypographySemanticStyles
    >(
      () => [contextClassNames.value as TypographySemanticClassNames, props.classNames],
      () => [contextStyles.value as TypographySemanticStyles, props.styles],
      () => ({ props: { ...props, ...attrs } }),
    );

    return () => {
      const {
        prefixCls: _prefixCls,
        direction: _direction,
        component: Component = 'article',
        rootClassName,
        classNames: _classNames,
        styles: _styles,
        ...restProps
      } = { ...props, ...attrs };
      return (
        <InternalTypography
          {...restProps}
          prefixCls={prefixCls.value}
          direction={direction.value}
          component={Component}
          rootClassName={rootClassName}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          class={classNames(contextClassName.value, attrs.class)}
          style={[contextStyle.value, attrs.style as CSSProperties]}
        >
          {slots.default?.()}
        </InternalTypography>
      );
    };
  },
});

export default Typography;
