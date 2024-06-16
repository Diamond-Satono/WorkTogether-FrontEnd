<template>
  <div class="container">
    <!-- 标签页部分 -->
    <div class="tabs">
      <div class="showtab">
        <div
          class="tab"
          :class="{ activeTab: activeTab === 'Latest' }"
          @click="() => { activeTab = 'Latest'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          最新
          <!-- <span class="NumTips">{{unreadCount}}</span> -->
        </div>
        <div
          class="tab"
          :class="{ activeTab: activeTab === 'unReadTab' }"
          @click="() => { activeTab = 'unReadTab'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          未读
          <!-- <span class="NumTips">{{handleLaterCount}}</span> -->
        </div>
        <div
          class="tab"
          :class="{ activeTab: activeTab === 'ReadTab' }"
          @click="() => { activeTab = 'ReadTab'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          已读
          <!-- <span class="NumTips">{{unreadCount}}</span> -->
        </div>
        <div
          class="tab"
          :class="{ activeTab: activeTab === 'pendingdeal' }"
          @click="() => { activeTab = 'pendingdeal'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          待处理
          <!-- <span class="NumTips">{{handleLaterCount}}</span> -->
        </div>
      </div>
      <div class="Allbtn">
        <button class="AlltoRead" @click="toAllRead">
          <img
            src="@/assets/notice/allread.png"            
          />全部已读
        </button>
        <button class="AlltoLater" @click="toAllLater">
          <img
            src="@/assets/notice/allPendingdeal.png"
          />全部待处理
        </button>
      </div>
    </div>
    <!-- 最新 -->
    <div v-if="activeTab === 'Latest'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody" @click="handleNotice(notice)">
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">&nbsp;{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === true" class="dealbnt" @click="Individualdeal(notice)">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === false" class="dealbnt" @click="Individualdeal(notice)">
        </div>
      </div>
    </div>
    <!-- 未读 -->
    <div v-if="activeTab === 'unReadTab'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody" @click="handleNotice(notice)">
          <!-- <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="max-width: 6%; max-height: 5%;"> -->
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">&nbsp;{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === true" class="dealbnt" @click="Individualdeal(notice)">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === false" class="dealbnt" @click="Individualdeal(notice)">
        </div>
      </div>
    </div>
    <!-- 已读 -->
    <div v-if="activeTab === 'ReadTab'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody"@click="handleNotice(notice)">
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">&nbsp;{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === true" class="dealbnt" @click="Individualdeal(notice)">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === false" class="dealbnt" @click="Individualdeal(notice)">
        </div>
      </div>
    </div>
    <!-- 待处理 -->
    <div v-if="activeTab === 'pendingdeal'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody" @click="handleNotice(notice)">
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">&nbsp;{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === true" class="dealbnt" @click="Individualdeal(notice)">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === false" class="dealbnt" @click="Individualdeal(notice)">
        </div>
      </div>
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
  <component :is="currentModal" v-if="currentModal" @close-modal="closeModal"
    :scheduleId="scheduleId">
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {Authorization} from "@/store/token";
import { UserInfo } from "@/store/userinfo";
const token = Authorization();
const userInfo = UserInfo();
// 初始化默认标签页为“最新”
const activeTab = ref('Latest');
const noticeList = ref([
  {
    id: 1797532960078528514,
    userId: 1,
    user: {
      id: 1,
      email: "2484101884@qq.com",
      name: "测试账号",
      phone: "12345678910",
      sex: 3,
      avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
      lastLoginTime: "2024-06-03 06:26:16",
      createTime: "2024-05-08 11:02:55"
    },
    context: "删除了日程",
    type: 0,
    isRead: false,
    handleLater: false,
    scheduleId: 1797479941844586497,
    scheduleTitle: "测试修改日程消息",
    scheduleType: 1,
    createTime: "2024-05-08 11:02:55",
  }
]);
//所有消息列表
const allNoticeList = ref([
{
    id: 1797532960078528514,
    userId: 1,
    user: {
      id: 1,
      email: "2484101884@qq.com",
      name: "测试账号",
      phone: "12345678910",
      sex: 3,
      avatar: "https://q8.itc.cn/q_70/images03/20240517/71b47444c2aa467eb464c633b088bc87.jpeg",
      lastLoginTime: "2024-06-03 06:26:16",
      createTime: "2024-05-08 11:02:55"
    },
    context: "删除了日程",
    type: 0,
    isRead: false,
    handleLater: false,
    scheduleId: 1797479941844586497,
    scheduleTitle: "测试修改日程消息",
    scheduleType: 1,
    createTime: "2024-05-08 11:02:55",
  }
]);
// 计算属性，统计未读消息的数量
const unreadCount = computed(() => {
  return allNoticeList.value.filter(notice => !notice.isRead).length;
});
// 计算属性，统计已读读消息的数量
const readCount = computed(() => {
  return allNoticeList.value.filter(notice => notice.isRead).length;
});
// 计算属性，统计待处理消息的数量
const handleLaterCount = computed(() => {
  return allNoticeList.value.filter(notice => notice.handleLater).length;
});
//总页数
const totalPage = ref(10);
//获取消息列表
const companyId = userInfo.value.companyId; // 根据实际情况替换
const companyIdString = companyId.toString();
const groupId = ref(userInfo.value.groupId);
//所有消息
function fetchAllNoticeData() {
  fetch(`http://localhost:8080/api/message/${groupId.value}`, {
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
        allNoticeList.value = data.data;
        console.log(token.value);  
        console.log("allNoticeList.value=", allNoticeList.value);
        console.log("allNoticeListsize=", allNoticeList.value.length);
        totalPage.value = Math.ceil(allNoticeList.value.length / pageSize.value);
    })
    .catch(error => {
        console.error('Error fetching allNoticeList data:', error);
        // Handle the error, e.g., show a message to the user
    });
}

