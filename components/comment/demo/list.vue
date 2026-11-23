<docs>
---
order: 1
title:
  zh-CN: 配合 List 组件
  en-US: Usage with list
---

## zh-CN

配合 List 组件展现评论列表。

## en-US

Displaying a series of comments using the `antd` List Component.

</docs>

<template>
  <a-list
    class="comment-list"
    :header="`${data.length} replies`"
    item-layout="horizontal"
    :data-source="data"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-comment :author="item.author" :avatar="item.avatar">
          <template #actions>
            <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
          </template>
          <template #content>
            <p>
              {{ item.content }}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.datetime.fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const avatar1 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';
const avatar2 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23f9f0ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%23722ed1%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%23722ed1%22%2F%3E%3C%2Fsvg%3E';

const data = [
  {
    actions: ['Reply to'],
    author: 'Han Solo',
    avatar: avatar1,
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(1, 'days'),
  },
  {
    actions: ['Reply to'],
    author: 'Han Solo',
    avatar: avatar2,
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(2, 'days'),
  },
];
</script>
