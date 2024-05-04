<template>
  <div class="model">
    <div class="model-side">
      <div class="search-bar">
        <div class="input-container">
          <input type="text" placeholder="请输入成员名、邮箱、职位" v-model="searchText">
        </div>
      </div>
      <div>分级部门</div>
    </div>
    <div class="model-content">
      <div class="top-content">
        <div class="dept_title">
          v {{ departments.name }}
          <span style="color: #8E8E93;">({{ departments.member_num }}人)</span>
        </div>
        <div class="topbar-right">
            <img src="@/assets/img/batch-export.png" alt="Icon"><button class="bnt1"> 批量导出</button>
            <img src="@/assets/img/delsymbol.png" alt="Icon"><button class="bnt2"> 批量离职</button>
            <button class="invite-btn" @click="openAddMemberModal">添加成员</button>
        </div>
      </div>
      <table>
          <!-- Table structure and data -->
          <thead>
          <tr>
              <th><input type="checkbox" class="select-all"> <!-- 全选复选框 --></th>
              <th>成员</th>
              <th>邮箱</th>
              <th>部门</th>
              <th>职位</th>
              <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- Sample row -->
          <tr v-for="user in users" :key="user.id">
              <td><input type="checkbox" class="row-selector" v-model="user.selected"></td>
              <td class="memName">
                <!-- <img src="@/assets/img/icon.png" alt=""> -->
                {{ user.name }}
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.deptName }}</td>
              <td>{{ user.position }}</td>
              <td class="button-container">
                  <button class="detail_button">详情</button>
                  <button class="else_button">···</button>
              </td>
          </tr>
          </tbody>
      </table>
    </div>
    <!-- 点击添加成员后弹窗 -->
    <div class="modal-background" v-show="isAddMemberModalOpen"></div>
    <div class="add_menber_modal" v-show="isAddMemberModalOpen">
      <div class="add-content">
          <!-- 在这里放置弹窗内容 -->
          <span class="close" @click="closeModal">&times;</span>
          <p class="add_title">添加成员</p>
          <div class="emailname">
              <div class="email-container">
                  <span>邀请对象邮箱</span>
                  <br>
                  <br>
                  <input type="text" class="emailinput" placeholder="  请输入邮箱地址" v-model="newemail">
              </div>
          </div>
          <div class="confirmbutton">
              <button class="confirm">确认发送邀请码</button> 
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式可以根据需要进行修改 */
.model{
  width:95%;
  height: 100%;
  display: flex;
}
.model-side{
  width: 20%;
  height: 100%;
  border-right: 1px solid #BBBBBB;
}
.model-content{
  width: 75%;
  height: 100%;
}
/* 搜索框 */
.search-bar{
  margin-top: 10px;
  margin-bottom: 10px;
}
.input-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}.input-container input {
  border-radius: 5px;
  width: 80%;
  height: 20px;
  border: 1px solid #BBBBBB;
}
/* 分级部门 */

/* 列表顶部栏 */
.top-content{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
}
.dept_title{
  font-size: 20px;
  margin: 10px 20px;
}
.topbar-right {
  display: flex;
  align-items: center;
  /* margin-left: 250px; */
}

