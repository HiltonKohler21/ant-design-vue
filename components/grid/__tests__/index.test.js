import { mount } from '@vue/test-utils';
import { Col, Row } from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Grid', () => {
  mountTest(Row);
  mountTest(Col);
  it('should render Col', () => {
    const wrapper = mount(Col, {
      props: {
        span: 2,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should render Row', () => {
    const wrapper = mount(Row);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders wrapped Col correctly', () => {
    const wrapper = mount({
      render() {
        return (
          <Row gutter={20}>
            <div>
              <Col span={12} />
            </div>
            <Col span={12} />
          </Row>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('supports responsive flex CSS variables, xxxl breakpoint, and string CSS gutter', () => {
    const wrapper = mount({
      render() {
        return (
          <Row gutter="1rem">
            <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} xxxl={6}>
              Col
            </Col>
          </Row>
        );
      },
    });
    const rowVm = wrapper.findComponent(Row).vm;
    const rowVNodeStyle = rowVm.$.subTree.props.style;
    expect(rowVNodeStyle.marginLeft).toBe('calc(1rem / -2)');
    expect(rowVNodeStyle.marginRight).toBe('calc(1rem / -2)');

    const colEl = wrapper.find('.ant-col');
    expect(colEl.classes()).toContain('ant-col-xs-flex');
    expect(colEl.classes()).toContain('ant-col-sm-flex');
    expect(colEl.classes()).toContain('ant-col-xxxl-6');
    expect(colEl.attributes('style')).toContain('--ant-col-xs-flex: 0 0 100%');
    expect(colEl.attributes('style')).toContain('--ant-col-sm-flex: 0 0 50%');

    const colVm = wrapper.findComponent(Col).vm;
    const colVNodeStyle = colVm.$.subTree.props.style;
    expect(colVNodeStyle.paddingLeft).toBe('calc(1rem / 2)');
    expect(colVNodeStyle.paddingRight).toBe('calc(1rem / 2)');
  });
});
