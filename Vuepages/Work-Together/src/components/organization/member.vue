<template>
  <div class="model">
    <div class="model-side">
      <div class="search-bar">
        <div class="input-container">
          <input type="text" placeholder="请输入成员名、邮箱、部门、职位" v-model="searchText">
        </div>
      </div>
      <table>
        <tbody>
          <!-- 在这里添加你的数据行 -->
          <template v-for="(row, index) in filteredTableData" :key="index">
            <tr :class="{ parent: row.isParent }" @click="highlightGroup">
              <!-- 添加父级部门的 class -->
              <td @click="getDeptID(row)">
                <!-- 渲染复选框和展开按钮 -->
                <template v-if="row.isParent">
                  <button class="expand-btnfortop" @click="toggleExpand(row)">
                    <!-- 使用 v-if 控制展开按钮的显示 -->
                    <img v-if="row.expanded" src="@/assets/deptimgs/expandchild.png"
                      style="width: 18px; height: 18px" />
                    <img v-else src="@/assets/deptimgs/foldchild.png" style="width: 18px; height: 18px" />
                  </button>
                </template>
                <span class="checkbox"></span>
                {{ row.name }}
              </td>
            </tr>
            <TransitionGroup name="list">
              <template v-if="row.expanded">
                <!-- 递归渲染子部门 -->
                <tr v-for="(child, childIndex) in row.children" :key="`child-${index}-${childIndex}`" @click="highlightGroup">
                  <td @click="getDeptID(child)">
                    <!-- 判断是否显示展开按钮和复选框 -->
                    <template v-if="child.haschildren">
                      <button class="expand-btn" @click="toggleExpandchild(row)">
                        <img v-if="row.expandchild" src="@/assets/deptimgs/expandchild.png"
                          style="width: 18px; height: 18px" />
                        <img v-else src="@/assets/deptimgs/foldchild.png" style="width: 18px; height: 18px" />
                      </button>
                    </template><span class="checkbox2"></span>{{ child.name }}
                  </td>
                </tr>
                <!-- 递归渲染子部门的子部门 -->
                <template v-if="row.expandchild">
                  <template v-if="row.grandchildren">
                    <tr v-for="(grandchild, grandchildIndex) in row.grandchildren"
                      :key="`grandchild-${grandchild.id}`" @click="highlightGroup">
                      <td @click="getDeptID(grandchild)">
                        <span class="checkbox3"></span> {{ grandchild.name }}
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </TransitionGroup>
          </template>
          
        </tbody>
      </table>
    </div>
    <div class="model-content">
      <div class="top-content">
        <div class="dept_title">
          v {{ departmentCurrentName }}
          <span style="color: #8E8E93;">({{ departmentCurrentMember_num }}人)</span>
        </div>
        <div class="topbar-right">
            <img src="@/assets/img/batch-export.png" alt="Icon"><button class="bnt1"> 批量导出</button>
            <img src="@/assets/img/delsymbol.png" alt="Icon"><button class="bnt2" @click="showBatchDepart"> 批量离职</button>
            <button class="invite-btn" @click="showAddMember">添加成员</button>
        </div>
      </div>
      <table>
          <!-- Table structure and data -->
          <thead>
          <tr>
              <!-- <th></th> -->
              <th>成员</th>
              <th>邮箱</th>
              <th>部门</th>
              <th>职位</th>
              <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- Sample row -->
          <tr v-for="user in filteredUsers" :key="user.id">
              <!-- <td><input type="checkbox" :value="user.id" @click="toggleSelectUser(user.id)" class="row-selector"></td> -->
              <td class="memName">
                <input type="checkbox" :value="user.id" @click="toggleSelectUser(user.id)" class="row-selector">
                <!-- <img src="@/assets/img/icon.png" alt=""> -->
                {{ user.name }}
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.deptName }}</td>
              <td>{{ user.position }}</td>
              <td>
                  <button class="detail_button" @click="showMemberDetail(user)">详情</button>
                  <img
                    src="@/assets/deptimgs/options.png"
                    class="optionsimg"
                    @click.stop="updatePopupPosition(user, $event)"
                  />
              </td>
          </tr>
          </tbody>
      </table>
    </div>
  </div>
  <!-- 动态加载组件 -->
  <Transition name="transitionName" mode="out-in">
    <component
      :is="currentModal"
      v-if="currentModal"
      @close-modal="closeModal"
      :batchIds="batchIds"
      :user="currentRowData"
      :departmentNames="departmentNames"
      :departmentIds="departmentIds"
      :deptId="deptId"
    ></component>
  </Transition>
  <!-- 操作选项弹窗 -->
  <Transition :name="transitionName" mode="out-in">
    <div
      class="popup"
      :style="{
        top: popupPosition.top + 'px',
        left: popupPosition.left + 'px',
      }"
      v-if="showPopup"
    >
      <button class="assigndept" @click="showAssignDept">变更部门</button>
      <button class="deletemember" @click="showDeleteMember(currentRowData)">
        操作离职
      </button>
    </div>
  </Transition>
