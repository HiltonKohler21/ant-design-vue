/**
 * cssVar 模式非法 CSS 检测器
 *
 * 目的：发现 token 算术未改 calc() 时产生的非法值，例如
 *   - `calc(100% + NaNpx)`            （var 字符串参与 JS 算术得到 NaN）
 *   - `var(--ant-line-width) * 2px`   （变量未包在 calc() 里就参与算术）
 *   - `undefined` / `[object Object]`
 *
 * 作为 P1-4b（248 处算术改 calc）的批次验收工具。
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
import Affix from '../../components/affix';
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
import Watermark from '../../components/watermark';
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
        <Affix>
          <span>affix</span>
        </Affix>
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
        <Watermark content="w">
          <div>w</div>
        </Watermark>
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
  { name: 'NaN', re: /\bNaN\b/ },
  { name: 'undefined', re: /\bundefined\b/ },
  { name: '[object Object]', re: /\[object Object\]/ },
  // 变量直接参与算术（未被 calc 包裹）
  { name: 'var() 裸算术', re: /var\(--ant-[a-z0-9-]+\)\s*[*/+-]\s*[-0-9]/ },
];

describe('cssVar 非法 CSS 检测', () => {
  jest.setTimeout(180000);

  // 已知问题：177 处 token 参与 JS 算术（如 `token.lineWidth * 2`）在 cssVar 模式下会得到 NaN。
  // 需先决策改造路线（见 V6-MIGRATION-PLAN.md「P1-4b 三条路线」）后启用此断言。
  it.skip('cssVar 模式下无 NaN / undefined / 裸变量算术', async () => {
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
      const m = css.match(new RegExp(re.source, 'g'));
      if (m && m.length) {
        hits.push(`${name} × ${m.length}（样例: ${m.slice(0, 3).join(' , ')}）`);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`[illegal-check] CSS 总长 ${css.length} B，非法命中 ${hits.length} 类`);
    hits.forEach(h => console.log('  ✗ ' + h));

    expect(hits).toEqual([]);
  });
});
