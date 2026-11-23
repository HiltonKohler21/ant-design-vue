import { defineComponent } from 'vue';
import { Splitter } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const paneStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
};

const Demo = defineComponent({
  setup() {
    return () => (
      <Splitter
        style={{
          height: '120px',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Splitter.Panel defaultSize="45%" min="25%" max="75%">
          <div style={paneStyle}>First Panel</div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={paneStyle}>Second Panel</div>
        </Splitter.Panel>
      </Splitter>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFill', 'colorPrimary', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
