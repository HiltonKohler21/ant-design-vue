import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Popover from '..';
import ConfigProvider from '../../config-provider';

const waitPopup = async () => {
  await nextTick();
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 60));
  await nextTick();
};

describe('Popover.semantic', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supports static classNames and styles for root, container, title, content, arrow', async () => {
    const wrapper = mount(Popover, {
      props: {
        open: true,
        title: 'Pop Title',
        content: 'Pop Content',
        classNames: {
          root: 'pop-root',
          container: 'pop-container',
          title: 'pop-title',
          content: 'pop-content',
          arrow: 'pop-arrow',
        },
        styles: {
          root: { backgroundColor: 'rgb(1, 2, 3)' },
          container: { padding: '20px' },
          title: { color: 'rgb(4, 5, 6)' },
          content: { fontSize: '15px' },
          arrow: { opacity: '0.7' },
        },
      },
      slots: { default: () => <span>trigger</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    expect(popup).not.toBeNull();

    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popover-title');
    const contentEl = popup.querySelector('.ant-popover-inner-content');
    const arrowEl = popup.querySelector('.ant-popover-arrow');

    expect(popup.className).toContain('pop-root');
    expect(containerEl.className).toContain('pop-container');
    expect(titleEl.className).toContain('pop-title');
    expect(contentEl.className).toContain('pop-content');
    expect(arrowEl.className).toContain('pop-arrow');

    expect(popup.style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(containerEl.style.padding).toBe('20px');
    expect(titleEl.style.color).toBe('rgb(4, 5, 6)');
    expect(contentEl.style.fontSize).toBe('15px');
    expect(arrowEl.style.opacity).toBe('0.7');

    wrapper.unmount();
  });

  it('supports body as backwards-compatible alias for container', async () => {
    const wrapper = mount(Popover, {
      props: {
        open: true,
        title: 'Title',
        content: 'Content',
        classNames: {
          body: 'pop-body-alias',
        },
        styles: {
          body: { padding: '14px', color: 'rgb(7, 8, 9)' },
        },
      },
      slots: { default: () => <span>trigger</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    const containerEl = popup.querySelector('.ant-popover-inner');

    expect(containerEl.className).toContain('pop-body-alias');
    expect(containerEl.style.padding).toBe('14px');
    expect(containerEl.style.color).toBe('rgb(7, 8, 9)');

    // When both body and container are provided, container style takes precedence
    await wrapper.setProps({
      classNames: { body: 'pop-body-alias', container: 'pop-container-new' },
      styles: { body: { padding: '14px' }, container: { padding: '24px' } },
    });
    await waitPopup();
    expect(containerEl.className).toContain('pop-body-alias');
    expect(containerEl.className).toContain('pop-container-new');
    expect(containerEl.style.padding).toBe('24px');

    wrapper.unmount();
  });

  it('supports functional classNames and styles receiving { props } without warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const classNamesFn = jest.fn(({ props }) => ({
      root: `fn-root-${props.placement}`,
      container: `fn-container-${props.trigger}`,
      title: 'fn-title',
      content: 'fn-content',
      arrow: `fn-arrow-${props.placement}`,
    }));
    const stylesFn = jest.fn(({ props }) => ({
      root: { zIndex: props.placement === 'top' ? '1001' : '1002' },
      container: { borderRadius: props.placement === 'top' ? '6px' : '12px' },
      title: { fontWeight: '600' },
      content: { lineHeight: '20px' },
      arrow: { opacity: props.placement === 'top' ? '0.6' : '0.9' },
    }));

    const wrapper = mount(Popover, {
      props: {
        open: true,
        placement: 'top',
        trigger: 'click',
        title: 'Dynamic Title',
        content: 'Dynamic Content',
        classNames: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => <span>trigger</span> },
      attachTo: 'body',
    });

    await waitPopup();
    const popup = wrapper.vm.getPopupDomNode();
    expect(classNamesFn).toHaveBeenCalled();
    expect(stylesFn).toHaveBeenCalled();

    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popover-title');
    const contentEl = popup.querySelector('.ant-popover-inner-content');
    const arrowEl = popup.querySelector('.ant-popover-arrow');

    expect(popup.className).toContain('fn-root-top');
    expect(containerEl.className).toContain('fn-container-click');
    expect(titleEl.className).toContain('fn-title');
    expect(contentEl.className).toContain('fn-content');
    expect(arrowEl.className).toContain('fn-arrow-top');

    expect(popup.style.zIndex).toBe('1001');
    expect(containerEl.style.borderRadius).toBe('6px');
    expect(titleEl.style.fontWeight).toBe('600');
    expect(contentEl.style.lineHeight).toBe('20px');
    expect(arrowEl.style.opacity).toBe('0.6');

    await wrapper.setProps({ placement: 'bottom' });
    await waitPopup();

    expect(popup.className).toContain('fn-root-bottom');
    expect(popup.style.zIndex).toBe('1002');
    expect(containerEl.style.borderRadius).toBe('12px');
    expect(arrowEl.className).toContain('fn-arrow-bottom');
    expect(arrowEl.className).not.toContain('fn-arrow-top');
    expect(arrowEl.style.opacity).toBe('0.9');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    wrapper.unmount();
  });

  it('merges ConfigProvider popover functional semantics with component props', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <ConfigProvider
              popover={{
                classNames: ({ props }) => ({
                  root: `ctx-pop-${props.placement}`,
                  container: 'ctx-container',
                  arrow: 'ctx-arrow',
                }),
                styles: () => ({
                  root: { color: 'rgb(10, 10, 10)' },
                  container: { margin: '4px' },
                  arrow: { opacity: '0.5' },
                }),
              }}
            >
              <Popover
                ref="pop"
                open
                placement="bottom"
                title="T"
                content="C"
                classNames={() => ({
                  root: 'own-pop',
                  title: 'own-title',
                  content: 'own-content',
                  arrow: 'own-arrow',
                })}
                styles={() => ({
                  container: { padding: '8px' },
                  arrow: { zIndex: '2' },
                })}
              >
                <span>trigger</span>
              </Popover>
            </ConfigProvider>
          );
        },
      },
      { attachTo: 'body' },
    );

    await waitPopup();
    const popup = wrapper.vm.$refs.pop.getPopupDomNode();
    const containerEl = popup.querySelector('.ant-popover-inner');
    const titleEl = popup.querySelector('.ant-popover-title');
    const contentEl = popup.querySelector('.ant-popover-inner-content');
    const arrowEl = popup.querySelector('.ant-popover-arrow');

    expect(popup.className).toContain('ctx-pop-bottom');
    expect(popup.className).toContain('own-pop');
    expect(popup.style.color).toBe('rgb(10, 10, 10)');
    expect(containerEl.className).toContain('ctx-container');
    expect(containerEl.style.margin).toBe('4px');
    expect(containerEl.style.padding).toBe('8px');
    expect(titleEl.className).toContain('own-title');
    expect(contentEl.className).toContain('own-content');
    expect(arrowEl.className).toContain('ctx-arrow');
    expect(arrowEl.className).toContain('own-arrow');
    expect(arrowEl.style.opacity).toBe('0.5');
    expect(arrowEl.style.zIndex).toBe('2');

    wrapper.unmount();
  });
});