</template>
  
<script setup lang="ts">
import { onMounted, ref, Transition, onUnmounted, computed } from 'vue'
import {Authorization} from "@/store/token"
import { UserInfo } from "@/store/userinfo";
const userInfo = UserInfo();
const tokens = Authorization();
const currentModal = ref("");
const transitionName = ref("fade");
const searchText = ref("");
const batchIds = ref([]);//选中的成员id
const departments = ref(
  {
    name: "深大计软学院",
    manager_id: 1,
    member_num: 53,
    describe: "non"
  });
  interface Department {
  id: number;
  parentid: number;
  name: string;
  number: number;
  manager: string;
  tasks: number;
  isParent: boolean;
  children: Department[];
  expanded: boolean;
  expandchild: boolean;
  grandchildren: Department[];
  haschildren: boolean;
  checked: boolean;
}


const tableData = ref<Department[]>([
  {
    id: 1,
    parentid: 1,
    name: "深圳大学一级分部",
    number: 10,
    manager: "张三",
    tasks: 5,
    checked: false,
    expandchild: false,
    isParent: true, // 标记为父级部门
    children: [
      // 子部门数据
      {
        id: 1,
        parentid: 1,
        name: "深圳大学一级分部子部门1",
        number: 5,
        manager: "李四",
        tasks: 2,
        isParent: false,
        children: [],
        expanded: false,
        grandchildren: [],
        expandchild: false,
        haschildren: false,
        checked: false,
      },
      {
        id: 1,
        parentid: 1,
        name: "深圳大学一级分部子部门2",
        number: 8,
        manager: "王五",
        tasks: 3,
        isParent: false,
        children: [],
        expanded: false,
        checked: false,
        expandchild: false,
        grandchildren: [],

        haschildren: false
      },
    ],
    grandchildren: [],
    expanded: true,
    haschildren: false,
  },
  {
    id: 1,
    parentid: 1,
    name: "深圳大学二级分部",
    number: 15,
    manager: "李四",
    tasks: 8,
    isParent: true,
    checked: false,
    children: [],
    expanded: false,
    expandchild: false,
    grandchildren: [],
    haschildren: false
  },
  {
    id: 1,
    parentid: 1,
    name: "深圳大学三级分部",
    number: 12,
    manager: "王五",
    checked: false,
    tasks: 7,
    isParent: true,
    children: [],
    expanded: false,
    expandchild: false,
    haschildren: false,
    grandchildren: []
  },
  {
    id: 1,
    parentid: 1,
    name: "深圳大学四级分部",
    number: 20,
    manager: "小明",
    checked: false,
    tasks: 6,
    isParent: true,
    children: [],
    expanded: false,
    expandchild: false,
    haschildren: false,
    grandchildren: []
  },
]);

