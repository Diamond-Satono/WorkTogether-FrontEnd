<template>
  <div class="model">
    <div class="thumbnail">
      <calendar
        showPrepNext
        :startYearMonth="startYearMonth"
        :markDate="markDates"
        :checkedDate="checkedDate"
        @clickDate="handleClickDate"
        @changeMonth="handleChangeMonth"
      />
    </div>
    <div>我是左,直接删除我就好</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import calendar from './thumbnail/CalendarThumbnail.vue';

// 获取当前日期，并格式化为 YYYY-MM 的形式
const now = new Date();
const startYearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

// 获取当前日期，并格式化为 YYYY/MM/DD 的形式
const checkedDate = ref(`${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`);

const markDates = ['2024/5/1', '2024/5/11', '2024/6/1', '2024/5/25'] as string[];
// 选中日期的事件处理函数
const handleClickDate = (date: string) => {
  console.log('Selected date:', date);
};
// 切换月份的事件处理函数
const handleChangeMonth = (date: string) => {
  console.log('Changed month to:', date);
};
</script>
  
<style scoped>
.model {
  /* 该样式直接删除就好 */
  background-color: white;
  width:100%;
  height: 100%;
  border: 1px solid black;
}
.thumbnail {
  margin: 2% 5%;
}
  
</style>