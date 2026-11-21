import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import { resetComponent } from '../../style';
import type { SelectToken } from '.';
import { mergeToken } from '../../theme/internal';

function genSizeStyle(token: SelectToken, suffix?: string): CSSObject {
  const { componentCls, inputPaddingHorizontalBase, borderRadius } = token;

  const selectHeightWithoutBorder = token
    .calc(token.controlHeight)
    .sub(token.calc(token.lineWidth).mul(2).equal())
    .equal();

  const selectionItemPadding = token.calc(token.fontSize).mul(1.25).equal();

  const suffixCls = suffix ? `${componentCls}-${suffix}` : '';

  return {
    [`${componentCls}-single${suffixCls}`]: {
      fontSize: token.fontSize,

      // ========================= Selector =========================
      [`${componentCls}-selector`]: {
        ...resetComponent(token),

        display: 'flex',
        borderRadius,

        [`${componentCls}-selection-search`]: {
          position: 'absolute',
          top: 0,
          insetInlineStart: inputPaddingHorizontalBase,
          insetInlineEnd: inputPaddingHorizontalBase,
          bottom: 0,

          '&-input': {
            width: '100%',
          },
        },

        [`
          ${componentCls}-selection-item,
          ${componentCls}-selection-placeholder
        `]: {
          padding: 0,
          lineHeight: selectHeightWithoutBorder,
          transition: `all ${token.motionDurationSlow}`,

          // Firefox inline-block position calculation is not same as Chrome & Safari. Patch this:
          '@supports (-moz-appearance: meterbar)': {
            lineHeight: selectHeightWithoutBorder,
          },
        },

        [`${componentCls}-selection-item`]: {
          position: 'relative',
          userSelect: 'none',
        },

        [`${componentCls}-selection-placeholder`]: {
          transition: 'none',
          pointerEvents: 'none',
        },

        // For common baseline align
        [[
          '&:after',
          /* For '' value baseline align */
          `${componentCls}-selection-item:after`,
          /* For undefined value baseline align */
          `${componentCls}-selection-placeholder:after`,
        ].join(',')]: {
          display: 'inline-block',
          width: 0,
          visibility: 'hidden',
          content: '"\\a0"',
        },
      },

      [`
        &${componentCls}-show-arrow ${componentCls}-selection-item,
        &${componentCls}-show-arrow ${componentCls}-selection-placeholder
      `]: {
        paddingInlineEnd: selectionItemPadding,
      },

      // Opacity selection if open
      [`&${componentCls}-open ${componentCls}-selection-item`]: {
        color: token.colorTextPlaceholder,
      },

      // ========================== Input ==========================
      // We only change the style of non-customize input which is only support by `combobox` mode.
      // Not customize
      [`&:not(${componentCls}-customize-input)`]: {
        [`${componentCls}-selector`]: {
          width: '100%',
          height: token.controlHeight,
          padding: `0 ${inputPaddingHorizontalBase}px`,

          [`${componentCls}-selection-search-input`]: {
            height: selectHeightWithoutBorder,
          },

          '&:after': {
            lineHeight: selectHeightWithoutBorder,
          },
        },
      },

      [`&${componentCls}-customize-input`]: {
        [`${componentCls}-selector`]: {
          '&:after': {
            display: 'none',
          },

          [`${componentCls}-selection-search`]: {
            position: 'static',
            width: '100%',
          },

          [`${componentCls}-selection-placeholder`]: {
            position: 'absolute',
            insetInlineStart: 0,
            insetInlineEnd: 0,
            padding: `0 ${inputPaddingHorizontalBase}px`,

            '&:after': {
              display: 'none',
            },
          },
        },
      },
    },
  };
}

export default function genSingleStyle(token: SelectToken): CSSInterpolation {
  const { componentCls } = token;

  const inputPaddingHorizontalSM = token.calc(token.controlPaddingHorizontalSM).sub(token.lineWidth).equal();

  return [
    genSizeStyle(token),

    // ======================== Small ========================
    // Shared
    genSizeStyle(
      mergeToken<any>(token, {
        controlHeight: token.controlHeightSM,
        borderRadius: token.borderRadiusSM,
      }),
      'sm',
    ),

    // padding
    {
      [`${componentCls}-single${componentCls}-sm`]: {
        [`&:not(${componentCls}-customize-input)`]: {
          [`${componentCls}-selection-search`]: {
            insetInlineStart: inputPaddingHorizontalSM,
            insetInlineEnd: inputPaddingHorizontalSM,
          },

          [`${componentCls}-selector`]: {
            padding: `0 ${inputPaddingHorizontalSM}px`,
          },

          // With arrow should provides `padding-right` to show the arrow
          [`&${componentCls}-show-arrow ${componentCls}-selection-search`]: {
            insetInlineEnd: inputPaddingHorizontalSM + token.calc(token.fontSize).mul(1.5).equal(),
          },

          [`
            &${componentCls}-show-arrow ${componentCls}-selection-item,
            &${componentCls}-show-arrow ${componentCls}-selection-placeholder
          `]: {
            paddingInlineEnd: token.calc(token.fontSize).mul(1.5).equal(),
          },
        },
      },
    },

    // ======================== Large ========================
    // Shared
    genSizeStyle(
      mergeToken<any>(token, {
        controlHeight: token.controlHeightLG,
        fontSize: token.fontSizeLG,
        borderRadius: token.borderRadiusLG,
      }),
      'lg',
    ),
  ];
}
