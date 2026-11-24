import { mount } from '@vue/test-utils';
import Upload from '..';
import ConfigProvider from '../../config-provider';

const defaultFileList = [
  { uid: '1', name: 'a.png', status: 'done', url: '#a.png' },
  { uid: '2', name: 'b.png', status: 'error', response: 'Error' },
];

describe('Upload v6 semantic classNames & styles and picture-circle', () => {
  it('supports object and function classNames & styles on root, trigger, list, item', () => {
    const wrapper = mount(Upload, {
      props: {
        multiple: true,
        defaultFileList,
        classNames: info => ({
          root: info.props.multiple ? 'up-root-multi' : 'up-root-single',
          trigger: 'up-trigger',
          list: 'up-list',
          item: 'up-item',
        }),
        styles: info => ({
          root: { padding: '8px' },
          trigger: { backgroundColor: info.props.multiple ? 'rgb(1, 2, 3)' : 'rgb(4, 5, 6)' },
          list: { marginTop: '6px' },
          item: { height: '30px' },
        }),
      },
      slots: { default: () => <button type="button">Upload</button> },
    });

    const root = wrapper.find('.ant-upload-wrapper');
    expect(root.classes()).toContain('up-root-multi');
    expect(root.element.style.padding).toBe('8px');
    expect(root.element.hasAttribute('classnames')).toBe(false);
    expect(root.element.hasAttribute('styles')).toBe(false);

    const trigger = wrapper.find('.ant-upload-select');
    expect(trigger.classes()).toContain('up-trigger');
    expect(trigger.element.style.backgroundColor).toBe('rgb(1, 2, 3)');

    const list = wrapper.find('.ant-upload-list');
    expect(list.classes()).toContain('up-list');
    expect(list.element.style.marginTop).toBe('6px');

    const items = wrapper.findAll('.ant-upload-list-item');
    expect(items.length).toBe(2);
    items.forEach(item => {
      expect(item.classes()).toContain('up-item');
      expect(item.element.style.height).toBe('30px');
    });
  });

  it('merges ConfigProvider.upload semantic classNames & styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            upload={{
              className: 'cp-up',
              classNames: {
                root: 'cp-up-root',
                trigger: 'cp-up-trigger',
                list: 'cp-up-list',
                item: 'cp-up-item',
              },
              styles: { root: { margin: '4px' }, item: { borderRadius: '2px' } },
            }}
          >
            <Upload defaultFileList={defaultFileList} classNames={{ root: 'own-up-root' }}>
              <button type="button">Upload</button>
            </Upload>
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-upload-wrapper');
    expect(root.classes()).toContain('cp-up');
    expect(root.classes()).toContain('cp-up-root');
    expect(root.classes()).toContain('own-up-root');
    expect(root.element.style.margin).toBe('4px');
    expect(wrapper.find('.ant-upload-select').classes()).toContain('cp-up-trigger');
    expect(wrapper.find('.ant-upload-list').classes()).toContain('cp-up-list');
    expect(wrapper.find('.ant-upload-list-item').classes()).toContain('cp-up-item');
    expect(wrapper.find('.ant-upload-list-item').element.style.borderRadius).toBe('2px');
  });

  it('supports listType="picture-circle"', () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'picture-circle',
        defaultFileList,
      },
      slots: { default: () => <span>+ Upload</span> },
    });

    expect(wrapper.find('.ant-upload-picture-circle-wrapper').exists()).toBe(true);
    expect(wrapper.find('.ant-upload-list-picture-circle').exists()).toBe(true);
    expect(wrapper.find('.ant-upload-select-picture-circle').exists()).toBe(true);
  });
});
