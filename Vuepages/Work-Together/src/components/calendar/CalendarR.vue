<template>
  <div class="title">
    <img src="@/assets/calendarimgs/mycalendar.png" class="calendarimg">
    <span class="calendartitle">{{ CalendarTitle }}</span>
    <button class="createbutton" @click="showCreateSchedule">新建日程</button>
    <div class="cutoff"></div>
  </div>
  <div class='app-main'>
    <FullCalendar class='app-calendar' :options='calendarOptions' ref="calendarRef">
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
  <!-- 动态加载组件 -->
  <Transition :name="transitionName" mode="out-in">
    <component :is="currentModal" v-if="currentModal" @close-modal="closeModal" @refresh-calendar="refreshCalendar"
      :scheduleId="scheduleId">
    </component>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import { type CalendarOptions, type EventApi, type DateSelectArg, type EventClickArg } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/zh-cn'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { UserInfo } from '@/store/userinfo'
import { Authorization } from '@/store/token'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css';
//从父组件获取数据
const props = defineProps({
  selectedDate: String,//导航日历中已选择日期
  currentActive: String,//当前日历类别
  currentTypeColor: String//当前日历类别颜色
});
//传递给子组件
const scheduleId = ref('')
watch(() => props.selectedDate, (newDate, oldDate) => {
  console.log('selectedDate updated:', newDate);

  // 确保 newDate 不为空
  if (newDate) {
    try {
      // 将月份部分变成两位数
      const dateParts = newDate.split('-');
      if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = dateParts[1].padStart(2, '0'); // 确保月份是两位数
        const day = dateParts[2].padStart(2, '0'); // 确保日期是两位数
        const formattedDate = `${year}-${month}-${day}`;

        // 获取 FullCalendar 的 API
        if (calendarRef.value) {
          let calendarApi = calendarRef.value.getApi();

          // 切换到日视图
          calendarApi.changeView('listDay');

          // 跳转到指定日期
          calendarApi.gotoDate(formattedDate);

          console.log('Date changed to:', formattedDate);
        } else {
          console.error('Calendar reference is null');
        }
      } else {
        throw new Error('Invalid date format. Expected format is YYYY-MM-DD.');
      }
    } catch (error) {
      console.error('Error updating calendar view:', error);
    }
  } else {
    console.warn('New date is empty or invalid:', newDate);
  }
});


watch(() => props.currentActive, (newActive, oldActive) => {
  console.log('currentActive updated:', newActive);
});

watch(() => props.currentTypeColor, (newColor, oldColor) => {
  console.log('currentTypeColor updated:', newColor);
});
//日历标题
const CalendarTitle = ref('全部日程');
//观察修改标签事件
watch(() => props.currentActive, (newActive) => {
  switch (newActive) {
    case 'allschedule':
      CalendarTitle.value = '全部日程';
      type.value = -2;
      break;
    case 'myschedule':
      CalendarTitle.value = '我的日程';
      type.value = -1;
      break;
    case 'meeting':
      CalendarTitle.value = '会议';
      type.value = 0;
      break;
    case 'interview':
      CalendarTitle.value = '面试';
      type.value = 1;
      break;
    case 'business':
      CalendarTitle.value = '出差';
      type.value = 2;
      break;
    case 'train':
      CalendarTitle.value = '培训';
      type.value = 3;
      break;
    case 'other':
      CalendarTitle.value = '其他';
      type.value = 4;
      break;
    default:
      CalendarTitle.value = '全部日程';
      type.value = -1;
      break;
  }
});

//定义标签类型
const type = ref(-2);
//根据类型调用不同的接口
watch(() => type.value, async (newType) => {
  // 获取 FullCalendar 的 API
  let calendarApi = calendarRef.value.getApi();

  // 清空所有 events
  let events = calendarApi.getEvents();
  events.forEach((event: EventApi) => event.remove());


  // 根据 type.value 的值调用不同的函数
  if (newType === -2) {
    await fetchEvents();
  } else if (newType === -1) {
    await fetchMyEvents();
  } else if (newType > -1) {
    await fetchOtherEvents();
  }
});

