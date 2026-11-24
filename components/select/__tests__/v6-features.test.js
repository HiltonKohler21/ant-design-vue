import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Select from '..';

describe('Select v6 features: PurePanel, maxCount, optionRender, labelRender, showSearch object, custom tokenSeparators', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes _InternalPanelDoNotUseOrYouWillBeFired (PurePanel) and renders popup inside holder', async () => {
    const InternalSelect = Select._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalSelect).toBeTruthy();

    const wrapper = mount(InternalSelect, {
      props: {
        defaultValue: 'lucy',
        options: [
          { label: 'Jack', value: 'jack' },
          { label: 'Lucy', value: 'lucy' },
        ],
        virtual: false,
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-select').exists()).toBe(true);
    expect(wrapper.find('.ant-select-dropdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Jack');
    expect(wrapper.text()).toContain('Lucy');
    wrapper.unmount();
  });

  it('supports maxCount in multiple mode (disables unselected options and prevents exceeding limit)', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Select, {
      props: {
        mode: 'multiple',
        maxCount: 2,
        defaultValue: ['a', 'b'],
        open: true,
        virtual: false,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
        ],
        onChange,
      },
      attachTo: document.body,
    });
    await nextTick();

    const items = document.body.querySelectorAll('.ant-select-item-option');
    expect(items.length).toBe(3);
    expect(items[0].className).not.toContain('ant-select-item-option-disabled');
    expect(items[1].className).not.toContain('ant-select-item-option-disabled');
    expect(items[2].className).toContain('ant-select-item-option-disabled');

    // Clicking disabled 3rd option should not trigger change
    items[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    // Deselecting selected item should work and re-enable 3rd option
    items[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onChange).toHaveBeenCalledWith(['b'], expect.any(Array));
    const itemsAfter = document.body.querySelectorAll('.ant-select-item-option');
    expect(itemsAfter[2].className).not.toContain('ant-select-item-option-disabled');

    wrapper.unmount();
  });

  it('supports optionRender prop with flattened option data and index', async () => {
    const wrapper = mount(Select, {
      props: {
        open: true,
        virtual: false,
        options: [
          { value: 'happy', label: 'Happy', desc: 'Good' },
          { value: 'sad', label: 'Sad', desc: 'Blue' },
        ],
        optionRender: (option, { index }) => (
          <span class="custom-opt">{`${index}:${option.data.label}-${option.data.desc}`}</span>
        ),
      },
      attachTo: document.body,
    });
    await nextTick();

    const customOpts = document.body.querySelectorAll('.custom-opt');
    expect(customOpts.length).toBe(2);
    expect(customOpts[0].textContent).toBe('0:Happy-Good');
    expect(customOpts[1].textContent).toBe('1:Sad-Blue');
    wrapper.unmount();
  });

  it('supports labelRender prop for matched and unmatched values', async () => {
    const labelRender = ({ label, value }) =>
      label ? (
        <span class="matched-label">{`VAL:${value}`}</span>
      ) : (
        <span class="no-match">No option match</span>
      );

    const wrapper = mount(Select, {
      props: {
        defaultValue: 'missing-1',
        labelRender,
        options: [
          { value: 'gold', label: 'Gold' },
          { value: 'cyan', label: 'Cyan' },
        ],
      },
    });
    await nextTick();
    expect(wrapper.find('.no-match').text()).toBe('No option match');

    await wrapper.setProps({ value: 'gold' });
    await nextTick();
    expect(wrapper.find('.matched-label').text()).toBe('VAL:gold');
    wrapper.unmount();
  });

  it('supports showSearch object with multi-field optionFilterProp and filterSort', async () => {
    const wrapper = mount(Select, {
      props: {
        open: true,
        virtual: false,
        showSearch: {
          optionFilterProp: ['label', 'otherField'],
          searchValue: 'b11',
          filterSort: (a, b) => String(a.label).localeCompare(String(b.label)),
        },
        options: [
          { value: 'a11', label: 'a11', otherField: 'c11' },
          { value: 'b22', label: 'b22', otherField: 'b11' },
          { value: 'c33', label: 'c33', otherField: 'b33' },
        ],
      },
      attachTo: document.body,
    });
    await nextTick();

    const items = document.body.querySelectorAll('.ant-select-item-option-content');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('b22');
    wrapper.unmount();
  });

  it('supports custom function tokenSeparators in tags mode', async () => {
    const onChange = jest.fn();
    const tokenize = input => {
      const tokens = [];
      const regex = /"([^"]*)"|([^,\n]+)/g;
      let match = regex.exec(input);
      while (match) {
        tokens.push((match[1] ?? match[2]).trim());
        match = regex.exec(input);
      }
      return tokens.filter(Boolean);
    };

    const wrapper = mount(Select, {
      props: {
        mode: 'tags',
        tokenSeparators: tokenize,
        onChange,
      },
      attachTo: document.body,
    });
    await nextTick();

    const input = wrapper.find('input');
    await input.setValue('"San Francisco, CA", New York');
    await nextTick();

    expect(onChange).toHaveBeenCalledWith(['San Francisco, CA', 'New York'], expect.any(Array));
    wrapper.unmount();
  });
});
