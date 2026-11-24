import type { ColProps } from '../grid/Col';
import Col from '../grid/Col';
import type { FormLabelAlign } from './interface';
import { useInjectForm } from './context';
import type { RequiredMark } from './Form';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import type { FunctionalComponent, HTMLAttributes } from 'vue';
import { h, isVNode } from 'vue';
import Tooltip from '../tooltip';
import type { TooltipProps } from '../tooltip';
import QuestionCircleOutlined from '@ant-design/icons-vue/QuestionCircleOutlined';

export type FormTooltipProps = TooltipProps & {
  icon?: VueNode;
};

export type FormItemTooltipType = FormTooltipProps | VueNode;

export interface FormItemLabelProps {
  colon?: boolean;
  htmlFor?: string;
  label?: VueNode;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps & HTMLAttributes;
  requiredMark?: RequiredMark;
  required?: boolean;
  prefixCls: string;
  onClick: Function;
  tooltip?: FormItemTooltipType;
  vertical?: boolean;
}

const FormItemLabel: FunctionalComponent<FormItemLabelProps> = (props, { slots, emit, attrs }) => {
  const { prefixCls, htmlFor, labelCol, labelAlign, colon, required, requiredMark, vertical } = {
    ...props,
    ...attrs,
  };
  const [formLocale] = useLocaleReceiver('Form');
  const label = props.label ?? slots.label?.();
  if (label === null || label === undefined || label === false || label === '') return null;
  const {
    vertical: contextVertical,
    labelAlign: contextLabelAlign,
    labelCol: contextLabelCol,
    labelWrap,
    colon: contextColon,
    tooltip: contextTooltip,
    classNames: contextClassNames,
    styles: contextStyles,
  } = useInjectForm();
  const isVertical = vertical !== undefined ? vertical : contextVertical.value;
  const mergedLabelCol: FormItemLabelProps['labelCol'] = labelCol || contextLabelCol?.value || {};

  const mergedLabelAlign: FormLabelAlign | undefined = labelAlign || contextLabelAlign?.value;
  const isStartAlign = mergedLabelAlign === 'left' || mergedLabelAlign === 'start';

  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    isStartAlign && `${labelClsBasic}-left`,
    isStartAlign && `${labelClsBasic}-start`,
    mergedLabelCol.class,
    {
      [`${labelClsBasic}-wrap`]: !!labelWrap?.value,
    },
  );

  let labelChildren: VueNode = label;
  // Keep label is original where there should have no colon
  const computedColon = colon === true || (contextColon?.value !== false && colon !== false);
  const haveColon = computedColon && !isVertical;
  // Remove duplicated user input colon
  if (haveColon && typeof label === 'string' && (label as string).trim() !== '') {
    labelChildren = (label as string).replace(/[:|：]\s*$/, '');
  }

  // Tooltip
  const rawTooltip = props.tooltip;
  if (rawTooltip || slots.tooltip) {
    let tooltipNode: VueNode;
    if (slots.tooltip) {
      tooltipNode = slots.tooltip({ class: `${prefixCls}-item-tooltip` });
    } else {
      const isObjTooltip =
        typeof rawTooltip === 'object' && rawTooltip !== null && !isVNode(rawTooltip);
      const tooltipObj: FormTooltipProps = isObjTooltip
        ? { ...contextTooltip?.value, ...(rawTooltip as FormTooltipProps) }
        : { ...contextTooltip?.value, title: rawTooltip };
      const { icon, ...restTooltipProps } = tooltipObj;
      let iconNode: VueNode;
      if (icon !== undefined) {
        if (isVNode(icon)) {
          iconNode = icon;
        } else if (
          typeof icon === 'function' ||
          (typeof icon === 'object' && icon !== null && ('render' in icon || 'setup' in icon))
        ) {
          iconNode = h(icon as any);
        } else {
          iconNode = icon;
        }
      } else {
        iconNode = <QuestionCircleOutlined />;
      }
      tooltipNode = (
        <span
          class={`${prefixCls}-item-tooltip`}
          onClick={(e: MouseEvent) => {
            e.preventDefault();
          }}
        >
          <Tooltip {...restTooltipProps}>{iconNode}</Tooltip>
        </span>
      );
    }

    labelChildren = (
      <>
        {labelChildren}
        {tooltipNode}
      </>
    );
  }

  // Required Mark
  const isOptionalMark = requiredMark === 'optional';
  const isRenderMark = typeof requiredMark === 'function';
  const hideRequiredMark = requiredMark === false;

  if (isRenderMark) {
    labelChildren = requiredMark(labelChildren, { required: !!required });
  } else if (isOptionalMark && !required) {
    labelChildren = (
      <>
        {labelChildren}
        <span class={`${prefixCls}-item-optional`}>
          {formLocale.value?.optional || defaultLocale.Form?.optional}
        </span>
      </>
    );
  }

  let markType: string | undefined;
  if (hideRequiredMark) {
    markType = 'hidden';
  } else if (isOptionalMark || isRenderMark) {
    markType = 'optional';
  }

  const labelClassName = classNames(contextClassNames?.value?.label, {
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-required-mark-${markType}`]: markType,
    [`${prefixCls}-item-no-colon`]: !computedColon,
  });
  return (
    <Col {...mergedLabelCol} class={labelColClassName}>
      <label
        for={htmlFor}
        class={labelClassName}
        style={contextStyles?.value?.label}
        title={typeof label === 'string' ? label : ''}
        onClick={e => emit('click', e)}
      >
        {labelChildren}
      </label>
    </Col>
  );
};

FormItemLabel.displayName = 'FormItemLabel';
FormItemLabel.inheritAttrs = false;

export default FormItemLabel;
