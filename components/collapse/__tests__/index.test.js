import { mount } from '@vue/test-utils';
import Collapse from '..';

describe('Collapse', () => {
  it('should support remove expandIcon', () => {
    const wrapper = mount({
      render() {
        return (
          <Collapse expandIcon={() => null}>
            <Collapse.Panel header="header" />
          </Collapse>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('supports size prop (small / middle / large) and bare svg icon alignment style', () => {
    const smallWrapper = mount({
      render() {
        return (
          <Collapse size="small">
            <Collapse.Panel key="1" header="Small" />
          </Collapse>
        );
      },
    });
    expect(smallWrapper.find('.ant-collapse').classes()).toContain('ant-collapse-small');

    const largeWrapper = mount({
      render() {
        return (
          <Collapse size="large">
            <Collapse.Panel key="1" header="Large" />
          </Collapse>
        );
      },
    });
    expect(largeWrapper.find('.ant-collapse').classes()).toContain('ant-collapse-large');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toMatch(/\.ant-collapse-header-text\s*>\s*svg/);
    expect(css).toContain('vertical-align:middle');
  });
});
