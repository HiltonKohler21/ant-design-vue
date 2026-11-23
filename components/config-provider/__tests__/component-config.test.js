import { computed, defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import ConfigProvider, { useComponentConfig, useInjectWarningContext } from '..';
import { useConfigContextInject } from '../context';
import useConfigInject from '../hooks/useConfigInject';
import useVariant from '../../form/hooks/useVariant';
import Affix from '../../affix';
import Anchor from '../../anchor';
import App from '../../app';
import AutoComplete from '../../auto-complete';
import Badge from '../../badge';
import Breadcrumb from '../../breadcrumb';
import Calendar from '../../calendar';
import Card from '../../card';
import Carousel from '../../carousel';
import Checkbox from '../../checkbox';
import Collapse from '../../collapse';
import DatePicker from '../../date-picker';
import Empty from '../../empty';
import Flex from '../../flex';
import Layout from '../../layout';
import Masonry from '../../masonry';
import Menu from '../../menu';
import message from '../../message';
import Pagination from '../../pagination';
import Popconfirm from '../../popconfirm';
import Popover from '../../popover';
import Radio from '../../radio';
import Rate from '../../rate';
import Result from '../../result';
import Segmented from '../../segmented';
import Skeleton from '../../skeleton';
import Spin from '../../spin';
import Statistic from '../../statistic';
import Steps from '../../steps';
import Switch from '../../switch';
import TimePicker from '../../time-picker';
import Timeline from '../../timeline';
import Tooltip from '../../tooltip';
import Tour from '../../tour';
import Tree from '../../tree';
import Typography from '../../typography';

describe('ConfigProvider 组件级默认配置与全局配置（antd@6.7.2 全量对齐）', () => {
  it('声明全部 72 个组件级配置 props（含新增 13 个）', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        button: { variant: 'solid' },
        card: {},
        tabs: {},
        modal: { className: 'x' },
      },
    });
    const all72Keys = [
      'affix',
      'alert',
      'anchor',
      'app',
      'autoComplete',
      'avatar',
      'badge',
      'borderBeam',
      'breadcrumb',
      'button',
      'calendar',
      'card',
      'cardMeta',
      'carousel',
      'cascader',
      'checkbox',
      'collapse',
      'colorPicker',
      'datePicker',
      'descriptions',
      'divider',
      'drawer',
      'dropdown',
      'empty',
      'flex',
      'floatButton',
      'floatButtonGroup',
      'form',
      'image',
      'input',
      'inputNumber',
      'inputPassword',
      'inputSearch',
      'layout',
      'list',
      'listy',
      'masonry',
      'mentions',
      'menu',
      'message',
      'modal',
      'notification',
      'otp',
      'pagination',
      'popconfirm',
      'popover',
      'progress',
      'qrcode',
      'radio',
      'rangePicker',
      'rate',
      'result',
      'ribbon',
      'segmented',
      'select',
      'skeleton',
      'slider',
      'space',
      'spin',
      'splitter',
      'statistic',
      'steps',
      'switch',
      'table',
      'tabs',
      'tag',
      'textArea',
      'timePicker',
      'timeline',
      'tooltip',
      'tour',
      'transfer',
      'tree',
      'treeSelect',
      'typography',
      'upload',
      'watermark',
      'warning',
    ];
    for (const k of all72Keys) {
      expect(k in wrapper.vm.$props).toBe(true);
    }
  });

  it('useComponentConfig 响应式返回组件配置并透传 context', () => {
    const Child = defineComponent({
      setup() {
        const configProvider = useConfigContextInject();
        const { className, style, classNames, styles, componentConfig } =
          useComponentConfig('card');
        return () => (
          <div class="child">
            {JSON.stringify({
              btn: configProvider.button?.value,
              className: className.value,
              style: style.value,
              classNames: classNames.value,
              styles: styles.value,
              variant: componentConfig.value.variant,
            })}
          </div>
        );
      },
    });
    const wrapper = mount(ConfigProvider, {
      props: {
        button: { variant: 'dashed' },
        card: {
          className: 'cp-card',
          style: { padding: '8px' },
          classNames: { body: 'cp-body' },
          styles: { body: { color: 'red' } },
          variant: 'borderless',
        },
      },
      slots: { default: () => <Child /> },
    });
    const parsed = JSON.parse(wrapper.find('.child').text());
    expect(parsed.btn).toEqual({ variant: 'dashed' });
    expect(parsed.className).toBe('cp-card');
    expect(parsed.style).toEqual({ padding: '8px' });
    expect(parsed.classNames).toEqual({ body: 'cp-body' });
    expect(parsed.styles).toEqual({ body: { color: 'red' } });
    expect(parsed.variant).toBe('borderless');
  });

  it('全局 v5.25 props: popupMatchSelectWidth / popupOverflow / warning.strict 生效且支持嵌套继承', () => {
    const Probe = defineComponent({
      setup() {
        const { dropdownMatchSelectWidth, popupMatchSelectWidth, popupOverflow } = useConfigInject(
          'select',
          {},
        );
        const warningCtx = useInjectWarningContext();
        return () => (
          <div class="probe">
            {JSON.stringify({
              dropdownMatchSelectWidth: dropdownMatchSelectWidth.value,
              popupMatchSelectWidth: popupMatchSelectWidth.value,
              popupOverflow: popupOverflow.value,
              warningStrict: warningCtx.value?.strict,
            })}
          </div>
        );
      },
    });
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            popupMatchSelectWidth={false}
            popupOverflow="scroll"
            warning={{ strict: false }}
          >
            <ConfigProvider>
              <Probe />
            </ConfigProvider>
          </ConfigProvider>
        );
      },
    });
    const data = JSON.parse(wrapper.find('.probe').text());
    expect(data.dropdownMatchSelectWidth).toBe(false);
    expect(data.popupMatchSelectWidth).toBe(false);
    expect(data.popupOverflow).toBe('scroll');
    expect(data.warningStrict).toBe(false);
  });

  it('holderRender 与 message.className/style 在 useMessage 中生效', async () => {
    let messageApi;
    const Demo = defineComponent({
      setup() {
        const [api, contextHolder] = message.useMessage();
        messageApi = api;
        return () => <div class="msg-demo">{contextHolder()}</div>;
      },
    });
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            holderRender={children => <div class="custom-holder-wrapper">{children}</div>}
            message={{ className: 'cp-message', style: { marginTop: '12px' } }}
          >
            <Demo />
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.find('.custom-holder-wrapper').exists()).toBe(true);
    expect(messageApi).toBeTruthy();
  });

  it('useVariant 支持 textArea 回退 input、rangePicker 回退 datePicker、timePicker/autoComplete/divider/card', () => {
    const VariantProbe = defineComponent({
      setup() {
        const [textAreaV] = useVariant(
          'textArea',
          computed(() => undefined),
        );
        const [rangeV] = useVariant(
          'rangePicker',
          computed(() => undefined),
        );
        const [timeV] = useVariant(
          'timePicker',
          computed(() => undefined),
        );
        const [autoV] = useVariant(
          'autoComplete',
          computed(() => undefined),
        );
        const [dividerV] = useVariant(
          'divider',
          computed(() => undefined),
        );
        const [cardV] = useVariant(
          'card',
          computed(() => undefined),
        );
        return () => (
          <div class="variant-probe">
            {JSON.stringify({
              textAreaV: textAreaV.value,
              rangeV: rangeV.value,
              timeV: timeV.value,
              autoV: autoV.value,
              dividerV: dividerV.value,
              cardV: cardV.value,
            })}
          </div>
        );
      },
    });
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            variant="underlined"
            input={{ variant: 'filled' }}
            datePicker={{ variant: 'borderless' }}
            timePicker={{ variant: 'filled' }}
            divider={{ variant: 'dotted' }}
            card={{ variant: 'borderless' }}
          >
            <VariantProbe />
          </ConfigProvider>
        );
      },
    });
    const data = JSON.parse(wrapper.find('.variant-probe').text());
    expect(data).toEqual({
      textAreaV: 'filled',
      rangeV: 'borderless',
      timeV: 'filled',
      autoV: 'underlined',
      dividerV: 'dotted',
      cardV: 'borderless',
    });
  });

  it('Card / Card.Meta / Empty / Flex / Pagination / Masonry 渲染 DOM 正确消费 ConfigProvider 配置', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            direction="rtl"
            card={{
              className: 'cp-card',
              style: { borderRadius: '10px' },
              classNames: { body: 'cp-card-body' },
              styles: { body: { padding: '4px' } },
              variant: 'borderless',
            }}
            cardMeta={{ className: 'cp-card-meta', style: { opacity: '0.9' } }}
            empty={{
              image: 'https://example.com/empty.png',
              className: 'cp-empty',
              style: { margin: '8px' },
              classNames: { description: 'cp-empty-desc' },
            }}
            flex={{ vertical: true, className: 'cp-flex', style: { gap: '6px' } }}
            pagination={{
              showSizeChanger: true,
              className: 'cp-pagination',
              style: { marginTop: '4px' },
            }}
            masonry={{
              className: 'cp-masonry',
              style: { padding: '2px' },
              classNames: { item: 'cp-masonry-item' },
            }}
          >
            <div>
              <Card title="Title">
                <Card.Meta title="Meta" />
              </Card>
              <Empty />
              <Flex>
                <span>A</span>
              </Flex>
              <Pagination total={100} />
              <Masonry items={[{ key: 1, children: 'Item 1' }]} />
            </div>
          </ConfigProvider>
        );
      },
    });

    // Card + Card.Meta
    const cardEl = wrapper.find('.ant-card');
    expect(cardEl.classes()).toContain('cp-card');
    expect(cardEl.classes()).not.toContain('ant-card-bordered');
    expect(cardEl.attributes('style')).toContain('border-radius: 10px');
    expect(wrapper.find('.ant-card-body').classes()).toContain('cp-card-body');
    expect(wrapper.find('.ant-card-body').attributes('style')).toContain('padding: 4px');
    expect(wrapper.find('.ant-card-meta').classes()).toContain('cp-card-meta');

    // Empty
    const emptyEl = wrapper.find('.ant-empty');
    expect(emptyEl.classes()).toContain('cp-empty');
    expect(emptyEl.attributes('style')).toContain('margin: 8px');
    expect(emptyEl.find('img').attributes('src')).toBe('https://example.com/empty.png');
    expect(emptyEl.find('.ant-empty-description').classes()).toContain('cp-empty-desc');

    // Flex
    const flexEl = wrapper.find('.ant-flex');
    expect(flexEl.classes()).toContain('cp-flex');
    expect(flexEl.classes()).toContain('ant-flex-vertical');
    expect(flexEl.attributes('style')).toContain('gap: 6px');

    // Pagination
    const pagEl = wrapper.find('.ant-pagination');
    expect(pagEl.classes()).toContain('cp-pagination');
    expect(pagEl.find('.ant-pagination-options-size-changer').exists()).toBe(true);

    // Masonry (className + classNames.item + RTL)
    const masonryEl = wrapper.find('.ant-masonry');
    expect(masonryEl.classes()).toContain('cp-masonry');
    expect(masonryEl.classes()).toContain('ant-masonry-rtl');
    expect(masonryEl.find('.ant-masonry-item').classes()).toContain('cp-masonry-item');
  });

  it('DatePicker / RangePicker / TimePicker / AutoComplete 正确消费 variant / className / separator / popupMatchSelectWidth', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            popupMatchSelectWidth={false}
            datePicker={{ className: 'cp-dp', variant: 'filled', style: { width: '200px' } }}
            rangePicker={{ className: 'cp-rp', variant: 'underlined', separator: '->' }}
            timePicker={{ className: 'cp-tp', variant: 'borderless' }}
            autoComplete={{ className: 'cp-ac', variant: 'filled' }}
          >
            <div>
              <DatePicker />
              <DatePicker.RangePicker />
              <TimePicker />
              <AutoComplete options={[{ value: 'a' }]} />
            </div>
          </ConfigProvider>
        );
      },
    });

    const pickers = wrapper.findAll('.ant-picker');
    expect(pickers[0].classes()).toContain('cp-dp');
    expect(pickers[0].classes()).toContain('ant-picker-filled');
    expect(pickers[0].attributes('style')).toContain('width: 200px');

    expect(pickers[1].classes()).toContain('cp-rp');
    expect(pickers[1].classes()).toContain('ant-picker-underlined');
    expect(pickers[1].text()).toContain('->');

    expect(pickers[2].classes()).toContain('cp-tp');
    expect(pickers[2].classes()).toContain('ant-picker-borderless');

    const ac = wrapper.find('.ant-select-auto-complete');
    expect(ac.classes()).toContain('cp-ac');
    expect(ac.classes()).toContain('ant-select-filled');
    const rcSelect = wrapper.findComponent({ name: 'VcSelect' });
    expect(rcSelect.props('dropdownMatchSelectWidth')).toBe(false);
  });

  it('其余所有已接线组件正确消费 ConfigProvider className / style 与特性配置', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            affix={{ className: 'cp-affix', style: { zIndex: 5 } }}
            anchor={{ className: 'cp-anchor', style: { padding: '2px' } }}
            app={{ className: 'cp-app', style: { minHeight: '10px' } }}
            badge={{ className: 'cp-badge', classNames: { indicator: 'cp-badge-ind' } }}
            ribbon={{ className: 'cp-ribbon', style: { fontWeight: 'bold' } }}
            breadcrumb={{ className: 'cp-breadcrumb', separator: '>' }}
            calendar={{ className: 'cp-calendar', style: { borderWidth: '1px' } }}
            carousel={{ className: 'cp-carousel', style: { overflow: 'hidden' } }}
            checkbox={{ className: 'cp-checkbox', style: { color: 'blue' } }}
            collapse={{ className: 'cp-collapse', style: { borderRadius: '4px' } }}
            layout={{ className: 'cp-layout', style: { background: 'white' } }}
            menu={{ className: 'cp-menu', style: { width: '180px' } }}
            radio={{ className: 'cp-radio', style: { marginRight: '4px' } }}
            rate={{ className: 'cp-rate', style: { fontSize: '18px' } }}
            result={{ className: 'cp-result', style: { padding: '16px' } }}
            segmented={{ className: 'cp-segmented', style: { padding: '2px' } }}
            skeleton={{ className: 'cp-skeleton', style: { margin: '4px' } }}
            spin={{
              className: 'cp-spin',
              style: { color: 'green' },
              indicator: h('span', { class: 'cp-spin-ind' }, 'L'),
            }}
            statistic={{ className: 'cp-statistic', style: { margin: '2px' } }}
            steps={{ className: 'cp-steps', style: { margin: '6px' } }}
            switch={{ className: 'cp-switch', style: { marginLeft: '2px' } }}
            timeline={{ className: 'cp-timeline', style: { paddingLeft: '4px' } }}
            tree={{ className: 'cp-tree', style: { fontSize: '14px' } }}
            typography={{ className: 'cp-typography', style: { lineHeight: '1.5' } }}
          >
            <div>
              <Affix>
                <span>affix</span>
              </Affix>
              <Anchor affix={false} items={[{ key: '1', href: '#a', title: 'A' }]} />
              <App>
                <span>app</span>
              </App>
              <Badge count={5}>
                <span>b</span>
              </Badge>
              <Badge.Ribbon text="R">
                <span>r</span>
              </Badge.Ribbon>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Sub</Breadcrumb.Item>
              </Breadcrumb>
              <Calendar fullscreen={false} />
              <Carousel>
                <div>1</div>
              </Carousel>
              <Checkbox>Check</Checkbox>
              <Collapse>
                <Collapse.Panel key="1" header="P1">
                  Body
                </Collapse.Panel>
              </Collapse>
              <Layout>Layout</Layout>
              <Menu items={[{ key: '1', label: 'M1' }]} />
              <Radio>R1</Radio>
              <Rate />
              <Result title="OK" />
              <Segmented value="A" options={['A', 'B']} />
              <Skeleton />
              <Spin />
              <Statistic title="Users" value={10} />
              <Steps items={[{ title: 'S1' }]} />
              <Switch />
              <Timeline>
                <Timeline.Item>T1</Timeline.Item>
              </Timeline>
              <Tree treeData={[{ key: '1', title: 'N1' }]} />
              <Typography>Typo</Typography>
            </div>
          </ConfigProvider>
        );
      },
    });

    expect(wrapper.find('.cp-affix').exists()).toBe(true);
    expect(wrapper.find('.ant-anchor-wrapper.cp-anchor').exists()).toBe(true);
    expect(wrapper.find('.ant-app.cp-app').exists()).toBe(true);
    expect(wrapper.find('.ant-badge.cp-badge').exists()).toBe(true);
    expect(wrapper.find('.cp-badge-ind').exists()).toBe(true);
    expect(wrapper.find('.ant-ribbon.cp-ribbon').exists()).toBe(true);
    expect(wrapper.find('.ant-breadcrumb.cp-breadcrumb').exists()).toBe(true);
    expect(wrapper.find('.ant-breadcrumb-separator').text()).toBe('>');
    expect(wrapper.find('.ant-picker-calendar.cp-calendar').exists()).toBe(true);
    expect(wrapper.find('.ant-carousel.cp-carousel').exists()).toBe(true);
    expect(wrapper.find('.ant-checkbox-wrapper.cp-checkbox').exists()).toBe(true);
    expect(wrapper.find('.ant-collapse.cp-collapse').exists()).toBe(true);
    expect(wrapper.find('.ant-layout.cp-layout').exists()).toBe(true);
    expect(wrapper.find('.ant-menu.cp-menu').exists()).toBe(true);
    expect(wrapper.find('.ant-radio-wrapper.cp-radio').exists()).toBe(true);
    expect(wrapper.find('.ant-rate.cp-rate').exists()).toBe(true);
    expect(wrapper.find('.ant-result.cp-result').exists()).toBe(true);
    expect(wrapper.find('.ant-segmented.cp-segmented').exists()).toBe(true);
    expect(wrapper.find('.ant-skeleton.cp-skeleton').exists()).toBe(true);
    expect(wrapper.find('.ant-spin.cp-spin').exists()).toBe(true);
    expect(wrapper.find('.cp-spin-ind').exists()).toBe(true);
    expect(wrapper.find('.ant-statistic.cp-statistic').exists()).toBe(true);
    expect(wrapper.find('.ant-steps.cp-steps').exists()).toBe(true);
    expect(wrapper.find('.ant-switch.cp-switch').exists()).toBe(true);
    expect(wrapper.find('.ant-timeline.cp-timeline').exists()).toBe(true);
    expect(wrapper.find('.ant-tree.cp-tree').exists()).toBe(true);
    expect(wrapper.find('.ant-typography.cp-typography').exists()).toBe(true);
  });

  it('Tooltip / Popover / Popconfirm 消费各自 ConfigProvider 配置且互不串染，popupOverflow 传递到 placements', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            popupOverflow="scroll"
            tooltip={{ className: 'cp-tooltip', arrow: false }}
            popover={{ className: 'cp-popover' }}
            popconfirm={{ className: 'cp-popconfirm' }}
            tour={{ className: 'cp-tour' }}
          >
            <div>
              <Tooltip title="tip" open>
                <span class="t-trigger">T</span>
              </Tooltip>
              <Popover content="pop" open>
                <span class="p-trigger">P</span>
              </Popover>
              <Popconfirm title="confirm" open>
                <span class="pc-trigger">PC</span>
              </Popconfirm>
              <Tour open={false} steps={[{ title: 'Step 1' }]} />
            </div>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const vcTooltips = wrapper.findAllComponents({ name: 'Tooltip' });
    // Tooltip gets cp-tooltip, arrow=false, and popupOverflow='scroll' (alwaysByViewport=false)
    const tipProps = vcTooltips[0].props();
    expect(tipProps.overlayClassName).toContain('cp-tooltip');
    expect(tipProps.arrow).toBe(false);
    expect(tipProps.builtinPlacements.top.overflow.alwaysByViewport).toBe(false);

    // Popover gets cp-popover and does NOT inherit cp-tooltip
    const popProps = vcTooltips[1].props();
    expect(popProps.overlayClassName).toContain('cp-popover');
    expect(popProps.overlayClassName).not.toContain('cp-tooltip');

    // Popconfirm gets cp-popconfirm and does NOT inherit cp-popover or cp-tooltip
    const pcProps = vcTooltips[2].props();
    expect(pcProps.overlayClassName).toContain('cp-popconfirm');
    expect(pcProps.overlayClassName).not.toContain('cp-popover');
    expect(pcProps.overlayClassName).not.toContain('cp-tooltip');

    // Tour gets cp-tour on rootClassName
    const vcTour = wrapper.findComponent({ name: 'Tour' });
    expect(vcTour.props('rootClassName')).toContain('cp-tour');
  });
});
