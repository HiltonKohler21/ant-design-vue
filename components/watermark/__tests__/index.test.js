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

  it('supports WatermarkText items with per-line font overrides', async () => {
    const fillTextCalls = [];
    const mockCtx = {
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      measureText: jest.fn(text => ({ width: text.length * 10 })),
      fillText: jest.fn(function (text, x, y) {
        fillTextCalls.push({
          text,
          x,
          y,
          font: this.font,
          fillStyle: this.fillStyle,
          textAlign: this.textAlign,
        });
      }),
      drawImage: jest.fn(),
    };
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(mockCtx);
    const toDataURLSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,PERLINE');

    try {
      const wrapper = mount({
        render() {
          return (
            <Watermark
              font={{ color: 'rgba(0,0,0,0.2)', fontSize: 14, fontFamily: 'Arial' }}
              content={[
                {
                  text: 'Primary Title',
                  font: { color: '#ff0000', fontSize: 20, fontWeight: 'bold', textAlign: 'left' },
                },
                'Plain Subtitle',
                { text: 'Footer Note', font: { fontStyle: 'italic' } },
              ]}
            >
              <div>content</div>
            </Watermark>
          );
        },
      });
      await nextTick();

      // Drawn twice (main + alternate) per render pass; inspect the first 3 calls
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(6);
      expect(fillTextCalls[0].text).toBe('Primary Title');
      expect(fillTextCalls[0].fillStyle).toBe('#ff0000');
      expect(fillTextCalls[0].font).toContain('bold');
      expect(fillTextCalls[0].font).toContain('20px');
      expect(fillTextCalls[0].textAlign).toBe('left');

      expect(fillTextCalls[1].text).toBe('Plain Subtitle');
      expect(fillTextCalls[1].fillStyle).toBe('rgba(0,0,0,0.2)');
      expect(fillTextCalls[1].font).toContain('14px');
      expect(fillTextCalls[1].textAlign).toBe('center');

      expect(fillTextCalls[2].text).toBe('Footer Note');
      expect(fillTextCalls[2].font).toContain('italic');
      expect(fillTextCalls[2].fillStyle).toBe('rgba(0,0,0,0.2)');

      wrapper.unmount();
    } finally {
      getContextSpy.mockRestore();
      toDataURLSpy.mockRestore();
    }
  });

  it('invokes onRemove callback before re-rendering when watermark node is tampered with', async () => {
    const mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      measureText: jest.fn(() => ({ width: 60 })),
      fillText: jest.fn(),
      drawImage: jest.fn(),
    };
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(mockCtx);
    const toDataURLSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,TAMPER');
    const onRemove = jest.fn();

    try {
      const wrapper = mount(Watermark, {
        props: {
          content: 'Protected',
          onRemove,
        },
        slots: {
          default: () => <p class="body">Body</p>,
        },
        attachTo: document.body,
      });
      await nextTick();
      // Wait for initial stopObservation setTimeout to clear
      await new Promise(r => setTimeout(r, 20));

      const containerEl = wrapper.element;
      const getOverlayDiv = () =>
        Array.from(containerEl.children).find(
          el => el.tagName === 'DIV' && el.getAttribute('style')?.includes('background-image'),
        );

      const overlay = getOverlayDiv();
      expect(overlay).toBeTruthy();

      // Tamper by removing watermark element
      overlay.remove();
      await new Promise(r => setTimeout(r, 20));

      expect(onRemove).toHaveBeenCalledTimes(1);
      // Watermark should be re-rendered back into container
      expect(getOverlayDiv()).toBeTruthy();

      // Tamper by mutating watermark style attribute
      getOverlayDiv().setAttribute('style', 'display: none;');
      await new Promise(r => setTimeout(r, 20));

      expect(onRemove).toHaveBeenCalledTimes(2);
      expect(getOverlayDiv().getAttribute('style')).toContain('background-image');

      wrapper.unmount();
    } finally {
      getContextSpy.mockRestore();
      toDataURLSpy.mockRestore();
    }
  });
});
