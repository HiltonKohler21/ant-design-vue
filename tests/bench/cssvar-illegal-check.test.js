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
import { nextTick, ref } from 'vue';
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
import { genCalc } from '../../components/_util/cssinjs';

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
  { name: 'pxpx', re: /\dpxpx\b/g },
  { name: 'calc()后缀单位', re: /calc\([^;{}]*\)(?:px|em|rem|%)/g },
  { name: '-calc()', re: /(?<![\w)-])-calc\(/g },
];

const DIMENSION_PROPS = new Set([
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block',
  'padding-block-start',
  'padding-block-end',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block',
  'margin-block-start',
  'margin-block-end',
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'inset-block',
  'inset-block-start',
  'inset-block-end',
  'inset-inline',
  'inset-inline-start',
  'inset-inline-end',
  'font-size',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-start-radius',
  'border-end-end-radius',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-inline-width',
  'border-inline-start-width',
  'border-inline-end-width',
  'border-block-width',
  'border-block-start-width',
  'border-block-end-width',
  'gap',
  'row-gap',
  'column-gap',
]);

/** 剥离顶层函数调用（calc(...) / var(...) / min(...) 等），仅保留外层空白分隔 token */
const stripParenGroups = str => {
  let out = '';
  let depth = 0;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    if (ch === '(') {
      depth += 1;
      out += ' ';
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
      out += ' ';
    } else if (depth === 0) {
      out += ch;
    }
  }
  return out;
};

/**
 * 检查声明级非法值（覆盖 Hash 模式与 cssVar 模式）：
 *   1) 尺寸属性出现非零无单位数值（如 padding: -1 7px; padding-inline: 7; inset-inline-start: 11;）
 *   2) line-height 出现 >= 10 的无单位数值（如 line-height: 28; line-height: 30;）
 *   3) z-index 误带 px 后缀（如 z-index: 1081px; z-index: calc(2px + 1px);）
 */
const findDeclarationUnitBugs = css => {
  const unitlessDims = [];
  const absurdLineHeights = [];
  const zIndexWithPx = [];
  const reBlock = /([^{}@]+)\{([^{}]*)\}/g;
  let m = reBlock.exec(css);
  while (m) {
    const sel = m[1].trim().split(',').pop().trim();
    const body = m[2];
    const decls = body.split(';');
    for (let i = 0; i < decls.length; i += 1) {
      const decl = decls[i].trim();
      if (!decl) continue;
      const colon = decl.indexOf(':');
      if (colon <= 0) continue;
      const prop = decl.slice(0, colon).trim().toLowerCase();
      if (prop.startsWith('--')) continue;
      const rawVal = decl
        .slice(colon + 1)
        .replace(/!important\s*$/i, '')
        .trim();

      if (DIMENSION_PROPS.has(prop)) {
        const topTokens = stripParenGroups(rawVal)
          .replace(/\b(?:calc|var|min|max|clamp|env)\b/gi, ' ')
          .split(/[\s/]+/)
          .filter(Boolean);
        const badTok = topTokens.find(
          tok => /^-?(?:\d+\.?\d*|\.\d+)$/.test(tok) && parseFloat(tok) !== 0,
        );
        if (badTok !== undefined) {
          unitlessDims.push(`${sel} :: ${prop}:${rawVal}`);
        }
      } else if (prop === 'line-height') {
        if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(rawVal) && parseFloat(rawVal) >= 10) {
          absurdLineHeights.push(`${sel} :: ${prop}:${rawVal}`);
        }
      } else if (prop === 'z-index') {
        if (/\dpx\b/.test(rawVal)) {
          zIndexWithPx.push(`${sel} :: ${prop}:${rawVal}`);
        }
      }
    }
    m = reBlock.exec(css);
  }
  return { unitlessDims, absurdLineHeights, zIndexWithPx };
};

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

