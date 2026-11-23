import { mount } from '@vue/test-utils';
import Button from '../../button';
import Card from '../../card';
import ConfigProvider from '../../config-provider';
import Descriptions from '../../descriptions';
import List from '../../list';

describe('upstream semantic API: Button / Card / Descriptions / List', () => {
  it('Button classNames.icon / styles.icon', () => {
    const wrapper = mount(Button, {
      props: {
        classNames: { icon: 'btn-icon' },
        styles: { icon: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => 'ok', icon: () => <span class="raw-icon">i</span> },
    });
    const html = wrapper.html();
    expect(html).toContain('btn-icon');
    expect(html).toContain('color: rgb(1, 2, 3)');
  });

  it('Card 七个语义位（静态对象）', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'T',
        extra: 'E',
        cover: <div>cover</div>,
        classNames: {
          root: 'c-root',
          header: 'c-head',
          title: 'c-title',
          extra: 'c-extra',
          cover: 'c-cover',
          body: 'c-body',
          actions: 'c-actions',
        },
        styles: {
          root: { backgroundColor: 'rgb(10, 20, 30)' },
          header: { color: 'rgb(1, 2, 3)' },
          title: { fontSize: '20px' },
          extra: { color: 'rgb(7, 8, 9)' },
          cover: { padding: '10px' },
          body: { color: 'rgb(4, 5, 6)' },
          actions: { margin: '8px' },
        },
        actions: [<span>a1</span>],
      },
      slots: { default: () => 'body' },
    });

    expect(wrapper.find('.ant-card').classes()).toContain('c-root');
    expect(wrapper.find('.ant-card-head').classes()).toContain('c-head');
    expect(wrapper.find('.ant-card-head-title').classes()).toContain('c-title');
    expect(wrapper.find('.ant-card-extra').classes()).toContain('c-extra');
    expect(wrapper.find('.ant-card-cover').classes()).toContain('c-cover');
    expect(wrapper.find('.ant-card-body').classes()).toContain('c-body');
    expect(wrapper.find('.ant-card-actions').classes()).toContain('c-actions');

    expect(wrapper.find('.ant-card').element.style.backgroundColor).toBe('rgb(10, 20, 30)');
    expect(wrapper.find('.ant-card-head').element.style.color).toBe('rgb(1, 2, 3)');
    expect(wrapper.find('.ant-card-head-title').element.style.fontSize).toBe('20px');
    expect(wrapper.find('.ant-card-extra').element.style.color).toBe('rgb(7, 8, 9)');
    expect(wrapper.find('.ant-card-cover').element.style.padding).toBe('10px');
    expect(wrapper.find('.ant-card-body').element.style.color).toBe('rgb(4, 5, 6)');
    expect(wrapper.find('.ant-card-actions').element.style.margin).toBe('8px');
  });

  it('Card supports functional classNames and styles for all 7 slots with { props }', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const classNamesFn = jest.fn(({ props }) => ({
      root: `fn-root-${props.size || 'default'}-${props.variant}`,
      header: `fn-header-${props.variant}`,
      title: 'fn-title',
      extra: 'fn-extra',
      body: `fn-body-${props.size || 'default'}`,
      actions: 'fn-actions',
      cover: 'fn-cover',
    }));
    const stylesFn = jest.fn(({ props }) => ({
      root: { borderRadius: props.size === 'small' ? '6px' : '12px' },
      header: { padding: '12px' },
      title: { fontWeight: '700' },
      extra: { opacity: '0.8' },
      body: { padding: props.size === 'small' ? '8px' : '24px' },
      actions: { borderTopWidth: '2px' },
      cover: { overflow: 'hidden' },
    }));

    const wrapper = mount(Card, {
      props: {
        title: 'Card Title',
        extra: 'More',
        size: 'small',
        variant: 'borderless',
        cover: <div>cover</div>,
        actions: [<span>a1</span>],
        classNames: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => 'content' },
    });

    expect(classNamesFn).toHaveBeenCalled();
    expect(stylesFn).toHaveBeenCalled();
    expect(wrapper.find('.ant-card').classes()).toContain('fn-root-small-borderless');
    expect(wrapper.find('.ant-card-head').classes()).toContain('fn-header-borderless');
    expect(wrapper.find('.ant-card-head-title').classes()).toContain('fn-title');
    expect(wrapper.find('.ant-card-extra').classes()).toContain('fn-extra');
    expect(wrapper.find('.ant-card-body').classes()).toContain('fn-body-small');
    expect(wrapper.find('.ant-card-actions').classes()).toContain('fn-actions');
    expect(wrapper.find('.ant-card-cover').classes()).toContain('fn-cover');

    expect(wrapper.find('.ant-card').element.style.borderRadius).toBe('6px');
    expect(wrapper.find('.ant-card-head').element.style.padding).toBe('12px');
    expect(wrapper.find('.ant-card-head-title').element.style.fontWeight).toBe('700');
    expect(wrapper.find('.ant-card-extra').element.style.opacity).toBe('0.8');
    expect(wrapper.find('.ant-card-body').element.style.padding).toBe('8px');
    expect(wrapper.find('.ant-card-actions').element.style.borderTopWidth).toBe('2px');
    expect(wrapper.find('.ant-card-cover').element.style.overflow).toBe('hidden');

    await wrapper.setProps({ size: 'default', variant: 'outlined' });
    expect(wrapper.find('.ant-card').classes()).toContain('fn-root-default-outlined');
    expect(wrapper.find('.ant-card').element.style.borderRadius).toBe('12px');
    expect(wrapper.find('.ant-card-body').element.style.padding).toBe('24px');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('Card merges ConfigProvider functional semantics with component semantics and legacy styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            card={{
              classNames: ({ props }) => ({
                root: `ctx-root-${props.size || 'default'}`,
                body: 'ctx-body',
              }),
              styles: ({ props }) => ({
                root: { margin: props.size === 'small' ? '4px' : '8px' },
                header: { backgroundColor: 'rgb(1, 1, 1)' },
              }),
            }}
          >
            <Card
              title="T"
              size="small"
              headStyle={{ color: 'rgb(2, 2, 2)' }}
              bodyStyle={{ color: 'rgb(3, 3, 3)' }}
              classNames={{ root: 'prop-root', body: 'prop-body' }}
              styles={{ root: { padding: '5px' }, body: { backgroundColor: 'rgb(4, 4, 4)' } }}
            >
              body
            </Card>
          </ConfigProvider>
        );
      },
    });

    const rootEl = wrapper.find('.ant-card');
    expect(rootEl.classes()).toContain('ctx-root-small');
    expect(rootEl.classes()).toContain('prop-root');
    expect(rootEl.element.style.margin).toBe('4px');
    expect(rootEl.element.style.padding).toBe('5px');

    const headEl = wrapper.find('.ant-card-head');
    expect(headEl.element.style.backgroundColor).toBe('rgb(1, 1, 1)');
    expect(headEl.element.style.color).toBe('rgb(2, 2, 2)');

    const bodyEl = wrapper.find('.ant-card-body');
    expect(bodyEl.classes()).toContain('ctx-body');
    expect(bodyEl.classes()).toContain('prop-body');
    expect(bodyEl.element.style.color).toBe('rgb(3, 3, 3)');
    expect(bodyEl.element.style.backgroundColor).toBe('rgb(4, 4, 4)');
  });

  it('Descriptions root/header/title/extra', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 'T',
        extra: 'E',
        classNames: { root: 'd-root', header: 'd-head', title: 'd-title', extra: 'd-extra' },
        styles: { root: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => [<Descriptions.Item label="l">c</Descriptions.Item>] },
    });
    const html = wrapper.html();
    for (const c of ['d-root', 'd-head', 'd-title', 'd-extra']) expect(html).toContain(c);
    expect(html).toContain('color: rgb(1, 2, 3)');
  });

  it('List.Item classNames.actions / styles.actions', () => {
    const wrapper = mount(List.Item, {
      props: {
        actions: [<span>act</span>],
        classNames: { actions: 'l-actions' },
        styles: { actions: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => 'item' },
    });
    const html = wrapper.html();
    expect(html).toContain('l-actions');
    expect(html).toContain('color: rgb(1, 2, 3)');
  });
});
