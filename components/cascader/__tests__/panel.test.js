import { mount } from '@vue/test-utils';
import { createApp, nextTick } from 'vue';
import Cascader, { CascaderPanel } from '..';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

describe('Cascader.Panel & Cascader variant', () => {
  it('registers ACascader and ACascaderPanel via app.use(Cascader)', () => {
    const app = createApp({});
    app.use(Cascader);
    expect(app.component('ACascader')).toBeTruthy();
    expect(app.component('ACascaderPanel')).toBeTruthy();
    expect(Cascader.Panel).toBe(CascaderPanel);
  });

  it('supports single selection in Cascader.Panel', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Cascader.Panel, {
      props: {
        options,
        onChange,
      },
    });
    expect(wrapper.find('.ant-cascader-panel').exists()).toBe(true);
    expect(wrapper.findAll('.ant-cascader-menu').length).toBe(1);

    await wrapper
      .findAll('.ant-cascader-menu')[0]
      .findAll('.ant-cascader-menu-item')[0]
      .trigger('click');
    await nextTick();
    expect(wrapper.findAll('.ant-cascader-menu').length).toBe(2);
    expect(onChange).not.toHaveBeenCalled();

    await wrapper
      .findAll('.ant-cascader-menu')[1]
      .findAll('.ant-cascader-menu-item')[0]
      .trigger('click');
    await nextTick();
    expect(wrapper.findAll('.ant-cascader-menu').length).toBe(3);

    await wrapper
      .findAll('.ant-cascader-menu')[2]
      .findAll('.ant-cascader-menu-item')[0]
      .trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(['zhejiang', 'hangzhou', 'xihu']);
    expect(onChange.mock.calls[0][1].map(o => o.label)).toEqual([
      'Zhejiang',
      'Hangzhou',
      'West Lake',
    ]);
    wrapper.unmount();
  });

  it('supports changeOnSelect in Cascader.Panel', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Cascader.Panel, {
      props: {
        options,
        changeOnSelect: true,
        onChange,
      },
    });
    await wrapper
      .findAll('.ant-cascader-menu')[0]
      .findAll('.ant-cascader-menu-item')[0]
      .trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(['zhejiang']);
    wrapper.unmount();
  });

  it('supports multiple selection in Cascader.Panel', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Cascader.Panel, {
      props: {
        options,
        multiple: true,
        onChange,
      },
    });
    const checkboxes = wrapper.findAll('.ant-cascader-checkbox');
    expect(checkboxes.length).toBe(2);

    await checkboxes[0].trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual([['zhejiang']]);

    await checkboxes[1].trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toEqual([['zhejiang'], ['jiangsu']]);
    wrapper.unmount();
  });

  it('blocks interaction when disabled is true', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Cascader.Panel, {
      props: {
        options,
        disabled: true,
        onChange,
      },
    });
    expect(wrapper.find('.ant-cascader-panel-disabled').exists()).toBe(true);
    const items = wrapper.findAll('.ant-cascader-menu-item');
    expect(items[0].classes()).toContain('ant-cascader-menu-item-disabled');

    await items[0].trigger('click');
    await nextTick();
    expect(wrapper.findAll('.ant-cascader-menu').length).toBe(1);
    expect(onChange).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('renders custom notFoundContent when options are empty', () => {
    const wrapper = mount(Cascader.Panel, {
      props: {
        options: [],
        notFoundContent: 'Nothing Here',
      },
    });
    expect(wrapper.find('.ant-cascader-panel-empty').exists()).toBe(true);
    expect(wrapper.text()).toContain('Nothing Here');
    wrapper.unmount();
  });

  it('triggers loadData when clicking an unloaded non-leaf option', async () => {
    const loadData = jest.fn();
    const lazyOptions = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
      },
    ];
    const wrapper = mount(Cascader.Panel, {
      props: {
        options: lazyOptions,
        loadData,
      },
    });
    await wrapper.find('.ant-cascader-menu-item').trigger('click');
    await nextTick();
    expect(loadData).toHaveBeenCalledTimes(1);
    expect(loadData.mock.calls[0][0][0].value).toBe('zhejiang');
    wrapper.unmount();
  });

  it('applies Cascader variant classes', () => {
    const borderless = mount(Cascader, { props: { options, variant: 'borderless' } });
    expect(borderless.find('.ant-cascader').classes()).toContain('ant-select-borderless');
    borderless.unmount();

    const filled = mount(Cascader, { props: { options, variant: 'filled' } });
    expect(filled.find('.ant-cascader').classes()).toContain('ant-select-filled');
    filled.unmount();

    const underlined = mount(Cascader, { props: { options, variant: 'underlined' } });
    expect(underlined.find('.ant-cascader').classes()).toContain('ant-select-underlined');
    underlined.unmount();
  });
});
