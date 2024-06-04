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
          :class="{ activeTab: activeTab === 'pendingdeal' }"
          @click="() => { activeTab = 'pendingdeal'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          待处理
          <!-- <span class="NumTips">{{handleLaterCount}}</span> -->
        </div>
        <div
          class="tab"
          :class="{ activeTab: activeTab === 'pendingdeal' }"
          @click="() => { activeTab = 'pendingdeal'; currentPage = 1; pageSize = 5; hasMore = true; fetchNoticeData(); }">
          最新
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
        <button class="AlltoRead">
          <img
            src="@/assets/notice/allread.png"            
          />全部已读
        </button>
        <button class="AlltoLater">
          <img
            src="@/assets/notice/allPendingdeal.png"
          />全部待处理
        </button>
      </div>
    </div>
    <div v-if="activeTab === 'Latest'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody">
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="max-width: 6%; max-height: 5%;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === true">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === false">
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'pendingdeal'" class="tabContent">
      <div v-for="notice in noticeList" :key="notice.id" class="noticecolumn">
        <div class="noticebody">
          <img :src="notice.user.avatar" alt="User Avatar" class="user-avatar" style="max-width: 6%; max-height: 5%;">
          <div>
            <div class="notice-content">
              <span style="color: rgba(16, 16, 16, 0.35);">{{ notice.user.name }}</span>
              {{ notice.context }}
            </div>
            <div class="notice-title"><img src="@/assets/notice/nameIcon.png" alt="">{{ notice.scheduleTitle }}</div>
            <div class="notice-time" style="color: rgba(16, 16, 16, 0.35);">{{ notice.createTime }}</div>
          </div>
        </div>
        <div class="noticesign">
          <img src="@/assets/notice/redcycle.png" alt="" style="margin-right: 20px;" v-if="notice.isRead === false">
          <img src="@/assets/notice/deal.png" alt="" v-if="notice.handleLater === true">
          <img src="@/assets/notice/Pendingdeal.png" alt="" v-if="notice.handleLater === false">
        </div>
      </div>
    </div>
    <div class="up-down">
      <div>
        <img
          src="@/assets/notice/bg-down.png" v-if="hasMore" @click="dowmData" style="cursor: pointer;"
        />
        <img
          src="@/assets/notice/bg-up.png" v-else @click="upData" style="cursor: pointer;"
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
      <div class="noticeCenter">
        <a href="/notice">
          <img
            src="@/assets/notice/noticeCenter.png"          
          />
        </a>
      </div>
    </div>
  </div>
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
    const response = await fetch(
      `http://localhost:8080/api/message/isRead/${groupId.value}/0?page=${currentPage.value}&size=${pageSize.value}`,
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
  border-bottom: 1px solid #bbbbbb;
  margin-top: 1%;
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
  color: #5AC8FA;
  border-top: 1px solid #5AC8FA;
  border-bottom: 1px solid #5AC8FA;
  border-left: 1px solid #5AC8FA;
}

/* 最后一个标签需要右边框 */
.tabs .tab:last-child {
  border-right: 1px solid #5AC8FA;
}
.activeTab {
  color: #FFFFFF;
  background-color: #5AC8FA;;
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
  align-items: center;
}
.noticesign {
  display: flex;
  align-items: center;
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