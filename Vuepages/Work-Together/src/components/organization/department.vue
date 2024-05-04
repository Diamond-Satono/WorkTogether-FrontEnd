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
              <div class="scrollable-columns">
                <th>部门人数</th>
                <th>部门负责人</th>
                <th>部门待分配任务数</th>
              </div>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 在这里添加你的数据行 -->
            <tr>
              <td>部门1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>操作1</td>
            </tr>
            <tr>
              <td>部门2</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>操作2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 动态加载组件 -->
    <Transition name="fade" mode="out-in">
      <component
        :is="currentModal"
        v-if="currentModal"
        @close-modal="closeModal"
      ></component>
    </Transition>
  </div>
</template>
  
<script setup lang="ts">
import { ref, Transition } from "vue";
import {Authorization} from "@/store/token"
const token = Authorization();
const currentModal = ref("");

function showBatchDelete() {
  currentModal.value = "BatchDelete";
  console.log("currentModal=", currentModal.value);
}

function showCreateDept() {
  currentModal.value = "CreateDept";
  console.log("currentModal=", currentModal.value);
}

function closeModal() {
  currentModal.value = "";
  console.log("ModalClosed");
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
.scrollable-columns {
  min-width: 1000px;
  overflow-x: auto; /* 让表格水平滚动 */
}
</style>
