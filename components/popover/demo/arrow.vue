<docs>
---
order: 3
title:
  zh-CN: 箭头展示
  en-US: Arrow
---

## zh-CN

通过 `arrow` 属性隐藏箭头或控制箭头指向目标中心。

## en-US

Hide arrow or point arrow at center by `arrow`.
</docs>

<template>
  <a-config-provider
    :button="{ style: { width: `${buttonWidth}px`, margin: '4px', padding: '0px' } }"
  >
    <a-segmented
      v-model:value="arrow"
      :options="['Show', 'Hide', 'Center']"
      :style="{ marginBottom: '24px' }"
    />
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" :style="{ whiteSpace: 'nowrap' }">
        <a-popover placement="topLeft" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>TL</a-button>
        </a-popover>
        <a-popover placement="top" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>Top</a-button>
        </a-popover>
        <a-popover placement="topRight" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>TR</a-button>
        </a-popover>
      </a-flex>
      <a-flex
        :style="{ width: `${buttonWidth * 5 + 32}px`, maxWidth: '100%' }"
        justify="space-between"
        align="center"
      >
        <a-flex align="center" vertical>
          <a-popover placement="leftTop" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>LT</a-button>
          </a-popover>
          <a-popover placement="left" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>Left</a-button>
          </a-popover>
          <a-popover placement="leftBottom" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>LB</a-button>
          </a-popover>
        </a-flex>
        <a-flex align="center" vertical>
          <a-popover placement="rightTop" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>RT</a-button>
          </a-popover>
          <a-popover placement="right" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>Right</a-button>
          </a-popover>
          <a-popover placement="rightBottom" :arrow="mergedArrow">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>RB</a-button>
          </a-popover>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" :style="{ whiteSpace: 'nowrap' }">
        <a-popover placement="bottomLeft" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>BL</a-button>
        </a-popover>
        <a-popover placement="bottom" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>Bottom</a-button>
        </a-popover>
        <a-popover placement="bottomRight" :arrow="mergedArrow">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>BR</a-button>
        </a-popover>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { PopoverProps } from 'ant-design-vue';

const buttonWidth = 64;
const arrow = ref<'Show' | 'Hide' | 'Center'>('Show');

const mergedArrow = computed<PopoverProps['arrow']>(() => {
  if (arrow.value === 'Hide') {
    return false;
  }
  if (arrow.value === 'Show') {
    return true;
  }
  return { pointAtCenter: true };
});
</script>
