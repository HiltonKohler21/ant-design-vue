import KeyCode from '../_util/KeyCode';
import TextArea from '../input/TextArea';
import EnterOutlined from '@ant-design/icons-vue/EnterOutlined';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  defineComponent,
  isVNode,
  cloneVNode,
  ref,
  reactive,
  watch,
  onMounted,
  toRefs,
} from 'vue';
import type { Direction } from '../config-provider';
import type { ChangeEventHandler } from '../_util/EventInterface';
import type { AutoSizeType } from '../input/inputProps';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import type { TypographySemanticClassNames, TypographySemanticStyles } from './Typography';

// CSSINJS
import useStyle from './style';

const editableProps = () => ({
  prefixCls: String,
  value: String,
  maxlength: Number,
  maxLength: Number,
  autoSize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType> },
  onSave: Function as PropType<(val: string) => void>,
  onCancel: Function as PropType<() => void>,
  onEnd: Function as PropType<() => void>,
  onChange: Function as PropType<(val: string) => void>,
  originContent: String,
  direction: String as PropType<Direction>,
  component: String,
  enterIcon: {
    type: [Object, String, Number, Function] as PropType<VueNode | null>,
    default: undefined,
  },
  classNames: {
    type: Object as PropType<TypographySemanticClassNames>,
    default: undefined,
  },
  styles: {
    type: Object as PropType<TypographySemanticStyles>,
    default: undefined,
  },
});
export type EditableProps = Partial<ExtractPropTypes<ReturnType<typeof editableProps>>>;
const Editable = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Editable',
  inheritAttrs: false,
  props: editableProps(),
  // emits: ['save', 'cancel', 'end', 'change'],
  setup(props, { emit, slots, attrs }) {
    const { prefixCls } = toRefs(props);
    const state = reactive({
      current: props.value || '',
      lastKeyCode: undefined,
      inComposition: false,
      cancelFlag: false,
    });
    watch(
      () => props.value,
      current => {
        state.current = current ?? '';
      },
    );

    const mergedMaxLength = computed(() => props.maxLength ?? props.maxlength);

    const textArea = ref();

    onMounted(() => {
      if (textArea.value) {
        const resizableTextArea = textArea.value?.resizableTextArea;
        const innerTextArea = resizableTextArea?.textArea;
        if (innerTextArea) {
          innerTextArea.focus();
          const { length } = innerTextArea.value;
          innerTextArea.setSelectionRange(length, length);
        }
      }
    });

    function saveTextAreaRef(node: any) {
      textArea.value = node;
    }

    function onChange({ target: { value } }) {
      state.current = value.replace(/[\r\n]/g, '');
      emit('change', state.current);
    }

    function onCompositionStart() {
      state.inComposition = true;
    }

    function onCompositionEnd() {
      state.inComposition = false;
    }

    function onKeyDown(e: KeyboardEvent) {
      const { keyCode } = e;
      if (keyCode === KeyCode.ENTER) {
        e.preventDefault();
      }
      // We don't record keyCode when IME is using
      if (state.inComposition) return;

      state.lastKeyCode = keyCode;
    }

    function onKeyUp(e: KeyboardEvent) {
      const { keyCode, ctrlKey, altKey, metaKey, shiftKey } = e;

      // Check if it's a real key
      if (
        state.lastKeyCode === keyCode &&
        !state.inComposition &&
        !ctrlKey &&
        !altKey &&
        !metaKey &&
        !shiftKey
      ) {
        if (keyCode === KeyCode.ENTER) {
          confirmChange();
          emit('end');
        } else if (keyCode === KeyCode.ESC) {
          state.current = props.originContent ?? '';
          emit('cancel');
        }
      }
    }

    function onBlur() {
      confirmChange();
    }

    function confirmChange() {
      emit('save', (state.current ?? '').trim());
    }

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    function renderEnterIcon() {
      const confirmCls = `${props.prefixCls}-edit-content-confirm`;
      if (slots.enterIcon) {
        return slots.enterIcon({ className: confirmCls });
      }
      if (props.enterIcon === null) {
        return null;
      }
      if (props.enterIcon !== undefined) {
        const iconNode =
          typeof props.enterIcon === 'function'
            ? (props.enterIcon as () => VueNode)()
            : props.enterIcon;
        if (iconNode === null) {
          return null;
        }
        if (isVNode(iconNode)) {
          return cloneVNode(iconNode, { class: confirmCls });
        }
        return <span class={confirmCls}>{iconNode}</span>;
      }
      return <EnterOutlined class={confirmCls} />;
    }

    return () => {
      const textAreaClassName = classNames(
        {
          [`${prefixCls.value}`]: true,
          [`${prefixCls.value}-edit-content`]: true,
          [`${prefixCls.value}-rtl`]: props.direction === 'rtl',
          [props.component ? `${prefixCls.value}-${props.component}` : '']: true,
        },
        attrs.class,
        props.classNames?.root,
        hashId.value,
      );

      return wrapSSR(
        <div
          {...attrs}
          class={textAreaClassName}
          style={[props.styles?.root, attrs.style as CSSProperties]}
        >
          <TextArea
            ref={saveTextAreaRef}
            maxlength={mergedMaxLength.value}
            value={state.current}
            onChange={onChange as ChangeEventHandler}
            onKeydown={onKeyDown}
            onKeyup={onKeyUp}
            onCompositionstart={onCompositionStart}
            onCompositionend={onCompositionEnd}
            onBlur={onBlur}
            rows={1}
            autoSize={props.autoSize === undefined || props.autoSize}
            class={props.classNames?.textarea}
            style={props.styles?.textarea}
          />
          {renderEnterIcon()}
        </div>,
      );
    };
  },
});

export default Editable;
