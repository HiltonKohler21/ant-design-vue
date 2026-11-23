import Image from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

describe('Image', () => {
  mountTest(Image);
  it('image size', () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            width="200px"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        );
      },
    });
    expect(wrapper.find('.ant-image').element.style.width).toBe('200px');
  });
  it('image size number', () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            width={200}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        );
      },
    });
    expect(wrapper.find('.ant-image').element.style.width).toBe('200px');
  });

  it('PreviewGroup preserves preview.rootClassName and uses aria-hidden (not ria-hidden)', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(
      {
        render() {
          return (
            <Image.PreviewGroup
              preview={{
                visible: true,
                rootClassName: 'my-preview-group-root',
                getContainer: false,
              }}
            >
              <Image src="https://example.com/1.png" />
            </Image.PreviewGroup>
          );
        },
      },
      { attachTo: 'body' },
    );
    await nextTick();
    const previewRoot = wrapper.find('.ant-image-preview-root');
    expect(previewRoot.exists()).toBe(true);
    expect(previewRoot.classes()).toContain('my-preview-group-root');
    expect(wrapper.html()).not.toMatch(/\bria-hidden=/);
    const previewComp = wrapper.findComponent({ name: 'Preview' });
    expect(previewComp.exists()).toBe(true);
    expect(previewComp.vm.$attrs['ria-hidden']).toBeUndefined();
    expect(previewComp.vm.$attrs['aria-hidden']).toBe(false);
    wrapper.unmount();
  });

  it('Image preserves preview.rootClassName', async () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            src="https://example.com/1.png"
            preview={{ visible: true, rootClassName: 'my-image-preview-root', getContainer: false }}
          />
        );
      },
    });
    await nextTick();
    const previewRoot = wrapper.find('.ant-image-preview-root');
    expect(previewRoot.exists()).toBe(true);
    expect(previewRoot.classes()).toContain('my-image-preview-root');
    wrapper.unmount();
  });

  it('ConfigProvider.image wires fallback, className, style, and preview.closeIcon', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            image={{
              fallback: 'https://example.com/fallback.png',
              className: 'cp-image-cls',
              style: { borderRadius: '8px' },
              preview: {
                closeIcon: <span class="cp-close-icon">X</span>,
              },
            }}
          >
            <Image
              src="https://example.com/broken.png"
              preview={{ visible: true, getContainer: false }}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const img = wrapper.find('.ant-image-img');
    expect(img.classes()).toContain('cp-image-cls');
    expect(img.element.style.borderRadius).toBe('8px');
    expect(wrapper.find('.cp-close-icon').exists()).toBe(true);

    await img.trigger('error');
    await nextTick();
    expect(wrapper.find('.ant-image-img').attributes('src')).toBe(
      'https://example.com/fallback.png',
    );
    wrapper.unmount();
  });
});
