import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import classNames from '../_util/classNames';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type SkeletonElementSemanticName = 'root' | 'content';
export type SkeletonElementSemanticClassNames = SemanticClassNames<SkeletonElementSemanticName>;
export type SkeletonElementSemanticStyles = SemanticStyles<SkeletonElementSemanticName>;
export type SkeletonElementClassNamesType =
  | SkeletonElementSemanticClassNames
  | ((info: { props: SkeletonElementProps }) => SkeletonElementSemanticClassNames);
export type SkeletonElementStylesType =
  | SkeletonElementSemanticStyles
  | ((info: { props: SkeletonElementProps }) => SkeletonElementSemanticStyles);

export const skeletonElementProps = () => ({
  prefixCls: String,
  rootClassName: String,
  size: [String, Number] as PropType<'large' | 'small' | 'default' | 'medium' | number>,
  shape: String as PropType<'circle' | 'square' | 'round' | 'default'>,
  active: { type: Boolean, default: undefined },
  classNames: {
    type: [Object, Function] as PropType<SkeletonElementClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<SkeletonElementStylesType>,
    default: undefined,
  },
});

export type SkeletonElementProps = Partial<
  ExtractPropTypes<ReturnType<typeof skeletonElementProps>>
> & {
  class?: any;
  style?: CSSProperties | CSSProperties[];
};

const Element: FunctionalComponent<SkeletonElementProps> = (props, { attrs }) => {
  const { prefixCls, size, shape } = props;

  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small',
  });

  const shapeCls = classNames({
    [`${prefixCls}-circle`]: shape === 'circle',
    [`${prefixCls}-square`]: shape === 'square',
    [`${prefixCls}-round`]: shape === 'round',
  });

  const sizeStyle: CSSProperties =
    typeof size === 'number'
      ? {
          width: `${size}px`,
          height: `${size}px`,
          lineHeight: `${size}px`,
        }
      : {};

  const mergedStyle = attrs.style ? [sizeStyle, attrs.style as CSSProperties] : sizeStyle;

  return (
    <span
      class={classNames(prefixCls, sizeCls, shapeCls, attrs.class as any)}
      style={mergedStyle}
    />
  );
};
Element.displayName = 'SkeletonElement';
Element.inheritAttrs = false;

export default Element;