//公司id和团队id
const userInfo = UserInfo()
const token = Authorization();
const currentEvents = ref<EventApi[]>([])
const calendarRef: any = ref(null)
const calendarOptions = ref<CalendarOptions>({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    // interactionPlugin, // needed for dateClick
    listPlugin
  ],
  headerToolbar: {
    left: 'dayGridMonth,timeGridWeek,listDay',
    center: 'prev,title,next',
    right: ''
  },
  buttonIcons: {
    // prev: 'circle-triangle-w', next: 'circle-triangle-e'
  },
  initialView: 'dayGridMonth',
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  views: {
    listDay: {
      type: 'list',
      duration: { days: 1 },
      buttonText: '日',
      listDayFormat: {
        weekday: 'long', // 显示完整的星期几
        day: 'numeric', // 显示日期
        month: 'long', // 显示完整的月份名称
        year: 'numeric' // 显示年份
      }, // Custom date format
      noEventsText: '没有日程安排', // 没有日程安排显示
      eventTimeFormat: {
        hour: '2-digit', // 显示两位数的小时
        minute: '2-digit', // 显示两位数的分钟
        meridiem: false // 不显示上午/下午
      }, // Custom event time format
    },
    timeGridWeek: {
      allDaySlot: false, // 隐藏全天事件槽
      nowIndicator: true, // 显示当前时间指示器
      scrollTime: '00:00:00', // 初始滚动时间
      slotEventOverlap: false, // 允许事件重叠
      eventOverlap: false, // 允许事件重叠
      // eventLimit: true, // 限制同一时间段显示的最大事件数
      // eventLimitText: '更多', // 超出事件数量限制时显示的文本
    },
    dayGridMonth: {
      slotEventOverlap: true, // 允许事件重叠
      eventMouseEnter: handleEventMouseEnter,//鼠标移入
      eventMouseLeave: handleEventMouseLeave//鼠标移出
    }
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: esLocale,
  displayEventEnd: false,//显示结束时间
  displayEventTime: true,
  eventDisplay: 'block',
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,

  /* you can update a remote database when these fire:
  eventAdd:
  eventChange:
  eventRemove:
  */
})

function handleWeekendsToggle() {
  calendarOptions.value.weekends = !calendarOptions.value.weekends // update a property
}

function handleDateSelect(selectInfo: DateSelectArg) {
  let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}
//处理events点击事件
function handleEventClick(clickInfo: EventClickArg) {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    clickInfo.event.remove()
  }
}

function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}

let currentTippyInstance: any = null;

function handleEventMouseEnter(info: any) {
  // 关闭其他悬浮框
  if (currentTippyInstance) {
    currentTippyInstance.destroy();
  }

  console.log(info.event);

  const startTime = info.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const startDate = info.event.start.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '月') + '日';
  const endTime = info.event.end ? info.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const endDate = info.event.end ? info.event.end.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '月') + '日' : '';

  const scheduleId = info.event.id;
  console.log(scheduleId);

  const content = `
    <div class="custom-tooltip">
      <div class="event-header">
        <div class="color-bar" style="background-color: ${info.event.backgroundColor};"></div>
        <div class="event-title">${info.event.title}</div>
      </div>
      <div class="event-time">
        <span class="start-time">${startTime}</span> <span class="start-date">${startDate}</span> <span class="end-time">${endTime}</span> <span class="end-date">${endDate}</span>
      </div>
      <div class="event-button">
        <button class="btn-detail" id="btn-detail-${scheduleId}">查看详情</button>
        <button class="btn-edit" id="btn-edit-${scheduleId}">编辑</button>
      </div>
    </div>
  `;

  currentTippyInstance = tippy(info.el, {
    content: content,
    allowHTML: true,
    placement: 'bottom',
    arrow: false,
    interactive: true,
    appendTo: document.body,
    theme: 'custom',
    offset: [0, 0], // 设置偏移量为 0
    onShown(instance) {
      // 绑定查看详情按钮点击事件处理程序
      const detailButton = document.getElementById(`btn-detail-${scheduleId}`);
      if (detailButton) {
        detailButton.addEventListener('click', () => showcalendardetails(info));
      }

      // 绑定编辑按钮点击事件处理程序
      const editButton = document.getElementById(`btn-edit-${scheduleId}`);
      if (editButton) {
        editButton.addEventListener('click', () => showReviseSchedule(info));
      }
    },
    onHidden(instance) {
      // 清除查看详情按钮点击事件处理程序
      const detailButton = document.getElementById(`btn-detail-${scheduleId}`);
      if (detailButton) {
        detailButton.removeEventListener('click', () => showcalendardetails(info));
      }

      // 清除编辑按钮点击事件处理程序
      const editButton = document.getElementById(`btn-edit-${scheduleId}`);
      if (editButton) {
        editButton.removeEventListener('click', () => showReviseSchedule(info));
      }
    }
  });
}

function handleEventMouseLeave(info: any) {
  // Tippy.js 会自动处理鼠标离开事件，所以这里通常不需要额外处理
}


// 钩子函数
onMounted(async () => {
  await fetchEvents();
})

