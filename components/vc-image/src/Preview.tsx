import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  shallowRef,
  watch,
  cloneVNode,
  isVNode,
} from 'vue';
import type { CSSProperties, VNode, PropType } from 'vue';

import classnames from '../../_util/classNames';
import Dialog from '../../vc-dialog';
import { type IDialogChildProps, dialogPropTypes } from '../../vc-dialog/IDialogPropTypes';
import { getOffset } from '../../vc-util/Dom/css';
import addEventListener from '../../vc-util/Dom/addEventListener';
import KeyCode from '../../_util/KeyCode';
import { warning } from '../../vc-util/warning';
import type { VueNode } from '../../_util/type';
import { objectType } from '../../_util/type';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';
import type { MouseEventHandler, WheelEventHandler } from '../../_util/EventInterface';

import { context } from './PreviewGroup';

export interface TransformType {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}

export type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound'
  | 'reset';

export interface ImgInfo {
  url?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

export interface ToolbarRenderInfoType {
  icons: {
    flipYIcon: VueNode;
    flipXIcon: VueNode;
    rotateLeftIcon: VueNode;
    rotateRightIcon: VueNode;
    zoomOutIcon: VueNode;
    zoomInIcon: VueNode;
    closeIcon?: VueNode;
    prevIcon?: VueNode;
    nextIcon?: VueNode;
  };
  actions: {
    onActive?: (offset: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void;
    onClose: () => void;
  };
  transform: TransformType;
  current: number;
  total: number;
  image: ImgInfo;
}

export interface PreviewPopupClassNames {
  root?: string;
  mask?: string;
  body?: string;
  footer?: string;
  actions?: string;
  close?: string;
}

export interface PreviewPopupStyles {
  root?: CSSProperties;
  mask?: CSSProperties;
  body?: CSSProperties;
  footer?: CSSProperties;
  actions?: CSSProperties;
  close?: CSSProperties;
}

export interface PreviewProps extends Omit<IDialogChildProps, 'onClose' | 'mask'> {
  onClose?: (e: Element) => void;
  src?: string;
  alt?: string;
  fallback?: string;
  width?: string | number;
  height?: string | number;
  rootClassName?: string;
  mask?: boolean;
  maskClosable?: boolean;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  movable?: boolean;
  wheel?: boolean;
  actionsRender?: (originalNode: VNode, info: ToolbarRenderInfoType) => VueNode;
  toolbarRender?: (originalNode: VNode, info: ToolbarRenderInfoType) => VueNode;
  imageRender?: (
    originalNode: VNode,
    info: { transform: TransformType; image: ImgInfo; current?: number },
  ) => VueNode;
  countRender?: (current: number, total: number) => VueNode;
  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void;
  popupClassNames?: PreviewPopupClassNames;
  popupStyles?: PreviewPopupStyles;
  icons?: {
    rotateLeft?: VNode;
    rotateRight?: VNode;
    zoomIn?: VNode;
    zoomOut?: VNode;
    close?: VNode | boolean | null;
    left?: VNode;
    right?: VNode;
    flipX?: VNode;
    flipY?: VNode;
  };
}

const initialPosition = {
  x: 0,
  y: 0,
};

export const previewProps = {
  ...dialogPropTypes(),
  src: String,
  alt: String,
  fallback: String,
  width: [Number, String],
  height: [Number, String],
  rootClassName: String,
  minScale: {
    type: Number,
    default: 1,
  },
  maxScale: {
    type: Number,
    default: 50,
  },
  scaleStep: {
    type: Number,
    default: 0.5,
  },
  movable: {
    type: Boolean,
    default: true,
  },
  wheel: {
    type: Boolean,
    default: true,
  },
  actionsRender: Function as PropType<PreviewProps['actionsRender']>,
  toolbarRender: Function as PropType<PreviewProps['toolbarRender']>,
  imageRender: Function as PropType<PreviewProps['imageRender']>,
  countRender: Function as PropType<PreviewProps['countRender']>,
  onTransform: Function as PropType<PreviewProps['onTransform']>,
  popupClassNames: objectType<PreviewPopupClassNames>(),
  popupStyles: objectType<PreviewPopupStyles>(),
  icons: {
    type: Object as PropType<PreviewProps['icons']>,
    default: () => ({} as PreviewProps['icons']),
  },
};

const Preview = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Preview',
  inheritAttrs: false,
  props: previewProps,
  emits: ['close', 'afterClose'],
  setup(props, { emit, attrs }) {
    const scale = shallowRef(1);
    const rotate = shallowRef(0);
    const flip = reactive({ x: 1, y: 1 });
    const [position, setPosition] = useFrameSetState<{
      x: number;
      y: number;
    }>(initialPosition);
    const imgError = shallowRef(false);

    const getTransform = (): TransformType => ({
      x: position.x,
      y: position.y,
      rotate: rotate.value,
      scale: scale.value,
      flipX: flip.x === -1,
      flipY: flip.y === -1,
    });

    const emitTransform = (action: TransformAction) => {
      props.onTransform?.({
        transform: getTransform(),
        action,
      });
    };

    const onClose = () => {
      emitTransform('close');
      emit('close');
    };

    const imgRef = shallowRef<HTMLImageElement>();
    const originPositionRef = reactive<{
      originX: number;
      originY: number;
      deltaX: number;
      deltaY: number;
    }>({
      originX: 0,
      originY: 0,
      deltaX: 0,
      deltaY: 0,
    });
    const isMoving = shallowRef(false);
    const groupContext = context.inject();
    const {
      previewUrls,
      previewItems,
      current,
      isPreviewGroup,
      onActive: groupOnActive,
      fallback: groupFallback,
    } = groupContext;
    const previewGroupCount = computed(() => previewUrls.value.size);
    const previewUrlsKeys = computed(() => Array.from(previewUrls.value.keys()));
    const currentPreviewIndex = computed(() => {
      const idx = previewUrlsKeys.value.indexOf(current.value);
      return idx >= 0 ? idx : 0;
    });
    const currentItemInfo = computed<ImgInfo>(() => {
      if (isPreviewGroup.value) {
        const item = previewItems?.value?.get(current.value);
        return {
          url: item?.src ?? previewUrls.value.get(current.value),
          alt: item?.alt ?? props.alt,
          width: item?.width ?? props.width,
          height: item?.height ?? props.height,
        };
      }
      return {
        url: props.src,
        alt: props.alt,
        width: props.width,
        height: props.height,
      };
    });
    const combinationSrc = computed(() => {
      const fallbackUrl = props.fallback ?? groupFallback?.value;
      if (imgError.value && fallbackUrl) {
        return fallbackUrl;
      }
      return currentItemInfo.value.url;
    });

    watch(
      () => currentItemInfo.value.url,
      () => {
        imgError.value = false;
      },
    );

    const showLeftOrRightSwitches = computed(
      () => isPreviewGroup.value && previewGroupCount.value > 1,
    );
    const lastWheelZoomDirection = shallowRef({ wheelDirection: 0 });

    const resetTransform = (action?: TransformAction) => {
      scale.value = 1;
      rotate.value = 0;
      flip.x = 1;
      flip.y = 1;
      setPosition(initialPosition);
      if (action) {
        emitTransform(action);
      }
    };

    const onAfterClose = () => {
      resetTransform();
      imgError.value = false;
      emit('afterClose');
    };

    const onZoomIn = (isWheel?: boolean) => {
      const step = props.scaleStep ?? 0.5;
      const ratio = isWheel ? 1 + step / 2 : 1 + step;
      const maxScale = props.maxScale ?? 50;
      const nextScale = Math.min(maxScale, Number((scale.value * ratio).toFixed(4)));
      scale.value = nextScale;
      setPosition(initialPosition);
      emitTransform(isWheel ? 'wheel' : 'zoomIn');
    };

    const onZoomOut = (isWheel?: boolean) => {
      const minScale = props.minScale ?? 1;
      if (scale.value > minScale) {
        const step = props.scaleStep ?? 0.5;
        const ratio = isWheel ? 1 + step / 2 : 1 + step;
        const nextScale = Math.max(minScale, Number((scale.value / ratio).toFixed(4)));
        scale.value = nextScale;
      }
      setPosition(initialPosition);
      emitTransform(isWheel ? 'wheel' : 'zoomOut');
    };

    const onRotateRight = () => {
      rotate.value += 90;
      emitTransform('rotateRight');
    };

    const onRotateLeft = () => {
      rotate.value -= 90;
      emitTransform('rotateLeft');
    };

    const onFlipX = () => {
      flip.x = -flip.x;
      emitTransform('flipX');
    };

    const onFlipY = () => {
      flip.y = -flip.y;
      emitTransform('flipY');
    };

    const onReset = () => {
      resetTransform('reset');
    };

    const handleActiveOffset = (offset: number) => {
      if (!isPreviewGroup.value || !groupOnActive) return;
      const nextIndex = currentPreviewIndex.value + offset;
      if (nextIndex >= 0 && nextIndex < previewGroupCount.value) {
        groupOnActive(offset);
        resetTransform(offset < 0 ? 'prev' : 'next');
      }
    };

    const onSwitchLeft: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      handleActiveOffset(-1);
    };

