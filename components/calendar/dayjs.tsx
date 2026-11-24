import generateConfig from '../vc-picker/generate/dayjs';
import { withInstall } from '../_util/type';
import type {
  CalendarProps,
  CalendarMode,
  CalendarSemanticName,
  CalendarSemanticClassNames,
  CalendarSemanticStyles,
  CalendarClassNamesType,
  CalendarStylesType,
} from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar(generateConfig);

export type {
  CalendarProps,
  CalendarMode,
  CalendarSemanticName,
  CalendarSemanticClassNames,
  CalendarSemanticStyles,
  CalendarClassNamesType,
  CalendarStylesType,
};
export default withInstall(Calendar);
