import Watermark, { usePanelRef } from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

describe('Watermark', () => {
  mountTest(Watermark);
  const mockSrcSet = jest.spyOn(Image.prototype, 'src', 'set');
  beforeAll(() => {
    mockSrcSet.mockImplementation(function fn() {
      this.onload?.();
    });
  });

  afterAll(() => {
    mockSrcSet.mockRestore();
  });

  it('The watermark should render successfully ', function () {
    const wrapper = mount({
      setup() {
        return () => {
          return <Watermark class="watermark" content="Ant Design" />;
        };
      },
    });
    expect(wrapper.find('.watermark').exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('respects inherit prop via WatermarkContext', async () => {
    const mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      measureText: jest.fn(() => ({ width: 50 })),
      fillText: jest.fn(),
      drawImage: jest.fn(),
    };
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(mockCtx);
    const toDataURLSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,MOCK');

    try {
      const PanelConsumer = defineComponent({
        setup() {
          const panelRef = usePanelRef();
          return () => (
            <div class="portal-panel" ref={panelRef}>
              Panel Content
            </div>
          );
        },
      });

      const wrapperInheritTrue = mount({
        render() {
          return (
            <Watermark content="Secret" inherit={true}>
              <PanelConsumer />
            </Watermark>
          );
        },
      });
      await nextTick();
      const panelTrue = wrapperInheritTrue.find('.portal-panel').element;
      // Watermark appends a background-image overlay div inside registered panel
      expect(panelTrue.querySelectorAll('div').length).toBe(1);
      expect(panelTrue.querySelector('div').getAttribute('style')).toContain('background-image');

      const wrapperInheritFalse = mount({
        render() {
          return (
            <Watermark content="Secret" inherit={false}>
              <PanelConsumer />
            </Watermark>
          );
        },
      });
      await nextTick();
      const panelFalse = wrapperInheritFalse.find('.portal-panel').element;
      expect(panelFalse.querySelectorAll('div').length).toBe(0);
    } finally {
      getContextSpy.mockRestore();
      toDataURLSpy.mockRestore();
    }
  });
});
