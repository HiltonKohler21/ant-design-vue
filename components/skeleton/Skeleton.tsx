import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import type { SkeletonAvatarProps as AvatarProps } from './Avatar';
import type { SkeletonTitleProps } from './Title';
import Title from './Title';
import type { SkeletonParagraphProps } from './Paragraph';
import Paragraph from './Paragraph';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import Element from './Element';
import useStyle from './style';

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;

export type SkeletonSemanticName =
  | 'root'
  | 'header'
  | 'section'
  | 'avatar'
  | 'title'
  | 'paragraph'
  | 'content';
export type SkeletonSemanticClassNames = SemanticClassNames<SkeletonSemanticName>;
export type SkeletonSemanticStyles = SemanticStyles<SkeletonSemanticName>;
export type SkeletonClassNamesType =
  | SkeletonSemanticClassNames
  | ((info: { props: SkeletonProps }) => SkeletonSemanticClassNames);
export type SkeletonStylesType =
  | SkeletonSemanticStyles
  | ((info: { props: SkeletonProps }) => SkeletonSemanticStyles);

export const skeletonProps = () => ({
  rootClassName: String,
  active: { type: Boolean, default: undefined },
  loading: { type: Boolean, default: undefined },
  prefixCls: String,
  avatar: {
    type: [Boolean, Object] as PropType<SkeletonAvatarProps | boolean>,
    default: undefined as SkeletonAvatarProps | boolean,
  },
  title: {
    type: [Boolean, Object] as PropType<SkeletonTitleProps | boolean>,
    default: undefined as SkeletonTitleProps | boolean,
  },
  paragraph: {
    type: [Boolean, Object] as PropType<SkeletonParagraphProps | boolean>,
    default: undefined as SkeletonParagraphProps | boolean,
  },
  round: { type: Boolean, default: undefined },
  classNames: {
    type: [Object, Function] as PropType<SkeletonClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<SkeletonStylesType>,
    default: undefined,
  },
});

export type SkeletonProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonProps>>>;

function getComponentProps<T>(prop: T | boolean | undefined): T | {} {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}
function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): SkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return { size: 'large', shape: 'square' };
  }

  return { size: 'large', shape: 'circle' };
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): SkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {};

  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%';
  }

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

const Skeleton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeleton',
  props: initDefaultProps(skeletonProps(), {
    avatar: false,
    title: true,
    paragraph: true,
  }),
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('skeleton', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('skeleton');
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const { loading, avatar, title, paragraph, active, round } = props;
      const pre = prefixCls.value;
      if (loading || props.loading === undefined) {
        const hasAvatar = !!avatar || (avatar as string) === '';
        const hasTitle = !!title || (title as string) === '';
        const hasParagraph = !!paragraph || (paragraph as string) === '';

        const mergedPropsForSemantic: SkeletonProps = {
          ...props,
          avatar,
          title,
          paragraph,
        };
        const [mergedClassNames, mergedStyles] = mergeSemantic<
          SkeletonSemanticClassNames,
          SkeletonSemanticStyles,
          SkeletonProps
        >([contextClassNames.value, props.classNames], [contextStyles.value, props.styles], {
          props: mergedPropsForSemantic,
        });

        // Avatar
        let avatarNode;
        if (hasAvatar) {
          const avatarProps = {
            prefixCls: `${pre}-avatar`,
            ...getAvatarBasicProps(hasTitle, hasParagraph),
            ...getComponentProps(avatar),
          };

          avatarNode = (
            <div
              class={classNames(`${pre}-header`, mergedClassNames.header)}
              style={mergedStyles.header}
            >
              <Element
                {...avatarProps}
                class={mergedClassNames.avatar}
                style={mergedStyles.avatar}
              />
            </div>
          );
        }

        let contentNode;
        if (hasTitle || hasParagraph) {
          // Title
          let $title;
          if (hasTitle) {
            const titleProps = {
              prefixCls: `${pre}-title`,
              ...getTitleBasicProps(hasAvatar, hasParagraph),
              ...getComponentProps(title),
            };

            $title = (
              <Title {...titleProps} class={mergedClassNames.title} style={mergedStyles.title} />
            );
          }

          // Paragraph
          let paragraphNode;
          if (hasParagraph) {
            const paragraphProps = {
              prefixCls: `${pre}-paragraph`,
              ...getParagraphBasicProps(hasAvatar, hasTitle),
              ...getComponentProps(paragraph),
            };

            paragraphNode = (
              <Paragraph
                {...paragraphProps}
                class={mergedClassNames.paragraph}
                style={mergedStyles.paragraph}
              />
            );
          }

          const sectionStyle =
            mergedStyles.section || mergedStyles.content
              ? [mergedStyles.section, mergedStyles.content]
              : undefined;

          contentNode = (
            <div
              class={classNames(
                `${pre}-content`,
                mergedClassNames.section,
                mergedClassNames.content,
              )}
              style={sectionStyle}
            >
              {$title}
              {paragraphNode}
            </div>
          );
        }

        const cls = classNames(
          pre,
          props.rootClassName,
          contextClassName.value,
          mergedClassNames.root,
          {
            [`${pre}-with-avatar`]: hasAvatar,
            [`${pre}-active`]: active,
            [`${pre}-rtl`]: direction.value === 'rtl',
            [`${pre}-round`]: round,
            [hashId.value]: true,
          },
        );

        const rootStyle =
          contextStyle.value || mergedStyles.root
            ? [contextStyle.value, mergedStyles.root]
            : undefined;

        return wrapSSR(
          <div class={cls} style={rootStyle}>
            {avatarNode}
            {contentNode}
          </div>,
        );
      }
      return slots.default?.();
    };
  },
});

export default Skeleton;
