import type { CSSProperties, PropType } from 'vue';
import {
  toRef,
  watchEffect,
  watch,
  defineComponent,
  provide,
  ref,
  shallowRef,
  reactive,
  onUpdated,
  onBeforeUnmount,
  nextTick,
  computed,
} from 'vue';
import classNames from '../_util/classNames';
import KeyCode from '../_util/KeyCode';
import { initDefaultProps } from '../_util/props-util';
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from '../vc-mentions/src/util';
import { vcMentionsProps, defaultProps } from '../vc-mentions/src/mentionsProps';
import type { OptionProps } from '../vc-mentions/src/Option';
import MentionsContextKey from '../vc-mentions/src/MentionsContext';
import DropdownMenu from '../vc-mentions/src/DropdownMenu';
import Trigger from '../vc-trigger';
import ResizeObserver from '../vc-resize-observer';
import calculateAutoSizeStyle from '../input/calculateNodeHeight';
import type { AutoSizeType } from '../input/inputProps';
import omit from '../_util/omit';
import type { EventHandler } from '../_util/EventInterface';
import type { BaseInputExpose } from '../_util/BaseInput';
import BaseInput from '../_util/BaseInput';
import type { VueNode } from '../_util/type';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import { triggerFocus } from '../vc-input/utils/commonUtils';
import raf from '../_util/raf';

function noop() {}

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

