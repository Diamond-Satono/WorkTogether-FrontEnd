<template>
  <div class="container">
    <div class="title">
      部门详情
      <img src="@/assets/deptimgs/closeModal.png" class="closeModal" @click="CloseModal" />
    </div>
    <div class="cutoff1"></div>
    <div class="depttitle">
      <img class="nameimg" src="@/assets/deptimgs/depttitle.png" />
      <span class="depttitlename">{{ props.row.name }}</span>
    </div>
    <div class="cutoff2"></div>
    <!-- 显示详情 -->
    <div v-if="showDetail">
      <div class="detail1">
        <div class="deptbelong">部门所属</div>
        <div class="deptbelongname">{{ ParentDeptName }}</div>
      </div>
      <div class="detail2">
        <div class="deptname">部门名称</div>
        <div class="deptdetailname">{{ props.row.name }}</div>
      </div>
      <div class="detail3">
        <div class="deptmanager">部门负责人</div>
        <div class="deptdetailmanager">{{ props.row.manager }}</div>
      </div>
      <div class="detail4">
        <div class="managerphone">部门负责人联系电话</div>
        <div class="detailmanagerphone">12345678910</div>
      </div>
      <div class="buttoncontainer1">
        <button class="edit" @click="toggleEditMode">编辑信息</button>
      </div>
    </div>
    <!-- 显示编辑信息 -->
    <div v-else>
      <div class="detail1">
        <div class="deptbelong">部门所属</div>
        <input class="deptbelongname  custom-input" type="text" v-model="ParentDeptName" />
      </div>
      <div class="detail2">
        <div class="deptname">部门名称</div>
        <input class="deptdetailname  custom-input" type="text" v-model="props.row.name" />
      </div>
      <div class="detail3">
        <div class="deptmanager">部门负责人</div>
        <select v-model="selectedMember" class="select">
          <option v-for="member in members" :key="member.id" :value="member.name">{{ member.name }}</option>
        </select>
      </div>
      <div class="detail4">
        <div class="managerphone">部门负责人联系电话</div>
        <div class="detailmanagerphone">12345678910</div>
      </div>
      <div class="buttoncontainer2">
        <button class="cancel" @click="canceledit">取消</button>
        <button class="save" @click="saveAndCloseModal">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Authorization } from "@/store/token";
import { ref, onMounted } from "vue";
const emit = defineEmits(["close-modal","refresh-table"]);
//获取父组件参数
const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
});

console.log(props.row);
console.log(props.row.parentid);

const showDetail = ref(true);

function toggleEditMode() {
  showDetail.value = !showDetail.value;
}

function canceledit() {
  showDetail.value = !showDetail.value;
}

const token = Authorization();

const parentId = ref(props.row.parentid);

const deptId = parentId.value;

const ParentDeptName = ref('');

const selectedMember = ref('');

const members = ref([] as any[]); // 用于存储成员数据

onMounted(() => {
  fetchDepartmentById();
  fetchUserData();
  selectedMember.value = props.row.manager;
  console.log('selectedMember.value', selectedMember.value);

});

// 获取指定部门ID的数据
function fetchDepartmentById() {
  const companyId = 1; // 公司ID，这里暂时设为1
  try {
    const response = fetch(`http://localhost:8080/api/dept/selectByID?deptId=${deptId}`, {
      method: "GET",
      headers: {
        Authorization: token.value,
        companyId: companyId.toString(),
      },
    });

    if (response) {
      // 如果请求成功，解析并返回部门数据
      response.then((res) => {
        if (res.ok) {
          // 如果响应成功，解析响应体并赋值给 ParentDeptName
          res.json().then((data) => {
            console.log('上级部门名字：', data.data.name);
            ParentDeptName.value = data.data.name; // 将 data.name 的值赋给 ParentDeptName
          });
        } else {
          console.error("Failed to fetch department data");
        }
      });
    } else {
      // 如果请求失败，根据实际需求处理错误
      console.error("Failed to fetch department data");
    }
  } catch (error) {
    // 处理异常情况
    console.error("An error occurred:", error);
  }
}

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
      members.value = data.data;
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      // Handle the error, e.g., show a message to the user
    });
}

