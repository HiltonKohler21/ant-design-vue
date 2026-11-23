import type { CSSProperties, FunctionalComponent } from 'vue';
import { isVNode } from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import Button from '../button';
import type { Direction } from '../config-provider';
import type { VueNode } from '../_util/type';
import { cloneElement } from '../_util/vnode';

function noop() {}

export interface TransferOperationProps {
  class?: string;
  leftArrowText?: VueNode;
  rightArrowText?: VueNode;
  actions?: VueNode[];
  moveToLeft?: (e: MouseEvent) => void;
  moveToRight?: (e: MouseEvent) => void;
  leftActive?: boolean;
  rightActive?: boolean;
  style?: CSSProperties | string;
  disabled?: boolean;
  direction?: Direction;
  oneWay?: boolean;
}

const renderActionButton = (
  content: VueNode,
  disabled: boolean,
  active: boolean | undefined,
  moveHandler: (e: MouseEvent) => void,
  icon: VueNode,
) => {
  if (isVNode(content)) {
    const oriDisabled = Boolean((content.props as any)?.disabled);
    const mergedDisabled = oriDisabled || disabled || !active;
    const oriOnClick = (content.props as any)?.onClick;
    return cloneElement(
      content,
      {
        disabled: mergedDisabled,
        onClick: (event: MouseEvent) => {
          if (mergedDisabled) {
            event.preventDefault();
            return;
          }
          oriOnClick?.(event);
          moveHandler?.(event);
        },
      },
      false,
    );
  }
  return (
    <Button
      type="primary"
      size="small"
      disabled={disabled || !active}
      onClick={moveHandler}
      icon={icon}
    >
      {content}
    </Button>
  );
};

const Operation: FunctionalComponent<TransferOperationProps> = props => {
  const {
    disabled,
    moveToLeft = noop,
    moveToRight = noop,
    leftArrowText = '',
    rightArrowText = '',
    actions,
    leftActive,
    rightActive,
    class: className,
    style,
    direction,
    oneWay,
  } = props;

  const extraActions =
    actions && actions.length > (oneWay ? 1 : 2) ? actions.slice(oneWay ? 1 : 2) : null;

  return (
    <div class={className} style={style}>
      {renderActionButton(
        rightArrowText,
        !!disabled,
        rightActive,
        moveToRight,
        direction !== 'rtl' ? <RightOutlined /> : <LeftOutlined />,
      )}
      {!oneWay &&
        renderActionButton(
          leftArrowText,
          !!disabled,
          leftActive,
          moveToLeft,
          direction !== 'rtl' ? <LeftOutlined /> : <RightOutlined />,
        )}
      {extraActions}
    </div>
  );
};
Operation.displayName = 'Operation';
Operation.inheritAttrs = false;

export default Operation;
