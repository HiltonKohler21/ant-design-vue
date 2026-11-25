import type { App, CSSProperties, ExtractPropTypes, VNode } from 'vue';
import { cloneVNode, computed, defineComponent, isVNode } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import type { VueNode, CustomSlotsType } from '../_util/type';
import {
  anyType,
  booleanType,
  stringType,
  functionType,
  someType,
  arrayType,
  objectType,
} from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { flattenChildren } from '../_util/props-util';
import VcSteps, { Step as VcStep } from '../vc-steps';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import {
  mergeClassNames,
  mergeStyles,
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticStyles,
} from '../_util/hooks/useMergeSemantic';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import Progress from '../progress';
import omit from '../_util/omit';
import Tooltip from '../tooltip';
import { VcStepProps } from '../vc-steps/Step';
import type { Status, ProgressDotRender } from '../vc-steps/interface';
import type { MouseEventHandler } from '../_util/EventInterface';
import { useToken } from '../theme/internal';
import warning from '../_util/warning';
import PanelArrow from './PanelArrow';
import useDisplaySteps from './useDisplaySteps';

// CSSINJS
import useStyle from './style';

export type StepsVariant = 'filled' | 'outlined';
export type StepsOrientation = 'horizontal' | 'vertical';
export type StepsTitlePlacement = 'horizontal' | 'vertical';
export type StepsType = 'default' | 'navigation' | 'inline' | 'panel' | 'dot';
export type StepsSize = 'default' | 'medium' | 'small';
export type IconRenderType = (
  oriNode: VueNode,
  info: {
    index: number;
    active: boolean;
    item: StepProps;
  },
) => VueNode;

export type StepsSemanticName =
  | 'root'
  | 'item'
  | 'itemWrapper'
  | 'itemSection'
  | 'itemHeader'
  | 'itemTitle'
  | 'itemSubtitle'
  | 'itemContent'
  | 'itemIcon'
  | 'itemRail'
  | 'icon'
  | 'title'
  | 'description';

export type StepsSemanticClassNames = SemanticClassNames<StepsSemanticName>;
export type StepsSemanticStyles = SemanticStyles<StepsSemanticName>;

export const stepProps = () => ({
  key: someType<string | number>([String, Number]),
  /** @deprecated Please use `content` instead */
  description: anyType(),
  content: anyType(),
  icon: anyType(),
  status: stringType<Status>(),
  disabled: booleanType(),
  title: anyType(),
  subTitle: anyType(),
  className: String,
  style: objectType<CSSProperties>(),
  classNames: objectType<StepsSemanticClassNames>(),
  styles: objectType<StepsSemanticStyles>(),
  onClick: functionType<MouseEventHandler>(),
});

export type StepProps = Partial<ExtractPropTypes<ReturnType<typeof stepProps>>>;

const stepsBaseProps = () => ({
  prefixCls: String,
  rootClassName: String,
  iconPrefix: String,
  current: Number,
  initial: Number,
  percent: Number,
  responsive: booleanType(),
  items: arrayType<StepProps[]>(),
  /** @deprecated Please use `titlePlacement` instead */
  labelPlacement: stringType<StepsTitlePlacement>(),
  titlePlacement: stringType<StepsTitlePlacement>(),
  status: stringType<Status>(),
  size: stringType<StepsSize>(),
  /** @deprecated Please use `orientation` instead */
  direction: stringType<StepsOrientation>(),
  orientation: stringType<StepsOrientation>(),
  variant: stringType<StepsVariant>(),
  ellipsis: booleanType(),
  maxCount: Number,
  offset: Number,
  iconRender: functionType<IconRenderType>(),
  progressDot: someType<boolean | ProgressDotRender>([Boolean, Function]),
  type: stringType<StepsType>(),
  onChange: functionType<(current: number) => void>(),
  'onUpdate:current': functionType<(current: number) => void>(),
});

type StepsBaseProps = Partial<ExtractPropTypes<ReturnType<typeof stepsBaseProps>>>;

export type StepsClassNamesType =
  | StepsSemanticClassNames
  | ((info: { props: StepsBaseProps }) => StepsSemanticClassNames);
export type StepsStylesType =
  | StepsSemanticStyles
  | ((info: { props: StepsBaseProps }) => StepsSemanticStyles);

