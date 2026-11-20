import { mount } from '@vue/test-utils';
import Collapse from '..';

describe('Collapse destroyOnHidden（antd 5.25）', () => {
  it('destroyOnHidden 作为 destroyInactivePanel 别名', () => {
    const wrapper = mount(Collapse, {
      props: { destroyOnHidden: true, defaultActiveKey: [] },
      slots: {
        default: () => [
          <Collapse.Panel key="1" header="A">
            content-a
          </Collapse.Panel>,
        ],
      },
    });
    // 非激活面板不渲染内容（destroyInactivePanel 生效）
    expect(wrapper.html()).not.toContain('content-a');
  });
});