    const onSwitchRight: MouseEventHandler = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      handleActiveOffset(1);
    };

    const wrapClassName = computed(() =>
      classnames({
        [`${props.prefixCls}-moving`]: isMoving.value,
        [`${props.prefixCls}-not-movable`]: props.movable === false,
      }),
    );
    const toolClassName = `${props.prefixCls}-operations-operation`;
    const iconClassName = `${props.prefixCls}-operations-icon`;

    const tools = computed(() => {
      const { rotateLeft, rotateRight, zoomIn, zoomOut, close, flipX, flipY } = props.icons || {};
      const minScale = props.minScale ?? 1;
      const maxScale = props.maxScale ?? 50;
      return [
        {
          icon: close,
          onClick: onClose,
          type: 'close',
        },
        {
          icon: zoomIn,
          onClick: () => onZoomIn(),
          type: 'zoomIn',
          disabled: computed(() => scale.value >= maxScale),
        },
        {
          icon: zoomOut,
          onClick: () => onZoomOut(),
          type: 'zoomOut',
          disabled: computed(() => scale.value <= minScale),
        },
        {
          icon: rotateRight,
          onClick: onRotateRight,
          type: 'rotateRight',
        },
        {
          icon: rotateLeft,
          onClick: onRotateLeft,
          type: 'rotateLeft',
        },
        {
          icon: flipX,
          onClick: onFlipX,
          type: 'flipX',
        },
        {
          icon: flipY,
          onClick: onFlipY,
          type: 'flipY',
        },
      ].filter(
        tool => (tool.icon as any) !== false && tool.icon !== null && tool.icon !== undefined,
      );
    });

