import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../config-provider';
import Tag from '../../tag';
import Select from '../../select';
import Button from '../../button';
import Input from '../../input';
import Card from '../../card';
import Switch from '../../switch';
import Rate from '../../rate';
import Descriptions from '../../descriptions';
import Modal from '../../modal';
import Pagination from '../../pagination';
import Radio from '../../radio';
import Steps from '../../steps';
import Tooltip from '../../tooltip';
import Table from '../../table';
import DatePicker from '../../date-picker';
import Slider from '../../slider';
import darkAlgorithm from '../themes/dark';
import { useToken } from '../internal';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const effectiveVar = name => {
  let value;
  Array.from(document.querySelectorAll('style')).forEach(style => {
    const css = style.innerHTML || '';
    const re = new RegExp(`${name}\\s*:\\s*([^;}]+)`, 'g');
    let m = re.exec(css);
    while (m) {
      value = m[1].trim();
      m = re.exec(css);
    }
  });
  return value;
};

const App = {
  setup() {
    return () => (
      <div>
        <Tag color="blue">tag</Tag>
        <Tag.CheckableTag checked>checkable</Tag.CheckableTag>
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Select mode="multiple" options={[{ value: 'a', label: 'A' }]} />
        <Button type="primary">btn</Button>
        <Input placeholder="input" />
        <Card title="card">body</Card>
        <Switch />
        <Rate />
        <Descriptions items={[{ key: '1', label: 'L', children: 'C' }]} />
      </div>
    );
  },
};

