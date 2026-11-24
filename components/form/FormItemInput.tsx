import type { ColProps } from '../grid/Col';
import Col from '../grid/Col';
import { useProvideForm, useInjectForm, useProvideFormItemPrefix } from './context';
import ErrorList from './ErrorList';
import classNames from '../_util/classNames';
import type { ValidateStatus } from './FormItem';
import type { CustomSlotsType, VueNode } from '../_util/type';
import type { HTMLAttributes } from 'vue';
import { computed, defineComponent } from 'vue';
import { filterEmpty } from '../_util/props-util';

export interface FormItemInputMiscProps {
  prefixCls: string;
  errors: VueNode[];
  warnings?: VueNode[];
  hasFeedback?: boolean;
  validateStatus?: ValidateStatus;
}

export interface FormItemInputProps {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  help?: VueNode;
  extra?: VueNode;
  status?: ValidateStatus;
  label?: VueNode;
}

const GRID_MAX = 24;
const RESPONSIVE_SIZES = [undefined, 'xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

const FormItemInput = defineComponent({
  compatConfig: { MODE: 3 },
  slots: Object as CustomSlotsType<{
    help: any;
    errors: any;
    extra: any;
    default: any;
  }>,
  inheritAttrs: false,
  props: [
    'prefixCls',
    'errors',
    'warnings',
    'hasFeedback',
    'onDomErrorVisibleChange',
    'labelCol',
    'wrapperCol',
    'help',
    'extra',
    'status',
    'marginBottom',
    'onErrorVisibleChanged',
    'label',
  ],
  setup(props, { slots }) {
    const formContext = useInjectForm();
    const {
      wrapperCol: contextWrapperCol,
      labelCol: contextLabelCol,
      classNames: contextClassNames,
      styles: contextStyles,
    } = formContext;

    // Pass to sub FormItem should not with col info
    const subFormContext = { ...formContext };
    delete subFormContext.labelCol;
    delete subFormContext.wrapperCol;
    useProvideForm(subFormContext);
    useProvideFormItemPrefix({
      prefixCls: computed(() => props.prefixCls),
      status: computed(() => props.status),
    });

    return () => {
      const {
        prefixCls,
        labelCol,
        wrapperCol,
        marginBottom,
        onErrorVisibleChanged,
        help = slots.help?.(),
        errors = filterEmpty(slots.errors?.()),
        warnings = [],
        extra = slots.extra?.(),
        label,
      } = props;
      const baseClassName = `${prefixCls}-item`;

      const mergedWrapperCol: ColProps & HTMLAttributes = {
        ...(wrapperCol || contextWrapperCol?.value || {}),
      };

      if (label === null && !labelCol && !wrapperCol && contextLabelCol?.value) {
        const formLabelColVal = contextLabelCol.value as Record<string, any>;
        RESPONSIVE_SIZES.forEach(size => {
          const formLabelObj = size
            ? isPlainObject(formLabelColVal[size])
              ? formLabelColVal[size]
              : {}
            : formLabelColVal;
          const wrapperObj = size
            ? isPlainObject((mergedWrapperCol as Record<string, any>)[size])
              ? { ...(mergedWrapperCol as Record<string, any>)[size] }
              : {}
            : mergedWrapperCol;

          if (
            'span' in formLabelObj &&
            !('offset' in wrapperObj) &&
            typeof formLabelObj.span === 'number' &&
            formLabelObj.span < GRID_MAX
          ) {
            if (size) {
              (mergedWrapperCol as Record<string, any>)[size] = {
                ...wrapperObj,
                offset: formLabelObj.span,
              };
            } else {
              mergedWrapperCol.offset = formLabelObj.span;
            }
          }
        });
      }

      const className = classNames(`${baseClassName}-control`, mergedWrapperCol.class);

      return (
        <Col
          {...mergedWrapperCol}
          class={className}
          v-slots={{
            default: () => (
              <>
                <div class={`${baseClassName}-control-input`}>
                  <div
                    class={classNames(
                      `${baseClassName}-control-input-content`,
                      contextClassNames?.value?.content,
                    )}
                    style={contextStyles?.value?.content}
                  >
                    {slots.default?.()}
                  </div>
                </div>
                {marginBottom !== null || errors.length || warnings.length ? (
                  <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <ErrorList
                      errors={errors}
                      warnings={warnings}
                      help={help}
                      class={`${baseClassName}-explain-connected`}
                      onErrorVisibleChanged={onErrorVisibleChanged}
                    />
                    {!!marginBottom && <div style={{ width: 0, height: `${marginBottom}px` }} />}
                  </div>
                ) : null}
                {extra ? (
                  <div
                    class={classNames(`${baseClassName}-extra`, contextClassNames?.value?.extra)}
                    style={contextStyles?.value?.extra}
                  >
                    {extra}
                  </div>
                ) : null}
              </>
            ),
          }}
        ></Col>
      );
    };
  },
});

export default FormItemInput;
