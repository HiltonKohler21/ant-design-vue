import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';
import { asyncExpect } from '../../../tests/utils';
jest.mock('../../_util/Portal');
const ModalTester = {
  props: ['footer', 'visible'],
  methods: {
    getContainer() {
      return this.$refs.container;
    },
  },
  render() {
    const modalProps = {
      ...this.$props,
      getContainer: this.getContainer,
    };
    return (
      <div>
        <div ref="container" />
        <Modal {...modalProps}>Here is content of Modal</Modal>
      </div>
    );
  },
};

describe('Modal', () => {
  mountTest(Modal);
  it('render correctly', async () => {
    const wrapper = mount(
      {
        render() {
          return <ModalTester visible />;
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
    // https://github.com/vuejs/vue-test-utils/issues/624
    const wrapper1 = mount(ModalTester, {
      sync: false,
      attachTo: 'body',
    });
    wrapper1.setProps({ visible: true });
    await asyncExpect(() => {
      expect(wrapper1.html()).toMatchSnapshot();
    });
  });

  it('render without footer', async () => {
    const wrapper = mount(
      {
        render() {
          return <ModalTester visible footer={null} />;
        },
      },
      { attachTo: 'body', sync: true },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should work with getContainer=false', async () => {
    const wrapper1 = mount(Modal, {
      sync: false,
      props: {
        getContainer: false,
        visible: true,
      },
    });
    await asyncExpect(() => {
      expect(wrapper1.html()).toMatchSnapshot();
    });
  });

  it('merges rootClassName with hashId without overwriting', async () => {
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: true,
        rootClassName: 'my-modal-root',
      },
      slots: {
        default: () => 'Modal content',
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-modal-root').classes()).toContain('my-modal-root');
  });

  it('fires afterOpenChange(true) when modal opens', async () => {
    const afterOpenChange = jest.fn();
    const wrapper = mount(Modal, {
      props: {
        getContainer: false,
        open: false,
        afterOpenChange,
      },
      slots: {
        default: () => 'Modal content',
      },
    });
    await nextTick();
    expect(afterOpenChange).not.toHaveBeenCalled();

    await wrapper.setProps({ open: true });
    await nextTick();
    await nextTick();
    expect(afterOpenChange).toHaveBeenCalledWith(true);
  });

  it('applies ConfigProvider.modal className and style', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider modal={{ className: 'cp-modal-cls', style: { top: '42px' } }}>
            <Modal getContainer={false} open={true}>
              Body
            </Modal>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const modalEl = wrapper.find('.ant-modal');
    expect(modalEl.classes()).toContain('cp-modal-cls');
    expect(modalEl.element.style.top).toBe('42px');
  });
});
