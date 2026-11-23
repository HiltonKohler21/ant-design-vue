import { mount } from '@vue/test-utils';
import Collapse from '..';
import ConfigProvider from '../../config-provider';

describe('Collapse v6 APIs & Semantic DOM', () => {
  it('supports expandIconPlacement and keeps expandIconPosition backwards-compatible', () => {
    const wEnd = mount({
      render() {
        return (
          <Collapse expandIconPlacement="end">
            <Collapse.Panel key="1" header="H1">
              Body 1
            </Collapse.Panel>
          </Collapse>
        );
      },
    });
    expect(wEnd.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-end');

    // expandIconPlacement takes precedence over expandIconPosition
    const wPriority = mount({
      render() {
        return (
          <Collapse expandIconPlacement="start" expandIconPosition="end">
            <Collapse.Panel key="1" header="H1">
              Body 1
            </Collapse.Panel>
          </Collapse>
        );
      },
    });
    expect(wPriority.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-start');
    expect(wPriority.find('.ant-collapse').classes()).not.toContain(
      'ant-collapse-icon-position-end',
    );

    // Legacy left / right values
    const wRight = mount({
      render() {
        return (
          <Collapse expandIconPosition="right">
            <Collapse.Panel key="1" header="H1">
              Body 1
            </Collapse.Panel>
          </Collapse>
        );
      },
    });
    expect(wRight.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-end');

    const wLeft = mount({
      render() {
        return (
          <Collapse expandIconPosition="left">
            <Collapse.Panel key="1" header="H1">
              Body 1
            </Collapse.Panel>
          </Collapse>
        );
      },
    });
    expect(wLeft.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-start');
  });

  it('supports static semantic classNames and styles for root, header, title, body, and icon', () => {
    const wrapper = mount({
      render() {
        return (
          <Collapse
            activeKey={['1']}
            classNames={{
              root: 'custom-root',
              header: 'custom-header',
              title: 'custom-title',
              body: 'custom-body',
              icon: 'custom-icon',
            }}
            styles={{
              root: { borderColor: 'rgb(255, 0, 0)' },
              header: { backgroundColor: 'rgb(0, 0, 255)' },
              title: { color: 'rgb(0, 128, 0)' },
              body: { padding: '20px' },
              icon: { color: 'rgb(128, 0, 128)' },
            }}
          >
            <Collapse.Panel key="1" header="Panel Title">
              Panel Body
            </Collapse.Panel>
          </Collapse>
        );
      },
    });

    const root = wrapper.find('.ant-collapse');
    const header = wrapper.find('.ant-collapse-header');
    const title = wrapper.find('.ant-collapse-header-text');
    const body = wrapper.find('.ant-collapse-content-box');
    const icon = wrapper.find('.ant-collapse-expand-icon');

    expect(root.classes()).toContain('custom-root');
    expect(header.classes()).toContain('custom-header');
    expect(title.classes()).toContain('custom-title');
    expect(body.classes()).toContain('custom-body');
    expect(icon.classes()).toContain('custom-icon');

    expect(root.attributes('style')).toContain('border-color: rgb(255, 0, 0)');
    expect(header.attributes('style')).toContain('background-color: rgb(0, 0, 255)');
    expect(title.attributes('style')).toContain('color: rgb(0, 128, 0)');
    expect(body.attributes('style')).toContain('padding: 20px');
    expect(icon.attributes('style')).toContain('color: rgb(128, 0, 128)');
  });

  it('supports functional classNames and styles merged with ConfigProvider.collapse', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            collapse={{
              classNames: {
                root: 'ctx-root',
                header: 'ctx-header',
                body: 'ctx-body',
              },
              styles: {
                header: { fontWeight: '600' },
                title: { letterSpacing: '1px' },
              },
            }}
          >
            <Collapse
              activeKey={['1']}
              size="large"
              ghost
              expandIconPlacement="end"
              classNames={({ props }) => ({
                root: `size-${props.size}`,
                header: props.ghost ? 'ghost-header' : 'normal-header',
                title: 'fn-title',
                body: 'fn-body',
                icon: `icon-${props.expandIconPlacement}`,
              })}
              styles={({ props }) => ({
                root: { borderWidth: props.ghost ? '0px' : '1px' },
                header: { fontSize: props.size === 'large' ? '18px' : '14px' },
                body: { padding: '16px' },
                icon: { marginLeft: '8px' },
              })}
            >
              <Collapse.Panel key="1" header="Title">
                Content
              </Collapse.Panel>
            </Collapse>
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-collapse');
    const header = wrapper.find('.ant-collapse-header');
    const title = wrapper.find('.ant-collapse-header-text');
    const body = wrapper.find('.ant-collapse-content-box');
    const icon = wrapper.find('.ant-collapse-expand-icon');

    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('size-large');
    expect(header.classes()).toContain('ctx-header');
    expect(header.classes()).toContain('ghost-header');
    expect(title.classes()).toContain('fn-title');
    expect(body.classes()).toContain('ctx-body');
    expect(body.classes()).toContain('fn-body');
    expect(icon.classes()).toContain('icon-end');

    expect(root.attributes('style')).toContain('border-width: 0px');
    expect(header.attributes('style')).toContain('font-weight: 600');
    expect(header.attributes('style')).toContain('font-size: 18px');
    expect(title.attributes('style')).toContain('letter-spacing: 1px');
    expect(body.attributes('style')).toContain('padding: 16px');
    expect(icon.attributes('style')).toContain('margin-left: 8px');
  });
});
