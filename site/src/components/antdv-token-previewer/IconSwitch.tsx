import classNames from 'ant-design-vue/es/_util/classNames';
import makeStyle from './utils/makeStyle';
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

const useStyle = makeStyle('IconSwitch', token => ({
  '.theme-editor-icon-switch': {
    display: 'inline-block',

    '.holder': {
      position: 'relative',
      display: 'inline-flex',
      background: token.colorFillSecondary,
      borderRadius: '100vw',
      cursor: 'pointer',
      transition: 'all 0.3s',

      '&::before': {
        position: 'absolute',
        top: 0,
        left: 'calc(100% - 32px)',
        width: 32,
        height: 32,
        background: token.colorPrimary,
        borderRadius: '100vw',
        transition: 'all 0.3s',
        content: '""',
      },

      '&.leftChecked::before': {
        left: 0,
      },

      '&:hover': {
        boxShadow: `0 0 3px ${token.colorPrimaryBorder}`,
      },
    },

    '.icon': {
      position: 'relative',
      width: 32,
      height: 32,
      color: token.colorTextSecondary,
      lineHeight: '32px',
      textAlign: 'center',
      transition: 'all 0.3s',
      fontSize: 16,

      '.anticon': {
        fontSize: 14,
      },

      '&:first-child': {
        marginInlineEnd: -4,
      },

      '&.active': {
        color: token.colorTextLightSolid,
      },
    },
  },
}));

export interface IconSwitchProps {
  leftChecked?: boolean;
  onChange?: (leftChecked: boolean) => void;
}
const IconSwitch = defineComponent({
  name: 'IconSwitch',
  props: {
    leftChecked: { type: Boolean },
    onChange: { type: Function as PropType<(leftChecked: boolean) => void> },
  },
  setup(props, { attrs, slots }) {
    const { leftChecked } = toRefs(props);
    const [wrapSSR, hashId] = useStyle();

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames('theme-editor-icon-switch', attrs.class, hashId.value)}>
          <div
            class={classNames('holder', leftChecked.value && 'leftChecked')}
            onClick={() => {
              props.onChange(!leftChecked.value);
            }}
          >
            <span class={classNames('icon', leftChecked.value && 'active')}>
              {slots.leftIcon && slots.leftIcon()}
            </span>
            <span class={classNames('icon', !leftChecked.value && 'active')}>
              {slots.rightIcon && slots.rightIcon()}
            </span>
          </div>
        </div>,
      );
    };
  },
});
export default IconSwitch;