    const onMouseUp: MouseEventHandler = () => {
      if (props.visible && isMoving.value) {
        isMoving.value = false;
        if (!imgRef.value) return;
        const width = imgRef.value.offsetWidth * scale.value;
        const height = imgRef.value.offsetHeight * scale.value;
        const { left, top } = getOffset(imgRef.value);
        const isRotate = rotate.value % 180 !== 0;

        const fixState = getFixScaleEleTransPosition(
          isRotate ? height : width,
          isRotate ? width : height,
          left,
          top,
        );
        if (fixState) {
          setPosition({ ...fixState });
          emitTransform('dragRebound');
        }
      }
    };

    const onMouseDown: MouseEventHandler = event => {
      if (props.movable === false) return;
      // Only allow main button
      if (event.button !== 0) return;
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      originPositionRef.deltaX = event.pageX - position.x;
      originPositionRef.deltaY = event.pageY - position.y;
      originPositionRef.originX = position.x;
      originPositionRef.originY = position.y;
      isMoving.value = true;
    };

    const onMouseMove: MouseEventHandler = event => {
      if (props.visible && isMoving.value && props.movable !== false) {
        setPosition({
          x: event.pageX - originPositionRef.deltaX,
          y: event.pageY - originPositionRef.deltaY,
        });
        emitTransform('move');
      }
    };