/* 设置顶部栏按钮的样式 */
.topbar-right .bnt1 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(52, 199, 88, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(52, 199, 88, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-right .bnt2 {
    width: 102px;
    height: 30px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(255, 58, 48, 0.12); /* 背景颜色，透明度为12% */
    color: rgba(255, 58, 48, 1); /* 文字颜色，不透明 */
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
.topbar-right img {
  margin-right: 5px; /* 图标与文字之间的右侧间距 */
  width: 25px;
  height: 25px;
  /* margin-top: 5px; */
}
.invite-btn {
    width: 152px;
    height: 35px;
    font-size: 15px;
    font-weight: bold;
    padding: 5px 10px;
    background-color: #FB682F;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-right: 15px;cursor: pointer; /* 鼠标悬停样式为手型 */
}
/* Table Styles */
table {
    width: 100%;
    border-collapse: separate; /* 改变表格的边框合并方式 */
    border-spacing: 0; /* 设置单元格间距为0 */
    margin-top: 10px;
    background-color: #FFFFFF;
    border-radius: 20px;
    /* Spacing above the table */
}

table,
th,
td {
    /* border: 1px solid #ccc; */
    border: 0; /* 移除所有边框 */
    font-size: 15px;
    text-align: center;
}

th {
    background-color: #F5F7FA;
    color: #101010;
    font-size: 16px;
    padding: 10px;
}

td {
    padding: 10px;
}

/* 复选框样式 */
input[type="checkbox"] {
    margin: 0; /* 移除默认的外边距 */
    padding: 0; /* 移除外边距 */
    height: 16px; /* 设置复选框的大小 */
    width: 16px; /* 设置复选框的大小 */
    vertical-align: middle; /* 垂直居中对齐 */
}

/* 全选复选框样式 */
.select-all {
    margin-right: 10px; /* 添加一些右边距 */
}

/* 行选择复选框样式 */
.row-selector {
    padding-left: 10px; /* 添加一些左边距，用于对齐文本 */
}

/* tr:nth-child(even) {
    background-color: #f2f2f2;
} */

/* Button Styles */
.button-container {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 3px;
}
.button-container .detail_button {
    /* padding: 5px 10px; */
    padding: 3% 5%;
    background-color: #FFFFFF;
    color: #FF6200;
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

.button-container .else_button {
    /* padding: 5px 10px; */
    padding: 3% 10%;
    background-color: #FFFFFF;
    color: #FF6200;
    border-radius: 20px;
    border: none;
    font-size: 20px;
    cursor: pointer;
}
/* 邀请成员弹窗 */
.modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: none; /* 初始不显示 */
}
.add_menber_modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    padding: 20px;
    border-radius: 5px;
    z-index: 10000;
    width: 400px;
    height: 230px;
    display: none; /* 初始不显示 */
    opacity: 0; /* 初始透明度为0 */
    transition: opacity 0.3s ease; /* 设置渐变动画 */
}

.close {
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

.add-content {
    padding: 20px;
    position: relative; /* 添加此行 */
}

.add_title {
    /* line-height: 20px; */
    font-size: 18px;
    color: #101010;
    position: absolute; /* 添加此行 */
    top: -5px; /* 添加此行 */
    left: 20px; /* 调整左边距 */
}

.emailname {
    text-align: center; /* 让输入框水平居中 */
    margin-top: 40px; /* 调整间距 */
    position: relative; /* 添加此行 */
}
.email-container{
    text-align: left;
    padding: 0 20%;
}

.emailinput {
    width: 200px; /* 设置输入框宽度 */
    border-radius: 5px;
    height: 25px;
    border: 1px solid #BBBBBB;
    color: #888888;
    font-size: 10px;
}

.confirmbutton {
    text-align: center; /* 按钮水平居中 */
    margin-top: 20px; /* 调整间距 */
}
.confirm {
    width: 130px;
    height: 32px;
    background-color: #FF6200;
    color: white;
    border: 2px solid #FF6200;
    border-radius: 10px;
    cursor: pointer;
}

</style>
  
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {Authorization} from "@/store/token"
  const tokens = Authorization();
  const searchText = ref("");
  const newemail = ref("");
  const departments = ref(
    {
      name: "深大计软学院",
      manager_id: 1,
      member_num: 53,
      describe: "non"
    });
  const users = ref([
    {
      id: 1,
      name: '张三',
      status: '正常',
      position: '前端工程师',
      email: 'zhangsan@example.com',
      deptName: '技术部', 
      selected: false
    },
    {
      id: 2,
      name: '李四',
      status: '正常',
      position: '后端工程师',
      email: 'lisi@example.com',
      deptName: '技术部',
      selected: false
    },
    // ... more users
  ]);
  // 添加成员弹窗的显示状态
  const isAddMemberModalOpen = ref(false);

  // 点击“invite-btn”按钮显示添加成员弹窗
  const openAddMemberModal = () => {
    isAddMemberModalOpen.value = true;
    const addmodal = document.querySelector('.add_menber_modal');
    const modalBackground = document.querySelector('.modal-background');
    addmodal.style.display = 'block';
    modalBackground.style.display = 'block';
    setTimeout(() => {
      addmodal.style.opacity = '1';
      modalBackground.style.opacity = '1';
    }, 50);
  };

  // 点击“close”按钮关闭添加成员弹窗
  const closeModal = () => {
    newemail.value = "";
    const addmodal = document.querySelector('.add_menber_modal');
    const modalBackground = document.querySelector('.modal-background');
    addmodal.style.opacity = '0';
    modalBackground.style.opacity = '0';
    setTimeout(() => {
      addmodal.style.display = 'none';
      modalBackground.style.display = 'none';
      isAddMemberModalOpen.value = false;
    }, 300);
  };
  //拉取成员列表
  function fetchUserData() {
      const url = 'http://localhost:8080/api/company_user/getAllMember/1';
      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
              'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
              'companyId': 1 // 设置 companyId 请求头，用于传递公司 ID
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
            // 请求成功，更新用户数据
            users.value = data.data;                    
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Handle the error, e.g., show a message to the user
        });
    }
  onMounted (() => {
    fetchUserData();
    // 获取搜索框元素-成员名
    const searchContent = document.querySelector('.input-container input[type="text"]');
    // 添加查询成员事件监听器-
    searchContent.addEventListener('keypress', function (event) {
        // 判断是否按下的是回车键
        if (event.key === 'Enter') {
            performSearchMember();
        }
    });
    // 定义查询功能函数
    function performSearchMember() {
        // 获取输入框中的关键字
        var keyword = searchContent.value.trim().toLowerCase();

        // 获取所有的表格行
        var rows = document.querySelectorAll('tbody tr');

        // 遍历每一行
        rows.forEach(function (row) {
            // 获取当前行的成员单元格的内容
            var memberName = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            // 获取当前行的邮箱单元格的内容
            var memberEmail = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            // 获取当前行的职位单元格的内容
            var memberPosition = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();

            // 如果角色名称包含关键字，则显示该行，否则隐藏该行
            if (memberName.includes(keyword) ||
                memberEmail.includes(keyword) ||
                memberPosition.includes(keyword)
                ) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
  });
</script>