import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectBreadcrumb } from './BreadcrumbContext';

export const breadcrumbSeparatorProps = () => ({
  prefixCls: String,
});
export type BreadcrumbSeparatorProps = Partial<
  ExtractPropTypes<ReturnType<typeof breadcrumbSeparatorProps>>
>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  inheritAttrs: false,
  props: breadcrumbSeparatorProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);
    const { classNames: semanticClassNames, styles: semanticStyles } = useInjectBreadcrumb();

    return () => {
      const { separator, class: className, style, ...restAttrs } = attrs;
      const children = flattenChildren(slots.default?.());
      const mergedCls = classNames(
        `${prefixCls.value}-separator`,
        semanticClassNames.value.separator,
        className as any,
      );
      const mergedStyle =
        semanticStyles.value.separator || style
          ? [semanticStyles.value.separator, style as CSSProperties]
          : undefined;
      return (
        <span class={mergedCls} style={mergedStyle} {...restAttrs}>
          {children.length > 0 ? children : '/'}
        </span>
      );
    };
  },
});
