import { mount } from '@vue/test-utils';
import Upload from '..';
import Transfer from '../../transfer';
import Progress from '../../progress';

describe('P3: upload.extra / transfer.selectionsIcon / progress.percentPosition', () => {
  it('Upload extra 渲染在列表项且支持 #extra 插槽调用', () => {
    const wrapper = mount(Upload, {
      props: {
        fileList: [{ uid: '1', name: 'a.png', status: 'done', url: 'http://x' }],
        extra: <span class="upload-extra">extra</span>,
      },
    });
    expect(wrapper.html()).toContain('upload-extra');

    const slotWrapper = mount(Upload, {
      props: {
        fileList: [{ uid: '2', name: 'b.png', status: 'done', url: 'http://x' }],
      },
      slots: {
        extra: file => <span class="upload-extra-slot">{file.name}</span>,
      },
    });
    expect(slotWrapper.html()).toContain('upload-extra-slot');
    expect(slotWrapper.html()).toContain('b.png');
  });

  it('Transfer selectionsIcon 替换下拉图标', () => {
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [{ key: '1', title: 'a' }],
        targetKeys: [],
        selectionsIcon: <span class="sel-icon">sel</span>,
      },
    });
    expect(wrapper.html()).toContain('sel-icon');
  });

  it('Progress percentPosition=inner 输出 class 且支持对象形式与响应式像素 width', async () => {
    const wrapper = mount(Progress, { props: { percent: 50, percentPosition: 'inner' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-progress-show-info-inner');

    const objWrapper = mount(Progress, {
      props: { percent: 50, percentPosition: { type: 'inner', align: 'center' }, size: [200, 12] },
    });
    expect(objWrapper.element.getAttribute('class')).toContain('ant-progress-show-info-inner');
    expect(objWrapper.find('.ant-progress-outer').element.style.width).toBe('200px');
    await objWrapper.setProps({ size: [300, 16] });
    expect(objWrapper.find('.ant-progress-outer').element.style.width).toBe('300px');
  });
});
