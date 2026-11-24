import type { PropType } from 'vue';
import { computed, shallowRef, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Input from './Input';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import { filterEmpty, isValidElement } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import isPlainObject from 'lodash-es/isPlainObject';
import type {
  ChangeEvent,
  CompositionEventHandler,
  MouseEventHandler,
} from '../_util/EventInterface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import inputProps from './inputProps';
import { mergeSemanticClassNames, mergeSemanticStyles, resolveSemanticValue } from './util';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputSearch',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    inputPrefixCls: String,
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: PropTypes.any,
    searchIcon: PropTypes.any,
    onSearch: {
      type: Function as PropType<
        (value: string, event?: ChangeEvent | MouseEvent | KeyboardEvent) => void
      >,
    },
  },
  setup(props, { slots, attrs, expose, emit }) {
    const inputRef = shallowRef();
    const composedRef = shallowRef(false);
    const focus = (option?: InputFocusOptions) => {
      inputRef.value?.focus(option);
    };
    const blur = () => {
      inputRef.value?.blur();
    };
    expose({
      focus,
      blur,
      get nativeElement() {
        return inputRef.value?.nativeElement;
      },
    });

    const onChange = (e: ChangeEvent) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      if (e && e.target && e.type === 'click') {
        emit('search', e.target.value, e);
      }
      emit('change', e);
    };

    const onMousedown: MouseEventHandler = e => {
      if (document.activeElement === inputRef.value?.input) {
        e.preventDefault();
      }
    };

    const onSearch = (e: MouseEvent | KeyboardEvent) => {
      emit('search', inputRef.value?.input?.stateValue, e);
    };

    const onPressEnter = (e: KeyboardEvent) => {
      if (composedRef.value || props.loading) {
        return;
      }
      onSearch(e);
    };

    const handleOnCompositionStart: CompositionEventHandler = e => {
      composedRef.value = true;
      emit('compositionstart', e);
    };

    const handleOnCompositionEnd: CompositionEventHandler = e => {
      composedRef.value = false;
      emit('compositionend', e);
    };
    const { configProvider, prefixCls, getPrefixCls, direction, size } = useConfigInject(
      'input-search',
      props,
    );
    const searchConfig = computed(() => (configProvider as any).inputSearch?.value);
    const inputPrefixCls = computed(() => getPrefixCls('input', props.inputPrefixCls));
    return () => {
      const {
        disabled,
        loading,
        addonAfter = slots.addonAfter?.(),
        suffix = slots.suffix?.(),
        classNames: propClassNames,
        styles: propStyles,
        ...restProps
      } = props;
      let { enterButton = slots.enterButton?.() ?? false } = props;
      enterButton = enterButton || enterButton === '';
      const customSearchIcon =
        props.searchIcon !== undefined
          ? props.searchIcon
          : slots.searchIcon
          ? slots.searchIcon()
          : searchConfig.value?.searchIcon;
      const searchIcon =
        typeof enterButton === 'boolean' ? (
          customSearchIcon !== undefined ? (
            customSearchIcon
          ) : (
            <SearchOutlined />
          )
        ) : null;

      const semanticInfo = {
        props: {
          ...props,
          enterButton,
          size: size.value,
          variant: props.variant ?? searchConfig.value?.variant,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<Record<string, any>>(
        resolveSemanticValue(searchConfig.value?.classNames, semanticInfo),
        resolveSemanticValue(propClassNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<Record<string, any>>(
        resolveSemanticValue(searchConfig.value?.styles, semanticInfo),
        resolveSemanticValue(propStyles, semanticInfo),
      );

      const buttonClassNames = mergedClassNames.button;
      const buttonStyles = mergedStyles.button;
      const btnRootCls =
        typeof buttonClassNames === 'string' ? buttonClassNames : buttonClassNames?.root;
      const btnRootStyle =
        buttonStyles && typeof buttonStyles === 'object' && 'root' in buttonStyles
          ? buttonStyles.root
          : buttonStyles;
      const btnClassName = classNames(`${prefixCls.value}-button`, btnRootCls);

      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button: any;
      const isAntdButton =
        enterButtonAsElement.type &&
        isPlainObject(enterButtonAsElement.type) &&
        enterButtonAsElement.type.__ANT_BUTTON;
      if (isAntdButton || enterButtonAsElement.tagName === 'button') {
        button = cloneElement(
          enterButtonAsElement,
          {
            onMousedown,
            onClick: onSearch,
            key: 'enterButton',
            ...(isAntdButton
              ? {
                  class: btnClassName,
                  size: size.value,
                }
              : {}),
          },
          false,
        );
      } else {
        const iconOnly = searchIcon && !enterButton;
        let normalizedIcon = searchIcon;
        if (iconOnly) {
          if (Array.isArray(searchIcon)) {
            const valid = filterEmpty(searchIcon);
            normalizedIcon =
              valid.length === 1 && isValidElement(valid[0]) ? valid[0] : <span>{searchIcon}</span>;
          } else if (!isValidElement(searchIcon)) {
            normalizedIcon = <span>{searchIcon}</span>;
          }
        }
        button = (
          <Button
            class={btnClassName}
            style={btnRootStyle}
            classNames={
              buttonClassNames && typeof buttonClassNames === 'object'
                ? buttonClassNames
                : undefined
            }
            styles={
              buttonStyles && typeof buttonStyles === 'object' && 'icon' in buttonStyles
                ? buttonStyles
                : undefined
            }
            type={enterButton ? 'primary' : undefined}
            size={size.value}
            disabled={disabled}
            key="enterButton"
            onMousedown={onMousedown}
            onClick={onSearch}
            loading={loading}
            icon={iconOnly ? normalizedIcon : null}
          >
            {iconOnly ? null : searchIcon || enterButton}
          </Button>
        );
      }
      if (addonAfter) {
        button = [button, addonAfter];
      }
      const cls = classNames(
        prefixCls.value,
        searchConfig.value?.className,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${size.value}`]: !!size.value,
          [`${prefixCls.value}-with-button`]: !!enterButton,
        },
        attrs.class,
      );
      const mergedStyle = searchConfig.value?.style
        ? [searchConfig.value.style, attrs.style]
        : attrs.style;
      const inputClassNames = omit(mergedClassNames, ['button']);
      const inputStyles = omit(mergedStyles, ['button']);
      return (
        <Input
          ref={inputRef}
          {...omit(restProps, ['onUpdate:value', 'onSearch', 'enterButton', 'searchIcon'])}
          {...attrs}
          style={mergedStyle as any}
          variant={
            props.variant ?? (props.bordered === false ? undefined : searchConfig.value?.variant)
          }
          classNames={Object.keys(inputClassNames).length ? inputClassNames : undefined}
          styles={Object.keys(inputStyles).length ? inputStyles : undefined}
          onPressEnter={onPressEnter}
          onCompositionstart={handleOnCompositionStart}
          onCompositionend={handleOnCompositionEnd}
          size={size.value}
          prefixCls={inputPrefixCls.value}
          addonAfter={button}
          suffix={suffix}
          onChange={onChange}
          class={cls}
          disabled={disabled}
          v-slots={omit(slots, ['searchIcon'])}
        />
      );
    };
  },
});
