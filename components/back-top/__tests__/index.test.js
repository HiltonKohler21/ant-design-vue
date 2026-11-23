import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import BackTop from '..';
import ConfigProvider from '../../config-provider';

describe('BackTop', () => {
  it('renders hidden by default', () => {
    const wrapper = mount(BackTop);
    expect(wrapper.find('.ant-back-top').exists()).toBe(true);
    expect(wrapper.find('.ant-back-top').attributes('style')).toContain('display: none');
  });

  it('shows immediately when visibilityHeight is 0', () => {
    const wrapper = mount(BackTop, { props: { visibilityHeight: 0 } });
    expect(wrapper.find('.ant-back-top-content').exists()).toBe(true);
  });

  it('renders custom children slot', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
      slots: { default: () => <div class="custom-backtop">top</div> },
    });
    expect(wrapper.find('.custom-backtop').exists()).toBe(true);
  });

  it('supports rootClassName', () => {
    const wrapper = mount(BackTop, { props: { rootClassName: 'my-back-top' } });
    expect(wrapper.element.getAttribute('class')).toContain('my-back-top');
  });

  it('triggers click event once (no double fire)', () => {
    const onClick = jest.fn();
    const wrapper = mount(BackTop, { props: { visibilityHeight: 0, onClick } });
    wrapper.find('.ant-back-top').trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects ComponentToken zIndexPopup default and user override without clobbering', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            BackTop: {
              zIndexPopup: 2500,
            },
          },
        },
      },
      slots: { default: () => <BackTop visibilityHeight={0} /> },
    });
    await nextTick();
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-back-top-z-index-popup:2500');
    expect(css).not.toContain('--ant-back-top-z-index-popup:2500px');
    wrapper.unmount();
  });
});
