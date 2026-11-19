import { mount } from '@vue/test-utils';
import AutoComplete from '..';
import Select from '../../select';

it('AutoComplete 透传 dropdownRender / dropdownStyle / onDropdownVisibleChange', () => {
  const w = mount(AutoComplete, {
    props: {
      options: [],
      dropdownRender: () => <div class="ac-render" />,
      dropdownStyle: { color: 'red' },
      onDropdownVisibleChange: () => {},
    },
  });
  expect(w.findComponent(Select).exists()).toBe(true);
  expect(w.html()).not.toContain('dropdownrender');
});
