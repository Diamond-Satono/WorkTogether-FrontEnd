<template>
  <div>
    <div class="content">
      <div class="search-filter-box">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="输入角色名进行查询" v-model="searchKeyword">
        </div>
      </div>
      <div class="separator"></div>
      <div class="data-list-box">
        <div class="data-list-title"><i class="fas fa-list"></i> 数据列表</div>
        <button class="btn-secondary" @click="openAddModal">添加</button>
      </div>
      <div class="separator"></div>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>角色名称</th>
            <th>描述</th>
            <th>添加时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in filteredRoles" :key="role.id">
            <td>{{ role.displayId }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.describe }}</td>
            <td>{{ role.createTime }}</td>
            <td><input class="ios-switch" type="checkbox" v-model="role.status" @change="updateStatus(role)"></td>
            <td class="button-container">
              <button class="assign_menu">分配菜单</button>
              <button class="assign_resource">分配资源</button>
              <button class="edit_button" @click="openEditModal(role)">编辑</button>
              <button class="delete_button" @click="confirmDelete(role.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Transition name="fade">
      <div v-if="isModalOpen">
        <div class="modal-background"></div>
        <div class="modal">
          <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <p class="add_title">{{ isEditing ? '编辑角色' : '添加角色' }}</p>
            <div class="rolename">
              <span>角色名称:</span>
              <input type="text" class="rolenameinput" v-model="currentRole.name">
            </div>
            <div class="role_describtion">
              <span>描述:</span>
              <textarea type="text" class="describtioninput" v-model="currentRole.describe"></textarea>
            </div>
            <div v-if="!isEditing" class="choosestatus">
              <span>是否启用:</span>
              <input id="yes" type="radio" v-model="currentRole.status" :value="true" /><label for="yes">是</label>
              <input id="no" type="radio" v-model="currentRole.status" :value="false" /><label for="no">否</label>
            </div>
            <div class="confirmbutton">
              <button class="confirm" @click="confirmModal">{{ isEditing ? '确定' : '添加' }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserInfo } from '@/store/userinfo';
import { Authorization } from '@/store/token';
interface Role {
  id: number
  name: string
  describe: string
  userNum: number
  createTime: string
  status: boolean
}
const token = Authorization();
const userInfo = UserInfo();
const companyId = userInfo.value.companyId;
const roles = ref<Role[]>([])
const searchKeyword = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentRole = ref<Role>({
  id: 0,
  name: '',
  describe: '',
  userNum: 0,
  createTime: '',
  status: true
})

