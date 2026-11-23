import { nextTick } from 'vue';
import FloatButton from '../index';
import ConfigProvider from '../../config-provider';
import { mount } from '@vue/test-utils';
import mountTest from '../../../tests/shared/mountTest';

describe('FloatButton', () => {
  mountTest(FloatButton);
  mountTest(FloatButton.Group);
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <FloatButton></FloatButton>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create primary button', () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="primary">按钮</FloatButton>;
      },
    });
    expect(wrapper.find('.ant-float-btn-primary').exists()).toBe(true);
  });

  it('fixbug renders {0} , 0 and {false}', () => {
    const wrapper = mount({
      render() {
        return <FloatButton>{0}</FloatButton>;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();

    const wrapper1 = mount({
      render() {
        return <FloatButton>0</FloatButton>;
      },
    });
    expect(wrapper1.html()).toMatchSnapshot();

    const wrapper2 = mount({
      render() {
        return <FloatButton>{false}</FloatButton>;
      },
    });
    expect(wrapper2.html()).toMatchSnapshot();
  });

  it('respects ComponentToken zIndexPopup and wires ConfigProvider.floatButton / floatButtonGroup', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        floatButton: {
          className: 'cp-float-btn',
          style: { insetInlineEnd: '48px' },
        },
        floatButtonGroup: {
          className: 'cp-float-group',
          style: { insetBlockEnd: '64px' },
        },
        theme: {
          cssVar: true,
          components: {
            FloatButton: {
              zIndexPopup: 2200,
            },
          },
        },
      },
      slots: {
        default: () => (
          <div>
            <FloatButton />
            <FloatButton.Group>
              <FloatButton />
            </FloatButton.Group>
          </div>
        ),
      },
    });
    await nextTick();
    const btn = wrapper.find('.ant-float-btn');
    expect(btn.classes()).toContain('cp-float-btn');
    expect(btn.attributes('style')).toContain('inset-inline-end: 48px');

    const grp = wrapper.find('.ant-float-btn-group');
    expect(grp.classes()).toContain('cp-float-group');
    expect(grp.attributes('style')).toContain('inset-block-end: 64px');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-float-button-z-index-popup:2200');
    expect(css).not.toContain('z-index:99;');
    expect(css).not.toContain('--ant-float-button-z-index-popup:2200px');
  });
});
