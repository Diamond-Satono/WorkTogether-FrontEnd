<template>
    <div class="root">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="title">
          分配角色<img
            src="@/assets/deptimgs/closeModal.png"
            class="closeModal"
            @click="$emit('close-modal')"
          />
        </div>
        <div class="cutoff"></div>
        <div class="maincontent">
          <!-- 下拉多选功能 -->
          <div class="selectcontainer">
            <br>
            <el-select class="rolesselect" 
              v-model="selectedroleIds"
              multiple
              collapse-tags
              filterable
              placeholder="请选择角色"
              @change="handleRoleChange"
              clearable
            >
              <el-option v-for="role in allroles" :key="role.id" :label="role.name" :value="role.id"></el-option>
            </el-select>

          </div>
          
          <div class="buttoncontainer">
            <button class="assifnbtn" @click="handleAssignClick">确定分配</button>
          </div>
        </div>
      </div>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, ref } from "vue";
import 'element-plus/dist/index.css';
import {Authorization} from "@/store/token"
import { UserInfo } from "@/store/userinfo";
const token = Authorization();
const userInfo = UserInfo();
const companyId = userInfo.value.companyId;
const companyIdString = companyId.toString();
const groupId = ref(userInfo.value.groupId);


//获取父组件参数
const props = defineProps({
    user: {
      type: Object,
      default: () => ({}),
    },
});
console.log(props.user);

const allroles = ref([
  {
    id: 0,
    name: "string1",
    describe: "string",
    createTime: "string",
    userNum: "string",
    status: "string"
  },
  {
    id: 1,
    name: "string2",
    describe: "string",
    createTime: "string",
    userNum: "string",
    status: "string"
  },
  {
    id: 2,
    name: "string3",
    describe: "string",
    createTime: "string",
    userNum: "string",
    status: "string"
  }
]);

//获得公司所有角色
function fetchAllRoleData() {  
  const url = `http://localhost:8080/api/auth/cid/${companyId}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value,
      'companyId': companyIdString
    }
  })
  .then(response => {
    console.log(response);
    // 检查响应状态
    if (!response.ok) {
      alert("拉取所有角色失败！");
      throw new Error('Network error');
    }
    // 解析响应为 JSON 格式
    return response.json();
  })
  .then(data => {
    // 处理响应数据
    allroles.value = data.data;
    console.log("allroles.value=", allroles.value);
  })
  .catch(error => {
    console.error('Error fetching allroles data:', error);
  });
}
//当前用户的角色
const myrole = ref([
  {
    id: 1,
    name: "string1",
    describe: "string",
    createTime: "string",
    userNum: "string",
    status: "string"
  },
]);
// 使用ref创建响应式属性来存储选中的角色id
const selectedroleIds = ref(myrole.value.map(role => role.id));
function handleRoleChange() {
  console.log("选中城市id:" + selectedroleIds.value);
}
//获取当前用户的角色
function fetchMyRoleData() {  
  const url = `http://localhost:8080/api/userAndRole/${props.user.id}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value,
      'companyId': companyIdString
    }
  })
  .then(response => {
    console.log(response);
    // 检查响应状态
    if (!response.ok) {
      alert("拉取当前用户的角色失败！");
      throw new Error('Network error');
    }
    // 解析响应为 JSON 格式
    return response.json();
  })
  .then(data => {
    // 处理响应数据
    myrole.value = data.data;
    console.log("myrole.value=", myrole.value);
    selectedroleIds.value = myrole.value.map(role => role.id);
    console.log("selectedroleIds.value=", selectedroleIds.value);
    
  })
  .catch(error => {
    console.error('Error fetching myrole data:', error);
  });
}
// 分配角色
function handleAssignClick() {
  const url = `http://localhost:8080/api/userAndRole`;
  const body = {
    userId: props.user.id,
    roleIds: selectedroleIds.value
  };
  console.log("body=", body);
  // 发送请求
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value,
      'companyId': companyIdString
    },
    body: JSON.stringify(body)
  })
  .then(response => {
    console.log(response);
    // 检查响应状态
    if (!response.ok) {
      console.log("分配角色失败！");
      throw new Error('Network error');
    } else {
      // 数据成功发送到服务器
      console.log('SelectedRoles assign successfully.');
      location.reload();//刷新页面
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching SelectedRoles data:', error);
  });
}
onMounted(() => {
  fetchAllRoleData();
  fetchMyRoleData();
  // selectedGroup.value = props.group;
  // console.log(selectedGroup.value);
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
.rolesselect{
  width: 300px;
  height: 40px;
}
.rolesselect:focus{
outline: none;
}
.buttoncontainer {
margin-top: 16%;
text-align: center;
}
.assifnbtn {
width: 40%;
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