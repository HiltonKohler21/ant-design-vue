import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Drawer from '..';
import ConfigProvider from '../../config-provider';

const DrawerCom = {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    getContainer: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: '',
    },
  },
  render() {
    return <Drawer {...this.$props}>Here is content of Drawer</Drawer>;
  },
};

describe('Drawer', () => {
  it('render correctly', async () => {
    const props = {
      props: {
        visible: true,
        width: 400,
        getContainer: false,
      },
      slots: {
        default: () => ['Here is content of Drawer'],
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render top drawer', async () => {
    const props = {
      props: {
        visible: true,
        height: 400,
        placement: 'top',
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('have a title', async () => {
    const props = {
      props: {
        visible: true,
        title: 'Test Title',
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('closable is false', async () => {
    const props = {
      props: {
        visible: true,
        closable: false,
        getContainer: false,
      },
      slots: {
        default: () => 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('destroyOnClose is true', async () => {
    const props = {
      props: {
        destroyOnClose: true,
        closable: false,
        getContainer: false,
        visible: true,
      },
      slots: {
        default: () => 'Here is content of Drawer',
      },
      sync: false,
    };
    const wrapper = mount(Drawer, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('class is test_drawer', async () => {
    const props = {
      props: {
        class: 'test_drawer',
        visible: true,
      },
      sync: false,
    };
    const wrapper = mount(DrawerCom, props);
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('wires ariaId onto drawer body and title', async () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Accessible Title',
        ariaId: 'drawer-custom-title-id',
        getContainer: false,
      },
      slots: {
        default: () => 'Body',
      },
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-drawer-wrapper-body').attributes('aria-labelledby')).toBe(
        'drawer-custom-title-id',
      );
      expect(wrapper.find('.ant-drawer-title').attributes('id')).toBe('drawer-custom-title-id');
    });
  });

  it('applies ConfigProvider.drawer className, style, classNames, styles', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            drawer={{
              className: 'cp-drawer-cls',
              style: { backgroundColor: 'rgb(10, 20, 30)' },
              classNames: { body: 'cp-drawer-body' },
              styles: { header: { padding: '8px' } },
            }}
          >
            <Drawer open title="CP Drawer" getContainer={false}>
              Content
            </Drawer>
          </ConfigProvider>
        );
      },
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-drawer-content').classes()).toContain('cp-drawer-cls');
      expect(wrapper.find('.ant-drawer-content').element.style.backgroundColor).toBe(
        'rgb(10, 20, 30)',
      );
      expect(wrapper.find('.ant-drawer-body').classes()).toContain('cp-drawer-body');
      expect(wrapper.find('.ant-drawer-header').element.style.padding).toBe('8px');
    });
  });
});
