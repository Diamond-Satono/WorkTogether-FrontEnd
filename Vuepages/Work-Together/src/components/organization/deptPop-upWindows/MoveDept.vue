<template>
  <div class="root">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="title">
        移动部门<img src="@/assets/deptimgs/closeModal.png" class="closeModal" @click="$emit('close-modal')" />
      </div>
      <div class="cutoff"></div>
      <div class="maincontent">
        <!-- 插入下拉栏 -->
        <div class="selectcontainer"><select class="departmentselect" v-model="FatherDeptName">
            <option v-for="(department, index) in departmentNames" :key="index">
              {{ department }}
            </option>
          </select></div>

        <div class="buttoncontainer">
          <button class="create" @click="saveandclose">确定变更</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Authorization } from "@/store/token";
import { ref,onMounted } from "vue";
const token = Authorization();
const emit = defineEmits(["close-modal", "refresh-table"]);
const managerId = ref(''); // 创建ref用于存储managerId
const FatherDeptName = ref('') as { value: string }; // 创建ref用于存储选中的部门
//获取父组件参数
const props = defineProps({
  departmentNames: {
    type: Array,
    default: () => [],
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});


onMounted(() => {
  fetchUserData();
  console.log('managerId.value', managerId.value);

});

function saveandclose() {
  updateDepartmentInfo()
  emit("close-modal");
  emit("refresh-table");
}

//拉取成员列表
function fetchUserData() {
  const companyId = 1;
  const url = 'http://localhost:8080/api/company_user/getAllMember/1';
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
      const managerName = props.row.manager; // 从 props 中获取 manager 姓名
      const manager = data.data.find((member: { id: string, name: string }) => member.name === managerName); // 在成员列表中查找 manager
      if (manager) {
        managerId.value = manager.id; // 找到了对应的 manager，将其 ID 赋值给 managerId
      } else {
        console.error('Manager not found in user data:', managerName);
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      // Handle the error, e.g., show a message to the user
    });
}

//更新部门信息
function updateDepartmentInfo() {
  const companyId = 1; // 公司ID，这里暂时设为1

  const url = `http://localhost:8080/api/dept/updateDeptInfo?id=${props.row.id}&deptName=${encodeURIComponent(props.row.name)}&FatherDeptName=${encodeURIComponent(FatherDeptName.value)}&managerId=${encodeURIComponent(managerId.value)}`;

  const requestData = {
    deptName: props.row.name, // 部门名称，从 props 中获取
    FatherDeptName: FatherDeptName.value, // 部门所属中获取
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
  margin-left: 77.4%;
}

.cutoff {
  border-top: 1px solid #bbbbbb;
  margin-top: 2%;
}

.selectcontainer {
  margin-top: 10%;
  text-align: center;
}

.departmentselect {
  width: 90%;
  height: 47px;
  font-size: 20px;
  border-radius: 10px;
  padding-left: 3%;
  font-family: 'SiYuanHeiTi';
  border: #bbbbbb solid 1px;
}

.departmentselect:focus {
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