export const stepsProps = () => ({
  ...stepsBaseProps(),
  classNames: someType<StepsClassNamesType>([Object, Function]),
  styles: someType<StepsStylesType>([Object, Function]),
});

export type StepsProps = Partial<ExtractPropTypes<ReturnType<typeof stepsProps>>>;

const ITEM_SEMANTIC_KEYS: StepsSemanticName[] = [
  'item',
  'itemWrapper',
  'itemSection',
  'itemHeader',
  'itemTitle',
  'itemSubtitle',
  'itemContent',
  'itemIcon',
  'itemRail',
  'icon',
  'title',
  'description',
];

function hasAnyItemSemantic(
  cls: StepsSemanticClassNames | undefined,
  st: StepsSemanticStyles | undefined,
): boolean {
  if (!cls && !st) return false;
  return ITEM_SEMANTIC_KEYS.some(key => Boolean(cls?.[key] || st?.[key]));
}

function hasTokenClass(cls: any, token: string): boolean {
  const str = classNames(cls);
  return str ? str.split(/\s+/).includes(token) : false;
}

function mergeStyleList(...list: (CSSProperties | undefined)[]): CSSProperties | undefined {
  let merged: CSSProperties | undefined;
  for (const item of list) {
    if (item && typeof item === 'object') {
      merged = merged ? { ...merged, ...item } : { ...item };
    }
  }
  return merged;
}

function patchStepVNode(
  node: any,
  prefixCls: string,
  cls: StepsSemanticClassNames,
  st: StepsSemanticStyles,
  itemClassName?: string,
  depth = 0,
): VueNode {
  if (!isVNode(node)) return node;
  const nodeClass = node.props?.class;
  const itemPrefix = `${prefixCls}-item`;

  let extraClass: string | undefined;
  let extraStyle: CSSProperties | undefined;
  let shouldRecurseChildren = false;
  let onlySubtitleChild = false;

  if (depth === 0 && hasTokenClass(nodeClass, itemPrefix)) {
    extraClass = classNames(itemClassName, cls.item);
    extraStyle = st.item;
    shouldRecurseChildren = true;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-container`)) {
    extraClass = cls.itemWrapper;
    extraStyle = st.itemWrapper;
    shouldRecurseChildren = true;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-tail`)) {
    extraClass = cls.itemRail;
    extraStyle = st.itemRail;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-icon`)) {
    extraClass = classNames(cls.itemIcon, cls.icon);
    extraStyle = mergeStyleList(st.itemIcon, st.icon);
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-content`)) {
    extraClass = cls.itemSection;
    extraStyle = st.itemSection;
    shouldRecurseChildren = true;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-title`)) {
    extraClass = classNames(cls.itemHeader, cls.itemTitle, cls.title);
    extraStyle = mergeStyleList(st.itemHeader, st.itemTitle, st.title);
    shouldRecurseChildren = true;
    onlySubtitleChild = true;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-subtitle`)) {
    extraClass = cls.itemSubtitle;
    extraStyle = st.itemSubtitle;
  } else if (hasTokenClass(nodeClass, `${itemPrefix}-description`)) {
    extraClass = classNames(cls.itemContent, cls.description);
    extraStyle = mergeStyleList(st.itemContent, st.description);
  }

  let nextChildren = node.children;
  if (shouldRecurseChildren && Array.isArray(node.children)) {
    let changed = false;
    const mapped = node.children.map(child => {
      if (onlySubtitleChild) {
        if (isVNode(child) && hasTokenClass(child.props?.class, `${itemPrefix}-subtitle`)) {
          const patched = patchStepVNode(child, prefixCls, cls, st, undefined, depth + 1);
          if (patched !== child) changed = true;
          return patched;
        }
        return child;
      }
      const patched = patchStepVNode(child, prefixCls, cls, st, undefined, depth + 1);
      if (patched !== child) changed = true;
      return patched;
    });
    if (changed) {
      nextChildren = mapped as VNode['children'];
    }
  }

  if (!extraClass && !extraStyle && nextChildren === node.children) {
    return node;
  }

  const cloneProps: Record<string, any> = {};
  if (extraClass) cloneProps.class = extraClass;
  if (extraStyle) cloneProps.style = extraStyle;

  const cloned = cloneVNode(node, cloneProps);
  if (nextChildren !== node.children) {
    cloned.children = nextChildren;
  }
  return cloned;
}