const users = ref([
  {
    id: 1,
    name: '张三',
    status: '正常',
    position: '前端工程师',
    email: 'zhangsan@example.com',
    deptName: '技术部'
  },
  {
    id: 2,
    name: '李四',
    status: '正常',
    position: '后端工程师',
    email: 'lisi@example.com',
    deptName: '技术部'
  },
  // ... more users
]);
// 根据搜索关键词过滤用户列表
const filteredUsers = computed(() => {
  const search = searchText.value.trim().toLowerCase();
  if (!search) return users.value;
  return users.value.filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.deptName.toLowerCase().includes(search) ||
    user.position.toLowerCase().includes(search)
  );
});
// 获取所有部门名字，包括子部门和孙子部门
const departmentNames = computed(() => {
  return tableData.value.flatMap((row) => {
    // 首先添加当前部门的名字
    let names = [row.name];

    // 添加子部门的名字
    if (row.children) {
      names = names.concat(row.children.map((child) => child.name));

      // 添加孙子部门的名字
      if (row.grandchildren) {
        names = names.concat(row.grandchildren.map((grandchild) => grandchild.name));
      }
    }

    return names;
  });
});
//获取所有部门id
const departmentIds = computed(() => {
  return tableData.value.flatMap((row) => {
    // 首先添加当前部门的名字
    let names = [row.id];

    // 添加子部门的名字
    if (row.children) {
      names = names.concat(row.children.map((child) => child.id));

      // 添加孙子部门的名字
      if (row.grandchildren) {
        names = names.concat(row.grandchildren.map((grandchild) => grandchild.id));
      }
    }

    return names;
  });
});
const currentRowData = ref("");
//多选功能
// 选中或取消选中单个用户
function toggleSelectUser(userId: number) {
  if (batchIds.value.includes(userId)) {
    // 如果batchIds中已存在该id，则移除
    const index = batchIds.value.indexOf(userId);
    if (index >= 0) {
      batchIds.value.splice(index, 1);
    }
  } else {
    // 否则，添加该id到batchIds中
    batchIds.value.push(userId);
  }
}
// 选中或取消选中所有用户
// function toggleSelectAll() {
//   const selectedAll = batchIds.value.length === users.value.length;
//   if (selectedAll) {
//     // 如果所有都已选中，则取消全选
//     batchIds.value = [];
//   } else {
//     // 否则，全选
//     batchIds.value = users.value.map(user => user.id);
//   }
// }
// 显示批量离职对话框
function showBatchDepart() {
  currentModal.value = "BatchDepart";
  console.log("currentModal=", currentModal.value);
}
// 显示添加成员对话框
function showAddMember() {
  currentModal.value = "AddMember";
  console.log("currentModal=", currentModal.value);
}
// 显示详情
function showMemberDetail(user: any) {
  transitionName.value = "slide-fade"; // 设置 transitionName 的值为 "slide-fade"
  currentModal.value = "MemberDetail";
  console.log("currentModal=", currentModal.value);
  currentRowData.value = user;
  console.log("详情", user);
}
//显示变更部门
function showAssignDept() {
  currentModal.value = "AssignDept";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}
//显示操作离职
function showDeleteMember(currentRowData: any) {
  currentModal.value = "DeleteMember";
  console.log("currentModal=", currentModal.value);
  hidePopup();
}
// 关闭对话框
function closeModal() {
  if (currentModal.value === "DeptDetail") {
    // 如果当前模态框为 DeptDetail，则不改变 transitionName 的值，继续使用 slide-fade 过渡效果
    currentModal.value = "";
    console.log("ModalClosed");

    // 延迟更改 transitionName 的值
    setTimeout(() => {
      transitionName.value = "fade";
    }, 500); // 在动画完成后 500 毫秒后更改 transitionName 的值
  } else {
    // 否则，将 transitionName 的值设置为 "fade"，使用默认的 fade 过渡效果
    transitionName.value = "fade";
    currentModal.value = "";
    console.log("ModalClosed");
  }
}
// 控制操作选项弹窗
const showPopup = ref(false);
const popupPosition = ref({ top: 0, left: 0 });

function updatePopupPosition(user: any, event: MouseEvent) {
  showPopup.value = !showPopup.value; // 点击时切换弹窗的显示状态
  const rect = (event.target as HTMLElement).getBoundingClientRect(); // 获取元素的位置信息
  popupPosition.value = {
    top: rect.bottom + 20, // 设置弹窗的垂直位置
    left: rect.left - 170, // 设置弹窗的水平位置
  };
  currentRowData.value = user; // 保存行数据
  console.log("currentRowData.value=", currentRowData.value);
}
// 在 setup 中添加函数用于处理点击弹窗以外的区域
function handleClickOutside(event: MouseEvent) {
  const popup = document.querySelector(".popup"); // 获取弹窗元素
  if (!popup) return; // 如果弹窗不存在，直接返回

  // 判断点击事件的目标元素是否在弹窗内部，如果不在则关闭弹窗
  if (!(event.target as HTMLElement).closest(".popup")) {
    hidePopup(); // 调用关闭弹窗的函数
  }
}

// 组件初始化时，绑定 document 的点击事件处理函数
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// 组件销毁时，移除 document 的点击事件处理函数，以防止内存泄漏
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
//隐藏操作选项
function hidePopup() {
  showPopup.value = false;
}
const highlightedGroup = ref(null);
const highlightGroup = (event: MouseEvent) => {
  // 移除之前的高亮
  if (highlightedGroup.value) {
    highlightedGroup.value.classList.remove('highlighted');
  }
  // 添加高亮到当前点击的元素
  const target = event.target as HTMLElement;
  target.classList.add('highlighted');
  highlightedGroup.value = target;
}
const companyId = userInfo.value.companyId; // 根据实际情况替换
const companyIdString = companyId.toString();
const departmentCurrentName = ref("深圳大学");
const departmentCurrentMember_num = ref("100");
//获取点击的部门id
const deptId = ref(0);
function getDeptID(row: any){
  deptId.value = row.id;
  console.log("deptId=", deptId.value);
  console.log(row.id);
  departmentCurrentName.value = row.name;
  departmentCurrentMember_num.value = row.number;
  fetchUserData()
}
//获取部门数据
onMounted(() => {
  console.log(tokens.value);
  fetchdepartment();
});

