<docs>
---
order: 16
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token，模仿 MUI 风格的 Button

## en-US

Component Token. Button with MUI style.
</docs>

<template>
  <a-flex gap="small" vertical>
    <div>Component Token</div>
    <a-config-provider :theme="sizeTheme">
      <a-flex gap="small" align="center" wrap="wrap">
        <a-button size="small">Small</a-button>
        <a-button>Default</a-button>
        <a-button size="large">Large</a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="dangerTheme">
      <a-flex gap="small" align="center" wrap="wrap">
        <a-button danger>Default</a-button>
        <a-button danger type="primary">Primary</a-button>
        <a-button danger type="dashed">Dashed</a-button>
        <a-button danger type="text">Text</a-button>
        <a-button danger type="link">Link</a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="dashedDisabledTheme">
      <a-button type="dashed" disabled>Dashed Disabled</a-button>
    </a-config-provider>
    <a-config-provider :theme="defaultTheme">
      <a-flex gap="small" align="start" wrap="wrap">
        <a-button>Default</a-button>
        <a-button type="dashed">Dashed</a-button>
        <a-button type="text">Text</a-button>
        <a-button disabled>Disabled</a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="ghostTheme">
      <a-flex gap="small" align="start" wrap="wrap">
        <a-button ghost>Default</a-button>
        <a-button ghost type="dashed">Dashed</a-button>
        <a-button ghost type="primary">Primary</a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="iconGapTheme">
      <a-button :icon="h(SearchOutlined)">icon gap 40</a-button>
    </a-config-provider>
    <a-config-provider :theme="linkHoverTheme">
      <a-flex gap="small" align="center" wrap="wrap">
        <a-button type="link" href="https://ant.design">Link</a-button>
        <a-button disabled type="link" href="https://ant.design">Link(disabled)</a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="onlyIconSizeTheme">
      <a-flex gap="small" align="center" wrap="wrap">
        <a-button size="small" :icon="h(SearchOutlined)" />
        <a-button :icon="h(SearchOutlined)" />
        <a-button size="large" :icon="h(SearchOutlined)" />
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="primaryTheme">
      <a-button type="primary">Primary</a-button>
    </a-config-provider>
    <a-config-provider :theme="solidTheme">
      <a-button variant="solid" color="default">Solid</a-button>
    </a-config-provider>
    <a-config-provider :theme="textTheme">
      <a-flex gap="small" align="start" wrap="wrap">
        <a-button type="text">Text</a-button>
        <a-button variant="text" color="default">Default Text</a-button>
        <a-button variant="text" color="primary">Primary Text</a-button>
        <a-button variant="text" color="danger">Danger Text</a-button>
      </a-flex>
    </a-config-provider>
    <div>Global Token</div>
    <a-config-provider :theme="muiTheme">
      <a-flex wrap="wrap" gap="small">
        <a-button type="text">TEXT</a-button>
        <a-button type="primary">CONTAINED</a-button>
        <a-button>OUTLINED</a-button>
      </a-flex>
      <a-flex wrap="wrap" gap="small">
        <a-button type="text" disabled>TEXT</a-button>
        <a-button type="primary" disabled>CONTAINED</a-button>
        <a-config-provider :theme="muiOutlinedDisabledTheme">
          <a-button disabled>OUTLINED</a-button>
        </a-config-provider>
      </a-flex>
      <a-flex wrap="wrap" gap="small">
        <a-button type="text" size="small">TEXT</a-button>
        <a-button type="primary" size="small">CONTAINED</a-button>
        <a-button size="small">OUTLINED</a-button>
      </a-flex>
    </a-config-provider>
    <a-flex gap="small" wrap="wrap">
      <a-config-provider :theme="redDisabledBorderTheme">
        <a-button disabled>Custom Red Disabled</a-button>
      </a-config-provider>
      <a-config-provider :theme="blueDisabledBorderTheme">
        <a-button disabled>Legacy Blue Disabled</a-button>
      </a-config-provider>
    </a-flex>
    <a-config-provider :theme="primaryRedTheme">
      <a-flex gap="small" wrap="wrap">
        <a-button type="text">Text</a-button>
        <a-button type="link">Link</a-button>
        <a-button color="primary" variant="text">Primary Text</a-button>
        <a-button color="primary" variant="link">Primary Link</a-button>
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

