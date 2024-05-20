import { type EventInput } from '@fullcalendar/core'
import { Authorization } from '@/store/token'
import { UserInfo } from '@/store/userinfo'
import { onMounted } from 'vue'
let eventGuid = 100
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const token = Authorization();
const userInfo = UserInfo();
// 初始化事件数组，稍后将被导出
let INITIAL_EVENTS: EventInput[] = [
  // {
  //   id: createEventId(),
  //   title: '全天事件',
  //   start: todayStr
  // },
  // {
  //   id: createEventId(),
  //   title: '定时事件',
  //   start: todayStr + 'T12:01:00'
  // },
  // {
  //   id: createEventId(),
  //   title: '软件工程',
  //   start: todayStr + 'T11:00:00',
  //   end: "2024-05-23" + 'T11:00:00'
  // },
  // {
  //   id: createEventId(),
  //   title: '软件工程',
  //   start: "2024-04-20" + 'T11:00:00',
  // }
]

export function createEventId() {
  return String(eventGuid++)
}


export { INITIAL_EVENTS };

