<template>
  <div class="container">
    <div class="model">
      <div class="functions">
        <input class="SearchDept" type="text" placeholder="搜索团队名" v-model="searchKeyword" />
        <div class="buttons">
          <img src="@/assets/deptimgs/export.png" />
          <button class="export">批量导出</button>
          <img src="@/assets/deptimgs/delete.png" />
          <button class="delete" @click="showBatchDelete">批量删除</button>
          <img src="@/assets/deptimgs/import.png" />
          <button class="import"><router-link to="/groupexcel" style="text-decoration: none;">Excel批量导入</router-link></button>
          <img src="@/assets/deptimgs/create.png" />
          <button class="create" @click="showCreateDept">新建团队</button>
        </div>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>团队名称</th>
              <th>团队人数</th>
              <th>团队负责人</th>
              <th>团队关联团队数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 在这里添加你的数据行 -->
            <TransitionGroup name="list">
            <template v-for="(row, index) in filteredTableData" :key="index">
              <tr :class="{ parent: row.isParent }">
                <!-- 添加父级团队的 class -->
                <td>
                  <!-- 渲染复选框和展开按钮 -->
                  <template v-if="row.isParent">
                    <input type="checkbox" class="checkbox" />
                  </template>
                  {{ row.name }}
                </td>
                <td class="number">{{ row.number }}</td>
                <td class="manager">{{ row.manager }}</td>
                <td>{{ row.tasks }}</td>
                <td>
                  <button class="Detail" @click="showDeptDetail(row)">
                        详情
                      </button>
                      <img src="@/assets/deptimgs/options.png" class="optionsimg"
                        @click.stop="updatePopupPosition(row, $event)" />
                </td>
              </tr>
            </template>
          </TransitionGroup>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 动态加载组件 -->
    <Transition :name="transitionName" mode="out-in">
      <component :is="currentModal" v-if="currentModal" @close-modal="closeModal" @refresh-table="refreshTable":row="currentRowData"
        :departmentNames="departmentNames"></component>
    </Transition>
    <!-- 操作选项弹窗 -->
    <Transition :name="transitionName" mode="out-in">
      <div class="popup" :style="{
        top: popupPosition.top + 'px',
        left: popupPosition.left + 'px',
      }" v-if="showPopup">
       <button class="exportmember">导出成员</button><button
          class="deletedept" @click="showDeleteDept(currentRowData)">
          删除团队
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, Transition, computed, onMounted, onUnmounted } from "vue";
import { Authorization } from "@/store/token";
const token = Authorization();
const currentModal = ref("");
const transitionName = ref("fade");
interface Department {
  id: number;
  description: string;
  name: string;
  number: number;
  manager: string;
  tasks: number;
  isParent: boolean;
  children: Department[];
  expanded: boolean;
  expandchild: boolean;
  grandchildren: Department[];
  haschildren: boolean;
}


const tableData = ref<Department[]>([
  {
    id: 1,
    description: "我们一起工作吧",
    name: "深圳大学团队1",
    number: 10,
    manager: "张三",
    tasks: 5,
    expandchild: false,
    isParent: true, // 标记为父级团队
    children: [],
    grandchildren: [],
    expanded: true,
    haschildren: false,
  },
  {
    id: 1,
    description: "我们一起工作吧",
    name: "深圳大学团队2",
    number: 15,
    manager: "李四",
    tasks: 8,
    isParent: true,
    children: [],
    expanded: false,
    expandchild: false,
    grandchildren: [],
    haschildren: false
  },
  {
    id: 1,
    description: "我们一起工作吧",
    name: "深圳大学团队3",
    number: 12,
    manager: "王五",
    tasks: 7,
    isParent: true,
    children: [],
    expanded: false,
    expandchild: false,
    haschildren: false,
    grandchildren: []
  },
  {
    id: 1,
    description: "我们一起工作吧",
    name: "深圳大学团队4",
    number: 20,
    manager: "小明",
    tasks: 6,
    isParent: true,
    children: [],
    expanded: false,
    expandchild: false,
    haschildren: false,
    grandchildren: []
  },
]);

const currentRowData = ref("");
function showBatchDelete() {
  currentModal.value = "BatchDeleteGroup";
  console.log("currentModal=", currentModal.value);
}

function showCreateDept() {
  currentModal.value = "CreateGroup";
  console.log("currentModal=", currentModal.value);
}


function showDeleteDept(currentRowData: any) {
  currentModal.value = "DeleteGroup";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}

