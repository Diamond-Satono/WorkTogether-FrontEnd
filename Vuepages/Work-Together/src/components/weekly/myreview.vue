<template>
  <!-- <div>
    我的周报
    {{ getWeekRange(2024, 22) }}
  </div> -->
  <div class="container">
    <div class="model-content">
      <div class="model-bar">
        <img src="@/assets/weekly/review.png" alt="">
        &nbsp;&nbsp;
        我评审的
      </div>
      <div class="function-bar">
        <div class="tabs">
          <div v-if="isneed === false">
            <span style="color: #FF6200">已评审</span>
            &nbsp;&nbsp;&nbsp;
            <span @click="toOther">待评审</span>
          </div>
          <div v-else>
            <span @click="toOther">已评审</span>
            &nbsp;&nbsp;&nbsp;
            <span style="color: #FF6200">待评审</span>
          </div>
        </div>
      </div>
      <table>
        <!-- Table structure and data -->
        <thead>
        <tr>
          <th>周</th>
          <th>时间</th>
          <th>状态</th>
          <th>提交成员</th>
        </tr>
        </thead>
        <tbody v-if="isneed === false">
        <!-- Sample row -->
        <tr v-for="row in myReports" :key="row.id">
          <td style="color: rgba(16, 16, 16, 0.6);">
            {{ row.year }}年第{{ row.weekNum }}周<br>
            {{ getWeekRange(row.year, row.weekNum) }}
          </td>

          <td>{{ row.reportTime }}</td>

         
          <td><button class="auditing" @click="toView(row)">已审核</button></td>
          <td><img :src="row.imgUrl" alt="" style="width:60px; height: 60px;border-radius: 50%;"></td>

        </tr>
        </tbody>
        <tbody v-else>
        <!-- Sample row -->
        <tr v-for="row in myReports" :key="row.id">
          <td style="color: rgba(16, 16, 16, 0.6);">
            {{ row.year }}年第{{ row.weekNum }}周<br>
            {{ getWeekRange(row.year, row.weekNum) }}
          </td>

          <td>{{ row.reportTime }}</td>

          <td><button class="submited" @click="toView(row)">已提交</button></td>
          <td><img :src="row.imgUrl" alt="" style="width: 60px; height: 60px;border-radius: 50%;"></td>
          
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
const isneed = ref(false);
//获取所有用户列表
function fetchAllReportData() {
  let body;
  if(isneed.value === false) {
    body = {
      "status": 1
    }
  } else {
    body = {
      "status": 0
    }
  }
  fetch(`http://localhost:8080/api/report/getReportByCondition`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
      },
      body: JSON.stringify(body)
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
        
        console.log(token.value);  
        console.log("allUserList.value=", myReports.value);
    })
    .catch(error => {
        console.error('Error fetching myReports data:', error);
    });
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
//切换tab
function toOther() {
  isneed.value = !isneed.value;
  fetchAllReportData();
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
.function-bar {
  width: 90%;
  margin-top: 30px;
  margin-bottom: 25px;
  margin-left: 5%;
  margin-right: 5%;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.tabs {
  cursor: pointer;
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