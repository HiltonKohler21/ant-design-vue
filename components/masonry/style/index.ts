import { Keyframes, unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  /**
   * @desc 列间距
   * @descEN Column gap
   */
  columnGap: number;
  /**
   * @desc 行间距
   * @descEN Row gap
   */
  rowGap: number;
}

type MasonryToken = FullToken<'Masonry'>;

const masonryItemAppear = new Keyframes('antMasonryItemAppear', {
  from: {
    opacity: 0,
    transform: 'translateY(8px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const genMasonryStyle: GenerateStyle<MasonryToken> = token => {
  const {
    componentCls,
    columnGap,
    rowGap,
    motionDurationFast,
    motionDurationMid,
    motionDurationSlow,
    motionEaseOut,
  } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%',
      boxSizing: 'border-box',
      columnGap: unit(columnGap),
      rowGap: unit(rowGap),

      [`${componentCls}-column`]: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      },

      [itemCls]: {
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        transition: [
          `opacity ${motionDurationSlow} ${motionEaseOut}`,
          `transform ${motionDurationSlow} ${motionEaseOut}`,
          `margin ${motionDurationMid} ${motionEaseOut}`,
        ].join(', '),
        animationName: masonryItemAppear,
        animationDuration: motionDurationMid,
        animationTimingFunction: motionEaseOut,
        animationFillMode: 'both',

        '&-fade': {
          '&-appear': {
            transition: `opacity ${motionDurationSlow} ${motionEaseOut}`,
            opacity: 0,

            '&-active': {
              opacity: 1,
            },
          },

          '&-leave': {
            transition: `opacity ${motionDurationFast} ${motionEaseOut}`,
            opacity: 1,

            '&-active': {
              opacity: 0,
            },
          },
        },
      },

      '&-rtl': {
        direction: 'rtl',
      },
    },
  };
};

export default genComponentStyleHook(
  'Masonry',
  token => genMasonryStyle(token as MasonryToken),
  token => ({
    columnGap: token.margin,
    rowGap: token.margin,
  }),
);
