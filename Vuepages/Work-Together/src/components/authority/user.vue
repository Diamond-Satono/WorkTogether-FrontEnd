<template>
  
  <div class="container">
    <!-- 功能栏 -->
    <div class="model-bar">
      <div class="search-bar">
        <div class="input-container">
          <img src="@/assets/authority-user/search-icon.png" alt="Icon">
          <input type="text" placeholder="编号、用户名、邮箱、电话" v-model="searchText">
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="model-content">
      <table>
        <!-- Table structure and data -->
        <thead>
        <tr>
          <!-- <th></th> -->
          <th>编号</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>电话</th>
          <th>注册时间</th>
          <th>最后登录</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <!-- Sample row -->
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.createTime }}</td>
          <td>{{ user.lastLoginTime }}</td>
          <td>
            <button class="detail_button" @click="showAssignRoles(user)">分配角色</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="up-down">
      <div>
        <button v-if="currentPage === 1" style="margin-right: 15px;" disabled>上一页</button>
        <button @click="upData" v-if="currentPage !== 1" style="cursor: pointer;margin-right: 15px;">上一页</button>
        <span style="color: #1684FC;">{{currentPage}}</span>/{{ totalPage }}
        <button @click="dowmData" v-if="hasMore" style="cursor: pointer; margin-left: 15px;">下一页</button>
        <button v-if="!hasMore" style="cursor: pointer; margin-left: 15px;" disabled>下一页</button>
      </div>
    </div>
  </div>
  <!-- 弹窗组件 -->
  <component :is="currentModal" v-if="currentModal"
    @close-modal="closeModal"
    :user="currentRowData">
  </component>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {Authorization} from "@/store/token";
import { UserInfo } from "@/store/userinfo";
const token = Authorization();
const userInfo = UserInfo();
const companyId = userInfo.value.companyId;
const companyIdString = companyId.toString();
const groupId = ref(userInfo.value.groupId);
//所有用户列表
const allUserList = ref([
  {
    id: 1,
    email: "2484101884@qq.com",
    name: "测试账号",
    phone: "12345678910",
    sex: 3,
    avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
    lastLoginTime: "2024-06-03 06:26:16",
    createTime: "2024-05-08 11:02:55"
  },
  {
    id: 2,
    email: "2954579687@qq.com",
    name: "小王",
    phone: "12345648326",
    sex: 3,
    avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
    lastLoginTime: "2024-07-03 08:26:16",
    createTime: "2024-09-08 17:02:33"
  }
]);
//当前页面用户列表
const UserList = ref([
  {
    id: 1,
    email: "2484101884@qq.com",
    name: "测试账号",
    phone: "12345678910",
    sex: 3,
    avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
    lastLoginTime: "2024-06-03 06:26:16",
    createTime: "2024-05-08 11:02:55"
  },
  {
    id: 2,
    email: "2954579687@qq.com",
    name: "小王",
    phone: "12345648326",
    sex: 3,
    avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
    lastLoginTime: "2024-07-03 08:26:16",
    createTime: "2024-09-08 17:02:33"
  }
]);
// 根据搜索关键词过滤用户列表
const searchText = ref("");
const filteredUsers = computed(() => {
  const search = searchText.value.trim().toLowerCase();
  if (!search) return UserList.value;
  return UserList.value.filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.lastLoginTime.toLowerCase().includes(search) ||
    user.lastLoginTime.toLowerCase().includes(search)
  );
});
//总页数
const totalPage = ref(10);
//获取所有用户列表
function fetchAllUserData() {
  fetch(`http://localhost:8080/api/user/company/${companyId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
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
        // 请求成功，更新消息数据
        allUserList.value = data.data;
        console.log(token.value);  
        console.log("allUserList.value=", allUserList.value);
        console.log("allUserListize=", allUserList.value.length);
        totalPage.value = Math.ceil(allUserList.value.length / pageSize.value);
        fetchUserData();
    })
    .catch(error => {
        console.error('Error fetching allUserList data:', error);
    });
}
// 添加分页状态
const currentPage = ref(1);
const pageSize = ref(7); // 假设每页显示10条数据
const isLoading = ref(false);
const hasMore = ref(true);
//分页消息
async function fetchUserData() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    // 根据 activeTab 的值构建查询参数
    let queryParams = `pageNum=${currentPage.value}&pageSize=${pageSize.value}`;
    const response = await fetch(
      `http://localhost:8080/api/user/company/${companyId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token.value,
          'companyId': companyIdString,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    if (data.data.length < pageSize.value || currentPage.value * pageSize.value === allUserList.value.length) {
      hasMore.value = false;
    }

    UserList.value = data.data;
    //currentPage.value++; // 增加页码    
  } catch (error) {
    console.error('Error fetching UserList data:', error);
  } finally {
    isLoading.value = false;
  }
}
//下一页
function dowmData() {
  currentPage.value++;
  fetchUserData();
}
//上一页
function upData() {
  if(currentPage.value > 1) {
    currentPage.value--;
    hasMore.value = true;
    fetchUserData();
  }
}
//设置弹窗
const currentModal = ref("");
const currentRowData = ref('')
function showAssignRoles(user :any) {
  currentRowData.value = user;
  // currentModal.value = "GroupMemberDetail";
  currentModal.value = "assignRoles";
  console.log("currentModal=", currentModal.value);
}
//关闭弹窗
function closeModal() {
  currentModal.value = "";
  console.log("ModalClosed");
}
onMounted(() => {
  fetchAllUserData();
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.model-bar {
  padding: 1% 3% 0% 3%;
}
/* 搜索框 */
.search-bar{
  margin-top: 10px;
}
.input-container {
  display: flex;
  align-items: center; /* 垂直居中 */
}
.input-container input {
  border-radius: 5px;
  /* width: 80%; */
  height: 30px;
  font-size: 13px;
  border: 1px solid #BBBBBB;
  padding: 0 2%;
  margin-left: 7px;
}
.input-container input:focus {
  outline: none;
}
/* 列表样式 */
.model-content {
  padding: 1% 3%;
}
table {
    width: 100%;
    border-collapse: separate; /* 改变表格的边框合并方式 */
    border-spacing: 0; /* 设置单元格间距为0 */
    margin-top: 10px;
    background-color: #FFFFFF;
    border-radius: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  /* table-layout: fixed;  */
  
}
th {
  padding: 20px 0px;
  text-align: center;
  background-color: #f5f7fa;
  width: 14%;
  /* width: 70px; */
}
td {
  padding: 20px 0px;
  text-align: center;
}
/* 按钮 */
.detail_button {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 16px;
  cursor: pointer;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
/* 分页 */
.up-down {
  margin-top: 1%;
  position: fixed;
  bottom: 6%; 
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.up-down button {
  background-color: #FFFFFF;
  border: 1px solid #BBBBBB;
  border-radius: 2px;
  padding: 5px 10px;
  font-size: 16px
}
</style>