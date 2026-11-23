import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Avatar from '..';
import ConfigProvider from '../../config-provider';
import Popover from '../../popover';
import useBreakpoint from '../../_util/hooks/useBreakpoint';

jest.mock('../../_util/hooks/useBreakpoint');

describe('Avatar Render', () => {
  let originOffsetWidth;
  const sizes = { xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 };

  beforeAll(() => {
    // Mock offsetHeight
    originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth').get;
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.className === 'ant-avatar-string') {
          return 100;
        }
        return 80;
      },
    });
  });

  afterAll(() => {
    // Restore Mock offsetHeight
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get: originOffsetWidth,
    });
  });
  it('Render long string correctly', () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'TestString',
      },
    });
    const children = wrapper.findAll('.ant-avatar-string');
    expect(children.length).toBe(1);
  });
  it('should render fallback string correctly', async () => {
    global.document.body.innerHTML = '';
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'Fallback',
      },
      props: {
        src: 'http://error.url',
      },
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      const children = wrapper.findAll('.ant-avatar-string');
      expect(children.length).toBe(1);
      expect(children[0].text()).toBe('Fallback');
    });
  });
  it('should handle onError correctly', async () => {
    global.document.body.innerHTML = '';
    const LOAD_FAILURE_SRC = 'http://error.url';
    const LOAD_SUCCESS_SRC = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

    const Foo = {
      data() {
        return {
          src: LOAD_FAILURE_SRC,
        };
      },
      methods: {
        handleImgError() {
          this.src = LOAD_SUCCESS_SRC;
          return false;
        },
      },

      render() {
        const { src } = this;
        return <Avatar src={src} loadError={this.handleImgError} />;
      },
    };

    const wrapper = mount(Foo, { attachTo: 'body' });
    await asyncExpect(() => {
      // mock img load Error, since jsdom do not load resource by default
      // https://github.com/jsdom/jsdom/issues/1816
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.find('img')).not.toBeNull();
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.find('img').attributes('src')).toBe(LOAD_SUCCESS_SRC);
    }, 0);
  });

  it('should show image on success after a failure state', async () => {
    global.document.body.innerHTML = '';
    const LOAD_FAILURE_SRC = 'http://error.url';
    const LOAD_SUCCESS_SRC = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

    const Foo = {
      data() {
        return {
          src: LOAD_FAILURE_SRC,
        };
      },
      render() {
        const { src } = this;
        return <Avatar src={src}>Fallback</Avatar>;
      },
    };

    const wrapper = mount(Foo, { sync: false, attachTo: 'body' });
    await asyncExpect(() => {
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findComponent({ name: 'AAvatar' }).findAll('img').length).toBe(0);
      expect(wrapper.findAll('.ant-avatar-string').length).toBe(1);
    }, 0);

    await asyncExpect(() => {
      wrapper.vm.src = LOAD_SUCCESS_SRC;
    });
    await asyncExpect(() => {
      expect(wrapper.findComponent({ name: 'AAvatar' }).findAll('img').length).toBe(1);
      expect(wrapper.findAll('.ant-avatar-image').length).toBe(1);
    }, 0);
  });

  it('should calculate scale of avatar children correctly', async () => {
    let wrapper = mount({
      render() {
        return <Avatar>Avatar</Avatar>;
      },
    });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-avatar-string').html()).toMatchSnapshot();
    }, 0);

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.className === 'ant-avatar-string') {
          return 100;
        }
        return 40;
      },
    });
    wrapper = mount({
      render() {
        return <Avatar>xx</Avatar>;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-avatar-string').html()).toMatchSnapshot();
    }, 0);
  });

  it('should calculate scale of avatar children correctly with gap', async () => {
    const wrapper = mount({
      render() {
        return <Avatar gap={2}>Avatar</Avatar>;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 0);
  });

  Object.entries(sizes).forEach(([key, value]) => {
    it(`adjusts component size to ${value} when window size is ${key}`, async () => {
      useBreakpoint.mockReturnValue({ value: { [key]: true } });

      const wrapper = mount({
        render() {
          return <Avatar size={sizes} />;
        },
      });

      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      }, 0);
    });
  });

  it('fallback', () => {
    const div = global.document.createElement('div');
    global.document.body.appendChild(div);
    const wrapper = mount(
      {
        render() {
          return (
            <Avatar shape="circle" src="http://error.url">
              A
            </Avatar>
          );
        },
      },
      { attachTo: div },
    );
    wrapper.find('img').trigger('error');
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
    global.document.body.removeChild(div);
  });

  it('Avatar.Group supports max as both number and object { count, style, popover }', () => {
    const numWrapper = mount({
      render() {
        return (
          <Avatar.Group max={2}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
            <Avatar>D</Avatar>
          </Avatar.Group>
        );
      },
    });
    const numAvatars = numWrapper.findAll('.ant-avatar');
    expect(numAvatars).toHaveLength(3);
    expect(numAvatars[2].text()).toBe('+2');

    const objWrapper = mount({
      render() {
        return (
          <Avatar.Group
            maxStyle={{ fontWeight: 'bold' }}
            max={{
              count: 2,
              style: { color: 'rgb(245, 106, 0)', backgroundColor: 'rgb(253, 227, 207)' },
              popover: {
                trigger: 'click',
                placement: 'bottom',
                overlayClassName: 'custom-avatar-pop',
              },
            }}
          >
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
            <Avatar>D</Avatar>
            <Avatar>E</Avatar>
          </Avatar.Group>
        );
      },
    });
    const objAvatars = objWrapper.findAll('.ant-avatar');
    expect(objAvatars).toHaveLength(3);
    expect(objAvatars[2].text()).toBe('+3');
    expect(objAvatars[2].element.style.color).toBe('rgb(245, 106, 0)');
    expect(objAvatars[2].element.style.backgroundColor).toBe('rgb(253, 227, 207)');
    expect(objAvatars[2].element.style.fontWeight).toBe('bold');

    const popover = objWrapper.findComponent(Popover);
    expect(popover.props('trigger')).toBe('click');
    expect(popover.props('placement')).toBe('bottom');
    expect(popover.props('overlayClassName')).toContain('ant-avatar-group-popover');
    expect(popover.props('overlayClassName')).toContain('custom-avatar-pop');
  });

  it('ConfigProvider.avatar wires className and style', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            avatar={{ className: 'cp-avatar', style: { backgroundColor: 'rgb(1, 2, 3)' } }}
          >
            <Avatar>U</Avatar>
          </ConfigProvider>
        );
      },
    });
    const avatar = wrapper.find('.ant-avatar');
    expect(avatar.classes()).toContain('cp-avatar');
    expect(avatar.element.style.backgroundColor).toBe('rgb(1, 2, 3)');
  });
});