const fetchRoles = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/auth/cid/${companyId}`, {
      headers: {
        'Authorization': token.value,
        'companyId': userInfo.value.companyId.toString()
      }
    })
    const data = await response.json()
    roles.value = data.data
    console.log("角色信息", roles.value);
  } catch (error) {
    console.error('发生错误:', error)
  }
}


const filteredRoles = computed(() => {
  return roles.value
    .filter(role =>
      role.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
    .map((role, index) => ({
      ...role,
      displayId: index + 1 // 添加虚拟自增 ID
    }))
})

const openAddModal = () => {
  isEditing.value = false
  currentRole.value = { id: 0, name: '', describe: '', userNum: 0, createTime: '', status: true }
  isModalOpen.value = true
}

const openEditModal = (role: Role) => {
  isEditing.value = true
  currentRole.value = { ...role }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const confirmModal = async () => {
  if (isEditing.value) {
    await updateRole()
  } else {
    await addRole()
  }
  closeModal()
}

const addRole = async () => {
  try {
    // 构建只包含 name 和 describe 的对象
    const roleToAdd = {
      name: currentRole.value.name,
      describe: currentRole.value.describe
    };

    const response = await fetch('http://localhost:8080/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'companyId': userInfo.value.companyId,
        'Authorization': token.value
      },
      body: JSON.stringify(roleToAdd) // 使用新的对象
    });

    if (response.ok) {
      console.log(roleToAdd);
      fetchRoles();
    } else {
      console.error('Failed to add role');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


const updateRole = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentRole.value)
    })
    if (response.ok) {
      fetchRoles()
    } else {
      console.error('Failed to update role')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const updateStatus = async (role: Role) => {
  try {
    const response = await fetch(`http://localhost:8080/api/auth`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: role.id, status: role.status })
    })
    if (!response.ok) {
      console.error('Failed to update status')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const confirmDelete = (id: number) => {
  if (window.confirm('确定要删除这个角色吗？')) {
    deleteRole(id);
  }
}

const deleteRole = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/auth/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      fetchRoles()
    } else {
      console.error('Failed to delete role')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(fetchRoles)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

body,
html {
  height: 100%;
  background: #f8f9fa;
}



.breadcrumbs {
  font-size: 13px;
  color: #333;
  font-weight: 600;
}

.teamwork-icon i {
  font-size: 24px;
  color: #2c3e50;
}

/* Content Styles */
.content {
  padding: 20px;
}

/* Search and Filter Box */
.search-filter-box,
.data-list-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-box i {
  margin-right: 5px;
  color: #333;
}

.search-box input[type="text"] {
  border: none;
  padding: 5px 10px;
  width: 800px;
}

.btn-primary {
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

/* Data List Box */
.data-list-box {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 5px;
}

.data-list-title {
  display: flex;
  align-items: center;
  padding-left: 5px;
}

.data-list-title .fa-list {
  margin-right: 12px;
}

.btn-secondary {
  padding: 5px 10px;
  background-color: #FF6200;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 15px;

}

/* Separator Style */
.separator {
  height: 1px;
  background-color: #ccc;
  margin-top: 10px;
  /* Spacing above the separator */
  margin-bottom: 10px;
  /* Spacing below the separator */
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  /* Spacing above the table */
}

table,
th,
td {
  text-align: center;
}

th {
  padding: 20px;
  background-color: #f5f7fa;
  padding: 10px;
}

td {
  padding: 20px;
}

/* th {
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  width: 200px;
}

td {
  padding: 20px;
  text-align: center;
} */

/* tr:nth-child(even) {
    background-color: #f2f2f2;
} */

/* Button Styles */
.button-container {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.button-container .assign_menu {
  /* padding: 5px 10px; */
  padding: 3% 5%;
  color: #409EFF;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
}

.button-container .assign_resource {
  /* padding: 5px 10px; */
  padding: 3% 5%;
  color: #409EFF;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
}

.button-container .edit_button {
  /* padding: 5px 10px; */
  padding: 3% 5%;
  color: gray;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
}

.button-container .delete_button {
  /* padding: 5px 10px; */
  padding: 3% 5%;
  color: #cd320f;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
}

/* Responsive Design Adjustments */
@media (max-width: 768px) {

  .sidebar,
  .top-bar,
  .content {
    width: 100%;
    position: relative;
  }

  .sidebar {
    height: auto;
  }

  .top-bar {
    margin-left: 0;
  }

  .content {
    margin-left: 0;
  }

  .search-filter-box,
  .data-list-box {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    margin-top: 10px;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

/* FontAwesome Icon Adjustment */
[class^="fas"],
[class*=" fas"] {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

/* IOS */
.ios-switch {
  position: relative;
  appearance: none;
  cursor: pointer;
  transition: all 100ms;
  border-radius: 31px;
  width: 60px;
  height: 24px;
  background-color: #e9e9eb;
}

.ios-switch {
  &::before {
    position: absolute;
    content: "";
    transition: all 300ms cubic-bezier(.45, 1, .4, 1);
    border-radius: 31px;
    width: 60px;
    height: 24px;
    background-color: #e9e9eb;
  }
}

.ios-switch {
  &::after {
    position: absolute;
    left: 3px;
    top: 3px;
    border-radius: 27px;
    width: 18px;
    height: 18px;
    background-color: #fff;
    box-shadow: 1px 1px 5px rgba(#000, .3);
    content: "";
    transition: all 300ms cubic-bezier(.4, .4, .25, 1.35);
  }
}

.ios-switch {
  &:checked {
    background-color: #ff6200;

    &::before {
      transform: scale(0);
    }

    &::after {
      transform: translateX(36px);
    }
  }
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  height: 450px;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 20;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.modal-content {
  padding: 20px;
}

.add_title {
  line-height: 20px;
  font-size: 18px;
  color: #303133;
}

.rolename {
  padding-top: 50px;
  width: 750px;
  margin-left: 55px;
  display: inline-block;
}

.rolenameinput {
  margin-left: 10px;
  height: 35px;
  width: 250px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
  padding-left: 2px;
}

.rolenameinput:focus {
  border-color: #FF6200;
  outline: none;
}

.role_describtion {
  padding-top: 20px;
  padding-left: 87px;
  display: flex;
  align-items: flex-start;
}

.describtioninput {
  margin-left: 10px;
  height: 125px;
  width: 250px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
  padding-left: 2px;
  padding-top: 3px;
  display: block;
  resize: vertical;
}

.describtioninput:focus {
  border-color: #FF6200;
  outline: none;
}

.choosestatus {
  padding-top: 20px;
  padding-left: 55px;
  display: flex;
  align-items: flex-start;
}

input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* 其他浏览器的兼容性样式 */
  vertical-align: middle;
  padding-left: 15px;
}

input[type="radio"]::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #24222221;
  /* 设置边框样式 */
  margin-right: 8px;
  margin-top: 4px;
  cursor: pointer;
}

/* 当单选按钮被选中时的样式 */
input[type="radio"]:checked::before {
  background-color: #FF6200;
  /* 选中时的背景颜色 */
  border-color: transparent;
  /* 设置边框颜色为透明 */
}

/* 当单选按钮被禁用时的样式 */
input[type="radio"]:disabled::before {
  background-color: #ccc;
  /* 设置禁用时的背景颜色 */
}

/* 在单选按钮选中时同时修改相邻文本的颜色 */
input[type="radio"]:checked+label {
  color: #FF6200;
  /* 选中时的文字颜色 */
}

label[for="yes"] {
  cursor: pointer;
}

label[for="no"] {
  cursor: pointer;
}

.confirmbutton {
  margin-left: 620px;
  margin-top: 60px;
}

.confirm {
  width: 60px;
  height: 32px;
  background-color: #FF6200;
  color: white;
  border: 2px solid #FF6200;
  border-radius: 4px;
  cursor: pointer;
}

.confirmEdit {
  width: 60px;
  height: 32px;
  background-color: #FF6200;
  color: white;
  border: 2px solid #FF6200;
  border-radius: 4px;
  cursor: pointer;
}

.confirmbuttonEdit {
  margin-left: 620px;
  margin-top: 100px;
}

/* 弹窗淡入淡出动画 */
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
