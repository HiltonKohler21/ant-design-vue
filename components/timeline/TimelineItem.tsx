import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { filterEmpty } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';

import { tuple, booleanType, objectType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import {
  useInjectTimeline,
  type TimelineItemSemanticClassNames,
  type TimelineItemSemanticStyles,
} from './context';

export const timelineItemProps = () => ({
  prefixCls: String,
  color: String,
  dot: PropTypes.any,
  icon: PropTypes.any,
  pending: booleanType(),
  position: PropTypes.oneOf(tuple('left', 'right', 'start', 'end', '')).def(''),
  placement: PropTypes.oneOf(tuple('start', 'end', '')).def(''),
  label: PropTypes.any,
  title: PropTypes.any,
  content: PropTypes.any,
  classNames: objectType<TimelineItemSemanticClassNames>(),
  styles: objectType<TimelineItemSemanticStyles>(),
});

export type TimelineItemProps = Partial<ExtractPropTypes<ReturnType<typeof timelineItemProps>>>;

function mergeOptionalStyle(...styles: (CSSProperties | undefined)[]): CSSProperties | undefined {
  let merged: CSSProperties | undefined;
  for (const s of styles) {
    if (s && Object.keys(s).length > 0) {
      merged = merged ? { ...merged, ...s } : { ...s };
    }
  }
  return merged;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATimelineItem',
  inheritAttrs: false,
  props: initDefaultProps(timelineItemProps(), {
    color: 'blue',
    pending: false,
  }),
  slots: Object as CustomSlotsType<{
    dot?: any;
    label?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('timeline', props);
    const { classNames: timelineClassNames, styles: timelineStyles } = useInjectTimeline();
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,
      [`${prefixCls.value}-item-pending`]: props.pending,
    }));

    const customColor = computed(() =>
      /^(blue|red|green|gray)$/.test(props.color || 'blue') ? undefined : props.color || 'blue',
    );
    const dotClassName = computed(() => ({
      [`${prefixCls.value}-item-head`]: true,
      [`${prefixCls.value}-item-head-${props.color || 'blue'}`]: !customColor.value,
    }));
    return () => {
      const pre = prefixCls.value;
      const rawLabel = props.title ?? props.label ?? slots.label?.();
      const label = Array.isArray(rawLabel) ? filterEmpty(rawLabel) : rawLabel;
      const hasLabel = Array.isArray(label)
        ? label.length > 0
        : label !== undefined && label !== null && label !== false && label !== '';

      const rawDot = props.icon ?? props.dot ?? slots.dot?.();
      const dot = Array.isArray(rawDot) ? filterEmpty(rawDot) : rawDot;
      const hasDot = Array.isArray(dot)
        ? dot.length > 0
        : dot !== undefined && dot !== null && dot !== false && dot !== '';

      const content = props.content ?? slots.default?.();

      const tCls = timelineClassNames.value;
      const tSty = timelineStyles.value;
      const iCls = props.classNames;
      const iSty = props.styles;

      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;

      const mergedRootClass = classNames(itemClassName.value, tCls.item, iCls?.root, attrClass);
      const mergedRootStyleObj = mergeOptionalStyle(tSty.item, iSty?.root);
      const mergedRootStyle = mergedRootStyleObj
        ? attrStyle
          ? [mergedRootStyleObj, attrStyle]
          : mergedRootStyleObj
        : (attrStyle as any);

      const mergedWrapperClass = classNames(`${pre}-item-wrapper`, tCls.itemWrapper, iCls?.wrapper);
      const mergedWrapperStyle = mergeOptionalStyle(tSty.itemWrapper, iSty?.wrapper);

      const mergedHeaderClass = classNames(`${pre}-item-header`, tCls.itemHeader, iCls?.header);
      const mergedHeaderStyle = mergeOptionalStyle(tSty.itemHeader, iSty?.header);

      const mergedTitleClass = classNames(
        `${pre}-item-label`,
        `${pre}-item-title`,
        tCls.itemTitle,
        iCls?.title,
      );
      const mergedTitleStyle = mergeOptionalStyle(tSty.itemTitle, iSty?.title);

      const mergedRailClass = classNames(
        `${pre}-item-tail`,
        `${pre}-item-rail`,
        tCls.itemRail,
        iCls?.rail,
      );
      const mergedRailStyle = mergeOptionalStyle(tSty.itemRail, iSty?.rail);

      const mergedIconClass = classNames(
        dotClassName.value,
        `${pre}-item-icon`,
        hasDot && `${pre}-item-head-custom`,
        tCls.itemIcon,
        iCls?.icon,
      );
      const baseIconColorStyle = customColor.value
        ? { borderColor: customColor.value, color: customColor.value }
        : undefined;
      const mergedIconStyle = mergeOptionalStyle(baseIconColorStyle, tSty.itemIcon, iSty?.icon);

      const mergedSectionClass = classNames(`${pre}-item-section`, tCls.itemSection, iCls?.section);
      const mergedSectionStyle = mergeOptionalStyle(tSty.itemSection, iSty?.section);

      const mergedContentClass = classNames(`${pre}-item-content`, tCls.itemContent, iCls?.content);
      const mergedContentStyle = mergeOptionalStyle(tSty.itemContent, iSty?.content);

      return (
        <li {...restAttrs} class={mergedRootClass} style={mergedRootStyle}>
          <div class={mergedWrapperClass} style={mergedWrapperStyle}>
            <div class={mergedIconClass} style={mergedIconStyle}>
              {hasDot ? dot : null}
            </div>
            <div class={mergedSectionClass} style={mergedSectionStyle}>
              <div class={mergedHeaderClass} style={mergedHeaderStyle}>
                {hasLabel && (
                  <div class={mergedTitleClass} style={mergedTitleStyle}>
                    {label}
                  </div>
                )}
              </div>
              <div class={mergedContentClass} style={mergedContentStyle}>
                {content}
              </div>
            </div>
          </div>
          <div class={mergedRailClass} style={mergedRailStyle} />
        </li>
      );
    };
  },
});
