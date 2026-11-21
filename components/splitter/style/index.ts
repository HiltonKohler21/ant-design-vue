import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import type { CSSObject } from '../../_util/cssinjs';
import { mergeToken, genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  splitBarSize: number;
  splitTriggerSize: number;
  splitBarDraggableSize: number;
  resizeSpinnerSize: number;
}

interface SplitterToken extends FullToken<'Splitter'> {
  splitBarSize: number;
  splitTriggerSize: number;
  splitBarDraggableSize: number;
}

const centerStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const genSplitterStyle: GenerateStyle<SplitterToken, CSSObject> = token => {
  const {
    componentCls,
    colorFill,
    splitBarDraggableSize,
    splitBarSize,
    splitTriggerSize,
    controlItemBgHover,
    controlItemBgActive,
    controlItemBgActiveHover,
    prefixCls,
  } = token;
  const splitBarCls = `${componentCls}-bar`;
  const splitMaskCls = `${componentCls}-mask`;
  const splitPanelCls = `${componentCls}-panel`;
  const halfTriggerSize = `${unit(token.calc(splitTriggerSize).div(2).equal())}`;
  const splitterBarPreviewOffsetVar = `${prefixCls}-bar-preview-offset`;

  const splitterBarPreviewStyle: CSSObject = {
    position: 'absolute',
    background: token.colorPrimary,
    opacity: 0.2,
    pointerEvents: 'none',
    transition: 'none',
    zIndex: 1,
    display: 'none',
  };

  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'stretch',
      [`> ${splitBarCls}`]: {
        flex: 'none',
        position: 'relative',
        userSelect: 'none',
        [`${splitBarCls}-dragger`]: {
          ...centerStyle,
          zIndex: 1,
          '&::before': {
            content: '""',
            background: controlItemBgHover,
            ...centerStyle,
          },
          '&::after': {
            content: '""',
            background: colorFill,
            ...centerStyle,
          },
          [`&:hover:not(${splitBarCls}-dragger-active)`]: {
            '&::before': {
              background: controlItemBgActive,
            },
          },
          '&-active': {
            zIndex: 2,
            '&::before': {
              background: controlItemBgActiveHover,
            },
          },
          [`&-disabled${splitBarCls}-dragger`]: {
            zIndex: 0,
            '&, &:hover, &-active': {
              cursor: 'default',
              '&::before': {
                background: controlItemBgHover,
              },
            },
            '&::after': {
              display: 'none',
            },
          },
        },
        [`${splitBarCls}-collapse-bar`]: {
          ...centerStyle,
          zIndex: token.zIndexPopupBase,
          background: controlItemBgHover,
          fontSize: token.fontSizeSM,
          borderRadius: token.borderRadiusXS,
          color: token.colorText,
          cursor: 'pointer',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            background: controlItemBgActive,
          },
          '&:active': {
            background: controlItemBgActiveHover,
          },
        },
        '&:hover, &:active': {
          [`${splitBarCls}-collapse-bar-hover-only`]: {
            opacity: 1,
          },
        },
        [`${splitBarCls}-collapse-bar-hover-only`]: {
          '@media(hover:none)': {
            opacity: 1,
          },
        },
        [`${splitBarCls}-collapse-bar-always-hidden`]: {
          display: 'none',
        },
        [`${splitBarCls}-collapse-bar-always-visible`]: {
          opacity: 1,
        },
      },
      [splitMaskCls]: {
        position: 'fixed',
        zIndex: token.zIndexPopupBase,
        inset: 0,
        '&-horizontal': {
          cursor: 'col-resize',
        },
        '&-vertical': {
          cursor: 'row-resize',
        },
      },
      '&-horizontal': {
        flexDirection: 'row',
        [`> ${splitBarCls}`]: {
          width: 0,
          [`${splitBarCls}-preview`]: {
            height: '100%',
            width: splitBarSize,
            ...splitterBarPreviewStyle,
            [`&${splitBarCls}-preview-active`]: {
              display: 'block',
              transform: `translateX(var(--${splitterBarPreviewOffsetVar}))`,
            },
          },
          [`${splitBarCls}-dragger`]: {
            cursor: 'col-resize',
            height: '100%',
            width: splitTriggerSize,
            '&::before': {
              height: '100%',
              width: splitBarSize,
            },
            '&::after': {
              height: splitBarDraggableSize,
              width: splitBarSize,
            },
          },
          [`${splitBarCls}-collapse-bar`]: {
            width: token.fontSizeSM,
            height: token.controlHeightSM,
            '&-start': {
              left: 'auto',
              right: halfTriggerSize,
              transform: 'translateY(-50%)',
            },
            '&-end': {
              left: halfTriggerSize,
              right: 'auto',
              transform: 'translateY(-50%)',
            },
          },
        },
      },
      '&-vertical': {
        flexDirection: 'column',
        [`> ${splitBarCls}`]: {
          height: 0,
          [`${splitBarCls}-preview`]: {
            height: splitBarSize,
            width: '100%',
            ...splitterBarPreviewStyle,
            [`&${splitBarCls}-preview-active`]: {
              display: 'block',
              transform: `translateY(var(--${splitterBarPreviewOffsetVar}))`,
            },
          },
          [`${splitBarCls}-dragger`]: {
            cursor: 'row-resize',
            width: '100%',
            height: splitTriggerSize,
            '&::before': {
              width: '100%',
              height: splitBarSize,
            },
            '&::after': {
              width: splitBarDraggableSize,
              height: splitBarSize,
            },
          },
          [`${splitBarCls}-collapse-bar`]: {
            height: token.fontSizeSM,
            width: token.controlHeightSM,
            '&-start': {
              top: 'auto',
              bottom: halfTriggerSize,
              transform: 'translateX(-50%)',
            },
            '&-end': {
              top: halfTriggerSize,
              bottom: 'auto',
              transform: 'translateX(-50%)',
            },
          },
        },
      },
      [splitPanelCls]: {
        overflow: 'auto',
        padding: '0 1px',
        scrollbarWidth: 'thin',
        boxSizing: 'border-box',
        '&-hidden': {
          padding: 0,
          overflow: 'hidden',
        },
        [`&:has(${componentCls}:only-child)`]: {
          overflow: 'hidden',
        },
      },
    },
  };
};

export default genComponentStyleHook<'Splitter'>('Splitter', token => {
  const splitBarSize = (token as any).splitBarSize || 2;
  const splitTriggerSize = (token as any).splitTriggerSize || 6;
  const resizeSpinnerSize = (token as any).resizeSpinnerSize || 20;
  const splitBarDraggableSize = (token as any).splitBarDraggableSize || resizeSpinnerSize;
  const splitterToken = mergeToken<SplitterToken>(token, {
    splitBarSize,
    splitTriggerSize,
    splitBarDraggableSize,
    resizeSpinnerSize,
  });
  return genSplitterStyle(splitterToken);
});
