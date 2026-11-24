import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import ConfigProvider from '..';
import Button from '../../button';
import Form from '../../form';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

describe('ConfigProvider', () => {
  mountTest({
    render() {
      return (
        <>
          <ConfigProvider>
            <div />
          </ConfigProvider>
        </>
      );
    },
  });

  it('Content Security Policy', () => {
    const csp = { nonce: 'test-antd' };
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider csp={csp}>
            <Button ref="button" />
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.findComponent({ ref: 'button' }).vm.$refs.wave.csp.nonce).toBe(csp.nonce);
  });

  it('autoInsertSpaceInButton', async () => {
    const wrapper = mount({
      data() {
        return {
          autoInsertSpaceInButton: false,
        };
      },
      render() {
        return (
          <ConfigProvider autoInsertSpaceInButton={this.autoInsertSpaceInButton}>
            <Button ref="button">确定</Button>
          </ConfigProvider>
        );
      },
    });

    expect(wrapper.find('.ant-btn').text()).toBe('确定');
    wrapper.vm.autoInsertSpaceInButton = true;
    await sleep();
    expect(wrapper.find('.ant-btn').text()).toBe('确 定');
  });

  it('ConfigProvider.useConfig returns reactive componentSize and componentDisabled', async () => {
    const size = ref('small');
    const disabled = ref(true);

    const Display = defineComponent({
      setup() {
        const { componentSize, componentDisabled } = ConfigProvider.useConfig();
        return () => (
          <div class="config-display">
            {`${componentSize.value}:${String(componentDisabled.value)}`}
          </div>
        );
      },
    });

    const wrapper = mount({
      setup() {
        return () => (
          <ConfigProvider componentSize={size.value}>
            <Form disabled={disabled.value}>
              <Display />
            </Form>
          </ConfigProvider>
        );
      },
    });

    expect(wrapper.find('.config-display').text()).toBe('small:true');
    size.value = 'large';
    disabled.value = false;
    await nextTick();
    expect(wrapper.find('.config-display').text()).toBe('large:false');
  });
});
