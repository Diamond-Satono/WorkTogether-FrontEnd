<template>
  <div class="container">
    <!-- 标签页部分 -->
    <div class="tabs">
      <div
        class="tab"
        :class="{ activeTab: activeTab === 'Latest' }"
        @click="() => { activeTab = 'Latest'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
        最新
        <span class="NumTips" v-if="unreadCount > 0">{{unreadCount}}</span>
      </div>
      <div
        class="tab"
        :class="{ activeTab: activeTab === 'pendingdeal' }"
        @click="() => { activeTab = 'pendingdeal'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
        待处理
        <span class="NumTips" v-if="handleLaterCount > 0">{{handleLaterCount}}</span>
      </div>
      <div>
        <img
          src="@/assets/notice/allread.png"
          style="cursor: pointer;"
          @click="toAllRead"
        />
      </div>
      <div>
        <img
          src="@/assets/deptimgs/closeModal.png"
          class="closeModal"
          @click="$emit('close-modal')"
        />
      </div>
    </div>
    <div v-if="activeTab === 'Latest'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn" @click="handleNotice(notice)">
        <!-- <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="max-width: 13%; height: auto;"> -->
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
    </div>
    <div v-if="activeTab === 'pendingdeal'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn" @click="handleNotice(notice)">
        <!-- <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="max-width: 13%; height: auto;"> -->
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
    </div>
    <div class="up-down">
      <div>
        <img
          src="@/assets/notice/bg-up.png" v-if="currentPage !== 1" @click="upData" style="cursor: pointer;margin-right: 10px;"
        />
        <img
          src="@/assets/notice/bg-down.png" v-if="hasMore" @click="dowmData" style="cursor: pointer;"
        />        
      </div>
    </div>
    <div class="show">
      <div class="unread">
        <img
          src="@/assets/notice/unshowNonread.png" v-if="!showUnread" @click="toggleUnread"
        />
        <img
          src="@/assets/notice/showNonread.png" v-else @click="toggleUnread"
        />
        &nbsp;&nbsp;
        只显示未读
      </div>
      <div class="noticeCenter" @click="confirmGoToNoticeCenter">
        <img
          src="@/assets/notice/noticeCenter.png"          
        />
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
function confirmGoToNoticeCenter() {
  if (confirm("是否前往通知中心？")) {
      window.location.href = "/notice";
  }
}
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
// 计算属性，统计待处理消息的数量
const handleLaterCount = computed(() => {
  return allNoticeList.value.filter(notice => notice.handleLater).length;
});
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
    const url = ref();
    if(activeTab.value === 'Latest') {
      url.value = `http://localhost:8080/api/message/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    } else {
      url.value = `http://localhost:8080/api/message/handleLater/${groupId.value}?page=${currentPage.value}&size=${pageSize.value}`;
    }
    const response = await fetch(
      url.value,
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
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === allNoticeList.value.length) {
        hasMore.value = false;
      }
    } else {
      if (data.data.length < pageSize.value || currentPage.value * pageSize.value === handleLaterCount.value) {
        hasMore.value = false;
      }
    }    

    // noticeList.value = [...noticeList.value, ...data.data];
    noticeList.value = data.data;
    //currentPage.value++; // 增加页码
    if(activeTab.value === 'Latest')
      console.log("LatestnoticeList.value=", noticeList.value);
    else
    console.log("LaternoticeList.value=", noticeList.value);
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
  if(showUnread.value === true)
    fetchUnReadNoticeData();
  else
    fetchNoticeData();
}
//上一页
function upData() {
  if(currentPage.value > 1) {
    currentPage.value--;
    hasMore.value = true;
    if(showUnread.value === true)
      fetchUnReadNoticeData();
    else
      fetchNoticeData();
  }
}

//显示未读
const showUnread = ref(false);
function toggleUnread() {
  showUnread.value = !showUnread.value;
  currentPage.value = 1;
  pageSize.value = 5;
  hasMore.value = true;
  if(showUnread.value === true)
    fetchUnReadNoticeData();
  else
    fetchNoticeData();
}
//获取未读消息列表
async function fetchUnReadNoticeData() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    // 根据 activeTab 的值构建查询参数
    let queryParams = `page=${currentPage.value}&size=${pageSize.value}`;
    if (activeTab.value === 'Latest') {
      queryParams += `&isRead=false`;
    } else if (activeTab.value === 'pendingdeal') {
      queryParams += `&isRead=false&handleLater=true`;
    }
    console.log("queryParams=" + queryParams);
    
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
    if (data.data.length < pageSize.value || currentPage.value * pageSize.value === unreadCount.value) {
      hasMore.value = false;
    }

    // noticeList.value = [...noticeList.value, ...data.data];
    noticeList.value = data.data;
    //currentPage.value++; // 增加页码
    console.log("UnreadnoticeList.value=", noticeList.value);
    console.log(currentPage.value);
        
  } catch (error) {
    console.error('Error fetching UnreadnoticeList data:', error);
  } finally {
    isLoading.value = false;
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
  //   name: 'noticeDetail',
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
      hasMore.value = true;
      fetchAllNoticeData();
      if(showUnread.value === true)
        fetchUnReadNoticeData();
      else
        fetchNoticeData();
  })
  .catch(error => {
      console.error('Error upate isRead', error);
      // Handle the error, e.g., show a message to the user
  });
}
//未读消息id数组
const unReadIds = ref<any>([]);
// 将所有未读消息的id放入unReadIds数组
function updateUnReadIds() {
  // 使用 filter 筛选出所有未读消息，然后使用 map 提取它们的 id
  unReadIds.value = allNoticeList.value.filter(notice => !notice.isRead).map(notice => notice.id);
  console.log("unReadIds=", unReadIds.value);  
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
      alert("全部已读成功")
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
  justify-content: space-around;
  border-bottom: 1px solid #bbbbbb;
  margin-top: 10%;
  margin-left: 5%;
  margin-right: 5%;
  font-size: 21px;
  font-family: "SiYuanHeiTi";
}

.tab {
  cursor: pointer;
  padding: 0px 15px;
  color: #666666;
}

.activeTab {
  color: #1684FC;
  border-bottom: 1px solid #1684FC;
}
.NumTips {
  font-size: 16px;
  border-radius: 50%;
  background-color: #DD1D1D;
  color: #FFFFFF;
  padding: 3px 8px; /* 调整内边距以确保圆形外观 */
}
.closeModal {
  width: 30px;
  height: 30px;
  cursor: pointer;
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-top: -10%;
  margin-left: 70%;
}
.noticecolumn {
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
  padding: 2%;
  border: 1px solid #bbbbbb;
  border-radius: 10px;
  display: flex;
  align-items: start;
  cursor: pointer;
}
.notice-content {
  color: #060907;
}
.notice-title {
  margin-top: 2%;
  display: flex;
  align-items: center;
}
.notice-time {
  margin-top: 2%;
}
.up-down {
  position: fixed;
  top: 800px;
  width: 23%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.show {
  position: fixed;
  top: 820px;/*按照实际修改*/
  margin-left: 2%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.unread {
  display: flex;
  align-items: center;
  cursor: pointer;
}

</style>