const RESIZE_START = 0;
const RESIZE_MEASURING = 1;
const RESIZE_STABLE = 2;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'InternalMentions',
  inheritAttrs: false,
  props: {
    ...initDefaultProps(vcMentionsProps, defaultProps),
    autoSize: {
      type: [Boolean, Object] as PropType<boolean | AutoSizeType>,
      default: undefined,
    },
    popupRender: {
      type: Function as PropType<(menu: VueNode) => VueNode>,
      default: undefined,
    },
    popupStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    textareaClassName: String,
    textareaStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    onResize: {
      type: Function as PropType<(size: { width: number; height: number }) => void>,
    },
    onPopupScroll: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  emits: ['change', 'select', 'search', 'focus', 'blur', 'pressenter', 'resize'],
  setup(props, { emit, attrs, expose, slots }) {
    const rootRef = shallowRef<HTMLDivElement>();
    const measure = ref<HTMLDivElement | null>(null);
    const textarea = ref<BaseInputExpose | null>(null);
    const focusId = ref<any>();
    const state = reactive({
      value: props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null as string | null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    });

    watchEffect(() => {
      state.value = props.value ?? '';
    });

    // ===================== AutoSize =====================
    const resizeStatus = ref(RESIZE_STABLE);
    const autoSizeStyle = ref<CSSProperties>();
    const resizeRafRef = ref<any>();

    const minRows = computed(() =>
      props.autoSize && typeof props.autoSize === 'object' ? props.autoSize.minRows : undefined,
    );
    const maxRows = computed(() =>
      props.autoSize && typeof props.autoSize === 'object' ? props.autoSize.maxRows : undefined,
    );
    const needAutoSize = computed(() => !!props.autoSize);

    const startResize = () => {
      resizeStatus.value = RESIZE_START;
    };

    watch(
      [() => state.value, minRows, maxRows, needAutoSize],
      () => {
        if (needAutoSize.value) {
          startResize();
        }
      },
      { immediate: true },
    );

    watch(
      [resizeStatus, textarea],
      () => {
        if (!textarea.value?.input || !needAutoSize.value) return;
        if (resizeStatus.value === RESIZE_START) {
          resizeStatus.value = RESIZE_MEASURING;
        } else if (resizeStatus.value === RESIZE_MEASURING) {
          try {
            const styles = calculateAutoSizeStyle(
              textarea.value.input as HTMLTextAreaElement,
              false,
              minRows.value ?? null,
              maxRows.value ?? null,
            );
            autoSizeStyle.value = styles;
          } catch {
            // Gracefully ignore getComputedStyle errors in non-browser DOM mocks (e.g. jsdom)
          }
          resizeStatus.value = RESIZE_STABLE;
        }
      },
      { immediate: true, flush: 'post' },
    );

    const onInternalResize = (size: { width: number; height: number }) => {
      if (resizeStatus.value === RESIZE_STABLE) {
        emit('resize', size);
        if (needAutoSize.value) {
          raf.cancel(resizeRafRef.value);
          resizeRafRef.value = raf(() => {
            startResize();
          });
        }
      }
    };

    onBeforeUnmount(() => {
      clearTimeout(focusId.value);
      raf.cancel(resizeRafRef.value);
    });

    const triggerChange = (val: string) => {
      emit('change', val);
    };

    const onChange: EventHandler = ({ target: { value } }) => {
      triggerChange(value);
    };

    const startMeasure = (measureText: string, measurePrefix: string, measureLocation: number) => {
      Object.assign(state, {
        measuring: true,
        measureText,
        measurePrefix,
        measureLocation,
        activeIndex: 0,
      });
    };
    const stopMeasure = (callback?: () => void) => {
      Object.assign(state, {
        measuring: false,
        measureLocation: 0,
        measureText: null,
      });
      callback?.();
    };

    const getOptions = (measureText?: string) => {
      const targetMeasureText = measureText ?? state.measureText ?? '';
      const { filterOption } = props;
      return (props.options || []).filter((option: OptionProps) => {
        if (!!filterOption === false) {
          return true;
        }
        return (filterOption as Function)(targetMeasureText, option);
      });
    };
    const options = computed(() => getOptions());

    const selectOption = (option: OptionProps) => {
      const { split } = props;
      const { value: mentionValue = '' } = option;
      const { text, selectionLocation } = replaceWithMeasure(state.value, {
        measureLocation: state.measureLocation,
        targetText: mentionValue,
        prefix: state.measurePrefix,
        selectionStart: textarea.value?.getSelectionStart() ?? state.value.length,
        split,
      });
      triggerChange(text);
      stopMeasure(() => {
        if (textarea.value?.input) {
          setInputSelection(textarea.value.input as HTMLTextAreaElement, selectionLocation);
        }
      });

      emit('select', option, state.measurePrefix);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const { which } = event;
      if (!state.measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        const optionLen = options.value.length;
        if (optionLen > 0) {
          const offset = which === KeyCode.UP ? -1 : 1;
          const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen;
          state.activeIndex = newActiveIndex;
        }
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        stopMeasure();
      } else if (which === KeyCode.ENTER) {
        event.preventDefault();
        if (!options.value.length) {
          stopMeasure();
          return;
        }
        const option = options.value[state.activeIndex];
        if (option) {
          selectOption(option);
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const { key, which } = event;
      const { measureText: prevMeasureText, measuring } = state;
      const { prefix, validateSearch } = props;
      const target = event.target as HTMLTextAreaElement;
      if ((target as any).composing) {
        return;
      }
      const selectionStartText = getBeforeSelectionText(target);
      const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
        selectionStartText,
        prefix,
      );

      if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
        return;
      }

      if (measureIndex !== -1) {
        const measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        const validateMeasure = validateSearch(measureText, props);
        const matchOption = !!getOptions(measureText).length;

        if (validateMeasure) {
          if (
            key === measurePrefix ||
            key === 'Shift' ||
            measuring ||
            (measureText !== prevMeasureText && matchOption)
          ) {
            startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          stopMeasure();
        }

        if (validateMeasure) {
          emit('search', measureText, measurePrefix);
        }
      } else if (measuring) {
        stopMeasure();
      }
    };

    const onPressEnter = (event: KeyboardEvent) => {
      if (!state.measuring) {
        emit('pressenter', event);
      }
    };

    const onFocus = (event: Event) => {
      clearTimeout(focusId.value);
      const { isFocus } = state;
      if (!isFocus && event) {
        emit('focus', event);
      }
      state.isFocus = true;
    };

    const onBlur = (event: Event) => {
      focusId.value = setTimeout(() => {
        state.isFocus = false;
        stopMeasure();
        emit('blur', event);
      }, 100);
    };

    const setActiveIndex = (activeIndex: number) => {
      state.activeIndex = activeIndex;
    };

    const focus = (option?: InputFocusOptions) => {
      if (option && textarea.value?.input) {
        triggerFocus(textarea.value.input, option);
      } else {
        textarea.value?.focus();
      }
    };

    const blur = () => {
      textarea.value?.blur();
    };

    expose({
      blur,
      focus,
      get textarea() {
        return textarea.value?.input;
      },
      get nativeElement() {
        return rootRef.value;
      },
    });

    provide(MentionsContextKey, {
      activeIndex: toRef(state, 'activeIndex'),
      setActiveIndex,
      selectOption,
      onFocus,
      onBlur,
      loading: toRef(props, 'loading'),
    });

    onUpdated(() => {
      nextTick(() => {
        if (state.measuring && measure.value && textarea.value) {
          measure.value.scrollTop = textarea.value.getScrollTop() || 0;
        }
      });
    });

    const popupPlacement = computed(() => {
      const { placement, direction } = props;
      if (direction === 'rtl') {
        return placement === 'top' ? 'topLeft' : 'bottomLeft';
      }
      return placement === 'top' ? 'topRight' : 'bottomRight';
    });

    return () => {
      const { measureLocation, measurePrefix, measuring } = state;
      const {
        prefixCls,
        placement,
        transitionName,
        getPopupContainer,
        direction,
        dropdownClassName,
        popupRender,
        popupStyle,
        textareaClassName,
        textareaStyle,
        autoSize,
        onResize,
        onPopupScroll,
        ...restProps
      } = props;

      const { class: className, style, ...otherAttrs } = attrs;

      const inputProps = omit(restProps, [
        'value',
        'prefix',
        'split',
        'validateSearch',
        'filterOption',
        'options',
        'loading',
      ]);

      const mergedTextareaStyleObj: CSSProperties = {
        ...(textareaStyle || {}),
        ...(needAutoSize.value ? autoSizeStyle.value || {} : {}),
        ...(resizeStatus.value === RESIZE_START || resizeStatus.value === RESIZE_MEASURING
          ? { overflowX: 'hidden', overflowY: 'hidden' }
          : {}),
      };
      const hasTextareaStyle = Object.keys(mergedTextareaStyleObj).length > 0;

      const textareaProps: Record<string, any> = {
        ...inputProps,
        ...otherAttrs,
        onChange: noop,
        onSelect: noop,
        value: state.value,
        onInput: onChange,
        onBlur,
        onKeydown: onKeyDown,
        onKeyup: onKeyUp,
        onFocus,
        onPressenter: onPressEnter,
        class: textareaClassName || undefined,
        style: hasTextareaStyle ? mergedTextareaStyleObj : undefined,
      };

      const renderPopup = () => {
        const dropdownPrefix = `${prefixCls}-dropdown`;
        const menuNode = (
          <DropdownMenu
            prefixCls={dropdownPrefix}
            options={measuring ? options.value : []}
            v-slots={{ notFoundContent: slots.notFoundContent, option: slots.option }}
          />
        );
        const content = popupRender
          ? popupRender(menuNode)
          : slots.popupRender
          ? slots.popupRender({ menu: menuNode, originNode: menuNode })
          : menuNode;
        if (onPopupScroll) {
          return <div onScroll={onPopupScroll}>{content}</div>;
        }
        return content;
      };

      const textareaElement = <BaseInput {...textareaProps} ref={textarea} tag="textarea" />;

      return (
        <div ref={rootRef} class={classNames(prefixCls, className)} style={style as CSSProperties}>
          {needAutoSize.value ? (
            <ResizeObserver onResize={onInternalResize}>{textareaElement}</ResizeObserver>
          ) : (
            textareaElement
          )}
          {slots.suffix?.()}
          {measuring && (
            <div ref={measure} class={`${prefixCls}-measure`}>
              {state.value.slice(0, measureLocation)}
              <Trigger
                prefixCls={`${prefixCls}-dropdown`}
                popupVisible
                popup={renderPopup()}
                popupClassName={dropdownClassName}
                popupStyle={popupStyle}
                popupPlacement={popupPlacement.value}
                popupTransitionName={transitionName}
                builtinPlacements={BUILT_IN_PLACEMENTS}
                getPopupContainer={getPopupContainer}
              >
                <span>{measurePrefix}</span>
              </Trigger>
              {state.value.slice(measureLocation + measurePrefix.length)}
            </div>
          )}
        </div>
      );
    };
  },
});
