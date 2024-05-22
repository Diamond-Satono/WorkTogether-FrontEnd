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
    <div class="scheduleType">
      <div
      :class="{ active: currentActive === 'allschedule' }"
      class="allschedule"
      @click="toggleActive('allschedule')"
      >
        <!-- <img src="@/assets/scheduletype/allschedule.png" alt=""> -->
        <svg t="1716102555573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="16" height="16"><path d="M358.253714 0h-247.222857A111.177143 111.177143 0 0 0 0 111.104v247.076571a111.177143 111.177143 0 0 0 111.104 111.177143h247.149714a111.177143 111.177143 0 0 0 111.030857-111.177143V111.177143A111.177143 111.177143 0 0 0 358.253714 0z m37.010286 358.180571a37.083429 37.083429 0 0 1-37.010286 37.010286h-247.222857a37.083429 37.083429 0 0 1-36.937143-37.010286V111.177143c0-20.48 16.603429-37.083429 37.010286-37.083429h247.149714c20.406857 0 37.010286 16.603429 37.010286 37.083429v247.076571z m-37.010286 196.534858h-247.222857A111.177143 111.177143 0 0 0 0 665.819429v247.076571A111.177143 111.177143 0 0 0 111.104 1024h247.149714a111.177143 111.177143 0 0 0 111.030857-111.104V665.819429a111.177143 111.177143 0 0 0-111.030857-111.177143z m37.010286 358.180571c0 20.48-16.603429 37.010286-37.010286 37.010286h-247.222857a37.083429 37.083429 0 0 1-36.937143-37.010286V665.819429c0-20.48 16.603429-37.083429 37.010286-37.083429h247.149714c20.406857 0 37.010286 16.603429 37.010286 37.083429v247.076571zM912.822857 0H665.746286a111.177143 111.177143 0 0 0-111.030857 111.104v247.076571a111.177143 111.177143 0 0 0 111.030857 111.177143h247.222857A111.177143 111.177143 0 0 0 1024 358.107429V111.177143A111.177143 111.177143 0 0 0 912.896 0z m37.083429 358.180571a37.083429 37.083429 0 0 1-37.083429 37.010286H665.746286a37.083429 37.083429 0 0 1-37.010286-37.010286V111.177143c0-20.48 16.603429-37.083429 37.010286-37.083429h247.222857c20.333714 0 37.010286 16.603429 37.010286 37.083429v247.076571z m-37.083429 196.534858H665.746286a111.177143 111.177143 0 0 0-111.030857 111.104v247.076571A111.177143 111.177143 0 0 0 665.746286 1024h247.222857A111.177143 111.177143 0 0 0 1024 912.896V665.819429a111.177143 111.177143 0 0 0-111.104-111.177143z m37.083429 358.180571c0 20.48-16.676571 37.010286-37.083429 37.010286H665.746286a37.083429 37.083429 0 0 1-37.010286-37.010286V665.819429c0-20.48 16.603429-37.083429 37.010286-37.083429h247.222857c20.333714 0 37.010286 16.603429 37.010286 37.083429v247.076571z" fill="#000000" p-id="1998"></path></svg>
        &nbsp;全部日程
      </div>
      <div
      :class="{ active: currentActive === 'myschedule' }"
      class="myschedule"
      @click="toggleActive('myschedule')"
      >
        <!-- <img src="@/assets/scheduletype/myschedule.png" alt=""> -->
        <svg t="1716096710952" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1102" width="16" height="16"><path d="M512 213.333333c-62.08 0-115.114667 52.736-115.114667 121.173334 0 68.437333 53.034667 121.173333 115.114667 121.173333 62.08 0 115.114667-52.736 115.114667-121.173333C627.114667 266.069333 574.08 213.333333 512 213.333333zM311.552 334.506667C311.552 221.994667 399.786667 128 512 128c112.213333 0 200.448 93.994667 200.448 206.506667S624.213333 541.013333 512 541.013333c-112.213333 0-200.448-93.994667-200.448-206.506666zM91.050667 832c68.352-118.4 213.248-190.805333 420.949333-190.805333 207.701333 0 352.597333 72.405333 420.949333 190.805333a42.666667 42.666667 0 0 1-73.898666 42.666667c-47.786667-82.816-157.525333-148.138667-347.050667-148.138667s-299.221333 65.28-347.050667 148.138667a42.666667 42.666667 0 1 1-73.898666-42.666667z" p-id="1103" fill="#101010"></path></svg>
        &nbsp;我的日程
      </div>
      <div
      :class="{ active: currentActive === 'meeting' }"
      class="meeting"
      @click="toggleActive('meeting')"
      >
        <!-- <img src="@/assets/scheduletype/meeting.png" alt=""> -->
        <svg t="1716099371329" class="icon" viewBox="0 0 1038 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8116" width="16" height="16"><path d="M970.89612 63.665319H615.643638a26.102781 26.102781 0 0 0-26.102781-25.466127h-5.729878V27.376087A27.376087 27.376087 0 0 0 556.434891 0H487.676346a28.012741 28.012741 0 0 0-28.01274 27.376087V38.199192h-5.093226a27.376087 27.376087 0 0 0-26.739434 25.466127H63.665319a63.665319 63.665319 0 0 0-63.665319 63.66532v523.965578a63.665319 63.665319 0 0 0 63.665319 63.66532h373.078772L190.995958 958.163057a27.376087 27.376087 0 1 0 38.835845 38.835844l242.564867-245.748132v222.191964a45.202377 45.202377 0 1 0 89.7681 0v-222.828618l250.204705 250.204706a27.376087 27.376087 0 0 0 38.835845-38.835845l-254.661277-254.661278h372.442118a63.665319 63.665319 0 0 0 63.665319-63.665319V122.874066a63.665319 63.665319 0 0 0-61.75536-59.208747zM63.665319 646.839645V127.330639h905.957495v520.782312z" fill="#231815" p-id="8117"></path><path d="M254.661277 178.262894a28.012741 28.012741 0 0 0-28.01274 28.012741V572.987874a28.012741 28.012741 0 0 0 55.388828 0V206.275635A28.012741 28.012741 0 0 0 254.661277 178.262894zM445.657236 318.326597a27.376087 27.376087 0 0 0-28.012741 27.376087V572.987874a28.012741 28.012741 0 0 0 55.388828 0V345.702684A27.376087 27.376087 0 0 0 445.657236 318.326597zM636.653194 254.661277a27.376087 27.376087 0 0 0-27.376088 27.376088V572.987874a28.012741 28.012741 0 0 0 55.388828 0V283.947324A27.376087 27.376087 0 0 0 636.653194 254.661277zM823.829233 389.631755a28.012741 28.012741 0 0 0-27.376088 28.01274V572.987874a28.012741 28.012741 0 0 0 55.388828 0V417.644495a28.012741 28.012741 0 0 0-28.01274-28.01274z" fill="#101010" p-id="8118"></path></svg>
        &nbsp;会议&nbsp;&nbsp;&nbsp;<img src="@/assets/scheduletype/meetingcolor.png">
      </div>
      <div
      :class="{ active: currentActive === 'interview' }"
      class="interview"
      @click="toggleActive('interview')"
      >
        <!-- <img src="@/assets/scheduletype/interview.png" alt=""> -->
        <svg t="1716096648811" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16285" width="16" height="16"><path d="M819.2 529.0496v-8.533333a34.133333 34.133333 0 0 0-68.266667 0v8.533333c0 131.754667-107.178667 238.933333-238.933333 238.933333s-238.933333-107.178667-238.933333-238.933333v-8.533333a34.133333 34.133333 0 0 0-68.266667 0v8.533333c0 157.832533 119.688533 288.136533 273.066667 305.186133V938.666667H307.2a34.133333 34.133333 0 0 0 0 68.266666h409.6a34.133333 34.133333 0 0 0 0-68.266666H546.133333v-104.430934c153.378133-17.0496 273.066667-147.336533 273.066667-305.186133z" fill="#040000" p-id="16286"></path><path d="M512 699.716267c98.816 0 179.2-80.384 179.2-179.2v-324.266667c0-98.816-80.384-179.2-179.2-179.2s-179.2 80.384-179.2 179.2v324.266667c0 98.816 80.384 179.2 179.2 179.2z" fill="#101010" p-id="16287"></path></svg>
        &nbsp;面试&nbsp;&nbsp;&nbsp;<img src="@/assets/scheduletype/interviewcolor.png">
      </div>
      <div
      :class="{ active: currentActive === 'business' }"
      class="business"
      @click="toggleActive('business')"
      >
        <!-- <img src="@/assets/scheduletype/business.png" alt=""> -->
        <svg t="1716102152733" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6560" width="16" height="16"><path d="M310.26 371.51c-7.18 0-14.3-3.07-19.25-9.03-25.29-30.45-35.96-57.94-32.61-84.05 4.77-37.21 35.94-59.6 63.44-79.36 40.87-29.35 49.47-39.98 36.89-64.29-6.35-12.26-1.55-27.35 10.71-33.69 12.26-6.35 27.35-1.55 33.69 10.71 15.15 29.27 14.65 56.67-1.51 81.44-12.39 19-31.82 32.96-50.61 46.45-21.09 15.15-41.01 29.46-43.02 45.1-1.82 14.25 10.67 32.75 21.48 45.76 8.82 10.62 7.36 26.38-3.26 35.21a24.951 24.951 0 0 1-15.95 5.75z m182.95-5.77c10.62-8.82 12.08-24.58 3.26-35.21-10.81-13.01-23.31-31.51-21.48-45.76 2-15.64 21.93-29.95 43.02-45.1 18.79-13.5 38.22-27.45 50.61-46.45 16.15-24.76 16.66-52.16 1.51-81.44-6.35-12.26-21.43-17.06-33.7-10.71-12.26 6.35-17.06 21.43-10.71 33.69 12.58 24.31 3.98 34.94-36.89 64.29-27.5 19.76-58.68 42.15-63.44 79.36-3.34 26.11 7.32 53.61 32.61 84.05 4.94 5.95 12.07 9.03 19.25 9.03 5.63 0.02 11.3-1.87 15.96-5.75z m167 0c10.62-8.82 12.08-24.58 3.26-35.21-10.81-13.01-23.31-31.51-21.48-45.76 2-15.64 21.92-29.95 43.02-45.1 18.79-13.5 38.22-27.45 50.61-46.45 16.15-24.76 16.66-52.16 1.51-81.44-6.35-12.26-21.43-17.06-33.69-10.71-12.26 6.35-17.06 21.43-10.71 33.69 12.58 24.31 3.98 34.94-36.89 64.29-27.5 19.76-58.68 42.15-63.44 79.36-3.34 26.11 7.32 53.61 32.61 84.05 4.94 5.95 12.07 9.03 19.25 9.03a24.75 24.75 0 0 0 15.95-5.75z m42.72 510.9h106.43c13.81 0 25 11.19 25 25s-11.19 25-25 25H215.72c-13.81 0-25-11.19-25-25s11.19-25 25-25h86.7c-73.41-46.22-121.46-280.52-140.78-393.89-5.49-32.23 19.36-61.63 52.05-61.63h577.99c4.24 0 23.79 0.48 29.68 0.48 87.67 0 158.99 71.32 158.99 158.99 0 87.67-71.32 158.99-158.99 158.99-12.85 0-25.35-1.54-37.33-4.44-22.07 65.78-49.19 121.41-81.1 141.5z m95.84-189.43c7.29 1.54 14.84 2.36 22.58 2.36 60.1 0 108.99-48.89 108.99-108.99 0-52.16-36.84-95.88-85.86-106.51a54.72 54.72 0 0 1-0.75 8.68c-8.95 52.46-24.05 130.82-44.96 204.46z m-443.56 44.81c-0.27-0.56-26.87-56.33-34.06-95.47l-20.74-112.87c-2-10.86-12.42-18.06-23.29-16.06-10.86 2-18.05 12.42-16.06 23.28l20.74 112.87c8.16 44.43 36.15 103.06 37.33 105.54 3.44 7.17 10.59 11.35 18.04 11.35 2.9 0 5.85-0.63 8.64-1.97 9.98-4.77 14.18-16.71 9.4-26.67z" p-id="6561" fill="#101010"></path></svg>
        &nbsp;出差&nbsp;&nbsp;&nbsp;<img src="@/assets/scheduletype/businesscolor.png">
      </div>
      <div
      :class="{ active: currentActive === 'train' }"
      class="train"
      @click="toggleActive('train')"
      >
        <!-- <img src="@/assets/scheduletype/train.png" alt=""> -->
        <svg t="1716102541005" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5120" width="16" height="16"><path d="M897.3312 473.7536H245.8112c-79.2576 0-143.7184-64.4608-143.7184-143.7184S166.5536 186.368 245.8112 186.368h651.52a20.4288 20.4288 0 0 1 19.8144 15.36c2.3552 9.0624-1.7408 18.5344-9.8816 23.04-38.8096 21.5552-62.0032 60.8768-62.0032 105.3184s23.1936 83.7632 62.0032 105.3184c8.1408 4.5056 12.2368 13.9776 9.8816 23.04a20.44416 20.44416 0 0 1-19.8144 15.3088zM245.8112 227.328c-56.6272 0-102.7584 46.08-102.7584 102.7584s46.08 102.7584 102.7584 102.7584h595.0464c-23.4496-28.2624-36.5568-64.0512-36.5568-102.7584s13.1072-74.496 36.5568-102.7584H245.8112zM774.144 843.0592H122.5728a20.4288 20.4288 0 0 1-19.8144-15.36c-2.3552-9.0624 1.7408-18.5344 9.8816-23.04 38.8096-21.5552 62.0032-60.928 62.0032-105.3184S151.4496 615.5776 112.64 594.0224a20.4544 20.4544 0 0 1-9.8816-23.04c2.3552-9.0112 10.496-15.36 19.8144-15.36H774.144c79.2576 0 143.7184 64.4608 143.7184 143.7184s-64.512 143.7184-143.7184 143.7184z m-595.0976-40.96H774.144c56.6272 0 102.7584-46.08 102.7584-102.7584s-46.08-102.7584-102.7584-102.7584H179.0464c23.4496 28.2624 36.5568 64.0512 36.5568 102.7584 0 38.656-13.1072 74.496-36.5568 102.7584z" fill="#101010" p-id="5121"></path></svg>
        &nbsp;培训&nbsp;&nbsp;&nbsp;<img src="@/assets/scheduletype/traincolor.png">
      </div>
      <div
      :class="{ active: currentActive === 'other' }"
      class="other"
      @click="toggleActive('other')"
      >
        <!-- <img src="@/assets/scheduletype/other.png" alt=""> -->
        <svg t="1716097863739" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8462" width="16" height="16"><path d="M566.7 950.1H223.6c-43.1 0-78.1-35-78.1-78.1V171c0-43.1 35-78.1 78.1-78.1h595.1c43.1 0 78.1 35 78.1 78.1v469.8c0 16.7-7 32.7-19.3 44L607.3 934.2c-11.1 10.2-25.5 15.9-40.6 15.9zM223.6 156.2c-8 0-14.8 6.8-14.8 14.8v701c0 8 6.8 14.8 14.8 14.8h341.7l269.2-248.5-1.1-467.3c0-8-6.8-14.8-14.8-14.8h-595z" fill="#101010" p-id="8463"></path><path d="M581.1 950.1c-17.5 0-31.7-14.2-31.7-31.7V748.6c0-82.4 59.9-149.4 133.5-149.4h167.6c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7H682.9c-38 0-70.1 39.4-70.1 86v169.8c0 17.5-14.2 31.7-31.7 31.7zM656.9 318.2H385.4c-17.5 0-31.7-14.2-31.7-31.7s14.2-31.7 31.7-31.7h271.5c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7zM656.9 501.5H385.4c-17.5 0-31.7-14.2-31.7-31.7s14.2-31.7 31.7-31.7h271.5c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7zM499.7 684.8h-95.3c-17.5 0-31.7-14.2-31.7-31.7s14.2-31.7 31.7-31.7h95.3c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7z" fill="#101010" p-id="8464"></path></svg>
        &nbsp;其他&nbsp;&nbsp;&nbsp;<img src="@/assets/scheduletype/othercolor.png">
      </div>
    </div>
    <div class="line"></div>
    <div class="groupmember">
      <div class="left">
        <img src="@/assets/scheduletype/member.png" alt="">
        &nbsp;成员
      </div>
      <span class="detail" @click="toggleDetail($event)">
        <svg t="1716132754522" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2594" width="16" height="16"><path d="M511.999488 634.683157 132.797004 255.480672l-66.916039 66.916039 446.1175 446.122617 446.1175-446.122617-66.916039-66.916039L511.999488 634.683157zM511.999488 634.683157" fill="#272636" p-id="2595"></path></svg>
      </span>
    </div>
    <div class="line"></div>
    <div v-if="showDetail" class="member-list"
      :style="{
        top: popupPosition.top + 'px',
        left: popupPosition.left + 'px',
        height: memberListHeight + 'px',
      }"
    >
      <!-- <ul type="none">
        <li v-for="(item, index) in members" :key="index">
          <span>{{ item.name }}</span>
        </li>
      </ul> -->
      <button class="memberName" v-for="(item, index) in members" :key="index">{{ item.name }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import calendar from './thumbnail/CalendarThumbnail.vue';
import {Authorization} from "@/store/token";
import { UserInfo } from "@/store/userinfo"
const tokens = Authorization();
const userInfo =UserInfo();
// 定义 emits 选项
const emit = defineEmits(['update:selectedDate', 'update:currentActive', 'update:currentTypeColor']);

// 获取当前日期，并格式化为 YYYY-MM 的形式
const now = new Date();
const startYearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

// 获取当前日期，并格式化为 YYYY/MM/DD 的形式
const checkedDate = ref(`${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`);
const markDates = ['2024/5/1', '2024/5/11', '2024/6/1', '2024/5/25'] as string[];
//选中日期
const selectedDate = ref(`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`);
emit('update:selectedDate', selectedDate);
// 选中日期的事件处理函数
const handleClickDate = (date: string) => {
  console.log('Selected date:', date);
  selectedDate.value = date;
  // 触发事件，将 selectedDate 发送到父组件
  emit('update:selectedDate', date);
};
// 切换月份的事件处理函数
const handleChangeMonth = (date: string) => {
  console.log('Changed month to:', date);
};
const currentActive = ref('allschedule'); // 初始化为allschedule，初始默认选中全部日程
const currentTypeColor = ref<string>('');// 选中类型的颜色
function toggleActive(type :any) {
  // 当点击当前已选中的div时，取消选中
  if (currentActive.value === type) {
    // currentActive.value = null;
  } else {
    // 否则，设置当前点击的div为选中状态
    currentActive.value = type;
  }
  //更改选中类型的颜色
  if (currentActive.value === 'meeting') {
    currentTypeColor.value = '#F7DAE6';
  } else if (currentActive.value === 'interview') {
    currentTypeColor.value = '#0084FF';
  } else if (currentActive.value === 'business') {
    currentTypeColor.value = '#00C853';
  } else if (currentActive.value === 'train') {
    currentTypeColor.value = '#FF9800';
  } else if (currentActive.value === 'other') {
    currentTypeColor.value = '#666666';
  } else {
    currentTypeColor.value = '';
  }
  // 触发事件，将 currentActive 和 currentTypeColor 发送到父组件
  emit('update:currentActive', currentActive.value);
  emit('update:currentTypeColor', currentTypeColor.value);
}
//是否显示成员列表
const showDetail = ref(false);
const popupPosition = ref({ top: 0, left: 0 });
// 定义一个响应式变量来控制member-list的高度
const memberListHeight = ref(42); // 初始化高度为126px
//点击成员详情事件
function toggleDetail(event: MouseEvent) {
  console.log('Toggle detail');
  console.log(members.value.length);
  showDetail.value = !showDetail.value;
  const rect = (event.target as HTMLElement).getBoundingClientRect(); // 获取元素的位置信息
  popupPosition.value = {
    top: rect.bottom - 40*members.value.length, // 设置弹窗的垂直位置
    left: rect.right + 30, // 设置弹窗的水平位置
  };
  memberListHeight.value = memberListHeight.value * members.value.length
}
//成员列表
const members = ref([
  { name: '张三', avatar: 'https://example.com/avatar1.jpg' },
  { name: '李四', avatar: 'https://example.com/avatar2.jpg' },
  { name: '王五', avatar: 'https://example.com/avatar3.jpg' },
  { name: '王五', avatar: 'https://example.com/avatar3.jpg' },
]);
//拉取团队成员列表
const companyId = userInfo.value.companyId; // 根据实际情况替换
const companyIdString = companyId.toString();
const groupId = ref(userInfo.value.groupId);
//拉取成员列表
function fetchUserData() {
  fetch(`http://localhost:8080/api/group/member/${groupId.value}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
      }
    })
    .then(response => {
        console.log(response);
        // 检查响应状态
        if (!response.ok) {
            alert("拉取失败")
            throw new Error('Network error');
        }
        // 解析响应为 JSON 格式
        return response.json();
    })
    .then(data => {
        // 请求成功，更新用户数据
        members.value = data.data;
        console.log(tokens.value);
        
        console.log("members.value=", members.value);
                            
    })
    .catch(error => {
        console.error('Error fetching members data:', error);
        // Handle the error, e.g., show a message to the user
    });
}
onMounted(() => {
  //获取成员列表
  fetchUserData();
});
</script>
  
<style scoped>
.model {
  background-color: white;
  width:100%;
  height: 100%;
  /* border: 1px solid black; */
}
.thumbnail {
  margin: -5% 5%;
  transform: scale(0.9); /* 缩小到原来的50% */
  height: 375px;
}
.scheduleType {
  margin: 2% 7%;
}
.allschedule,
.myschedule,
.meeting,
.interview,
.business,
.train,
.other {
  display: flex;
  align-items: center;
  padding: 0% 5%;
  height: 48px;
  font-size: 18px;
  font-family: "SiYuanHeiTi";
  cursor: pointer; /* 添加鼠标悬停时的手势 */
}
/* 添加一个类用于表示选中状态 */
.active {
  background-color: rgba(255, 98, 0, 0.09);
  color: #FF6200;
}
/* 选中状态时，改变SVG的fill颜色 */
.active .icon path {
  fill: #FF6200;
}
.line {
  margin: 5% 7%;
  border-bottom: 1px solid #BBBBBB;
}
.groupmember {
  margin: 2% 7%;
  padding: 0% 4%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left {
  display: flex;
  align-items: center;
}
.groupmember detail {
  margin-right: 10%;
}
.member-list {
  width: 170px;
  height: 126px;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
}
.memberName {
  margin-left: 8%;
  margin-top: auto;
  margin-bottom: auto;
  width: max-content;
  background-color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10%;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
  text-align: center;
  font-family: "SiYuanHeiTi";
}
</style>