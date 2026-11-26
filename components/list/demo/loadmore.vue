<docs>
---
order: 2
title:
  zh-CN: 加载更多
  en-US: Load more
---

## zh-CN

可通过 `loadMore` 属性实现加载更多功能。

## en-US

Load more list with `loadMore` slot.

</docs>

<template>
  <a-list
    class="demo-loadmore-list"
    :loading="initLoading"
    item-layout="horizontal"
    :data-source="list"
  >
    <template #loadMore>
      <div
        v-if="!initLoading && !loading"
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
      >
        <a-button @click="onLoadMore">loading more</a-button>
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a key="list-loadmore-edit">edit</a>
          <a key="list-loadmore-more">more</a>
        </template>
        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
          <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #title>
              <a href="https://hiltonkohler21.github.io/ant-design-vue/">{{ item.name?.last }}</a>
            </template>
            <template #avatar>
              <a-avatar :src="item.picture?.large" />
            </template>
          </a-list-item-meta>
          <div>content</div>
        </a-skeleton>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';

interface DataItem {
  loading?: boolean;
  name: { last?: string };
  picture: { large?: string };
}

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const fallbackAvatar =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const createMockData = (startIndex: number): DataItem[] =>
  Array.from({ length: count }, (_, idx) => ({
    name: { last: `Ant Design User ${startIndex + idx + 1}` },
    picture: { large: fallbackAvatar },
  }));

const fetchUsers = (startIndex: number): Promise<DataItem[]> =>
  fetch(fakeDataUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then(res => (Array.isArray(res?.results) ? res.results : createMockData(startIndex)))
    .catch(() => createMockData(startIndex));

const initLoading = ref(true);
const loading = ref(false);
const data = ref<DataItem[]>([]);
const list = ref<DataItem[]>([]);
onMounted(() => {
  fetchUsers(0).then(results => {
    initLoading.value = false;
    data.value = results;
    list.value = results;
  });
});

const onLoadMore = () => {
  loading.value = true;
  const startIndex = data.value.length;
  list.value = data.value.concat(
    [...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })),
  );
  fetchUsers(startIndex).then(results => {
    const newData = data.value.concat(results);
    loading.value = false;
    data.value = newData;
    list.value = newData;
    nextTick(() => {
      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      window.dispatchEvent(new Event('resize'));
    });
  });
};
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
