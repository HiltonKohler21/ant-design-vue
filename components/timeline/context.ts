import type { CSSProperties, InjectionKey, Ref } from 'vue';
import { inject, provide, ref } from 'vue';
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

export type TimelineSemanticName =
  | 'root'
  | 'item'
  | 'itemWrapper'
  | 'itemIcon'
  | 'itemSection'
  | 'itemHeader'
  | 'itemTitle'
  | 'itemContent'
  | 'itemRail';

export type TimelineItemSemanticName =
  | 'root'
  | 'wrapper'
  | 'icon'
  | 'section'
  | 'header'
  | 'title'
  | 'content'
  | 'rail';

export type TimelineSemanticClassNames = SemanticClassNames<TimelineSemanticName>;
export type TimelineSemanticStyles = SemanticStyles<TimelineSemanticName>;
export type TimelineClassNamesType = SemanticClassNamesType<
  Record<string, any>,
  TimelineSemanticName
>;
export type TimelineStylesType = SemanticStylesType<Record<string, any>, TimelineSemanticName>;

export type TimelineItemSemanticClassNames = SemanticClassNames<TimelineItemSemanticName>;
export type TimelineItemSemanticStyles = SemanticStyles<TimelineItemSemanticName>;

export interface TimelineContextProps {
  classNames: Ref<TimelineSemanticClassNames>;
  styles: Ref<TimelineSemanticStyles>;
}

const TimelineContextKey: InjectionKey<TimelineContextProps> = Symbol('TimelineContextKey');

export const useProvideTimeline = (props: TimelineContextProps) => {
  provide(TimelineContextKey, props);
};

export const useInjectTimeline = (): TimelineContextProps => {
  return inject(TimelineContextKey, {
    classNames: ref<TimelineSemanticClassNames>({}),
    styles: ref<TimelineSemanticStyles>({}),
  });
};

export type { CSSProperties };