const check = async (slot, { cssVar = true } = {}) => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  mount(ConfigProvider, {
    props: { theme: { cssVar } },
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
      // eslint-disable-next-line no-console
      console.log(
        '    concat: …' +
          css.slice(Math.max(0, cm.index - 40), cm.index + 40).replace(/\n/g, ' ') +
          '…',
      );
      cm = reC.exec(css);
      cnt += 1;
    }
  }

  const { unitlessDims, absurdLineHeights, zIndexWithPx } = findDeclarationUnitBugs(css);
  if (unitlessDims.length) {
    hits.push(`无单位尺寸 × ${unitlessDims.length} (${unitlessDims.slice(0, 3).join(' | ')})`);
  }
  if (absurdLineHeights.length) {
    hits.push(
      `异常无单位 line-height × ${absurdLineHeights.length} (${absurdLineHeights
        .slice(0, 3)
        .join(' | ')})`,
    );
  }
  if (zIndexWithPx.length) {
    hits.push(`z-index 带 px × ${zIndexWithPx.length} (${zIndexWithPx.slice(0, 3).join(' | ')})`);
  }

  if (hits.length) {
    const uniq = new Set();
    const reRule = /([^{}]+)\{([^{}]*(?:NaN|undefined|\[object Object\]|\dpxpx|-calc\()[^{}]*)\}/g;
    let rm = reRule.exec(css);
    while (rm) {
      const sel = rm[1].trim().split(',').pop().trim();
      rm[2]
        .split(';')
        .filter(d => /NaN|undefined|\[object Object\]|\dpxpx|-calc\(/.test(d))
        .forEach(d => uniq.add(`${sel} :: ${d.trim()}`));
      rm = reRule.exec(css);
    }
    // eslint-disable-next-line no-console
    [...uniq].slice(0, 10).forEach(x => console.log(`    src: ${x}`));
  }

  return { cssBytes: css.length, hits };
};

describe('cssVar 非法 CSS 检测（逐组件）', () => {
  jest.setTimeout(600000);

  it.each(CASES)('%s [cssVar: true] 不产生非法 CSS', async (name, slot) => {
    const { cssBytes, hits } = await check(slot, { cssVar: true });
    expect(hits).toEqual([]);
    // 顺带记录体积，便于发现「样式没生成」的异常
    expect(cssBytes).toBeGreaterThan(100);
    // eslint-disable-next-line no-console
    console.log(`  ✓ [cssVar] ${name}（${cssBytes} B）`);
  });

  it.each(CASES)('%s [cssVar: false / Hash 模式] 不产生非法 CSS 与单位缺失', async (name, slot) => {
    const { cssBytes, hits } = await check(slot, { cssVar: false });
    expect(hits).toEqual([]);
    expect(cssBytes).toBeGreaterThan(100);
    // eslint-disable-next-line no-console
    console.log(`  ✓ [hash] ${name}（${cssBytes} B）`);
  });

  it('嵌套 ConfigProvider（自动回退 Hash 模式）不产生单位缺失或异常 line-height', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <ConfigProvider
            theme={{
              inherit: false,
              token: { colorPrimary: '#eb2f96', colorInfo: '#eb2f96', borderRadius: 2 },
            }}
          >
            <div>
              <Segmented options={['Overview', 'Kanban', 'Analytics']} value="Overview" />
              <Select
                open
                value="production"
                options={[{ value: 'production', label: 'Production' }]}
              />
              <Button size="small" type="primary">
                New Release
              </Button>
              <Tag color="processing">Live</Tag>
              <Progress percent={78} status="active" />
            </div>
          </ConfigProvider>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectCss();
    const { unitlessDims, absurdLineHeights, zIndexWithPx } = findDeclarationUnitBugs(css);
    expect(unitlessDims).toEqual([]);
    expect(absurdLineHeights).toEqual([]);
    expect(zIndexWithPx).toEqual([]);
    for (const { re } of ILLEGAL) {
      expect(css.match(re)).toBeNull();
    }
    wrapper.unmount();
  });

  it('NumCalculator 契约：支持嵌套 .equal() 字符串解析、默认补 px、{ unit: false } 输出无单位', () => {
    const calc = genCalc('number', new Set());
    // 嵌套 .equal()（Segmented / Select / Button 核心表达式）
    expect(calc(32).sub(calc(2).mul(2).equal()).equal()).toBe('28px');
    expect(calc(32).sub(calc(1).mul(2).equal()).equal()).toBe('30px');
    expect(
      calc(
        calc(24)
          .sub(
            calc(14)
              .mul(22 / 14)
              .equal(),
          )
          .equal(),
      )
        .div(2)
        .sub(1)
        .equal(),
    ).toBe('0px');
    // 字符串与负值
    expect(calc('12px').sub(1).equal()).toBe('11px');
    expect(calc('8').sub(1).equal()).toBe('7px');
    expect(calc(1).mul(-1).equal()).toBe('-1px');
    // 无单位模式（z-index / unitless line-height）
    expect(calc(1080).add(1).equal({ unit: false })).toBe('1081');
    expect(calc(1.5).sub(0.0002).equal({ unit: false })).toBe('1.4998');
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

  it('CSSCalculator vs NumCalculator 数学等价与运算符优先级契约', () => {
    const unitlessVars = new Set([
      '--ant-line-height',
      '--ant-line-height-lg',
      '--ant-z-index-popup',
      '--ant-z-index-popup-base',
    ]);
    const cssCalc = genCalc('css', unitlessVars);
    const numCalc = genCalc('number', unitlessVars);

    const tokenMap = {
      railSize: { varName: '--ant-slider-rail-size', value: 4 },
      handleSize: { varName: '--ant-slider-handle-size', value: 10 },
      handleSizeHover: { varName: '--ant-slider-handle-size-hover', value: 12 },
      handleLineWidth: { varName: '--ant-slider-handle-line-width', value: 2 },
      handleLineWidthHover: { varName: '--ant-slider-handle-line-width-hover', value: 4 },
      dotSize: { varName: '--ant-slider-dot-size', value: 8 },
      pinSize: { varName: '--ant-switch-handle-size', value: 18 },
      loadingIconSize: { varName: '--ant-switch-loading-icon-size', value: 9 },
      spinDotSize: { varName: '--ant-spin-dot-size', value: 20 },
      fontSize: { varName: '--ant-font-size', value: 14 },
      lineHeight: { varName: '--ant-line-height', value: 1.5, unitless: true },
      lineHeightLG: { varName: '--ant-line-height-lg', value: 1.5, unitless: true },
      lineWidth: { varName: '--ant-line-width', value: 1 },
      timelineDotSize: { varName: '--ant-timeline-dot-size', value: 10 },
      tailWidth: { varName: '--ant-timeline-tail-width', value: 2 },
      modalHeaderCloseSize: { varName: '--ant-modal-header-close-size', value: 56 },
      modalCloseBtnSize: { varName: '--ant-modal-close-btn-size', value: 22 },
      floatPadding: { varName: '--ant-float-padding', value: 4 },
      badgeOffset: { varName: '--ant-badge-offset', value: 6 },
      paddingHorizontal: { varName: '--ant-table-padding-horizontal', value: 16 },
      stepsIconSize: { varName: '--ant-steps-icon-size', value: 32 },
      stepsProgressSize: { varName: '--ant-steps-progress-size', value: 40 },
      zIndexPopup: { varName: '--ant-z-index-popup', value: 1050, unitless: true },
    };

    const varValues = Object.fromEntries(
      Object.values(tokenMap).map(({ varName, value, unitless }) => [
        varName,
        unitless ? String(value) : `${value}px`,
      ]),
    );

    const cssTokens = Object.fromEntries(
      Object.entries(tokenMap).map(([k, { varName }]) => [k, `var(${varName})`]),
    );
    const numTokens = Object.fromEntries(
      Object.entries(tokenMap).map(([k, { value }]) => [k, value]),
    );

    // 严格按 CSS Values 规则解析并求值 calc()（校验优先级、括号与单位合法性）
    const evalCssValue = raw => {
      const substituted = raw.replace(/var\((--[a-z0-9-]+)\)/gi, (_, name) => {
        if (!(name in varValues)) throw new Error(`Unknown CSS var: ${name}`);
        return varValues[name];
      });
      if (!substituted.startsWith('calc(')) {
        return substituted;
      }
      const evalCalcInner = expr => {
        const tokens = [];
        let i = 0;
        while (i < expr.length) {
          const ch = expr[i];
          if (/\s/.test(ch)) {
            i += 1;
            continue;
          }
          if (expr.slice(i, i + 5) === 'calc(') {
            tokens.push({ type: 'LPAREN' });
            i += 5;
            continue;
          }
          if (ch === '(') {
            tokens.push({ type: 'LPAREN' });
            i += 1;
            continue;
          }
          if (ch === ')') {
            tokens.push({ type: 'RPAREN' });
            i += 1;
            continue;
          }
          if (ch === '*' || ch === '/') {
            tokens.push({ type: 'OP', val: ch });
            i += 1;
            continue;
          }
          if (ch === '+' || ch === '-') {
            const prev = tokens[tokens.length - 1];
            const isUnary = !prev || prev.type === 'LPAREN' || prev.type === 'OP';
            if (!isUnary) {
              if (!/\s/.test(expr[i - 1] || '') || !/\s/.test(expr[i + 1] || '')) {
                throw new Error(`Missing whitespace around '${ch}' in calc(${expr})`);
              }
              tokens.push({ type: 'OP', val: ch });
              i += 1;
              continue;
            }
          }
          const m = expr.slice(i).match(/^([+-]?(?:\d+\.?\d*|\.\d+))(px)?/i);
          if (m && m[0].length > 0) {
            tokens.push({ type: 'NUM', val: parseFloat(m[1]), unit: (m[2] || '').toLowerCase() });
            i += m[0].length;
            continue;
          }
          throw new Error(`Unexpected token near "${expr.slice(i)}" in calc(${expr})`);
        }
        let pos = 0;
        const peek = () => tokens[pos];
        const next = () => tokens[pos++];
        const parsePrimary = () => {
          const t = peek();
          if (!t) throw new Error(`Unexpected EOF in calc(${expr})`);
          if (t.type === 'LPAREN') {
            next();
            const val = parseAddSub();
            if (!peek() || peek().type !== 'RPAREN')
              throw new Error(`Missing ')' in calc(${expr})`);
            next();
            return val;
          }
          if (t.type === 'NUM') {
            next();
            return { val: t.val, unit: t.unit };
          }
          throw new Error(`Unexpected token in calc(${expr})`);
        };
        const parseMulDiv = () => {
          let left = parsePrimary();
          while (peek() && peek().type === 'OP' && (peek().val === '*' || peek().val === '/')) {
            const op = next().val;
            const right = parsePrimary();
            if (op === '*') {
              if (left.unit && right.unit) {
                throw new Error(`Invalid length * length in calc(${expr})`);
              }
              left = { val: left.val * right.val, unit: left.unit || right.unit };
            } else {
              if (right.unit) {
                throw new Error(`Invalid division by length in calc(${expr})`);
              }
              left = { val: left.val / right.val, unit: left.unit };
            }
          }
          return left;
        };
        const parseAddSub = () => {
          let left = parseMulDiv();
          while (peek() && peek().type === 'OP' && (peek().val === '+' || peek().val === '-')) {
            const op = next().val;
            const right = parseMulDiv();
            if (left.unit !== right.unit) {
              throw new Error(
                `Incompatible units (${left.unit} vs ${right.unit}) in calc(${expr})`,
              );
            }
            left = {
              val: op === '+' ? left.val + right.val : left.val - right.val,
              unit: left.unit,
            };
          }
          return left;
        };
        const out = parseAddSub();
        if (pos !== tokens.length) throw new Error(`Trailing tokens in calc(${expr})`);
        const rounded = Math.round(out.val * 10000) / 10000;
        return `${rounded}${out.unit}`;
      };
      return evalCalcInner(substituted.slice(5, -1));
    };

    const FORMULAS = [
      // 基础优先级：(a + b) * c, (a - b) / c, 连续多级混合运算
      ['(a + b) * 2', (c, t) => c(t.railSize).add(t.dotSize).mul(2).equal()],
      ['(a - b) * -1', (c, t) => c(t.handleSize).sub(t.railSize).mul(-1).equal()],
      ['(a + b) / 2', (c, t) => c(t.timelineDotSize).add(t.tailWidth).div(2).equal()],
      [
        '((a + b) * 3 + c) / 2',
        (c, t) => c(t.railSize).add(t.tailWidth).mul(3).add(t.dotSize).div(2).equal(),
      ],
      // 右操作数为 Calculator 时的优先级
      ['a - (b + c)', (c, t) => c(t.stepsIconSize).sub(c(t.handleSize).add(t.dotSize)).equal()],
      ['a - (b - c)', (c, t) => c(t.stepsIconSize).sub(c(t.handleSize).sub(t.railSize)).equal()],
      ['a - (b * 2)', (c, t) => c(t.stepsIconSize).sub(c(t.lineWidth).mul(2)).equal()],
      ['a + (b - c)', (c, t) => c(t.stepsIconSize).add(c(t.handleSize).sub(t.railSize)).equal()],
      ['a / (2 * 2)', (c, t) => c(t.stepsIconSize).div(c(2).mul(2)).equal()],
      ['a / (4 / 2)', (c, t) => c(t.stepsIconSize).div(c(4).div(2)).equal()],
      ['a * (1 + 2)', (c, t) => c(t.railSize).mul(c(1).add(2)).equal()],
      // 嵌套 calc(calc(...)) 构造
      ['calc(calc(a))', (c, t) => c(c(t.handleSize)).equal()],
      ['calc(calc(a).add(b))', (c, t) => c(c(t.handleSize).add(t.railSize)).equal()],
      ['calc(calc(a).add(b)).mul(2)', (c, t) => c(c(t.handleSize).add(t.railSize)).mul(2).equal()],
      // 混合无单位变量 + 长度变量 + 字面量（+2 必须带 px）
      ['fontSize * lineHeight + 2', (c, t) => c(t.fontSize).mul(t.lineHeight).add(2).equal()],
      // 纯无单位变量运算
      ['zIndexPopup + 1 (unit:false)', (c, t) => c(t.zIndexPopup).add(1).equal({ unit: false })],
      [
        'lineHeightLG - 0.0002 (unit:false)',
        (c, t) => c(t.lineHeightLG).sub(0.0002).equal({ unit: false }),
      ],
      // 各组件真实样式公式
      ['Slider handle inset', (c, t) => c(t.railSize).mul(3).sub(t.handleSize).div(2).equal()],
      ['Slider dot inset', (c, t) => c(t.railSize).sub(t.dotSize).div(2).equal()],
      [
        'Slider hover handle ::after',
        (c, t) => c(t.handleSize).sub(t.handleSizeHover).div(2).equal(),
      ],
      [
        'Slider hover handle ::before',
        (c, t) =>
          c(t.handleSizeHover).sub(t.handleSize).div(2).add(t.handleLineWidthHover).mul(-1).equal(),
      ],
      ['Switch loading icon top', (c, t) => c(t.pinSize).sub(t.loadingIconSize).div(2).equal()],
      ['Spin text paddingTop', (c, t) => c(t.spinDotSize).sub(t.fontSize).div(2).add(2).equal()],
      ['Spin dot marginTop', (c, t) => c(t.spinDotSize).div(2).add(10).mul(-1).equal()],
      ['Timeline tail offset', (c, t) => c(t.timelineDotSize).sub(t.tailWidth).div(2).equal()],
      [
        'Timeline content insetBlockStart',
        (c, t) =>
          c(c(t.fontSize).mul(t.lineHeight).equal())
            .sub(t.fontSize)
            .add(t.lineWidth)
            .mul(-1)
            .equal(),
      ],
      [
        'Modal close offset',
        (c, t) => c(t.modalHeaderCloseSize).sub(t.modalCloseBtnSize).div(2).equal(),
      ],
      ['FloatButton badge offset', (c, t) => c(t.floatPadding).add(t.badgeOffset).mul(-1).equal()],
      ['Table bordered margin', (c, t) => c(t.paddingHorizontal).add(t.lineWidth).mul(-1).equal()],
      [
        'Steps progress offset',
        (c, t) =>
          c(t.stepsIconSize)
            .sub(t.stepsProgressSize)
            .sub(c(t.lineWidth).mul(2).equal())
            .div(2)
            .equal(),
      ],
    ];

    for (const [label, fn] of FORMULAS) {
      const cssExpr = fn(cssCalc, cssTokens);
      const numExpected = fn(numCalc, numTokens);
      const cssEvaluated = evalCssValue(cssExpr);
      expect({ label, value: cssEvaluated, cssExpr }).toEqual({
        label,
        value: numExpected,
        cssExpr,
      });
    }

    // 纯 unitlessCssVar 自动推导无单位（不传 options.unit 时）
    expect(cssCalc(cssTokens.zIndexPopup).add(1).equal()).toBe(
      'calc(var(--ant-z-index-popup) + 1)',
    );
    expect(evalCssValue(cssCalc(cssTokens.zIndexPopup).add(1).equal())).toBe('1051');
  });

  it('Slider / Switch / Spin / Timeline / Modal / Table / Form 实测 CSS calc() 与色值回归守卫', async () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <div>
            <Slider defaultValue={30} />
            <Slider disabled defaultValue={30} />
            <Switch loading />
            <Spin tip="Loading" />
            <Timeline items={[{ content: 'x' }]} />
            <Modal open={false} title="m">
              body
            </Modal>
            <Table
              bordered
              columns={[{ title: 'A', dataIndex: 'a' }]}
              dataSource={[{ key: 1, a: 1 }]}
            />
            <Form>
              <Form.Item label="l">
                <span>field</span>
              </Form.Item>
            </Form>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    const css = collectCss();
    const vars = {};
    const rules = [];
    const reRule = /([^{}@]+)\{([^{}]*)\}/g;
    let rm = reRule.exec(css);
    while (rm) {
      const sel = rm[1].trim();
      const decls = {};
      rm[2].split(';').forEach(d => {
        const idx = d.indexOf(':');
        if (idx > 0) {
          const k = d.slice(0, idx).trim().toLowerCase();
          const v = d.slice(idx + 1).trim();
          decls[k] = v;
          if (k.startsWith('--ant-')) vars[k] = v;
        }
      });
      rules.push({ sel, decls });
      rm = reRule.exec(css);
    }

    const resolveProp = (selectorSubstr, prop) => {
      const matched = rules.filter(r =>
        r.sel
          .split(',')
          .map(s => s.trim())
          .some(s => s.endsWith(selectorSubstr)),
      );
      expect(matched.length).toBeGreaterThan(0);
      const merged = Object.assign({}, ...matched.map(r => r.decls));
      let val = merged[prop];
      expect(val).toBeDefined();
      for (let d = 0; d < 8 && val.includes('var('); d += 1) {
        val = val.replace(/var\((--[a-z0-9-]+)\)/gi, (m, n) => (n in vars ? vars[n] : m));
      }
      if (val.startsWith('calc(')) {
        const js = val.replace(/calc\(/g, '(').replace(/px/g, '');
        // eslint-disable-next-line no-new-func
        const num = Function(`"use strict"; return (${js});`)();
        return `${Math.round(num * 1000) / 1000}px`;
      }
      return val;
    };

    // Slider: handle inset-block-start = (4*3 - 10)/2 = 1px（旧 bug 为 7px）
    expect(resolveProp('.ant-slider-horizontal .ant-slider-handle', 'inset-block-start')).toBe(
      '1px',
    );
    expect(resolveProp('.ant-slider-vertical .ant-slider-handle', 'inset-inline-start')).toBe(
      '1px',
    );
    // Slider: dot = (4 - 8)/2 = -2px（旧 bug 为 0px）
    expect(resolveProp('.ant-slider-horizontal .ant-slider-dot', 'inset-block-start')).toBe('-2px');
    expect(resolveProp('.ant-slider-vertical .ant-slider-dot', 'inset-inline-start')).toBe('-2px');
    // Slider: hover handle ::after = (10 - 12)/2 = -1px（旧 bug 为 4px）
    expect(resolveProp('.ant-slider-handle:hover::after', 'inset-block-start')).toBe('-1px');
    // Slider: hover handle ::before = -((12 - 10)/2 + 4) = -5px（旧 bug 为 -3px）
    expect(resolveProp('.ant-slider-handle:hover::before', 'inset-block-start')).toBe('-5px');
    // Slider: disabled handle ::after 不得退化为纯黑 #000000（旧 bug onBackground(var(--ant-color-bg-container))）
    const disabledHandleShadow = resolveProp(
      '.ant-slider.ant-slider-disabled .ant-slider-handle::after',
      'box-shadow',
    );
    expect(disabledHandleShadow.toLowerCase()).not.toContain('#000000');
    expect(disabledHandleShadow.toLowerCase()).toContain('#bfbfbf');

    // Timeline: tail = (10 - 2)/2 = 4px（旧 bug 为 9px）
    expect(resolveProp('.ant-timeline .ant-timeline-item-tail', 'inset-inline-start')).toBe('4px');
    expect(
      resolveProp('.ant-timeline-horizontal .ant-timeline-item-tail', 'inset-block-start'),
    ).toBe('4px');

    // Switch: loading icon top = (18 - 14)/2 = 2px（旧 bug 为 11px）
    expect(resolveProp('.ant-switch-loading-icon.anticon', 'top')).toBe('2px');

    // Spin: show-text dot margin-top = -(20/2 + 10) = -20px（旧 bug 为 0px）；text padding-top = (20-14)/2+2 = 5px（旧 bug 为 15px）
    expect(
      resolveProp(
        '.ant-spin-nested-loading >div>.ant-spin.ant-spin-show-text .ant-spin-dot',
        'margin-top',
      ),
    ).toBe('-20px');
    expect(
      resolveProp('.ant-spin-nested-loading >div>.ant-spin .ant-spin-text', 'padding-top'),
    ).toBe('5px');

    // Modal: close button offset = (modalHeaderCloseSize - modalCloseBtnSize) / 2 = (56 - 22)/2 = 17px（旧 bug 为 45px）
    expect(resolveProp('.ant-modal .ant-modal-close', 'top')).toBe('17px');
    expect(resolveProp('.ant-modal .ant-modal-close', 'inset-inline-end')).toBe('17px');

    // Form: label-wrap line-height 不得含非法 calc(var(--ant-line-height) - 0.25em)
    expect(css).not.toContain('- 0.25em');

    // Table: 表头图标色不得因 opacityLoading=var() 乘法产生 NaN 而退化为 alpha=1
    const tableFilterColor = resolveProp('.ant-table-filter-trigger', 'color');
    expect(tableFilterColor).not.toBe('rgb(0, 0, 0)');
    expect(tableFilterColor).toMatch(/rgba\(0,\s*0,\s*0,\s*0\.29/);

    wrapper.unmount();
  });
});
