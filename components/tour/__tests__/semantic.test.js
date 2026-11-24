import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import Tour from '..';
import ConfigProvider from '../../config-provider';

const waitTour = async () => {
  await nextTick();
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 60));
  await nextTick();
};

describe('Tour.semantic & PurePanel', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supports static and functional classNames/styles across all 12 semantic slots', async () => {
    const classNamesFn = jest.fn(({ props }) => ({
      root: `fn-tour-root-${props.type}`,
      mask: 'fn-tour-mask',
      section: 'fn-tour-section',
      cover: 'fn-tour-cover',
      close: 'fn-tour-close',
      header: 'fn-tour-header',
      title: 'fn-tour-title',
      description: 'fn-tour-description',
      footer: 'fn-tour-footer',
      actions: 'fn-tour-actions',
      indicators: 'fn-tour-indicators',
      indicator: 'fn-tour-indicator',
    }));

    const stylesFn = jest.fn(({ props }) => ({
      root: { backgroundColor: 'rgb(255, 255, 0)' },
      mask: { color: props.type === 'primary' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)' },
      section: { margin: '10px' },
      cover: { color: 'rgb(255, 0, 0)' },
      close: { color: 'rgb(255, 192, 203)' },
      header: { backgroundColor: 'rgb(128, 128, 128)' },
      title: { fontSize: '20px' },
      description: { fontStyle: 'italic' },
      footer: { borderTop: '1px solid black' },
      actions: { color: 'rgb(0, 0, 255)' },
      indicators: { color: 'rgb(255, 255, 0)' },
      indicator: { color: 'rgb(0, 128, 0)' },
    }));

    const targetRef = ref(null);
    const wrapper = mount(
      {
        setup() {
          return () => (
            <div>
              <button ref={targetRef} type="button">
                Target
              </button>
              <Tour
                open
                type="primary"
                classNames={classNamesFn}
                styles={stylesFn}
                steps={[
                  {
                    title: 'Step 1',
                    description: 'Description 1',
                    cover: <img alt="tour" src="https://example.com/tour.png" />,
                    target: () => targetRef.value,
                  },
                  {
                    title: 'Step 2',
                    description: 'Description 2',
                    target: () => targetRef.value,
                  },
                ]}
              />
            </div>
          );
        },
      },
      { attachTo: 'body' },
    );

    await waitTour();
    expect(classNamesFn).toHaveBeenCalled();
    expect(stylesFn).toHaveBeenCalled();

    const maskEl = document.body.querySelector('.ant-tour-mask');
    const sectionEl = document.body.querySelector('.ant-tour-section');
    const coverEl = document.body.querySelector('.ant-tour-cover');
    const closeEl = document.body.querySelector('.ant-tour-close');
    const headerEl = document.body.querySelector('.ant-tour-header');
    const titleEl = document.body.querySelector('.ant-tour-title');
    const descEl = document.body.querySelector('.ant-tour-description');
    const footerEl = document.body.querySelector('.ant-tour-footer');
    const actionsEl = document.body.querySelector('.ant-tour-actions');
    const indicatorsEl = document.body.querySelector('.ant-tour-indicators');
    const indicatorEl = document.body.querySelector('.ant-tour-indicator');

    expect(maskEl.classList.contains('fn-tour-root-primary')).toBe(true);
    expect(maskEl.classList.contains('fn-tour-mask')).toBe(true);
    expect(maskEl.style.color).toBe('rgb(255, 255, 255)');
    expect(maskEl.style.backgroundColor).toBe('rgb(255, 255, 0)');

    expect(sectionEl.classList.contains('fn-tour-section')).toBe(true);
    expect(sectionEl.style.margin).toBe('10px');
    expect(coverEl.classList.contains('fn-tour-cover')).toBe(true);
    expect(coverEl.style.color).toBe('rgb(255, 0, 0)');
    expect(closeEl.classList.contains('fn-tour-close')).toBe(true);
    expect(closeEl.style.color).toBe('rgb(255, 192, 203)');
    expect(headerEl.classList.contains('fn-tour-header')).toBe(true);
    expect(headerEl.style.backgroundColor).toBe('rgb(128, 128, 128)');
    expect(titleEl.classList.contains('fn-tour-title')).toBe(true);
    expect(titleEl.style.fontSize).toBe('20px');
    expect(descEl.classList.contains('fn-tour-description')).toBe(true);
    expect(descEl.style.fontStyle).toBe('italic');
    expect(footerEl.classList.contains('fn-tour-footer')).toBe(true);
    expect(footerEl.style.borderTopWidth).toBe('1px');
    expect(actionsEl.classList.contains('fn-tour-actions')).toBe(true);
    expect(actionsEl.style.color).toBe('rgb(0, 0, 255)');
    expect(indicatorsEl.classList.contains('fn-tour-indicators')).toBe(true);
    expect(indicatorsEl.style.color).toBe('rgb(255, 255, 0)');
    expect(indicatorEl.classList.contains('fn-tour-indicator')).toBe(true);
    expect(indicatorEl.style.color).toBe('rgb(0, 128, 0)');

    wrapper.unmount();
  });

  it('merges ConfigProvider.tour semantic classNames/styles and supports array gap offset', async () => {
    const targetRef = ref(null);
    const wrapper = mount(
      {
        setup() {
          return () => (
            <ConfigProvider
              tour={{
                classNames: { root: 'ctx-tour-root', section: 'ctx-tour-section' },
                styles: { section: { padding: '8px' } },
              }}
            >
              <div>
                <button ref={targetRef} type="button">
                  Target
                </button>
                <Tour
                  open
                  gap={{ offset: [12, 24], radius: 6 }}
                  classNames={{ section: 'own-tour-section' }}
                  styles={{ section: { borderRadius: '10px' } }}
                  steps={[
                    { title: 'Gap Step', description: 'Desc', target: () => targetRef.value },
                  ]}
                />
              </div>
            </ConfigProvider>
          );
        },
      },
      { attachTo: 'body' },
    );

    await waitTour();
    const sectionEl = document.body.querySelector('.ant-tour-section');
    expect(sectionEl.classList.contains('ctx-tour-section')).toBe(true);
    expect(sectionEl.classList.contains('own-tour-section')).toBe(true);
    expect(sectionEl.style.padding).toBe('8px');
    expect(sectionEl.style.borderRadius).toBe('10px');

    const maskHole = document.body.querySelector('.ant-tour-mask defs mask rect:nth-child(2)');
    expect(maskHole).toBeTruthy();
    expect(maskHole.getAttribute('rx')).toBe('6');
    expect(maskHole.getAttribute('width')).toBe('24');
    expect(maskHole.getAttribute('height')).toBe('48');

    wrapper.unmount();
  });

  it('supports _InternalPanelDoNotUseOrYouWillBeFired pure panel', () => {
    const InternalPanel = Tour._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalPanel).toBeDefined();
    const wrapper = mount(InternalPanel, {
      props: {
        title: 'Pure Tour Title',
        description: 'Pure Tour Desc',
        type: 'primary',
        current: 2,
        total: 5,
      },
    });
    expect(wrapper.find('.ant-tour-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-tour-primary').exists()).toBe(true);
    expect(wrapper.find('.ant-tour-title').text()).toBe('Pure Tour Title');
    expect(wrapper.find('.ant-tour-description').text()).toBe('Pure Tour Desc');
    expect(wrapper.findAll('.ant-tour-indicator').length).toBe(5);
    wrapper.unmount();
  });
});
