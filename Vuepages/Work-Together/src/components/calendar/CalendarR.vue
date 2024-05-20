<template>
  <div class="title">
    <img src="@/assets/calendarimgs/mycalendar.png" class="calendarimg">
    <span class="calendartitle">{{ CalendarTitle }}</span>
    <button class="createbutton">新建日程</button>
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { type CalendarOptions, type EventApi, type DateSelectArg, type EventClickArg } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/zh-cn'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { UserInfo } from '@/store/userinfo'
import { Authorization } from '@/store/token'
//从父组件获取数据
const props = defineProps({
  selectedDate: String,//导航日历中已选择日期
  currentActive: String,//当前日历类别
  currentTypeColor: String//当前日历类别颜色
});
watch(() => props.selectedDate, (newDate, oldDate) => {
  console.log('selectedDate updated:', newDate);
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
    interactionPlugin // needed for dateClick
  ],
  headerToolbar: {
    left: 'dayGridMonth,timeGridWeek,timeGridDay',
    center: 'prev,title,next',
    right: ''
  },
  buttonIcons: {
    // prev: 'circle-triangle-w', next: 'circle-triangle-e'
  },
  initialView: 'dayGridMonth',
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: esLocale,
  displayEventEnd: false,//显示结束时间
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents
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

function handleEventClick(clickInfo: EventClickArg) {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    clickInfo.event.remove()
  }
}

function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}

// 钩子函数
onMounted(async () => {
  await fetchEvents();
})

//获取团队全部日程
async function fetchEvents() {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/group/all?groupId=1`, {//把1换成${userInfo.value.groupId}
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
      console.log(event.type);
      switch (event.type) {
        case 0:
          color = '#F7DAE6';
          break;
        case 1:
          color = 'rgba(52, 199, 88, 0.48)';
          break;
        case 2:
          color = 'rgba(252, 176, 1, 0.48)';
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
    const response = await fetch(`http://localhost:8080/api/schedule/type/all?groupId=1&type=${type.value}`, {//把1换成${userInfo.value.groupId}
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
    console.log(data.data);

    const apiEvents = events.map((event: any) => {
      let color;
      console.log(event.type);
      switch (event.type) {
        case 0:
          color = '#F7DAE6';
          break;
        case 1:
          color = 'rgba(52, 199, 88, 0.48)';
          break;
        case 2:
          color = 'rgba(252, 176, 1, 0.48)';
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
.fc-timeGridDay-button {
  width: 110px !important;
  text-align: center !important;
  border: #FF6200 solid 1px !important;
  color: var(--fc-button-unselected-text-color) !important;
}

.fc-dayGridMonth-button.fc-button-active,
.fc-timeGridWeek-button.fc-button-active,
.fc-timeGridDay-button.fc-button-active {
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
}
</style>