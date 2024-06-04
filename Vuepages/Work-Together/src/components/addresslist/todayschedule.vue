<template>
  <div class="title">
    <img class="eventimg" src="@/assets/calendarimgs/dailyevents.png">
    <span class="titlewords">今日日程</span>
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
import listPlugin from '@fullcalendar/list';
import { type CalendarOptions, type EventApi, type DateSelectArg, type EventClickArg } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/zh-cn'
import { UserInfo } from '@/store/userinfo'
import { Authorization } from '@/store/token'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css';

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
    left: '',
    center: '',
    right: ''
  },
  buttonIcons: {
    // prev: 'circle-triangle-w', next: 'circle-triangle-e'
  },
  initialView: 'listDay',
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
      noEventsText: '今日无日程安排', // 没有日程安排显示
      eventTimeFormat: {
        hour: '2-digit', // 显示两位数的小时
        minute: '2-digit', // 显示两位数的分钟
        meridiem: false // 不显示上午/下午
      }, // Custom event time format
    },
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




function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}

// 钩子函数
onMounted(async () => {
  await fetchMyEvents();
})

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
</script>

<style scoped>
.app-main i {
  font-style: normal;
}

.title {
  margin-left: 3%;
}

.titlewords {
  font-size: 18px;
  margin-left: 1.5%;
}

.eventimg {
  vertical-align: middle;
  margin-top: -0.5%;
}

.fc {
  margin: 0 auto;
}
</style>