async function fetchdepartment() {
  const companyId = userInfo.value.companyId; // 根据实际情况替换
  const companyIdString = companyId.toString();
  // 从接口获取部门数据并更新表格
  const response = await fetch(
    `http://localhost:8080/api/dept/selectHighestDepts?companyId=${companyId}`,
    {
      method: "GET",
      headers: {
        Authorization: tokens.value,
        companyId: companyIdString,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  // 初始化表格数据
  tableData.value = [];

  // 遍历每个上级部门，获取其子部门数据
  for (let department of data.data) {
    // 提取上级部门数据中的所需字段，组织成适合在表格中渲染的格式
    const parentFormattedData = {
      id: department.id,
      parentid: department.parentId,
      name: department.name,
      number: department.num,
      manager: department.managerName,
      tasks: department.job,
      isParent: true,
      children: [], // 初始化子部门数组
      expanded: true,
      grandchildren: [],
      haschildren: false,
      expandchild: true,
    };

    // 将上级部门数据添加到表格数据中
    tableData.value.push(parentFormattedData);

    // 递归获取子部门数据
    await fetchChildDepartments(department.id, parentFormattedData);
  }
}

// 递归获取子部门数据
async function fetchChildDepartments(
  parentId: number,
  parentDepartment: Department
) {
  const companyId = userInfo.value.companyId; // 根据实际情况替换
  const companyIdString = companyId.toString();

  const childResponse = await fetch(
    `http://localhost:8080/api/dept/selectDeptsByParentId?parentDeptId=${parentId}`,
    {
      method: "GET",
      headers: {
        Authorization: tokens.value,
        companyId: companyIdString,
      },
    }
  );

  if (!childResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const childData = await childResponse.json();
  // console.log(childData.data);

  // 提取子部门数据中的所需字段，组织成适合在表格中渲染的格式
  const childFormattedData = childData.data.map((childDepartment: any) => ({
    id: childDepartment.id,
    parentid: childDepartment.parentId,
    name: childDepartment.name,
    number: childDepartment.num,
    manager: childDepartment.managerName,
    tasks: childDepartment.job,
    isParent: false, // 标记为子部门
    children: [], // 初始化子部门数组
    expanded: false, // 默认为收起状态
    grandchildren: [],
    expandchild: false,
    haschildren: false
  }));

  // 在childFormattedData中的每个子部门对象的children数组中添加默认属性haschildren
  childFormattedData.forEach((child: any) => {
    child.children.forEach((subchild: any) => {
      subchild.haschildren = false; // 默认值为false
    });
  });

  // 将子部门数据添加到对应的上级部门的 children 数组中
  parentDepartment.children.push(...childFormattedData);

  // 递归处理子部门的子部门
  for (let child of parentDepartment.children) {
    await fetchChildDepartments(child.id, child);
  }

  // 判断当前部门是否有子部门，并且子部门中是否有子部门，如果有则将其添加到 grandChildren 数组中
  if (parentDepartment.children.some((child) => child.children && child.children.length > 0)) {
    parentDepartment.grandchildren.push(...parentDepartment.children.flatMap((child: Department) => child.children));
    console.log(parentDepartment.grandchildren);
  }

  // 遍历childFormattedData，设置haschildren属性
  childFormattedData.forEach((child: any) => {
    child.children.forEach((subchild: any) => {
      // 检查子部门对象的parentid是否等于其上级部门的id
      if (subchild.parentid === child.id) {
        child.haschildren = true; // 设置haschildren为true
      }
    });
    console.log(child.haschildren);

  });

}


// 展开/收起子部门
function toggleExpand(row: any) {
  row.expanded = !row.expanded;
}
function toggleExpandchild(row: any) {
  row.expandchild = !row.expandchild;
}
//搜索功能
const searchKeyword = ref(""); // 用于存储搜索关键字
// 使用计算属性过滤表格数据以匹配搜索关键字
const filteredTableData = computed(() => {
  // 如果搜索关键字为空，则返回原始表格数据
  if (!searchKeyword.value.trim()) {
    return tableData.value;
  }

  // 否则，使用搜索关键字过滤表格数据
  return filterDepartments(tableData.value);
});

// 递归过滤部门数据，包括子部门和孙子部门
function filterDepartments(departments: any) {
  return departments.reduce((filtered: any, department: any) => {
    if (department.name.includes(searchKeyword.value.trim())) {
      // 如果当前部门名称匹配搜索关键字，则将其添加到过滤后的数组中
      filtered.push(department);
    } else if (department.children && department.children.length > 0) {
      // 递归过滤子部门，并保留原始的部门结构和样式
      const filteredChildren = filterDepartments(department.children);
      if (filteredChildren.length > 0) {
        const parentClone = { ...department }; // 克隆父部门对象
        parentClone.children = filteredChildren; // 用过滤后的子部门替换原始的子部门
        filtered.push(parentClone); // 将父部门及其过滤后的子部门添加到过滤后的数组中
      }
    }
    return filtered;
  }, []);
}
//拉取成员列表
function fetchUserData() {
  fetch(`http://localhost:8080/api/dept/member/${deptId.value}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
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
        // 请求成功，更新用户数据
        users.value = data.data;
        console.log(tokens.value);
        
        console.log("users.value=", users.value);
                            
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle the error, e.g., show a message to the user
    });
}
onMounted (() => {
  fetchUserData();  
});
</script>

<style scoped>
/* 样式可以根据需要进行修改 */
.model{
  width:100%;
  height: 100%;
  display: flex;
}
.model-side{
  width: 20%;
  height: 100%;
  border-right: 1px solid #BBBBBB;
}
.model-content{
  width: 80%;
  height: 100%;
}
/* 搜索框 */
.search-bar{
  margin-top: 10%;
  margin-bottom: 10px;
}
.input-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}.input-container input {
  border-radius: 5px;
  width: 80%;
  height: 30px;
  font-size: 13px;
  border: 1px solid #BBBBBB;
  padding: 0 2%;
}
.input-container input:focus {
  outline: none;
}
/* 分级部门 */

/* 列表顶部栏 */
.top-content{
  display: flex;
  justify-content: space-between;
  margin-top: 2%;
  margin-bottom: 10px;
}
.dept_title{
  font-size: 20px;
  margin: 10px 20px;
}
.topbar-right {
  display: flex;
  align-items: center;
  margin-right: 2%;
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
/* 弹窗滑入效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* Table Styles */

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
  width: 80px;
}
td {
  padding: 20px;
  text-align: center;
}
/* .memName {
  justify-content: space-between;
} */

/* 复选框样式 */
input[type=checkbox] {
  cursor: pointer;
  position: relative;
}

input[type=checkbox]::after {
  position: absolute;
  top: 0;
  background-color: #fff;
  color: #fff;
  width: 14px;
  height: 14px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 2px;
  box-sizing: border-box;
  border: 1px solid #ddd;
}

input[type=checkbox]:checked::after {
  content: "";
  background-color: #FF6200;
  border-color: #FF6200;
  background-color: #FF6200;
}

input[type=checkbox]:checked::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  z-index: 1;
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
.detail_button {
  background-color: white;
  border: none;
  color: #ff6200;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10%;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
}
.optionsimg {
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-left: 12%;
  margin-top: -2%;
  cursor: pointer;
}
.popup {
  width: 170px;
  height: 126px;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
}
.assigndept,
.deletemember {
  margin-left: 8%;
  margin-top: auto;
  margin-bottom: auto;
  width: max-content;
  background-color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10%;
  outline: none; /* 去掉点击时的外边框 */
  box-shadow: none; /* 去掉点击时的阴影效果 */
  text-align: center;
  font-family: "SiYuanHeiTi";
}
/* 部门样式 */
tbody td:first-child {
  /* padding: 0%; */
  vertical-align: center;
  text-align: left;
  /* 将文本左对齐 */
  padding-left: 3%;
}

.expand-btnfortop {
  background-color: white;
  border: none;
  cursor: pointer;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-bottom: 2.8%;
  margin-right: 3%;
}

.expand-btn {
  background-color: white;
  border: none;
  cursor: pointer;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-bottom: 2.8%;
  margin-right: -15%;
  margin-left: 8%;
}
.checkbox {
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 2%;
}

.checkbox2 {
  margin-left: 20%;
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 4%;
}

.checkbox3 {
  vertical-align: middle;
  margin-bottom: 2.5%;
  margin-right: 2%;
  margin-left: 30%;
}

/* 子部门折叠/展开动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,.list-leave-to
{
  opacity: 0;
  transform: translateY(-40%);
}
.highlighted {
  color: #FF6200;
}
</style>