//更新部门信息
function updateDepartmentInfo() {
  const companyId = 1; // 公司ID，这里暂时设为1
  // 获取选中的部门负责人的ID
  const selectedManager = members.value.find(member => member.name === selectedMember.value);

  const managerId = selectedManager ? selectedManager.id : '';

  const url = `http://localhost:8080/api/dept/updateDeptInfo?id=${props.row.id}&deptName=${encodeURIComponent(props.row.name)}&FatherDeptName=${encodeURIComponent(ParentDeptName.value)}&managerId=${encodeURIComponent(managerId)}`;

  const requestData = {
    deptName: props.row.name, // 部门名称，从 props 中获取
    FatherDeptName: ParentDeptName.value, // 部门所属，从 ParentDeptName 中获取
    managerId: managerId, // 部门负责人ID
    id: props.row.id, // 部门ID，从 props 中获取
  };
  console.log(requestData);

  // 发送 POST 请求
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value,
      'companyId': companyId.toString(),
    },
    body: JSON.stringify({}),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update department info');
      }
      // 在这里处理响应，例如刷新页面或者显示成功消息
      console.log(requestData);
    })
    .catch(error => {
      console.error('Error updating department info:', error);
      // 处理错误，例如显示错误消息给用户
    });
}
function saveAndCloseModal() {

  updateDepartmentInfo();
  // 触发关闭模态框的事件

  emit("close-modal");
  emit("refresh-table");
}

function CloseModal(){
  emit("close-modal");
}
</script>

<style scoped>
.container {
  position: fixed;
  /* 定位在屏幕上方 */
  top: 0;
  right: 0;
  width: 35%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  border-left: 1px solid #bbbbbb;
}

.title {
  font-family: "SiYuanHeiTi";
  font-size: 25px;
  margin-left: 7%;
  margin-top: 5%;
}

.closeModal {
  width: 30px;
  height: 30px;
  cursor: pointer;
  vertical-align: middle;
  /* 设置垂直居中对齐 */
  margin-top: -1%;
  margin-left: 70%;
}

.cutoff1 {
  border-top: 1px solid #bbbbbb;
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

.depttitle {
  font-size: 25px;
  margin-top: 4%;
  margin-left: 9%;
  display: flex;
}

.nameimg {
  width: 80px;
  height: 80px;
  margin-right: 7%;
}

.depttitlename {
  margin-top: 7%;
}

.cutoff2 {
  border-top: 1px solid #bbbbbb;
  margin-top: 4%;
  margin-left: 5%;
  margin-right: 5%;
}

.detail1 {
  margin-top: 12%;
  margin-left: 10%;
}

.deptbelong,
.deptname,
.deptmanager,
.managerphone {
  color: #8e8e93;
  font-size: 25px;
  font-family: "SiYuanHeiTi";
}

.deptbelongname,
.deptdetailname,
.deptdetailmanager,
.detailmanagerphone {
  margin-top: 2%;
  font-family: "alibaba";
  font-size: 22px;
}

.detail2,
.detail3,
.detail4 {
  margin-top: 5%;
  margin-left: 10%;
}

.buttoncontainer1 {
  margin-top: 10%;
  margin-left: 62%;
}

.edit {
  width: 195px;
  height: 52px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
}

.custom-input {
  width: 558px;
  height: 50px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  box-sizing: border-box;
}

.custom-input:focus {
  outline: none;
}

.buttoncontainer2 {
  margin-top: 10%;
  margin-left: 50%;
  display: flex;
}

.cancel {
  width: 120px;
  height: 52px;
  border-radius: 10px;
  color: black;
  background-color: white;
  font-size: 20px;
  border: #BBBBBB solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
}

.save {
  width: 120px;
  height: 52px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
  margin-left: 10%;
}

.select {
  width: 558px;
  height: 50px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 22px;
  margin-top: 2%;
}

.select:focus {
  outline: none;
}
</style>