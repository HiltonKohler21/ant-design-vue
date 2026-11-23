import { mount } from '@vue/test-utils';
import Dropdown from '..';
import Menu from '../../menu';
import Trigger from '../../vc-trigger';

describe('Dropdown autoAdjustOverflow', () => {
  const createOverlay = () => (
    <Menu>
      <Menu.Item key="1">Item 1</Menu.Item>
    </Menu>
  );

  it('defaults autoAdjustOverflow to true (adjustX: 1, adjustY: 1)', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown v-slots={{ overlay: createOverlay }}>
            <a class="dd-trigger">Hover me</a>
          </Dropdown>
        );
      },
    });
    const trigger = wrapper.findComponent(Trigger);
    expect(trigger.props('builtinPlacements').bottomLeft.overflow).toEqual({
      adjustX: 1,
      adjustY: 1,
    });
    expect(wrapper.find('.dd-trigger').attributes('autoadjustoverflow')).toBeUndefined();
  });

  it('disables overflow adjustment when autoAdjustOverflow is false', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown autoAdjustOverflow={false} v-slots={{ overlay: createOverlay }}>
            <a class="dd-trigger">Hover me</a>
          </Dropdown>
        );
      },
    });
    const trigger = wrapper.findComponent(Trigger);
    expect(trigger.props('builtinPlacements').bottomLeft.overflow).toEqual({
      adjustX: 0,
      adjustY: 0,
    });
    expect(wrapper.find('.dd-trigger').attributes('autoadjustoverflow')).toBeUndefined();
  });

  it('supports object config for autoAdjustOverflow', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown
            autoAdjustOverflow={{ adjustX: 1, adjustY: 0 }}
            v-slots={{ overlay: createOverlay }}
          >
            <a>Hover me</a>
          </Dropdown>
        );
      },
    });
    const trigger = wrapper.findComponent(Trigger);
    expect(trigger.props('builtinPlacements').bottomLeft.overflow).toEqual({
      adjustX: 1,
      adjustY: 0,
    });
  });

  it('forwards autoAdjustOverflow from Dropdown.Button to inner Dropdown', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown.Button autoAdjustOverflow={false} v-slots={{ overlay: createOverlay }}>
            Action
          </Dropdown.Button>
        );
      },
    });
    const dropdown = wrapper.findComponent({ name: 'ADropdown' });
    expect(dropdown.props('autoAdjustOverflow')).toBe(false);
    const trigger = wrapper.findComponent(Trigger);
    expect(trigger.props('builtinPlacements').bottomRight.overflow).toEqual({
      adjustX: 0,
      adjustY: 0,
    });
  });
});
