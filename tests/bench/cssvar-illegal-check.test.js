/**
 * cssVar 模式下「非法 CSS」检测器
 *
 * 逐组件挂载（含弹层打开态 / 暗色态 / 禁用态），断言生成 CSS 中不存在：
 *   - NaN（var() 字符串参与 JS 算术）
 *   - undefined
 *   - [object Object]
 *   - 未被 calc() 包裹的变量算术（var(--ant-x) * 2）
 *
 * 逐组件拆分的意义：既能定位到具体组件，也避免某个组件的渲染问题掩盖其它组件的检查结果。
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
import DatePicker from '../../components/date-picker';
import Menu from '../../components/menu';
import Tree from '../../components/tree';
import Cascader from '../../components/cascader';
import Dropdown from '../../components/dropdown';
import Image from '../../components/image';
import Watermark from '../../components/watermark';
import Layout from '../../components/layout';
import Form from '../../components/form';
import InputNumber from '../../components/input-number';
import Carousel from '../../components/carousel';
import Anchor from '../../components/anchor';
import BackTop from '../../components/back-top';
import Popconfirm from '../../components/popconfirm';
import Drawer from '../../components/drawer';
import Modal from '../../components/modal';
import Table from '../../components/table';
import Affix from '../../components/affix';
import Grid from '../../components/grid';
import App from '../../components/app';
import TimePicker from '../../components/time-picker';
import Calendar from '../../components/calendar';
import Comment from '../../components/comment';
import PageHeader from '../../components/page-header';
import AutoComplete from '../../components/auto-complete';
import TreeSelect from '../../components/tree-select';
import Popover from '../../components/popover';
import Splitter from '../../components/splitter';
import ColorPicker from '../../components/color-picker';
import useMessageStyle from '../../components/message/style';
import useNotificationStyle from '../../components/notification/style';
import { ref } from 'vue';

const collectCss = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

// 「一元负号直接作用在 var() 上」也是非法值（无法对变量取负，必须用 calc）
const findNegatedVar = css => (css.match(/(?<![\w)])\-var\(--ant-/g) || []).length;

/**
 * 找出「var() 后直接拼接数字/字母」的非法值，例如：
 *   var(--ant-control-interactive-size)32
 *   var(--ant-control-height-lg)NaN
 *   var(--ant-image-z-index-popup)1
 * 合法：var(--x)、var(--x) var(--y)、var(--x);、var(--x))、var(--x)!
 */
const findVarConcat = css => (css.match(/var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/g) || []).length;

/** 找出被误拼 `px` 的无单位变量声明（例如 `--ant-drawer-z-index-popup:1000px`） */
const findUnitlessWithPx = css =>
  css.match(/--ant-[a-z0-9-]*(?:z-index[a-z0-9-]*|beam-duration)\s*:\s*-?\d+(?:\.\d+)?px\b/g) || [];

const ILLEGAL = [
  // 注意：不能用 \bNaN\b —— NaNpx 中 N→p 之间没有词边界，会漏检
  { name: 'NaN', re: /NaN/g },
  { name: 'undefined', re: /undefined/g },
  { name: '[object Object]', re: /\[object Object\]/g },
];

/**
 * 找出「未被 calc() 包裹」的变量算术（真非法）：
 * calc(100% - var(--x) * 2) 合法；var(--x) * 2 非法。
 */
const findBareVarArithmetic = css => {
  const re = /var\(--ant-[a-z0-9-]+\)\s*[*/+-]\s*[-0-9]/g;
  const hits = [];
  let m = re.exec(css);
  while (m) {
    const idx = m.index;
    let depth = 0;
    let insideCalc = false;
    for (let i = idx - 1; i >= 0; i -= 1) {
      const ch = css[i];
      if (ch === ')') depth += 1;
      else if (ch === '(') {
        if (depth === 0) {
          if (css.slice(Math.max(0, i - 4), i) === 'calc') {
            insideCalc = true;
            break;
          }
        } else depth -= 1;
      } else if (ch === ';' || ch === '{' || ch === '}') {
        if (depth === 0) break;
      }
    }
    if (!insideCalc) hits.push(css.slice(Math.max(0, idx - 30), idx + 30));
    m = re.exec(css);
  }
  return hits;
};