//获取团队全部日程
async function fetchEvents() {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/group/all?groupId=${userInfo.value.groupId}`, {//把1换成${userInfo.value.groupId}
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.value,
        "companyId": userInfo.value.companyId,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // 检查 data 结构并提取 events 数组
    const events = data.data || [];
    if (!Array.isArray(events)) {
      throw new Error("Events data is not an array");
    }


    const apiEvents = events.map((event: any) => {
      let color;
      switch (event.type) {
        case 0:
          color = '#F7DAE6';
          break;
        case 1:
          color = 'rgba(52, 199, 88, 0.48)';
          break;
        case 2:
          color = 'rgba(255,203,1,0.48)';
          break;
        case 3:
          color = 'rgba(90,200,250,0.48)';
          break;
        case 4:
          color = 'rgba(175,82,222,0.48)';
          break;
      }
      return {
        id: `${event.id}`,
        title: event.title,
        start: event.startTime,
        end: event.endTime ? event.endTime : undefined,
        color: color, // 设置事件的颜色
        textColor: 'black'
      };
    });
    if (calendarRef.value) {
      let calendarApi = calendarRef.value.getApi();
      apiEvents.forEach(event => calendarApi.addEvent(event));
      console.log("日程:", calendarApi.getEvents());
    }

  } catch (error) {
    console.error("There was a problem fetching the events:", error);
  }
}

//获取我的全部日程
async function fetchMyEvents() {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/user/all?groupId=${userInfo.value.groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.value,
        "companyId": userInfo.value.companyId,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // 检查 data 结构并提取 events 数组
    const events = data.data || [];
    if (!Array.isArray(events)) {
      throw new Error("Events data is not an array");
    }


    const apiEvents = events.map((event: any) => {
      let color;
      switch (event.type) {
        case 0:
          color = '#F7DAE6';
          break;
        case 1:
          color = 'rgba(52, 199, 88, 0.48)';
          break;
        case 2:
          color = 'rgba(255,203,1,0.48)';
          break;
        case 3:
          color = 'rgba(90,200,250,0.48)';
          break;
        case 4:
          color = 'rgba(175,82,222,0.48)';
          break;
      }
      return {
        id: `${event.id}`,
        title: event.title,
        start: event.startTime,
        end: event.endTime ? event.endTime : undefined,
        color: color, // 设置事件的颜色
        textColor: 'black'
      };
    });
    if (calendarRef.value) {
      let calendarApi = calendarRef.value.getApi();
      apiEvents.forEach(event => calendarApi.addEvent(event));
      console.log("日程:", calendarApi.getEvents());
    }

  } catch (error) {
    console.error("There was a problem fetching the events:", error);
  }
}

//根据标签获取对应类别日程
async function fetchOtherEvents() {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/type/all?groupId=${userInfo.value.groupId}&type=${type.value}`, {//把1换成${userInfo.value.groupId}
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.value,
        "companyId": userInfo.value.companyId,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // 检查 data 结构并提取 events 数组
    const events = data.data || [];
    if (!Array.isArray(events)) {
      throw new Error("Events data is not an array");
    }

    const apiEvents = events.map((event: any) => {
      let color;
      switch (event.type) {
        case 0:
          color = '#F7DAE6';
          break;
        case 1:
          color = 'rgba(52, 199, 88, 0.48)';
          break;
        case 2:
          color = 'rgba(255,203,1,0.48)';
          break;
        case 3:
          color = 'rgba(90,200,250,0.48)';
          break;
        case 4:
          color = 'rgba(175,82,222,0.48)';
          break;
      }
      return {
        id: `${event.id}`,
        title: event.title,
        start: event.startTime,
        end: event.endTime ? event.endTime : undefined,
        color: color, // 设置事件的颜色
        textColor: 'black'
      };
    });
    if (calendarRef.value) {
      let calendarApi = calendarRef.value.getApi();
      apiEvents.forEach(event => calendarApi.addEvent(event));
      console.log("日程:", calendarApi.getEvents());
    }

  } catch (error) {
    console.error("There was a problem fetching the events:", error);
  }
}
//设置弹窗
const currentModal = ref("");
const transitionName = ref("fade");

function showCreateSchedule() {
  currentModal.value = "CreateSchedule";
  console.log("currentModal=", currentModal.value);
}

function showcalendardetails(info: any) {
  if (currentTippyInstance) {
    currentTippyInstance.destroy();
  }
  scheduleId.value = info.event.id;
  currentModal.value = "calendardetails";
  console.log("currentModal=", currentModal.value);
}

function showReviseSchedule(info: any) {
  if (currentTippyInstance) {
    currentTippyInstance.destroy();
  }
  scheduleId.value = info.event.id;
  currentModal.value = "ReviseSchedule";
  console.log("currentModal=", currentModal.value);
}


