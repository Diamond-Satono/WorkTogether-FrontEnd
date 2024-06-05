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
        <div class="eventdescription">{{ arg.event.extendedProps.description }}</div>
        <div class="icons">
          <div class="avatar-container" v-for="(user, index) in arg.event.extendedProps.avatarsAndNames" :key="index">
            <img class="avatar" :src="user.avatar" :alt="user.name" :title="user.name">
          </div>
        </div>
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
import { UserInfo } from '@/store/userinfo'
import { Authorization } from '@/store/token'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css';

const props = defineProps({
  memberId: Number
});

watch(() => props.memberId, (newId, oldId) => {
  console.log('currentId updated:', newId);
});

watch(() => props.memberId, async (newId) => {
  // 获取 FullCalendar 的 API
  let calendarApi = calendarRef.value.getApi();

  // 清空所有 events
  let events = calendarApi.getEvents();
  events.forEach((event: EventApi) => event.remove());

  // 使用新的 memberId 调用 fetchMyEvents
  await fetchMyEvents(newId);
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
  displayEventEnd: true,//显示结束时间
  displayEventTime: true,
  eventDisplay: 'block',
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




function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}


onMounted(async () => {
  await fetchMyEvents(props.memberId);
})

interface ScheduleUser {
  id: number;
  scheduleId: number;
  userId: number;
  name: string;
  joinStatus: number;
  refuseReason: string | null;
  isDeleted: boolean;
  avatar: string;
}

async function fetchMyEvents(memberId: any) {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/member?id=${memberId}&groupId=${userInfo.value.groupId}`, {
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
    const events = data.data || [];
    if (!Array.isArray(events)) {
      throw new Error("Events data is not an array");
    }

    const apiEvents = await Promise.all(events.map(async (event) => {
      const eventDetails = await fetchEventDetails(event.id);
      const scheduleUsers = eventDetails.data.scheduleUsers || [];
      const avatarsAndNames = scheduleUsers.map((user: ScheduleUser) => ({
        name: user.name,
        avatar: user.avatar
      }));

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
        textColor: 'black',
        description: event.description,
        avatarsAndNames: avatarsAndNames // 添加头像和名字信息
      };
    }));

    if (calendarRef.value) {
      let calendarApi = calendarRef.value.getApi();
      apiEvents.forEach(event => calendarApi.addEvent(event));
      console.log("日程:", calendarApi.getEvents());
    }

  } catch (error) {
    console.error("There was a problem fetching the events:", error);
  }
}


//获取日程详细信息

async function fetchEventDetails(scheduleId: any) {
  try {
    const response = await fetch(`http://localhost:8080/api/schedule/getScheduleInfoByid?scheduleId=${scheduleId}`, {
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
    return data;
  } catch (error) {
    console.error("There was a problem fetching the schedule info:", error);
    return {};
  }
}

const scheduleId = ref('')
const currentModal = ref("");
const transitionName = ref("fade");
//处理events点击事件
function handleEventClick(clickInfo: EventClickArg) {
  showcalendardetails(clickInfo);
}

function showcalendardetails(info: any) {

  scheduleId.value = info.event.id;
  currentModal.value = "calendardetails";
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


  await fetchMyEvents(props.memberId);

}
</script>

<style>
.app-main i {
  font-style: normal;
  font-size: 18px;
}

.title {
  margin-left: 2%;
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

.fc-list-event {
  height: 120px;
  /* background-color: rgba(229, 229, 234, 0.35); */
  cursor: pointer;
}

.eventdescription {
  font-size: 18px;
  color: #8E8E93;
  margin-left: 1%;
  margin-top: 2%;
  position: relative;
}

.icons {
  display: flex;
  justify-content: flex-end;
  /* 固定右端 */
  align-items: center;
  flex-wrap: nowrap;
  /* 确保图片不换行 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-left: -10px;
  /* 负的左外边距以控制图片之间的间距 */
}

.avatar {
  width: 40px;
  /* 调整为合适的宽度 */
  height: 40px;
  /* 调整为合适的高度 */
  border-radius: 50%;
  /* 使图片成为圆形 */
  object-fit: cover;
  /* 确保图片不失真 */
}
</style>