type Theme = ConfigProviderProps['theme'];

const sizeTheme: Theme = {
  components: {
    Button: {
      fontWeight: '900',
      contentFontSizeSM: 20,
      contentFontSize: 30,
      contentFontSizeLG: 40,
      paddingInlineSM: 20,
      paddingInline: 30,
      paddingInlineLG: 40,
    },
  },
};

const dangerTheme: Theme = {
  components: {
    Button: {
      dangerColor: 'green',
      dangerShadow: 'yellow',
    } as Record<string, any>,
  },
};

const dashedDisabledTheme: Theme = {
  components: {
    Button: {
      dashedBgDisabled: 'red',
    } as Record<string, any>,
  },
};

const defaultTheme: Theme = {
  components: {
    Button: {
      defaultColor: 'red',
      defaultBg: 'blue',
      defaultBorderColor: 'green',
      defaultShadow: 'yellow',
      defaultBgDisabled: 'pink',
      defaultHoverColor: 'brown',
      defaultHoverBg: 'orange',
      defaultHoverBorderColor: 'purple',
      defaultActiveColor: 'fuchsia',
      defaultActiveBg: 'aqua',
      defaultActiveBorderColor: 'lime',
    } as Record<string, any>,
  },
};

const ghostTheme: Theme = {
  components: {
    Button: {
      ghostBg: 'red',
      defaultGhostColor: 'yellow',
      defaultGhostBorderColor: 'green',
    } as Record<string, any>,
  },
};

const iconGapTheme: Theme = {
  components: {
    Button: {
      iconGap: 40,
    } as Record<string, any>,
  },
};

const linkHoverTheme: Theme = {
  components: {
    Button: {
      linkHoverBg: 'red',
    },
  },
};

const onlyIconSizeTheme: Theme = {
  components: {
    Button: {
      onlyIconSizeSM: 20,
      onlyIconSize: 30,
      onlyIconSizeLG: 40,
    },
  },
};

const primaryTheme: Theme = {
  components: {
    Button: {
      primaryColor: 'red',
      primaryShadow: 'yellow',
    },
  },
};

const solidTheme: Theme = {
  components: {
    Button: {
      solidTextColor: 'red',
    },
  },
};

const textTheme: Theme = {
  components: {
    Button: {
      textTextColor: 'red',
      textHoverBg: 'yellow',
      textTextHoverColor: 'blue',
      textTextActiveColor: 'green',
    } as Record<string, any>,
  },
};

const muiTheme: Theme = {
  components: {
    Button: {
      colorPrimary: '#1976d2',
      controlHeight: 36,
      primaryShadow:
        '0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)',
      fontWeight: 500,
      defaultBorderColor: 'rgba(25, 118, 210, 0.5)',
      colorText: '#1976d2',
      defaultColor: '#1976d2',
      borderRadius: 4,
      colorTextDisabled: 'rgba(0, 0, 0, 0.26)',
      colorBgContainerDisabled: 'rgba(0, 0, 0, 0.12)',
      contentFontSizeSM: 12,
    },
  },
};

const muiOutlinedDisabledTheme: Theme = {
  components: {
    Button: {
      borderColorDisabled: 'rgba(0, 0, 0, 0.12)',
      colorBgContainerDisabled: 'transparent',
    } as Record<string, any>,
  },
};

const redDisabledBorderTheme: Theme = {
  components: {
    Button: {
      borderColorDisabled: 'red',
    } as Record<string, any>,
  },
};

const blueDisabledBorderTheme: Theme = {
  components: {
    Button: {
      borderColorDisabled: 'blue',
    } as Record<string, any>,
  },
};

const primaryRedTheme: Theme = {
  token: {
    colorPrimary: '#FF0000',
  },
};
</script>
