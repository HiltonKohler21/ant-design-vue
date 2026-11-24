import { defineComponent } from 'vue';
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined';
import classNames from '../_util/classNames';
import { floatButtonContentProps } from './interface';
import { filterEmpty } from '../_util/props-util';

const FloatButtonContent = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonContent',
  inheritAttrs: false,
  props: floatButtonContentProps(),
  setup(props, { attrs, slots }) {
    return () => {
      const { prefixCls, classNames: semanticClassNames, styles: semanticStyles } = props;
      const description = filterEmpty(slots.description?.());
      const iconClass = classNames(`${prefixCls}-icon`, semanticClassNames?.icon);
      const iconStyle = semanticStyles?.icon;
      const contentClass = [attrs.class, `${prefixCls}-content`, semanticClassNames?.content];
      const contentStyle = semanticStyles?.content;

      return (
        <div {...attrs} class={contentClass} style={contentStyle}>
          {slots.icon || description.length ? (
            <>
              {slots.icon && (
                <div class={iconClass} style={iconStyle}>
                  {slots.icon()}
                </div>
              )}
              {description.length ? (
                <div class={`${prefixCls}-description`}>{description}</div>
              ) : null}
            </>
          ) : (
            <div class={iconClass} style={iconStyle}>
              <FileTextOutlined />
            </div>
          )}
        </div>
      );
    };
  },
});

export default FloatButtonContent;
