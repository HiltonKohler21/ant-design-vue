import { mount } from '@vue/test-utils';
import { nextTick, h } from 'vue';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import Steps from '../components/steps';
import { calcRangeKeys, convertDirectoryKeysToNodes } from '../components/tree/utils/dictUtil';
import Calendar from '../components/calendar';
import message from '../components/message';
import Layout from '../components/layout';
import Table from '../components/table';
import Form from '../components/form';
import Input from '../components/input';
import Checkbox from '../components/checkbox';
import Upload from '../components/upload';
import Image from '../components/image';
import Slider from '../components/slider';
import Modal from '../components/modal';
import Drawer from '../components/drawer';
import Cascader from '../components/cascader';
import FloatButton from '../components/float-button';
import Anchor from '../components/anchor';
import BackTop from '../components/back-top';
import ConfigProvider from '../components/config-provider';
import useReducedMotion, {
  isPrefersReducedMotion,
} from '../components/_util/hooks/useReducedMotion';

describe('Upstream antd@6.7.2 + master sync regressions', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('Steps preserves zero-valued icon (icon={0})', async () => {
    const wrapper = mount(Steps, {
      props: {
        items: [{ title: 'Zero Step', icon: 0 }, { title: 'Normal Step' }],
      },
    });
    await nextTick();
    const icons = wrapper.findAll('.ant-steps-icon');
    expect(icons.length).toBeGreaterThanOrEqual(2);
    expect(icons[0].text()).toBe('0');
    wrapper.unmount();
  });

  it('Tree dictUtil calcRangeKeys and convertDirectoryKeysToNodes work with Set optimization', () => {
    const treeData = [
      {
        key: '0',
        title: 'root',
        children: [
          { key: '0-0', title: 'child-0' },
          { key: '0-1', title: 'child-1' },
          { key: '0-2', title: 'child-2' },
        ],
      },
      { key: '1', title: 'sibling' },
    ];
    const range = calcRangeKeys({
      treeData,
      expandedKeys: ['0'],
      startKey: '0-0',
      endKey: '1',
    });
    expect(range).toEqual(['0-0', '0-1', '0-2', '1']);

    const nodes = convertDirectoryKeysToNodes(treeData, ['0-1', '1']);
    expect(nodes.map(n => n.key)).toEqual(['0-1', '1']);
  });

  it('Calendar validRange includes start and end boundary dates regardless of time-of-day', async () => {
    const start = dayjs('2026-11-10 15:30:00');
    const end = dayjs('2026-11-20 08:15:00');
    const wrapper = mount(Calendar, {
      props: {
        fullscreen: false,
        value: dayjs('2026-11-15 12:00:00'),
        validRange: [start, end],
      },
    });
    await nextTick();
    const startCell = wrapper.find('td[title="2026-11-10"]');
    const endCell = wrapper.find('td[title="2026-11-20"]');
    const beforeCell = wrapper.find('td[title="2026-11-09"]');
    const afterCell = wrapper.find('td[title="2026-11-21"]');
    expect(startCell.exists()).toBe(true);
    expect(endCell.exists()).toBe(true);
    expect(startCell.classes()).not.toContain('ant-picker-cell-disabled');
    expect(endCell.classes()).not.toContain('ant-picker-cell-disabled');
    expect(beforeCell.classes()).toContain('ant-picker-cell-disabled');
    expect(afterCell.classes()).toContain('ant-picker-cell-disabled');
    wrapper.unmount();
  });

  it('Message static open settles promise when closed immediately before mount', async () => {
    const onClose = jest.fn();
    const closeFn = message.open({
      content: 'Instant close',
      duration: 0,
      onClose,
    });
    let resolved = false;
    const p = closeFn.then(() => {
      resolved = true;
    });
    closeFn();
    await p;
    expect(resolved).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    message.destroy();
  });

  it('Layout Header/Footer/Content preserve base classes alongside custom prefixCls', async () => {
    const wrapper = mount({
      render() {
        return h(Layout, null, {
          default: () => [
            h(Layout.Header, { prefixCls: 'custom-header' }, () => 'H'),
            h(Layout.Content, { prefixCls: 'custom-content' }, () => 'C'),
            h(Layout.Footer, { prefixCls: 'custom-footer' }, () => 'F'),
          ],
        });
      },
    });
    await nextTick();
    expect(wrapper.find('header').classes()).toContain('custom-header');
    expect(wrapper.find('header').classes()).toContain('ant-layout-header');
    expect(wrapper.find('main').classes()).toContain('custom-content');
    expect(wrapper.find('main').classes()).toContain('ant-layout-content');
    expect(wrapper.find('footer').classes()).toContain('custom-footer');
    expect(wrapper.find('footer').classes()).toContain('ant-layout-footer');
    wrapper.unmount();
  });

  it('Table applies defaultSortOrder on grouping child columns', async () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        columns: [
          {
            title: 'Metrics',
            children: [
              {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.score - b.score,
              },
            ],
          },
        ],
        dataSource: [
          { key: '1', score: 10 },
          { key: '2', score: 30 },
          { key: '3', score: 20 },
        ],
      },
    });
    await nextTick();
    const cells = wrapper.findAll('tbody tr td').map(td => td.text());
    expect(cells).toEqual(['30', '20', '10']);
    wrapper.unmount();
  });

  it('Form.Item preserves name={0} in validation message label', async () => {
    const formRef = { current: null };
    const model = { 0: '' };
    const wrapper = mount({
      setup() {
        return () =>
          h(
            Form,
            {
              ref: el => {
                formRef.current = el;
              },
              model,
            },
            {
              default: () =>
                h(
                  Form.Item,
                  {
                    name: 0,
                    rules: [{ required: true }],
                  },
                  {
                    default: () => h(Input, { value: model[0] }),
                  },
                ),
            },
          );
      },
    });
    await nextTick();
    await expect(formRef.current.validate()).rejects.toMatchObject({
      errorFields: [
        {
          name: [0],
          errors: [expect.stringContaining('0')],
        },
      ],
    });
    wrapper.unmount();
  });

  it('Checkbox syncs native DOM input.indeterminate property and preserves it on click', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        indeterminate: true,
        checked: false,
      },
    });
    await nextTick();
    const inputEl = wrapper.find('input[type="checkbox"]').element;
    expect(inputEl.indeterminate).toBe(true);

    await wrapper.find('input[type="checkbox"]').trigger('change');
    await nextTick();
    expect(inputEl.indeterminate).toBe(true);

    await wrapper.setProps({ indeterminate: false });
    await nextTick();
    expect(inputEl.indeterminate).toBe(false);
    wrapper.unmount();
  });

  it('Upload handles malformed JSON in file.linkProps gracefully without throwing', async () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(Upload, {
      props: {
        fileList: [
          {
            uid: '1',
            name: 'broken.txt',
            status: 'done',
            url: 'https://example.com/broken.txt',
            linkProps: '{invalid-json',
          },
        ],
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-upload-list-item-name').text()).toBe('broken.txt');
    warnSpy.mockRestore();
    wrapper.unmount();
  });

  it('useReducedMotion detects prefers-reduced-motion media query', () => {
    const matchMediaMock = window.matchMedia;
    const prevImpl = matchMediaMock.getMockImplementation?.();
    matchMediaMock.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    try {
      expect(isPrefersReducedMotion()).toBe(true);

      let reducedRef;
      const wrapper = mount({
        setup() {
          reducedRef = useReducedMotion();
          return () => h('div', String(reducedRef.value));
        },
      });
      expect(wrapper.text()).toBe('true');
      wrapper.unmount();
    } finally {
      if (prevImpl) {
        matchMediaMock.mockImplementation(prevImpl);
      }
    }
  });

  it('Anchor and BackTop mount cleanly with reduced motion support', async () => {
    const anchor = mount(Anchor, {
      props: {
        items: [{ key: '1', href: '#sec1', title: 'Section 1' }],
      },
    });
    const backTop = mount(BackTop, { props: { visibilityHeight: 0 } });
    const fbBackTop = mount(FloatButton.BackTop, { props: { visibilityHeight: 0 } });
    await nextTick();
    expect(anchor.find('.ant-anchor').exists()).toBe(true);
    expect(backTop.exists()).toBe(true);
    expect(fbBackTop.exists()).toBe(true);
    anchor.unmount();
    backTop.unmount();
    fbBackTop.unmount();
  });

  it('Image supports placeholder.progress overlay, custom render, wrapperStyle and rootStyle', async () => {
    const wrapper = mount(Image, {
      props: {
        src: 'https://example.com/slow.png',
        width: 200,
        height: 150,
        rootStyle: { border: '1px solid red' },
        placeholder: {
          progress: { percent: 45 },
        },
        classNames: {
          placeholder: { progress: { root: 'my-progress-cls' } },
        },
      },
    });
    await nextTick();
    const progressEl = wrapper.find('.ant-image-progress-wrapper');
    expect(progressEl.exists()).toBe(true);
    expect(progressEl.attributes('style')).toContain('border: 1px solid red');
    expect(progressEl.classes()).toContain('my-progress-cls');
    expect(progressEl.attributes('role')).toBe('progressbar');
    expect(progressEl.attributes('aria-valuenow')).toBe('45');
    wrapper.unmount();

    const customWrapper = mount(Image, {
      props: {
        src: 'https://example.com/slow2.png',
        placeholder: {
          progress: {
            percent: 72,
            render: (_progress, percent) => h('span', { class: 'custom-prog' }, `${percent}%`),
          },
        },
      },
    });
    await nextTick();
    expect(customWrapper.find('.custom-prog').text()).toBe('72%');
    customWrapper.unmount();
  });

  it('Slider supports startPoint and ariaDescribedByForHandle', async () => {
    const wrapper = mount(Slider, {
      props: {
        min: -50,
        max: 50,
        value: 20,
        startPoint: 0,
        ariaDescribedByForHandle: 'slider-desc-id',
      },
    });
    await nextTick();
    const trackStyle = wrapper.find('.ant-slider-track').attributes('style') || '';
    expect(trackStyle).toContain('left: 50%');
    expect(trackStyle).toContain('width: 20%');
    expect(wrapper.find('.ant-slider-handle').attributes('aria-describedby')).toBe(
      'slider-desc-id',
    );
    wrapper.unmount();
  });

  it('Modal supports scrollLock={false} without locking body overflow', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        scrollLock: false,
        title: 'Unlocked Modal',
      },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.querySelector('.ant-modal-title')?.textContent).toBe('Unlocked Modal');
    expect(document.body.style.overflow).not.toBe('hidden');
    wrapper.unmount();
  });

  it('Drawer supports focusable config and restores trigger focus on close', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open Drawer';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const wrapper = mount(Drawer, {
      props: {
        open: false,
        title: 'Focusable Drawer',
        getContainer: false,
        focusable: { focusTriggerAfterClose: true },
      },
      global: {
        stubs: {
          transition: true,
        },
      },
      attachTo: document.body,
    });
    await nextTick();
    await wrapper.setProps({ open: true });
    await nextTick();
    trigger.blur();
    await wrapper.setProps({ open: false });
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(document.activeElement).toBe(trigger);
    wrapper.unmount();
  });

  it('Cascader invokes deprecated onPopupVisibleChange alias alongside onOpenChange', async () => {
    const onPopupVisibleChange = jest.fn();
    const onOpenChange = jest.fn();
    const wrapper = mount(Cascader, {
      props: {
        options: [{ value: 'a', label: 'A' }],
        onPopupVisibleChange,
        onOpenChange,
      },
      attachTo: document.body,
    });
    await nextTick();
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    expect(onPopupVisibleChange).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    wrapper.unmount();
  });

  it('Input, TextArea and Input.OTP forward autoComplete prop and ConfigProvider defaults', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        input: { autoComplete: 'off' },
      },
      slots: {
        default: () => [
          h(Input, { class: 'test-input' }),
          h(Input.TextArea, { class: 'test-textarea' }),
          h(Input.OTP, { length: 4, autoComplete: 'one-time-code' }),
        ],
      },
    });
    await nextTick();
    expect(wrapper.find('input.ant-input').attributes('autocomplete')).toBe('off');
    expect(wrapper.find('textarea.ant-input').attributes('autocomplete')).toBe('off');
    const otpInputs = wrapper.findAll('.ant-otp-input');
    expect(otpInputs.length).toBe(4);
    otpInputs.forEach(input => {
      expect(input.attributes('autocomplete')).toBe('one-time-code');
    });
    wrapper.unmount();
  });

  it('FloatButton and FloatButton.Group apply -individual class for circle groups only', async () => {
    const circleGroup = mount(FloatButton.Group, {
      props: { shape: 'circle' },
      slots: {
        default: () => [h(FloatButton), h(FloatButton)],
      },
    });
    await nextTick();
    expect(circleGroup.find('.ant-float-btn-group').classes()).toContain(
      'ant-float-btn-group-individual',
    );
    expect(circleGroup.find('.ant-float-btn').classes()).toContain('ant-float-btn-individual');
    circleGroup.unmount();

    const squareGroup = mount(FloatButton.Group, {
      props: { shape: 'square' },
      slots: {
        default: () => [h(FloatButton), h(FloatButton)],
      },
    });
    await nextTick();
    expect(squareGroup.find('.ant-float-btn-group').classes()).not.toContain(
      'ant-float-btn-group-individual',
    );
    expect(squareGroup.find('.ant-float-btn').classes()).not.toContain('ant-float-btn-individual');
    squareGroup.unmount();
  });

  it('All 74 locale packs load cleanly and include synced upstream keys', () => {
    const localeDir = path.resolve(__dirname, '../components/locale');
    const localeFiles = fs
      .readdirSync(localeDir)
      .filter(f => /^[a-z]{2,3}_[A-Z]{2}\.ts$/.test(f))
      .sort();

    expect(localeFiles.length).toBe(74);

    const expectedNewLocales = [
      'ckb_IQ.ts',
      'es_US.ts',
      'eu_ES.ts',
      'mr_IN.ts',
      'my_MM.ts',
      'si_LK.ts',
      'sq_AL.ts',
      'tk_TK.ts',
      'uz_UZ.ts',
    ];
    expectedNewLocales.forEach(file => {
      expect(localeFiles).toContain(file);
    });

    localeFiles.forEach(file => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(path.join(localeDir, file));
      const loc = mod.default || mod;
      expect(typeof loc.locale).toBe('string');
      expect(loc.Pagination).toBeTruthy();
      expect(loc.DatePicker).toBeTruthy();
      expect(loc.TimePicker).toBeTruthy();
      expect(loc.Calendar).toBeTruthy();
      expect(loc.Table).toBeTruthy();
      expect(loc.Table.filterConfirm).toBeTruthy();
    });

    // Verify specific latest upstream updates (ko_KR & uz_UZ)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const koKR = require(path.join(localeDir, 'ko_KR.ts')).default;
    expect(koKR.global.clear).toBe('지우기');
    expect(koKR.Input.otpCell).toBeTruthy();
    expect(koKR.ColorPicker).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uzUZ = require(path.join(localeDir, 'uz_UZ.ts')).default;
    expect(uzUZ.locale).toBe('uz-latn');
    expect(uzUZ.DatePicker.lang).toBeTruthy();
  });
});
