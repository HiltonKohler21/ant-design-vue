import type { App, CSSProperties, ExtractPropTypes, ImgHTMLAttributes, Plugin } from 'vue';
import { defineComponent, computed } from 'vue';
import ImageInternal from '../vc-image';
import { imageProps } from '../vc-image/src/Image';
import defaultLocale from '../locale/en_US';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import PreviewGroup, { icons } from './PreviewGroup';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import classNames from '../_util/classNames';
export type ImageProps = Partial<
  ExtractPropTypes<ReturnType<typeof imageProps>> &
    Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'>
>;
const Image = defineComponent({
  name: 'AImage',
  inheritAttrs: false,
  props: imageProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, rootPrefixCls, configProvider } = useConfigInject('image', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const contextImage = computed(() => configProvider.image?.value);

    const mergedPreview = computed(() => {
      const { preview } = props;
      const contextPreview = contextImage.value?.preview as any;

      if (preview === false) {
        return preview;
      }
      const _contextPreview =
        typeof contextPreview === 'object' && contextPreview !== null ? contextPreview : {};
      const _preview = typeof preview === 'object' && preview !== null ? preview : {};
      const closeIcon = (_preview as any).closeIcon ?? _contextPreview.closeIcon;
      const mergedIcons = {
        ...icons,
        ..._contextPreview.icons,
        ..._preview.icons,
        ...(closeIcon !== undefined ? { close: closeIcon } : {}),
      };
      const previewRootClassName = classNames(
        _contextPreview.rootClassName,
        _preview.rootClassName,
      );

      return {
        ..._contextPreview,
        ..._preview,
        icons: mergedIcons,
        ...(previewRootClassName ? { rootClassName: previewRootClassName } : {}),
        transitionName: getTransitionName(
          rootPrefixCls.value,
          'zoom',
          _preview.transitionName ?? _contextPreview.transitionName,
        ),
        maskTransitionName: getTransitionName(
          rootPrefixCls.value,
          'fade',
          _preview.maskTransitionName ?? _contextPreview.maskTransitionName,
        ),
      };
    });

    const mergedFallback = computed(() => props.fallback ?? contextImage.value?.fallback);

    return () => {
      const imageLocale = configProvider.locale?.value?.Image || defaultLocale.Image;
      const defaultPreviewMask = () => (
        <div class={`${prefixCls.value}-mask-info`}>
          <EyeOutlined />
          {imageLocale?.preview}
        </div>
      );
      const { previewMask = slots.previewMask || defaultPreviewMask } = props;
      const mergedClass = classNames(contextImage.value?.className, attrs.class);
      const ctxStyle = contextImage.value?.style;
      const mergedStyle: CSSProperties | undefined =
        ctxStyle || attrs.style
          ? {
              ...ctxStyle,
              ...(typeof attrs.style === 'object' ? (attrs.style as CSSProperties) : {}),
            }
          : undefined;
      return wrapSSR(
        <ImageInternal
          {...{
            ...attrs,
            ...props,
            prefixCls: prefixCls.value,
            fallback: mergedFallback.value,
            ...(mergedClass ? { class: mergedClass } : {}),
            ...(mergedStyle ? { style: mergedStyle } : {}),
          }}
          preview={mergedPreview.value}
          rootClassName={classNames(props.rootClassName, hashId.value)}
          v-slots={{
            ...slots,
            previewMask: typeof previewMask === 'function' ? previewMask : null,
          }}
        ></ImageInternal>,
      );
    };
  },
});

export { imageProps };

Image.PreviewGroup = PreviewGroup;

Image.install = function (app: App) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};

export { PreviewGroup as ImagePreviewGroup };

export default Image as typeof Image &
  Plugin & {
    readonly PreviewGroup: typeof PreviewGroup;
  };