//关闭弹窗
function closeModal() {
  currentModal.value = "";
  console.log("ModalClosed");
}
//刷新日历重新获取事件
async function refreshCalendar() {
  // 获取 FullCalendar 的 API
  let calendarApi = calendarRef.value.getApi();

  // 清空所有 events
  let events = calendarApi.getEvents();
  events.forEach((event: EventApi) => event.remove());


  // 根据 type.value 的值调用不同的函数
  if (type.value === -2) {
    await fetchEvents();
  } else if (type.value > -1) {
    await fetchOtherEvents();
  }
}
</script>

<style>
.title {
  margin-top: 1.3%;
  margin-left: 3%;
}

.calendarimg {
  vertical-align: middle;
  margin-top: -0.5%;
}

.calendartitle {
  font-family: 'alibaba';
  font-weight: bolder;
  font-size: 20px;
  margin-left: 1%;
  width: 80px;
  display: inline-block;
}

.createbutton {
  margin-left: 71%;
  width: 180px;
  height: 43px;
  border-radius: 10px;
  background-color: #FB682F;
  font-size: 18px;
  color: white;
  border: #FB682F solid 1px;
  cursor: pointer;
}

.cutoff {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-top: 1%;
}

.app-main {
  flex-grow: 1;
  padding-top: 1.3em;
}

.fc {
  max-width: 1150px;
  height: 720px;
  margin: 0 auto;
}

.fc-prev-button {
  display: inline-block !important;
  background-color: white !important;
  border: none !important;
  outline: none !important;
}

.fc-icon {
  color: black;
}

.fc-next-button {
  display: inline-block !important;
  background-color: white !important;
  border: none !important;
  outline: none !important;
}

.fc-prev-button:focus {
  outline: none !important;
}

.fc-button:focus {
  outline: none !important;
  box-shadow: none !important;
}

.fc-toolbar-title {
  display: inline-block !important;
  vertical-align: middle !important;
  padding-left: 5% !important;
  padding-right: 5% !important;
}

.fc-header-toolbar>div:nth-child(2) {
  width: 700px !important;

}

.fc-dayGridMonth-button,
.fc-timeGridWeek-button,
.fc-listDay-button {
  width: 110px !important;
  text-align: center !important;
  border: #FF6200 solid 1px !important;
  color: var(--fc-button-unselected-text-color) !important;
}

.fc-dayGridMonth-button.fc-button-active,
.fc-timeGridWeek-button.fc-button-active,
.fc-listDay-button.fc-button-active {
  color: var(--fc-button-selected-text-color) !important;
}

/* 将i改为正体 */
.app-main i {
  font-style: normal;
}

:root {
  --fc-button-bg-color: white;
  --fc-button-border-color: #2C3E50;
  --fc-button-hover-bg-color: rgba(255, 98, 0, 0.2);
  --fc-button-hover-border-color: #1a252f;
  --fc-button-active-bg-color: #ff6200;
  --fc-button-active-border-color: #FF6200;
  --fc-button-unselected-text-color: #FF6200;
  --fc-button-selected-text-color: white;
  --fc-today-bg-color: rgba(227, 222, 219, 0.25);
}

/* 弹窗淡入淡出动画 */
/* .fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */

/* 定义鼠标悬浮事件弹窗 */
.custom-tooltip {
  padding: 1%;
}

.tippy-content {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  height: 130px;
}

.custom-tooltip .event-title {
  font-size: 16px;
  color: black;
  margin-left: 3%;

}

.custom-tooltip .event-time {
  margin-top: 5%;
  margin-bottom: 10px;
  color: black;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: baseline;
}

.custom-tooltip .btn-detail {
  width: 75px !important;
  height: 30px !important;
  font-size: 13px;
  display: inline-block;
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #FF6200;
  color: white;
  border: #FF6200 solid 1px;
  border-radius: 4px;
  cursor: pointer;
  /* font-weight: bold; */
}

.custom-tooltip .btn-edit {
  display: inline-block;
  width: 75px !important;
  height: 30px !important;
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 13px;
  background-color: white;
  color: black;
  border: #FF6200 solid 1px;
  border-radius: 4px;
  cursor: pointer;
  /* font-weight: bold; */
  margin-left: 24%;
}

.custom-tooltip .event-header {
  display: flex;
  align-items: center;
}

.custom-tooltip .color-bar {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.custom-tooltip .start-time {
  font-size: 22px;
  font-weight: bold;
}

.custom-tooltip .start-date {
  font-size: 12px;
  margin-left: 1.5%;
}

.custom-tooltip .end-time {
  margin-left: 5%;
  font-size: 22px;
  font-weight: bold;
}

.custom-tooltip .end-date {
  font-size: 12px;
  margin-left: 1.5%;
}

.custom-tooltip .event-button {
  margin-top: 8%;
  display: flex;
  justify-content: center;
}

.fc-list-event {
  cursor: pointer;
}
</style>