function showDeptDetail(row: any) {
  transitionName.value = "slide-fade"; // 设置 transitionName 的值为 "slide-fade"
  currentModal.value = "GroupDetail";
  console.log("currentModal=", currentModal.value);
  currentRowData.value = row;
  console.log("详情", row);
}





// 获取所有团队名字，包括子团队和孙子团队
const departmentNames = computed(() => {
  return tableData.value.flatMap((row) => {
    // 首先添加当前团队的名字
    let names = [row.name];
    
    // 添加子团队的名字
    if (row.children) {
      names = names.concat(row.children.map((child) => child.name));
      
      // 添加孙子团队的名字
        if (row.grandchildren) {
          names = names.concat(row.grandchildren.map((grandchild) => grandchild.name));
        }
    }

    return names;
  });
});



function closeModal() {
  if (currentModal.value === "GroupDetail") {
    // 如果当前模态框为 GroupDetail，则不改变 transitionName 的值，继续使用 slide-fade 过渡效果
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

function refreshTable(){
  // 清空表格数据
  tableData.value = [];
  // 延迟0.5秒再重新获取数据
  setTimeout(() => {
    fetchgroup();
  }, 500);  
   console.log('刷新表格');
}


// 控制操作选项弹窗
const showPopup = ref(false);
const popupPosition = ref({ top: 0, left: 0 });

function updatePopupPosition(row: any, event: MouseEvent) {
  showPopup.value = !showPopup.value; // 切换弹窗的显示状态
  const rect = (event.target as HTMLElement).getBoundingClientRect(); // 获取图标的位置信息

  const popupWidth = 170; // 弹窗的宽度
  const popupHeight = 190; // 弹窗的高度
  const windowWidth = window.innerWidth; // 浏览器窗口的宽度
  const windowHeight = window.innerHeight; // 浏览器窗口的高度

  // 计算弹窗的水平位置，使其水平居中
  let popupLeft = rect.left - popupWidth / 2;
  // 如果弹窗左侧超出页面左侧，将其左侧位置设置为0
  if (popupLeft < 0) {
    popupLeft = 0;
  }
  // 如果弹窗右侧超出页面右侧，将其左侧位置调整到页面右侧边缘
  if (popupLeft + popupWidth > windowWidth) {
    popupLeft = windowWidth - popupWidth;
  }

  // 计算弹窗的垂直位置
  let popupTop = rect.bottom + 20;
  // 如果弹窗下方超出页面底部，将其上移，显示在图标上方
  if (popupTop + popupHeight > windowHeight) {
    popupTop = rect.top - popupHeight - 20;
  }

  popupPosition.value = {
    top: popupTop ,
    left: popupLeft,
  };

  currentRowData.value = row; // 保存行数据
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

function hidePopup() {
  showPopup.value = false;
}

//获取团队数据
onMounted(() => {
  console.log(token.value);
  fetchgroup();
});

async function fetchgroup() {
  const companyId = 1; // 根据实际情况替换
  const companyIdString = companyId.toString();
  // 从接口获取团队数据并更新表格
  const response = await fetch(
    `http://localhost:8080/api/group/all`,
    {
      method: "GET",
      headers: {
        Authorization: token.value,
        companyId: companyIdString,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  // 初始化表格数据
  tableData.value = [];

  // 遍历每个上级团队，获取其子团队数据
  for (let department of data.data) {
    // 提取上级团队数据中的所需字段，组织成适合在表格中渲染的格式
    const parentFormattedData = {
      id: department.id,
      description: department.desc,
      name: department.name,
      number: department.memberNum,
      manager: department.managerName,
      tasks: department.deptNum,
      isParent: true,
      children: [], // 初始化子团队数组
      expanded: true,
      grandchildren: [],
      haschildren: false,
      expandchild: true,
    };

    // 将上级团队数据添加到表格数据中
    tableData.value.push(parentFormattedData);

  }
}



//搜索功能
const searchKeyword = ref(""); // 用于存储搜索关键字

// 使用计算属性过滤表格数据以匹配搜索关键字
const filteredTableData = computed(() => {
  // 如果搜索关键字为空，则返回原始表格数据
  if (!searchKeyword.value.trim()) {
    return tableData.value;
  }

  // 否则，使用搜索关键字过滤表格数据
  return filterDepartments(tableData.value);
});

// 递归过滤团队数据，包括子团队和孙子团队
function filterDepartments(departments: any) {
  return departments.reduce((filtered: any, department: any) => {
    if (department.name.includes(searchKeyword.value.trim())) {
      // 如果当前团队名称匹配搜索关键字，则将其添加到过滤后的数组中
      filtered.push(department);
    } else if (department.children && department.children.length > 0) {
      // 递归过滤子团队，并保留原始的团队结构和样式
      const filteredChildren = filterDepartments(department.children);
      if (filteredChildren.length > 0) {
        const parentClone = { ...department }; // 克隆父团队对象
        parentClone.children = filteredChildren; // 用过滤后的子团队替换原始的子团队
        filtered.push(parentClone); // 将父团队及其过滤后的子团队添加到过滤后的数组中
      }
    }
    return filtered;
  }, []);
}
</script>

<style scoped>
.model {
  background-color: white;
}

.functions {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: space-between;
  /* 水平分散对齐 */
}

.SearchDept {
  width: 290px;
  height: 37px;
  margin-left: 2%;
  margin-top: 2%;
  border: 1px solid #bbbbbb;
  border-radius: 10px;
  font-size: 16px;
  padding-left: 2.5%;
  background-image: url("@/assets/deptimgs/search.png");
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: 10px center;
  /* 调整图标与文字之间的间距 */
}

.SearchDept:focus {
  outline: none;
}

.buttons {
  margin-top: 2%;
  display: flex;
  justify-content: space-between;
  /* 元素之间均匀分布 */
  margin-right: 1%;
}

.buttons>* {
  margin-left: 12px;
  /* 元素之间的间距 */
}

.export {
  width: 95px;
  height: 25px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bolder;
  cursor: pointer;
}

.delete,
.import,
.create {
  width: 95px;
  height: 25px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bolder;
  cursor: pointer;
}

.export {
  background-color: rgba(52, 199, 88, 0.12);
  color: #34c758;
}

.delete {
  background-color: rgba(255, 58, 48, 0.12);
  color: #ff3a30;
}

.import {
  width: 131px;
  background-color: rgba(175, 82, 222, 0.12);
  color: #af52de;
}

.create {
  background-color: rgba(87, 86, 215, 0.12);
  color: #5756d7;
}

/* 弹窗淡入淡出动画 */
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
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
  width: 200px;
}

td {
  padding: 20px;
  text-align: center;
}

.manager,
.number {
  font-weight: bold;
  /* 设置字体加粗 */
}

.AddChildDept {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 18px;
  cursor: pointer;
}

.Detail {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10%;
  outline: none;
  /* 去掉点击时的外边框 */
  box-shadow: none;
  /* 去掉点击时的阴影效果 */
}

.optionsimg {
  vertical-align: middle;
  /* 设置垂直居中对齐 */
  margin-left: 12%;
  margin-top: -2%;
  cursor: pointer;
}

.popup {
  width: 170px;
  height: 130px;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 垂直居中 */
}

.movedept,
.exportmember,
.deletedept {
  margin-left: 8%;
  margin-top: auto;
  margin-bottom: auto;
  width: max-content;
  background-color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10%;
  outline: none;
  /* 去掉点击时的外边框 */
  box-shadow: none;
  /* 去掉点击时的阴影效果 */
  text-align: center;
  font-family: "SiYuanHeiTi";
}
.expand-btnfortop {
  background-color: white;
  border: none;
  cursor: pointer;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-bottom: 2.8%;
  margin-right: 3%;
}

.expand-btn {
  background-color: white;
  border: none;
  cursor: pointer;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-bottom: 2.8%;
  margin-right: -15%;
  margin-left: 8%;
}

.checkbox {
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 2%;
}

.checkbox2 {
  margin-left: 20%;
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 4%;
}

.checkbox3 {
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 2%;
  margin-left: 30%;
}

/* css 复选框 */
input[type=checkbox] {
  cursor: pointer;
  position: relative;
}

input[type=checkbox]::after {
  position: absolute;
  top: 0;
  background-color: #fff;
  color: #fff;
  width: 14px;
  height: 14px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 2px;
  box-sizing: border-box;
  border: 1px solid #ddd;
}

input[type=checkbox]:checked::after {
  content: "";
  background-color: #FF6200;
  border-color: #FF6200;
  background-color: #FF6200;
}

input[type=checkbox]:checked::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  z-index: 1;
}

/* 子团队折叠/展开动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-40%);
}

tbody td:first-child {
  padding: 0%;
  vertical-align: center;
  text-align: left;
  /* 将文本左对齐 */
  padding-left: 3%;
}
</style>
