import type { PreviewGroupItem, PreviewGroupPreview } from '../vc-image/src/PreviewGroup';
import PreviewGroup from '../vc-image/src/PreviewGroup';
import type { ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import type { VueNode } from '../_util/type';
import type { ImageSemanticClassNames, ImageSemanticStyles } from '../vc-image/src/Image';

import RotateLeftOutlined from '@ant-design/icons-vue/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons-vue/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons-vue/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons-vue/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import SwapOutlined from '@ant-design/icons-vue/SwapOutlined';
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import { anyType } from '../_util/type';
import classNames from '../_util/classNames';
import { normalizePreviewMask, resolveSemantic } from './util';

export const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
  flipX: <SwapOutlined />,
  flipY: <SwapOutlined rotate={90} />,
};

export type PreviewGroupClassNamesType =
  | ImageSemanticClassNames
  | ((info: { props: ImageGroupProps }) => ImageSemanticClassNames);

export type PreviewGroupStylesType =
  | ImageSemanticStyles
  | ((info: { props: ImageGroupProps }) => ImageSemanticStyles);

const previewGroupProps = () => ({
  previewPrefixCls: String,
  preview: anyType<boolean | PreviewGroupPreview>(),
  items: {
    type: Array as PropType<PreviewGroupItem[]>,
    default: undefined,
  },
  fallback: String,
  countRender: Function as PropType<(current: number, total: number) => VueNode>,
  onChange: Function as PropType<(current: number, prevCurrent: number) => void>,
  icons: anyType<typeof icons>(),
  classNames: [Object, Function] as PropType<PreviewGroupClassNamesType>,
  styles: [Object, Function] as PropType<PreviewGroupStylesType>,
});
export type ImageGroupProps = Partial<ExtractPropTypes<ReturnType<typeof previewGroupProps>>>;

const InternalPreviewGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: previewGroupProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls, rootPrefixCls, direction, configProvider } = useConfigInject('image', props);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const contextImage = computed(() => configProvider.image?.value as any);
    const contextPreview = computed(() => {
      const p = contextImage.value?.preview as any;
      return typeof p === 'object' && p !== null ? p : {};
    });

    const previewMaskInfo = computed(() => {
      const _preview =
        typeof props.preview === 'object' && props.preview !== null ? props.preview : {};
      return normalizePreviewMask(
        (_preview as any).mask,
        contextPreview.value.mask,
        previewPrefixCls.value,
      );
    });

    const mergedIcons = computed(() => {
      const _preview =
        typeof props.preview === 'object' && props.preview !== null ? props.preview : {};
      const closeIcon = (_preview as any).closeIcon ?? contextPreview.value.closeIcon;
      return {
        ...icons,
        left: direction.value === 'rtl' ? <RightOutlined /> : <LeftOutlined />,
        right: direction.value === 'rtl' ? <LeftOutlined /> : <RightOutlined />,
        ...contextPreview.value.icons,
        ...props.icons,
        ...(_preview as any).icons,
        ...(closeIcon !== undefined ? { close: closeIcon } : {}),
      };
    });

    const mergedPreview = computed(() => {
      const { preview } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' && preview !== null ? preview : {};
      const { maskEnabled, maskClosable } = previewMaskInfo.value;

      return {
        ...contextPreview.value,
        ..._preview,
        mask: maskEnabled,
        maskClosable: (_preview as any).maskClosable ?? maskClosable,
        rootClassName: classNames(
          contextPreview.value.rootClassName,
          _preview.rootClassName,
          hashId.value,
        ),
        transitionName: getTransitionName(
          rootPrefixCls.value,
          'zoom',
          _preview.transitionName ?? contextPreview.value.transitionName,
        ),
        maskTransitionName: getTransitionName(
          rootPrefixCls.value,
          'fade',
          _preview.maskTransitionName ?? contextPreview.value.maskTransitionName,
        ),
      };
    });

    const mergedFallback = computed(() => props.fallback ?? contextImage.value?.fallback);

    return () => {
      const baseSemanticClassNames = mergeSemanticClassNames<ImageSemanticClassNames>(
        resolveSemantic(contextImage.value?.classNames, props),
        resolveSemantic(props.classNames, props),
      );
      const mergedSemanticClassNames = mergeSemanticClassNames<ImageSemanticClassNames>(
        baseSemanticClassNames,
        previewMaskInfo.value.maskClassName
          ? { popup: { mask: previewMaskInfo.value.maskClassName } }
          : undefined,
      );
      const mergedSemanticStyles = mergeSemanticStyles<ImageSemanticStyles>(
        resolveSemantic(contextImage.value?.styles, props),
        resolveSemantic(props.styles, props),
      );

      return wrapSSR(
        <PreviewGroup
          {...{ ...attrs, ...props }}
          fallback={mergedFallback.value}
          preview={mergedPreview.value}
          icons={mergedIcons.value}
          popupClassNames={mergedSemanticClassNames.popup}
          popupStyles={mergedSemanticStyles.popup}
          previewPrefixCls={previewPrefixCls.value}
          v-slots={slots}
        ></PreviewGroup>,
      );
    };
  },
});
export default InternalPreviewGroup;
