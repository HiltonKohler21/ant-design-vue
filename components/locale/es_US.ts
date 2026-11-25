/* eslint-disable no-template-curly-in-string */
import esES from './es_ES';
import type { Locale } from '../locale-provider';
import Calendar from '../calendar/locale/es_US';
import DatePicker from '../date-picker/locale/es_US';

const localeValues: Locale = {
  ...esES,
  locale: 'es-us',
  DatePicker,
  Calendar,
};

export default localeValues;
