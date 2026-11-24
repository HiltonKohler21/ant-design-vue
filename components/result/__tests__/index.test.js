import { mount } from '@vue/test-utils';
import Result from '../index';
import Button from '../../button';
import ConfigProvider from '../../config-provider';
import { sleep } from '../../../tests/utils';

describe('Result', () => {
  it('🙂  successPercent should decide the progress status when it exists', () => {
    const wrapper = mount({
      render() {
        return (
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={
              <Button type="primary" key="console">
                Go Console
              </Button>
            }
          />
        );
      },
    });
    expect(wrapper.findAll('.anticon-check-circle')).toHaveLength(1);
  });

  it('🙂  different status, different class', async () => {
    const wrapper = mount(Result, { props: { status: 'warning' }, sync: false });
    expect(wrapper.findAll('.ant-result-warning')).toHaveLength(1);

    wrapper.setProps({
      status: 'error',
    });

    await sleep();
    expect(wrapper.findAll('.ant-result-error')).toHaveLength(1);

    wrapper.setProps({
      status: '500',
    });
    await sleep();
    expect(wrapper.findAll('.ant-result-500')).toHaveLength(1);
  });

  it('🙂  When status = 404, the icon is an image', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" />;
      },
    });
    expect(wrapper.findAll('.ant-result-404 .ant-result-image')).toHaveLength(1);
  });

  it('🙂  When extra is undefined, the extra dom is undefined', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" />;
      },
    });
    expect(wrapper.findAll('.ant-result-extra')).toHaveLength(0);
  });

  it('🙂  result should support className', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" title="404" class="my-result" />;
      },
    });
    expect(wrapper.findAll('.ant-result.my-result')).toHaveLength(1);
  });

  it('supports semantic classNames and styles (Object + Function) merged with ConfigProvider.result', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            result={{
              classNames: {
                root: 'ctx-result-root',
                title: 'ctx-result-title',
              },
              styles: {
                root: { padding: '10px' },
                extra: { marginTop: '4px' },
              },
            }}
          >
            <Result
              status="success"
              title="Done"
              subTitle="All set"
              extra={<Button>OK</Button>}
              classNames={({ props }) => ({
                root: `fn-result-${props.status}`,
                icon: 'fn-result-icon',
                subTitle: 'fn-result-subtitle',
                extra: 'fn-result-extra',
                body: 'fn-result-body',
              })}
              styles={({ props }) => ({
                title: { color: props.status === 'success' ? 'rgb(82, 196, 26)' : 'red' },
                subTitle: { fontWeight: '700' },
                icon: { opacity: '0.8' },
                body: { padding: '12px' },
              })}
            >
              <div>Body content</div>
            </Result>
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-result');
    expect(root.classes()).toContain('ctx-result-root');
    expect(root.classes()).toContain('fn-result-success');
    expect(root.attributes('style')).toContain('padding: 10px');
    expect(wrapper.find('.ant-result-icon').classes()).toContain('fn-result-icon');
    expect(wrapper.find('.ant-result-icon').attributes('style')).toContain('opacity: 0.8');
    expect(wrapper.find('.ant-result-title').classes()).toContain('ctx-result-title');
    expect(wrapper.find('.ant-result-title').attributes('style')).toContain(
      'color: rgb(82, 196, 26)',
    );
    expect(wrapper.find('.ant-result-subtitle').classes()).toContain('fn-result-subtitle');
    expect(wrapper.find('.ant-result-extra').classes()).toContain('fn-result-extra');
    expect(wrapper.find('.ant-result-extra').attributes('style')).toContain('margin-top: 4px');
    expect(wrapper.find('.ant-result-content').classes()).toContain('fn-result-body');
    expect(wrapper.find('.ant-result-content').attributes('style')).toContain('padding: 12px');
  });
});
