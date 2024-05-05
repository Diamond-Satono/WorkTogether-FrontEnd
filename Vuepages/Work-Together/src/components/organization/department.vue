<template>
  <div class="container">
    <div class="model">
      <div class="functions">
        <input class="SearchDept" type="text" placeholder="搜索部门名" />
        <div class="buttons">
          <img src="@/assets/deptimgs/export.png" />
          <button class="export">批量导出</button>
          <img src="@/assets/deptimgs/delete.png" />
          <button class="delete" @click="showBatchDelete">批量删除</button>
          <img src="@/assets/deptimgs/import.png" />
          <button class="import">Excel批量导入</button>
          <img src="@/assets/deptimgs/create.png" />
          <button class="create" @click="showCreateDept">新建部门</button>
        </div>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>部门名称</th>
              <th>部门人数</th>
              <th>部门负责人</th>
              <th>部门待分配任务数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 在这里添加你的数据行 -->
            <tr v-for="(row, index) in tableData" :key="index">
              <td>{{ row.name }}</td>
              <td class="number">{{ row.number }}</td>
              <td class="manager">{{ row.manager }}</td>
              <td>{{ row.tasks }}</td>
              <td>
                <!-- 只有第一行才渲染添加子部门按钮 -->
                <template v-if="index === 0">
                  <button class="AddChildDept" @click="showCreateSubDept">
                    添加子部门
                  </button>
                </template>
                <!-- 其他行渲染默认样式的操作 -->
                <template v-else>
                  <button class="Detail" @click="showDeptDetail(row)">
                    详情
                  </button>
                  <button class="AddChildDept" @click="showCreateSubDept">
                    添加子部门
                  </button>
                  <img
                    src="@/assets/deptimgs/options.png"
                    class="optionsimg"
                    @click.stop="updatePopupPosition(row,$event)"
                  />
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 动态加载组件 -->
    <Transition :name="transitionName" mode="out-in">
      <component
        :is="currentModal"
        v-if="currentModal"
        @close-modal="closeModal"
        :row="currentRowData"
        :departmentNames="departmentNames"
      ></component>
    </Transition>
    <!-- 操作选项弹窗 -->
    <Transition :name="transitionName" mode="out-in"
      ><div
        class="popup"
        :style="{
          top: popupPosition.top + 'px',
          left: popupPosition.left + 'px',
        }"
        v-if="showPopup"
      >
        <button class="movedept" @click="showMoveDept">移动部门到</button
        ><button class="exportmember">导出成员</button
        ><button class="deletedept" @click="showDeleteDept(currentRowData)" >删除部门</button>
      </div></Transition
    >
  </div>
</template>
  
<script setup lang="ts">
import { ref, Transition, computed, onMounted, onUnmounted } from "vue";
import { Authorization } from "@/store/token";
const token = Authorization();
const currentModal = ref("");
const transitionName = ref("fade");
const tableData = ref([
  { name: "深圳大学一级分部", number: 10, manager: "张三", tasks: 5 },
  { name: "深圳大学二级分部", number: 15, manager: "李四", tasks: 8 },
  { name: "深圳大学三级分部", number: 12, manager: "王五", tasks: 7 },
  { name: "深圳大学四级分部", number: 20, manager: "小明", tasks: 6 },
]);
const currentRowData = ref("");
function showBatchDelete() {
  currentModal.value = "BatchDelete";
  console.log("currentModal=", currentModal.value);
}

function showCreateDept() {
  currentModal.value = "CreateDept";
  console.log("currentModal=", currentModal.value);
}

function showCreateSubDept() {
  currentModal.value = "CreateSubDept";
  console.log("currentModal=", currentModal.value);
}

function showMoveDept() {
  currentModal.value = "MoveDept";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}

function showDeleteDept(currentRowData: any) {
  currentModal.value = "DeleteDept";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}

function showDeptDetail(row: any) {
  transitionName.value = "slide-fade"; // 设置 transitionName 的值为 "slide-fade"
  currentModal.value = "DeptDetail";
  console.log("currentModal=", currentModal.value);
  currentRowData.value = row;
  console.log("详情", row);
}

//获取所有部门名字
const departmentNames = computed(() => {
  return tableData.value.map(row => row.name);
});

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

function updatePopupPosition(row : any,event:MouseEvent) {
  showPopup.value = !showPopup.value; // 点击时切换弹窗的显示状态
  const rect = (event.target as HTMLElement).getBoundingClientRect(); // 获取元素的位置信息
  popupPosition.value = {
    top: rect.bottom + 20, // 设置弹窗的垂直位置
    left: rect.left - 170, // 设置弹窗的水平位置
  };
  currentRowData.value = row; // 保存行数据
  console.log('currentRowData.value=',currentRowData.value);
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
</script>

<style scoped>
.model {
  background-color: white;
}
.functions {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 水平分散对齐 */
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
  background-position: 10px center; /* 调整图标与文字之间的间距 */
}
.SearchDept:focus {
  outline: none;
}
.buttons {
  margin-top: 2%;
  display: flex;
  justify-content: space-between; /* 元素之间均匀分布 */
  margin-right: 1%;
}
.buttons > * {
  margin-left: 12px; /* 元素之间的间距 */
}
.export {
  width: 95px;
  height: 25px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bolder;
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
  font-weight: bold; /* 设置字体加粗 */
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
  height: 190px;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
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
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
  text-align: center;
  font-family: 'SiYuanHeiTi';
}
</style>
