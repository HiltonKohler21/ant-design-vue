import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectAnchor } from './context';
import type { Key, VueNode, CustomSlotsType } from '../_util/type';
import { objectType, anyType } from '../_util/type';

export const anchorLinkProps = () => ({
  prefixCls: String,
  href: String,
  replace: { type: Boolean, default: false },
  targetOffset: Number,
  title: anyType<VueNode | ((item: any) => VueNode)>(),
  target: String,
  /* private use  */
  customTitleProps: objectType<AnchorLinkItemProps>(),
});
export interface AnchorLinkItemProps {
  key: Key;
  class?: string;
  style?: CSSProperties;
  href?: string;
  target?: string;
  replace?: boolean;
  targetOffset?: number;
  children?: AnchorLinkItemProps[];
  title?: VueNode | ((item: AnchorLinkItemProps) => VueNode);
}

export type AnchorLinkProps = Partial<ExtractPropTypes<ReturnType<typeof anchorLinkProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAnchorLink',
  inheritAttrs: false,
  props: initDefaultProps(anchorLinkProps(), { href: '#' }),
  slots: Object as CustomSlotsType<{
    title: any;
    default: any;
    customTitle: any;
  }>,
  setup(props, { slots, attrs }) {
    let mergedTitle = null;
    const {
      handleClick: contextHandleClick,
      scrollTo,
      unregisterLink,
      registerLink,
      activeLink,
      classNames: mergedClassNames,
      styles: mergedStyles,
    } = useInjectAnchor();
    const { prefixCls } = useConfigInject('anchor', props);

    const handleClick = (e: Event) => {
      const { href, replace, targetOffset } = props;
      contextHandleClick(e, { title: mergedTitle, href });
      scrollTo(href, targetOffset);
      // Support clicking on an anchor does not record history.
      if (e.defaultPrevented || !href) {
        return;
      }
      const isExternalLink = href.startsWith('http://') || href.startsWith('https://');
      if (isExternalLink) {
        if (replace) {
          e.preventDefault();
          window.location.replace(href);
        }
        return;
      }
      if (replace) {
        e.preventDefault();
        window.history.replaceState(null, '', href);
      }
    };

    watch([() => props.href, () => props.targetOffset], ([val, nextOffset], [oldVal]) => {
      nextTick(() => {
        if (oldVal !== val) {
          unregisterLink(oldVal);
        }
        registerLink(val, nextOffset);
      });
    });

    onMounted(() => {
      registerLink(props.href, props.targetOffset);
    });

    onBeforeUnmount(() => {
      unregisterLink(props.href);
    });

    return () => {
      const { href, target, title = slots.title, customTitleProps = {} } = props;
      const pre = prefixCls.value;
      mergedTitle = typeof title === 'function' ? title(customTitleProps) : title;
      const active = activeLink.value === href;
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
      const wrapperClassName = classNames(
        `${pre}-link`,
        mergedClassNames?.value?.item,
        {
          [`${pre}-link-active`]: active,
        },
        attrClass as any,
      );
      const itemStyle = mergedStyles?.value?.item;
      const wrapperStyle =
        itemStyle || attrStyle ? [itemStyle, attrStyle as CSSProperties] : undefined;
      const titleClassName = classNames(`${pre}-link-title`, mergedClassNames?.value?.itemTitle, {
        [`${pre}-link-title-active`]: active,
      });
      return (
        <div {...restAttrs} class={wrapperClassName} style={wrapperStyle}>
          <a
            class={titleClassName}
            style={mergedStyles?.value?.itemTitle}
            href={href}
            title={typeof mergedTitle === 'string' ? mergedTitle : ''}
            target={target}
            onClick={handleClick}
          >
            {slots.customTitle ? slots.customTitle(customTitleProps) : mergedTitle}
          </a>
          {slots.default?.()}
        </div>
      );
    };
  },
});
