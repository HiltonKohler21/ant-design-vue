import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  computed,
} from 'vue';
import scrollIntoView from 'scroll-into-view-if-needed';
import classNames from '../_util/classNames';
import addEventListener from '../vc-util/Dom/addEventListener';
import Affix from '../affix';
import type { AffixProps } from '../affix';
import scrollTo from '../_util/scrollTo';
import useReducedMotion from '../_util/hooks/useReducedMotion';
import getScroll from '../_util/getScroll';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic, {
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import useProvideAnchor from './context';
import useStyle from './style';
import type { AnchorLinkItemProps } from './AnchorLink';
import AnchorLink from './AnchorLink';
import PropTypes from '../_util/vue-types';
import devWarning from '../vc-util/devWarning';
import { arrayType, someType } from '../_util/type';

export type AnchorDirection = 'vertical' | 'horizontal';

export type AnchorSemanticName = 'root' | 'item' | 'itemTitle' | 'indicator';
export type AnchorSemanticClassNames = SemanticClassNames<AnchorSemanticName>;
export type AnchorSemanticStyles = SemanticStyles<AnchorSemanticName>;
export type AnchorClassNamesType = SemanticClassNamesType<Record<string, any>, AnchorSemanticName>;
export type AnchorStylesType = SemanticStylesType<Record<string, any>, AnchorSemanticName>;

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!;
      return rect.top - container.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const sharpMatcherRegx = /#([\S ]+)$/;

interface Section {
  link: string;
  top: number;
}

export type AnchorContainer = HTMLElement | Window;

export const anchorProps = () => ({
  rootClassName: String,
  prefixCls: String,
  offsetTop: Number,
  bounds: Number,
  affix: {
    type: [Boolean, Object] as PropType<
      boolean | Omit<AffixProps, 'offsetTop' | 'target' | 'children'>
    >,
    default: true,
  },
  showInkInFixed: { type: Boolean, default: false },
  getContainer: Function as PropType<() => AnchorContainer>,
  wrapperClass: String,
  wrapperStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  getCurrentAnchor: Function as PropType<(activeLink: string) => string>,
  targetOffset: Number,
  items: arrayType<AnchorLinkItemProps[]>(),
  direction: PropTypes.oneOf(['vertical', 'horizontal'] as AnchorDirection[]).def('vertical'),
  replace: { type: Boolean, default: undefined },
  classNames: someType<AnchorClassNamesType>([Object, Function]),
  styles: someType<AnchorStylesType>([Object, Function]),
  onChange: Function as PropType<(currentActiveLink: string) => void>,
  onClick: Function as PropType<(e: MouseEvent, link: { title: any; href: string }) => void>,
});

export type AnchorProps = Partial<ExtractPropTypes<ReturnType<typeof anchorProps>>>;

export interface AnchorState {
  scrollContainer: HTMLElement | Window;
  links: string[];
  scrollEvent: any;
  animating: boolean;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAnchor',
  inheritAttrs: false,
  props: anchorProps(),
  setup(props, { emit, attrs, slots, expose }) {
    const { prefixCls, getTargetContainer, direction } = useConfigInject('anchor', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('anchor');
    const anchorDirection = computed(() => props.direction ?? 'vertical');

    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        props.items && typeof slots.default !== 'function',
        'Anchor',
        '`Anchor children` is deprecated. Please use `items` instead.',
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !(anchorDirection.value === 'horizontal' && props.items?.some(n => 'children' in n)),
        'Anchor',
        '`Anchor items#children` is not supported when `Anchor` direction is horizontal.',
      );
    }

    const spanLinkNode = ref<HTMLSpanElement>(null);
    const anchorRef = ref();
    const shouldReduceMotion = useReducedMotion();
    const linkTargetOffsetMap: Record<string, number> = {};
    const state = reactive<AnchorState>({
      links: [],
      scrollContainer: null,
      scrollEvent: null,
      animating: false,
    });
    const activeLink = ref(null);
    const getContainer = computed(() => {
      const { getContainer } = props;
      return getContainer || getTargetContainer?.value || getDefaultContainer;
    });

    const mergedProps = computed<AnchorProps>(() => ({
      ...props,
      direction: anchorDirection.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      AnchorSemanticClassNames,
      AnchorSemanticStyles,
      AnchorProps
    >(
      () => [contextClassNames.value as AnchorClassNamesType, props.classNames],
      () => [
        contextStyles.value as AnchorStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.styles,
        props.wrapperStyle ? { root: props.wrapperStyle } : undefined,
        attrs.style ? { root: attrs.style as CSSProperties } : undefined,
      ],
      () => ({ props: mergedProps.value }),
    );

    // func...
    const getCurrentAnchor = (offsetTop = 0, bounds = 5) => {
      const linkSections: Array<Section> = [];
      const container = getContainer.value();
      state.links.forEach(link => {
        if (!link) {
          return;
        }
        const sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        const target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          const linkOffsetTop = linkTargetOffsetMap[link] ?? offsetTop;
          const top = getOffsetTop(target, container);
          if (top <= linkOffsetTop + bounds) {
            linkSections.push({
              link,
              top,
            });
          }
        }
      });

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
        return maxSection.link;
      }
      return '';
    };
    const setCurrentActiveLink = (link: string) => {
      const { getCurrentAnchor } = props;
      if (activeLink.value === link) {
        return;
      }
      activeLink.value = typeof getCurrentAnchor === 'function' ? getCurrentAnchor(link) : link;
      emit('change', link);
    };
    const handleScrollTo = (link: string, targetOffsetParams?: number) => {
      const { offsetTop, targetOffset } = props;

      setCurrentActiveLink(link);
      if (!link) {
        return;
      }
      const sharpLinkMatch = sharpMatcherRegx.exec(link);
      if (!sharpLinkMatch) {
        return;
      }
      const targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) {
        return;
      }

      const container = getContainer.value();
      const scrollTop = getScroll(container, true);
      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      const finalTargetOffset = targetOffsetParams ?? targetOffset ?? offsetTop ?? 0;
      y -= finalTargetOffset;
      state.animating = true;

      scrollTo(y, {
        callback: () => {
          state.animating = false;
        },
        getContainer: getContainer.value,
        duration: shouldReduceMotion.value ? 0 : undefined,
      });
    };
    expose({
      scrollTo: handleScrollTo,
    });
    const handleScroll = () => {
      if (state.animating) {
        return;
      }
      const { offsetTop, bounds, targetOffset } = props;
      const currentActiveLink = getCurrentAnchor(
        targetOffset !== undefined ? targetOffset : offsetTop || 0,
        bounds,
      );
      setCurrentActiveLink(currentActiveLink);
    };

    const updateInk = () => {
      const linkNode = anchorRef.value?.querySelector(`.${prefixCls.value}-link-title-active`);
      if (linkNode && spanLinkNode.value) {
        const horizontalAnchor = anchorDirection.value === 'horizontal';
        spanLinkNode.value.style.top = horizontalAnchor
          ? ''
          : `${linkNode.offsetTop + linkNode.clientHeight / 2}px`;
        spanLinkNode.value.style.height = horizontalAnchor ? '' : `${linkNode.clientHeight}px`;
        spanLinkNode.value.style.left = horizontalAnchor ? `${linkNode.offsetLeft}px` : '';
        spanLinkNode.value.style.width = horizontalAnchor ? `${linkNode.clientWidth}px` : '';
        if (horizontalAnchor) {
          scrollIntoView(linkNode, {
            scrollMode: 'if-needed',
            block: 'nearest',
          });
        }
      }
    };

    useProvideAnchor({
      registerLink: (link: string, newTargetOffset?: number) => {
        if (!state.links.includes(link)) {
          state.links.push(link);
        }
        if (newTargetOffset !== undefined) {
          linkTargetOffsetMap[link] = newTargetOffset;
        } else {
          delete linkTargetOffsetMap[link];
        }
      },
      unregisterLink: (link: string) => {
        const index = state.links.indexOf(link);
        if (index !== -1) {
          state.links.splice(index, 1);
        }
        delete linkTargetOffsetMap[link];
      },
      activeLink,
      scrollTo: handleScrollTo,
      handleClick: (e, info) => {
        emit('click', e, info);
      },
      direction: anchorDirection,
      classNames: mergedClassNames,
      styles: mergedStyles,
    });

    onMounted(() => {
      nextTick(() => {
        const container = getContainer.value();
        state.scrollContainer = container;
        state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
        handleScroll();
      });
    });
    onBeforeUnmount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });
    onUpdated(() => {
      if (state.scrollEvent) {
        const currentContainer = getContainer.value();
        if (state.scrollContainer !== currentContainer) {
          state.scrollContainer = currentContainer;
          state.scrollEvent.remove();
          state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
          handleScroll();
        }
      }
      updateInk();
    });

    const createNestedLink = (options?: AnchorLinkItemProps[]) =>
      Array.isArray(options)
        ? options.map(option => {
            const {
              children,
              key,
              href,
              target,
              class: cls,
              style,
              title,
              replace,
              targetOffset,
            } = option;
            return (
              <AnchorLink
                key={key}
                href={href}
                target={target}
                replace={replace ?? props.replace}
                targetOffset={targetOffset}
                class={cls}
                style={style}
                title={title}
                customTitleProps={option}
                v-slots={{ customTitle: slots.customTitle }}
              >
                {anchorDirection.value === 'vertical' ? createNestedLink(children) : null}
              </AnchorLink>
            );
          })
        : null;

    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const { offsetTop, affix, showInkInFixed } = props;
      const pre = prefixCls.value;
      const { class: attrClass, style: _attrStyle, ...restAttrs } = attrs;
      const inkClass = classNames(`${pre}-ink`, mergedClassNames.value.indicator, {
        [`${pre}-ink-visible`]: activeLink.value,
      });

      const wrapperClass = classNames(
        hashId.value,
        props.wrapperClass,
        contextClassName.value,
        mergedClassNames.value.root,
        attrClass as any,
        `${pre}-wrapper`,
        {
          [`${pre}-wrapper-horizontal`]: anchorDirection.value === 'horizontal',
          [`${pre}-rtl`]: direction.value === 'rtl',
        },
      );

      const anchorClass = classNames(pre, {
        [`${pre}-fixed`]: !affix && !showInkInFixed,
      });

      const wrapperStyle: CSSProperties = {
        maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
        ...mergedStyles.value.root,
      };
      const anchorContent = (
        <div
          class={[wrapperClass, !affix ? props.rootClassName : undefined]}
          style={wrapperStyle}
          ref={anchorRef}
        >
          <div class={anchorClass}>
            <span class={inkClass} style={mergedStyles.value.indicator} ref={spanLinkNode} />
            {Array.isArray(props.items) ? createNestedLink(props.items) : slots.default?.()}
          </div>
        </div>
      );

      const affixProps = typeof affix === 'object' && affix !== null ? affix : {};

      return wrapSSR(
        !affix ? (
          anchorContent
        ) : (
          <Affix
            {...restAttrs}
            {...affixProps}
            offsetTop={offsetTop}
            rootClassName={props.rootClassName}
            target={getContainer.value}
          >
            {anchorContent}
          </Affix>
        ),
      );
    };
  },
});
