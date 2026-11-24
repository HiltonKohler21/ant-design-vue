import type {
  CSSProperties,
  ExtractPropTypes,
  HTMLAttributes,
  ComponentPublicInstance,
  PropType,
} from 'vue';
import { defineComponent, computed, watch, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import warning from '../_util/warning';
import type { FieldExpose } from './FormItem';
import FormItem from './FormItem';
import type { FormTooltipProps } from './FormItemLabel';
import { getNamePath, containsNamePath, cloneByNamePathList } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';
import isEqual from 'lodash-es/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { VueNode } from '../_util/type';
import {
  anyType,
  booleanType,
  functionType,
  objectType,
  someType,
  stringType,
} from '../_util/type';
import { useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks/useMergeSemantic';
import type { ColProps } from '../grid/Col';
import type {
  InternalNamePath,
  NamePath,
  RuleError,
  ValidateErrorEntity,
  ValidateOptions,
  Callbacks,
  ValidateMessages,
  Rule,
  FormLabelAlign,
  ScrollFocusOptions,
} from './interface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideForm, useProvideFormVariant } from './context';
import type { SizeType } from '../config-provider';
import type { Variant } from '../config-provider/context';
import useForm from './useForm';
import { useInjectGlobalForm } from '../config-provider/context';
import useStyle from './style';
import { useProviderSize } from '../config-provider/SizeContext';
import { useProvideFormFeedbackIcons } from './FormItemContext';
import type { FeedbackIcons } from './FormItemContext';
import { useProviderDisabled } from '../config-provider/DisabledContext';

export type RequiredMark =
  | boolean
  | 'optional'
  | ((labelNode: VueNode, info: { required: boolean }) => VueNode);
export type FormLayout = 'horizontal' | 'inline' | 'vertical';
export type FormItemLayout = 'horizontal' | 'vertical';
export type { ScrollFocusOptions };

export type FormSemanticName = 'root' | 'label' | 'content' | 'help' | 'helpItem' | 'extra';
export interface FormSemanticProps {
  layout?: FormLayout;
  size?: SizeType;
  disabled?: boolean;
  colon?: boolean;
  requiredMark?: RequiredMark;
  labelAlign?: FormLabelAlign;
  labelWrap?: boolean;
  variant?: Variant;
  [key: string]: any;
}
export type FormClassNamesType = SemanticClassNamesType<FormSemanticProps, FormSemanticName>;
export type FormStylesType = SemanticStylesType<FormSemanticProps, FormSemanticName>;

export const formProps = () => ({
  rootClassName: String,
  classNames: someType<FormClassNamesType>([Object, Function]),
  styles: someType<FormStylesType>([Object, Function]),
  layout: stringType<FormLayout>(),
  labelCol: objectType<ColProps & HTMLAttributes>(),
  wrapperCol: objectType<ColProps & HTMLAttributes>(),
  colon: booleanType(),
  labelAlign: stringType<FormLabelAlign>(),
  labelWrap: booleanType(),
  prefixCls: String,
  requiredMark: someType<RequiredMark | ''>([String, Boolean, Function]),
  /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
  hideRequiredMark: booleanType(),
  model: PropTypes.object,
  rules: objectType<{ [k: string]: Rule[] | Rule }>(),
  validateMessages: objectType<ValidateMessages>(),
  /** 自定义校验状态图标 */
  feedbackIcons: { type: Function as PropType<FeedbackIcons>, default: undefined },
  tooltip: objectType<FormTooltipProps>(),
  validateOnRuleChange: booleanType(),
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: anyType<boolean | ScrollFocusOptions>(),
  onSubmit: functionType<(e: Event) => void>(),
  name: String,
  validateTrigger: someType<string | string[]>([String, Array]),
  size: stringType<SizeType>(),
  disabled: booleanType(),
  variant: stringType<Variant>(),
  onValuesChange: functionType<Callbacks['onValuesChange']>(),
  onFieldsChange: functionType<Callbacks['onFieldsChange']>(),
  onFinish: functionType<Callbacks['onFinish']>(),
  onFinishFailed: functionType<Callbacks['onFinishFailed']>(),
  onValidate: functionType<Callbacks['onValidate']>(),
});

export type FormProps = Partial<ExtractPropTypes<ReturnType<typeof formProps>>>;

export type FormExpose = {
  resetFields: (name?: NamePath) => void;
  clearValidate: (name?: NamePath) => void;
  validateFields: (
    nameList?: NamePath[] | string | ValidateOptions,
    options?: ValidateOptions,
  ) => Promise<{
    [key: string]: any;
  }>;
  getFieldsValue: (nameList?: InternalNamePath[] | true) => {
    [key: string]: any;
  };
  getFieldInstance: (name: NamePath) => HTMLElement | null;
  validate: (
    nameList?: NamePath[] | string | ValidateOptions,
    options?: ValidateOptions,
  ) => Promise<{
    [key: string]: any;
  }>;
  scrollToField: (name: NamePath, options?: ScrollFocusOptions) => void;
};

export type FormInstance = ComponentPublicInstance<FormProps, FormExpose>;

function isEqualName(name1: NamePath, name2: NamePath) {
  return isEqual(toArray(name1), toArray(name2));
}

const Form = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AForm',
  inheritAttrs: false,
  props: initDefaultProps(formProps(), {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
  }),
  Item: FormItem,
  useForm,
  // emits: ['finishFailed', 'submit', 'finish', 'validate'],
  setup(props, { emit, slots, expose, attrs }) {
    const {
      prefixCls,
      direction,
      form: contextForm,
      size,
      disabled,
    } = useConfigInject('form', props);
    const requiredMark = computed<RequiredMark | undefined>(() =>
      props.requiredMark === '' ? true : props.requiredMark,
    );
    const mergedRequiredMark = computed<RequiredMark>(() => {
      if (requiredMark.value !== undefined) {
        return requiredMark.value;
      }

      if (contextForm && contextForm.value?.requiredMark !== undefined) {
        return contextForm.value.requiredMark;
      }

      if (props.hideRequiredMark) {
        return false;
      }
      return true;
    });
    useProviderSize(size);
    useProviderDisabled(disabled);
    useProvideFormFeedbackIcons(computed(() => props.feedbackIcons));
    const mergedVariant = computed(() => props.variant ?? contextForm?.value?.variant);
    useProvideFormVariant(mergedVariant);
    const mergedColon = computed(() => props.colon ?? contextForm?.value?.colon);
    const mergedLabelAlign = computed<FormLabelAlign | undefined>(
      () => props.labelAlign ?? (contextForm?.value?.labelAlign as FormLabelAlign | undefined),
    );
    const mergedLabelWrap = computed<boolean | undefined>(
      () => props.labelWrap ?? contextForm?.value?.labelWrap,
    );
    const mergedTooltip = computed<FormTooltipProps | undefined>(() => {
      if (!contextForm?.value?.tooltip && !props.tooltip) {
        return undefined;
      }
      return {
        ...contextForm?.value?.tooltip,
        ...props.tooltip,
      };
    });
    const { validateMessages: globalValidateMessages } = useInjectGlobalForm();
    const validateMessages = computed(() => {
      return {
        ...defaultValidateMessages,
        ...globalValidateMessages.value,
        ...props.validateMessages,
      };
    });

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // Semantic classNames & styles
    const mergedProps = computed<FormProps>(() => ({
      ...props,
      size: size.value,
      disabled: disabled.value,
      layout: props.layout,
      colon: mergedColon.value,
      requiredMark: mergedRequiredMark.value,
      labelAlign: mergedLabelAlign.value,
      labelWrap: mergedLabelWrap.value,
      variant: mergedVariant.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      Partial<Record<FormSemanticName, string>>,
      Partial<Record<FormSemanticName, CSSProperties>>,
      FormProps
    >(
      () => [contextForm?.value?.classNames, props.classNames],
      () => [
        contextForm?.value?.styles,
        contextForm?.value?.style ? { root: contextForm.value.style } : undefined,
        props.styles,
      ],
      () => ({ props: mergedProps.value }),
    );

    const formClassName = computed(() =>
      classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-${props.layout}`]: true,
          [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${size.value}`]: size.value,
        },
        contextForm?.value?.className,
        props.rootClassName,
        mergedClassNames.value.root,
        hashId.value,
      ),
    );
    const lastValidatePromise = ref();
    const fields: Record<string, FieldExpose> = {};
    const addField = (eventKey: string, field: FieldExpose) => {
      fields[eventKey] = field;
    };
    const removeField = (eventKey: string) => {
      delete fields[eventKey];
    };

    const getFieldsByNameList = (nameList?: NamePath | NamePath[]) => {
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];
      if (!provideNameList) {
        return Object.values(fields);
      } else {
        return Object.values(fields).filter(
          field =>
            namePathList.findIndex(namePath => isEqualName(namePath, field.fieldName.value)) > -1,
        );
      }
    };
    const resetFields = (name?: NamePath | NamePath[]) => {
      if (!props.model) {
        warning(false, 'Form', 'model is required for resetFields to work.');
        return;
      }
      getFieldsByNameList(name).forEach(field => {
        field.resetField();
      });
    };
    const clearValidate = (name?: NamePath | NamePath[]) => {
      getFieldsByNameList(name).forEach(field => {
        field.clearValidate();
      });
    };
    const handleFinishFailed = (errorInfo: ValidateErrorEntity) => {
      const mergedScrollToFirstError =
        props.scrollToFirstError !== undefined
          ? props.scrollToFirstError
          : contextForm?.value?.scrollToFirstError;
      emit('finishFailed', errorInfo);
      if (mergedScrollToFirstError && errorInfo.errorFields.length) {
        let scrollToFieldOptions: ScrollFocusOptions = {};
        if (typeof mergedScrollToFirstError === 'object') {
          scrollToFieldOptions = mergedScrollToFirstError;
        }
        scrollToField(errorInfo.errorFields[0].name, scrollToFieldOptions);
      }
    };
    const validate = (...args: any[]) => {
      return validateField(...args);
    };
    const getFieldInstance = (name?: NamePath) => {
      const targetFields = getFieldsByNameList(name !== undefined ? [name] : undefined);
      if (targetFields.length) {
        const fieldId = targetFields[0].fieldId.value;
        return fieldId ? document.getElementById(fieldId) : null;
      }
      return null;
    };
    const scrollToField = (name?: NamePath, options: ScrollFocusOptions = {}) => {
      const { focus, ...restOptions } = options || {};
      const targetFields = getFieldsByNameList(name !== undefined ? [name] : undefined);
      if (targetFields.length) {
        const fieldId = targetFields[0].fieldId.value;
        const node = fieldId ? document.getElementById(fieldId) : null;

        if (node) {
          scrollIntoView(node, {
            scrollMode: 'if-needed',
            block: 'nearest',
            ...restOptions,
          });
          if (focus && typeof (node as HTMLElement).focus === 'function') {
            (node as HTMLElement).focus();
          }
        }
      }
    };
    // eslint-disable-next-line no-unused-vars
    const getFieldsValue = (nameList: InternalNamePath[] | true = true) => {
      if (nameList === true) {
        const allNameList = [];
        Object.values(fields).forEach(({ namePath }) => {
          allNameList.push(namePath.value);
        });
        return cloneByNamePathList(props.model, allNameList);
      } else {
        return cloneByNamePathList(props.model, nameList);
      }
    };
    const validateFields = (
      nameList?: NamePath[] | string | ValidateOptions,
      options?: ValidateOptions,
    ) => {
      warning(
        !(nameList instanceof Function),
        'Form',
        'validateFields/validateField/validate not support callback, please use promise instead',
      );
      if (!props.model) {
        warning(false, 'Form', 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      let actualNameList: NamePath[] | string | undefined = nameList as any;
      let actualOptions: ValidateOptions | undefined = options;
      if (nameList && !Array.isArray(nameList) && typeof nameList === 'object') {
        actualOptions = nameList as ValidateOptions;
        actualNameList = undefined;
      }
      const isValidateOnly = !!actualOptions?.validateOnly;
      const provideNameList = !!actualNameList;
      const namePathList: InternalNamePath[] = provideNameList
        ? toArray(actualNameList).map(getNamePath)
        : [];

      // Collect result in promise list
      const promiseList: Promise<{
        name: InternalNamePath;
        errors: string[];
      }>[] = [];

      Object.values(fields).forEach(field => {
        // Add field if not provide `nameList`
        if (!provideNameList) {
          namePathList.push(field.namePath.value);
        }

        // Skip if without rule
        if (!field.rules?.value.length) {
          return;
        }

        const fieldNamePath = field.namePath.value;

        // Add field validate rule in to promise list
        if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
          const promise = field.validateRules({
            validateMessages: validateMessages.value,
            ...actualOptions,
          });

          // Wrap promise with field
          promiseList.push(
            promise
              .then<any, RuleError>(() => ({ name: fieldNamePath, errors: [], warnings: [] }))
              .catch((ruleErrors: RuleError[]) => {
                const mergedErrors: string[] = [];
                const mergedWarnings: string[] = [];

                ruleErrors.forEach(({ rule: { warningOnly }, errors }) => {
                  if (warningOnly) {
                    mergedWarnings.push(...errors);
                  } else {
                    mergedErrors.push(...errors);
                  }
                });

                if (mergedErrors.length) {
                  return Promise.reject({
                    name: fieldNamePath,
                    errors: mergedErrors,
                    warnings: mergedWarnings,
                  });
                }

                return {
                  name: fieldNamePath,
                  errors: mergedErrors,
                  warnings: mergedWarnings,
                };
              }),
          );
        }
      });

      const summaryPromise = allPromiseFinish(promiseList);
      if (!isValidateOnly) {
        lastValidatePromise.value = summaryPromise;
      }

      const returnPromise = summaryPromise
        .then(() => {
          if (isValidateOnly || lastValidatePromise.value === summaryPromise) {
            return Promise.resolve(getFieldsValue(namePathList));
          }
          return Promise.reject([]);
        })
        .catch(results => {
          const errorList = results.filter(result => result && result.errors.length);
          return Promise.reject({
            values: getFieldsValue(namePathList),
            errorFields: errorList,
            outOfDate: !isValidateOnly && lastValidatePromise.value !== summaryPromise,
          });
        });

      // Do not throw in console
      returnPromise.catch(e => e);

      return returnPromise;
    };
    const validateField = (...args: any[]) => {
      return validateFields(...args);
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      emit('submit', e);
      if (props.model) {
        const res = validateFields();
        res
          .then(values => {
            emit('finish', values);
          })
          .catch(errors => {
            handleFinishFailed(errors);
          });
      }
    };
    expose({
      resetFields,
      clearValidate,
      validateFields,
      getFieldsValue,
      getFieldInstance,
      validate,
      scrollToField,
    } as FormExpose);

    useProvideForm({
      model: computed(() => props.model),
      name: computed(() => props.name),
      labelAlign: mergedLabelAlign,
      labelCol: computed(() => props.labelCol),
      labelWrap: mergedLabelWrap,
      wrapperCol: computed(() => props.wrapperCol),
      layout: computed(() => props.layout),
      vertical: computed(() => props.layout === 'vertical'),
      colon: mergedColon,
      requiredMark: mergedRequiredMark,
      tooltip: mergedTooltip,
      classNames: mergedClassNames,
      styles: mergedStyles,
      validateTrigger: computed(() => props.validateTrigger),
      rules: computed(() => props.rules),
      addField,
      removeField,
      onValidate: (name, status, errors) => {
        emit('validate', name, status, errors);
      },
      validateMessages,
    });

    watch(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          validateFields();
        }
      },
    );

    return () => {
      return wrapSSR(
        <form
          {...attrs}
          onSubmit={handleSubmit}
          class={[formClassName.value, attrs.class]}
          style={[mergedStyles.value.root, attrs.style as CSSProperties]}
        >
          {slots.default?.()}
        </form>,
      );
    };
  },
});

export default Form as typeof Form & {
  readonly Item: typeof FormItem;
  readonly useForm: typeof useForm;
};
