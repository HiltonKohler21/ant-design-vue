import { mount } from '@vue/test-utils';
import Flex from '..';
import ConfigProvider from '../../config-provider';

describe('Flex orientation (v6)', () => {
  it('supports orientation="vertical" and applies stretch align by default', () => {
    const wrapper = mount({
      render() {
        return <Flex orientation="vertical">content</Flex>;
      },
    });
    expect(wrapper.classes()).toContain('ant-flex-vertical');
    expect(wrapper.classes()).toContain('ant-flex-align-stretch');
    expect(wrapper.attributes('orientation')).toBeUndefined();
  });

  it('prioritizes orientation over vertical prop and ConfigProvider.flex.vertical', () => {
    const wHorizontal = mount({
      render() {
        return (
          <ConfigProvider flex={{ vertical: true }}>
            <Flex orientation="horizontal" vertical>
              content
            </Flex>
          </ConfigProvider>
        );
      },
    });
    const el = wHorizontal.find('.ant-flex');
    expect(el.classes()).not.toContain('ant-flex-vertical');
    expect(el.classes()).not.toContain('ant-flex-align-stretch');

    const wVertical = mount({
      render() {
        return (
          <Flex orientation="vertical" vertical={false}>
            content
          </Flex>
        );
      },
    });
    expect(wVertical.classes()).toContain('ant-flex-vertical');
    expect(wVertical.classes()).toContain('ant-flex-align-stretch');
  });

  it('falls back to vertical prop and ConfigProvider.flex.vertical when orientation is unset', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider flex={{ vertical: true }}>
            <Flex>content</Flex>
          </ConfigProvider>
        );
      },
    });
    const el = wrapper.find('.ant-flex');
    expect(el.classes()).toContain('ant-flex-vertical');
    expect(el.classes()).toContain('ant-flex-align-stretch');
  });
});
