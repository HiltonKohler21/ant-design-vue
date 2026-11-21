/**
 * zeroRuntime 静态样式提取
 *
 * 用法：npx jest --config .jest.js tests/bench/zero-runtime-extract.test.js
 * 产物：dist/static-style/antdv.css
 *
 * 说明：组件源码为 Vue JSX，需经本项目 babel（@vue/babel-plugin-jsx）编译，
 * 因此提取流程放在 jest 环境下执行；`scripts/static-style-extract.mjs` 是对外入口。
 */
import fs from 'fs';
import path from 'path';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {
  StyleProvider,
  createCache,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,
} from '../../components/_util/cssinjs';
import ConfigProvider from '../../components/config-provider';
import Button from '../../components/button';
import Input from '../../components/input';
import Select from '../../components/select';
import Table from '../../components/table';
import Modal from '../../components/modal';
import Tag from '../../components/tag';
import Card from '../../components/card';
import Tabs from '../../components/tabs';
import Space from '../../components/space';

const App = {
  setup() {
    return () => (
      <Space direction="vertical">
        <Button type="primary">btn</Button>
        <Button>default</Button>
        <Input placeholder="i" />
        <Select options={[{ value: 'a', label: 'A' }]} />
        <Tag color="blue">tag</Tag>
        <Card title="c">body</Card>
        <Tabs items={[{ key: '1', label: 'A', children: 'a' }]} />
        <Table columns={[{ title: 'A', dataIndex: 'a' }]} dataSource={[{ key: 1, a: 1 }]} />
        <Modal open={false} title="m">
          content
        </Modal>
      </Space>
    );
  },
};

describe('zeroRuntime 静态样式提取', () => {
  jest.setTimeout(240000);

  it('不注入运行时 <style>，且可提取出包含变量声明的 CSS 文件', async () => {
    clearCSSVarRegistry();
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const cache = createCache();

    mount(StyleProvider, {
      props: { cache },
      slots: {
        default: () => (
          <ConfigProvider theme={{ cssVar: true, zeroRuntime: true }}>
            <App />
          </ConfigProvider>
        ),
      },
      attachTo: 'body',
    });

    await nextTick();
    await new Promise(r => setTimeout(r, 100));

    // 1) 运行时零注入
    const injected = document.querySelectorAll('style[data-css-hash], style[data-css-var-id]');
    if (injected.length) {
      // eslint-disable-next-line no-console
      console.log('[zero-runtime] 注入项:', Array.from(injected).map(el => el.outerHTML.slice(0, 160)).join('\n---\n'));
    }
    expect(injected.length).toBe(0);

    // 2) 从缓存 + 变量登记表提取
    const componentCss = extractStyle(cache, true);
    const varCss = extractCSSVarStyle();
    const css = `${varCss}\n${componentCss}`;

    expect(css.length).toBeGreaterThan(5000);
    expect(css).toContain('--ant-color-primary');
    expect(css).toContain(':root');

    // 3) 落盘
    const outDir = path.resolve(__dirname, '../../dist/static-style');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'antdv.css');
    fs.writeFileSync(outFile, css, 'utf8');

    // eslint-disable-next-line no-console
    console.log(`[zero-runtime] 提取 CSS ${(css.length / 1024).toFixed(1)} KB → ${outFile}`);

    expect(fs.existsSync(outFile)).toBe(true);
    expect(fs.statSync(outFile).size).toBe(css.length);
  });
});
