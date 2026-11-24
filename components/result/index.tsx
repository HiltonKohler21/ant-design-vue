import type { App, CSSProperties, VNodeTypes, Plugin, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import WarningFilled from '@ant-design/icons-vue/WarningFilled';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { CustomSlotsType } from '../_util/type';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

import useStyle from './style';

export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
};

export const ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized,
};

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500';
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;

export type ResultSemanticName = 'root' | 'title' | 'subTitle' | 'body' | 'extra' | 'icon';
export type ResultSemanticClassNames = SemanticClassNames<ResultSemanticName>;
export type ResultSemanticStyles = SemanticStyles<ResultSemanticName>;
export type ResultClassNamesType =
  | ResultSemanticClassNames
  | ((info: { props: ResultProps }) => ResultSemanticClassNames);
export type ResultStylesType =
  | ResultSemanticStyles
  | ((info: { props: ResultProps }) => ResultSemanticStyles);

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);

export const resultProps = () => ({
  prefixCls: String,
  rootClassName: String,
  icon: PropTypes.any,
  status: { type: [Number, String] as PropType<ResultStatusType>, default: 'info' },
  title: PropTypes.any,
  subTitle: PropTypes.any,
  extra: PropTypes.any,
  classNames: {
    type: [Object, Function] as PropType<ResultClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<ResultStylesType>,
    default: undefined,
  },
});

export type ResultProps = Partial<ExtractPropTypes<ReturnType<typeof resultProps>>>;

const renderIcon = (
  prefixCls: string,
  {
    status,
    icon,
    className,
    style,
  }: {
    status: ResultStatusType;
    icon: any;
    className?: string;
    style?: CSSProperties;
  },
) => {
  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status];
    return (
      <div class={classNames(`${prefixCls}-icon`, `${prefixCls}-image`, className)} style={style}>
        <SVGComponent />
      </div>
    );
  }
  if (icon === null || icon === false) {
    return null;
  }
  const IconComponent = IconMap[status];
  const iconNode = icon || <IconComponent />;
  return (
    <div class={classNames(`${prefixCls}-icon`, className)} style={style}>
      {iconNode}
    </div>
  );
};

const renderExtra = (
  prefixCls: string,
  extra: VNodeTypes,
  className?: string,
  style?: CSSProperties,
) =>
  extra && (
    <div class={classNames(`${prefixCls}-extra`, className)} style={style}>
      {extra}
    </div>
  );

const Result = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AResult',
  inheritAttrs: false,
  props: resultProps(),
  slots: Object as CustomSlotsType<{
    title?: any;
    subTitle?: any;
    icon?: any;
    extra?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('result', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('result');

    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const title = props.title ?? slots.title?.();
      const subTitle = props.subTitle ?? slots.subTitle?.();
      const icon = props.icon ?? slots.icon?.();
      const extra = props.extra ?? slots.extra?.();
      const pre = prefixCls.value;

      const mergedPropsForSemantic: ResultProps = {
        ...props,
        status: props.status,
      };
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        ResultSemanticClassNames,
        ResultSemanticStyles,
        ResultProps
      >([contextClassNames.value, props.classNames], [contextStyles.value, props.styles], {
        props: mergedPropsForSemantic,
      });

      const rootCls = classNames(
        pre,
        hashId.value,
        `${pre}-${props.status}`,
        contextClassName.value,
        mergedClassNames.root,
        {
          [`${pre}-rtl`]: direction.value === 'rtl',
        },
      );

      return wrapSSR(
        <div
          {...attrs}
          class={[rootCls, props.rootClassName, attrs.class]}
          style={[contextStyle.value, mergedStyles.root, attrs.style as CSSProperties]}
        >
          {renderIcon(pre, {
            status: props.status,
            icon,
            className: mergedClassNames.icon,
            style: mergedStyles.icon,
          })}
          <div
            class={classNames(`${pre}-title`, mergedClassNames.title)}
            style={mergedStyles.title}
          >
            {title}
          </div>
          {subTitle && (
            <div
              class={classNames(`${pre}-subtitle`, mergedClassNames.subTitle)}
              style={mergedStyles.subTitle}
            >
              {subTitle}
            </div>
          )}
          {renderExtra(pre, extra, mergedClassNames.extra, mergedStyles.extra)}
          {slots.default && (
            <div
              class={classNames(`${pre}-content`, mergedClassNames.body)}
              style={mergedStyles.body}
            >
              {slots.default()}
            </div>
          )}
        </div>,
      );
    };
  },
});

/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

/* istanbul ignore next */
Result.install = function (app: App) {
  app.component(Result.name, Result);
  return app;
};

export default Result as typeof Result &
  Plugin & {
    readonly PRESENTED_IMAGE_403: typeof unauthorized;
    readonly PRESENTED_IMAGE_404: typeof noFound;
    readonly PRESENTED_IMAGE_500: typeof serverError;
  };
