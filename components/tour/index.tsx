import type { CSSProperties } from 'vue';
import { computed, defineComponent, nextTick, onBeforeUnmount, ref, toRefs, watch } from 'vue';
import VCTour from '../vc-tour';
import classNames from '../_util/classNames';
import TourPanel from './panelRender';
import PurePanel from './PurePanel';
import type {
  TourProps,
  TourStepProps,
  TourSemanticName,
  TourSemanticClassNames,
  TourSemanticStyles,
  TourClassNamesType,
  TourStylesType,
  TourGap,
} from './interface';
import { tourProps } from './interface';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import useMergedState from '../_util/hooks/useMergedState';
import canUseDom from '../_util/canUseDom';
import KeyCode from '../_util/KeyCode';
import useMergedType from './useMergedType';

// CSSINJS
import useStyle from './style';
import getPlacements from '../_util/placements';

export type {
  TourProps,
  TourStepProps,
  TourSemanticName,
  TourSemanticClassNames,
  TourSemanticStyles,
  TourClassNamesType,
  TourStylesType,
  TourGap,
};
export type { PurePanelProps as TourPurePanelProps } from './PurePanel';

const Tour = defineComponent({
  name: 'ATour',
  inheritAttrs: false,
  props: tourProps(),
  setup(props, { attrs, emit, slots }) {
    const { type, steps, defaultCurrent } = toRefs(props);
    const { prefixCls, direction } = useConfigInject('tour', props);
    const {
      componentConfig: tourConfig,
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

    const resolvedSemantics = computed(() => {
      const mergedProps: TourProps = {
        ...props,
        current: mergedCurrent.value,
        open: isOpen.value,
      };
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        TourSemanticClassNames,
        TourSemanticStyles,
        TourProps
      >(
        [contextClassNames.value as any, props.classNames as any],
        [contextStyles.value as any, props.styles as any],
        {
          props: mergedProps,
        },
      );
      return { mergedClassNames, mergedStyles };
    });

    let prevMaskClasses: string[] = [];

    const syncMaskAndGapDom = () => {
      if (!canUseDom() || !isOpen.value) {
        prevMaskClasses = [];
        return;
      }
      const maskEl = document.querySelector(`.${prefixCls.value}-mask`) as HTMLElement | null;
      if (!maskEl) return;

      // Sync semantic classNames.mask onto .ant-tour-mask
      const nextMaskClasses = (resolvedSemantics.value.mergedClassNames.mask || '')
        .split(/\s+/)
        .filter(Boolean);
      prevMaskClasses.forEach(cls => {
        if (!nextMaskClasses.includes(cls)) {
          maskEl.classList.remove(cls);
        }
      });
      nextMaskClasses.forEach(cls => {
        maskEl.classList.add(cls);
      });
      prevMaskClasses = nextMaskClasses;

      // Sync disabledInteraction onto mask
      if (props.disabledInteraction) {
        maskEl.style.pointerEvents = 'auto';
      } else if (!resolvedSemantics.value.mergedStyles.mask?.pointerEvents) {
        maskEl.style.pointerEvents = 'none';
      }

      // Sync array offset [offsetX, offsetY] or explicit 0 offset/radius onto SVG mask & placeholder
      const gap = props.gap;
      const curStep = props.steps?.[mergedCurrent.value];
      if (gap && curStep?.target) {
        const targetEl =
          typeof curStep.target === 'function' ? (curStep.target as any)() : curStep.target;
        if (targetEl && typeof targetEl.getBoundingClientRect === 'function') {
          const isArrayOffset = Array.isArray(gap.offset);
          const hasZeroOffset = gap.offset === 0;
          const hasZeroRadius = gap.radius === 0;
          if (isArrayOffset || hasZeroOffset || hasZeroRadius) {
            const offsetX: number = Array.isArray(gap.offset)
              ? gap.offset[0] ?? 6
              : gap.offset ?? 6;
            const offsetY: number = Array.isArray(gap.offset)
              ? gap.offset[1] ?? 6
              : gap.offset ?? 6;
            const radius: number = gap.radius ?? 2;
            const rect = targetEl.getBoundingClientRect();
            const left = rect.left - offsetX;
            const top = rect.top - offsetY;
            const width = rect.width + offsetX * 2;
            const height = rect.height + offsetY * 2;

            const svgMaskRects = maskEl.querySelectorAll('defs mask rect');
            if (svgMaskRects.length >= 2) {
              const hole = svgMaskRects[1];
              hole.setAttribute('x', String(left));
              hole.setAttribute('y', String(top));
              hole.setAttribute('rx', String(radius));
              hole.setAttribute('width', String(width));
              hole.setAttribute('height', String(height));
            }
            const svgDirectRects = maskEl.querySelectorAll('svg > rect');
            if (svgDirectRects.length >= 5) {
              svgDirectRects[1].setAttribute('height', String(Math.max(0, top)));
              svgDirectRects[2].setAttribute('width', String(Math.max(0, left)));
              svgDirectRects[3].setAttribute('y', String(top + height));
              svgDirectRects[3].setAttribute('height', `calc(100vh - ${top + height}px)`);
              svgDirectRects[4].setAttribute('x', String(left + width));
              svgDirectRects[4].setAttribute('width', `calc(100vw - ${left + width}px)`);
            }
            const placeholderEl = document.querySelector(
              `.${prefixCls.value}-target-placeholder`,
            ) as HTMLElement | null;
            if (placeholderEl) {
              placeholderEl.style.left = `${left}px`;
              placeholderEl.style.top = `${top}px`;
              placeholderEl.style.width = `${width}px`;
              placeholderEl.style.height = `${height}px`;
            }
          }
        }
      }
    };

    watch(
      [
        isOpen,
        mergedCurrent,
        () => props.gap,
        () => props.disabledInteraction,
        () => resolvedSemantics.value.mergedClassNames.mask,
        () => resolvedSemantics.value.mergedStyles.mask,
      ],
      () => {
        syncMaskAndGapDom();
      },
      { flush: 'post', deep: true, immediate: true },
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

    const normalizedGap = computed(() => {
      if (!props.gap) return undefined;
      const rawOffset = props.gap.offset;
      return {
        offset: Array.isArray(rawOffset) ? rawOffset[0] : rawOffset,
        radius: props.gap.radius,
      };
    });

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
        classNames: _classNames,
        styles: _styles,
        closeIcon,
        closable,
        disabledInteraction: _disabledInteraction,
        gap: _gap,
        mask,
        ...restProps
      } = props;

      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;

      const customClassName = classNames(
        {
          [`${prefixCls.value}-primary`]: currentMergedType.value === 'primary',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        mergedClassNames.root,
        attrs.class as string,
        hashId.value,
        rootClassName,
      );

      const mergedRootStyle: CSSProperties = {
        ...contextStyle.value,
        ...mergedStyles.root,
        ...(attrs.style as CSSProperties),
      };

      const mergeMaskOption = (
        rawMask: boolean | { style?: CSSProperties; color?: string } | undefined,
      ) => {
        if (rawMask === false) {
          return false;
        }
        const maskBase = typeof rawMask === 'object' ? rawMask : {};
        const combinedMaskStyle: CSSProperties = {
          ...contextStyle.value,
          ...mergedStyles.root,
          ...mergedStyles.mask,
          ...(attrs.style as CSSProperties),
          ...maskBase.style,
        };
        if (Object.keys(combinedMaskStyle).length > 0 || typeof rawMask === 'object') {
          return {
            ...maskBase,
            style: combinedMaskStyle,
          };
        }
        return rawMask;
      };

      const mergedMask = mergeMaskOption(mask);

      const mergedSteps = steps?.map(step => {
        const stepMask = step.mask !== undefined ? mergeMaskOption(step.mask) : undefined;
        return {
          ...step,
          ...(stepMask !== undefined ? { mask: stepMask } : {}),
          style:
            Object.keys(mergedRootStyle).length > 0 || step.style
              ? { ...mergedRootStyle, ...step.style }
              : undefined,
        };
      });

      const mergedRenderPanel = (stepProps: TourStepProps, stepCurrent: number): VueNode => {
        const [panelClassNames, panelStyles] = mergeSemantic<
          TourSemanticClassNames,
          TourSemanticStyles,
          TourStepProps
        >([mergedClassNames, stepProps.classNames], [mergedStyles, stepProps.styles], {
          props: stepProps,
        });
        return (
          <TourPanel
            {...stepProps}
            type={stepProps.type ?? type}
            actionsRender={stepProps.actionsRender ?? actionsRender}
            indicatorsRender={indicatorsRender}
            closeIcon={stepProps.closeIcon ?? closeIcon ?? tourConfig.value.closeIcon}
            closable={stepProps.closable ?? closable}
            classNames={panelClassNames}
            styles={panelStyles}
            current={stepCurrent}
            onVnodeMounted={() => {
              syncMaskAndGapDom();
              nextTick(() => syncMaskAndGapDom());
            }}
            onVnodeUpdated={() => {
              syncMaskAndGapDom();
              nextTick(() => syncMaskAndGapDom());
            }}
            v-slots={{
              indicatorsRender: slots.indicatorsRender,
            }}
          />
        );
      };

      return wrapSSR(
        <VCTour
          {...attrs}
          {...restProps}
          gap={normalizedGap.value}
          mask={mergedMask}
          rootClassName={customClassName}
          style={mergedRootStyle}
          prefixCls={prefixCls.value}
          open={mergedOpen.value}
          current={mergedCurrent.value}
          defaultCurrent={props.defaultCurrent}
          animated
          renderPanel={mergedRenderPanel}
          onChange={onStepChange}
          onClose={handleClose}
          steps={mergedSteps}
          builtinPlacements={builtinPlacements.value as any}
        />,
      );
    };
  },
});

const TourWithPanel = Object.assign(Tour, {
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
});

export default withInstall(TourWithPanel);
