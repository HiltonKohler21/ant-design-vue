import { mount } from '@vue/test-utils';
import Upload from '..';
import Transfer from '../../transfer';
import Progress from '../../progress';

describe('P3: upload.extra / transfer.selectionsIcon / progress.percentPosition', () => {
  it('Upload extra 渲染在列表项', () => {
    const wrapper = mount(Upload, {
      props: {
        fileList: [{ uid: '1', name: 'a.png', status: 'done', url: 'http://x' }],
        extra: <span class="upload-extra">extra</span>,
      },
    });
    expect(wrapper.html()).toContain('upload-extra');
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

  it('Progress percentPosition=inner 输出 class', () => {
    const wrapper = mount(Progress, { props: { percent: 50, percentPosition: 'inner' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-progress-show-info-inner');
  });
});
