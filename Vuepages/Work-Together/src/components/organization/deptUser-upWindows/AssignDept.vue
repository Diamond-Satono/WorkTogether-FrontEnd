<template>
  <div class="root">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="title">
        变更部门<img
          src="@/assets/deptimgs/closeModal.png"
          class="closeModal"
          @click="$emit('close-modal')"
        />
      </div>
      <div class="cutoff"></div>
      <div class="maincontent">
        <!-- 插入下拉栏 -->
        <div class="selectcontainer"><select class="departmentselect">
          <option v-for="(department, index) in departmentNames" :key="index">
            {{ department }} {{ departmentIds[index] }}
          </option>
        </select></div>
        
        <div class="buttoncontainer">
          <button class="create" @click="$emit('close-modal')">确定变更</button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { ref } from "vue";

//获取父组件参数
const props = defineProps({
  departmentNames: {
    type: Array,
    default: () => [],
  },
  departmentIds: {
    type: Array,
    default: () => [],
  },
});
</script>
    
<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(229, 229, 229, 0.56);
  z-index: 1000;
}
.modal-content {
  width: 600px;
  height: 380px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 1001;
}
.title {
  font-family: "SiYuanHeiTi";
  font-size: 25px;
  margin-left: 3%;
}
.closeModal {
  width: 30px;
  height: 30px;
  cursor: pointer;
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-top: -1%;
  margin-left: 77.4%;
}
.cutoff {
  border-top: 1px solid #bbbbbb;
  margin-top: 2%;
}
.selectcontainer{
  margin-top: 10%;
  text-align : center;
}
.departmentselect{
  width: 90%;
  height: 47px;
  font-size: 20px;
  border-radius: 10px;
  padding-left: 3%;
  font-family: 'SiYuanHeiTi';
  border: #bbbbbb solid 1px;
}
.departmentselect:focus{
  outline: none;
}
.buttoncontainer {
  margin-top: 22%;
  text-align: center;
}
.create {
  width: 90%;
  height: 47px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  margin-top: 4%;
}
</style>