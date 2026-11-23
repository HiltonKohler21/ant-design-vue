import Image from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

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

  it('supports v6 preview open / onOpenChange, actionsRender, imageRender, onTransform, and scale options', async () => {
    const onOpenChange = jest.fn();
    const onTransform = jest.fn();
    let capturedActions;
    const wrapper = mount({
      render() {
        return (
          <Image
            src="https://example.com/1.png"
            preview={{
              open: true,
              onOpenChange,
              minScale: 0.5,
              maxScale: 3,
              scaleStep: 1,
              movable: false,
              onTransform,
              actionsRender: (_, info) => {
                capturedActions = info.actions;
                return (
                  <div class="custom-toolbar">
                    <button class="btn-zoom-in" onClick={info.actions.onZoomIn}>
                      +
                    </button>
                    <button class="btn-reset" onClick={info.actions.onReset}>
                      Reset
                    </button>
                    <button class="btn-close" onClick={info.actions.onClose}>
                      Close
                    </button>
                  </div>
                );
              },
              imageRender: (originNode, { transform }) => (
                <div class="custom-image-wrap" data-scale={transform.scale}>
                  {originNode}
                </div>
              ),
              getContainer: false,
            }}
          />
        );
      },
    });
    await nextTick();
    expect(wrapper.find('.custom-toolbar').exists()).toBe(true);
    expect(wrapper.find('.custom-image-wrap').exists()).toBe(true);
    expect(wrapper.find('.ant-image-preview-not-movable').exists()).toBe(true);

    await wrapper.find('.btn-zoom-in').trigger('click');
    expect(onTransform).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'zoomIn',
        transform: expect.objectContaining({ scale: 2 }),
      }),
    );

    await wrapper.find('.btn-reset').trigger('click');
    expect(onTransform).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'reset',
        transform: expect.objectContaining({ scale: 1 }),
      }),
    );

    expect(typeof capturedActions.onFlipX).toBe('function');
    await wrapper.find('.btn-close').trigger('click');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    wrapper.unmount();
  });

  it('supports preview.mask config (blur / enabled / closable) and preview.cover', async () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            src="https://example.com/1.png"
            preview={{
              open: true,
              mask: { blur: true, closable: false },
              cover: { coverNode: <span class="custom-cover">Zoom</span>, placement: 'bottom' },
              getContainer: false,
            }}
          />
        );
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-image-cover-bottom .custom-cover').exists()).toBe(true);
    expect(wrapper.find('.ant-image-preview-mask').classes()).toContain(
      'ant-image-preview-mask-blur',
    );
    wrapper.unmount();
  });

  it('supports Image.PreviewGroup items, countRender, onChange, fallback, and open/onOpenChange', async () => {
    const onChange = jest.fn();
    const onOpenChange = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Image.PreviewGroup
            items={[
              'https://example.com/a.png',
              { src: 'https://example.com/b.png', alt: 'Image B' },
            ]}
            fallback="https://example.com/group-fallback.png"
            preview={{
              open: true,
              current: 0,
              onChange,
              onOpenChange,
              countRender: (current, total) => (
                <span class="custom-count">{`${current} of ${total}`}</span>
              ),
              getContainer: false,
            }}
          />
        );
      },
    });
    await nextTick();
    expect(wrapper.find('.custom-count').text()).toBe('1 of 2');
    expect(wrapper.find('.ant-image-preview-img').attributes('src')).toBe(
      'https://example.com/a.png',
    );

    await wrapper.find('.ant-image-preview-switch-right').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledWith(1, 0);
    expect(wrapper.find('.custom-count').text()).toBe('2 of 2');
    expect(wrapper.find('.ant-image-preview-img').attributes('src')).toBe(
      'https://example.com/b.png',
    );
    expect(wrapper.find('.ant-image-preview-img').attributes('alt')).toBe('Image B');

    await wrapper.find('.ant-image-preview-img').trigger('error');
    await nextTick();
    expect(wrapper.find('.ant-image-preview-img').attributes('src')).toBe(
      'https://example.com/group-fallback.png',
    );
    wrapper.unmount();
  });

  it('supports semantic classNames and styles (object and functional) and ComponentTokens', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: true,
          components: {
            Image: {
              previewOperationHoverColor: 'rgba(255, 255, 255, 0.9)',
              progressAnimationDuration: '2s',
            },
          },
        },
      },
      slots: {
        default: () => (
          <Image
            src="https://example.com/1.png"
            width={120}
            classNames={({ props }) => ({
              root: `img-root-${props.width}`,
              image: 'img-inner',
              cover: 'img-cover',
              popup: {
                root: 'popup-root-cls',
                actions: 'popup-actions-cls',
              },
            })}
            styles={{
              root: { border: '1px solid red' },
              image: { objectFit: 'cover' },
              cover: { fontSize: '14px' },
            }}
            preview={{ open: true, getContainer: false }}
          />
        ),
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-image').classes()).toContain('img-root-120');
    expect(wrapper.find('.ant-image').attributes('style')).toContain('border: 1px solid red');
    expect(wrapper.find('.ant-image-img').classes()).toContain('img-inner');
    expect(wrapper.find('.ant-image-img').attributes('style')).toContain('object-fit: cover');
    expect(wrapper.find('.ant-image-mask').classes()).toContain('img-cover');
    expect(wrapper.find('.ant-image-preview-root').classes()).toContain('popup-root-cls');
    expect(wrapper.find('.ant-image-preview-operations').classes()).toContain('popup-actions-cls');

    const css = collectCss();
    expect(css).toContain('--ant-image-preview-operation-hover-color:rgba(255, 255, 255, 0.9)');
    expect(css).toContain('--ant-image-progress-animation-duration:2s');
    wrapper.unmount();
  });
});
