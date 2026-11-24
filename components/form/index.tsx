import type { App, Plugin } from 'vue';
import Form, { formProps } from './Form';
import FormItem, { formItemProps } from './FormItem';
import useForm from './useForm';
import FormItemRest, { useInjectFormItemContext } from './FormItemContext';
export type { Rule, RuleObject, ScrollFocusOptions, FormLabelAlign } from './interface';

export type {
  FormProps,
  FormInstance,
  FormLayout,
  FormItemLayout,
  FormSemanticName,
  FormClassNamesType,
  FormStylesType,
  RequiredMark,
} from './Form';
export type { FormItemProps, FormItemInstance, ValidateStatus } from './FormItem';
export type { FormTooltipProps, FormItemTooltipType } from './FormItemLabel';
export type { FeedbackIcons } from './FormItemContext';

Form.useInjectFormItemContext = useInjectFormItemContext;
Form.ItemRest = FormItemRest;
/* istanbul ignore next */
Form.install = function (app: App) {
  app.component(Form.name, Form);
  app.component(Form.Item.name, Form.Item);
  app.component(FormItemRest.name, FormItemRest);
  return app;
};

export { FormItem, formItemProps, formProps, FormItemRest, useForm, useInjectFormItemContext };

export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
    readonly ItemRest: typeof FormItemRest;
    readonly useForm: typeof useForm;
    readonly useInjectFormItemContext: typeof useInjectFormItemContext;
  };