const CASES = [
  ['Button', () => <Button type="primary">b</Button>],
  ['Input', () => <Input placeholder="i" />],
  ['Select', () => <Select open options={[{ value: 'a', label: 'A' }]} />],
  ['Tag', () => <Tag color="blue">t</Tag>],
  ['Card', () => <Card title="c">b</Card>],
  ['Switch', () => <Switch />],
  ['Rate', () => <Rate />],
  ['Slider', () => <Slider defaultValue={30} />],
  ['Slider(disabled)', () => <Slider disabled defaultValue={30} />],
  ['Steps', () => <Steps current={1} items={[{ title: 'a' }, { title: 'b' }]} />],
  ['Tabs', () => <Tabs items={[{ key: '1', label: 'A', children: 'a' }]} />],
  ['Spin', () => <Spin />],
  ['Divider', () => <Divider />],
  ['Typography', () => <Typography.Text strong>t</Typography.Text>],
  ['Descriptions', () => <Descriptions items={[{ key: '1', label: 'L', children: 'C' }]} />],
  ['Checkbox', () => <Checkbox>c</Checkbox>],
  ['Radio', () => <Radio>r</Radio>],
  ['Collapse', () => <Collapse items={[{ key: '1', label: 'L', children: 'C' }]} />],
  ['Badge', () => <Badge count={5} />],
  ['Avatar', () => <Avatar>A</Avatar>],
  ['Breadcrumb', () => <Breadcrumb items={[{ title: 'a' }]} />],
  ['Timeline', () => <Timeline items={[{ content: 'x' }]} />],
  ['Alert', () => <Alert message="m" />],
  ['Segmented', () => <Segmented options={['a', 'b']} value="a" />],
  ['Skeleton', () => <Skeleton />],
  ['Progress', () => <Progress percent={30} />],
  [
    'Space',
    () => (
      <Space>
        <span>a</span>
      </Space>
    ),
  ],
  [
    'Flex',
    () => (
      <Flex gap={8}>
        <span>a</span>
      </Flex>
    ),
  ],
  ['List', () => <List dataSource={['a']} renderItem={i => <List.Item>{i}</List.Item>} />],
  ['Pagination', () => <Pagination total={50} />],
  ['Statistic', () => <Statistic value={1} />],
  ['Result', () => <Result status="success" title="ok" />],
  ['Empty', () => <Empty />],
  ['QRCode', () => <QRCode value="https://antdv.com" />],
  ['FloatButton', () => <FloatButton />],
  [
    'Tooltip',
    () => (
      <Tooltip title="t" open>
        <span>h</span>
      </Tooltip>
    ),
  ],
  ['Mentions', () => <Mentions options={[]} />],
  ['Transfer', () => <Transfer dataSource={[]} targetKeys={[]} />],
  ['Upload', () => <Upload />],
  ['Tour', () => <Tour open={false} steps={[{ title: 'a' }]} />],
  ['DatePicker(open)', () => <DatePicker open value={null} />],
  [
    'Menu(dark)',
    () => (
      <Menu
        theme="dark"
        mode="horizontal"
        items={[{ key: '1', label: 'a' }]}
        selectedKeys={['1']}
      />
    ),
  ],
  ['Menu(inline)', () => <Menu theme="light" mode="inline" items={[{ key: '1', label: 'b' }]} />],
  [
    'Tree',
    () => <Tree treeData={[{ key: '1', title: 'a', children: [{ key: '2', title: 'b' }] }]} />,
  ],
  [
    'Cascader(open)',
    () => (
      <Cascader
        open
        options={[{ value: 'a', label: 'A', children: [{ value: 'b', label: 'B' }] }]}
      />
    ),
  ],
  [
    'Dropdown(open)',
    () => (
      <Dropdown open menu={{ items: [{ key: '1', label: 'd' }] }}>
        <span>dd</span>
      </Dropdown>
    ),
  ],
  [
    'App',
    () => (
      <App>
        <div>app</div>
      </App>
    ),
  ],
  ['TimePicker(open)', () => <TimePicker open value={null} />],
  ['Calendar', () => <Calendar />],
  ['Comment', () => <Comment author="a" content="c" />],
  ['PageHeader', () => <PageHeader title="t" />],
  ['AutoComplete(open)', () => <AutoComplete open options={[{ value: 'a' }]} />],
  ['TreeSelect(open)', () => <TreeSelect open treeData={[{ value: 'a', title: 'A' }]} />],
  [
    'Popover(open)',
    () => (
      <Popover open title="t" content="c">
        <span>x</span>
      </Popover>
    ),
  ],
  [
    'Splitter',
    () => (
      <Splitter>
        <Splitter.Panel>a</Splitter.Panel>
        <Splitter.Panel>b</Splitter.Panel>
      </Splitter>
    ),
  ],
  ['ColorPicker(open)', () => <ColorPicker open value="#1677ff" />],
  ['Image', () => <Image src="https://antdv.com/x.png" />],
  [
    'Layout',
    () => (
      <Layout>
        <Layout.Header>h</Layout.Header>
        <Layout>
          <Layout.Sider collapsible />
          <Layout.Content>c</Layout.Content>
        </Layout>
      </Layout>
    ),
  ],
  [
    'Layout(hasSider)',
    () => (
      <Layout hasSider>
        <Layout.Sider />
        <Layout.Content>c</Layout.Content>
      </Layout>
    ),
  ],
  [
    'Form(vertical)',
    () => (
      <Form layout="vertical">
        <Form.Item label="l" required>
          <Input />
        </Form.Item>
      </Form>
    ),
  ],
  [
    'Form(horizontal)',
    () => (
      <Form>
        <Form.Item label="l">
          <Input />
        </Form.Item>
      </Form>
    ),
  ],
  ['InputNumber', () => <InputNumber min={0} max={10} value={1} />],
  [
    'Carousel',
    () => (
      <Carousel arrows dots>
        <div>a</div>
        <div>b</div>
      </Carousel>
    ),
  ],
  ['Anchor', () => <Anchor items={[{ key: '1', href: '#a', title: 'a' }]} />],
  ['BackTop', () => <BackTop visible />],
  [
    'Popconfirm(open)',
    () => (
      <Popconfirm open title="t" description="d">
        <span>x</span>
      </Popconfirm>
    ),
  ],
  ['Upload(list)', () => <Upload fileList={[]} />],
  ['Upload(picture-card)', () => <Upload listType="picture-card" fileList={[]} />],
  [
    'Upload(dragger)',
    () => (
      <Upload.Dragger fileList={[]}>
        <p>drag</p>
      </Upload.Dragger>
    ),
  ],
  ['Tour(open)', () => <Tour open steps={[{ title: 'a', description: 'b' }]} />],
  ['Image(preview)', () => <Image src="https://antdv.com/x.png" preview={{ open: true }} />],
  [
    'Table(expandable)',
    () => (
      <Table
        columns={[{ title: 'A', dataIndex: 'a' }]}
        dataSource={[{ key: 1, a: 1 }]}
        expandable={{ expandedRowRender: () => <div>x</div> }}
      />
    ),
  ],
  [
    'Modal(open)',
    () => (
      <Modal open title="m">
        body
      </Modal>
    ),
  ],
  [
    'Drawer(open)',
    () => (
      <Drawer open title="d">
        body
      </Drawer>
    ),
  ],
  [
    'Affix',
    () => (
      <Affix>
        <span>a</span>
      </Affix>
    ),
  ],
  [
    'Grid',
    () => (
      <Grid.Row gutter={16}>
        <Grid.Col span={12}>a</Grid.Col>
      </Grid.Row>
    ),
  ],
  [
    'Watermark',
    () => (
      <Watermark content="w">
        <div>wm</div>
      </Watermark>
    ),
  ],
];

