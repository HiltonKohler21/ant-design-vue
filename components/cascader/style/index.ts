import { unit } from '../../_util/cssinjs';
import { getStyle as getCheckboxStyle } from '../../checkbox/style';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent, textEllipsis } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';

export interface ComponentToken {
  controlWidth: number;
  controlItemWidth: number;
  dropdownHeight: number;
}

type CascaderToken = FullToken<'Cascader'>;

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<CascaderToken> = token => {
  const { prefixCls, componentCls, antCls } = token;
  const cascaderMenuItemCls = `${componentCls}-menu-item`;
  const iconCls = `
    &${cascaderMenuItemCls}-expand ${cascaderMenuItemCls}-expand-icon,
    ${cascaderMenuItemCls}-loading-icon
  `;

  // 尺寸派生使用真实数值 token（cssVar 下 token 值是 var() 字符串）
  const rawToken: any = (token as any)._realToken ?? token;
  const itemPaddingVertical = Math.round(
    (rawToken.controlHeight - rawToken.fontSize * rawToken.lineHeight) / 2,
  );

  return [
    // =====================================================
    // ==                     Control                     ==
    // =====================================================
    {
      [componentCls]: {
        width: token.controlWidth,
      },
    },
    // =====================================================
    // ==                 Popup & Panel                   ==
    // =====================================================
    {
      [`${componentCls}-dropdown, ${componentCls}-panel`]: [
        // ==================== Checkbox ====================
        getCheckboxStyle(`${prefixCls}-checkbox`, token),
        {
          [componentCls]: {
            // ================== Checkbox ==================
            '&-checkbox': {
              top: 0,
              marginInlineEnd: token.paddingXS,
            },

            // ==================== Menu ====================
            // >>> Menus
            '&-menus': {
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'flex-start',

              [`&${componentCls}-menu-empty`]: {
                [`${componentCls}-menu`]: {
                  width: '100%',
                  height: 'auto',

                  [cascaderMenuItemCls]: {
                    color: token.colorTextDisabled,
                  },
                },
              },
            },

            // >>> Menu
            '&-menu': {
              flexGrow: 1,
              minWidth: token.controlItemWidth,
              height: token.dropdownHeight,
              margin: 0,
              padding: token.paddingXXS,
              overflow: 'auto',
              verticalAlign: 'top',
              listStyle: 'none',
              '-ms-overflow-style': '-ms-autohiding-scrollbar', // https://github.com/ant-design/ant-design/issues/11857

              '&:not(:last-child)': {
                borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
              },

              '&-item': {
                ...textEllipsis,
                display: 'flex',
                maxWidth: 400,
                flexWrap: 'nowrap',
                alignItems: 'center',
                padding: `${unit(itemPaddingVertical)} ${unit(token.paddingSM)}`,
                lineHeight: token.lineHeight,
                cursor: 'pointer',
                transition: `all ${token.motionDurationMid}`,
                borderRadius: token.borderRadiusSM,

                '&:hover': {
                  background: token.controlItemBgHover,
                },
                '&-disabled': {
                  color: token.colorTextDisabled,
                  cursor: 'not-allowed',

                  '&:hover': {
                    background: 'transparent',
                  },

                  [iconCls]: {
                    color: token.colorTextDisabled,
                  },
                },

                [`&-active:not(${cascaderMenuItemCls}-disabled)`]: {
                  [`&, &:hover`]: {
                    fontWeight: token.fontWeightStrong,
                    backgroundColor: token.controlItemBgActive,
                  },
                },

                '&-content': {
                  flex: 'auto',
                  minWidth: 0,
                  ...textEllipsis,
                },

                [iconCls]: {
                  marginInlineStart: token.paddingXXS,
                  color: token.colorTextDescription,
                  fontSize: token.fontSizeIcon,
                },

                '&-keyword': {
                  color: token.colorHighlight,
                },
              },
            },
          },
        },
      ],
    },
    {
      [`${componentCls}-dropdown`]: {
        [`&${antCls}-select-dropdown`]: {
          padding: 0,
        },
      },
    },
    // =====================================================
    // ==                      Panel                      ==
    // =====================================================
    {
      [`${componentCls}-panel`]: {
        ...resetComponent(token),
        display: 'inline-flex',
        backgroundColor: token.colorBgContainer,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        borderRadius: token.borderRadiusLG,
        overflowX: 'auto',
        maxWidth: '100%',

        [`${componentCls}-menus`]: {
          alignItems: 'stretch',
        },
        [`${componentCls}-menu`]: {
          height: 'auto',
        },

        '&-empty': {
          padding: token.paddingXXS,
        },
      },
    },
    // =====================================================
    // ==                       RTL                       ==
    // =====================================================
    {
      [`${componentCls}-dropdown-rtl, ${componentCls}-panel-rtl`]: {
        direction: 'rtl',
      },
    },
    // =====================================================
    // ==             Space Compact                       ==
    // =====================================================
    genCompactItemStyle(token),
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook('Cascader', token => [genBaseStyle(token)], {
  controlWidth: 184,
  controlItemWidth: 111,
  dropdownHeight: 180,
});
