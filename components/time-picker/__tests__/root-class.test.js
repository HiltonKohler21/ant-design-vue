import { mount } from '@vue/test-utils';
import TimePicker from '..';
import DatePicker from '../../date-picker';

it('TimePicker rootClassName', () => {
  const w = mount(TimePicker, { props: { rootClassName: 'tp-root', open: false } });
  expect(w.html()).toContain('tp-root');
});

it('DatePicker rootClassName', () => {
  const w = mount(DatePicker, { props: { rootClassName: 'dp-root', open: false } });
  expect(w.html()).toContain('dp-root');
});
