<template>
  <div class="model">
    <div class="model-side">
      <div class="search-bar">
        <div class="input-container">
          <input type="text" placeholder="请输入成员名、邮箱、职位" v-model="searchText">
        </div>
      </div>
      <div>分级部门</div>
    </div>
    <div class="model-content">
      <div class="top-content">
        <div class="dept_title">
          v {{ departments.name }}
          <span style="color: #8E8E93;">({{ departments.member_num }}人)</span>
        </div>
        <div class="topbar-right">
            <img src="@/assets/img/batch-export.png" alt="Icon"><button class="bnt1"> 批量导出</button>
            <img src="@/assets/img/delsymbol.png" alt="Icon"><button class="bnt2" @click="showBatchDepart"> 批量离职</button>
            <button class="invite-btn" @click="showAddMember">添加成员</button>
        </div>
      </div>
      <table>
          <!-- Table structure and data -->
          <thead>
          <tr>
              <th></th>
              <th>成员</th>
              <th>邮箱</th>
              <th>部门</th>
              <th>职位</th>
              <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- Sample row -->
          <tr v-for="user in users" :key="user.id">
              <td><input type="checkbox" :value="user.id" @click="toggleSelectUser(user.id)" class="row-selector"></td>
              <td class="memName">
                <!-- <img src="@/assets/img/icon.png" alt=""> -->
                {{ user.name }}
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.deptName }}</td>
              <td>{{ user.position }}</td>
              <td>
                  <button class="detail_button" @click="showDeptDetail(user)">详情</button>
                  <img
                    src="@/assets/deptimgs/options.png"
                    class="optionsimg"
                    @click.stop="updatePopupPosition(user, $event)"
                  />
              </td>
          </tr>
          </tbody>
      </table>
    </div>
  </div>
  <!-- 动态加载组件 -->
  <Transition name="transitionName" mode="out-in">
    <component
      :is="currentModal"
      v-if="currentModal"
      @close-modal="closeModal"
      :batchIds="batchIds"
      :user="currentRowData"
    ></component>
  </Transition>
  <!-- 操作选项弹窗 -->
  <Transition :name="transitionName" mode="out-in">
    <div
      class="popup"
      :style="{
        top: popupPosition.top + 'px',
        left: popupPosition.left + 'px',
      }"
      v-if="showPopup"
    >
      <button class="assigndept" @click="showAssignDept">变更部门</button>
      <button class="deletemember" @click="showDeleteMember(currentRowData)">
        操作离职
      </button>
    </div>
  </Transition>
</template>
  
<script setup lang="ts">
import { onMounted, ref, Transition, onUnmounted } from 'vue'
import {Authorization} from "@/store/token"
const tokens = Authorization();
const currentModal = ref("");
const transitionName = ref("fade");
const searchText = ref("");
const batchIds = ref([]);//选中的成员id
const departments = ref(
  {
    name: "深大计软学院",
    manager_id: 1,
    member_num: 53,
    describe: "non"
  });
interface Department {
  name: string;
  number: number;
  manager: string;
  tasks: number;
  isParent: boolean;
  children: Department[];
  expanded: boolean;
}

