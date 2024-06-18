<template>
  <div>
    我的周报
    {{ getWeekRange(2024, 22) }}
  </div>
  <table>
    <!-- Table structure and data -->
    <thead>
    <tr>
      <!-- <th></th> -->
      <th>周</th>
      <th>时间</th>
      <th>状态</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <!-- Sample row -->
    <tr v-for="row in myReports" :key="row.id">
      <td style="color: rgba(16, 16, 16, 0.6);">
        {{ row.year }}年第{{ row.weekNum }}周<br>
        {{ getWeekRange(row.year, row.weekNum) }}
      </td>
      <td>{{ row.reportTime }}</td>
      <td v-if="row.status === -1" style="color: #ff0000;">未提交</td>
      <td v-else-if="row.status === 0" style="color: #00ff00;">已提交</td>
      <td v-else-if="row.status === 1" style="color: #0000ff;">已审核</td>
      
      <td v-if="row.status === 0">
        <button class="detail_button">去编辑</button>
      </td>
      <td v-else-if="row.status === 1">
        <!-- <button class="detail_button">去编辑</button> -->
      </td>
      <td v-else>
        <button class="detail_button">去填写</button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {Authorization} from "@/store/token";
import { UserInfo } from "@/store/userinfo";
const token = Authorization();
const userInfo = UserInfo();
const companyId = userInfo.value.companyId;
const companyIdString = companyId.toString();
const groupId = ref(userInfo.value.groupId);
const myReports = ref([
  {
    id: 1802277163324932097,
    userId: 1,
    reviewerId: 1,
    year: 2024,
    weekNum: 24,
    text1: "aliqua",
    text2: "Ut tempor voluptate laborum",
    text3: "qui consectetur ea eiusmod",
    text4: "reprehenderit",
    status: 0,
    reportTime: "2024-06-16T17:53:13"
  },
  {
    id: 1802277163324932011,
    userId: 1,
    reviewerId: 1,
    year: 2024,
    weekNum: 22,
    text1: "aliqua",
    text2: "Ut tempor voluptate laborum",
    text3: "qui consectetur ea eiusmod",
    text4: "reprehenderit",
    status: 0,
    reportTime: "2024-06-07T17:53:13"
  }
]);
//获取所有用户列表
function fetchAllReportData() {
  fetch(`http://localhost:8080/api/report/getMyReports`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
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
        // 请求成功，更新消息数据
        myReports.value = data.data;
        if (myReports.value.length > 0) {
          // 首先，填充缺失的周报数据
          const missingReports = fillMissingWeeks(myReports.value);
          // 将新创建的报告插入到原始数组中，然后进行排序
          const allReports = [...missingReports, ...myReports.value];
          // 按weekNum逆序排序
          allReports.sort((a, b) => b.weekNum - a.weekNum);
          // 更新myReports的值
          myReports.value = allReports;
        }
        console.log(token.value);  
        console.log("allUserList.value=", myReports.value);
    })
    .catch(error => {
        console.error('Error fetching myReports data:', error);
    });
}
function fillMissingWeeks(reports :Array<any>) {
  const existingWeeks = new Set(reports.map(report => report.weekNum));
  const missingWeeks = [];
  for (let weekNum = reports[0].weekNum-1; weekNum > 0; weekNum--) {
    if (!existingWeeks.has(weekNum)) {
      const newReport = {
        id: -1,
        userId: -1,
        reviewerId: -1,
        year: reports[0].year,
        weekNum: weekNum,
        text1: "",
        text2: "",
        text3: "",
        text4: "",
        status: -1,
        reportTime: ""
      };
      missingWeeks.push(newReport);
    }
  }
  return missingWeeks;
}

// 在组件挂载后调用这个方法
onMounted(() => {
  fetchAllReportData();
  // if (myReports.value.length > 0) {
  //   // 首先，填充缺失的周报数据
  //   const missingReports = fillMissingWeeks(myReports.value);
  //   // 将新创建的报告插入到原始数组中，然后进行排序
  //   const allReports = [...missingReports, ...myReports.value];
  //   // 按weekNum逆序排序
  //   allReports.sort((a, b) => b.weekNum - a.weekNum);
  //   // 更新myReports的值
  //   myReports.value = allReports;
  // }
});

function formatDate(date :any) {
  const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
  const day = date.getDate();
  return `${month}月${day}日`;
}

function getWeekRange(year :any, weekNum :any) {
  const date = new Date();
  date.setFullYear(year, 0, 1); // 设置日期为年初
  date.setHours(0, 0, 0, 0); // 避免时区影响

  let day = date.getDay(); // 获取当前日期是星期几
  if (day === 0) day = 7; // 周日调整为7

  // 计算周一的日期
  const firstMonday = (day === 7 ? 1 : -day + 8);
  date.setDate(firstMonday);

  // 计算指定周的周一日期
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() + (weekNum - 1) * 7);

  // 计算指定周的周日日期
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  // 获取格式化的日期范围
  const start = formatDate(startOfWeek);
  const end = formatDate(endOfWeek);

  return `${start} - ${end}`;
}
// 使用函数
const weekRange = getWeekRange(2024, 24);
console.log(`2024年第24周的时间是${weekRange}`);

// function getWeekRange(year :any, weekNum :any) {
//   const date = new Date();
//   date.setUTCFullYear(year); // 设置年份
//   date.setUTCMonth(0); // 设置月份为0，即1月
//   date.setUTCDate(1); // 设置日期为1

//   let day = date.getUTCDay(); // 获取当前日期是星期几
//   // 如果1月1日不是星期日，向前调整到最近的星期一
//   if (day !== 0) {
//     date.setUTCDate(1 - day + 1);
//   }

//   // 计算到指定周的天数
//   const weekDays = (weekNum - 1) * 7;
//   date.setUTCDate(date.getUTCDate() + weekDays);

//   // 获取该周的开始日期和结束日期
//   const startOfWeek = new Date(date);
//   startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay() + 1); // 周一

//   const endOfWeek = new Date(startOfWeek);
//   endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6); // 周日

//   // 格式化日期为 YYYY-MM-DD
//   const formatDate = (date :any) => {
//     const d = new Date(date);
//     let month = '' + (d.getMonth() + 1);
//     let day = '' + d.getDate();
//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;
//     return [d.getFullYear(), month, day].join('-');
//   };

//   return {
//     start: formatDate(startOfWeek),
//     end: formatDate(endOfWeek)
//   };
// }

// 使用函数
// const { start, end } = getWeekRange(2024, 24);
// console.log(`2024年第24周的时间是${start} - ${end}`);
const emit = defineEmits(['update:weeklyId']);
const weeklyId = ref(111);
function send(){
  emit('update:weeklyId', weeklyId.value);
}

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: separate; /* 改变表格的边框合并方式 */
  border-spacing: 0; /* 设置单元格间距为0 */
  margin-top: 10px;
  background-color: #FFFFFF;
  border-radius: 20px;
}
table {
  width: 100%;
  border-collapse: collapse; 
}
th {
  padding: 20px 0px;
  text-align: center;
  background-color: rgba(87, 86, 215, 0.11);
  width: 14%;
  /* width: 70px; */
}
td {
  padding: 20px 0px;
  text-align: center;
}
/* 按钮 */
.detail_button {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 16px;
  cursor: pointer;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
</style>