const check = async slot => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  mount(ConfigProvider, {
    props: { theme: { cssVar: true } },
    slots: { default: slot },
    attachTo: 'body',
  });
  await nextTick();
  await new Promise(r => setTimeout(r, 80));

  const css = collectCss();
  const hits = [];
  for (const { name, re } of ILLEGAL) {
    const m = css.match(re);
    if (m && m.length) hits.push(`${name} × ${m.length}`);
  }
  const bareVar = findBareVarArithmetic(css);
  if (bareVar.length) hits.push(`var() 裸算术 × ${bareVar.length}`);
  const negVar = findNegatedVar(css);
  if (negVar) hits.push(`-var() × ${negVar}`);
  const unitlessPx = findUnitlessWithPx(css);
  if (unitlessPx.length)
    hits.push(`unitless px × ${unitlessPx.length} (${unitlessPx.slice(0, 3).join(', ')})`);
  const varConcat = findVarConcat(css);
  if (varConcat) {
    hits.push(`var() 拼数字 × ${varConcat}`);
    const reC = /var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/g;
    let cm = reC.exec(css);
    let cnt = 0;
    while (cm && cnt < 5) {
      console.log(
        '    concat: …' +
          css.slice(Math.max(0, cm.index - 40), cm.index + 40).replace(/\n/g, ' ') +
          '…',
      );
      cm = reC.exec(css);
      cnt += 1;
    }
  }

  if (hits.length) {
    const uniq = new Set();
    const reRule = /([^{}]+)\{([^{}]*(?:NaN|undefined|\[object Object\])[^{}]*)\}/g;
    let rm = reRule.exec(css);
    while (rm) {
      const sel = rm[1].trim().split(',').pop().trim();
      rm[2]
        .split(';')
        .filter(d => /NaN|undefined|\[object Object\]/.test(d))
        .forEach(d => uniq.add(`${sel} :: ${d.trim().split(':')[0]}`));
      rm = reRule.exec(css);
    }
    [...uniq].slice(0, 10).forEach(x => console.log(`    src: ${x}`));
  }

  return { cssBytes: css.length, hits };
};

