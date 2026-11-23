import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Popconfirm from '..';
import ConfigProvider from '../../config-provider';

const waitPopup = async () => {
  await nextTick();
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 60));
  await nextTick();
};

describe('Popconfirm.semantic', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supports static classNames and styles for root, container, title, content, arrow, icon', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        open: true,
        title: 'Delete this item?',
        description: 'This action cannot be undone.',
        classNames: {
          root: 'pc-root',
          container: 'pc-container',
          title: 'pc-title',
          content: 'pc-content',
          arrow: 'pc-arrow',
          icon: 'pc-icon',
        },
        styles: {
          root: { backgroundColor: 'rgb(1, 2, 3)' },
          container: { padding: '18px' },
          title: { color: 'rgb(4, 5, 6)' },
          content: { fontSize: '13px' },
          arrow: { opacity: '0.8' },
          icon: { color: 'rgb(7, 8, 9)' },
        },
      },
      slots: { default: () => <span>Delete</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    expect(popup).not.toBeNull();

    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popconfirm-message-title');
    const contentEl = popup.querySelector('.ant-popconfirm-description');
    const arrowEl = popup.querySelector('.ant-popover-arrow');
    const iconEl = popup.querySelector('.ant-popconfirm-message-icon');

    expect(popup.className).toContain('pc-root');
    expect(containerEl.className).toContain('pc-container');
    expect(titleEl.className).toContain('pc-title');
    expect(contentEl.className).toContain('pc-content');
    expect(arrowEl.className).toContain('pc-arrow');
    expect(iconEl.className).toContain('pc-icon');

    expect(popup.style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(containerEl.style.padding).toBe('18px');
    expect(titleEl.style.color).toBe('rgb(4, 5, 6)');
    expect(contentEl.style.fontSize).toBe('13px');
    expect(arrowEl.style.opacity).toBe('0.8');
    expect(iconEl.style.color).toBe('rgb(7, 8, 9)');

    wrapper.unmount();
  });

  it('supports body as backwards-compatible alias for container', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        open: true,
        title: 'Confirm?',
        description: 'Details',
        classNames: {
          body: 'pc-body-alias',
        },
        styles: {
          body: { padding: '10px', color: 'rgb(11, 22, 33)' },
        },
      },
      slots: { default: () => <span>Action</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    const containerEl = popup.querySelector('.ant-popover-inner');

    expect(containerEl.className).toContain('pc-body-alias');
    expect(containerEl.style.padding).toBe('10px');
    expect(containerEl.style.color).toBe('rgb(11, 22, 33)');

    await wrapper.setProps({
      classNames: { body: 'pc-body-alias', container: 'pc-container-new' },
      styles: { body: { padding: '10px' }, container: { padding: '22px' } },
    });
    await waitPopup();
    expect(containerEl.className).toContain('pc-body-alias');
    expect(containerEl.className).toContain('pc-container-new');
    expect(containerEl.style.padding).toBe('22px');

    wrapper.unmount();
  });

  it('supports functional classNames and styles receiving { props } without warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const classNamesFn = jest.fn(({ props }) => ({
      root: `fn-pc-root-${props.placement}`,
      container: `fn-pc-container-${props.okType}`,
      title: 'fn-pc-title',
      content: 'fn-pc-content',
      arrow: `fn-pc-arrow-${props.placement}`,
      icon: 'fn-pc-icon',
    }));
    const stylesFn = jest.fn(({ props }) => ({
      root: { zIndex: props.placement === 'top' ? '2001' : '2002' },
      container: { padding: props.placement === 'top' ? '12px' : '16px' },
      title: { fontWeight: '700' },
      content: { color: 'rgb(50, 60, 70)' },
      arrow: { opacity: props.placement === 'top' ? '0.5' : '0.9' },
      icon: { fontSize: '18px' },
    }));

    const wrapper = mount(Popconfirm, {
      props: {
        open: true,
        placement: 'top',
        okType: 'danger',
        title: 'Sure?',
        description: 'Extra info',
        classNames: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => <span>Delete</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    expect(classNamesFn).toHaveBeenCalled();
    expect(stylesFn).toHaveBeenCalled();

    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popconfirm-message-title');
    const contentEl = popup.querySelector('.ant-popconfirm-description');
    const arrowEl = popup.querySelector('.ant-popover-arrow');
    const iconEl = popup.querySelector('.ant-popconfirm-message-icon');

    expect(popup.className).toContain('fn-pc-root-top');
    expect(containerEl.className).toContain('fn-pc-container-danger');
    expect(titleEl.className).toContain('fn-pc-title');
    expect(contentEl.className).toContain('fn-pc-content');
    expect(arrowEl.className).toContain('fn-pc-arrow-top');
    expect(iconEl.className).toContain('fn-pc-icon');

    expect(popup.style.zIndex).toBe('2001');
    expect(containerEl.style.padding).toBe('12px');
    expect(titleEl.style.fontWeight).toBe('700');
    expect(contentEl.style.color).toBe('rgb(50, 60, 70)');
    expect(arrowEl.style.opacity).toBe('0.5');
    expect(iconEl.style.fontSize).toBe('18px');

    await wrapper.setProps({ placement: 'bottom' });
    await waitPopup();

    expect(popup.className).toContain('fn-pc-root-bottom');
    expect(popup.style.zIndex).toBe('2002');
    expect(containerEl.style.padding).toBe('16px');
    expect(arrowEl.className).toContain('fn-pc-arrow-bottom');
    expect(arrowEl.className).not.toContain('fn-pc-arrow-top');
    expect(arrowEl.style.opacity).toBe('0.9');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    wrapper.unmount();
  });

  it('merges ConfigProvider popconfirm functional semantics without leaking popover config', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <ConfigProvider
              popover={{
                classNames: { root: 'leaked-popover-root' },
              }}
              popconfirm={{
                classNames: ({ props }) => ({
                  root: `ctx-pc-${props.placement}`,
                  container: 'ctx-pc-container',
                  arrow: 'ctx-pc-arrow',
                }),
                styles: () => ({
                  root: { color: 'rgb(12, 34, 56)' },
                  container: { margin: '5px' },
                  arrow: { opacity: '0.4' },
                }),
              }}
            >
              <Popconfirm
                ref="pc"
                open
                placement="bottom"
                title="Title"
                description="Desc"
                classNames={() => ({
                  root: 'own-pc-root',
                  title: 'own-pc-title',
                  content: 'own-pc-content',
                  arrow: 'own-pc-arrow',
                })}
                styles={() => ({
                  container: { padding: '9px' },
                  arrow: { zIndex: '3' },
                })}
              >
                <span>Delete</span>
              </Popconfirm>
            </ConfigProvider>
          );
        },
      },
      { attachTo: 'body' },
    );

    await waitPopup();
    const popup = wrapper.vm.$refs.pc.getPopupDomNode();
    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popconfirm-message-title');
    const contentEl = popup.querySelector('.ant-popconfirm-description');
    const arrowEl = popup.querySelector('.ant-popover-arrow');

    expect(popup.className).not.toContain('leaked-popover-root');
    expect(popup.className).toContain('ctx-pc-bottom');
    expect(popup.className).toContain('own-pc-root');
    expect(popup.style.color).toBe('rgb(12, 34, 56)');
    expect(containerEl.className).toContain('ctx-pc-container');
    expect(containerEl.style.margin).toBe('5px');
    expect(containerEl.style.padding).toBe('9px');
    expect(titleEl.className).toContain('own-pc-title');
    expect(contentEl.className).toContain('own-pc-content');
    expect(arrowEl.className).toContain('ctx-pc-arrow');
    expect(arrowEl.className).toContain('own-pc-arrow');
    expect(arrowEl.style.opacity).toBe('0.4');
    expect(arrowEl.style.zIndex).toBe('3');

    wrapper.unmount();
  });
});
