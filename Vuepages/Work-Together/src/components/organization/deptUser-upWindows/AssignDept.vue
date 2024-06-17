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
        <div class="selectcontainer"><select class="departmentselect" v-model="selectedDepartmentName">
          <option v-for="(department, index) in departmentNames" :key="index">
            {{ department }}
          </option>
        </select></div>
        
        <div class="buttoncontainer">
          <button class="create" @click="handleAssignClick">确定变更</button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {Authorization} from "@/store/token"
import { UserInfo } from "@/store/userinfo";
const userInfo = UserInfo();
const tokens = Authorization();

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
  user: {
    type: Object,
    default: () => ({}),
  },
});
// 使用ref创建响应式属性来存储选中的部门名称和ID
const selectedDepartmentName = ref('');
const selectedDepartmentId = ref();
watch(selectedDepartmentName, (newValue, oldValue) => {
    const index = props.departmentNames.indexOf(newValue);
    selectedDepartmentId.value = props.departmentIds[index];
    console.log(index);
    console.log(selectedDepartmentId.value);
    
});
const companyId = userInfo.value.companyId; // 根据实际情况替换
const companyIdString = companyId.toString();
//请求变更
function handleAssignClick() {
  const url = 'http://localhost:8080/api/dept/updateUserDept';
  let FormattedData = {
    uid: props.user.id,
    did: selectedDepartmentId.value
  }
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': tokens.value,
      'companyId': companyIdString
    },
    body: JSON.stringify(FormattedData)
  })
    .then(response => {
      console.log(response);
      // 检查响应状态
      if (response.ok) {
          // 数据成功发送到服务器
          console.log('Dept assign successfully.');
          location.reload();//刷新页面
      } else {
          // 数据发送失败
          console.error('Failed to delete data to server.');
          alert("变更失败！");
      }
    })
    .then(data => {
      console.log(data);
      // 处理响应数据
    })
    .catch(error => {
      console.error('Error:', error);
      // 处理错误
    });
}
onMounted(() => {
  selectedDepartmentName.value = props.user.deptName;
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