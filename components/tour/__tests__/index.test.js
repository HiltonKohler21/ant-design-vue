import Tour from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';

describe('Tour', () => {
  mountTest(Tour);

  it('The Tour should render successfully ', function () {
    const wrapper = mount({
      setup() {
        return () => {
          return <Tour class="Tour" content="Ant Design" />;
        };
      },
    });
    expect(wrapper.find('.Tour').exists()).toBe(true);
  });

  it('forwards top-level actionsRender, preserves step-level type, and passes numeric total to indicatorsRender', async () => {
    document.body.innerHTML = '';
    const indicatorArgs = [];
    const wrapper = mount(Tour, {
      props: {
        open: true,
        type: 'default',
        actionsRender: (originNode, info) => (
          <div class="top-actions">
            {info.current}/{info.total}
            {originNode}
          </div>
        ),
        steps: [{ title: 'Step 1', type: 'primary' }, { title: 'Step 2' }],
      },
      slots: {
        indicatorsRender: args => {
          indicatorArgs.push(args);
          return <span class="custom-ind">{`${args.current + 1}/${args.total}`}</span>;
        },
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 80));
    expect(document.body.querySelector('.top-actions')).not.toBeNull();
    expect(document.body.querySelector('.ant-tour-primary')).not.toBeNull();
    expect(indicatorArgs.length).toBeGreaterThan(0);
    expect(typeof indicatorArgs[0].total).toBe('number');
    expect(indicatorArgs[0].total).toBe(2);
    expect(document.body.querySelector('.custom-ind')?.textContent).toBe('1/2');
    wrapper.unmount();
  });
});
