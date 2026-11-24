import type { FunctionalComponent } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Button from '../button';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import type { VueNode } from '../_util/type';
import type { ModalFooterRenderExtra } from './interface';

export function renderCloseIcon(prefixCls: string, closeIcon?: VueNode) {
  return (
    <span class={`${prefixCls}-close-x`}>
      {closeIcon !== undefined && closeIcon !== null && closeIcon !== false ? (
        closeIcon
      ) : (
        <CloseOutlined class={`${prefixCls}-close-icon`} />
      )}
    </span>
  );
}

export interface NormalFooterOptions {
  okText?: VueNode;
  okType?: LegacyButtonType;
  cancelText?: VueNode;
  confirmLoading?: boolean;
  okButtonProps?: ButtonPropsType;
  cancelButtonProps?: ButtonPropsType;
  onOk?: (e: MouseEvent) => void;
  onCancel?: (e: MouseEvent) => void;
}

export function createNormalFooter(options: NormalFooterOptions): {
  originNode: VueNode;
  extra: ModalFooterRenderExtra;
} {
  const {
    okText,
    okType = 'primary',
    cancelText,
    confirmLoading,
    okButtonProps,
    cancelButtonProps,
    onOk,
    onCancel,
  } = options;

  const invokeClick = (handler: ButtonPropsType['onClick'], e: MouseEvent) => {
    if (Array.isArray(handler)) {
      handler.forEach(fn => fn?.(e));
    } else if (typeof handler === 'function') {
      handler(e);
    }
  };

  const handleCancelClick = (e: MouseEvent) => {
    onCancel?.(e);
    invokeClick(cancelButtonProps?.onClick, e);
  };

  const handleOkClick = (e: MouseEvent) => {
    onOk?.(e);
    invokeClick(okButtonProps?.onClick, e);
  };

  const CancelBtn: FunctionalComponent = () => (
    <Button {...cancelButtonProps} onClick={handleCancelClick}>
      {cancelText}
    </Button>
  );
  CancelBtn.displayName = 'CancelBtn';

  const OkBtn: FunctionalComponent = () => (
    <Button
      {...convertLegacyProps(okType)}
      loading={confirmLoading}
      {...okButtonProps}
      onClick={handleOkClick}
    >
      {okText}
    </Button>
  );
  OkBtn.displayName = 'OkBtn';

  const originNode = (
    <>
      <CancelBtn />
      <OkBtn />
    </>
  );

  return {
    originNode,
    extra: {
      OkBtn,
      CancelBtn,
    },
  };
}
