import Pagination from './Pagination';
import { withInstall } from '../_util/type';

export { paginationProps, paginationConfig } from './Pagination';
export type {
  PaginationProps,
  PaginationConfig,
  PaginationAlign,
  PaginationSemanticName,
  PaginationSemanticClassNames,
  PaginationSemanticStyles,
  PaginationClassNamesType,
  PaginationStylesType,
} from './Pagination';

export default withInstall(Pagination);
