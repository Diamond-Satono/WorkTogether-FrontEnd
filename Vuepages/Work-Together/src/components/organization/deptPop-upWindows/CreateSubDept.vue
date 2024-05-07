<template>
  <div class="root">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="title">
        添加子部门<img src="@/assets/deptimgs/closeModal.png" class="closeModal" @click="$emit('close-modal')" />
      </div>
      <div class="cutoff"></div>
      <div class="maincontent">
        <div class="deptbelong">
          部门所属<span class="belong">{{ props.row.name }}</span>
        </div>
        <div class="deptname">
          部门名称<input type="text" placeholder="请填写部门名称" class="nameinput" />
        </div>
        <div class="deptprincipal">部门负责人<select v-model="selectedMember" class="select">
            <option value="" disabled selected>请选择部门负责人</option> <!-- 添加默认选项 -->
            <option v-for="member in members" :key="member.id" :value="member.name">{{ member.name }}</option>
          </select></div>
        <div class="buttoncontainer">
          <button class="create" @click="$emit('close-modal')">确定添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Authorization } from '@/store/token';
import { ref, onMounted } from 'vue';

//获取父组件参数
const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
});
console.log(props.row);
const token = Authorization();
const members = ref([] as any[]); // 用于存储成员数据
const selectedMember = ref('');

onMounted(() => {
  fetchUserData();
});

//拉取成员列表
function fetchUserData() {
  const companyId = 1;
  const url = 'http://localhost:8080/api/user/company/1';
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
      'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
      'companyId': companyId.toString(), // 设置 companyId 请求头，用于传递公司 ID
    }
  })
    .then(response => {
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
      console.log('成员数据：', data.data);
      members.value = data.data; // 将获取到的成员数据赋值给 members
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      // Handle the error, e.g., show a message to the user
    });
}




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
  vertical-align: middle;
  /* 设置垂直居中对齐 */
  margin-top: -1%;
  margin-left: 73%;
}

.cutoff {
  border-top: 1px solid #bbbbbb;
  margin-top: 2%;
}

.deptbelong {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 4%;
  margin-left: 6%;
}

.belonginput {
  margin-left: 6%;
  width: 425px;
  height: 40px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 20px;
  box-sizing: border-box;
}

.belonginput:focus {
  outline: none;
}

.deptname {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 5%;
  margin-left: 6%;
}

.nameinput {
  margin-left: 6%;
  width: 425px;
  height: 40px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 20px;
  box-sizing: border-box;
}

.nameinput:focus {
  outline: none;
}

.deptprincipal {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 5%;
  margin-left: 6%;
}

.confirmword:focus {
  outline: none;
}

.buttoncontainer {
  margin-top: 5%;
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

.select {
  margin-left: 2%;
  width: 425px;
  height: 40px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 20px;
}

.select:focus {
  outline: none;
}

.belong {
  margin-left: 6%;
}
</style>