const tableData = ref<Department[]>([
  {
    name: "深圳大学一级分部",
    number: 10,
    manager: "张三",
    tasks: 5,
    isParent: true, // 标记为父级部门
    children: [
      // 子部门数据
      {
        name: "深圳大学一级分部子部门1",
        number: 5,
        manager: "李四",
        tasks: 2,
        isParent: false,
        children: [],
        expanded: false,
      },
      {
        name: "深圳大学一级分部子部门2",
        number: 8,
        manager: "王五",
        tasks: 3,
        isParent: false,
        children: [],
        expanded: false,
      },
    ],
    expanded: true,
  },
  {
    name: "深圳大学二级分部",
    number: 15,
    manager: "李四",
    tasks: 8,
    isParent: true,
    children: [],
    expanded: false,
  },
  {
    name: "深圳大学三级分部",
    number: 12,
    manager: "王五",
    tasks: 7,
    isParent: true,
    children: [],
    expanded: false,
  },
  {
    name: "深圳大学四级分部",
    number: 20,
    manager: "小明",
    tasks: 6,
    isParent: true,
    children: [],
    expanded: false,
  },
]);
const users = ref([
  {
    id: 1,
    name: '张三',
    status: '正常',
    position: '前端工程师',
    email: 'zhangsan@example.com',
    deptName: '技术部'
  },
  {
    id: 2,
    name: '李四',
    status: '正常',
    position: '后端工程师',
    email: 'lisi@example.com',
    deptName: '技术部'
  },
  // ... more users
]);
const currentRowData = ref("");
//多选功能
// 选中或取消选中单个用户
function toggleSelectUser(userId: number) {
  if (batchIds.value.includes(userId)) {
    // 如果batchIds中已存在该id，则移除
    const index = batchIds.value.indexOf(userId);
    if (index >= 0) {
      batchIds.value.splice(index, 1);
    }
  } else {
    // 否则，添加该id到batchIds中
    batchIds.value.push(userId);
  }
}
// 选中或取消选中所有用户
// function toggleSelectAll() {
//   const selectedAll = batchIds.value.length === users.value.length;
//   if (selectedAll) {
//     // 如果所有都已选中，则取消全选
//     batchIds.value = [];
//   } else {
//     // 否则，全选
//     batchIds.value = users.value.map(user => user.id);
//   }
// }
// 显示批量离职对话框
function showBatchDepart() {
  currentModal.value = "BatchDepart";
  console.log("currentModal=", currentModal.value);
}
// 显示添加成员对话框
function showAddMember() {
  currentModal.value = "AddMember";
  console.log("currentModal=", currentModal.value);
}
// 显示详情
function showDeptDetail(user: any) {
  transitionName.value = "slide-fade"; // 设置 transitionName 的值为 "slide-fade"
  currentModal.value = "MemberDetail";
  console.log("currentModal=", currentModal.value);
  currentRowData.value = user;
  console.log("详情", user);
}
//显示变更部门
function showAssignDept() {
  currentModal.value = "AssignDept";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}
//显示操作离职
function showDeleteMember(currentRowData: any) {
  currentModal.value = "DeleteMember";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}
// 关闭对话框
function closeModal() {
  if (currentModal.value === "DeptDetail") {
    // 如果当前模态框为 DeptDetail，则不改变 transitionName 的值，继续使用 slide-fade 过渡效果
    currentModal.value = "";
    console.log("ModalClosed");

    // 延迟更改 transitionName 的值
    setTimeout(() => {
      transitionName.value = "fade";
    }, 500); // 在动画完成后 500 毫秒后更改 transitionName 的值
  } else {
    // 否则，将 transitionName 的值设置为 "fade"，使用默认的 fade 过渡效果
    transitionName.value = "fade";
    currentModal.value = "";
    console.log("ModalClosed");
  }
}
// 控制操作选项弹窗
const showPopup = ref(false);
const popupPosition = ref({ top: 0, left: 0 });

function updatePopupPosition(user: any, event: MouseEvent) {
  showPopup.value = !showPopup.value; // 点击时切换弹窗的显示状态
  const rect = (event.target as HTMLElement).getBoundingClientRect(); // 获取元素的位置信息
  popupPosition.value = {
    top: rect.bottom + 20, // 设置弹窗的垂直位置
    left: rect.left - 170, // 设置弹窗的水平位置
  };
  currentRowData.value = user; // 保存行数据
  console.log("currentRowData.value=", currentRowData.value);
}
// 在 setup 中添加函数用于处理点击弹窗以外的区域
function handleClickOutside(event: MouseEvent) {
  const popup = document.querySelector(".popup"); // 获取弹窗元素
  if (!popup) return; // 如果弹窗不存在，直接返回

  // 判断点击事件的目标元素是否在弹窗内部，如果不在则关闭弹窗
  if (!(event.target as HTMLElement).closest(".popup")) {
    hidePopup(); // 调用关闭弹窗的函数
  }
}

// 组件初始化时，绑定 document 的点击事件处理函数
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// 组件销毁时，移除 document 的点击事件处理函数，以防止内存泄漏
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
//隐藏操作选项
function hidePopup() {
  showPopup.value = false;
}

