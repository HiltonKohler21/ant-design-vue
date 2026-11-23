import { defineComponent, h } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';
import type { VueNode } from '../_util/type';
import { anyType, objectType, someType, withInstall } from '../_util/type';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';

import useStyle from './style';

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

interface Locale {
  description?: string;
}

export type EmptySemanticName = 'root' | 'image' | 'description' | 'footer';
export type EmptySemanticClassNames = SemanticNames<EmptySemanticName>;
export type EmptySemanticStyles = SemanticStylesMap<EmptySemanticName>;

const emptyBaseProps = () => ({
  prefixCls: String,
  rootClassName: String,
  imageStyle: objectType<CSSProperties>(),
  image: anyType<VueNode>(),
  description: anyType<VueNode>(),
});

type EmptySemanticProps = Partial<ExtractPropTypes<ReturnType<typeof emptyBaseProps>>> & {
  classNames?: any;
  styles?: any;
};

export type EmptyClassNamesType =
  | EmptySemanticClassNames
  | ((info: { props: EmptySemanticProps }) => EmptySemanticClassNames);

export type EmptyStylesType =
  | EmptySemanticStyles
  | ((info: { props: EmptySemanticProps }) => EmptySemanticStyles);

export const emptyProps = () => ({
  ...emptyBaseProps(),
  /** 语义化 classNames（antd 5.25+/6.x）：root / image / description / footer */
  classNames: someType<EmptyClassNamesType>([Object, Function]),
  /** 语义化 styles（antd 5.25+/6.x）：root / image / description / footer */
  styles: someType<EmptyStylesType>([Object, Function]),
});

export type EmptyProps = Partial<ExtractPropTypes<ReturnType<typeof emptyProps>>>;

const Empty = defineComponent({
  name: 'AEmpty',
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: emptyProps(),
  setup(props, { slots = {}, attrs }) {
    const { direction, prefixCls: prefixClsRef } = useConfigInject('empty', props);
    const {
      componentConfig: emptyConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('empty');

    const [wrapSSR, hashId] = useStyle(prefixClsRef);

    return () => {
      const prefixCls = prefixClsRef.value;
      const {
        image: mergedImage = slots.image?.() ?? emptyConfig.value.image ?? h(DefaultEmptyImg),
        description = slots.description?.() || undefined,
        imageStyle,
        class: className = '',
        classNames: propClassNames,
        styles: propStyles,
        rootClassName: _rootClassName,
        prefixCls: _prefixCls,
        ...restProps
      } = { ...props, ...attrs };
      const semanticInfo = { props: { ...props } };
      const mergedClassNames = mergeSemanticClassNames<EmptySemanticClassNames>(
        resolveSemanticValue(contextClassNames.value, semanticInfo),
        resolveSemanticValue(propClassNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<EmptySemanticStyles>(
        resolveSemanticValue(contextStyles.value, semanticInfo),
        resolveSemanticValue(propStyles, semanticInfo),
      );
      const image =
        typeof mergedImage === 'function' ? (mergedImage as () => VueNode)() : mergedImage;
      const isNormal =
        image &&
        typeof image === 'object' &&
        'type' in image &&
        (image.type as any).PRESENTED_IMAGE_SIMPLE;
      return wrapSSR(
        <LocaleReceiver
          componentName="Empty"
          children={(locale: Locale) => {
            const des = typeof description !== 'undefined' ? description : locale.description;
            const alt = typeof des === 'string' ? des : 'empty';
            let imageNode: EmptyProps['image'] = null;

            if (typeof image === 'string') {
              imageNode = <img alt={alt} src={image} />;
            } else {
              imageNode = image;
            }

            return (
              <div
                class={classNames(
                  prefixCls,
                  props.rootClassName,
                  contextClassName.value,
                  className,
                  mergedClassNames.root,
                  hashId.value,
                  {
                    [`${prefixCls}-normal`]: isNormal,
                    [`${prefixCls}-rtl`]: direction.value === 'rtl',
                  },
                )}
                {...restProps}
                style={[contextStyle.value, mergedStyles.root, (restProps as any).style]}
              >
                <div
                  class={[`${prefixCls}-image`, mergedClassNames.image]}
                  style={[imageStyle, mergedStyles.image]}
                >
                  {imageNode}
                </div>
                {des && (
                  <p
                    class={[`${prefixCls}-description`, mergedClassNames.description]}
                    style={mergedStyles.description}
                  >
                    {des}
                  </p>
                )}
                {slots.default && (
                  <div
                    class={[`${prefixCls}-footer`, mergedClassNames.footer]}
                    style={mergedStyles.footer}
                  >
                    {filterEmpty(slots.default())}
                  </div>
                )}
              </div>
            );
          }}
        />,
      );
    };
  },
});

Empty.PRESENTED_IMAGE_DEFAULT = () => h(DefaultEmptyImg);
Empty.PRESENTED_IMAGE_SIMPLE = () => h(SimpleEmptyImg);

export default withInstall(Empty);
