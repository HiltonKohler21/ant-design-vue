<template>
  <div v-if="false" id="right-bottom" />
</template>

<script>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
const isEffective = (start, end) => {
  return dayjs().isBetween(start, end);
};
export default {
  props: ['isCN', 'isMobile'],
  data() {
    return {
      isEffective,
      visible: true,
      v: dayjs().date(),
      ads: [],
    };
  },
};
</script>

<style lang="less" scoped>
#right-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 150px;
  .close {
    position: absolute;
    text-align: center;
    top: -8px;
    right: -8px;
    font-size: 16px;
    padding: 15px;
    color: #6e3041;
  }
}
</style>