// 添加分页状态
const currentPage = ref(1);
const pageSize = ref(5); // 假设每页显示10条数据
const isLoading = ref(false);
const hasMore = ref(true);

//分页消息
async function fetchNoticeData() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    // 根据 activeTab 的值构建查询参数
    let queryParams = `page=${currentPage.value}&size=${pageSize.value}`;
    if (activeTab.value === 'Latest') {
    } else if (activeTab.value === 'unReadTab') {
      queryParams += `&isRead=false`;
    } else if (activeTab.value === 'ReadTab') {
      queryParams += `&isRead=true`;
    } else if (activeTab.value === 'pendingdeal') {
      queryParams += `&handleLater=true`;
    }
    console.log("queryParams=" + queryParams);
    // const url = ref();
    // if(activeTab.value === 'Latest') {
    //   url.value = `http://localhost:8080/api/message/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    // } else if(activeTab.value === 'unReadTab') {
    //   url.value = `http://localhost:8080/api/message/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    // } else if(activeTab.value === 'ReadTab') {
    //   url.value = `http://localhost:8080/api/message/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    // } else {
    //   url.value = `http://localhost:8080/api/message/handleLater/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    // }
    const response = await fetch(
      `http://localhost:8080/api/message/${groupId.value}?${queryParams}`,
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
    if(activeTab.value === 'Latest') {
      totalPage.value = Math.ceil(allNoticeList.value.length / pageSize.value);
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === allNoticeList.value.length) {
        hasMore.value = false;
      }
    } else if (activeTab.value === 'unReadTab') {
      totalPage.value = Math.ceil(unreadCount.value / pageSize.value);
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === unreadCount.value) {
        hasMore.value = false;
      }
    } else if (activeTab.value === 'ReadTab') {
      totalPage.value = Math.ceil(readCount.value / pageSize.value);
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === readCount.value) {
        hasMore.value = false;
      }
    } else {
      totalPage.value = Math.ceil(handleLaterCount.value / pageSize.value);
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === handleLaterCount.value) {
        hasMore.value = false;
      }
    }

    // noticeList.value = [...noticeList.value, ...data.data];
    noticeList.value = data.data;
    //currentPage.value++; // 增加页码
    if(activeTab.value === 'Latest') {
      console.log("LatestnoticeList.value=", noticeList.value);
    } else if (activeTab.value === 'unReadTab') {
      console.log("UnreadnoticeList.value=", noticeList.value);
    } else if (activeTab.value === 'ReadTab') {
      console.log("ReadnoticeList.value=", noticeList.value);
    } else {
      console.log("LaternoticeList.value=", noticeList.value);
    }
    console.log(currentPage.value);
    console.log("num="+currentPage.value * pageSize.value);           
  } catch (error) {
    console.error('Error fetching noticeList data:', error);
  } finally {
    isLoading.value = false;
  }
}
//下一页
function dowmData() {
  currentPage.value++;
  fetchNoticeData();
}
//上一页
function upData() {
  if(currentPage.value > 1) {
    currentPage.value--;
    hasMore.value = true;
    fetchNoticeData();
  }
}
//设置弹窗
const currentModal = ref("");
const scheduleId = ref('')
function showcalendardetails(id :any) {
  scheduleId.value = id;
  currentModal.value = "calendardetails";
  console.log("currentModal=", currentModal.value);
}
//关闭弹窗
function closeModal() {
  currentModal.value = "";
  console.log("ModalClosed");
}
//点击单个
function handleNotice(notice :any) {
    console.log("notice=", notice);
  if(notice.isRead === false) {
    toRead(notice.id);
  }
  showcalendardetails(notice.scheduleId);
  // router.push({
  //   name: 'calendardetails',
  //   params: {
  //     id: notice.id,
  //   },
  // });
}
//单个已读
function toRead(id :any) {
  fetch(`http://localhost:8080/api/message/toIsRead/${id}`, {
    method: 'PUT',
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
          alert("更新单个状态为已读失败")
          throw new Error('Network error');
      }
      // 解析响应为 JSON 格式
      return response.json();
  })
  .then(data => {
      // 请求成功    
      console.log("单个已读=", data);
      fetchAllNoticeData();
      hasMore.value = true;
      fetchNoticeData();
  })
  .catch(error => {
      console.error('Error upate isRead', error);
      // Handle the error, e.g., show a message to the user
  });
}
//单个待处理
function Individualdeal(notice :any) {
  let b = notice.handleLater === false ? '1' : '0'; // 根据notice.handleLater的值确定b的值
  let PathParams = `/${notice.id}/${b}`;
  fetch(`http://localhost:8080/api/message/toLater${PathParams}`, {
    method: 'PUT',
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
          alert("待处理的转换失败")
          throw new Error('Network error');
      }
      // 解析响应为 JSON 格式
      return response.json();
  })
  .then(data => {
      // 请求成功    
      console.log("单个待处理转换=", data);
      fetchAllNoticeData();
      hasMore.value = true;
      fetchNoticeData();
  })
  .catch(error => {
      console.error('Error upate isRead', error);
      // Handle the error, e.g., show a message to the user
  });
}
//未读消息id数组
const unReadIds = ref<any>([]);
//非待处理消息id数组
const notLaterIds = ref<any>([]);
// 将所有未读消息的id放入unReadIds数组
function updateUnReadIds() {
  // 使用 filter 筛选出所有未读消息，然后使用 map 提取它们的 id
  unReadIds.value = allNoticeList.value.filter(notice => !notice.isRead).map(notice => notice.id);
  console.log("unReadIds=", unReadIds.value);  
}
// 将所有非待处理消息的id放入unReadIds数组
function updatenotLaterIds() {
  // 使用 filter 筛选出所有未读消息，然后使用 map 提取它们的 id
  notLaterIds.value = allNoticeList.value.filter(notice => !notice.handleLater).map(notice => notice.id);
  console.log("notLaterIds=", notLaterIds.value);  
}
//全部已读
function toAllRead() {
  if(!confirm("是否设置全部已读？"))
    return;
  // 确保未读消息ID数组是最新的
  updateUnReadIds();
  // 构建请求体
  const body = JSON.stringify({
    idList: unReadIds.value // 使用unReadIds中的ID数组
  });
  fetch(`http://localhost:8080/api/message/toIsRead/ByIds`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
        'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
        'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
    },
    body: body // 添加请求体
  })
  .then(response => {
      console.log(response);
      // 检查响应状态
      if (!response.ok) {
          alert("更新所有状态为已读失败")
          throw new Error('Network error');
      }
      // 解析响应为 JSON 格式
      return response.json();
  })
  .then(data => {
      // 请求成功    
      console.log("全部已读=", data);
      fetchAllNoticeData();
      hasMore.value = true;
      fetchNoticeData();
  })
  .catch(error => {
      console.error('Error upate toAllRead', error);
      // Handle the error, e.g., show a message to the user
  });
}
//全部待处理
function toAllLater() {
  if(!confirm("是否设置全部待处理？"))
    return;
  // 确保非待处理消息ID数组是最新的
  updatenotLaterIds();
  // 构建请求体
  const body = JSON.stringify({
    idList: notLaterIds.value // 使用unReadIds中的ID数组
  });
  fetch(`http://localhost:8080/api/message/toLater/ByIds/1`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
        'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
        'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
    },
    body: body // 添加请求体
  })
  .then(response => {
      console.log(response);
      // 检查响应状态
      if (!response.ok) {
          alert("更新所有状态为待处理失败")
          throw new Error('Network error');
      }
      // 解析响应为 JSON 格式
      return response.json();
  })
  .then(data => {
      // 请求成功    
      console.log("全部待处理=", data);
      fetchAllNoticeData();
      hasMore.value = true;
      fetchNoticeData();
  })
  .catch(error => {
      console.error('Error upate toAllPendingdeal', error);
      // Handle the error, e.g., show a message to the user
  });
}