//拉取成员列表
function fetchUserData() {
  const url = 'http://localhost:8080/api/company_user/getAllMember/1';
  fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': 1 // 设置 companyId 请求头，用于传递公司 ID
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
        users.value = data.data;                    
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle the error, e.g., show a message to the user
    });
}
onMounted (() => {
  fetchUserData();
  // 获取搜索框元素-成员名
  const searchContent = document.querySelector('.input-container input[type="text"]');
  // 添加查询成员事件监听器-
  searchContent.addEventListener('keypress', function (event) {
      // 判断是否按下的是回车键
      if (event.key === 'Enter') {
          performSearchMember();
      }
  });
  // 定义查询功能函数
  function performSearchMember() {
      // 获取输入框中的关键字
      var keyword = searchContent.value.trim().toLowerCase();

      // 获取所有的表格行
      var rows = document.querySelectorAll('tbody tr');

      // 遍历每一行
      rows.forEach(function (row) {
          // 获取当前行的成员单元格的内容
          var memberName = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
          // 获取当前行的邮箱单元格的内容
          var memberEmail = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
          // 获取当前行的部门单元格的内容
          var memberDeptName = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
          // 获取当前行的职位单元格的内容
          var memberPosition = row.querySelector('td:nth-child(5)').textContent.trim().toLowerCase();

          // 如果角色名称包含关键字，则显示该行，否则隐藏该行
          if (memberName.includes(keyword) ||
              memberEmail.includes(keyword) ||
              memberPosition.includes(keyword)
              ) {
              row.style.display = 'table-row';
          } else {
              row.style.display = 'none';
          }
      });
  }
  
});
</script>

<style scoped>
/* 样式可以根据需要进行修改 */
.model{
  width:100%;
  height: 100%;
  display: flex;
}
.model-side{
  width: 20%;
  height: 100%;
  border-right: 1px solid #BBBBBB;
}
.model-content{
  width: 80%;
  height: 100%;
}
/* 搜索框 */
.search-bar{
  margin-top: 10%;
  margin-bottom: 10px;
}
.input-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}.input-container input {
  border-radius: 5px;
  width: 80%;
  height: 30px;
  font-size: 13px;
  border: 1px solid #BBBBBB;
  padding: 0 2%;
}
.input-container input:focus {
  outline: none;
}
/* 分级部门 */

/* 列表顶部栏 */
.top-content{
  display: flex;
  justify-content: space-between;
  margin-top: 2%;
  margin-bottom: 10px;
}
.dept_title{
  font-size: 20px;
  margin: 10px 20px;
}
.topbar-right {
  display: flex;
  align-items: center;
  /* margin-left: 250px; */
}

/* 设置顶部栏按钮的样式 */
.topbar-right .bnt1 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(52, 199, 88, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(52, 199, 88, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-right .bnt2 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(255, 58, 48, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(255, 58, 48, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-right img {
  margin-right: 5px; /* 图标与文字之间的右侧间距 */
  width: 25px;
  height: 25px;
  /* margin-top: 5px; */
}
.invite-btn {
    width: 152px;
    height: 35px;
    font-size: 15px;
    font-weight: bold;
    padding: 5px 10px;
    background-color: #FB682F;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
/* 弹窗淡入淡出动画 */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 弹窗滑入效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* Table Styles */
table {
    width: 100%;
    border-collapse: separate; /* 改变表格的边框合并方式 */
    border-spacing: 0; /* 设置单元格间距为0 */
    margin-top: 10px;
    background-color: #FFFFFF;
    border-radius: 20px;
    /* Spacing above the table */
}

.table {
  margin-left: 2%;
  margin-right: 4%;
  margin-top: 1%;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  width: 80px;
}
td {
  padding: 20px;
  text-align: center;
}

/* 复选框样式 */
input[type="checkbox"] {
    margin: 0; /* 移除默认的外边距 */
    padding: 0; /* 移除外边距 */
    height: 16px; /* 设置复选框的大小 */
    width: 16px; /* 设置复选框的大小 */
    vertical-align: middle; /* 垂直居中对齐 */
}

/* 全选复选框样式 */
.select-all {
    margin-right: 10px; /* 添加一些右边距 */
}

/* 行选择复选框样式 */
.row-selector {
    padding-left: 10px; /* 添加一些左边距，用于对齐文本 */
}

/* tr:nth-child(even) {
    background-color: #f2f2f2;
} */

/* Button Styles */
.detail_button {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10%;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
.optionsimg {
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-left: 12%;
  margin-top: -2%;
  cursor: pointer;
}
.popup {
  width: 170px;
  height: 126px;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
}
.assigndept,
.deletemember {
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