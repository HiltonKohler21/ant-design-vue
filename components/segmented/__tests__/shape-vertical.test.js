import { mount } from '@vue/test-utils';
import Segmented from '..';

it('Segmented shape round + vertical', () => {
  const w = mount(Segmented, {
    props: { options: ['a', 'b'], value: 'a', shape: 'round', vertical: true },
  });
  const cls = w.element.getAttribute('class') || '';
  expect(cls).toContain('ant-segmented-shape-round');
  expect(cls).toContain('ant-segmented-vertical');
});
