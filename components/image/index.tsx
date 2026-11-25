import type {
  App,
  CSSProperties,
  ExtractPropTypes,
  ImgHTMLAttributes,
  Plugin,
  PropType,
} from 'vue';
import { defineComponent, computed } from 'vue';
import ImageInternal from '../vc-image';
import { imageProps as vcImageProps } from '../vc-image/src/Image';
import type {
  ImagePreviewType,
  ImageSemanticClassNames,
  ImageSemanticStyles,
} from '../vc-image/src/Image';
import defaultLocale from '../locale/en_US';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import PreviewGroup, { icons } from './PreviewGroup';
import ImageProgress from './Progress';
import type { ProgressClassNames, ProgressStyles } from './Progress';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import classNames from '../_util/classNames';
import { isPlainObj, normalizePreviewMask, resolveSemantic } from './util';
import type { VueNode } from '../_util/type';
import { isVNode } from 'vue';

export interface ImageProgressConfig {
  percent?: number;
  /** Custom render function, receives default progress UI and percent */
  render?: (progress: VueNode, percent: number) => VueNode;
}

export type ImagePlaceholderConfig = {
  progress?: boolean | ImageProgressConfig;
};

export type ImagePlaceholderType = VueNode | ImagePlaceholderConfig;

export type ImageClassNamesType =
  | ImageSemanticClassNames
  | ((info: { props: ImageProps }) => ImageSemanticClassNames);

export type ImageStylesType =
  | ImageSemanticStyles
  | ((info: { props: ImageProps }) => ImageSemanticStyles);

function isPlaceholderConfig(val: unknown): val is ImagePlaceholderConfig {
  return (
    typeof val === 'object' &&
    val !== null &&
    !Array.isArray(val) &&
    !isVNode(val) &&
    'progress' in val
  );
}

export const imageProps = () => ({
  ...vcImageProps(),
  /** @deprecated Use `styles.root` instead */
  wrapperStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  rootStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  placeholder: {
    type: [Boolean, Object, String, Number, Array, Function] as PropType<ImagePlaceholderType>,
    default: undefined,
  },
  classNames: [Object, Function] as PropType<ImageClassNamesType>,
  styles: [Object, Function] as PropType<ImageStylesType>,
});

export type ImageProps = Partial<
  ExtractPropTypes<ReturnType<typeof imageProps>> &
    Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'>
>;

export type {
  ImagePreviewType,
  ImageSemanticClassNames,
  ImageSemanticStyles,
  ProgressClassNames,
  ProgressStyles,
};

const Image = defineComponent({
  name: 'AImage',
  inheritAttrs: false,
  props: imageProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, rootPrefixCls, configProvider } = useConfigInject('image', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const contextImage = computed(() => configProvider.image?.value as any);

    const previewMaskInfo = computed(() => {
      const _contextPreview = isPlainObj(contextImage.value?.preview)
        ? contextImage.value.preview
        : {};
      const _preview = isPlainObj(props.preview) ? props.preview : {};
      return normalizePreviewMask(
        _preview.mask,
        _contextPreview.mask,
        `${prefixCls.value}-preview`,
      );
    });

    const mergedPreview = computed(() => {
      const { preview } = props;
      const contextPreview = contextImage.value?.preview as any;

      if (preview === false) {
        return preview;
      }
      const _contextPreview = isPlainObj(contextPreview) ? contextPreview : {};
      const _preview = isPlainObj(preview) ? preview : {};
      const closeIcon = _preview.closeIcon ?? _contextPreview.closeIcon;
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
      const { maskEnabled, maskClosable, legacyCover } = previewMaskInfo.value;
      const mergedCover = _preview.cover ?? legacyCover ?? _contextPreview.cover;

      return {
        ..._contextPreview,
        ..._preview,
        ...(mergedCover !== undefined ? { cover: mergedCover } : {}),
        mask: maskEnabled,
        maskClosable: _preview.maskClosable ?? maskClosable,
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

      const mergedPropsForSemantic: ImageProps = {
        ...props,
        preview: mergedPreview.value as any,
      };
      const baseSemanticClassNames = mergeSemanticClassNames<ImageSemanticClassNames>(
        resolveSemantic(contextImage.value?.classNames, mergedPropsForSemantic),
        resolveSemantic(props.classNames, mergedPropsForSemantic),
      );
      const mergedSemanticClassNames = mergeSemanticClassNames<ImageSemanticClassNames>(
        baseSemanticClassNames,
        previewMaskInfo.value.maskClassName
          ? { popup: { mask: previewMaskInfo.value.maskClassName } }
          : undefined,
      );
      const mergedRootStyle =
        props.wrapperStyle || props.rootStyle
          ? { ...props.wrapperStyle, ...props.rootStyle }
          : undefined;
      const baseSemanticStyles = mergeSemanticStyles<ImageSemanticStyles>(
        resolveSemantic(contextImage.value?.styles, mergedPropsForSemantic),
        mergedRootStyle ? { root: mergedRootStyle } : undefined,
      );
      const mergedSemanticStyles = mergeSemanticStyles<ImageSemanticStyles>(
        baseSemanticStyles,
        resolveSemantic(props.styles, mergedPropsForSemantic),
      );

      // ============================= Progress ==============================
      const rawPlaceholder = props.placeholder;
      const placeholderConfig = isPlaceholderConfig(rawPlaceholder) ? rawPlaceholder : undefined;
      const progressOption = placeholderConfig?.progress;
      const showProgressOverlay = Boolean(progressOption);
      const progressConfig: ImageProgressConfig =
        typeof progressOption === 'object' && progressOption !== null ? progressOption : {};
      const placeholderNode = placeholderConfig ? undefined : rawPlaceholder;
      const shouldRenderPlaceholderOverlay = Boolean(
        !showProgressOverlay && (placeholderNode || slots.placeholder) && !props.src,
      );

      if (showProgressOverlay || shouldRenderPlaceholderOverlay) {
        const mergedProgressRender = shouldRenderPlaceholderOverlay
          ? () => (slots.placeholder ? slots.placeholder() : placeholderNode)
          : progressConfig.render;

        return wrapSSR(
          <ImageProgress
            prefixCls={prefixCls.value}
            percent={progressConfig.percent}
            render={mergedProgressRender}
            classNames={mergedSemanticClassNames?.placeholder?.progress}
            styles={mergedSemanticStyles?.placeholder?.progress}
            rootClassName={classNames(
              props.rootClassName,
              mergedSemanticClassNames?.root,
              mergedClass,
              hashId.value,
            )}
            rootStyle={
              mergedSemanticStyles?.root || mergedStyle
                ? { ...mergedStyle, ...mergedSemanticStyles?.root }
                : undefined
            }
            width={props.width}
            height={props.height}
          />,
        );
      }

      return wrapSSR(
        <ImageInternal
          {...{
            ...attrs,
            ...props,
            placeholder: placeholderNode,
            prefixCls: prefixCls.value,
            fallback: mergedFallback.value,
            ...(mergedClass ? { class: mergedClass } : {}),
            ...(mergedStyle ? { style: mergedStyle } : {}),
          }}
          preview={mergedPreview.value}
          semanticClassNames={mergedSemanticClassNames}
          semanticStyles={mergedSemanticStyles}
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
