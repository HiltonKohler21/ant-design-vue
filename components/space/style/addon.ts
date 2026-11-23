import type { CSSObject } from '../../_util/cssinjs';
import { resetComponent } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
}

interface AddonToken extends FullToken<'Space'> {
  // Custom token here
}

const genSpaceAddonStyle: GenerateStyle<AddonToken, CSSObject> = token => {
  const {
    componentCls,
    borderRadius,
    paddingSM,
    colorBorder,
    paddingXS,
    fontSizeLG,
    fontSizeSM,
    borderRadiusLG,
    borderRadiusSM,
    colorBgContainerDisabled,
    lineWidth,
    lineType,
  } = token;

  return {
    [componentCls]: [
      // ==========================================================
      // ==                         Base                         ==
      // ==========================================================
      {
        ...resetComponent(token),
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        whiteSpace: 'nowrap',
        paddingInline: paddingSM,
        margin: 0,
        borderWidth: lineWidth,
        borderStyle: lineType,
        borderRadius,

        '&:hover': {
          zIndex: 0,
        },

        [`&${componentCls}-disabled`]: {
          color: token.colorTextDisabled,
        },

        '&-large': {
          fontSize: fontSizeLG,
          borderRadius: borderRadiusLG,
        },
        '&-small': {
          paddingInline: paddingXS,
          borderRadius: borderRadiusSM,
          fontSize: fontSizeSM,
        },
        '&-compact-last-item': {
          borderEndStartRadius: 0,
          borderStartStartRadius: 0,
        },
        '&-compact-first-item': {
          borderEndEndRadius: 0,
          borderStartEndRadius: 0,
        },
        '&-compact-item:not(:first-child):not(:last-child)': {
          borderRadius: 0,
        },
        '&-compact-item:not(:last-child)': {
          borderInlineEndWidth: 0,
        },
        '&-compact-item:not(:first-child)': {
          borderInlineStartWidth: 0,
        },
      },

      // ==========================================================
      // ==                       Variants                       ==
      // ==========================================================
      {
        '--ant-space-addon-border-color': colorBorder,
        '--ant-space-addon-background': colorBgContainerDisabled,
        '--ant-space-addon-border-color-outlined': colorBorder,
        '--ant-space-addon-background-filled': colorBgContainerDisabled,

        borderColor: 'var(--ant-space-addon-border-color)',
        background: 'var(--ant-space-addon-background)',

        // ======================= Outlined =======================
        '&-variant-outlined': {
          '--ant-space-addon-border-color': 'var(--ant-space-addon-border-color-outlined)',
        },

        // ======================== Filled ========================
        '&-variant-filled': {
          '--ant-space-addon-border-color': 'transparent',
          '--ant-space-addon-background': 'var(--ant-space-addon-background-filled)',

          // Disabled
          [`&${componentCls}-disabled`]: {
            '--ant-space-addon-border-color': colorBorder,
            '--ant-space-addon-background': colorBgContainerDisabled,
          },
        },

        // ====================== Borderless ======================
        '&-variant-borderless': {
          border: 'none',
          background: 'transparent',
        },

        // ====================== Underlined ======================
        '&-variant-underlined': {
          border: 'none',
          background: 'transparent',
        },
      },

      // ==========================================================
      // ==                        Status                        ==
      // ==========================================================
      {
        '&-status-error': {
          '--ant-space-addon-border-color-outlined': token.colorError,
          '--ant-space-addon-background-filled': token.colorErrorBg,
          color: token.colorError,
        },
        '&-status-warning': {
          '--ant-space-addon-border-color-outlined': token.colorWarning,
          '--ant-space-addon-background-filled': token.colorWarningBg,
          color: token.colorWarning,
        },
      },
    ],
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Space', token => [
  genSpaceAddonStyle(token),
  genCompactItemStyle(token, { focus: false }),
]);
