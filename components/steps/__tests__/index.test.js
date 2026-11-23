import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Steps from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

describe('Steps', () => {
  mountTest(Steps);

  it('supports orientation alias taking precedence over direction', () => {
    const wrapper = mount(Steps, {
      props: {
        responsive: false,
        direction: 'horizontal',
        orientation: 'vertical',
        items: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    });
    expect(wrapper.find('.ant-steps').classes()).toContain('ant-steps-vertical');
    expect(wrapper.find('.ant-steps').classes()).not.toContain('ant-steps-horizontal');
  });

  it('supports titlePlacement alias taking precedence over labelPlacement', () => {
    const wrapper = mount(Steps, {
      props: {
        responsive: false,
        labelPlacement: 'horizontal',
        titlePlacement: 'vertical',
        items: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    });
    expect(wrapper.find('.ant-steps').classes()).toContain('ant-steps-label-vertical');
  });

  it('supports variant="outlined", variant="filled", and ConfigProvider.steps.variant', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: { cssVar: true },
        steps: { variant: 'outlined' },
      },
      slots: {
        default: () => (
          <Steps
            responsive={false}
            current={1}
            items={[{ title: 'Done' }, { title: 'Active' }, { title: 'Wait' }]}
          />
        ),
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-steps').classes()).toContain('ant-steps-outlined');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-steps-outlined');
    expect(css).not.toContain('NaN');

    const filledWrapper = mount(Steps, {
      props: {
        responsive: false,
        variant: 'filled',
        items: [{ title: 'One' }],
      },
    });
    expect(filledWrapper.find('.ant-steps').classes()).toContain('ant-steps-filled');
    expect(filledWrapper.find('.ant-steps').classes()).not.toContain('ant-steps-outlined');
  });

  it('supports ellipsis prop and CSS rules', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(Steps, {
      props: {
        responsive: false,
        ellipsis: true,
        items: [{ title: 'Very long step title', content: 'Very long step description' }],
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-steps').classes()).toContain('ant-steps-ellipsis');
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-steps-ellipsis');
    expect(css).toContain('text-overflow:ellipsis');
  });

  it('supports items[].content as backwards-compatible alias for description', () => {
    const wrapper = mount(Steps, {
      props: {
        responsive: false,
        items: [
          { title: 'Step 1', content: 'Content text' },
          { title: 'Step 2', description: 'Legacy description' },
          { title: 'Step 3', content: 'Preferred content', description: 'Fallback desc' },
        ],
      },
    });
    const descs = wrapper.findAll('.ant-steps-item-description');
    expect(descs).toHaveLength(3);
    expect(descs[0].text()).toBe('Content text');
    expect(descs[1].text()).toBe('Legacy description');
    expect(descs[2].text()).toBe('Preferred content');
  });

  it('supports static and functional classNames and styles merged with ConfigProvider.steps', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        steps: {
          classNames: ({ props }) => ({
            root: `ctx-root-${props.variant}`,
            item: 'ctx-item',
            itemIcon: 'ctx-icon',
            itemTitle: 'ctx-title',
          }),
          styles: {
            root: { padding: '8px' },
            item: { marginBottom: '4px' },
            itemContent: { opacity: '0.8' },
          },
        },
      },
      slots: {
        default: () => (
          <Steps
            responsive={false}
            variant="outlined"
            current={1}
            items={[
              {
                title: 'First',
                subTitle: 'Sub 1',
                content: 'Desc 1',
              },
              {
                title: 'Second',
                subTitle: 'Sub 2',
                content: 'Desc 2',
              },
            ]}
            classNames={({ props }) => ({
              root: `prop-root-${props.orientation}`,
              item: 'prop-item',
              itemWrapper: 'prop-wrapper',
              itemHeader: 'prop-header',
              itemTitle: 'prop-title',
              itemSubtitle: 'prop-subtitle',
              itemContent: 'prop-content',
              itemIcon: 'prop-item-icon',
              itemRail: 'prop-rail',
              icon: 'prop-icon-alias',
              title: 'prop-title-alias',
              description: 'prop-desc-alias',
            })}
            styles={({ props }) => ({
              root: { marginTop: props.variant === 'outlined' ? '12px' : '0px' },
              itemWrapper: { paddingLeft: '2px' },
              itemIcon: { borderRadius: '4px' },
              itemRail: { top: '10px' },
              itemTitle: { letterSpacing: '1px' },
              itemSubtitle: { fontStyle: 'italic' },
              description: { color: 'rgb(1, 2, 3)' },
            })}
          />
        ),
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-steps');
    expect(root.classes()).toContain('ctx-root-outlined');
    expect(root.classes()).toContain('prop-root-horizontal');
    expect(root.attributes('style')).toContain('padding: 8px');
    expect(root.attributes('style')).toContain('margin-top: 12px');

    const firstItem = wrapper.findAll('.ant-steps-item')[0];
    expect(firstItem.classes()).toContain('ctx-item');
    expect(firstItem.classes()).toContain('prop-item');
    expect(firstItem.attributes('style')).toContain('margin-bottom: 4px');

    const itemWrapper = firstItem.find('.ant-steps-item-container');
    expect(itemWrapper.classes()).toContain('prop-wrapper');
    expect(itemWrapper.attributes('style')).toContain('padding-left: 2px');

    const itemRail = firstItem.find('.ant-steps-item-tail');
    expect(itemRail.classes()).toContain('prop-rail');
    expect(itemRail.attributes('style')).toContain('top: 10px');

    const itemIcon = firstItem.find('.ant-steps-item-icon');
    expect(itemIcon.classes()).toContain('ctx-icon');
    expect(itemIcon.classes()).toContain('prop-item-icon');
    expect(itemIcon.classes()).toContain('prop-icon-alias');
    expect(itemIcon.attributes('style')).toContain('border-radius: 4px');

    const itemTitle = firstItem.find('.ant-steps-item-title');
    expect(itemTitle.classes()).toContain('ctx-title');
    expect(itemTitle.classes()).toContain('prop-header');
    expect(itemTitle.classes()).toContain('prop-title');
    expect(itemTitle.classes()).toContain('prop-title-alias');
    expect(itemTitle.attributes('style')).toContain('letter-spacing: 1px');

    const itemSubtitle = firstItem.find('.ant-steps-item-subtitle');
    expect(itemSubtitle.classes()).toContain('prop-subtitle');
    expect(itemSubtitle.attributes('style')).toContain('font-style: italic');

    const itemDesc = firstItem.find('.ant-steps-item-description');
    expect(itemDesc.classes()).toContain('prop-content');
    expect(itemDesc.classes()).toContain('prop-desc-alias');
    expect(itemDesc.attributes('style')).toContain('opacity: 0.8');
    expect(itemDesc.attributes('style')).toContain('color: rgb(1, 2, 3)');
  });
});
