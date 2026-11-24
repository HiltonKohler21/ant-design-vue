import type { App, CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { computed, watch, shallowRef, defineComponent } from 'vue';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import InternalMentions from './InternalMentions';
import genMentionsPurePanel from './PurePanel';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useComponentConfig } from '../config-provider/hooks/useComponentConfig';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { flattenChildren, getOptionProps } from '../_util/props-util';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import { optionProps, optionOptions } from '../vc-mentions/src/Option';
import type { KeyboardEventHandler } from '../_util/EventInterface';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider';
import type { Variant } from '../config-provider/context';
import useVariant from '../form/hooks/useVariant';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import useStyle from './style';
import { useProvideOverride } from '../menu/src/OverrideContext';
import warning from '../_util/warning';
import Spin from '../spin';
import devWarning from '../vc-util/devWarning';
import type { CustomSlotsType, VueNode } from '../_util/type';
import type { AutoSizeType } from '../input/inputProps';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import {
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticStyles,
  type SemanticClassNamesType,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

export interface MentionsOptionProps {
  value: string;
  disabled?: boolean;
  label?: string | number | ((o: MentionsOptionProps) => any);
  [key: string]: any;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

export type MentionPlacement = 'top' | 'bottom';

export type MentionsSemanticName = 'root' | 'textarea' | 'popup' | 'suffix';
export type MentionsSemanticClassNames = SemanticClassNames<MentionsSemanticName>;
export type MentionsSemanticStyles = SemanticStyles<MentionsSemanticName>;
export type MentionsClassNamesType<P = Record<string, any>> = SemanticClassNamesType<
  P,
  MentionsSemanticName
>;
export type MentionsStylesType<P = Record<string, any>> = SemanticStylesType<
  P,
  MentionsSemanticName
>;

export interface MentionsAllowClearConfig {
  clearIcon?: VueNode;
  disabled?: boolean;
  label?: string;
  tabIndex?: number;
}

function resolveAllowClear(
  propAllowClear: boolean | MentionsAllowClearConfig | undefined,
  contextAllowClear: boolean | MentionsAllowClearConfig | undefined,
): { enabled: boolean; clearIcon?: VueNode; label?: string; tabIndex?: number } {
  const propObj =
    typeof propAllowClear === 'object' && propAllowClear !== null ? propAllowClear : undefined;
  const ctxObj =
    typeof contextAllowClear === 'object' && contextAllowClear !== null
      ? contextAllowClear
      : undefined;

  if (propAllowClear === false || propObj?.disabled) {
    return { enabled: false };
  }
  if (propAllowClear === undefined) {
    if (!contextAllowClear || ctxObj?.disabled) {
      return { enabled: false };
    }
    return {
      enabled: true,
      clearIcon: ctxObj?.clearIcon,
      label: ctxObj?.label,
      tabIndex: ctxObj?.tabIndex,
    };
  }
  return {
    enabled: true,
    clearIcon: propObj?.clearIcon ?? ctxObj?.clearIcon,
    label: propObj?.label ?? ctxObj?.label,
    tabIndex: propObj?.tabIndex ?? ctxObj?.tabIndex,
  };
}

function loadingFilterOption() {
  return true;
}

const getMentions = (value = '', config: MentionsConfig = {}): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config;
  const prefixList: string[] = Array.isArray(prefix) ? prefix : [prefix];
  const separator = split === ' ' ? /[ \r\n]+/ : split;

  return value
    .split(separator)
    .map((str = ''): MentionsEntity | null => {
      let hitPrefix: string | null = null;

      prefixList.some(prefixStr => {
        const startStr = str.slice(0, prefixStr.length);
        if (startStr === prefixStr) {
          hitPrefix = prefixStr;
          return true;
        }
        return false;
      });

      if (hitPrefix !== null) {
        return {
          prefix: hitPrefix,
          value: str.slice((hitPrefix as string).length),
        };
      }
      return null;
    })
    .filter((entity): entity is MentionsEntity => !!entity && !!entity.value);
};

export const mentionsProps = () => ({
  ...baseMentionsProps,
  loading: { type: Boolean, default: undefined },
  allowClear: {
    type: [Boolean, Object] as PropType<boolean | MentionsAllowClearConfig>,
    default: undefined,
  },
  autoSize: {
    type: [Boolean, Object] as PropType<boolean | AutoSizeType>,
    default: undefined,
  },
  size: {
    type: String as PropType<SizeType>,
  },
  popupRender: {
    type: Function as PropType<(menu: VueNode) => VueNode>,
    default: undefined,
  },
  onFocus: {
    type: Function as PropType<(e: FocusEvent) => void>,
  },
  onBlur: {
    type: Function as PropType<(e: FocusEvent) => void>,
  },
  onSelect: {
    type: Function as PropType<(option: MentionsOptionProps, prefix: string) => void>,
  },
  onChange: {
    type: Function as PropType<(text: string) => void>,
  },
  onClear: {
    type: Function as PropType<() => void>,
  },
  onResize: {
    type: Function as PropType<(size: { width: number; height: number }) => void>,
  },
  onPopupScroll: {
    type: Function as PropType<(e: Event) => void>,
  },
  onPressenter: {
    type: Function as PropType<KeyboardEventHandler>,
  },
  'onUpdate:value': {
    type: Function as PropType<(text: string) => void>,
  },
  notFoundContent: PropTypes.any,
  defaultValue: String,
  id: String,
  status: String as PropType<InputStatus>,
  variant: String as PropType<Variant>,
  popupClassName: String,
  rootClassName: String,
  /** 语义化 classNames（支持对象与函数式）：root / textarea / popup / suffix */
  classNames: {
    type: [Object, Function] as PropType<MentionsClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（支持对象与函数式）：root / textarea / popup / suffix */
  styles: {
    type: [Object, Function] as PropType<MentionsStylesType>,
    default: undefined,
  },
});

export type MentionsProps = Partial<ExtractPropTypes<ReturnType<typeof mentionsProps>>>;

const Mentions = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMentions',
  inheritAttrs: false,
  props: mentionsProps(),
  slots: Object as CustomSlotsType<{
    notFoundContent?: any;
    option?: any;
    popupRender?: any;
    clearIcon?: any;
    default?: any;
  }>,
  setup(props, { slots, emit, attrs, expose }) {
    let warnedOption = false;
    const { prefixCls, renderEmpty, direction, size } = useConfigInject('mentions', props);
    const {
      componentConfig: mentionsConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('mentions');

    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? contextDisabled.value);

    // ====================== Variant =======================
    const [mergedVariant, enableVariantCls] = useVariant(
      'mentions',
      computed(() => props.variant),
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const focused = shallowRef(false);
    const vcMentions = shallowRef<any>(null);
    const value = shallowRef(props.value ?? props.defaultValue ?? '');
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));

    const mergedAllowClear = computed(() =>
      resolveAllowClear(props.allowClear, mentionsConfig.value?.allowClear),
    );

    const semanticInfo = computed(() => ({
      props: {
        ...props,
        size: size.value,
        disabled: mergedDisabled.value,
        status: mergedStatus.value as any,
        variant: mergedVariant.value,
      },
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      MentionsSemanticClassNames,
      MentionsSemanticStyles,
      Record<string, any>
    >(
      computed(() => [contextClassNames.value as any, props.classNames as any]),
      computed(() => [contextStyles.value as any, props.styles as any]),
      semanticInfo,
    );

    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
      validator: ({ mode }) => {
        // Warning if use other mode
        warning(
          !mode || mode === 'vertical',
          'Mentions',
          `mode="${mode}" is not supported for Mentions's Menu.`,
        );
      },
    });
    watch(
      () => props.value,
      val => {
        value.value = val ?? '';
      },
    );
    const handleFocus = (e: FocusEvent) => {
      focused.value = true;
      emit('focus', e);
    };

    const handleBlur = (e: FocusEvent) => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };

    const handleSelect = (...args: [MentionsOptionProps, string]) => {
      emit('select', ...args);
      focused.value = true;
    };

    const handleChange = (val: string) => {
      if (props.value === undefined) {
        value.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };

    const handleClear = (e: Event) => {
      e.stopPropagation();
      if (mergedDisabled.value || (attrs as any).readonly || (attrs as any).readOnly) {
        return;
      }
      handleChange('');
      emit('clear');
      focus();
    };

    const getNotFoundContent = () => {
      const notFoundContent = props.notFoundContent;
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (slots.notFoundContent) {
        return slots.notFoundContent();
      }
      return renderEmpty('Select');
    };

    const getOptions = () => {
      const children = flattenChildren(slots.default?.() || []);
      if (process.env.NODE_ENV !== 'production' && !warnedOption && children.length) {
        warnedOption = true;
        devWarning(
          false,
          'Mentions',
          '`Mentions.Option` is deprecated. Please use `options` instead.',
        );
      }
      return children.map(item => {
        return { ...getOptionProps(item), label: (item.children as any)?.default?.() };
      });
    };

    const focus = (option?: InputFocusOptions) => {
      vcMentions.value?.focus(option);
    };

    const blur = () => {
      vcMentions.value?.blur();
    };

    expose({
      focus,
      blur,
      get textarea() {
        return vcMentions.value?.textarea;
      },
      get nativeElement() {
        return vcMentions.value?.nativeElement;
      },
    });
    const mentionsfilterOption = computed(() =>
      props.loading ? loadingFilterOption : props.filterOption,
    );

    return () => {
      const { getPopupContainer, rows = 1, id = formItemContext.id.value, ...restProps } = props;
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const { class: className, style, ...otherAttrs } = attrs;
      const currentClassNames = mergedClassNames.value;
      const currentStyles = mergedStyles.value;
      const clearCfg = mergedAllowClear.value;
      const hasClear = clearCfg.enabled;
      const hasSuffix = hasClear || hasFeedback;

      const isReadonly = Boolean((otherAttrs as any).readonly || (otherAttrs as any).readOnly);
      const showClearBtn =
        hasClear &&
        !mergedDisabled.value &&
        !isReadonly &&
        value.value !== '' &&
        value.value != null;
      const customClearIcon = slots.clearIcon?.() ?? clearCfg.clearIcon;

      const suffixNode = hasSuffix ? (
        <span
          class={classNames(`${prefixCls.value}-suffix`, currentClassNames.suffix)}
          style={currentStyles.suffix}
        >
          {hasClear && (
            <span
              role="button"
              tabindex={clearCfg.tabIndex ?? 0}
              aria-label={clearCfg.label || 'Clear'}
              class={classNames(`${prefixCls.value}-clear-icon`, {
                [`${prefixCls.value}-clear-icon-hidden`]: !showClearBtn,
              })}
              onMousedown={e => e.preventDefault()}
              onClick={handleClear}
              onKeydown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClear(e);
                }
              }}
            >
              {customClearIcon ?? <CloseCircleFilled />}
            </span>
          )}
          {hasFeedback && feedbackIcon}
        </span>
      ) : null;

      const hasRootStyle = Boolean(contextStyle.value || currentStyles.root || style);
      const mergedRootStyle = hasRootStyle
        ? ([contextStyle.value, currentStyles.root, style].filter(Boolean) as any)
        : undefined;

      // Support both flat `popup: string / CSSProperties` (antd v6) and nested `{ root }`
      const popupSemanticClass =
        typeof currentClassNames.popup === 'string'
          ? currentClassNames.popup
          : (currentClassNames.popup as any)?.root;
      const popupSemanticStyle: CSSProperties | undefined =
        currentStyles.popup && typeof currentStyles.popup === 'object'
          ? 'root' in currentStyles.popup
            ? (currentStyles.popup as any).root
            : currentStyles.popup
          : undefined;

      // Propagate `resize` style from root style to textarea when specified (e.g. style="resize: none")
      const rootStyleObj =
        style && typeof style === 'object' && !Array.isArray(style)
          ? (style as CSSProperties)
          : undefined;
      const textareaStyleObj: CSSProperties | undefined =
        currentStyles.textarea || rootStyleObj?.resize
          ? {
              ...(rootStyleObj?.resize ? { resize: rootStyleObj.resize } : {}),
              ...(currentStyles.textarea || {}),
            }
          : undefined;

      const otherProps = omit(restProps, [
        'defaultValue',
        'onUpdate:value',
        'prefixCls',
        'variant',
        'allowClear',
        'onClear',
        'classNames',
        'styles',
        'rootClassName',
        'size',
        'popupClassName',
        'disabled',
      ]);

      const mergedClassName = classNames(
        {
          [`${prefixCls.value}-disabled`]: mergedDisabled.value,
          [`${prefixCls.value}-focused`]: focused.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-lg`]: size.value === 'large',
          [`${prefixCls.value}-sm`]: size.value === 'small',
          [`${prefixCls.value}-has-suffix`]: hasSuffix,
          [`${prefixCls.value}-${mergedVariant.value}`]:
            enableVariantCls.value && mergedVariant.value !== 'outlined',
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value, hasFeedback),
        contextClassName.value,
        props.rootClassName,
        currentClassNames.root,
        className,
        hashId.value,
      );

      const internalMentionsProps = {
        prefixCls: prefixCls.value,
        ...otherProps,
        disabled: mergedDisabled.value,
        direction: direction.value,
        filterOption: mentionsfilterOption.value,
        getPopupContainer,
        options: props.loading
          ? [
              {
                value: 'ANTDV_SEARCHING',
                disabled: true,
                label: <Spin size="small" />,
              },
            ]
          : props.options || getOptions(),
        class: mergedClassName,
        ...(mergedRootStyle ? { style: mergedRootStyle } : undefined),
        textareaClassName: currentClassNames.textarea,
        textareaStyle: textareaStyleObj,
        dropdownClassName: classNames(
          hashId.value,
          props.popupClassName,
          props.rootClassName,
          popupSemanticClass,
        ),
        popupStyle: popupSemanticStyle,
        ...otherAttrs,
        rows,
        onChange: handleChange,
        onSelect: handleSelect,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref: vcMentions,
        value: value.value,
        id,
      };

      return wrapSSR(
        <InternalMentions
          {...internalMentionsProps}
          v-slots={{
            notFoundContent: getNotFoundContent,
            option: slots.option,
            popupRender: slots.popupRender,
            suffix: suffixNode ? () => suffixNode : undefined,
          }}
        />,
      );
    };
  },
});

/* istanbul ignore next */
export const MentionsOption = defineComponent({
  compatConfig: { MODE: 3 },
  ...optionOptions,
  name: 'AMentionsOption',
  props: optionProps,
});

const PurePanel = genMentionsPurePanel(Mentions, mentionsProps);

export { PurePanel as MentionsPurePanel };

export default Object.assign(Mentions, {
  Option: MentionsOption,
  getMentions,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
  install: (app: App) => {
    app.component(Mentions.name, Mentions);
    app.component(MentionsOption.name, MentionsOption);
    return app;
  },
});
