import Progress from './progress';
import { withInstall } from '../_util/type';

export type {
  ProgressProps,
  ProgressSize,
  ProgressSteps,
  GapPlacement,
  GapPosition,
  ProgressSemanticName,
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
  ProgressClassNamesType,
  ProgressStylesType,
} from './props';

export default withInstall(Progress);