onMounted(() => {
  fetchAllNoticeData();
  fetchNoticeData();
});

</script>

<style scoped>
/* 样式可以根据需要进行修改 */
/* 标签页样式 */
.tabs {
  display: flex;
  justify-content: space-between;
  margin-top: 1%;
  margin-bottom: 2%;
  margin-left: 3%;
  margin-right: 3%;
  font-size: 21px;
  font-family: "SiYuanHeiTi";
}
.showtab {
  display: flex;
  justify-content: start;
}
.Allbtn {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.AlltoRead {
  margin-right: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(10, 208, 58, 0.1);
  border: 1px solid #0AD03A;
  padding: 5px 10px;
  border-radius: 10px;
  color: #101010;
  width: 152px;
  height: 35px;
  font-size: 15px;
  font-family: '阿里巴巴普体';
  cursor: pointer;
}
.AlltoLater {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152px;
  height: 35px;
  font-size: 15px;
  font-family: '阿里巴巴普体';
  padding: 5px 10px;
  background-color: rgba(221, 29, 29, 0.11);
  color: #101010;
  border: 1px solid #DD1D1D;
  border-radius: 10px;
  cursor: pointer;
}
.tab {
  margin-top: 2%;
  cursor: pointer;
  padding: 7px 80px;
  color: #101010;
}

/* 最后一个标签需要右边框 */
/* .tabs .tab:last-child {
  border-right: 1px solid #5AC8FA;
} */
.activeTab {
  /* color: #FFFFFF;
  background-color: #5AC8FA;; */
  color: #FB682F;
  border-bottom: 3px solid #FB682F;
  /* border-bottom: 1px solid #1684FC; */
}
.noticecolumn {
  margin-top: 0.7%;
  margin-left: 3%;
  margin-right: 3%;
  padding: 1%;
  background-color: rgba(229, 229, 234, 0.35);
  border: none;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.noticebody {
  display: flex;
  /* align-items: center; */
  cursor: pointer;
}
.noticesign {
  display: flex;
  align-items: center;
}
.notice-content {
  color: #060907;
}
.notice-title {
  margin-top: 5px;
  display: flex;
  align-items: center;
}
.notice-time {
  margin-top: 5px;
}
.dealbnt {
  cursor: pointer;
}
.up-down {
  margin-top: 1%;
  /* margin-left: 3%;
  margin-right: 3%; */
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