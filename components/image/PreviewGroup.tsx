import type { PreviewGroupPreview } from '../vc-image/src/PreviewGroup';
import PreviewGroup from '../vc-image/src/PreviewGroup';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';

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
const previewGroupProps = () => ({
  previewPrefixCls: String,
  preview: anyType<boolean | PreviewGroupPreview>(),
});
export type ImageGroupProps = Partial<ExtractPropTypes<ReturnType<typeof previewGroupProps>>>;

const InternalPreviewGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: previewGroupProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls, rootPrefixCls, configProvider } = useConfigInject('image', props);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const contextPreview = computed(() => {
      const p = configProvider.image?.value?.preview as any;
      return typeof p === 'object' && p !== null ? p : {};
    });
    const mergedIcons = computed(() => {
      const _preview =
        typeof props.preview === 'object' && props.preview !== null ? props.preview : {};
      const closeIcon = (_preview as any).closeIcon ?? contextPreview.value.closeIcon;
      return {
        ...icons,
        ...contextPreview.value.icons,
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

      return {
        ...contextPreview.value,
        ..._preview,
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
    return () => {
      return wrapSSR(
        <PreviewGroup
          {...{ ...attrs, ...props }}
          preview={mergedPreview.value}
          icons={mergedIcons.value}
          previewPrefixCls={previewPrefixCls.value}
          v-slots={slots}
        ></PreviewGroup>,
      );
    };
  },
});
export default InternalPreviewGroup;
