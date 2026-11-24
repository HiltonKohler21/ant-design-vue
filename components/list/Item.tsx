import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import {
  isStringElement,
  isEmptyElement,
  flattenChildren,
  isValidElement,
} from '../_util/props-util';
import { Col } from '../grid';
import { cloneElement } from '../_util/vnode';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, inject, ref } from 'vue';
import ItemMeta from './ItemMeta';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { ListContextKey } from './contextKey';
import type { ListGridType } from '.';
import type { CustomSlotsType } from '../_util/type';

export type ListItemSemanticName = 'actions' | 'extra';
export type ListItemSemanticClassNames = SemanticClassNames<ListItemSemanticName>;
export type ListItemSemanticStyles = SemanticStyles<ListItemSemanticName>;
export type ListItemClassNamesType =
  | ListItemSemanticClassNames
  | ((info: { props: ListItemProps }) => ListItemSemanticClassNames);
export type ListItemStylesType =
  | ListItemSemanticStyles
  | ((info: { props: ListItemProps }) => ListItemSemanticStyles);

export const listItemProps = () => ({
  prefixCls: String,
  extra: PropTypes.any,
  actions: PropTypes.array,
  /** 语义化 classNames（支持对象或函数）：actions / extra */
  classNames: {
    type: [Object, Function] as PropType<ListItemClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（支持对象或函数）：actions / extra */
  styles: {
    type: [Object, Function] as PropType<ListItemStylesType>,
    default: undefined,
  },
  grid: Object as PropType<ListGridType>,
  colStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
});

export type ListItemProps = Partial<ExtractPropTypes<ReturnType<typeof listItemProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AListItem',
  inheritAttrs: false,
  Meta: ItemMeta,
  props: listItemProps(),
  slots: Object as CustomSlotsType<{
    actions: any;
    extra: any;
    default: any;
  }>,
  setup(props, { slots, attrs }) {
    const { itemLayout, grid } = inject(ListContextKey, {
      grid: ref(),
      itemLayout: ref(),
    });
    const { prefixCls, configProvider } = useConfigInject('list', props);

    const mergedPropsForSemantic = computed<ListItemProps>(() => ({
      ...props,
      grid: props.grid ?? grid.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ListItemSemanticClassNames,
      ListItemSemanticStyles,
      ListItemProps
    >(
      () => [
        (configProvider.list?.value as any)?.classNames,
        (configProvider.list?.value as any)?.item?.classNames,
        props.classNames,
      ],
      () => [
        (configProvider.list?.value as any)?.styles,
        (configProvider.list?.value as any)?.item?.styles,
        props.styles,
      ],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const moduleClass = (moduleName: ListItemSemanticName) => mergedClassNames.value[moduleName];

    const moduleStyle = (moduleName: ListItemSemanticName): CSSProperties | undefined => {
      const styleObj = mergedStyles.value[moduleName];
      return styleObj && Object.keys(styleObj).length > 0 ? styleObj : undefined;
    };

    const isItemContainsTextNodeAndNotSingular = () => {
      const children = slots.default?.() || [];
      let result;
      children.forEach(element => {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    };

    const isFlexMode = () => {
      const extra = props.extra ?? slots.extra?.();
      if (itemLayout.value === 'vertical') {
        return !!extra;
      }
      return !isItemContainsTextNodeAndNotSingular();
    };

    return () => {
      const { class: className, ...restAttrs } = attrs;
      const pre = prefixCls.value;
      const extra = props.extra ?? slots.extra?.();
      const children = slots.default?.();
      let actions = props.actions ?? flattenChildren(slots.actions?.());
      actions = actions && !Array.isArray(actions) ? [actions] : actions;
      const actionsCls = moduleClass('actions') || undefined;
      const actionsStyle = moduleStyle('actions');
      const extraCls = moduleClass('extra') || undefined;
      const extraStyle = moduleStyle('extra');

      const actionsContent = actions && actions.length > 0 && (
        <ul class={[`${pre}-item-action`, actionsCls]} style={actionsStyle} key="actions">
          {actions.map((action, i) => (
            <li key={`${pre}-item-action-${i}`}>
              {action}
              {i !== actions.length - 1 && <em class={`${pre}-item-action-split`} />}
            </li>
          ))}
        </ul>
      );
      const horizontalExtra =
        extra && (extraCls || extraStyle) ? (
          isValidElement(extra) || (Array.isArray(extra) && extra.length > 0) ? (
            cloneElement(
              extra,
              {
                key: 'extra',
                ...(extraCls ? { class: extraCls } : {}),
                ...(extraStyle ? { style: extraStyle } : {}),
              },
              false,
            )
          ) : (
            <div class={[`${pre}-item-extra`, extraCls]} style={extraStyle} key="extra">
              {extra}
            </div>
          )
        ) : (
          cloneElement(extra, { key: 'extra' })
        );
      const Element = grid.value ? 'div' : 'li';
      const itemChildren = (
        <Element
          {...(restAttrs as any)} // `li` element `onCopy` prop args is not same as `div`
          class={classNames(
            `${pre}-item`,
            {
              [`${pre}-item-no-flex`]: !isFlexMode(),
            },
            className,
          )}
        >
          {itemLayout.value === 'vertical' && extra
            ? [
                <div class={`${pre}-item-main`} key="content">
                  {children}
                  {actionsContent}
                </div>,
                <div class={[`${pre}-item-extra`, extraCls]} style={extraStyle} key="extra">
                  {extra}
                </div>,
              ]
            : [children, actionsContent, horizontalExtra]}
        </Element>
      );
      return grid.value ? (
        <Col flex={1} style={props.colStyle}>
          {itemChildren}
        </Col>
      ) : (
        itemChildren
      );
    };
  },
});
