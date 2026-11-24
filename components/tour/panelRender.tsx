import { computed, defineComponent, toRefs } from 'vue';
import classNames from '../_util/classNames';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { tourStepProps } from './interface';
import type { TourBtnProps, TourSemanticClassNames, TourSemanticStyles } from './interface';

import LocaleReceiver from '../locale/LocaleReceiver';
import Button from '../button';
import type { ButtonProps } from '../button';
import defaultLocale from '../locale/en_US';

import { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import type { VueNode } from '../_util/type';

const panelRender = defineComponent({
  name: 'ATourPanel',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, { attrs, slots }) {
    const { current, total } = toRefs(props);
    const { componentConfig: tourConfig } = useComponentConfig('tour');

    const isLastStep = computed(() => current.value === total.value - 1);

    const prevBtnClick = (e: MouseEvent) => {
      const prevButtonProps = props.prevButtonProps as TourBtnProps;
      props.onPrev?.(e);
      if (typeof prevButtonProps?.onClick === 'function') {
        prevButtonProps.onClick(e);
      }
    };

    const nextBtnClick = (e: MouseEvent) => {
      const nextButtonProps = props.nextButtonProps as TourBtnProps;
      if (isLastStep.value) {
        props.onFinish?.(e);
      } else {
        props.onNext?.(e);
      }
      if (typeof nextButtonProps?.onClick === 'function') {
        nextButtonProps.onClick(e);
      }
    };

    return () => {
      const {
        prefixCls,
        title,
        onClose,
        cover,
        description,
        type: stepType,
        arrow,
        closable,
        closeIcon,
      } = props;

      const semanticClassNames: TourSemanticClassNames = props.classNames || {};
      const semanticStyles: TourSemanticStyles = props.styles || {};

      const prevButtonProps = props.prevButtonProps as TourBtnProps;
      const nextButtonProps = props.nextButtonProps as TourBtnProps;
      const actionsRender = props.actionsRender;

      const isClosable = closable !== false && closeIcon !== false && closeIcon !== null;
      const resolvedCloseIcon =
        (typeof closable === 'object' && closable?.closeIcon) ||
        (closeIcon !== true && closeIcon !== undefined ? closeIcon : undefined) ||
        tourConfig.value.closeIcon;

      let headerNode: VueNode;
      if (title) {
        headerNode = (
          <div
            class={classNames(`${prefixCls}-header`, semanticClassNames.header)}
            style={semanticStyles.header}
          >
            <div
              class={classNames(`${prefixCls}-title`, semanticClassNames.title)}
              style={semanticStyles.title}
            >
              {title}
            </div>
          </div>
        );
      }

      let descriptionNode: VueNode;
      if (description) {
        descriptionNode = (
          <div
            class={classNames(`${prefixCls}-description`, semanticClassNames.description)}
            style={semanticStyles.description}
          >
            {description}
          </div>
        );
      }

      let coverNode: VueNode;
      if (cover) {
        coverNode = (
          <div
            class={classNames(`${prefixCls}-cover`, semanticClassNames.cover)}
            style={semanticStyles.cover}
          >
            {cover}
          </div>
        );
      }

      let mergeIndicatorNode: VueNode;

      if (props.indicatorsRender) {
        mergeIndicatorNode = props.indicatorsRender(current.value, total.value);
      } else if (slots.indicatorsRender) {
        mergeIndicatorNode = slots.indicatorsRender({ current: current.value, total: total.value });
      } else {
        mergeIndicatorNode = [...Array.from({ length: total.value }).keys()].map(
          (stepItem, index) => (
            <span
              key={stepItem}
              class={classNames(
                index === current.value && `${prefixCls}-indicator-active`,
                `${prefixCls}-indicator`,
                semanticClassNames.indicator,
              )}
              style={semanticStyles.indicator}
            />
          ),
        );
      }

      const mainBtnType = stepType === 'primary' ? 'default' : 'primary';
      const secondaryBtnProps: ButtonProps = {
        type: 'default',
        ghost: stepType === 'primary',
      };

      return (
        <LocaleReceiver componentName="Tour" defaultLocale={defaultLocale.Tour}>
          {contextLocale => {
            const defaultActionsNode = (
              <>
                {current.value !== 0 ? (
                  <Button
                    {...secondaryBtnProps}
                    {...prevButtonProps}
                    onClick={prevBtnClick}
                    size="small"
                    class={classNames(`${prefixCls}-prev-btn`, prevButtonProps?.className)}
                  >
                    {typeof prevButtonProps?.children === 'function'
                      ? prevButtonProps.children()
                      : prevButtonProps?.children ?? contextLocale.Previous}
                  </Button>
                ) : null}
                <Button
                  type={mainBtnType}
                  {...nextButtonProps}
                  onClick={nextBtnClick}
                  size="small"
                  class={classNames(`${prefixCls}-next-btn`, nextButtonProps?.className)}
                >
                  {typeof nextButtonProps?.children === 'function'
                    ? nextButtonProps.children()
                    : nextButtonProps?.children ??
                      (isLastStep.value ? contextLocale.Finish : contextLocale.Next)}
                </Button>
              </>
            );

            return (
              <div
                {...attrs}
                class={classNames(
                  stepType === 'primary' ? `${prefixCls}-primary` : '',
                  attrs.class,
                  `${prefixCls}-content`,
                )}
              >
                {arrow && <div class={`${prefixCls}-arrow`} key="arrow" />}
                <div
                  class={classNames(
                    `${prefixCls}-inner`,
                    `${prefixCls}-section`,
                    semanticClassNames.section,
                  )}
                  style={semanticStyles.section}
                >
                  {isClosable && (
                    <button
                      type="button"
                      class={classNames(`${prefixCls}-close`, semanticClassNames.close)}
                      style={semanticStyles.close}
                      onClick={onClose}
                    >
                      {resolvedCloseIcon || <CloseOutlined class={`${prefixCls}-close-icon`} />}
                    </button>
                  )}
                  {coverNode}
                  {headerNode}
                  {descriptionNode}
                  <div
                    class={classNames(`${prefixCls}-footer`, semanticClassNames.footer)}
                    style={semanticStyles.footer}
                  >
                    {total.value > 1 && (
                      <div
                        class={classNames(`${prefixCls}-indicators`, semanticClassNames.indicators)}
                        style={semanticStyles.indicators}
                      >
                        {mergeIndicatorNode}
                      </div>
                    )}
                    <div
                      class={classNames(
                        `${prefixCls}-buttons`,
                        `${prefixCls}-actions`,
                        semanticClassNames.actions,
                      )}
                      style={semanticStyles.actions}
                    >
                      {actionsRender
                        ? actionsRender(defaultActionsNode, {
                            current: current.value,
                            total: total.value,
                          })
                        : defaultActionsNode}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </LocaleReceiver>
      );
    };
  },
});

export default panelRender;
