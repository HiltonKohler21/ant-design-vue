import type { VNodeTypes, HTMLAttributes, FunctionalComponent, CSSProperties } from 'vue';
import { inject, ref } from 'vue';
import { descriptionsContext } from './index';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
import classNames from '../_util/classNames';

function notEmpty(val: any) {
  return val !== undefined && val !== null;
}

const mergeStyleObjects = (...styles: (CSSProperties | undefined)[]): CSSProperties | undefined => {
  const merged = Object.assign({}, ...styles.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
};

interface CellProps extends HTMLAttributes {
  itemPrefixCls: string;
  span: number;
  component: string;
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  classNames?: SemanticNames<'label' | 'content'>;
  styles?: SemanticStylesMap<'label' | 'content'>;
  bordered?: boolean;
  label?: number | VNodeTypes;
  content?: number | VNodeTypes;
  colon?: boolean;
}

const Cell: FunctionalComponent<CellProps> = props => {
  const {
    itemPrefixCls,
    component,
    span,
    labelStyle,
    contentStyle,
    classNames: cellClassNames,
    styles: cellStyles,
    bordered,
    label,
    content,
    colon,
  } = props;
  const Component = component as any;
  const { classNames: contextClassNames, styles: contextStyles } = inject(descriptionsContext, {
    classNames: ref(undefined),
    styles: ref(undefined),
  });

  const mergedLabelClassName =
    classNames(contextClassNames?.value?.label, cellClassNames?.label) || undefined;
  const mergedContentClassName =
    classNames(contextClassNames?.value?.content, cellClassNames?.content) || undefined;

  const mergedLabelStyle = mergeStyleObjects(
    contextStyles?.value?.label,
    labelStyle,
    cellStyles?.label,
  );
  const mergedContentStyle = mergeStyleObjects(
    contextStyles?.value?.content,
    contentStyle,
    cellStyles?.content,
  );

  if (bordered) {
    const borderedCellStyle = notEmpty(label)
      ? mergeStyleObjects(contextStyles?.value?.label, cellStyles?.label)
      : notEmpty(content)
      ? mergeStyleObjects(contextStyles?.value?.content, cellStyles?.content)
      : undefined;
    return (
      <Component
        class={[
          {
            [`${itemPrefixCls}-item-label`]: notEmpty(label),
            [`${itemPrefixCls}-item-content`]: notEmpty(content),
          },
          notEmpty(label) ? mergedLabelClassName : undefined,
          notEmpty(content) ? mergedContentClassName : undefined,
        ]}
        style={borderedCellStyle}
        colSpan={span}
      >
        {notEmpty(label) && <span style={labelStyle}>{label}</span>}
        {notEmpty(content) && <span style={contentStyle}>{content}</span>}
      </Component>
    );
  }

  return (
    <Component class={[`${itemPrefixCls}-item`]} colSpan={span}>
      <div class={`${itemPrefixCls}-item-container`}>
        {(label || label === 0) && (
          <span
            class={[
              `${itemPrefixCls}-item-label`,
              mergedLabelClassName,
              {
                [`${itemPrefixCls}-item-no-colon`]: !colon,
              },
            ]}
            style={mergedLabelStyle}
          >
            {label}
          </span>
        )}
        {(content || content === 0) && (
          <span
            class={[`${itemPrefixCls}-item-content`, mergedContentClassName]}
            style={mergedContentStyle}
          >
            {content}
          </span>
        )}
      </div>
    </Component>
  );
};

export default Cell;
