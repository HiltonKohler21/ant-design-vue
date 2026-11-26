import { createApp, nextTick } from 'vue';
import { asyncExpect } from '../../../tests/utils';
import { mount } from '@vue/test-utils';
import Tooltip, { TooltipUniqueProvider } from '..';
import ConfigProvider from '../../config-provider';
import Dropdown from '../../dropdown';
import Menu from '../../menu';
import mountTest from '../../../tests/shared/mountTest';

describe('Tooltip', () => {
  mountTest(Tooltip);
  mountTest(TooltipUniqueProvider);

  it('check `onOpenChange` arguments', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(
      {
        props: ['title', 'open'],
        render() {
          const props = {
            title: this.title || '',
            mouseEnterDelay: 0,
            mouseLeaveDelay: 0,
            onOpenChange,
          };
          if (this.open !== undefined) {
            props.open = this.open;
          }
          return (
            <Tooltip ref="tooltip" {...props}>
              <div id="hello">Hello world!</div>
            </Tooltip>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );

    let div = null;
    let lastCount = null;
    await asyncExpect(() => {
      // `title` is empty.
      div = document.getElementById('hello');
      div.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      div.dispatchEvent(new MouseEvent('mouseleave'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // update `title` value.
      wrapper.setProps({ title: 'Have a nice day!' });
    });
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.open).toBe(true);
    }, 0);
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseleave'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // add `open` props.
      wrapper.setProps({ open: false });
    });
    await asyncExpect(() => {
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseenter'));
    });
    await asyncExpect(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
    await asyncExpect(() => {
      // always trigger onOpenChange
      document.getElementById('hello').dispatchEvent(new MouseEvent('mouseleave'));
      lastCount = onOpenChange.mock.calls.length;
    });
    await asyncExpect(() => {
      expect(onOpenChange.mock.calls.length).toBe(lastCount); // no change with lastCount
      expect(wrapper.vm.$refs.tooltip.open).toBe(false);
    });
  });

  it('supports static and functional classNames/styles (root, container, body alias, arrow)', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        tooltip: {
          classNames: { root: 'ctx-tip-root', container: 'ctx-tip-container' },
          styles: { root: { opacity: '0.9' }, container: { padding: '6px' } },
        },
      },
      slots: {
        default: () => (
          <Tooltip
            open
            placement="bottom"
            title="Semantic tip"
            classNames={({ props }) => ({
              root: `fn-tip-root-${props.placement}`,
              container: 'fn-tip-container',
              body: 'fn-tip-body-alias',
              arrow: 'fn-tip-arrow',
            })}
            styles={({ props }) => ({
              root: { zIndex: props.placement === 'bottom' ? 1200 : 1000 },
              body: { fontSize: '13px' },
              container: { color: 'rgb(10, 20, 30)' },
              arrow: { transform: 'scale(1.1)' },
            })}
          >
            <span>trigger</span>
          </Tooltip>
        ),
      },
      attachTo: 'body',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 30));

    const rootEl = document.body.querySelector('.ant-tooltip');
    expect(rootEl).toBeTruthy();
    expect(rootEl.classList.contains('ctx-tip-root')).toBe(true);
    expect(rootEl.classList.contains('fn-tip-root-bottom')).toBe(true);
    expect(rootEl.style.opacity).toBe('0.9');
    expect(rootEl.style.zIndex).toBe('1200');

    const innerEl = document.body.querySelector('.ant-tooltip-inner');
    expect(innerEl).toBeTruthy();
    expect(innerEl.classList.contains('ctx-tip-container')).toBe(true);
    expect(innerEl.classList.contains('fn-tip-container')).toBe(true);
    expect(innerEl.classList.contains('fn-tip-body-alias')).toBe(true);
    expect(innerEl.style.padding).toBe('6px');
    expect(innerEl.style.fontSize).toBe('13px');
    expect(innerEl.style.color).toBe('rgb(10, 20, 30)');

    const arrowEl = document.body.querySelector('.ant-tooltip-arrow-content');
    expect(arrowEl).toBeTruthy();
    expect(arrowEl.classList.contains('fn-tip-arrow')).toBe(true);
    expect(arrowEl.style.transform).toBe('scale(1.1)');

    wrapper.unmount();
  });

  it('Tooltip.UniqueProvider shares single popup and smoothly transitions between siblings', async () => {
    document.body.innerHTML = '';
    expect(Tooltip.UniqueProvider).toBe(TooltipUniqueProvider);

    const app = createApp({});
    app.use(Tooltip);
    expect(app.component('ATooltipUniqueProvider')).toBeTruthy();

    const onOpenChange1 = jest.fn();
    const onOpenChange2 = jest.fn();

    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip.UniqueProvider>
              <div>
                <Tooltip
                  title="First Tip"
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0.05}
                  onOpenChange={onOpenChange1}
                >
                  <button id="unique-btn-1">Btn 1</button>
                </Tooltip>
                <Tooltip
                  title="Second Tip"
                  placement="bottom"
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0.05}
                  onOpenChange={onOpenChange2}
                >
                  <button id="unique-btn-2">Btn 2</button>
                </Tooltip>
              </div>
            </Tooltip.UniqueProvider>
          );
        },
      },
      { attachTo: 'body' },
    );

    await nextTick();
    const btn1 = document.getElementById('unique-btn-1');
    const btn2 = document.getElementById('unique-btn-2');

    btn1.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();

    let containers = document.body.querySelectorAll('.ant-tooltip-unique-container');
    expect(containers.length).toBe(1);
    expect(containers[0].classList.contains('ant-tooltip-unique-container-visible')).toBe(true);
    expect(containers[0].textContent).toContain('First Tip');
    expect(onOpenChange1).toHaveBeenCalledWith(true);

    // Leave btn1 and immediately enter btn2 before leave delay finishes
    btn1.dispatchEvent(new MouseEvent('mouseleave'));
    btn2.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();

    containers = document.body.querySelectorAll('.ant-tooltip-unique-container');
    expect(containers.length).toBe(1);
    expect(containers[0].classList.contains('ant-tooltip-unique-container-visible')).toBe(true);
    expect(containers[0].classList.contains('ant-tooltip-placement-bottom')).toBe(true);
    expect(containers[0].textContent).toContain('Second Tip');
    expect(onOpenChange1).toHaveBeenCalledWith(false);
    expect(onOpenChange2).toHaveBeenCalledWith(true);

    // Leave btn2 and wait for leave delay
    btn2.dispatchEvent(new MouseEvent('mouseleave'));
    await new Promise(r => setTimeout(r, 80));
    await nextTick();

    expect(containers[0].classList.contains('ant-tooltip-unique-container-hidden')).toBe(true);
    expect(onOpenChange2).toHaveBeenCalledWith(false);

    wrapper.unmount();
  });

  it('Tooltip.UniqueProvider preserves fallthrough attrs (class, style, onClick, data-*) on trigger', async () => {
    document.body.innerHTML = '';
    const onAttrClick = jest.fn();
    const onChildClick = jest.fn();
    const onAttrMouseenter = jest.fn();

    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip.UniqueProvider>
              <Tooltip
                title="Refresh"
                mouseEnterDelay={0}
                mouseLeaveDelay={0}
                class="s-tool-item"
                style={{ marginLeft: '8px' }}
                data-test-attr="toolbar-refresh"
                onClick={onAttrClick}
                onMouseenter={onAttrMouseenter}
              >
                <span id="unique-attr-trigger" class="inner-icon" onClick={onChildClick}>
                  Icon
                </span>
              </Tooltip>
            </Tooltip.UniqueProvider>
          );
        },
      },
      { attachTo: 'body' },
    );

    await nextTick();
    const trigger = document.getElementById('unique-attr-trigger');
    expect(trigger).toBeTruthy();
    expect(trigger.classList.contains('s-tool-item')).toBe(true);
    expect(trigger.classList.contains('inner-icon')).toBe(true);
    expect(trigger.style.marginLeft).toBe('8px');
    expect(trigger.getAttribute('data-test-attr')).toBe('toolbar-refresh');

    trigger.dispatchEvent(new MouseEvent('click'));
    expect(onAttrClick).toHaveBeenCalledTimes(1);
    expect(onChildClick).toHaveBeenCalledTimes(1);

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    expect(onAttrMouseenter).toHaveBeenCalledTimes(1);
    const container = document.body.querySelector('.ant-tooltip-unique-container');
    expect(container).toBeTruthy();
    expect(container.classList.contains('ant-tooltip-unique-container-visible')).toBe(true);
    expect(trigger.classList.contains('s-tool-item')).toBe(true);
    expect(trigger.classList.contains('ant-tooltip-open')).toBe(true);

    wrapper.unmount();
  });

  it('supports _InternalPanelDoNotUseOrYouWillBeFired pure panel and forceAlign ref method', () => {
    const InternalTooltip = Tooltip._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalTooltip).toBeDefined();

    const pureWrapper = mount(InternalTooltip, {
      props: {
        title: 'Pure Tooltip',
        color: '#f50',
        placement: 'bottomLeft',
        classNames: { root: 'pure-tip-root', container: 'pure-tip-container' },
        styles: { container: { fontSize: '15px' } },
      },
    });
    expect(pureWrapper.find('.ant-tooltip-pure').exists()).toBe(true);
    expect(pureWrapper.find('.ant-tooltip-placement-bottomLeft').exists()).toBe(true);
    expect(pureWrapper.find('.ant-tooltip-pure').classes()).toContain('pure-tip-root');
    expect(pureWrapper.find('.ant-tooltip-inner').text()).toBe('Pure Tooltip');
    expect(pureWrapper.find('.ant-tooltip-inner').classes()).toContain('pure-tip-container');
    expect(pureWrapper.find('.ant-tooltip-inner').attributes('style')).toContain('15px');
    pureWrapper.unmount();

    const tipWrapper = mount(Tooltip, {
      props: { title: 'Aligned Tip', open: true },
      slots: { default: () => <button>Trigger</button> },
      attachTo: 'body',
    });
    expect(typeof tipWrapper.vm.forceAlign).toBe('function');
    expect(() => tipWrapper.vm.forceAlign()).not.toThrow();
    tipWrapper.unmount();
  });

  it('Tooltip.UniqueProvider does not leak into Dropdown MenuItem tooltips or emit Vue warnings', async () => {
    document.body.innerHTML = '';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onMenuClick = jest.fn();

    try {
      const wrapper = mount(
        {
          render() {
            return (
              <Tooltip.UniqueProvider>
                <Dropdown
                  trigger={['click']}
                  v-slots={{
                    overlay: () => (
                      <Menu onClick={onMenuClick}>
                        <Menu.Item key="default">Default</Menu.Item>
                        <Menu.Item key="small">Small</Menu.Item>
                      </Menu>
                    ),
                  }}
                >
                  <Tooltip title="Density" mouseEnterDelay={0} mouseLeaveDelay={0}>
                    <span id="unique-dropdown-trigger">Density</span>
                  </Tooltip>
                </Dropdown>
              </Tooltip.UniqueProvider>
            );
          },
        },
        { attachTo: 'body' },
      );

      await nextTick();
      const trigger = document.getElementById('unique-dropdown-trigger');
      expect(trigger).toBeTruthy();

      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      await nextTick();
      const uniqueContainer = document.body.querySelector('.ant-tooltip-unique-container');
      expect(uniqueContainer).toBeTruthy();
      expect(uniqueContainer.classList.contains('ant-tooltip-unique-container-visible')).toBe(true);

      trigger.click();
      await nextTick();
      await new Promise(r => setTimeout(r, 30));
      await nextTick();

      const items = Array.from(document.body.querySelectorAll('.ant-dropdown-menu-item'));
      expect(items.length).toBe(2);

      items[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await nextTick();
      items[1].click();
      await nextTick();

      expect(onMenuClick).toHaveBeenCalledTimes(1);
      expect(onMenuClick.mock.calls[0][0].key).toBe('small');

      const vueWarnings = warnSpy.mock.calls
        .map(args => args.join(' '))
        .filter(msg => msg.includes('[Vue warn]'));
      expect(vueWarnings).toEqual([]);

      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });
});