const Steps = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASteps',
  inheritAttrs: false,
  props: initDefaultProps(stepsProps(), {
    current: 0,
    responsive: true,
    labelPlacement: 'horizontal',
  }),
  slots: Object as CustomSlotsType<{
    progressDot: any;
    default: any;
  }>,

  // emits: ['update:current', 'change'],
  setup(props, { attrs, slots, emit }) {
    const { prefixCls, direction: rtlDirection, configProvider } = useConfigInject('steps', props);
    const {
      componentConfig: contextComponentConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('steps');
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    // realToken：未变量化的原始 token（cssVar 下 token 值是 var() 字符串，尺寸计算需真实值）
    const [, , , realToken] = useToken();

    const screens = useBreakpoint();
    const mergedType = computed<StepsType | undefined>(() => {
      if (props.type && props.type !== 'default') {
        return props.type;
      }
      if (props.progressDot) {
        return 'dot';
      }
      return props.type;
    });
    const isInline = computed(() => mergedType.value === 'inline');
    const isPanel = computed(() => mergedType.value === 'panel');
    const isDot = computed(
      () => mergedType.value === 'dot' || mergedType.value === 'inline' || !!slots.progressDot,
    );

    const mergedOrientation = computed<StepsOrientation | undefined>(() => {
      if (isPanel.value) {
        return 'horizontal';
      }
      const nextDirection = props.orientation ?? props.direction;
      if (props.responsive && screens.value.xs) {
        return 'vertical';
      }
      return nextDirection;
    });
    const mergedTitlePlacement = computed<StepsTitlePlacement>(
      () => props.titlePlacement ?? props.labelPlacement ?? 'horizontal',
    );
    const mergedVariant = computed<StepsVariant>(
      () => props.variant ?? (contextComponentConfig.value as any)?.variant ?? 'filled',
    );

    const iconPrefix = computed(() => configProvider.getPrefixCls('', props.iconPrefix));
    const mergedPercent = computed(() => (isInline.value ? undefined : props.percent));

    const normalizedItems = computed<StepProps[]>(() =>
      (props.items || []).filter(Boolean).map(item => {
        const resolvedDescription = item.content !== undefined ? item.content : item.description;
        if (resolvedDescription === item.description) {
          return item;
        }
        return {
          ...item,
          description: resolvedDescription,
        };
      }),
    );

    const currentRef = computed(() => props.current ?? 0);
    const initialRef = computed(() => props.initial ?? 0);
    const maxCountRef = computed(() => props.maxCount);

    const { canApplyMaxCount, displaySteps, mappedDisplayCurrent, displayItems } = useDisplaySteps(
      normalizedItems,
      currentRef,
      initialRef,
      maxCountRef,
      prefixCls,
    );

    const handleChange = (displayCurrent: number) => {
      if (canApplyMaxCount.value) {
        const target = displaySteps.value[displayCurrent];
        if (!target || target.originIndex < 0) {
          return;
        }
        const nextCurrent = initialRef.value + target.originIndex;
        emit('update:current', nextCurrent);
        emit('change', nextCurrent);
        return;
      }
      emit('update:current', displayCurrent);
      emit('change', displayCurrent);
    };

    const mergedPropsForSemantic = computed<StepsProps>(() => ({
      ...props,
      type: mergedType.value,
      direction: mergedOrientation.value ?? 'horizontal',
      orientation: mergedOrientation.value ?? 'horizontal',
      labelPlacement: mergedTitlePlacement.value,
      titlePlacement: mergedTitlePlacement.value,
      variant: mergedVariant.value,
      percent: mergedPercent.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      StepsSemanticClassNames,
      StepsSemanticStyles,
      StepsProps
    >(
      () => [contextClassNames.value as StepsClassNamesType, props.classNames],
      () => [contextStyles.value as StepsStylesType, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const stepIconRender = ({
      node,
      index,
      status,
      title,
      description,
    }: {
      node: any;
      index: number;
      status: string;
      title: any;
      description: any;
    }) => {
      const displayStep = displaySteps.value[index];
      const originIndex = displayStep?.originIndex;
      const item = displayStep?.item;

      let iconNode = node;
      const hasCustomIcon =
        item?.icon !== undefined &&
        item?.icon !== null &&
        item?.icon !== false &&
        item?.icon !== '';
      if (
        canApplyMaxCount.value &&
        originIndex !== undefined &&
        originIndex >= 0 &&
        !hasCustomIcon &&
        !isDot.value &&
        status !== 'finish' &&
        status !== 'error'
      ) {
        iconNode = (
          <span class={`${prefixCls.value}-icon`}>{initialRef.value + originIndex + 1}</span>
        );
      }

      if (status === 'process' && mergedPercent.value !== undefined) {
        // currently it's hard-coded, since we can't easily read the actually width of icon

        const progressWidth =
          props.size === 'small'
            ? Number(realToken.value.controlHeight)
            : Number(realToken.value.controlHeightLG);

        iconNode = (
          <div class={`${prefixCls.value}-progress-icon`}>
            <Progress
              type="circle"
              percent={mergedPercent.value}
              size={progressWidth}
              strokeWidth={4}
              format={() => null}
            />
            {iconNode}
          </div>
        );
      }

      if (props.iconRender) {
        const mappedIndex =
          originIndex !== undefined && originIndex >= 0 ? initialRef.value + originIndex : index;
        iconNode = props.iconRender(iconNode, {
          index: mappedIndex,
          active: mappedIndex === currentRef.value,
          item: item || { title, description, status: status as Status },
        });
      }

      return iconNode;
    };
    const icons = computed(() => ({
      finish: <CheckOutlined class={`${prefixCls.value}-finish-icon`} />,
      error: <CloseOutlined class={`${prefixCls.value}-error-icon`} />,
    }));
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          props.maxCount === undefined || props.maxCount >= 3,
          'Steps',
          '`maxCount` should be greater than or equal to 3.',
        );
      }

      const explicitFilled =
        props.variant === 'filled' ||
        (props.variant === undefined &&
          (contextComponentConfig.value as any)?.variant === 'filled');

      const stepsClassName = classNames(
        {
          [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
          [`${prefixCls.value}-with-progress`]: mergedPercent.value !== undefined,
          [`${prefixCls.value}-outlined`]: mergedVariant.value === 'outlined',
          [`${prefixCls.value}-filled`]: explicitFilled,
          [`${prefixCls.value}-ellipsis`]: !!props.ellipsis,
          [`${prefixCls.value}-panel`]: isPanel.value,
          [`${prefixCls.value}-max-count`]: canApplyMaxCount.value,
        },
        contextClassName.value,
        mergedClassNames.value.root,
        props.rootClassName,
        attrs.class,
        hashId.value,
      );

      const finalItems = props.items ? displayItems.value : undefined;

      const hasTopItemSemantics = hasAnyItemSemantic(mergedClassNames.value, mergedStyles.value);
      const hasPerItemSemantics = Boolean(
        finalItems?.some(item => item && (item.className || item.classNames || item.styles)),
      );
      const needsItemPatch = hasTopItemSemantics || hasPerItemSemantics;

      const appendPanelArrow = (stepNode: VueNode): VueNode => {
        if (!isPanel.value || !isVNode(stepNode)) {
          return stepNode;
        }
        const existingChildren = Array.isArray(stepNode.children)
          ? stepNode.children
          : stepNode.children
          ? [stepNode.children]
          : [];
        const cloned = cloneVNode(stepNode);
        cloned.children = [
          ...existingChildren,
          <PanelArrow prefixCls={prefixCls.value} />,
        ] as VNode['children'];
        return cloned;
      };

      const itemRender = (item: StepProps, stepItem: VueNode) => {
        let node = stepItem;
        if (needsItemPatch) {
          const itemCls = item?.classNames
            ? mergeClassNames<StepsSemanticClassNames>(mergedClassNames.value, item.classNames)
            : mergedClassNames.value;
          const itemSt = item?.styles
            ? mergeStyles<StepsSemanticStyles>(mergedStyles.value, item.styles)
            : mergedStyles.value;
          node = patchStepVNode(node, prefixCls.value, itemCls, itemSt, item?.className);
        }
        if (isPanel.value) {
          node = appendPanelArrow(node);
        }
        if (isInline.value) {
          const tooltipContent = item.content ?? item.description;
          return tooltipContent ? <Tooltip title={tooltipContent}>{node}</Tooltip> : node;
        }
        return node;
      };

      const vcSlots: Record<string, any> = { stepIcon: stepIconRender, ...slots };
      if (slots.default) {
        const rawSlotDefault = slots.default;
        vcSlots.default = () => {
          const children = flattenChildren(rawSlotDefault() || []);
          return children.map(child => {
            if (!isVNode(child)) return child;
            const childProps = (child.props || {}) as Record<string, any>;
            const hasContentAlias =
              childProps.content !== undefined && childProps.description === undefined;
            const childHasPerItem = Boolean(
              childProps.className || childProps.classNames || childProps.styles,
            );
            if (!hasContentAlias && !hasTopItemSemantics && !childHasPerItem && !isPanel.value) {
              return child;
            }
            const extraProps: Record<string, any> = {};
            if (hasContentAlias) {
              extraProps.description = childProps.content;
            }
            if (hasTopItemSemantics || childHasPerItem || isPanel.value) {
              const itemCls = childProps.classNames
                ? mergeClassNames<StepsSemanticClassNames>(
                    mergedClassNames.value,
                    childProps.classNames,
                  )
                : mergedClassNames.value;
              const itemSt = childProps.styles
                ? mergeStyles<StepsSemanticStyles>(mergedStyles.value, childProps.styles)
                : mergedStyles.value;
              extraProps.itemRender = (stepNode: VueNode) => {
                let nextNode =
                  hasTopItemSemantics || childHasPerItem
                    ? patchStepVNode(
                        stepNode,
                        prefixCls.value,
                        itemCls,
                        itemSt,
                        childProps.className,
                      )
                    : stepNode;
                if (isPanel.value) {
                  nextNode = appendPanelArrow(nextNode);
                }
                return nextNode;
              };
            }
            return cloneVNode(child, extraProps);
          });
        };
      }

      const vcType =
        mergedType.value === 'navigation' || mergedType.value === 'inline'
          ? mergedType.value
          : 'default';
      const vcProgressDot =
        props.progressDot !== undefined
          ? props.progressDot
          : mergedType.value === 'dot' && !slots.progressDot
          ? true
          : undefined;
      const vcSize = props.size === 'medium' ? 'default' : props.size;
      const inlineOffsetStyle =
        isInline.value && props.offset
          ? ({ '--ant-steps-items-offset': String(props.offset) } as CSSProperties)
          : undefined;

      return wrapSSR(
        <VcSteps
          icons={icons.value}
          {...attrs}
          {...omit(props, [
            'percent',
            'responsive',
            'orientation',
            'titlePlacement',
            'variant',
            'ellipsis',
            'maxCount',
            'offset',
            'iconRender',
            'classNames',
            'styles',
            'type',
            'size',
            'progressDot',
            'initial',
            'current',
          ])}
          type={vcType}
          size={vcSize}
          progressDot={vcProgressDot}
          initial={canApplyMaxCount.value ? 0 : props.initial}
          current={mappedDisplayCurrent.value}
          items={finalItems}
          direction={mergedOrientation.value}
          labelPlacement={mergedTitlePlacement.value}
          prefixCls={prefixCls.value}
          iconPrefix={iconPrefix.value}
          class={stepsClassName}
          style={[
            contextStyle.value,
            inlineOffsetStyle,
            mergedStyles.value.root,
            attrs.style as CSSProperties,
          ]}
          onChange={handleChange}
          isInline={isInline.value}
          itemRender={isInline.value || isPanel.value || needsItemPatch ? itemRender : undefined}
          v-slots={vcSlots}
        />,
      );
    };
  },
});

/* istanbul ignore next */
export const Step = defineComponent({
  compatConfig: { MODE: 3 },
  ...(VcStep as any),
  name: 'AStep',
  props: {
    ...VcStepProps(),
    content: anyType(),
  },
});
export default Object.assign(Steps, {
  Step,
  install: (app: App) => {
    app.component(Steps.name, Steps);
    app.component(Step.name, Step);
    return app;
  },
});
