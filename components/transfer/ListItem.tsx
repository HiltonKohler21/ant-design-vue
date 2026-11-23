import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import type { TransferLocale } from '.';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import defaultLocale from '../locale/en_US';
import Checkbox from '../checkbox';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import { booleanType, objectType } from '../_util/type';
import type { TransferSectionSemanticClassNames, TransferSectionSemanticStyles } from './interface';

function noop() {}

export const transferListItemProps = {
  renderedText: PropTypes.any,
  renderedEl: PropTypes.any,
  item: PropTypes.any,
  checked: booleanType(),
  prefixCls: String,
  disabled: booleanType(),
  showRemove: booleanType(),
  classNames: objectType<TransferSectionSemanticClassNames>(),
  styles: objectType<TransferSectionSemanticStyles>(),
  onClick: Function,
  onRemove: Function,
};

export type TransferListItemProps = Partial<ExtractPropTypes<typeof transferListItemProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ListItem',
  inheritAttrs: false,
  props: transferListItemProps,
  emits: ['click', 'remove'],
  setup(props, { emit }) {
    return () => {
      const {
        renderedText,
        renderedEl,
        item,
        checked,
        disabled,
        prefixCls,
        showRemove,
        classNames: semanticClassNames,
        styles: semanticStyles,
      } = props;
      const className = classNames(
        {
          [`${prefixCls}-content-item`]: true,
          [`${prefixCls}-content-item-disabled`]: disabled || item.disabled,
        },
        semanticClassNames?.item,
      );

      let title: string;
      if (typeof renderedText === 'string' || typeof renderedText === 'number') {
        title = String(renderedText);
      }

      return (
        <LocaleReceiver componentName="Transfer" defaultLocale={defaultLocale.Transfer}>
          {(transferLocale: TransferLocale) => {
            const labelNode = (
              <span
                class={classNames(
                  `${prefixCls}-content-item-text`,
                  semanticClassNames?.itemContent,
                )}
                style={semanticStyles?.itemContent}
              >
                {renderedEl}
              </span>
            );
            if (showRemove) {
              return (
                <li class={className} style={semanticStyles?.item} title={title}>
                  {labelNode}
                  <TransButton
                    disabled={disabled || item.disabled}
                    class={`${prefixCls}-content-item-remove`}
                    aria-label={transferLocale.remove}
                    onClick={() => {
                      emit('remove', item);
                    }}
                  >
                    <DeleteOutlined />
                  </TransButton>
                </li>
              );
            }

            return (
              <li
                class={className}
                style={semanticStyles?.item}
                title={title}
                onClick={
                  disabled || item.disabled
                    ? noop
                    : () => {
                        emit('click', item);
                      }
                }
              >
                <Checkbox
                  class={classNames(`${prefixCls}-checkbox`, semanticClassNames?.itemIcon)}
                  style={semanticStyles?.itemIcon}
                  checked={checked}
                  disabled={disabled || item.disabled}
                />
                {labelNode}
              </li>
            );
          }}
        </LocaleReceiver>
      );
    };
  },
});
