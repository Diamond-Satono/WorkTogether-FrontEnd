<template>
  <!-- <div>
    我的周报
    {{ getWeekRange(2024, 22) }}
  </div> -->
  <div class="container">
    <div class="model-content">
      <div class="model-bar">
        <img src="@/assets/weekly/myweeklyIcon.png" alt="">
        &nbsp;&nbsp;
        我的周报
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

          <td v-if="row.status !==-1">{{ row.reportTime }}</td>
          <td v-else><span style="font-weight: bolder;">-</span></td>

          <td v-if="row.status === -1" style="color: #ff0000;"><button class="unsubmit">未提交</button></td>
          <td v-else-if="row.status === 0" style="color: #00ff00;"><button class="submited" @click="toView(row)">已提交</button></td>
          <td v-else-if="row.status === 1" style="color: #0000ff;"><button class="auditing" @click="toView(row)">已审核</button></td>
          
          <td v-if="row.status === 0" class="makecenter">
            <img src="@/assets/weekly/toeditIcon.png" alt="">
            <button class="edit_button" @click="toEdit(row)">去编辑</button>
          </td>
          <td v-else-if="row.status === 1">
          </td>
          <td v-else class="makecenter">
            <img src="@/assets/weekly/tofillinIcon.png" alt="">
            <button class="fillin_button" @click="toFillin(row)">去填写</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- 弹窗组件 -->
    <component :is="currentModal" v-if="currentModal"
      @close-modal="closeModal"
      :report="currentRowData"
      :isneed="isneed">
    </component>
  </div>  
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
    id: "1802277163324932097",
    userId: "1",
    reviewerId: "1",
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
    id: "1802277163324932011",
    userId: "1",
    reviewerId: "1",
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
          // 按year逆序排序
          allReports.sort((a, b) => b.year - a.year);
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
  const existingWeeks = new Set();
  const yearFirstReport = reports[0].year;
  const missingWeeks = [];
  reports.forEach(report => {
    // 只有当报告年份等于当前年份时，才添加到existingWeeks集合
    if (report.year === yearFirstReport) {
      existingWeeks.add(report.weekNum);
    }
  });
  for (let weekNum = reports[0].weekNum-1; weekNum > 0; weekNum--) {
    if (!existingWeeks.has(weekNum)) {
      const newReport = {
        id: "-1",
        userId: "-1",
        reviewerId: "-1",
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

const emit = defineEmits(['update:weeklyId']);
//“去编辑”按钮
function toEdit(row :any){
  emit('update:weeklyId', row.id, row.year, row.weekNum);
}
//“去填写”按钮
function toFillin(row :any){
  emit('update:weeklyId', row.id, row.year, row.weekNum);
}
//设置弹窗
const currentModal = ref("");
const currentRowData = ref('');
const isneed = ref(false);
function toView(row :any) {
  currentRowData.value = row;
  // currentModal.value = "GroupMemberDetail";
  currentModal.value = "WeeklyReportDetailsReviewed";
  console.log("currentModal=", currentModal.value);
}
//关闭弹窗
function closeModal() {
  currentModal.value = "";
  console.log("ModalClosed");
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.model-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.model-bar {
  width: 90%;
  margin-top: 30px;
  margin-bottom: 25px;
  margin-left: 5%;
  margin-right: 5%;
  font-size: 24px;
  display: flex;
  align-items: center;
}
table {
  width: 90%;
  margin-top: 10px;
  margin-left: 5%;
  margin-right: 5%;
  border-collapse: collapse; /* 改变表格的边框合并方式 */
  border-spacing: 0; /* 设置单元格间距为0 */
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0px 0px 8px 8px rgba(87, 86, 215, 0.1);
}
th {
  padding: 20px 0px;
  text-align: center;
  background-color: rgba(87, 86, 215, 0.11);
  width: 14%;
  font-size: 20px;
}
td {
  padding: 20px 0px;
  text-align: center;
  font-size: 17px;
}
.makecenter {
  margin: 10px 0px;
  text-align: center;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 按钮 */
.unsubmit {
  width: 110px;
  height: 40px;
  background-color: rgba(252, 202, 0, 0.22);
  color: #FCCA00;
  border: none;
  font-size: 17px;
  font-weight: bold;
  /* cursor: pointer; */
}
.submited {
  width: 110px;
  height: 40px;
  background-color: rgba(255, 98, 0, 0.22);
  color: #FF6200;
  border: none;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
}
.auditing {
  width: 110px;
  height: 40px;
  background-color: rgba(87, 86, 215, 0.22);
  color: #5756D7;
  border: none;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
}
.edit_button {
  background-color: white;
  border: none;
  color: #4C69EF;
  font-size: 17px;
  cursor: pointer;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
.fillin_button {
  background-color: white;
  border: none;
  color: #FF4D4F;
  font-size: 17px;
  cursor: pointer;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
</style>