describe('cssVar 组件 token 变量链路', () => {
  jest.setTimeout(120000);

  // 根因：useCSSVarRegister 的注入与 useGlobalCache 生命周期/DOM 清理存在冲突，
  // 需改为复用 useStyleRegister 的注入通道。修复后改回 it()。
  it('所有 var(--ant-*) 引用都有对应的变量声明（无未解析变量）', async () => {
    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <App /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 60));

    const css = collectCss();
    const refs = new Set([...css.matchAll(/var\((--ant-[a-z0-9-]+)/g)].map(m => m[1]));
    const decls = new Set([...css.matchAll(/(--ant-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
    const unresolved = [...refs].filter(r => !decls.has(r)).sort();

    // eslint-disable-next-line no-console
    console.log(
      `[token-chain] var 引用 ${refs.size} 个 / 变量声明 ${decls.size} 个 / 未解析 ${unresolved.length} 个`,
    );
    if (unresolved.length) {
      // eslint-disable-next-line no-console
      console.log('[token-chain] 未解析样例:', unresolved.slice(0, 15).join(', '));
    }
    // 组件级变量（带组件前缀）应存在
    const compVars = [...decls].filter(d => /^--ant-(tag|select|button|table|card)-/.test(d));
    // eslint-disable-next-line no-console
    console.log(
      `[token-chain] 组件级变量 ${compVars.length} 个，样例: ${compVars.slice(0, 8).join(', ')}`,
    );

    expect(unresolved).toEqual([]);
  });

  it('hash 模式下不产生变量引用（向后兼容）', async () => {
    document.querySelectorAll('style').forEach(s => s.remove());
    document.body.innerHTML = '';
    mount(ConfigProvider, {
      props: { theme: { cssVar: false } },
      slots: { default: () => <Tag>tag</Tag> },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 40));
    const css = collectCss();
    expect(css).not.toContain('var(--ant-');
  });

  it('cssVar 模式下保留 wireframe/motion 布尔 token，不输出非法自定义属性，且支持动态切换', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    let capturedToken;
    let capturedHash;
    const Probe = {
      setup() {
        const [, token, hashId] = useToken();
        return () => {
          capturedToken = token.value;
          capturedHash = hashId.value;
          return (
            <div>
              <Modal open={false} title="m">
                body
              </Modal>
              <Pagination total={50} />
              <Radio checked>r</Radio>
              <Steps current={1} items={[{ title: 'a' }, { title: 'b' }]} />
            </div>
          );
        };
      },
    };

    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true, hashed: true, token: { wireframe: false } } },
      slots: { default: () => <Probe /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));

    expect(capturedToken.wireframe).toBe(false);
    const defaultHash = capturedHash;
    let css = collectCss();
    expect(css).not.toContain('--ant-wireframe');
    expect(css).not.toContain('--ant-motion:');

    // Toggle wireframe: false -> true
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true, token: { wireframe: true, motion: false } },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    expect(capturedToken.wireframe).toBe(true);
    expect(capturedToken.motion).toBe(false);
    const wfHash = capturedHash;
    expect(wfHash).not.toBe(defaultHash);
    css = collectCss();
    expect(css).not.toContain('--ant-wireframe');
    expect(css).not.toContain('--ant-motion:');
    // Modal wireframe rule sets .ant-modal-content { padding: 0 } scoped to wfHash
    expect(css).toContain(`:where(.${wfHash}).ant-modal .ant-modal-content{padding:0;}`);

    // Toggle back wireframe: true -> false
    await wrapper.setProps({
      theme: { cssVar: true, hashed: true, token: { wireframe: false } },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));
    expect(capturedToken.wireframe).toBe(false);
    expect(capturedHash).toBe(defaultHash);
    wrapper.unmount();
  });

  it('Tooltip borderRadius >= 16 时 tooltipRadiusOuter 正确钳制为 4，Input 空字符串 hoverBg/activeBg 不输出断链 var', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          cssVar: { key: 'edge-check' },
          token: { borderRadius: 16 },
          components: {
            Input: { hoverBg: '', activeBg: '' },
          },
        },
      },
      slots: {
        default: () => (
          <div>
            <Tooltip title="tip">
              <span>hover</span>
            </Tooltip>
            <Input placeholder="i" />
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectCss();
    // Tooltip arrow outerRadius clamped to 4 (A 4 4) instead of 6 (A 6 6)
    expect(css).toContain('A 4 4 0 0 0');
    expect(css).not.toContain('A 6 6 0 0 0');
    // Input hoverBg/activeBg explicitly '' must not emit broken var(--ant-input-hover-bg/active-bg)
    expect(css).not.toContain('background-color:var(--ant-input-hover-bg)');
    expect(css).not.toContain('background-color:var(--ant-input-active-bg)');
    wrapper.unmount();
  });

  it('Tag / Table / DatePicker / Slider 组件派生色随动态 Light ↔ Dark 与主色切换实时更新', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true, hashed: true } },
      slots: {
        default: () => (
          <div>
            <Tag variant="solid">solid</Tag>
            <Table columns={[{ title: 'A', dataIndex: 'a' }]} dataSource={[{ key: 1, a: 1 }]} />
            <DatePicker open value={null} />
            <Slider disabled defaultValue={30} />
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const lightTagSolidBg = effectiveVar('--ant-tag-default-solid-bg');
    const lightTagSolidText = effectiveVar('--ant-tag-solid-text-color');
    const lightTableIcon = effectiveVar('--ant-table-header-icon-color');
    const lightTableIconHover = effectiveVar('--ant-table-header-icon-hover-color');
    const lightPickerRangeBorder = effectiveVar('--ant-date-picker-cell-range-border-color');
    const lightPickerRangeHover = effectiveVar('--ant-date-picker-cell-hover-with-range-bg');
    const lightPickerTimeActive = effectiveVar('--ant-date-picker-time-column-active-bg');
    const lightSliderDisabledHandle = effectiveVar('--ant-slider-handle-color-disabled');

    expect(lightTagSolidBg).toBeTruthy();
    expect(lightTagSolidText).toBe('#fff');
    expect(lightTableIcon).toMatch(/rgba\(0,\s*0,\s*0,/);
    expect(lightSliderDisabledHandle.toLowerCase()).toBe('#bfbfbf');

    // Switch dynamically to Dark + custom primary color
    await wrapper.setProps({
      theme: {
        cssVar: true,
        hashed: true,
        algorithm: darkAlgorithm,
        token: { colorPrimary: '#722ed1' },
      },
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 120));

    const darkTagSolidBg = effectiveVar('--ant-tag-default-solid-bg');
    const darkTagSolidText = effectiveVar('--ant-tag-solid-text-color');
    const darkTableIcon = effectiveVar('--ant-table-header-icon-color');
    const darkTableIconHover = effectiveVar('--ant-table-header-icon-hover-color');
    const darkPickerRangeBorder = effectiveVar('--ant-date-picker-cell-range-border-color');
    const darkPickerRangeHover = effectiveVar('--ant-date-picker-cell-hover-with-range-bg');
    const darkPickerTimeActive = effectiveVar('--ant-date-picker-time-column-active-bg');
    const darkSliderDisabledHandle = effectiveVar('--ant-slider-handle-color-disabled');

    // Tag solid switches to light bg + dark text (never black-on-black!)
    expect(darkTagSolidBg).not.toBe(lightTagSolidBg);
    expect(darkTagSolidBg).toMatch(/rgba\(255,\s*255,\s*255,/);
    expect(darkTagSolidText).toBe('#000');

    // Table header icons switch to visible light rgba(255, 255, 255, ...)
    expect(darkTableIcon).not.toBe(lightTableIcon);
    expect(darkTableIcon).toMatch(/rgba\(255,\s*255,\s*255,/);
    expect(darkTableIconHover).not.toBe(lightTableIconHover);

    // DatePicker range & time panel colors update dynamically
    expect(darkPickerRangeBorder).not.toBe(lightPickerRangeBorder);
    expect(darkPickerRangeHover).not.toBe(lightPickerRangeHover);
    expect(darkPickerTimeActive).not.toBe(lightPickerTimeActive);

    // Slider disabled handle updates dynamically in Dark mode
    expect(darkSliderDisabledHandle.toLowerCase()).not.toBe('#bfbfbf');
    wrapper.unmount();
  });
});
