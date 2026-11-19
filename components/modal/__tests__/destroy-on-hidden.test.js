import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '../../modal';
import Drawer from '../../drawer';
import Tabs from '../../tabs';
import Tooltip from '../../tooltip';
import Dropdown from '../../dropdown';
import Menu from '../../menu';
import Dialog from '../../vc-dialog';
import VcTooltip from '../../vc-tooltip';
import RcDropdown from '../../vc-dropdown';
import Button from '../../button';

const TabsTabPane = Tabs.TabPane;

describe('upstream: destroyOnHidden（antd 5.25 改名）', () => {
  it('Modal maps destroyOnHidden to destroyOnClose', () => {
    const wrapper = mount(Modal, {
      props: { open: true, destroyOnHidden: true },
      slots: { default: () => 'content' },
    });
    expect(wrapper.findComponent(Dialog).props('destroyOnClose')).toBe(true);
  });

  it('Modal keeps legacy destroyOnClose working', () => {
    const wrapper = mount(Modal, {
      props: { open: true, destroyOnClose: true },
      slots: { default: () => 'content' },
    });
    expect(wrapper.findComponent(Dialog).props('destroyOnClose')).toBe(true);
  });

  it('Modal destroyOnHidden wins over legacy prop', () => {
    const wrapper = mount(Modal, {
      props: { open: true, destroyOnClose: true, destroyOnHidden: false },
      slots: { default: () => 'content' },
    });
    expect(wrapper.findComponent(Dialog).props('destroyOnClose')).toBe(false);
  });

  it('Tooltip maps destroyOnHidden to destroyTooltipOnHide', () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, title: 'tip', destroyOnHidden: true },
      slots: { default: () => <Button>btn</Button> },
    });
    expect(wrapper.findComponent(VcTooltip).props('destroyTooltipOnHide')).toBe(true);
  });

  it('Dropdown maps destroyOnHidden to destroyPopupOnHide', () => {
    const wrapper = mount(Dropdown, {
      props: { open: true, destroyOnHidden: true },
      slots: { default: () => <Button>btn</Button>, overlay: () => <Menu /> },
    });
    expect(wrapper.findComponent(RcDropdown).props('destroyPopupOnHide')).toBe(true);
  });

  it('Tabs destroys inactive pane via destroyOnHidden', async () => {
    const wrapper = mount(Tabs, {
      props: { destroyOnHidden: true, activeKey: '1' },
      slots: {
        default: () => [
          <TabsTabPane key="1" tab="tab1">
            content-1
          </TabsTabPane>,
          <TabsTabPane key="2" tab="tab2">
            content-2
          </TabsTabPane>,
        ],
      },
    });
    expect(wrapper.html()).toContain('content-1');
    await wrapper.setProps({ activeKey: '2' });
    await nextTick();
    expect(wrapper.html()).not.toContain('content-1');
  });

  it('Drawer accepts destroyOnHidden without touching DOM attribute', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, destroyOnHidden: true },
      slots: { default: () => 'drawer-body' },
      attachTo: 'body',
    });
    expect(wrapper.html()).not.toContain('destroyonhidden');
    expect(wrapper.html()).not.toContain('destroyOnHidden');
  });
});
