import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Popover from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Popover', () => {
  mountTest({
    render() {
      return (
        <div>
          <Popover />
        </div>
      );
    },
  });
  it('should show overlay when trigger is clicked', async () => {
    const popover = mount(
      {
        render() {
          return (
            <Popover
              ref="popover"
              content="console.log('hello world')"
              title="code"
              trigger="click"
            >
              <span>show me your code</span>
            </Popover>
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(popover.vm.$refs.popover.getPopupDomNode()).toBe(null);

      popover.find('span').trigger('click');
    }, 0);
    let popup = null;
    await asyncExpect(() => {
      popup = popover.vm.$refs.popover.getPopupDomNode();
      expect(popup).not.toBe(null);
    }, 1000);
    await asyncExpect(() => {
      expect(popup.innerHTML).toMatchSnapshot();
      expect(popup.innerHTML).toMatchSnapshot();
    });
  });

  it('should render overlay when only content (without title) is provided', async () => {
    const popover = mount(
      {
        render() {
          return (
            <Popover ref="popover" content="only content text" open>
              <span>trigger</span>
            </Popover>
          );
        },
      },
      { attachTo: 'body' },
    );
    await new Promise(r => setTimeout(r, 80));
    const popup = popover.vm.$refs.popover.getPopupDomNode();
    expect(popup).not.toBe(null);
    expect(popup.innerHTML).toContain('only content text');
    popover.unmount();
  });
});
