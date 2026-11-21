/**
 * cssVar 模式非法 CSS 检测器
 *
 * 目的：定位 token 算术未改 calc() 时产生的非法值：
 *   - NaN（var() 字符串参与 JS 算术）
 *   - undefined / [object Object]
 *   - var() 裸算术（未被 calc() 包裹）
 *
 * 作为 P1-4b（token 算术改 calc）的验收工具与进度计量。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../components/config-provider';
import Button from '../../components/button';
import Input from '../../components/input';
import Select from '../../components/select';
import Tag from '../../components/tag';
import Card from '../../components/card';
import Switch from '../../components/switch';
import Rate from '../../components/rate';
import Slider from '../../components/slider';
import Steps from '../../components/steps';
import Tabs from '../../components/tabs';
import Spin from '../../components/spin';
import Divider from '../../components/divider';
import Typography from '../../components/typography';
import Descriptions from '../../components/descriptions';
import Checkbox from '../../components/checkbox';
import Radio from '../../components/radio';
import Collapse from '../../components/collapse';
import Badge from '../../components/badge';
import Avatar from '../../components/avatar';
import Breadcrumb from '../../components/breadcrumb';
import Timeline from '../../components/timeline';
import Alert from '../../components/alert';
import Segmented from '../../components/segmented';
import Skeleton from '../../components/skeleton';
import Progress from '../../components/progress';
import Space from '../../components/space';
import Flex from '../../components/flex';
import List from '../../components/list';
import Pagination from '../../components/pagination';
import Statistic from '../../components/statistic';
import Result from '../../components/result';
import Empty from '../../components/empty';
import QRCode from '../../components/qrcode';
import FloatButton from '../../components/float-button';
import Tooltip from '../../components/tooltip';
import Mentions from '../../components/mentions';
import Transfer from '../../components/transfer';
import Upload from '../../components/upload';
import Tour from '../../components/tour';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const App = {
  setup() {
    return () => (
      <div>
        <Button type="primary">btn</Button>
        <Button shape="circle">c</Button>
        <Input placeholder="i" />
        <Input.Search placeholder="s" />
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Tag color="blue">tag</Tag>
        <Card title="c">b</Card>
        <Switch />
        <Rate />
        <Slider defaultValue={30} />
        <Steps current={1} items={[{ title: 'a' }, { title: 'b' }]} />
        <Tabs items={[{ key: '1', label: 'A', children: 'a' }]} />
        <Spin />
        <Divider />
        <Typography.Text strong>t</Typography.Text>
        <Descriptions items={[{ key: '1', label: 'L', children: 'C' }]} />
        <Checkbox>c</Checkbox>
        <Radio>r</Radio>
        <Collapse items={[{ key: '1', label: 'L', children: 'C' }]} />
        <Badge count={5} />
        <Avatar>A</Avatar>
        <Breadcrumb items={[{ title: 'a' }]} />
        <Timeline items={[{ content: 'x' }]} />
        <Alert message="m" />
        <Segmented options={['a', 'b']} value="a" />
        <Skeleton />
        <Progress percent={30} />
        <Space>
          <span>a</span>
        </Space>
        <Flex gap={8}>
          <span>a</span>
        </Flex>
        <List dataSource={['a']} renderItem={i => <List.Item>{i}</List.Item>} />
        <Pagination total={50} />
        <Statistic value={1} />
        <Result status="success" title="ok" />
        <Empty />
        <QRCode value="https://antdv.com" />
        <FloatButton />
        <Tooltip title="t">
          <span>h</span>
        </Tooltip>
        <Mentions options={[]} />
        <Transfer dataSource={[]} targetKeys={[]} />
        <Upload />
        <Tour open={false} steps={[{ title: 'a' }]} />
      </div>
    );
  },
};

const ILLEGAL = [
  { name: 'NaN', re: /\bNaN\b/g },
  { name: 'undefined', re: /\bundefined\b/g },
  { name: '[object Object]', re: /\[object Object\]/g },
  { name: 'var() 裸算术', re: /(?<!calc\()var\(--ant-[a-z0-9-]+\)\s*[*/+-]\s*[-0-9]/g },
];

describe('cssVar 非法 CSS 检测', () => {
  jest.setTimeout(240000);

  it('cssVar 模式下无 NaN / undefined / 裸变量算术', async () => {
    mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: { default: () => <App /> },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectCss();
    const hits = [];
    for (const { name, re } of ILLEGAL) {
      const m = css.match(re);
      if (m && m.length) {
        hits.push(`${name} × ${m.length}`);
      }
    }

    // 打印 NaN 产生的「选择器 :: 属性」清单（去重）
    const uniq = new Set();
    const reRule = /([^{}]+)\{([^{}]*NaN[^{}]*)\}/g;
    let rm = reRule.exec(css);
    while (rm) {
      const sel = rm[1]
        .trim()
        .split(',')
        .pop()
        .trim();
      rm[2]
        .split(';')
        .filter(d => d.includes('NaN'))
        .forEach(d => uniq.add(`${sel} :: ${d.trim().split(':')[0]}`));
      rm = reRule.exec(css);
    }
    const list = [...uniq];
    // eslint-disable-next-line no-console
    console.log(`[illegal-check] CSS ${css.length} B，命中 ${hits.length} 类，NaN 来源 ${list.length} 处`);
    hits.forEach(h => console.log('  ✗ ' + h));
    list.slice(0, 40).forEach(x => console.log('  src: ' + x));

    expect(hits).toEqual([]);
  });
});
