<docs>
---
order: 2
title:
  zh-CN: 位置
  en-US: Placement
---

## zh-CN

位置有十二个方向。如需箭头指向目标元素中心，可以设置 `arrow: { pointAtCenter: true }`。

## en-US

There are 12 `placement` options available. Use `arrow: { pointAtCenter: true }` if you want the arrow to point at the center of target.

</docs>

<template>
  <a-config-provider
    :button="{ style: { width: `${buttonWidth}px`, margin: '4px', padding: '0px' } }"
  >
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" :style="{ whiteSpace: 'nowrap' }">
        <a-popconfirm
          placement="topLeft"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>TL</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="top"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>Top</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="topRight"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>TR</a-button>
        </a-popconfirm>
      </a-flex>
      <a-flex
        :style="{ width: `${buttonWidth * 5 + 32}px`, maxWidth: '100%' }"
        justify="space-between"
        align="center"
      >
        <a-flex align="center" vertical>
          <a-popconfirm
            placement="leftTop"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>LT</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="left"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>Left</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="leftBottom"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>LB</a-button>
          </a-popconfirm>
        </a-flex>
        <a-flex align="center" vertical>
          <a-popconfirm
            placement="rightTop"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>RT</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="right"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>Right</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="rightBottom"
            :title="text"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
          >
            <a-button>RB</a-button>
          </a-popconfirm>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" :style="{ whiteSpace: 'nowrap' }">
        <a-popconfirm
          placement="bottomLeft"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>BL</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="bottom"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>Bottom</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="bottomRight"
          :title="text"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm"
        >
          <a-button>BR</a-button>
        </a-popconfirm>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { message } from '@hiltonkohler21/ant-design-vue';

const text = 'Are you sure to delete this task?';
const description = 'Delete the task';
const buttonWidth = 64;

const confirm = () => {
  message.info('Clicked on Yes.');
};
</script>
