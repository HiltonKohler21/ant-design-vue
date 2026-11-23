import type { CSSProperties } from 'vue';
import { computed, defineComponent, onBeforeUnmount, ref, toRefs, watch } from 'vue';
import VCTour from '../vc-tour';
import classNames from '../_util/classNames';
import TourPanel from './panelRender';
import type { TourProps, TourStepProps } from './interface';
import { tourProps } from './interface';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import useMergedState from '../_util/hooks/useMergedState';
import canUseDom from '../_util/canUseDom';
import KeyCode from '../_util/KeyCode';
import useMergedType from './useMergedType';

// CSSINJS
import useStyle from './style';
import getPlacements from '../_util/placements';

export { TourProps, TourStepProps };

const Tour = defineComponent({
  name: 'ATour',
  inheritAttrs: false,
  props: tourProps(),
  setup(props, { attrs, emit, slots }) {
    const { type, steps, defaultCurrent } = toRefs(props);
    const { prefixCls, direction } = useConfigInject('tour', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('tour');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const [mergedCurrent, setMergedCurrent] = useMergedState(0, {
      value: computed(() => props.current),
      defaultValue: props.defaultCurrent,
    });

    const [mergedOpen, setMergedOpen] = useMergedState<boolean | undefined>(undefined, {
      value: computed(() => props.open),
    });

    const isOpen = computed(() => {
      if (mergedCurrent.value < 0 || mergedCurrent.value >= (props.steps?.length ?? 0)) {
        return false;
      }
      return mergedOpen.value ?? Boolean(props.steps?.length);
    });

    const { currentMergedType, updateInnerCurrent } = useMergedType({
      defaultType: type,
      steps,
      current: mergedCurrent,
      defaultCurrent,
    });

    const prevOpen = ref(isOpen.value);
    watch(isOpen, val => {
      if (val && !prevOpen.value && props.current === undefined) {
        const nextCurrent = props.defaultCurrent ?? 0;
        setMergedCurrent(nextCurrent);
        updateInnerCurrent(nextCurrent);
      }
      prevOpen.value = val;
    });

    const onStepChange = (stepCurrent: number) => {
      setMergedCurrent(stepCurrent);
      updateInnerCurrent(stepCurrent);
      emit('update:current', stepCurrent);
      emit('change', stepCurrent);
    };

    const handleClose = (closeCurrent?: number) => {
      setMergedOpen(false);
      emit('close', closeCurrent ?? mergedCurrent.value);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen.value || props.keyboard === false) {
        return;
      }
      const total = props.steps?.length ?? 0;
      if (e.key === 'ArrowLeft' || e.keyCode === KeyCode.LEFT) {
        if (mergedCurrent.value > 0) {
          onStepChange(mergedCurrent.value - 1);
        }
      } else if (e.key === 'ArrowRight' || e.keyCode === KeyCode.RIGHT) {
        if (mergedCurrent.value < total - 1) {
          onStepChange(mergedCurrent.value + 1);
        }
      } else if (e.key === 'Escape' || e.keyCode === KeyCode.ESC) {
        handleClose(mergedCurrent.value);
      }
    };

    watch(
      [isOpen, () => props.keyboard],
      ([openVal, keyboardVal], _, onCleanup) => {
        if (!canUseDom() || !openVal || keyboardVal === false) {
          return;
        }
        window.addEventListener('keydown', onKeyDown);
        onCleanup(() => {
          window.removeEventListener('keydown', onKeyDown);
        });
      },
      { immediate: true },
    );

    onBeforeUnmount(() => {
      if (canUseDom()) {
        window.removeEventListener('keydown', onKeyDown);
      }
    });

    const builtinPlacements = computed(() =>
      getPlacements({
        arrowPointAtCenter: true,
        autoAdjustOverflow: true,
      }),
    );

    return () => {
      const {
        steps,
        current: _current,
        open: _open,
        type,
        rootClassName,
        actionsRender,
        indicatorsRender,
        keyboard: _keyboard,
        onClose: _onClose,
        ...restProps
      } = props;

      const customClassName = classNames(
        {
          [`${prefixCls.value}-primary`]: currentMergedType.value === 'primary',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        contextClassNames.value.root,
        hashId.value,
        rootClassName,
      );

      const mergedRenderPanel = (stepProps: TourStepProps, stepCurrent: number): VueNode => {
        return (
          <TourPanel
            {...stepProps}
            type={stepProps.type ?? type}
            actionsRender={stepProps.actionsRender ?? actionsRender}
            indicatorsRender={indicatorsRender}
            current={stepCurrent}
            v-slots={{
              indicatorsRender: slots.indicatorsRender,
            }}
          ></TourPanel>
        );
      };

      return wrapSSR(
        <VCTour
          {...attrs}
          {...restProps}
          rootClassName={customClassName}
          style={[contextStyle.value, contextStyles.value.root, attrs.style as CSSProperties]}
          prefixCls={prefixCls.value}
          open={mergedOpen.value}
          current={mergedCurrent.value}
          defaultCurrent={props.defaultCurrent}
          animated
          renderPanel={mergedRenderPanel}
          onChange={onStepChange}
          onClose={handleClose}
          steps={steps}
          builtinPlacements={builtinPlacements.value as any}
        />,
      );
    };
  },
});

export default withInstall(Tour);
