import Cell from './Cell';
import { getSlot, getClass, getStyle } from '../_util/props-util';
import type { CSSProperties, FunctionalComponent, VNode } from 'vue';
import { inject, ref } from 'vue';
import { descriptionsContext } from './index';
import type { DescriptionsSemanticName, SemanticNames, SemanticStylesMap } from '../_util/semantic';
import classNames from '../_util/classNames';

interface CellConfig {
  component: string | [string, string];
  type: 'label' | 'content' | 'item';
  showLabel?: boolean;
  showContent?: boolean;
}

export interface RowProps {
  prefixCls: string;
  vertical: boolean;
  row: any[];
  bordered: boolean;
  colon: boolean;
  index: number;
}

const mergeStyleObjects = (...styles: (CSSProperties | undefined)[]): CSSProperties | undefined => {
  const merged = Object.assign({}, ...styles.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
};

const Row: FunctionalComponent<RowProps> = props => {
  const renderCells = (
    items: VNode[],
    { colon, prefixCls, bordered },
    {
      component,
      type,
      showLabel,
      showContent,
      labelStyle: rootLabelStyle,
      contentStyle: rootContentStyle,
      classNames: rootClassNames,
      styles: rootStyles,
    }: CellConfig & {
      labelStyle?: CSSProperties;
      contentStyle?: CSSProperties;
      classNames?: SemanticNames<DescriptionsSemanticName>;
      styles?: SemanticStylesMap<DescriptionsSemanticName>;
    },
  ) => {
    return items.map((item, index) => {
      const itemProps = item.props || {};
      const {
        prefixCls: itemPrefixCls = prefixCls,
        span = 1,
        labelStyle = itemProps['label-style'],
        contentStyle = itemProps['content-style'],
        label = (item.children as any)?.label?.(),
        classNames: itemClassNames = itemProps['class-names'],
        styles: itemStyles,
      } = itemProps;
      const children = getSlot(item);
      const className = getClass(item);
      const style = getStyle(item);
      const { key } = item;

      const mergedLabelStyle = mergeStyleObjects(
        rootLabelStyle,
        rootStyles?.label,
        labelStyle,
        itemStyles?.label,
      );
      const mergedContentStyle = mergeStyleObjects(
        rootContentStyle,
        rootStyles?.content,
        contentStyle,
        itemStyles?.content,
      );
      const mergedCellClassNames = {
        label: classNames(rootClassNames?.label, itemClassNames?.label) || undefined,
        content: classNames(rootClassNames?.content, itemClassNames?.content) || undefined,
      };

      if (typeof component === 'string') {
        const borderedCellStyle = bordered
          ? type === 'label'
            ? mergeStyleObjects(
                rootLabelStyle,
                rootStyles?.label,
                style,
                labelStyle,
                itemStyles?.label,
              )
            : type === 'content'
            ? mergeStyleObjects(
                rootContentStyle,
                rootStyles?.content,
                style,
                contentStyle,
                itemStyles?.content,
              )
            : style
          : style;
        return (
          <Cell
            key={`${type}-${String(key) || index}`}
            class={className}
            style={borderedCellStyle}
            labelStyle={bordered ? undefined : mergedLabelStyle}
            contentStyle={bordered ? undefined : mergedContentStyle}
            classNames={mergedCellClassNames}
            styles={itemStyles}
            span={span}
            colon={colon}
            component={component}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={showLabel ? label : null}
            content={showContent ? children : null}
          />
        );
      }

      return [
        <Cell
          key={`label-${String(key) || index}`}
          class={className}
          style={mergeStyleObjects(
            rootLabelStyle,
            rootStyles?.label,
            style,
            labelStyle,
            itemStyles?.label,
          )}
          classNames={mergedCellClassNames}
          styles={itemStyles}
          span={1}
          colon={colon}
          component={component[0]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={label}
        />,
        <Cell
          key={`content-${String(key) || index}`}
          class={className}
          style={mergeStyleObjects(
            rootContentStyle,
            rootStyles?.content,
            style,
            contentStyle,
            itemStyles?.content,
          )}
          classNames={mergedCellClassNames}
          styles={itemStyles}
          span={span * 2 - 1}
          component={component[1]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          content={children}
        />,
      ];
    });
  };

  const { prefixCls, vertical, row, index, bordered } = props;
  const {
    labelStyle,
    contentStyle,
    classNames: contextClassNames,
    styles: contextStyles,
  } = inject(descriptionsContext, {
    labelStyle: ref({}),
    contentStyle: ref({}),
    classNames: ref(undefined),
    styles: ref(undefined),
  });
  if (vertical) {
    return (
      <>
        <tr key={`label-${index}`} class={`${prefixCls}-row`}>
          {renderCells(row, props, {
            component: 'th',
            type: 'label',
            showLabel: true,
            labelStyle: labelStyle?.value,
            contentStyle: contentStyle?.value,
            classNames: contextClassNames?.value,
            styles: contextStyles?.value,
          })}
        </tr>
        <tr key={`content-${index}`} class={`${prefixCls}-row`}>
          {renderCells(row, props, {
            component: 'td',
            type: 'content',
            showContent: true,
            labelStyle: labelStyle?.value,
            contentStyle: contentStyle?.value,
            classNames: contextClassNames?.value,
            styles: contextStyles?.value,
          })}
        </tr>
      </>
    );
  }

  return (
    <tr key={index} class={`${prefixCls}-row`}>
      {renderCells(row, props, {
        component: bordered ? ['th', 'td'] : 'td',
        type: 'item',
        showLabel: true,
        showContent: true,
        labelStyle: labelStyle?.value,
        contentStyle: contentStyle?.value,
        classNames: contextClassNames?.value,
        styles: contextStyles?.value,
      })}
    </tr>
  );
};

export default Row;
