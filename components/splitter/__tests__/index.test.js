import { nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import Splitter from '..';
import ConfigProvider from '../../config-provider';

describe('Splitter', () => {
  it('renders panels with children content and split bars without warnings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [
          <Splitter.Panel size="30%">
            <span class="p1">First panel</span>
          </Splitter.Panel>,
          <Splitter.Panel>
            <span class="p2">Second panel</span>
          </Splitter.Panel>,
        ],
      },
    });
    expect(wrapper.find('.ant-splitter').exists()).toBe(true);
    expect(wrapper.findAll('.ant-splitter-panel').length).toBe(2);
    expect(wrapper.findAll('.ant-splitter-bar').length).toBe(1);
    expect(wrapper.find('.p1').text()).toBe('First panel');
    expect(wrapper.find('.p2').text()).toBe('Second panel');
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 30%',
    );
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('formats numeric size as px in flex-basis', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [
          <Splitter.Panel size={150}>Left</Splitter.Panel>,
          <Splitter.Panel>Right</Splitter.Panel>,
        ],
      },
    });
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 150px',
    );
  });

  it('normalizes kebab-case default-size and bare collapsible attribute from Vue templates', async () => {
    const Demo = defineComponent({
      components: { ASplitter: Splitter, ASplitterPanel: Splitter.Panel },
      template: `
        <a-splitter style="height: 200px">
          <a-splitter-panel collapsible default-size="25%" min="15%">
            <div class="col-panel">Collapsible Panel</div>
          </a-splitter-panel>
          <a-splitter-panel>
            <div class="main-panel">Main Content</div>
          </a-splitter-panel>
        </a-splitter>
      `,
    });
    const wrapper = mount(Demo);
    await nextTick();
    expect(wrapper.find('.col-panel').text()).toBe('Collapsible Panel');
    expect(wrapper.find('.main-panel').text()).toBe('Main Content');
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 25%',
    );
    // aria-valuenow / aria-valuemin / aria-valuemax should be valid 0..100 percentages (not ~9900)
    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    expect(Number(dragger.attributes('aria-valuenow'))).toBe(25);
    expect(Number(dragger.attributes('aria-valuemin'))).toBe(15);
    expect(Number(dragger.attributes('aria-valuemax'))).toBe(100);
  });

  it('does not leak listeners or lock page with mask on fast click or after drag', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onResizeStart = jest.fn();
    const onResize = jest.fn();
    const onResizeEnd = jest.fn();

    const wrapper = mount(Splitter, {
      props: {
        onResizeStart,
        onResize,
        onResizeEnd,
      },
      slots: {
        default: () => [
          <Splitter.Panel defaultSize="40%">A</Splitter.Panel>,
          <Splitter.Panel>B</Splitter.Panel>,
        ],
      },
    });

    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    // Fast click: mousedown followed synchronously by mouseup before next frame
    await dragger.trigger('mousedown', { button: 0, pageX: 100, pageY: 50 });
    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 50 }));
    await nextTick();

    // Mask must be gone immediately
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(false);
    expect(onResizeStart).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledTimes(1);

    // Subsequent mousemove on window must NOT re-trigger movingIndex or mount mask
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 50 }));
    await nextTick();
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(false);
    expect(onResize).not.toHaveBeenCalled();

    // No invalid lifecycle hook warnings
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    wrapper.unmount();
  });

  it('releases mask on touchcancel and window blur', async () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [<Splitter.Panel>A</Splitter.Panel>, <Splitter.Panel>B</Splitter.Panel>],
      },
    });

    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    await dragger.trigger('mousedown', { button: 0, pageX: 100, pageY: 50 });
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(true);

    window.dispatchEvent(new Event('blur'));
    await nextTick();
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(false);
    wrapper.unmount();
  });

  it('supports vertical layout', () => {
    const wrapper = mount(Splitter, {
      props: { layout: 'vertical' },
      slots: {
        default: () => [<Splitter.Panel />, <Splitter.Panel />],
      },
    });
    expect(wrapper.element.getAttribute('class')).toContain('ant-splitter-vertical');
  });

  it('supports rootClassName', () => {
    const wrapper = mount(Splitter, {
      props: { rootClassName: 'my-splitter' },
      slots: {
        default: () => [<Splitter.Panel />, <Splitter.Panel />],
      },
    });
    expect(wrapper.element.getAttribute('class')).toContain('my-splitter');
  });

  it('marks panel hidden when size is 0', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [<Splitter.Panel size={0} />, <Splitter.Panel />],
      },
    });
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(true);
  });

  it('supports controlled size updates via @resize on Splitter', async () => {
    const Demo = defineComponent({
      components: { ASplitter: Splitter, ASplitterPanel: Splitter.Panel },
      data() {
        return { sizes: [150] };
      },
      template: `
        <a-splitter style="height: 200px" @resize="s => (sizes = s)">
          <a-splitter-panel :size="sizes[0]">
            <div class="ctrl-size">{{ sizes[0] }}</div>
          </a-splitter-panel>
          <a-splitter-panel :size="sizes[1]">
            <div>Flexible</div>
          </a-splitter-panel>
        </a-splitter>
      `,
    });
    const wrapper = mount(Demo);
    expect(wrapper.find('.ctrl-size').text()).toBe('150');
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 150px',
    );

    wrapper.vm.sizes = [220];
    await nextTick();
    expect(wrapper.find('.ctrl-size').text()).toBe('220');
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 220px',
    );
  });

  it('supports lazy preview bar and updates preview offset during drag', async () => {
    const wrapper = mount(Splitter, {
      props: { lazy: true },
      slots: {
        default: () => [
          <Splitter.Panel defaultSize="40%" min="20%" max="70%">
            A
          </Splitter.Panel>,
          <Splitter.Panel>B</Splitter.Panel>,
        ],
      },
    });
    // Simulate container resize so containerSize = 500
    const ro = wrapper.findComponent({ name: 'ResizeObserver' });
    ro.props('onResize')({ width: 500, height: 200, offsetWidth: 500, offsetHeight: 200 });
    await nextTick();

    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    await dragger.trigger('mousedown', { button: 0, pageX: 200, pageY: 50 });

    const moveEvent = new MouseEvent('mousemove');
    Object.defineProperty(moveEvent, 'pageX', { value: 250 });
    Object.defineProperty(moveEvent, 'pageY', { value: 50 });
    window.dispatchEvent(moveEvent);
    await nextTick();

    const preview = wrapper.find('.ant-splitter-bar-preview');
    expect(preview.classes()).toContain('ant-splitter-bar-preview-active');
    expect(preview.attributes('style')).toContain('--ant-splitter-bar-preview-offset: 50px');

    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(false);
    expect(wrapper.findAll('.ant-splitter-panel')[0].attributes('style')).toContain(
      'flex-basis: 250px',
    );
    wrapper.unmount();
  });

  it('renders and triggers collapsible bar cleanly with stopPropagation', async () => {
    const onCollapse = jest.fn();
    const wrapper = mount(Splitter, {
      props: { onCollapse },
      slots: {
        default: () => [
          <Splitter.Panel collapsible="" default-size="25%" min="15%">
            Left
          </Splitter.Panel>,
          <Splitter.Panel>Right</Splitter.Panel>,
        ],
      },
    });
    const ro = wrapper.findComponent({ name: 'ResizeObserver' });
    ro.props('onResize')({ width: 400, height: 200, offsetWidth: 400, offsetHeight: 200 });
    await nextTick();

    const collapseBtn = wrapper.find('.ant-splitter-bar-collapse-bar-start');
    expect(collapseBtn.exists()).toBe(true);

    await collapseBtn.trigger('click');
    await nextTick();

    expect(onCollapse).toHaveBeenCalledTimes(1);
    expect(onCollapse).toHaveBeenCalledWith([true, false], [0, 400]);
    expect(wrapper.find('.ant-splitter-mask').exists()).toBe(false);
    expect(wrapper.findAll('.ant-splitter-panel')[0].classes()).toContain(
      'ant-splitter-panel-hidden',
    );
    wrapper.unmount();
  });

  it('exposes Panel as static property', () => {
    expect(Splitter.Panel).toBeDefined();
  });

  it('supports ComponentToken defaults/overrides, RTL CSS, and ConfigProvider.splitter', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        splitter: {
          className: 'cp-splitter',
          style: { height: '180px' },
        },
        theme: {
          cssVar: true,
          components: {
            Splitter: {
              splitBarSize: 4,
              splitTriggerSize: 10,
              splitBarDraggableSize: 28,
              resizeSpinnerSize: 24,
            },
          },
        },
      },
      slots: {
        default: () => (
          <Splitter>
            <Splitter.Panel>A</Splitter.Panel>
            <Splitter.Panel>B</Splitter.Panel>
          </Splitter>
        ),
      },
    });
    await nextTick();
    const root = wrapper.find('.ant-splitter');
    expect(root.classes()).toContain('cp-splitter');
    expect(root.classes()).toContain('ant-splitter-rtl');
    expect(root.attributes('style')).toContain('height: 180px');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-splitter-rtl');
    expect(css).toContain('--ant-splitter-split-bar-size:4px');
    expect(css).toContain('--ant-splitter-split-trigger-size:10px');
    expect(css).toContain('--ant-splitter-split-bar-draggable-size:28px');
    expect(css).toContain('--ant-splitter-resize-spinner-size:24px');
  });

  it('supports orientation alias taking precedence over layout', () => {
    const wrapper = mount(Splitter, {
      props: { orientation: 'vertical', layout: 'horizontal' },
      slots: {
        default: () => [<Splitter.Panel>A</Splitter.Panel>, <Splitter.Panel>B</Splitter.Panel>],
      },
    });
    expect(wrapper.find('.ant-splitter').classes()).toContain('ant-splitter-vertical');
    expect(wrapper.find('.ant-splitter').classes()).not.toContain('ant-splitter-horizontal');
  });

  it('supports draggerIcon, collapsibleIcon, draggerClassName, draggerStyle, and draggerDoubleClick', async () => {
    const onDraggerDoubleClick = jest.fn();
    const Demo = defineComponent({
      components: { ASplitter: Splitter, ASplitterPanel: Splitter.Panel },
      setup() {
        return {
          onDraggerDoubleClick,
          draggerIcon: <span class="custom-dragger-icon">||</span>,
          collapsibleIcon: {
            start: <span class="custom-start-icon">&lt;</span>,
            end: <span class="custom-end-icon">&gt;</span>,
          },
          draggerClassName: { default: 'drag-default', active: 'drag-active' },
          draggerStyle: {
            default: { backgroundColor: 'rgb(1, 2, 3)' },
            active: { opacity: '0.5' },
          },
        };
      },
      template: `
        <a-splitter
          :dragger-icon="draggerIcon"
          :collapsible-icon="collapsibleIcon"
          :dragger-class-name="draggerClassName"
          :dragger-style="draggerStyle"
          @dragger-double-click="onDraggerDoubleClick"
        >
          <a-splitter-panel collapsible>A</a-splitter-panel>
          <a-splitter-panel collapsible>B</a-splitter-panel>
        </a-splitter>
      `,
    });

    const wrapper = mount(Demo);
    const ro = wrapper.findComponent({ name: 'ResizeObserver' });
    ro.props('onResize')({ width: 400, height: 200, offsetWidth: 400, offsetHeight: 200 });
    await nextTick();

    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    expect(dragger.classes()).toContain('ant-splitter-bar-dragger-customize');
    expect(dragger.classes()).toContain('drag-default');
    expect(dragger.classes()).not.toContain('drag-active');
    expect(dragger.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(wrapper.find('.ant-splitter-bar-dragger-icon .custom-dragger-icon').text()).toBe('||');

    expect(wrapper.find('.ant-splitter-bar-collapse-bar-start').classes()).toContain(
      'ant-splitter-bar-collapse-bar-customize',
    );
    expect(wrapper.find('.custom-start-icon').exists()).toBe(true);
    expect(wrapper.find('.custom-end-icon').exists()).toBe(true);

    // Double click triggers event with bar index 0
    await dragger.trigger('dblclick');
    expect(onDraggerDoubleClick).toHaveBeenCalledTimes(1);
    expect(onDraggerDoubleClick).toHaveBeenCalledWith(0);

    // Active drag applies active draggerClassName and active draggerStyle
    await dragger.trigger('mousedown', { button: 0, pageX: 100, pageY: 50 });
    await nextTick();
    expect(dragger.classes()).toContain('drag-active');
    expect(dragger.attributes('style')).toContain('opacity: 0.5');

    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(dragger.classes()).not.toContain('drag-active');
    wrapper.unmount();
  });

  it('merges functional classNames and styles from ConfigProvider.splitter and component props', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        splitter: {
          classNames: ({ props }) => ({
            root: `ctx-root-${props.orientation}`,
            panel: 'ctx-panel',
            dragger: 'ctx-dragger',
          }),
          styles: {
            root: { padding: '4px' },
            panel: { margin: '2px' },
            dragger: { default: { zIndex: 5 } },
          },
        },
      },
      slots: {
        default: () => (
          <Splitter
            orientation="vertical"
            classNames={({ props }) => ({
              root: `prop-root-${props.orientation}`,
              panel: 'prop-panel',
              dragger: { default: 'prop-dragger', active: 'prop-dragger-active' },
            })}
            styles={({ props }) => ({
              root: { borderWidth: props.orientation === 'vertical' ? '2px' : '1px' },
              panel: { color: 'rgb(10, 20, 30)' },
              dragger: { backgroundColor: 'rgb(200, 100, 50)' },
            })}
          >
            <Splitter.Panel>One</Splitter.Panel>
            <Splitter.Panel>Two</Splitter.Panel>
          </Splitter>
        ),
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-splitter');
    expect(root.classes()).toContain('ctx-root-vertical');
    expect(root.classes()).toContain('prop-root-vertical');
    expect(root.attributes('style')).toContain('padding: 4px');
    expect(root.attributes('style')).toContain('border-width: 2px');

    const panels = wrapper.findAll('.ant-splitter-panel');
    expect(panels[0].classes()).toContain('ctx-panel');
    expect(panels[0].classes()).toContain('prop-panel');
    expect(panels[0].attributes('style')).toContain('margin: 2px');
    expect(panels[0].attributes('style')).toContain('color: rgb(10, 20, 30)');

    const dragger = wrapper.find('.ant-splitter-bar-dragger');
    expect(dragger.classes()).toContain('ctx-dragger');
    expect(dragger.classes()).toContain('prop-dragger');
    expect(dragger.attributes('style')).toContain('z-index: 5');
    expect(dragger.attributes('style')).toContain('background-color: rgb(200, 100, 50)');
  });

  it('supports collapsible.motion, collapsible.icon render functions, draggerIcon=null, and showCollapsibleIcon modes', async () => {
    const wrapper = mount(Splitter, {
      props: {
        draggerIcon: null,
        collapsible: {
          motion: true,
          icon: {
            start: () => <span class="fn-start">S</span>,
            end: () => <span class="fn-end">E</span>,
          },
        },
      },
      slots: {
        default: () => [
          <Splitter.Panel collapsible={{ start: true, end: true, showCollapsibleIcon: true }}>
            A
          </Splitter.Panel>,
          <Splitter.Panel collapsible={{ start: true, end: true, showCollapsibleIcon: false }}>
            B
          </Splitter.Panel>,
          <Splitter.Panel collapsible={{ start: true, end: true, showCollapsibleIcon: 'auto' }}>
            C
          </Splitter.Panel>,
        ],
      },
    });
    const ro = wrapper.findComponent({ name: 'ResizeObserver' });
    ro.props('onResize')({ width: 600, height: 200, offsetWidth: 600, offsetHeight: 200 });
    await nextTick();

    expect(wrapper.vm.nativeElement).toBe(wrapper.find('.ant-splitter').element);
    expect(wrapper.findAll('.ant-splitter-panel')[0].classes()).toContain(
      'ant-splitter-panel-transition',
    );
    expect(wrapper.find('.ant-splitter-bar-dragger').classes()).toContain(
      'ant-splitter-bar-dragger-customize',
    );
    expect(wrapper.find('.fn-start').text()).toBe('S');
    expect(wrapper.find('.fn-end').text()).toBe('E');
    expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible').length).toBeGreaterThan(
      0,
    );
    expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-hover-only').length).toBeGreaterThan(0);
    wrapper.unmount();
  });
});
