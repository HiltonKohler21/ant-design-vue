import { nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import Splitter from '..';

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
});
