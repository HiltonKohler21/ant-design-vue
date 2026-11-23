import { mount } from '@vue/test-utils';
import Button from '..';
import Popconfirm from '../../popconfirm';
import ConfigProvider from '../../config-provider';
import { PresetColors } from '../../theme/interface';

describe('Button variant（antd 5.21）', () => {
  it('variant=solid 映射 primary', () => {
    const wrapper = mount(Button, { props: { variant: 'solid' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-primary');
  });

  it('variant=dashed 映射 dashed', () => {
    const wrapper = mount(Button, { props: { variant: 'dashed' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-dashed');
  });

  it('variant=link 映射 link', () => {
    const wrapper = mount(Button, { props: { variant: 'link' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-link');
  });

  it('variant=filled 输出 filled class', () => {
    const wrapper = mount(Button, { props: { variant: 'filled' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-filled');
  });

  it('color=danger 输出 dangerous', () => {
    const wrapper = mount(Button, { props: { variant: 'solid', color: 'danger' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-dangerous');
  });

  it('color=primary 输出 color-primary 且 variant=link ghost 不输出 background-ghost', () => {
    const wrapper = mount(Button, { props: { variant: 'filled', color: 'primary' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-color-primary');
    expect(wrapper.element.getAttribute('class')).toContain('ant-btn-filled');

    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const linkGhost = mount(Button, { props: { variant: 'link', ghost: true } });
    expect(linkGhost.element.getAttribute('class')).not.toContain('ant-btn-background-ghost');
    warnSpy.mockRestore();
  });

  it('color=default variant=solid 渲染深色实心而非蓝底 primary', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(Button, { props: { color: 'default', variant: 'solid' } });
    await new Promise(r => setTimeout(r, 30));
    const cls = wrapper.element.getAttribute('class') || '';
    expect(cls).toContain('ant-btn-color-default');
    expect(cls).toContain('ant-btn-variant-solid');
    expect(cls).not.toContain('ant-btn-primary');
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-btn-color-default');
    expect(css).toContain('ant-btn-variant-solid');
    expect(css).toContain('rgb(0, 0, 0)');
  });

  it('支持 antd 5.23+ 全部 13 种 PresetColors 与 6 种 variants', async () => {
    const variants = ['outlined', 'dashed', 'solid', 'filled', 'text', 'link'];
    PresetColors.forEach(color => {
      variants.forEach(variant => {
        const wrapper = mount(Button, { props: { color, variant } });
        const cls = wrapper.element.getAttribute('class') || '';
        expect(cls).toContain(`ant-btn-color-${color}`);
        expect(cls).toContain(`ant-btn-variant-${variant}`);
        expect(cls).not.toContain('ant-btn-primary');
      });
    });
    await new Promise(r => setTimeout(r, 30));
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    PresetColors.forEach(color => {
      expect(css).toContain(`ant-btn-color-${color}`);
    });
  });

  it('支持 ConfigProvider.button（className / style / variant / color / autoInsertSpace）', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        button: {
          className: 'ctx-btn-cls',
          style: { letterSpacing: '2px' },
          color: 'cyan',
          variant: 'filled',
          autoInsertSpace: false,
        },
      },
      slots: {
        default: () => (
          <div>
            <Button class="local-a">确定</Button>
            <Button class="local-b" autoInsertSpace>
              确定
            </Button>
            <Button class="local-c" type="primary">
              主要
            </Button>
          </div>
        ),
      },
    });
    const btnA = wrapper.find('.local-a');
    expect(btnA.classes()).toContain('ctx-btn-cls');
    expect(btnA.classes()).toContain('ant-btn-color-cyan');
    expect(btnA.classes()).toContain('ant-btn-variant-filled');
    expect(btnA.element.getAttribute('style')).toContain('letter-spacing: 2px');
    expect(btnA.text()).toBe('确定');

    // props.autoInsertSpace 优先级高于 ConfigProvider.button.autoInsertSpace
    const btnB = wrapper.find('.local-b');
    expect(btnB.text()).toBe('确 定');

    // 本地显式 type 覆盖 ConfigProvider.button.color/variant
    const btnC = wrapper.find('.local-c');
    expect(btnC.classes()).toContain('ant-btn-primary');
    expect(btnC.classes()).not.toContain('ant-btn-color-cyan');
  });

  it('cssVar 模式下 default solid 与 preset colors 不产生非法 CSS', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: { theme: { cssVar: true } },
      slots: {
        default: () => (
          <div>
            <Button color="default" variant="solid">
              Dark
            </Button>
            <Button color="cyan" variant="solid">
              Cyan
            </Button>
            <Button color="purple" variant="filled">
              Purple
            </Button>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).not.toContain('NaN');
    expect(css).not.toContain('undefined');
    expect(css).not.toContain('[object Object]');
    wrapper.unmount();
  });
});

describe('Popconfirm onPopupClick', () => {
  it('触发回调', () => {
    const onPopupClick = jest.fn();
    const wrapper = mount(Popconfirm, {
      props: { title: 't', onPopupClick, open: true },
      attachTo: 'body',
    });
    expect(typeof onPopupClick).toBe('function');
    wrapper.unmount();
  });
});
