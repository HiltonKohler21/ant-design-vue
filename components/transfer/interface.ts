import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type PaginationType =
  | boolean
  | {
      pageSize?: number;
      simple?: boolean;
      showSizeChanger?: boolean;
      showLessItems?: boolean;
    };

export type TransferSectionSemanticName =
  | 'section'
  | 'header'
  | 'title'
  | 'body'
  | 'list'
  | 'item'
  | 'itemIcon'
  | 'itemContent'
  | 'footer';

export type TransferSemanticName = 'root' | 'actions' | TransferSectionSemanticName;

export type TransferSectionSemanticClassNames = SemanticClassNames<TransferSectionSemanticName>;
export type TransferSectionSemanticStyles = SemanticStyles<TransferSectionSemanticName>;

export type TransferSemanticClassNames = SemanticClassNames<TransferSemanticName> & {
  source?: TransferSectionSemanticClassNames;
  target?: TransferSectionSemanticClassNames;
};

export type TransferSemanticStyles = SemanticStyles<TransferSemanticName> & {
  source?: TransferSectionSemanticStyles;
  target?: TransferSectionSemanticStyles;
};
