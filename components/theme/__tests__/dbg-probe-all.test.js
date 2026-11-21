/**
 * 全量非法 CSS 探针（开发期定位用，跑完即删）
 * 逐个挂载组件（含弹层打开态 / 暗色态），统计 cssVar 模式下产生 NaN 的规则。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../config-provider';
import DatePicker from '../../date-picker';
import Menu from '../../menu';
import Tree from '../../tree';
import Transfer from '../../transfer';
import Cascader from '../../cascader';
import Dropdown from '../../dropdown';
import Watermark from '../../watermark';
import Slider from '../../slider';
import Select from '../../select';

const cssOf = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const probe = async (label, slot) => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  mount(ConfigProvider, {
    props: { theme: { cssVar: true } },
    slots: { default: slot },
    attachTo: 'body',
  });
  await nextTick();
  await new Promise(r => setTimeout(r, 120));
  const css = cssOf();
  const rules = css.match(/([^{}]+)\{([^{}]*NaN[^{}]*)\}/g) || [];
  console.log(`PROBE|${label}|${rules.length}`);
  rules.slice(0, 8).forEach(r => console.log('  R|' + r.replace(/\s+/g, ' ').slice(0, 500)));
};

describe('probe-all', () => {
  jest.setTimeout(300000);

  it('date-picker open', async () => {
    await probe('DatePicker', () => <DatePicker open value={null} />);
  });
  it('menu dark horizontal', async () => {
    await probe('Menu', () => (
      <Menu theme="dark" mode="horizontal" items={[{ key: '1', label: 'a' }]} selectedKeys={['1']} />
    ));
  });
  it('tree', async () => {
    await probe('Tree', () => (
      <Tree treeData={[{ key: '1', title: 'a', children: [{ key: '2', title: 'b' }] }]} />
    ));
  });
  it('transfer', async () => {
    await probe('Transfer', () => <Transfer dataSource={[]} targetKeys={[]} />);
  });
  it('cascader open', async () => {
    await probe('Cascader', () => <Cascader open options={[{ value: 'a', label: 'A' }]} />);
  });
  it('dropdown open', async () => {
    await probe('Dropdown', () => (
      <Dropdown open menu={{ items: [{ key: '1', label: 'a' }] }}>
        <span>t</span>
      </Dropdown>
    ));
  });
  it('watermark', async () => {
    await probe('Watermark', () => (
      <Watermark content="w">
        <div>c</div>
      </Watermark>
    ));
  });
  it('slider disabled', async () => {
    await probe('Slider', () => <Slider disabled defaultValue={30} />);
  });
  it('select open', async () => {
    await probe('Select', () => <Select open options={[{ value: 'a', label: 'A' }]} />);
  });
});