describe('cssVar 非法 CSS 检测（逐组件）', () => {
  jest.setTimeout(600000);

  it.each(CASES)('%s 不产生非法 CSS', async (name, slot) => {
    const { cssBytes, hits } = await check(slot);
    expect(hits).toEqual([]);
    // 顺带记录体积，便于发现「样式没生成」的异常
    expect(cssBytes).toBeGreaterThan(100);
    // eslint-disable-next-line no-console
    console.log(`  ✓ ${name}（${cssBytes} B）`);
  });

  it('组件级 zIndexPopup 变量必须是无单位纯整数（无 px 后缀）', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const MessageStyleProbe = {
      setup() {
        const [wrapMsg] = useMessageStyle(ref('ant-message'));
        const [wrapNoti] = useNotificationStyle(ref('ant-notification'));
        return () => wrapMsg(wrapNoti(<div class="probe-overlay" />));
      },
    };

    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <div>
            <Drawer open title="d">
              drawer
            </Drawer>
            <Popover open title="t" content="c">
              <span>pop</span>
            </Popover>
            <Tooltip open title="tip">
              <span>tip</span>
            </Tooltip>
            <Dropdown open menu={{ items: [{ key: '1', label: 'd' }] }}>
              <span>dd</span>
            </Dropdown>
            <Select open options={[{ value: 'a', label: 'A' }]} />
            <Image src="https://antdv.com/x.png" />
            <MessageStyleProbe />
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));

    const css = collectCss();
    const expectedVars = [
      '--ant-drawer-z-index-popup',
      '--ant-popover-z-index-popup',
      '--ant-message-z-index-popup',
      '--ant-notification-z-index-popup',
      '--ant-tooltip-z-index-popup',
      '--ant-dropdown-z-index-popup',
      '--ant-select-z-index-popup',
      '--ant-image-z-index-popup',
    ];
    expectedVars.forEach(varName => {
      const m = css.match(new RegExp(`${varName}\\s*:\\s*([^;}]+)`));
      expect(m).toBeTruthy();
      expect(m[1].trim()).toMatch(/^\d+$/);
    });
    expect(findUnitlessWithPx(css)).toEqual([]);
    wrapper.unmount();
  });

  it('Popover wireframe 模式下不产生 NaNpx', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true, token: { wireframe: true } } },
      slots: {
        default: () => (
          <Popover open title="t" content="c">
            <span>w</span>
          </Popover>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 80));
    const css = collectCss();
    expect(css).not.toContain('NaN');
    wrapper.unmount();
  });
});