    const onWheelMove: WheelEventHandler = event => {
      if (!props.visible || props.wheel === false) return;
      event.preventDefault();
      const wheelDirection = event.deltaY;
      lastWheelZoomDirection.value = { wheelDirection };
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!props.visible || !showLeftOrRightSwitches.value) return;

      event.preventDefault();
      if (event.keyCode === KeyCode.LEFT) {
        handleActiveOffset(-1);
      } else if (event.keyCode === KeyCode.RIGHT) {
        handleActiveOffset(1);
      }
    };

    const onDoubleClick = () => {
      if (props.visible) {
        if (scale.value !== 1) {
          scale.value = 1;
        }
        if (position.x !== initialPosition.x || position.y !== initialPosition.y) {
          setPosition(initialPosition);
        }
        emitTransform('doubleClick');
      }
    };

    let removeListeners = () => {};
    onMounted(() => {
      watch(
        [() => props.visible, isMoving],
        () => {
          removeListeners();
          let onTopMouseUpListener: { remove: any };
          let onTopMouseMoveListener: { remove: any };

          const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
          const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);
          const onScrollWheelListener = addEventListener(window, 'wheel', onWheelMove, {
            passive: false,
          });
          const onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);

          try {
            // Resolve if in iframe lost event
            /* istanbul ignore next */
            if (window.top !== window.self) {
              onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
              onTopMouseMoveListener = addEventListener(
                window.top,
                'mousemove',
                onMouseMove,
                false,
              );
            }
          } catch (error) {
            /* istanbul ignore next */
            warning(false, `[vc-image] ${error}`);
          }

          removeListeners = () => {
            onMouseUpListener.remove();
            onMouseMoveListener.remove();
            onScrollWheelListener.remove();
            onKeyDownListener.remove();

            /* istanbul ignore next */
            if (onTopMouseUpListener) onTopMouseUpListener.remove();
            /* istanbul ignore next */
            if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
          };
        },
        { flush: 'post', immediate: true },
      );
      watch([lastWheelZoomDirection], () => {
        const { wheelDirection } = lastWheelZoomDirection.value;
        if (wheelDirection > 0) {
          onZoomOut(true);
        } else if (wheelDirection < 0) {
          onZoomIn(true);
        }
      });
    });
    onUnmounted(() => {
      removeListeners();
    });

    return () => {
      const { visible, prefixCls, rootClassName, popupClassNames, popupStyles } = props;
      const mergedActionsRender = props.actionsRender ?? props.toolbarRender;

      const progressNode =
        isPreviewGroup.value && previewGroupCount.value > 0 ? (
          <div class={`${prefixCls}-operations-progress`}>
            {props.countRender
              ? props.countRender(currentPreviewIndex.value + 1, previewGroupCount.value)
              : `${currentPreviewIndex.value + 1} / ${previewGroupCount.value}`}
          </div>
        ) : null;

      const defaultActionsNode = (
        <ul
          class={classnames(`${prefixCls}-operations`, popupClassNames?.actions)}
          style={popupStyles?.actions}
        >
          {progressNode}
          {tools.value.map(({ icon: IconType, onClick, type, disabled }) => (
            <li
              class={classnames(toolClassName, {
                [`${prefixCls}-operations-operation-disabled`]: disabled && disabled?.value,
                [popupClassNames?.close as string]: type === 'close' && !!popupClassNames?.close,
              })}
              style={type === 'close' ? popupStyles?.close : undefined}
              onClick={() => {
                if (disabled && disabled.value) return;
                onClick();
              }}
              key={type}
            >
              {isVNode(IconType) ? cloneVNode(IconType, { class: iconClassName }) : IconType}
            </li>
          ))}
        </ul>
      );

      const toolbarInfo: ToolbarRenderInfoType = {
        icons: {
          flipYIcon: props.icons?.flipY,
          flipXIcon: props.icons?.flipX,
          rotateLeftIcon: props.icons?.rotateLeft,
          rotateRightIcon: props.icons?.rotateRight,
          zoomOutIcon: props.icons?.zoomOut,
          zoomInIcon: props.icons?.zoomIn,
          closeIcon: props.icons?.close,
          prevIcon: props.icons?.left,
          nextIcon: props.icons?.right,
        },
        actions: {
          ...(isPreviewGroup.value ? { onActive: handleActiveOffset } : {}),
          onFlipY,
          onFlipX,
          onRotateLeft,
          onRotateRight,
          onZoomOut: () => onZoomOut(),
          onZoomIn: () => onZoomIn(),
          onReset,
          onClose,
        },
        transform: getTransform(),
        current: currentPreviewIndex.value,
        total: isPreviewGroup.value ? previewGroupCount.value : 1,
        image: currentItemInfo.value,
      };

      const actionsContent = mergedActionsRender
        ? mergedActionsRender(defaultActionsNode, toolbarInfo)
        : defaultActionsNode;

      const defaultImgNode = (
        <img
          onMousedown={onMouseDown}
          onDblclick={onDoubleClick}
          onError={() => {
            imgError.value = true;
          }}
          ref={imgRef}
          class={`${prefixCls}-img`}
          src={combinationSrc.value}
          alt={currentItemInfo.value.alt}
          style={{
            transform: `scale3d(${flip.x * scale.value}, ${flip.y * scale.value}, 1) rotate(${
              rotate.value
            }deg)`,
          }}
        />
      );

      const imgContent = props.imageRender
        ? props.imageRender(defaultImgNode, {
            transform: getTransform(),
            image: currentItemInfo.value,
            ...(isPreviewGroup.value ? { current: currentPreviewIndex.value } : {}),
          })
        : defaultImgNode;

      const mergedRootClassName = classnames(rootClassName, popupClassNames?.root);
      const mergedMaskClassName = classnames(props.maskClassName, popupClassNames?.mask);
      const mergedMaskStyle =
        props.maskStyle || popupStyles?.mask
          ? { ...props.maskStyle, ...popupStyles?.mask }
          : undefined;

      return (
        <Dialog
          {...attrs}
          transitionName={props.transitionName}
          maskTransitionName={props.maskTransitionName}
          closable={false}
          keyboard
          mask={props.mask !== false}
          maskClosable={props.maskClosable !== false}
          maskClassName={mergedMaskClassName}
          maskStyle={mergedMaskStyle}
          bodyClassName={classnames(props.bodyClassName, popupClassNames?.body)}
          bodyStyle={
            props.bodyStyle || popupStyles?.body
              ? { ...props.bodyStyle, ...popupStyles?.body }
              : undefined
          }
          prefixCls={prefixCls}
          onClose={onClose}
          afterClose={onAfterClose}
          visible={visible}
          wrapClassName={wrapClassName.value}
          rootClassName={mergedRootClassName}
          dialogStyle={popupStyles?.root}
          getContainer={props.getContainer}
          zIndex={props.zIndex}
        >
          <div
            class={classnames(
              `${prefixCls}-operations-wrapper`,
              mergedRootClassName,
              popupClassNames?.footer,
            )}
            style={popupStyles?.footer}
          >
            {actionsContent}
          </div>
          <div
            class={`${prefixCls}-img-wrapper`}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
          >
            {imgContent}
          </div>
          {showLeftOrRightSwitches.value && (
            <div
              class={classnames(`${prefixCls}-switch-left`, {
                [`${prefixCls}-switch-left-disabled`]: currentPreviewIndex.value <= 0,
              })}
              onClick={onSwitchLeft}
            >
              {props.icons?.left}
            </div>
          )}
          {showLeftOrRightSwitches.value && (
            <div
              class={classnames(`${prefixCls}-switch-right`, {
                [`${prefixCls}-switch-right-disabled`]:
                  currentPreviewIndex.value >= previewGroupCount.value - 1,
              })}
              onClick={onSwitchRight}
            >
              {props.icons?.right}
            </div>
          )}
        </Dialog>
      );
    };
  },
});

export default Preview;
