import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ConfigProvider from '../../config-provider';
import Slider from '../../slider';
import Tooltip from '../../tooltip';

const css = () =>
  Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n');

const dump = (label, Comp, props = {}) => {
  document.head.innerHTML = '';
  mount(ConfigProvider, {
    props: { theme: { cssVar: true } },
    slots: { default: () => <Comp {...props} /> },
    attachTo: 'body',
  });
  return nextTick().then(() => {
    const all = css();
    const rules = all.match(/([^{}]+)\{([^{}]*NaN[^{}]*)\}/g) || [];
    console.log(`\n[${label}] NaN 规则 ${rules.length}`);
    rules.slice(0, 12).forEach(r => console.log('RULE|' + r.replace(/\s+/g, ' ').slice(0, 420)));
    const vars = all.match(/--ant-slider-[a-z-]+:[^;}]+/g) || [];
    console.log('VARS|' + vars.slice(0, 20).join(' | '));
  });
};

describe('dbg-nan', () => {
  jest.setTimeout(120000);
  it('slider', async () => {
    await dump('slider', Slider, { defaultValue: 30 });
  });
  it('tooltip', async () => {
    await dump('tooltip', Tooltip, { title: 'x', open: true });
  });
});
