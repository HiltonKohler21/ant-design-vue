import { unit } from '../../_util/cssinjs';
import { getArrowOffset } from '../../style/placementArrow';
import {
  initMoveMotion,
  initSlideMotion,
  initZoomMotion,
  slideDownIn,
  slideDownOut,
  slideLeftIn,
  slideLeftOut,
  slideRightIn,
  slideRightOut,
  slideUpIn,
  slideUpOut,
} from '../../style/motion';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genButtonStyle from './button';
import genStatusStyle from './status';
import { genFocusStyle, resetComponent, roundedArrow } from '../../style';

export interface ComponentToken {
  zIndexPopup: number;
}

export interface DropdownToken extends FullToken<'Dropdown'> {
  rootPrefixCls: string;
  dropdownArrowDistance: number;
  dropdownArrowOffset: number;
  dropdownPaddingVertical: number;
  dropdownEdgeChildPadding: number;
  menuCls: string;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<DropdownToken> = token => {
  // 箭头几何是纯数值计算（cssVar 下 token 值是 var() 字符串）
  const rawGenToken: any = (token as any)._realToken ?? token;
  const {
    componentCls,
    menuCls,
    zIndexPopup,
    dropdownArrowDistance,
    dropdownArrowOffset,
    sizePopupArrow,
    antCls,
    iconCls,
    motionDurationMid,
    dropdownPaddingVertical,
    fontSize,
    dropdownEdgeChildPadding,
    colorTextDisabled,
    fontSizeIcon,
    controlPaddingHorizontal,
    colorBgElevated,
    boxShadowPopoverArrow,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999,
        },
        zIndex: zIndexPopup,
        display: 'block',

        '&-pure': {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          display: 'inline-block',
        },

        // A placeholder out of dropdown visible range to avoid close when user moving
        '&::before': {
          position: 'absolute',
          insetBlock: token
            .calc(dropdownArrowDistance)
            .mul(-1)
            .add(token.calc(sizePopupArrow).div(2).equal())
            .equal(),
          // insetInlineStart: -7, // FIXME: Seems not work for hidden element
          zIndex: -9999,
          opacity: 0.0001,
          content: '""',
        },

        [`${componentCls}-wrap`]: {
          position: 'relative',

          [`${antCls}-btn > ${iconCls}-down`]: {
            fontSize: fontSizeIcon,
          },

          [`${iconCls}-down::before`]: {
            transition: `transform ${motionDurationMid}`,
          },
        },

        [`${componentCls}-wrap-open`]: {
          [`${iconCls}-down::before`]: {
            transform: `rotate(180deg)`,
          },
        },

        [`
        &-hidden,
        &-menu-hidden,
        &-menu-submenu-hidden
      `]: {
          display: 'none',
        },

        // =============================================================
        // ==                          Arrow                          ==
        // =============================================================
        // Offset the popover to account for the dropdown arrow
        [`
        &-show-arrow${componentCls}-placement-topLeft,
        &-show-arrow${componentCls}-placement-top,
        &-show-arrow${componentCls}-placement-topRight
      `]: {
          paddingBottom: dropdownArrowDistance,
        },

        [`
        &-show-arrow${componentCls}-placement-bottomLeft,
        &-show-arrow${componentCls}-placement-bottom,
        &-show-arrow${componentCls}-placement-bottomRight
      `]: {
          paddingTop: dropdownArrowDistance,
        },

        [`
        &-show-arrow${componentCls}-placement-leftTop,
        &-show-arrow${componentCls}-placement-left,
        &-show-arrow${componentCls}-placement-leftBottom
      `]: {
          paddingRight: dropdownArrowDistance,
        },

        [`
        &-show-arrow${componentCls}-placement-rightTop,
        &-show-arrow${componentCls}-placement-right,
        &-show-arrow${componentCls}-placement-rightBottom
      `]: {
          paddingLeft: dropdownArrowDistance,
        },

        // Note: .popover-arrow is outer, .popover-arrow:after is inner
        [`${componentCls}-arrow`]: {
          position: 'absolute',
          zIndex: 1, // lift it up so the menu wouldn't cask shadow on it
          display: 'block',

          ...roundedArrow(
            rawGenToken.sizePopupArrow,
            rawGenToken.borderRadiusXS,
            rawGenToken.borderRadiusOuter,
            colorBgElevated,
            boxShadowPopoverArrow,
          ),
        },

        [`
        &-placement-top > ${componentCls}-arrow,
        &-placement-topLeft > ${componentCls}-arrow,
        &-placement-topRight > ${componentCls}-arrow
      `]: {
          bottom: dropdownArrowDistance,
          transform: 'translateY(100%) rotate(180deg)',
        },

        [`&-placement-top > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: 'translateX(-50%) translateY(100%) rotate(180deg)',
        },

        [`&-placement-topLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-topRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`
          &-placement-bottom > ${componentCls}-arrow,
          &-placement-bottomLeft > ${componentCls}-arrow,
          &-placement-bottomRight > ${componentCls}-arrow
        `]: {
          top: dropdownArrowDistance,
          transform: `translateY(-100%)`,
        },

        [`&-placement-bottom > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: `translateY(-100%) translateX(-50%)`,
        },

        [`&-placement-bottomLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-bottomRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`
          &-placement-left > ${componentCls}-arrow,
          &-placement-leftTop > ${componentCls}-arrow,
          &-placement-leftBottom > ${componentCls}-arrow
        `]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowDistance,
          },
          transform: 'translateX(100%) rotate(90deg)',
        },

        [`&-placement-left > ${componentCls}-arrow`]: {
          top: '50%',
          transform: 'translateY(-50%) translateX(100%) rotate(90deg)',
        },

        [`&-placement-leftTop > ${componentCls}-arrow`]: {
          top: dropdownArrowOffset,
        },

        [`&-placement-leftBottom > ${componentCls}-arrow`]: {
          bottom: dropdownArrowOffset,
        },

        [`
          &-placement-right > ${componentCls}-arrow,
          &-placement-rightTop > ${componentCls}-arrow,
          &-placement-rightBottom > ${componentCls}-arrow
        `]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowDistance,
          },
          transform: 'translateX(-100%) rotate(-90deg)',
        },

        [`&-placement-right > ${componentCls}-arrow`]: {
          top: '50%',
          transform: 'translateY(-50%) translateX(-100%) rotate(-90deg)',
        },

        [`&-placement-rightTop > ${componentCls}-arrow`]: {
          top: dropdownArrowOffset,
        },

        [`&-placement-rightBottom > ${componentCls}-arrow`]: {
          bottom: dropdownArrowOffset,
        },

        // =============================================================
        // ==                         Motion                          ==
        // =============================================================
        // When position is not enough for dropdown, the placement will revert.
        // We will handle this with revert motion name.
        [`&${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottomRight,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottomRight`]:
          {
            animationName: slideUpIn,
          },

        [`&${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-top,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-top,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-topRight,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-topRight`]:
          {
            animationName: slideDownIn,
          },

        [`&${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottomRight`]:
          {
            animationName: slideUpOut,
          },

        [`&${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-top,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-topRight`]:
          {
            animationName: slideDownOut,
          },

        [`&${antCls}-slide-right-enter${antCls}-slide-right-enter-active${componentCls}-placement-right,
          &${antCls}-slide-right-appear${antCls}-slide-right-appear-active${componentCls}-placement-right,
          &${antCls}-slide-right-enter${antCls}-slide-right-enter-active${componentCls}-placement-rightTop,
          &${antCls}-slide-right-appear${antCls}-slide-right-appear-active${componentCls}-placement-rightTop,
          &${antCls}-slide-right-enter${antCls}-slide-right-enter-active${componentCls}-placement-rightBottom,
          &${antCls}-slide-right-appear${antCls}-slide-right-appear-active${componentCls}-placement-rightBottom`]:
          {
            animationName: slideLeftIn,
          },

        [`&${antCls}-slide-left-enter${antCls}-slide-left-enter-active${componentCls}-placement-left,
          &${antCls}-slide-left-appear${antCls}-slide-left-appear-active${componentCls}-placement-left,
          &${antCls}-slide-left-enter${antCls}-slide-left-enter-active${componentCls}-placement-leftTop,
          &${antCls}-slide-left-appear${antCls}-slide-left-appear-active${componentCls}-placement-leftTop,
          &${antCls}-slide-left-enter${antCls}-slide-left-enter-active${componentCls}-placement-leftBottom,
          &${antCls}-slide-left-appear${antCls}-slide-left-appear-active${componentCls}-placement-leftBottom`]:
          {
            animationName: slideRightIn,
          },

        [`&${antCls}-slide-right-leave${antCls}-slide-right-leave-active${componentCls}-placement-right,
          &${antCls}-slide-right-leave${antCls}-slide-right-leave-active${componentCls}-placement-rightTop,
          &${antCls}-slide-right-leave${antCls}-slide-right-leave-active${componentCls}-placement-rightBottom`]:
          {
            animationName: slideLeftOut,
          },

        [`&${antCls}-slide-left-leave${antCls}-slide-left-leave-active${componentCls}-placement-left,
          &${antCls}-slide-left-leave${antCls}-slide-left-leave-active${componentCls}-placement-leftTop,
          &${antCls}-slide-left-leave${antCls}-slide-left-leave-active${componentCls}-placement-leftBottom`]:
          {
            animationName: slideRightOut,
          },
      },
    },

    {
      // =============================================================
      // ==                          Menu                           ==
      // =============================================================
      [`${componentCls} ${menuCls}`]: {
        position: 'relative',
        margin: 0,
      },

      [`${menuCls}-submenu-popup`]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        background: 'transparent',
        boxShadow: 'none',
        transformOrigin: '0 0',

        'ul,li': {
          listStyle: 'none',
        },

        ul: {
          marginInline: '0.3em',
        },
      },

      [`${componentCls}, ${componentCls}-menu-submenu`]: {
        [menuCls]: {
          padding: dropdownEdgeChildPadding,
          listStyleType: 'none',
          backgroundColor: colorBgElevated,
          backgroundClip: 'padding-box',
          borderRadius: token.borderRadiusLG,
          outline: 'none',
          boxShadow: token.boxShadowSecondary,
          ...genFocusStyle(token),

          '&:empty': {
            padding: 0,
            boxShadow: 'none',
          },

          [`${menuCls}-item-group-title`]: {
            padding: `${unit(dropdownPaddingVertical)} ${unit(controlPaddingHorizontal)}`,
            color: token.colorTextDescription,
            transition: `all ${motionDurationMid}`,
          },

          // ======================= Item Content =======================
          [`${menuCls}-item`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: token.borderRadiusSM,
          },

          [`${menuCls}-item-icon`]: {
            minWidth: fontSize,
            marginInlineEnd: token.marginXS,
            fontSize: token.fontSizeSM,
          },

          [`${menuCls}-title-content`]: {
            flex: 'auto',

            [`&-with-extra, ${menuCls}-title-content-with-extra`]: {
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            },

            [`> a, ${menuCls}-item-label > a`]: {
              color: 'inherit',
              transition: `all ${motionDurationMid}`,

              '&:hover': {
                color: 'inherit',
              },

              '&::after': {
                position: 'absolute',
                inset: 0,
                content: '""',
              },
            },

            [`${menuCls}-item-extra`]: {
              paddingInlineStart: token.padding,
              marginInlineStart: 'auto',
              fontSize: token.fontSizeSM,
              color: token.colorTextDescription,
            },
          },

          // =========================== Item ===========================
          [`${menuCls}-item, ${menuCls}-submenu-title`]: {
            clear: 'both',
            margin: 0,
            padding: `${unit(dropdownPaddingVertical)} ${unit(controlPaddingHorizontal)}`,
            color: token.colorText,
            fontWeight: 'normal',
            lineHeight: token.lineHeight,
            cursor: 'pointer',
            transition: `all ${motionDurationMid}`,

            [`&:hover, &-active`]: {
              backgroundColor: token.controlItemBgHover,
            },

            ...genFocusStyle(token),

            '&-selected': {
              color: token.colorPrimary,
              backgroundColor: token.controlItemBgActive,
              '&:hover, &-active': {
                backgroundColor: token.controlItemBgActiveHover,
              },
            },

            '&-disabled': {
              color: colorTextDisabled,
              cursor: 'not-allowed',

              '&:hover': {
                color: colorTextDisabled,
                backgroundColor: colorBgElevated,
                cursor: 'not-allowed',
              },

              a: {
                pointerEvents: 'none',
              },
            },

            '&-divider': {
              height: 1, // By design
              margin: `${unit(token.marginXXS)} 0`,
              overflow: 'hidden',
              lineHeight: 0,
              backgroundColor: token.colorSplit,
            },

            [`${componentCls}-menu-submenu-expand-icon`]: {
              position: 'absolute',
              insetInlineEnd: token.paddingXS,

              [`${componentCls}-menu-submenu-arrow-icon`]: {
                marginInlineEnd: '0 !important',
                color: token.colorTextDescription,
                fontSize: fontSizeIcon,
                fontStyle: 'normal',
              },
            },
          },

          [`${menuCls}-item-group-list`]: {
            margin: `0 ${unit(token.marginXS)}`,
            padding: 0,
            listStyle: 'none',
          },

          [`${menuCls}-submenu-title`]: {
            paddingInlineEnd: token.calc(controlPaddingHorizontal).add(token.fontSizeSM).equal(),
          },

          [`${menuCls}-submenu-vertical`]: {
            position: 'relative',
          },

          [`${menuCls}-submenu${menuCls}-submenu-disabled ${componentCls}-menu-submenu-title`]: {
            [`&, ${componentCls}-menu-submenu-arrow-icon`]: {
              color: colorTextDisabled,
              backgroundColor: colorBgElevated,
              cursor: 'not-allowed',
            },
          },

          // https://github.com/ant-design/ant-design/issues/19264
          [`${menuCls}-submenu-selected ${componentCls}-menu-submenu-title`]: {
            color: token.colorPrimary,
          },
        },
      },
    },

    // Follow code may reuse in other components
    [
      initSlideMotion(token, 'slide-up'),
      initSlideMotion(token, 'slide-down'),
      initSlideMotion(token, 'slide-left'),
      initSlideMotion(token, 'slide-right'),
      initMoveMotion(token, 'move-up'),
      initMoveMotion(token, 'move-down'),
      initZoomMotion(token, 'zoom-big'),
    ],
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Dropdown',
  (token, { rootPrefixCls }) => {
    const { paddingXXS, componentCls } = token;

    // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
    const rawToken: any = (token as any)._realToken ?? token;
    const dropdownPaddingVertical =
      (rawToken.controlHeight - rawToken.fontSize * rawToken.lineHeight) / 2;
    const { dropdownArrowOffset } = getArrowOffset({
      sizePopupArrow: rawToken.sizePopupArrow,
      contentRadius: rawToken.borderRadiusLG,
      borderRadiusOuter: rawToken.borderRadiusOuter,
    });

    const dropdownToken = mergeToken<DropdownToken>(token, {
      menuCls: `${componentCls}-menu`,
      rootPrefixCls,
      dropdownArrowDistance: rawToken.sizePopupArrow / 2 + rawToken.marginXXS,
      dropdownArrowOffset,
      dropdownPaddingVertical,
      dropdownEdgeChildPadding: paddingXXS,
    });
    return [
      genBaseStyle(dropdownToken),
      genButtonStyle(dropdownToken),
      genStatusStyle(dropdownToken),
    ];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
  }),
);
