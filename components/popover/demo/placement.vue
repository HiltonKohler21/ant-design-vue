<docs>
---
order: 2
title:
  zh-CN: 位置
  en-US: Placement
---

## zh-CN

位置有十二个方向。

## en-US

There are 12 `placement` options available.

</docs>
<template>
  <a-config-provider
    :button="{ style: { width: `${buttonWidth}px`, margin: '4px', padding: '0px' } }"
  >
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" :style="{ whiteSpace: 'nowrap' }">
        <a-popover placement="topLeft">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>TL</a-button>
        </a-popover>
        <a-popover placement="top">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>Top</a-button>
        </a-popover>
        <a-popover placement="topRight">
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
          <a-popover placement="leftTop">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>LT</a-button>
          </a-popover>
          <a-popover placement="left">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>Left</a-button>
          </a-popover>
          <a-popover placement="leftBottom">
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
          <a-popover placement="rightTop">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>RT</a-button>
          </a-popover>
          <a-popover placement="right">
            <template #title><span>Title</span></template>
            <template #content>
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            </template>
            <a-button>Right</a-button>
          </a-popover>
          <a-popover placement="rightBottom">
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
        <a-popover placement="bottomLeft">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>BL</a-button>
        </a-popover>
        <a-popover placement="bottom">
          <template #title><span>Title</span></template>
          <template #content>
            <div>
              <p>Content</p>
              <p>Content</p>
            </div>
          </template>
          <a-button>Bottom</a-button>
        </a-popover>
        <a-popover placement="bottomRight">
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
const buttonWidth = 64;
</script>
